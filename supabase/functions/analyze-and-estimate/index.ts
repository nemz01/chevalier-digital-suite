import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EstimateRequest {
  leadId: string;
}

interface AIAnalysis {
  roofType: string;
  estimatedArea: number;
  pitch: string;
  condition: string;
  issues: string[];
  estimatedAge: number;
  confidenceScore: number;
  complexity: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId } = await req.json() as EstimateRequest;
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ error: "leadId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      console.error("Lead fetch error:", leadError);
      return new Response(
        JSON.stringify({ error: "Lead not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing lead:", lead.id);

    // STEP 1: Analyze photos with AI (if photos exist)
    let photoAnalysis: AIAnalysis | null = null;
    
    if (lead.photos && lead.photos.length > 0) {
      try {
        photoAnalysis = await analyzeRoofPhotos(lead.photos, lovableApiKey);
        console.log("AI Analysis:", photoAnalysis);
      } catch (aiError) {
        console.error("AI Analysis error:", aiError);
        // Continue with form data if AI fails
      }
    }

    // STEP 2: Calculate estimation based on form data + AI analysis
    const estimate = calculateEstimate({
      projectType: lead.project_type,
      propertyType: lead.property_type,
      roofType: lead.roof_type,
      roofAge: lead.roof_age,
      accessDifficulty: lead.access_difficulty,
      roofIssues: lead.roof_issues,
      aiAnalysis: photoAnalysis,
    });

    console.log("Calculated estimate:", estimate);

    // STEP 3: Update lead with results
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        ai_analysis: photoAnalysis,
        estimate_low: estimate.low,
        estimate_mid: estimate.mid,
        estimate_high: estimate.high,
        estimate_timeline: estimate.timeline,
        confidence_score: estimate.confidence,
      })
      .eq("id", leadId);

    if (updateError) {
      console.error("Update error:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        estimate,
        analysis: photoAnalysis,
        leadId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function analyzeRoofPhotos(photoUrls: string[], apiKey: string): Promise<AIAnalysis> {
  // Build content with images
  const imageContents = await Promise.all(
    photoUrls.slice(0, 5).map(async (url) => {
      try {
        // Fetch image and convert to base64
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const mimeType = response.headers.get("content-type") || "image/jpeg";
        
        return {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
          },
        };
      } catch (e) {
        console.error("Failed to process image:", url, e);
        return null;
      }
    })
  );

  const validImages = imageContents.filter(Boolean);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en toiture au Québec. Analyse les photos de toiture et fournis une évaluation technique précise.
          
Réponds UNIQUEMENT avec un objet JSON valide, sans texte supplémentaire. Format:
{
  "roofType": "asphalt|metal|tpo|epdm|slate|wood|unknown",
  "estimatedArea": <number en pieds carrés>,
  "pitch": "low|medium|steep",
  "condition": "excellent|good|fair|poor",
  "issues": ["issue1", "issue2"],
  "estimatedAge": <number en années>,
  "confidenceScore": <0-100>,
  "complexity": "simple|moderate|complex"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyse ces photos de toiture et fournis ton évaluation technique en JSON.",
            },
            ...validImages,
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content in AI response");
  }

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = content;
  if (content.includes("```json")) {
    jsonStr = content.split("```json")[1].split("```")[0].trim();
  } else if (content.includes("```")) {
    jsonStr = content.split("```")[1].split("```")[0].trim();
  }

  try {
    return JSON.parse(jsonStr);
  } catch (parseError) {
    console.error("Failed to parse AI response:", content);
    // Return default values if parsing fails
    return {
      roofType: "unknown",
      estimatedArea: 1500,
      pitch: "medium",
      condition: "fair",
      issues: [],
      estimatedAge: 15,
      confidenceScore: 30,
      complexity: "moderate",
    };
  }
}

interface EstimateInput {
  projectType: string;
  propertyType: string;
  roofType: string;
  roofAge: string;
  accessDifficulty: string;
  roofIssues: string[];
  aiAnalysis: AIAnalysis | null;
}

interface EstimateResult {
  low: number;
  mid: number;
  high: number;
  timeline: string;
  confidence: number;
}

function calculateEstimate(data: EstimateInput): EstimateResult {
  // Base pricing per sqft by material (CAD)
  const basePricing: Record<string, number> = {
    asphalt: 5.50,
    architectural: 7.00,
    metal: 12.00,
    tpo: 8.00,
    epdm: 8.50,
    slate: 15.00,
    wood: 10.00,
    unknown: 6.00,
  };

  // Property type area estimates
  const propertyAreas: Record<string, number> = {
    bungalow: 1200,
    "2-etages": 1800,
    duplex: 2200,
    triplex: 3000,
    commercial: 5000,
  };

  // Multipliers
  const pitchMultiplier: Record<string, number> = {
    low: 1.0,
    medium: 1.15,
    steep: 1.35,
  };

  const accessMultiplier: Record<string, number> = {
    easy: 1.0,
    moderate: 1.1,
    difficult: 1.25,
  };

  const conditionMultiplier: Record<string, number> = {
    excellent: 0.85,
    good: 1.0,
    fair: 1.1,
    poor: 1.25,
  };

  const complexityMultiplier: Record<string, number> = {
    simple: 0.95,
    moderate: 1.0,
    complex: 1.2,
  };

  // Emergency premium
  const emergencyMultiplier = data.projectType === "emergency" ? 1.3 : 1.0;

  // Get base values (prefer AI analysis when available)
  const roofType = data.aiAnalysis?.roofType || data.roofType || "asphalt";
  const area = data.aiAnalysis?.estimatedArea || propertyAreas[data.propertyType] || 1500;
  const pitch = data.aiAnalysis?.pitch || "medium";
  const condition = data.aiAnalysis?.condition || "fair";
  const complexity = data.aiAnalysis?.complexity || "moderate";
  const confidence = data.aiAnalysis?.confidenceScore || 50;

  // Calculate base price
  const basePrice = area * (basePricing[roofType] || basePricing.unknown);

  // Apply all multipliers
  const totalMultiplier =
    (pitchMultiplier[pitch] || 1.0) *
    (accessMultiplier[data.accessDifficulty] || 1.0) *
    (conditionMultiplier[condition] || 1.0) *
    (complexityMultiplier[complexity] || 1.0) *
    emergencyMultiplier;

  // Calculate estimates with variance
  const mid = Math.round(basePrice * totalMultiplier);
  const low = Math.round(mid * 0.85);
  const high = Math.round(mid * 1.15);

  // Estimate timeline based on area and complexity
  const timeline = estimateTimeline(area, complexity);

  return {
    low,
    mid,
    high,
    timeline,
    confidence,
  };
}

function estimateTimeline(area: number, complexity: string): string {
  const baseTime = area < 1500 ? 2 : area < 2500 ? 4 : area < 4000 ? 6 : 8;
  
  const multiplier = complexity === "simple" ? 0.8 : complexity === "complex" ? 1.3 : 1.0;
  const days = Math.ceil(baseTime * multiplier);
  
  if (days <= 2) return "1-2 jours";
  if (days <= 4) return "3-4 jours";
  if (days <= 6) return "5-6 jours";
  return "7-10 jours";
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  leadId: string;
  estimate: {
    low: number;
    mid: number;
    high: number;
    timeline: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, estimate } = await req.json() as EmailRequest;
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: "Lead not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If no Resend API key, just log and return success
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not configured. Skipping emails.");
      console.log("Would send customer email to:", lead.email);
      console.log("Would send owner notification for lead:", lead.full_name);
      return new Response(
        JSON.stringify({ success: true, emailsSent: false, reason: "RESEND_API_KEY not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send customer confirmation email
    const customerEmailResult = await sendCustomerEmail(resendApiKey, lead, estimate);
    console.log("Customer email result:", customerEmailResult);

    // Send owner notification email
    const ownerEmailResult = await sendOwnerNotification(resendApiKey, lead, estimate);
    console.log("Owner email result:", ownerEmailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: true,
        customerEmail: customerEmailResult,
        ownerEmail: ownerEmailResult 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Email function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function sendCustomerEmail(apiKey: string, lead: any, estimate: any) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Chevalier Couvreur <estimation@chevalier-couvreur.com>",
      to: [lead.email],
      subject: "Votre estimation Chevalier Couvreur",
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2B2D42; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0A2540; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #FAFAFA; padding: 30px; border: 1px solid #e0e0e0; }
    .estimate-box { background: white; border-radius: 10px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .estimate-grid { display: flex; justify-content: space-around; text-align: center; }
    .estimate-item { padding: 10px; }
    .estimate-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .estimate-value { font-size: 24px; font-weight: bold; color: #0A2540; }
    .estimate-value.highlight { font-size: 32px; color: #0099FF; }
    .cta-button { display: inline-block; background: #0099FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Chevalier Couvreur</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre estimation personnalisée</p>
    </div>
    <div class="content">
      <p>Bonjour ${lead.full_name},</p>
      <p>Merci d'avoir utilisé notre outil d'estimation! Voici votre estimation préliminaire pour votre projet de toiture.</p>
      
      <div class="estimate-box">
        <div class="estimate-grid">
          <div class="estimate-item">
            <div class="estimate-label">Estimation Basse</div>
            <div class="estimate-value">${estimate.low.toLocaleString('fr-CA')} $</div>
          </div>
          <div class="estimate-item">
            <div class="estimate-label">Estimation Moyenne</div>
            <div class="estimate-value highlight">${estimate.mid.toLocaleString('fr-CA')} $</div>
          </div>
          <div class="estimate-item">
            <div class="estimate-label">Estimation Haute</div>
            <div class="estimate-value">${estimate.high.toLocaleString('fr-CA')} $</div>
          </div>
        </div>
        <p style="text-align: center; margin-top: 15px; color: #666; font-size: 14px;">
          Timeline estimé: <strong>${estimate.timeline}</strong>
        </p>
      </div>

      <h3>Prochaines étapes:</h3>
      <ul>
        <li>✓ Inspection gratuite sur place par un de nos experts</li>
        <li>✓ Soumission détaillée sous 24h après inspection</li>
        <li>✓ Début des travaux selon votre calendrier</li>
      </ul>

      <div style="text-align: center;">
        <a href="tel:+14505551234" class="cta-button">Réserver Inspection Gratuite</a>
      </div>

      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        *Cette estimation est préliminaire et basée sur les informations fournies. Le prix final sera confirmé après une inspection sur place.
      </p>
    </div>
    <div class="footer">
      <p>Chevalier Couvreur - 20 ans d'expertise</p>
      <p>(450) 555-1234 | info@chevalier-couvreur.com</p>
    </div>
  </div>
</body>
</html>
      `,
    }),
  });

  return response.ok ? { sent: true } : { sent: false, error: await response.text() };
}

async function sendOwnerNotification(apiKey: string, lead: any, estimate: any) {
  const projectTypeLabels: Record<string, string> = {
    residential: "🏠 Résidentiel",
    commercial: "🏢 Commercial",
    emergency: "🚨 Urgence",
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Système Chevalier <systeme@chevalier-couvreur.com>",
      to: ["francis@chevalier-couvreur.com"], // Owner email - should be configurable
      subject: `🔔 Nouveau lead: ${lead.full_name} - ${estimate.mid.toLocaleString('fr-CA')}$`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2B2D42; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0A2540; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #FAFAFA; padding: 20px; border: 1px solid #e0e0e0; }
    .info-box { background: white; border-radius: 8px; padding: 15px; margin: 10px 0; border-left: 4px solid #0099FF; }
    .label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
    .value { font-size: 16px; font-weight: 600; color: #0A2540; }
    .estimate-highlight { background: #0099FF; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
    .action-btn { display: inline-block; background: #0099FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">🔔 Nouveau Lead Reçu!</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${projectTypeLabels[lead.project_type] || lead.project_type}</p>
    </div>
    <div class="content">
      <div class="estimate-highlight">
        <div style="font-size: 14px; opacity: 0.9;">Estimation Moyenne</div>
        <div style="font-size: 36px; font-weight: bold;">${estimate.mid.toLocaleString('fr-CA')} $</div>
      </div>

      <h3>Contact</h3>
      <div class="info-box">
        <div class="label">Nom</div>
        <div class="value">${lead.full_name}</div>
      </div>
      <div class="info-box">
        <div class="label">Téléphone</div>
        <div class="value"><a href="tel:${lead.phone}">${lead.phone}</a></div>
      </div>
      <div class="info-box">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${lead.email}">${lead.email}</a></div>
      </div>
      <div class="info-box">
        <div class="label">Adresse</div>
        <div class="value">${lead.address}</div>
      </div>

      <h3>Détails du Projet</h3>
      <div class="info-box">
        <div class="label">Type de propriété</div>
        <div class="value">${lead.property_type || 'Non spécifié'}</div>
      </div>
      <div class="info-box">
        <div class="label">Type de toiture</div>
        <div class="value">${lead.roof_type || 'Non spécifié'}</div>
      </div>
      <div class="info-box">
        <div class="label">Âge de la toiture</div>
        <div class="value">${lead.roof_age || 'Non spécifié'} ans</div>
      </div>
      <div class="info-box">
        <div class="label">Timeline estimé</div>
        <div class="value">${estimate.timeline}</div>
      </div>

      ${lead.photos && lead.photos.length > 0 ? `
      <h3>Photos (${lead.photos.length})</h3>
      <p style="color: #666;">Photos disponibles dans le dashboard admin.</p>
      ` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <a href="tel:${lead.phone}" class="action-btn">📞 Appeler</a>
        <a href="mailto:${lead.email}" class="action-btn">✉️ Email</a>
      </div>
    </div>
  </div>
</body>
</html>
      `,
    }),
  });

  return response.ok ? { sent: true } : { sent: false, error: await response.text() };
}

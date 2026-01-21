import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Home, Building2, AlertTriangle, ArrowRight, ArrowLeft, 
  Upload, Camera, CheckCircle, Clock, MapPin, Phone, Mail,
  Loader2, Sparkles, X
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ProjectType = "residential" | "commercial" | "emergency" | null;

interface EstimateResult {
  low: number;
  mid: number;
  high: number;
  timeline: string;
  confidence: number;
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

const projectTypes = [
  {
    id: "residential" as const,
    icon: Home,
    title: "Résidentiel",
    description: "Maison unifamiliale, duplex, triplex",
  },
  {
    id: "commercial" as const,
    icon: Building2,
    title: "Commercial",
    description: "Multi-logements, bâtiment commercial",
    badge: "ICP FOCUS",
  },
  {
    id: "emergency" as const,
    icon: AlertTriangle,
    title: "Urgence",
    description: "Fuite active, dommage urgent",
  },
];

const Estimation = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType>(null);
  const [formData, setFormData] = useState({
    address: "",
    propertyType: "",
    yearBuilt: "",
    roofType: "",
    roofAge: "",
    issues: [] as string[],
    accessDifficulty: "easy",
    timeline: "",
    budget: "",
    photos: [] as File[],
    fullName: "",
    phone: "",
    email: "",
    bestTime: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const photo of formData.photos) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${photo.name}`;
      
      const { data, error } = await supabase.storage
        .from('roof-photos')
        .upload(fileName, photo);
      
      if (error) {
        console.error('Upload error:', error);
        continue;
      }
      
      const { data: urlData } = supabase.storage
        .from('roof-photos')
        .getPublicUrl(fileName);
      
      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!formData.consent) {
      toast.error("Veuillez accepter les conditions pour continuer");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload photos to storage
      let photoUrls: string[] = [];
      if (formData.photos.length > 0) {
        toast.info("Téléchargement des photos en cours...");
        photoUrls = await uploadPhotos();
      }

      // Step 2: Create lead in database
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          best_time_to_call: formData.bestTime,
          address: formData.address,
          property_type: formData.propertyType,
          year_built: formData.yearBuilt,
          project_type: projectType || 'residential',
          roof_type: formData.roofType,
          roof_age: formData.roofAge,
          roof_issues: formData.issues,
          access_difficulty: formData.accessDifficulty,
          timeline: formData.timeline,
          budget_range: formData.budget,
          photos: photoUrls,
        })
        .select()
        .single();

      if (leadError) {
        console.error('Lead creation error:', leadError);
        throw new Error('Failed to create lead');
      }

      toast.info("Analyse IA de votre toiture en cours...");

      // Step 3: Call AI analysis edge function
      const { data: analysisData, error: analysisError } = await supabase.functions
        .invoke('analyze-and-estimate', {
          body: { leadId: leadData.id }
        });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        // Continue even if AI fails - use fallback estimate
      }

      // Step 4: Send notification emails (async, don't wait)
      supabase.functions.invoke('send-lead-emails', {
        body: { 
          leadId: leadData.id,
          estimate: analysisData?.estimate || {
            low: 8500,
            mid: 10200,
            high: 11800,
            timeline: "3-5 jours"
          }
        }
      }).catch(console.error);

      // Set results
      if (analysisData?.estimate) {
        setEstimate(analysisData.estimate);
      } else {
        // Fallback estimate if AI fails
        setEstimate({
          low: 8500,
          mid: 10200,
          high: 11800,
          timeline: "3-5 jours",
          confidence: 50,
        });
      }

      if (analysisData?.analysis) {
        setAiAnalysis(analysisData.analysis);
      }

      setIsComplete(true);
      toast.success("Estimation complétée!");

    } catch (error) {
      console.error('Submit error:', error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      if (formData.photos.length + newPhotos.length > 10) {
        toast.error("Maximum 10 photos autorisées");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Results page
  if (isComplete && estimate) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-36 pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto"
            >
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Estimation Complétée!
                </h1>
                <p className="text-muted-foreground">
                  Pour: {formData.address}
                </p>
              </div>

              {/* Estimate Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-card rounded-xl p-6 text-center shadow-card border border-border">
                  <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Bas</p>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-success">
                    {estimate.low.toLocaleString('fr-CA')}$
                  </p>
                </div>
                <div className="bg-accent/10 rounded-xl p-6 text-center shadow-card border-2 border-accent relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    RECOMMANDÉ
                  </span>
                  <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Moyen</p>
                  <p className="text-3xl md:text-4xl font-bold font-mono text-accent">
                    {estimate.mid.toLocaleString('fr-CA')}$
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 text-center shadow-card border border-border">
                  <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Élevé</p>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-foreground">
                    {estimate.high.toLocaleString('fr-CA')}$
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-card rounded-xl p-6 shadow-card border border-border mb-6">
                <h2 className="font-bold text-lg mb-4">Détails de l'estimation</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Inspection gratuite incluse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Garantie 10 ans sur matériaux et main-d'œuvre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Timeline estimé: <strong>{estimate.timeline}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Matériaux premium inclus</span>
                  </div>
                </div>
              </div>

              {/* AI Analysis Summary */}
              {aiAnalysis && (
                <div className="bg-card rounded-xl p-6 shadow-card border border-border mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h2 className="font-bold text-lg">Analyse IA de votre toiture</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Condition actuelle:</span>
                      <span className="ml-2 font-medium capitalize">{aiAnalysis.condition}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Surface estimée:</span>
                      <span className="ml-2 font-medium">{aiAnalysis.estimatedArea} pi²</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pente:</span>
                      <span className="ml-2 font-medium capitalize">{aiAnalysis.pitch}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confiance:</span>
                      <span className="ml-2 font-medium">{aiAnalysis.confidenceScore}%</span>
                    </div>
                    {aiAnalysis.issues && aiAnalysis.issues.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Problèmes identifiés:</span>
                        <span className="ml-2 font-medium">{aiAnalysis.issues.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button variant="hero" size="lg" className="flex-1" asChild>
                  <a href="tel:+14505551234" className="flex items-center justify-center gap-2">
                    <Phone className="h-5 w-5" />
                    Confirmer Une Inspection Gratuite
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="flex-1" asChild>
                  <a href="tel:+14505551234" className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Parler À Un Expert: (450) 555-1234
                  </a>
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                *Estimation préliminaire basée sur l'analyse IA. Prix final après inspection sur place.
              </p>

              <div className="text-center mt-8">
                <Button variant="ghost" asChild>
                  <Link to="/">Retour à l'accueil</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-36 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Étape {step} sur {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((step / totalSteps) * 100)}% complété
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Project Type */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Quel Type de Projet?
                    </h1>
                    <p className="text-muted-foreground">
                      Sélectionnez le type de projet pour une estimation personnalisée.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {projectTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setProjectType(type.id);
                          handleNext();
                        }}
                        className={`relative p-6 rounded-xl border-2 transition-all text-left hover:border-accent hover:shadow-card ${
                          projectType === type.id
                            ? "border-accent bg-accent/5"
                            : "border-border bg-card"
                        }`}
                      >
                        {type.badge && (
                          <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                            {type.badge}
                          </span>
                        )}
                        <type.icon className="h-8 w-8 text-accent mb-4" />
                        <h3 className="font-bold text-foreground mb-1">
                          {type.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Détails de la Propriété
                    </h1>
                    <p className="text-muted-foreground">
                      Aidez-nous à mieux comprendre votre projet.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse complète *</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          placeholder="123 Rue Principale, Longueuil, QC"
                          className="pl-10"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Type de propriété</Label>
                        <select
                          id="propertyType"
                          className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                          value={formData.propertyType}
                          onChange={(e) =>
                            setFormData({ ...formData, propertyType: e.target.value })
                          }
                        >
                          <option value="">Sélectionner...</option>
                          <option value="bungalow">Bungalow</option>
                          <option value="2-etages">Maison 2 étages</option>
                          <option value="duplex">Duplex</option>
                          <option value="triplex">Triplex</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="yearBuilt">Année de construction</Label>
                        <Input
                          id="yearBuilt"
                          type="number"
                          placeholder="1990"
                          className="mt-1"
                          value={formData.yearBuilt}
                          onChange={(e) =>
                            setFormData({ ...formData, yearBuilt: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Accès au toit</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          { id: "easy", label: "Facile" },
                          { id: "moderate", label: "Modéré" },
                          { id: "difficult", label: "Difficile" },
                        ].map((access) => (
                          <button
                            key={access.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, accessDifficulty: access.id })}
                            className={`p-3 rounded-lg border text-sm transition-all ${
                              formData.accessDifficulty === access.id
                                ? "border-accent bg-accent/10 text-accent font-medium"
                                : "border-border hover:border-accent"
                            }`}
                          >
                            {access.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </Button>
                    <Button variant="hero" onClick={handleNext}>
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Roof Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      État de la Toiture
                    </h1>
                    <p className="text-muted-foreground">
                      Ces informations nous aident à fournir une estimation précise.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="roofType">Type de toiture actuelle</Label>
                        <select
                          id="roofType"
                          className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                          value={formData.roofType}
                          onChange={(e) =>
                            setFormData({ ...formData, roofType: e.target.value })
                          }
                        >
                          <option value="">Sélectionner...</option>
                          <option value="asphalt">Bardeaux d'asphalte</option>
                          <option value="metal">Toiture métallique</option>
                          <option value="tpo">TPO</option>
                          <option value="epdm">EPDM</option>
                          <option value="autre">Autre / Inconnu</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="roofAge">Âge de la toiture (années)</Label>
                        <Input
                          id="roofAge"
                          type="number"
                          placeholder="15"
                          className="mt-1"
                          value={formData.roofAge}
                          onChange={(e) =>
                            setFormData({ ...formData, roofAge: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Problèmes observés</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Fuites", "Bardeaux endommagés", "Ventilation insuffisante", "Mousse/Algues", "Affaissement", "Autre"].map(
                          (issue) => (
                            <label
                              key={issue}
                              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                                formData.issues.includes(issue)
                                  ? "border-accent bg-accent/10"
                                  : "border-border hover:border-accent"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="rounded border-border accent-accent"
                                checked={formData.issues.includes(issue)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      issues: [...formData.issues, issue],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      issues: formData.issues.filter((i) => i !== issue),
                                    });
                                  }
                                }}
                              />
                              <span className="text-sm">{issue}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </Button>
                    <Button variant="hero" onClick={handleNext}>
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Photos */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Photos de Votre Toiture
                    </h1>
                    <p className="text-muted-foreground">
                      Téléchargez 3-5 photos pour une estimation plus précise.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl p-6 shadow-card border border-border">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                          <Upload className="h-8 w-8 text-accent" />
                        </div>
                        <p className="font-medium text-foreground mb-1">
                          Glissez vos photos ici ou cliquez pour télécharger
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          JPG, PNG jusqu'à 10MB chacune (max 10 photos)
                        </p>
                        <Button variant="outline" size="sm" type="button">
                          <Camera className="h-4 w-4" />
                          Choisir des photos
                        </Button>
                      </label>
                    </div>

                    {formData.photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-lg bg-muted overflow-hidden group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
                      <div className="flex items-start gap-2">
                        <Camera className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Conseils pour de meilleures photos</p>
                          <p className="text-sm text-muted-foreground">
                            Vue d'ensemble de la toiture, zones problématiques, et gouttières si applicable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </Button>
                    <Button variant="hero" onClick={handleNext}>
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Contact Info */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Vos Coordonnées
                    </h1>
                    <p className="text-muted-foreground">
                      Dernière étape! Nous vous enverrons votre estimation par email.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-4">
                    <div>
                      <Label htmlFor="fullName">Nom complet *</Label>
                      <Input
                        id="fullName"
                        placeholder="Jean Tremblay"
                        className="mt-1"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Téléphone *</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(450) 555-1234"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Courriel *</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="jean@exemple.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bestTime">Meilleur moment pour vous joindre</Label>
                      <select
                        id="bestTime"
                        className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                        value={formData.bestTime}
                        onChange={(e) =>
                          setFormData({ ...formData, bestTime: e.target.value })
                        }
                      >
                        <option value="">Sélectionner...</option>
                        <option value="matin">Matin (8h-12h)</option>
                        <option value="apres-midi">Après-midi (12h-17h)</option>
                        <option value="soir">Soir (17h-20h)</option>
                        <option value="nimporte">N'importe quand</option>
                      </select>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        className="mt-1 rounded border-border accent-accent"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      />
                      <label htmlFor="consent" className="text-sm text-muted-foreground">
                        J'accepte d'être contacté par Chevalier Couvreur pour une évaluation gratuite 
                        et je consens à la politique de confidentialité. *
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </Button>
                    <Button 
                      variant="hero" 
                      size="lg" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Obtenir Mon Estimation
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Estimation;

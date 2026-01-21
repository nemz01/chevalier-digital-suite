import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Home, Building2, AlertTriangle, ArrowRight, ArrowLeft, 
  Upload, Camera, CheckCircle, Clock, MapPin, Phone, Mail 
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProjectType = "residential" | "commercial" | "emergency" | null;

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
    timeline: "",
    budget: "",
    photos: [] as File[],
    fullName: "",
    phone: "",
    email: "",
    bestTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files!)],
      }));
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Estimation Envoyée!
              </h1>
              <p className="text-muted-foreground mb-8">
                Merci pour votre demande. Notre équipe analysera vos informations 
                et vous contactera dans les 2 prochaines heures.
              </p>

              <div className="bg-card rounded-2xl p-8 shadow-card border border-border mb-8">
                <h2 className="font-bold text-xl mb-4">Estimation Préliminaire</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Bas</p>
                    <p className="text-2xl font-bold font-mono text-success">8 500$</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Moyen</p>
                    <p className="text-3xl font-bold font-mono text-foreground">10 200$</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Élevé</p>
                    <p className="text-2xl font-bold font-mono text-accent">11 800$</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  *Estimation basée sur les informations fournies. Prix final après inspection sur place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <a href="tel:+14505551234">
                    <Phone className="h-4 w-4" />
                    Appelez-nous maintenant
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
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
      <main className="pt-32 pb-24">
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
                        className={`p-6 rounded-xl border-2 transition-all text-left hover:border-accent hover:shadow-card ${
                          projectType === type.id
                            ? "border-accent bg-accent/5"
                            : "border-border bg-card"
                        }`}
                      >
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
                          className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                          className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                        {["Fuites", "Bardeaux endommagés", "Ventilation insuffisante", "Mousse/Algues", "Gouttières", "Autre"].map(
                          (issue) => (
                            <label
                              key={issue}
                              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-accent cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="rounded border-border"
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
                      Les photos nous permettent d'analyser l'état et fournir une estimation précise.
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
                          JPG, PNG jusqu'à 10MB chacune
                        </p>
                        <Button variant="outline" size="sm" type="button">
                          <Camera className="h-4 w-4" />
                          Prendre une photo
                        </Button>
                      </label>
                    </div>

                    {formData.photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-lg bg-muted overflow-hidden">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  photos: formData.photos.filter((_, i) => i !== index),
                                })
                              }
                              className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">Photos recommandées:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Vue d'ensemble de la maison/bâtiment</li>
                        <li>• Toiture de près (si accessible)</li>
                        <li>• Zone problématique (si applicable)</li>
                      </ul>
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
                      Dernière étape! Nous vous contacterons avec votre estimation.
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
                        className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                      <input type="checkbox" id="consent" className="mt-1 rounded border-border" />
                      <label htmlFor="consent" className="text-sm text-muted-foreground">
                        J'accepte d'être contacté par Chevalier Couvreur pour une évaluation gratuite 
                        et je consens à la politique de confidentialité.
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
                          <Clock className="h-4 w-4 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          Obtenir Mon Estimation
                          <ArrowRight className="h-4 w-4" />
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

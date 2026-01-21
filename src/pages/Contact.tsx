import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-36 pb-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contactez-Nous
              </h1>
              <p className="text-xl text-primary-foreground/80">
                Une question, un projet, une urgence? Notre équipe est là pour vous.
                Réponse garantie en moins de 2 heures.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {isSubmitted ? (
                  <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Message Envoyé!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Merci de nous avoir contactés. Notre équipe vous répondra 
                      dans les plus brefs délais.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      Envoyez-Nous un Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom complet *</Label>
                          <Input
                            id="name"
                            placeholder="Jean Tremblay"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Téléphone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(450) 555-1234"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Courriel *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jean@exemple.com"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Sujet</Label>
                        <select
                          id="subject"
                          className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Sélectionner...</option>
                          <option value="estimation">Demande d'estimation</option>
                          <option value="urgence">Urgence / Fuite</option>
                          <option value="commercial">Projet commercial</option>
                          <option value="autre">Autre question</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Décrivez votre projet ou question..."
                          rows={5}
                          required
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        variant="hero" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Envoyer le Message
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Informations de Contact
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Nous sommes disponibles pour répondre à toutes vos questions. 
                    N'hésitez pas à nous contacter par téléphone, courriel ou en 
                    personne.
                  </p>
                </div>

                <div className="space-y-6">
                  <a 
                    href="tel:+14505551234"
                    className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors group"
                  >
                    <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Phone className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Téléphone</p>
                      <p className="text-accent font-mono text-lg">(450) 555-1234</p>
                      <p className="text-sm text-muted-foreground">Urgences 24/7</p>
                    </div>
                  </a>

                  <a 
                    href="mailto:info@chevaliercouvreur.ca"
                    className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border hover:border-accent transition-colors group"
                  >
                    <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Mail className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Courriel</p>
                      <p className="text-accent">info@chevaliercouvreur.ca</p>
                      <p className="text-sm text-muted-foreground">Réponse en 2h</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Zone de Service</p>
                      <p className="text-muted-foreground">Rive-Sud, Rive-Nord & Cantons-de-l'Est</p>
                      <p className="text-sm text-muted-foreground">Nous nous déplaçons!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Heures d'Ouverture</p>
                      <p className="text-muted-foreground">Lun-Ven: 7h00 - 18h00</p>
                      <p className="text-muted-foreground">Sam: 8h00 - 14h00</p>
                      <p className="text-sm text-accent">Urgences disponibles 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-accent/10 rounded-xl">
                  <p className="font-semibold text-foreground mb-2">
                    Besoin d'une estimation rapide?
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    Utilisez notre outil d'estimation en ligne pour obtenir un 
                    prix préliminaire en 2 minutes.
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/estimation">
                      Estimation Gratuite
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="h-96 bg-muted">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d357962.26814565!2d-73.97324545!3d45.55927685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a541c64b70d%3A0x654e3138211fefef!2sMontreal%2C%20QC!5e0!3m2!1sen!2sca!4v1679001234567!5m2!1sen!2sca"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Notre zone de service"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

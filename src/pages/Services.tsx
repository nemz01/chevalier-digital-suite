import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Home, Building2, AlertTriangle, ArrowRight, CheckCircle, 
  Shield, Clock, Wrench, Ruler, Fan, Droplet 
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const residentialServices = [
  { icon: Ruler, title: "Remplacement complet", description: "Nouvelle toiture avec matériaux premium et garantie 10 ans." },
  { icon: Wrench, title: "Réparations", description: "Bardeaux endommagés, fuites, petites interventions." },
  { icon: Fan, title: "Ventilation", description: "Installation et amélioration de la ventilation de toit." },
  { icon: Droplet, title: "Gouttières", description: "Installation, réparation et nettoyage de gouttières." },
];

const materials = [
  { name: "Bardeaux Standard", price: "À partir de 4,50$/pi²", warranty: "15 ans" },
  { name: "Architectural Premium", price: "À partir de 5,75$/pi²", warranty: "25 ans" },
  { name: "Designer Élite", price: "À partir de 7,25$/pi²", warranty: "Lifetime" },
  { name: "Toiture Métallique", price: "À partir de 9,50$/pi²", warranty: "50 ans" },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Nos Services de Toiture
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                Solutions complètes pour résidences et bâtiments commerciaux. 
                Expertise, qualité et service personnalisé.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/estimation">
                  Estimation Gratuite
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Residential Section */}
        <section id="residentiel" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 text-accent mb-4">
                  <Home className="h-5 w-5" />
                  <span className="font-semibold text-sm uppercase tracking-wider">
                    Résidentiel
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Toiture Résidentielle
                </h2>
                <p className="text-muted-foreground mb-8">
                  Votre maison mérite le meilleur. Nous offrons des solutions 
                  de toiture adaptées à vos besoins et votre budget, avec des 
                  matériaux premium et une main-d'œuvre qualifiée.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {residentialServices.map((service) => (
                    <div 
                      key={service.title}
                      className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border"
                    >
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <service.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="heroOutline" asChild>
                  <Link to="/estimation">
                    Demander une estimation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 shadow-card border border-border"
              >
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Nos Matériaux
                </h3>
                <div className="space-y-4">
                  {materials.map((material) => (
                    <div 
                      key={material.name}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{material.name}</p>
                        <p className="text-sm text-muted-foreground">Garantie {material.warranty}</p>
                      </div>
                      <p className="font-mono text-accent font-semibold">{material.price}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Commercial Section */}
        <section id="commercial" className="py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="bg-primary text-primary-foreground rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-6">Avantages Partenaires</h3>
                  <ul className="space-y-4">
                    {[
                      "Prix volume compétitifs",
                      "Gestionnaire de projet dédié",
                      "Garanties commerciales étendues",
                      "Timeline garantie par contrat",
                      "Facturation flexible",
                      "Service prioritaire",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <div className="inline-flex items-center gap-2 text-accent mb-4">
                  <Building2 className="h-5 w-5" />
                  <span className="font-semibold text-sm uppercase tracking-wider">
                    Commercial
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Solutions Commerciales
                </h2>
                <p className="text-muted-foreground mb-6">
                  Développeurs immobiliers, gestionnaires d'immeubles, propriétaires 
                  commerciaux: nous sommes votre partenaire de confiance pour tous 
                  vos projets de toiture à grande échelle.
                </p>
                <p className="text-muted-foreground mb-8">
                  Notre expertise en projets multi-logements et commerciaux nous permet 
                  d'offrir des solutions adaptées, des prix compétitifs et un service 
                  qui respecte vos échéanciers.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    Devenir Partenaire
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Emergency Section */}
        <section id="urgence" className="py-24 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold text-sm uppercase tracking-wider">
                  Urgences 24/7
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Service d'Urgence
              </h2>
              <p className="text-accent-foreground/80 mb-8 text-lg">
                Fuite active, dommage de tempête, situation critique? Notre équipe 
                intervient rapidement pour protéger votre propriété, jour et nuit.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-accent-foreground/10 backdrop-blur-sm rounded-xl p-6">
                  <Clock className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-bold mb-1">Réponse Rapide</h3>
                  <p className="text-sm text-accent-foreground/80">Intervention en moins de 2 heures</p>
                </div>
                <div className="bg-accent-foreground/10 backdrop-blur-sm rounded-xl p-6">
                  <Shield className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-bold mb-1">Protection Temporaire</h3>
                  <p className="text-sm text-accent-foreground/80">Bâches et solutions immédiates</p>
                </div>
                <div className="bg-accent-foreground/10 backdrop-blur-sm rounded-xl p-6">
                  <Wrench className="h-8 w-8 mx-auto mb-3" />
                  <h3 className="font-bold mb-1">Réparation Définitive</h3>
                  <p className="text-sm text-accent-foreground/80">Solution permanente planifiée</p>
                </div>
              </div>

              <Button 
                size="xl" 
                className="bg-accent-foreground text-accent hover:bg-accent-foreground/90 font-bold"
                asChild
              >
                <a href="tel:+14505551234">
                  Appeler Maintenant: (450) 555-1234
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Notre Processus
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                De la première consultation à la finition, un accompagnement 
                transparent et professionnel.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-4">
              {[
                { step: 1, title: "Estimation", desc: "Gratuite et sans engagement" },
                { step: 2, title: "Inspection", desc: "Évaluation détaillée sur place" },
                { step: 3, title: "Soumission", desc: "Proposition claire et complète" },
                { step: 4, title: "Travaux", desc: "Exécution professionnelle" },
                { step: 5, title: "Garantie", desc: "Suivi et protection long terme" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;

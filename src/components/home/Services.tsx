import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Building2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Home,
    title: "Résidentiel",
    description: "Remplacement complet, réparations et inspections pour votre maison. Matériaux premium et garantie complète.",
    features: ["Bardeaux d'asphalte", "Toiture métallique", "Ventilation", "Gouttières"],
    cta: "En savoir plus",
    href: "/services#residentiel",
    accent: false,
  },
  {
    icon: Building2,
    title: "Commercial",
    description: "Solutions sur mesure pour développeurs immobiliers et propriétaires commerciaux. Projets multi-unités notre spécialité.",
    features: ["TPO & EPDM", "Multi-logements", "Toiture plate", "Garanties étendues"],
    cta: "Partenariats Développeurs",
    href: "/services#commercial",
    accent: true,
  },
  {
    icon: AlertTriangle,
    title: "Urgences 24/7",
    description: "Fuites, dommages de tempête, réparations urgentes. Nous intervenons rapidement pour protéger votre propriété.",
    features: ["Réponse rapide", "Bâches temporaires", "Évaluation gratuite", "Service jour et nuit"],
    cta: "Contactez-nous",
    href: "/contact",
    accent: false,
  },
];

export function Services() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Nos Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Solutions Complètes de Toiture
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            De la résidence familiale aux grands projets commerciaux, notre équipe offre 
            un service professionnel adapté à vos besoins.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                service.accent
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "bg-card shadow-card hover:shadow-elevated border border-border"
              }`}
            >
              {service.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    ICP FOCUS
                  </span>
                </div>
              )}

              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 ${
                  service.accent
                    ? "bg-primary-foreground/10"
                    : "bg-accent/10"
                }`}
              >
                <service.icon
                  className={`h-7 w-7 ${
                    service.accent ? "text-primary-foreground" : "text-accent"
                  }`}
                />
              </div>

              <h3
                className={`text-xl font-bold mb-3 ${
                  service.accent ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {service.title}
              </h3>

              <p
                className={`text-sm mb-6 ${
                  service.accent
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {service.description}
              </p>

              <ul className="space-y-2 mb-8">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className={`text-sm flex items-center gap-2 ${
                      service.accent
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        service.accent ? "bg-accent" : "bg-accent"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={service.accent ? "hero" : "heroOutline"}
                className="w-full group/btn"
                asChild
              >
                <Link to={service.href}>
                  {service.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

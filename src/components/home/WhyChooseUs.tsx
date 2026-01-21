import { motion } from "framer-motion";
import { Wrench, Users, Award, HeartHandshake } from "lucide-react";

const benefits = [
  {
    icon: Wrench,
    title: "20 ans d'expérience terrain",
    description: "Expertise acquise sur des centaines de projets, du bungalow au complexe multi-logements.",
  },
  {
    icon: Users,
    title: "Équipe de 10+ professionnels",
    description: "Couvreurs certifiés, formés aux dernières techniques et normes de sécurité.",
  },
  {
    icon: Award,
    title: "Matériaux premium garantis",
    description: "Nous utilisons exclusivement des matériaux de première qualité avec garanties étendues.",
  },
  {
    icon: HeartHandshake,
    title: "Service personnalisé",
    description: "Du premier appel à la finition, un accompagnement attentif et transparent.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Pourquoi Nous
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            La Différence Chevalier
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ce qui nous distingue: un engagement envers l'excellence, la transparence 
            et la satisfaction de nos clients.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-6 transition-transform group-hover:scale-110">
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

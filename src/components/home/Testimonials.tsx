import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marie Lavoie",
    location: "Longueuil",
    rating: 5,
    text: "Travail impeccable! L'équipe a remplacé notre toiture en 3 jours. Propre, professionnel et le résultat est magnifique. Je recommande sans hésitation.",
    project: "Remplacement toiture résidentielle",
  },
  {
    name: "Pierre Gagnon",
    location: "Brossard",
    rating: 5,
    text: "Service d'urgence exceptionnel. Une fuite importante un dimanche soir, et ils étaient là en moins d'une heure. Professionnalisme remarquable.",
    project: "Réparation d'urgence",
  },
  {
    name: "ABC Développements",
    location: "Sherbrooke",
    rating: 5,
    text: "Partenaire de confiance pour nos projets multi-logements. Toujours dans les délais, qualité constante. Notre couvreur attitré depuis 5 ans.",
    project: "Complexe 24 unités",
  },
];

export function Testimonials() {
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
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Ce Que Disent Nos Clients
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            La satisfaction de nos clients est notre plus grande récompense. 
            Découvrez leurs témoignages.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-muted/30" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="border-t border-border pt-4">
                <p className="font-bold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                <p className="text-xs text-accent mt-1">{testimonial.project}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

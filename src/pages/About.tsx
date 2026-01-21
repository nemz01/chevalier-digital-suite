import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Users, Award, Heart, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const values = [
  { 
    icon: Shield, 
    title: "Intégrité", 
    description: "Honnêteté et transparence dans chaque interaction. Nous disons ce que nous faisons, et faisons ce que nous disons." 
  },
  { 
    icon: Award, 
    title: "Excellence", 
    description: "Chaque projet est une opportunité de démontrer notre savoir-faire. Nous visons toujours la perfection." 
  },
  { 
    icon: Users, 
    title: "Équipe", 
    description: "Notre force réside dans notre équipe soudée et passionnée. Chaque membre contribue au succès collectif." 
  },
  { 
    icon: Heart, 
    title: "Service", 
    description: "La satisfaction client est notre priorité absolue. Nous traitons chaque propriété comme si c'était la nôtre." 
  },
];

const milestones = [
  { year: "2004", title: "Fondation", desc: "Francis Chevalier lance son entreprise avec une camionnette et une passion" },
  { year: "2010", title: "Croissance", desc: "L'équipe atteint 5 employés, premiers projets commerciaux" },
  { year: "2015", title: "Expansion", desc: "Couverture de la Rive-Sud au complet, 10+ employés" },
  { year: "2020", title: "Innovation", desc: "Adoption des dernières technologies et matériaux durables" },
  { year: "2024", title: "Aujourd'hui", desc: "Leader régional avec 500+ projets complétés" },
];

const About = () => {
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
                À Propos de Nous
              </h1>
              <p className="text-xl text-primary-foreground/80">
                20 ans de passion pour la toiture, d'expertise terrain et 
                d'engagement envers nos clients.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                  Notre Histoire
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  20 Ans Sur les Toits
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    C'est en 2004 que Francis Chevalier, armé d'une formation en 
                    construction et d'une passion pour le travail bien fait, a 
                    fondé Chevalier Couvreur. Ce qui a commencé comme une petite 
                    entreprise familiale est devenu un leader régional de la toiture.
                  </p>
                  <p>
                    Après 20 ans à monter sur les toits, à former des équipes et à 
                    perfectionner notre art, nous avons bâti une réputation solide 
                    basée sur la qualité, l'intégrité et le service personnalisé.
                  </p>
                  <p>
                    Aujourd'hui, notre équipe de plus de 10 professionnels certifiés 
                    dessert la Rive-Sud, la Rive-Nord et les Cantons-de-l'Est, avec 
                    le même engagement envers l'excellence qui nous anime depuis le 
                    premier jour.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <p className="text-7xl md:text-8xl font-bold mb-2">20+</p>
                    <p className="text-xl">Années d'expérience</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-xl p-6 shadow-elevated">
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm">Projets complétés</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-muted">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nos Valeurs
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Les principes qui guident chacune de nos actions et définissent 
                notre façon de travailler.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-4">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Notre Parcours
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à Travailler Avec Nous?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Découvrez pourquoi des centaines de propriétaires nous font confiance 
                pour leurs projets de toiture.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/estimation">
                  Obtenir Une Estimation Gratuite
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

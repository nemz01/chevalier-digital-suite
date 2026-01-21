import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-roofing.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Équipe de couvreurs professionnels au travail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full glass text-primary-foreground text-sm font-medium mb-6">
              <Shield className="inline-block h-4 w-4 mr-2" />
              20 ans d'expérience • Garantie 10 ans
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 uppercase tracking-wide"
            style={{ 
              textShadow: '2px 2px 0px rgba(0,0,0,0.2), 4px 4px 0px rgba(0,0,0,0.1), 8px 8px 30px rgba(0,0,0,0.3)'
            }}
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="block"
            >
              Toitures Résidentielles &
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
              className="block"
            >
              Commerciales de Confiance
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8"
          >
            Service professionnel sur la Rive-Sud, Rive-Nord et Cantons-de-l'Est. 
            Expertise reconnue, matériaux premium et travail impeccable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button variant="heroPrimary" size="xl" asChild>
              <Link to="/estimation">
                Obtenir Une Estimation Gratuite
              </Link>
            </Button>
            <Button variant="heroSecondary" size="xl" asChild>
              <a href="tel:+14505551234" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Appelez: (450) 555-1234
              </a>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
          >
            <div className="glass rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <p className="text-primary-foreground font-bold text-lg">20+</p>
              <p className="text-primary-foreground/70 text-xs">Années d'expérience</p>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <p className="text-primary-foreground font-bold text-lg">500+</p>
              <p className="text-primary-foreground/70 text-xs">Projets complétés</p>
            </div>
            <div className="glass rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <p className="text-primary-foreground font-bold text-lg">24/7</p>
              <p className="text-primary-foreground/70 text-xs">Service d'urgence</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-3 bg-primary-foreground/60 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}

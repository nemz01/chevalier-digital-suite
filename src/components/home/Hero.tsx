import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Shield, Home, Award, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-roofing.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Toiture professionnelle"
          className="w-full h-full object-cover"
        />
        {/* Dark blue gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/85 to-[#0a1628]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              DISPONIBLE 24/7 POUR URGENCES
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="block font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-tight">
              CHEVALIER
            </span>
            <span className="block font-display text-5xl md:text-6xl lg:text-7xl font-bold text-accent uppercase tracking-tight">
              COUVREUR
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-xl mb-8 border-l-4 border-accent pl-4"
          >
            L'excellence en toiture résidentielle et commerciale sur la Rive-Sud,
            Rive-Nord et en Estrie.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-6 text-base"
              asChild
            >
              <Link to="/estimation" className="flex items-center gap-2">
                ESTIMATION GRATUITE
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:text-white font-semibold px-8 py-6 text-base"
              asChild
            >
              <a href="tel:+15141234567" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                (514) 123-4567
              </a>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-8 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">GARANTIE 10 ANS</p>
                <p className="text-white/60 text-sm">Sur la main d'oeuvre</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Home className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">500+ PROJETS</p>
                <p className="text-white/60 text-sm">Réalisés avec succès</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">CERTIFIÉ RBQ</p>
                <p className="text-white/60 text-sm">Licence officielle</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative circle element (like in Gemini design) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="hidden lg:block absolute right-[10%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"
      />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}

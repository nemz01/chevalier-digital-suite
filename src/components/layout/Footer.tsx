import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="Chevalier Couvreur" className="h-16 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Service professionnel de toiture sur la Rive-Sud, Rive-Nord et Cantons-de-l'Est depuis plus de 20 ans.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Accueil
              </Link>
              <Link to="/services" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Services
              </Link>
              <Link to="/estimation" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Estimation Gratuite
              </Link>
              <Link to="/a-propos" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                À Propos
              </Link>
              <Link to="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Nos Services</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/services#residentiel" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Toiture Résidentielle
              </Link>
              <Link to="/services#commercial" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Toiture Commerciale
              </Link>
              <Link to="/services#reparation" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Réparations
              </Link>
              <Link to="/services#urgence" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                Urgences 24/7
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contactez-nous</h3>
            <div className="space-y-3">
              <a href="tel:+14505551234" className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                <Phone className="h-4 w-4 flex-shrink-0" />
                (450) 555-1234
              </a>
              <a href="mailto:info@chevaliercouvreur.ca" className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@chevaliercouvreur.ca
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Rive-Sud, Rive-Nord & Cantons-de-l'Est, QC</span>
              </div>
              <div className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Lun-Ven: 7h-18h<br />Sam: 8h-14h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Francis Chevalier Couvreur. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/confidentialite" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/conditions" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

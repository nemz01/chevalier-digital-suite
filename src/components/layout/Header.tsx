import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { href: "/services", label: "SERVICES" },
  { href: "/estimation", label: "RÉALISATIONS" },
  { href: "/a-propos", label: "À PROPOS" },
  { href: "/contact", label: "PROCESSUS" },
  { href: "/dashboard", label: "DASHBOARD", icon: LayoutDashboard },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a1628]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 py-2">
            <img
              src={logo}
              alt="Chevalier Couvreur"
              className="h-12 w-auto"
            />
            <div className="hidden sm:block">
              <span className="block text-white font-bold text-lg leading-tight">CHEVALIER</span>
              <span className="block text-white/70 text-xs tracking-widest">COUVREUR</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-accent ${
                  location.pathname === link.href
                    ? "text-accent"
                    : "text-white/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              className="bg-accent hover:bg-accent/90 text-white font-semibold px-6"
              asChild
            >
              <a href="tel:+15141234567" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                URGENCE 24/7
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0a1628]/98 backdrop-blur-md border-t border-white/10"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium py-2 transition-colors ${
                    location.pathname === link.href
                      ? "text-accent"
                      : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10" />
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                asChild
              >
                <a href="tel:+15141234567" className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  URGENCE 24/7
                </a>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { motion } from "framer-motion";
import { MapPin, CheckCircle } from "lucide-react";

const regions = [
  {
    name: "Rive-Sud",
    cities: ["Longueuil", "Brossard", "Saint-Lambert", "La Prairie", "Boucherville", "Saint-Bruno"],
  },
  {
    name: "Rive-Nord",
    cities: ["Laval", "Terrebonne", "Blainville", "Saint-Jérôme", "Repentigny", "Mascouche"],
  },
  {
    name: "Cantons-de-l'Est",
    cities: ["Sherbrooke", "Magog", "Granby", "Bromont", "Drummondville", "Victoriaville"],
  },
];

export function ServiceArea() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Zone de Service
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Nous Couvrons Tout le Grand Montréal
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              De la Rive-Sud aux Cantons-de-l'Est, notre équipe se déplace pour 
              vos projets résidentiels et commerciaux. Service rapide et professionnel 
              où que vous soyez.
            </p>

            <div className="space-y-6">
              {regions.map((region) => (
                <div key={region.name}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <h3 className="font-bold text-lg">{region.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-7">
                    {region.cities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-1 text-sm text-primary-foreground/70"
                      >
                        <CheckCircle className="h-3 w-3 text-accent" />
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-primary-foreground/60 text-sm">
              * Nous nous déplaçons également pour les projets importants en dehors de ces zones. Contactez-nous!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-primary-foreground/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d357962.26814565!2d-73.97324545!3d45.55927685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a541c64b70d%3A0x654e3138211fefef!2sMontreal%2C%20QC!5e0!3m2!1sen!2sca!4v1679001234567!5m2!1sen!2sca"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zone de service"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent rounded-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

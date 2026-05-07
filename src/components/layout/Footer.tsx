import { Instagram, Facebook, MapPin, Clock, Phone } from "lucide-react";
import { SALON_INFO } from "@/constants";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Map */}
      <div className="w-full h-64">
        <iframe
          src={SALON_INFO.mapsEmbed}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Studio Neo"
        />
      </div>

      <div className="container-salon section-padding !py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <img
              src={SALON_INFO.logo}
              alt="Studio Neo"
              className="h-12 object-contain brightness-0 invert"
            />
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock size={14} />
              <span>{SALON_INFO.hours}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Phone size={14} />
              <span>(11) 97748-5165</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={SALON_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-gold/20 hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href={SALON_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-gold/20 hover:text-gold transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/50">
          © 2024 EricTech. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

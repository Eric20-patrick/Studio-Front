import { Instagram, Facebook, MapPin, Clock, Phone } from "lucide-react";
import { SALON_INFO } from "@/constants";

export default function Footer() {
  return (
    <footer className="w-full bg-transparent">
      {/* ─── SEÇÃO DO MAPA (Design Premium com Fundo Claro) ─── */}
      <div className="bg-gradient-to-b from-white to-[#FAF7F2] pb-16 px-4">
        {SALON_INFO.mapsEmbed && (
          <div className="max-w-6xl mx-auto pt-12">
            {/* Header da Localização */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-3">
                <MapPin size={12} className="text-gold-dark" />
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                  Localização
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-black">
                Onde nos encontrar
              </h3>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-3" />
            </div>

            {/* Container do Iframe com efeito 3D e bordas arredondadas */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20 group z-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-gold-dark/20 rounded-3xl blur-lg opacity-40" />
              <iframe
                src={SALON_INFO.mapsEmbed}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="relative w-full block"
                title="Localização Salão de Beleza"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── SEÇÃO INFERIOR DO FOOTER (Preto Clássico) ─── */}
      <div className="bg-black text-white">
        <div className="container-salon section-padding !py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

            {/* Branding e Info */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <img
                src={SALON_INFO.logo}
                alt="Salão de Beleza"
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

            {/* Redes Sociais */}
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

          {/* Copyright */}
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/50">
            © 2026 EricTech. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
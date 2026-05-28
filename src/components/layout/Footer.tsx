import { Instagram, Facebook, MapPin, Clock, Phone } from "lucide-react";
import { SALON_INFO } from "@/constants";

export default function Footer() {
  return (
    <footer className="w-full bg-transparent">
      {/* ─── SEÇÃO DO MAPA E LOCALIZAÇÃO (Grid Responsivo de 2 Colunas) ─── */}
      {SALON_INFO.mapsEmbed && (
        <div className="bg-gradient-to-b from-[#faf8f5] to-white pb-16 px-4 border-t border-gold/10">
          <div className="max-w-6xl mx-auto pt-12">
            {/* Header da Localização */}
            <div className="text-center mb-16">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Card de Informações de Contato */}
              <div className="space-y-6 bg-white p-8 rounded-3xl shadow-md border border-gold/10 relative overflow-hidden group hover:border-gold/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-gold/10 transition-colors duration-500" />
                
                <h3 className="text-2xl font-display font-bold text-black mb-4 relative">
                  Salão de Beleza
                </h3>
                
                <div className="space-y-4 relative">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-gold/10 text-gold-dark mt-1 shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black text-sm">Endereço</h4>
                      <p className="text-muted-foreground text-sm font-light mt-1">
                        {SALON_INFO.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-gold/10 text-gold-dark mt-1 shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black text-sm">Horário de Funcionamento</h4>
                      <p className="text-muted-foreground text-sm font-light mt-1">
                        {SALON_INFO.hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-gold/10 text-gold-dark mt-1 shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black text-sm">Telefone & WhatsApp</h4>
                      <p className="text-muted-foreground text-sm font-light mt-1">
                        (11) 97748-5165
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Iframe do Mapa */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gold/20 group h-[400px]">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-gold-dark/20 rounded-3xl blur-lg opacity-40" />
                <iframe
                  src={SALON_INFO.mapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative w-full h-full block"
                  title="Localização Salão de Beleza"
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
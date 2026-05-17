import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SALON_INFO } from "@/constants";
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from "lucide-react";
import { assetSrc } from "@/lib/assetSrc";
import gImg2 from "@/assets/G2.jpg";
import gImg3 from "@/assets/G3.png";
import gImg4 from "@/assets/G4.png";
import gImg5 from "@/assets/G5.jpg";
import gImg7 from "@/assets/G7.jpg";
import gImg8 from "@/assets/G8.png";
import gImg9 from "@/assets/G9.jpg";
import gImg10 from "@/assets/G10.jpg";
import gImg11 from "@/assets/G11.png";
import gImg12 from "@/assets/G12.png";
import gImg13 from "@/assets/G13.png";
import gImg14 from "@/assets/G14.jpg";
import gImg15 from "@/assets/G15.jpg";
import heroG from "@/assets/heroG.png";
import Image from "next/image";

const galleryImages = [
  gImg2,
  gImg3,
  gImg4,
  gImg5,
  gImg7,
  gImg8,
  gImg9,
  gImg10,
  gImg11,
  gImg12,
  gImg13,
  gImg14,
  gImg15,
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = "Galeria | Studio Neo";
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + galleryImages.length) % galleryImages.length);
  };

  // Navegação por teclado no lightbox
  useEffect(() => {
    if (lightbox === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroG}
          alt="Studio Neo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-4">
            <Camera size={14} className="text-gold" />
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Nosso Espaço
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
            Galeria de Fotos
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-[#faf8f5] to-white">
        <div ref={ref} className="container-salon scroll-reveal">
          {/* Subtítulo */}
          <div className="text-center mb-10">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Conheça nosso ambiente cuidadosamente projetado para proporcionar conforto,
              elegância e uma experiência única.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-muted animate-pulse rounded-2xl ${i % 5 === 0 ? "row-span-2" : ""
                    }`}
                />
              ))
              : galleryImages.map((img, i) => {
                // Padrão masonry: algumas imagens ocupam 2 linhas
                const isLarge = i % 5 === 0 || i % 7 === 3;
                return (
                  <div
                    key={i}
                    onClick={() => setLightbox(i)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-500 ${isLarge ? "row-span-2" : ""
                      }`}
                  >
                    <img
                      src={assetSrc(img)}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Overlay gradiente que aparece no hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Ícone de zoom centralizado */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-50">
                      <div className="w-14 h-14 rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                        <ZoomIn size={24} className="text-primary" />
                      </div>
                    </div>



                    {/* Borda dourada sutil no hover */}
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-gold/0 group-hover:ring-gold/40 transition-all duration-500 pointer-events-none" />
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Lightbox melhorado */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 backdrop-blur-md animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          {/* Botão fechar */}
          <button
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-gold/80 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            <X size={22} />
          </button>



          {/* Botão anterior */}
          <button
            className="absolute left-4 md:left-8 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-gold/80 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10 group"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Imagem com moldura sutil */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-gold-dark/30 rounded-2xl blur-lg opacity-50" />
            <img
              src={assetSrc(galleryImages[lightbox])}
              alt={`Foto ${lightbox + 1}`}
              className="relative max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Botão próximo */}
          <button
            className="absolute right-4 md:right-8 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-gold/80 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10 group"
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            aria-label="Próxima"
          >
            <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
          </button>


        </div>
      )}
    </div>
  );
}

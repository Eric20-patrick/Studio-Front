import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SALON_INFO } from "@/constants";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroG}
          alt="Studio Neo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <h1 className="relative text-4xl md:text-5xl font-display font-bold text-primary-foreground justify-center  ">
          Galeria de Fotos
        </h1>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-muted animate-pulse rounded-xl"
                  />
                ))
              : galleryImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setLightbox(i)}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={assetSrc(img)}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      loading="lazy"
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-md animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-primary-foreground/70 hover:text-primary-foreground"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 text-primary-foreground/70 hover:text-primary-foreground p-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
          >
            <ChevronLeft size={36} />
          </button>
          <img
            src={assetSrc(galleryImages[lightbox])}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-primary-foreground/70 hover:text-primary-foreground p-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}

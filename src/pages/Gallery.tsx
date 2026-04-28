import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SALON_INFO } from '@/constants';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImg from '@/assets/hero-salon.jpg';
import aboutImg from '@/assets/about-salon.jpg';
import hairImg from '@/assets/service-hair.jpg';
import nailsImg from '@/assets/service-nails.jpg';
import makeupImg from '@/assets/service-makeup.jpg';

const galleryImages = [heroImg, aboutImg, hairImg, nailsImg, makeupImg, heroImg, aboutImg, hairImg];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = 'Galeria | Studio Neo';
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (dir: number) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + galleryImages.length) % galleryImages.length);
  };

  return (
    <div>
      <section className="relative h-[30vh] flex flex-col items-center justify-center bg-primary">
        <img src={SALON_INFO.logo} alt="Studio Neo" className="h-12 brightness-0 invert mb-4" />
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">Galeria de Fotos</h1>
      </section>

      <section className="section-padding">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
                ))
              : galleryImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setLightbox(i)}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={img}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-md animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-primary-foreground/70 hover:text-primary-foreground" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <button className="absolute left-4 text-primary-foreground/70 hover:text-primary-foreground p-2" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>
            <ChevronLeft size={36} />
          </button>
          <img
            src={galleryImages[lightbox]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute right-4 text-primary-foreground/70 hover:text-primary-foreground p-2" onClick={(e) => { e.stopPropagation(); navigate(1); }}>
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </div>
  );
}

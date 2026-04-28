import { useEffect, useState } from 'react';
import { useBooking } from '@/hooks/useBooking';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Testimonial } from '@/types';
import { mockTestimonials } from '@/mock/testimonials';
import { SALON_INFO } from '@/constants';
import { Star } from 'lucide-react';
import heroImg from '@/assets/hero-salon.jpg';
import salonInterior from '@/assets/about-salon.jpg';

export default function HomePage() {
  const { dispatch } = useBooking();

  useEffect(() => {
    document.title = 'Studio Neo | Salão de Beleza';
  }, []);

  return (
    <div>
      <HeroSection onBook={() => dispatch({ type: 'OPEN_MODAL' })} />
      <TestimonialsSection />
      <GalleryPreview />
    </div>
  );
}

function HeroSection({ onBook }: { onBook: () => void }) {
  const ref = useScrollReveal();

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Studio Neo" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
      </div>
      <div ref={ref} className="relative container-salon section-padding scroll-reveal">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 leading-tight">
            Realce sua <span className="text-gold italic">beleza</span> natural
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 font-light leading-relaxed">
            Bem-vinda ao Studio Neo. Um espaço dedicado a transformar e cuidar de você com elegância e profissionalismo.
          </p>
          <button onClick={onBook} className="btn-gold text-lg px-8 py-4">
            Agendar Horário
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useScrollReveal();
  const [current, setCurrent] = useState(0);
  const items = mockTestimonials;

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section className="section-padding">
      <div ref={ref} className="container-salon scroll-reveal">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">O que nossas clientes dizem</h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="overflow-hidden">
            <div className="transition-all duration-500" key={current}>
              <div className="text-center p-8">
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: items[current].rating }).map((_, i) => (
                    <Star key={i} size={18} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-lg italic text-muted-foreground mb-4 leading-relaxed">"{items[current].comment}"</p>
                <p className="font-display font-bold">{items[current].name}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-gold' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  const ref = useScrollReveal();
  const images = [heroImg, salonInterior];

  return (
    <section className="section-padding bg-offwhite">
      <div ref={ref} className="container-salon scroll-reveal">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Nosso Espaço</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...images, ...images].map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
              <img src={img} alt={`Galeria ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

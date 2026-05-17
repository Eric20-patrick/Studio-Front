import { useEffect, useState } from "react";
import Link from "next/link";
import { useBooking } from "@/hooks/useBooking";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { mockTestimonials } from "@/mock/testimonials";
import { Star, Calendar, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/hero.png";
import g1 from "../assets/G1.png";
import g2 from "../assets/G2.jpg";
import g4 from "../assets/G4.png";
import Image from "next/image";

export default function HomePage() {
  const { dispatch } = useBooking();

  useEffect(() => {
    document.title = "Studio Neo | Salão de Beleza";
  }, []);

  return (
    <div>
      <HeroSection onBook={() => dispatch({ type: "OPEN_MODAL" })} />
      <TestimonialsSection />
      <GalleryPreview />
    </div>
  );
}

/* ───────── HERO ───────── */
interface HeroSectionProps {
  onBook: () => void;
}

function HeroSection({ onBook }: HeroSectionProps) {
  const ref = useScrollReveal();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={hero}
          alt="Studio Neo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      </div>

      <div
        ref={ref}
        className="relative container-salon section-padding scroll-reveal"
      >
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Realce sua <span className="text-gold italic">beleza</span> natural
          </h1>

          <p className="text-lg text-white/80 mb-10 font-light leading-relaxed">
            Bem-vinda ao Studio Neo. Um espaço dedicado a transformar e cuidar
            de você com elegância e profissionalismo.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onBook}
              className="group inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-black font-bold px-7 py-4 rounded-xl transition-all duration-300 hover:shadow-xl"
            >
              <Calendar size={18} />
              Agendar Horário
            </button>

            <Link
              href="/servicos"
              className="group inline-flex items-center gap-2 text-white font-medium px-7 py-4 rounded-xl border border-white/20 hover:border-gold/60 hover:text-gold transition-all duration-300"
            >
              Ver serviços
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── TESTIMONIALS ───────── */
function TestimonialsSection() {
  const ref = useScrollReveal();
  const [current, setCurrent] = useState(0);
  const items = mockTestimonials;

  useEffect(() => {
    if (!items.length) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % items.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="section-padding bg-white">
      <div ref={ref} className="container-salon scroll-reveal">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-3">
            O que nossas clientes dizem
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center" key={current}>
            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: items[current].rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-gold text-gold" />
              ))}
            </div>

            <p className="text-lg italic text-muted-foreground mb-5 leading-relaxed">
              "{items[current].comment}"
            </p>

            <p className="font-display font-bold text-black">
              {items[current].name}
            </p>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Ver depoimento ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-gold w-8" : "bg-muted w-2 hover:bg-gold/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── GALLERY PREVIEW ───────── */
function GalleryPreview() {
  const ref = useScrollReveal();
  const images = [hero, g1, g2, g4];

  return (
    <section className="section-padding bg-[#faf8f5]">
      <div ref={ref} className="container-salon scroll-reveal">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-3">
            Nosso Espaço
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <Link
              href="/galeria"
              key={i}
              className="aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <img
                src={img.src}
                alt="Galeria do Studio Neo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-gold-dark font-bold text-sm hover:gap-3 transition-all duration-300"
          >
            Ver galeria completa
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

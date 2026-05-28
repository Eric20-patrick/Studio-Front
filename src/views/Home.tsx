import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useBooking } from '@/hooks/useBooking';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  Calendar,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import hero from '@/assets/hero.png';
import g1 from '../assets/G1.png';
import g2 from '../assets/G2.png';
import g3 from '../assets/G3.png';
import g4 from '../assets/G4.png';
import g5 from '../assets/G5.png';
import serviceHair from '@/assets/service-hair.png';
import serviceNails from '@/assets/service-nails.png';
import serviceMakeup from '@/assets/service-makeup.png';
import Image from 'next/image';

export default function HomePage() {
  const { dispatch } = useBooking();

  useEffect(() => {
    document.title = 'Salão de Beleza | Realce sua beleza natural';
  }, []);

  return (
    <div className="bg-[#faf8f5] text-foreground min-h-screen">
      <HeroSection onBook={() => dispatch({ type: 'OPEN_MODAL' })} />
      <FeaturesSection />
      <FeaturedServicesSection />
      <GalleryPreview />
    </div>
  );
}

/* ───────── 1. HERO (Fundo Escuro Integrado Centrado) ───────── */
interface HeroSectionProps {
  onBook: () => void;
}

function HeroSection({ onBook }: HeroSectionProps) {
  const ref = useScrollReveal();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden animate-fade-in">
      {/* Imagem de Fundo Completa com Overlay para mesclar com a Navbar preta */}
      <div className="absolute inset-0">
        <Image src={hero} alt="Salão de Beleza" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/75 to-black/45" />
      </div>

      <div
        ref={ref}
        className="relative container-salon section-padding scroll-reveal max-w-4xl text-center px-4 mx-auto flex flex-col items-center justify-center"
      >
        {/* Selo Dourado de Topo */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-6">
          <Sparkles size={14} className="text-gold" />
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Salão de Beleza
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight uppercase tracking-wide">
          Realce sua <br className="hidden sm:inline" />
          <span className="text-gold">BELEZA NATURAL</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-10 font-light leading-relaxed max-w-xl">
          Estética e Cuidado Exclusivo para Você.
        </p>

        <div className="flex justify-center">
          <button
            onClick={onBook}
            className="group inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-black font-bold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-xl active:scale-95 uppercase tracking-wider text-sm"
          >
            <Calendar size={18} />
            AGENDAR EXPERIÊNCIA
          </button>
        </div>
      </div>
    </section>
  );
}

/* ───────── 2. DIFERENCIAIS (Grid Responsivo de 4 colunas com SVGs Premium) ───────── */
function FeaturesSection() {
  const ref = useScrollReveal();

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-dark">
          <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 12.5L7.5 21L12 19L16.5 21L15 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 8L11.5 9L13.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Especialistas Certificados',
      desc: 'Profissionais altamente qualificados e em constante atualização com as tendências globais.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-dark">
          <rect x="7" y="9" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 9V5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5V9" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 6L6 5L5 4L4 5L5 6Z" fill="currentColor" />
          <path d="M19 8L20 7L19 6L18 7L19 8Z" fill="currentColor" />
        </svg>
      ),
      title: 'Produtos Premium',
      desc: 'Trabalhamos apenas com as melhores marcas internacionais para garantir resultados excepcionais.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-dark">
          <path d="M12 22C12 22 7 17 7 13C7 10.2386 9.23858 8 12 8C14.7614 8 17 10.2386 17 13C17 17 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 22C12 22 3 19 3 13C3 9 7 9 7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 22C12 22 21 19 21 13C21 9 17 9 17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="5" r="1" fill="currentColor" />
          <path d="M11 5H13" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      title: 'Atendimento Exclusivo',
      desc: 'Experiência de cuidado personalizada em um ambiente acolhedor e dedicado a você.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-dark">
          <path d="M12 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13V20H9V13Z" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
        </svg>
      ),
      title: 'Ambiente Sofisticado',
      desc: 'Um espaço planejado para o seu conforto, proporcionando uma experiência de bem-estar única.',
    },
  ];

  return (
    <section className="section-padding bg-[#faf8f5] relative overflow-hidden border-y border-gold/10">
      <div ref={ref} className="container-salon px-4 scroll-reveal">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
          {features.map((feat, i) => (
            <div
              key={i}
              className="relative p-6 bg-white rounded-2xl border border-gold/10 group transition-all duration-300 hover:border-gold/30 hover:shadow-md text-center flex flex-col items-center justify-between min-h-[220px]"
            >
              <div className="p-4 rounded-full bg-gold/10 mb-4 text-gold-dark">{feat.icon}</div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-base font-display font-bold text-black mb-2 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-xs font-light">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 3. VITRINE DE SERVIÇOS (Grid Responsivo com Bordas Douradas Sólidas) ───────── */
function FeaturedServicesSection() {
  const ref = useScrollReveal();

  const categories = [
    {
      name: 'CABELO E ESTILO',
      img: serviceHair,
      desc: 'Cortes modernos, mechas, colorações e tratamentos personalizados para realçar o brilho e a força dos seus fios.',
    },
    {
      name: 'ESTÉTICA FACIAL',
      img: serviceMakeup,
      desc: 'Tratamentos especializados, maquiagem profissional e cuidados faciais para renovar e iluminar a sua pele.',
    },
    {
      name: 'CUIDADOS CORPORAIS',
      img: serviceNails,
      desc: 'Manicure, pedicure, alongamentos e massagens relaxantes para o seu bem-estar completo.',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div ref={ref} className="container-salon scroll-reveal">
        <div className="text-center mb-16">
          <span className="text-gold-dark font-semibold text-xs tracking-wider uppercase mb-2 block">
            Nossos Destaques
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-4">
            Serviços Principais
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Grid de Cards com 1 coluna no mobile e 3 colunas no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 border-gold flex flex-col"
            >
              {/* Imagem do Serviço */}
              <div className="relative aspect-video overflow-hidden shrink-0">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6 flex flex-col flex-1 relative text-center items-center justify-between">
                {/* Círculo dourado decorativo no canto */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-12 translate-x-12 group-hover:bg-gold/10 transition-colors duration-500" />

                <div className="flex-1 flex flex-col items-center">
                  <h3 className="font-display font-bold text-lg mb-2 text-black relative uppercase tracking-wider">
                    {cat.name}
                  </h3>

                  {/* Pequeno ícone dourado no centro */}
                  <div className="flex justify-center my-3 text-gold">
                    <Sparkles size={16} />
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light max-w-xs">
                    {cat.desc}
                  </p>
                </div>

                <Link
                  href="/servicos"
                  className="w-full text-center text-xs py-3 rounded-xl block font-bold transition-all duration-300 bg-black text-gold border border-gold hover:bg-gold hover:text-black hover:shadow-lg uppercase tracking-wider mt-4"
                >
                  Saiba Mais
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 4. GALERIA DE FOTOS (Grid Responsivo Estilo Galeria/Zoom) ───────── */
function GalleryPreview() {
  const ref = useScrollReveal();
  const images = [hero, g1, g2, g3, g4, g5];
  const [lightbox, setLightbox] = useState<number | null>(null);

  const navigate = useCallback(
    (dir: number) => {
      setLightbox((cur) => (cur === null ? cur : (cur + dir + images.length) % images.length));
    },
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      else if (e.key === 'ArrowLeft') navigate(-1);
      else if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, navigate]);

  return (
    <section className="section-padding bg-[#faf8f5] border-t border-gold/10">
      <div ref={ref} className="container-salon scroll-reveal">
        <div className="text-center mb-16">
          <span className="text-gold-dark font-semibold text-xs tracking-wider uppercase mb-2 block">
            Nosso Espaço
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-4">
            Conheça o Salão
          </h2>
          <div className="w-12 h-0.5 bg-gold mx-auto" />
        </div>

        {/* Grid de Imagens com 2 colunas no mobile e 3 colunas no tablet/desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setLightbox(i)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-500 border border-gold/10 hover:border-gold/30"
            >
              <Image
                src={img}
                alt={`Foto ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                placeholder="blur"
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />

              {/* Efeito Hover de Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Ícone de lupa centralizado em dourado */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-50">
                <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                  <ZoomIn size={20} className="text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-gold-dark font-bold text-sm hover:gap-3 transition-all duration-300"
          >
            Ver galeria completa
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 backdrop-blur-md animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-gold/80 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
            onClick={() => setLightbox(null)}
            aria-label="Fechar"
          >
            <X size={22} />
          </button>

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

          <div
            className="relative max-w-[90vw] max-h-[85vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-gold-dark/30 rounded-2xl blur-lg opacity-50" />
            <Image
              src={images[lightbox]!}
              alt={`Foto ${lightbox + 1}`}
              sizes="90vw"
              placeholder="blur"
              className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>

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
    </section>
  );
}

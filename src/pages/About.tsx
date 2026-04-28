import { useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import aboutImg from '@/assets/about-salon.jpg';
import heroImg from '@/assets/hero-salon.jpg';

const sections = [
  { title: 'Nossa História', text: 'Fundado com a paixão de transformar vidas através da beleza, o Studio Neo nasceu do sonho de criar um espaço onde cada mulher pudesse se sentir única e especial. Há mais de 10 anos, temos o privilégio de fazer parte de momentos especiais na vida das nossas clientes.', img: aboutImg },
  { title: 'Nossos Valores', text: 'Acreditamos que a beleza vai além da aparência. É sobre confiança, autoestima e bem-estar. Cada serviço é realizado com dedicação, respeito e atenção aos detalhes, utilizando os melhores produtos do mercado.', img: heroImg },
  { title: 'Nosso Espaço', text: 'Um ambiente acolhedor e sofisticado, pensado para proporcionar a melhor experiência. Do aroma suave à música ambiente, cada detalhe foi cuidadosamente planejado para que você se sinta em casa.', img: aboutImg },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = 'Quem Somos | Studio Neo';
  }, []);

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img src={aboutImg} alt="Studio Neo" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/70" />
        <h1 className="relative text-4xl md:text-5xl font-display font-bold text-primary-foreground">Quem Somos</h1>
      </section>

      {sections.map((s, i) => (
        <AboutSection key={i} {...s} reverse={i % 2 === 1} />
      ))}
    </div>
  );
}

function AboutSection({ title, text, img, reverse }: { title: string; text: string; img: string; reverse: boolean }) {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className={`section-padding scroll-reveal ${reverse ? 'bg-offwhite' : ''}`}>
      <div className={`container-salon flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground leading-relaxed">{text}</p>
        </div>
        <div className="flex-1">
          <img src={img} alt={title} className="rounded-2xl shadow-lg w-full object-cover aspect-video" loading="lazy" width={600} height={400} />
        </div>
      </div>
    </section>
  );
}

import { useEffect } from "react";
import type { StaticImageData } from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { assetSrc } from "@/lib/assetSrc";
import { Heart, BookOpen, Sparkles, Award } from "lucide-react";
import neo from "@/assets/neo.png";
import valores from "@/assets/valores.png";
import historia from "@/assets/historia.png";
import hero from "../assets/hero.png";
import Image from "next/image";

const sections = [
  {
    title: "Nossa História",
    text: "Bem-vindo ao nosso Salão de Beleza, um espaço elegante e cheio de estilo, pensado para toda a família, com atendimento exclusivo e de qualidade.",
    img: neo,
    icon: BookOpen,
    label: "Início",
  },
  {
    title: "Nossos Valores",
    text: "Fundado com a paixão de transformar vidas através da beleza, nosso salão nasceu do sonho de criar um espaço onde cada mulher pudesse se sentir única e especial. Temos o privilégio de fazer parte de momentos especiais na vida das nossas clientes.",
    img: valores,
    icon: Heart,
    label: "Paixão",
  },
  {
    title: "Nossos Valores",
    text: "Acreditamos que a beleza vai além da aparência. É sobre confiança, autoestima e bem-estar. Cada serviço é realizado com dedicação, respeito e atenção aos detalhes, utilizando os melhores produtos do mercado.",
    img: historia,
    icon: Award,
    label: "Excelência",
  },
];

export default function AboutPage() {
  useEffect(() => {
    document.title = "Quem Somos | Salão de Beleza";
  }, []);

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src={assetSrc(hero)}
          alt="Salão de Beleza"
          className="absolute inset-0 w-full h-full object-cover"
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-4">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Nossa Essência
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
            Quem Somos
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
        </div>
      </section>

      {sections.map((s, i) => (
        <AboutSection key={i} {...s} index={i} reverse={i % 2 === 1} />
      ))}
    </div>
  );
}

function AboutSection({
  title,
  text,
  img,
  reverse,
  index,
  icon: Icon,
  label,
}: {
  title: string;
  text: string;
  img: StaticImageData;
  reverse: boolean;
  index: number;
  icon: typeof Heart;
  label: string;
}) {
  const ref = useScrollReveal();
  const isAlt = index % 2 === 1;

  return (
    <section
      ref={ref}
      className={`section-padding scroll-reveal relative overflow-hidden ${
        isAlt ? "bg-white" : "bg-[#faf8f5]"
      }`}
    >
      {/* Decorações de fundo */}
      <div
        className={`absolute top-0 ${reverse ? "left-0" : "right-0"} w-96 h-96 bg-gold/5 rounded-full ${reverse ? "-translate-x-48" : "translate-x-48"} -translate-y-48 pointer-events-none`}
      />
      <div
        className={`absolute bottom-0 ${reverse ? "right-0" : "left-0"} w-72 h-72 bg-gold/5 rounded-full ${reverse ? "translate-x-36" : "-translate-x-36"} translate-y-36 pointer-events-none`}
      />

      <div
        className={`container-salon flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16 relative`}
      >
        {/* Texto */}
        <div className="flex-1 relative">
          {/* Número grande de fundo */}
          <div className="absolute -top-8 -left-2 text-[120px] md:text-[160px] font-display font-bold text-gold/10 leading-none select-none pointer-events-none">
            0{index + 1}
          </div>

          <div className="relative">
            {/* Badge com ícone */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-4">
              <Icon size={14} className="text-gold-dark" />
              <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                {label}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-black">
              {title}
            </h2>

            {/* Linha decorativa */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mb-5" />

            <p
              className="text-muted-foreground leading-relaxed text-base break-words"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            >
              {text}
            </p>
          </div>
        </div>

        {/* Imagem */}
        <div className="flex-1 w-full">
          <div className="relative group">
            {/* Moldura dourada brilhante */}
            <div className="absolute -inset-2 bg-gradient-to-br from-gold/30 via-gold/10 to-gold-dark/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Card decorativo atrás da imagem */}
            <div
              className={`absolute inset-0 bg-gold/20 rounded-2xl transform ${reverse ? "-rotate-3" : "rotate-3"} group-hover:${reverse ? "-rotate-6" : "rotate-6"} transition-transform duration-500`}
            />

            <img
              src={assetSrc(img)}
              alt={title}
              className="relative rounded-2xl shadow-2xl w-full object-cover aspect-video transition-transform duration-500 group-hover:scale-[1.02] ring-1 ring-gold/20"
              loading="lazy"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Procedure } from "@/types";
import { getProcedures } from "@/services/procedureService";
import { Clock, Calendar } from "lucide-react";
import { formatDuration } from "@/utils";
import { assetSrc } from "@/lib/assetSrc";
import type { StaticImageData } from "next/image";
import serviceHair from "@/assets/service-hair.jpg";
import serviceNails from "@/assets/service-nails.jpg";
import serviceMakeup from "@/assets/service-makeup.jpg";
import heroServices from "../assets/heroS.png";

const categoryImages: Record<string, StaticImageData> = {
  Cabelo: serviceHair,
  Unhas: serviceNails,
  Maquiagem: serviceMakeup,
  Estética: serviceMakeup,
};

export default function ServicesPage() {
  const { dispatch } = useBooking();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = "Nossos Serviços | Studio Neo";
    getProcedures().then(setProcedures);
  }, []);

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img
          src={assetSrc(heroServices)}
          alt="Studio Neo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/70" />
        <h1 className="relative text-4xl md:text-5xl font-display font-bold text-primary-foreground">
          Nossos Serviços
        </h1>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {procedures.map((proc) => (
              <div
                key={proc.id}
                className="card-salon group bg-white border-none shadow-xl"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={assetSrc(categoryImages[proc.category] || serviceHair)}
                    alt={proc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-1 text-black">
                    {proc.name}
                  </h3>
                  {proc.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3 ">
                      {proc.description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-1 text-xs  font-medium px-3 py-1 rounded-full bg-gold/15 text-gold-dark mb-4">
                    <Clock size={12} /> {formatDuration(proc.duration)}
                  </div>
                  <button
                    onClick={() => dispatch({ type: "OPEN_MODAL" })}
                    className="btn-gold w-full text-sm flex items-center justify-center gap-2"
                  >
                    <Calendar size={14} /> Marcar Horário
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

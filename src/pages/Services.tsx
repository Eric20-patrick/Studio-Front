import { useEffect, useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Procedure } from "@/types";
import { getProcedures } from "@/services/procedureService";
import { Clock, Calendar } from "lucide-react";
import { formatDuration } from "@/utils";
import serviceHair from "@/assets/service-hair.jpg";
import serviceNails from "@/assets/service-nails.jpg";
import serviceMakeup from "@/assets/service-makeup.jpg";

const categoryImages: Record<string, string> = {
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
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden bg-primary">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
          Nossos Serviços
        </h1>
      </section>

      <section className="section-padding">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {procedures.map((proc) => (
              <div key={proc.id} className="card-salon group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={categoryImages[proc.category] || serviceHair}
                    alt={proc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    width={400}
                    height={300}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-1">
                    {proc.name}
                  </h3>
                  {proc.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                      {proc.description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gold/15 text-gold-dark mb-4">
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

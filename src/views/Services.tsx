import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const categoryImages: Record<string, StaticImageData> = {
  Cabelo: serviceHair,
  Unhas: serviceNails,
  Maquiagem: serviceMakeup,
  Estética: serviceMakeup,
};

export default function ServicesPage() {
  const { dispatch } = useBooking();
  const [selectedService, setSelectedService] = useState<Procedure | null>(null);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = "Nossos Serviços | Studio Neo";
  }, []);

  const { data: procedures = [] } = useQuery({
    queryKey: ['publicProcedures'],
    queryFn: () => getProcedures().catch(() => [] as Procedure[]),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const handleOpenBooking = (proc: Procedure) => {
    dispatch({ type: "SET_PROCEDURE", payload: proc });
    dispatch({ type: "OPEN_MODAL" });
    setSelectedService(null); // Fecha o modal de detalhes suavemente ao abrir o fluxo
  };

  interface ProcedureCardProps {
    proc: Procedure;
    onBook: () => void;
  }

  const ProcedureCard = ({ proc, onBook }: ProcedureCardProps) => {
    const isLong = proc.description && proc.description.length > 120;

    return (
      <div className="card-salon group bg-white border-none shadow-xl flex flex-col">
        <div className="aspect-video overflow-hidden shrink-0">
          <img
            src={assetSrc(categoryImages[proc.category] || serviceHair)}
            alt={proc.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            width={400}
            height={300}
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg mb-1 text-black">
            {proc.name}
          </h3>
          {proc.description && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {proc.description}
              </p>
              {isLong && (
                <button
                  onClick={() => setSelectedService(proc)}
                  className="text-xs font-bold text-gold-dark mt-1 hover:underline focus:outline-none"
                >
                  Ler mais →
                </button>
              )}
            </div>
          )}
          <div className="mt-auto pt-4">
            <div className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gold/15 text-gold-dark mb-4">
              <Clock size={12} /> {formatDuration(proc.duration)}
            </div>
            <button
              onClick={onBook}
              className="btn-gold w-full text-sm flex items-center justify-center gap-2"
            >
              <Calendar size={14} /> Marcar Horário
            </button>
          </div>
        </div>
      </div>
    );
  };

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
              <ProcedureCard
                key={proc.id}
                proc={proc}
                onBook={() => handleOpenBooking(proc)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 👑 MODAL 100% COMPLETO COM BOTÃO DE AGENDAMENTO */}
      <Dialog
        open={selectedService !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-xl bg-[#FAF8F5] border-none p-6 md:p-10 rounded-2xl shadow-2xl block box-border">
          {selectedService && (
            <div className="w-full overflow-hidden flex flex-col">
              <DialogHeader className="text-left space-y-1 block">
                <DialogTitle className="font-display text-2xl md:text-3xl font-bold text-black tracking-tight pr-6 break-words whitespace-normal">
                  {selectedService.name}
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground text-left pt-1 block">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} aria-hidden />
                    Duração: {formatDuration(selectedService.duration)} • {selectedService.category}
                  </span>
                </DialogDescription>
              </DialogHeader>

              {/* Texto com rolagem interna segura se for muito longo */}
              <div className="mt-5 text-[15px] md:text-base text-[#2C2A27] whitespace-pre-line leading-relaxed tracking-wide break-words max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                {selectedService.description}
              </div>

              {/* Container inferior do botão alinhado com o design */}
              <div className="mt-8 pt-4 border-t border-muted/30">
                <button
                  onClick={() => handleOpenBooking(selectedService)}
                  className="btn-gold w-full text-sm flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Calendar size={16} /> Marcar Horário para Este Serviço
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
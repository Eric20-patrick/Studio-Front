import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBooking } from "@/hooks/useBooking";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Procedure } from "@/types";
import { getProcedures } from "@/services/procedureService";
import { Clock, Calendar, Sparkles, ArrowRight } from "lucide-react";
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
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gold/10 hover:border-gold/30 flex flex-col">
        {/* Imagem com overlay */}
        <div className="relative aspect-video overflow-hidden shrink-0">
          <img
            src={assetSrc(categoryImages[proc.category] || serviceHair)}
            alt={proc.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            width={400}
            height={300}
          />
          {/* Overlay gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />

          {/* Badge de categoria no topo */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gold-dark uppercase tracking-wider shadow-md">
              <Sparkles size={10} />
              {proc.category}
            </span>
          </div>

          {/* Badge de duração no canto inferior */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-[10px] font-bold text-white shadow-md">
              <Clock size={10} /> {formatDuration(proc.duration)}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col flex-1 relative">
          {/* Decoração dourada de fundo */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -translate-y-12 translate-x-12 group-hover:bg-gold/10 transition-colors duration-500" />

          <h3 className="font-display font-bold text-lg mb-2 text-black relative">
            {proc.name}
          </h3>

          {/* Linha decorativa */}
          <div className="w-10 h-0.5 bg-gradient-to-r from-gold to-transparent mb-3 group-hover:w-16 transition-all duration-300" />

          {proc.description && (
            <div className="mb-3 relative">
              <p
                className="text-sm text-muted-foreground leading-relaxed line-clamp-3 break-words"
                style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
              >
                {proc.description}
              </p>
              {isLong && (
                <button
                  onClick={() => setSelectedService(proc)}
                  className="text-xs font-bold text-gold-dark mt-2 inline-flex items-center gap-1 hover:gap-2 transition-all duration-200 hover:text-gold focus:outline-none"
                >
                  Ler mais
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          )}

          <div className="mt-auto pt-4 relative">
            <button
              onClick={onBook}
              className="btn-gold w-full text-sm flex items-center justify-center gap-2 group/btn hover:gap-3 transition-all duration-300"
            >
              <Calendar size={14} />
              Marcar Horário
              <ArrowRight size={14} className="opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
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
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-4">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Cuidados Exclusivos
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
            Nossos Serviços
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-[#faf8f5] to-white">
        <div ref={ref} className="container-salon scroll-reveal">
          {/* Subtítulo */}
          <div className="text-center mb-10">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa seleção de tratamentos especializados, criados para realçar
              sua beleza natural com técnica, cuidado e dedicação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <DialogContent className="w-[calc(100%-2rem)] max-w-xl bg-white border-none p-0 rounded-2xl shadow-2xl overflow-hidden">
          {selectedService && (
            <div className="w-full flex flex-col max-h-[85vh]">
              {/* Header com imagem de fundo */}
              <div className="relative h-32 md:h-40 flex-shrink-0 overflow-hidden">
                <img
                  src={assetSrc(categoryImages[selectedService.category] || serviceHair)}
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-primary/30" />

                {/* Badge categoria */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold text-gold-dark uppercase tracking-wider shadow-md">
                    <Sparkles size={10} />
                    {selectedService.category}
                  </span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 flex flex-col overflow-hidden">
                <DialogHeader className="text-left space-y-2 block">
                  <DialogTitle className="font-display text-2xl md:text-3xl font-bold text-black tracking-tight pr-6 break-words whitespace-normal">
                    {selectedService.name}
                  </DialogTitle>

                  {/* Linha decorativa */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent" />

                  <DialogDescription className="text-sm text-muted-foreground text-left pt-1 block">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/10 text-gold-dark font-semibold text-xs">
                        <Clock size={12} />
                        {formatDuration(selectedService.duration)}
                      </span>
                    </span>
                  </DialogDescription>
                </DialogHeader>

                {/* Seção "Sobre o serviço" */}
                <div className="mt-5 flex-1 overflow-hidden flex flex-col">
                  <p className="text-xs font-bold text-gold-dark uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-4 h-px bg-gold" />
                    Sobre este serviço
                    <span className="flex-1 h-px bg-gold/20" />
                  </p>
                  <div
                    className="text-[15px] md:text-base text-[#2C2A27] whitespace-pre-line leading-relaxed tracking-wide break-words overflow-y-auto pr-2 flex-1"
                    style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    {selectedService.description}
                  </div>
                </div>

                {/* Botão de agendar */}
                <div className="mt-6 pt-4 border-t border-gold/20 flex-shrink-0">
                  <button
                    onClick={() => handleOpenBooking(selectedService)}
                    className="btn-gold w-full text-sm flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:gap-3 group"
                  >
                    <Calendar size={16} />
                    Marcar Horário para Este Serviço
                    <ArrowRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
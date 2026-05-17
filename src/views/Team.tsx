import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Professional } from "@/types";
import { getProfessionals } from "@/services/professionalService";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Clock, User } from "lucide-react";
import heroImg from "../assets/hero-salon.jpg";
import Image from "next/image";
import { Heart, BookOpen, Sparkles, Award } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TeamPage() {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = "Nossa Equipe | Studio Neo";
  }, []);

  const { data: team = [], isLoading: loading } = useQuery({
    queryKey: ['teamProfessionals'],
    queryFn: () => getProfessionals().catch(() => [] as Professional[]),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Group by first specialty (each pro has an array)
  const allSpecialties = Array.from(
    new Set(
      team.flatMap((p) => p.specialties || (p.specialty ? [p.specialty] : [])),
    ),
  );

  const MAX_DESCRIPTION_LENGTH = 120;
  const shouldTruncate = (text: string) => text.length > MAX_DESCRIPTION_LENGTH;
  const truncateText = (text: string) =>
    shouldTruncate(text) ? text.substring(0, MAX_DESCRIPTION_LENGTH) + '...' : text;

  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImg}
          alt="Studio Neo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-4">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Nossa Equipe
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
            Conheça nossa equipe
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
        </div>
      </section>

      <section className="section-padding bg-[#faf8f5]">
        <div ref={ref} className="container-salon scroll-reveal space-y-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-salon p-6 ">
                  <div className="w-24 h-24 rounded-full bg-muted animate-pulse mx-auto mb-4 " />
                  <div className="h-4 bg-muted animate-pulse rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            allSpecialties.map((specialty) => (
              <div key={specialty}>
                <h2 className="text-2xl font-display font-bold text-gold mb-2 ">
                  {specialty}
                </h2>
                <div className="h-px bg-gold/30 mb-6 " />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                  {team
                    .filter(
                      (p) =>
                        (p.specialties || []).includes(specialty) ||
                        p.specialty === specialty,
                    )
                    .map((prof) => (
                      <div
                        key={prof.id}
                        className="group relative bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gold/10 hover:border-gold/30 overflow-hidden"
                      >
                        {/* Decoração de fundo dourada */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-gold/10 transition-colors duration-500" />

                        {/* Avatar com anel dourado */}
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                          <div className="relative w-28 h-28 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                            {prof.avatarUrl ? (
                              <img
                                src={prof.avatarUrl}
                                alt={prof.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <User size={40} className="text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Nome */}
                        <h3 className="font-display font-bold text-black text-lg relative">
                          {prof.name}
                        </h3>

                        {/* Linha decorativa dourada */}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent my-3 group-hover:w-20 transition-all duration-300" />

                        {/* Badges de especialidades */}
                        {(prof.specialties || []).length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center mb-3">
                            {(prof.specialties || []).slice(0, 2).map((spec) => (
                              <span
                                key={spec}
                                className="px-2 py-0.5 bg-gold/10 text-gold-dark text-[10px] rounded-full border border-gold/20 font-medium"
                              >
                                {spec}
                              </span>
                            ))}
                            {(prof.specialties || []).length > 2 && (
                              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full font-medium">
                                +{(prof.specialties || []).length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Descrição */}
                        {(prof.bio || prof.description) && (
                          <div className="flex flex-col items-center gap-3 mt-1 w-full min-w-0 relative">
                            <p
                              className="text-xs text-muted-foreground leading-relaxed text-black/70 break-words w-full"
                              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                            >
                              {truncateText(prof.description || prof.bio || '')}
                            </p>
                            {shouldTruncate(prof.description || prof.bio || '') && (
                              <button
                                onClick={() => setSelectedProfessional(prof)}
                                className="text-xs text-gold-dark font-bold inline-flex items-center gap-1 hover:gap-2 transition-all duration-200 hover:text-gold"
                              >
                                Ler mais
                                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Dialog
        open={selectedProfessional !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProfessional(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden sm:rounded-2xl flex flex-col p-0">
          {selectedProfessional && (
            <>
              {/* Header com gradiente dourado de fundo */}
              <div className="relative bg-gradient-to-br from-gold/10 via-gold/5 to-transparent pt-8 pb-6 px-6 flex-shrink-0">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full -translate-y-20 translate-x-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full translate-y-16 -translate-x-16" />

                <DialogHeader className="relative">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold to-gold-dark rounded-full blur-lg opacity-40" />
                      <div className="relative w-32 h-32 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-xl">
                        {selectedProfessional.avatarUrl ? (
                          <img
                            src={selectedProfessional.avatarUrl}
                            alt={selectedProfessional.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={48} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogTitle className="font-display text-center text-2xl text-black">
                    {selectedProfessional.name}
                  </DialogTitle>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-2" />
                </DialogHeader>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 space-y-5">
                <div>
                  <p className="text-xs font-bold text-gold-dark uppercase tracking-widest mb-3 text-center">
                    ✦ Especialidades ✦
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {(selectedProfessional.specialties || []).length > 0 ? (
                      (selectedProfessional.specialties || []).map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 bg-gradient-to-r from-gold/10 to-gold/5 text-gold-dark text-xs rounded-full border border-gold/30 font-medium shadow-sm"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Nenhuma especialidade cadastrada
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gold/20 pt-5">
                  <p className="text-xs font-bold text-gold-dark uppercase tracking-widest mb-3 text-center">
                    ✦ Sobre ✦
                  </p>
                  <p
                    className="text-sm leading-relaxed text-black/80 whitespace-pre-wrap break-words text-center"
                    style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    {selectedProfessional.description || selectedProfessional.bio || 'Sem descrição disponível'}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

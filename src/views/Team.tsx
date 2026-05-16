import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Professional } from "@/types";
import { getProfessionals } from "@/services/professionalService";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Clock, User } from "lucide-react";
import heroImg from "../assets/hero-salon.jpg";
import Image from "next/image";
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
        <div className="absolute inset-0 bg-primary/70" />
        <h1 className="relative text-4xl md:text-5xl font-display font-bold text-primary-foreground justify-center ">
          Conheça nossa equipe
        </h1>
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
                        className="card-salon p-6 flex flex-col items-center text-center bg-white border-none shadow-xl"
                      >
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden bg-zinc-500">
                          {prof.avatarUrl ? (
                            <img
                              src={prof.avatarUrl}
                              alt={prof.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={32} className="text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="font-display font-bold text-black font-bold">
                          {prof.name}
                        </h3>
                        {(prof.bio || prof.description) && (
                          <div className="flex flex-col items-center gap-2 mt-2 w-full">
                            <p className="text-xs text-muted-foreground leading-relaxed text-black">
                              {truncateText(prof.description || prof.bio || '')}
                            </p>
                            {shouldTruncate(prof.description || prof.bio || '') && (
                              <button
                                onClick={() => setSelectedProfessional(prof)}
                                className="text-xs text-gold font-bold hover:underline"
                              >
                                Ler mais →
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden sm:rounded-lg">
          {selectedProfessional && (
            <div className="flex flex-col h-full">
              <DialogHeader className="flex-shrink-0 pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden bg-zinc-500">
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
                <DialogTitle className="font-display text-center">
                  {selectedProfessional.name}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 min-h-0 overflow-hidden">
                <div className="space-y-4 h-full overflow-y-auto pr-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Especialidades
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {(selectedProfessional.specialties || []).map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 bg-gold/10 text-gold-dark text-xs rounded-full border border-gold/20"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      Sobre
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed text-black whitespace-pre-wrap">
                      {selectedProfessional.description || selectedProfessional.bio || 'Sem descrição disponível'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Professional } from '@/types';
import { getProfessionals } from '@/services/professionalService';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Clock, User } from 'lucide-react';
import { formatWorkingHours } from '@/utils';

export default function TeamPage() {
  const [team, setTeam] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = 'Nossa Equipe | Studio Neo';
    getProfessionals()
      .then((data) => setTeam(data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  // Group by first specialty (each pro has an array)
  const allSpecialties = Array.from(new Set(team.flatMap((p) => p.specialties || (p.specialty ? [p.specialty] : []))));

  return (
    <div>
      <section className="relative h-[30vh] flex flex-col items-center justify-center bg-primary text-center px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-3">Conheça nossa equipe</h1>
        <p className="text-primary-foreground/70 text-lg max-w-lg">Pessoas que fazem acontecer com paixão, talento e dedicação</p>
      </section>

      <section className="section-padding">
        <div ref={ref} className="container-salon scroll-reveal space-y-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-salon p-6">
                  <div className="w-24 h-24 rounded-full bg-muted animate-pulse mx-auto mb-4" />
                  <div className="h-4 bg-muted animate-pulse rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            allSpecialties.map((specialty) => (
              <div key={specialty}>
                <h2 className="text-2xl font-display font-bold text-gold mb-2">{specialty}</h2>
                <div className="h-px bg-gold/30 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {team
                    .filter((p) => (p.specialties || []).includes(specialty) || p.specialty === specialty)
                    .map((prof) => (
                      <div key={prof.id} className="card-salon p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden">
                          {prof.avatarUrl ? (
                            <img src={prof.avatarUrl} alt={prof.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={32} className="text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="font-display font-bold">{prof.name}</h3>
                        {prof.bio && <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{prof.bio}</p>}
                        <div className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gold/15 text-gold-dark mt-2">
                          <Clock size={12} /> {formatWorkingHours(prof.workingHours)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

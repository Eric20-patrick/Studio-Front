import { useEffect, useState, useMemo } from "react";
import { useBooking } from "@/hooks/useBooking";
import {
  Period,
  AvailabilitySlot,
  ProfessionalAvailability,
  BookingItemSelection,
} from "@/types";
import { getAvailability } from "@/services/bookingService";
import { Calendar } from "@/components/ui/calendar";
import {
  isWeekday,
  toIsoDate,
  formatDate,
  formatTimeFromIso,
  getPeriodFromTime,
} from "@/utils";
import { Loader2 } from "lucide-react";

const PERIODS: { id: Period; label: string; icon: string; hours: string }[] = [
  { id: "manha", label: "Manhã", icon: "🌅", hours: "08:00 — 11:59" },
  { id: "tarde", label: "Tarde", icon: "🌇", hours: "12:00 — 20:00" },
];

// Ajuste na interface para aceitar arrays de leitura
interface SlotByProc {
  [procedureId: string]: ProfessionalAvailability[];
}

export default function StepDateTime() {
  const { state, dispatch } = useBooking();

  // Sincronização direta com o Contexto (Estado Global)
  const selectedDate = state.form.selectedDates[0];
  const selectedPeriod = state.form.selectedPeriods[0];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slotsByProc, setSlotsByProc] = useState<SlotByProc>({});
  const [selections, setSelections] = useState<Record<string, any>>({});

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d;
  }, []);

  useEffect(() => {
    if (!selectedDate || state.form.procedures.length === 0) {
      setSlotsByProc({});
      return;
    }

    setLoading(true);
    setError("");
    const dateStr = toIsoDate(selectedDate);

    Promise.all(
      state.form.procedures.map(async (proc) => {
        try {
          const res = await getAvailability({
            procedureId: proc.id,
            date: dateStr,
          });
          // Tipagem forçada para evitar erro de 'readonly []'
          const arr = (
            Array.isArray(res) ? res : []
          ) as ProfessionalAvailability[];
          return [proc.id, arr] as const;
        } catch (e) {
          return [proc.id, [] as ProfessionalAvailability[]] as const;
        }
      }),
    )
      .then((entries) => {
        const map: SlotByProc = {};
        entries.forEach(([id, arr]) => {
          map[id] = arr;
        });
        setSlotsByProc(map);
      })
      .catch(() => setError("Erro ao carregar horários disponíveis"))
      .finally(() => setLoading(false));
  }, [selectedDate, state.form.procedures]);

  useEffect(() => {
    if (!selectedDate || !selectedPeriod) return;

    const items: BookingItemSelection[] = state.form.procedures.map((proc) => {
      const sel = selections[proc.id];
      return {
        procedure: proc,
        date: toIsoDate(selectedDate),
        period: selectedPeriod,
        professionalId: sel?.professionalId,
        professionalName: sel?.professionalName,
        noPreference: !sel,
        startTime: sel?.startTime,
        endTime: sel?.endTime,
      };
    });

    dispatch({ type: "SET_ITEMS", payload: items });
  }, [
    selections,
    selectedDate,
    selectedPeriod,
    state.form.procedures,
    dispatch,
  ]);

  const handleDate = (d: Date | undefined) => {
    if (!d) return;
    // O Contexto agora substitui a data atual pela nova
    dispatch({ type: "ADD_DATE", payload: d });
    setSelections({});
  };

  const handlePeriod = (p: Period) => {
    if (selectedPeriod === p) return;
    if (selectedPeriod)
      dispatch({ type: "TOGGLE_PERIOD", payload: selectedPeriod });
    dispatch({ type: "TOGGLE_PERIOD", payload: p });
    setSelections({});
  };

  const filterSlotsByPeriod = (slots: AvailabilitySlot[]) => {
    if (!selectedPeriod) return slots;
    return slots.filter(
      (s) => getPeriodFromTime(s.startTime) === selectedPeriod,
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <section>
        <p className="text-sm text-muted-foreground mb-3 font-medium">
          Escolha a data:
        </p>
        <div className="bg-card rounded-2xl border border-border p-2 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDate}
            disabled={(d) => d < today || d > maxDate || !isWeekday(d)}
            className="rounded-lg mx-auto"
            classNames={{
              day_today:
                "bg-transparent font-semibold text-foreground ring-1 ring-border aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:ring-0",
            }}
            initialFocus
          />
        </div>
        {selectedDate && (
          <div className="mt-3 p-2 bg-gold/10 border border-gold/20 rounded-xl text-center">
            <p className="text-xs font-bold text-gold-dark uppercase tracking-tight">
              Agendando para: {formatDate(selectedDate)}
            </p>
          </div>
        )}
      </section>

      <section>
        <p className="text-sm text-muted-foreground mb-3 font-medium">
          Período:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePeriod(p.id)}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                selectedPeriod === p.id
                  ? "border-gold bg-gold/10"
                  : "border-border hover:border-gold/30 bg-card"
              }`}
            >
              <span className="text-2xl mb-1">{p.icon}</span>
              <span className="font-bold text-sm">{p.label}</span>
              <span className="text-[10px] text-muted-foreground uppercase">
                {p.hours}
              </span>
            </button>
          ))}
        </div>
      </section>

      {selectedDate && selectedPeriod && (
        <section className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium">
            Horários disponíveis:
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="animate-spin text-gold" size={32} />
              <p className="text-xs text-muted-foreground">
                Consultando agenda...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.form.procedures.map((proc) => {
                const profs = slotsByProc[proc.id] || [];
                const sel = selections[proc.id];
                const availableProfs = profs.filter(
                  (p) => filterSlotsByPeriod(p.slots).length > 0,
                );

                return (
                  <div
                    key={proc.id}
                    className="bg-muted/30 border border-border rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-foreground">
                        {proc.name}
                      </h4>
                    </div>

                    {availableProfs.length === 0 ? (
                      <div className="py-4 text-center border border-dashed border-border rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground">
                          Sem horários para este período.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {availableProfs.map((pa) => (
                          <div key={pa.professional.id}>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">
                              {pa.professional.name}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {filterSlotsByPeriod(pa.slots).map((s) => {
                                const isSel =
                                  sel?.startTime === s.startTime &&
                                  sel?.professionalId === pa.professional.id;
                                return (
                                  <button
                                    key={`${pa.professional.id}-${s.startTime}`}
                                    onClick={() =>
                                      setSelections((prev) => ({
                                        ...prev,
                                        [proc.id]: {
                                          professionalId: pa.professional.id,
                                          professionalName:
                                            pa.professional.name,
                                          startTime: s.startTime,
                                          endTime: s.endTime,
                                        },
                                      }))
                                    }
                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                                      isSel
                                        ? "bg-gold text-primary border-gold shadow-md"
                                        : "bg-background border-border hover:border-gold/50"
                                    }`}
                                  >
                                    {formatTimeFromIso(s.startTime)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

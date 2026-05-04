import { Calendar } from 'lucide-react';
import { useBooking } from '@/hooks/useBooking';

export default function FloatingBookingButton() {
  const { dispatch } = useBooking();

  return (
    <button
      onClick={() => dispatch({ type: 'OPEN_MODAL' })}
      className="fixed bottom-6 right-6 z-40 btn-gold flex items-center gap-2 shadow-xl hover:shadow-2xl rounded-full px-6 py-4 text-sm font-bold"
    >
      <Calendar size={18} />
      Agendar Horário
    </button>
  );
}

import { useBooking } from '@/hooks/useBooking';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccess() {
  const { dispatch } = useBooking();

  return (
    <div className="flex flex-col items-center text-center gap-6 py-8 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center animate-bounce">
        <CheckCircle size={40} className="text-gold" />
      </div>
      <div>
        <h3 className="text-xl font-display font-bold mb-2">Solicitação enviada com sucesso! 💛</h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          Sua solicitação foi enviada para o salão. Em breve você irá receber a confirmação do seu procedimento via E-mail.
        </p>
      </div>
      <button
        onClick={() => dispatch({ type: 'CLOSE_MODAL' })}
        className="btn-gold"
      >
        Fechar
      </button>
    </div>
  );
}

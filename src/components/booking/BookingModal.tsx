import { useBooking } from '@/hooks/useBooking';
import { BOOKING_STEPS } from '@/constants';
import { X, Check } from 'lucide-react';
import StepProcedures from './StepProcedures';
import StepDateTime from './StepDateTime';
import StepProfessional from './StepProfessional';
import StepUserData from './StepUserData';
import BookingSuccess from './BookingSuccess';

export default function BookingModal() {
  const { state, dispatch } = useBooking();
  if (!state.isOpen) return null;

  if (state.isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => dispatch({ type: 'CLOSE_MODAL' })} />
        <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-scale-in">
          <BookingSuccess />
        </div>
      </div>
    );
  }

  const canNext = (): boolean => {
    switch (state.currentStep) {
      case 1: return state.form.procedures.length > 0;
      case 2: return state.form.items.length > 0 && state.form.items.every((i) => !!i.startTime || i.noPreference);
      case 3: return true;
      case 4: return false;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1: return <StepProcedures />;
      case 2: return <StepDateTime />;
      case 3: return <StepProfessional />;
      case 4: return <StepUserData />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => dispatch({ type: 'CLOSE_MODAL' })} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold">Agendar Horário</h2>
          <button onClick={() => dispatch({ type: 'CLOSE_MODAL' })} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            {BOOKING_STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    state.currentStep > step.id ? 'bg-gold text-primary' :
                    state.currentStep === step.id ? 'bg-gold text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {state.currentStep > step.id ? <Check size={16} /> : step.id}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block ${
                    state.currentStep >= step.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>{step.label}</span>
                </div>
                {i < BOOKING_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${state.currentStep > step.id ? 'bg-gold' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            disabled={state.currentStep === 1}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
          {state.currentStep < 4 ? (
            <button
              onClick={() => dispatch({ type: 'NEXT_STEP' })}
              disabled={!canNext()}
              className="btn-gold !py-2.5 !text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

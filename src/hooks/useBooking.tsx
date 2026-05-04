import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  BookingForm,
  BookingItemSelection,
  Period,
  Procedure,
  Professional,
  ProcedureProfessional,
} from "@/types";

interface BookingState {
  isOpen: boolean;
  currentStep: number;
  form: BookingForm;
  isSubmitting: boolean;
  isSuccess: boolean;
}

type BookingAction =
  | { type: "OPEN_MODAL" }
  | { type: "CLOSE_MODAL" }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GOTO_STEP"; payload: number }
  | { type: "SET_PROCEDURES"; payload: Procedure[] }
  | { type: "SET_PROCEDURE"; payload: Procedure }
  | { type: "ADD_DATE"; payload: Date }
  | { type: "REMOVE_DATE"; payload: number }
  | { type: "TOGGLE_PERIOD"; payload: Period }
  | {
      type: "SET_PROCEDURE_PROFESSIONAL";
      payload: {
        procedureId: string;
        professional: Professional | null;
        noPreference: boolean;
      };
    }
  | { type: "SET_ITEMS"; payload: BookingItemSelection[] }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_OBSERVATIONS"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_SUCCESS" }
  | { type: "RESET" };

const initialForm: BookingForm = {
  name: "",
  phone: "",
  email: "",
  observations: "",
  procedures: [],
  selectedDates: [],
  selectedPeriods: [],
  procedureProfessionals: [],
  items: [],
};

const initialState: BookingState = {
  isOpen: false,
  currentStep: 1,
  form: initialForm,
  isSubmitting: false,
  isSuccess: false,
};

function buildProcedureProfessionals(
  procedures: Procedure[],
): ProcedureProfessional[] {
  return procedures.map((proc) => ({
    procedure: proc,
    professional: null,
    noPreference: true,
  }));
}

function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "OPEN_MODAL":
      return { ...state, isOpen: true };

    case "CLOSE_MODAL":
      return { ...initialState };

    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, 4) };

    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };

    case "GOTO_STEP":
      return { ...state, currentStep: action.payload };

    case "SET_PROCEDURES": {
      const pp = buildProcedureProfessionals(action.payload);
      return {
        ...state,
        form: {
          ...state.form,
          procedures: action.payload,
          procedureProfessionals: pp,
          items: [],
        },
      };
    }

    case "SET_PROCEDURE": {
      const procedures = [action.payload];
      const pp = buildProcedureProfessionals(procedures);
      // Resetamos datas e períodos ao escolher um novo serviço para evitar conflito de lógica
      return {
        ...state,
        form: {
          ...initialForm, // Começa com form limpo
          procedures,
          procedureProfessionals: pp,
        },
      };
    }

    case "ADD_DATE": {
      // Normalizamos a data para Meio-Dia (12:00)
      // Isso evita que o fuso horário subtraia horas e mude o dia ao formatar no resumo
      const date = new Date(action.payload);
      date.setHours(12, 0, 0, 0);

      return {
        ...state,
        form: {
          ...state.form,
          selectedDates: [date], // Garante apenas uma data
        },
      };
    }

    case "REMOVE_DATE": {
      return { ...state, form: { ...state.form, selectedDates: [] } };
    }

    case "TOGGLE_PERIOD": {
      const periods = state.form.selectedPeriods.includes(action.payload)
        ? state.form.selectedPeriods.filter((p) => p !== action.payload)
        : [...state.form.selectedPeriods, action.payload];
      return { ...state, form: { ...state.form, selectedPeriods: periods } };
    }

    case "SET_PROCEDURE_PROFESSIONAL": {
      const pps = state.form.procedureProfessionals.map((pp) =>
        pp.procedure.id === action.payload.procedureId
          ? {
              ...pp,
              professional: action.payload.professional,
              noPreference: action.payload.noPreference,
            }
          : pp,
      );
      return { ...state, form: { ...state.form, procedureProfessionals: pps } };
    }

    case "SET_ITEMS":
      return { ...state, form: { ...state.form, items: action.payload } };
    case "SET_NAME":
      return { ...state, form: { ...state.form, name: action.payload } };
    case "SET_PHONE":
      return { ...state, form: { ...state.form, phone: action.payload } };
    case "SET_EMAIL":
      return { ...state, form: { ...state.form, email: action.payload } };
    case "SET_OBSERVATIONS":
      return {
        ...state,
        form: { ...state.form, observations: action.payload },
      };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_SUCCESS":
      return { ...state, isSubmitting: false, isSuccess: true };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

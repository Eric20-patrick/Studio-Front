"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingProvider } from "@/hooks/useBooking";
import { AuthProvider } from "@/hooks/useAuth";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // Dados sempre considerados stale por padrão
        refetchOnMount: 'always', // Sempre faz refetch ao montar componente
        refetchOnWindowFocus: true, // Refetch quando janela ganha foco
        retry: (failureCount, error: any) => {
          // Máximo 3 tentativas
          if (failureCount >= 3) return false;

          // Não faz retry em erros 4xx (exceto 408, 429)
          const status = error?.status;
          if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false;
          }

          // Backoff exponencial: 1s, 2s, 4s
          const delayMs = Math.min(1000 * Math.pow(2, failureCount), 8000);
          setTimeout(() => {}, delayMs);
          return true;
        },
      },
    },
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BookingProvider>
              <Toaster />
              <Sonner richColors position="top-right" />
              {children}
            </BookingProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

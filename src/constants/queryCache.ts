/**
 * Configuração de staleTime para diferentes tipos de dados.
 *
 * staleTime: quanto tempo os dados são considerados "fresh" sem refetch.
 * Reduz requisições desnecessárias mantendo dados atualizados.
 */

// Dashboards: dados em tempo real, mudam frequentemente
export const STALE_TIME_REALTIME = 0; // sempre refetch

// Agendamentos: mudam quando novos bookings são criados/cancelados
export const STALE_TIME_BOOKINGS = 30 * 1_000; // 30 segundos

// Procedures/Profissionais: mudam via painel admin, não frequentemente
export const STALE_TIME_ADMIN_DATA = 10 * 60_000; // 10 minutos

// Dados públicos (Team, Serviços): mudam apenas quando admin edita
export const STALE_TIME_PUBLIC_DATA = 30 * 60_000; // 30 minutos

// Dados estáticos: praticamente nunca mudam
export const STALE_TIME_STATIC = Infinity;

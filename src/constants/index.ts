export const SALON_INFO = {
  name: 'Studio Neo',
  phone: '5511977485165',
  address: 'São Paulo, SP',
  instagram: 'https://instagram.com/studioneosp',
  facebook: 'https://facebook.com/studioneosp',
  hours: 'Segunda a Sábado, 08h às 20h',
  whatsapp: '5511977485165',
  logo: 'http://studioneo.com.br/wp-content/uploads/2014/01/logo-neo.png',
  mapsEmbed: 'https://www.google.com/maps?cid=9434247663555102546&hl=pt-BR&output=embed',
};

export const BOOKING_STEPS = [
  { id: 1, label: 'Procedimento' },
  { id: 2, label: 'Data e Horário' },
  { id: 3, label: 'Profissional' },
  { id: 4, label: 'Seus Dados' },
] as const;

export const NAV_LINKS = [
  { label: 'Início', path: '/' },
  { label: 'Quem Somos', path: '/quem-somos' },
  { label: 'Nossos Serviços', path: '/servicos' },
  { label: 'Equipe', path: '/equipe' },
  { label: 'Galeria de Fotos', path: '/galeria' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contato', path: '/contato' },
] as const;

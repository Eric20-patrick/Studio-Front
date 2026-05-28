export const SALON_INFO = {
  name: 'Salão de Beleza',
  phone: '5511977485165',
  address: 'São Paulo, SP',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  hours: 'Segunda a Sábado, 08h às 20h',
  whatsapp: '5511977485165',
  logo: '/logo.svg',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658!2d-46.6479863!3d-23.5475158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c3d63203432a93%3A0x69b630d7d708732c!2sAv.%20 Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1763992467607!5m2!1spt-BR!2sbr',
};

export const BOOKING_STEPS = [
  { id: 1, label: 'Procedimento' },
  { id: 2, label: 'Data e Horário' },
  { id: 3, label: 'Seus Dados' },
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

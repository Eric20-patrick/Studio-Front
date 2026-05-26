import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SALON_INFO } from '@/constants';
import {
  Send,
  CheckCircle,
  MessageCircle,
  User,
  Mail,
  Sparkles,
} from 'lucide-react';
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaRegClock, FaInstagram, FaFacebookF } from 'react-icons/fa';
import hero from '@/assets/hero.png';
import Image from 'next/image';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const ref = useScrollReveal();

  useEffect(() => {
    document.title = 'Contato | Studio Neo';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      {/* Header */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src={hero}
          alt="Studio Neo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
        <div className="relative text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm mb-4">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Fale Conosco
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">
            Contato
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        {/* Decorações de fundo */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gold/5 rounded-full translate-x-48 pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-gold/5 rounded-full -translate-x-36 pointer-events-none" />

        <div ref={ref} className="container-salon scroll-reveal relative">
          {/* Subtítulo */}
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Estamos sempre prontos para te atender. Entre em contato pelos nossos canais
              ou envie uma mensagem que responderemos em breve.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto items-start">
            {/* COLUNA DO FORMULÁRIO */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gold/10 relative overflow-hidden">
                {/* Decoração */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-3">
                    <MessageCircle size={12} className="text-gold-dark" />
                    <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest">
                      Mensagem
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-black">
                    Envie sua mensagem
                  </h2>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-gold to-transparent mb-6" />

                  {sent ? (
                    <div className="flex flex-col items-center text-center py-12 animate-fade-in">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gold/30 rounded-full blur-xl" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-xl">
                          <CheckCircle size={40} className="text-white" />
                        </div>
                      </div>
                      <p className="font-display font-bold text-xl mb-2 text-black">
                        Mensagem enviada!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Entraremos em contato em breve.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {/* Campo Nome */}
                      <div className="relative group">
                        <User
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Seu nome"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-[#fafafa] text-black text-sm focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                        />
                      </div>

                      {/* Campo Email */}
                      <div className="relative group">
                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition-colors"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Seu e-mail"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-[#fafafa] text-black text-sm focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
                        />
                      </div>

                      {/* Campo Mensagem */}
                      <div className="relative group">
                        <MessageCircle
                          size={18}
                          className="absolute left-4 top-4 text-gray-400 group-focus-within:text-gold transition-colors"
                        />
                        <textarea
                          required
                          rows={6}
                          placeholder="Sua mensagem"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-[#fafafa] text-black text-sm focus:outline-none focus:border-gold focus:bg-white transition-all resize-none placeholder:text-gray-400"
                        />
                      </div>

                      {/* Botão Enviar */}
                      <button
                        type="submit"
                        className="mt-2 bg-gradient-to-r from-gold to-gold-dark hover:shadow-2xl hover:scale-[1.02] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg group"
                      >
                        <Send
                          size={18}
                          className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300"
                        />
                        Enviar Mensagem
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* COLUNA DE INFORMAÇÕES - Cards compactos flutuantes */}
            <div className="lg:col-span-2 space-y-2.5">
              {/* WhatsApp - Destaque */}
              <a
                href={`https://wa.me/${SALON_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar no WhatsApp"
                className="block group"
              >
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-xl px-4 py-3 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm leading-tight">
                        WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </a>

              {/* Telefone */}
              <a
                href={`tel:+${SALON_INFO.phone}`}
                aria-label="Ligar para o salão"
                className="block group"
              >
                <div className="bg-white rounded-xl px-4 py-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-gold/10 hover:border-gold/30 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FaPhoneAlt size={14} className="text-gold-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-black font-bold text-sm leading-tight">
                      Telefone
                    </p>
                  </div>
                </div>
              </a>

              {/* Endereço */}
              <div className="bg-white rounded-xl px-4 py-3 shadow-md border border-gold/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt size={15} className="text-gold-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                    Endereço
                  </p>
                  <p className="text-black font-bold text-sm leading-tight truncate">
                    {SALON_INFO.address}
                  </p>
                </div>
              </div>

              {/* Horário de funcionamento */}
              <div className="bg-white rounded-xl px-4 py-3 shadow-md border border-gold/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center flex-shrink-0">
                  <FaRegClock size={15} className="text-gold-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                    Horário
                  </p>
                  <p className="text-black font-bold text-sm leading-tight truncate">
                    {SALON_INFO.hours}
                  </p>
                </div>
              </div>

              {/* Redes Sociais - Compacto */}
              <div className="bg-white rounded-xl px-4 py-3 shadow-md border border-gold/10 flex items-center gap-3">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-tight flex-1">
                  Siga nas Redes
                </p>
                <div className="flex gap-2">
                  <a
                    href={SALON_INFO.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all duration-300"
                  >
                    <FaInstagram size={16} />
                  </a>
                  <a
                    href={SALON_INFO.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white hover:scale-110 hover:shadow-md transition-all duration-300"
                  >
                    <FaFacebookF size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>
    </div>
  );
}

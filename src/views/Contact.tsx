import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SALON_INFO } from '@/constants';
import { Phone, MapPin, Instagram, Facebook, Send, CheckCircle } from 'lucide-react';
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
        <div className="absolute inset-0 bg-primary/70" />
        <h1 className="relative text-4xl md:text-5xl font-display font-bold text-primary-foreground">
          Contato
        </h1>
      </section>

      <section className="section-padding">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
            {/* Coluna do Formulário */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 text-black">
                Envie sua mensagem
              </h2>

              {sent ? (
                <div className="flex flex-col items-center text-center py-12 animate-fade-in">
                  <CheckCircle size={48} className="text-gold mb-4" />
                  <p className="font-display font-bold text-lg mb-2">Mensagem enviada!</p>
                  <p className="text-sm text-muted-foreground">Entraremos em contato em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    /* Mudança para fundo branco/claro e borda suave */
                    className="px-4 py-4 rounded-xl border border-gray-200 bg-[#f9f9f9] text-black text-sm focus:outline-none focus:ring-2 ring-gold placeholder:text-gray-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="px-4 py-4 rounded-xl border border-gray-200 bg-[#f9f9f9] text-black text-sm focus:outline-none focus:ring-2 ring-gold placeholder:text-gray-400"
                  />
                  <textarea
                    required
                    rows={6}
                    placeholder="Sua mensagem"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="px-4 py-4 rounded-xl border border-gray-200 bg-[#f9f9f9] text-black text-sm focus:outline-none focus:ring-2 ring-gold resize-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-[#f2d091] hover:bg-[#e6c27a] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Send size={18} /> Enviar
                  </button>
                </form>
              )}
            </div>

            {/* Coluna de Informações */}
            <div className="md:pt-20 space-y-10">
              <div className="flex items-center gap-4">
                <Phone size={24} className="text-[#f2d091] flex-shrink-0" />
                <p className="text-gray-500 font-medium">(11) 97748-5165</p>
              </div>

              <div className="flex items-center gap-4">
                <MapPin size={24} className="text-[#f2d091] flex-shrink-0" />
                <p className="text-gray-500 font-medium">São Paulo, SP</p>
              </div>

              {/* Redes Sociais Pretas */}
              <div className="flex gap-4 pt-4">
                <a
                  href={SALON_INFO.instagram}
                  target="_blank"
                  className="p-4 rounded-full    hover:bg-gold transition-all"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href={SALON_INFO.facebook}
                  target="_blank"
                  className="p-4 rounded-full  hover:bg-gold transition-all"
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

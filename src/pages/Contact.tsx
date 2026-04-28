import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SALON_INFO } from '@/constants';
import { Phone, MapPin, Instagram, Facebook, Send, CheckCircle } from 'lucide-react';

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
    <div>
      <section className="relative h-[30vh] flex items-center justify-center bg-primary">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">Contato</h1>
      </section>

      <section className="section-padding">
        <div ref={ref} className="container-salon scroll-reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Envie sua mensagem</h2>
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
                    className="px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold"
                  />
                  <textarea
                    required
                    rows={5}
                    placeholder="Sua mensagem"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 ring-gold resize-none"
                  />
                  <button type="submit" className="btn-gold flex items-center justify-center gap-2">
                    <Send size={16} /> Enviar
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Informações</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Phone size={20} className="text-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Telefone / WhatsApp</p>
                    <p className="text-sm text-muted-foreground">(11) 97748-5165</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">{SALON_INFO.address}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href={SALON_INFO.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted hover:bg-gold/20 hover:text-gold transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href={SALON_INFO.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted hover:bg-gold/20 hover:text-gold transition-colors">
                    <Facebook size={20} />
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

import { useState } from 'react';

export default function TopBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-gold text-primary text-center text-sm py-2 px-4 relative font-medium">
      <span>✨ Novidades e promoções especiais te esperam! Agende já o seu horário.</span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/70 hover:text-primary transition-colors font-bold"
        aria-label="Fechar banner"
      >
        ✕
      </button>
    </div>
  );
}

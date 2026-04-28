import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, SALON_INFO } from '@/constants';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-primary/95 backdrop-blur-md border-b border-border/10">
      <div className="container-salon flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex-shrink-0">
          <img src={SALON_INFO.logo} alt="Studio Neo" className="h-10 object-contain brightness-0 invert" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors gold-underline ${
                location.pathname === link.path
                  ? 'text-gold gold-underline-active'
                  : 'text-primary-foreground/80 hover:text-gold'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-primary-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className="relative w-6 h-6">
            <Menu className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} size={24} />
            <X className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} size={24} />
          </div>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-72 bg-primary shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col pt-20 px-6 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'text-gold bg-gold/10'
                      : 'text-primary-foreground/70 hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

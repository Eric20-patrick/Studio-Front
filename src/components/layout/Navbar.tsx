"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SALON_INFO } from "@/constants";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
      <div className="container-salon flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex-shrink-0">
          <img
            src={SALON_INFO.logo}
            alt="Studio Neo"
            className="h-10 object-contain brightness-0 invert"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium tracking-wide transition-colors gold-underline ${
                pathname === link.path
                  ? "text-gold gold-underline-active"
                  : "text-white/80 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className="relative w-6 h-6">
            <Menu
              className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
              size={24}
            />
            <X
              className={`absolute inset-0 transition-all duration-300 ${mobileOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
              size={24}
            />
          </div>
        </button>
      </div>

      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-72 bg-black shadow-2xl animate-slide-in-right flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Menu */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
              {/* Espaçador para centralizar a logo */}
              <div className="flex-1" />
              <img
                src={SALON_INFO.logo}
                alt="Studio Neo"
                className="h-8 object-contain brightness-0 invert"
              />
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Fechar menu"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Links do Menu */}
            <div className="flex flex-col py-6 px-6 gap-2 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.path
                      ? "text-gold bg-gold/10"
                      : "text-white/70 hover:text-gold hover:bg-gold/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

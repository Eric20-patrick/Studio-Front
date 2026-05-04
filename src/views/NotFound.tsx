"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404: rota inexistente:",
      pathname,
    );
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-4">
        <h1 className="mb-4 text-4xl font-display font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Página não encontrada
        </p>
        <Link
          href="/"
          className="text-gold-dark font-medium underline hover:opacity-90"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}

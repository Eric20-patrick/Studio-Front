"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Compatível com links ativos no App Router (substitui react-router NavLink). */
export const NavLink = forwardRef<
  HTMLAnchorElement,
  {
    href: string;
    className?: string;
    activeClassName?: string;
    children: React.ReactNode;
  } & React.ComponentPropsWithoutRef<typeof Link>
>(({ href, className, activeClassName, children, ...props }, ref) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
});

NavLink.displayName = "NavLink";

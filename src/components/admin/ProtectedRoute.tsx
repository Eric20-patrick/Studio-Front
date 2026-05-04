"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DelegatedPermissions, UserRole } from "@/types";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  roles?: UserRole[];
  /** Admin sempre; recepção só com permissão delegada correspondente */
  delegated?: keyof DelegatedPermissions;
}

export default function ProtectedRoute({ children, roles, delegated }: Props) {
  const { user, loading, canDelegated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const from = pathname || "/admin";
      router.replace(
        `/admin/login?from=${encodeURIComponent(from)}`,
      );
      return;
    }
    if (delegated) {
      if (!canDelegated(delegated)) {
        router.replace("/admin/recepcao");
      }
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace(
        user.role === "RECEPTION" ? "/admin/recepcao" : "/admin",
      );
    }
  }, [user, loading, delegated, roles, canDelegated, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (delegated && !canDelegated(delegated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return <>{children}</>;
}

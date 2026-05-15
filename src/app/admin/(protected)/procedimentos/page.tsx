"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const AdminProcedures = dynamic(() => import("@/views/admin/AdminProcedures"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return (
    <ProtectedRoute delegated="canManageProcedures">
      <AdminProcedures />
    </ProtectedRoute>
  );
}

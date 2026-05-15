"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const AdminProfessionals = dynamic(() => import("@/views/admin/AdminProfessionals"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return (
    <ProtectedRoute delegated="canManageProfessionals">
      <AdminProfessionals />
    </ProtectedRoute>
  );
}

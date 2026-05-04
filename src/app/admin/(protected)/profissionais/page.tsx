"use client";

import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminProfessionals from "@/views/admin/AdminProfessionals";

export default function Page() {
  return (
    <ProtectedRoute delegated="canManageProfessionals">
      <AdminProfessionals />
    </ProtectedRoute>
  );
}

"use client";

import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminProcedures from "@/views/admin/AdminProcedures";

export default function Page() {
  return (
    <ProtectedRoute delegated="canManageProcedures">
      <AdminProcedures />
    </ProtectedRoute>
  );
}

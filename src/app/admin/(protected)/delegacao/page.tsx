"use client";

import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminDelegation from "@/views/admin/AdminDelegation";

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminDelegation />
    </ProtectedRoute>
  );
}

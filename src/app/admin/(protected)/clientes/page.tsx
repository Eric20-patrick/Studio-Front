"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const AdminClients = dynamic(() => import("@/views/admin/AdminClients"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return (
    <ProtectedRoute delegated="canViewClients">
      <AdminClients />
    </ProtectedRoute>
  );
}

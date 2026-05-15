"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const AdminDashboard = dynamic(() => import("@/views/admin/AdminDashboard"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return (
    <ProtectedRoute delegated="canViewAdminDashboard">
      <AdminDashboard />
    </ProtectedRoute>
  );
}

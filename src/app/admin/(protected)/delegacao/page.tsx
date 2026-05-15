"use client";

import dynamic from "next/dynamic";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const AdminDelegation = dynamic(() => import("@/views/admin/AdminDelegation"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return (
    <ProtectedRoute roles={["ADMIN"]}>
      <AdminDelegation />
    </ProtectedRoute>
  );
}

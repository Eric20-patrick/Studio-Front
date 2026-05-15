"use client";

import dynamic from "next/dynamic";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const AdminLogin = dynamic(() => import("@/views/admin/AdminLogin"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return <AdminLogin />;
}

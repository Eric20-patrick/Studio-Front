"use client";

import dynamic from "next/dynamic";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const ReceptionDashboard = dynamic(() => import("@/views/admin/ReceptionDashboard"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return <ReceptionDashboard />;
}

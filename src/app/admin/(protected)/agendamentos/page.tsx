"use client";

import dynamic from "next/dynamic";
import AdminPageSkeleton from "@/components/admin/AdminPageSkeleton";

const AdminBookings = dynamic(() => import("@/views/admin/AdminBookings"), {
  loading: () => <AdminPageSkeleton />,
  ssr: false,
});

export default function Page() {
  return <AdminBookings />;
}

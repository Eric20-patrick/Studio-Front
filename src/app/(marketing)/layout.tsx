"use client";

import dynamic from "next/dynamic";
import { useBooking } from "@/hooks/useBooking";
import TopBanner from "@/components/layout/TopBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingBookingButton from "@/components/shared/FloatingBookingButton";

const BookingModal = dynamic(() => import("@/components/booking/BookingModal"), {
  ssr: false,
});

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useBooking();

  return (
    <>
      <TopBanner />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingBookingButton />
      {state.isOpen && <BookingModal />}
    </>
  );
}

"use client";

import TopBanner from "@/components/layout/TopBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingBookingButton from "@/components/shared/FloatingBookingButton";
import BookingModal from "@/components/booking/BookingModal";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBanner />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingBookingButton />
      <BookingModal />
    </>
  );
}

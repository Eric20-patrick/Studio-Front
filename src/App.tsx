import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingProvider } from "@/hooks/useBooking";
import { AuthProvider } from "@/hooks/useAuth";
import TopBanner from "@/components/layout/TopBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingBookingButton from "@/components/shared/FloatingBookingButton";
import BookingModal from "@/components/booking/BookingModal";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReceptionDashboard from "./pages/admin/ReceptionDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminProfessionals from "./pages/admin/AdminProfessionals";
import AdminProcedures from "./pages/admin/AdminProcedures";

const queryClient = new QueryClient();

function PublicShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <PublicShell>
              <Toaster position="top-right" richColors />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quem-somos" element={<About />} />
                <Route path="/servicos" element={<Services />} />
                <Route path="/equipe" element={<Team />} />
                <Route path="/galeria" element={<Gallery />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contato" element={<Contact />} />

                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="recepcao" element={<ReceptionDashboard />} />
                  <Route path="agendamentos" element={<AdminBookings />} />
                  <Route
                    path="profissionais"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <AdminProfessionals />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="procedimentos"
                    element={
                      <ProtectedRoute roles={["ADMIN"]}>
                        <AdminProcedures />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </PublicShell>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

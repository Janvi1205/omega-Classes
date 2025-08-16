// src/App.tsx (modify)
import { AuthProvider } from "@/contexts/Authcontext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import PrivateRoute from "@/components/privateroute";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const StudyMaterial = lazy(() => import("./pages/StudyMaterial"));
const SubjectNotes = lazy(() => import("./pages/SubjectNotes"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/adminlogin"));
const AdminDashboard = lazy(() => import("./pages/admindashboard"));
const UploadMaterial = lazy(() => import("./pages/uploadmaterial"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/study-material" element={<StudyMaterial />} />
                <Route path="/subject/:className/:subject" element={<SubjectNotes />} />

                {/* Admin routes */}
                <Route path="/omegaproclassesadminrohansir/login" element={<AdminLogin />} />
                <Route path="/omegaproclassesadminrohansir" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/omegaproclassesadminrohansir/upload" element={<PrivateRoute><UploadMaterial /></PrivateRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
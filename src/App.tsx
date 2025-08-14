// src/App.tsx (modify)
import { AuthProvider } from "@/contexts/Authcontext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import PrivateRoute from "@/components/privateroute";
import AdminLogin from "@/pages/adminlogin";
import AdminDashboard from "@/pages/admindashboard";
import UploadMaterial from "@/pages/uploadmaterial";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudyMaterial from "./pages/StudyMaterial";
import SubjectNotes from "./pages/SubjectNotes";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
// ... other imports

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/study-material" element={<StudyMaterial />} />
              <Route path="/subject/:className/:subject" element={<SubjectNotes />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/upload" element={<PrivateRoute><UploadMaterial /></PrivateRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
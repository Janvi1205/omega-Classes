// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/Authcontext";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;

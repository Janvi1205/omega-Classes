// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/Authcontext";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isTeacher, loading } = useAuth();
  
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
  
  if (!user) return <Navigate to="/admin/login" replace />;
  
  if (!isTeacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4 p-8 bg-card rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-destructive">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this area. Only teachers can access the admin dashboard.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default PrivateRoute;

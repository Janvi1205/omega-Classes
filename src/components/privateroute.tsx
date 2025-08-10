// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/Authcontext";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Checking auth...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export default PrivateRoute;

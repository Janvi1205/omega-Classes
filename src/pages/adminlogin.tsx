// src/pages/admin/AdminLogin.tsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/Authcontext";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (error: any) {
      setErr(error.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 p-8 bg-card rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Teacher Login</h2>
        {err && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-4">
            {err}
          </div>
        )}
        <form onSubmit={submit} className="space-y-6">
          <input 
            className="input" 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            required 
          />
          <input 
            className="input" 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            required 
          />
          <button className="btn-primary w-full" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

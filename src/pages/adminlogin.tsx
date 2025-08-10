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
    <div className="max-w-md mx-auto mt-24 p-6 bg-card rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Teacher Login</h2>
      {err && <div className="text-sm text-red-500 mb-2">{err}</div>}
      <form onSubmit={submit} className="space-y-4">
        <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="btn-primary w-full" type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default AdminLogin;

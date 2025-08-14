// src/pages/admin/AdminLogin.tsx
import React, { useState } from "react";
import { useAuth } from "@/contexts/Authcontext";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    console.log("Attempting login with:", email);
    try {
      await login(email, password);
      console.log("Login successful, navigating to admin");
      navigate("/admin");
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Failed to login";
      
      // Handle specific Firebase auth errors
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = "No account found with this email address";
            break;
          case 'auth/wrong-password':
            errorMessage = "Incorrect password";
            break;
          case 'auth/invalid-email':
            errorMessage = "Invalid email address";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many failed attempts. Please try again later";
            break;
          case 'auth/user-disabled':
            errorMessage = "This account has been disabled";
            break;
          default:
            errorMessage = error.message || "Authentication failed";
        }
      } else {
        errorMessage = error.message || "Failed to login";
      }
      
      setErr(errorMessage);
    }
  };

  const makeTeacherAccount = async () => {
    if (!email) {
      setErr("Please enter your email first");
      return;
    }
    
    try {
      // First login to get user
      await login(email, password);
      console.log("Making teacher account for:", email);
      
      // Get current user and set their role to teacher
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "teacher",
          createdAt: new Date(),
        });
        console.log("Teacher role set successfully");
        setErr("Account converted to teacher! Please try logging in again.");
      }
    } catch (error: any) {
      console.error("Error making teacher account:", error);
      setErr(error.message || "Failed to convert account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-x-hidden">
      {/* Floating animated shapes */}
      <div className="floating-shape" style={{top: '15%', left: '10%', width: '140px', height: '140px', background: 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)', animationDelay: '0s'}}></div>
      <div className="floating-shape" style={{top: '70%', left: '80%', width: '90px', height: '90px', background: 'linear-gradient(135deg, #f472b6 0%, #a5b4fc 100%)', animationDelay: '4s'}}></div>
      <div className="floating-shape" style={{top: '85%', left: '25%', width: '70px', height: '70px', background: 'linear-gradient(135deg, #38bdf8 0%, #a5b4fc 100%)', animationDelay: '8s'}}></div>
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
        
        {/* Temporary teacher setup button */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2 text-center">
            First time? Convert your account to teacher:
          </p>
          <button 
            onClick={makeTeacherAccount}
            className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
            type="button"
          >
            Make Teacher Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

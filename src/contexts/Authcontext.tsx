// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type UserRole = 'teacher' | 'student' | null;

type TAuth = {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isTeacher: boolean;
};

const AuthContext = createContext<TAuth | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Check user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", u.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data()?.role || 'student');
          } else {
            setUserRole('student'); // Default to student if no role found
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('student');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUserRole(null);
  };

  const isTeacher = userRole === 'teacher';

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, logout, isTeacher }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

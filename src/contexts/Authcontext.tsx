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
        // Check user role from Firestore - check teachers collection first
        try {
          console.log("Checking user role for UID:", u.uid);
          const teacherDoc = await getDoc(doc(db, "teachers", u.uid));
          if (teacherDoc.exists()) {
            console.log("Found teacher document:", teacherDoc.data());
            setUserRole('teacher');
          } else {
            // Fallback to users collection
            const userDoc = await getDoc(doc(db, "users", u.uid));
            if (userDoc.exists()) {
              console.log("Found user document:", userDoc.data());
              setUserRole(userDoc.data()?.role || 'student');
            } else {
              console.log("No document found, defaulting to student");
              setUserRole('student');
            }
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
    console.log("AuthContext: Attempting Firebase login");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("AuthContext: Firebase login successful", result.user.uid);
    } catch (error) {
      console.error("AuthContext: Firebase login failed", error);
      throw error;
    }
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

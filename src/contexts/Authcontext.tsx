// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
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
  // Admin-specific authentication
  adminUser: User | null;
  adminUserRole: UserRole;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
};

const AuthContext = createContext<TAuth | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  
  // Admin authentication state (non-persistent)
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminUserRole, setAdminUserRole] = useState<UserRole>(null);
  
  // Session timeout management
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  const WARNING_TIMEOUT = 25 * 60 * 1000; // 25 minutes (5 minutes before expiry)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Check user role from Firestore - check teachers collection first
        try {
          const teacherDoc = await getDoc(doc(db, "teachers", u.uid));
          if (teacherDoc.exists()) {
            setUserRole('teacher');
          } else {
            // Fallback to users collection
            const userDoc = await getDoc(doc(db, "users", u.uid));
            if (userDoc.exists()) {
              setUserRole(userDoc.data()?.role || 'student');
            } else {
              setUserRole('student');
            }
          }
        } catch (error) {
          setUserRole('student');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Clear admin authentication on page refresh or navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      setAdminUser(null);
      setAdminUserRole(null);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setAdminUser(null);
        setAdminUserRole(null);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Session timeout management
  const resetSessionTimeout = () => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    
    if (adminUser) {
      // Set warning timeout (5 minutes before session expires)
      warningTimeoutRef.current = setTimeout(() => {
        const shouldExtend = window.confirm(
          "Your admin session will expire in 5 minutes due to inactivity. Would you like to extend your session?"
        );
        if (shouldExtend) {
          resetSessionTimeout(); // Reset the timeout
        }
      }, WARNING_TIMEOUT);

      // Set session timeout
      sessionTimeoutRef.current = setTimeout(() => {
        setAdminUser(null);
        setAdminUserRole(null);
        // Redirect to login page
        window.location.href = '/admin/login';
      }, SESSION_TIMEOUT);
    }
  };

  // Reset session timeout on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (adminUser) {
        resetSessionTimeout();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [adminUser]);

  // Cleanup session timeout on unmount
  useEffect(() => {
    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUserRole(null);
  };

  // Admin-specific login (doesn't persist)
  const adminLogin = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is a teacher
      try {
        const teacherDoc = await getDoc(doc(db, "teachers", result.user.uid));
        if (teacherDoc.exists()) {
          setAdminUser(result.user);
          setAdminUserRole('teacher');
          resetSessionTimeout(); // Start session timeout
        } else {
          // Check users collection as fallback
          const userDoc = await getDoc(doc(db, "users", result.user.uid));
          if (userDoc.exists() && userDoc.data()?.role === 'teacher') {
            setAdminUser(result.user);
            setAdminUserRole('teacher');
            resetSessionTimeout(); // Start session timeout
          } else {
            throw new Error("Access denied. Only teachers can access admin area.");
          }
        }
      } catch (error) {
        throw new Error("Access denied. Only teachers can access admin area.");
      }
    } catch (error) {
      throw error;
    }
  };

  // Admin logout (clears admin state only)
  const adminLogout = () => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    setAdminUser(null);
    setAdminUserRole(null);
  };

  const isTeacher = userRole === 'teacher';
  const isAdminAuthenticated = adminUserRole === 'teacher';

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      loading, 
      login, 
      logout, 
      isTeacher,
      adminUser,
      adminUserRole,
      adminLogin,
      adminLogout,
      isAdminAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

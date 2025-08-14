// src/utils/createTeacherAccount.ts
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export const createTeacherAccount = async (email: string, password: string, name: string) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set user role as teacher in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name,
      role: "teacher",
      createdAt: new Date(),
    });

    console.log("Teacher account created successfully");
    return user;
  } catch (error) {
    console.error("Error creating teacher account:", error);
    throw error;
  }
};
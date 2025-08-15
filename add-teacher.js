// Script to add a teacher to Firestore
// Run this with: node add-teacher.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Your Firebase config (copy from your firebase.js file)
const firebaseConfig = {
  // Copy your config here from src/lib/firebase.js
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTeacher(uid, teacherData) {
  try {
    await setDoc(doc(db, "teachers", uid), {
      name: teacherData.name,
      email: teacherData.email,
      role: "teacher",
      createdAt: new Date(),
      ...teacherData
    });
    console.log(`✅ Teacher ${teacherData.name} added successfully!`);
  } catch (error) {
    console.error("❌ Error adding teacher:", error);
  }
}

// Example usage:
// Replace with the actual UID from Firebase Authentication
const teacherUID = "REPLACE_WITH_ACTUAL_UID";
const teacherData = {
  name: "Teacher Name",
  email: "teacher@example.com"
};

addTeacher(teacherUID, teacherData);

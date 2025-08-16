// Script to add initial notifications to Firestore
// Run this with: node add-initial-notifications.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5VhK2uKi-0_OOaDpAzF_vKRTRwJCv-Zo",
  authDomain: "flipcardapp-aebc3.firebaseapp.com",
  projectId: "flipcardapp-aebc3",
  storageBucket: "flipcardapp-aebc3.firebasestorage.app",
  messagingSenderId: "532025045750",
  appId: "1:532025045750:web:e68301e4e13602d3f672d7",
  measurementId: "G-NXP657LHKZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initialNotifications = [
  {
    title: "Welcome to Omega Pro Classes",
    message: "Welcome to our educational platform! Here you'll find study materials, assignments, and important updates.",
    type: "info",
    priority: "medium",
    read: false,
    createdAt: serverTimestamp()
  },
  {
    title: "Study Materials Available",
    message: "Check out our comprehensive study materials for all classes and subjects. New content is added regularly!",
    type: "important",
    priority: "high",
    read: false,
    createdAt: serverTimestamp()
  },
  {
    title: "Assignment Updates",
    message: "New homework assignments have been uploaded for various subjects. Please check your class materials.",
    type: "assignment",
    priority: "medium",
    read: false,
    createdAt: serverTimestamp()
  }
];

async function addInitialNotifications() {
  try {
    console.log('Adding initial notifications to Firestore...');
    
    const notificationsRef = collection(db, 'notifications');
    
    for (const notification of initialNotifications) {
      const docRef = await addDoc(notificationsRef, notification);
      console.log(`Added notification "${notification.title}" with ID: ${docRef.id}`);
    }
    
    console.log('✅ All initial notifications added successfully!');
    console.log('You can now test the dynamic notification system.');
    console.log('- Go to the admin page and post new announcements');
    console.log('- Check the main website to see the notifications appear');
    
  } catch (error) {
    console.error('Error adding notifications:', error);
  }
}

addInitialNotifications();

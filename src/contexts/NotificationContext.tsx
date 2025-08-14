import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'important' | 'assignment' | 'exam' | 'update';
  read: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'time'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from Firebase on mount
  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('Firebase snapshot received, docs count:', snapshot.docs.length);
      
      if (snapshot.docs.length === 0) {
        console.log('No notifications in Firebase, adding default ones...');
        // Add default notifications if collection is empty
        const defaultNotifications = [
          {
            title: "Welcome to the Notification System",
            message: "This is your first notification! Admin can now post announcements that will appear here.",
            type: "info",
            priority: "medium",
            read: false
          },
          {
            title: "Test Announcement",
            message: "This is a test announcement to verify the system is working properly.",
            type: "important",
            priority: "high", 
            read: false
          }
        ];
        
        try {
          for (const notif of defaultNotifications) {
            await addDoc(collection(db, 'notifications'), {
              ...notif,
              createdAt: new Date(),
              time: 'Just now'
            });
          }
          console.log('Default notifications added to Firebase');
        } catch (error) {
          console.error('Error adding default notifications:', error);
        }
        return;
      }
      
      const notificationData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Processing notification:', data);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Notification;
      });
      
      console.log('Setting notifications:', notificationData);
      setNotifications(notificationData);
    }, (error) => {
      console.error('Error loading notifications:', error);
      toast({
        title: "Connection Error",
        description: "Unable to load notifications from Firebase",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'time'>) => {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: now,
        time: 'Just now'
      });

      console.log('Notification added successfully with ID:', docRef.id);

      // Show toast for high priority notifications
      if (notificationData.priority === 'high') {
        toast({
          title: "🔔 " + notificationData.title,
          description: notificationData.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error adding notification to Firebase:', error);
      toast({
        title: "Error",
        description: "Failed to add notification to Firebase",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updatePromises = notifications
        .filter(n => !n.read)
        .map(n => updateDoc(doc(db, 'notifications', n.id), { read: true }));
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const deletePromises = notifications.map(n => deleteDoc(doc(db, 'notifications', n.id)));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  // Update time strings periodically
  useEffect(() => {
    const updateTimeStrings = () => {
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          time: getRelativeTime(notification.createdAt)
        }))
      );
    };

    const interval = setInterval(updateTimeStrings, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}
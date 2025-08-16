import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
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
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications from Firestore on mount
  useEffect(() => {
    console.log('NotificationContext: Setting up Firestore listener');
    
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('NotificationContext: Firestore snapshot received');
      
      const notificationsData: Notification[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate?.() || new Date(data.createdAt?.seconds * 1000) || new Date();
        
        notificationsData.push({
          id: doc.id,
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
          read: data.read || false,
          createdAt: createdAt,
          time: getRelativeTime(createdAt)
        });
      });

      console.log('NotificationContext: Processed notifications:', notificationsData);
      setNotifications(notificationsData);
      setIsLoading(false);
    }, (error) => {
      console.error('NotificationContext: Error loading notifications:', error);
      setIsLoading(false);
      
      // Fallback to default notifications if Firestore fails
      const defaultNotifications: Notification[] = [
        {
          id: '1',
          title: "Welcome to Omega Pro Classes",
          message: "Welcome to our educational platform! Here you'll find study materials, assignments, and important updates.",
          type: "info",
          priority: "medium",
          read: false,
          createdAt: new Date(),
          time: 'Just now'
        },
        {
          id: '2',
          title: "Study Materials Available",
          message: "Check out our comprehensive study materials for all classes and subjects. New content is added regularly!",
          type: "important",
          priority: "high",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          time: '30 minutes ago'
        },
        {
          id: '3',
          title: "Assignment Updates",
          message: "New homework assignments have been uploaded for various subjects. Please check your class materials.",
          type: "assignment",
          priority: "medium",
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          time: '2 hours ago'
        }
      ];
      
      setNotifications(defaultNotifications);
    });

    return () => {
      console.log('NotificationContext: Cleaning up Firestore listener');
      unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'time'>) => {
    try {
      console.log('NotificationContext: Adding notification to Firestore:', notificationData);
      
      const notificationsRef = collection(db, 'notifications');
      
      const firestoreData = {
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        priority: notificationData.priority,
        read: notificationData.read,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(notificationsRef, firestoreData);
      console.log('NotificationContext: Notification added to Firestore with ID:', docRef.id);

      // Show toast for high priority notifications
      if (notificationData.priority === 'high') {
        toast({
          title: "🔔 " + notificationData.title,
          description: notificationData.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error adding notification to Firestore:', error);
      toast({
        title: "Error",
        description: "Failed to add notification",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      console.log('NotificationContext: Marking notification as read:', id);
      const notificationRef = doc(db, 'notifications', id);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      console.log('NotificationContext: Marking all notifications as read');
      const batch = notifications.map(async (notification) => {
        if (!notification.read) {
          const notificationRef = doc(db, 'notifications', notification.id);
          await updateDoc(notificationRef, { read: true });
        }
      });
      await Promise.all(batch);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      console.log('NotificationContext: Removing notification:', id);
      const notificationRef = doc(db, 'notifications', id);
      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Error removing notification:', error);
      toast({
        title: "Error",
        description: "Failed to remove notification",
        variant: "destructive",
      });
    }
  };

  const clearAllNotifications = async () => {
    try {
      console.log('NotificationContext: Clearing all notifications');
      const batch = notifications.map(async (notification) => {
        const notificationRef = doc(db, 'notifications', notification.id);
        await deleteDoc(notificationRef);
      });
      await Promise.all(batch);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      toast({
        title: "Error",
        description: "Failed to clear notifications",
        variant: "destructive",
      });
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
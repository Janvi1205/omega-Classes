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
  
  // Load notifications from localStorage as fallback
  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
    
    return [
      {
        id: '1',
        title: "New Assignment Posted",
        message: "Physics Chapter 12 - Electromagnetic Induction homework has been uploaded. Due date: Next Monday",
        time: "2 hours ago",
        type: "assignment",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: '2',
        title: "Class Schedule Update", 
        message: "Tomorrow's Chemistry class has been moved to 3:00 PM due to teacher unavailability",
        time: "5 hours ago",
        type: "important",
        read: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: '3',
        title: "New Study Material Available",
        message: "Mathematics Chapter 8 notes and practice problems are now available in the study materials section",
        time: "1 day ago", 
        type: "info",
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        priority: 'medium'
      }
    ];
  };

  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'time'>) => {
    const now = new Date();
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: now,
      time: 'Just now'
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast for high priority notifications
    if (notificationData.priority === 'high') {
      toast({
        title: "🔔 " + notificationData.title,
        description: notificationData.message,
        duration: 5000,
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
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
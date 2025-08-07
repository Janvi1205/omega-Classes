import { useState, useEffect } from 'react';
import { Bell, X, Clock, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'important' | 'assignment';
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  // Sample notification data - in real app this would come from Supabase
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Assignment Posted",
      message: "Physics Chapter 12 - Electromagnetic Induction homework has been uploaded",
      time: "2 hours ago",
      type: "assignment",
      read: false
    },
    {
      id: 2,
      title: "Class Schedule Update",
      message: "Tomorrow's Chemistry class has been moved to 3:00 PM",
      time: "5 hours ago",
      type: "important",
      read: false
    },
    {
      id: 3,
      title: "Study Material Available",
      message: "Mathematics Chapter 8 notes and practice problems are now available",
      time: "1 day ago",
      type: "info",
      read: true
    },
    {
      id: 4,
      title: "Exam Notification",
      message: "Biology Unit Test scheduled for next week. Check the exam timetable.",
      time: "2 days ago",
      type: "important",
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-primary" />;
      case 'important':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-80 bg-background border-l shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Bell className="w-8 h-8 mb-2" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 mb-2 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                        !notification.read 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-background border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm font-medium truncate ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button 
                onClick={markAllAsRead}
                className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
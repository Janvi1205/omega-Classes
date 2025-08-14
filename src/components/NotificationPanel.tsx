import { useState } from 'react';
import { Bell, X, Clock, BookOpen, AlertCircle, Calendar, Info, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAllNotifications } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  );

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'important':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'exam':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'update':
        return <Info className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
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
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background border-l shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'text-primary border-b-2 border-primary bg-primary/5' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === 'unread' 
                    ? 'text-primary border-b-2 border-primary bg-primary/5' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Unread ({notifications.filter(n => !n.read).length})
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Bell className="w-8 h-8 mb-2" />
                  <p className="text-sm">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 mb-2 rounded-lg border-l-4 transition-all cursor-pointer hover:shadow-md group ${
                        !notification.read 
                          ? `${getPriorityColor(notification.priority)} shadow-sm` 
                          : 'bg-background border-l-gray-300 dark:border-l-gray-600 border border-border'
                      }`}
                      onClick={() => handleNotificationClick(notification.id, notification.read)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-sm font-medium truncate ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 animate-pulse" />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-950 rounded transition-all"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 whitespace-pre-wrap break-words">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {notification.time}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.priority === 'high' 
                                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                : notification.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t space-y-2">
              {notifications.filter(n => !n.read).length > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors py-2 border border-primary/20 rounded-lg hover:bg-primary/5"
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="w-full text-center text-sm text-red-500 hover:text-red-600 transition-colors py-2 border border-red-500/20 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Clear all notifications
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
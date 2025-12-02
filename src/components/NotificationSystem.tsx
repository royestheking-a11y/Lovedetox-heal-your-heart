import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Bell, X, Check, Heart, MessageCircle, Calendar, Trophy, Zap } from 'lucide-react';
import { toast } from 'sonner';
import dataService from '../services/dataService';

export interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'info' | 'warning' | 'achievement' | 'message' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
}

export function NotificationSystem() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadNotifications();

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // Check for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const fetchedNotifications = await dataService.getNotifications();
      const mappedNotifications = fetchedNotifications.map((n: any) => ({ ...n, id: n._id }));
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;
    try {
      await dataService.markNotificationRead(id);
      const updated = notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    // Backend doesn't have markAllRead yet, so we loop or add endpoint.
    // For now, loop client side or just update UI and assume user will read them one by one?
    // Or just mark all in UI and send requests in background.
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    toast.success('All notifications marked as read');

    // Fire and forget requests
    updated.forEach(n => {
      if (!n.read) dataService.markNotificationRead(n.id);
    });
  };

  const deleteNotification = async (id: string) => {
    if (!user) return;
    try {
      await dataService.deleteNotification(id);
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'reminder':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Zap className="w-5 h-5 text-orange-500" />;
      default:
        return <Heart className="w-5 h-5 text-pink-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="fixed top-20 left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 w-auto sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#6366F1] hover:text-[#8B5CF6] transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                              {notif.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {formatTime(notif.timestamp)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notif.read && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-blue-500" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Delete"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to add a notification
// Helper function to add a notification
export async function addNotification(_userId: string, notification: Omit<Notification, 'id' | 'userId' | 'timestamp' | 'read'>) {
  const newNotificationData = {
    ...notification,
    timestamp: new Date().toISOString()
  };

  try {
    await dataService.createNotification(newNotificationData);
  } catch (error) {
    console.error('Error creating notification:', error);
  }

  // Show toast
  toast.success(notification.title, {
    description: notification.message
  });

  // Show system notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/pwa-192x192.png' // Ensure this icon exists in public folder
    });
  }
}
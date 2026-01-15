'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface NotificationManagerProps {
  habits: Array<{ name: string; time?: string; icon?: string }>;
}

export default function NotificationManager({ habits }: NotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      const saved = localStorage.getItem('notifications_enabled');
      setEnabled(saved === 'true' && Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const checkNotifications = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      habits.forEach((habit) => {
        if (habit.time === currentTime) {
          new Notification(`${habit.icon || '⏰'} Time for ${habit.name}!`, {
            body: 'Tap to open your habit tracker',
            icon: '/icon-192.png',
            tag: habit.name,
          });
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [enabled, habits]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setEnabled(true);
        localStorage.setItem('notifications_enabled', 'true');
        new Notification('🔔 Notifications enabled!', {
          body: 'You will receive reminders for your habits',
        });
      }
    }
  };

  const toggleNotifications = () => {
    if (permission !== 'granted') {
      requestPermission();
    } else {
      const newValue = !enabled;
      setEnabled(newValue);
      localStorage.setItem('notifications_enabled', String(newValue));
    }
  };

  if (!('Notification' in window)) return null;

  return (
    <button
      onClick={toggleNotifications}
      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
      title={enabled ? 'Disable notifications' : 'Enable notifications'}
    >
      {enabled ? <Bell size={18} /> : <BellOff size={18} />}
    </button>
  );
}

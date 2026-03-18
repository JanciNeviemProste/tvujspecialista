'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { cn } from '@/lib/utils/cn';

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-muted transition-colors"
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) markAllRead();
        }}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border bg-white dark:bg-card shadow-xl z-50 overflow-hidden">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-semibold dark:text-foreground">Notifikace</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-muted-foreground">
                Zadne notifikace
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'border-b px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-muted/30',
                    !n.read && 'bg-blue-50/50 dark:bg-blue-950/20'
                  )}
                >
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {n.event === 'new_lead' ? `Novy lead: ${String(n.data.customerName || '')}` : 'Zmena statusu'}
                  </p>
                  {typeof n.data.message === 'string' && (
                    <p className="mt-0.5 text-gray-500 dark:text-muted-foreground line-clamp-1">
                      {n.data.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(n.timestamp).toLocaleTimeString('cs-CZ')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

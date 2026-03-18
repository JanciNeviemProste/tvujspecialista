'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Notification {
  id: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://tvujspecialista-production.up.railway.app/api';
    const wsUrl = apiUrl.replace('/api', '').replace('https://', 'wss://').replace('http://', 'ws://');

    const newSocket = io(`${wsUrl}/notifications`, {
      query: { userId: user.id },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('new_lead', (data: Record<string, unknown>) => {
      const notification: Notification = {
        id: crypto.randomUUID(),
        event: 'new_lead',
        data,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
      setUnreadCount((prev) => prev + 1);
      toast.success(`Novy lead: ${data.customerName}`, {
        description: data.message as string,
      });
    });

    newSocket.on('status_changed', (data: Record<string, unknown>) => {
      const notification: Notification = {
        id: crypto.randomUUID(),
        event: 'status_changed',
        data,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, unreadCount, markAllRead, socket };
}

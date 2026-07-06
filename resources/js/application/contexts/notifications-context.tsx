import React, { createContext, useContext, ReactNode } from 'react';
import { useUnifiedNotifications } from '@/application/hooks/use-unified-notifications';
import type { BaseNotification } from '@/domain/entities/websocket-events';

interface NotificationsContextType {
  notifications: BaseNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  requestNotificationPermission: () => Promise<boolean>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children, userRoles = [], userId }: { children: ReactNode; userRoles?: string[]; userId?: number }) {
  const notificationsHook = useUnifiedNotifications({
    userRoles: userRoles,
    filterByRoles: true,
    autoSubscribePublic: true,
    autoSubscribeUser: userId,
    userId: userId,
    fetchAlertasVencidas: true, // ✅ Se ejecuta UNA SOLA VEZ aquí
  });

  return (
    <NotificationsContext.Provider value={notificationsHook}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return context;
}

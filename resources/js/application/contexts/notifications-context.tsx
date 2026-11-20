import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUnifiedNotifications } from '@/application/hooks/use-unified-notifications';
import { useBandejaNotificaciones } from '@/application/hooks/use-bandeja-notificaciones';
import type { BaseNotification } from '@/domain/entities/websocket-events';

type Bandeja = ReturnType<typeof useBandejaNotificaciones>;

interface NotificationsContextType {
  /** Eventos en tiempo real de esta sesión (toasts / sonido). */
  notifications: BaseNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  /** Bandeja persistida (campana): hoy + no leídas, cuentas vencidas. */
  bandeja: Bandeja;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children, userRoles = [], userId }: { children: ReactNode; userRoles?: string[]; userId?: number }) {
  const notificationsHook = useUnifiedNotifications({
    userRoles: userRoles,
    filterByRoles: true,
    autoSubscribePublic: true,
    autoSubscribeUser: !!userId,
    userId: userId,
    // Las cuentas vencidas ahora se muestran como tarjeta resumen en la bandeja
    fetchAlertasVencidas: false,
  });

  const bandeja = useBandejaNotificaciones(!!userId);

  // Cada evento en tiempo real que llega → refrescar la bandeja desde BD
  const ultimoEvento = notificationsHook.notifications.length;
  const { refrescar } = bandeja;
  useEffect(() => {
    if (ultimoEvento > 0) refrescar();
  }, [ultimoEvento, refrescar]);

  return (
    <NotificationsContext.Provider value={{ ...notificationsHook, bandeja }}>
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

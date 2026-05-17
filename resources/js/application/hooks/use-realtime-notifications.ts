// Application Layer: Hook for real-time notifications and alerts
import { useEffect, useCallback, useState } from 'react';
import { useWebSocket } from './use-websocket';
import { useAuth } from './use-auth';
import NotificationService from '@/infrastructure/services/notification.service';

export interface RealtimeNotification {
  id: string;
  type: 'ubicacion' | 'estado' | 'novedad' | 'proforma' | 'chofer';
  title: string;
  message: string;
  data: any;
  timestamp: string;
  read: boolean;
}

interface UseRealtimeNotificationsOptions {
  enableAutoNotify?: boolean;
  autoSubscribeAdmin?: boolean;
}

interface UseRealtimeNotificationsReturn {
  notifications: RealtimeNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  subscribe: (eventName: string) => void;
  unsubscribe: (eventName: string) => void;
}

/**
 * Hook para manejar notificaciones en tiempo real
 *
 * Muestra notificaciones emergentes de eventos importantes en entregas,
 * cambios de estado, proformas aprobadas, etc.
 *
 * Uso:
 * ```tsx
 * const { notifications, unreadCount } = useRealtimeNotifications({
 *   enableAutoNotify: true
 * });
 *
 * return (
 *   <div>
 *     {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
 *   </div>
 * );
 * ```
 */
export function useRealtimeNotifications(
  options: UseRealtimeNotificationsOptions = {}
): UseRealtimeNotificationsReturn {
  const { enableAutoNotify = true, autoSubscribeAdmin = false } = options;
  const { user, hasRole } = useAuth();
  const { on, off, subscribeTo, isConnected } = useWebSocket({
    autoConnect: true,
  });

  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  // Agregar notificación
  const addNotification = useCallback(
    (notification: RealtimeNotification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 50)); // Mantener últimas 50

      if (enableAutoNotify) {
        // Mostrar toast automático
        NotificationService.info(notification.message, {
          title: notification.title,
        });
      }
    },
    [enableAutoNotify]
  );

  // Marcar como leído
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Limpiar notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Suscribirse a evento específico
  const subscribe = useCallback(
    (eventName: string) => {
      if (!isConnected) {
        console.warn('WebSocket no está conectado');
        return;
      }

      on(eventName, (data: any) => {
        const notification: RealtimeNotification = {
          id: `${eventName}-${Date.now()}`,
          type: (eventName.split('.')[0] as any) || 'novedad',
          title: `Evento: ${eventName}`,
          message: JSON.stringify(data.data || data),
          data: data.data || data,
          timestamp: new Date().toISOString(),
          read: false,
        };

        addNotification(notification);
      });
    },
    [isConnected, on, addNotification]
  );

  // Desuscribirse de evento
  const unsubscribe = useCallback(
    (eventName: string) => {
      off(eventName);
    },
    [off]
  );

  // Escuchar eventos de ubicación actualizada
  useEffect(() => {
    if (!isConnected) return;

    on('ubicacion.actualizada', (data: any) => {
      addNotification({
        id: `ubicacion-${data.data?.id || Date.now()}`,
        type: 'ubicacion',
        title: '📍 Ubicación Actualizada',
        message: `Entrega ${data.data?.entrega_id}: Lat ${data.data?.latitud?.toFixed(4)}, Lng ${data.data?.longitud?.toFixed(4)}`,
        data: data.data,
        timestamp: new Date().toISOString(),
        read: false,
      });
    });

    return () => {
      off('ubicacion.actualizada');
    };
  }, [isConnected, on, off, addNotification]);

  // Escuchar cambios de estado
  useEffect(() => {
    if (!isConnected) return;

    on('entrega.estado-cambio', (data: any) => {
      addNotification({
        id: `estado-${data.data?.entrega_id}-${Date.now()}`,
        type: 'estado',
        title: '🔄 Estado Actualizado',
        message: `Entrega ${data.data?.entrega_id}: ${data.data?.estado_anterior} → ${data.data?.estado_nuevo}`,
        data: data.data,
        timestamp: new Date().toISOString(),
        read: false,
      });
    });

    return () => {
      off('entrega.estado-cambio');
    };
  }, [isConnected, on, off, addNotification]);

  // Escuchar novedades
  useEffect(() => {
    if (!isConnected) return;

    on('novedad.reportada', (data: any) => {
      addNotification({
        id: `novedad-${data.data?.entrega_id}-${Date.now()}`,
        type: 'novedad',
        title: '⚠️ Novedad Reportada',
        message: `Entrega ${data.data?.entrega_id}: ${data.data?.descripcion}`,
        data: data.data,
        timestamp: new Date().toISOString(),
        read: false,
      });
    });

    return () => {
      off('novedad.reportada');
    };
  }, [isConnected, on, off, addNotification]);

  // Escuchar proformas (solo admin)
  useEffect(() => {
    if (!isConnected || !hasRole('admin')) return;

    on('proforma.aprobada', (data: any) => {
      addNotification({
        id: `proforma-aprobada-${data.data?.id || Date.now()}`,
        type: 'proforma',
        title: '✅ Proforma Aprobada',
        message: `Proforma ${data.data?.numero}: Aprobada por cliente`,
        data: data.data,
        timestamp: new Date().toISOString(),
        read: false,
      });
    });

    on('proforma.rechazada', (data: any) => {
      addNotification({
        id: `proforma-rechazada-${data.data?.id || Date.now()}`,
        type: 'proforma',
        title: '❌ Proforma Rechazada',
        message: `Proforma ${data.data?.numero}: Rechazada por cliente`,
        data: data.data,
        timestamp: new Date().toISOString(),
        read: false,
      });
    });

    return () => {
      off('proforma.aprobada');
      off('proforma.rechazada');
    };
  }, [isConnected, hasRole, on, off, addNotification]);

  // Suscribirse al canal admin si es necesario
  useEffect(() => {
    if (autoSubscribeAdmin && isConnected && hasRole('admin')) {
      subscribeTo('admin.pedidos');

      on('admin.pedidos', (data: any) => {
        addNotification({
          id: `admin-${Date.now()}`,
          type: 'proforma',
          title: '📦 Evento de Admin',
          message: `Nuevo evento en pedidos: ${JSON.stringify(data).substring(0, 50)}...`,
          data: data,
          timestamp: new Date().toISOString(),
          read: false,
        });
      });

      return () => {
        off('admin.pedidos');
      };
    }
  }, [autoSubscribeAdmin, isConnected, hasRole, subscribeTo, on, off, addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    subscribe,
    unsubscribe,
  };
}

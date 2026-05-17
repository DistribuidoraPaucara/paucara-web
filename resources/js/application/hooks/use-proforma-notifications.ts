import { useEffect, useCallback, useState, useRef } from 'react';
import { useWebSocket } from './use-websocket';
import { useAuth } from './use-auth';
import toast from 'react-hot-toast';

interface ProformaNotification {
  id: number;
  numero: string;
  cliente: {
    nombre: string;
    apellido?: string;
  };
  total: number;
  estado: string;
  timestamp: string;
}

export interface UseProformaNotificationsReturn {
  notifications: ProformaNotification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  clearAll: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  requestNotificationPermission: () => Promise<boolean>;
}

/**
 * Hook para escuchar notificaciones de proformas en tiempo real
 *
 * Escucha eventos:
 * - proforma.creada (cuando cliente envía desde app)
 * - proforma.aprobada (cuando preventista aprueba)
 * - proforma.rechazada
 * - proforma.convertida
 * - proforma.actualizada (✅ NUEVO: cuando se actualiza)
 *
 * Uso:
 * ```tsx
 * const { notifications, unreadCount } = useProformaNotifications();
 *
 * return (
 *   <div>
 *     <Badge>{unreadCount}</Badge>
 *     {notifications.map(notif => (
 *       <div key={notif.id}>{notif.numero}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useProformaNotifications(): UseProformaNotificationsReturn {
  const { isConnected, on, off, subscribeTo } = useWebSocket({ autoConnect: true });
  const { user, roles } = useAuth();
  const [notifications, setNotifications] = useState<ProformaNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  // 🔍 DEBUG: Log del estado de conexión
  useEffect(() => {
    console.log(`[useProformaNotifications] isConnected=${isConnected}, user=${user?.name}`);
  }, [isConnected, user]);

  // ✅ Determinar si el usuario debe recibir la notificación según su rol
  const shouldReceiveNotification = useCallback(
    (eventType: string): boolean => {
      if (!user) return false;

      // Normalizar roles a minúsculas para comparación case-insensitive
      const normalizedRoles = (roles || []).map(r => r.toLowerCase());
      // ⭐ Super Admin recibe TODAS las notificaciones
      if (normalizedRoles.includes('super admin')) {
        return true;
      }

      // Lógica de filtrado por rol
      switch (eventType) {
        case 'proforma.creada':
          // Preventistas, Cajeros, Gerentes y Admins ven cuando se crea una proforma
          return ['preventista', 'cajero', 'manager', 'admin'].some((role) =>
            normalizedRoles.includes(role)
          );

        case 'proforma.aprobada':
          // Todos ven cuando se aprueba (especialmente el cliente que creó)
          return true;

        case 'proforma.rechazada':
          // Clientes, Gerentes y Admins ven rechazos
          return ['cliente', 'manager', 'admin'].some((role) =>
            normalizedRoles.includes(role)
          );

        case 'proforma.convertida':
          // Logística, Cobradores, Gerentes y Admins ven conversiones
          return ['logistica', 'cobrador', 'manager', 'admin'].some((role) =>
            normalizedRoles.includes(role)
          );

        case 'proforma.actualizada':
          // ✅ NUEVO: Preventistas, Gerentes, Admins y el cliente dueño ven actualizaciones
          return ['preventista', 'manager', 'admin'].some((role) =>
            normalizedRoles.includes(role)
          ) || true; // El cliente también ve si es el propietario

        default:
          return true;
      }
    },
    [roles]
  );

  // ✅ Solicitar permisos para notificaciones push del navegador
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Las notificaciones del navegador no son soportadas');
      return false;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setNotificationsEnabled(granted);
        return granted;
      } catch (error) {
        console.error('Error al solicitar permisos de notificación:', error);
        return false;
      }
    }

    return false;
  }, []);

  // ✅ Mostrar notificación push del navegador
  const showBrowserNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!notificationsEnabled || !('Notification' in window)) return;

      try {
        new Notification(title, {
          icon: '/logo.svg',
          badge: '/logo.svg',
          tag: 'proforma-notification',
          requireInteraction: false,
          ...options,
        });
      } catch (error) {
        console.warn('No se pudo mostrar notificación del navegador:', error);
      }
    },
    [notificationsEnabled]
  );

  // ✅ Reproducir sonido de notificación
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      // Crear elemento de audio si no existe
      if (!audioRef.current) {
        audioRef.current = new Audio();
        // Sonido corto y agradable (usando Web Audio API)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configurar sonido: dos beeps cortos
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);

        // Segundo beep
        const oscillator2 = audioContext.createOscillator();
        oscillator2.connect(gainNode);
        oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

        oscillator2.start(audioContext.currentTime + 0.15);
        oscillator2.stop(audioContext.currentTime + 0.25);
      }
    } catch (error) {
      console.warn('No se pudo reproducir sonido de notificación:', error);
    }
  }, [soundEnabled]);

  // Manejar notificación de proforma creada
  const handleProformaCreada = useCallback((data: any) => {
    // ✅ Verificar si el usuario debe recibir esta notificación según su rol
    if (!shouldReceiveNotification('proforma.creada')) {
      console.log(
        '🚫 Notificación filtrada por rol: Solo preventistas, cajeros y admins ven proformas creadas'
      );
      return;
    }

    const clienteName = data.cliente
      ? `${data.cliente.nombre} ${data.cliente.apellido || ''}`.trim()
      : 'Cliente';

    const notification: ProformaNotification = {
      id: data.id,
      numero: data.numero,
      cliente: {
        nombre: data.cliente?.nombre || 'Cliente',
        apellido: data.cliente?.apellido,
      },
      total: data.total,
      estado: 'PENDIENTE',
      timestamp: data.fecha_creacion || new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Mantener últimas 50
    setUnreadCount((prev) => prev + 1);

    // ✅ Reproducir sonido
    playNotificationSound();

    // ✅ Mostrar toast
    toast.success(`📋 ${clienteName} ha enviado la proforma ${data.numero} por Bs. ${data.total}`);

    // ✅ Mostrar notificación push del navegador
    showBrowserNotification(`📋 Nueva Proforma: ${data.numero}`, {
      body: `${clienteName} ha enviado una proforma por Bs. ${data.total}`,
      tag: `proforma-${data.id}`,
    });

    console.log('✅ Proforma creada:', data);
  }, [playNotificationSound, showBrowserNotification, shouldReceiveNotification]);

  // Manejar notificación de proforma aprobada
  const handleProformaAprobada = useCallback((data: any) => {
    // ✅ Verificar si el usuario debe recibir esta notificación según su rol
    if (!shouldReceiveNotification('proforma.aprobada')) {
      return;
    }

    const notification: ProformaNotification = {
      id: data.id,
      numero: data.numero,
      cliente: {
        nombre: 'Cliente',
      },
      total: data.total,
      estado: 'APROBADA',
      timestamp: data.fecha_aprobacion || new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);

    // ✅ Reproducir sonido
    playNotificationSound();

    toast.success(`✅ La proforma ${data.numero} ha sido aprobada por ${data.usuario_aprobador?.name}`);

    console.log('✅ Proforma aprobada:', data);
  }, [playNotificationSound, showBrowserNotification, shouldReceiveNotification]);

  // Manejar notificación de proforma rechazada
  const handleProformaRechazada = useCallback((data: any) => {
    // ✅ Verificar si el usuario debe recibir esta notificación según su rol
    if (!shouldReceiveNotification('proforma.rechazada')) {
      return;
    }

    const notification: ProformaNotification = {
      id: data.id,
      numero: data.numero,
      cliente: {
        nombre: 'Cliente',
      },
      total: 0,
      estado: 'RECHAZADA',
      timestamp: data.fecha_rechazo || new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);

    // ✅ Reproducir sonido
    playNotificationSound();

    toast.error(`❌ La proforma ${data.numero} ha sido rechazada. Motivo: ${data.motivo_rechazo}`);

    console.log('❌ Proforma rechazada:', data);
  }, [playNotificationSound, showBrowserNotification, shouldReceiveNotification]);

  // Manejar notificación de proforma convertida a venta
  const handleProformaConvertida = useCallback((data: any) => {
    // ✅ Verificar si el usuario debe recibir esta notificación según su rol
    if (!shouldReceiveNotification('proforma.convertida')) {
      return;
    }

    const notification: ProformaNotification = {
      id: data.proforma_id,
      numero: data.proforma_numero,
      cliente: {
        nombre: 'Cliente',
      },
      total: data.total,
      estado: 'CONVERTIDA',
      timestamp: data.fecha_conversion || new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);

    // ✅ Reproducir sonido
    playNotificationSound();

    toast.success(`🎉 La proforma ${data.proforma_numero} se convirtió a la venta ${data.venta_numero}`);

    console.log('🎉 Proforma convertida:', data);
  }, [playNotificationSound, showBrowserNotification, shouldReceiveNotification]);

  // ✅ NUEVO: Manejar notificación de proforma actualizada
  const handleProformaActualizada = useCallback((data: any) => {
    // ✅ Verificar si el usuario debe recibir esta notificación según su rol
    if (!shouldReceiveNotification('proforma.actualizada')) {
      console.log('🚫 Notificación filtrada: Solo preventistas, managers y admins ven actualizaciones');
      return;
    }

    const clienteName = data.cliente
      ? `${data.cliente.nombre} ${data.cliente.apellido || ''}`.trim()
      : 'Cliente';

    const notification: ProformaNotification = {
      id: data.id,
      numero: data.numero,
      cliente: {
        nombre: data.cliente?.nombre || 'Cliente',
        apellido: data.cliente?.apellido,
      },
      total: data.total,
      estado: 'ACTUALIZADA',
      timestamp: data.timestamp || new Date().toISOString(),
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Mantener últimas 50
    setUnreadCount((prev) => prev + 1);

    // ✅ Reproducir sonido
    playNotificationSound();

    // ✅ Mostrar toast
    toast.success(`📝 La proforma ${data.numero} de ${clienteName} ha sido actualizada por Bs. ${data.total}`);

    // ✅ Mostrar notificación push del navegador
    showBrowserNotification(`📝 Proforma Actualizada: ${data.numero}`, {
      body: `${clienteName} ha actualizado la proforma. Total: Bs. ${data.total}`,
      tag: `proforma-updated-${data.id}`,
    });

    console.log('📝 Proforma actualizada:', data);
  }, [playNotificationSound, showBrowserNotification, shouldReceiveNotification]);

  // Marcar como leída
  const markAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Suscribirse a eventos de WebSocket
  useEffect(() => {
    if (!isConnected) {
      console.log('⚠️  WebSocket no conectado. Esperando...');
      return;
    }

    console.log('📡 Registrando listeners para eventos de proformas');
    console.log('   (El servidor se encarga de enviar eventos a la sala clients)');

    // ✅ Escuchar eventos directamente (sin subscribe a canales)
    // El servidor WebSocket emite directamente a los sockets en la sala clients
    on('proforma.creada', handleProformaCreada);
    on('proforma.aprobada', handleProformaAprobada);
    on('proforma.rechazada', handleProformaRechazada);
    on('proforma.convertida', handleProformaConvertida);
    on('proforma.actualizada', handleProformaActualizada); // ✅ NUEVO

    console.log('✅ Event listeners registrados:');
    console.log('   - proforma.creada');
    console.log('   - proforma.aprobada');
    console.log('   - proforma.rechazada');
    console.log('   - proforma.convertida');
    console.log('   - proforma.actualizada'); // ✅ NUEVO

    // Limpiar suscripciones al desmontar
    return () => {
      off('proforma.creada', handleProformaCreada);
      off('proforma.aprobada', handleProformaAprobada);
      off('proforma.rechazada', handleProformaRechazada);
      off('proforma.convertida', handleProformaConvertida);
      off('proforma.actualizada', handleProformaActualizada); // ✅ NUEVO
    };
  }, [
    isConnected,
    on,
    off,
    handleProformaCreada,
    handleProformaAprobada,
    handleProformaRechazada,
    handleProformaConvertida,
    handleProformaActualizada, // ✅ NUEVO
  ]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    soundEnabled,
    setSoundEnabled,
    notificationsEnabled,
    requestNotificationPermission,
  };
}

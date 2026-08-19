/**
 * Unified Notifications Hook
 * Listens to ALL WebSocket events and manages them centrally
 * Supports role-based filtering and notification persistence
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import websocketService from '@/infrastructure/services/websocket.service';
import {
  BaseNotification,
  NotificationType,
  EVENT_ROLE_MAPPING,
  getEventCategory,
  WebSocketEvent,
} from '@/domain/entities/websocket-events';

interface UseUnifiedNotificationsOptions {
  userRoles?: string[];
  onNotification?: (notification: BaseNotification) => void;
  onError?: (error: Error) => void;
  filterByRoles?: boolean;
  autoSubscribePublic?: boolean;
  autoSubscribeUser?: boolean;
  userId?: number;
  orgId?: number;
  fetchAlertasVencidas?: boolean;
}

export const useUnifiedNotifications = (options: UseUnifiedNotificationsOptions = {}) => {
  const {
    userRoles = [],
    onNotification,
    onError,
    filterByRoles = true,
    autoSubscribePublic = true,
    autoSubscribeUser = true,
    userId,
    orgId,
    fetchAlertasVencidas = false,
  } = options;

  // ✅ CRITICAL: Usar state en lugar de ref para trigger re-renders cuando lleguen notificaciones
  const [notifications, setNotifications] = useState<BaseNotification[]>([]);
  const notificationsRef = useRef<Map<string, BaseNotification>>(new Map());
  const listenersRef = useRef<Map<string, () => void>>(new Map());

  /**
   * Check if current user should receive this notification
   */
  const shouldReceiveNotification = useCallback((eventName: string): boolean => {
    if (!filterByRoles) return true;

    const allowedRoles = EVENT_ROLE_MAPPING[eventName];
    if (!allowedRoles) return true; // If no role mapping, allow all

    return userRoles.some(role => allowedRoles.includes(role));
  }, [userRoles, filterByRoles]);

  /**
   * Create notification object from event data
   */
  const createNotification = useCallback((
    eventName: string,
    data: any
  ): BaseNotification => {
    const timestamp = new Date().toISOString();
    const id = `${eventName}-${timestamp}`;

    // Map event names to titles and messages
    const notificationMap: Record<string, { title: string; message: (data: any) => string }> = {
      'proforma.creada': {
        title: '📋 Nueva Pedido',
        message: (d) => `${d.clienteNombre || d.cliente?.nombre || 'Cliente'} - Folio #${d.id}`,
      },
      'proforma.aprobada': {
        title: '✅ Proforma Aprobada',
        message: (d) => `${d.clienteNombre || d.cliente?.nombre || 'Cliente'} - ${d.numero || d.proforma_numero}`,
      },
      'proforma.rechazada': {
        title: '❌ Proforma Rechazada',
        message: (d) => `${d.clienteNombre || d.cliente?.nombre || 'Cliente'} - ${d.numero || d.proforma_numero}`,
      },
      'proforma.convertida': {
        title: '🔄 Proforma Convertida',
        message: (d) => `${d.clienteNombre || d.cliente?.nombre || 'Cliente'} - Venta ${d.ventaNumero}`,
      },
      'proforma.coordinacion-actualizada': {
        title: '📝 Coordinación Actualizada',
        message: (d) => `Proforma ${d.numero}`,
      },
      'entrega.asignada': {
        title: '🚗 Entrega Asignada',
        message: (d) => `${d.choferNombre} - ${d.clienteNombre}`,
      },
      'entrega.en-camino': {
        title: '🚗 Entrega en Camino',
        message: (d) => `${d.choferNombre} - ${d.numero}`,
      },
      'entrega.confirmada': {
        title: '✔️ Entrega Confirmada',
        message: (d) => `${d.clienteNombre} - ${d.numero}`,
      },
      'entrega.completada': {
        title: '✅ Entrega Completada',
        message: (d) => `${d.clienteNombre} - ${d.choferNombre}`,
      },
      'entrega.creada': {
        title: '📦 Nueva Entrega',
        message: (d) => `${d.clienteNombre} - ${d.numero}`,
      },
      'entrega.listo': {
        title: '📤 Entrega Lista para Salida',
        message: (d) => `${d.numero_entrega} - ${d.ventas_count} venta${d.ventas_count > 1 ? 's' : ''} - Chofer: ${d.chofer_nombre}`,
      },
      'entrega.listo-cliente': {
        title: '📤 Tu Pedido Salió a Entrega',
        message: (d) => `Pedido #${d.venta_numero} - Vehículo: ${d.vehiculo_placa} - Chofer: ${d.chofer_nombre}`,
      },
      'venta.confirmada.entrega': {
        title: '✅ Venta Confirmada',
        message: (d) => {
          const msgMap: Record<string, string> = {
            'COMPLETA': `✅ Venta ${d.venta_numero} entregada a ${d.cliente_nombre}`,
            'RECHAZADO': `❌ Venta ${d.venta_numero} rechazada por ${d.cliente_nombre}`,
            'DEVOLUCION_PARCIAL': `⚠️ Venta ${d.venta_numero} - devolución parcial`,
            'CLIENTE_CERRADO': `🏪 Venta ${d.venta_numero} - local cerrado`,
            'NO_CONTACTADO': `📞 Venta ${d.venta_numero} - no contactado`,
          };
          return msgMap[d.tipo_confirmacion] || `Venta ${d.venta_numero} confirmada`;
        },
      },
      'cliente.venta.confirmada': {
        title: '✅ Tu Pedido Fue Confirmado',
        message: (d) => {
          const msgMap: Record<string, string> = {
            'COMPLETA': `✅ Tu pedido #${d.venta_numero} fue entregado correctamente`,
            'RECHAZADO': `❌ Tu pedido #${d.venta_numero} fue rechazado`,
            'DEVOLUCION_PARCIAL': `⚠️ Tu pedido #${d.venta_numero} tiene devolución parcial`,
            'CLIENTE_CERRADO': `🏪 Tu local estaba cerrado. Pedido #${d.venta_numero}`,
            'NO_CONTACTADO': `📞 No pudimos contactarte para pedido #${d.venta_numero}`,
          };
          return msgMap[d.tipo_confirmacion] || `Tu pedido #${d.venta_numero} fue confirmado`;
        },
      },
      'entrega.rechazada': {
        title: '❌ Entrega Rechazada',
        message: (d) => `${d.clienteNombre} - ${d.razon}`,
      },
      'venta.preparacion-carga': {
        title: '📦 Venta en Preparación',
        message: (d) => `${d.cantidad_ventas || 1} venta${d.cantidad_ventas > 1 ? 's' : ''} en preparación - ${d.numero_entrega || 'Entrega'}`,
      },
      'venta.listo-para-entrega': {
        title: '✅ Venta Lista para Entrega',
        message: (d) => `${d.cantidad_ventas || 1} venta${d.cantidad_ventas > 1 ? 's' : ''} lista${d.cantidad_ventas > 1 ? 's' : ''} para envío - ${d.numero_entrega || 'Entrega'}`,
      },
      'venta.listo-para-entrega-admin': {
        title: '📦 Ventas Listas para Envío',
        message: (d) => `${d.cantidad_ventas || 1} venta${d.cantidad_ventas > 1 ? 's' : ''} de ${d.clientes_unicos || 1} cliente${d.clientes_unicos > 1 ? 's' : ''} - Entrega ${d.numero_entrega || 'N/A'}`,
      },
      'venta.en-transito': {
        title: '🚚 Venta en Tránsito',
        message: (d) => `${d.cantidad_ventas || 1} venta${d.cantidad_ventas > 1 ? 's' : ''} en camino - Chofer: ${d.chofer?.nombre || 'N/A'}`,
      },
      'venta.entregada': {
        title: '✅ Venta Entregada',
        message: (d) => `Tu venta ${d.venta_numero} ha sido entregada`,
      },
      'venta.entregada-admin': {
        title: '✅ Venta Entregada',
        message: (d) => `Venta ${d.venta_numero} de ${d.cliente_nombre} ha sido entregada`,
      },
      'entrega.en-transito-admin': {
        title: '🚚 Entrega en Tránsito',
        message: (d) => `${d.cantidad_ventas || 1} venta${d.cantidad_ventas > 1 ? 's' : ''} de ${d.clientes_unicos || 1} cliente${d.clientes_unicos > 1 ? 's' : ''} en camino`,
      },
      'entrega.finalizada-admin': {
        title: '✅ Entrega Finalizada',
        message: (d) => `Entrega ${d.numero_entrega} completada - ${d.cantidad_ventas || 1} venta${d.cantidad_ventas > 1 ? 's' : ''} entregada${d.cantidad_ventas > 1 ? 's' : ''}`,
      },
      'entrega.estado-cambio': {
        title: '📊 Cambio de Estado de Entrega',
        message: (d) => `Entrega ${d.numero_entrega} cambió a ${d.estado_nuevo} - ${d.cantidad_ventas || 1} venta${d.cantidad_ventas > 1 ? 's' : ''} por Bs. ${(d.monto_total || 0).toFixed(2)}`,
      },
      'ubicacion.actualizada': {
        title: '📍 Ubicación Actualizada',
        message: (d) => `${d.choferNombre} - En ruta`,
      },
      'ubicacion.llegada-confirmada': {
        title: '📍 Llegada Confirmada',
        message: (d) => `${d.choferNombre} - ${d.clienteNombre}`,
      },
      'ruta.planificada': {
        title: '🗺️ Ruta Planificada',
        message: (d) => `Chofer ${d.choferNombre} - ${d.cantidadParadas} paradas`,
      },
      'ruta.detalle-actualizado': {
        title: '🗺️ Detalle de Ruta Actualizado',
        message: (d) => `Ruta ${d.rutaId} actualizada`,
      },
      'ruta.modificada': {
        title: '🗺️ Ruta Modificada',
        message: (d) => `${d.numero} - ${d.razonModificacion}`,
      },
      'novedad.reportada': {
        title: '⚠️ Novedad Reportada',
        message: (d) => `${d.tipo} - ${d.descripcion}`,
      },
      'novedad.entrega-reportada': {
        title: '⚠️ Novedad en Entrega',
        message: (d) => `${d.tipo} - ${d.entregaNumero}`,
      },
      'chofer.en-camino': {
        title: '🚗 Chofer en Camino',
        message: (d) => `${d.choferNombre} - Ruta ${d.rutaId}`,
      },
      'chofer.llego': {
        title: '🚗 Chofer Llegó',
        message: (d) => `${d.choferNombre} - ${d.clienteNombre}`,
      },
      'pedido.entregado': {
        title: '📦 Pedido Entregado',
        message: (d) => `${d.clienteNombre} - ${d.pedidoNumero}`,
      },
      'credito.vencido': {
        title: '⚠️ Crédito Vencido',
        message: (d) => `${d.cliente_nombre} - Deuda: Bs. ${d.saldo_pendiente}`,
      },
      'credito.critico': {
        title: '🔴 Crédito Crítico',
        message: (d) => `${d.cliente_nombre} - ${d.porcentaje_utilizado}% utilizado`,
      },
      'credito.pago-registrado': {
        title: '✅ Pago Registrado',
        message: (d) => `Bs. ${d.monto} - ${d.tipo_pago}`,
      },
      'dashboard.metrics-updated': {
        title: '📊 Dashboard Actualizado',
        message: () => 'Métricas de negocio actualizadas',
      },
      'notificacion-recurrente-emitida': {
        title: (d) => d.titulo || '📢 Notificación',
        message: (d) => d.descripcion || 'Nueva notificación recibida',
      },
      'prestamo.cliente.creado': {
        title: '🎁 Nuevo Préstamo a Cliente',
        message: (d) => `${d.cliente_nombre || d.cliente?.nombre || 'Cliente'} - ${d.cantidad} artículos`,
      },
      'prestamo.evento.creado': {
        title: '🎁 Nuevo Préstamo a Evento',
        message: (d) => `${d.nombre_evento || 'Evento'} - ${d.cantidad} artículos`,
      },
    };

    const config = notificationMap[eventName];
    const title = typeof config?.title === 'function' ? config.title(data) : (config?.title || `Evento: ${eventName}`);
    const message = config?.message(data) || JSON.stringify(data).substring(0, 100);

    return {
      id,
      type: getEventCategory(eventName),
      title,
      message,
      data,
      read: false,
      createdAt: timestamp,
      roles: EVENT_ROLE_MAPPING[eventName],
    };
  }, []);

  /**
   * Handle incoming notification
   */
  const handleNotification = useCallback((eventName: string) => {
    return (eventData: any) => {
      try {
        if (!shouldReceiveNotification(eventName)) {
          console.log(`⏭️ Notificación omitida (rol no permitido): ${eventName}`);
          return;
        }

        // ✅ DEDUPLICACIÓN: Evitar notificaciones duplicadas
        // Si ya existe una notificación con el mismo evento + datos en los últimos 500ms, ignorarla
        const eventKey = `${eventName}:${eventData.id || eventData.proforma_id || eventData.numero}`;
        const lastNotifTime = (window as any).__lastNotificationEvents?.[eventKey] || 0;
        const now = Date.now();

        if (now - lastNotifTime < 500) { // Si llegó en menos de 500ms, es duplicada
          console.log(`⏭️ Notificación duplicada ignorada: ${eventName} (misma dentro de 500ms)`);
          return;
        }

        // Registrar que recibimos este evento
        if (!(window as any).__lastNotificationEvents) {
          (window as any).__lastNotificationEvents = {};
        }
        (window as any).__lastNotificationEvents[eventKey] = now;

        const notification = createNotification(eventName, eventData);
        notificationsRef.current.set(notification.id, notification);

        // ✅ CRITICAL: Actualizar state para trigger re-render del componente
        setNotifications(Array.from(notificationsRef.current.values()));

        console.log(`📬 Notificación recibida: ${eventName}`, notification);
        console.log(`🔔 Total de notificaciones: ${notificationsRef.current.size}, No leídas: ${Array.from(notificationsRef.current.values()).filter(n => !n.read).length}`);

        // Play notification sound
        // playNotificationSound();  // Desactivado temporalmente

        // Call user callback
        if (onNotification) {
          onNotification(notification);
        }

        // ✅ NUEVO: Show toast in the UI (top right corner)
        // console.log('🍞 Attempting to show toast for:', notification.title);
        toast(`${notification.title} - ${notification.message}`, {
          duration: 4000,
          icon: '🔔',
        });

        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: eventName,
          });
        }
      } catch (error) {
        console.error(`Error procesando evento ${eventName}:`, error);
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    };
  }, [shouldReceiveNotification, createNotification, onNotification, onError]);

  // ✅ Rastrear si ya se han configurado los listeners para evitar reconfiguración
  const listenersConfiguredRef = useRef(false);

  /**
   * Setup all event listeners (función extraída para reutilizar)
   * ✅ CORREGIDO (2026-08-08): Se ejecuta cuando el WebSocket se conecte, no solo al montar
   */
  const setupAllListeners = useCallback(() => {
    // ✅ Esperar a que el WebSocket esté conectado
    if (!websocketService.isSocketConnected()) {
      console.log('⏳ WebSocket no conectado aún, esperando...');
      return;
    }

    if (listenersConfiguredRef.current) {
      console.log('ℹ️ Listeners ya configurados, omitiendo reconfiguración');
      return;
    }

    console.log('🔔 Configurando listeners de notificaciones unificadas...');

    // PROFORMA EVENTS
    const setupListener = (eventName: string) => {
      try {
        console.log(`🔌 Registrando listener para evento: ${eventName}`);
        const listener = handleNotification(eventName);
        websocketService.on(eventName, listener);
        listenersRef.current.set(eventName, () => {
          websocketService.off(eventName, listener);
        });
        console.log(`✅ Listener registrado: ${eventName}`);
      } catch (error) {
        console.error(`❌ Error configurando listener para ${eventName}:`, error);
      }
    };

    // Setup all listeners
    console.log('📡 Iniciando registro de listeners...');
    const events = [
      'proforma.creada',
      'proforma.aprobada',
      'proforma.rechazada',
      'proforma.convertida',
      'proforma.coordinacion-actualizada',
      'entrega.asignada',
      'entrega.en-camino',
      'entrega.confirmada',
      'entrega.completada',
      'entrega.creada',
      'entrega.listo',
      'entrega.listo-cliente',
      'venta.confirmada.entrega',
      'cliente.venta.confirmada',
      'entrega.rechazada',
      'entrega.estado-cambio',
      'venta.preparacion-carga',
      'venta.listo-para-entrega',
      'venta.listo-para-entrega-admin',
      'venta.en-transito',
      'venta.entregada',
      'venta.entregada-admin',
      'entrega.en-transito-admin',
      'entrega.finalizada-admin',
      'ubicacion.actualizada',
      'ubicacion.llegada-confirmada',
      'ruta.planificada',
      'ruta.detalle-actualizado',
      'ruta.modificada',
      'novedad.reportada',
      'novedad.entrega-reportada',
      'chofer.en-camino',
      'chofer.llego',
      'pedido.entregado',
      'credito.vencido',
      'credito.critico',
      'credito.pago-registrado',
      'dashboard.metrics-updated',
      'notificacion-recurrente-emitida',
      'prestamo.cliente.creado',
      'prestamo.evento.creado',
    ];

    events.forEach(setupListener);
    console.log(`✅ Total de listeners registrados: ${events.length}`);
    console.log(`📋 Eventos registrados:`, events);

    // Auto-subscribe to channels if configured
    if (autoSubscribePublic) {
      console.log('📌 Auto-suscribiendo a canales públicos...');
      websocketService.subscribeToPublicProformas();
      websocketService.subscribeToPublicDeliveries();
      websocketService.subscribeToPublicRoutes();
      websocketService.subscribeToTracking();
    }

    if (autoSubscribeUser && userId) {
      console.log(`📌 Auto-suscribiendo a canal del usuario: user_${userId}`);
      websocketService.subscribeToUser(userId);
    }

    if (orgId) {
      websocketService.subscribeToOrganization(orgId);
    }

    // ✅ Marcar que los listeners ya están configurados
    listenersConfiguredRef.current = true;

    console.log('✅ Listeners de notificaciones configurados exitosamente');
  }, [shouldReceiveNotification, createNotification, onNotification, onError, autoSubscribePublic, autoSubscribeUser, userId, orgId]);

  /**
   * Ejecutar setup cuando el WebSocket esté listo
   * ✅ CORREGIDO (2026-08-08): Usar onLocal() para escuchar eventos de conexión
   */
  useEffect(() => {
    // Intentar configurar inmediatamente si ya está conectado
    setupAllListeners();

    // También configurar cuando se conecte después
    const handleWebSocketConnected = () => {
      console.log('📡 WebSocket conectado, configurando listeners...');
      // Limpiar listeners anteriores para evitar duplicados
      listenersRef.current.forEach(cleanup => cleanup());
      listenersRef.current.clear();
      // Resetear flag para permitir reconfiguracion cuando se reconecte
      listenersConfiguredRef.current = false;
      setupAllListeners();
    };

    // ✅ Usar onLocal() porque websocket:connected es un evento local, no de socket
    websocketService.onLocal('websocket:connected', handleWebSocketConnected);

    return () => {
      websocketService.off('websocket:connected', handleWebSocketConnected);
      // Cleanup listeners
      listenersConfiguredRef.current = false;
      listenersRef.current.forEach(cleanup => cleanup());
      listenersRef.current.clear();
    };
  }, [setupAllListeners]);

  /**
   * Fetch alertas de cuentas vencidas con delay (post-login)
   */
  useEffect(() => {
    if (!fetchAlertasVencidas) {
      return;
    }

    // console.log('⏳ Iniciando fetch de alertas de cuentas vencidas con delay de 1500ms...');

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/alertas/cuentas-vencidas', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          console.warn(`Error fetching alertas vencidas: ${response.status}`);
          return;
        }

        const data = await response.json();

        if (!data.cuentas || data.cuentas.length === 0) {
          // console.log('✅ No hay cuentas vencidas');
          return;
        }

        // console.log(`📬 Se encontraron ${data.cuentas.length} cuentas vencidas`);

        // Convertir cada cuenta en una notificación
        data.cuentas.forEach((cuenta: any) => {
          const notification: BaseNotification = {
            id: `cuenta-vencida-${cuenta.id}`,
            type: 'creditos',
            title: '⚠️ Cuenta Vencida',
            message: `${cuenta.cliente_nombre} - Bs. ${cuenta.saldo_pendiente} (${cuenta.dias_vencido} días)`,
            data: cuenta,
            read: false,
            createdAt: new Date().toISOString(),
            roles: userRoles,
          };

          // Agregar a notificaciones si no existe
          if (!notificationsRef.current.has(notification.id)) {
            notificationsRef.current.set(notification.id, notification);
            setNotifications(Array.from(notificationsRef.current.values()));

            // console.log(`📬 Notificación de cuenta vencida agregada: ${notification.id}`);

            // Callback si está configurado
            if (onNotification) {
              onNotification(notification);
            }
          }
        });

        // console.log(`✅ ${data.cuentas.length} notificaciones de cuentas vencidas cargadas`);
      } catch (error) {
        console.error('❌ Error fetching alertas de cuentas vencidas:', error);
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    }, 1500); // 1500ms delay

    return () => clearTimeout(timer);
  }, [fetchAlertasVencidas, userRoles, onNotification, onError]);

  /**
   * Request browser notification permission
   */
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  /**
   * Play notification sound
   */
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch((error) => {
        console.log('No se pudo reproducir sonido de notificación:', error);
      });
    } catch (error) {
      console.log('Error reproduciendo sonido:', error);
    }
  }, []);

  /**
   * Get all notifications
   */
  const getNotifications = useCallback(() => {
    return Array.from(notificationsRef.current.values());
  }, []);

  /**
   * Clear notifications
   */
  const clearNotifications = useCallback(() => {
    notificationsRef.current.clear();
    // ✅ Actualizar state para re-render
    setNotifications([]);
  }, []);

  /**
   * Mark notification as read
   */
  const markAsRead = useCallback((notificationId: string) => {
    const notification = notificationsRef.current.get(notificationId);
    if (notification) {
      notification.read = true;
      // ✅ Actualizar state para re-render
      setNotifications(Array.from(notificationsRef.current.values()));
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    getNotifications,
    clearNotifications,
    markAsRead,
    requestNotificationPermission,
    notifications, // ✅ Ahora es state, causa re-renders
    unreadCount, // ✅ Calcula desde state
  };
};

export default useUnifiedNotifications;

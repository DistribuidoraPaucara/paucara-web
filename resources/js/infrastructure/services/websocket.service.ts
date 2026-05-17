// Infrastructure Layer: WebSocket Service for Real-time Communication
// Handles Socket.IO connection, authentication, and event listening

import io, { Socket } from 'socket.io-client';

interface WebSocketConfig {
  url?: string;
  auth?: {
    token: string;
    userId?: number;
  };
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  reconnectionAttempts?: number;
}

type EventListener = (data: any) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners = new Map<string, Set<EventListener>>();
  private subscribedChannels = new Set<string>();

  /**
   * Initialize WebSocket connection
   */
  connect(config: WebSocketConfig = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Priority: config.url > runtime config > env variable > fallback
        const baseUrl = config.url ||
                        (window as any).__APP_CONFIG__?.websocketUrl ||
                        import.meta.env.VITE_WEBSOCKET_URL ||
                        'http://localhost:3001';

        console.log('🔌 WebSocket URL:', baseUrl);

        this.socket = io(baseUrl, {
          reconnection: config.reconnection !== false,
          reconnectionDelay: config.reconnectionDelay || 1000,
          reconnectionDelayMax: config.reconnectionDelayMax || 5000,
          reconnectionAttempts: config.reconnectionAttempts || 10, // Aumentado para esperar al token
          auth: config.auth ? {
            token: config.auth.token,
            userId: config.auth.userId,
          } : undefined,
          transports: ['websocket', 'polling'],
        });

        // Connection events
        this.socket.on('connect', () => {
          console.log('✅ WebSocket conectado:', this.socket?.id);
          this.isConnected = true;

          // 🔐 Autenticar inmediatamente después de conectarse
          if (config.auth?.token) {
            console.log('🔐 Enviando autenticación al servidor WebSocket...');
            console.log(`🔐 Token: ${config.auth.token.substring(0, 20)}...`);
            console.log(`🔐 User ID: ${config.auth.userId}`);
            this.socket!.emit('authenticate', {
              token: config.auth.token,
              userId: config.auth.userId,
              user_id: config.auth.userId, // Legacy
              type: 'web' // Identificar como cliente web
            });
          } else {
            console.warn('⚠️  WebSocket conectado pero NO hay token para autenticar');
          }

          this.emitLocal('websocket:connected', { socketId: this.socket?.id });
          resolve();
        });

        // Auth success event
        this.socket.on('authenticated', (data) => {
          console.log('✅ Autenticación exitosa en WebSocket:', data);
          this.emitLocal('websocket:authenticated', data);
        });

        // Auth error event
        this.socket.on('authentication_error', (data) => {
          console.error('❌ Error de autenticación en WebSocket:', data);
          this.emitLocal('websocket:auth_error', data);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('❌ WebSocket desconectado:', reason);
          this.isConnected = false;
          this.emitLocal('websocket:disconnected', { reason });
        });

        this.socket.on('connect_error', (error) => {
          console.error('🔴 Error de conexión WebSocket:', error);
          this.emitLocal('websocket:error', { error: error.message });
          reject(error);
        });

        // Auth error
        this.socket.on('auth_error', (error) => {
          console.error('🔐 Error de autenticación:', error);
          this.emitLocal('websocket:auth_error', error);
          // No rechazar aquí - dejar que se reconecte automáticamente
          // reject(new Error(error.message || 'Authentication failed'));
        });

      } catch (error) {
        console.error('Error al inicializar WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Subscribe to a private channel
   * Channels are: pedido.{id}, entrega.{id}, chofer.{id}, admin.pedidos
   */
  subscribeTo(channelName: string, callback?: EventListener): void {
    if (!this.socket) {
      console.error('WebSocket no está conectado');
      return;
    }

    console.log(`📡 Suscribiendo a canal: ${channelName}`);
    this.subscribedChannels.add(channelName);

    // Join the room
    this.socket.emit('subscribe', {
      channel: channelName,
      auth: {
        token: localStorage.getItem('auth_token'),
      },
    });

    // Listen to all events from this channel
    if (callback) {
      this.on(channelName, callback);
    }
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribeFrom(channelName: string): void {
    if (!this.socket) return;

    console.log(`🚫 Desuscribiendo de canal: ${channelName}`);
    this.subscribedChannels.delete(channelName);

    // Leave the room
    this.socket.emit('unsubscribe', { channel: channelName });

    // Remove all listeners for this channel
    this.listeners.delete(channelName);
  }

  /**
   * Actualizar token en sessionStorage
   * Se llama cuando el token cambia (login/logout)
   */
  updateToken(newToken: string | null): void {
    if (newToken) {
      sessionStorage.setItem('auth_token', newToken);
      console.log(`✅ Token actualizado en sessionStorage: ${newToken.substring(0, 20)}...`);
    } else {
      sessionStorage.removeItem('auth_token');
      console.log(`🗑️  Token removido de sessionStorage`);
    }
  }

  /**
   * Listen to specific event on a channel
   * Example: on('entrega.123', 'ubicacion.actualizada', handler)
   * Or general: on('ubicacion.actualizada', handler)
   */
  on(eventName: string, callback: EventListener): void {
    if (!this.socket) {
      console.error('WebSocket no está conectado');
      return;
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());

      // Setup socket listener (once per event)
      this.socket.on(eventName, (data) => {
        console.log(`📨 Evento recibido: ${eventName}`, data);
        this.emitLocal(eventName, data);
      });
    }

    // Add callback to listeners
    this.listeners.get(eventName)!.add(callback);
  }

  /**
   * Stop listening to an event
   */
  off(eventName: string, callback?: EventListener): void {
    if (!this.listeners.has(eventName)) return;

    if (callback) {
      this.listeners.get(eventName)!.delete(callback);
    } else {
      this.listeners.delete(eventName);
    }
  }

  /**
   * Emit local event (for internal communication)
   */
  private emitLocal(eventName: string, data: any): void {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName)!.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en callback de ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Check if connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | null {
    return this.socket?.id || null;
  }

  /**
   * Get subscribed channels
   */
  getSubscribedChannels(): string[] {
    return Array.from(this.subscribedChannels);
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('Desconectando WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      this.subscribedChannels.clear();
    }
  }

  /**
   * Reconnect to server
   */
  reconnect(config?: WebSocketConfig): Promise<void> {
    this.disconnect();
    return this.connect(config);
  }

  /**
   * Emit custom event to server
   */
  emit(eventName: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(eventName, data);
    } else {
      console.warn('WebSocket no está conectado, no se puede emitir:', eventName);
    }
  }

  /**
   * Useful event listeners for common scenarios
   */
  onEntregaUbicacionActualizada(
    entregaId: number,
    callback: (ubicacion: any) => void
  ): void {
    this.subscribeTo(`entrega.${entregaId}`);
    this.on('ubicacion.actualizada', callback);
  }

  onEntregaEstadoChanged(
    entregaId: number,
    callback: (data: any) => void
  ): void {
    this.subscribeTo(`entrega.${entregaId}`);
    this.on('entrega.estado-cambio', callback);
  }

  onProformaAprobada(
    proformaId: number,
    callback: (data: any) => void
  ): void {
    this.subscribeTo(`pedido.${proformaId}`);
    this.on('proforma.aprobada', callback);
  }

  onProformaRechazada(
    proformaId: number,
    callback: (data: any) => void
  ): void {
    this.subscribeTo(`pedido.${proformaId}`);
    this.on('proforma.rechazada', callback);
  }

  onChoferEnCamino(
    entregaId: number,
    callback: (data: any) => void
  ): void {
    this.subscribeTo(`entrega.${entregaId}`);
    this.on('chofer.en-camino', callback);
  }

  onChoferLlegada(
    entregaId: number,
    callback: (data: any) => void
  ): void {
    this.subscribeTo(`entrega.${entregaId}`);
    this.on('chofer.llegada', callback);
  }

  onPedidoEntregado(
    entregaId: number,
    callback: (data: any) => void
  ): void {
    this.subscribeTo(`entrega.${entregaId}`);
    this.on('pedido.entregado', callback);
  }

  onNovedadReportada(
    entregaId: number,
    callback: (data: any) => void
  ): void {
    this.subscribeTo(`entrega.${entregaId}`);
    this.on('novedad.reportada', callback);
  }

  // Admin channels
  onAdminPedidos(callback: (data: any) => void): void {
    this.subscribeTo('admin.pedidos');
    this.on('admin.pedidos', callback);
  }

  // ==================== PROFORMA EVENTS ====================
  onProformaCreada(callback: (data: any) => void): void {
    this.on('proforma.creada', callback);
  }

  onProformaCoordinacionActualizada(callback: (data: any) => void): void {
    this.on('proforma.coordinacion-actualizada', callback);
  }

  // ==================== ENTREGA EVENTS ====================
  onEntregaAsignada(callback: (data: any) => void): void {
    this.on('entrega.asignada', callback);
  }

  onEntregaEnCamino(callback: (data: any) => void): void {
    this.on('entrega.en-camino', callback);
  }

  onEntregaConfirmada(callback: (data: any) => void): void {
    this.on('entrega.confirmada', callback);
  }

  onEntregaCompletada(callback: (data: any) => void): void {
    this.on('entrega.completada', callback);
  }

  onEntregaCreada(callback: (data: any) => void): void {
    this.on('entrega.creada', callback);
  }

  onEntregaRechazada(callback: (data: any) => void): void {
    this.on('entrega.rechazada', callback);
  }

  // ==================== UBICACION EVENTS ====================
  onUbicacionActualizada(callback: (data: any) => void): void {
    this.on('ubicacion.actualizada', callback);
  }

  onUbicacionLlegadaConfirmada(callback: (data: any) => void): void {
    this.on('ubicacion.llegada-confirmada', callback);
  }

  // ==================== RUTA EVENTS ====================
  onRutaPlanificada(callback: (data: any) => void): void {
    this.on('ruta.planificada', callback);
  }

  onRutaDetalleActualizado(callback: (data: any) => void): void {
    this.on('ruta.detalle-actualizado', callback);
  }

  onRutaModificada(callback: (data: any) => void): void {
    this.on('ruta.modificada', callback);
  }

  // ==================== NOVEDAD EVENTS ====================
  onNovedadEntregaReportada(callback: (data: any) => void): void {
    this.on('novedad.entrega-reportada', callback);
  }

  // ==================== CHOFER EVENTS ====================
  onChoferLlego(callback: (data: any) => void): void {
    this.on('chofer.llego', callback);
  }

  // ==================== PEDIDO EVENTS ====================
  // Already has onPedidoEntregado above

  // ==================== DASHBOARD EVENTS ====================
  onDashboardMetricsUpdated(callback: (data: any) => void): void {
    this.on('dashboard.metrics-updated', callback);
  }

  // ==================== CHANNEL-SPECIFIC LISTENERS ====================

  /**
   * Subscribe to specific entrega channel and listen to all its events
   */
  subscribeToEntrega(entregaId: number): void {
    this.subscribeTo(`entrega.${entregaId}`);
  }

  /**
   * Subscribe to specific pedido channel and listen to all its events
   */
  subscribeToPedido(pedidoId: number): void {
    this.subscribeTo(`pedido.${pedidoId}`);
  }

  /**
   * Subscribe to specific chofer channel and listen to all its events
   */
  subscribeToChofer(choferId: number): void {
    this.subscribeTo(`chofer.${choferId}`);
  }

  /**
   * Subscribe to specific ruta channel and listen to all its events
   */
  subscribeToRuta(rutaId: number): void {
    this.subscribeTo(`ruta.${rutaId}`);
  }

  /**
   * Subscribe to organization-level notifications
   */
  subscribeToOrganization(orgId: number): void {
    this.subscribeTo(`private.org.${orgId}`);
  }

  /**
   * Subscribe to user-specific notifications
   */
  subscribeToUser(userId: number): void {
    this.subscribeTo(`private.user.${userId}`);
  }

  /**
   * Subscribe to public sales channel
   */
  subscribeToPublicSales(): void {
    this.subscribeTo('public.ventas.created');
  }

  /**
   * Subscribe to public proformas channel
   */
  subscribeToPublicProformas(): void {
    this.subscribeTo('public.proformas.created');
  }

  /**
   * Subscribe to public deliveries channel
   */
  subscribeToPublicDeliveries(): void {
    this.subscribeTo('public.entregas.assigned');
  }

  /**
   * Subscribe to public routes channel
   */
  subscribeToPublicRoutes(): void {
    this.subscribeTo('public.rutas.planned');
  }

  /**
   * Subscribe to tracking channel
   */
  subscribeToTracking(): void {
    this.subscribeTo('public.tracking.active');
  }
}

// Singleton instance
const websocketService = new WebSocketService();
export default websocketService;

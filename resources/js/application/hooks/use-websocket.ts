// Application Layer: WebSocket hook for real-time communication
// ⚠️ DEPRECADO: Usa useWebSocketContext() en su lugar
// Este hook se mantiene por compatibilidad backward
import { useEffect, useCallback, useState, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import websocketService from '@/infrastructure/services/websocket.service';
import { useAuth } from './use-auth';

export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  channels?: string[];
}

interface UseWebSocketReturn {
  status: WebSocketStatus;
  isConnected: boolean;
  socketId: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribeTo: (channel: string) => void;
  unsubscribeFrom: (channel: string) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  subscribedChannels: string[];
}

/**
 * Hook DEPRECADO para manejar la conexión WebSocket
 *
 * ⚠️ DEPRECADO: Por favor usa useWebSocketContext() en su lugar
 * Esto mantiene compatibilidad pero se recomienda migrar a WebSocketProvider + useWebSocketContext()
 *
 * Uso básico:
 * ```tsx
 * const { status, isConnected, subscribeTo } = useWebSocket();
 *
 * useEffect(() => {
 *   if (isConnected) {
 *     subscribeTo('entrega.123');
 *   }
 * }, [isConnected]);
 * ```
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { autoConnect = true, channels = [] } = options;
  const { user } = useAuth();
  const { props } = usePage();

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [socketId, setSocketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>(channels);
  const connectionAttemptRef = useRef(false);

  // Conectar al WebSocket
  const connect = useCallback(async () => {
    // ✅ Si el websocket ya está conectado, simplemente actualizar estado
    if (websocketService.isSocketConnected()) {
      // console.log('✅ WebSocket ya está conectado globalmente, reutilizando...');
      setStatus('connected');
      setSocketId(websocketService.getSocketId());
      return;
    }

    if (connectionAttemptRef.current || status === 'connected') {
      return;
    }

    connectionAttemptRef.current = true;
    setStatus('connecting');
    setError(null);

    try {
      // 🔍 DEBUG: Log completo del props y sus contenidos
      /* console.log('🔍 [WebSocket Debug] props completo:', JSON.stringify(props, null, 2));
      console.log('🔍 [WebSocket Debug] props.auth:', (props?.auth as any));
      console.log('🔍 [WebSocket Debug] props.auth.sanctumToken:', (props?.auth as any)?.sanctumToken);
      console.log('🔍 [WebSocket Debug] props.auth.sanctumToken tipo:', typeof (props?.auth as any)?.sanctumToken);
      console.log('🔍 [WebSocket Debug] props.auth.sanctumToken es null?:', (props?.auth as any)?.sanctumToken === null);
      console.log('🔍 [WebSocket Debug] props.auth.sanctumToken es undefined?:', (props?.auth as any)?.sanctumToken === undefined); */

      // ✅ PRIORIDAD 1: Obtener token desde props de Inertia (más rápido y confiable)
      let token = (props?.auth as any)?.sanctumToken;

      // ✅ PRIORIDAD 2: Si no hay en props, intentar sessionStorage (fallback)
      if (!token) {
        const sessionToken = sessionStorage.getItem('auth_token');
        console.warn('⚠️  [WebSocket] Token AUSENTE en props de Inertia');
        console.warn(`⚠️  [WebSocket] Verificando sessionStorage. Valor: ${sessionToken ? sessionToken.substring(0, 20) + '...' : 'null'}`);

        if (sessionToken) {
          console.warn('⚠️  [WebSocket] USANDO FALLBACK: Token de sessionStorage');
          console.warn(`⚠️  [WebSocket] Este token puede ser de una sesión anterior`);
          token = sessionToken;
        } else {
          console.error('❌ [WebSocket] CRÍTICO: No hay token en props NI en sessionStorage');
          console.error('❌ [WebSocket] Usuario no autenticado. Esto puede causar error TOKEN_NOT_FOUND en WebSocket');
        }
      } else {
        /* console.log('✅ [WebSocket] Token obtenido de props de Inertia (CORRECTO)');
        console.log(`✅ [WebSocket] Token: ${token.substring(0, 20)}...`);
        console.log(`✅ [WebSocket] Usuario ID: ${user?.id}`); */
        // Guardar en sessionStorage para futuras referencias (se limpia al cerrar navegador)
        sessionStorage.setItem('auth_token', token);
      }

      if (!token) {
        throw new Error('No authentication token found. Por favor inicia sesión nuevamente.');
      }

      /* console.log('🔐 [WebSocket] Conectando con token:', `${token.substring(0, 20)}...`);
      console.log('🔐 [WebSocket] Usuario ID:', user?.id); */

      await websocketService.connect({
        url: import.meta.env.VITE_WEBSOCKET_URL,
        auth: {
          token,
          userId: user?.id,
        },
      });

      setStatus('connected');
      setSocketId(websocketService.getSocketId());

      // Suscribirse a canales iniciales
      channels.forEach(channel => {
        websocketService.subscribeTo(channel);
      });

      // Escuchar eventos de conexión
      websocketService.on('websocket:connected', (data: any) => {
        setSocketId(data.socketId);
      });

      websocketService.on('websocket:disconnected', () => {
        setStatus('disconnected');
        setSocketId(null);
      });

      websocketService.on('websocket:error', (data: any) => {
        setStatus('error');
        setError(data.error);
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setStatus('error');
      setError(errorMessage);
      console.error('WebSocket connection error:', err);
    } finally {
      connectionAttemptRef.current = false;
    }
  }, [status, user?.id, channels, props?.auth]);

  // Desconectar
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setStatus('disconnected');
    setSocketId(null);
    setSubscribedChannels([]);
  }, []);

  // Suscribirse a un canal
  const subscribeTo = useCallback((channel: string) => {
    if (!websocketService.isSocketConnected()) {
      console.warn('WebSocket no está conectado');
      return;
    }

    websocketService.subscribeTo(channel);
    setSubscribedChannels(prev =>
      prev.includes(channel) ? prev : [...prev, channel]
    );
  }, []);

  // Desuscribirse de un canal
  const unsubscribeFrom = useCallback((channel: string) => {
    websocketService.unsubscribeFrom(channel);
    setSubscribedChannels(prev => prev.filter(c => c !== channel));
  }, []);

  // Escuchar evento
  const on = useCallback((event: string, callback: (data: any) => void) => {
    websocketService.on(event, callback);
  }, []);

  // Dejar de escuchar evento
  const off = useCallback((event: string, callback?: (data: any) => void) => {
    websocketService.off(event, callback);
  }, []);

  // Emitir evento
  const emit = useCallback((event: string, data: any) => {
    websocketService.emit(event, data);
  }, []);

  // Conectar automáticamente al montar el componente o cuando haya token disponible
  useEffect(() => {
    // ✅ Esperar a que haya usuario y token disponible
    if (autoConnect && user && (props?.auth as any)?.sanctumToken) {
      connect();
    }

    return () => {
      // No desconectar automáticamente al desmontar para mantener la conexión global
      // disconnect();
    };
  }, [autoConnect, user, connect, (props?.auth as any)?.sanctumToken]);

  return {
    status,
    isConnected: status === 'connected',
    socketId,
    error,
    connect,
    disconnect,
    subscribeTo,
    unsubscribeFrom,
    on,
    off,
    emit,
    subscribedChannels,
  };
}

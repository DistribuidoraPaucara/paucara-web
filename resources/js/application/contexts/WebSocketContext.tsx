import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import websocketService from '@/infrastructure/services/websocket.service';

export type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WebSocketContextType {
  status: WebSocketStatus;
  isConnected: boolean;
  socketId: string | null;
  error: string | null;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  channels?: string[];
}

/**
 * WebSocket Provider - Centraliza la conexión WebSocket
 * Asegura una única conexión global para toda la aplicación
 */
export function WebSocketProvider({
  children,
  autoConnect = true,
  channels = []
}: WebSocketProviderProps) {
  const { props } = usePage();
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [socketId, setSocketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs para evitar conexiones múltiples
  const connectionInitializedRef = useRef(false);
  const connectionPromiseRef = useRef<Promise<void> | null>(null);

  /**
   * Conectar al WebSocket (una sola vez)
   */
  const connect = React.useCallback(async (token?: string, userId?: number) => {
    // Si ya hay una conexión activa, no hacer nada
    if (websocketService.isSocketConnected()) {
      // console.log('✅ WebSocket ya está conectado. Reutilizando conexión.');
      return;
    }

    // Si hay una conexión en progreso, esperar a que termine
    if (connectionPromiseRef.current) {
      // console.log('⏳ Conexión en progreso. Esperando...');
      return connectionPromiseRef.current;
    }

    // Si ya se intentó conectar, no volver a intentar
    if (connectionInitializedRef.current && status !== 'error') {
      console.log('⏸️ Conexión ya fue inicializada.');
      return;
    }

    try {
      setStatus('connecting');
      setError(null);

      // 🔍 DEBUG: Verificar dónde viene el token
      // console.log('🔍 [WebSocketContext Debug] Token recibido como parámetro:', token ? `${token.substring(0, 20)}...` : 'undefined');

      // Obtener el token del sessionStorage si no se proporciona
      const authToken = token || sessionStorage.getItem('auth_token');

      if (!authToken) {
        throw new Error('No authentication token found. Por favor inicia sesión nuevamente.');
      }

      // console.log('✅ [WebSocketContext] Token seleccionado:', `${authToken.substring(0, 20)}...`);
      // console.log('✅ [WebSocketContext] Usando token de:', token ? 'parámetro directo' : 'localStorage');

      // Crear promesa de conexión y almacenarla
      // Note: websocketService.connect() automatically resolves the URL from runtime config
      connectionPromiseRef.current = websocketService.connect({
        auth: {
          token: authToken,
          userId: userId,
        },
      });

      await connectionPromiseRef.current;

      setStatus('connected');
      setSocketId(websocketService.getSocketId());
      connectionInitializedRef.current = true;

      // Suscribirse a canales iniciales
      channels.forEach(channel => {
        // console.log(`📡 Suscribiendo a canal: ${channel}`);
        websocketService.subscribeTo(channel);
      });

      // console.log('🎉 WebSocket conectado exitosamente en el Context');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setStatus('error');
      setError(errorMessage);
      console.error('❌ WebSocket connection error:', err);
      connectionInitializedRef.current = false;
    } finally {
      connectionPromiseRef.current = null;
    }
  }, [channels, status]);

  /**
   * Desconectar
   */
  const disconnect = React.useCallback(() => {
    if (websocketService.isSocketConnected()) {
      websocketService.disconnect();
      setStatus('disconnected');
      setSocketId(null);
      connectionInitializedRef.current = false;
    }
  }, []);

  /**
   * Efecto: Conectar automáticamente cuando se monta el Provider
   * Usa el token desde props.auth.sanctumToken (más confiable que sessionStorage)
   */
  useEffect(() => {
    if (!autoConnect || connectionInitializedRef.current) {
      return;
    }

    // ✅ NUEVO: Obtener token de props de Inertia (mucho más confiable)
    const sanctumToken = (props?.auth as any)?.sanctumToken;
    const userId = (props?.auth as any)?.user?.id;

    console.log('🔍 [WebSocketContext] Token disponible en props:', sanctumToken ? `${sanctumToken.substring(0, 20)}...` : 'null');
    console.log('🔍 [WebSocketContext] User ID:', userId);

    if (sanctumToken && !connectionInitializedRef.current) {
      console.log('🚀 Iniciando conexión automática del WebSocket Context con token de props...');
      connect(sanctumToken, userId);
    }
  }, [autoConnect, connect, (props?.auth as any)?.sanctumToken, (props?.auth as any)?.user?.id]);

  /**
   * Listeners para eventos del servicio
   */
  useEffect(() => {
    const handleConnected = (data: any) => {
      console.log('📡 Evento: WebSocket conectado', data);
      setSocketId(data.socketId);
      setStatus('connected');
    };

    const handleDisconnected = () => {
      console.log('📡 Evento: WebSocket desconectado');
      setStatus('disconnected');
      setSocketId(null);
      connectionInitializedRef.current = false;
    };

    const handleError = (data: any) => {
      console.log('📡 Evento: Error en WebSocket', data);
      setStatus('error');
      setError(data.error);
    };

    websocketService.on('websocket:connected', handleConnected);
    websocketService.on('websocket:disconnected', handleDisconnected);
    websocketService.on('websocket:error', handleError);

    return () => {
      websocketService.off('websocket:connected', handleConnected);
      websocketService.off('websocket:disconnected', handleDisconnected);
      websocketService.off('websocket:error', handleError);
    };
  }, []);

  const value: WebSocketContextType = {
    status,
    isConnected: status === 'connected',
    socketId,
    error,
    subscribe: (channel: string) => websocketService.subscribeTo(channel),
    unsubscribe: (channel: string) => websocketService.unsubscribeFrom(channel),
    on: (event: string, callback: (data: any) => void) => websocketService.on(event, callback),
    off: (event: string, callback?: (data: any) => void) => websocketService.off(event, callback),
    emit: (event: string, data: any) => websocketService.emit(event, data),
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

/**
 * Hook para usar el WebSocket Context
 */
export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext debe ser usado dentro de WebSocketProvider');
  }
  return context;
}

// Application Layer: Hook for real-time delivery tracking
import { useEffect, useCallback, useState } from 'react';
import { useWebSocket } from './use-websocket';

export interface UbicacionData {
  id: number;
  entrega_id: number;
  latitud: number;
  longitud: number;
  velocidad?: number;
  direccion?: string;
  timestamp: string;
}

export interface EntregaEstadoData {
  entrega_id: number;
  estado_anterior: string;
  estado_nuevo: string;
  motivo?: string;
  timestamp: string;
}

export interface EntregaNovedadData {
  entrega_id: number;
  tipo: string;
  descripcion: string;
  timestamp: string;
}

interface UseTrackingOptions {
  entregaId?: number;
  autoSubscribe?: boolean;
}

interface UseTrackingReturn {
  ubicacion: UbicacionData | null;
  estadoActual: string | null;
  novedades: EntregaNovedadData[];
  isTracking: boolean;
  startTracking: (entregaId: number) => void;
  stopTracking: (entregaId: number) => void;
  updateUbicacion: (ubicacion: UbicacionData) => void;
  clearNovedades: () => void;
}

/**
 * Hook para rastrear entregas en tiempo real
 *
 * Uso:
 * ```tsx
 * const { ubicacion, isTracking, startTracking } = useTracking({ entregaId: 123 });
 *
 * return (
 *   <>
 *     {ubicacion && (
 *       <div>
 *         Lat: {ubicacion.latitud}, Lng: {ubicacion.longitud}
 *       </div>
 *     )}
 *   </>
 * );
 * ```
 */
export function useTracking(options: UseTrackingOptions = {}): UseTrackingReturn {
  const { entregaId, autoSubscribe = true } = options;
  const { subscribeTo, unsubscribeFrom, on, off, isConnected } = useWebSocket({
    autoConnect: true,
  });

  const [ubicacion, setUbicacion] = useState<UbicacionData | null>(null);
  const [estadoActual, setEstadoActual] = useState<string | null>(null);
  const [novedades, setNovedades] = useState<EntregaNovedadData[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  // Iniciar rastreo de una entrega
  const startTracking = useCallback((id: number) => {
    if (!isConnected) {
      console.warn('WebSocket no está conectado');
      return;
    }

    const channelName = `entrega.${id}`;
    subscribeTo(channelName);
    setIsTracking(true);

    console.log(`[useTracking] Iniciando tracking para entrega #${id} en canal ${channelName}`);

    // Escuchar actualizaciones de ubicación en tiempo real
    // El evento se dispara desde el backend cuando se registra una nueva ubicación
    on(`${channelName}:ubicacion.actualizada`, (data: any) => {
      console.log(`[useTracking] Ubicación actualizada para entrega #${id}:`, data);
      setUbicacion({
        id: data.id || 0,
        entrega_id: id,
        latitud: data.latitud,
        longitud: data.longitud,
        velocidad: data.velocidad,
        timestamp: data.timestamp,
      });
    });

    // Escuchar cambios de estado
    on(`${channelName}:estado-cambio`, (data: any) => {
      console.log(`[useTracking] Estado cambió para entrega #${id}:`, data);
      if (data.estado_nuevo) {
        setEstadoActual(data.estado_nuevo);
      }
    });

    // Escuchar novedades
    on(`${channelName}:novedad.reportada`, (data: any) => {
      console.log(`[useTracking] Novedad reportada para entrega #${id}:`, data);
      setNovedades(prev => [...prev, data]);
    });

    // Escuchar eventos del chofer
    on(`${channelName}:chofer.en-camino`, (data: any) => {
      console.log(`[useTracking] Chofer en camino para entrega #${id}`);
      setEstadoActual('en_camino');
    });

    on(`${channelName}:chofer.llegada`, (data: any) => {
      console.log(`[useTracking] Chofer llegó a entrega #${id}`);
      setEstadoActual('entregado');
    });
  }, [isConnected, subscribeTo, on]);

  // Detener rastreo de una entrega
  const stopTracking = useCallback((id: number) => {
    const channelName = `entrega.${id}`;
    unsubscribeFrom(channelName);

    console.log(`[useTracking] Deteniendo tracking para entrega #${id}`);

    // Remover listeners
    off(`${channelName}:ubicacion.actualizada`);
    off(`${channelName}:estado-cambio`);
    off(`${channelName}:novedad.reportada`);
    off(`${channelName}:chofer.en-camino`);
    off(`${channelName}:chofer.llegada`);

    setIsTracking(false);
    setUbicacion(null);
    setEstadoActual(null);
    setNovedades([]);
  }, [unsubscribeFrom, off]);

  // Actualizar ubicación manualmente (útil para testing)
  const updateUbicacion = useCallback((newUbicacion: UbicacionData) => {
    setUbicacion(newUbicacion);
  }, []);

  // Limpiar novedades
  const clearNovedades = useCallback(() => {
    setNovedades([]);
  }, []);

  // Auto-suscribirse si se proporciona entregaId
  useEffect(() => {
    if (autoSubscribe && entregaId && isConnected) {
      startTracking(entregaId);

      return () => {
        stopTracking(entregaId);
      };
    }
  }, [autoSubscribe, entregaId, isConnected, startTracking, stopTracking]);

  return {
    ubicacion,
    estadoActual,
    novedades,
    isTracking,
    startTracking,
    stopTracking,
    updateUbicacion,
    clearNovedades,
  };
}

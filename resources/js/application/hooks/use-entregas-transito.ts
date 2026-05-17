import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import type { Id } from '@/domain/entities/shared';
import type { Entrega, FiltrosEntregas, UbicacionEntrega } from '@/domain/entities/logistica';
import logisticaService from '@/infrastructure/services/logistica.service';
import { useWebSocket } from './use-websocket';

interface UseEntregasTransitoOptions {
    initialEntregas?: Entrega[];
    autoConnect?: boolean;
    pollingInterval?: number; // En segundos
}

interface UseEntregasTransitoReturn {
    entregas: Entrega[];
    ubicaciones: Map<Id, UbicacionEntrega>;
    loading: boolean;
    wsConnected: boolean;
    filtros: FiltrosEntregas;
    setFiltros: (filtros: FiltrosEntregas) => void;
    cargarEntregas: () => Promise<void>;
}

/**
 * Application Layer Hook
 *
 * Encapsula toda la lógica de entregas en tránsito:
 * - Carga de entregas desde la API
 * - Gestión de ubicaciones en tiempo real
 * - Escuchadores de WebSocket para actualizaciones
 * - Fallback a polling si WebSocket no está disponible
 *
 * @example
 * const { entregas, ubicaciones, wsConnected } = useEntregasEnTransito();
 */
export function useEntregasEnTransito(options: UseEntregasTransitoOptions = {}) {
    const {
        initialEntregas = [],
        autoConnect = true,
        pollingInterval = 30,
    } = options;

    // Estado principal
    const [entregas, setEntregas] = useState<Entrega[]>(initialEntregas);
    const [ubicaciones, setUbicaciones] = useState<Map<Id, UbicacionEntrega>>(new Map());
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosEntregas>({});

    // WebSocket para actualizaciones en tiempo real
    const { isConnected: wsConnected, on, off } = useWebSocket({ autoConnect });

    // Ref para interval de polling (fallback)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Carga entregas en tránsito desde la API
     */
    const cargarEntregas = useCallback(async () => {
        setLoading(true);
        try {
            const resultado = await logisticaService.obtenerEntregasEnTransito(1, filtros);
            setEntregas(resultado.data);

            // Cargar ubicaciones de todas las entregas
            resultado.data.forEach((entrega) => {
                cargarUbicacionEntrega(entrega.id);
            });
        } catch (error) {
            toast.error('Error al cargar entregas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    /**
     * Carga la ubicación actual de una entrega específica
     */
    const cargarUbicacionEntrega = useCallback(async (entregaId: Id) => {
        try {
            const data = await logisticaService.obtenerUbicacionesEntrega(entregaId);
            if (data.ultima_ubicacion) {
                setUbicaciones(prev =>
                    new Map(prev).set(entregaId, {
                        entrega_id: entregaId,
                        latitud: data.ultima_ubicacion!.latitud,
                        longitud: data.ultima_ubicacion!.longitud,
                        velocidad: data.ultima_ubicacion!.velocidad,
                        timestamp: data.ultima_ubicacion!.timestamp,
                    })
                );
            }
        } catch (error) {
            console.error(`Error cargando ubicación entrega ${entregaId}:`, error);
        }
    }, []);

    /**
     * Actualiza las ubicaciones de todas las entregas (para polling fallback)
     */
    const actualizarUbicaciones = useCallback(async () => {
        for (const entrega of entregas) {
            await cargarUbicacionEntrega(entrega.id);
        }
    }, [entregas, cargarUbicacionEntrega]);

    /**
     * Cargar entregas cuando cambian los filtros
     */
    useEffect(() => {
        cargarEntregas();
    }, [cargarEntregas]);

    /**
     * Escuchar eventos de WebSocket para actualizaciones en tiempo real
     */
    useEffect(() => {
        if (!wsConnected) {
            console.log('⏳ Esperando conexión WebSocket...');
            return;
        }

        console.log('✅ Suscribiendo a eventos de WebSocket para entregas en tránsito');

        // Escuchar cambios de ubicación en tiempo real
        on('ubicacion.actualizada', (data: any) => {
            console.log('📍 Ubicación actualizada:', data);
            if (data.entrega_id) {
                setUbicaciones(prev =>
                    new Map(prev).set(data.entrega_id, {
                        entrega_id: data.entrega_id,
                        latitud: data.latitud,
                        longitud: data.longitud,
                        velocidad: data.velocidad,
                        timestamp: data.timestamp || new Date().toISOString(),
                    })
                );
            }
        });

        // Escuchar cambios de estado de entregas
        on('entrega.estado-cambio', (data: any) => {
            console.log('🔄 Estado de entrega actualizado:', data);
            setEntregas(prev =>
                prev.map(e =>
                    e.id === data.entrega_id
                        ? { ...e, estado: data.estado_nuevo }
                        : e
                )
            );
        });

        // Escuchar cuando una entrega se entrega
        on('entrega.entregado', (data: any) => {
            console.log('✅ Entrega completada:', data);
            setEntregas(prev => prev.filter(e => e.id !== data.entrega_id));
            setUbicaciones(prev => {
                const newMap = new Map(prev);
                newMap.delete(data.entrega_id);
                return newMap;
            });
            toast.success(`Entrega #${data.entrega_id} completada`);
        });

        // Cleanup: dejar de escuchar cuando se desmonta
        return () => {
            off('ubicacion.actualizada');
            off('entrega.estado-cambio');
            off('entrega.entregado');
        };
    }, [wsConnected, on, off]);

    /**
     * Polling fallback si WebSocket no está conectado (cada N segundos)
     */
    useEffect(() => {
        if (wsConnected) {
            // Si WebSocket está conectado, no hacer polling
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Si WebSocket no está conectado, hacer polling
        if (entregas.length > 0) {
            console.warn('⚠️ WebSocket desconectado, usando polling de ubicaciones');
            intervalRef.current = setInterval(() => {
                actualizarUbicaciones();
            }, pollingInterval * 1000);

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [wsConnected, entregas, actualizarUbicaciones, pollingInterval]);

    return {
        entregas,
        ubicaciones,
        loading,
        wsConnected,
        filtros,
        setFiltros,
        cargarEntregas,
    };
}

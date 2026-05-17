import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useWebSocketContext } from '@/application/contexts';

// ✅ ACTUALIZADO: Usar Record<string, number> para soportar cualquier código de estado
// Esto permite que el dashboard sea agnóstico a qué códigos existen en la BD
export type EntregaEstado = Record<string, number>;

/**
 * Métricas de entregas agrupadas por localidad
 *
 * ✅ SINCRONIZADO: zona_id es FK a tabla localidades
 * - Localidades: Ciudades/pueblos (tabla: localidades)
 * - Relación: Localidad ←M-M→ Zona (via tabla localidad_zona)
 *
 * Notas:
 * - completadas: Entregas en estados finales (ENTREGADO, CANCELADA, RECHAZADO)
 * - tiempo_promedio_minutos: Calculado con fecha_salida y fecha_entrega
 */
export interface MetricaZona {
    zona_id: number | null;  // ✅ FK a tabla localidades (localidad_id)
    nombre: string;          // Nombre de la localidad desde tabla localidades
    total: number;           // Total de entregas en esta localidad
    completadas: number;     // Entregas finalizadas (estados finales desde BD)
    porcentaje: number;      // Porcentaje de completadas vs total
    tiempo_promedio_minutos: number;  // Tiempo promedio de salida a entrega
}

export interface TopChofer {
    chofer_id: number;
    nombre: string;
    email: string;
    entregas_total: number;
    entregas_completadas: number;
    eficiencia_porcentaje: number;
}

export interface UltimoDia {
    fecha: string;
    dia: string;
    entregas: number;
}

export interface EntregaReciente {
    id: number;
    estado: string;
    cliente_nombre: string;
    chofer_nombre: string;
    fecha_entrega: string | null;
    fecha_programada: string | null;
    peso_kg: number;
    vehiculo_placa: string;
}

/**
 * Estadísticas del dashboard de entregas
 *
 * ✅ SINCRONIZADO con EstadosLogisticaSeeder
 * ✅ Estados finales obtenidos dinámicamente desde BD
 * ✅ Localidades obtenidas correctamente desde tabla localidades
 */
export interface EntregasDashboardStats {
    estados: EntregaEstado;                      // Conteos por código de estado
    estados_total: number;                       // Total de entregas
    por_zona: MetricaZona[];                     // ✅ Métricas por localidad (zona_id → localidades)
    top_choferes: TopChofer[];                   // Top 5 choferes por eficiencia
    ultimos_7_dias: UltimoDia[];                 // Entregas de últimos 7 días
    entregas_recientes: EntregaReciente[];       // Últimas 10 entregas
}

interface UseEntregasDashboardStatsOptions {
    /** Habilitar actualización automática vía WebSocket (default: true) */
    autoRefresh?: boolean;
    /** Intervalo de polling fallback en segundos (default: 60, solo si WebSocket falla) */
    refreshInterval?: number;
    /** Datos iniciales del servidor (SSR con Inertia) */
    initialData?: Partial<EntregasDashboardStats>;
}

export function useEntregasDashboardStats(options: UseEntregasDashboardStatsOptions = {}) {
    const {
        autoRefresh = true,
        refreshInterval = 60,
        initialData,
    } = options;

    const [stats, setStats] = useState<EntregasDashboardStats | null>(
        initialData ? (initialData as EntregasDashboardStats) : null
    );
    const [loading, setLoading] = useState<boolean>(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [usingWebSocket, setUsingWebSocket] = useState<boolean>(false);

    // ✅ Acceder al contexto WebSocket
    let wsContext: any = null;
    try {
        wsContext = useWebSocketContext();
    } catch (e) {
        // WebSocketProvider no está disponible, usar polling
        console.log('⚠️ WebSocket no disponible, usando polling...');
    }

    /**
     * Cargar estadísticas desde el endpoint HTTP
     */
    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/logistica/entregas/dashboard-stats');

            if (response.data.success) {
                setStats(response.data.data);
                setLastUpdate(new Date());
                console.log('✅ Stats cargadas desde HTTP');
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Error al cargar estadísticas';
            setError(errorMessage);
            console.error('Error cargando estadísticas de entregas:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refrescar estadísticas manualmente
     */
    const refresh = useCallback(() => {
        fetchStats();
    }, [fetchStats]);

    /**
     * Efecto para carga inicial (si no hay datos iniciales)
     * ✅ LAZY LOAD: Solo cargar si autoRefresh=true
     */
    useEffect(() => {
        if (!initialData && autoRefresh) {
            fetchStats();
        }
    }, [initialData, autoRefresh, fetchStats]);

    /**
     * ✅ Efecto para conectar a WebSocket y escuchar actualizaciones en tiempo real
     */
    useEffect(() => {
        if (!wsContext || !autoRefresh) return;

        const handleStatsUpdate = (newStats: EntregasDashboardStats) => {
            console.log('📡 Estadísticas actualizadas desde WebSocket:', newStats);
            setStats(newStats);
            setLastUpdate(new Date());
            setUsingWebSocket(true);
            setError(null);
        };

        // Escuchar evento de actualización de estadísticas de entregas
        wsContext.on('entregas:stats-updated', handleStatsUpdate);

        // Solicitar stats iniciales por WebSocket cuando se conecta
        if (wsContext.isConnected) {
            console.log('🚀 Solicitando stats por WebSocket...');
            wsContext.emit('entregas:get-stats');
        }

        return () => {
            wsContext.off('entregas:stats-updated', handleStatsUpdate);
        };
    }, [wsContext?.isConnected, autoRefresh, wsContext]);

    /**
     * ✅ Efecto para polling fallback (solo si WebSocket no está disponible o deshabilitado)
     */
    useEffect(() => {
        if (!autoRefresh || usingWebSocket) return;

        const intervalId = setInterval(() => {
            console.log('⏰ Polling fallback: actualizando stats...');
            fetchStats();
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
    }, [autoRefresh, refreshInterval, fetchStats, usingWebSocket]);

    return {
        stats,
        loading,
        error,
        lastUpdate,
        refresh,
        usingWebSocket,
    };
}

import { useState, useEffect, useCallback } from 'react';
import logisticaService from '@/infrastructure/services/logistica.service';

export interface EnvioStats {
    programados: number;
    en_preparacion: number;
    en_ruta: number;
    entregados_hoy: number;
    entregados_semana: number;
    entregados_mes: number;
    cancelados_mes: number;
    total_activos: number;
}

export interface LogisticaStats {
    envios: EnvioStats;
    proformas: {
        pendientes: number;
        aprobadas: number;
    };
    vehiculos: {
        disponibles: number;
        en_ruta: number;
        total_activos: number;
    };
    performance: {
        tiempo_promedio_entrega: number;
        tasa_cumplimiento: number;
        envios_retrasados: number;
    };
    proximos_envios: {
        hoy: number;
        manana: number;
    };
    top_choferes: any[];
}

interface UseLogisticaStatsOptions {
    /** Habilitar actualización automática (default: true) */
    autoRefresh?: boolean;
    /** Intervalo de actualización en segundos (default: 30) */
    refreshInterval?: number;
}

export function useLogisticaStats(options: UseLogisticaStatsOptions = {}) {
    const {
        autoRefresh = true,
        refreshInterval = 30,
    } = options;

    const [stats, setStats] = useState<LogisticaStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    /**
     * Fetch logistics statistics from the API using the service layer
     *
     * Note: El endpoint /api/logistica/dashboard/stats no está disponible.
     * Las estadísticas se obtienen desde el servidor web (Inertia).
     * Este hook mantiene los datos en estado vacío.
     */
    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Use service layer for API abstraction
            // NOTA: El endpoint aún no está implementado, pero el dashboard
            // obtiene sus datos directamente del server via Inertia
            try {
                const data = await logisticaService.obtenerDashboardStats();
                if (data) {
                    setStats(data);
                    setLastUpdate(new Date());
                }
            } catch (apiError) {
                // Si el endpoint no existe, mantener estado vacío
                // El dashboard funcionará con los datos del servidor
                setStats(null);
                setLastUpdate(new Date());
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Error loading logistics statistics';
            setError(errorMessage);
            console.error('Error loading logistics stats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Manually refresh statistics
     */
    const refresh = useCallback(() => {
        fetchStats();
    }, [fetchStats]);

    /**
     * Effect for initial load
     */
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    /**
     * Effect for auto-refresh
     */
    useEffect(() => {
        if (!autoRefresh) return;

        const intervalId = setInterval(() => {
            fetchStats();
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
    }, [autoRefresh, refreshInterval, fetchStats]);

    return {
        stats,
        loading,
        error,
        lastUpdate,
        refresh,
    };
}

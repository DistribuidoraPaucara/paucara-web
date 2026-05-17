import { useState, useEffect, useCallback } from 'react';

/**
 * Interfaz de estadísticas de proformas
 * Actualizada para usar el nuevo endpoint /api/proformas/estadisticas
 */
export interface ProformaStats {
    total: number;
    por_estado: {
        pendiente: number;
        aprobada: number;
        rechazada: number;
        convertida: number;
        vencida: number;
    };
    montos_por_estado: {
        pendiente: number;
        aprobada: number;
        convertida: number;
    };
    alertas: {
        vencidas: number;
        por_vencer: number;
    };
    monto_total: number;
}

interface UseProformaStatsOptions {
    /** Habilitar actualización automática (default: true) */
    autoRefresh?: boolean;
    /** Intervalo de actualización en segundos (default: 30) */
    refreshInterval?: number;
    /** Datos iniciales del servidor (SSR con Inertia) */
    initialData?: Partial<ProformaStats>;
}

export function useProformaStats(options: UseProformaStatsOptions = {}) {
    const {
        autoRefresh = true,
        refreshInterval = 30,
        initialData,
    } = options;

    const [stats, setStats] = useState<ProformaStats | null>(
        initialData ? (initialData as ProformaStats) : null
    );
    const [loading, setLoading] = useState<boolean>(!initialData);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    /**
     * Cargar estadísticas desde el nuevo endpoint /api/proformas/estadisticas
     */
    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Fetching proforma stats from /api/proformas/estadisticas...');
            const response = await fetch('/api/proformas/estadisticas', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            console.log(`📊 Response status: ${response.status}`);
            const data = await response.json();

            if (!response.ok) {
                console.error('❌ API Error response:', data);
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }

            if (data.success && data.data) {
                setStats(data.data);
                setLastUpdate(new Date());
                console.log('✅ Proforma stats loaded successfully:', data.data);
            } else {
                console.error('❌ Invalid response format:', data);
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Error al cargar estadísticas';
            setError(errorMessage);
            console.error('❌ Error cargando estadísticas de proformas:', errorMessage, err);
            setStats(null);
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
     */
    useEffect(() => {
        if (!initialData) {
            fetchStats();
        }
    }, [initialData, fetchStats]);

    /**
     * Efecto para actualización automática
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

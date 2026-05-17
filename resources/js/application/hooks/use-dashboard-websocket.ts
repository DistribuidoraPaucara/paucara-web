import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './use-websocket';

/**
 * Hook para manejar actualizaciones del dashboard vía WebSocket
 *
 * Características:
 * - Escucha eventos de actualización de métricas en tiempo real
 * - Auto-refresh cada 5 minutos como fallback
 * - Mantiene timestamp de última actualización
 * - Fallback a fetch() si WebSocket no está disponible
 *
 * @param initialData Datos iniciales desde SSR
 * @returns { metricas, lastUpdate, isRefreshing, refresh }
 */
export function useDashboardWebSocket(initialData: any) {
    const { isConnected, on, off } = useWebSocket({ autoConnect: true });
    const [metricas, setMetricas] = useState(initialData);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Solicitar actualización manual de métricas
    const requestMetricsUpdate = useCallback(() => {
        setIsRefreshing(true);

        // Fetch desde API (fallback si WebSocket no responde)
        fetch('/api/dashboard/metricas')
            .then(res => res.json())
            .then(data => {
                if (data.success || data.data) {
                    setMetricas(data.data || data);
                    setLastUpdate(new Date());
                    console.log('✅ Dashboard metrics updated via fetch');
                }
            })
            .catch(error => {
                console.error('❌ Error fetching dashboard metrics:', error);
            })
            .finally(() => {
                setIsRefreshing(false);
            });
    }, []);

    // Escuchar actualizaciones en tiempo real vía WebSocket
    useEffect(() => {
        if (!isConnected) {
            console.log('⚠️ WebSocket not connected yet');
            return;
        }

        const handleMetricsUpdate = (data: any) => {
            console.log('📊 Dashboard metrics updated via WebSocket:', data);
            if (data.metricas) {
                setMetricas(data.metricas);
                setLastUpdate(new Date(data.timestamp));
            }
        };

        console.log('👂 Escuchando eventos dashboard.metrics-updated');
        on('dashboard.metrics-updated', handleMetricsUpdate);

        return () => {
            off('dashboard.metrics-updated', handleMetricsUpdate);
        };
    }, [isConnected, on, off]);

    // Auto-refresh cada 5 minutos como fallback
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            console.log('⏰ Auto-refresh de métricas cada 5 minutos');
            requestMetricsUpdate();
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [isConnected, requestMetricsUpdate]);

    return {
        metricas,
        lastUpdate,
        isRefreshing,
        refresh: requestMetricsUpdate,
    };
}

export type UseDashboardWebSocketReturn = ReturnType<typeof useDashboardWebSocket>;

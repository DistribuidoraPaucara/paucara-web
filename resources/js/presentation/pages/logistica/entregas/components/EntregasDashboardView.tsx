import { useState } from 'react';
import { useEntregasDashboardStats } from '@/application/hooks/use-entregas-dashboard-stats';
import { DashboardEntregasStats } from './DashboardEntregasStats';
import { MetricasZonas } from './MetricasZonas';
import { TopChoferes } from './TopChoferes';
import { EntregasUltimos7Dias } from './EntregasUltimos7Dias';
import { EntregasPorEstado } from './EntregasPorEstado';
import { EntregasRecientes } from './EntregasRecientes';
import { CancelarEntregaModal } from './CancelarEntregaModal';
import type { EntregaReciente } from '@/application/hooks/use-entregas-dashboard-stats';

interface Props {
    autoRefresh?: boolean;
}

/**
 * Vista dashboard: estadísticas y gráficos de entregas
 * El hook useEntregasDashboardStats solo se activa cuando autoRefresh=true
 */
export function EntregasDashboardView({ autoRefresh = true }: Props) {
    // Hook para cargar estadísticas (solo se activa si autoRefresh=true)
    const {
        stats,
        loading,
        lastUpdate,
        refresh,
    } = useEntregasDashboardStats({
        autoRefresh, // Solo refrescar si está activa la vista
        refreshInterval: 30, // Actualizar cada 30 segundos
    });

    // Estados para modal de cancelación
    const [mostrarCancelarModal, setMostrarCancelarModal] = useState(false);
    const [entregaSeleccionadaParaCancelar, setEntregaSeleccionadaParaCancelar] = useState<{
        id: number;
        numero_entrega: string;
        estado: string;
    } | null>(null);

    const handleVerEntrega = (entregaId: number) => {
        window.location.href = `/logistica/entregas/${entregaId}`;
    };

    const handleAbrirCancelarModal = (entrega: EntregaReciente) => {
        setEntregaSeleccionadaParaCancelar({
            id: entrega.id,
            numero_entrega: `ENT-${entrega.id}`,
            estado: entrega.estado,
        });
        setMostrarCancelarModal(true);
    };

    if (!stats && loading) {
        return (
            <div className="space-y-6 p-4">
                <div className="text-center text-muted-foreground">
                    Cargando dashboard de entregas...
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="space-y-6 p-4">
                <div className="text-center text-red-500">
                    Error al cargar las estadísticas
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cards de Estados */}
            <DashboardEntregasStats
                estados={stats.estados}
                estadosTotal={stats.estados_total}
                loading={loading}
                lastUpdate={lastUpdate}
                onRefresh={refresh}
            />

            {/* Gráficos */}
            <div className="grid gap-6 lg:grid-cols-2">
                <EntregasPorEstado
                    estados={stats.estados}
                    loading={loading}
                />
                <EntregasUltimos7Dias
                    datos={stats.ultimos_7_dias}
                    loading={loading}
                />
            </div>

            {/* Métricas por Zona */}
            <MetricasZonas
                zonasData={stats.por_zona}
                loading={loading}
            />

            {/* Top Choferes */}
            <TopChoferes
                choferes={stats.top_choferes}
                loading={loading}
            />

            {/* Entregas Recientes */}
            <EntregasRecientes
                entregas={stats.entregas_recientes}
                loading={loading}
                onVerEntrega={handleVerEntrega}
                onCancelarEntrega={handleAbrirCancelarModal}
            />

            {/* Modal de cancelación */}
            <CancelarEntregaModal
                isOpen={mostrarCancelarModal}
                onClose={() => {
                    setMostrarCancelarModal(false);
                    setEntregaSeleccionadaParaCancelar(null);
                }}
                entrega={entregaSeleccionadaParaCancelar}
            />
        </div>
    );
}

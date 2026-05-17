import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Hooks
import { useProformaFilters } from '@/application/hooks/use-proforma-filters';
import { useProformaModals } from '@/application/hooks/use-proforma-modals';
import { useProformaNotifications } from '@/application/hooks/use-proforma-notifications';

// Componentes
import { ProformasSection } from './components/ProformasSection';
import { ProformaRechazoModal } from './components/modals/ProformaRechazoModal';

// Domain entities (centralized type definitions)
import type {
    ProformaAppExterna,
    DashboardLogisticaStats,
    DashboardLogisticaProps,
} from '@/domain/entities/logistica';

// Utilidades centralizadas
import { MOTIVOS_RECHAZO_PROFORMA } from '@/lib/proformas.utils';

interface DashboardProps extends DashboardLogisticaProps {
    localidades: Array<{id: number; nombre: string}>;
    usuariosAprobadores: Array<{id: number; name: string}>;
    estadosLogistica: Array<{id: number; nombre: string; codigo: string}>;
}

export default function LogisticaDashboard({ estadisticas, proformasRecientes, localidades, usuariosAprobadores, estadosLogistica }: DashboardProps) {
    // ✅ OPTIMIZADO: Reducir logs de debug en producción
    if (process.env.NODE_ENV === 'development') {
        console.log('📊 Dashboard cargado:', { proformasTotal: proformasRecientes.total });
    }
    // Estados principales
    const [stats] = useState<DashboardLogisticaStats>(estadisticas);
    const [proformas, setProformas] = useState<ProformaAppExterna[]>(proformasRecientes.data);

    // Hooks de filtros
    const proformaFilters = useProformaFilters(proformasRecientes);

    // Hook para notificaciones de proformas en tiempo real
    const { requestNotificationPermission } = useProformaNotifications();

    // Solicitar permisos de notificación al cargar
    useEffect(() => {
        requestNotificationPermission();
    }, [requestNotificationPermission]);

    /* const {
        stats: proformaStats,
        loading: loadingProformaStats,
        error: proformaError,
    } = useProformaStats({
        // ✅ ACTUALIZADO 2026-03-06: DESACTIVAR polling completamente
        autoRefresh: false,
        refreshInterval: 30,
    }); */

    // Debug: Log datos recibidos
    useEffect(() => {
        console.log('=== LOGISTICA DASHBOARD DEBUG ===');
        console.log('Stats from Inertia (estadisticas):', stats);
        console.log('================================');
    }, [stats]);

    // Hook de modal de rechazo
    const {
        mostrarModalRechazo,
        proformaSeleccionada,
        motivoRechazo,
        motivoRechazoSeleccionado,
        procesandoId,
        setMotivoRechazo,
        setMotivoRechazoSeleccionado,
        abrirModalRechazo,
        cerrarModalRechazo,
        rechazarProforma,
    } = useProformaModals();

    // Actualizar proformas cuando cambian las props
    useEffect(() => {
        setProformas(proformasRecientes.data);
        proformaFilters.setPaginationInfo({
            current_page: proformasRecientes.current_page,
            last_page: proformasRecientes.last_page,
            per_page: proformasRecientes.per_page,
            total: proformasRecientes.total,
            from: proformasRecientes.from,
            to: proformasRecientes.to,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proformasRecientes]);

    // ✅ NOTA: El backend aplica automáticamente filtro por defecto (desde ayer hasta hoy)
    // cuando no se proporcionan parámetros de fecha_entrega_solicitada
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        console.log('🔍 [Dashboard] Cargado. Backend aplicará filtro por defecto (ayer-hoy) si no hay parámetros');
        console.log('   URL params:', urlParams.toString() || 'NINGUNO');
    }, []);

    // Verificar si proforma está vencida
    const estaVencida = (proforma: ProformaAppExterna): boolean => {
        if (!proforma.fecha_vencimiento) return false;
        const fechaVenc = new Date(proforma.fecha_vencimiento);
        return fechaVenc < new Date() && !['RECHAZADA', 'CONVERTIDA'].includes(proforma.estado);
    };

    // Badge de estado
    // Fase 3.7: Este función muestra emojis + texto
    // Nota: En Fase 3.8+, considerar refactorizar para usar ProformaEstadoBadge component
    // que ahora tiene integración completa con hooks dinámicos
    const getEstadoBadge = (estado: string) => {
        const emojis: Record<string, string> = {
            'PENDIENTE': '🟡',
            'APROBADA': '🟢',
            'RECHAZADA': '🔴',
            'CONVERTIDA': '🔵',
            'VENCIDA': '⚫'
        };

        const emoji = emojis[estado] || '';
        return `${emoji} ${estado}`;
    };

    // Ver proforma
    const handleVerProforma = (proforma: ProformaAppExterna) => {
        // ✅ ACTUALIZADO: Usar router.visit() para navegar en la misma página (no abre nueva pestaña)
        router.visit(`/proformas/${proforma.id}`);
    };

    // ✅ NUEVO: Editar proforma
    const handleEditarProforma = (proforma: ProformaAppExterna) => {
        router.visit(`/proformas/${proforma.id}/edit`);
    };

    // Rechazar proforma - Abre el modal de rechazo específico
    const handleRechazarProforma = (proforma: ProformaAppExterna) => {
        abrirModalRechazo(proforma);
    };


    return (
        <AppLayout>
            <Head title="Dashboard de Logística" />

            <div className="space-y-6 p-4 bg-white dark:bg-slate-950 min-h-screen">
                {/* Estadísticas */}
                {/* <DashboardStats
                    logisticaStats={logisticaStats}
                    proformaStats={proformaStats}
                    stats={dashboardMetricas || stats}
                    loadingLogisticaStats={loadingLogisticaStats}
                    logisticaLastUpdate={logisticaLastUpdate}
                    refreshLogisticaStats={refreshLogisticaStats}
                    dashboardLastUpdate={dashboardLastUpdate}
                    dashboardIsRefreshing={dashboardIsRefreshing}
                    refreshDashboard={refreshDashboard}
                /> */}

                {/* Sección de Proformas */}
                <ProformasSection
                    proformas={proformas}
                    paginationInfo={proformaFilters.paginationInfo}
                    searchProforma={proformaFilters.searchProforma}
                    setSearchProforma={proformaFilters.setSearchProforma}
                    filtroEstadoProforma={proformaFilters.filtroEstadoProforma}
                    setFiltroEstadoProforma={proformaFilters.setFiltroEstadoProforma}
                    soloVencidas={proformaFilters.soloVencidas}
                    setSoloVencidas={proformaFilters.setSoloVencidas}
                    filtroLocalidad={proformaFilters.filtroLocalidad}
                    setFiltroLocalidad={proformaFilters.setFiltroLocalidad}
                    localidades={localidades}
                    // ✅ Nuevos filtros
                    filtroTipoEntrega={proformaFilters.filtroTipoEntrega}
                    setFiltroTipoEntrega={proformaFilters.setFiltroTipoEntrega}
                    filtroPoliticaPago={proformaFilters.filtroPoliticaPago}
                    setFiltroPoliticaPago={proformaFilters.setFiltroPoliticaPago}
                    filtroEstadoLogistica={proformaFilters.filtroEstadoLogistica}
                    setFiltroEstadoLogistica={proformaFilters.setFiltroEstadoLogistica}
                    filtroCoordinacionCompletada={proformaFilters.filtroCoordinacionCompletada}
                    setFiltroCoordinacionCompletada={proformaFilters.setFiltroCoordinacionCompletada}
                    filtroUsuarioAprobador={proformaFilters.filtroUsuarioAprobador}
                    setFiltroUsuarioAprobador={proformaFilters.setFiltroUsuarioAprobador}
                    usuariosAprobadores={usuariosAprobadores}
                    estadosLogistica={estadosLogistica}
                    // ✅ Filtros de fechas y horas
                    filtroFechaVencimientoDesde={proformaFilters.filtroFechaVencimientoDesde}
                    setFiltroFechaVencimientoDesde={proformaFilters.setFiltroFechaVencimientoDesde}
                    filtroFechaVencimientoHasta={proformaFilters.filtroFechaVencimientoHasta}
                    setFiltroFechaVencimientoHasta={proformaFilters.setFiltroFechaVencimientoHasta}
                    filtroFechaEntregaSolicitadaDesde={proformaFilters.filtroFechaEntregaSolicitadaDesde}
                    setFiltroFechaEntregaSolicitadaDesde={proformaFilters.setFiltroFechaEntregaSolicitadaDesde}
                    filtroFechaEntregaSolicitadaHasta={proformaFilters.filtroFechaEntregaSolicitadaHasta}
                    setFiltroFechaEntregaSolicitadaHasta={proformaFilters.setFiltroFechaEntregaSolicitadaHasta}
                    filtroHoraEntregaSolicitadaDesde={proformaFilters.filtroHoraEntregaSolicitadaDesde}
                    setFiltroHoraEntregaSolicitadaDesde={proformaFilters.setFiltroHoraEntregaSolicitadaDesde}
                    filtroHoraEntregaSolicitadaHasta={proformaFilters.filtroHoraEntregaSolicitadaHasta}
                    setFiltroHoraEntregaSolicitadaHasta={proformaFilters.setFiltroHoraEntregaSolicitadaHasta}
                    cambiarPagina={proformaFilters.cambiarPagina}
                    onVerProforma={handleVerProforma}
                    onEditarProforma={handleEditarProforma}
                    onRechazarProforma={handleRechazarProforma}
                    getEstadoBadge={getEstadoBadge}
                    estaVencida={estaVencida}
                />

                {/* Modal de Rechazo */}
                <ProformaRechazoModal
                    isOpen={mostrarModalRechazo}
                    onClose={cerrarModalRechazo}
                    proforma={proformaSeleccionada}
                    motivoRechazoSeleccionado={motivoRechazoSeleccionado}
                    setMotivoRechazoSeleccionado={setMotivoRechazoSeleccionado}
                    motivoRechazo={motivoRechazo}
                    setMotivoRechazo={setMotivoRechazo}
                    onRechazar={() => rechazarProforma(MOTIVOS_RECHAZO_PROFORMA)}
                    isProcessing={procesandoId !== null}
                />
            </div>
        </AppLayout>
    );
}

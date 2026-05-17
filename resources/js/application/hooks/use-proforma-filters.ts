import { useState, useCallback, useEffect } from 'react';
import FilterService from '@/infrastructure/services/filter.service';

interface ProformaFilterState {
    searchProforma: string;
    filtroEstadoProforma: 'TODOS' | 'BORRADOR' | 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'CONVERTIDA' | 'VENCIDA';
    soloVencidas: boolean;
    filtroLocalidad: string;
    filtroTipoEntrega: string;
    filtroPoliticaPago: string;
    filtroEstadoLogistica: string;
    filtroCoordinacionCompletada: string;
    filtroUsuarioAprobador: string;
    filtroFechaVencimientoDesde: string;
    filtroFechaVencimientoHasta: string;
    filtroFechaEntregaSolicitadaDesde: string;
    filtroFechaEntregaSolicitadaHasta: string;
    filtroHoraEntregaSolicitadaDesde: string;
    filtroHoraEntregaSolicitadaHasta: string;
    paginationInfo: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

export function useProformaFilters(initialPaginationInfo: any) {
    // Inicializar filtros desde URL
    const urlParams = new URLSearchParams(window.location.search);

    const [searchProforma, setSearchProforma] = useState(urlParams.get('search') || '');
    const [filtroEstadoProforma, setFiltroEstadoProforma] = useState<any>(
        (urlParams.get('estado') as any) || 'TODOS'
    );
    const [soloVencidas, setSoloVencidas] = useState(urlParams.get('solo_vencidas') === 'true');
    const [filtroLocalidad, setFiltroLocalidad] = useState(urlParams.get('localidad_id') || '');
    const [filtroTipoEntrega, setFiltroTipoEntrega] = useState(urlParams.get('tipo_entrega') || '');
    const [filtroPoliticaPago, setFiltroPoliticaPago] = useState(urlParams.get('politica_pago') || '');
    const [filtroEstadoLogistica, setFiltroEstadoLogistica] = useState(urlParams.get('estado_logistica_id') || '');
    const [filtroCoordinacionCompletada, setFiltroCoordinacionCompletada] = useState(urlParams.get('coordinacion_completada') || '');
    const [filtroUsuarioAprobador, setFiltroUsuarioAprobador] = useState(urlParams.get('usuario_aprobador_id') || '');
    const [filtroFechaVencimientoDesde, setFiltroFechaVencimientoDesde] = useState(urlParams.get('fecha_vencimiento_desde') || '');
    const [filtroFechaVencimientoHasta, setFiltroFechaVencimientoHasta] = useState(urlParams.get('fecha_vencimiento_hasta') || '');
    const [filtroFechaEntregaSolicitadaDesde, setFiltroFechaEntregaSolicitadaDesde] = useState(urlParams.get('fecha_entrega_solicitada_desde') || '');
    const [filtroFechaEntregaSolicitadaHasta, setFiltroFechaEntregaSolicitadaHasta] = useState(urlParams.get('fecha_entrega_solicitada_hasta') || '');
    const [filtroHoraEntregaSolicitadaDesde, setFiltroHoraEntregaSolicitadaDesde] = useState(urlParams.get('hora_entrega_solicitada_desde') || '');
    const [filtroHoraEntregaSolicitadaHasta, setFiltroHoraEntregaSolicitadaHasta] = useState(urlParams.get('hora_entrega_solicitada_hasta') || '');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [paginationInfo, setPaginationInfo] = useState(initialPaginationInfo);

    // Aplicar filtros y recargar datos
    const aplicarFiltros = useCallback((page: number = 1) => {
        const params: any = { page };

        if (filtroEstadoProforma !== 'TODOS') {
            params.estado = filtroEstadoProforma;
        }

        if (searchProforma.trim()) {
            params.search = searchProforma.trim();
        }

        if (soloVencidas) {
            params.solo_vencidas = 'true';
        }

        // ✅ Agregar filtro de localidad si está seleccionada
        if (filtroLocalidad && filtroLocalidad !== '0') {
            params.localidad_id = filtroLocalidad;
        }

        // ✅ Agregar filtro de tipo de entrega
        if (filtroTipoEntrega && filtroTipoEntrega !== 'TODOS') {
            params.tipo_entrega = filtroTipoEntrega;
        }

        // ✅ Agregar filtro de política de pago
        if (filtroPoliticaPago && filtroPoliticaPago !== 'TODOS') {
            params.politica_pago = filtroPoliticaPago;
        }

        // ✅ Agregar filtro de estado logístico
        if (filtroEstadoLogistica && filtroEstadoLogistica !== '0') {
            params.estado_logistica_id = filtroEstadoLogistica;
        }

        // ✅ Agregar filtro de coordinación completada
        if (filtroCoordinacionCompletada && filtroCoordinacionCompletada !== '') {
            params.coordinacion_completada = filtroCoordinacionCompletada;
        }

        // ✅ Agregar filtro de usuario aprobador
        if (filtroUsuarioAprobador && filtroUsuarioAprobador !== '0') {
            params.usuario_aprobador_id = filtroUsuarioAprobador;
        }

        // ✅ Agregar filtros de fecha de vencimiento
        if (filtroFechaVencimientoDesde && filtroFechaVencimientoDesde !== '') {
            params.fecha_vencimiento_desde = filtroFechaVencimientoDesde;
        }

        if (filtroFechaVencimientoHasta && filtroFechaVencimientoHasta !== '') {
            params.fecha_vencimiento_hasta = filtroFechaVencimientoHasta;
        }

        // ✅ Agregar filtros de fecha de entrega solicitada
        if (filtroFechaEntregaSolicitadaDesde && filtroFechaEntregaSolicitadaDesde !== '') {
            params.fecha_entrega_solicitada_desde = filtroFechaEntregaSolicitadaDesde;
        }

        if (filtroFechaEntregaSolicitadaHasta && filtroFechaEntregaSolicitadaHasta !== '') {
            params.fecha_entrega_solicitada_hasta = filtroFechaEntregaSolicitadaHasta;
        }

        // ✅ Agregar filtros de hora de entrega solicitada
        if (filtroHoraEntregaSolicitadaDesde && filtroHoraEntregaSolicitadaDesde !== '') {
            params.hora_entrega_solicitada_desde = filtroHoraEntregaSolicitadaDesde;
        }

        if (filtroHoraEntregaSolicitadaHasta && filtroHoraEntregaSolicitadaHasta !== '') {
            params.hora_entrega_solicitada_hasta = filtroHoraEntregaSolicitadaHasta;
        }

        // Actualizar paginación inmediatamente (CRITICAL FIX: evitar race condition)
        setPaginationInfo((prev: any) => ({
            ...prev,
            current_page: page,
            from: (page - 1) * prev.per_page + 1,
            to: Math.min(page * prev.per_page, prev.total),
        }));

        // Use FilterService for navigation (proper service layer abstraction)
        FilterService.navigateProformaFilters(params);
    }, [filtroEstadoProforma, searchProforma, soloVencidas, filtroLocalidad, filtroTipoEntrega, filtroPoliticaPago, filtroEstadoLogistica, filtroCoordinacionCompletada, filtroUsuarioAprobador, filtroFechaVencimientoDesde, filtroFechaVencimientoHasta, filtroFechaEntregaSolicitadaDesde, filtroFechaEntregaSolicitadaHasta, filtroHoraEntregaSolicitadaDesde, filtroHoraEntregaSolicitadaHasta]);

    // Aplicar filtros con debounce
    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            aplicarFiltros(1);
        }, searchProforma ? 500 : 0);

        setDebounceTimeout(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [filtroEstadoProforma, soloVencidas, searchProforma, filtroLocalidad, filtroTipoEntrega, filtroPoliticaPago, filtroEstadoLogistica, filtroCoordinacionCompletada, filtroUsuarioAprobador, filtroFechaVencimientoDesde, filtroFechaVencimientoHasta, filtroFechaEntregaSolicitadaDesde, filtroFechaEntregaSolicitadaHasta, filtroHoraEntregaSolicitadaDesde, filtroHoraEntregaSolicitadaHasta, aplicarFiltros]);

    // Cambiar página
    const cambiarPagina = (page: number) => {
        aplicarFiltros(page);
    };

    return {
        searchProforma,
        setSearchProforma,
        filtroEstadoProforma,
        setFiltroEstadoProforma,
        soloVencidas,
        setSoloVencidas,
        filtroLocalidad,
        setFiltroLocalidad,
        filtroTipoEntrega,
        setFiltroTipoEntrega,
        filtroPoliticaPago,
        setFiltroPoliticaPago,
        filtroEstadoLogistica,
        setFiltroEstadoLogistica,
        filtroCoordinacionCompletada,
        setFiltroCoordinacionCompletada,
        filtroUsuarioAprobador,
        setFiltroUsuarioAprobador,
        filtroFechaVencimientoDesde,
        setFiltroFechaVencimientoDesde,
        filtroFechaVencimientoHasta,
        setFiltroFechaVencimientoHasta,
        filtroFechaEntregaSolicitadaDesde,
        setFiltroFechaEntregaSolicitadaDesde,
        filtroFechaEntregaSolicitadaHasta,
        setFiltroFechaEntregaSolicitadaHasta,
        filtroHoraEntregaSolicitadaDesde,
        setFiltroHoraEntregaSolicitadaDesde,
        filtroHoraEntregaSolicitadaHasta,
        setFiltroHoraEntregaSolicitadaHasta,
        paginationInfo,
        setPaginationInfo,
        cambiarPagina,
    };
}

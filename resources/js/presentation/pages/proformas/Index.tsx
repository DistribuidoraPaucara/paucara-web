import AppLayout from '@/layouts/app-layout';
import { ImprimirProformasButton } from '@/presentation/components/impresion/ImprimirProformasButton';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, ChevronDown, Eye, FileText, Filter, MoreVertical, PencilIcon, Printer, Search, X, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

// DOMAIN LAYER: Importar tipos desde domain
import type { Proforma } from '@/domain/entities/proformas';
import type { Id, Pagination } from '@/domain/entities/shared';

// APPLICATION LAYER: Hooks para estados centralizados
import { useEstadosProformas } from '@/application/hooks';

// PRESENTATION LAYER: Componentes reutilizables
import { ProformaEstadoBadge } from '@/presentation/components/proforma/ProformaEstadoBadge';

interface Props {
    proformas: Pagination<Proforma>;
    usuarios?: any[];
    clientes?: any[];
}

export default function ProformasIndex({ proformas, usuarios = [], clientes = [] }: Props) {
    console.log('Proformas recibidas:', proformas);
    const { estados: estadosAPI, isLoading: estadosLoading } = useEstadosProformas();

    // ✅ NUEVO: Leer parámetros de URL
    const getQueryParam = (param: string, defaultValue: string = ''): string => {
        if (typeof window === 'undefined') return defaultValue;
        const params = new URLSearchParams(window.location.search);
        return params.get(param) || defaultValue;
    };

    // ✅ FUNCIONES PARA FECHAS RÁPIDAS
    const getHoyFormato = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    };

    const getAyerFormato = () => {
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        return ayer.toISOString().split('T')[0];
    };

    const getMananaFormato = () => {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        return manana.toISOString().split('T')[0];
    };

    // ✅ FUNCIONES PARA FILTROS RÁPIDOS DE FECHA (Created)
    const filtrarPorAyer = () => {
        setFechaDesde(getAyerFormato());
        setFechaHasta(getAyerFormato());
        setFechaEntregaSolicitada(getAyerFormato());
        handleSearch(searchTerm, filtroEstado, filtroCliente, filtroUsuario, getAyerFormato(), getAyerFormato());
    };

    const filtrarPorHoy = () => {
        setFechaDesde(getHoyFormato());
        setFechaHasta(getHoyFormato());
        setFechaEntregaSolicitada(getHoyFormato());
        handleSearch(searchTerm, filtroEstado, filtroCliente, filtroUsuario, getHoyFormato(), getHoyFormato());
    };

    const filtrarPorManana = () => {
        setFechaDesde(getMananaFormato());
        setFechaHasta(getMananaFormato());
        setFechaEntregaSolicitada(getMananaFormato());
        handleSearch(searchTerm, filtroEstado, filtroCliente, filtroUsuario, getMananaFormato(), getMananaFormato());
    };

    // ✅ FUNCIONES PARA FILTROS RÁPIDOS DE FECHA DE ENTREGA SOLICITADA
    const filtrarEntregaPorAyer = () => {
        setFechaEntregaDesde(getAyerFormato());
        setFechaEntregaHasta(getAyerFormato());
        handleSearch(
            searchTerm,
            filtroEstado,
            filtroCliente,
            filtroUsuario,
            fechaDesde,
            fechaHasta,
            totalMin,
            totalMax,
            filtroVencidas,
            soloConvertidas,
            fechaVentaDesde,
            fechaVentaHasta,
            undefined,
            getAyerFormato(),
            getAyerFormato(),
        );
    };

    const filtrarEntregaPorHoy = () => {
        setFechaEntregaDesde(getHoyFormato());
        setFechaEntregaHasta(getHoyFormato());
        handleSearch(
            searchTerm,
            filtroEstado,
            filtroCliente,
            filtroUsuario,
            fechaDesde,
            fechaHasta,
            totalMin,
            totalMax,
            filtroVencidas,
            soloConvertidas,
            fechaVentaDesde,
            fechaVentaHasta,
            undefined,
            getHoyFormato(),
            getHoyFormato(),
        );
    };

    const filtrarEntregaPorManana = () => {
        setFechaEntregaDesde(getMananaFormato());
        setFechaEntregaHasta(getMananaFormato());
        handleSearch(
            searchTerm,
            filtroEstado,
            filtroCliente,
            filtroUsuario,
            fechaDesde,
            fechaHasta,
            totalMin,
            totalMax,
            filtroVencidas,
            soloConvertidas,
            fechaVentaDesde,
            fechaVentaHasta,
            undefined,
            getMananaFormato(),
            getMananaFormato(),
        );
    };

    // ✅ FUNCIONES PARA FILTROS RÁPIDOS DE FECHA DE VENCIMIENTO
    const filtrarVencimientoPorAyer = () => {
        setFechaVencimientoDesde(getAyerFormato());
        setFechaVencimientoHasta(getAyerFormato());
        handleSearch(
            searchTerm,
            filtroEstado,
            filtroCliente,
            filtroUsuario,
            fechaDesde,
            fechaHasta,
            totalMin,
            totalMax,
            filtroVencidas,
            soloConvertidas,
            fechaVentaDesde,
            fechaVentaHasta,
            undefined,
            fechaEntregaDesde,
            fechaEntregaHasta,
            getAyerFormato(),
            getAyerFormato(),
        );
    };

    const filtrarVencimientoPorHoy = () => {
        setFechaVencimientoDesde(getHoyFormato());
        setFechaVencimientoHasta(getHoyFormato());
        handleSearch(
            searchTerm,
            filtroEstado,
            filtroCliente,
            filtroUsuario,
            fechaDesde,
            fechaHasta,
            totalMin,
            totalMax,
            filtroVencidas,
            soloConvertidas,
            fechaVentaDesde,
            fechaVentaHasta,
            undefined,
            fechaEntregaDesde,
            fechaEntregaHasta,
            getHoyFormato(),
            getHoyFormato(),
        );
    };

    const filtrarVencimientoPorManana = () => {
        setFechaVencimientoDesde(getMananaFormato());
        setFechaVencimientoHasta(getMananaFormato());
        handleSearch(
            searchTerm,
            filtroEstado,
            filtroCliente,
            filtroUsuario,
            fechaDesde,
            fechaHasta,
            totalMin,
            totalMax,
            filtroVencidas,
            soloConvertidas,
            fechaVentaDesde,
            fechaVentaHasta,
            undefined,
            fechaEntregaDesde,
            fechaEntregaHasta,
            getMananaFormato(),
            getMananaFormato(),
        );
    };

    // ✅ NUEVO 2026-02-21: Estados expandidos para filtrado mejorado (inicializar desde URL)
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(getQueryParam('search', ''));
    const [filtroEstado, setFiltroEstado] = useState<string>(getQueryParam('estado', 'TODOS'));
    const [filtroCliente, setFiltroCliente] = useState<string>(getQueryParam('cliente_id', 'TODOS'));
    const [filtroUsuario, setFiltroUsuario] = useState<string>(getQueryParam('usuario_creador_id', 'TODOS'));
    const [fechaDesde, setFechaDesde] = useState<string>(getQueryParam('fecha_desde', ''));
    const [fechaHasta, setFechaHasta] = useState<string>(getQueryParam('fecha_hasta', ''));
    const [totalMin, setTotalMin] = useState<string>(getQueryParam('total_min', ''));
    const [totalMax, setTotalMax] = useState<string>(getQueryParam('total_max', ''));
    const [filtroVencidas, setFiltroVencidas] = useState<string>(getQueryParam('filtro_vencidas', 'TODAS'));
    // ✅ NUEVO: Filtro para proformas convertidas a ventas
    const [soloConvertidas, setSoloConvertidas] = useState<boolean>(getQueryParam('solo_convertidas') === 'true');
    const [fechaVentaDesde, setFechaVentaDesde] = useState<string>(getQueryParam('fecha_venta_desde', ''));
    const [fechaVentaHasta, setFechaVentaHasta] = useState<string>(getQueryParam('fecha_venta_hasta', ''));
    // ✅ NUEVO: Filtros para fecha de entrega solicitada
    const [fechaEntregaSolicitada, setFechaEntregaSolicitada] = useState<string>(getQueryParam('fecha_entrega_solicitada', ''));
    const [fechaEntregaDesde, setFechaEntregaDesde] = useState<string>(getQueryParam('fecha_entrega_solicitada_desde', ''));
    const [fechaEntregaHasta, setFechaEntregaHasta] = useState<string>(getQueryParam('fecha_entrega_solicitada_hasta', ''));
    // ✅ NUEVO: Filtros para fecha de vencimiento
    const [fechaVencimientoDesde, setFechaVencimientoDesde] = useState<string>(getQueryParam('fecha_vencimiento_desde', ''));
    const [fechaVencimientoHasta, setFechaVencimientoHasta] = useState<string>(getQueryParam('fecha_vencimiento_hasta', ''));

    const [isLoading, setIsLoading] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const [selectedProformaForPrint, setSelectedProformaForPrint] = useState<Proforma | null>(null);

    // ✅ ACTUALIZADO 2026-02-21: Usar datos fijos del servidor en lugar de búsquedas dinámicas
    const [clientesOptions, setClientesOptions] = useState<any[]>([
        { value: 'TODOS', label: 'Todos los clientes' },
        ...(clientes || []).map((cliente) => ({
            value: cliente.id.toString(),
            label: cliente.nombre,
            description: cliente.email || '',
        })),
    ]);
    const [usuariosOptions, setUsuariosOptions] = useState<any[]>([
        { value: 'TODOS', label: 'Todos los usuarios' },
        ...(usuarios || []).map((usuario) => ({
            value: usuario.id.toString(),
            label: usuario.name || 'Sin nombre',
            description: usuario.email || '',
        })),
    ]);

    // Generar opciones de estado desde el API
    const estadoOptions = useMemo(() => {
        return estadosAPI.map((estado) => ({
            value: estado.codigo,
            label: estado.nombre,
        }));
    }, [estadosAPI]);

    // ✅ SIMPLIFICADO 2026-02-21: Backend ya filtra los datos
    // Los datos de proformas.data ya vienen filtrados desde el servidor basándose en los parámetros URL
    const filteredProformas = useMemo(() => {
        return proformas.data;
    }, [proformas.data]);

    // ✅ NUEVO 2026-02-21: Verificar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return (
            searchTerm !== '' ||
            filtroEstado !== 'TODOS' ||
            filtroCliente !== 'TODOS' ||
            filtroUsuario !== 'TODOS' ||
            fechaDesde !== '' ||
            fechaHasta !== '' ||
            totalMin !== '' ||
            totalMax !== '' ||
            filtroVencidas !== 'TODAS' || // ✅ NUEVO: Incluir filtro de vencidas
            soloConvertidas || // ✅ NUEVO: Incluir filtro de convertidas
            fechaVentaDesde !== '' ||
            fechaVentaHasta !== '' ||
            fechaEntregaSolicitada !== '' || // ✅ NUEVO: Incluir filtro de entrega solicitada
            fechaEntregaDesde !== '' || // ✅ NUEVO: Incluir filtro de entrega desde
            fechaEntregaHasta !== '' || // ✅ NUEVO: Incluir filtro de entrega hasta
            fechaVencimientoDesde !== '' || // ✅ NUEVO: Incluir filtro de vencimiento desde
            fechaVencimientoHasta !== '' // ✅ NUEVO: Incluir filtro de vencimiento hasta
        );
    }, [
        searchTerm,
        filtroEstado,
        filtroCliente,
        filtroUsuario,
        fechaDesde,
        fechaHasta,
        totalMin,
        totalMax,
        filtroVencidas,
        soloConvertidas,
        fechaVentaDesde,
        fechaVentaHasta,
        fechaEntregaSolicitada,
        fechaEntregaDesde,
        fechaEntregaHasta,
        fechaVencimientoDesde,
        fechaVencimientoHasta,
    ]);

    // ✅ ACTUALIZADO 2026-02-21: Limpiar filtros y navegar al servidor
    const limpiarFiltros = () => {
        setSearchTerm('');
        setFiltroEstado('TODOS');
        setFiltroCliente('TODOS');
        setFiltroUsuario('TODOS');
        setFechaDesde('');
        setFechaHasta('');
        setTotalMin('');
        setTotalMax('');
        setFiltroVencidas('TODAS');
        // ✅ NUEVO: Limpiar filtros de convertidas
        setSoloConvertidas(false);
        setFechaVentaDesde('');
        setFechaVentaHasta('');
        // ✅ NUEVO: Limpiar fechas de entrega solicitada
        setFechaEntregaSolicitada('');
        setFechaEntregaDesde('');
        setFechaEntregaHasta('');
        // ✅ NUEVO: Limpiar fechas de vencimiento
        setFechaVencimientoDesde('');
        setFechaVencimientoHasta('');
        // Navegar sin parámetros para ver todos los registros
        router.visit('/proformas', { preserveState: true });
    };

    // ✅ ACTUALIZADO 2026-02-21: Búsqueda local de clientes (datos fijos del servidor)
    const handleSearchClientes = (query: string) => {
        if (!query || query.length < 2) {
            setClientesOptions([
                { value: 'TODOS', label: 'Todos los clientes' },
                ...(clientes || []).map((cliente) => ({
                    value: cliente.id.toString(),
                    label: cliente.nombre,
                    description: cliente.email || '',
                })),
            ]);
            return;
        }

        const queryLower = query.toLowerCase();
        const filtrados = (clientes || []).filter(
            (cliente) => cliente.nombre.toLowerCase().includes(queryLower) || (cliente.email && cliente.email.toLowerCase().includes(queryLower)),
        );

        setClientesOptions([
            { value: 'TODOS', label: 'Todos los clientes' },
            ...filtrados.map((cliente) => ({
                value: cliente.id.toString(),
                label: cliente.nombre,
                description: cliente.email || '',
            })),
        ]);
    };

    // ✅ ACTUALIZADO 2026-02-21: Búsqueda local de usuarios (datos fijos del servidor)
    const handleSearchUsuarios = (query: string) => {
        if (!query || query.length < 2) {
            setUsuariosOptions([
                { value: 'TODOS', label: 'Todos los usuarios' },
                ...(usuarios || []).map((usuario) => ({
                    value: usuario.id.toString(),
                    label: usuario.name || 'Sin nombre',
                    description: usuario.email || '',
                })),
            ]);
            return;
        }

        const queryLower = query.toLowerCase();
        const filtrados = (usuarios || []).filter(
            (usuario) =>
                (usuario.name && usuario.name.toLowerCase().includes(queryLower)) ||
                (usuario.email && usuario.email.toLowerCase().includes(queryLower)),
        );

        setUsuariosOptions([
            { value: 'TODOS', label: 'Todos los usuarios' },
            ...filtrados.map((usuario) => ({
                value: usuario.id.toString(),
                label: usuario.name || 'Sin nombre',
                description: usuario.email || '',
            })),
        ]);
    };

    // ✅ ACTUALIZADO: Función mejorada que acepta valores de filtros
    const handleSearch = (
        searchValue?: string,
        estadoValue?: string,
        clienteValue?: string,
        usuarioValue?: string,
        fechaDesdeValue?: string,
        fechaHastaValue?: string,
        totalMinValue?: string,
        totalMaxValue?: string,
        filtroVencidasValue?: string,
        soloConvertidosValue?: boolean,
        fechaVentaDesdeValue?: string,
        fechaVentaHastaValue?: string,
        fechaEntregaSolicitadaValue?: string,
        fechaEntregaDesdeValue?: string,
        fechaEntregaHastaValue?: string,
        fechaVencimientoDesdeValue?: string,
        fechaVencimientoHastaValue?: string,
    ) => {
        // Usar los valores proporcionados o los del estado
        const search = searchValue ?? searchTerm;
        const estado = estadoValue ?? filtroEstado;
        const cliente = clienteValue ?? filtroCliente;
        const usuario = usuarioValue ?? filtroUsuario;
        const desde = fechaDesdeValue ?? fechaDesde;
        const hasta = fechaHastaValue ?? fechaHasta;
        const minTotal = totalMinValue ?? totalMin;
        const maxTotal = totalMaxValue ?? totalMax;
        const vencidas = filtroVencidasValue ?? filtroVencidas;
        const convertidos = soloConvertidosValue !== undefined ? soloConvertidosValue : soloConvertidas;
        const desdeVenta = fechaVentaDesdeValue ?? fechaVentaDesde;
        const hastaVenta = fechaVentaHastaValue ?? fechaVentaHasta;
        const entregaSolicitada = fechaEntregaSolicitadaValue ?? fechaEntregaSolicitada;
        const desdeEntrega = fechaEntregaDesdeValue ?? fechaEntregaDesde;
        const hastaEntrega = fechaEntregaHastaValue ?? fechaEntregaHasta;
        const desdeVencimiento = fechaVencimientoDesdeValue ?? fechaVencimientoDesde;
        const hastaVencimiento = fechaVencimientoHastaValue ?? fechaVencimientoHasta;

        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (estado !== 'TODOS') params.append('estado', estado);
        if (cliente !== 'TODOS') params.append('cliente_id', cliente);
        if (usuario !== 'TODOS') params.append('usuario_creador_id', usuario);
        if (desde) params.append('fecha_desde', desde);
        if (hasta) params.append('fecha_hasta', hasta);
        if (minTotal) params.append('total_min', minTotal);
        if (maxTotal) params.append('total_max', maxTotal);
        if (vencidas !== 'TODAS') params.append('filtro_vencidas', vencidas);
        // ✅ NUEVO: Agregar parámetros de filtro de convertidas
        if (convertidos) params.append('solo_convertidas', 'true');
        if (desdeVenta) params.append('fecha_venta_desde', desdeVenta);
        if (hastaVenta) params.append('fecha_venta_hasta', hastaVenta);
        // ✅ NUEVO: Agregar filtro de fecha de entrega solicitada
        if (entregaSolicitada) params.append('fecha_entrega_solicitada', entregaSolicitada);
        // ✅ NUEVO: Agregar filtros de rango de fecha de entrega solicitada
        if (desdeEntrega) params.append('fecha_entrega_solicitada_desde', desdeEntrega);
        if (hastaEntrega) params.append('fecha_entrega_solicitada_hasta', hastaEntrega);
        // ✅ NUEVO: Agregar filtros de rango de fecha de vencimiento
        if (desdeVencimiento) params.append('fecha_vencimiento_desde', desdeVencimiento);
        if (hastaVencimiento) params.append('fecha_vencimiento_hasta', hastaVencimiento);

        const queryString = params.toString();
        const url = queryString ? `/proformas?${queryString}` : '/proformas';
        router.visit(url, { preserveState: true });
    };

    const handleView = (id: Id) => {
        router.visit(`/proformas/${id}`);
    };

    const handleAction = (action: string, id: Id) => {
        setIsLoading(true);
        router.post(
            `/proformas/${id}/${action}`,
            {},
            {
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const getProformaRowClassName = (estado: string) => {
        switch (estado) {
            case 'APROBADA':
                return 'bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30';
            case 'CONVERTIDA':
                return 'bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30';
            case 'RECHAZADA':
                return 'bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30';
            case 'PENDIENTE':
                return 'bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30';
            case 'BORRADOR':
                return 'bg-gray-50 dark:bg-gray-950/20 hover:bg-gray-100 dark:hover:bg-gray-900/30';
            default:
                return '';
        }
    };

    return (
        <AppLayout>
            <Head title="Proformas" />

            <div className="space-y-6 p-4">
                {/* Header con integración de filtros y botones */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proformas</h1>
                        <p className="text-gray-500 dark:text-gray-400">Gestiona las proformas del sistema</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* ✅ NUEVO: Botón de Impresión de Proformas Filtradas - Solo si hay datos */}
                        {filteredProformas.length > 0 && (
                            <ImprimirProformasButton
                                proformas={filteredProformas}
                                filtros={{
                                    searchTerm,
                                    filtroEstado,
                                    filtroCliente,
                                    filtroUsuario,
                                    fechaDesde,
                                    fechaHasta,
                                    totalMin,
                                    totalMax,
                                    filtroVencidas,
                                }}
                            />
                        )}
                        <Button asChild>
                            <Link href="/proformas/create">
                                <FileText className="mr-2 h-4 w-4" />
                                Nueva Proforma
                            </Link>
                        </Button>
                        {/* Botón para acceder al reporte con filtros */}
                        <div className="flex items-end">
                            <Link
                                href={(() => {
                                    const params = new URLSearchParams();
                                    if (fechaVentaDesde) params.append('fecha_desde', fechaVentaDesde);
                                    if (fechaVentaHasta) params.append('fecha_hasta', fechaVentaHasta);
                                    if (filtroUsuario !== 'TODOS') params.append('usuario_creador_id', filtroUsuario);
                                    const queryString = params.toString();
                                    return queryString ? `/ventas/reporte-productos-vendidos?${queryString}` : '/ventas/reporte-productos-vendidos';
                                })()}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                📊 Ver Reporte
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ✅ NUEVO 2026-02-21: Filtros colapsibles mejorados */}
                <Card>
                    <CardHeader className="cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filtros
                                {hasActiveFilters && (
                                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                        {
                                            [
                                                searchTerm !== '',
                                                filtroEstado !== 'TODOS',
                                                filtroCliente !== 'TODOS',
                                                filtroUsuario !== 'TODOS',
                                                fechaDesde !== '',
                                                fechaHasta !== '',
                                                totalMin !== '',
                                                totalMax !== '',
                                            ].filter(Boolean).length
                                        }{' '}
                                        activos
                                    </span>
                                )}
                            </CardTitle>
                            <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </div>
                    </CardHeader>

                    {/* ✅ NUEVO: Botones rápidos de fecha */}
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex flex-wrap gap-2">
                            <span className="self-center text-xs font-medium text-muted-foreground">Fechas rápidas:</span>
                            <Button
                                size="sm"
                                variant={fechaDesde === getAyerFormato() ? 'default' : 'outline'}
                                onClick={filtrarPorAyer}
                                className="text-xs"
                            >
                                📅 Ayer
                            </Button>
                            <Button
                                size="sm"
                                variant={fechaDesde === getHoyFormato() ? 'default' : 'outline'}
                                onClick={filtrarPorHoy}
                                className="text-xs"
                            >
                                📅 Hoy
                            </Button>
                            <Button
                                size="sm"
                                variant={fechaDesde === getMananaFormato() ? 'default' : 'outline'}
                                onClick={filtrarPorManana}
                                className="text-xs"
                            >
                                📅 Mañana
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <CardContent className="space-y-4">
                            {/* Primera fila de filtros */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Búsqueda */}
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por ID, número o cliente..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Estado */}
                                <Select value={filtroEstado} onValueChange={setFiltroEstado} disabled={estadosLoading}>
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODOS">Todos los estados</SelectItem>
                                        {estadoOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Cliente con SearchSelect - Búsqueda local */}
                                <SearchSelect
                                    label="👥 Cliente"
                                    placeholder="Selecciona un cliente"
                                    value={filtroCliente}
                                    onChange={setFiltroCliente}
                                    onSearch={handleSearchClientes}
                                    options={clientesOptions}
                                    searchPlaceholder="Buscar cliente..."
                                    emptyText="No se encontraron clientes"
                                    allowClear={true}
                                />

                                {/* Usuario Creador/Preventista con SearchSelect - Búsqueda local */}
                                <SearchSelect
                                    label="👤 Preventista/Creador"
                                    placeholder="Selecciona un usuario"
                                    value={filtroUsuario}
                                    onChange={setFiltroUsuario}
                                    onSearch={handleSearchUsuarios}
                                    options={usuariosOptions}
                                    searchPlaceholder="Buscar usuario..."
                                    emptyText="No se encontraron usuarios"
                                    allowClear={true}
                                />
                            </div>

                            {/* ✅ GRID 3 COLUMNAS RESPONSIVAS: Filtros de fechas y conversiones */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {/* ✅ NUEVA FILA: Filtros de fecha de entrega solicitada */}
                                <div className="h-full space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                                    {/* Botones rápidos */}
                                    <div>
                                        <span className="self-center text-xs font-medium text-muted-foreground">📦 Fechas rápidas Entrega:</span>{' '}
                                        <br />
                                        <Button
                                            size="sm"
                                            variant={fechaEntregaDesde === getAyerFormato() ? 'default' : 'outline'}
                                            onClick={filtrarEntregaPorAyer}
                                            className="text-xs"
                                        >
                                            📅 Ayer
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={fechaEntregaDesde === getHoyFormato() ? 'default' : 'outline'}
                                            onClick={filtrarEntregaPorHoy}
                                            className="text-xs"
                                        >
                                            📅 Hoy
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={fechaEntregaDesde === getMananaFormato() ? 'default' : 'outline'}
                                            onClick={filtrarEntregaPorManana}
                                            className="text-xs"
                                        >
                                            📅 Mañana
                                        </Button>
                                    </div>

                                    {/* Campos de fecha */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">📦 Entrega Desde</label>
                                            <Input
                                                type="date"
                                                value={fechaEntregaDesde}
                                                onChange={(e) => setFechaEntregaDesde(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">📦 Entrega Hasta</label>
                                            <Input
                                                type="date"
                                                value={fechaEntregaHasta}
                                                onChange={(e) => setFechaEntregaHasta(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ NUEVA FILA: Filtros de fecha de vencimiento */}
                                <div className="h-full space-y-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                                    {/* Botones rápidos */}
                                    <div>
                                        <span className="self-center text-xs font-medium text-muted-foreground">📅 Fechas rápidas Vencimiento:</span>{' '}
                                        <br />
                                        <Button
                                            size="sm"
                                            variant={fechaVencimientoDesde === getAyerFormato() ? 'default' : 'outline'}
                                            onClick={filtrarVencimientoPorAyer}
                                            className="text-xs"
                                        >
                                            📅 Ayer
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={fechaVencimientoDesde === getHoyFormato() ? 'default' : 'outline'}
                                            onClick={filtrarVencimientoPorHoy}
                                            className="text-xs"
                                        >
                                            📅 Hoy
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={fechaVencimientoDesde === getMananaFormato() ? 'default' : 'outline'}
                                            onClick={filtrarVencimientoPorManana}
                                            className="text-xs"
                                        >
                                            📅 Mañana
                                        </Button>
                                    </div>

                                    {/* Campos de fecha */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">📅 Vencimiento Desde</label>
                                            <Input
                                                type="date"
                                                value={fechaVencimientoDesde}
                                                onChange={(e) => setFechaVencimientoDesde(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">📅 Vencimiento Hasta</label>
                                            <Input
                                                type="date"
                                                value={fechaVencimientoHasta}
                                                onChange={(e) => setFechaVencimientoHasta(e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ NUEVA FILA: Filtros de proformas convertidas a ventas */}
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                                    {/* Checkbox: Solo Convertidas */}
                                    <div className="col-span-1 flex items-center gap-3 md:col-span-2 lg:col-span-1">
                                        <input
                                            type="checkbox"
                                            id="soloConvertidas"
                                            checked={soloConvertidas}
                                            onChange={(e) => setSoloConvertidas(e.target.checked)}
                                            className="h-4 w-4 rounded text-blue-600"
                                        />
                                        <label
                                            htmlFor="soloConvertidas"
                                            className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            🛍️ Solo Convertidas a Ventas
                                        </label>
                                    </div>

                                    {/* Fecha de Venta Desde */}
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Venta Desde</label>
                                        <Input
                                            type="date"
                                            value={fechaVentaDesde}
                                            onChange={(e) => setFechaVentaDesde(e.target.value)}
                                            disabled={!soloConvertidas}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Fecha de Venta Hasta */}
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Venta Hasta</label>
                                        <Input
                                            type="date"
                                            value={fechaVentaHasta}
                                            onChange={(e) => setFechaVentaHasta(e.target.value)}
                                            disabled={!soloConvertidas}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tercera fila: Botones de acción */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={() =>
                                        handleSearch(
                                            searchTerm,
                                            filtroEstado,
                                            filtroCliente,
                                            filtroUsuario,
                                            fechaDesde,
                                            fechaHasta,
                                            totalMin,
                                            totalMax,
                                            filtroVencidas,
                                            soloConvertidas,
                                            fechaVentaDesde,
                                            fechaVentaHasta,
                                            fechaEntregaSolicitada,
                                            fechaEntregaDesde,
                                            fechaEntregaHasta,
                                            fechaVencimientoDesde,
                                            fechaVencimientoHasta,
                                        )
                                    }
                                    className="flex-1"
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Buscar
                                </Button>
                                {hasActiveFilters && (
                                    <Button variant="outline" onClick={limpiarFiltros}>
                                        <X className="mr-2 h-4 w-4" />
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* ✅ NUEVO 2026-02-21: Tabla mejorada con ordenamiento */}
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Número</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead className="text-center">Total</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>📅 Solicitada Por</TableHead>
                                <TableHead>📅 Vencimiento</TableHead>
                                {/* <TableHead>🛍️ Venta</TableHead> */}
                                <TableHead>📅 Creada</TableHead>
                                <TableHead>✏️ Actualizada</TableHead>
                                <TableHead className="text-center">-</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProformas.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={12} className="py-8 text-center text-muted-foreground">
                                        {hasActiveFilters
                                            ? '❌ No se encontraron proformas que coincidan con los filtros'
                                            : '📭 No hay proformas registradas'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProformas.map((proforma) => (
                                    <TableRow key={proforma.id} className={getProformaRowClassName(proforma.estado)}>
                                        <TableCell className="font-small">#{proforma.id}</TableCell>
                                        <TableCell>
                                            <p className="text-xs">{proforma.cliente.nombre}</p>
                                        </TableCell>
                                        <TableCell>Bs. {proforma.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>
                                            {proforma.estado_logistica ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs">{proforma.estado_logistica.icono}</span>
                                                    <span className="text-xs">{proforma.estado_logistica.codigo}</span>
                                                </div>
                                            ) : (
                                                <ProformaEstadoBadge estado={proforma.estado} />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            {(proforma.usuario_creador as any)?.name || 'Sin asignar'}
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            <div className="text-xs">
                                                {proforma.fecha_entrega_solicitada ? (
                                                    <div>
                                                        {new Date(proforma.fecha_entrega_solicitada).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            <div className="whitespace-nowrap">
                                                {proforma.fecha_vencimiento ? (
                                                    <div>
                                                        {new Date(proforma.fecha_vencimiento).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            <div className="whitespace-nowrap">
                                                <div>
                                                    {new Date(proforma.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                                </div>
                                                <div className="text-xs">
                                                    {new Date(proforma.created_at).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-xs text-muted-foreground">
                                            <div className="whitespace-nowrap">
                                                <div>
                                                    {new Date(proforma.updated_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                                </div>
                                                <div className="text-xs">
                                                    {new Date(proforma.updated_at).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    {/* Ver detalles */}
                                                    <DropdownMenuItem onClick={() => handleView(proforma.id)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>Ver detalles</span>
                                                    </DropdownMenuItem>

                                                    {/* Imprimir */}
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedProformaForPrint(proforma);
                                                            setShowPrintModal(true);
                                                        }}
                                                    >
                                                        <Printer className="mr-2 h-4 w-4" />
                                                        <span>Imprimir</span>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    {/* Editar (solo si está PENDIENTE o BORRADOR) */}
                                                    {['PENDIENTE', 'BORRADOR'].includes(proforma.estado) && (
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/proformas/${proforma.id}/edit`}>
                                                                <PencilIcon className="mr-2 h-4 w-4" />
                                                                <span>Editar</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )}

                                                    {/* Acciones de aprobación/rechazo (solo si está PENDIENTE) */}
                                                    {proforma.estado === 'PENDIENTE' && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleAction('aprobar', proforma.id)}
                                                                disabled={isLoading}
                                                                className="text-green-600"
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                <span>Aprobar</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleAction('rechazar', proforma.id)}
                                                                disabled={isLoading}
                                                                className="text-red-600"
                                                            >
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                <span>Rechazar</span>
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {proformas.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {proformas.from} a {proformas.to} de {proformas.total} resultados
                        </div>
                        <div className="flex gap-2">
                            {proformas.links?.map((link, index) => {
                                if (!link.url) return null;

                                return (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ✅ NUEVO: Modal de Impresión */}
                {showPrintModal && selectedProformaForPrint && (
                    <OutputSelectionModal
                        isOpen={showPrintModal}
                        onClose={() => {
                            setShowPrintModal(false);
                            setSelectedProformaForPrint(null);
                        }}
                        tipoDocumento="proforma"
                        documentoId={selectedProformaForPrint.id}
                        documentoInfo={{
                            numero: selectedProformaForPrint.numero,
                            fecha: selectedProformaForPrint.created_at,
                            monto: selectedProformaForPrint.total,
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}

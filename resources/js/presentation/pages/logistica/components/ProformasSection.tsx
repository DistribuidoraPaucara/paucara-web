import { useEstadosProformas } from '@/application/hooks';
import type { ProformaAppExterna } from '@/domain/entities/logistica';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/presentation/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import { Link } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    MoreVertical,
    Pencil,
    Printer,
    Search,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type SortField = 'numero' | 'cliente' | 'estado' | 'monto' | 'fecha' | null;
type SortDirection = 'asc' | 'desc' | null;

interface ProformasSectionProps {
    proformas: ProformaAppExterna[];
    paginationInfo: any;
    searchProforma: string;
    setSearchProforma: (value: string) => void;
    filtroEstadoProforma: string;
    setFiltroEstadoProforma: (value: string) => void;
    soloVencidas: boolean;
    setSoloVencidas: (value: boolean) => void;
    filtroLocalidad: string;
    setFiltroLocalidad: (value: string) => void;
    localidades: Array<{ id: number; nombre: string }>;
    // ✅ Nuevos filtros
    filtroTipoEntrega: string;
    setFiltroTipoEntrega: (value: string) => void;
    filtroPoliticaPago: string;
    setFiltroPoliticaPago: (value: string) => void;
    filtroEstadoLogistica: string;
    setFiltroEstadoLogistica: (value: string) => void;
    filtroCoordinacionCompletada: string;
    setFiltroCoordinacionCompletada: (value: string) => void;
    filtroUsuarioAprobador: string;
    setFiltroUsuarioAprobador: (value: string) => void;
    usuariosAprobadores: Array<{ id: number; name: string }>;
    estadosLogistica: Array<{ id: number; nombre: string; codigo: string }>;
    // ✅ Filtros de fechas y horas
    filtroFechaVencimientoDesde: string;
    setFiltroFechaVencimientoDesde: (value: string) => void;
    filtroFechaVencimientoHasta: string;
    setFiltroFechaVencimientoHasta: (value: string) => void;
    filtroFechaCreacionDesde: string;
    setFiltroFechaCreacionDesde: (value: string) => void;
    filtroFechaCreacionHasta: string;
    setFiltroFechaCreacionHasta: (value: string) => void;
    filtroFechaEntregaSolicitadaDesde: string;
    setFiltroFechaEntregaSolicitadaDesde: (value: string) => void;
    filtroFechaEntregaSolicitadaHasta: string;
    setFiltroFechaEntregaSolicitadaHasta: (value: string) => void;
    filtroHoraEntregaSolicitadaDesde: string;
    setFiltroHoraEntregaSolicitadaDesde: (value: string) => void;
    filtroHoraEntregaSolicitadaHasta: string;
    setFiltroHoraEntregaSolicitadaHasta: (value: string) => void;
    cambiarPagina: (page: number) => void;
    onVerProforma: (proforma: ProformaAppExterna) => void;
    onEditarProforma?: (proforma: ProformaAppExterna) => void;
    onRechazarProforma?: (proforma: ProformaAppExterna) => void;
    getEstadoBadge: (estado: string, proforma: ProformaAppExterna) => any;
    estaVencida: (proforma: ProformaAppExterna) => boolean;
}

export function ProformasSection({
    proformas,
    paginationInfo,
    searchProforma,
    setSearchProforma,
    filtroEstadoProforma,
    setFiltroEstadoProforma,
    soloVencidas,
    setSoloVencidas,
    filtroLocalidad,
    setFiltroLocalidad,
    localidades,
    // ✅ Nuevos filtros
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
    usuariosAprobadores,
    estadosLogistica,
    // ✅ Filtros de fechas y horas
    filtroFechaVencimientoDesde,
    setFiltroFechaVencimientoDesde,
    filtroFechaVencimientoHasta,
    setFiltroFechaVencimientoHasta,
    filtroFechaCreacionDesde,
    setFiltroFechaCreacionDesde,
    filtroFechaCreacionHasta,
    setFiltroFechaCreacionHasta,
    filtroFechaEntregaSolicitadaDesde,
    setFiltroFechaEntregaSolicitadaDesde,
    filtroFechaEntregaSolicitadaHasta,
    setFiltroFechaEntregaSolicitadaHasta,
    filtroHoraEntregaSolicitadaDesde,
    setFiltroHoraEntregaSolicitadaDesde,
    filtroHoraEntregaSolicitadaHasta,
    setFiltroHoraEntregaSolicitadaHasta,
    cambiarPagina,
    onVerProforma,
    onEditarProforma,
    onRechazarProforma,
    estaVencida,
}: ProformasSectionProps) {
    // ✅ DEBUG: Mostrar datos que llegan del backend
    if (proformas && proformas.length > 0) {
        console.log('📊 PROFORMAS RECIBIDAS DEL BACKEND:', {
            cantidad: proformas.length,
            primerProforma: proformas[0],
            paginacion: paginationInfo,
        });
    }

    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [amountFrom, setAmountFrom] = useState<string>('');
    const [amountTo, setAmountTo] = useState<string>('');
    const [searchInput, setSearchInput] = useState<string>(searchProforma);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const [selectedProformaForPrint, setSelectedProformaForPrint] = useState<ProformaAppExterna | null>(null);

    // Fase 3: Usar hook de estados centralizados para obtener estados dinámicamente
    const { estados: estadosAPI, isLoading, error } = useEstadosProformas();

    // Crear array de opciones: TODOS + estados del API
    const estados = useMemo(() => {
        const estadosCodigos = estadosAPI.map((e) => e.codigo);
        const resultado = ['TODOS' as const, ...estadosCodigos];

        // 🔍 DEBUG: Log en consola web
        console.log('📊 [ProformasSection] Estados cargados:', {
            estadosAPI: estadosAPI,
            estadosCodigos: estadosCodigos,
            resultado: resultado,
            isLoading: isLoading,
            error: error,
        });

        return resultado;
    }, [estadosAPI]);

    // ✅ NUEVO (2026-07-18): Establecer PENDIENTE como estado por defecto al cargar
    useEffect(() => {
        // Si no hay filtro o está vacío, establecer PENDIENTE como valor por defecto
        if ((!filtroEstadoProforma || filtroEstadoProforma === 'TODOS') && estados.length > 0) {
            console.log('🔍 [ProformasSection] Estableciendo filtro por defecto a PENDIENTE');
            setFiltroEstadoProforma('PENDIENTE');
        }
    }, [estados.length]);

    // Función para contar filtros activos
    const countActiveFilters = () => {
        let count = 0;
        if (filtroLocalidad) count++;
        if (filtroTipoEntrega) count++;
        if (filtroPoliticaPago) count++;
        if (filtroEstadoLogistica) count++;
        if (filtroCoordinacionCompletada) count++;
        if (filtroUsuarioAprobador) count++;
        if (soloVencidas) count++;
        if (dateFrom || dateTo) count++;
        if (amountFrom || amountTo) count++;
        // ✅ Filtros de fechas y horas
        if (filtroFechaVencimientoDesde || filtroFechaVencimientoHasta) count++;
        if (filtroFechaCreacionDesde || filtroFechaCreacionHasta) count++;
        if (filtroFechaEntregaSolicitadaDesde || filtroFechaEntregaSolicitadaHasta) count++;
        if (filtroHoraEntregaSolicitadaDesde || filtroHoraEntregaSolicitadaHasta) count++;
        return count;
    };

    const activeFiltersCount = countActiveFilters();

    // ✅ NUEVO: Función para obtener color de fondo de fila según estado
    const getRowBackgroundByEstado = (estado: string): string => {
        const estadoNormalizado = (estado || '').toUpperCase().trim();

        const colores: Record<string, string> = {
            CONVERTIDA: 'bg-green-50 dark:bg-green-950/20 border-l-4 border-l-green-500 hover:bg-green-100 dark:hover:bg-green-950/30',
            PENDIENTE: 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-l-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-950/30',
            RECHAZADA: 'bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500 hover:bg-red-100 dark:hover:bg-red-950/30',
            EN_REVISION: 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950/30',
            APROBADA: 'bg-purple-50 dark:bg-purple-950/20 border-l-4 border-l-purple-500 hover:bg-purple-100 dark:hover:bg-purple-950/30',
            DRAFT: 'bg-gray-50 dark:bg-gray-950/20 border-l-4 border-l-gray-500 hover:bg-gray-100 dark:hover:bg-gray-950/30',
        };

        return colores[estadoNormalizado] || 'bg-white dark:bg-gray-900 border-l-4 border-l-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800';
    };

    // ✅ NUEVO: Función para obtener estilos del badge de estado con colores específicos
    const getEstadoBadgeStyle = (estado: string) => {
        const estadoNormalizado = (estado || '').toUpperCase().trim();

        const estilos: Record<string, { bg: string; text: string; border: string }> = {
            CONVERTIDA: {
                bg: 'bg-green-500 dark:bg-green-600',
                text: 'text-white',
                border: 'border-green-600 dark:border-green-700',
            },
            PENDIENTE: {
                bg: 'bg-yellow-500 dark:bg-yellow-600',
                text: 'text-white',
                border: 'border-yellow-600 dark:border-yellow-700',
            },
            RECHAZADA: {
                bg: 'bg-red-500 dark:bg-red-600',
                text: 'text-white',
                border: 'border-red-600 dark:border-red-700',
            },
            EN_REVISION: {
                bg: 'bg-blue-500 dark:bg-blue-600',
                text: 'text-white',
                border: 'border-blue-600 dark:border-blue-700',
            },
            APROBADA: {
                bg: 'bg-purple-500 dark:bg-purple-600',
                text: 'text-white',
                border: 'border-purple-600 dark:border-purple-700',
            },
            DRAFT: {
                bg: 'bg-gray-500 dark:bg-gray-600',
                text: 'text-white',
                border: 'border-gray-600 dark:border-gray-700',
            },
        };

        return (
            estilos[estadoNormalizado] || {
                bg: 'bg-gray-500 dark:bg-gray-600',
                text: 'text-white',
                border: 'border-gray-600 dark:border-gray-700',
            }
        );
    };

    // Función para manejar el click en headers para ordenar
    const handleSort = (field: SortField) => {
        if (sortField === field && sortDirection === 'asc') {
            setSortDirection('desc');
        } else if (sortField === field && sortDirection === 'desc') {
            setSortField(null);
            setSortDirection(null);
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Aplicar filtros y ordenamiento a las proformas
    const sortedProformas = useMemo(() => {
        // Primero aplicar filtros
        let filtered = proformas.filter((proforma) => {
            // Filtro de fecha de creación
            if (dateFrom && proforma.fecha) {
                const proformaDate = new Date(proforma.fecha);
                const filterDate = new Date(dateFrom);
                if (proformaDate < filterDate) return false;
            }

            if (dateTo && proforma.fecha) {
                const proformaDate = new Date(proforma.fecha);
                const filterDate = new Date(dateTo);
                filterDate.setHours(23, 59, 59, 999); // Incluir todo el día
                if (proformaDate > filterDate) return false;
            }

            // Filtro de monto
            if (amountFrom) {
                const minAmount = parseFloat(amountFrom);
                if (!isNaN(minAmount) && proforma.total < minAmount) return false;
            }

            if (amountTo) {
                const maxAmount = parseFloat(amountTo);
                if (!isNaN(maxAmount) && proforma.total > maxAmount) return false;
            }

            // ✅ REMOVIDO: El backend ya filtra por fecha/hora de entrega solicitada
            // No filtrar nuevamente en el frontend para evitar eliminar resultados correctos

            return true;
        });

        // Luego aplicar ordenamiento
        if (sortField && sortDirection) {
            filtered = filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                switch (sortField) {
                    case 'numero':
                        aValue = a.numero?.toLowerCase() || '';
                        bValue = b.numero?.toLowerCase() || '';
                        break;
                    case 'cliente':
                        aValue = a.cliente_nombre?.toLowerCase() || '';
                        bValue = b.cliente_nombre?.toLowerCase() || '';
                        break;
                    case 'estado':
                        aValue = a.estado?.toLowerCase() || '';
                        bValue = b.estado?.toLowerCase() || '';
                        break;
                    case 'monto':
                        aValue = a.total || 0;
                        bValue = b.total || 0;
                        break;
                    case 'fecha':
                        aValue = new Date(a.fecha).getTime();
                        bValue = new Date(b.fecha).getTime();
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [proformas, sortField, sortDirection, dateFrom, dateTo, amountFrom, amountTo]);

    return (
        <div className="rounded-lg border bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {/* <CardHeader>
                <CardTitle className="dark:text-white">Pedidos</CardTitle>
            </CardHeader> */}
            <div className="space-y-2">
                {/* SECCIÓN 1: Búsqueda y Estado (Siempre Visible) */}
                <div className="space-y-4">
                    {/* Búsqueda */}
                    <div>
                        <div className="mb-2 flex items-center justify-between border-b pb-1 dark:border-slate-700">
                            <label className="block text-sm">Búsqueda</label>
                            {/* ver reservas con /reservas */}
                            <h3 className="rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                Ver reservas por Productos:{' '}
                                <a href="/reservas" className="text-blue-500 hover:underline">
                                    /reservas por productos
                                </a>
                            </h3>
                        </div>
                        <div className="flex items-end gap-2">
                            <Input
                                placeholder="Número de proforma, cliente, CI, teléfono..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSearchProforma(searchInput);
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                onClick={() => setSearchProforma(searchInput)}
                                className="text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                            {searchProforma && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchInput('');
                                        setSearchProforma('');
                                    }}
                                    className="dark:border-slate-600 dark:text-slate-300"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                            {/* ✅ NUEVO: Filtro de Estado - Formato Select */}
                            <div>
                                <p className="text-xs dark:text-gray-300">
                                    Estados
                                    {isLoading && <span className="text-xs text-gray-500">(cargando...)</span>}
                                    {error && <span className="text-xs text-red-500">⚠️ Error: {error.message}</span>}
                                </p>
                                <select
                                    id="estado-select"
                                    value={filtroEstadoProforma || 'PENDIENTE'}
                                    onChange={(e) => setFiltroEstadoProforma(e.target.value)}
                                    disabled={isLoading}
                                    className="rounded-lg border border-slate-300 bg-white p-1 text-xs transition-colors hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-slate-500"
                                >
                                    {estados.map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ✅ MEJORADO: Horas Específicas - Turno Mañana (condicional) */}
                    {(filtroHoraEntregaSolicitadaDesde?.startsWith('08:') ||
                        filtroHoraEntregaSolicitadaDesde?.startsWith('09:') ||
                        filtroHoraEntregaSolicitadaDesde?.startsWith('10:') ||
                        filtroHoraEntregaSolicitadaDesde?.startsWith('11:') ||
                        filtroHoraEntregaSolicitadaDesde === '12:00') && (
                        <div className="rounded-lg border border-blue-300 bg-blue-100 p-3 dark:border-blue-700 dark:bg-blue-900/30">
                            <label className="mb-2 block text-xs font-semibold text-blue-900 dark:text-blue-300">
                                🌅 Turno Mañana - Selecciona hora específica:
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {['08:00', '09:00', '10:00', '11:00', '12:00'].map((hora) => (
                                    <button
                                        key={hora}
                                        onClick={() => {
                                            setFiltroHoraEntregaConfirmadaDesde(hora);
                                            setFiltroHoraEntregaConfirmadaHasta(hora);
                                        }}
                                        className={`rounded px-1 py-2 text-sm font-medium transition-all ${
                                            filtroHoraEntregaSolicitadaDesde === hora
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:bg-slate-700 dark:text-blue-300 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {hora.split(':')[0]}h
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✅ MEJORADO: Horas Específicas - Turno Tarde (condicional) */}
                    {(filtroHoraEntregaSolicitadaDesde?.startsWith('14:') ||
                        filtroHoraEntregaSolicitadaDesde?.startsWith('15:') ||
                        filtroHoraEntregaSolicitadaDesde?.startsWith('16:') ||
                        filtroHoraEntregaSolicitadaDesde?.startsWith('17:') ||
                        filtroHoraEntregaSolicitadaDesde === '18:00') && (
                        <div className="rounded-lg border border-orange-300 bg-orange-100 p-3 dark:border-orange-700 dark:bg-orange-900/30">
                            <label className="mb-2 block text-xs font-semibold text-orange-900 dark:text-orange-300">
                                ☀️ Turno Tarde - Selecciona hora específica:
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {['14:00', '15:00', '16:00', '17:00', '18:00'].map((hora) => (
                                    <button
                                        key={hora}
                                        onClick={() => {
                                            setFiltroHoraEntregaConfirmadaDesde(hora);
                                            setFiltroHoraEntregaConfirmadaHasta(hora);
                                        }}
                                        className={`rounded px-1 py-2 text-sm font-medium transition-all ${
                                            filtroHoraEntregaSolicitadaDesde === hora
                                                ? 'bg-orange-600 text-white shadow-md'
                                                : 'border border-orange-300 bg-white text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:bg-slate-700 dark:text-orange-300 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {hora.split(':')[0]}h
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SECCIÓN 3: Filtros Avanzados (Collapsible) */}
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                    <CollapsibleTrigger asChild>
                        <div className="flex flex-wrap items-end justify-between gap-2 border-b py-2 dark:border-slate-700">
                            {/* SECCIÓN 3: Botón para mostrar todas */}
                            <div>
                                <p className="text-xs dark:text-gray-300">Estado de Proforma</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        onClick={() => {
                                            setFiltroEstadoProforma('TODOS');
                                            setFiltroFechaEntregaSolicitadaDesde('');
                                            setFiltroFechaEntregaSolicitadaHasta('');
                                            setFiltroHoraEntregaSolicitadaDesde('');
                                            setFiltroHoraEntregaSolicitadaHasta('');
                                            setSoloVencidas(false);
                                        }}
                                        className="bg-indigo-600 text-xs text-white transition-all hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                                    >
                                        🔓 Mostrar TODAS
                                    </Button>
                                    {/* Filtro Vencidas */}
                                    <Button
                                        onClick={() => setSoloVencidas(!soloVencidas)}
                                        className={`text-xs transition-all ${
                                            soloVencidas
                                                ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
                                                : 'border border-orange-300 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:border-orange-700 dark:bg-orange-900/40 dark:text-orange-400 dark:hover:bg-orange-900/50'
                                        }`}
                                    >
                                        {/* <AlertCircle className="mr-1 h-4 w-4" /> */}
                                        {soloVencidas ? '✓ Vencidas' : '⚠️ Vencidas'}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium dark:text-gray-300">📆 Fechas de Entrega Solicitada</p>
                                <div className="grid grid-cols-3 gap-2 md:grid-cols-3">
                                    {/* Ayer */}
                                    <Button
                                        onClick={() => {
                                            const d = new Date();
                                            d.setDate(d.getDate() - 1);
                                            const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                            setFiltroFechaEntregaSolicitadaDesde(fechaStr);
                                            setFiltroFechaEntregaSolicitadaHasta(fechaStr);
                                        }}
                                        className={`p-2 text-xs transition-all ${
                                            (() => {
                                                const d = new Date();
                                                d.setDate(d.getDate() - 1);
                                                const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                                return (
                                                    filtroFechaEntregaSolicitadaDesde === yesterday && filtroFechaEntregaSolicitadaHasta === yesterday
                                                );
                                            })()
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                                                : 'border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-900/50'
                                        }`}
                                    >
                                        <span>
                                            Ayer /{' '}
                                            {(() => {
                                                const d = new Date();
                                                d.setDate(d.getDate() - 1);
                                                return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                                            })()}
                                        </span>
                                        {/* <span className="text-xs opacity-80">
                                    
                                </span> */}
                                    </Button>

                                    {/* Hoy */}
                                    <Button
                                        onClick={() => {
                                            const d = new Date();
                                            const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                            setFiltroFechaEntregaSolicitadaDesde(today);
                                            setFiltroFechaEntregaSolicitadaHasta(today);
                                        }}
                                        className={`text-xs transition-all ${
                                            (() => {
                                                const d = new Date();
                                                const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                                return filtroFechaEntregaSolicitadaDesde === today && filtroFechaEntregaSolicitadaHasta === today;
                                            })()
                                                ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                                                : 'border border-green-300 bg-green-100 text-green-700 hover:bg-green-200 dark:border-green-700 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/50'
                                        }`}
                                    >
                                        <span>
                                            Hoy /{' '}
                                            {(() => {
                                                const d = new Date();
                                                return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                                            })()}
                                        </span>
                                    </Button>

                                    {/* Mañana */}
                                    <Button
                                        onClick={() => {
                                            const d = new Date();
                                            d.setDate(d.getDate() + 1);
                                            const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                            setFiltroFechaEntregaSolicitadaDesde(fechaStr);
                                            setFiltroFechaEntregaSolicitadaHasta(fechaStr);
                                        }}
                                        className={`text-xs transition-all ${
                                            (() => {
                                                const d = new Date();
                                                d.setDate(d.getDate() + 1);
                                                const tomorrow = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                                return (
                                                    filtroFechaEntregaSolicitadaDesde === tomorrow && filtroFechaEntregaSolicitadaHasta === tomorrow
                                                );
                                            })()
                                                ? 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800'
                                                : 'border border-purple-300 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-400 dark:hover:bg-purple-900/50'
                                        }`}
                                    >
                                        <span>
                                            Mañana /{' '}
                                            {(() => {
                                                const d = new Date();
                                                d.setDate(d.getDate() + 1);
                                                return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                                            })()}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            {/* SECCIÓN 2: Filtros por Turno Horario */}
                            <div>
                                <p className="text-sm font-medium dark:text-gray-300">🕐 Turnos de Entrega</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Turno Mañana */}
                                    <Button
                                        onClick={() => {
                                            const isChecked =
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('08:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('09:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('10:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('11:') ||
                                                filtroHoraEntregaSolicitadaDesde === '12:00';
                                            if (isChecked) {
                                                setFiltroHoraEntregaSolicitadaDesde('');
                                                setFiltroHoraEntregaSolicitadaHasta('');
                                            } else {
                                                setFiltroHoraEntregaSolicitadaDesde('08:00');
                                                setFiltroHoraEntregaSolicitadaHasta('12:00');
                                            }
                                        }}
                                        className={`text-xs transition-all ${(() => {
                                            const isChecked =
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('08:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('09:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('10:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('11:') ||
                                                filtroHoraEntregaSolicitadaDesde === '12:00';
                                            return isChecked
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                                                : 'border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-900/50';
                                        })()}`}
                                    >
                                        🌅 Mañana (08-12)
                                    </Button>

                                    {/* Turno Tarde */}
                                    <Button
                                        onClick={() => {
                                            const isChecked =
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('14:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('15:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('16:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('17:') ||
                                                filtroHoraEntregaSolicitadaDesde === '18:00';
                                            if (isChecked) {
                                                setFiltroHoraEntregaSolicitadaDesde('');
                                                setFiltroHoraEntregaSolicitadaHasta('');
                                            } else {
                                                setFiltroHoraEntregaSolicitadaDesde('14:00');
                                                setFiltroHoraEntregaSolicitadaHasta('18:00');
                                            }
                                        }}
                                        className={`text-xs transition-all ${(() => {
                                            const isChecked =
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('14:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('15:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('16:') ||
                                                filtroHoraEntregaSolicitadaDesde?.startsWith('17:') ||
                                                filtroHoraEntregaSolicitadaDesde === '18:00';
                                            return isChecked
                                                ? 'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800'
                                                : 'border border-orange-300 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:border-orange-700 dark:bg-orange-900/40 dark:text-orange-400 dark:hover:bg-orange-900/50';
                                        })()}`}
                                    >
                                        ☀️ Tarde (14-18)
                                    </Button>
                                </div>
                            </div>
                            <Button variant="outline" className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                                <span className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                </span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-4 space-y-4">
                        {/* Grid de 3 columnas */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Localidad */}
                            <div>
                                <label className="mb-2 block text-sm font-medium dark:text-gray-300">📍Localidad</label>
                                <select
                                    value={filtroLocalidad}
                                    onChange={(e) => setFiltroLocalidad(e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Todas</option>
                                    {localidades.map((localidad) => (
                                        <option key={localidad.id} value={localidad.id.toString()}>
                                            {localidad.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tipo de Entrega */}
                            <div>
                                <label className="mb-2 block text-sm font-medium dark:text-gray-300">🚚Tipo Entrega</label>
                                <select
                                    value={filtroTipoEntrega}
                                    onChange={(e) => setFiltroTipoEntrega(e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    <option value="DELIVERY">🚚 Delivery</option>
                                    <option value="PICKUP">🏪 Pickup</option>
                                </select>
                            </div>

                            {/* Política de Pago */}
                            <div>
                                <label className="mb-2 block text-sm font-medium dark:text-gray-300">💸Política Pago</label>
                                <select
                                    value={filtroPoliticaPago}
                                    onChange={(e) => setFiltroPoliticaPago(e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    <option value="CONTRA_ENTREGA">Contra Entrega</option>
                                    <option value="ANTICIPADO_100">Anticipado 100%</option>
                                    <option value="MEDIO_MEDIO">Medio/Medio</option>
                                    <option value="CREDITO">Crédito</option>
                                </select>
                            </div>
                        </div>

                        {/* Separador */}
                        {/* <div className="border-t pt-4 dark:border-slate-700" /> */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* ✅ Rango de Fecha Entrega Solicitada */}
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">📦 Fecha Entrega Solicitada</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-medium dark:text-gray-400">Desde</label>
                                        <Input
                                            type="date"
                                            value={filtroFechaEntregaSolicitadaDesde}
                                            onChange={(e) => setFiltroFechaEntregaSolicitadaDesde(e.target.value)}
                                            className="text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-medium dark:text-gray-400">Hasta</label>
                                        <Input
                                            type="date"
                                            value={filtroFechaEntregaSolicitadaHasta}
                                            onChange={(e) => setFiltroFechaEntregaSolicitadaHasta(e.target.value)}
                                            className="text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Rango de Fecha de Creación */}
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">📅 Fecha de Creación</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-medium dark:text-gray-400">Desde</label>
                                        <Input
                                            type="date"
                                            value={filtroFechaCreacionDesde}
                                            onChange={(e) => setFiltroFechaCreacionDesde(e.target.value)}
                                            className="text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-medium dark:text-gray-400">Hasta</label>
                                        <Input
                                            type="date"
                                            value={filtroFechaCreacionHasta}
                                            onChange={(e) => setFiltroFechaCreacionHasta(e.target.value)}
                                            className="text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ✅ Rango de Fecha de Vencimiento */}
                            <div>
                                <label className="block text-sm font-medium dark:text-gray-300">⏰ Fecha de Vencimiento</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-medium dark:text-gray-400">Desde</label>
                                        <Input
                                            type="date"
                                            value={filtroFechaVencimientoDesde}
                                            onChange={(e) => setFiltroFechaVencimientoDesde(e.target.value)}
                                            className="text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-medium dark:text-gray-400">Hasta</label>
                                        <Input
                                            type="date"
                                            value={filtroFechaVencimientoHasta}
                                            onChange={(e) => setFiltroFechaVencimientoHasta(e.target.value)}
                                            className="text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div className="flex flex-wrap items-end justify-between gap-2">
                    {/* SECCIÓN 2: Filtros Activos (Chips) */}
                    {activeFiltersCount > 0 && (
                        <div className="space-y-2 dark:border-slate-700">
                            <p className="text-sm font-medium dark:text-gray-300">Filtros Activos ({activeFiltersCount})</p>
                            <div className="flex flex-wrap gap-2">
                                {filtroLocalidad && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        Localidad: {localidades.find((l) => l.id.toString() === filtroLocalidad)?.nombre}
                                        <button onClick={() => setFiltroLocalidad('')} className="rounded-full p-0.5 hover:bg-slate-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filtroTipoEntrega && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        {filtroTipoEntrega === 'DELIVERY' ? '🚚 Delivery' : '🏪 Pickup'}
                                        <button onClick={() => setFiltroTipoEntrega('')} className="rounded-full p-0.5 hover:bg-slate-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filtroPoliticaPago && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        💳 {filtroPoliticaPago.replace(/_/g, ' ')}
                                        <button onClick={() => setFiltroPoliticaPago('')} className="rounded-full p-0.5 hover:bg-slate-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filtroEstadoLogistica && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        Logístico: {estadosLogistica.find((e) => e.id.toString() === filtroEstadoLogistica)?.nombre}
                                        <button onClick={() => setFiltroEstadoLogistica('')} className="rounded-full p-0.5 hover:bg-slate-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filtroCoordinacionCompletada && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        {filtroCoordinacionCompletada === 'true' ? '✓ Completada' : '⏳ Pendiente'}
                                        <button onClick={() => setFiltroCoordinacionCompletada('')} className="rounded-full p-0.5 hover:bg-slate-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filtroUsuarioAprobador && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        👤 {usuariosAprobadores.find((u) => u.id.toString() === filtroUsuarioAprobador)?.name}
                                        <button onClick={() => setFiltroUsuarioAprobador('')} className="rounded-full p-0.5 hover:bg-slate-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {soloVencidas && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        ⚠️ Solo Vencidas
                                        <button onClick={() => setSoloVencidas(false)} className="rounded-full p-0.5 hover:bg-slate-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {(dateFrom || dateTo) && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        📅 {dateFrom}-{dateTo}
                                        <button
                                            onClick={() => {
                                                setDateFrom('');
                                                setDateTo('');
                                            }}
                                            className="rounded-full p-0.5 hover:bg-slate-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {(amountFrom || amountTo) && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        💵 {amountFrom || '0'}-{amountTo || '∞'}
                                        <button
                                            onClick={() => {
                                                setAmountFrom('');
                                                setAmountTo('');
                                            }}
                                            className="rounded-full p-0.5 hover:bg-slate-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {/* ✅ Badges de filtros de fechas y horas */}
                                {(filtroFechaVencimientoDesde || filtroFechaVencimientoHasta) && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        ⏰ Vencimiento: {filtroFechaVencimientoDesde}-{filtroFechaVencimientoHasta}
                                        <button
                                            onClick={() => {
                                                setFiltroFechaVencimientoDesde('');
                                                setFiltroFechaVencimientoHasta('');
                                            }}
                                            className="rounded-full p-0.5 hover:bg-slate-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {(filtroFechaCreacionDesde || filtroFechaCreacionHasta) && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        📅 Creación: {filtroFechaCreacionDesde}-{filtroFechaCreacionHasta}
                                        <button
                                            onClick={() => {
                                                setFiltroFechaCreacionDesde('');
                                                setFiltroFechaCreacionHasta('');
                                            }}
                                            className="rounded-full p-0.5 hover:bg-slate-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {(filtroFechaEntregaSolicitadaDesde || filtroFechaEntregaSolicitadaHasta) && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        📦 Entrega: {filtroFechaEntregaSolicitadaDesde}-{filtroFechaEntregaSolicitadaHasta}
                                        <button
                                            onClick={() => {
                                                setFiltroFechaEntregaSolicitadaDesde('');
                                                setFiltroFechaEntregaSolicitadaHasta('');
                                            }}
                                            className="rounded-full p-0.5 hover:bg-slate-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {(filtroHoraEntregaSolicitadaDesde || filtroHoraEntregaSolicitadaHasta) && (
                                    <Badge variant="secondary" className="flex items-center gap-2 pr-1 pl-3 dark:bg-slate-700 dark:text-gray-300">
                                        🕐 Hora: {filtroHoraEntregaSolicitadaDesde}-{filtroHoraEntregaSolicitadaHasta}
                                        <button
                                            onClick={() => {
                                                setFiltroHoraEntregaSolicitadaDesde('');
                                                setFiltroHoraEntregaSolicitadaHasta('');
                                            }}
                                            className="rounded-full p-0.5 hover:bg-slate-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setFiltroLocalidad('');
                                        setFiltroTipoEntrega('');
                                        setFiltroPoliticaPago('');
                                        setFiltroEstadoLogistica('');
                                        setFiltroCoordinacionCompletada('');
                                        setFiltroUsuarioAprobador('');
                                        setSoloVencidas(false);
                                        setDateFrom('');
                                        setDateTo('');
                                        setAmountFrom('');
                                        setAmountTo('');
                                        // ✅ Limpiar nuevos filtros de fechas y horas
                                        setFiltroFechaVencimientoDesde('');
                                        setFiltroFechaVencimientoHasta('');
                                        setFiltroFechaEntregaSolicitadaDesde('');
                                        setFiltroFechaEntregaSolicitadaHasta('');
                                        setFiltroHoraEntregaSolicitadaDesde('');
                                        setFiltroHoraEntregaSolicitadaHasta('');
                                    }}
                                    className="text-red-600 dark:border-slate-600 dark:text-red-400 dark:text-slate-300"
                                >
                                    Limpiar Todos
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Información de paginación */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {paginationInfo.from}-{paginationInfo.to} de {paginationInfo.total}
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr className="border-b dark:border-slate-700">
                                <th
                                    className="cursor-pointer px-2 py-2 text-left font-medium select-none hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('numero')}
                                >
                                    <div className="flex items-center gap-2">
                                        Folio
                                        {sortField === 'numero' &&
                                            (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </th>
                                <th className="px-2 py-2 text-center font-medium dark:text-gray-300">Estado</th>
                                <th className="px-2 py-2 text-center font-medium dark:text-gray-300">Cliente</th>
                                <th className="px-2 py-2 text-center font-medium dark:text-gray-300">Creador</th>
                                <th className="px-2 py-2 text-center font-medium dark:text-gray-300">Localidad </th>
                                <th
                                    className="cursor-pointer px-4 py-2 text-center font-medium select-none hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700"
                                    onClick={() => handleSort('monto')}
                                >
                                    <div className="flex items-center gap-2">
                                        Monto
                                        {sortField === 'monto' &&
                                            (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                                    </div>
                                </th>

                                {/* ✅ NUEVO: Columna Fecha Entrega Solicitada */}
                                <th className="border-l border-emerald-200 bg-emerald-50/80 px-2 py-2 text-center font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                                    Creada
                                </th>
                                <th className="border-l border-sky-200 bg-sky-50/80 px-2 py-2 text-center font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-300">
                                    Solicitado Para
                                </th>
                                <th className="border-l border-rose-200 bg-rose-50/80 px-2 py-2 text-center text-xs font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">
                                    Vencimiento
                                </th>
                                <th className="px-2 py-2 text-center font-medium dark:text-gray-300">-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProformas.map((proforma) => (
                                <tr
                                    key={proforma.id}
                                    className={`border-t transition-colors duration-200 dark:border-slate-700 ${getRowBackgroundByEstado(proforma.estado)}`}
                                >
                                    <td className="px-2 py-2 text-center">
                                        <Link
                                            href={`/proformas/${proforma.id}`}
                                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            #{proforma.id}
                                        </Link>
                                    </td>
                                    {/* ✅ PRIMERA COLUMNA: ESTADO DESTACADO CON COLOR DEL BACKEND */}
                                    <td className="px-2 py-2 text-center text-xs">
                                        {(() => {
                                            const estadoStyle = getEstadoBadgeStyle(proforma.estado);
                                            return (
                                                <div
                                                    className={`inline-flex transform items-center rounded-lg border-2 px-2 py-1 text-xs transition-all hover:scale-105 hover:shadow-xl ${estadoStyle.bg} ${estadoStyle.text} ${estadoStyle.border}`}
                                                >
                                                    <span className="text-xs">{String(proforma.estado_logistica?.icono || '📋')}</span>
                                                    <p>{String(proforma.estado_logistica?.codigo)}</p>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-2 py-2 text-xs">{String(proforma.cliente_nombre)}</td>
                                    <td className="p-1 text-center text-xs">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                                proforma.usuario_creador_es_preventista
                                                    ? 'border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                    : 'bg-transparent dark:bg-slate-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {String(proforma.usuario_creador_nombre)}
                                        </Badge>
                                    </td>
                                    <td className="p-1 text-center text-xs">📍{String(proforma.localidad_nombre)}</td>
                                    <td className="px-2 py-2 text-left text-xs">
                                        Bs {proforma.total.toLocaleString('es-BO', { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="border-l border-emerald-200 bg-emerald-50/30 px-2 py-2 text-center text-xs text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/10 dark:text-emerald-300">
                                        <div className="whitespace-nowrap">
                                            {proforma.created_at ? (
                                                <>
                                                    <div>
                                                        {new Date(proforma.created_at).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-xs">
                                                        {new Date(proforma.created_at).toLocaleTimeString('es-ES', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* ✅ NUEVO: Columna Fecha & Hora Entrega Solicitada */}
                                    <td className="border-l border-sky-200 bg-sky-50/30 px-2 py-2 text-center text-xs text-sky-700 dark:border-sky-800 dark:bg-sky-900/10 dark:text-sky-300">
                                        <div className="whitespace-nowrap">
                                            {proforma.fecha_entrega_solicitada ? (
                                                <>
                                                    <div>
                                                        {new Date(proforma.fecha_entrega_solicitada).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    {proforma.hora_entrega_solicitada && (
                                                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                            🕐 {String(proforma.hora_entrega_solicitada).substring(0, 5)}
                                                            {/* {proforma.hora_entrega_solicitada_fin && (
                                                                <span> - {String(proforma.hora_entrega_solicitada_fin).substring(0, 5)}</span>
                                                            )} */}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* ✅ NUEVO: Columna Fecha Vencimiento */}
                                    <td className="border-l border-rose-200 bg-rose-50/30 px-2 py-2 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-900/10 dark:text-rose-300">
                                        <div className="whitespace-nowrap">
                                            {proforma.fecha_vencimiento ? (
                                                <>
                                                    <div>
                                                        {new Date(proforma.fecha_vencimiento).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    {estaVencida(proforma) && (
                                                        <div className="text-xs font-semibold text-red-600 dark:text-red-400">VENCIDA</div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* <td className="px-2 py-2 text-xs text-muted-foreground dark:text-gray-400">
                                        <div className="whitespace-nowrap">
                                            {proforma.updated_at ? (
                                                <>
                                                    <div>
                                                        {new Date(proforma.updated_at).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-xs">
                                                        {new Date(proforma.updated_at).toLocaleTimeString('es-ES', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </div>
                                    </td> */}
                                    <td className="px-2 py-2">
                                        <div className="flex items-center gap-2">
                                            {/* ✅ Botón Ver (fuera del dropdown) */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onVerProforma(proforma)}
                                                className="dark:hover:bg-slate-700"
                                                title="Ver proforma"
                                            >
                                                <Eye className="h-4 w-4 dark:text-gray-400" />
                                            </Button>

                                            {/* ✅ NUEVO: Dropdown Menu para otras acciones */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="dark:hover:bg-slate-700">
                                                        <MoreVertical className="h-4 w-4 dark:text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="dark:border-slate-700 dark:bg-slate-800">
                                                    {/* Imprimir */}
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedProformaForPrint(proforma);
                                                            setShowPrintModal(true);
                                                        }}
                                                        className="cursor-pointer dark:hover:bg-slate-700"
                                                    >
                                                        <Printer className="mr-2 h-4 w-4" />
                                                        <span>Imprimir</span>
                                                    </DropdownMenuItem>

                                                    {/* Editar - condicional */}
                                                    {['BORRADOR', 'PENDIENTE'].includes(proforma.estado) && (
                                                        <DropdownMenuItem
                                                            onClick={() => onEditarProforma?.(proforma)}
                                                            className="cursor-pointer text-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>
                                                    )}

                                                    {/* Rechazar - condicional */}
                                                    {['PENDIENTE', 'APROBADA', 'VENCIDA'].includes(proforma.estado) && (
                                                        <DropdownMenuItem
                                                            onClick={() => onRechazarProforma?.(proforma)}
                                                            className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            <span>Rechazar</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cambiarPagina(paginationInfo.current_page - 1)}
                        disabled={paginationInfo.current_page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        Página {paginationInfo.current_page} de {paginationInfo.last_page}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cambiarPagina(paginationInfo.current_page + 1)}
                        disabled={paginationInfo.current_page === paginationInfo.last_page}
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

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
        </div>
    );
}

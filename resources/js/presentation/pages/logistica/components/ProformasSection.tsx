import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/presentation/components/ui/collapsible';
import { Eye, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Clock, CheckCircle, XCircle, FileCheck, AlertCircle, Filter, Search, X, ChevronDown, Printer, Pencil } from 'lucide-react';
import type { ProformaAppExterna } from '@/domain/entities/logistica';
import { useEstadosProformas } from '@/application/hooks';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

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
        const estadosCodigos = estadosAPI.map(e => e.codigo);
        const resultado = ['TODOS' as const, ...estadosCodigos];

        // 🔍 DEBUG: Log en consola web
        console.log('📊 [ProformasSection] Estados cargados:', {
            estadosAPI: estadosAPI,
            estadosCodigos: estadosCodigos,
            resultado: resultado,
            isLoading: isLoading,
            error: error
        });

        return resultado;
    }, [estadosAPI]);

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
        if (filtroFechaEntregaSolicitadaDesde || filtroFechaEntregaSolicitadaHasta) count++;
        if (filtroHoraEntregaSolicitadaDesde || filtroHoraEntregaSolicitadaHasta) count++;
        return count;
    };

    const activeFiltersCount = countActiveFilters();

    // ✅ NUEVO: Función para obtener color de fondo de fila según estado
    const getRowBackgroundByEstado = (estado: string): string => {
        const estadoNormalizado = (estado || '').toUpperCase().trim();

        const colores: Record<string, string> = {
            'CONVERTIDA': 'bg-green-50 dark:bg-green-950/20 border-l-4 border-l-green-500 hover:bg-green-100 dark:hover:bg-green-950/30',
            'PENDIENTE': 'bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-l-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-950/30',
            'RECHAZADA': 'bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500 hover:bg-red-100 dark:hover:bg-red-950/30',
            'EN_REVISION': 'bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500 hover:bg-blue-100 dark:hover:bg-blue-950/30',
            'APROBADA': 'bg-purple-50 dark:bg-purple-950/20 border-l-4 border-l-purple-500 hover:bg-purple-100 dark:hover:bg-purple-950/30',
            'DRAFT': 'bg-gray-50 dark:bg-gray-950/20 border-l-4 border-l-gray-500 hover:bg-gray-100 dark:hover:bg-gray-950/30',
        };

        return colores[estadoNormalizado] || 'bg-white dark:bg-gray-900 border-l-4 border-l-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800';
    };

    // ✅ NUEVO: Función para obtener estilos del badge de estado con colores específicos
    const getEstadoBadgeStyle = (estado: string) => {
        const estadoNormalizado = (estado || '').toUpperCase().trim();

        const estilos: Record<string, { bg: string; text: string; border: string }> = {
            'CONVERTIDA': {
                bg: 'bg-green-500 dark:bg-green-600',
                text: 'text-white',
                border: 'border-green-600 dark:border-green-700'
            },
            'PENDIENTE': {
                bg: 'bg-yellow-500 dark:bg-yellow-600',
                text: 'text-white',
                border: 'border-yellow-600 dark:border-yellow-700'
            },
            'RECHAZADA': {
                bg: 'bg-red-500 dark:bg-red-600',
                text: 'text-white',
                border: 'border-red-600 dark:border-red-700'
            },
            'EN_REVISION': {
                bg: 'bg-blue-500 dark:bg-blue-600',
                text: 'text-white',
                border: 'border-blue-600 dark:border-blue-700'
            },
            'APROBADA': {
                bg: 'bg-purple-500 dark:bg-purple-600',
                text: 'text-white',
                border: 'border-purple-600 dark:border-purple-700'
            },
            'DRAFT': {
                bg: 'bg-gray-500 dark:bg-gray-600',
                text: 'text-white',
                border: 'border-gray-600 dark:border-gray-700'
            },
        };

        return estilos[estadoNormalizado] || {
            bg: 'bg-gray-500 dark:bg-gray-600',
            text: 'text-white',
            border: 'border-gray-600 dark:border-gray-700'
        };
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

    // Función para obtener estilos de los botones de filtro
    const getFilterButtonStyles = (estado: string, isActive: boolean) => {
        const baseStyles = 'font-medium transition-all duration-200 flex items-center gap-2';

        if (estado === 'TODOS') {
            return isActive
                ? `${baseStyles} bg-slate-900 dark:bg-slate-700 text-white border border-slate-700 dark:border-slate-500`
                : `${baseStyles} bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700`;
        }

        const stateStyles = {
            'BORRADOR': {
                active: 'bg-gray-500 dark:bg-gray-600 text-white border border-gray-600 dark:border-gray-700 shadow-md',
                inactive: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900/50'
            },
            'PENDIENTE': {
                active: 'bg-yellow-500 dark:bg-yellow-600 text-white border border-yellow-600 dark:border-yellow-700 shadow-md',
                inactive: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
            },
            'APROBADA': {
                active: 'bg-green-500 dark:bg-green-600 text-white border border-green-600 dark:border-green-700 shadow-md',
                inactive: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
            },
            'RECHAZADA': {
                active: 'bg-red-500 dark:bg-red-600 text-white border border-red-600 dark:border-red-700 shadow-md',
                inactive: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50'
            },
            'CONVERTIDA': {
                active: 'bg-blue-500 dark:bg-blue-600 text-white border border-blue-600 dark:border-blue-700 shadow-md',
                inactive: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50'
            },
            'VENCIDA': {
                active: 'bg-gray-500 dark:bg-gray-600 text-white border border-gray-600 dark:border-gray-700 shadow-md',
                inactive: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
        };

        const style = stateStyles[estado as keyof typeof stateStyles];
        return style ? `${baseStyles} ${isActive ? style.active : style.inactive}` : baseStyles;
    };

    // Función para obtener ícono del filtro según estado
    const getFilterIcon = (estado: string) => {
        switch (estado) {
            case 'BORRADOR':
                return <Pencil className="w-4 h-4" />;
            case 'PENDIENTE':
                return <Clock className="w-4 h-4" />;
            case 'APROBADA':
                return <CheckCircle className="w-4 h-4" />;
            case 'RECHAZADA':
                return <XCircle className="w-4 h-4" />;
            case 'CONVERTIDA':
                return <FileCheck className="w-4 h-4" />;
            case 'VENCIDA':
                return <AlertCircle className="w-4 h-4" />;
            case 'TODOS':
                return <Filter className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <Card className="dark:bg-slate-900 dark:border-slate-700">
            <CardHeader>
                <CardTitle className="dark:text-white">Proformas App Externa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* SECCIÓN 1: Búsqueda y Estado (Siempre Visible) */}
                <div className="space-y-4 pb-4 border-b dark:border-slate-700">
                    {/* Búsqueda */}
                    <div>
                        <label className="text-sm font-medium mb-2 block dark:text-gray-300">Búsqueda</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Número de proforma, cliente, CI, teléfono..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-gray-400"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setSearchProforma(searchInput);
                                    }
                                }}
                            />
                            <Button
                                size="sm"
                                onClick={() => setSearchProforma(searchInput)}
                                className="dark:bg-blue-600 dark:hover:bg-blue-700"
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
                        </div>
                    </div>

                    {/* Filtro de Estado */}
                    <div>
                        <label className="text-sm font-medium mb-2 block dark:text-gray-300">
                            Estado de Proforma ({estados.length} opciones)
                            {isLoading && <span className="text-xs text-gray-500 ml-2">(cargando...)</span>}
                            {error && <span className="text-xs text-red-500 ml-2">⚠️ Error: {error.message}</span>}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {estados.map((estado) => (
                                <button
                                    key={estado}
                                    onClick={() => setFiltroEstadoProforma(estado)}
                                    className={`px-4 py-2 rounded-lg text-sm ${getFilterButtonStyles(estado, filtroEstadoProforma === estado)}`}
                                >
                                    {getFilterIcon(estado)}
                                    {estado}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ✅ NUEVO: Filtrado rápido por fecha + Mostrar solo vencidas en una fila */}
                    <div>
                        <label className="text-sm font-medium mb-2 block dark:text-gray-300">
                            Fechas de Entrega Solicitada
                        </label>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                            {/* Botón para filtrar solo vencidas */}
                            <Button
                                onClick={() => setSoloVencidas(!soloVencidas)}
                                className={`transition-all text-sm ${soloVencidas
                                    ? 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800'
                                    : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                                    }`}
                            >
                                <AlertCircle className="h-4 w-4 mr-1" />
                                {soloVencidas ? '✓ Vencidas' : '⚠️ Vencidas'}
                            </Button>

                            {/* Ayer */}
                            <Button
                                onClick={() => {
                                    // ✅ CORREGIDO: Usar fecha local, no UTC
                                    const d = new Date();
                                    d.setDate(d.getDate() - 1);
                                    const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                    setFiltroFechaEntregaSolicitadaDesde(fechaStr);
                                    setFiltroFechaEntregaSolicitadaHasta(fechaStr);
                                }}
                                className={`transition-all text-sm ${(() => {
                                    // ✅ CORREGIDO: Comparar fechas sin problemas de zona horaria
                                    const d = new Date();
                                    d.setDate(d.getDate() - 1);
                                    const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                    return filtroFechaEntregaSolicitadaDesde === yesterday && filtroFechaEntregaSolicitadaHasta === yesterday;
                                })()
                                    ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
                                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                    }`}
                            >
                                📅 Ayer
                            </Button>

                            {/* Hoy */}
                            <Button
                                onClick={() => {
                                    // ✅ CORREGIDO: Usar fecha local, no UTC
                                    const d = new Date();
                                    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                    setFiltroFechaEntregaSolicitadaDesde(today);
                                    setFiltroFechaEntregaSolicitadaHasta(today);
                                }}
                                className={`transition-all text-sm ${(() => {
                                    // ✅ CORREGIDO: Comparar fechas sin problemas de zona horaria
                                    const d = new Date();
                                    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                    return filtroFechaEntregaSolicitadaDesde === today && filtroFechaEntregaSolicitadaHasta === today;
                                })()
                                    ? 'bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800'
                                    : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
                                    }`}
                            >
                                📆 Hoy
                            </Button>

                            {/* Mañana */}
                            <Button
                                onClick={() => {
                                    // ✅ CORREGIDO: Usar fecha local, no UTC
                                    const d = new Date();
                                    d.setDate(d.getDate() + 1);
                                    const fechaStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                    setFiltroFechaEntregaSolicitadaDesde(fechaStr);
                                    setFiltroFechaEntregaSolicitadaHasta(fechaStr);
                                }}
                                className={`transition-all text-sm ${(() => {
                                    // ✅ CORREGIDO: Comparar fechas sin problemas de zona horaria
                                    const d = new Date();
                                    d.setDate(d.getDate() + 1);
                                    const tomorrow = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                    return filtroFechaEntregaSolicitadaDesde === tomorrow && filtroFechaEntregaSolicitadaHasta === tomorrow;
                                })()
                                    ? 'bg-purple-600 dark:bg-purple-700 text-white hover:bg-purple-700 dark:hover:bg-purple-800'
                                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                                    }`}
                            >
                                📆 Mañana
                            </Button>
                            {/* ✅ NUEVO: Botón Destacado "Mostrar TODAS las Proformas" */}
                            <Button
                                onClick={() => {
                                    setFiltroEstadoProforma('TODOS');
                                    // Limpiar filtros de fecha para ver absolutamente todo
                                    setFiltroFechaEntregaSolicitadaDesde('');
                                    setFiltroFechaEntregaSolicitadaHasta('');
                                }}
                                className="bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 font-semibold text-sm transition-all"
                            >
                                🔓 Mostrar TODAS
                            </Button>

                            {/* ✅ Turno Mañana Button */}
                            <Button
                                onClick={() => {
                                    const isChecked = filtroHoraEntregaSolicitadaDesde?.startsWith('08:') ||
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
                                className={`transition-all text-sm ${(() => {
                                    const isChecked = filtroHoraEntregaSolicitadaDesde?.startsWith('08:') ||
                                                    filtroHoraEntregaSolicitadaDesde?.startsWith('09:') ||
                                                    filtroHoraEntregaSolicitadaDesde?.startsWith('10:') ||
                                                    filtroHoraEntregaSolicitadaDesde?.startsWith('11:') ||
                                                    filtroHoraEntregaSolicitadaDesde === '12:00';
                                    return isChecked
                                        ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
                                        : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50';
                                })()}`}
                            >
                                🌅 Mañana
                            </Button>

                            {/* ✅ Turno Tarde Button */}
                            <Button
                                onClick={() => {
                                    const isChecked = filtroHoraEntregaSolicitadaDesde?.startsWith('14:') ||
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
                                className={`transition-all text-sm ${(() => {
                                    const isChecked = filtroHoraEntregaSolicitadaDesde?.startsWith('14:') ||
                                                    filtroHoraEntregaSolicitadaDesde?.startsWith('15:') ||
                                                    filtroHoraEntregaSolicitadaDesde?.startsWith('16:') ||
                                                    filtroHoraEntregaSolicitadaDesde?.startsWith('17:') ||
                                                    filtroHoraEntregaSolicitadaDesde === '18:00';
                                    return isChecked
                                        ? 'bg-orange-600 dark:bg-orange-700 text-white hover:bg-orange-700 dark:hover:bg-orange-800'
                                        : 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-900/50';
                                })()}`}
                            >
                                ☀️ Tarde
                            </Button>
                        </div>
                    </div>

                    {/* ✅ Horas Específicas - Turno Mañana (condicional) */}
                    {(filtroHoraEntregaSolicitadaDesde?.startsWith('08:') || filtroHoraEntregaSolicitadaDesde?.startsWith('09:') || filtroHoraEntregaSolicitadaDesde?.startsWith('10:') || filtroHoraEntregaSolicitadaDesde?.startsWith('11:') || filtroHoraEntregaSolicitadaDesde === '12:00') && (
                        <div className="mt-3 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
                            <label className="text-xs font-medium block mb-2 text-blue-900 dark:text-blue-300">Turno Mañana - Selecciona hora específica:</label>
                            <div className="grid grid-cols-5 gap-2">
                                {['08:00', '09:00', '10:00', '11:00', '12:00'].map((hora) => (
                                    <button
                                        key={hora}
                                        onClick={() => {
                                            setFiltroHoraEntregaSolicitadaDesde(hora);
                                            setFiltroHoraEntregaSolicitadaHasta(hora);
                                        }}
                                        className={`py-2 px-1 rounded text-sm font-medium transition-all ${filtroHoraEntregaSolicitadaDesde === hora
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {hora.split(':')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✅ Horas Específicas - Turno Tarde (condicional) */}
                    {(filtroHoraEntregaSolicitadaDesde?.startsWith('14:') || filtroHoraEntregaSolicitadaDesde?.startsWith('15:') || filtroHoraEntregaSolicitadaDesde?.startsWith('16:') || filtroHoraEntregaSolicitadaDesde?.startsWith('17:') || filtroHoraEntregaSolicitadaDesde === '18:00') && (
                        <div className="mt-3 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700">
                            <label className="text-xs font-medium block mb-2 text-orange-900 dark:text-orange-300">Turno Tarde - Selecciona hora específica:</label>
                            <div className="grid grid-cols-5 gap-2">
                                {['14:00', '15:00', '16:00', '17:00', '18:00'].map((hora) => (
                                    <button
                                        key={hora}
                                        onClick={() => {
                                            setFiltroHoraEntregaSolicitadaDesde(hora);
                                            setFiltroHoraEntregaSolicitadaHasta(hora);
                                        }}
                                        className={`py-2 px-1 rounded text-sm font-medium transition-all ${filtroHoraEntregaSolicitadaDesde === hora
                                            ? 'bg-orange-600 text-white shadow-md'
                                            : 'bg-white dark:bg-slate-700 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {hora.split(':')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mostrar rango seleccionado */}
                    {(filtroHoraEntregaSolicitadaDesde || filtroHoraEntregaSolicitadaHasta) && (
                        <div className="mt-2 p-2 text-sm rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300">
                            ✓ Turno activo: {filtroHoraEntregaSolicitadaDesde}
                        </div>
                    )}
                </div>

                {/* SECCIÓN 2: Filtros Activos (Chips) */}
                {activeFiltersCount > 0 && (
                    <div className="space-y-2 pb-4 border-b dark:border-slate-700">
                        <p className="text-sm font-medium dark:text-gray-300">
                            Filtros Activos ({activeFiltersCount})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {filtroLocalidad && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    Localidad: {localidades.find(l => l.id.toString() === filtroLocalidad)?.nombre}
                                    <button
                                        onClick={() => setFiltroLocalidad('')}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {filtroTipoEntrega && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    {filtroTipoEntrega === 'DELIVERY' ? '🚚 Delivery' : '🏪 Pickup'}
                                    <button
                                        onClick={() => setFiltroTipoEntrega('')}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {filtroPoliticaPago && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    💳 {filtroPoliticaPago.replace(/_/g, ' ')}
                                    <button
                                        onClick={() => setFiltroPoliticaPago('')}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {filtroEstadoLogistica && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    Logístico: {estadosLogistica.find(e => e.id.toString() === filtroEstadoLogistica)?.nombre}
                                    <button
                                        onClick={() => setFiltroEstadoLogistica('')}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {filtroCoordinacionCompletada && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    {filtroCoordinacionCompletada === 'true' ? '✓ Completada' : '⏳ Pendiente'}
                                    <button
                                        onClick={() => setFiltroCoordinacionCompletada('')}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {filtroUsuarioAprobador && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    👤 {usuariosAprobadores.find(u => u.id.toString() === filtroUsuarioAprobador)?.name}
                                    <button
                                        onClick={() => setFiltroUsuarioAprobador('')}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {soloVencidas && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    ⚠️ Solo Vencidas
                                    <button
                                        onClick={() => setSoloVencidas(false)}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {(dateFrom || dateTo) && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    📅 {dateFrom}-{dateTo}
                                    <button
                                        onClick={() => {
                                            setDateFrom('');
                                            setDateTo('');
                                        }}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {(amountFrom || amountTo) && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    💵 {amountFrom || '0'}-{amountTo || '∞'}
                                    <button
                                        onClick={() => {
                                            setAmountFrom('');
                                            setAmountTo('');
                                        }}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {/* ✅ Badges de filtros de fechas y horas */}
                            {(filtroFechaVencimientoDesde || filtroFechaVencimientoHasta) && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    📅 Vencimiento: {filtroFechaVencimientoDesde}-{filtroFechaVencimientoHasta}
                                    <button
                                        onClick={() => {
                                            setFiltroFechaVencimientoDesde('');
                                            setFiltroFechaVencimientoHasta('');
                                        }}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {(filtroFechaEntregaSolicitadaDesde || filtroFechaEntregaSolicitadaHasta) && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    📦 Entrega: {filtroFechaEntregaSolicitadaDesde}-{filtroFechaEntregaSolicitadaHasta}
                                    <button
                                        onClick={() => {
                                            setFiltroFechaEntregaSolicitadaDesde('');
                                            setFiltroFechaEntregaSolicitadaHasta('');
                                        }}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            )}
                            {(filtroHoraEntregaSolicitadaDesde || filtroHoraEntregaSolicitadaHasta) && (
                                <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300 pr-1 pl-3 flex items-center gap-2">
                                    🕐 Hora: {filtroHoraEntregaSolicitadaDesde}-{filtroHoraEntregaSolicitadaHasta}
                                    <button
                                        onClick={() => {
                                            setFiltroHoraEntregaSolicitadaDesde('');
                                            setFiltroHoraEntregaSolicitadaHasta('');
                                        }}
                                        className="hover:bg-slate-600 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
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
                                className="dark:border-slate-600 dark:text-slate-300 text-red-600 dark:text-red-400"
                            >
                                Limpiar Todos
                            </Button>
                        </div>
                    </div>
                )}

                {/* SECCIÓN 3: Filtros Avanzados (Collapsible) */}
                <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 justify-between"
                        >
                            <span className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filtros Avanzados
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                        </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-4 pt-4 border-t dark:border-slate-700 mt-4">
                        {/* Grid de 3 columnas */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Localidad */}
                            <div>
                                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Localidad</label>
                                <select
                                    value={filtroLocalidad}
                                    onChange={(e) => setFiltroLocalidad(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
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
                                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Tipo Entrega</label>
                                <select
                                    value={filtroTipoEntrega}
                                    onChange={(e) => setFiltroTipoEntrega(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="DELIVERY">🚚 Delivery</option>
                                    <option value="PICKUP">🏪 Pickup</option>
                                </select>
                            </div>

                            {/* Estado Logístico */}
                            <div>
                                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Est. Logístico</label>
                                <select
                                    value={filtroEstadoLogistica}
                                    onChange={(e) => setFiltroEstadoLogistica(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                                >
                                    <option value="">Todos</option>
                                    {estadosLogistica.map((estado) => (
                                        <option key={estado.id} value={estado.id.toString()}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Política de Pago */}
                            <div>
                                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Política Pago</label>
                                <select
                                    value={filtroPoliticaPago}
                                    onChange={(e) => setFiltroPoliticaPago(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="CONTRA_ENTREGA">Contra Entrega</option>
                                    <option value="ANTICIPADO_100">Anticipado 100%</option>
                                    <option value="MEDIO_MEDIO">Medio/Medio</option>
                                    <option value="CREDITO">Crédito</option>
                                </select>
                            </div>

                            {/* Aprobado Por */}
                            <div>
                                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Aprobado Por</label>
                                <select
                                    value={filtroUsuarioAprobador}
                                    onChange={(e) => setFiltroUsuarioAprobador(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                                >
                                    <option value="">Todos</option>
                                    {usuariosAprobadores.map((usuario) => (
                                        <option key={usuario.id} value={usuario.id.toString()}>
                                            {usuario.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Coordinación */}
                            <div>
                                <label className="text-sm font-medium mb-2 block dark:text-gray-300">Coordinación</label>
                                <select
                                    value={filtroCoordinacionCompletada}
                                    onChange={(e) => setFiltroCoordinacionCompletada(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                                >
                                    <option value="">Todos</option>
                                    <option value="true">✓ Completada</option>
                                    <option value="false">⏳ Pendiente</option>
                                </select>
                            </div>
                        </div>

                        {/* Separador */}
                        <div className="border-t dark:border-slate-700 pt-4" />

                        {/* ✅ Rango de Fecha Entrega Solicitada */}
                        <div>
                            <label className="text-sm font-medium mb-2 block dark:text-gray-300">📦 Fecha Entrega Solicitada</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-medium mb-2 block dark:text-gray-400">Desde</label>
                                    <Input
                                        type="date"
                                        value={filtroFechaEntregaSolicitadaDesde}
                                        onChange={(e) => setFiltroFechaEntregaSolicitadaDesde(e.target.value)}
                                        className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium mb-2 block dark:text-gray-400">Hasta</label>
                                    <Input
                                        type="date"
                                        value={filtroFechaEntregaSolicitadaHasta}
                                        onChange={(e) => setFiltroFechaEntregaSolicitadaHasta(e.target.value)}
                                        className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Separador */}
                        <div className="border-t dark:border-slate-700 pt-4" />

                        {/* Solo Vencidas */}
                        <div className="flex items-center gap-2 pt-2">
                            <Checkbox
                                id="solo_vencidas"
                                checked={soloVencidas}
                                onCheckedChange={(checked) => setSoloVencidas(checked as boolean)}
                                className="dark:border-slate-600"
                            />
                            <label htmlFor="solo_vencidas" className="text-sm cursor-pointer dark:text-gray-300">
                                ⚠️ Mostrar solo proformas vencidas
                            </label>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Información de paginación */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {paginationInfo.from}-{paginationInfo.to} de {paginationInfo.total}
                </div>

                {/* Tabla */}
                <div className="border rounded-lg overflow-x-auto dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr className="border-b dark:border-slate-700">
                                <th
                                    className="px-4 py-2 text-left font-medium dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 select-none"
                                    onClick={() => handleSort('numero')}
                                >
                                    <div className="flex items-center gap-2">
                                        Número
                                        {sortField === 'numero' && (
                                            sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-2 text-left font-medium dark:text-gray-300">Cliente / Creador </th>
                                <th
                                    className="px-4 py-2 text-left font-medium dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 select-none"
                                    onClick={() => handleSort('monto')}
                                >
                                    <div className="flex items-center gap-2">
                                        Monto
                                        {sortField === 'monto' && (
                                            sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </th>
                                
                                {/* ✅ NUEVO: Columna Fecha Entrega Solicitada */}
                                <th className="px-4 py-2 text-left font-medium dark:text-gray-300">📅 Creada</th>
                                <th className="px-4 py-2 text-left font-medium dark:text-gray-300">🚚 Entrega Solicitada</th>
                                {/* ✅ NUEVO: Columna Fecha Vencimiento */}
                                <th className="px-4 py-2 text-left font-medium dark:text-gray-300">📅 Vencimiento</th>
                                <th className="px-4 py-2 text-left font-medium dark:text-gray-300">✏️ Actualizada</th>
                                <th className="px-4 py-2 text-left font-medium dark:text-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProformas.map((proforma) => (
                                <tr key={proforma.id} className={`border-t dark:border-slate-700 transition-colors duration-200 ${getRowBackgroundByEstado(proforma.estado)}`}>
                                    {/* ✅ PRIMERA COLUMNA: ESTADO DESTACADO CON COLOR DEL BACKEND */}
                                    <td className="px-2 py-2 dark:text-gray-300">
                                        <div className="space-y-2">
                                            {(() => {
                                                const estadoStyle = getEstadoBadgeStyle(proforma.estado);
                                                return (
                                                    <div
                                                        className={`inline-flex gap-2 items-center px-2 rounded-lg font-semibold text-sm border-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${estadoStyle.bg} ${estadoStyle.text} ${estadoStyle.border}`}
                                                    >
                                                        <span className="text-lg">{String(proforma.estado_logistica?.icono || '📋')}</span>
                                                        <span>{String(proforma.estado_logistica?.nombre || proforma.estado)}</span>
                                                    </div>
                                                );
                                            })()}
                                            <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-xs space-y-1">
                                                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                                                    🏷️ Folio Prof.: <span className="font-mono text-blue-600 dark:text-blue-400">{proforma.id}</span>
                                                </p>
                                                {/* <p className="text-gray-600 dark:text-gray-400 font-mono">
                                                    📄 {String(proforma.numero)}
                                                </p> */}
                                            </div>

                                            {proforma.venta_numero && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">🛍️</span>
                                                        <div>
                                                            {/* <div className="font-semibold text-sm text-green-700 dark:text-green-400">
                                                                {String(proforma.venta_numero)}
                                                            </div> */}
                                                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                Folio Venta: {String(proforma.venta_id)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 dark:text-gray-300 space-y-2">
                                        <div>Cliente: <strong>{String(proforma.cliente_nombre)}</strong></div>
                                        <div className="flex flex-col gap-1 text-green-600 dark:text-green-400">
                                            <Badge
                                                variant="outline"
                                                className={`w-fit text-xs ${
                                                    proforma.usuario_creador_es_preventista
                                                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                                                        : 'bg-transparent dark:bg-slate-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {proforma.usuario_creador_es_preventista
                                                    ? '👤 Prev.'
                                                    : '👥 Otro'}
                                                <strong> : {String(proforma.usuario_creador_nombre)}</strong>
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-right dark:text-gray-300">
                                        Bs {proforma.total.toLocaleString('es-BO', { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-2 py-2 text-xs text-muted-foreground dark:text-gray-400">
                                        <div className="whitespace-nowrap">
                                            {proforma.created_at ? (
                                                <>
                                                    <div>{new Date(proforma.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                    <div className="text-xs">{new Date(proforma.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* ✅ NUEVO: Columna Fecha & Hora Entrega Solicitada */}
                                    <td className="px-2 py-2 text-xs text-muted-foreground dark:text-gray-400">
                                        <div className="whitespace-nowrap">
                                            {proforma.fecha_entrega_solicitada ? (
                                                <>
                                                    <div>{new Date(proforma.fecha_entrega_solicitada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                    {proforma.hora_entrega_solicitada && (
                                                        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                            🕐 {String(proforma.hora_entrega_solicitada)}
                                                            {proforma.hora_entrega_solicitada_fin && <span> - {String(proforma.hora_entrega_solicitada_fin)}</span>}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* ✅ NUEVO: Columna Fecha Vencimiento */}
                                    <td className="px-2 py-2 text-xs text-muted-foreground dark:text-gray-400">
                                        <div className="whitespace-nowrap">
                                            {proforma.fecha_vencimiento ? (
                                                <>
                                                    <div>{new Date(proforma.fecha_vencimiento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                    {estaVencida(proforma) && <div className="text-red-600 dark:text-red-400 text-xs font-semibold">VENCIDA</div>}
                                                </>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-xs text-muted-foreground dark:text-gray-400">
                                        <div className="whitespace-nowrap">
                                            {proforma.updated_at ? (
                                                <>
                                                    <div>{new Date(proforma.updated_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                    <div className="text-xs">{new Date(proforma.updated_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-2 py-2">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onVerProforma(proforma)}
                                                className="dark:hover:bg-slate-700"
                                                title="Ver proforma"
                                            >
                                                <Eye className="h-4 w-4 dark:text-gray-400" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedProformaForPrint(proforma);
                                                    setShowPrintModal(true);
                                                }}
                                                className="dark:hover:bg-slate-700"
                                                title="Imprimir proforma"
                                            >
                                                <Printer className="h-4 w-4 dark:text-gray-400" />
                                            </Button>
                                            {['BORRADOR', 'PENDIENTE'].includes(proforma.estado) && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onEditarProforma?.(proforma)}
                                                    className="dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                                                    title="Editar proforma"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {['PENDIENTE', 'APROBADA', 'VENCIDA'].includes(proforma.estado) && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onRechazarProforma?.(proforma)}
                                                    className="dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                                                    title="Rechazar proforma"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            )}
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
            </CardContent>
        </Card>
    );
}

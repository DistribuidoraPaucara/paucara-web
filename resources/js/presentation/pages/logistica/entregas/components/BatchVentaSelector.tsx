import type { VentaConDetalles } from '@/domain/entities/entregas';
import type { Id } from '@/domain/entities/shared';
import { Badge } from '@/presentation/components/ui/badge';
import { Card } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, MapPin, Package, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// ✅ NUEVO: Función helper para parsear fechas sin problemas de timezone
const parsearFecha = (fechaStr: string) => {
    if (!fechaStr) return null;
    // Parsear formato YYYY-MM-DD de forma segura
    const [year, month, day] = fechaStr.split('-').map(Number);
    return new Date(year, month - 1, day); // Date constructor con componentes locales
};

interface BatchVentaSelectorProps {
    ventas: VentaConDetalles[];
    selectedIds: Id[];
    ventasAsignadas?: Id[]; // 🔧 NUEVO: IDs de ventas ya asignadas (para modo edición)
    onToggleVenta: (ventaId: Id) => void;
    onSelectAll: (ventaIds: Id[]) => void;
    onClearSelection: () => void;
    onSearchResultsChange?: (resultados: VentaConDetalles[]) => void; // 🔧 NUEVO: Notificar al padre de cambios en búsqueda
}

export default function BatchVentaSelector({
    ventas,
    selectedIds,
    ventasAsignadas = [],
    onToggleVenta,
    onSelectAll,
    onClearSelection,
    onSearchResultsChange,
}: BatchVentaSelectorProps) {
    console.log('Renderizando BatchVentaSelector');
    console.log('Ventas disponibles:', ventas);
    console.log('Ventas seleccionadas:', selectedIds);
    console.log('Ventas asignadas:', ventasAsignadas);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [tipoFecha, setTipoFecha] = useState<'created_at' | 'fecha_entrega_comprometida'>('fecha_entrega_comprometida'); // ✅ NUEVO
    const [turno, setTurno] = useState<'manana' | 'tarde' | ''>(''); // ✅ NUEVO
    const [hora, setHora] = useState<string>(''); // ✅ NUEVO: Hora específica (ej: "09:00")
    const [expandedLocalidades, setExpandedLocalidades] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<VentaConDetalles[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [isDateFilterExpanded, setIsDateFilterExpanded] = useState(false);

    // Función para aplicar búsqueda en BD
    const handleSearch = useCallback(async () => {
        if (!searchInputValue && !fechaDesde && !fechaHasta && !turno && !hora) {
            return; // ✅ NUEVO: Incluido hora en validación
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const params = new URLSearchParams();
            if (searchInputValue) params.append('q', searchInputValue);
            if (fechaDesde) params.append('fecha_desde', fechaDesde);
            if (fechaHasta) params.append('fecha_hasta', fechaHasta);
            if (tipoFecha && tipoFecha !== 'fecha_entrega_comprometida') params.append('tipo_fecha', tipoFecha); // ✅ NUEVO
            if (hora)
                params.append('hora', hora); // ✅ NUEVO: Hora específica
            else if (turno) params.append('turno', turno); // ✅ NUEVO: Turno (si no hay hora específica)
            params.append('page', '1');

            console.log('🔍 [BatchVentaSelector] Iniciando búsqueda:', {
                q: searchInputValue,
                fecha_desde: fechaDesde,
                fecha_hasta: fechaHasta,
                tipo_fecha: tipoFecha, // ✅ NUEVO
                turno: turno, // ✅ NUEVO
                hora: hora, // ✅ NUEVO
            });

            const response = await fetch(`/logistica/entregas/ventas/search?${params.toString()}`);

            console.log('📡 [BatchVentaSelector] Respuesta recibida - Status:', response.status);

            if (!response.ok) {
                throw new Error('Error al buscar ventas');
            }

            const data = await response.json();

            console.log('✅ [BatchVentaSelector] Datos recibidos del backend:', {
                total_ventas: data.data.length,
                pagination: data.pagination,
                ventas_detalles: data.data.map((v: any) => ({
                    id: v.id,
                    numero: v.numero_venta,
                    cant_detalles: v.detalles?.length ?? 0,
                    peso_total_estimado: v.peso_total_estimado,
                    cliente: v.cliente?.nombre,
                    detalles_primera_venta: data.data[0]?.detalles ? data.data[0].detalles.slice(0, 2) : 'N/A',
                })),
                datos_completos_primera_venta: data.data[0],
            });

            setSearchResults(data.data);
            setTotalPages(data.pagination.last_page);
            setCurrentPage(1);
            setSearchTerm(searchInputValue);
            setHasSearched(true);
        } catch (error) {
            console.error('❌ [BatchVentaSelector] Error en búsqueda:', error);
            setSearchError(error instanceof Error ? error.message : 'Error desconocido');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchInputValue, fechaDesde, fechaHasta, tipoFecha, turno, hora]); // ✅ NUEVO: Agregados tipoFecha, turno y hora

    // Función para limpiar filtros
    const handleClearSearch = useCallback(() => {
        // Reset de todos los filtros
        setSearchInputValue('');
        setSearchTerm('');
        setFechaDesde('');
        setFechaHasta('');
        setTipoFecha('fecha_entrega_comprometida');
        setTurno('');
        setHora('');
        setSearchError(null);
        setCurrentPage(1);
        setSearchResults([]);
        setHasSearched(false);

        console.log('🧹 [BatchVentaSelector] Todos los filtros limpiados');
    }, []);

    // Manejar Enter en el input
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // ✅ NUEVO: Combinar ventas iniciales + resultados de búsqueda (para que estén disponibles en el hook)
    const filteredVentas = useMemo(() => {
        // Si hay búsqueda activa, mostrar resultados de búsqueda (incluso si son 0)
        if (hasSearched) {
            return searchResults; // ✅ FIX: Mostrar resultados aunque estén vacíos
        }
        // Sino, usar datos iniciales cargados
        return ventas;
    }, [ventas, searchResults, hasSearched]);

    // ✅ NUEVO: Notificar al padre cuando hay resultados de búsqueda
    useEffect(() => {
        // Notificar cuando hay búsqueda activa Y hay resultados
        if (hasSearched && searchResults.length > 0 && onSearchResultsChange) {
            console.log('📢 [BatchVentaSelector] Notificando resultados de búsqueda al padre:', {
                cantidad: searchResults.length,
                ids: searchResults.map((v) => v.id),
            });
            onSearchResultsChange(searchResults);
        }
    }, [searchResults, onSearchResultsChange]);

    // Agrupar ventas por localidad
    const ventasPorLocalidad = useMemo(() => {
        const grupos = new Map<string, { nombre: string; ventas: VentaConDetalles[] }>();

        filteredVentas.forEach((venta) => {
            const localidadKey = venta.cliente.localidad?.nombre || 'Sin localidad';
            if (!grupos.has(localidadKey)) {
                grupos.set(localidadKey, {
                    nombre: localidadKey,
                    ventas: [],
                });
            }
            grupos.get(localidadKey)!.ventas.push(venta);
        });

        // Ordenar localidades alfabéticamente
        return Array.from(grupos.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, grupo]) => grupo);
    }, [filteredVentas]);

    // Toggle para expandir/contraer localidad
    const toggleLocalidad = (localidadNombre: string) => {
        setExpandedLocalidades((prev) => {
            const next = new Set(prev);
            if (next.has(localidadNombre)) {
                next.delete(localidadNombre);
            } else {
                next.add(localidadNombre);
            }
            return next;
        });
    };

    // Calcular totales
    // ✅ ACTUALIZADO: Usar peso_total_estimado y subtotal (sin impuesto)
    const totalSeleccionado = useMemo(() => {
        return {
            cantidad: selectedIds.length,
            peso: ventas.filter((v) => selectedIds.includes(v.id)).reduce((sum, v) => sum + (v.peso_total_estimado || v.peso_estimado || 0), 0), // ✅ Usar peso_total_estimado
            monto: ventas.filter((v) => selectedIds.includes(v.id)).reduce((sum, v) => sum + (v.subtotal || 0), 0), // ✅ Usar subtotal (sin impuesto)
        };
    }, [ventas, selectedIds]);

    return (
        <div className="space-y-4">
            {/* Encabezado y búsqueda - STICKY */}
            <div className="sticky top-0 z-10 space-y-3 bg-gradient-to-b from-white via-white to-transparent pb-2 dark:from-slate-900 dark:via-slate-900 dark:to-transparent">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white">Seleccionar Ventas</Label>
                    <div className="flex items-center gap-2">
                        {/* Toggle Compacto/Detallado */}
                        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-slate-800">
                            <button
                                onClick={() => setViewMode('detailed')}
                                className={`rounded px-2 py-1 text-xs font-medium transition-all ${
                                    viewMode === 'detailed'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                Detallada
                            </button>
                            <button
                                onClick={() => setViewMode('compact')}
                                className={`rounded px-2 py-1 text-xs font-medium transition-all ${
                                    viewMode === 'compact'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                Compacta
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedIds.length} seleccionadas
                    {hasSearched && <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">• Búsqueda activa</span>}
                </div>

                {/* Búsqueda con Botón */}
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Busca por: ID venta • Número • Cliente • Teléfono • NIT • Localidad</p>
                    <div className="relative flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Id, número, cliente, teléfono, NIT o localidad..."
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isSearching}
                                className="pl-10 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={(!searchInputValue && !fechaDesde && !fechaHasta && !turno && !hora) || isSearching}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 dark:text-white dark:disabled:bg-gray-700"
                        >
                            {isSearching ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    <span>Buscando...</span>
                                </>
                            ) : (
                                'Buscar'
                            )}
                        </button>
                        {/* ✅ NUEVO: Filtros de Fecha Avanzados - Collapsible */}
                        <button
                            onClick={() => setIsDateFilterExpanded(!isDateFilterExpanded)}
                            className={`flex items-center justify-between rounded-lg p-2 transition-all ${
                                isDateFilterExpanded
                                    ? 'border border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800'
                                    : 'border border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                {/* <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filtros de Fecha y Turno</span> */}
                                {(fechaDesde || fechaHasta || turno) && (
                                    <Badge variant="secondary" className="text-xs">
                                        ✓ Activo
                                    </Badge>
                                )}
                            </div>
                            {isDateFilterExpanded ? (
                                <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            )}
                        </button>
                    </div>

                    {/* Error en búsqueda */}
                    {searchError && (
                        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-2 text-xs dark:border-red-800 dark:bg-red-900/20">
                            <span className="text-red-700 dark:text-red-300">❌ {searchError}</span>
                            <button onClick={() => setSearchError(null)} className="font-medium text-red-600 hover:underline dark:text-red-400">
                                Cerrar
                            </button>
                        </div>
                    )}

                    {/* ✅ NUEVO: Chips de Filtros Activos */}
                    {(searchInputValue || fechaDesde || fechaHasta || turno || hora) && (
                        <div className="flex flex-wrap gap-2">
                            {hasSearched && !searchError && (
                                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs dark:border-blue-800 dark:bg-blue-900/20">
                                    <span className="text-blue-700 dark:text-blue-300 mr-2">
                                        🔍 {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                                    </span>
                                    <button onClick={handleClearSearch} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                                        Limpiar búsqueda
                                    </button>
                                </div>
                            )}
                            {searchInputValue && (
                                <Badge variant="secondary" className="text-xs">
                                    🔎 Búsqueda: {searchInputValue}
                                </Badge>
                            )}
                            {(fechaDesde || fechaHasta) && (
                                <Badge variant="secondary" className="text-xs">
                                    {tipoFecha === 'created_at' ? '📝 Tipo Fecha: Creación' : '📅 Tipo Fecha: Entrega Comprometida'}
                                </Badge>
                            )}
                            {fechaDesde && (
                                <Badge variant="secondary" className="text-xs">
                                    📅 Desde: {fechaDesde}
                                </Badge>
                            )}
                            {fechaHasta && (
                                <Badge variant="secondary" className="text-xs">
                                    📅 Hasta: {fechaHasta}
                                </Badge>
                            )}
                            {turno && (
                                <Badge variant="secondary" className="text-xs">
                                    {turno === 'manana' ? '☀ Mañana (08:00-12:00)' : '🌇 Tarde (14:00-18:00)'}
                                </Badge>
                            )}
                            {hora && (
                                <Badge variant="secondary" className="text-xs">
                                    🕐 Hora: {hora}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Indicador de búsqueda activa */}
                    {/* {hasSearched && !searchError && (
                        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs dark:border-blue-800 dark:bg-blue-900/20">
                            <span className="text-blue-700 dark:text-blue-300">
                                🔍 {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                            </span>
                            <button onClick={handleClearSearch} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                                Limpiar búsqueda
                            </button>
                        </div>
                    )} */}
                </div>

                {/* ✅ NUEVO: Contenido de filtros avanzados */}
                {isDateFilterExpanded && (
                    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                        <div className="grid grid-cols-2 gap-2">
                            {/* Selector de tipo de fecha */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">Tipo de Fecha</label>
                                <div className="flex gap-3">
                                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="tipo_fecha"
                                            value="fecha_entrega_comprometida"
                                            checked={tipoFecha !== 'created_at'}
                                            onChange={() => setTipoFecha('fecha_entrega_comprometida')}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-slate-700 dark:text-slate-300">📅 Fecha de Entrega Comprometida</span>
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            name="tipo_fecha"
                                            value="created_at"
                                            checked={tipoFecha === 'created_at'}
                                            onChange={() => setTipoFecha('created_at')}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-slate-700 dark:text-slate-300">📝 Fecha de Creación</span>
                                    </label>
                                </div>
                            </div>

                            {/* Botones rápidos de fecha */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">Fechas Rápidas</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const ayer = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
                                            setFechaDesde(ayer);
                                            setFechaHasta(ayer);
                                            handleSearch();
                                        }}
                                        className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                    >
                                        ← Ayer
                                    </button>
                                    <button
                                        onClick={() => {
                                            const hoy = new Date().toISOString().split('T')[0];
                                            setFechaDesde(hoy);
                                            setFechaHasta(hoy);
                                            handleSearch();
                                        }}
                                        className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                    >
                                        Hoy
                                    </button>
                                    <button
                                        onClick={() => {
                                            const manana = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
                                            setFechaDesde(manana);
                                            setFechaHasta(manana);
                                            handleSearch();
                                        }}
                                        className="rounded bg-slate-200 px-2 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                    >
                                        Mañana →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Inputs de fecha manual */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">Desde</label>
                                    <Input
                                        type="date"
                                        value={fechaDesde}
                                        onChange={(e) => setFechaDesde(e.target.value)}
                                        className="h-9 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs text-slate-600 dark:text-slate-400">Hasta</label>
                                    <Input
                                        type="date"
                                        value={fechaHasta}
                                        onChange={(e) => setFechaHasta(e.target.value)}
                                        className="h-9 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>
                            {/* ✅ NUEVO: Selector de turno con horas individuales */}
                        <div className="grid grid-cols-2 gap-2">
                            {/* Turno Mañana */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">☀ Mañana (08:00-12:00)</label>
                                <div className="flex flex-wrap gap-2">
                                    {[8, 9, 10, 11].map((h) => {
                                        const horaStr = String(h).padStart(2, '0') + ':00';
                                        const isSelected = hora === horaStr;
                                        return (
                                            <button
                                                key={horaStr}
                                                onClick={() => {
                                                    const nuevaHora = isSelected ? '' : horaStr;
                                                    setHora(nuevaHora);
                                                    setTurno('');
                                                    if (nuevaHora || fechaDesde || fechaHasta || searchInputValue) {
                                                        // Trigger search with new hora
                                                        setTimeout(() => handleSearch(), 0);
                                                    }
                                                }}
                                                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                                }`}
                                            >
                                                {horaStr}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Turno Tarde */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-400">🌇 Tarde (14:00-18:00)</label>
                                <div className="flex flex-wrap gap-2">
                                    {[14, 15, 16, 17].map((h) => {
                                        const horaStr = String(h).padStart(2, '0') + ':00';
                                        const isSelected = hora === horaStr;
                                        return (
                                            <button
                                                key={horaStr}
                                                onClick={() => {
                                                    const nuevaHora = isSelected ? '' : horaStr;
                                                    setHora(nuevaHora);
                                                    setTurno('');
                                                    if (nuevaHora || fechaDesde || fechaHasta || searchInputValue) {
                                                        // Trigger search with new hora
                                                        setTimeout(() => handleSearch(), 0);
                                                    }
                                                }}
                                                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                                }`}
                                            >
                                                {horaStr}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        </div>
                        

                        {/* Limpiar filtros */}
                        {(fechaDesde || fechaHasta || turno || hora) && (
                            <button
                                onClick={handleClearSearch} // ✅ FIX: Llamar a handleClearSearch en lugar de setStates inline
                                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                            >
                                ✕ Limpiar todos los filtros
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Lista de ventas agrupadas por localidad */}
            <div className="space-y-2 overflow-y-auto">
                {ventasPorLocalidad.length === 0 ? (
                    <Card className="p-4 text-center text-gray-500 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-400">
                        No hay ventas disponibles
                    </Card>
                ) : (
                    ventasPorLocalidad.map((grupo) => {
                        const isExpanded = expandedLocalidades.has(grupo.nombre);
                        const localidadVentasSeleccionadas = grupo.ventas.filter((v) => selectedIds.includes(v.id)).length;

                        return (
                            <div key={grupo.nombre} className="space-y-2">
                                {/* Encabezado de localidad */}
                                <button
                                    onClick={() => toggleLocalidad(grupo.nombre)}
                                    className={`flex w-full items-center justify-between rounded-lg p-1 transition-all ${
                                        isExpanded
                                            ? 'border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-50 dark:border-blue-700 dark:from-blue-900/40 dark:to-blue-900/20'
                                            : 'border border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900 dark:text-white">{grupo.nombre}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {grupo.ventas.length} venta{grupo.ventas.length !== 1 ? 's' : ''} • {localidadVentasSeleccionadas}{' '}
                                                seleccionada{localidadVentasSeleccionadas !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {grupo.ventas.length}
                                        </Badge>
                                        {isExpanded ? (
                                            <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {/* Ventas de la localidad */}
                                {isExpanded && (
                                    <div className={`space-y-2 border-l-2 border-blue-300 p-4 dark:border-blue-700`}>
                                        {grupo.ventas.map((venta) => {
                                            const isSelected = selectedIds.includes(venta.id);
                                            const isAsignada = ventasAsignadas.includes(venta.id);
                                            const isNueva = isSelected && !isAsignada;

                                            if (viewMode === 'compact') {
                                                // Vista Compacta
                                                return (
                                                    <Card
                                                        key={venta.id}
                                                        onClick={() => onToggleVenta(venta.id)}
                                                        className={`cursor-pointer p-2 transition-all ${
                                                            isSelected
                                                                ? isNueva
                                                                    ? 'bg-green-50 ring-2 ring-green-500 dark:bg-green-900/20 dark:ring-green-400'
                                                                    : 'bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/20 dark:ring-blue-400'
                                                                : 'hover:shadow-md dark:hover:bg-slate-800'
                                                        } dark:border-slate-700 dark:bg-slate-900`}
                                                    >
                                                        <div className="flex items-center gap-2 text-xs">
                                                            {isSelected ? (
                                                                <CheckCircle2
                                                                    className={`h-4 w-4 flex-shrink-0 ${isNueva ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}
                                                                />
                                                            ) : (
                                                                <div className="h-4 w-4 flex-shrink-0 rounded border border-gray-300 dark:border-gray-600" />
                                                            )}
                                                            <span className="min-w-fit font-mono font-semibold text-gray-900 dark:text-white">
                                                                Folio: #{venta.id}
                                                            </span>
                                                            <span className="text-gray-600 dark:text-gray-400">{venta.cliente.nombre}</span>
                                                            {/* {isNueva && (
                                                                <Badge variant="default" className="ml-auto bg-green-600 text-xs">
                                                                    ✨ Nueva
                                                                </Badge>
                                                            )} */}
                                                            {isAsignada && isSelected && (
                                                                <Badge variant="secondary" className="ml-auto text-xs">
                                                                    ✓ Asignada
                                                                </Badge>
                                                            )}
                                                            <span className="ml-auto font-semibold text-gray-600 dark:text-gray-400">
                                                                Bs {venta.subtotal.toFixed(0)}
                                                            </span>
                                                        </div>
                                                    </Card>
                                                );
                                            }

                                            // Vista Detallada
                                            return (
                                                <Card
                                                    key={venta.id}
                                                    onClick={() => onToggleVenta(venta.id)}
                                                    className={`cursor-pointer p-3 transition-all ${
                                                        isSelected
                                                            ? isNueva
                                                                ? 'bg-green-50 ring-2 ring-green-500 dark:bg-green-900/20 dark:ring-green-400'
                                                                : 'bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/20 dark:ring-blue-400'
                                                            : 'hover:shadow-md dark:hover:bg-slate-800'
                                                    } dark:border-slate-700 dark:bg-slate-900`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Checkbox visual */}
                                                        <div className="mt-0.5">
                                                            {isSelected ? (
                                                                <CheckCircle2
                                                                    className={`h-5 w-5 ${isNueva ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}
                                                                />
                                                            ) : (
                                                                <div className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600" />
                                                            )}
                                                        </div>

                                                        {/* Información */}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-1 grid grid-cols-1 gap-1.5">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <h4 className="flex-1 font-semibold break-words text-gray-900 dark:text-white">
                                                                        Folio: #{venta.id} | {venta.cliente.nombre}
                                                                    </h4>
                                                                    {/* <Badge variant="secondary" className="text-xs break-words">
                                                                        {venta.cliente.nombre}
                                                                    </Badge> */}
                                                                    <div className="flex flex-shrink-0 gap-1">
                                                                        {isAsignada && isSelected && (
                                                                            <Badge variant="secondary" className="text-xs whitespace-nowrap">
                                                                                ✓ Asignada
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    {/* ✅ NUEVO: Mostrar estado logístico */}
                                                                    {venta.estado_logistico && (
                                                                        <Badge
                                                                            className="text-xs whitespace-nowrap"
                                                                            style={{
                                                                                backgroundColor: venta.estado_logistico.color,
                                                                            }}
                                                                        >
                                                                            {venta.estado_logistico.icono && `${venta.estado_logistico.icono} `}
                                                                            {venta.estado_logistico.nombre}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <Package className="h-4 w-4" />
                                                                        <span>
                                                                            {venta.cantidad_items} artículos • {venta.peso_estimado} kg
                                                                        </span>
                                                                    </div>

                                                                    <span className="font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                                                                        Bs{' '}
                                                                        {venta.subtotal.toLocaleString('es-BO', {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex flex-col gap-1 text-xs">
                                                                        {/* ✅ MEJORADO: Mostrar fecha de creación formateada */}
                                                                        {venta.created_at && (
                                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                                📝 Creada:{' '}
                                                                                {(() => {
                                                                                    // Parsear fecha y hora de created_at (formato: YYYY-MM-DD HH:ii)
                                                                                    const [fechaParte, horaParte] = venta.created_at.split(' ');
                                                                                    const fecha = parsearFecha(fechaParte);
                                                                                    return fecha
                                                                                        ? `${fecha.toLocaleDateString('es-BO', {
                                                                                              day: 'numeric',
                                                                                              month: 'short',
                                                                                              year: '2-digit',
                                                                                          })} • ${horaParte}`
                                                                                        : venta.created_at;
                                                                                })()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {venta.fecha_entrega_comprometida && (
                                                                        <div className="pt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                                                            ⏰ Entrega comprometida:{' '}
                                                                            {parsearFecha(venta.fecha_entrega_comprometida)?.toLocaleDateString(
                                                                                'es-BO',
                                                                                {
                                                                                    weekday: 'short',
                                                                                    day: 'numeric',
                                                                                    month: 'short',
                                                                                    year: 'numeric',
                                                                                },
                                                                            )}
                                                                            {venta.hora_entrega_comprometida && (
                                                                                <span className="text-blue-600 dark:text-blue-400">
                                                                                    @ {venta.hora_entrega_comprometida}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2">
                <button
                    onClick={() => onSelectAll(ventas.map((v) => v.id))}
                    className="rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-200"
                >
                    Seleccionar Todas las Ventas
                </button>
                <button
                    onClick={onClearSelection}
                    className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                >
                    Limpiar Formulario de Entrega
                </button>
            </div>
        </div>
    );
}

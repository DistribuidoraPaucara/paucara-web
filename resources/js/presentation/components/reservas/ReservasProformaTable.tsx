import { reservasProformaApi } from '@/application/api/reservas-proforma';
import type { ReservaProforma, ReservaProformaFilters } from '@/domain/entities/reservas-proforma';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/presentation/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReservasProformaTableProps {
    onFiltersChange?: (filters: ReservaProformaFilters) => void;
}

export default function ReservasProformaTable({ onFiltersChange }: ReservasProformaTableProps) {
    const [reservas, setReservas] = useState<ReservaProforma[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(50);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReservas, setTotalReservas] = useState(0);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

    // Obtener fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const [filters, setFilters] = useState<ReservaProformaFilters>({
        ordenamiento: 'fecha_expiracion-asc',
        // ✅ NUEVO (2026-07-18): Filtrar por fecha de reserva (hoy por defecto)
        fecha_reserva_desde: today,
        fecha_reserva_hasta: today,
    });
    const [filterInputs, setFilterInputs] = useState({
        // ✅ NUEVO (2026-07-22): Búsqueda unificada por ID o número de proforma
        proforma_busqueda: '',
        // ✅ NUEVO (2026-07-18): Búsqueda por nombre de cliente
        cliente_nombre: '',
        estado: '',
        producto_id: '', // ✅ NUEVO: Filtro por producto (ID exacto)
        producto_busqueda: '', // ✅ NUEVO (2026-02-12): Búsqueda flexible por ID, SKU o nombre
        vencimiento: '',
        fecha_creacion_desde: '',
        fecha_creacion_hasta: '',
        // ✅ NUEVO (2026-07-18): Filtro por fecha de reserva
        fecha_reserva_desde: today,
        fecha_reserva_hasta: today,
        fecha_vencimiento_desde: '',
        fecha_vencimiento_hasta: '',
    });
    const [summary, setSummary] = useState<any>(null);
    const [selectedReserva, setSelectedReserva] = useState<ReservaProforma | null>(null);
    const [liberando, setLiberando] = useState<number | null>(null);

    // Cargar datos
    useEffect(() => {
        cargarReservas();
    }, [currentPage, filters]);

    const cargarReservas = async () => {
        try {
            setLoading(true);
            const response = await reservasProformaApi.obtenerLista({
                ...filters,
                per_page: perPage,
                page: currentPage,
            });

            // ✅ NUEVO (2026-02-12): Logging en consola de respuesta
            console.group('✅ [ReservasTable] Datos Cargados');
            console.log('📊 Total de reservas:', response.pagination.total);
            console.log('📄 Página actual:', response.pagination.current_page);
            console.log('📋 Registros en esta página:', response.data.length);
            console.table(
                response.data.map((r: any) => ({
                    id: r.id,
                    proforma: r.proforma_numero,
                    producto: r.producto_nombre,
                    cantidad: r.cantidad_reservada,
                    estado: r.estado,
                    vencimiento: r.fecha_expiracion,
                })),
            );
            console.groupEnd();

            setReservas(response.data);
            setTotalPages(response.pagination.last_page);
            setTotalReservas(response.pagination.total);
            setSummary(response.summary);
        } catch (error) {
            console.error('❌ Error cargando reservas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilterInputs((prev) => ({ ...prev, [key]: value }));
    };

    const aplicarFiltros = () => {
        const nuevosFiltros: ReservaProformaFilters = {
            ordenamiento: filters.ordenamiento,
        };

        // ✅ NUEVO (2026-07-22): Búsqueda unificada de proforma (ID o número)
        if (filterInputs.proforma_busqueda) {
            nuevosFiltros.proforma_busqueda = filterInputs.proforma_busqueda;
        }

        // ✅ NUEVO (2026-07-18): Filtro por nombre de cliente
        if (filterInputs.cliente_nombre) {
            nuevosFiltros.cliente_nombre = filterInputs.cliente_nombre;
        }
        if (filterInputs.estado) {
            nuevosFiltros.estado = filterInputs.estado;
        }
        // ✅ NUEVO: Agregar filtro por producto
        if (filterInputs.producto_id) {
            nuevosFiltros.producto_id = parseInt(filterInputs.producto_id);
        }
        // ✅ NUEVO (2026-02-12): Agregar búsqueda flexible por producto
        if (filterInputs.producto_busqueda) {
            nuevosFiltros.producto_busqueda = filterInputs.producto_busqueda;
        }
        if (filterInputs.vencimiento) {
            nuevosFiltros.vencimiento = filterInputs.vencimiento;
        }
        if (filterInputs.fecha_creacion_desde) {
            nuevosFiltros.fecha_creacion_desde = filterInputs.fecha_creacion_desde;
        }
        if (filterInputs.fecha_creacion_hasta) {
            nuevosFiltros.fecha_creacion_hasta = filterInputs.fecha_creacion_hasta;
        }
        // ✅ NUEVO (2026-07-18): Agregar filtro por fecha de reserva
        if (filterInputs.fecha_reserva_desde) {
            nuevosFiltros.fecha_reserva_desde = filterInputs.fecha_reserva_desde;
        }
        if (filterInputs.fecha_reserva_hasta) {
            nuevosFiltros.fecha_reserva_hasta = filterInputs.fecha_reserva_hasta;
        }
        if (filterInputs.fecha_vencimiento_desde) {
            nuevosFiltros.fecha_vencimiento_desde = filterInputs.fecha_vencimiento_desde;
        }
        if (filterInputs.fecha_vencimiento_hasta) {
            nuevosFiltros.fecha_vencimiento_hasta = filterInputs.fecha_vencimiento_hasta;
        }

        // ✅ NUEVO (2026-02-12): Logging en consola de filtros aplicados
        console.group('🎯 [ReservasTable] Aplicar Filtros');
        console.log('📝 Inputs del usuario:', filterInputs);
        console.log('✨ Filtros a enviar:', nuevosFiltros);
        if (nuevosFiltros.producto_busqueda) {
            console.warn('🔍 ¡BÚSQUEDA DE PRODUCTO ACTIVA!', {
                busqueda: nuevosFiltros.producto_busqueda,
                tipo: 'ID/SKU/Nombre (case insensitive)',
                prioridad: 'ID → SKU → Nombre',
            });
        }
        console.groupEnd();

        setFilters(nuevosFiltros);
        setCurrentPage(1);
        onFiltersChange?.(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        setFilterInputs({
            // ✅ NUEVO (2026-07-22): Limpiar búsqueda unificada de proforma
            proforma_busqueda: '',
            // ✅ NUEVO (2026-07-18): Limpiar filtro de nombre de cliente
            cliente_nombre: '',
            estado: '',
            producto_id: '', // ✅ NUEVO: Limpiar filtro de producto
            producto_busqueda: '', // ✅ NUEVO (2026-02-12): Limpiar búsqueda de producto
            vencimiento: '',
            fecha_creacion_desde: today,
            fecha_creacion_hasta: '',
            // ✅ NUEVO (2026-07-18): Limpiar filtro de fecha de reserva
            fecha_reserva_desde: today,
            fecha_reserva_hasta: today,
            fecha_vencimiento_desde: '',
            fecha_vencimiento_hasta: '',
        });
        setFilters({
            ordenamiento: 'fecha_expiracion-asc',
            // ✅ NUEVO (2026-07-18): Mantener filtro por fecha de reserva (hoy por defecto)
            fecha_reserva_desde: today,
            fecha_reserva_hasta: today,
        });
        setCurrentPage(1);
        onFiltersChange?.({
            ordenamiento: 'fecha_expiracion-asc',
            fecha_reserva_desde: today,
            fecha_reserva_hasta: today,
        });
    };

    const contarFiltrosActivos = () => {
        return Object.values(filterInputs).filter((v) => v !== '').length;
    };

    const handleLiberar = async (id: number) => {
        if (!confirm('¿Liberar esta reserva? El stock volverá a estar disponible.')) {
            return;
        }

        try {
            setLiberando(id);
            const result = await reservasProformaApi.liberar(id);

            if (result.success) {
                // Recargar tabla
                cargarReservas();

                // Mostrar notificación
                const evento = new CustomEvent('notification', {
                    detail: {
                        type: 'success',
                        message: 'Reserva liberada exitosamente',
                    },
                });
                window.dispatchEvent(evento);
            }
        } catch (error) {
            console.error('Error liberando reserva:', error);
            const evento = new CustomEvent('notification', {
                detail: {
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Error al liberar reserva',
                },
            });
            window.dispatchEvent(evento);
        } finally {
            setLiberando(null);
        }
    };

    const getEstadoBadge = (estado: string) => {
        const colors: Record<string, string> = {
            ACTIVA: 'bg-blue-100 text-blue-800',
            LIBERADA: 'bg-gray-100 text-gray-800',
            CONSUMIDA: 'bg-green-100 text-green-800',
        };
        return colors[estado] || 'bg-gray-100 text-gray-800';
    };

    const getVencimientoBadge = (reserva: ReservaProforma) => {
        if (reserva.estado !== 'ACTIVA') {
            return null;
        }

        if (reserva.esta_expirada) {
            return (
                <Badge className="flex items-center gap-1 bg-red-100 text-red-800">
                    <AlertTriangle className="h-3 w-3" />
                    Expirada
                </Badge>
            );
        }

        if (reserva.dias_para_expirar !== null && reserva.dias_para_expirar <= 1) {
            return (
                <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                    <AlertTriangle className="h-3 w-3" />
                    Vence hoy
                </Badge>
            );
        }

        return (
            <Badge className="flex items-center gap-1 bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3" />
                Vigente
            </Badge>
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
        }).format(value);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    return (
        <div className="space-y-4">
            {/* Filtros Avanzados */}
            <div className="p-2">
                <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="flex w-full items-center justify-between text-left">
                    <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">🎛️ Filtros Avanzados</h3>
                        {contarFiltrosActivos() > 0 && (
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                                {contarFiltrosActivos()} activo{contarFiltrosActivos() !== 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                </button>

                {showAdvancedFilters && (
                    <div className="space-y-4">
                        {/* 🎯 BÚSQUEDA RÁPIDA: Proforma y Cliente */}
                        <div className="rounded-md border-b border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                            <h4 className="mb-3 text-sm font-semibold text-blue-900 dark:text-blue-200">🔍 Búsqueda Rápida</h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                {/* ✅ NUEVO (2026-07-22): Búsqueda unificada de Proforma */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        📋 Proforma (ID o Número)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: 2469 o PF-20260717-2469"
                                        value={filterInputs.proforma_busqueda}
                                        onChange={(e) => handleFilterChange('proforma_busqueda', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">ID (exacto) o número (parcial)</p>
                                </div>

                                {/* ✅ NUEVO (2026-07-18): Búsqueda por Nombre de Cliente */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">👤 Nombre del Cliente</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: BRIGIDA CHACA"
                                        value={filterInputs.cliente_nombre}
                                        onChange={(e) => handleFilterChange('cliente_nombre', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Búsqueda parcial, case insensitive</p>
                                </div>

                                {/* ✅ NUEVO (2026-02-12): Filtro por Producto - Búsqueda flexible */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        📦 Producto (ID, SKU o Nombre)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: 123 o LAC-001 o Lactose"
                                        value={filterInputs.producto_busqueda}
                                        onChange={(e) => handleFilterChange('producto_busqueda', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Busca por ID (prioridad), SKU o nombre (case insensitive)
                                    </p>
                                </div>
                                {/* Estado */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">✅ Estado de Reserva</label>
                                    <select
                                        value={filterInputs.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="ACTIVA">🟢 Activa</option>
                                        <option value="LIBERADA">⚫ Liberada</option>
                                        <option value="CONSUMIDA">✅ Consumida</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* ✅ IMPORTANTE: Filtro de Fecha de Reserva (PRINCIPAL) */}
                            <div className="rounded-md border-l-4 border-green-500 bg-green-50 p-3 dark:bg-green-900/20">
                                <h4 className="mb-3 text-sm font-semibold text-green-900 dark:text-green-200">📦 Fechas de Reserva (PRINCIPAL)</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Desde</label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_reserva_desde}
                                            onChange={(e) => handleFilterChange('fecha_reserva_desde', e.target.value)}
                                            className="w-full rounded-md border-2 border-green-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-green-700 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Hasta</label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_reserva_hasta}
                                            onChange={(e) => handleFilterChange('fecha_reserva_hasta', e.target.value)}
                                            className="w-full rounded-md border-2 border-green-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-green-700 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filtro de Fecha de Creación */}
                            <div>
                                <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">📅 Fechas de Creación</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Desde</label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_creacion_desde}
                                            onChange={(e) => handleFilterChange('fecha_creacion_desde', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Hasta</label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_creacion_hasta}
                                            onChange={(e) => handleFilterChange('fecha_creacion_hasta', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filtro de Fecha de Vencimiento */}
                            <div>
                                <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">⏰ Fechas de Vencimiento</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Desde</label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_vencimiento_desde}
                                            onChange={(e) => handleFilterChange('fecha_vencimiento_desde', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Hasta</label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_vencimiento_hasta}
                                            onChange={(e) => handleFilterChange('fecha_vencimiento_hasta', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex gap-2 pt-2">
                            <Button onClick={aplicarFiltros} className="bg-blue-600 text-white hover:bg-blue-700">
                                🔍 Aplicar Filtros
                            </Button>
                            {contarFiltrosActivos() > 0 && (
                                <Button
                                    onClick={limpiarFiltros}
                                    variant="outline"
                                    className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                >
                                    ✕ Limpiar Filtros
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Resumen */}
            {/* {summary && (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs text-gray-500">Total</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{summary.total_registros}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs font-medium text-blue-600">Activas</div>
                            <div className="text-lg font-bold text-blue-600">{summary.activas}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs font-medium text-red-600">Expiradas</div>
                            <div className="text-lg font-bold text-red-600">{summary.expiradas}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs font-medium text-yellow-600">Pronto</div>
                            <div className="text-lg font-bold text-yellow-600">{summary.proximo_a_expirar}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs font-medium text-green-600">Consumidas</div>
                            <div className="text-lg font-bold text-green-600">{summary.consumidas}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs font-medium text-purple-600">Valor Total</div>
                            <div className="text-sm font-bold text-purple-600">{formatCurrency(summary.valor_total_reservado)}</div>
                        </CardContent>
                    </Card>
                </div>
            )} */}

            {/* Tabla */}
            <div>
                {loading ? (
                    <div className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-500"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Cargando reservas...</p>
                        </div>
                    </div>
                ) : reservas.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No hay reservas para mostrar</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                                <tr>
                                    <th className="px-2 py-2 text-left font-medium text-gray-700 dark:text-gray-300">ID</th>
                                    <th className="px-2 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Pro ID</th>
                                    <th className="px-2 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Numero</th>
                                    <th className="px-2 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Cliente</th>
                                    <th className="px-2 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Producto</th>
                                    {/* ✅ NUEVO (2026-07-22): Columna de lote */}
                                    <th className="px-2 py-2 text-left font-medium text-gray-700 dark:text-gray-300">🏷️ Lote</th>
                                    <th className="px-2 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Cantidad</th>
                                    <th className="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Creada</th>
                                    <th className="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Reserva</th>
                                    <th className="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Venci. Reserva</th>
                                    <th className="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Venci. Lote</th>
                                    <th className="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Estado</th>
                                    <th className="px-2 py-2 text-center font-medium text-gray-700 dark:text-gray-300">-</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-2 py-2">#{reserva.id}</td>
                                        <td className="px-2 py-2">
                                            <Link
                                                href={`/proformas/${reserva.proforma_id}`}
                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                #{reserva.proforma_id}
                                            </Link>
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="text-xs text-gray-900 dark:text-white">{reserva.proforma_numero}</div>
                                            {/* <div className="text-xs text-gray-500">Creada: </div> */}
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="text-sm text-gray-900 dark:text-white">{reserva.cliente_nombre}</div>
                                            <div className="text-xs text-gray-500">{reserva.cliente_nit}</div>
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="text-xs text-gray-900 dark:text-white">{reserva.producto_nombre}</div>
                                            <div className="text-xs text-gray-500">{reserva.producto_sku}</div>
                                        </td>
                                        {/* ✅ NUEVO (2026-07-22): Columna de lote */}
                                        <td className="px-2 py-2">
                                            <div className="text-xs font-mono text-gray-900 dark:text-white">
                                                {reserva.lote ? `Lote: ${reserva.lote}` : '-'}
                                            </div>
                                            {reserva.fecha_vencimiento_lote && (
                                                <div className="text-xs text-gray-500">
                                                    Vence: {formatDate(reserva.fecha_vencimiento_lote)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 text-right">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                {reserva.cantidad_reservada.toFixed(2)}
                                            </span>
                                        </td>
                                        {/* <td className="px-4 py-3 text-right">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(reserva.valor_reservado)}
                                                </div>
                                            </td> */}
                                        <td className="px-2 py-2 text-center text-xs">{formatDate(reserva.created_at)}</td>
                                        <td className="px-2 py-2 text-center text-xs">{formatDate(reserva.fecha_reserva)}</td>
                                        <td className="px-2 py-2 text-center text-xs">{formatDate(reserva.fecha_expiracion)}</td>
                                        {/* ✅ NUEVO (2026-07-22): Columna de vencimiento del lote */}
                                        <td className="px-2 py-2 text-center text-xs">
                                            {reserva.fecha_vencimiento_lote ? (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span>{formatDate(reserva.fecha_vencimiento_lote)}</span>
                                                    {new Date(reserva.fecha_vencimiento_lote) < new Date() && (
                                                        <Badge className="bg-red-100 text-red-800 text-xs">Vencido</Badge>
                                                    )}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-2 py-2 text-center text-xs">
                                            <Badge className={getEstadoBadge(reserva.estado)}>{reserva.estado}</Badge>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            {/* ✅ NUEVO (2026-07-18): Menú de 3 puntos para acciones */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Acciones">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    {/* Ver detalles */}
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedReserva(reserva)}
                                                        className="flex cursor-pointer items-center gap-2"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span>Ver detalles</span>
                                                    </DropdownMenuItem>

                                                    {/* Liberar (solo si está ACTIVA) */}
                                                    {reserva.estado === 'ACTIVA' && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleLiberar(reserva.id)}
                                                            disabled={liberando === reserva.id}
                                                            className="flex cursor-pointer items-center gap-2 text-red-600 dark:text-red-400"
                                                        >
                                                            {liberando === reserva.id ? (
                                                                <>
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent dark:border-red-400" />
                                                                    <span>Liberando...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="h-4 w-4" />
                                                                    <span>Liberar reserva</span>
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Mostrando{' '}
                            <strong>
                                {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, totalReservas)}
                            </strong>{' '}
                            de <strong>{totalReservas}</strong> reservas
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                                    .map((page, idx, arr) => {
                                        if (idx > 0 && page !== arr[idx - 1] + 1) {
                                            return (
                                                <span key={`dots-${page}`} className="px-2 text-gray-500">
                                                    ...
                                                </span>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={page}
                                                variant={page === currentPage ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Detalles */}
            {selectedReserva && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                    <Card className="w-full max-w-2xl">
                        <CardContent className="p-6">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detalle de Reserva #{selectedReserva.id}</h2>
                                <button
                                    onClick={() => setSelectedReserva(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Proforma</p>
                                    <p className="font-medium">{selectedReserva.proforma_numero}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Cliente</p>
                                    <p className="font-medium">{selectedReserva.cliente_nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Producto</p>
                                    <p className="font-medium">{selectedReserva.producto_nombre}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Almacén</p>
                                    <p className="font-medium">{selectedReserva.almacen_nombre}</p>
                                </div>
                                {/* ✅ NUEVO (2026-07-22): Información del lote */}
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">🏷️ Lote</p>
                                    <p className="font-mono font-medium">{selectedReserva.lote || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Vencimiento Lote</p>
                                    <p className="font-medium">{selectedReserva.fecha_vencimiento_lote ? formatDate(selectedReserva.fecha_vencimiento_lote) : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Cantidad Reservada</p>
                                    <p className="font-medium">{selectedReserva.cantidad_reservada}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Stock Disponible</p>
                                    <p className="font-medium">{selectedReserva.stock_disponible}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Fecha Reserva</p>
                                    <p className="font-medium">{formatDate(selectedReserva.fecha_reserva)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Vencimiento Reserva</p>
                                    <p className="font-medium">{formatDate(selectedReserva.fecha_expiracion)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Estado</p>
                                    <Badge className={getEstadoBadge(selectedReserva.estado)}>{selectedReserva.estado}</Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Valor Total</p>
                                    <p className="font-medium text-purple-600">{formatCurrency(selectedReserva.valor_reservado)}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedReserva(null)}>
                                    Cerrar
                                </Button>
                                {selectedReserva.estado === 'ACTIVA' && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            handleLiberar(selectedReserva.id);
                                            setSelectedReserva(null);
                                        }}
                                        disabled={liberando === selectedReserva.id}
                                    >
                                        {liberando === selectedReserva.id ? 'Liberando...' : 'Liberar Reserva'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

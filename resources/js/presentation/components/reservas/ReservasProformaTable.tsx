import React, { useState, useEffect } from 'react';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Eye, Trash2, ChevronDown } from 'lucide-react';
import type { ReservaProforma, ReservaProformaFilters } from '@/domain/entities/reservas-proforma';
import { reservasProformaApi } from '@/application/api/reservas-proforma';

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
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Obtener fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const [filters, setFilters] = useState<ReservaProformaFilters>({
        ordenamiento: 'fecha_expiracion-asc',
        fecha_creacion_desde: today,  // Filtro por defecto: solo hoy
        fecha_creacion_hasta: today,  // ✅ NUEVO (2026-02-12): Limitar a solo hoy
    });
    const [filterInputs, setFilterInputs] = useState({
        proforma_numero: '',
        estado: '',
        producto_id: '',  // ✅ NUEVO: Filtro por producto (ID exacto)
        producto_busqueda: '',  // ✅ NUEVO (2026-02-12): Búsqueda flexible por ID, SKU o nombre
        vencimiento: '',
        fecha_creacion_desde: today,
        fecha_creacion_hasta: '',
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
            console.table(response.data.map((r: any) => ({
                id: r.id,
                proforma: r.proforma_numero,
                producto: r.producto_nombre,
                cantidad: r.cantidad_reservada,
                estado: r.estado,
                vencimiento: r.fecha_expiracion
            })));
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
        setFilterInputs(prev => ({ ...prev, [key]: value }));
    };

    const aplicarFiltros = () => {
        const nuevosFiltros: ReservaProformaFilters = {
            ordenamiento: filters.ordenamiento,
        };

        if (filterInputs.proforma_numero) {
            nuevosFiltros.proforma_numero = filterInputs.proforma_numero;
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
                prioridad: 'ID → SKU → Nombre'
            });
        }
        console.groupEnd();

        setFilters(nuevosFiltros);
        setCurrentPage(1);
        onFiltersChange?.(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        setFilterInputs({
            proforma_numero: '',
            estado: '',
            producto_id: '',  // ✅ NUEVO: Limpiar filtro de producto
            producto_busqueda: '',  // ✅ NUEVO (2026-02-12): Limpiar búsqueda de producto
            vencimiento: '',
            fecha_creacion_desde: today,
            fecha_creacion_hasta: '',
            fecha_vencimiento_desde: '',
            fecha_vencimiento_hasta: '',
        });
        setFilters({
            ordenamiento: 'fecha_expiracion-asc',
            fecha_creacion_desde: today,  // Mantener filtro por defecto: solo hoy
            fecha_creacion_hasta: today,  // ✅ NUEVO (2026-02-12): Mantener límite de hoy
        });
        setCurrentPage(1);
        onFiltersChange?.({
            ordenamiento: 'fecha_expiracion-asc',
            fecha_creacion_desde: today,
            fecha_creacion_hasta: today,
        });
    };

    const contarFiltrosActivos = () => {
        return Object.values(filterInputs).filter(v => v !== '').length;
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
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Expirada
                </Badge>
            );
        }

        if (reserva.dias_para_expirar !== null && reserva.dias_para_expirar <= 1) {
            return (
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Vence hoy
                </Badge>
            );
        }

        return (
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
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
            <Card>
                <CardContent className="p-4">
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="w-full flex items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                🎛️ Filtros Avanzados
                            </h3>
                            {contarFiltrosActivos() > 0 && (
                                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                                    {contarFiltrosActivos()} activo{contarFiltrosActivos() !== 1 ? 's' : ''}
                                </Badge>
                            )}
                        </div>
                        <ChevronDown
                            className={`w-5 h-5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {showAdvancedFilters && (
                        <div className="mt-4 space-y-4">
                            {/* Primera fila de filtros */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Búsqueda de Proforma */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        📋 Número de Proforma
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: PRO-001"
                                        value={filterInputs.proforma_numero}
                                        onChange={(e) => handleFilterChange('proforma_numero', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                 placeholder-gray-500 dark:placeholder-gray-400
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {/* ✅ NUEVO (2026-02-12): Filtro por Producto - Búsqueda flexible */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        📦 Producto (ID, SKU o Nombre)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: 123 o LAC-001 o Lactose"
                                        value={filterInputs.producto_busqueda}
                                        onChange={(e) => handleFilterChange('producto_busqueda', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                 placeholder-gray-500 dark:placeholder-gray-400
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Busca por ID (prioridad), SKU o nombre (case insensitive)
                                    </p>
                                </div>

                                {/* Estado */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        ✅ Estado de Reserva
                                    </label>
                                    <select
                                        value={filterInputs.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="ACTIVA">🟢 Activa</option>
                                        <option value="LIBERADA">⚫ Liberada</option>
                                        <option value="CONSUMIDA">✅ Consumida</option>
                                    </select>
                                </div>

                                

                                {/* Vencimiento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        ⏰ Filtro de Vencimiento
                                    </label>
                                    <select
                                        value={filterInputs.vencimiento}
                                        onChange={(e) => handleFilterChange('vencimiento', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sin filtro</option>
                                        <option value="vigente">✅ Vigentes</option>
                                        <option value="pronto">⚠️ Próximas a expirar</option>
                                        <option value="expirada">🔴 Expiradas</option>
                                    </select>
                                </div>
                            </div>

                            {/* Segunda fila: Filtros de Fecha de Creación */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    📅 Rango de Fechas de Creación
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_creacion_desde}
                                            onChange={(e) => handleFilterChange('fecha_creacion_desde', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_creacion_hasta}
                                            onChange={(e) => handleFilterChange('fecha_creacion_hasta', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tercera fila: Filtros de Fecha de Vencimiento */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    ⏰ Rango de Fechas de Vencimiento
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_vencimiento_desde}
                                            onChange={(e) => handleFilterChange('fecha_vencimiento_desde', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={filterInputs.fecha_vencimiento_hasta}
                                            onChange={(e) => handleFilterChange('fecha_vencimiento_hasta', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={aplicarFiltros}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    🔍 Aplicar Filtros
                                </Button>
                                {contarFiltrosActivos() > 0 && (
                                    <Button
                                        onClick={limpiarFiltros}
                                        variant="outline"
                                        className="text-orange-600 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                    >
                                        ✕ Limpiar Filtros
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resumen */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs text-gray-500">Total</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {summary.total_registros}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs text-blue-600 font-medium">Activas</div>
                            <div className="text-lg font-bold text-blue-600">{summary.activas}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs text-red-600 font-medium">Expiradas</div>
                            <div className="text-lg font-bold text-red-600">{summary.expiradas}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs text-yellow-600 font-medium">Pronto</div>
                            <div className="text-lg font-bold text-yellow-600">{summary.proximo_a_expirar}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs text-green-600 font-medium">Consumidas</div>
                            <div className="text-lg font-bold text-green-600">{summary.consumidas}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-3">
                            <div className="text-xs text-purple-600 font-medium">Valor Total</div>
                            <div className="text-sm font-bold text-purple-600">
                                {formatCurrency(summary.valor_total_reservado)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tabla */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6 text-center">
                            <div className="flex justify-center items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Cargando reservas...
                                </p>
                            </div>
                        </div>
                    ) : reservas.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                No hay reservas para mostrar
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Proforma
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Cliente
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Producto
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Almacén
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                                            Cantidad
                                        </th>
                                        {/* <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                                            Valor
                                        </th> */}
                                        <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                                            Vencimiento
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {reservas.map((reserva) => (
                                        <tr
                                            key={reserva.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    <p>Folio Reserva: {reserva.id}</p>
                                                    <p>Folio Proforma: {reserva.proforma_id}</p>
                                                    {reserva.proforma_numero}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Creada: {formatDate(reserva.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {reserva.cliente_nombre}
                                                </div>
                                                <div className="text-xs text-gray-500">{reserva.cliente_nit}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {reserva.producto_nombre}
                                                </div>
                                                <div className="text-xs text-gray-500">{reserva.producto_sku}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    {reserva.almacen_nombre}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                    {reserva.cantidad_reservada.toFixed(2)}
                                                </span>
                                            </td>
                                            {/* <td className="px-4 py-3 text-right">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(reserva.valor_reservado)}
                                                </div>
                                            </td> */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    {getVencimientoBadge(reserva)}
                                                    {reserva.estado === 'ACTIVA' && (
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                            {reserva.dias_para_expirar !== null
                                                                ? `${Math.round(reserva.dias_para_expirar)} días`
                                                                : 'N/A'}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge className={getEstadoBadge(reserva.estado)}>
                                                    {reserva.estado}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => setSelectedReserva(reserva)}
                                                        title="Ver detalles"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>

                                                    {reserva.estado === 'ACTIVA' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleLiberar(reserva.id)}
                                                            disabled={liberando === reserva.id}
                                                            title="Liberar reserva"
                                                        >
                                                            {liberando === reserva.id ? (
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Mostrando{' '}
                                <strong>
                                    {(currentPage - 1) * perPage + 1}-
                                    {Math.min(currentPage * perPage, totalReservas)}
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
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(
                                            (page) =>
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                        )
                                        .map((page, idx, arr) => {
                                            if (idx > 0 && page !== arr[idx - 1] + 1) {
                                                return (
                                                    <span
                                                        key={`dots-${page}`}
                                                        className="px-2 text-gray-500"
                                                    >
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
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de Detalles */}
            {selectedReserva && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Detalle de Reserva #{selectedReserva.id}
                                </h2>
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
                                    <p className="text-xs text-gray-500 uppercase">Vencimiento</p>
                                    <p className="font-medium">
                                        {formatDate(selectedReserva.fecha_expiracion)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Estado</p>
                                    <Badge className={getEstadoBadge(selectedReserva.estado)}>
                                        {selectedReserva.estado}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Valor Total</p>
                                    <p className="font-medium text-purple-600">
                                        {formatCurrency(selectedReserva.valor_reservado)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6 justify-end">
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

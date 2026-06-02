import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/presentation/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Eye, AlertTriangle } from 'lucide-react';
import MovimientoDetallesModal from './MovimientoDetallesModal';

interface MovimientoInventario {
    id: number;
    numero: string;
    numero_documento?: string;  // ✅ NUEVO: Referencia a venta/proforma/etc (VEN20260212-0001)
    fecha: string;
    created_at: string;  // ✅ NUEVO (2026-02-11): Fecha de creación del registro
    tipo: string;
    producto: {
        id?: number;
        nombre: string;
        codigo: string;
        sku?: string;
    };
    almacen: {
        nombre: string;
    };
    stock_producto_id?: number;  // ✅ NUEVO (2026-02-12): ID del stock
    lote?: string;  // ✅ NUEVO (2026-02-12): Número de lote
    cantidad: number;
    cantidad_anterior: number;  // ✅ NUEVO: Cantidad antes del movimiento
    cantidad_posterior: number;  // ✅ NUEVO: Cantidad después del movimiento
    motivo: string;
    usuario: {
        name: string;
        rol?: string;
    };
    // ✅ NUEVO (2026-02-18): Información de conversiones de unidades
    es_conversion_aplicada?: boolean;
    cantidad_solicitada?: number;
    factor_conversion?: number;
    unidad_venta_nombre?: string;
    unidad_base_nombre?: string;  // ✅ NUEVO: Nombre de la unidad base (almacenamiento)
    // ✅ NUEVO (2026-03-26): Información completa de cantidades
    cantidad_total_anterior?: number;
    cantidad_total_posterior?: number;
    cantidad_reservada_anterior?: number;
    cantidad_reservada_posterior?: number;
    // ✅ NUEVO (2026-03-26): Observaciones del movimiento
    observaciones?: string;
    referencia?: string;
    referencia_tipo?: string;
    referencia_id?: number;
    anulado?: boolean;
    motivo_anulacion?: string;
    // ✅ NUEVO (2026-06-02): Detección de inconsistencias
    tiene_inconsistencia?: boolean;
    inconsistencias?: string[];
    // ✅ NUEVO (2026-06-02): Stock esperado correcto
    tiene_error_stock?: boolean;
    total_esperado_anterior?: number;
    total_esperado_posterior?: number;
    disponible_esperado_anterior?: number;
    disponible_esperado_posterior?: number;
    reserva_esperada_anterior?: number;
    reserva_esperada_posterior?: number;
}

interface PaginationInfo {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface MovimientosTableProps {
    movimientos: MovimientoInventario[];
    isLoading?: boolean;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void; // ✅ NUEVO: Callback para cambiar items por página
}

const MovimientosTable: React.FC<MovimientosTableProps> = ({
    movimientos = [],
    isLoading = false,
    pagination,
    onPageChange,
    onPerPageChange // ✅ NUEVO: Recibir callback para cambiar items por página
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoInventario | null>(null);
    const [mostrarStockEsperado, setMostrarStockEsperado] = useState(false); // ✅ NUEVO (2026-06-02): Toggle para stock esperado

    // ✅ NUEVO: Verificar si hay movimientos con error
    const hayErrorStock = movimientos.some(m => m.tiene_error_stock);
    const getTipoColor = (tipo: string) => {
        const colors: Record<string, string> = {
            'ENTRADA': 'bg-green-100 text-green-800',
            'SALIDA': 'bg-red-100 text-red-800',
            'TRANSFERENCIA_ENTRADA': 'bg-blue-100 text-blue-800',
            'TRANSFERENCIA_SALIDA': 'bg-yellow-100 text-yellow-800',
            'AJUSTE': 'bg-purple-100 text-purple-800',
            'AJUSTE_COMPRA': 'bg-cyan-100 text-cyan-800',
            'RESERVA': 'bg-orange-100 text-orange-800',
            'RESERVA_PROFORMA': 'bg-indigo-100 text-indigo-800',
            'LIBERACION_RESERVA': 'bg-amber-100 text-amber-800',
            'CONSUMO_RESERVA': 'bg-pink-100 text-pink-800',
            'ENTRADA_AJUSTE': 'bg-emerald-100 text-emerald-800',
            'SALIDA_AJUSTE': 'bg-rose-100 text-rose-800',
            'ENTRADA_COMPRA': 'bg-teal-100 text-teal-800',
            'ENTRADA_AJUSTE_COMPRA': 'bg-cyan-100 text-cyan-800',
        };
        return colors[tipo] || 'bg-gray-100 text-gray-800';
    };

    const handleOpenDetalles = (movimiento: MovimientoInventario) => {
        setSelectedMovimiento(movimiento);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center text-muted-foreground">
                        Cargando movimientos...
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <TooltipProvider>
            <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Número</TableHead>
                            {/* <TableHead className="min-w-fit">Fecha</TableHead>
                            <TableHead className="min-w-fit">Hora</TableHead> */}
                            {/* <TableHead className="min-w-fit">📝 Creado</TableHead> */}
                            {/* <TableHead>Tipo</TableHead> */}
                            <TableHead>Producto</TableHead>
                            <TableHead>Almacén</TableHead>
                            {/* ✅ NUEVO (2026-02-12): Columna de Stock ID y Lote */}
                            {/* <TableHead>📦 Stock / Lote</TableHead> */}
                            <TableHead className="text-center">Cant. Anterior</TableHead>
                            <TableHead className="text-center">Cambio</TableHead>
                            <TableHead className="text-center">Cant. Posterior</TableHead>
                            {/* ✅ NUEVO (2026-06-02): Columna de stock esperado (solo si hay error) */}
                            {hayErrorStock && mostrarStockEsperado && (
                                <TableHead className="text-center bg-yellow-50 dark:bg-yellow-900/20">Stock Esperado</TableHead>
                            )}
                            {/* ✅ NUEVO (2026-02-18): Columna de conversiones de unidades */}
                            {/* <TableHead className="text-center">📐 Conversión</TableHead> */}
                            {/* ✅ NUEVO: Columna de documento relacionado (venta/proforma) */}
                            {/* <TableHead>📋 Documento</TableHead> */}
                            {/* <TableHead>Motivo</TableHead> */}
                            {/* <TableHead>Usuario</TableHead> */}
                            {/* ✅ NUEVO (2026-02-12): Columna de detalles */}
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movimientos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                                    No hay movimientos para mostrar
                                </TableCell>
                            </TableRow>
                        ) : (
                            movimientos.map((movimiento) => (
                                <TableRow
                                    key={movimiento.id}
                                    className={movimiento.tiene_inconsistencia ? 'bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500' : ''}
                                    title={movimiento.inconsistencias?.length ? 'Inconsistencias: ' + movimiento.inconsistencias.join(', ') : ''}
                                >
                                    <TableCell className="font-medium">
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                {movimiento.tiene_inconsistencia && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-xs">
                                                                <div className="text-sm space-y-1">
                                                                    {movimiento.inconsistencias?.map((inc, idx) => (
                                                                        <div key={idx}>• {inc}</div>
                                                                    ))}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                                #{movimiento.id}
                                            </div>
                                            <div className="text-sm">{movimiento.referencia}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                <div>{new Date(movimiento.created_at).toLocaleDateString('es-ES')}</div>
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    {new Date(movimiento.created_at).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="text-sm mt-2">{movimiento.motivo}</div>
                                            <div>{movimiento.usuario.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{movimiento.producto.nombre}</div>
                                            <div className="text-sm text-muted-foreground">
                                                #{movimiento.producto.id} | {movimiento.producto.sku}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="mb-2">{movimiento.almacen.nombre}</div>

                                        <Badge className={getTipoColor(movimiento.tipo)}>
                                            {movimiento.tipo}
                                        </Badge>
                                        <div className="text-sm">
                                            <div className="font-medium">
                                                {movimiento.stock_producto_id ? (
                                                    <span className="text-blue-600 dark:text-blue-400">
                                                        ID Stock: {movimiento.stock_producto_id}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Lote: {movimiento.lote || '-'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/* ✅ NUEVO: Cantidad Anterior - Mostrar todos los valores directamente */}
                                    <TableCell className="text-center text-xs font-medium">
                                        <div className="space-y-1">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">Total</p>
                                                <p className="text-blue-700 dark:text-blue-400 font-bold">
                                                    {(movimiento.cantidad_total_anterior !== undefined && movimiento.cantidad_total_anterior !== null)
                                                        ? movimiento.cantidad_total_anterior
                                                        : (movimiento.cantidad_anterior !== undefined && movimiento.cantidad_anterior !== null)
                                                        ? movimiento.cantidad_anterior
                                                        : 0}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">Disponible</p>
                                                <p className="text-green-700 dark:text-green-400 font-bold">
                                                    {movimiento.cantidad_disponible_anterior !== undefined && movimiento.cantidad_disponible_anterior !== null
                                                        ? movimiento.cantidad_disponible_anterior
                                                        : 0}
                                                </p>
                                            </div>
                                            <div className="bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">Reservada</p>
                                                <p className="text-orange-700 dark:text-orange-400 font-bold">
                                                    {movimiento.cantidad_reservada_anterior !== undefined && movimiento.cantidad_reservada_anterior !== null
                                                        ? movimiento.cantidad_reservada_anterior
                                                        : 0}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/* ✅ NUEVO: Cambio (Cantidad) */}
                                    <TableCell className="text-center font-bold">
                                        <span className={
                                            movimiento.cantidad > 0
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                        }>
                                            {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                                        </span>
                                    </TableCell>
                                    {/* ✅ NUEVO: Cantidad Posterior - Mostrar todos los valores directamente */}
                                    <TableCell className="text-center text-xs font-medium">
                                        <div className="space-y-1">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">Total</p>
                                                <p className="text-blue-700 dark:text-blue-400 font-bold">
                                                    {(movimiento.cantidad_total_posterior !== undefined && movimiento.cantidad_total_posterior !== null)
                                                        ? movimiento.cantidad_total_posterior
                                                        : (movimiento.cantidad_posterior !== undefined && movimiento.cantidad_posterior !== null)
                                                        ? movimiento.cantidad_posterior
                                                        : 0}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">Disponible</p>
                                                <p className="text-green-700 dark:text-green-400 font-bold">
                                                    {movimiento.cantidad_disponible_posterior !== undefined && movimiento.cantidad_disponible_posterior !== null
                                                        ? movimiento.cantidad_disponible_posterior
                                                        : 0}
                                                </p>
                                            </div>
                                            <div className="bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">Reservada</p>
                                                <p className="text-orange-700 dark:text-orange-400 font-bold">
                                                    {movimiento.cantidad_reservada_posterior !== undefined && movimiento.cantidad_reservada_posterior !== null
                                                        ? movimiento.cantidad_reservada_posterior
                                                        : 0}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    {/* ✅ NUEVO (2026-06-02): Columna de Stock Esperado (solo si hay error y está habilitada) */}
                                    {hayErrorStock && mostrarStockEsperado && (
                                        <TableCell className="text-center text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20">
                                            {movimiento.tiene_error_stock ? (
                                                <div className="space-y-1">
                                                    <div className="bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                                        <p className="text-gray-600 dark:text-gray-400 text-xs">Total</p>
                                                        <p className="text-blue-700 dark:text-blue-400 font-bold">
                                                            Ant: {movimiento.total_esperado_anterior}<br/>
                                                            Pos: {movimiento.total_esperado_posterior}
                                                        </p>
                                                    </div>
                                                    <div className="bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                                                        <p className="text-gray-600 dark:text-gray-400 text-xs">Disponible</p>
                                                        <p className="text-green-700 dark:text-green-400 font-bold">
                                                            Ant: {movimiento.disponible_esperado_anterior}<br/>
                                                            Pos: {movimiento.disponible_esperado_posterior}
                                                        </p>
                                                    </div>
                                                    <div className="bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">
                                                        <p className="text-gray-600 dark:text-gray-400 text-xs">Reservada</p>
                                                        <p className="text-orange-700 dark:text-orange-400 font-bold">
                                                            Ant: {movimiento.reserva_esperada_anterior}<br/>
                                                            Pos: {movimiento.reserva_esperada_posterior}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 dark:text-gray-600 text-xs">Sin error</p>
                                            )}
                                        </TableCell>
                                    )}

                                    {/* ✅ NUEVO (2026-03-26): Botón simple para ver detalles */}
                                    <TableCell className="text-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenDetalles(movimiento)}
                                            className="h-8 w-8 p-0"
                                            title="Ver detalles y observaciones completas del movimiento"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Paginación */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                            {/* ✅ NUEVO (2026-06-02): Toggle para mostrar stock esperado */}
                            {hayErrorStock && (
                                <button
                                    onClick={() => setMostrarStockEsperado(!mostrarStockEsperado)}
                                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                                        mostrarStockEsperado
                                            ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {mostrarStockEsperado ? '✓ Stock Esperado' : 'Stock Esperado'}
                                </button>
                            )}
                            <div className="text-sm text-muted-foreground">
                                Mostrando <strong>{pagination.from}</strong> a <strong>{pagination.to}</strong> de <strong>{pagination.total}</strong> resultados
                            </div>

                            {/* ✅ NUEVO: Selector de items por página */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="per_page" className="text-sm text-muted-foreground">Items por página:</label>
                                <select
                                    id="per_page"
                                    value={pagination.per_page === 999999 ? 'todos' : pagination.per_page}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        onPerPageChange?.(val === 'todos' ? 999999 : parseInt(val));
                                    }}
                                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="todos">Mostrar todos</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.current_page === 1}
                                onClick={() => onPageChange?.(pagination.current_page - 1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => {
                                    // Mostrar solo páginas cercanas a la actual
                                    if (
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                    ) {
                                        return (
                                            <Button
                                                key={page}
                                                variant={page === pagination.current_page ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => onPageChange?.(page)}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    }

                                    // Mostrar puntos suspensivos
                                    if (page === pagination.current_page - 2 || page === pagination.current_page + 2) {
                                        return (
                                            <span key={`dots-${page}`} className="px-2 text-muted-foreground">
                                                ...
                                            </span>
                                        );
                                    }

                                    return null;
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pagination.current_page === pagination.last_page}
                                onClick={() => onPageChange?.(pagination.current_page + 1)}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

            {/* ✅ NUEVO (2026-02-12): Modal de detalles del movimiento */}
            <MovimientoDetallesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                movimiento={selectedMovimiento}
            />
            </CardContent>
        </Card>
        </TooltipProvider>
    );
};

export default MovimientosTable;

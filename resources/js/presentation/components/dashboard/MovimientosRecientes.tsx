/**
 * Componente: Movimientos Recientes
 * Mejorado con soporte para conversiones de unidades
 *
 * Renderiza una tabla de los últimos movimientos de inventario
 * Con información sobre conversiones cuando aplica
 */

import { Link } from '@inertiajs/react';
import type { MovimientoReciente } from '@/domain/entities/dashboard-inventario';

interface MovimientosRecientesExtendido extends MovimientoReciente {
    es_conversion_aplicada?: boolean;
    cantidad_solicitada?: number;
    factor_conversion?: number;
    unidad_venta_nombre?: string;
    unidad_base_nombre?: string;  // ✅ NUEVO (2026-02-18): Unidad base
    fecha?: string;
    numero_documento?: string;
}

interface MovimientosRecientesProps {
    movimientos: MovimientosRecientesExtendido[];
    canViewAll: boolean;
}

export default function MovimientosRecientes({
    movimientos,
    canViewAll,
}: MovimientosRecientesProps) {
    // Helper para formatear números
    const formatCantidad = (valor: number | string | undefined): string => {
        if (!valor) return '0.00';
        const num = typeof valor === 'string' ? parseFloat(valor) : valor;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Movimientos Recientes
                    </h3>
                    {canViewAll && (
                        <Link
                            href="/inventario/movimientos"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                            Ver todos →
                        </Link>
                    )}
                </div>
            </div>
            <div className="p-6">
                {movimientos.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay movimientos recientes.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {movimientos.map((movimiento) => (
                            <div
                                key={movimiento.id}
                                className="flex flex-col p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                                {/* Fila principal */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {movimiento.stockProducto?.producto?.nombre || 'Producto desconocido'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {movimiento.stockProducto?.almacen?.nombre || 'Almacén desconocido'}
                                        </p>
                                        {movimiento.numero_documento && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Doc: <span className="font-semibold">{movimiento.numero_documento}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right ml-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                movimiento.tipo === 'ENTRADA_COMPRA'
                                                    ? 'text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200'
                                                    : movimiento.tipo === 'SALIDA_VENTA'
                                                        ? 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200'
                                                        : 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
                                            }`}
                                        >
                                            {movimiento.tipo.replace(/_/g, ' ')}
                                        </span>
                                        <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold mt-1">
                                            {movimiento.cantidad > 0 ? '+' : ''}{formatCantidad(movimiento.cantidad)}
                                        </p>
                                    </div>
                                </div>

                                {/* ✅ MEJORADO (2026-02-18): Mostrar conversión con comparativa antes/cambio/después */}
                                {movimiento.es_conversion_aplicada && (
                                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1 text-xs">
                                        {/* EN UNIDAD DE VENTA */}
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded border border-orange-200 dark:border-orange-800">
                                            <div className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">
                                                📦 {movimiento.unidad_venta_nombre}
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                                <div className="text-center">
                                                    <div className="text-gray-500">Antes</div>
                                                    <div className="font-bold text-orange-700 dark:text-orange-400">
                                                        {movimiento.cantidad_anterior && movimiento.factor_conversion
                                                            ? formatCantidad(Number(movimiento.cantidad_anterior) * Number(movimiento.factor_conversion))
                                                            : '-'
                                                        }
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-500">Cambio</div>
                                                    <div className="font-bold text-red-600 dark:text-red-400">
                                                        {formatCantidad(movimiento.cantidad_solicitada)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-500">Después</div>
                                                    <div className="font-bold text-orange-700 dark:text-orange-400">
                                                        {movimiento.cantidad_posterior && movimiento.factor_conversion
                                                            ? formatCantidad(Number(movimiento.cantidad_posterior) * Number(movimiento.factor_conversion))
                                                            : '-'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* EN UNIDAD BASE */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded border border-blue-200 dark:border-blue-800">
                                            <div className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-1">
                                                📦 {movimiento.unidad_base_nombre || 'Unidad'}
                                            </div>
                                            <div className="grid grid-cols-3 gap-1">
                                                <div className="text-center">
                                                    <div className="text-gray-500">Antes</div>
                                                    <div className="font-bold text-blue-700 dark:text-blue-400">
                                                        {formatCantidad(movimiento.cantidad_anterior)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-500">Cambio</div>
                                                    <div className="font-bold text-red-600 dark:text-red-400">
                                                        {formatCantidad(movimiento.cantidad)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-500">Después</div>
                                                    <div className="font-bold text-blue-700 dark:text-blue-400">
                                                        {formatCantidad(movimiento.cantidad_posterior)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Componente: TablaPreciosComponent
 * Tabla expandible para mostrar productos y sus precios
 */

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/compras.utils';
import type { ProductoConPreciosDTO } from '@/domain/entities/precios';

interface TablaPreciosProps {
    productos: ProductoConPreciosDTO[];
    onEditarPrecio: (precio: any) => void;
    onVerHistorial: (precioId: number) => void;
    onBuscarCompras?: (productoId: number) => void;
    loading?: boolean;
}

const getMargenColor = (porcentaje: number): string => {
    if (porcentaje > 20) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20';
    if (porcentaje > 10) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20';
    if (porcentaje < 10) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
};

const getPrecioCardClass = (requiereRevision: boolean, actualizadoRecientemente: boolean): string => {
    if (requiereRevision) {
        return 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-800';
    }
    if (actualizadoRecientemente) {
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/10';
    }
    return 'border-gray-200 dark:border-slate-700';
};

export const TablaPreciosComponent: React.FC<TablaPreciosProps> = ({
    productos,
    onEditarPrecio,
    onVerHistorial,
    onBuscarCompras,
    loading = false,
}) => {
    const [expandedProductIds, setExpandedProductIds] = useState<Set<number>>(new Set());

    const toggleProductExpand = (productId: number) => {
        const newExpanded = new Set(expandedProductIds);
        if (newExpanded.has(productId)) {
            newExpanded.delete(productId);
        } else {
            newExpanded.add(productId);
        }
        setExpandedProductIds(newExpanded);
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-900/50 p-8 text-center border border-gray-200 dark:border-slate-700">
                <div className="inline-block animate-spin">
                    <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full" />
                </div>
                <p className="mt-4 text-gray-600 dark:text-slate-400">Cargando precios...</p>
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-900/50 p-8 text-center border border-gray-200 dark:border-slate-700">
                <p className="text-gray-600 dark:text-slate-400">No se encontraron productos con precios</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-900/50 overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                        <tr>
                            <th className="w-8 px-4 py-3"></th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-slate-50">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-slate-50">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-slate-50">
                                Tipos de Precio
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {productos.map((producto) => {
                            const isExpanded = expandedProductIds.has(producto.id);
                            return (
                                <React.Fragment key={producto.id}>
                                    {/* Fila del Producto */}
                                    <tr
                                        onClick={() => toggleProductExpand(producto.id)}
                                        className={`hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                                            producto.tiene_diferencia_costo_en_compra
                                                ? 'bg-red-50 dark:bg-red-950/10 border-l-4 border-red-500'
                                                : producto.costo_cambio_reciente
                                                ? 'bg-amber-50 dark:bg-amber-950/10 border-l-4 border-amber-500'
                                                : ''
                                        }`}
                                    >
                                        <td className="w-8 px-4 py-4 text-center">
                                            <button className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-400 transition-colors">
                                                <svg
                                                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-50">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span>{producto.nombre}</span>
                                                {producto.tiene_diferencia_costo_en_compra && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100">
                                                        ⛔ Diferencia de Costo en Compra
                                                    </span>
                                                )}
                                                {producto.costo_cambio_reciente && !producto.tiene_diferencia_costo_en_compra && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                                                        ⚠ Costo Actualizado
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-slate-400">
                                                SKU: {producto.sku || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                                            {producto.categoria?.nombre || 'Sin categoría'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                                    {producto.precios.length} tipo{producto.precios.length !== 1 ? 's' : ''}
                                                </span>
                                                {producto.precios.some(p => p.requiere_revision) && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                                                        {producto.precios.filter(p => p.requiere_revision).length} pendiente
                                                    </span>
                                                )}
                                                {onBuscarCompras && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onBuscarCompras(producto.id);
                                                        }}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                                        title="Buscar compras con diferencia de costo"
                                                    >
                                                        🔍 Compras
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Fila Expandida - Precios */}
                                    {isExpanded && (
                                        <tr className="bg-gray-50 dark:bg-slate-800/30">
                                            <td colSpan={4} className="px-6 py-4">
                                                {/* Advertencia de diferencia de costo */}
                                                {producto.tiene_diferencia_costo_en_compra && (
                                                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg">
                                                        <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                                                            ⛔ Este producto tiene una diferencia entre el precio de costo actual y algún precio unitario en las compras.
                                                        </p>
                                                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                                            Revisa el precio de costo (COSTO) en las compras y actualiza si es necesario.
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="space-y-3">
                                                    {producto.precios
                                                        .sort((a, b) => a.id - b.id)
                                                        .map((precio) => {
                                                        // Destacar el precio COSTO si hay diferencia
                                                        const esCosto = precio.tipo.codigo === 'COSTO';
                                                        const debeDestacarseCosto = producto.tiene_diferencia_costo_en_compra && esCosto;

                                                        return (
                                                        <div
                                                            key={precio.id}
                                                            className={`flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-sm transition-shadow ${
                                                                debeDestacarseCosto
                                                                    ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/20 ring-2 ring-red-200 dark:ring-red-800'
                                                                    : getPrecioCardClass(
                                                                        precio.requiere_revision || false,
                                                                        precio.actualizado_recientemente || false
                                                                    )
                                                            }`}
                                                        >
                                                            {/* Tipo de Precio y Detalles */}
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span
                                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                                                                            style={{
                                                                                backgroundColor: precio.tipo.color || '#999999',
                                                                            }}
                                                                        >
                                                                            {precio.tipo.nombre}
                                                                        </span>
                                                                        {precio.requiere_revision && (
                                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 w-fit">
                                                                                ⚠ Requiere revisión
                                                                            </span>
                                                                        )}
                                                                        {precio.actualizado_recientemente && !precio.requiere_revision && (
                                                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 w-fit">
                                                                                ✓ Actualizado
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-50">
                                                                            {formatCurrency(precio.precio_actual)}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 dark:text-slate-400">
                                                                            Ganancia: {formatCurrency(precio.margen_ganancia)} ({precio.porcentaje_ganancia.toFixed(1)}%)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Margen con Colores */}
                                                            <div
                                                                className={`px-3 py-2 rounded text-xs font-medium mx-4 ${getMargenColor(
                                                                    precio.porcentaje_ganancia
                                                                )}`}
                                                            >
                                                                {precio.porcentaje_ganancia.toFixed(1)}%
                                                            </div>

                                                            {/* Último Cambio */}
                                                            <div className="text-xs text-gray-500 dark:text-slate-400 min-w-[120px] text-center">
                                                                <div>
                                                                    {new Date(precio.updated_at || '').toLocaleDateString()}
                                                                </div>
                                                                {precio.motivo_cambio && (
                                                                    <div className="text-gray-400 dark:text-slate-500 truncate">
                                                                        {precio.motivo_cambio}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Acciones */}
                                                            <div className="flex gap-2 ml-4">
                                                                <button
                                                                    onClick={() => onEditarPrecio(precio)}
                                                                    className="px-3 py-1 bg-blue-500 dark:bg-blue-700 text-white text-xs rounded hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
                                                                >
                                                                    Editar
                                                                </button>
                                                                {/* <button
                                                                    onClick={() => onVerHistorial(precio.id)}
                                                                    className="px-3 py-1 bg-gray-400 dark:bg-slate-700 text-white text-xs rounded hover:bg-gray-500 dark:hover:bg-slate-600 transition-colors"
                                                                >
                                                                    Historial
                                                                </button> */}
                                                            </div>
                                                        </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

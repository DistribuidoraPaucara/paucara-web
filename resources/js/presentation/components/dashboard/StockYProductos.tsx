/**
 * Componente: Stock por Almacén y Productos Más Movidos
 * Mejorado con soporte para productos fraccionados
 *
 * Renderiza tabla de stock_productos y productos con mayor movimiento
 * Con visualización expandible de conversiones para productos fraccionados
 */

import { useState, useMemo, useEffect } from 'react';
import React from 'react';
import type { StockPorAlmacen, ProductoMasMovido } from '@/domain/entities/dashboard-inventario';
import FiltrosStock, { type FiltrosState, RANGOS_STOCK } from './FiltrosStock';
import { ImprimirStockButton } from '../impresion/ImprimirStockButton';

interface StockYProductosProps {
    stockPorAlmacen: StockPorAlmacen[];
    productosMasMovidos: ProductoMasMovido[];
}

export default function StockYProductos({
    stockPorAlmacen,
    productosMasMovidos,
}: StockYProductosProps) {

    // console.log('Renderizando StockYProductos con stockPorAlmacen:', stockPorAlmacen);

    const [filtros, setFiltros] = useState<FiltrosState>({
        busqueda: '',
        almacenId: '',
        rangoStock: 'todos',
        ordenamiento: 'producto',  // ✅ CHANGED (2026-02-11): Ordenar alfabético por nombre de producto
    });

    // Estado para datos filtrados del backend
    const [stockFiltradoApi, setStockFiltradoApi] = useState<StockPorAlmacen[]>(stockPorAlmacen);
    const [cargando, setCargando] = useState(false);

    // Estado para filas expandidas (mostrar conversiones)
    const [expandedRows, setExpandedRows] = useState<Set<number | string>>(new Set());

    // Estado para diálogo de confirmación de eliminación
    const [loteParaEliminar, setLoteParaEliminar] = useState<{
        stockProductoId: number;
        lote: string;
        producteName: string;
    } | null>(null);
    const [eliminando, setEliminando] = useState(false);

    // Obtener lista única de almacenes
    const almacenes = useMemo(() => {
        const almacenesMap = new Map();
        stockPorAlmacen.forEach((stock) => {
            if (!almacenesMap.has(stock.almacen_id)) {
                almacenesMap.set(stock.almacen_id, {
                    id: stock.almacen_id,
                    nombre: stock.almacen_nombre,
                });
            }
        });
        return Array.from(almacenesMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [stockPorAlmacen]);

    // Llamar al API cuando cambien los filtros
    useEffect(() => {
        const obtenerStockFiltrado = async () => {
            try {
                setCargando(true);

                const params = new URLSearchParams();
                if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
                if (filtros.almacenId) params.append('almacen_id', filtros.almacenId);
                params.append('rango_stock', filtros.rangoStock);
                params.append('ordenamiento', filtros.ordenamiento);
                if (filtros.soloConStock) params.append('solo_con_stock', 'true');

                const response = await fetch(`/api/inventario/stock-filtrado?${params.toString()}`);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const json = await response.json();

                if (json.success) {
                    setStockFiltradoApi(json.data);
                } else {
                    console.error('Error en respuesta API:', json.message);
                    setStockFiltradoApi([]);
                }
            } catch (error) {
                console.error('Error al obtener stock filtrado:', error);
                setStockFiltradoApi([]);
            } finally {
                setCargando(false);
            }
        };

        // Ejecutar inmediatamente (sin debounce) ya que la búsqueda requiere Enter o Botón
        obtenerStockFiltrado();
    }, [filtros]);

    // Alias para mantener el nombre stockFiltrado en el resto del código
    const stockFiltrado = stockFiltradoApi;

    // Función para obtener el token CSRF
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        return token || '';
    };

    // Función para eliminar un lote (stock_producto)
    const eliminarLote = async (stockProductoId: number) => {
        try {
            setEliminando(true);
            const response = await fetch(`/api/stock/productos/${stockProductoId}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken(),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            // Recargar datos después de eliminar
            const params = new URLSearchParams();
            if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
            if (filtros.almacenId) params.append('almacen_id', filtros.almacenId);
            params.append('rango_stock', filtros.rangoStock);
            params.append('ordenamiento', filtros.ordenamiento);
            if (filtros.soloConStock) params.append('solo_con_stock', 'true');

            const reloadResponse = await fetch(`/api/inventario/stock-filtrado?${params.toString()}`);
            if (reloadResponse.ok) {
                const json = await reloadResponse.json();
                if (json.success) {
                    setStockFiltradoApi(json.data);
                }
            }

            // Mostrar mensaje de éxito
            const evento = new CustomEvent('notification', {
                detail: {
                    type: 'success',
                    message: `Lote "${loteParaEliminar?.lote}" eliminado correctamente`,
                },
            });
            window.dispatchEvent(evento);
        } catch (error) {
            console.error('Error eliminando lote:', error);
            const evento = new CustomEvent('notification', {
                detail: {
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Error al eliminar lote',
                },
            });
            window.dispatchEvent(evento);
        } finally {
            setEliminando(false);
            setLoteParaEliminar(null);
        }
    };

    // Toggle para expandir/colapsar filas
    const toggleRow = (stockIdOrKey: number | string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(stockIdOrKey)) {
            newExpanded.delete(stockIdOrKey);
        } else {
            newExpanded.add(stockIdOrKey);
        }
        setExpandedRows(newExpanded);
    };

    // Función helper para formatear cantidades con 2 decimales
    const formatCantidad = (valor: number | string): string => {
        const num = typeof valor === 'string' ? parseFloat(valor) : valor;
        return isNaN(num) ? '0.00' : num.toFixed(2);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Filtros */}
            <FiltrosStock almacenes={almacenes} onFiltrosChange={setFiltros} />

            {/* Tabla de Stock por Producto y Almacén */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Stock de Productos por Almacén
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Inventario detallado con soporte para productos fraccionados
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                {stockFiltrado.length} de {stockPorAlmacen.length} registros
                            </p>
                            <ImprimirStockButton
                                stock={stockFiltrado}
                                almacenFiltro={
                                    filtros.almacenId
                                        ? almacenes.find((a) => a.id === parseInt(filtros.almacenId))?.nombre
                                        : undefined
                                }
                                busquedaFiltro={filtros.busqueda || undefined}
                                rangoStockFiltro={filtros.rangoStock !== 'todos' ? filtros.rangoStock : undefined}
                                ordenamientoFiltro={filtros.ordenamiento}
                                soloConStockFiltro={filtros.soloConStock}
                                filtrosCompletos={filtros}
                            />
                        </div>
                    </div>
                </div>
                {stockPorAlmacen.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No hay información de stock disponible
                        </p>
                    </div>
                ) : cargando ? (
                    <div className="p-6 text-center">
                        <div className="flex justify-center items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Filtrando datos...
                            </p>
                        </div>
                    </div>
                ) : stockFiltrado.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No hay registros que coincidan con los filtros seleccionados
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                                        {/* Columna para expandir */}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Almacén
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Stock Total
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Disponible
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Reservado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Lote
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Vencimiento
                                    </th>
                                    {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Valor Total
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {stockFiltrado.map((stock) => {
                                    // Clave única por producto + almacén
                                    const uniqueKey = `${stock.producto_id}-${stock.almacen_id}`;
                                    const cantidadTotal = parseFloat(String(stock.cantidad || 0));
                                    const cantidadDisponible = parseFloat(String(stock.cantidad_disponible || 0));
                                    const cantidadReservada = parseFloat(String(stock.cantidad_reservada || 0));
                                    const precioVenta = parseFloat(String(stock.precio_venta || 0));
                                    const valorTotal = cantidadTotal * precioVenta;
                                    const isExpanded = expandedRows.has(uniqueKey);

                                    // Verificar si tiene detalles de lotes para expandir
                                    const tieneLotes = stock.detalles_lotes && stock.detalles_lotes.length > 0;
                                    const tieneMultiplesLotes = tieneLotes && stock.detalles_lotes.length > 1;

                                    // Conversiones del primer detalle (para compatibilidad)
                                    const primeraConversion = stock.detalles_lotes?.[0]?.conversiones || [];
                                    const hasFractionedInfo = stock.es_fraccionado && primeraConversion.length > 0;

                                    return (
                                        <React.Fragment key={uniqueKey}>
                                            {/* Fila principal */}
                                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                <td className="px-1 py-1 whitespace-nowrap text-center">
                                                    {(hasFractionedInfo || tieneMultiplesLotes) && (
                                                        <button
                                                            onClick={() => toggleRow(uniqueKey)}
                                                            className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-400"
                                                            title={isExpanded ? 'Colapsar' : 'Expandir detalles'}
                                                        >
                                                            <svg
                                                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''
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
                                                    )}
                                                </td>
                                                <td className="px-1 py-1 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                #{stock.producto_id} | {stock.producto_nombre}
                                                                <br />
                                                                {stock.es_fraccionado && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                                                                        Fraccionado
                                                                    </span>
                                                                )}
                                                            </p>

                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {stock.producto_codigo_barra && (
                                                                <>Cod B.: {stock.producto_codigo_barra}</>
                                                            )}
                                                        </p>
                                                        {stock.producto_sku && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Cod.: {stock.producto_sku}
                                                            </p>
                                                        )}
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                                            {stock.unidad_medida_nombre}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        {stock.almacen_nombre}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {formatCantidad(cantidadTotal)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        {formatCantidad(cantidadDisponible)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        {formatCantidad(cantidadReservada)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {tieneMultiplesLotes ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                                            {stock.detalles_lotes.length} lotes
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                            {tieneLotes ? stock.detalles_lotes[0].lote : '-'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-medium ${
                                                        stock.fecha_vencimiento_proximo
                                                            ? 'text-gray-700 dark:text-gray-300'
                                                            : 'text-gray-400 dark:text-gray-500'
                                                    }`}>
                                                        {stock.fecha_vencimiento_proximo ? stock.fecha_vencimiento_proximo : '-'}
                                                    </span>
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        Bs{valorTotal.toFixed(2)}
                                                    </span>
                                                </td> */}
                                            </tr>

                                            {/* Fila expandible: detalles por lote y conversiones */}
                                            {isExpanded && (tieneMultiplesLotes || hasFractionedInfo) && (
                                                <tr className="bg-gray-50 dark:bg-gray-700/50">
                                                    <td colSpan={8} className="px-6 py-4">
                                                        <div className="space-y-6">
                                                            {/* Detalles por Lote */}
                                                            {tieneMultiplesLotes && (
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                                        📦 Detalles por Lote
                                                                    </h4>
                                                                    <div className="overflow-x-auto">
                                                                        <table className="min-w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg">
                                                                            <thead className="bg-gray-200 dark:bg-gray-600">
                                                                                <tr>
                                                                                    <th className="px-3 py-2 text-left font-medium">Lote</th>
                                                                                    <th className="px-3 py-2 text-left font-medium">Vencimiento</th>
                                                                                    <th className="px-3 py-2 text-right font-medium">Cantidad</th>
                                                                                    <th className="px-3 py-2 text-right font-medium">Disponible</th>
                                                                                    <th className="px-3 py-2 text-right font-medium">Reservado</th>
                                                                                    <th className="px-3 py-2 text-center font-medium">Acciones</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                                                {stock.detalles_lotes?.map((lote, idx) => (
                                                                                    <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                                                                                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                                                                                            {lote.lote}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                                                                                            {lote.fecha_vencimiento ? (
                                                                                                <span className={lote.fecha_vencimiento === stock.fecha_vencimiento_proximo ? 'text-orange-600 dark:text-orange-400 font-semibold' : ''}>
                                                                                                    {lote.fecha_vencimiento}
                                                                                                </span>
                                                                                            ) : (
                                                                                                <span className="text-gray-400">-</span>
                                                                                            )}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-right text-gray-900 dark:text-white font-medium">
                                                                                            {formatCantidad(lote.cantidad)}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-right text-green-700 dark:text-green-400">
                                                                                            {formatCantidad(lote.cantidad_disponible)}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-right text-yellow-700 dark:text-yellow-400">
                                                                                            {formatCantidad(lote.cantidad_reservada)}
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-center">
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    setLoteParaEliminar({
                                                                                                        stockProductoId: lote.id,
                                                                                                        lote: lote.lote,
                                                                                                        producteName: stock.producto_nombre,
                                                                                                    })
                                                                                                }
                                                                                                className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition"
                                                                                                title="Eliminar lote"
                                                                                            >
                                                                                                <svg
                                                                                                    className="w-4 h-4"
                                                                                                    fill="currentColor"
                                                                                                    viewBox="0 0 20 20"
                                                                                                >
                                                                                                    <path
                                                                                                        fillRule="evenodd"
                                                                                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                                                        clipRule="evenodd"
                                                                                                    />
                                                                                                </svg>
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Conversiones de Unidades */}
                                                            {hasFractionedInfo && (
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                                        Conversiones de Unidades
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                        {/* Unidad base */}
                                                                        <div className="p-3 rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                                                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                                                                                Unidad Base ({stock.unidad_medida_nombre})
                                                                            </p>
                                                                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                                                                                {formatCantidad(cantidadTotal)}
                                                                            </p>
                                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                                                Disponible: {formatCantidad(cantidadDisponible)}
                                                                            </p>
                                                                        </div>

                                                                        {/* Conversiones */}
                                                                        {primeraConversion?.map((conv) => (
                                                                            <div
                                                                                key={conv.id}
                                                                                className="p-3 rounded-lg border-2 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20"
                                                                            >
                                                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                                                                                    {conv.unidad_destino_nombre}
                                                                                    <span className="text-orange-600 dark:text-orange-400 ml-1">
                                                                                        (÷ {formatCantidad(conv.factor_conversion)})
                                                                                    </span>
                                                                                </p>
                                                                                <p className="text-lg font-bold text-orange-700 dark:text-orange-400">
                                                                                    {formatCantidad(conv.cantidad_en_conversion)}
                                                                                </p>
                                                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                                                    Disponible:{' '}
                                                                                    {formatCantidad(cantidadDisponible * conv.factor_conversion)}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
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
                )}
            </div>

            {/* Productos Más Movidos */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Productos Más Movidos (Este Mes)
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Top 10 productos con mayor cantidad de movimientos
                    </p>
                </div>
                {productosMasMovidos.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No hay movimientos registrados
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Total Movimientos
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {productosMasMovidos.map((producto, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {producto.nombre_producto}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                {producto.total_movimientos}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Diálogo de Confirmación para Eliminar Lote */}
            {loteParaEliminar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full dark:bg-red-900/30 mb-4">
                            <svg
                                className="w-6 h-6 text-red-600 dark:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
                            ¿Eliminar lote?
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                            ¿Estás seguro de que deseas eliminar el lote <strong>{loteParaEliminar.lote}</strong> del
                            producto <strong>{loteParaEliminar.producteName}</strong>?
                        </p>

                        <p className="text-xs text-orange-600 dark:text-orange-400 text-center mb-6 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                            ⚠️ Esta acción se ejecutará incluso si el lote tiene movimientos asociados.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setLoteParaEliminar(null)}
                                disabled={eliminando}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => eliminarLote(loteParaEliminar.stockProductoId)}
                                disabled={eliminando}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                            >
                                {eliminando ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Eliminar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

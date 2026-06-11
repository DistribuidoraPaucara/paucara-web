import React, { Fragment } from 'react';
import { formatCurrencyWith2Decimals } from '@/lib/utils';
import type { DetalleProducto } from '../types';

interface ComboExpandedRowsProps {
    detalle: DetalleProducto;
    index: number;
    tipo: 'compra' | 'venta';
    readOnly?: boolean;
    comboItemsMap: Record<number, any[]>;
    setComboItemsMap: (value: any) => void;
    onComboItemsChange?: (detailIndex: number, items: any[]) => void;
}

export default function ComboExpandedRows({
    detalle,
    index,
    tipo,
    readOnly = false,
    comboItemsMap,
    setComboItemsMap,
    onComboItemsChange
}: ComboExpandedRowsProps) {
    const productoInfo = detalle.producto as any;
    const esCombo = productoInfo?.es_combo === true;
    const comboIdDisplay = productoInfo?.id;

    // Si no es combo, no renderizar nada
    if (!esCombo || !comboIdDisplay) {
        return null;
    }

    // ✅ SIMPLIFICADO: Mostrar TODOS los items del combo
    const detalleActual = detalle as any;
    const todosLosItems = (productoInfo.combo_items || detalleActual?.combo_items || []);

    // Items que el usuario seleccionó (guardados en proforma)
    const idsSeleccionados = new Set(
        (detalleActual?.combo_items_seleccionados || [])
            .map((item: any) => item.id)
    );

    // ✅ NUEVO: Obtener items actualizados de comboItemsMap si existen
    const itemsDelMapa = comboItemsMap[comboIdDisplay];

    // Mapear items para agregar flag "checked" y cantidad actualizada
    const itemsAMostrar = todosLosItems.map((item: any) => {
        const itemDelMapa = itemsDelMapa?.find((i: any) => i.id === item.id);
        const cantidadActualizada = itemDelMapa?.cantidad ?? item.cantidad;

        return {
            ...item,
            cantidad: cantidadActualizada,
            // ✅ IMPORTANTE: Los items obligatorios SIEMPRE están incluidos, los opcionales según lo seleccionado
            _isChecked: item.es_obligatorio === true ? true : idsSeleccionados.has(item.id)
        };
    });

    // ✅ NUEVO: Obtener información referencial de grupo_opcional
    const grupoOpcional = detalleActual?.grupo_opcional;
    const cantidadALlevar = grupoOpcional?.cantidad_a_llevar;

    // ✅ Contar items seleccionados vs totales
    const itemsSeleccionados = itemsAMostrar.filter((i: any) => i._isChecked === true);
    const totalItems = itemsAMostrar.length;

    return (
        <Fragment key={`combo-${index}`}>
            {/* ✅ INFORMACIÓN REFERENCIAL: Cantidad de productos opcionales a elegir */}
            {cantidadALlevar && (
                <tr className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-400">
                    <td colSpan={tipo === 'compra' ? 4 : 5} className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                            <span className="text-lg">ℹ️</span>
                            <span className="font-medium">Referencia:</span>
                            <span>Seleccionar <strong>{cantidadALlevar}</strong> producto{cantidadALlevar !== 1 ? 's' : ''} opcional{cantidadALlevar !== 1 ? 's' : ''}</span>
                        </div>
                    </td>
                </tr>
            )}

            {/* ✅ NUEVO: Header mostrando resumen de selección + cantidad obligatoria por producto */}
            <tr className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400">
                <td colSpan={tipo === 'compra' ? 4 : 5} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* <div className="flex items-center gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-medium">📦 Componentes:</span>
                            <span className="text-amber-700 dark:text-amber-300">
                                <strong className="text-green-600 dark:text-green-400">{itemsSeleccionados.length} seleccionados</strong>
                                {' '}/ {totalItems} disponibles
                            </span>
                        </div> */}
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-amber-600 dark:text-amber-400">💡 Cantidad obligatoria por combo:</span>
                            <span className="text-amber-700 dark:text-amber-300 font-medium bg-white dark:bg-zinc-800 px-2 py-1 rounded">
                                {itemsAMostrar
                                    .filter(i => i.es_obligatorio)
                                    .map(i => `${i.cantidad}×${i.producto_sku || i.producto_nombre}`)
                                    .join(' + ')}
                            </span>
                        </div>
                    </div>
                </td>
            </tr>

            {/* Mostrar TODOS los componentes del combo */}
            {itemsAMostrar.map((item: any, itemIndex: number) => (
                <tr key={`combo-item-${index}-${itemIndex}`} className={`border-l-4 py-1 ${item._isChecked === true
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-400'
                    : 'bg-gray-100 dark:bg-gray-800/50 opacity-60 border-gray-300'
                    }`}>
                    {/* Selector + Producto + Cantidad Obligatoria */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            {/* Checkbox */}
                            {item.es_obligatorio === false ? (
                                <input
                                    type="checkbox"
                                    checked={item._isChecked === true}
                                    disabled={readOnly}
                                    onChange={(e) => {
                                        const nuevosItems = [...itemsAMostrar];
                                        nuevosItems[itemIndex]._isChecked = e.target.checked;
                                        if (comboIdDisplay) {
                                            setComboItemsMap(prev => ({
                                                ...prev,
                                                [comboIdDisplay]: nuevosItems
                                            }));
                                        }
                                        onComboItemsChange?.(index, nuevosItems);
                                    }}
                                    className="w-4 h-1 rounded border-gray-300 text-green-600 cursor-pointer accent-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    title={readOnly ? (item._isChecked ? "Seleccionado" : "No seleccionado") : (item._isChecked ? "Deseleccionar" : "Seleccionar")}
                                />
                            ) : (
                                <span className="w-4 h-4 flex items-center justify-center text-green-600 dark:text-green-400 text-sm">✓</span>
                            )}
                            <div className="flex flex-col gap-0.5">
                                <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                    {item.producto_nombre}
                                    {item.es_obligatorio && <span className="text-purple-600 dark:text-purple-400 ml-1 text-xs">*</span>}
                                </div>
                                {/* ✅ NUEVO: Mostrar cantidad obligatoria por combo */}
                                <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-sm w-fit">
                                    📦 {item.cantidad} × combo
                                </div>
                            </div>
                        </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {item.producto_sku || '-'}
                        </span>
                    </td>

                    {/* Cantidad Total Calculada */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                            {/* ✅ NUEVO: Mostrar cálculo total como input read-only */}
                            <input
                                type="text"
                                readOnly
                                value={`${(item.cantidad * (detalle.cantidad || 1)).toFixed(2)}`}
                                className="w-28 px-2 py-1 text-sm font-bold border-2 border-green-400 dark:border-green-600 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-default text-center"
                                title={`${item.cantidad} × ${detalle.cantidad || 1} combo${(detalle.cantidad || 1) !== 1 ? 's' : ''}`}
                            />
                            {/* Detalles del cálculo */}
                            <div className="text-xs text-gray-600 dark:text-gray-400 px-2">
                                <span className="text-green-700 dark:text-green-400 font-semibold">
                                    {item.cantidad}
                                </span>
                                <span className="mx-1">×</span>
                                <span className="text-purple-700 dark:text-purple-400 font-semibold">
                                    {detalle.cantidad || 1}
                                </span>
                                {/* Stock disponible */}
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                                    📊 Stock: {item.stock_disponible ?? 0}
                                </span>
                            </div>

                        </div>
                    </td>

                    {/* Precio */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                            {formatCurrencyWith2Decimals(item.precio_unitario || 0)}
                        </span>
                    </td>

                    {tipo === 'compra' && (
                        <>
                            <td className="px-4 py-3 whitespace-nowrap"></td>
                            <td className="px-4 py-3 whitespace-nowrap"></td>
                        </>
                    )}

                    {/* Subtotal */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                            {formatCurrencyWith2Decimals((item.cantidad || 0) * (item.precio_unitario || 0))}
                        </span>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {item.producto_categoria || '-'}
                        </span>
                    </td>

                    {/* Unidad */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {item.unidad_medida_nombre || '-'}
                        </span>
                    </td>

                    {/* Marca */}
                    <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                            {item.producto_marca || '-'}
                        </span>
                    </td>
                </tr>
            ))}
        </Fragment>
    );
}

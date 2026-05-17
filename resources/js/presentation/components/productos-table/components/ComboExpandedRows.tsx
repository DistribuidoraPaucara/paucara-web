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
            _isChecked: idsSeleccionados.has(item.id)
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

            {/* ✅ NUEVO: Header mostrando resumen de selección + stock */}
            <tr className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400">
                <td colSpan={tipo === 'compra' ? 4 : 5} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400 font-medium">📦 Componentes:</span>
                            <span className="text-amber-700 dark:text-amber-300">
                                <strong className="text-green-600 dark:text-green-400">{itemsSeleccionados.length} seleccionados</strong>
                                {' '}/ {totalItems} disponibles
                            </span>
                        </div>
                        {/* <div className="flex items-center gap-2 text-sm">
                            <span className="text-amber-600 dark:text-amber-400">📊</span>
                            <span className="text-amber-700 dark:text-amber-300">
                                Stock: <strong className="text-blue-600 dark:text-blue-400">
                                    {productoInfo?.stock_disponible ?? '-'}
                                </strong>
                                {' '}/ <strong className="text-gray-600 dark:text-gray-400">
                                    {productoInfo?.stock_total ?? '-'}
                                </strong>
                            </span>
                        </div> */}
                    </div>
                </td>
            </tr>

            {/* Mostrar TODOS los componentes del combo */}
            {itemsAMostrar.map((item: any, itemIndex: number) => (
                <tr key={`combo-item-${index}-${itemIndex}`} className={`border-l-4 py-1 ${item._isChecked === true
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-400'
                    : 'bg-gray-100 dark:bg-gray-800/50 opacity-60 border-gray-300'
                    }`}>
                    <td className="py-1 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            {/* ✅ SIMPLIFICADO: Checkbox para todos los items, editable si proforma es PENDIENTE */}
                            {item.es_obligatorio === false ? (
                                <input
                                    type="checkbox"
                                    checked={item._isChecked === true}
                                    disabled={readOnly}
                                    onChange={(e) => {
                                        const nuevosItems = [...itemsAMostrar];
                                        nuevosItems[itemIndex]._isChecked = e.target.checked;
                                        // Notificar al parent component sobre los cambios
                                        if (comboIdDisplay) {
                                            setComboItemsMap(prev => ({
                                                ...prev,
                                                [comboIdDisplay]: nuevosItems
                                            }));
                                        }
                                        onComboItemsChange?.(index, nuevosItems);
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer accent-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    title={readOnly ? (item._isChecked ? "Producto seleccionado (solo lectura)" : "Producto no seleccionado (solo lectura)") : (item._isChecked ? "Click para deseleccionar" : "Click para seleccionar")}
                                />
                            ) : (
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                                </div>
                            )}
                            <div className="w-4 h-4 flex items-center justify-center">
                                <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                {item.producto_nombre}
                                {item.es_obligatorio && <span className="text-purple-600 dark:text-purple-400 ml-1">*</span>}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Cod.: {item.producto_sku}
                        </div>
                        {/* Stock del producto */}
                        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-1">
                            <span className="text-purple-600 dark:text-purple-400">📦</span>
                            <span>
                                Stock: <span className="font-semibold text-purple-700 dark:text-purple-300">
                                    {item.stock_disponible ?? '-'} / {item.stock_total ?? '-'}
                                </span>
                            </span>
                        </div>
                    </td>
                    <td className="py-1 whitespace-nowrap">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            disabled={readOnly}
                            value={item.cantidad || 0}
                            onChange={(e) => {
                                const nuevaCantidad = parseFloat(e.target.value) || 0;
                                const nuevosItems = [...itemsAMostrar];
                                nuevosItems[itemIndex].cantidad = nuevaCantidad;
                                // Usar comboIdDisplay para mantener consistencia
                                if (comboIdDisplay) {
                                    setComboItemsMap(prev => ({
                                        ...prev,
                                        [comboIdDisplay]: nuevosItems
                                    }));
                                }
                                onComboItemsChange?.(index, nuevosItems);
                            }}
                            className="w-16 px-2 py-1 text-xs border border-purple-300 dark:border-purple-600 rounded bg-white dark:bg-zinc-800 text-purple-700 dark:text-purple-300 font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {tipo === 'venta' && (
                            <div className="whitespace-nowrap text-xs text-purple-700 dark:text-purple-300">
                                {item.unidad_medida_nombre || 'N/A'}
                            </div>
                        )}
                    </td>

                    {tipo === 'compra' && (
                        <>
                            <td className="whitespace-nowrap text-xs text-purple-700 dark:text-purple-300 font-mono">
                                {formatCurrencyWith2Decimals(item.precio_unitario || 0)}
                            </td>
                            <td colSpan={2}></td>
                        </>
                    )}
                    {tipo === 'venta' && (
                        <td className="whitespace-nowrap text-xs text-purple-700 dark:text-purple-300 font-mono">
                            {formatCurrencyWith2Decimals(item.precio_unitario || 0)}
                        </td>
                    )}
                    <td className="whitespace-nowrap text-xs font-medium text-purple-700 dark:text-purple-300">
                        {formatCurrencyWith2Decimals((item.cantidad || 0) * (item.precio_unitario || 0))}
                    </td>
                </tr>
            ))}
        </Fragment>
    );
}

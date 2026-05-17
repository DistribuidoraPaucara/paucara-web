import React, { Fragment } from 'react';
import { formatCurrency, formatCurrencyWith2Decimals, formatCurrencyMinimalDecimals } from '@/lib/utils';
import type { DetalleProducto } from '../types';
import ComboExpandedRows from './ComboExpandedRows';

interface ProductoTableRowProps {
    detalle: DetalleProducto;
    index: number;
    tipo: 'compra' | 'venta';
    readOnly?: boolean;
    editingField: { index: number; field: string; value: string } | null;
    setEditingField: (value: { index: number; field: string; value: string } | null) => void;
    manuallySelectedTipoPrecio?: Record<number, boolean>;
    selectedTipoPrecio: Record<number, string | number>;
    setSelectedTipoPrecio: (value: Record<number, string | number>) => void;
    expandedCombos: Record<number, boolean>;
    setExpandedCombos: (value: Record<number, boolean>) => void;
    tieneDiferencia: boolean;
    esAumento: boolean;
    es_farmacia?: boolean;
    default_tipo_precio_id?: number | string;
    comboItemsMap: Record<number, any[]>;
    setComboItemsMap: (value: any) => void;
    onUpdateDetail: (index: number, field: string, value: any) => void;
    onRemoveDetail: (index: number) => void;
    onManualTipoPrecioChange?: (index: number) => void;
    onAbrirModalCascada: (index: number, detalle: DetalleProducto) => void;
    onComboItemsChange?: (detailIndex: number, items: any[]) => void;
    onMedicamentoInfo?: (producto: any) => void;
    calcularPrecioPorUnidad?: (precio: number, unidadId: number, conversiones: any[]) => number;
    formatearPrecioVenta?: (precio: number) => string;
    normalizeDateForInput?: (fecha: string | null) => string;
    onUpdateDetailUnidadConPrecio?: (index: number, unidadId: number, precio: number) => void;
}

export default function ProductoTableRow({
    detalle,
    index,
    tipo,
    readOnly = false,
    editingField,
    setEditingField,
    manuallySelectedTipoPrecio,
    selectedTipoPrecio,
    setSelectedTipoPrecio,
    expandedCombos,
    setExpandedCombos,
    tieneDiferencia,
    esAumento,
    es_farmacia = false,
    default_tipo_precio_id,
    comboItemsMap,
    setComboItemsMap,
    onUpdateDetail,
    onRemoveDetail,
    onManualTipoPrecioChange,
    onAbrirModalCascada,
    onComboItemsChange,
    onMedicamentoInfo,
    calcularPrecioPorUnidad = (precio) => precio,
    formatearPrecioVenta = (precio) => precio.toString(),
    normalizeDateForInput = (fecha) => fecha || '',
    onUpdateDetailUnidadConPrecio
}: ProductoTableRowProps) {
    const productoInfo = detalle.producto as any;
    const esCombo = productoInfo && productoInfo.es_combo;
    const precioCosto = detalle.precio_costo || productoInfo?.precio_costo || 0;

    const content = (
        <tr key={detalle.producto_id} className={`hover:bg-gray-50 dark:hover:bg-zinc-800 ${tipo === 'compra' && tieneDiferencia && esAumento
            ? 'bg-amber-50 dark:bg-amber-950/10 px-2 py-2'
            : tipo === 'compra' && tieneDiferencia && !esAumento
                ? 'bg-green-50 dark:bg-green-950/10 px-2 py-2'
                : ''
            }`}>
            {/* Producto Info */}
            <td className="py-2 whitespace-nowrap">
                <div className="text-gray-900 dark:text-white font-medium">
                    {productoInfo?.nombre || 'Producto no encontrado'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 text-left mt-1">
                    {/* SKU y Marca */}
                    <div className="flex items-center gap-2">
                        {(productoInfo?.sku || productoInfo?.codigo) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                                🏷️ {productoInfo.sku || productoInfo.codigo}
                            </span>
                        )}
                        {(productoInfo?.marca || productoInfo?.marca?.nombre) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                                🏢 {typeof productoInfo.marca === 'string' ? productoInfo.marca : productoInfo.marca?.nombre}
                            </span>
                        )}
                        {/* categoria */}
                        {(productoInfo?.categoria || productoInfo?.categoria?.nombre) && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                                🏢 {typeof productoInfo.categoria === 'string' ? productoInfo.categoria : productoInfo.categoria?.nombre}
                            </span>
                        )}
                    </div>
                    {productoInfo?.codigo_barras && productoInfo.codigo_barras !== productoInfo.sku && (
                        <div>Cod Barras: {productoInfo.codigo_barras}</div>
                    )}
                    {(() => {
                        const tieneDataMedicamentos = (productoInfo as any)?.principio_activo || (productoInfo as any)?.uso_de_medicacion;
                        const mostrarMedicamentos = es_farmacia && tieneDataMedicamentos;
                        return mostrarMedicamentos && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-0.5">
                                {(productoInfo as any)?.principio_activo && (
                                    <div>💊 P.A.: {(productoInfo as any).principio_activo}</div>
                                )}
                                {(productoInfo as any)?.uso_de_medicacion && (
                                    <div>📋 Uso: {(productoInfo as any).uso_de_medicacion}</div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* Stock Display */}
                <div>
                    {(() => {
                        const stockDisponible =
                            (productoInfo as any)?.stock_disponible_calc ??
                            (productoInfo as any)?.stock_disponible ??
                            (productoInfo as any)?.stock ??
                            0;

                        const stockTotal =
                            (productoInfo as any)?.stock_total_calc ??
                            (productoInfo as any)?.stock_total ??
                            0;

                        const esComboCampo = (productoInfo as any)?.es_combo;
                        const capacidad = (productoInfo as any)?.capacidad;

                        if (esComboCampo) {
                            return (
                                <div className="text-xs space-y-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold ml-1">
                                        📦 {stockDisponible ?? 0}
                                    </span>
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                                        {capacidad !== null && capacidad !== undefined ? 'combos' : '—'}
                                    </div>
                                </div>
                            );
                        }

                        const limiteProductos = (productoInfo as any)?.limite_productos;
                        const limiteVenta = (productoInfo as any)?.limite_venta;

                        return (
                            <div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-md font-semibold text-[12px] ${stockDisponible === 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200' :
                                    stockDisponible < 5 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200' :
                                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 text-xs'
                                    }`}>
                                    Disp.: {stockDisponible} / {stockTotal}
                                </span>
                                {/* {stockTotal > stockDisponible && (
                                    <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                                        Total: {stockTotal}
                                    </div>
                                )} */}
                                {limiteVenta !== null && limiteVenta !== undefined && (
                                    <div className="text-[12px] text-orange-600 dark:text-orange-400 mt-1 font-semibold">
                                        Límite Venta: {limiteVenta}
                                    </div>
                                )}
                                {limiteProductos !== null && limiteProductos !== undefined && (
                                    <div className="text-[12px] text-yellow-600 dark:text-yellow-400 mt-1 font-semibold">
                                        Límite Productos: {limiteProductos}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </td>

            {/* Cantidad */}
            <td className="whitespace-nowrap py-3">
                <input
                    type="text"
                    inputMode="decimal"
                    disabled={readOnly}
                    value={editingField?.index === index && editingField?.field === 'cantidad'
                        ? editingField.value
                        : detalle.cantidad.toString()}
                    placeholder="0.00"
                    onFocus={() => {
                        setEditingField({
                            index,
                            field: 'cantidad',
                            value: detalle.cantidad.toString()
                        });
                    }}
                    onChange={(e) => {
                        const valor = e.target.value;
                        setEditingField(prev => prev && prev.index === index
                            ? { ...prev, value: valor }
                            : prev);
                        if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
                            const num = valor === '' ? 0 : parseFloat(valor);
                            if (num >= 0) {
                                onUpdateDetail(index, 'cantidad', num);
                            }
                        }
                    }}
                    onBlur={() => {
                        setEditingField(null);
                    }}
                    className="w-32 px-1.5 py-1 text-xs border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                />
                <div>
                    {/* {tipo === 'venta' && (
                        
                    )} */}
                    <div className="whitespace-nowrap">
                        {(() => {
                            if (detalle.es_fraccionado && detalle.conversiones && detalle.conversiones.length > 0) {
                                const unidadInicial = detalle.unidad_venta_id || detalle.conversiones[0].unidad_destino_id;

                                return (
                                    <select
                                        disabled={readOnly}
                                        value={unidadInicial || ''}
                                        onChange={(e) => {
                                            const unidadSeleccionada = Number(e.target.value);
                                            const nuevoPrecio = calcularPrecioPorUnidad(
                                                detalle.producto?.precio_venta || 0,
                                                unidadSeleccionada,
                                                detalle.conversiones
                                            );

                                            if (onUpdateDetailUnidadConPrecio) {
                                                onUpdateDetailUnidadConPrecio(index, unidadSeleccionada, nuevoPrecio);
                                            } else {
                                                onUpdateDetail(index, 'unidad_venta_id', unidadSeleccionada);
                                                onUpdateDetail(index, 'precio_unitario', nuevoPrecio);
                                            }
                                        }}
                                        className="w-28 px-1.5 py-1 text-xs border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value={detalle.unidad_medida_id || ''}>
                                            {detalle.unidad_medida_nombre || 'Unidad Base'}
                                        </option>
                                        {detalle.conversiones.map((conv) => (
                                            <option key={conv.unidad_destino_id} value={conv.unidad_destino_id}>
                                                {conv.unidad_destino_nombre || `Unidad ${conv.unidad_destino_id}`}
                                            </option>
                                        ))}
                                    </select>
                                );
                            } else {
                                return (
                                    <div></div>
                                );
                            }
                        })()}
                        <div className="text-gray-500 dark:text-gray-400">
                            {detalle.unidad_medida_nombre || 'N/A'}
                        </div>
                    </div>
                </div>
            </td>

            {/* Precio Unitario (Compra) */}
            {tipo === 'compra' && (
                <>
                    <td className="whitespace-nowrap">
                        <input
                            type="text"
                            inputMode="decimal"
                            disabled={readOnly}
                            value={editingField?.index === index && editingField?.field === 'precio_unitario'
                                ? editingField.value
                                : detalle.precio_unitario.toString()}
                            placeholder="0.0000"
                            onFocus={() => {
                                setEditingField({
                                    index,
                                    field: 'precio_unitario',
                                    value: detalle.precio_unitario.toString()
                                });
                            }}
                            onChange={(e) => {
                                const valor = e.target.value;
                                setEditingField(prev => prev && prev.index === index
                                    ? { ...prev, value: valor }
                                    : prev);
                                if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
                                    const num = valor === '' ? 0 : parseFloat(valor);
                                    if (num >= 0) {
                                        onUpdateDetail(index, 'precio_unitario', num);
                                    }
                                }
                            }}
                            onBlur={() => {
                                setEditingField(null);
                            }}
                            className={`w-24 px-1.5 py-1 text-xs border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono ${tieneDiferencia
                                ? esAumento
                                    ? 'border-amber-300 dark:border-amber-700'
                                    : 'border-green-300 dark:border-green-700'
                                : 'border-gray-300 dark:border-zinc-600'
                                }`}
                        />
                        {tieneDiferencia && (
                            <div className={`text-xs font-semibold mt-0.5 ${esAumento
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-green-600 dark:text-green-400'
                                }`}>
                                {esAumento ? '↑' : '↓'} {formatCurrency(Math.abs(detalle.precio_unitario - precioCosto))}
                            </div>
                        )}
                        {detalle.es_fraccionado && detalle.conversiones && detalle.conversiones.length > 0 && (
                            <div className="whitespace-nowrap">
                                {(() => {
                                    const unidadActual = detalle.unidad_venta_id || detalle.unidad_medida_id;

                                    if (unidadActual === detalle.unidad_medida_id) {
                                        return (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatCurrency(detalle.precio_unitario)} / {detalle.unidad_medida_nombre || 'Base'}
                                            </div>
                                        );
                                    }

                                    const conversion = detalle.conversiones.find(
                                        c => c.unidad_destino_id === unidadActual
                                    );

                                    if (conversion && conversion.factor_conversion > 0) {
                                        const precioPorUnidad = detalle.precio_unitario / conversion.factor_conversion;
                                        return (
                                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                {formatCurrency(precioPorUnidad)} / {conversion.unidad_destino_nombre || `Unidad ${conversion.unidad_destino_id}`}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            N/A
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </td>

                    {/* Lote */}
                    <td className="whitespace-nowrap">
                        <input
                            type="text"
                            disabled={readOnly}
                            value={detalle.lote || ''}
                            placeholder="Ej: LOT-001"
                            onChange={(e) => {
                                onUpdateDetail(index, 'lote', e.target.value);
                            }}
                            className="w-28 px-2 py-1 text-xs border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </td>

                    {/* Fecha Vencimiento */}
                    <td className="whitespace-nowrap">
                        <input
                            type="date"
                            disabled={readOnly}
                            value={normalizeDateForInput(detalle.fecha_vencimiento)}
                            onChange={(e) => {
                                onUpdateDetail(index, 'fecha_vencimiento', e.target.value);
                            }}
                            className="w-32 px-2 py-1 text-xs border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </td>
                </>
            )}

            {/* Precio Venta + Tipo Precio */}
            {tipo === 'venta' && (
                <td className="whitespace-nowrap">
                    <input
                        type="text"
                        inputMode="decimal"
                        disabled={readOnly}
                        value={editingField?.index === index && editingField?.field === 'precio_venta'
                            ? editingField.value
                            : formatearPrecioVenta(detalle.precio_unitario)}
                        placeholder="0"
                        onFocus={() => {
                            setEditingField({
                                index,
                                field: 'precio_venta',
                                value: formatearPrecioVenta(detalle.precio_unitario)
                            });
                        }}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setEditingField(prev => prev && prev.index === index
                                ? { ...prev, value: valor }
                                : prev);
                            if (valor === '' || /^\d+$/.test(valor)) {
                                const num = valor === '' ? 0 : parseInt(valor, 10);
                                if (num >= 0) {
                                    onUpdateDetail(index, 'precio_unitario', num);
                                }
                            }
                        }}
                        onBlur={(e) => {
                            const valor = e.target.value;
                            if (valor === '' || /^\d+$/.test(valor)) {
                                const num = valor === '' ? 0 : parseInt(valor, 10);
                                if (num >= 0) {
                                    onUpdateDetail(index, 'precio_unitario', num);
                                }
                            }
                            setEditingField(null);
                        }}
                        className="w-32 px-1.5 py-1 text-xs border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <br />

                    {/* Tipo de Precio Selector */}
                    {(() => {
                        const precios = detalle.producto?.precios || [];
                        const preciosVenta = precios.filter(p => {
                            const nombre = (p.nombre || '').toLowerCase();
                            return !nombre.includes('costo') && !nombre.includes('cost');
                        });

                        if (preciosVenta.length <= 1) {
                            return detalle.tipo_precio_nombre ? (
                                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                    {detalle.tipo_precio_nombre}
                                </div>
                            ) : null;
                        }

                        const valorInicial = (manuallySelectedTipoPrecio?.[index] && selectedTipoPrecio[index])
                            ? selectedTipoPrecio[index]
                            : (
                                detalle.tipo_precio_id
                                    ? String(detalle.tipo_precio_id)
                                    : (
                                        detalle.tipo_precio_id_recomendado
                                            ? String(detalle.tipo_precio_id_recomendado)
                                            : (
                                                default_tipo_precio_id
                                                    ? String(default_tipo_precio_id)
                                                    : (preciosVenta[0]?.tipo_precio_id ? String(preciosVenta[0].tipo_precio_id) : '')
                                            )
                                    )
                            );

                        return (
                            <select
                                disabled={readOnly}
                                value={valorInicial}
                                onChange={(e) => {
                                    const tipoPrecioIdSeleccionado = e.target.value;
                                    const precioSeleccionado = preciosVenta.find(p => String(p.tipo_precio_id) === String(tipoPrecioIdSeleccionado));

                                    if (precioSeleccionado) {
                                        if (onManualTipoPrecioChange) {
                                            onManualTipoPrecioChange(index);
                                        }

                                        setSelectedTipoPrecio(prev => ({
                                            ...prev,
                                            [index]: tipoPrecioIdSeleccionado
                                        }));

                                        onUpdateDetail(index, 'tipo_precio_id', precioSeleccionado.tipo_precio_id);
                                        onUpdateDetail(index, 'tipo_precio_nombre', precioSeleccionado.nombre || '');
                                        onUpdateDetail(index, 'precio_unitario', precioSeleccionado.precio || 0);
                                    }
                                }}
                                className="mt-1 px-1.5 py-1 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {!valorInicial && <option value="">Seleccionar tipo de precio</option>}
                                {preciosVenta.map((precio) => (
                                    <option key={precio.id || precio.tipo_precio_id} value={String(precio.tipo_precio_id)} className='text-xs'>
                                        {precio.nombre || `Tipo ${precio.tipo_precio_id}`} - {formatCurrencyWith2Decimals(precio.precio || 0)}
                                    </option>
                                ))}
                            </select>
                        );
                    })()}
                </td>
            )}

            {/* Subtotal */}
            <td className="text-gray-900 dark:text-white">
                {formatCurrencyMinimalDecimals(detalle.subtotal)}
            </td>

            {/* Acciones */}
            <td className="py-1 whitespace-nowrap text-xs font-medium flex gap-2">
                {/* Botón expandir/contraer combo */}
                {detalle.producto && (detalle.producto as any).es_combo && (
                    <button
                        type="button"
                        onClick={() => setExpandedCombos(prev => ({
                            ...prev,
                            [index]: !prev[index]
                        }))}
                        className="p-1 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded transition-colors"
                        title={expandedCombos[index] ? "Ocultar componentes" : "Mostrar componentes"}
                    >
                        <svg className={`w-4 h-4 transition-transform ${expandedCombos[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </button>
                )}

                {/* Botón modal cascada para compras */}
                {tipo === 'compra' && tieneDiferencia && (
                    <button
                        type="button"
                        disabled={readOnly}
                        onClick={() => onAbrirModalCascada(index, detalle)}
                        className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Editar cascada de precios"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                )}

                {/* Botón eliminar */}
                <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => onRemoveDetail(index)}
                    className="text-[12px] p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar producto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        </tr>
    );

    // Si es combo expandido, incluir las filas del combo
    if (esCombo && expandedCombos[index]) {
        return (
            <Fragment key={`combo-${index}`}>
                {content}
                <ComboExpandedRows
                    detalle={detalle}
                    index={index}
                    tipo={tipo}
                    readOnly={readOnly}
                    comboItemsMap={comboItemsMap}
                    setComboItemsMap={setComboItemsMap}
                    onComboItemsChange={onComboItemsChange}
                />
            </Fragment>
        );
    }

    return content;
}

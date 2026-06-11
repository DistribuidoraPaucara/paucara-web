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
    proformaConvertida?: boolean;
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
    onUpdateDetailUnidadConPrecio,
    proformaConvertida = false
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
            <td className="px-4 py-4">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {productoInfo?.nombre || 'Producto no encontrado'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 text-left mt-1">
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

            </td>

            {/* SKU */}
            <td className="px-4 py-4 whitespace-nowrap">
                {(productoInfo?.sku || productoInfo?.codigo) ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        {productoInfo.sku || productoInfo.codigo}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-600">-</span>
                )}
            </td>

            {/* Cantidad */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
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
                        className="w-32 px-2.5 py-2 text-sm font-semibold border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    />
                    {!proformaConvertida && (() => {
                        const stockDisponible = (productoInfo as any)?.stock_disponible_calc ?? (productoInfo as any)?.stock_disponible ?? (productoInfo as any)?.stock ?? 0;
                        const stockTotal = (productoInfo as any)?.stock_total_calc ?? (productoInfo as any)?.stock_total ?? 0;
                        return (
                            <span className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${stockDisponible === 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200' :
                                stockDisponible < 5 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200' :
                                    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200'
                                }`}>
                                / {stockDisponible}
                            </span>
                        );
                    })()}
                </div>
            </td>

            {/* Precio Unitario (Compra) */}
            {tipo === 'compra' && (
                <>
                    <td className="px-4 py-4 whitespace-nowrap">
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
                            className={`w-28 px-2.5 py-2 text-sm font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono ${tieneDiferencia
                                ? esAumento
                                    ? 'border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                                    : 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
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
                    <td className="px-4 py-4 whitespace-nowrap">
                        <input
                            type="text"
                            disabled={readOnly}
                            value={detalle.lote || ''}
                            placeholder="LOT-001"
                            onChange={(e) => {
                                onUpdateDetail(index, 'lote', e.target.value);
                            }}
                            className="w-28 px-2.5 py-2 text-sm font-semibold border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </td>

                    {/* Fecha Vencimiento */}
                    <td className="px-4 py-4 whitespace-nowrap">
                        <input
                            type="date"
                            disabled={readOnly}
                            value={normalizeDateForInput(detalle.fecha_vencimiento)}
                            onChange={(e) => {
                                onUpdateDetail(index, 'fecha_vencimiento', e.target.value);
                            }}
                            className="w-32 px-2.5 py-2 text-sm font-semibold border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </td>
                </>
            )}

            {/* Precio Venta + Tipo Precio */}
            {tipo === 'venta' && (
                <td className="px-4 py-4 whitespace-nowrap">
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

                        // ✅ PRIORIDAD:
                        // 1. Si usuario seleccionó algo explícitamente → mantenerlo
                        // 2. Si tipo_precio_id === null → mostrar "OTROS"
                        // 3. Si tiene tipo_precio_id → usarlo (del detalle del backend)
                        // 4. Fallback: tipo_precio_id_recomendado o default
                        const valorInicial =
                            selectedTipoPrecio[index] !== undefined
                                ? String(selectedTipoPrecio[index]) // Usuario seleccionó algo
                                : detalle.tipo_precio_id === null
                                    ? 'otros' // Mostrar "OTROS" si es null
                                    : detalle.tipo_precio_id
                                        ? String(detalle.tipo_precio_id) // ✅ Usar siempre el del detalle si existe
                                        : detalle.tipo_precio_id_recomendado
                                            ? String(detalle.tipo_precio_id_recomendado)
                                            : default_tipo_precio_id
                                                ? String(default_tipo_precio_id)
                                                : '';

                        return (
                            <select
                                disabled={readOnly}
                                value={valorInicial}
                                onChange={(e) => {
                                    const tipoPrecioIdSeleccionado = e.target.value;

                                    // ✅ NUEVO: Manejar opción "OTROS"
                                    if (tipoPrecioIdSeleccionado === 'otros') {
                                        if (onManualTipoPrecioChange) {
                                            onManualTipoPrecioChange(index);
                                        }

                                        setSelectedTipoPrecio(prev => ({
                                            ...prev,
                                            [index]: 'otros'
                                        }));

                                        // Limpiar tipo_precio pero mantener el precio actual
                                        onUpdateDetail(index, 'tipo_precio_id', null);
                                        onUpdateDetail(index, 'tipo_precio_nombre', null);
                                        return;
                                    }

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
                                className="mt-1 px-2.5 py-1.5 min-w-max text-xs font-medium border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {!valorInicial && <option value="">Seleccionar tipo de precio</option>}
                                {preciosVenta.map((precio) => (
                                    <option key={precio.id || precio.tipo_precio_id} value={String(precio.tipo_precio_id)}>
                                        {precio.nombre || `Tipo ${precio.tipo_precio_id}`} - {formatCurrencyWith2Decimals(precio.precio || 0)}
                                    </option>
                                ))}
                                {/* ✅ NUEVO: Opción OTROS para precios personalizados */}
                                <option value="otros">
                                    ➕ OTROS (Precio Personalizado)
                                </option>
                            </select>
                        );
                    })()}
                </td>
            )}

            {/* Subtotal */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrencyMinimalDecimals(detalle.subtotal)}
                </span>
            </td>

            {/* Categoría */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {typeof productoInfo?.categoria === 'string' ? productoInfo.categoria : productoInfo?.categoria?.nombre || '-'}
                </span>
            </td>

            {/* Unidad */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {detalle.unidad_medida_nombre || productoInfo?.unidad_medida?.nombre || '-'}
                </span>
            </td>

            {/* Marca */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {typeof productoInfo?.marca === 'string' ? productoInfo.marca : productoInfo?.marca?.nombre || '-'}
                </span>
            </td>

            {/* Acciones */}
            <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                    {/* Botón expandir/contraer combo */}
                    {detalle.producto && (detalle.producto as any).es_combo && (
                        <button
                            type="button"
                            onClick={() => setExpandedCombos(prev => ({
                                ...prev,
                                [index]: !prev[index]
                            }))}
                            className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                            title={expandedCombos[index] ? "Ocultar componentes" : "Mostrar componentes"}
                        >
                            <svg className={`w-5 h-5 transition-transform ${expandedCombos[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Editar cascada de precios"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}

                    {/* Botón eliminar */}
                    <button
                        type="button"
                        disabled={readOnly}
                        onClick={() => onRemoveDetail(index)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar producto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
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

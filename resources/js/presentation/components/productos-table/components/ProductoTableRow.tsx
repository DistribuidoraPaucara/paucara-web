import { formatearCosto } from '@/lib/precios.utils';
import { formatCurrency, formatCurrencyMinimalDecimals, formatCurrencyWith2Decimals } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';
import { ExternalLink, Tag } from 'lucide-react';
import { Fragment } from 'react';
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
    onUpdateDetailMultiple?: (index: number, updates: Record<string, number | string | null>) => void;
    onRemoveDetail: (index: number) => void;
    onManualTipoPrecioChange?: (index: number) => void;
    onAbrirModalCascada: (index: number, detalle: DetalleProducto) => void;
    onComboItemsChange?: (detailIndex: number, items: any[]) => void;
    onMedicamentoInfo?: (producto: any) => void;
    calcularPrecioPorUnidad?: (precio: number, unidadId: number, conversiones: any[]) => number;
    formatearPrecioVenta?: (precio: number) => string;
    normalizeDateForInput?: (fecha: string | null) => string;
    onUpdateDetailUnidadConPrecio?: (index: number, unidadId: number, precio: number) => void;
    mostrarPesoEnvio?: boolean;
    resumirDatosProducto?: boolean;
    ocultarRangos?: boolean;
    enlaceEditarProducto?: boolean;
    enlaceReservas?: boolean;
    proformaConvertida?: boolean;
}

// Enter pasa al siguiente campo de la fila; desde el último vuelve al buscador de productos
const avanzarConEnter = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    const actual = e.target as HTMLInputElement;
    if (e.key !== 'Enter' || !actual.matches('[data-campo-fila]')) return;
    e.preventDefault();
    const campos = Array.from(e.currentTarget.querySelectorAll<HTMLInputElement>('[data-campo-fila]:not(:disabled)'));
    const siguiente = campos[campos.indexOf(actual) + 1] ?? document.querySelector<HTMLInputElement>('[data-buscador-productos]');
    siguiente?.focus();
    if (siguiente?.type === 'text') siguiente.select();
};

// Mañana en hora local (YYYY-MM-DD); toISOString usaría UTC
const mananaLocal = (): string => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Peso en kilogramos con hasta 3 decimales
const formatearPeso = (kg: number) => `${kg.toLocaleString('es-BO', { maximumFractionDigits: 3 })} kg`;

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
    onUpdateDetailMultiple,
    onRemoveDetail,
    onManualTipoPrecioChange,
    onAbrirModalCascada,
    onComboItemsChange,
    onMedicamentoInfo,
    calcularPrecioPorUnidad = (precio) => precio,
    formatearPrecioVenta = (precio) => precio.toString(),
    normalizeDateForInput = (fecha) => fecha || '',
    onUpdateDetailUnidadConPrecio,
    mostrarPesoEnvio = false,
    resumirDatosProducto = false,
    ocultarRangos = false,
    enlaceEditarProducto = false,
    enlaceReservas = false,
    proformaConvertida = false,
}: ProductoTableRowProps) {
    const productoInfo = detalle.producto as any;
    const esCombo = productoInfo && productoInfo.es_combo;
    const precioCosto = detalle.precio_costo || productoInfo?.precio_costo || 0;
    const esCompra = tipo === 'compra';
    const porcentajeDiferencia = precioCosto > 0 ? ((detalle.precio_unitario - precioCosto) / precioCosto) * 100 : 0;
    const textoPorcentaje =
        Math.abs(porcentajeDiferencia) < 0.01
            ? '<0,01 %'
            : `${porcentajeDiferencia > 0 ? '+' : '−'}${Math.abs(porcentajeDiferencia).toLocaleString('es-BO', { maximumFractionDigits: 2 })} %`;
    // Precios de venta que quedarían por debajo del precio de compra (el costo viaja en la misma lista)
    const preciosSuperados: Array<{ nombre?: string; precio: number | string }> = esCompra
        ? (productoInfo?.precios ?? []).filter(
              (p: { nombre?: string; precio: number | string }) =>
                  !/cost/i.test(p.nombre ?? '') && Number(p.precio) > 0 && detalle.precio_unitario > Number(p.precio),
          )
        : [];
    const skuProducto = productoInfo?.sku || productoInfo?.codigo;
    const marcaProducto = typeof productoInfo?.marca === 'string' ? productoInfo.marca : productoInfo?.marca?.nombre;
    const categoriaProducto = typeof productoInfo?.categoria === 'string' ? productoInfo.categoria : productoInfo?.categoria?.nombre;
    const unidadProducto = detalle.unidad_medida_nombre || productoInfo?.unidad_medida?.nombre;
    // El servidor exige un vencimiento posterior a hoy (after:today)
    const vencimientoMinimo = mananaLocal();
    const fechaVencimiento = normalizeDateForInput(detalle.fecha_vencimiento);
    const vencimientoInvalido = tipo === 'compra' && !readOnly && !!fechaVencimiento && fechaVencimiento < vencimientoMinimo;
    // Lote sin fecha de vencimiento: aviso (no bloquea el guardado)
    const faltaVencimiento = tipo === 'compra' && !readOnly && !!detalle.lote && !fechaVencimiento;

    // Varios campos de una sola vez: con llamadas seguidas a onUpdateDetail solo sobreviviría la última
    const actualizarCampos = (campos: Record<string, number | string | null>) => {
        if (onUpdateDetailMultiple) {
            onUpdateDetailMultiple(index, campos);
        } else {
            Object.entries(campos).forEach(([campo, valor]) => onUpdateDetail(index, campo, valor));
        }
    };

    const content = (
        <tr
            key={detalle.producto_id}
            onKeyDown={esCompra ? avanzarConEnter : undefined}
            className={`font-small text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                tipo === 'compra' && tieneDiferencia && esAumento
                    ? 'bg-amber-50 px-2 py-2 dark:bg-amber-950/10'
                    : tipo === 'compra' && tieneDiferencia && !esAumento
                      ? 'bg-green-50 px-2 py-2 dark:bg-green-950/10'
                      : ''
            }`}
        >
            {/* Producto Info */}
            <td className={`items-start px-2 py-2 ${esCompra ? 'align-top' : ''}`}>
                <div
                    className="items-start text-xs font-bold text-gray-900 dark:text-white"
                    title={
                        resumirDatosProducto ? [marcaProducto, categoriaProducto, unidadProducto].filter(Boolean).join(' · ') || undefined : undefined
                    }
                >
                    {enlaceEditarProducto && productoInfo ? (
                        <a
                            href={`/productos/${detalle.producto_id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Editar producto (se abre en otra pestaña)"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {productoInfo?.nombre}
                        </a>
                    ) : (
                        productoInfo?.nombre || 'Producto no encontrado'
                    )}
                </div>
                {esCompra && (
                    <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {skuProducto && (
                            <span className="rounded bg-blue-100 px-1.5 py-0.5 font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                {skuProducto}
                            </span>
                        )}
                        <a
                            href={`/productos/${detalle.producto_id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Editar producto en otra pestaña"
                            className="inline-flex items-center gap-0.5 font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                            ID {detalle.producto_id}
                            <ExternalLink className="h-3 w-3" />
                        </a>
                        {[marcaProducto, categoriaProducto].filter(Boolean).join(' · ')}
                    </div>
                )}
                <div className="mt-1 text-left text-xs text-gray-500 dark:text-gray-400">
                    {productoInfo?.codigo_barras && productoInfo.codigo_barras !== productoInfo.sku && (
                        <div>Cod Barras: {productoInfo.codigo_barras}</div>
                    )}
                    {(() => {
                        const tieneDataMedicamentos = (productoInfo as any)?.principio_activo || (productoInfo as any)?.uso_de_medicacion;
                        const mostrarMedicamentos = es_farmacia && tieneDataMedicamentos;
                        return (
                            mostrarMedicamentos && (
                                <div className="mt-1 space-y-0.5 text-xs text-blue-600 dark:text-blue-400">
                                    {(productoInfo as any)?.principio_activo && <div>💊 P.A.: {(productoInfo as any).principio_activo}</div>}
                                    {(productoInfo as any)?.uso_de_medicacion && <div>📋 Uso: {(productoInfo as any).uso_de_medicacion}</div>}
                                </div>
                            )
                        );
                    })()}
                </div>
            </td>

            {/* SKU */}
            {!esCompra && (
                <td className="items-start px-2 py-2 uppercase">
                    {(productoInfo?.sku || productoInfo?.codigo) && (
                        enlaceEditarProducto ? (
                            <a
                                href={`/productos/${detalle.producto_id}/edit`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Editar producto (se abre en otra pestaña)"
                                className="items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 hover:underline dark:bg-blue-900/40 dark:text-blue-300"
                            >
                                {productoInfo.sku || productoInfo.codigo}
                            </a>
                        ) : (
                            <span className="items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                {productoInfo.sku || productoInfo.codigo}
                            </span>
                        )
                    )}
                </td>
            )}
            {/* Disponibilidad */}
            <td className={`w-20 items-center px-2 text-xs ${esCompra ? 'pt-3 pb-2 align-top' : 'py-2'}`}>
                {!proformaConvertida &&
                    (() => {
                        const stockDisponible =
                            (productoInfo as any)?.stock_disponible_calc ??
                            (productoInfo as any)?.stock_disponible ??
                            (productoInfo as any)?.stock ??
                            0;
                        const stockReservado = (productoInfo as any)?.stock_reservado_calc ?? (productoInfo as any)?.stock_reservado ?? 0;
                        const stockTotal = (productoInfo as any)?.stock_total_calc ?? (productoInfo as any)?.stock_total ?? 0;
                        // Ventas: el color depende de la cantidad pedida, no solo del stock
                        // En proformas: lo ya reservado por ESTA proforma también cuenta como disponible para su línea
                        const reservadoProforma = Number((detalle as any).reservado_proforma || 0);
                        const disponibleParaEsta = Number(stockDisponible) + reservadoProforma;
                        const cantidadPedida = Number(detalle.cantidad || 0);
                        const faltante = Math.max(0, cantidadPedida - disponibleParaEsta);
                        const sobrante = disponibleParaEsta - cantidadPedida;
                        const colorVenta =
                            faltante > 0
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                                : sobrante < 5
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200';
                        const colorCompra =
                            stockDisponible === 0
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                                : stockDisponible < 5
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200';

                        return (
                            <div
                                title={`Reservado: ${stockReservado} · Total: ${stockTotal}`}
                                className={`flex flex-col items-center rounded p-1 text-xs ${esCompra ? 'whitespace-nowrap' : ''} ${
                                    esCompra ? colorCompra : colorVenta
                                }`}
                            >
                                {esCompra ? (
                                    <p>
                                        {stockDisponible} disp. · {stockReservado} res. · {stockTotal} total
                                    </p>
                                ) : (
                                    <>
                                        <span className="text-base leading-none font-bold">{stockDisponible}</span>
                                        <span className="text-[10px] tracking-wide uppercase opacity-80">disponible</span>
                                        {faltante > 0 && <span className="mt-0.5 text-[10px] font-bold">Faltan {faltante}</span>}
                                    </>
                                )}
                            </div>
                        );
                    })()}

                {!esCompra &&
                    (detalle as any).reservado_proforma !== undefined &&
                    (() => {
                        const reservado = Number((detalle as any).reservado_proforma || 0);
                        const pedido = Number(detalle.cantidad || 0);
                        if (reservado <= 0) {
                            return enlaceReservas ? (
                                <a
                                    href={`/reservas/producto/${detalle.producto_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Ver reservas de este producto"
                                    className="text-[10px] text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Sin reserva
                                </a>
                            ) : (
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">Sin reserva</span>
                            );
                        }
                        const completa = reservado >= pedido;
                        return (
                            <span
                                title={
                                    enlaceReservas
                                        ? 'Cantidad reservada para esta proforma · ver reservas del producto'
                                        : 'Cantidad reservada para esta proforma'
                                }
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                    completa
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
                                }`}
                            >
                                {enlaceReservas ? (
                                    <a
                                        href={`/reservas/producto/${detalle.producto_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {completa ? 'Reservado' : `Reservado ${reservado} de ${pedido}`}
                                    </a>
                                ) : completa ? (
                                    'Reservado'
                                ) : (
                                    `Reservado ${reservado} de ${pedido}`
                                )}
                            </span>
                        );
                    })()}
            </td>

            {/* Cantidad */}
            <td className={`items-start px-2 py-2 ${esCompra ? 'align-top' : ''}`}>
                <div className="flex flex-col items-center gap-2">
                    <input
                        type="text"
                        inputMode={tipo === 'compra' ? 'numeric' : 'decimal'}
                        disabled={readOnly}
                        value={editingField?.index === index && editingField?.field === 'cantidad' ? editingField.value : detalle.cantidad.toString()}
                        data-campo-fila
                        placeholder={tipo === 'compra' ? '0' : '0.00'}
                        onFocus={() => {
                            setEditingField({
                                index,
                                field: 'cantidad',
                                value: detalle.cantidad.toString(),
                            });
                        }}
                        onChange={(e) => {
                            // En compras la cantidad es entera (el servidor rechaza decimales)
                            const valor = tipo === 'compra' ? e.target.value.split(/[.,]/)[0].replace(/\D/g, '') : e.target.value;
                            setEditingField((prev) => (prev && prev.index === index ? { ...prev, value: valor } : prev));
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
                        className={`w-24 flex-col rounded-lg border border-gray-300 text-sm ${esCompra ? 'px-2 py-2 font-semibold' : 'px-1 py-1'} focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white`}
                    />

                    {esCompra && unidadProducto && <span className="text-xs text-gray-500 dark:text-gray-400">{unidadProducto}</span>}
                </div>
            </td>

            {/* Precio Unitario (Compra) */}
            {tipo === 'compra' && (
                <>
                    <td className="px-2 py-2 align-top">
                        <input
                            type="text"
                            inputMode="decimal"
                            disabled={readOnly}
                            value={
                                editingField?.index === index && editingField?.field === 'precio_unitario'
                                    ? editingField.value
                                    : detalle.precio_unitario.toString()
                            }
                            data-campo-fila
                            placeholder="0.0000"
                            onFocus={() => {
                                setEditingField({
                                    index,
                                    field: 'precio_unitario',
                                    value: detalle.precio_unitario.toString(),
                                });
                            }}
                            onChange={(e) => {
                                const valor = e.target.value;
                                setEditingField((prev) => (prev && prev.index === index ? { ...prev, value: valor } : prev));
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
                            className={`w-28 rounded-lg border px-2 py-2 font-mono text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white ${
                                tieneDiferencia
                                    ? esAumento
                                        ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20'
                                        : 'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
                                    : 'border-gray-300 dark:border-zinc-600'
                            }`}
                        />
                        {esCompra && (
                            <div className="mt-0.5 flex h-6 w-28 items-center text-xs whitespace-nowrap">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span
                                            tabIndex={0}
                                            className={`cursor-help ${
                                                !tieneDiferencia
                                                    ? 'text-gray-500 dark:text-gray-400'
                                                    : esAumento
                                                      ? 'font-semibold text-amber-600 dark:text-amber-400'
                                                      : 'font-semibold text-green-600 dark:text-green-400'
                                            }`}
                                        >
                                            {tieneDiferencia
                                                ? `${esAumento ? '↑' : '↓'} ${textoPorcentaje.replace(/^[+−]/, '')}`
                                                : precioCosto > 0
                                                  ? `Reg. ${formatearCosto(precioCosto)}`
                                                  : 'No registrado'}
                                            {preciosSuperados.length > 0 && <span className="ml-1 text-red-600 dark:text-red-400">⚠</span>}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="text-left">
                                        <p>{precioCosto > 0 ? `Registrado: ${formatearCosto(precioCosto)}` : 'Sin costo registrado'}</p>
                                        {tieneDiferencia && (
                                            <p>
                                                Diferencia: {esAumento ? '↑' : '↓'} {formatearCosto(Math.abs(detalle.precio_unitario - precioCosto))}{' '}
                                                ({textoPorcentaje})
                                            </p>
                                        )}
                                        {preciosSuperados.length > 0 && (
                                            <div className="mt-1">
                                                <p className="font-semibold">⚠ Supera a:</p>
                                                {preciosSuperados.map((p) => (
                                                    <p key={p.nombre}>
                                                        {p.nombre}: {formatearCosto(Number(p.precio))}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                        {detalle.es_fraccionado && detalle.conversiones && detalle.conversiones.length > 0 && (
                            <div>
                                {(() => {
                                    const unidadActual = detalle.unidad_venta_id || detalle.unidad_medida_id;

                                    if (unidadActual === detalle.unidad_medida_id) {
                                        return (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatCurrency(detalle.precio_unitario)} / {detalle.unidad_medida_nombre || 'Base'}
                                            </div>
                                        );
                                    }

                                    const conversion = detalle.conversiones.find((c) => c.unidad_destino_id === unidadActual);

                                    if (conversion && conversion.factor_conversion > 0) {
                                        const precioPorUnidad = detalle.precio_unitario / conversion.factor_conversion;
                                        return (
                                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                {formatCurrency(precioPorUnidad)} /{' '}
                                                {conversion.unidad_destino_nombre || `Unidad ${conversion.unidad_destino_id}`}
                                            </div>
                                        );
                                    }

                                    return <div className="text-sm text-gray-500 dark:text-gray-400">N/A</div>;
                                })()}
                            </div>
                        )}
                    </td>

                    {/* Lote */}
                    <td className="px-2 py-2 align-top">
                        <input
                            type="text"
                            disabled={readOnly}
                            value={detalle.lote || ''}
                            data-campo-fila
                            placeholder="Sin lote"
                            onChange={(e) => {
                                onUpdateDetail(index, 'lote', e.target.value);
                            }}
                            className="w-28 rounded-lg border border-gray-300 px-2 py-2 text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        />
                    </td>

                    {/* Fecha Vencimiento */}
                    <td className="px-2 py-2 align-top">
                        <input
                            type="date"
                            disabled={readOnly}
                            data-campo-fila
                            min={vencimientoMinimo}
                            aria-invalid={vencimientoInvalido}
                            value={fechaVencimiento}
                            onChange={(e) => {
                                onUpdateDetail(index, 'fecha_vencimiento', e.target.value);
                            }}
                            className={`w-40 rounded-lg border px-2 py-2 text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white ${
                                vencimientoInvalido
                                    ? 'border-red-500 dark:border-red-500'
                                    : faltaVencimiento
                                      ? 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20'
                                      : 'border-gray-300 dark:border-zinc-600'
                            }`}
                        />
                        {vencimientoInvalido && (
                            <div className="mt-0.5 text-xs font-semibold text-red-600 dark:text-red-400">Debe ser posterior a hoy</div>
                        )}
                        {faltaVencimiento && (
                            <div className="mt-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">Indica el vencimiento del lote</div>
                        )}
                    </td>
                </>
            )}

            {/* Precio Venta + Tipo Precio */}
            {tipo === 'venta' && (
                <td className="items-center p-1 text-xs">
                    <div className="flex flex-nowrap items-center gap-2">
                        <input
                            type="text"
                            inputMode="decimal"
                            disabled={readOnly}
                            value={
                                editingField?.index === index && editingField?.field === 'precio_venta'
                                    ? editingField.value
                                    : formatearPrecioVenta(detalle.precio_unitario)
                            }
                            placeholder="0"
                            onFocus={() => {
                                setEditingField({
                                    index,
                                    field: 'precio_venta',
                                    value: formatearPrecioVenta(detalle.precio_unitario),
                                });
                            }}
                            onChange={(e) => {
                                const valor = e.target.value;
                                setEditingField((prev) => (prev && prev.index === index ? { ...prev, value: valor } : prev));
                                // ✅ MEJORADO: Permitir decimales y validación más flexible
                                if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
                                    const num = valor === '' ? 0 : parseFloat(valor);
                                    if (num >= 0) {
                                        // ✅ NUEVO: Marcar como selección manual cuando se edita el precio
                                        // ✅ REFACTORIZADO (2026-07-03): Pasar producto_id en lugar de index
                                        if (onManualTipoPrecioChange) {
                                            onManualTipoPrecioChange(detalle.producto_id);
                                        }
                                        onUpdateDetail(index, 'precio_unitario', num);
                                    }
                                }
                            }}
                            onBlur={(e) => {
                                const valor = e.target.value;
                                // ✅ MEJORADO: Permitir decimales y validación más flexible
                                if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
                                    const num = valor === '' ? 0 : parseFloat(valor);
                                    // Salir del campo sin cambiar el precio no cuenta como selección manual
                                    if (num >= 0 && Math.abs(num - Number(detalle.precio_unitario)) >= 0.005) {
                                        // ✅ NUEVO: Marcar como selección manual cuando se edita el precio
                                        // ✅ REFACTORIZADO (2026-07-03): Pasar producto_id en lugar de index
                                        if (onManualTipoPrecioChange) {
                                            onManualTipoPrecioChange(detalle.producto_id);
                                        }
                                        onUpdateDetail(index, 'precio_unitario', num);
                                    }
                                }
                                setEditingField(null);
                            }}
                            className="w-32 rounded-md border border-gray-300 px-1 py-1 text-xs focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        />

                        {/* Tipo de Precio Selector */}
                        {(() => {
                            const precios = detalle.producto?.precios || [];
                            const preciosVenta = precios.filter((p) => {
                                const nombre = (p.nombre || '').toLowerCase();
                                return !nombre.includes('costo') && !nombre.includes('cost');
                            });

                            if (preciosVenta.length <= 1) {
                                return detalle.tipo_precio_nombre ? (
                                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{detalle.tipo_precio_nombre}</div>
                                ) : null;
                            }

                            // ✅ PRIORIDAD:
                            // 1. Si usuario seleccionó algo explícitamente → mantenerlo
                            // 2. Si tipo_precio_id === null → mostrar "OTROS"
                            // 3. Si tiene tipo_precio_id → usarlo (del detalle del backend)
                            // 4. Fallback: tipo_precio_id_recomendado o default
                            // ✅ REFACTORIZADO (2026-07-03): Usar producto_id como clave en lugar de index
                            const productoId = detalle.producto_id;
                            const valorInicial =
                                detalle.tipo_precio_id === null
                                    ? 'otros' // Precio personalizado
                                    : selectedTipoPrecio[productoId] !== undefined
                                      ? String(selectedTipoPrecio[productoId]) // Usuario seleccionó algo
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
                                                // ✅ REFACTORIZADO (2026-07-03): Pasar producto_id en lugar de index
                                                onManualTipoPrecioChange(detalle.producto_id);
                                            }

                                            setSelectedTipoPrecio((prev) => ({
                                                ...prev,
                                                [productoId]: 'otros',
                                            }));

                                            // Limpiar tipo_precio pero mantener el precio actual
                                            actualizarCampos({ tipo_precio_id: null, tipo_precio_nombre: null });
                                            return;
                                        }

                                        const precioSeleccionado = preciosVenta.find(
                                            (p) => String(p.tipo_precio_id) === String(tipoPrecioIdSeleccionado),
                                        );

                                        if (precioSeleccionado) {
                                            if (onManualTipoPrecioChange) {
                                                // ✅ REFACTORIZADO (2026-07-03): Pasar producto_id en lugar de index
                                                onManualTipoPrecioChange(detalle.producto_id);
                                            }

                                            setSelectedTipoPrecio((prev) => ({
                                                ...prev,
                                                [productoId]: tipoPrecioIdSeleccionado,
                                            }));

                                            actualizarCampos({
                                                tipo_precio_id: precioSeleccionado.tipo_precio_id,
                                                tipo_precio_nombre: precioSeleccionado.nombre || '',
                                                precio_unitario: Number(precioSeleccionado.precio) || 0,
                                            });
                                        }
                                    }}
                                    title={(() => {
                                        const sel = preciosVenta.find((p) => String(p.tipo_precio_id) === String(valorInicial));
                                        return sel ? `${sel.nombre || 'Tipo'} - ${formatCurrencyWith2Decimals(sel.precio || 0)}` : 'Tipo de precio';
                                    })()}
                                    className="font-small mt-1 w-40 max-w-full truncate rounded-lg border border-gray-300 px-1 py-1 text-[11px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                >
                                    {!valorInicial && <option value="">Seleccionar tipo de precio</option>}
                                    {preciosVenta.map((precio) => (
                                        <option
                                            className="font-small text-xs"
                                            key={precio.id || precio.tipo_precio_id}
                                            value={String(precio.tipo_precio_id)}
                                        >
                                            {precio.nombre || `Tipo ${precio.tipo_precio_id}`} · Bs{' '}
                                            {Number(precio.precio || 0).toLocaleString('es-BO', { maximumFractionDigits: 2 })}
                                        </option>
                                    ))}
                                    {/* ✅ NUEVO: Opción OTROS para precios personalizados */}
                                    <option value="otros" className="font-small text-xs">
                                        ➕ OTROS (Precio Personalizado)
                                    </option>
                                </select>
                            );
                        })()}
                        {(() => {
                            const rangos = (productoInfo as any)?.rangos as
                                | Array<{
                                      cantidad_minima: number;
                                      cantidad_maxima: number | null;
                                      tipo_precio_nombre?: string | null;
                                      precio: number | null;
                                  }>
                                | undefined;
                            if (ocultarRangos || !rangos || rangos.length === 0) return null;

                            const lineas = rangos.map((r) => {
                                const cantidad = `${r.cantidad_minima}${r.cantidad_maxima ? `–${r.cantidad_maxima}` : ' o más'} unid.`;
                                const precio =
                                    r.precio !== null ? `Bs ${Number(r.precio).toLocaleString('es-BO', { maximumFractionDigits: 4 })}` : 'sin precio';
                                const tipo = r.tipo_precio_nombre ? ` (${r.tipo_precio_nombre})` : '';
                                return `${cantidad}: ${precio}${tipo}`;
                            });

                            return (
                                <span
                                    title={`Precios por cantidad:\n${lineas.join('\n')}`}
                                    className="inline-flex shrink-0 cursor-help items-center rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"
                                >
                                    📊
                                </span>
                            );
                        })()}
                    </div>
                </td>
            )}

            {/* Subtotal: en compras es editable y despeja el precio (precio = subtotal ÷ cantidad) */}
            <td className={`items-start px-2 text-center ${esCompra ? 'pt-4 pb-2 align-top' : 'py-4'}`}>
                {tipo === 'compra' ? (
                    <input
                        type="text"
                        inputMode="decimal"
                        disabled={readOnly || !(detalle.cantidad > 0)}
                        value={editingField?.index === index && editingField?.field === 'subtotal' ? editingField.value : String(detalle.subtotal)}
                        data-campo-fila
                        placeholder={detalle.cantidad > 0 ? '0.00' : 'Cantidad primero'}
                        title="Al cambiar el subtotal se calcula el precio: subtotal ÷ cantidad"
                        onFocus={() => {
                            setEditingField({ index, field: 'subtotal', value: String(detalle.subtotal) });
                        }}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setEditingField((prev) => (prev && prev.index === index ? { ...prev, value: valor } : prev));
                            if (valor === '' || /^\d*\.?\d*$/.test(valor)) {
                                const num = valor === '' ? 0 : parseFloat(valor);
                                if (num >= 0) {
                                    onUpdateDetail(index, 'subtotal', num);
                                }
                            }
                        }}
                        onBlur={() => {
                            setEditingField(null);
                        }}
                        className="w-28 rounded-lg border border-gray-300 px-2 py-2 text-right font-mono text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                    />
                ) : (
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrencyMinimalDecimals(detalle.subtotal)}</span>
                )}
            </td>

            {/* Peso unitario y peso total (ventas que requieren envío): después de Subtotal */}
            {tipo === 'venta' && mostrarPesoEnvio && (
                <>
                    <td className="items-start px-2 py-2 text-center whitespace-nowrap">
                        <span className="rounded-md bg-teal-50 px-2 py-0.5 font-mono font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                            {formatearPeso(Number(productoInfo?.peso || 0))}
                        </span>
                    </td>
                    <td className="items-start px-2 py-2 text-center whitespace-nowrap">
                        <span className="rounded-md bg-teal-100 px-2 py-0.5 font-mono font-bold text-teal-800 dark:bg-teal-800/40 dark:text-teal-200">
                            {formatearPeso(Number(detalle.cantidad || 0) * Number(productoInfo?.peso || 0))}
                        </span>
                    </td>
                </>
            )}

            {!esCompra && !resumirDatosProducto && (
                <>
                    {/* Categoría */}
                    <td className="items-start px-2 py-2 text-center">
                        <span className="font-small text-xs text-gray-700 dark:text-gray-300">{categoriaProducto || '-'}</span>
                    </td>

                    {/* Unidad */}
                    <td className="items-start px-2 py-2 text-center">
                        <span className="font-small text-xs text-gray-700 dark:text-gray-300">{unidadProducto || '-'}</span>
                    </td>

                    {/* Marca */}
                    <td className="items-start px-2 py-2 text-center">
                        <span className="font-small text-xs text-gray-700 dark:text-gray-300">{marcaProducto || '-'}</span>
                    </td>
                </>
            )}

            {/* Acciones */}
            <td className={`items-start px-2 text-center ${esCompra ? 'pt-3 pb-2 align-top' : 'py-4'}`}>
                <div className="flex items-center justify-center gap-1">
                    {/* Botón expandir/contraer combo */}
                    {detalle.producto && (detalle.producto as any).es_combo && (
                        <button
                            type="button"
                            onClick={() =>
                                setExpandedCombos((prev) => ({
                                    ...prev,
                                    [index]: !prev[index],
                                }))
                            }
                            className="rounded-lg p-1.5 text-purple-600 transition-colors hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30"
                            title={expandedCombos[index] ? 'Ocultar componentes' : 'Mostrar componentes'}
                        >
                            <svg
                                className={`h-5 w-5 transition-transform ${expandedCombos[index] ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                    )}

                    {/* Actualizar precios (compras con cambio de costo) */}
                    {tieneDiferencia && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    disabled={readOnly}
                                    aria-label="Actualizar precios"
                                    onClick={() => onAbrirModalCascada(index, detalle)}
                                    className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                >
                                    <Tag className="h-5 w-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Actualizar precios</TooltipContent>
                        </Tooltip>
                    )}

                    {/* Botón eliminar */}
                    <button
                        type="button"
                        disabled={readOnly}
                        onClick={() => onRemoveDetail(index)}
                        className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/30"
                        title="Eliminar producto"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
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

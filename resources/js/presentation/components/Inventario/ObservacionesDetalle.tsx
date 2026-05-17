import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ✅ NUEVO (2026-03-26): Componente para parsear observaciones de texto plano
const ObservacionesTextoPlano: React.FC<{ texto: string }> = ({ texto }) => {
    // Limpiar números decimales innecesarios: 32.000000 → 32
    const limpiarNumeros = (str: string) => {
        return str.replace(/(\d+)\.0+(?!\d)/g, '$1');
    };

    const textoLimpio = limpiarNumeros(texto);

    // Parsear formato FIFO
    if (textoLimpio.includes('FIFO:')) {
        // Formato: "FIFO: 1 unidades de lote 280126 (Total producto: 32→31, Vencimiento: 3d)"
        const regexFIFO = /FIFO:\s*([\d.]+)\s*unidades? de lote\s*(\w+)\s*\(Total producto:\s*([\d]+)→([\d]+),\s*Vencimiento:\s*([\d]+d?)\)/;
        const match = textoLimpio.match(regexFIFO);

        if (match) {
            const [, cantidad, lote, stockAnterior, stockPosterior, vencimiento] = match;
            return (
                <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-fit">📦 Método:</span>
                        <span className="text-gray-700 dark:text-gray-300">FIFO (First In, First Out)</span>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-green-600 dark:text-green-400 min-w-fit">📊 Cantidad:</span>
                        <span className="text-gray-700 dark:text-gray-300">{cantidad} unidad(es)</span>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-orange-600 dark:text-orange-400 min-w-fit">📦 Lote:</span>
                        <span className="text-gray-700 dark:text-gray-300">{lote}</span>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-red-600 dark:text-red-400 min-w-fit">⏰ Vencimiento:</span>
                        <span className="text-gray-700 dark:text-gray-300">{vencimiento}</span>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            📈 Stock Total (stock_productos.cantidad)
                        </p>
                        <div className="space-y-1 ml-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded mb-2">
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Anterior:</span>
                                <span className="ml-2 font-medium text-red-600 dark:text-red-400">{stockAnterior} unidades</span>
                            </p>
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Posterior:</span>
                                <span className="ml-2 font-medium text-green-600 dark:text-green-400">{stockPosterior} unidades</span>
                            </p>
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Cambio:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                                    -{parseInt(stockAnterior) - parseInt(stockPosterior)} unidades
                                </span>
                            </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic ml-2">
                            💡 Este es el stock total física en el almacén
                        </p>
                    </div>
                </div>
            );
        }
    }

    // Si no coincide con FIFO, mostrar el texto limpio como está
    return (
        <div className="text-xs text-gray-700 dark:text-gray-300 break-words">
            <p>{textoLimpio}</p>
        </div>
    );
};

interface ObservacionesDetalleProps {
    observaciones?: string;
}

// ✅ NUEVO (2026-03-26): Función para limpiar números decimales
const limpiarNumerosJSON = (valor: any): any => {
    if (typeof valor === 'number') {
        // Si es un número que termina en .000000, mostrar solo la parte entera
        if (Number.isInteger(valor) || valor === Math.floor(valor)) {
            return Math.floor(valor);
        }
        return parseFloat(valor.toFixed(2)); // Máximo 2 decimales
    }
    if (typeof valor === 'object' && valor !== null) {
        if (Array.isArray(valor)) {
            return valor.map(limpiarNumerosJSON);
        }
        const obj: any = {};
        for (const key in valor) {
            obj[key] = limpiarNumerosJSON(valor[key]);
        }
        return obj;
    }
    return valor;
};

export const ObservacionesDetalle: React.FC<ObservacionesDetalleProps> = ({ observaciones }) => {
    const [expanded, setExpanded] = useState(false);

    if (!observaciones) {
        return <p className="text-xs text-gray-400">Sin observaciones</p>;
    }

    // Intentar parsear como JSON
    let datos: any = null;
    try {
        if (observaciones.startsWith('{')) {
            datos = JSON.parse(observaciones);
            // ✅ NUEVO: Limpiar números
            datos = limpiarNumerosJSON(datos);
        }
    } catch {
        // Si no es JSON válido, mostrar como texto plano
        return <ObservacionesTextoPlano texto={observaciones} />;
    }

    if (!datos) {
        // ✅ NUEVO (2026-03-26): Parsear observaciones de texto plano (FIFO, etc)
        return <ObservacionesTextoPlano texto={observaciones} />;
    }

    // ✅ COMPONENTE: Mostrar información detallada del JSON
    return (
        <div className="space-y-2">
            {/* INFORMACIÓN PRINCIPAL */}
            <div className="space-y-1 text-xs">
                {datos.evento && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 min-w-fit">📋 Evento:</span>
                        <span className="text-gray-700 dark:text-gray-300">{datos.evento}</span>
                    </div>
                )}

                {datos.venta_numero && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-green-600 dark:text-green-400 min-w-fit">🛒 Venta:</span>
                        <span className="text-gray-700 dark:text-gray-300">{datos.venta_numero}</span>
                    </div>
                )}

                {datos.venta_id && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-green-600 dark:text-green-400 min-w-fit">ID Venta:</span>
                        <span className="text-gray-700 dark:text-gray-300">#{datos.venta_id}</span>
                    </div>
                )}

                {datos.referencia && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-purple-600 dark:text-purple-400 min-w-fit">📌 Referencia:</span>
                        <span className="text-gray-700 dark:text-gray-300">{datos.referencia}</span>
                    </div>
                )}

                {datos.lote && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-orange-600 dark:text-orange-400 min-w-fit">📦 Lote:</span>
                        <span className="text-gray-700 dark:text-gray-300">{datos.lote}</span>
                    </div>
                )}

                {datos.producto_nombre && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-fit">📦 Producto:</span>
                        <span className="text-gray-700 dark:text-gray-300">{datos.producto_nombre}</span>
                    </div>
                )}

                {datos.producto_id && !datos.producto_nombre && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-fit">🏷️ Producto:</span>
                        <span className="text-gray-700 dark:text-gray-300">ID {datos.producto_id}</span>
                    </div>
                )}

                {datos.proforma_numero && (
                    <div className="flex items-start gap-2">
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400 min-w-fit">📄 Proforma:</span>
                        <span className="text-gray-700 dark:text-gray-300">{datos.proforma_numero}</span>
                    </div>
                )}
            </div>

            {/* INFORMACIÓN DE CONSUMO DE RESERVA */}
            {(datos.cantidad_consumida !== undefined || datos.reserva_id !== undefined || datos.stock_producto_id !== undefined) && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-1">🔄 Consumo de Reserva:</p>
                    <div className="space-y-1 text-xs ml-2 bg-cyan-50 dark:bg-cyan-900/20 p-2 rounded">
                        {datos.cantidad_consumida !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Cantidad Consumida:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{datos.cantidad_consumida}</span>
                            </p>
                        )}
                        {datos.reserva_id !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">ID Reserva:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">#{datos.reserva_id}</span>
                            </p>
                        )}
                        {datos.stock_producto_id !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">ID Stock Producto:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">#{datos.stock_producto_id}</span>
                            </p>
                        )}
                        {datos.proforma_id !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">ID Proforma:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">#{datos.proforma_id}</span>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* INFORMACIÓN DE REVERSIÓN */}
            {(datos.movimiento_original_id !== undefined || datos.cantidad_original !== undefined || datos.cantidad_revertida !== undefined) && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-1">🔄 Información de Reversión:</p>
                    <div className="space-y-1 text-xs ml-2 bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                        {datos.movimiento_original_id !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Movimiento Original:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">#{datos.movimiento_original_id}</span>
                            </p>
                        )}
                        {datos.cantidad_original !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Cantidad Original:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{datos.cantidad_original}</span>
                            </p>
                        )}
                        {datos.cantidad_revertida !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Cantidad Revertida:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{datos.cantidad_revertida}</span>
                            </p>
                        )}
                        {datos.fue_conversion_aplicada !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Conversión Aplicada:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                                    {datos.fue_conversion_aplicada ? '✅ Sí' : '❌ No'}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* SECCIONES AGRUPADAS */}
            {(datos.cantidad_solicitada || datos.unidad_solicitud_id || datos.cantidad_consumida) && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-1">📊 Cantidades:</p>
                    <div className="space-y-1 text-xs ml-2">
                        {datos.cantidad_solicitada && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Solicitada:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{datos.cantidad_solicitada}</span>
                                {datos.unidad_solicitud_id && <span className="text-gray-500 text-xs ml-1">(unidad venta)</span>}
                            </p>
                        )}
                        {datos.cantidad_consumida && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Consumida:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{datos.cantidad_consumida}</span>
                                <span className="text-gray-500 text-xs ml-1">(unidad base)</span>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* STOCK ANTERIOR */}
            {(datos.cantidad_total_anterior !== undefined ||
                datos.cantidad_disponible_anterior !== undefined ||
                datos.cantidad_reservada_anterior !== undefined) && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-2">📈 Stock Anterior (ANTES del movimiento):</p>
                    <div className="space-y-2 text-xs ml-2">
                        {/* Stock Total */}
                        {datos.cantidad_total_anterior !== undefined && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                    <span className="font-semibold">📦 Stock Total (stock_productos.cantidad)</span>
                                </p>
                                <p className="ml-2">
                                    <span className="text-gray-700 dark:text-gray-300">{datos.cantidad_total_anterior} unidades</span>
                                </p>
                            </div>
                        )}

                        {/* Stock Disponible */}
                        {datos.cantidad_disponible_anterior !== undefined && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                    <span className="font-semibold">📊 Stock Disponible (stock_productos.cantidad_disponible)</span>
                                </p>
                                <p className="ml-2">
                                    <span className="text-gray-700 dark:text-gray-300">{datos.cantidad_disponible_anterior} unidades</span>
                                </p>
                            </div>
                        )}

                        {/* Stock Reservado */}
                        {datos.cantidad_reservada_anterior !== undefined && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                    <span className="font-semibold">🔒 Stock Reservado (stock_productos.cantidad_reservada)</span>
                                </p>
                                <p className="ml-2">
                                    <span className="text-gray-700 dark:text-gray-300">{datos.cantidad_reservada_anterior} unidades</span>
                                </p>
                            </div>
                        )}

                        {/* Relación */}
                        {datos.cantidad_total_anterior !== undefined && datos.cantidad_disponible_anterior !== undefined && (
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">📐 Relación:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">
                                    Total ({datos.cantidad_total_anterior}) = Disponible ({datos.cantidad_disponible_anterior}) + Reservada ({datos.cantidad_reservada_anterior || 0})
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STOCK POSTERIOR */}
            {(datos.cantidad_total_posterior !== undefined ||
                datos.cantidad_disponible_posterior !== undefined ||
                datos.cantidad_reservada_posterior !== undefined) && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-2">📉 Stock Posterior (DESPUÉS del movimiento):</p>
                    <div className="space-y-2 text-xs ml-2">
                        {/* Stock Total */}
                        {datos.cantidad_total_posterior !== undefined && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                    <span className="font-semibold">📦 Stock Total (stock_productos.cantidad)</span>
                                </p>
                                <p className="ml-2">
                                    <span className="text-gray-700 dark:text-gray-300">{datos.cantidad_total_posterior} unidades</span>
                                </p>
                            </div>
                        )}

                        {/* Stock Disponible */}
                        {datos.cantidad_disponible_posterior !== undefined && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                    <span className="font-semibold">📊 Stock Disponible (stock_productos.cantidad_disponible)</span>
                                </p>
                                <p className="ml-2">
                                    <span className="text-gray-700 dark:text-gray-300">{datos.cantidad_disponible_posterior} unidades</span>
                                </p>
                            </div>
                        )}

                        {/* Stock Reservado */}
                        {datos.cantidad_reservada_posterior !== undefined && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
                                    <span className="font-semibold">🔒 Stock Reservado (stock_productos.cantidad_reservada)</span>
                                </p>
                                <p className="ml-2">
                                    <span className="text-gray-700 dark:text-gray-300">{datos.cantidad_reservada_posterior} unidades</span>
                                </p>
                            </div>
                        )}

                        {/* Relación */}
                        {datos.cantidad_total_posterior !== undefined && datos.cantidad_disponible_posterior !== undefined && (
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">📐 Relación:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">
                                    Total ({datos.cantidad_total_posterior}) = Disponible ({datos.cantidad_disponible_posterior}) + Reservada ({datos.cantidad_reservada_posterior || 0})
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CONVERSIÓN DE UNIDADES */}
            {(datos.conversion_aplicada !== undefined || datos.factor_conversion !== undefined) && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-1">📐 Conversión de Unidades:</p>
                    <div className="space-y-1 text-xs ml-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        {datos.conversion_aplicada !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">¿Aplicada?:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                                    {datos.conversion_aplicada ? '✅ Sí' : '❌ No'}
                                </span>
                            </p>
                        )}
                        {datos.factor_conversion !== undefined && (
                            <p>
                                <span className="text-gray-600 dark:text-gray-400">Factor:</span>
                                <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">{datos.factor_conversion}</span>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* DETALLES DEL OBJETO (NESTED) */}
            {datos.detalles && typeof datos.detalles === 'object' && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-1">📊 Detalles Adicionales:</p>
                    <div className="space-y-2 text-xs ml-2">
                        {datos.detalles.cantidad_anterior !== undefined && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">Cantidad Anterior:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">{datos.detalles.cantidad_anterior}</p>
                            </div>
                        )}
                        {datos.detalles.cantidad_posterior !== undefined && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">Cantidad Posterior:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">{datos.detalles.cantidad_posterior}</p>
                            </div>
                        )}
                        {datos.detalles.cantidad_disponible_anterior !== undefined && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">Disponible Anterior:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">{datos.detalles.cantidad_disponible_anterior}</p>
                            </div>
                        )}
                        {datos.detalles.cantidad_disponible_posterior !== undefined && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">Disponible Posterior:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">{datos.detalles.cantidad_disponible_posterior}</p>
                            </div>
                        )}
                        {datos.detalles.cantidad_reservada_anterior !== undefined && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">Reservada Anterior:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">{datos.detalles.cantidad_reservada_anterior}</p>
                            </div>
                        )}
                        {datos.detalles.cantidad_reservada_posterior !== undefined && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                                <p className="text-gray-600 dark:text-gray-400 mb-1">
                                    <span className="font-semibold">Reservada Posterior:</span>
                                </p>
                                <p className="ml-2 text-gray-700 dark:text-gray-300">{datos.detalles.cantidad_reservada_posterior}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* OTROS CAMPOS NO CATEGORIZADOS */}
            {(() => {
                const camposUsados = new Set([
                    'evento', 'venta_numero', 'referencia', 'lote', 'producto_id', 'producto_nombre',
                    'cantidad_solicitada', 'unidad_solicitud_id', 'cantidad_consumida',
                    'cantidad_total_anterior', 'cantidad_disponible_anterior', 'cantidad_reservada_anterior',
                    'cantidad_total_posterior', 'cantidad_disponible_posterior', 'cantidad_reservada_posterior',
                    'conversion_aplicada', 'factor_conversion',
                    'movimiento_original_id', 'cantidad_original', 'cantidad_revertida', 'fue_conversion_aplicada',
                    'venta_id', 'proforma_numero', 'proforma_id', 'stock_producto_id', 'reserva_id', 'detalles'
                ]);

                const otrosCampos = Object.entries(datos).filter(([key]) => !camposUsados.has(key));

                if (otrosCampos.length > 0) {
                    return (
                        <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                            <p className="font-semibold text-xs text-gray-800 dark:text-gray-200 mb-1">📋 Otros Campos:</p>
                            <div className="space-y-1 text-xs ml-2 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                                {otrosCampos.map(([key, value]) => (
                                    <p key={key}>
                                        <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                                        <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">
                                            {typeof value === 'boolean' ? (value ? '✅ Sí' : '❌ No') : String(value)}
                                        </span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    );
                }
                return null;
            })()}

            {/* BOTÓN EXPANDIR PARA VER TODO */}
            {Object.keys(datos).length > 8 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                    {expanded ? (
                        <>
                            <ChevronUp className="h-3 w-3" />
                            Ocultar JSON completo
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-3 w-3" />
                            Ver JSON completo
                        </>
                    )}
                </button>
            )}

            {/* JSON COMPLETO EXPANDIDO */}
            {expanded && (
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <pre className="text-xs bg-gray-900 text-green-400 p-2 rounded overflow-x-auto max-h-48 overflow-y-auto">
                        {JSON.stringify(datos, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ObservacionesDetalle;

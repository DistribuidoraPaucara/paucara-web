/**
 * Componente: Modal para actualizar cascada de precios por diferencia de costo
 *
 * Responsabilidad:
 * - Cargar precios del producto desde el backend
 * - Mostrar precio actual vs nuevo precio de compra
 * - Calcular y mostrar cascada de precios propuestos
 * - Permitir ajuste manual de precios/márgenes
 * - Guardar cambios
 */

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/compras.utils';
import { decimalesDePrecio, formatearCosto, TOLERANCIA_COSTO } from '@/lib/precios.utils';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { useCascadaPreciosCompra } from '@/domain/hooks/useCascadaPreciosCompra';
import { preciosService } from '@/application/services/precios.service';
import type { PrecioProductoDTO } from '@/domain/entities/precios';

interface ModalComprasDiferenciaCostoProps {
    isOpen: boolean;
    onClose: () => void;
    producto: {
        id: number;
        nombre: string;
        sku?: string;
        precios?: PrecioProductoDTO[];
    } | null;
    precioActual: number | null;
    precioCostoNuevo: number | null;
    onActualizarPrecios?: (precios: Array<{
        precio_id: number;
        precio_nuevo: number;
        porcentaje_ganancia: number;
        motivo: string;
    }>) => Promise<void>;
    onSuccess?: () => void;
    /** Se llama tras guardar, solo si cambió la fila COSTO, con el costo nuevo */
    onCostoActualizado?: (costo: number) => void;
    /** Se llama tras guardar, con todos los precios que cambiaron */
    onPreciosGuardados?: (cambios: Array<{ id: number; precio: number }>) => void;
}

export const ModalComprasDiferenciaCostoComponent: React.FC<ModalComprasDiferenciaCostoProps> = ({
    isOpen,
    onClose,
    producto,
    precioActual,
    precioCostoNuevo,
    onActualizarPrecios,
    onSuccess,
    onCostoActualizado,
    onPreciosGuardados,
}) => {
    const [activeTab, setActiveTab] = useState<'precios'>('precios');
    const [guardando, setGuardando] = useState(false);
    const [cargandoPreciosApi, setCargandoPreciosApi] = useState(false);
    const [motivoActualizacion, setMotivoActualizacion] = useState('Cambio de costo en compra');
    const [inputsEditando, setInputsEditando] = useState<Record<number, { precio?: string; ganancia?: string }>>({});
    const [preciosCompletos, setPreciosCompletos] = useState<PrecioProductoDTO[] | null>(null);

    // ✅ CARGAR precios del backend cuando el modal se abre
    useEffect(() => {
        if (!isOpen || !producto?.id) {
            setPreciosCompletos(null);
            return;
        }

        const cargarPreciosDelProducto = async () => {
            setCargandoPreciosApi(true);
            try {
                // Obtener precios del producto desde el backend
                const precios = await preciosService.obtenerPreciosProducto(producto.id);
                setPreciosCompletos(precios || null);
            } catch (error) {
                console.error('Error cargando precios:', error);
                // No mostrar error si es un producto nuevo sin precios aún
                setPreciosCompletos(null);
            } finally {
                setCargandoPreciosApi(false);
            }
        };

        cargarPreciosDelProducto();
    }, [isOpen, producto?.id]);

    // ✅ USAR HOOK PERSONALIZADO para cascada de precios
    const {
        preciosPropuestos,
        error: errorCascada,
        calcularCascada,
        inicializarConPreciosActuales, // ✅ Nueva función para no auto-calcular
        actualizarPrecioPropuesto,
        actualizarGananciaPropuesta,
        validarCambios
    } = useCascadaPreciosCompra(
        preciosCompletos,
        precioActual,
        precioCostoNuevo
    );

    // ✅ MODIFICADO: Inicializar con precios actuales (SIN calcular cascada automáticamente)
    // El usuario verá los precios registrados y podrá decidir manualmente cuáles actualizar
    useEffect(() => {
        if (isOpen && preciosCompletos && preciosCompletos.length > 0) {
            // Inicializar precios propuestos con los valores ACTUALES (sin calcular cascada)
            inicializarConPreciosActuales();
        }
    }, [isOpen, preciosCompletos, inicializarConPreciosActuales]);

    // Handler: Cambio de precio propuesto
    const handleCambioPrecioPropuesto = (index: number, nuevoValor: number) => {
        actualizarPrecioPropuesto(index, nuevoValor);
    };

    // Handler: Cambio de ganancia propuesta
    const handleCambioGananciaPropuesta = (index: number, nuevoValor: number) => {
        actualizarGananciaPropuesta(index, nuevoValor);
    };

    // Handler para navegar entre inputs con Enter
    const handleKeyDownPrecio = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Aplicar el cambio
            const valor = e.currentTarget.value ? Number(e.currentTarget.value) : 0;
            handleCambioPrecioPropuesto(index, valor);
            setInputsEditando(prev => ({
                ...prev,
                [index]: { ...prev[index], precio: undefined }
            }));

            // Enfocar el input de ganancia de la misma fila
            const gananciaInput = e.currentTarget.closest('[data-precio-card]')?.querySelector<HTMLInputElement>('input[data-ganancia-input]');
            if (gananciaInput) {
                setTimeout(() => gananciaInput.focus(), 0);
            }
        }
    };

    const handleKeyDownGanancia = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Aplicar el cambio
            const valor = e.currentTarget.value ? Number(e.currentTarget.value) : 0;
            handleCambioGananciaPropuesta(index, valor);
            setInputsEditando(prev => ({
                ...prev,
                [index]: { ...prev[index], ganancia: undefined }
            }));

            // Enfocar el siguiente input de precio (del siguiente tipo de precio)
            // Obtener todos los inputs de precio en orden
            const allPrecioInputs = document.querySelectorAll('input[data-precio-input]') as NodeListOf<HTMLInputElement>;

            // Encontrar cuál es el input de precio en la fila actual
            const cardActual = e.currentTarget.closest('[data-precio-card]');
            const precioInputActual = cardActual?.querySelector('input[data-precio-input]');

            // Encontrar el índice del input actual
            const currentIndex = Array.from(allPrecioInputs).indexOf(precioInputActual as HTMLInputElement);

            // Enfocar el siguiente input de precio
            if (currentIndex !== -1 && currentIndex < allPrecioInputs.length - 1) {
                setTimeout(() => allPrecioInputs[currentIndex + 1].focus(), 0);
            }
        }
    };

    // Handler: Guardar cambios de precios
    const handleGuardarPrecios = async () => {
        if (!onActualizarPrecios) {
            NotificationService.warning('No hay función para guardar precios');
            return;
        }

        // Validar cambios
        const validacion = validarCambios();
        if (!validacion.esValido) {
            NotificationService.warning(validacion.mensaje);
            return;
        }

        // Validar motivo
        if (!motivoActualizacion.trim()) {
            NotificationService.warning('El motivo de la actualización es obligatorio');
            return;
        }

        // Preparar datos
        const preciosCambiados = validacion.preciosCambiados.map(p => ({
            precio_id: p.id,
            precio_nuevo: p.precio_propuesto,
            porcentaje_ganancia: p.porcentaje_ganancia_propuesto,
            motivo: motivoActualizacion.trim(),
        }));

        setGuardando(true);
        try {
            await onActualizarPrecios(preciosCambiados);

            onPreciosGuardados?.(validacion.preciosCambiados.map(p => ({ id: Number(p.id), precio: p.precio_propuesto })));

            const filaCosto = preciosPropuestos.find(p => p.tipo_codigo === 'COSTO');
            if (filaCosto && validacion.preciosCambiados.some(p => p.id === filaCosto.id)) {
                onCostoActualizado?.(filaCosto.precio_propuesto);
            }

            NotificationService.success(
                `✅ ${preciosCambiados.length} precio(s) actualizado(s) exitosamente`
            );
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido al guardar precios';
            NotificationService.error(`Error: ${mensaje}`);
            console.error('❌ Error al actualizar precios:', error);
        } finally {
            setGuardando(false);
        }
    };

    if (!isOpen || !producto) {
        return null;
    }

    // Mostrar error si ocurrió
    if (errorCascada) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
                <div className="flex min-h-screen items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-xl p-6 border border-red-300 dark:border-red-800">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">⚠️</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-slate-50 mb-2">
                                    Error al calcular cascada
                                </h3>
                                <p className="text-gray-600 dark:text-slate-400 mb-4">
                                    {errorCascada.mensaje}
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-50 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 font-medium transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-lg shadow-xl dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-b border-blue-200 dark:border-blue-800/50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">💰</div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50">
                                        Actualizar Precios
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-slate-400">
                                        {producto.nombre} (SKU: {producto.sku || 'N/A'})
                                    </p>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
                                        Costo actual: {formatearCosto(precioActual || 0)}
                                        {precioCostoNuevo && precioCostoNuevo !== precioActual && (
                                            <span className="ml-3 text-blue-600 dark:text-blue-400 font-semibold">
                                                → Nuevo: {formatearCosto(precioCostoNuevo)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {cargandoPreciosApi || preciosPropuestos.length === 0 ? (
                            <div className="py-8 text-center">
                                <div className="mb-4 text-4xl">⏳</div>
                                <p className="text-gray-600 dark:text-slate-400">
                                    {cargandoPreciosApi ? 'Cargando precios del producto...' : 'Cargando cascada de precios...'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                                            <tr>
                                                <th scope="col" className="px-3 py-2 text-left font-medium">Tipo de precio</th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">Precio actual</th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">Ganancia actual</th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">Precio propuesto</th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">Ganancia (%)</th>
                                                <th scope="col" className="px-3 py-2 text-right font-medium">Diferencia</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                            {preciosPropuestos
                                                .sort((a, b) => a.tipo_precio_id - b.tipo_precio_id)
                                                .map((precio, index) => {
                                                    const diferencia = precio.precio_propuesto - precio.precio_actual;
                                                    const esCosto = precio.tipo_codigo === 'COSTO';
                                                    const decimales = decimalesDePrecio(precio.tipo_codigo);
                                                    const formato = esCosto ? formatearCosto : formatCurrency;
                                                    const hayCambio = Math.abs(diferencia) > (esCosto ? TOLERANCIA_COSTO : 0.01);

                                                    return (
                                                        <tr key={precio.id} data-precio-card className={hayCambio ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''}>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <span
                                                                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                                                                    style={{ backgroundColor: precio.tipo_color || '#999999' }}
                                                                >
                                                                    {precio.tipo_nombre}
                                                                </span>
                                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{precio.tipo_codigo}</span>
                                                            </td>
                                                            <td className="px-3 py-2 text-right font-mono whitespace-nowrap text-gray-900 tabular-nums dark:text-white">
                                                                {formato(precio.precio_actual)}
                                                            </td>
                                                            <td className="px-3 py-2 text-right font-mono whitespace-nowrap text-gray-600 tabular-nums dark:text-gray-300">
                                                                {precio.porcentaje_ganancia_actual.toFixed(1)}%
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <input
                                                                    type="number"
                                                                    step={esCosto ? '0.0001' : '0.01'}
                                                                    min="0"
                                                                    data-precio-input
                                                                    aria-label={`Precio propuesto ${precio.tipo_nombre}`}
                                                                    value={inputsEditando[index]?.precio !== undefined ? inputsEditando[index].precio : precio.precio_propuesto.toFixed(decimales)}
                                                                    onChange={(e) => {
                                                                        setInputsEditando(prev => ({
                                                                            ...prev,
                                                                            [index]: { ...prev[index], precio: e.target.value }
                                                                        }));
                                                                    }}
                                                                    onKeyDown={(e) => handleKeyDownPrecio(e, index)}
                                                                    onBlur={(e) => {
                                                                        const valor = e.target.value ? Number(e.target.value) : 0;
                                                                        handleCambioPrecioPropuesto(index, valor);
                                                                        setInputsEditando(prev => ({
                                                                            ...prev,
                                                                            [index]: { ...prev[index], precio: undefined }
                                                                        }));
                                                                    }}
                                                                    className="w-28 rounded border border-blue-300 bg-white px-2 py-1 text-right font-semibold text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-slate-800 dark:text-white"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 text-right">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    data-ganancia-input
                                                                    aria-label={`Ganancia propuesta ${precio.tipo_nombre}`}
                                                                    value={inputsEditando[index]?.ganancia !== undefined ? inputsEditando[index].ganancia : precio.porcentaje_ganancia_propuesto.toFixed(2)}
                                                                    onChange={(e) => {
                                                                        setInputsEditando(prev => ({
                                                                            ...prev,
                                                                            [index]: { ...prev[index], ganancia: e.target.value }
                                                                        }));
                                                                    }}
                                                                    onKeyDown={(e) => handleKeyDownGanancia(e, index)}
                                                                    onBlur={(e) => {
                                                                        const valor = e.target.value ? Number(e.target.value) : 0;
                                                                        handleCambioGananciaPropuesta(index, valor);
                                                                        setInputsEditando(prev => ({
                                                                            ...prev,
                                                                            [index]: { ...prev[index], ganancia: undefined }
                                                                        }));
                                                                    }}
                                                                    className="w-24 rounded border border-blue-300 bg-white px-2 py-1 text-right text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-slate-800 dark:text-white"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 text-right text-xs font-semibold whitespace-nowrap">
                                                                {hayCambio ? (
                                                                    <span className={diferencia > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                                                        {diferencia > 0 ? '↑' : '↓'} {formato(Math.abs(diferencia))}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400">—</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Campo de motivo */}
                                <div className="mt-4 border-t border-gray-200 dark:border-slate-700 pt-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Motivo de la actualización
                                    </label>
                                    <input
                                        type="text"
                                        value={motivoActualizacion}
                                        onChange={(e) => setMotivoActualizacion(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ej: Cambio de costo en compra"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 dark:bg-slate-800/30 border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 font-medium transition-colors"
                        >
                            Cerrar
                        </button>

                        {preciosPropuestos.length > 0 && onActualizarPrecios && (
                            <button
                                onClick={handleGuardarPrecios}
                                disabled={guardando}
                                className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {guardando && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {guardando ? 'Actualizando...' : '💾 Guardar Cambios'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

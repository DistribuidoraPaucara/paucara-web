import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

interface AlmacenItem {
    almacenes_prestables_id: number;
    cantidad: number;
}

interface ModalAlmacenesDetalleProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (almacenes: AlmacenItem[], almacenesEmbase?: AlmacenItem[]) => void;
    prestableNombre: string;
    cantidadTotal: number;
    almacenes: Array<{ id: number; nombre: string; es_proveedor?: boolean }>;
    stockDisponible: Array<{
        almacenes_prestables_id: number;
        cantidad_disponible: number;
    }>;
    almacenesActuales?: AlmacenItem[];
    // Nuevos props para canastilla/embases
    esCanastilla?: boolean;
    capacidadCanastilla?: number;
    embaseNombre?: string;
    embaseStockDisponible?: Array<{
        almacenes_prestables_id: number;
        cantidad_disponible: number;
    }>;
}

export default function ModalAlmacenesDetalle({
    isOpen,
    onClose,
    onSave,
    prestableNombre,
    cantidadTotal,
    almacenes,
    stockDisponible,
    almacenesActuales = [],
    esCanastilla = false,
    capacidadCanastilla = 0,
    embaseNombre = '',
    embaseStockDisponible = [],
}: ModalAlmacenesDetalleProps) {
    const [almacenesSeleccionados, setAlmacenesSeleccionados] = useState<AlmacenItem[]>(almacenesActuales);
    const [almacenesEmbase, setAlmacenesEmbase] = useState<AlmacenItem[]>([]);

    useEffect(() => {
        if (isOpen) {
            console.log('🔓 Modal Abierto - Información de Almacenes:', {
                prestableNombre,
                cantidadTotal,
                almacenesDisponibles: almacenes,
                stockDisponible: stockDisponible,
                almacenesActuales: almacenesActuales,
                esCanastilla,
                capacidadCanastilla,
                embaseNombre,
                embaseStockDisponible,
            });

            // ✅ LOG adicional para debug de stock
            console.log('%c📊 STOCK DISPONIBLE RECIBIDO:', 'color: #ff6600; font-weight: bold');
            if (stockDisponible && stockDisponible.length > 0) {
                console.table(stockDisponible);
            } else {
                console.warn('⚠️ SIN STOCK DISPONIBLE - Array vacío o undefined');
            }

            // Usar solo los almacenes actuales, sin pre-cargar
            const almacenesAMostrar = almacenesActuales.length > 0 ? almacenesActuales : [];

            console.log('📋 Almacenes a mostrar:', almacenesAMostrar.length > 0 ? almacenesAMostrar : 'Ninguno (modal vacío)');

            setAlmacenesSeleccionados(almacenesAMostrar);

            // Si es canastilla, calcular embases
            if (esCanastilla && almacenesAMostrar.length > 0) {
                calcularEmbasesAutomatico(almacenesAMostrar);
            } else {
                setAlmacenesEmbase([]);
            }
        }
    }, [isOpen, almacenesActuales, esCanastilla, capacidadCanastilla, prestableNombre, cantidadTotal]);

    // Calcular almacenes de embase basado en canastilla
    const calcularEmbasesAutomatico = (almacenesCanastilla: AlmacenItem[]) => {
        if (!esCanastilla || !capacidadCanastilla) return;

        const almacenesCalculados = almacenesCanastilla.map(almData => ({
            almacenes_prestables_id: almData.almacenes_prestables_id,
            cantidad: almData.cantidad * capacidadCanastilla,
        }));

        setAlmacenesEmbase(almacenesCalculados);
    };

    const handleAgregarAlmacen = () => {
        if (almacenesSeleccionados.length < almacenes.length) {
            const almacenesUsados = almacenesSeleccionados.map(a => a.almacenes_prestables_id);
            const proximoAlmacen = almacenes.find(a => !almacenesUsados.includes(a.id));
            if (proximoAlmacen) {
                console.log('➕ Agregando Almacén:', {
                    nombre: proximoAlmacen.nombre,
                    id: proximoAlmacen.id,
                    stockDisponible: stockDisponible.find(s => s.almacenes_prestables_id === proximoAlmacen.id)?.cantidad_disponible,
                });
                setAlmacenesSeleccionados([...almacenesSeleccionados, {
                    almacenes_prestables_id: proximoAlmacen.id,
                    cantidad: 1,
                }]);
            }
        }
    };

    const handleActualizarCantidad = (index: number, cantidad: number) => {
        const nuevos = [...almacenesSeleccionados];
        const almacenActualizado = almacenes.find(a => a.id === nuevos[index].almacenes_prestables_id);

        console.log('📝 Cantidad Actualizada:', {
            almacen: almacenActualizado?.nombre,
            cantidadAnterior: nuevos[index].cantidad,
            cantidadNueva: cantidad,
            stockDisponible: stockDisponible.find(s => s.almacenes_prestables_id === nuevos[index].almacenes_prestables_id)?.cantidad_disponible,
        });

        nuevos[index].cantidad = cantidad;
        setAlmacenesSeleccionados(nuevos);

        // Si es canastilla, recalcular embases automáticamente
        if (esCanastilla) {
            console.log('🔖 Recalculando embases...');
            calcularEmbasesAutomatico(nuevos);
        }
    };

    const handleEliminarAlmacen = (index: number) => {
        const almacenAEliminar = almacenesSeleccionados[index];
        const almacenInfo = almacenes.find(a => a.id === almacenAEliminar.almacenes_prestables_id);
        console.log('❌ Eliminando Almacén:', {
            nombre: almacenInfo?.nombre,
            id: almacenInfo?.id,
            cantidad: almacenAEliminar.cantidad,
        });
        setAlmacenesSeleccionados(almacenesSeleccionados.filter((_, i) => i !== index));
    };

    const cantidadDistribuida = almacenesSeleccionados.reduce((sum, a) => sum + a.cantidad, 0);
    // ✅ MODIFICADO: Permitir devoluciones parciales (cantidadDistribuida <= cantidadTotal)
    const esValido = cantidadDistribuida > 0 && cantidadDistribuida <= cantidadTotal && almacenesSeleccionados.length > 0;

    const handleGuardar = () => {
        if (esValido) {
            console.log('💾 Guardando Almacenes:', {
                canastilla: {
                    almacenes: almacenesSeleccionados.map(a => ({
                        nombre: almacenes.find(al => al.id === a.almacenes_prestables_id)?.nombre,
                        cantidad: a.cantidad,
                    })),
                    cantidadTotal: cantidadDistribuida,
                },
                ...(esCanastilla && {
                    embases: {
                        almacenes: almacenesEmbase.map(a => ({
                            nombre: almacenes.find(al => al.id === a.almacenes_prestables_id)?.nombre,
                            cantidad: a.cantidad,
                        })),
                        cantidadTotal: almacenesEmbase.reduce((sum, a) => sum + a.cantidad, 0),
                    },
                }),
            });
            onSave(almacenesSeleccionados, esCanastilla ? almacenesEmbase : undefined);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Encabezado */}
                <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            🏭 Seleccionar Almacenes
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {prestableNombre}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                    {/* Cantidad Total */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                            Cantidad Total Requerida
                        </div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                            {cantidadTotal}
                        </div>
                    </div>

                    {/* Distribución de Almacenes */}
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white">
                            Distribución por Almacén
                        </label>
                        <div className="mt-3 space-y-2">
                            {almacenesSeleccionados.map((almacenData, idx) => {
                                const almacenInfo = almacenes.find(a => a.id === almacenData.almacenes_prestables_id);
                                const stockInfo = stockDisponible.find(s => s.almacenes_prestables_id === almacenData.almacenes_prestables_id);
                                const disponible = stockInfo?.cantidad_disponible || 0;
                                const esValida = almacenData.cantidad <= disponible;

                                return (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <select
                                            value={almacenData.almacenes_prestables_id}
                                            onChange={(e) => {
                                                const nuevos = [...almacenesSeleccionados];
                                                nuevos[idx].almacenes_prestables_id = parseInt(e.target.value);
                                                setAlmacenesSeleccionados(nuevos);
                                            }}
                                            className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        >
                                            {almacenes.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min="1"
                                                max={disponible}
                                                value={almacenData.cantidad}
                                                onChange={(e) => handleActualizarCantidad(idx, parseInt(e.target.value) || 0)}
                                                className={`w-16 px-2 py-1 border rounded text-center text-sm font-medium ${
                                                    esValida
                                                        ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20 text-green-900 dark:text-green-100'
                                                        : 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20 text-red-900 dark:text-red-100'
                                                }`}
                                            />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                / {disponible}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleEliminarAlmacen(idx)}
                                            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Botón Agregar Almacén */}
                    {almacenesSeleccionados.length < almacenes.length && (
                        <button
                            onClick={handleAgregarAlmacen}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-blue-300 dark:border-blue-700 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-medium transition"
                        >
                            <Plus size={16} />
                            Agregar Almacén
                        </button>
                    )}

                    {/* Sección de Embases (solo si es canastilla) */}
                    {esCanastilla && almacenesEmbase.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">
                                🔖 Embases Automáticos: {embaseNombre}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 mb-3">
                                Cantidad: {almacenesEmbase.reduce((sum, a) => sum + a.cantidad, 0)}
                                ({capacidadCanastilla} × {cantidadTotal})
                            </div>
                            <div className="space-y-2">
                                {almacenesEmbase.map((almacenData, idx) => {
                                    const almacenInfo = almacenes.find(a => a.id === almacenData.almacenes_prestables_id);
                                    const stockInfo = embaseStockDisponible.find(s => s.almacenes_prestables_id === almacenData.almacenes_prestables_id);
                                    const disponible = stockInfo?.cantidad_disponible || 0;
                                    const esValida = almacenData.cantidad <= disponible;

                                    return (
                                        <div key={idx} className="flex gap-2 items-center text-xs">
                                            <span className="flex-1 text-green-700 dark:text-green-300">
                                                {almacenInfo?.nombre}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className={`font-semibold px-2 py-1 rounded ${
                                                    esValida
                                                        ? 'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                                                        : 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-200'
                                                }`}>
                                                    {almacenData.cantidad}
                                                </span>
                                                <span className="text-green-600 dark:text-green-400">
                                                    / {disponible}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Validación */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                Distribuido:
                            </span>
                            <span className={`font-semibold ${
                                // ✅ MODIFICADO: Verde si es válido (0 < cantidad <= total)
                                cantidadDistribuida > 0 && cantidadDistribuida <= cantidadTotal
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                {cantidadDistribuida} / {cantidadTotal}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (cantidadDistribuida / cantidadTotal) * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="sticky bottom-0 flex gap-2 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        disabled={!esValido}
                        className={`flex-1 px-4 py-2 rounded text-white font-medium text-sm transition ${
                            esValido
                                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                        }`}
                    >
                        Guardar Almacenes
                    </button>
                </div>
            </div>
        </div>
    );
}

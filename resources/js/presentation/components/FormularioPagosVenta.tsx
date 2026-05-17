import { useState, forwardRef, useImperativeHandle } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { formatCurrencyMinimalDecimals } from '@/lib/utils';

interface Pago {
    id: string;
    tipo_pago_id: number;
    monto: number;
    tipo_pago_nombre?: string;
}

interface FilaPago {
    id: string;
    tipo_pago_id: number | '';
    monto: string;
}

interface FormularioPagosVentaProps {
    tiposPago: Array<{ id: number; nombre: string; codigo?: string }>;
    totalVenta: number;
    pagosRegistrados: Pago[];
    onPagosChange: (pagos: Pago[]) => void;
    disabled?: boolean;
    compact?: boolean;
}

const FormularioPagosVenta = forwardRef(({
    tiposPago,
    totalVenta,
    pagosRegistrados,
    onPagosChange,
    disabled = false,
    compact = false,
}: FormularioPagosVentaProps, ref) => {
    const [filas, setFilas] = useState<FilaPago[]>([]);
    const [error, setError] = useState<string>('');

    useImperativeHandle(ref, () => ({
        agregarFila: handleAgregarFila,
        // ✅ NUEVO: Método para resetear el formulario después de crear una venta
        reset: () => {
            setFilas([]);
            setError('');
        },
    }));

    const tiposPagoFiltrados = tiposPago.filter(tipo => tipo.codigo !== 'CREDITO');
    const totalPagado = pagosRegistrados.reduce((sum, p) => sum + p.monto, 0);
    const pendiente = Math.max(0, totalVenta - totalPagado);
    const excedente = Math.max(0, totalPagado - totalVenta);

    const handleAgregarFila = () => {
        const nuevaFila: FilaPago = {
            id: Date.now().toString() + Math.random(),
            tipo_pago_id: '',
            monto: '',
        };
        setFilas([...filas, nuevaFila]);
    };

    const handleActualizarFila = (id: string, campo: 'tipo_pago_id' | 'monto', valor: string | number) => {
        setFilas(filas.map(fila =>
            fila.id === id ? { ...fila, [campo]: valor } : fila
        ));
        setError('');
    };

    const handleEliminarFila = (id: string) => {
        setFilas(filas.filter(fila => fila.id !== id));
    };

    const handleAgregarPago = (fila: FilaPago) => {
        setError('');

        if (!fila.tipo_pago_id) {
            setError('Selecciona un tipo de pago');
            return;
        }

        if (!fila.monto || Number(fila.monto) <= 0) {
            setError('El monto debe ser mayor a 0');
            return;
        }

        const monto = Number(fila.monto);
        if (totalPagado + monto > totalVenta * 1.1) {
            setError(`El pago excede el total permitido (${formatCurrencyMinimalDecimals(totalVenta * 1.1)})`);
            return;
        }

        const tipoPagoSeleccionado = tiposPago.find((t) => t.id === Number(fila.tipo_pago_id));

        const nuevoPago: Pago = {
            id: Date.now().toString() + Math.random(),
            tipo_pago_id: Number(fila.tipo_pago_id),
            monto: monto,
            tipo_pago_nombre: tipoPagoSeleccionado?.nombre,
        };

        onPagosChange([...pagosRegistrados, nuevoPago]);
        handleEliminarFila(fila.id);
    };

    const handleEliminarPago = (id: string) => {
        onPagosChange(pagosRegistrados.filter((p) => p.id !== id));
    };

    // Modo compacto: Para uso en grid de totales
    if (compact) {
        return (
            <div className="space-y-2">
                {filas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {filas.map((fila) => (
                            <div key={fila.id} className="flex-1 min-w-[140px] space-y-1 p-2 bg-gray-100 dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
                                {/* Tipo de Pago */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                        Tipo
                                    </label>
                                    <select
                                        value={fila.tipo_pago_id}
                                        onChange={(e) => handleActualizarFila(fila.id, 'tipo_pago_id', e.target.value ? Number(e.target.value) : '')}
                                        disabled={disabled}
                                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                    >
                                        <option value="">Seleccionar</option>
                                        {tiposPagoFiltrados.map((tipo) => (
                                            <option key={tipo.id} value={tipo.id}>
                                                {tipo.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Monto */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                        Monto
                                    </label>
                                    <input
                                        type="number"
                                        value={fila.monto}
                                        onChange={(e) => handleActualizarFila(fila.id, 'monto', e.target.value)}
                                        disabled={disabled}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-right focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 [&::-webkit-outer-spin-button]:[appearance:none] [&::-webkit-inner-spin-button]:[appearance:none] [appearance:textfield]"
                                    />
                                </div>

                                {/* Botones */}
                                <div className="flex gap-1 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleAgregarPago(fila)}
                                        disabled={disabled || !fila.tipo_pago_id || !fila.monto}
                                        className="flex-1 px-2 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        ✓
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleEliminarFila(fila.id)}
                                        disabled={disabled}
                                        className="px-1.5 py-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded transition-colors disabled:opacity-50"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {error && (
                                    <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded mt-1">
                                        {error}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Resumen simplificado para modo compacto */}
                {pagosRegistrados.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">Pagado:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrencyMinimalDecimals(pagosRegistrados.reduce((sum, p) => sum + p.monto, 0))}
                            </span>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {pagosRegistrados.map((pago) => (
                                <div key={pago.id} className="flex justify-between items-center text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded">
                                    <span className="text-gray-600 dark:text-gray-400">{pago.tipo_pago_nombre}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatCurrencyMinimalDecimals(pago.monto)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleEliminarPago(pago.id)}
                                            disabled={disabled}
                                            className="text-red-600 hover:text-red-700 dark:text-red-400 disabled:opacity-50"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-200 dark:border-zinc-700">
            {/* Encabezado con botón */}
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Desglose de Pagos
                </h3>
                <button
                    type="button"
                    onClick={handleAgregarFila}
                    disabled={disabled}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Agregar nueva forma de pago"
                >
                    <Plus size={16} />
                    Agregar Pago
                </button>
            </div>

            {/* Filas de entrada dinámicas */}
            {filas.length > 0 && (
                <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-zinc-700">
                    {filas.map((fila) => (
                        <div key={fila.id} className="grid grid-cols-4 gap-2">
                            {/* Tipo de Pago */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tipo de Pago
                                </label>
                                <select
                                    value={fila.tipo_pago_id}
                                    onChange={(e) => handleActualizarFila(fila.id, 'tipo_pago_id', e.target.value ? Number(e.target.value) : '')}
                                    disabled={disabled}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                                >
                                    <option value="">Seleccionar</option>
                                    {tiposPagoFiltrados.map((tipo) => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Monto */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Monto
                                </label>
                                <input
                                    type="number"
                                    value={fila.monto}
                                    onChange={(e) => handleActualizarFila(fila.id, 'monto', e.target.value)}
                                    disabled={disabled}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-right focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 [&::-webkit-outer-spin-button]:[appearance:none] [&::-webkit-inner-spin-button]:[appearance:none] [appearance:textfield]"
                                />
                            </div>

                            {/* Botón Agregar */}
                            <div className="flex items-end gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleAgregarPago(fila)}
                                    disabled={disabled || !fila.tipo_pago_id || !fila.monto}
                                    className="flex-1 px-3 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1"
                                >
                                    <Plus size={16} />
                                    Agregar
                                </button>

                                {/* Botón Eliminar Fila */}
                                <button
                                    type="button"
                                    onClick={() => handleEliminarFila(fila.id)}
                                    disabled={disabled}
                                    className="px-2 py-2 text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                    title="Eliminar esta fila"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {error && (
                        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            )}

            {/* Tabla de pagos agregados */}
            {pagosRegistrados.length > 0 && (
                <div className="space-y-2">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {pagosRegistrados.map((pago) => (
                            <div
                                key={pago.id}
                                className="flex items-center justify-between p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md"
                            >
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {pago.tipo_pago_nombre}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white w-24 text-right">
                                        {formatCurrencyMinimalDecimals(pago.monto)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleEliminarPago(pago.id)}
                                        disabled={disabled}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                        title="Eliminar pago"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen de pagos */}
                    <div className="pt-3 border-t border-gray-200 dark:border-zinc-700 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">Total a pagar:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrencyMinimalDecimals(totalVenta)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">Total pagado:</span>
                            <span className={`font-semibold ${totalPagado === totalVenta ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                {formatCurrencyMinimalDecimals(totalPagado)}
                            </span>
                        </div>
                        {pendiente > 0 && (
                            <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                                <span>Pendiente:</span>
                                <span className="font-semibold">
                                    {formatCurrencyMinimalDecimals(pendiente)}
                                </span>
                            </div>
                        )}
                        {excedente > 0 && (
                            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                <span>Cambio:</span>
                                <span className="font-semibold">
                                    {formatCurrencyMinimalDecimals(excedente)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {pagosRegistrados.length === 0 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                    Sin pagos agregados
                </div>
            )}
        </div>
    );
});

FormularioPagosVenta.displayName = 'FormularioPagosVenta';
export default FormularioPagosVenta;

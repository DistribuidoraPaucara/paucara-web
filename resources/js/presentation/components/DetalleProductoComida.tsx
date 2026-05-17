/**
 * DetalleProductoComida Component
 *
 * Responsabilidades:
 * ✅ Mostrar detalle de un producto de comida en el carrito
 * ✅ Mostrar adicionales seleccionados con sus precios
 * ✅ Permitir editar/eliminar el producto
 */

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Adicional {
    id: number;
    nombre: string;
    precio_adicional: number;
}

interface DetalleProductoComidaProps {
    nombreProducto: string;
    precioBase: number;
    adicionales: Adicional[];
    cantidad: number;
    precioTotal: number;
    onEditar?: () => void;
    onEliminar?: () => void;
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export function DetalleProductoComida({
    nombreProducto,
    precioBase,
    adicionales,
    cantidad,
    precioTotal,
    onEditar,
    onEliminar,
}: DetalleProductoComidaProps) {
    const sumaAdicionales = adicionales.reduce((sum, a) => sum + a.precio_adicional, 0);

    return (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50 space-y-3">
            {/* Producto y cantidad */}
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {nombreProducto} x{cantidad}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Base: {formatCurrency(precioBase)}
                    </p>

                    {/* Adicionales */}
                    {adicionales.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {adicionales.map(adicional => (
                                <p
                                    key={adicional.id}
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    + {adicional.nombre}: {formatCurrency(adicional.precio_adicional)}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {/* Precio total */}
                <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(precioTotal)}
                    </p>
                    {sumaAdicionales > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            (+{formatCurrency(sumaAdicionales)})
                        </p>
                    )}
                </div>
            </div>

            {/* Botones de acción */}
            {(onEditar || onEliminar) && (
                <div className="flex gap-2 justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
                    {onEditar && (
                        <button
                            onClick={onEditar}
                            className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition flex items-center gap-1"
                        >
                            <Edit2 size={14} />
                            Editar
                        </button>
                    )}
                    {onEliminar && (
                        <button
                            onClick={onEliminar}
                            className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition flex items-center gap-1"
                        >
                            <Trash2 size={14} />
                            Eliminar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

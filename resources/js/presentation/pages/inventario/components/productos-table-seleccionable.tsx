import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Producto {
    id: number;
    nombre: string;
    sku: string;
    categoria?: string;
    marca?: string;
    proveedor?: string;
    unidad?: string;
    stock_minimo?: number;
    stock_total?: number;
    precio_venta?: number;
}

interface Props {
    productos: Producto[];
    seleccionados: Set<number>;
    onToggleSeleccion: (productoId: number) => void;
    onSeleccionarTodos: () => void;
    productosYaAgregados: number[];
}

export default function ProductosTableSeleccionable({
    productos,
    seleccionados,
    onToggleSeleccion,
    onSeleccionarTodos,
    productosYaAgregados,
}: Props) {
    const getStockStatus = (producto: Producto) => {
        const stock = producto.stock_total ?? 0;
        if (stock === 0) {
            return {
                icon: '❌',
                label: 'Sin stock',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
            };
        }
        if (stock <= (producto.stock_minimo ?? 0)) {
            return {
                icon: '⚠️',
                label: 'Stock bajo',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
            };
        }
        return {
            icon: '✅',
            label: 'Stock alto',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        };
    };

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Header con checkbox "Seleccionar todos" */}
            <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={
                        seleccionados.size > 0 &&
                        seleccionados.size === productos.length
                    }
                    onChange={onSeleccionarTodos}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                    {seleccionados.size > 0
                        ? `${seleccionados.size} seleccionado(s)`
                        : 'Seleccionar todos en esta página'}
                </span>
            </div>

            {/* Filas de productos */}
            {productos.map((producto) => {
                const yaAgregado = productosYaAgregados.includes(producto.id);
                const seleccionado = seleccionados.has(producto.id);
                const stockStatus = getStockStatus(producto);

                return (
                    <div
                        key={producto.id}
                        className={`px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition ${
                            yaAgregado ? 'bg-green-50 dark:bg-green-900/20' : ''
                        }`}
                        onClick={() => !yaAgregado && onToggleSeleccion(producto.id)}
                    >
                        <input
                            type="checkbox"
                            checked={seleccionado}
                            onChange={() => onToggleSeleccion(producto.id)}
                            disabled={yaAgregado}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 dark:border-gray-600 disabled:opacity-50 bg-white dark:bg-gray-700"
                        />

                        <div className="flex-1 grid grid-cols-5 gap-3 items-start">
                            {/* Columna 1: Nombre y SKU */}
                            <div className="min-w-0">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {producto.nombre}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SKU: {producto.sku}
                                </p>
                            </div>

                            {/* Columna 2: Stock */}
                            <div className="text-sm">
                                <p className={`font-medium ${stockStatus.color}`}>
                                    {stockStatus.icon} {stockStatus.label}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {producto.stock_total ?? 0} / {producto.stock_minimo ?? 0} mín
                                </p>
                            </div>

                            {/* Columna 3: Precio */}
                            <div className="text-sm">
                                {producto.precio_venta ? (
                                    <>
                                        <p className="font-medium text-green-600 dark:text-green-400">
                                            ${parseFloat(producto.precio_venta.toString()).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Con precio</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-medium text-gray-400 dark:text-gray-500">
                                            🚫 Sin precio
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Pendiente</p>
                                    </>
                                )}
                            </div>

                            {/* Columna 4: Marca/Proveedor */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Marca</p>
                                <p className="truncate">{producto.marca || 'N/A'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Proveedor</p>
                                <p className="truncate">{producto.proveedor || 'N/A'}</p>
                            </div>

                            {/* Columna 5: Estado */}
                            <div className="text-right">
                                {yaAgregado && (
                                    <div className="flex items-center justify-end gap-1">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded whitespace-nowrap">
                                            Agregado
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

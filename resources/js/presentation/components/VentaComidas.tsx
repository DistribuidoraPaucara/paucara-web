/**
 * VentaComidas Component
 *
 * Responsabilidades:
 * ✅ Integrar selector de productos con carrito
 * ✅ Mostrar resumen del carrito
 * ✅ Exportar productos de comida para la venta
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { ProductosComidaSelector } from './ProductosComidaSelector';
import { DetalleProductoComida } from './DetalleProductoComida';
import { useCarritoComidas } from '@/application/hooks/use-carrito-comidas';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Adicional {
    id: number;
    nombre: string;
    precio_adicional: number;
    activo: boolean;
}

interface ProductoComidaConAdicionales {
    producto: {
        id: number;
        nombre: string;
        precio_venta: number;
        adicionales?: Adicional[];
    };
    adicionalesSeleccionados: number[];
    cantidad: number;
}

interface VentaComidasProps {
    onProductosComidaChange?: (productos: any[]) => void;
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export function VentaComidas({ onProductosComidaChange }: VentaComidasProps) {
    const carrito = useCarritoComidas();
    const [mostrarSelector, setMostrarSelector] = useState(true);

    // Notificar cambios al padre
    useEffect(() => {
        if (onProductosComidaChange) {
            onProductosComidaChange(carrito.items);
        }
    }, [carrito.items, onProductosComidaChange]);

    const handleAgregarProducto = (detalle: ProductoComidaConAdicionales) => {
        const adicionalesDetalles = detalle.producto.adicionales?.filter(a =>
            detalle.adicionalesSeleccionados.includes(a.id)
        ) || [];

        carrito.agregarProducto(detalle as any, adicionalesDetalles);
        toast.success(`${detalle.producto.nombre} agregado al carrito`);
    };

    const handleEliminar = (index: number) => {
        carrito.eliminarProducto(index);
        toast.success('Producto eliminado del carrito');
    };

    return (
        <div className="space-y-6">
            {/* Selector de productos */}
            {mostrarSelector && (
                <ProductosComidaSelector onAgregar={handleAgregarProducto} />
            )}

            {/* Carrito de comidas */}
            {carrito.items.length > 0 && (
                <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-gray-900 dark:text-white">
                                    🛒 Carrito de Comidas
                                </CardTitle>
                                <CardDescription>
                                    {carrito.totalItems} producto(s) seleccionado(s)
                                </CardDescription>
                            </div>
                            <button
                                onClick={() => {
                                    carrito.limpiarCarrito();
                                    toast.success('Carrito vaciado');
                                }}
                                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Vaciar
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Items del carrito */}
                        {carrito.items.map((item, index) => (
                            <DetalleProductoComida
                                key={`item-${item.nombre_producto}-${index}`}
                                nombreProducto={item.nombre_producto}
                                precioBase={item.precio_base}
                                adicionales={item.adicionales_detalles || []}
                                cantidad={item.cantidad}
                                precioTotal={item.precio_total}
                                onEliminar={() => handleEliminar(index)}
                            />
                        ))}

                        {/* Total */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 flex justify-between items-center">
                                <span className="font-semibold text-gray-900 dark:text-white text-lg">
                                    Total Comidas:
                                </span>
                                <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">
                                    {formatCurrency(carrito.calcularTotal())}
                                </span>
                            </div>
                        </div>

                        {/* Botón para agregar más productos */}
                        <button
                            onClick={() => setMostrarSelector(!mostrarSelector)}
                            className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                        >
                            {mostrarSelector ? '−' : '+'} {mostrarSelector ? 'Ocultar' : 'Agregar más'} productos
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* Mensaje si no hay productos */}
            {carrito.items.length === 0 && !mostrarSelector && (
                <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            No hay productos de comida en el carrito
                        </p>
                        <button
                            onClick={() => setMostrarSelector(true)}
                            className="px-6 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                        >
                            Seleccionar productos
                        </button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

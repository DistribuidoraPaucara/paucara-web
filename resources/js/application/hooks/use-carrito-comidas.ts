/**
 * Hook: useCarritoComidas
 *
 * Maneja la lógica del carrito para productos de comida
 */

import { useState, useCallback } from 'react';
import type { DetalleComidaVenta, Adicional } from '@/domain/entities/productos-comida';

interface ProductoComidaConAdicionales {
    producto: {
        id: number;
        nombre: string;
        precio_venta: number;
    };
    adicionalesSeleccionados: number[];
    cantidad: number;
    // Datos de adicionales para mostrar
    adicionales_detalles?: Adicional[];
}

export function useCarritoComidas() {
    const [items, setItems] = useState<DetalleComidaVenta[]>([]);

    const agregarProducto = useCallback((
        producto: ProductoComidaConAdicionales,
        adicionalesDetalles: Adicional[]
    ) => {
        const adicionalesSeleccionados = adicionalesDetalles.filter(a =>
            producto.adicionalesSeleccionados.includes(a.id)
        );

        const precioBase = producto.producto.precio_venta;
        const sumaAdicionales = adicionalesSeleccionados.reduce((sum, a) => sum + a.precio_adicional, 0);
        const precioUnitario = precioBase + sumaAdicionales;
        const precioTotal = precioUnitario * producto.cantidad;

        const nuevoItem: DetalleComidaVenta = {
            producto_id: producto.producto.id,
            nombre_producto: producto.producto.nombre,
            precio_base: precioBase,
            adicionalesSeleccionados: producto.adicionalesSeleccionados,
            cantidad: producto.cantidad,
            precio_total: precioTotal,
            adicionales_detalles: adicionalesSeleccionados,
        };

        setItems(prev => [...prev, nuevoItem]);
    }, []);

    const eliminarProducto = useCallback((index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    }, []);

    const actualizarProducto = useCallback((
        index: number,
        updates: Partial<DetalleComidaVenta>
    ) => {
        setItems(prev =>
            prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
        );
    }, []);

    const incrementarCantidad = useCallback((index: number) => {
        setItems(prev =>
            prev.map((item, i) => {
                if (i === index) {
                    const nuevaCantidad = item.cantidad + 1;
                    const precioUnitario = item.precio_total / item.cantidad;
                    return {
                        ...item,
                        cantidad: nuevaCantidad,
                        precio_total: precioUnitario * nuevaCantidad,
                    };
                }
                return item;
            })
        );
    }, []);

    const decrementarCantidad = useCallback((index: number) => {
        setItems(prev =>
            prev.map((item, i) => {
                if (i === index && item.cantidad > 1) {
                    const nuevaCantidad = item.cantidad - 1;
                    const precioUnitario = item.precio_total / item.cantidad;
                    return {
                        ...item,
                        cantidad: nuevaCantidad,
                        precio_total: precioUnitario * nuevaCantidad,
                    };
                }
                return item;
            })
        );
    }, []);

    const actualizarCantidadPorProductoId = useCallback((productoId: number, nuevaCantidad: number) => {
        setItems(prev =>
            prev.map(item => {
                if (item.producto_id === productoId && nuevaCantidad > 0) {
                    const precioUnitario = item.precio_total / item.cantidad;
                    return {
                        ...item,
                        cantidad: nuevaCantidad,
                        precio_total: precioUnitario * nuevaCantidad,
                    };
                }
                return item;
            })
        );
    }, []);

    const eliminarProductoPorId = useCallback((productoId: number) => {
        setItems(prev => prev.filter(item => item.producto_id !== productoId));
    }, []);

    const actualizarPrecioBasePorProductoId = useCallback((productoId: number, nuevoPrecioBase: number) => {
        setItems(prev =>
            prev.map(item => {
                if (item.producto_id === productoId) {
                    const precioUnitarioAnterior = item.precio_total / item.cantidad;
                    const diferenciaPrecio = nuevoPrecioBase - item.precio_base;
                    return {
                        ...item,
                        precio_base: nuevoPrecioBase,
                        precio_total: item.precio_total + (diferenciaPrecio * item.cantidad),
                    };
                }
                return item;
            })
        );
    }, []);

    const limpiarCarrito = useCallback(() => {
        setItems([]);
    }, []);

    const calcularTotal = useCallback(() => {
        return items.reduce((sum, item) => sum + item.precio_total, 0);
    }, [items]);

    return {
        items,
        agregarProducto,
        eliminarProducto,
        actualizarProducto,
        incrementarCantidad,
        decrementarCantidad,
        actualizarCantidadPorProductoId,
        eliminarProductoPorId,
        actualizarPrecioBasePorProductoId,
        limpiarCarrito,
        calcularTotal,
        totalItems: items.length,
    };
}

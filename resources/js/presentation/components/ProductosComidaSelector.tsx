/**
 * ProductosComidaSelector Component
 *
 * Responsabilidades:
 * ✅ Mostrar productos de comida/helados en grid
 * ✅ Permitir seleccionar adicionales
 * ✅ Calcular precio dinámico (base + extras)
 * ✅ Agregar al carrito con detalles
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Adicional {
    id: number;
    nombre: string;
    precio_adicional: number;
    activo: boolean;
}

interface ProductoComida {
    id: number;
    nombre: string;
    descripcion: string;
    precio_venta: number;
    es_producto_comida: boolean;
    imagen_url?: string | null;
    adicionales?: Adicional[];
}

interface ProductoComidaConAdicionales {
    producto: ProductoComida;
    adicionalesSeleccionados: number[];
    cantidad: number;
}

interface ProductosComidaSelectorProps {
    onAgregar: (detalle: ProductoComidaConAdicionales) => void;
    onActualizar?: (productoId: number, nuevaCantidad: number) => void;
    onActualizarPrecio?: (productoId: number, nuevoPrecioBase: number) => void;
    onEliminar?: (productoId: number) => void;
    productosEnCarrito?: Array<{
        producto_id: number;
        cantidad: number;
    }>;
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export function ProductosComidaSelector({ onAgregar, onActualizar, onActualizarPrecio, onEliminar, productosEnCarrito = [] }: ProductosComidaSelectorProps) {
    const [productos, setProductos] = useState<ProductoComida[]>([]);
    const [cargando, setCargando] = useState(true);
    const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoComida | null>(null);
    const [adicionalesSeleccionados, setAdicionalesSeleccionados] = useState<number[]>([]);
    const [cantidad, setCantidad] = useState(1);
    const [precioBaseEditable, setPrecioBaseEditable] = useState(0);

    // Obtener cantidad de un producto en el carrito
    const getCantidadEnCarrito = (productoId: number): number => {
        return productosEnCarrito.find(p => p.producto_id === productoId)?.cantidad || 0;
    };

    // Actualizar carrito cuando cambia precio base o adicionales si el producto ya está en carrito
    useEffect(() => {
        if (productoSeleccionado && getCantidadEnCarrito(productoSeleccionado.id) > 0 && onActualizarPrecio) {
            // Actualizar el precio base en el carrito
            onActualizarPrecio(productoSeleccionado.id, precioBaseEditable);
        }
    }, [precioBaseEditable, onActualizarPrecio, productoSeleccionado]);

    // Cargar productos de comida
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await fetch('/api/productos-comida/');
                const data = await response.json();

                console.log('🍦 DATOS DEL BACKEND - /api/productos-comida/', {
                    success: data.success,
                    cantidad: data.data?.length || 0,
                    datos_completos: data.data,
                });

                if (data.success && data.data) {
                    setProductos(data.data);
                    console.log('✅ Productos cargados:', data.data);
                } else {
                    toast.error('Error al cargar productos de comida');
                    console.error('❌ Error en respuesta:', data);
                }
            } catch (error) {
                console.error('Error cargando productos:', error);
                toast.error('Error al cargar productos');
            } finally {
                setCargando(false);
            }
        };

        cargarProductos();
    }, []);

    // Seleccionar producto
    const handleSeleccionarProducto = (producto: ProductoComida) => {
        setProductoSeleccionado(producto);
        setAdicionalesSeleccionados([]);

        // Si el producto ya está en el carrito, mostrar su cantidad actual
        const cantidadEnCarrito = getCantidadEnCarrito(producto.id);
        setCantidad(cantidadEnCarrito > 0 ? cantidadEnCarrito : 1);
        setPrecioBaseEditable(producto.precio_venta);
    };

    // Toggle adicional
    const toggleAdicional = (adicionalId: number) => {
        setAdicionalesSeleccionados(prev =>
            prev.includes(adicionalId)
                ? prev.filter(id => id !== adicionalId)
                : [...prev, adicionalId]
        );
    };

    // Calcular precio total
    const calcularPrecioTotal = (): number => {
        if (!productoSeleccionado) return 0;

        const precioBase = precioBaseEditable;
        const precioAdicionales = adicionalesSeleccionados.reduce((sum, id) => {
            const adicional = productoSeleccionado.adicionales?.find(a => a.id === id);
            return sum + (adicional?.precio_adicional || 0);
        }, 0);

        return (precioBase + precioAdicionales) * cantidad;
    };

    // Agregar al carrito
    const handleAgregar = () => {
        if (!productoSeleccionado) {
            toast.error('Selecciona un producto');
            return;
        }

        if (cantidad <= 0) {
            toast.error('La cantidad debe ser mayor a 0');
            return;
        }

        onAgregar({
            producto: productoSeleccionado,
            adicionalesSeleccionados,
            cantidad,
        });

        // Limpiar selección
        setProductoSeleccionado(null);
        setAdicionalesSeleccionados([]);
        setCantidad(1);
        setPrecioBaseEditable(0);
        toast.success('Producto agregado al carrito');
    };

    if (cargando) {
        return (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">🍦 Venta de Comidas/Helados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando productos...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
                {/* <CardTitle className="text-gray-900 dark:text-white">🍦 Venta de Comidas/Helados</CardTitle> */}
                <CardDescription>
                    Selecciona un producto y agrega tus adicionales favoritos
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Grid de productos */}
                    {!productoSeleccionado ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {productos.length === 0 ? (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No hay productos de comida disponibles
                                    </p>
                                </div>
                            ) : (
                                productos.map(producto => {
                                    const cantidadEnCarrito = getCantidadEnCarrito(producto.id);
                                    return (
                                        <button
                                            key={producto.id}
                                            onClick={() => handleSeleccionarProducto(producto)}
                                            className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg dark:hover:shadow-blue-900/30 transition-all relative"
                                        >
                                            {/* Badge con cantidad en carrito */}
                                            {cantidadEnCarrito > 0 && (
                                                <div className="absolute -top-2 -right-2 z-20 flex gap-1">
                                                    <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg border-2 border-white dark:border-gray-800">
                                                        {cantidadEnCarrito}
                                                    </div>
                                                    {onEliminar && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEliminar(producto.id);
                                                                toast.success('Producto eliminado del carrito');
                                                            }}
                                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transition"
                                                            title="Eliminar del carrito"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Imagen del producto */}
                                            {producto.imagen_url ? (
                                                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                    <img
                                                        src={producto.imagen_url}
                                                        alt={producto.nombre}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                                    <span className="text-4xl">🍦</span>
                                                </div>
                                            )}

                                            {/* Contenido */}
                                            <div className="p-4 text-left">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                    {producto.nombre}
                                                </h3>
                                                {producto.descripcion && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {producto.descripcion}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex justify-between items-center">
                                                    <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                                                        {formatCurrency(producto.precio_venta)}
                                                    </span>
                                                    {producto.adicionales && producto.adicionales.length > 0 && (
                                                        <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
                                                            +{producto.adicionales.length} extras
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        /* Vista de detalle del producto seleccionado */
                        <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                            {/* Imagen del producto en grande */}
                            {productoSeleccionado.imagen_url ? (
                                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <img
                                        src={productoSeleccionado.imagen_url}
                                        alt={productoSeleccionado.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                    <span className="text-8xl">🍦</span>
                                </div>
                            )}

                            {/* Encabezado con producto seleccionado */}
                            <div className="p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {productoSeleccionado.nombre}
                                        </h3>
                                        {productoSeleccionado.descripcion && (
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                {productoSeleccionado.descripcion}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setProductoSeleccionado(null)}
                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                                    >
                                        <X className="text-gray-600 dark:text-gray-400" size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                                    {/* Cantidad */}
                                    <div className="space-y-3 h-full">
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                            Cantidad:
                                        </label>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <button
                                                onClick={() => {
                                                    const newVal = Math.max(1, cantidad - 1);
                                                    setCantidad(newVal);
                                                    // Si el producto ya está en carrito, actualizar directamente
                                                    if (getCantidadEnCarrito(productoSeleccionado.id) > 0 && onActualizar) {
                                                        onActualizar(productoSeleccionado.id, newVal);
                                                    }
                                                }}
                                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={cantidad}
                                                onChange={(e) => {
                                                    const newVal = Math.max(1, parseInt(e.target.value) || 1);
                                                    setCantidad(newVal);
                                                    // Si el producto ya está en carrito, actualizar directamente
                                                    if (getCantidadEnCarrito(productoSeleccionado.id) > 0 && onActualizar) {
                                                        onActualizar(productoSeleccionado.id, newVal);
                                                    }
                                                }}
                                                className="w-20 text-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newVal = cantidad + 1;
                                                    setCantidad(newVal);
                                                    // Si el producto ya está en carrito, actualizar directamente
                                                    if (getCantidadEnCarrito(productoSeleccionado.id) > 0 && onActualizar) {
                                                        onActualizar(productoSeleccionado.id, newVal);
                                                    }
                                                }}
                                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {/* Precio base */}
                                    <div className="space-y-3 h-full">
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                            Precio base:
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={precioBaseEditable}
                                            onChange={(e) => {
                                                const newPrice = Number(e.target.value) || 0;
                                                setPrecioBaseEditable(newPrice);
                                                // Si el producto ya está en carrito, actualizar el precio directamente
                                                if (getCantidadEnCarrito(productoSeleccionado!.id) > 0 && onActualizarPrecio) {
                                                    onActualizarPrecio(productoSeleccionado!.id, newPrice);
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>                                   

                                    {/* Precio total */}
                                    <div className="h-full rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 p-4 flex flex-col justify-center">
                                        <span className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                            Precio total:
                                        </span>
                                        <div className="flex items-end justify-between gap-3 flex-wrap">
                                            {/* <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Se recalcula automáticamente
                                            </span> */}
                                            <span className="text-green-600 dark:text-green-400 font-bold text-2xl leading-none">
                                                {formatCurrency(calcularPrecioTotal())}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Adicionales */}
                                {productoSeleccionado.adicionales && productoSeleccionado.adicionales.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Selecciona Adicionales:
                                        </h4>
                                        <div className="space-y-2">
                                            {productoSeleccionado.adicionales.map(adicional => (
                                                <label
                                                    key={adicional.id}
                                                    className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={adicionalesSeleccionados.includes(adicional.id)}
                                                        onChange={() => toggleAdicional(adicional.id)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <div className="flex-1 ml-3">
                                                        <span className="text-gray-900 dark:text-white">
                                                            {adicional.nombre}
                                                        </span>
                                                    </div>
                                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                                        +{formatCurrency(adicional.precio_adicional)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Botones de acción */}
                                <div className="flex gap-3">
                                    {getCantidadEnCarrito(productoSeleccionado.id) === 0 ? (
                                        <button
                                            onClick={handleAgregar}
                                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} />
                                            Agregar al Carrito
                                        </button>
                                    ) : (
                                        onEliminar && (
                                            <button
                                                onClick={() => {
                                                    onEliminar(productoSeleccionado.id);
                                                    setProductoSeleccionado(null);
                                                    toast.success('Producto eliminado del carrito');
                                                }}
                                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                                            >
                                                <X size={20} />
                                                Eliminar del Carrito
                                            </button>
                                        )
                                    )}
                                    <button
                                        onClick={() => setProductoSeleccionado(null)}
                                        className="px-4 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

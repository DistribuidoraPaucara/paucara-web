import React, { useState, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import type {
    TransferenciaInventario
} from '@/domain/entities/transferencias-inventario';
import type { Almacen } from '@/domain/entities/almacenes';
import {
    Search,
    Package,
    Trash2,
    Save,
    X
} from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface PageProps extends InertiaPageProps {
    transferencia: TransferenciaInventario;
    almacenes: Almacen[];
}

interface ProductoForm {
    producto_id: number;
    producto?: ProductoInventario;
    cantidad: number;
    lote?: string;
    fecha_vencimiento?: string;
    observaciones?: string;
}

export default function EditarTransferencia() {
    const { props } = usePage<PageProps>();
    const { transferencia, almacenes } = props;
    const { can } = useAuth();

    const [formData, setFormData] = useState({
        almacen_destino_id: transferencia.almacen_destino_id,
        observaciones: transferencia.observaciones || '',
        vehiculo_id: transferencia.vehiculo_id || '',
        chofer_id: transferencia.chofer_id || ''
    });

    const [productos, setProductos] = useState<ProductoForm[]>(
        transferencia.detalles.map(detalle => ({
            producto_id: detalle.producto_id,
            producto: detalle.producto,
            cantidad: detalle.cantidad,
            lote: detalle.lote || '',
            fecha_vencimiento: detalle.fecha_vencimiento || '',
            observaciones: detalle.observaciones || ''
        }))
    );

    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [productosDisponibles, setProductosDisponibles] = useState<ProductoInventario[]>([]);
    const [cargandoProductos, setCargandoProductos] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const breadcrumbs = [
        {
            title: 'Inventario',
            href: '/inventario',
        },
        {
            title: 'Transferencias',
            href: '/inventario/transferencias',
        },
        {
            title: transferencia.numero,
            href: `/inventario/transferencias/${transferencia.id}`,
        },
        {
            title: 'Editar',
            href: `/inventario/transferencias/${transferencia.id}/edit`,
        },
    ];

    const buscarProductos = useCallback(async (termino: string) => {
        if (termino.length < 2) {
            setProductosDisponibles([]);
            return;
        }

        setCargandoProductos(true);
        try {
            const response = await fetch(`/inventario/buscar-productos?q=${encodeURIComponent(termino)}&almacen_id=${transferencia.almacen_origen_id}`);
            const data = await response.json();
            setProductosDisponibles(data.data || []);
        } catch (error) {
            console.error('Error al buscar productos:', error);
            setProductosDisponibles([]);
        } finally {
            setCargandoProductos(false);
        }
    }, [transferencia.almacen_origen_id]);

    const agregarProducto = (producto: ProductoInventario) => {
        const productoExistente = productos.find(p => p.producto_id === producto.id);
        if (productoExistente) {
            NotificationService.error('Este producto ya está agregado');
            return;
        }

        setProductos(prev => [...prev, {
            producto_id: producto.id,
            producto,
            cantidad: 1,
            lote: '',
            fecha_vencimiento: '',
            observaciones: ''
        }]);

        setBusquedaProducto('');
        setProductosDisponibles([]);
    };

    const eliminarProducto = (index: number) => {
        setProductos(prev => prev.filter((_, i) => i !== index));
    };

    const actualizarProducto = (index: number, campo: keyof ProductoForm, valor: string | number) => {
        setProductos(prev => prev.map((producto, i) =>
            i === index ? { ...producto, [campo]: valor } : producto
        ));
    };

    const validarFormulario = (): boolean => {
        if (!formData.almacen_destino_id) {
            NotificationService.error('Debe seleccionar un almacén de destino');
            return false;
        }

        if (formData.almacen_destino_id === transferencia.almacen_origen_id) {
            NotificationService.error('Los almacenes de origen y destino deben ser diferentes');
            return false;
        }

        if (productos.length === 0) {
            NotificationService.error('Debe agregar al menos un producto');
            return false;
        }

        for (const producto of productos) {
            if (producto.cantidad <= 0) {
                NotificationService.error(`La cantidad del producto ${producto.producto?.nombre} debe ser mayor a 0`);
                return false;
            }
        }

        return true;
    };

    const guardarCambios = async () => {
        if (!validarFormulario()) return;

        setGuardando(true);
        try {
            const response = await fetch(`/inventario/transferencias/${transferencia.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    ...formData,
                    productos: productos.map((item) => ({
                        producto_id: item.producto_id,
                        cantidad: item.cantidad,
                        lote: item.lote,
                        fecha_vencimiento: item.fecha_vencimiento,
                        observaciones: item.observaciones
                    }))
                }),
            });

            const result = await response.json();

            if (result.success) {
                NotificationService.success('Transferencia actualizada exitosamente');
                router.visit(`/inventario/transferencias/${transferencia.id}`);
            } else {
                NotificationService.error(result.message || 'Error al actualizar transferencia');
            }
        } catch {
            NotificationService.error('Error al procesar la solicitud');
        } finally {
            setGuardando(false);
        }
    };

    if (!can('inventario.transferencias.edit')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Acceso Denegado" />
                <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Acceso Denegado
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        No tienes permisos para editar transferencias.
                    </p>
                </div>
            </AppLayout>
        );
    }

    if (transferencia.estado !== 'BORRADOR') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="No Editable" />
                <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Transferencia No Editable
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Solo se pueden editar transferencias en estado BORRADOR.
                    </p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Transferencia ${transferencia.numero}`} />

            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Editar Transferencia
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Modificar los detalles de la transferencia {transferencia.numero}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(`/inventario/transferencias/${transferencia.id}`)}
                        >
                            <X className="w-4 h-4" />
                            <span className="ml-2">Cancelar</span>
                        </Button>
                        <Button
                            onClick={guardarCambios}
                            disabled={guardando}
                        >
                            <Save className="w-4 h-4" />
                            <span className="ml-2">
                                {guardando ? 'Guardando...' : 'Guardar Cambios'}
                            </span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información General */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Información General
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="almacen_origen">Almacén de Origen</Label>
                                    <Input
                                        id="almacen_origen"
                                        value={transferencia.almacen_origen.nombre}
                                        disabled
                                        className="bg-gray-50 dark:bg-gray-700"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="almacen_destino">Almacén de Destino *</Label>
                                    <select
                                        id="almacen_destino"
                                        value={formData.almacen_destino_id}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            almacen_destino_id: parseInt(e.target.value)
                                        }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Seleccionar almacén</option>
                                        {almacenes
                                            .filter(almacen => almacen.id !== transferencia.almacen_origen_id)
                                            .map(almacen => (
                                                <option key={almacen.id} value={almacen.id}>
                                                    {almacen.nombre}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <textarea
                                        id="observaciones"
                                        value={formData.observaciones}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            observaciones: e.target.value
                                        }))}
                                        rows={3}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Observaciones adicionales sobre la transferencia..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Productos */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Productos a Transferir
                            </h3>

                            {/* Búsqueda de productos */}
                            <div className="mb-6">
                                <Label htmlFor="busqueda-producto">Buscar producto para agregar</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="busqueda-producto"
                                        type="text"
                                        placeholder="Buscar productos por nombre, código o descripción..."
                                        value={busquedaProducto}
                                        onChange={(e) => {
                                            setBusquedaProducto(e.target.value);
                                            buscarProductos(e.target.value);
                                        }}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Resultados de búsqueda */}
                                {productosDisponibles.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {productosDisponibles.map((producto) => (
                                            <button
                                                key={producto.id}
                                                onClick={() => agregarProducto(producto)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {producto.nombre}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Código: {producto.codigo} | Stock: {producto.stock_actual || 0}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {cargandoProductos && (
                                    <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                                        Buscando productos...
                                    </div>
                                )}
                            </div>

                            {/* Lista de productos agregados */}
                            {productos.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No hay productos agregados
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                        Usa el buscador para agregar productos
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {productos.map((producto, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {producto.producto?.nombre}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Código: {producto.producto?.codigo}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <Label className="text-xs">Cantidad</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={producto.cantidad}
                                                        onChange={(e) => actualizarProducto(index, 'cantidad', parseInt(e.target.value) || 0)}
                                                        className="w-20"
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-xs">Lote</Label>
                                                    <Input
                                                        type="text"
                                                        value={producto.lote}
                                                        onChange={(e) => actualizarProducto(index, 'lote', e.target.value)}
                                                        className="w-24"
                                                        placeholder="Opcional"
                                                    />
                                                </div>

                                                <div>
                                                    <Label className="text-xs">F. Venc.</Label>
                                                    <Input
                                                        type="date"
                                                        value={producto.fecha_vencimiento}
                                                        onChange={(e) => actualizarProducto(index, 'fecha_vencimiento', e.target.value)}
                                                        className="w-36"
                                                    />
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => eliminarProducto(index)}
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel Lateral - Resumen */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Resumen de Transferencia
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Número:</span>
                                    <span className="font-medium">{transferencia.numero}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                                    <span className="font-medium">{transferencia.estado}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total productos:</span>
                                    <span className="font-medium">{productos.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total unidades:</span>
                                    <span className="font-medium">
                                        {productos.reduce((total, producto) => total + producto.cantidad, 0)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    * Los campos marcados son obligatorios
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

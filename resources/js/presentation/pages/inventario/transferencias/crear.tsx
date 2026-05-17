import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import SearchSelect from '@/presentation/components/ui/search-select';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Trash2, Plus, Package } from 'lucide-react';
import NotificationService from '@/infrastructure/services/notification.service';
import transferenciasService from '@/infrastructure/services/transferencias.service';
import type {
    Almacen,
    Vehiculo,
    Chofer,
    Producto,
    DetalleTransferencia,
} from '@/domain/entities/transferencias';

interface CrearTransferenciaProps extends PageProps {
    almacenes: Almacen[];
    vehiculos: Vehiculo[];
    choferes: Chofer[];
    productos: Producto[];
}

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
        title: 'Nueva Transferencia',
        href: '/inventario/transferencias/crear',
    },
];

export default function CrearTransferencia({ almacenes, vehiculos, choferes, productos = [] }: CrearTransferenciaProps) {
    const { data, setData, post, processing, errors } = useForm({
        almacen_origen_id: '',
        almacen_destino_id: '',
        vehiculo_id: '',
        chofer_id: '',
        observaciones: '',
        detalles: [] as DetalleTransferencia[],
    });

    const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');
    const [cantidadProducto, setCantidadProducto] = useState<string>('');
    const [loteProducto, setLoteProducto] = useState<string>('');
    const [fechaVencimiento, setFechaVencimiento] = useState<string>('');

    const productosOptions = productos.map(producto => {
        const stockEnOrigen = data.almacen_origen_id ?
            (producto.stock_por_almacen?.[data.almacen_origen_id] || 0) :
            (producto.stock_disponible || 0);

        return {
            value: producto.id,
            label: `${producto.codigo} - ${producto.nombre}`,
            description: stockEnOrigen > 0 ?
                `Stock disponible: ${stockEnOrigen}` :
                'Sin stock disponible',
        };
    });

    const almacenesOptions = almacenes.map(almacen => ({
        value: almacen.id,
        label: almacen.nombre,
        description: almacen.ubicacion_fisica
            ? `📍 ${almacen.ubicacion_fisica}${almacen.direccion ? ` - ${almacen.direccion}` : ''}${almacen.requiere_transporte_externo ? ' 🚛' : ''}`
            : almacen.direccion || 'Sin ubicación definida',
    }));

    const vehiculosOptions = vehiculos.map(vehiculo => ({
        value: vehiculo.id,
        label: `${vehiculo.placa}${vehiculo.marca ? ` - ${vehiculo.marca}` : ''}${vehiculo.modelo ? ` ${vehiculo.modelo}` : ''}`,
    }));

    const choferesOptions = choferes
        .filter(chofer => chofer.user && chofer.user.name)
        .map(chofer => ({
            value: chofer.id,
            label: `${chofer.user.name} - ${chofer.licencia || 'Sin licencia'}`,
        }));

    const agregarProducto = () => {
        // Validaciones previas básicas
        if (!productoSeleccionado || !cantidadProducto || parseInt(cantidadProducto) <= 0) {
            NotificationService.warning('Debe seleccionar un producto y una cantidad válida');
            return;
        }

        // Crear detalle provisional
        const nuevoDetalle: DetalleTransferencia = {
            producto_id: parseInt(productoSeleccionado),
            cantidad: parseInt(cantidadProducto),
            lote: loteProducto || undefined,
            fecha_vencimiento: fechaVencimiento || undefined,
        };

        // Validar con el service
        const erroresDetalle = transferenciasService.validarDetalleTransferencia(
            nuevoDetalle,
            productos,
            data.almacen_origen_id as string
        );

        if (erroresDetalle.length > 0) {
            erroresDetalle.forEach(error => NotificationService.error(error));
            return;
        }

        // Verificar si ya existe el producto en la lista
        const existe = data.detalles.find(d => d.producto_id === parseInt(productoSeleccionado));
        if (existe) {
            NotificationService.warning('Este producto ya está agregado a la transferencia');
            return;
        }

        // Agregar el detalle
        setData('detalles', [...data.detalles, nuevoDetalle]);

        // Mostrar notificación de éxito
        const nombreProducto = transferenciasService.obtenerNombreProducto(
            parseInt(productoSeleccionado),
            productos
        );
        NotificationService.success(`✅ ${nombreProducto} agregado a la transferencia`);

        // Limpiar formulario
        setProductoSeleccionado('');
        setCantidadProducto('');
        setLoteProducto('');
        setFechaVencimiento('');
    }; const eliminarProducto = (index: number) => {
        const nuevosDetalles = data.detalles.filter((_, i) => i !== index);
        setData('detalles', nuevosDetalles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar datos completos con el service
        const validationErrors = transferenciasService.validateData(
            data,
            { almacenes, productos }
        );

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => NotificationService.error(error));
            return;
        }

        // Mostrar notificación de carga
        const loadingToast = NotificationService.loading('🔄 Procesando transferencia...');

        post('/inventario/transferencias/crear', {
            onSuccess: () => {
                NotificationService.dismiss(loadingToast);
            },
            onError: (errors) => {
                NotificationService.dismiss(loadingToast);
                const errorMessage = transferenciasService.extractErrorMessage(errors);
                NotificationService.error(`❌ ${errorMessage}`);
            }
        });
    };

    const totalProductos = data.detalles.length;
    const totalCantidad = data.detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0);

    // Determinar si es una transferencia física (requiere transporte)
    const almacenOrigen = almacenes.find(a => a.id === parseInt(data.almacen_origen_id as string));
    const almacenDestino = almacenes.find(a => a.id === parseInt(data.almacen_destino_id as string));
    const requiereTransporte = transferenciasService.esTransferenciaFisica(almacenOrigen, almacenDestino);

    // Limpiar campos de transporte si no se requiere
    React.useEffect(() => {
        if (!requiereTransporte) {
            if (data.vehiculo_id) setData('vehiculo_id', '');
            if (data.chofer_id) setData('chofer_id', '');
        }
    }, [requiereTransporte, data.vehiculo_id, data.chofer_id, setData]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Transferencia" />

            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Nueva Transferencia
                    </h2>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Crear una nueva transferencia de productos entre almacenes.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información de la Transferencia */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Información de Transferencia
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="almacen_origen_id">Almacén Origen *</Label>
                                    <SearchSelect
                                        id="almacen_origen_id"
                                        value={data.almacen_origen_id}
                                        options={almacenesOptions}
                                        onChange={(value) => setData('almacen_origen_id', value.toString())}
                                        placeholder="Seleccionar almacén origen"
                                        required
                                        error={errors.almacen_origen_id}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="almacen_destino_id">Almacén Destino *</Label>
                                    <SearchSelect
                                        id="almacen_destino_id"
                                        value={data.almacen_destino_id}
                                        options={almacenesOptions.filter(opt => opt.value.toString() !== data.almacen_origen_id)}
                                        onChange={(value) => setData('almacen_destino_id', value.toString())}
                                        placeholder="Seleccionar almacén destino"
                                        required
                                        error={errors.almacen_destino_id}
                                    />
                                </div>

                                {/* Mostrar información contextual de la transferencia */}
                                {almacenOrigen && almacenDestino && (
                                    <>
                                        {requiereTransporte ? (
                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                    <strong>🚛 Transferencia Física</strong><br />
                                                    Esta transferencia requiere transporte entre ubicaciones diferentes.
                                                    {(() => {
                                                        if (almacenOrigen?.requiere_transporte_externo || almacenDestino?.requiere_transporte_externo) {
                                                            return <span className="block mt-1 font-medium">⚠️ Almacén con transporte externo requerido</span>;
                                                        }

                                                        if (almacenOrigen?.ubicacion_fisica && almacenDestino?.ubicacion_fisica && almacenOrigen.ubicacion_fisica !== almacenDestino.ubicacion_fisica) {
                                                            return <span className="block mt-1">📍 {almacenOrigen.ubicacion_fisica} → {almacenDestino.ubicacion_fisica}</span>;
                                                        }

                                                        return <span className="block mt-1">🏢 Transferencia entre almacenes diferentes</span>;
                                                    })()}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                <p className="text-sm text-green-800 dark:text-green-200">
                                                    <strong>📦 Transferencia Interna</strong><br />
                                                    Movimiento interno en la misma ubicación física.
                                                    {(() => {
                                                        if (almacenOrigen?.ubicacion_fisica && almacenDestino?.ubicacion_fisica) {
                                                            return <span className="block mt-1">📍 Misma ubicación: {almacenOrigen.ubicacion_fisica}</span>;
                                                        }

                                                        return <span className="block mt-1">🏢 Sin transporte requerido</span>;
                                                    })()}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Mostrar campos de transporte solo si es transferencia física */}
                                {requiereTransporte && (
                                    <>
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                <strong>🚛 Transferencia Física</strong><br />
                                                Esta transferencia requiere transporte entre almacenes diferentes.
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor="vehiculo_id">Vehículo</Label>
                                            <SearchSelect
                                                id="vehiculo_id"
                                                value={data.vehiculo_id}
                                                options={vehiculosOptions}
                                                onChange={(value) => setData('vehiculo_id', value.toString())}
                                                placeholder="Seleccionar vehículo (opcional)"
                                                allowClear
                                                error={errors.vehiculo_id}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="chofer_id">Chofer</Label>
                                            <SearchSelect
                                                id="chofer_id"
                                                value={data.chofer_id}
                                                options={choferesOptions}
                                                onChange={(value) => setData('chofer_id', value.toString())}
                                                placeholder="Seleccionar chofer (opcional)"
                                                allowClear
                                                error={errors.chofer_id}
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <Textarea
                                        id="observaciones"
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        placeholder="Observaciones sobre la transferencia..."
                                        rows={3}
                                        maxLength={500}
                                    />
                                    {errors.observaciones && (
                                        <p className="text-sm text-red-600 mt-1">{errors.observaciones}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resumen */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen de Transferencia</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Total Productos:</span>
                                        <Badge variant="secondary">{totalProductos}</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Cantidad Total:</span>
                                        <Badge variant="secondary">{totalCantidad}</Badge>
                                    </div>
                                    {data.almacen_origen_id && data.almacen_destino_id && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                                            <Badge variant={requiereTransporte ? "default" : "outline"}>
                                                {requiereTransporte ? "🚛 Física" : "📋 Virtual"}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {almacenOrigen && almacenDestino && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            <strong>Transferencia:</strong><br />
                                            <span className="block">📦 De: {almacenOrigen?.nombre}</span>
                                            {almacenOrigen?.ubicacion_fisica && (
                                                <span className="block text-xs ml-4">📍 {almacenOrigen.ubicacion_fisica}</span>
                                            )}
                                            <span className="block mt-1">📦 A: {almacenDestino?.nombre}</span>
                                            {almacenDestino?.ubicacion_fisica && (
                                                <span className="block text-xs ml-4">📍 {almacenDestino.ubicacion_fisica}</span>
                                            )}

                                            {requiereTransporte && (
                                                <>
                                                    <br />
                                                    <span className="block font-medium">🚛 Transporte:</span>
                                                    {data.vehiculo_id && (
                                                        <span className="block ml-4">• Vehículo: {vehiculos.find(v => v.id === parseInt(data.vehiculo_id))?.placa}</span>
                                                    )}
                                                    {data.chofer_id && (
                                                        <span className="block ml-4">• Chofer: {choferes.find(c => c.id === parseInt(data.chofer_id))?.user.name}</span>
                                                    )}
                                                    {!data.vehiculo_id && !data.chofer_id && (
                                                        <span className="block ml-4 text-amber-600 dark:text-amber-400">• Sin asignar</span>
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {data.detalles.length === 0 && (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                        <p className="text-sm text-amber-800 dark:text-amber-200">
                                            Agregue al menos un producto para continuar.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Productos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Productos a Transferir</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Agregar Producto */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div className="md:col-span-2">
                                    <Label htmlFor="producto">Producto</Label>
                                    <SearchSelect
                                        id="producto"
                                        value={productoSeleccionado}
                                        options={productosOptions}
                                        onChange={(value) => setProductoSeleccionado(value.toString())}
                                        placeholder="Buscar producto..."
                                        searchPlaceholder="Buscar por código o nombre..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cantidad">Cantidad</Label>
                                    <Input
                                        id="cantidad"
                                        type="number"
                                        min="1"
                                        value={cantidadProducto}
                                        onChange={(e) => setCantidadProducto(e.target.value)}
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="lote">Lote (opcional)</Label>
                                    <Input
                                        id="lote"
                                        value={loteProducto}
                                        onChange={(e) => setLoteProducto(e.target.value)}
                                        placeholder="Lote"
                                        maxLength={50}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        onClick={agregarProducto}
                                        disabled={!productoSeleccionado || !cantidadProducto || parseInt(cantidadProducto) <= 0}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar
                                    </Button>
                                </div>
                            </div>

                            {/* Lista de Productos */}
                            <div className="space-y-2">
                                {data.detalles.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No hay productos agregados
                                    </div>
                                ) : (
                                    data.detalles.map((detalle, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-900">
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {(() => {
                                                        const producto = productos.find(p => p.id === detalle.producto_id);
                                                        return producto ? `${producto.codigo} - ${producto.nombre}` : 'Producto no encontrado';
                                                    })()}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Cantidad: {detalle.cantidad}
                                                    {detalle.lote && ` • Lote: ${detalle.lote}`}
                                                    {detalle.fecha_vencimiento && ` • Vence: ${detalle.fecha_vencimiento}`}
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => eliminarProducto(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {errors.detalles && (
                                <p className="text-sm text-red-600">{errors.detalles}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botones de Acción */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || data.detalles.length === 0 || !data.almacen_origen_id || !data.almacen_destino_id}
                        >
                            {processing ? 'Creando...' : 'Crear Transferencia'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

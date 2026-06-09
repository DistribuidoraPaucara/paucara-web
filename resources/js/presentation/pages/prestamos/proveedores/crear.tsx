import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import prestamoProveedorService from '@/infrastructure/services/prestamo-proveedor.service';
import { usePrestables } from '@/stores/usePrestables';
import { useToast } from '@/presentation/hooks/useToast';
import type { Prestable } from '@/domain/entities/prestamos';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import PrestablesSelectionTable from '@/presentation/components/form-sections/PrestablesSelectionTable';

interface Props {
    proveedores: Array<{ id: number; nombre: string; razon_social?: string }>;
    compras: Array<{ id: number; numero: string; proveedor_id: number; proveedor?: { id: number; nombre: string; razon_social?: string } }>;
    almacenes_proveedor: Array<{ id: number; nombre: string }>;
    choferes?: Array<{ id: number; nombre: string }>;
    vehiculos?: Array<{ id: number; placa: string; marca?: string; modelo?: string }>;
}

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    prestable?: Prestable;
    isAutomaticEmbase?: boolean;  // ✅ NUEVO: marca si fue cargado automáticamente con una canastilla
}

export default function CrearPrestamoProveedor({ proveedores, compras, almacenes_proveedor, choferes, vehiculos }: Props) {
    const { prestables, loading: loadingPrestables, fetchPrestables } = usePrestables();
    const { toasts, removeToast, error: toastError, warning: toastWarning, success: toastSuccess } = useToast();

    // Estado principal del préstamo
    const [formData, setFormData] = useState({
        proveedor_id: undefined as number | undefined,
        almacenes_prestables_id: undefined as number | undefined,
        chofer_id: undefined as number | undefined,
        vehiculo_asignado: '' as string,
        compra_id: undefined as number | undefined,
        tipo_prestamo: 'canastillas_embases' as 'canastillas' | 'embases' | 'canastillas_embases',
        es_compra: false,
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_esperada_devolucion: getDateAdd7Days(),
        monto_garantia: 0,
    });

    // Lista de prestables agregados
    const [prestablesAgregados, setPrestablesAgregados] = useState<PrestamoItem[]>([]);

    // Estados para búsquedas dinámicas
    const [comprasSearch, setComprasSearch] = useState('');
    const [comprasResults, setComprasResults] = useState<any[]>([]);
    const [comprasLoading, setComprasLoading] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState<any>(null);

    const [proveedoresSearch, setProveedoresSearch] = useState('');
    const [proveedoresFiltered, setProveedoresFiltered] = useState(proveedores);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any>(null);

    const [vehiculosSearch, setVehiculosSearch] = useState('');
    const [vehiculosFiltered, setVehiculosFiltered] = useState(vehiculos || []);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [ultimoPrestamoId, setUltimoPrestamoId] = useState<number | null>(null);

    useEffect(() => {
        fetchPrestables();
    }, []);


    function getDateAdd7Days() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    }

    const handleFechaPrestamo = (fecha: string) => {
        const date = new Date(fecha);
        date.setDate(date.getDate() + 7);
        const nuevaFecha = date.toISOString().split('T')[0];

        setFormData({
            ...formData,
            fecha_prestamo: fecha,
            fecha_esperada_devolucion: nuevaFecha,
        });
    };

    // Búsqueda de compras
    const handleSearchCompras = async (query: string) => {
        setComprasSearch(query);
        if (query.trim().length === 0) {
            setComprasResults([]);
            return;
        }

        setComprasLoading(true);
        try {
            const response = await fetch(`/api/compras/con-prestables/search?q=${encodeURIComponent(query)}`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            setComprasResults(data.data || []);
        } catch (error) {
            console.error('Error buscando compras:', error);
            setComprasResults([]);
        } finally {
            setComprasLoading(false);
        }
    };

    const handleSelectCompra = async (compra: any) => {
        setCompraSeleccionada(compra);
        setComprasSearch('');
        setComprasResults([]);

        try {
            const response = await fetch(`/api/compras/${compra.id}/detalles`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            const compraData = data.data || data;
            const proveedorId = compraData.proveedor_id;

            setFormData({
                ...formData,
                compra_id: compra.id,
                proveedor_id: proveedorId,
            });
            setProveedorSeleccionado(proveedores.find(p => p.id === proveedorId));
        } catch (error) {
            console.error('Error cargando compra:', error);
        }
    };

    const handleSearchProveedores = (query: string) => {
        setProveedoresSearch(query);
        if (!query.trim()) {
            setProveedoresFiltered(proveedores);
            return;
        }
        const filtered = proveedores.filter(p =>
            p.nombre.toLowerCase().includes(query.toLowerCase()) ||
            p.razon_social?.toLowerCase().includes(query.toLowerCase())
        );
        setProveedoresFiltered(filtered);
    };

    const handleSelectProveedor = (proveedor: any) => {
        setProveedorSeleccionado(proveedor);
        setProveedoresSearch('');
        setFormData({ ...formData, proveedor_id: proveedor.id });
    };

    const handleSearchVehiculos = (query: string) => {
        setVehiculosSearch(query);
        if (!query.trim()) {
            setVehiculosFiltered(vehiculos || []);
            return;
        }
        const filtered = (vehiculos || []).filter(v =>
            v.placa.toLowerCase().includes(query.toLowerCase()) ||
            v.marca?.toLowerCase().includes(query.toLowerCase()) ||
            v.modelo?.toLowerCase().includes(query.toLowerCase())
        );
        setVehiculosFiltered(filtered);
    };

    const handleSelectVehiculo = (vehiculo: any) => {
        setVehiculoSeleccionado(vehiculo);
        setVehiculosSearch('');
        setFormData({ ...formData, vehiculo_asignado: vehiculo.placa });
    };

    const handleEliminarPrestable = (prestable_id: number) => {
        // Si es una canastilla, eliminar también sus embases relacionados
        const prestable = prestables.find(p => Number(p.id) === prestable_id);
        if (prestable?.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter(
                p => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === prestable_id
            );
            const idsAEliminar = [prestable_id, ...embasesRelacionados.map(e => e.id)];
            setPrestablesAgregados(
                prestablesAgregados.filter((p) => !idsAEliminar.includes(p.prestable_id))
            );
        } else {
            setPrestablesAgregados(
                prestablesAgregados.filter((p) => p.prestable_id !== prestable_id)
            );
        }
    };

    const getStockDisponibleTotal = (prestable: Prestable) => {
        return (prestable.stocks || []).reduce(
            (sum, stock) => sum + Number(stock.cantidad_disponible || 0),
            0
        );
    };

    const handleCambiarCantidad = (itemIndex: number, nueva_cantidad: number) => {
        const itemActualizado = prestablesAgregados[itemIndex];
        if (!itemActualizado) return;

        const prestable = prestables.find(p => Number(p.id) === itemActualizado.prestable_id);

        setPrestablesAgregados(prestablesAgregados.map((item, idx) => {
            // Actualizar solo el item específico por índice
            if (idx === itemIndex) {
                return { ...item, cantidad: nueva_cantidad };
            }

            // Si el item actualizado es canastilla, actualizar SOLO embases automáticos relacionados
            if (prestable?.tipo === 'CANASTILLA' &&
                item.isAutomaticEmbase === true &&  // ✅ SOLO embases automáticos
                (item.prestable as any)?.prestable_relacionado_id === prestable?.id) {
                const cantidadEmbasesAutomatica = nueva_cantidad * (prestable.capacidad || 0);
                return { ...item, cantidad: cantidadEmbasesAutomatica };
            }

            return item;
        }));
    };

    const handleAgregarCanastilla = (prestable: Prestable) => {
        // ✅ MODIFICADO: NO cargar con almacén de cabecera
        // Los prestables se cargan VACÍOS en almacenes
        // El almacén de cabecera es solo referencia si el usuario no abre el modal

        const nuevosItems: PrestamoItem[] = [
            {
                prestable_id: Number(prestable.id),
                cantidad: 1,
                prestable,
            },
        ];

        if (prestable.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter(
                p => p.tipo === 'EMBASES'
                    && (p as any).prestable_relacionado_id === Number(prestable.id)
                    && getStockDisponibleTotal(p) > 0
            );

            embasesRelacionados.forEach(embase => {
                const cantidadEmbasesAutomatica = 1 * (prestable.capacidad || 0);

                nuevosItems.push({
                    prestable_id: Number(embase.id),
                    cantidad: cantidadEmbasesAutomatica,
                    prestable: embase,
                    isAutomaticEmbase: true, // Marca que fue cargado automáticamente con la canastilla
                });
            });
        }

        const actualizado = [...prestablesAgregados, ...nuevosItems];
        console.log('🔵 handleAgregarCanastilla - Prestable:', prestable.nombre, prestable.tipo);
        console.log('   Items nuevos:', nuevosItems.map(i => ({
            id: i.prestable_id,
            nombre: i.prestable?.nombre,
            tipo: i.prestable?.tipo,
            isAutomaticEmbase: i.isAutomaticEmbase,
        })));
        toastWarning('⚠️ Especifica los almacenes para este prestable en el modal');
        setPrestablesAgregados(actualizado);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.compra_id) {
            setError('Selecciona una compra (requerida para los préstamos a proveedor)');
            return;
        }

        if (!formData.proveedor_id) {
            setError('Selecciona un proveedor (se cargará automáticamente)');
            return;
        }

        if (!formData.almacenes_prestables_id) {
            setError('Selecciona el almacén destino donde se recepcionará el préstamo');
            return;
        }

        if (prestablesAgregados.length === 0) {
            setError('Agrega al menos un prestable');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                proveedor_id: formData.proveedor_id,
                almacenes_prestables_id: formData.almacenes_prestables_id,
                chofer_id: formData.chofer_id || null,
                vehiculo_asignado: formData.vehiculo_asignado || null,
                es_compra: formData.es_compra,
                compra_id: formData.compra_id,
                fecha_prestamo: formData.fecha_prestamo,
                fecha_esperada_devolucion: formData.fecha_esperada_devolucion,
                monto_garantia: formData.monto_garantia,
                observaciones: '',
                detalles: prestablesAgregados.map(item => ({
                    prestable_id: item.prestable_id,
                    cantidad: item.cantidad,
                })),
            };

            const response = await prestamoProveedorService.crear(payload);

            if (response?.id) {
                toastSuccess('✅ Préstamo a proveedor creado exitosamente');
                setUltimoPrestamoId(Number(response.id));
                setMostrarModalImpresion(true);
            } else {
                window.location.href = '/prestamos/proveedores';
            }
        } catch (err: any) {
            let mensajeError = 'Ocurrió un error al crear el préstamo';

            if (err.response?.data?.message) {
                mensajeError = err.response.data.message;
            } else if (err.response?.data?.error) {
                mensajeError = err.response.data.error;
            } else if (err.response?.data?.errors) {
                const errores = Object.values(err.response.data.errors).flat();
                mensajeError = errores.join(' | ');
            } else if (err.message) {
                mensajeError = err.message;
            }

            setError(mensajeError);
            toastError(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    const totalGarantia = prestablesAgregados.reduce((sum, item) => {
        const garantia = item.prestable?.condiciones?.[0]?.monto_garantia || 0;
        return sum + Number(garantia) * item.cantidad;
    }, 0);

    return (
        <AppLayout>
            <Head title="Crear Préstamo a Proveedor" />
            <ToastContainer toasts={toasts} onClose={removeToast} />
            <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    🏭 Nuevo Préstamo a Proveedor
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
                            {error}
                        </div>
                    )}

                    {/* Info Banner - Cómo funciona el Préstamo a Proveedor */}
                    {/* <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            ℹ️ Cómo funciona el Préstamo a Proveedor
                        </h3>
                        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <p>
                                <strong>Diferencia clave:</strong> El proveedor es el DUEÑO de las canastillas/embases
                            </p>
                            <p>
                                ✅ <strong>El proveedor nos PRESTA sus items</strong> → <span className="font-semibold text-blue-600">STOCK AUMENTA pero NO está disponible para prestar a clientes</span>
                            </p>
                            <p>
                                📍 <strong>Debes devolver</strong> estos items cuando termine el préstamo
                            </p>
                        </div>
                    </div> */}

                    {/* Sección 1: Información del Préstamo */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        {/* <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                            📋 Información del Préstamo
                        </h2> */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Columna 1: Compra (REQUERIDA) */}
                            <DynamicSearchSelect
                                label="📦 Compra *"
                                placeholder="Buscar compra..."
                                selectedItem={compraSeleccionada}
                                items={comprasResults}
                                isLoading={comprasLoading}
                                searchValue={comprasSearch}
                                onSearch={handleSearchCompras}
                                onSelect={handleSelectCompra}
                                onClear={() => {
                                    setCompraSeleccionada(null);
                                    setComprasSearch('');
                                    setFormData({ ...formData, compra_id: undefined, proveedor_id: undefined });
                                }}
                                renderItem={(compra) => (
                                    <div>
                                        <p className="font-medium">{compra.numero}</p>
                                        <p className="text-xs text-gray-500">{compra.proveedor?.nombre}</p>
                                    </div>
                                )}
                                getItemId={(compra) => compra.id}
                                getDisplayValue={(compra) => compra.numero}
                            />

                            {/* Columna 2: Proveedor (AUTO-CARGADO) */}
                            <DynamicSearchSelect
                                label="🏭 Proveedor *"
                                placeholder="Se cargará automáticamente..."
                                selectedItem={proveedorSeleccionado}
                                items={proveedoresFiltered}
                                isLoading={false}
                                searchValue={proveedoresSearch}
                                onSearch={handleSearchProveedores}
                                onSelect={handleSelectProveedor}
                                onClear={() => {
                                    setProveedorSeleccionado(null);
                                    setProveedoresSearch('');
                                }}
                                renderItem={(proveedor) => (
                                    <div>
                                        <p className="font-medium">{proveedor.nombre}</p>
                                        <p className="text-xs text-gray-500">{proveedor.razon_social}</p>
                                    </div>
                                )}
                                getItemId={(proveedor) => proveedor.id}
                                getDisplayValue={(proveedor) => proveedor.nombre}
                            />

                            {/* Columna 3: Almacén Destino */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    🏭 Almacén Destino *
                                </label>
                                <select
                                    required
                                    value={formData.almacenes_prestables_id || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            almacenes_prestables_id: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecciona almacén...</option>
                                    {almacenes_proveedor && almacenes_proveedor.map((almacen) => (
                                        <option key={almacen.id} value={almacen.id}>
                                            {almacen.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Fila: Chofer y Vehículo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* Chofer (Opcional) */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    🚗 Chofer (Opcional)
                                </label>
                                <select
                                    value={formData.chofer_id || ''}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            chofer_id: e.target.value ? Number(e.target.value) : undefined,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Selecciona chofer...</option>
                                    {choferes && choferes.map((chofer) => (
                                        <option key={chofer.id} value={chofer.id}>
                                            {chofer.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehículo Asignado (Opcional) */}
                            <DynamicSearchSelect
                                label="🚙 Vehículo Asignado (Opcional)"
                                placeholder="Buscar vehículo..."
                                selectedItem={vehiculoSeleccionado}
                                items={vehiculosFiltered}
                                isLoading={false}
                                searchValue={vehiculosSearch}
                                onSearch={handleSearchVehiculos}
                                onSelect={handleSelectVehiculo}
                                onClear={() => {
                                    setVehiculoSeleccionado(null);
                                    setVehiculosSearch('');
                                    setFormData({ ...formData, vehiculo_asignado: '' });
                                }}
                                renderItem={(vehiculo) => (
                                    <div>
                                        <p className="font-medium">{vehiculo.placa}</p>
                                        <p className="text-xs text-gray-500">{vehiculo.marca} {vehiculo.modelo}</p>
                                    </div>
                                )}
                                getItemId={(vehiculo) => vehiculo.id}
                                getDisplayValue={(vehiculo) => `${vehiculo.placa} - ${vehiculo.marca} ${vehiculo.modelo}`}
                            />
                        </div>

                        {/* Fila: Fechas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {/* Fila: Garantía */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Garantía Total (Opcional)
                                </label>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={formData.monto_garantia}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                            setFormData({
                                                ...formData,
                                                monto_garantia: val === '' ? 0 : parseFloat(val),
                                            });
                                        }
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Fecha de Préstamo *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_prestamo}
                                    onChange={(e) => handleFechaPrestamo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Fecha Esperada de Devolución (7 días) *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_esperada_devolucion}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fecha_esperada_devolucion: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Sección 2: Seleccionar Prestables */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            📦 Seleccionar Prestables
                        </h2>

                        {/* Filtro por Tipo - Radio Buttons */}
                        {/* <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-semibold mb-3 text-blue-900 dark:text-blue-100">
                                📋 Tipo de Préstamo *
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="tipo_prestamo"
                                        value="canastillas"
                                        checked={formData.tipo_prestamo === 'canastillas'}
                                        onChange={(e) => {
                                            setFormData({ ...formData, tipo_prestamo: 'canastillas' });
                                            // Limpiar embases del carrito
                                            setPrestablesAgregados(
                                                prestablesAgregados.filter(item => {
                                                    const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
                                                    return prestable?.tipo === 'CANASTILLA';
                                                })
                                            );
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">📦 Solo Canastillas</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="tipo_prestamo"
                                        value="embases"
                                        checked={formData.tipo_prestamo === 'embases'}
                                        onChange={(e) => {
                                            setFormData({ ...formData, tipo_prestamo: 'embases' });
                                            // Limpiar canastillas del carrito
                                            setPrestablesAgregados(
                                                prestablesAgregados.filter(item => {
                                                    const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
                                                    return prestable?.tipo === 'EMBASES';
                                                })
                                            );
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">🔖 Solo Embases</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer border-l pl-6 border-blue-300 dark:border-blue-700">
                                    <input
                                        type="radio"
                                        name="tipo_prestamo"
                                        value="canastillas_embases"
                                        checked={formData.tipo_prestamo === 'canastillas_embases'}
                                        onChange={(e) => {
                                            setFormData({ ...formData, tipo_prestamo: 'canastillas_embases' });
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">📦+🔖 Canastillas + Embases</span>
                                </label>
                            </div>
                        </div> */}

                        {/* Usar componente PrestablesSelectionTable */}
                        <PrestablesSelectionTable
                            label="📦 Prestables Disponibles"
                            placeholder="Buscar prestable..."
                            prestables={prestables.filter(p => p.activo)}
                            items={prestablesAgregados}
                            onSelectItem={handleAgregarCanastilla}
                            onDeleteItem={handleEliminarPrestable}
                            onUpdateCantidad={handleCambiarCantidad}
                            onToggleAlmacen={() => { }}
                            hideAlmacenesSelection={true}
                            almacen_prestable_id={formData.almacenes_prestables_id}
                            getStockDisponibleTotal={(prestable) =>
                                (prestable.stocks || []).reduce(
                                    (sum, stock) => sum + Number(stock.cantidad_disponible || 0),
                                    0
                                )
                            }
                            getAlmacenesConStock={(prestable) => {
                                const almacenes = (prestable.stocks || [])
                                    .filter((stock: any) => Number(stock.cantidad_disponible || 0) > 0)
                                    .map((stock: any) => ({
                                        id: Number(stock.almacenes_prestables_id || stock.almacen_id),
                                        nombre: stock?.almacen_prestable?.nombre || `Almacén ${stock.almacenes_prestables_id}`,
                                        stock: Number(stock.cantidad_disponible || 0),
                                        es_proveedor: stock?.almacen_prestable?.es_proveedor ?? true,
                                    }))
                                    .filter((item: any) => Number(item.id) > 0);
                                return almacenes;
                            }}
                            getStockDisponibleEnAlmacenes={(prestable, almacenesIds) => {
                                const ids = new Set((almacenesIds || []).map(Number));
                                return (prestable.stocks || []).reduce((sum, stock: any) => {
                                    const almacenId = Number(stock.almacenes_prestables_id || stock.almacen_id);
                                    if (!ids.has(almacenId)) return sum;
                                    return sum + Number(stock.cantidad_disponible || 0);
                                }, 0);
                            }}
                        />
                    </Card>

                    {/* Botones de Acción */}
                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={loading || prestablesAgregados.length === 0}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
                        >
                            {loading ? 'Registrando...' : '✅ Registrar Préstamo'}
                        </Button>
                        <a href="/prestamos/proveedores">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </a>
                    </div>
                </form>
            </div>

            {/* Modal de Impresión */}
            <OutputSelectionModal
                isOpen={mostrarModalImpresion && ultimoPrestamoId !== null}
                onClose={() => {
                    setMostrarModalImpresion(false);
                    setUltimoPrestamoId(null);
                    setTimeout(() => {
                        window.location.href = '/prestamos/proveedores';
                    }, 300);
                }}
                documentoId={ultimoPrestamoId || 0}
                tipoDocumento="prestamo-proveedor"
            />
        </AppLayout>
    );
}

import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import { prestamoEventoService } from '@/infrastructure/services/prestamo-evento.service';
import { usePrestables } from '@/stores/usePrestables';
import { useToast } from '@/presentation/hooks/useToast';
import type { Prestable } from '@/domain/entities/prestamos';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import PrestablesSelectionTable from '@/presentation/components/form-sections/PrestablesSelectionTable';

interface Props {
    choferes: Array<{ id: number; nombre: string }>;
    ventas: Array<{ id: number; numero: string; cliente_id: number; cliente?: { id: number; nombre: string; razon_social?: string } }>;
    vehiculos: Array<{ id: number; placa: string; marca: string; modelo: string; anho: number }>;
}

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    almacenes_ids: number[];
    prestable?: Prestable;
}

export default function CrearPrestamoEvento({ choferes, ventas, vehiculos }: Props) {
    const { prestables, loading: loadingPrestables, fetchPrestables } = usePrestables();
    const { toasts, removeToast, error: toastError, warning: toastWarning, success: toastSuccess } = useToast();

    // Estado principal del préstamo
    const [formData, setFormData] = useState({
        nombre_evento: '',
        encargado_evento: '',
        vehiculo_asignado: '',
        direccion_evento: '',
        telefono_uno: '',
        telefono_dos: '',
        chofer_id: undefined as number | undefined,
        venta_id: undefined as number | undefined,
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_esperada_devolucion: getDateAdd7Days(),
        monto_garantia: 0,
    });

    // Lista de prestables agregados
    const [prestablesAgregados, setPrestablesAgregados] = useState<PrestamoItem[]>([]);

    // Estados para búsquedas dinámicas
    const [ventasSearch, setVentasSearch] = useState('');
    const [ventasResults, setVentasResults] = useState<any[]>([]);
    const [ventasLoading, setVentasLoading] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);

    const [vehiculosSearch, setVehiculosSearch] = useState('');
    const [vehiculosResults, setVehiculosResults] = useState<any[]>([]);
    const [vehiculosLoading, setVehiculosLoading] = useState(false);
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

    const getStockDisponibleTotal = (prestable: Prestable) => {
        return (prestable.stocks || []).reduce(
            (sum, stock) => sum + Number(stock.cantidad_disponible || 0),
            0
        );
    };

    const getAlmacenesConStock = (prestable: Prestable) => {
        return (prestable.stocks || [])
            .filter((stock: any) => Number(stock.cantidad_disponible || 0) > 0)
            .map((stock: any) => ({
                id: Number(stock.almacenes_prestables_id || stock.almacen_id),
                nombre: stock?.almacen_prestable?.nombre || stock?.almacenPrestable?.nombre || `Almacén ${stock.almacenes_prestables_id || stock.almacen_id}`,
                stock: Number(stock.cantidad_disponible || 0),
                es_proveedor: stock?.almacen_prestable?.es_proveedor || stock?.almacenPrestable?.es_proveedor || false,
            }))
            .filter((item: any) => Number(item.id) > 0);
    };

    const getStockDisponibleEnAlmacenes = (prestable: Prestable, almacenesIds: number[]) => {
        const ids = new Set((almacenesIds || []).map(Number));
        return (prestable.stocks || []).reduce((sum, stock: any) => {
            const almacenId = Number(stock.almacenes_prestables_id || stock.almacen_id);
            if (!ids.has(almacenId)) return sum;
            return sum + Number(stock.cantidad_disponible || 0);
        }, 0);
    };

    const handleToggleAlmacen = (prestableId: number, almacenId: number, checked: boolean) => {
        setPrestablesAgregados(prev => prev.map(item => {
            if (item.prestable_id !== prestableId) return item;

            const actuales = new Set((item.almacenes_ids || []).map(Number));
            if (checked) {
                actuales.add(almacenId);
            } else {
                actuales.delete(almacenId);
            }

            return { ...item, almacenes_ids: Array.from(actuales) };
        }));
    };

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

    // Búsqueda de ventas
    const handleSearchVentas = async (query: string) => {
        setVentasSearch(query);
        if (query.trim().length === 0) {
            setVentasResults([]);
            return;
        }

        setVentasLoading(true);
        try {
            const response = await fetch(`/api/ventas/con-prestables/search?q=${encodeURIComponent(query)}`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            setVentasResults(data.data || []);
        } catch (error) {
            console.error('Error buscando ventas:', error);
            setVentasResults([]);
        } finally {
            setVentasLoading(false);
        }
    };

    const handleSelectVenta = async (venta: any) => {
        setVentaSeleccionada(venta);
        setVentasSearch('');
        setVentasResults([]);

        setFormData({
            ...formData,
            venta_id: venta.id,
        });
    };

    // Búsqueda de vehículos (local)
    const handleSearchVehiculos = (query: string) => {
        setVehiculosSearch(query);

        // Si el campo está vacío, mostrar todos los vehículos
        if (query.trim().length === 0) {
            setVehiculosResults(vehiculos);
            return;
        }

        // Si hay texto, filtrar
        const filtered = vehiculos.filter(v =>
            v.placa.toLowerCase().includes(query.toLowerCase()) ||
            v.marca.toLowerCase().includes(query.toLowerCase()) ||
            v.modelo.toLowerCase().includes(query.toLowerCase())
        );
        setVehiculosResults(filtered);
    };

    const handleSelectVehiculo = (vehiculo: any) => {
        setVehiculoSeleccionado(vehiculo);
        setVehiculosSearch('');
        setVehiculosResults([]);

        setFormData({
            ...formData,
            vehiculo_asignado: vehiculo.placa,
        });
    };

    const handleEliminarPrestable = (prestable_id: number) => {
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

    const handleCambiarCantidad = (prestable_id: number, nueva_cantidad: number) => {
        const prestable = prestables.find(p => Number(p.id) === prestable_id);

        setPrestablesAgregados(prestablesAgregados.map(item => {
            if (item.prestable_id === prestable_id) {
                return { ...item, cantidad: nueva_cantidad };
            }

            if (prestable?.tipo === 'CANASTILLA' && (item.prestable as any)?.prestable_relacionado_id === prestable_id) {
                const cantidadEmbasesAutomatica = nueva_cantidad * (prestable.capacidad || 0);
                return { ...item, cantidad: cantidadEmbasesAutomatica };
            }

            return item;
        }));
    };

    const handleAgregarCanastilla = (prestable: Prestable) => {
        // Seleccionar solo almacenes CLIENTE por defecto
        const seleccionarAlmacenesCliente = (prestable: Prestable): number[] => {
            const almacenesDisponibles = getAlmacenesConStock(prestable);
            return almacenesDisponibles
                .filter(a => (a as any).es_proveedor === false)
                .map(a => a.id);
        };

        const almacenesSeleccionados = seleccionarAlmacenesCliente(prestable);

        const nuevosItems: PrestamoItem[] = [
            {
                prestable_id: Number(prestable.id),
                cantidad: 1,
                almacenes_ids: almacenesSeleccionados,
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
                const embaseAlmacenesSeleccionados = seleccionarAlmacenesCliente(embase);

                nuevosItems.push({
                    prestable_id: Number(embase.id),
                    cantidad: cantidadEmbasesAutomatica,
                    almacenes_ids: embaseAlmacenesSeleccionados,
                    prestable: embase,
                });
            });
        }

        setPrestablesAgregados([...prestablesAgregados, ...nuevosItems]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.nombre_evento.trim()) {
            const msg = 'El nombre del evento es requerido';
            setError(msg);
            toastError(msg);
            return;
        }

        if (prestablesAgregados.length === 0) {
            const msg = 'Agrega al menos un prestable';
            setError(msg);
            toastError(msg);
            return;
        }

        for (const item of prestablesAgregados) {
            const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
            if (!prestable) continue;

            if (!item.almacenes_ids || item.almacenes_ids.length === 0) {
                const msg = `Selecciona al menos un almacén para ${prestable.nombre}`;
                setError(msg);
                toastError(msg);
                return;
            }

            const stockSeleccionado = getStockDisponibleEnAlmacenes(prestable, item.almacenes_ids);
            if (item.cantidad > stockSeleccionado) {
                const msg = `Stock insuficiente en almacenes seleccionados para ${prestable.nombre}. Disponible: ${stockSeleccionado}, solicitado: ${item.cantidad}`;
                setError(msg);
                toastError(msg);
                return;
            }
        }

        setLoading(true);

        try {
            const payload = {
                nombre_evento: formData.nombre_evento.trim(),
                encargado_evento: formData.encargado_evento.trim() || undefined,
                vehiculo_asignado: formData.vehiculo_asignado.trim() || undefined,
                direccion_evento: formData.direccion_evento.trim() || undefined,
                telefono_uno: formData.telefono_uno.trim() || undefined,
                telefono_dos: formData.telefono_dos.trim() || undefined,
                venta_id: formData.venta_id,
                chofer_id: formData.chofer_id,
                fecha_prestamo: formData.fecha_prestamo,
                fecha_esperada_devolucion: formData.fecha_esperada_devolucion,
                monto_garantia: formData.monto_garantia,
                detalles: prestablesAgregados.map(item => ({
                    prestable_id: item.prestable_id,
                    cantidad: item.cantidad,
                    almacenes_ids: item.almacenes_ids,
                })),
            };

            console.log('📤 Enviando préstamo a evento:', payload);
            const response = await prestamoEventoService.crear(payload);

            console.log('✅ Respuesta del servidor:', response);
            if (response?.id) {
                toastSuccess('✅ Préstamo a evento creado exitosamente');
                setUltimoPrestamoId(response.id);
                setMostrarModalImpresion(true);
                setLoading(false);
            } else {
                window.location.href = '/prestamos/eventos';
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || (err as Error).message || 'Error desconocido';
            setError(errorMessage);
            toastError(errorMessage);
            setLoading(false);
        }
    };

    const totalGarantia = prestablesAgregados.reduce((sum, item) => {
        const garantia = item.prestable?.condiciones?.[0]?.monto_garantia || 0;
        return sum + Number(garantia) * item.cantidad;
    }, 0);

    return (
        <AppLayout>
            <Head title="Crear Préstamo a Evento" />
            <div className="p-2 bg-white dark:bg-gray-950 min-h-screen">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    🎉 Nuevo Préstamo a Evento
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
                            {error}
                        </div>
                    )}

                    {/* Información del Evento */}
                    <Card className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            📋 Información del Evento
                        </h2>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Cliente Automático */}
                            <Card className="p-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">👤</div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Cliente Asignado</p>
                                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">EVENTOS</p>
                                        <p className="text-xs text-blue-700 dark:text-blue-400">Se asigna automáticamente para préstamos a eventos</p>
                                    </div>
                                </div>
                            </Card>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Nombre Evento *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre_evento}
                                    onChange={(e) => setFormData({ ...formData, nombre_evento: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Ej: Boda García"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Encargado
                                </label>
                                <input
                                    type="text"
                                    value={formData.encargado_evento}
                                    onChange={(e) => setFormData({ ...formData, encargado_evento: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Nombre encargado"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Teléfono 1
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telefono_uno}
                                    onChange={(e) => setFormData({ ...formData, telefono_uno: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Teléfono 2
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telefono_dos}
                                    onChange={(e) => setFormData({ ...formData, telefono_dos: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    value={formData.direccion_evento}
                                    onChange={(e) => setFormData({ ...formData, direccion_evento: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="Calle, número, ciudad"
                                />
                            </div>
                        </div>
                    </Card>



                    {/* Información Logística */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            🚗 Información Logística
                        </h2>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Venta Relacionada */}
                            <DynamicSearchSelect
                                label="🛒 Venta (Opcional)"
                                placeholder="Buscar venta..."
                                selectedItem={ventaSeleccionada}
                                items={ventasResults}
                                isLoading={ventasLoading}
                                searchValue={ventasSearch}
                                onSearch={handleSearchVentas}
                                onSelect={handleSelectVenta}
                                onClear={() => {
                                    setVentaSeleccionada(null);
                                    setVentasSearch('');
                                    setFormData({ ...formData, venta_id: undefined });
                                }}
                                renderItem={(venta) => (
                                    <div>
                                        <p className="font-medium">{venta.numero}</p>
                                        <p className="text-xs text-gray-500">{venta.cliente?.nombre}</p>
                                    </div>
                                )}
                                getItemId={(venta) => venta.id}
                                getDisplayValue={(venta) => `${venta.numero} - ${venta.cliente?.nombre}`}
                            />

                            {/* Chofer */}
                            <DynamicSearchSelect
                                label="Chofer Encargado (Opcional)"
                                placeholder="Seleccionar chofer..."
                                selectedItem={choferes.find(ch => ch.id === formData.chofer_id) || null}
                                items={choferes}
                                isLoading={false}
                                searchValue=""
                                onSearch={() => { }}
                                onSelect={(chofer) => {
                                    setFormData({ ...formData, chofer_id: chofer.id });
                                }}
                                onClear={() => {
                                    setFormData({ ...formData, chofer_id: undefined });
                                }}
                                renderItem={(chofer) => (
                                    <p className="font-medium">{chofer.nombre}</p>
                                )}
                                getItemId={(chofer) => chofer.id}
                                getDisplayValue={(chofer) => chofer.nombre}
                            />

                            <DynamicSearchSelect
                                label="🚗 Vehículo Asignado (Opcional)"
                                placeholder="Buscar por placa, marca, modelo..."
                                selectedItem={vehiculoSeleccionado}
                                items={vehiculosResults}
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
                                        <p className="text-xs text-gray-500">{vehiculo.marca} {vehiculo.modelo} ({vehiculo.anho})</p>
                                    </div>
                                )}
                                getItemId={(vehiculo) => vehiculo.id}
                                getDisplayValue={(vehiculo) => vehiculo.placa}
                            />

                            {/* Monto Garantía */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Monto Garantía (Opcional)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.monto_garantia}
                                    onChange={(e) => setFormData({ ...formData, monto_garantia: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Fecha Préstamo *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_prestamo}
                                    onChange={(e) => handleFechaPrestamo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Fecha Esperada Devolución
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha_esperada_devolucion}
                                    onChange={(e) => setFormData({ ...formData, fecha_esperada_devolucion: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Tabla de Prestables */}
                    <PrestablesSelectionTable
                        label="Prestables en Préstamo"
                        placeholder="Buscar prestable..."
                        prestables={prestables}
                        items={prestablesAgregados}
                        onSelectItem={handleAgregarCanastilla}
                        onDeleteItem={handleEliminarPrestable}
                        onUpdateCantidad={handleCambiarCantidad}
                        onToggleAlmacen={handleToggleAlmacen}
                        getStockDisponibleTotal={getStockDisponibleTotal}
                        getAlmacenesConStock={getAlmacenesConStock}
                        getStockDisponibleEnAlmacenes={getStockDisponibleEnAlmacenes}
                        hideAlmacenesSelection={false}
                    />

                    {/* Resumen y Botones */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Prestables</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {prestablesAgregados.reduce((sum, item) => sum + item.cantidad, 0)}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tipos</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {prestablesAgregados.length}
                                </p>
                            </div>
                            {/* <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Garantía Estimada</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    ${totalGarantia.toFixed(2)}
                                </p>
                            </div> */}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => window.location.href = '/prestamos/eventos'}
                            >
                                Cancelar
                            </Button>
                            <Button
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleSubmit}
                            >
                                {loading ? 'Creando...' : '✅ Crear Préstamo'}
                            </Button>
                        </div>
                    </Card>
                </form>

                <ToastContainer toasts={toasts} removeToast={removeToast} />

                {/* Modal de impresión */}
                {mostrarModalImpresion && ultimoPrestamoId && (
                    <OutputSelectionModal
                        isOpen={mostrarModalImpresion}
                        onClose={() => {
                            setMostrarModalImpresion(false);
                            window.location.href = '/prestamos/eventos';
                        }}
                        documentoId={ultimoPrestamoId}
                        tipoDocumento="prestamo-evento"
                        onPrint={async (formato, accion) => {
                            window.open(`/prestamos/eventos/${ultimoPrestamoId}/imprimir?formato=${formato}&accion=${accion}`, '_blank');
                            window.location.href = '/prestamos/eventos';
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}

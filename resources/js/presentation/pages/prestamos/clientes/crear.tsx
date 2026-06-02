import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import prestamoClienteService from '@/infrastructure/services/prestamo-cliente.service';
import { usePrestables } from '@/stores/usePrestables';
import { useToast } from '@/presentation/hooks/useToast';
import type { Prestable } from '@/domain/entities/prestamos';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import PrestablesSelectionTable from '@/presentation/components/form-sections/PrestablesSelectionTable';

interface Props {
    clientes: Array<{ id: number; nombre: string; razon_social?: string; telefono?: string | null }>;
    choferes: Array<{ id: number; nombre: string }>;
    ventas: Array<{ id: number; numero: string; cliente_id: number; cliente?: { id: number; nombre: string; razon_social?: string } }>;
}

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    almacenes_ids: number[];
    prestable?: Prestable;
}

export default function CrearPrestamoCliente({ clientes, choferes, ventas }: Props) {
    const { prestables, loading: loadingPrestables, fetchPrestables } = usePrestables();
    const { toasts, removeToast, error: toastError, warning: toastWarning, success: toastSuccess } = useToast();


    // Estado principal del préstamo
    const [formData, setFormData] = useState({
        cliente_id: undefined as number | undefined,
        chofer_id: undefined as number | undefined,
        telefono_cliente_1: '',
        telefono_cliente_2: '',
        tipo_prestamo: 'canastillas_embases' as 'canastillas' | 'embases' | 'canastillas_embases',
        es_venta: false,
        venta_id: undefined as number | undefined,
        es_evento: false,
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

    const [clientesSearch, setClientesSearch] = useState('');
    const [clientesFiltered, setClientesFiltered] = useState(clientes);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);

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

    const obtenerTelefonoCliente = (clienteId?: number) => {
        if (!clienteId) return '';
        const cliente = clientes.find((c) => c.id === clienteId);
        return (cliente?.telefono || '').trim();
    };

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

    // Búsqueda de ventas (solo aquellas con productos que tengan prestables)
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

        try {
            const response = await fetch(`/api/ventas/${venta.id}/detalles`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            const ventaData = data.data || data;
            const clienteId = ventaData.cliente_id;
            const telefonoVenta = (ventaData?.cliente?.telefono || '').trim();
            const telefonoCliente = telefonoVenta || obtenerTelefonoCliente(clienteId);

            setFormData({
                ...formData,
                venta_id: venta.id,
                cliente_id: clienteId,
                telefono_cliente_1: telefonoCliente,
            });
            setClienteSeleccionado(clientes.find(c => c.id === clienteId));
        } catch (error) {
            console.error('Error obteniendo venta:', error);
        }
    };

    // Búsqueda de clientes
    const handleSearchClientes = (query: string) => {
        setClientesSearch(query);
        if (query.trim().length === 0) {
            setClientesFiltered(clientes);
        } else {
            setClientesFiltered(
                clientes.filter(c =>
                    c.nombre.toLowerCase().includes(query.toLowerCase()) ||
                    c.razon_social?.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    const handleSelectCliente = (cliente: any) => {
        setClienteSeleccionado(cliente);
        setClientesSearch('');
        setClientesFiltered(clientes);

        const telefonoCliente = obtenerTelefonoCliente(cliente.id);
        setFormData({
            ...formData,
            cliente_id: cliente.id,
            telefono_cliente_1: telefonoCliente || formData.telefono_cliente_1,
        });
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

    const handleCambiarCantidad = (prestable_id: number, nueva_cantidad: number) => {
        const prestable = prestables.find(p => Number(p.id) === prestable_id);

        setPrestablesAgregados(prestablesAgregados.map(item => {
            if (item.prestable_id === prestable_id) {
                return { ...item, cantidad: nueva_cantidad };
            }

            // Si es una canastilla y cambió su cantidad, actualizar embases relacionados
            if (prestable?.tipo === 'CANASTILLA' && (item.prestable as any)?.prestable_relacionado_id === prestable_id) {
                const cantidadEmbasesAutomatica = nueva_cantidad * (prestable.capacidad || 0);
                return { ...item, cantidad: cantidadEmbasesAutomatica };
            }

            return item;
        }));
    };

    const handleAgregarCanastilla = (prestable: Prestable) => {
        // Función helper para seleccionar solo almacenes CLIENTE por defecto
        const seleccionarAlmacenesCliente = (prestable: Prestable): number[] => {
            const almacenesDisponibles = getAlmacenesConStock(prestable);
            // Filtrar SOLO almacenes donde es_proveedor = false (almacenes CLIENTE)
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

        // Si es canastilla, agregar automáticamente sus embases relacionados
        if (prestable.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter(
                p => p.tipo === 'EMBASES'
                    && (p as any).prestable_relacionado_id === Number(prestable.id)
                    && getStockDisponibleTotal(p) > 0
            );

            embasesRelacionados.forEach(embase => {
                // Preseleccionar cantidad de embases = cantidad canastillas × capacidad
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

        if (!formData.cliente_id) {
            const msg = 'Selecciona un cliente';
            setError(msg);
            toastError(msg);
            return;
        }

        if (formData.es_venta && !formData.venta_id) {
            const msg = 'Selecciona una venta';
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
            // Enviar todos los prestables en un único llamado con formato de detalles
            const payload = {
                cliente_id: formData.cliente_id,
                chofer_id: formData.chofer_id,
                telefono_cliente_1: formData.telefono_cliente_1.trim() || undefined,
                telefono_cliente_2: formData.telefono_cliente_2.trim() || undefined,
                tipo_prestamo: formData.tipo_prestamo,
                es_venta: formData.es_venta,
                venta_id: formData.venta_id,
                es_evento: formData.es_evento,
                fecha_prestamo: formData.fecha_prestamo,
                fecha_esperada_devolucion: formData.fecha_esperada_devolucion,
                monto_garantia: formData.monto_garantia,
                observaciones: '',
                detalles: prestablesAgregados.map(item => ({
                    prestable_id: item.prestable_id,
                    cantidad: item.cantidad,
                    almacenes_ids: item.almacenes_ids,
                })),
            };

            console.log('📤 Enviando préstamo con detalles:', payload);
            const response = await prestamoClienteService.crear(payload);

            console.log('✅ Respuesta del servidor:', response);
            if (response?.id) {
                toastSuccess('✅ Préstamo creado exitosamente');
                setUltimoPrestamoId(response.id);
                setMostrarModalImpresion(true);
                setLoading(false);
            } else {
                // Fallback si no hay ID
                console.warn('No se pudo obtener ID del préstamo, redirigiendo...');
                window.location.href = '/prestamos/clientes';
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
            <Head title="Crear Préstamo a Cliente" />
            <div className="p-2 bg-white dark:bg-gray-950 min-h-screen">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    👥 Nuevo Préstamo a Cliente
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
                            {error}
                        </div>
                    )}

                    {/* Sección 1: Información del Préstamo */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        {/* <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            📋 Información del Préstamo
                        </h2> */}

                        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                            {/* Venta - Búsqueda Dinámica */}
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

                            {/* Cliente - Búsqueda Dinámica */}
                            <DynamicSearchSelect
                                label="Cliente *"
                                placeholder="Buscar cliente..."
                                selectedItem={clienteSeleccionado}
                                items={clientesFiltered}
                                isLoading={false}
                                searchValue={clientesSearch}
                                onSearch={handleSearchClientes}
                                onSelect={handleSelectCliente}
                                onClear={() => {
                                    setClienteSeleccionado(null);
                                    setClientesSearch('');
                                    setFormData({ ...formData, cliente_id: undefined });
                                }}
                                renderItem={(cliente) => (
                                    <div>
                                        <p className="font-medium">{cliente.nombre}</p>
                                        {cliente.razon_social && (
                                            <p className="text-xs text-gray-500">{cliente.razon_social}</p>
                                        )}
                                    </div>
                                )}
                                getItemId={(cliente) => cliente.id}
                                getDisplayValue={(cliente) => cliente.nombre}
                            />

                            {/* Chofer - Pre cargados (sin búsqueda) */}
                            <DynamicSearchSelect
                                label="Chofer Encargado (Opcional)"
                                placeholder="Seleccionar chofer..."
                                selectedItem={choferes.find(ch => ch.id === formData.chofer_id) || null}
                                items={choferes}
                                isLoading={false}
                                searchValue=""
                                onSearch={() => {}}
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
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Teléfono Cliente 1 (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.telefono_cliente_1}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            telefono_cliente_1: e.target.value,
                                        })
                                    }
                                    maxLength={25}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: 71234567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Teléfono Cliente 2 (Opcional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.telefono_cliente_2}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            telefono_cliente_2: e.target.value,
                                        })
                                    }
                                    maxLength={25}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: 76543210"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
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
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Escribe la garantía manualmente (Sugerencia: {totalGarantia.toFixed(2)})
                                </p>
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
                        {/* <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.es_evento}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            es_evento: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    🎉 Este préstamo es para un evento
                                </span>
                            </label>
                        </div> */}
                    </Card>

                    {/* Sección 2: Prestables */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            📦 Seleccionar Prestables
                        </h2>

                        <PrestablesSelectionTable
                            prestables={prestables}
                            items={prestablesAgregados}
                            onSelectItem={handleAgregarCanastilla}
                            onDeleteItem={handleEliminarPrestable}
                            onUpdateCantidad={handleCambiarCantidad}
                            onToggleAlmacen={handleToggleAlmacen}
                            getStockDisponibleTotal={getStockDisponibleTotal}
                            getAlmacenesConStock={getAlmacenesConStock}
                            getStockDisponibleEnAlmacenes={getStockDisponibleEnAlmacenes}
                            loading={loadingPrestables}
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
                        <a href="/prestamos/clientes">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </a>
                    </div>
                </form>
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onClose={removeToast} />

            {/* Modal de Impresión */}
            <OutputSelectionModal
                isOpen={mostrarModalImpresion && ultimoPrestamoId !== null}
                onClose={() => {
                    setMostrarModalImpresion(false);
                    setUltimoPrestamoId(null);
                    // Redirigir después de cerrar el modal
                    setTimeout(() => {
                        window.location.href = '/prestamos/clientes';
                    }, 300);
                }}
                documentoId={ultimoPrestamoId || 0}
                tipoDocumento="prestamo-cliente"
            />
        </AppLayout>
    );
}

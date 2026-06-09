import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import ModalAlmacenesDetalle from '@/presentation/components/modales/ModalAlmacenesDetalle';
import { prestamoEventoService } from '@/infrastructure/services/prestamo-evento.service';
import { usePrestables } from '@/stores/usePrestables';
import { useToast } from '@/presentation/hooks/useToast';
import type { Prestable } from '@/domain/entities/prestamos';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import PrestablesSelectionTable from '@/presentation/components/form-sections/PrestablesSelectionTable';
import { type BreadcrumbItem } from '@/types';

interface Props {
    choferes: Array<{ id: number; nombre: string }>;
    almacenes: Array<{ id: number; nombre: string; es_proveedor: boolean }>;
    ventas: Array<{ id: number; numero: string; cliente_id: number; cliente?: { id: number; nombre: string; razon_social?: string } }>;
    vehiculos: Array<{ id: number; placa: string; marca: string; modelo: string; anho: number }>;
}

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    almacenes_ids: number[];
    almacenes?: Array<{
        almacenes_prestables_id: number;
        cantidad: number;
    }>;
    prestable?: Prestable;
    isAutomaticEmbase?: boolean; // true si fue cargado automáticamente con una canastilla
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Préstamos', href: '/prestamos/eventos' },
    { title: 'Crear Préstamo a Evento', href: '/prestamos/eventos/crear' },
];

export default function CrearPrestamoEvento({ choferes, almacenes, ventas, vehiculos }: Props) {
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
        almacenes_prestables_id: undefined as number | undefined,
        ventas_ids: [] as number[],
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
    const [ventasSeleccionadas, setVentasSeleccionadas] = useState<any[]>([]);

    const [almacenesSearch, setAlmacenesSearch] = useState('');
    const [almacenesResults, setAlmacenesResults] = useState<any[]>([]);
    const [almacenesLoading, setAlmacenesLoading] = useState(false);

    const [vehiculosSearch, setVehiculosSearch] = useState('');
    const [vehiculosResults, setVehiculosResults] = useState<any[]>([]);
    const [vehiculosLoading, setVehiculosLoading] = useState(false);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [ultimoPrestamoId, setUltimoPrestamoId] = useState<number | null>(null);

    // ✅ Estados para modal de almacenes
    const [mostrarModalAlmacenes, setMostrarModalAlmacenes] = useState(false);
    const [prestamoItemEnEdicion, setPrestamoItemEnEdicion] = useState<PrestamoItem | null>(null);
    const [indexEnEdicion, setIndexEnEdicion] = useState<number | null>(null);

    useEffect(() => {
        fetchPrestables();
        // Inicializar almacenes precargados
        setAlmacenesResults(almacenes);
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
        // Verificar si ya está seleccionada
        if (ventasSeleccionadas.find(v => v.id === venta.id)) {
            return;
        }

        const nuevasVentas = [...ventasSeleccionadas, venta];
        setVentasSeleccionadas(nuevasVentas);
        setVentasSearch('');
        setVentasResults([]);

        setFormData({
            ...formData,
            ventas_ids: nuevasVentas.map(v => v.id),
        });
    };

    const handleRemoveVenta = (ventaId: number) => {
        const nuevasVentas = ventasSeleccionadas.filter(v => v.id !== ventaId);
        setVentasSeleccionadas(nuevasVentas);
        setFormData({
            ...formData,
            ventas_ids: nuevasVentas.map(v => v.id),
        });
    };

    // Búsqueda de almacenes
    const handleSearchAlmacenes = (query: string) => {
        setAlmacenesSearch(query);

        if (query.trim().length === 0) {
            setAlmacenesResults(almacenes);
            return;
        }

        const filtered = almacenes.filter(almacen =>
            almacen.nombre.toLowerCase().includes(query.toLowerCase())
        );
        setAlmacenesResults(filtered);
    };

    const handleSelectAlmacen = (almacen: any) => {
        setFormData({
            ...formData,
            almacenes_prestables_id: almacen.id,
        });
        setAlmacenesSearch('');
        setAlmacenesResults([]);
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

    const handleCambiarCantidad = (itemIndex: number, nueva_cantidad: number) => {
        // ✅ CORREGIDO: Usar itemIndex como cliente (no prestable_id)
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
                almacenes_ids: [], // ✅ VACÍO - el usuario debe especificar
                almacenes: undefined, // SIN almacenes pre-seleccionados
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
                    almacenes_ids: [], // ✅ VACÍO
                    almacenes: undefined, // SIN almacenes
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
            almacenes_ids: i.almacenes_ids // ✅ Mostrar almacenes vacíos
        })));
        console.log('   ⚠️ USUARIO DEBE ESPECIFICAR ALMACENES en el modal');
        toastWarning('⚠️ Especifica los almacenes para este prestable en el modal');
        setPrestablesAgregados(actualizado);
    };

    // ✅ NUEVO: Funciones para editar almacenes
    const handleEditAlmacenes = async (item: PrestamoItem, index: number) => {
        try {
            // ✅ ACTUALIZADO: Usar prestable de memoria (ya tiene stocks desde el controller)
            if (item.prestable_id) {
                const prestableActualizado = prestables.find(p => p.id === item.prestable_id);

                if (prestableActualizado) {
                    const itemConDatosActuales = {
                        ...item,
                        prestable: prestableActualizado,
                    };

                    setPrestamoItemEnEdicion(itemConDatosActuales);
                    console.log('✅ Prestable cargado desde memoria (con stocks):', {
                        prestable: prestableActualizado.nombre,
                        stocks: prestableActualizado.stocks,
                    });
                } else {
                    setPrestamoItemEnEdicion(item);
                    toastWarning('⚠️ Prestable no encontrado');
                }
            } else {
                setPrestamoItemEnEdicion(item);
            }

            setIndexEnEdicion(index);
            setMostrarModalAlmacenes(true);
        } catch (error) {
            console.error('Error abriendo modal de almacenes:', error);
            setPrestamoItemEnEdicion(item);
            setIndexEnEdicion(index);
            setMostrarModalAlmacenes(true);
            toastWarning('⚠️ Error abriendo modal');
        }
    };

    const handleGuardarAlmacenes = (almacenesSeleccionados: Array<{ almacenes_prestables_id: number; cantidad: number }>) => {
        if (indexEnEdicion !== null && prestamoItemEnEdicion) {
            const nuevosItems = [...prestablesAgregados];
            const itemActual = nuevosItems[indexEnEdicion];
            const prestableActual = prestables.find(p => p.id === itemActual.prestable_id);

            nuevosItems[indexEnEdicion] = {
                ...itemActual,
                almacenes: almacenesSeleccionados,
                almacenes_ids: almacenesSeleccionados.map(a => a.almacenes_prestables_id),
            };

            if (prestableActual?.tipo === 'CANASTILLA') {
                const capacidadCanastilla = prestableActual.capacidad || 0;

                const embasesRelacionados = nuevosItems
                    .map((item, idx) => {
                        const prestableEmbase = prestables.find(p => p.id === item.prestable_id);
                        const esEmbaseAuto = item.isAutomaticEmbase === true;
                        const estaRelacionado = (prestableEmbase as any)?.prestable_relacionado_id === prestableActual.id;

                        if (prestableEmbase?.tipo === 'EMBASES' && esEmbaseAuto && estaRelacionado) {
                            return { index: idx, item, prestableEmbase };
                        }
                        return null;
                    })
                    .filter(Boolean) as Array<{ index: number; item: PrestamoItem; prestableEmbase: Prestable }>;

                embasesRelacionados.forEach(({ index }) => {
                    const cantidadEmbasesNueva = itemActual.cantidad * capacidadCanastilla;

                    const almacenesEmbase = almacenesSeleccionados.map(almData => ({
                        almacenes_prestables_id: almData.almacenes_prestables_id,
                        cantidad: Math.round((almData.cantidad / itemActual.cantidad) * cantidadEmbasesNueva) || 0,
                    }));

                    nuevosItems[index] = {
                        ...nuevosItems[index],
                        cantidad: cantidadEmbasesNueva,
                        almacenes: almacenesEmbase,
                        almacenes_ids: almacenesEmbase.map(a => a.almacenes_prestables_id),
                    };
                });

                console.log('✅ Embases automáticos actualizados:', {
                    canastilla: prestableActual.nombre,
                    capacidad: capacidadCanastilla,
                    embasesActualizados: embasesRelacionados.length,
                });
            }

            setPrestablesAgregados(nuevosItems);
            setMostrarModalAlmacenes(false);
            setPrestamoItemEnEdicion(null);
            setIndexEnEdicion(null);
        }
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

            // ✅ MODIFICADO: Permitir almacenes_ids vacío si hay almacén de cabecera
            const almacenesAValidar = (item.almacenes_ids && item.almacenes_ids.length > 0)
                ? item.almacenes_ids
                : formData.almacenes_prestables_id
                ? [formData.almacenes_prestables_id]
                : [];

            if (almacenesAValidar.length === 0) {
                const msg = `Selecciona al menos un almacén para ${prestable.nombre} (en cabecera o en el detalle)`;
                setError(msg);
                toastError(msg);
                return;
            }

            const stockSeleccionado = getStockDisponibleEnAlmacenes(prestable, almacenesAValidar);
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
                almacenes_prestables_id: formData.almacenes_prestables_id,
                ventas_ids: formData.ventas_ids,
                chofer_id: formData.chofer_id,
                fecha_prestamo: formData.fecha_prestamo,
                fecha_esperada_devolucion: formData.fecha_esperada_devolucion,
                monto_garantia: formData.monto_garantia,
                detalles: prestablesAgregados.map(item => {
                    // ✅ SIMPLIFICADO: Igual que en clientes
                    // Si tiene almacenes en el nuevo formato, usarlo; sino usar almacenes_ids (antiguo)
                    const detallePayload: any = {
                        prestable_id: item.prestable_id,
                        cantidad: item.cantidad,
                    };

                    if (item.almacenes && item.almacenes.length > 0) {
                        detallePayload.almacenes = item.almacenes;
                    } else if (item.almacenes_ids && item.almacenes_ids.length > 0) {
                        detallePayload.almacenes_ids = item.almacenes_ids;
                    }
                    // Si no hay nada, no envía nada → backend usa almacén de cabecera

                    return detallePayload;
                }),
            };

            // ✅ LOGS DETALLADOS
            console.log('%c📤 PRÉSTAMO A EVENTO - ENVIANDO AL BACKEND', 'color: #0066cc; font-weight: bold; font-size: 14px');
            console.log('%c=== CABECERA ===', 'color: #00aa00; font-weight: bold');
            console.log({
                evento: payload.nombre_evento,
                encargado: payload.encargado_evento,
                chofer_id: payload.chofer_id,
                vehiculo: payload.vehiculo_asignado,
                dirección: payload.direccion_evento,
                teléfono_1: payload.telefono_uno,
                teléfono_2: payload.telefono_dos,
                almacén_cabecera: payload.almacenes_prestables_id,
                fecha_prestamo: payload.fecha_prestamo,
                fecha_esperada_devolucion: payload.fecha_esperada_devolucion,
                monto_garantía: payload.monto_garantia,
            });

            console.log('%c=== DETALLES (PRESTABLES) ===', 'color: #00aa00; font-weight: bold');
            payload.detalles.forEach((detalle, idx) => {
                console.log(`%c📦 Detalle ${idx + 1}:`, 'color: #ff6600; font-weight: bold', {
                    prestable_id: detalle.prestable_id,
                    prestable_nombre: prestables.find(p => p.id === detalle.prestable_id)?.nombre,
                    cantidad: detalle.cantidad,
                    almacenes_seleccionados: detalle.almacenes?.map(a => ({
                        almacenes_prestables_id: a.almacenes_prestables_id,
                        almacen_nombre: almacenes.find(alm => alm.id === a.almacenes_prestables_id)?.nombre,
                        cantidad: a.cantidad,
                    })) || [],
                });
            });

            console.log('%c=== PAYLOAD COMPLETO ===', 'color: #aa00aa; font-weight: bold');
            console.log(payload);

            const response = await prestamoEventoService.crear(payload);

            console.log('%c✅ RESPUESTA DEL SERVIDOR', 'color: #00aa00; font-weight: bold; font-size: 14px');
            console.log(response);
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Préstamo a Evento" />
            <div className="p-2 bg-white dark:bg-gray-950 min-h-screen">
                {/* <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    🎉 Nuevo Préstamo a Eventoss
                </h1> */}

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
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {/* Ventas Relacionadas (Múltiples) */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    🛒 Ventas Relacionadas
                                </label>
                                <div className="space-y-2">
                                    <DynamicSearchSelect
                                        label=""
                                        placeholder="Buscar venta..."
                                        selectedItem={null}
                                        items={ventasResults}
                                        isLoading={ventasLoading}
                                        searchValue={ventasSearch}
                                        onSearch={handleSearchVentas}
                                        onSelect={handleSelectVenta}
                                        onClear={() => {
                                            setVentasSearch('');
                                            setVentasResults([]);
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
                                    {/* Mostrar ventas seleccionadas como chips */}
                                    {ventasSeleccionadas.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            {ventasSeleccionadas.map((venta) => (
                                                <div
                                                    key={venta.id}
                                                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 rounded-full text-sm"
                                                >
                                                    {venta.numero} - {venta.cliente?.nombre}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVenta(venta.id)}
                                                        className="ml-1 font-bold hover:text-red-600 dark:hover:text-red-400"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Almacén */}
                            <DynamicSearchSelect
                                label="📦 Almacén"
                                placeholder="Buscar almacén..."
                                selectedItem={
                                    formData.almacenes_prestables_id
                                        ? almacenesResults.find(a => a.id === formData.almacenes_prestables_id) ||
                                        almacenes.find(a => a.id === formData.almacenes_prestables_id)
                                        : null
                                }
                                items={almacenesResults}
                                isLoading={almacenesLoading}
                                searchValue={almacenesSearch}
                                onSearch={handleSearchAlmacenes}
                                onSelect={handleSelectAlmacen}
                                onClear={() => {
                                    setFormData({ ...formData, almacenes_prestables_id: undefined });
                                    setAlmacenesSearch('');
                                    setAlmacenesResults([]);
                                }}
                                renderItem={(almacen) => (
                                    <div>
                                        <p className="font-medium">{almacen.nombre}</p>
                                        <p className="text-xs text-gray-500">
                                            {almacen.es_proveedor ? '🏭 Proveedor' : '📦 Almacén Distribuidora'}
                                        </p>
                                    </div>
                                )}
                                getItemId={(almacen) => almacen.id}
                                getDisplayValue={(almacen) =>
                                    `${almacen.nombre} (${almacen.es_proveedor ? 'Proveedor' : 'Distribuidora'})`
                                }
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
                        prestables={prestables}
                        items={prestablesAgregados}
                        almacenes={almacenes}
                        onSelectItem={handleAgregarCanastilla}
                        onDeleteItem={handleEliminarPrestable}
                        onUpdateCantidad={handleCambiarCantidad}
                        onEditAlmacenes={handleEditAlmacenes}
                        getStockDisponibleTotal={getStockDisponibleTotal}
                        loading={loadingPrestables}
                        almacen_prestable_id={formData.almacenes_prestables_id}
                    />

                    {/* Resumen y Botones */}
                    <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">

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

                <ToastContainer toasts={toasts} onClose={removeToast} />

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

                {/* Modal de Almacenes */}
                {mostrarModalAlmacenes && prestamoItemEnEdicion && (() => {
                    const esCanastilla = prestamoItemEnEdicion.prestable?.tipo === 'CANASTILLA';
                    const esEmbase = prestamoItemEnEdicion.prestable?.tipo === 'EMBASES';

                    // Si es canastilla, buscar el embase relacionado para mostrar su stock
                    let embaseRelacionado = null;
                    let embaseStock: any[] = [];

                    if (esCanastilla) {
                        embaseRelacionado = prestables.find(p =>
                            p.tipo === 'EMBASES' &&
                            (p as any).prestable_relacionado_id === prestamoItemEnEdicion.prestable?.id
                        );
                        if (embaseRelacionado) {
                            embaseStock = embaseRelacionado.stocks || [];
                        }
                    }

                    return (
                        <ModalAlmacenesDetalle
                            isOpen={mostrarModalAlmacenes}
                            onClose={() => {
                                setMostrarModalAlmacenes(false);
                                setPrestamoItemEnEdicion(null);
                                setIndexEnEdicion(null);
                            }}
                            onSave={handleGuardarAlmacenes}
                            prestableNombre={prestamoItemEnEdicion.prestable?.nombre || 'Prestable'}
                            cantidadTotal={prestamoItemEnEdicion.cantidad}
                            almacenes={almacenes}
                            stockDisponible={prestamoItemEnEdicion.prestable?.stocks || []}
                            almacenesActuales={prestamoItemEnEdicion.almacenes || []}
                            esCanastilla={esCanastilla}
                            capacidadCanastilla={prestamoItemEnEdicion.prestable?.capacidad || 0}
                            embaseNombre={embaseRelacionado?.nombre || ''}
                            embaseStockDisponible={embaseStock}
                        />
                    );
                })()}
            </div>
        </AppLayout>
    );
}

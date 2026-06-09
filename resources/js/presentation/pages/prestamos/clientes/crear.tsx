import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import prestamoClienteService from '@/infrastructure/services/prestamo-cliente.service';
import { useToast } from '@/presentation/hooks/useToast';
import type { Prestable } from '@/domain/entities/prestamos';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import PrestablesSelectionTable from '@/presentation/components/form-sections/PrestablesSelectionTable';
import ModalAlmacenesDetalle from '@/presentation/components/modales/ModalAlmacenesDetalle';

interface Props {
    clientes: Array<{ id: number; nombre: string; razon_social?: string; telefono?: string | null }>;
    choferes: Array<{ id: number; nombre: string }>;
    almacenes: Array<{ id: number; nombre: string; es_proveedor?: boolean }>;
    vehiculos: Array<{ id: number; placa: string; marca?: string; modelo?: string }>;
    ventas: Array<{ id: number; numero: string; cliente_id: number; cliente?: { id: number; nombre: string; razon_social?: string } }>;
    prestables: Prestable[]; // ✅ Nuevo: prestables vienen del servidor
}

interface PrestamoItem {
    prestable_id: number;
    cantidad: number;
    almacenes_ids: number[]; // Antiguo formato (para compatibilidad)
    almacenes?: Array<{
        almacenes_prestables_id: number;
        cantidad: number;
    }>; // Nuevo formato (múltiples almacenes con cantidad)
    prestable?: Prestable;
    isAutomaticEmbase?: boolean;
}

export default function CrearPrestamoCliente({ clientes, choferes, almacenes, vehiculos, ventas, prestables }: Props) {
    // ✅ Cambio: usar prestables del prop en lugar de fetchear del API
    const loadingPrestables = false; // No necesita loading porque vienen en props
    const { toasts, removeToast, error: toastError, warning: toastWarning, success: toastSuccess } = useToast();


    // Estado principal del préstamo
    const [formData, setFormData] = useState({
        cliente_id: undefined as number | undefined,
        almacenes_prestables_id: undefined as number | undefined, // OPCIONAL: si no hay, se usa almacenes en detalles
        chofer_id: undefined as number | undefined,
        vehiculo_id: undefined as number | undefined,
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

    const [almacenesSearch, setAlmacenesSearch] = useState('');
    const [almacenesFiltered, setAlmacenesFiltered] = useState(almacenes);
    const [almacenSeleccionado, setAlmacenSeleccionado] = useState<any>(null);

    const [vehiculosSearch, setVehiculosSearch] = useState('');
    const [vehiculosFiltered, setVehiculosFiltered] = useState(vehiculos);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [ultimoPrestamoId, setUltimoPrestamoId] = useState<number | null>(null);

    // Estados para modal de almacenes
    const [mostrarModalAlmacenes, setMostrarModalAlmacenes] = useState(false);
    const [prestamoItemEnEdicion, setPrestamoItemEnEdicion] = useState<PrestamoItem | null>(null);
    const [indexEnEdicion, setIndexEnEdicion] = useState<number | null>(null);

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
            console.log('🔍 BÚSQUEDA DE VENTAS - Respuesta del backend:', {
                respuesta_completa: data,
                ventas_encontradas: data.data || [],
                estructura_primera_venta: data.data?.[0],
            });
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
            const response = await fetch(`/api/ventas/${venta.id}`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            const ventaData = data.data || data;

            console.log('📋 DETALLE DE VENTA SELECCIONADA - Respuesta del backend:', {
                respuesta_completa: data,
                venta_data: ventaData,
                detalles: ventaData.detalles,
                estructura_primer_detalle: ventaData.detalles?.[0],
                producto_primer_detalle: ventaData.detalles?.[0]?.producto,
                prestables_en_producto: ventaData.detalles?.[0]?.producto?.prestables,
            });

            const clienteId = ventaData.cliente_id;
            const telefonoVenta = (ventaData?.cliente?.telefono || '').trim();
            const telefonoCliente = telefonoVenta || obtenerTelefonoCliente(clienteId);

            // Cargar prestables desde productos de la venta
            const nuevosPrestables: PrestamoItem[] = [];
            if (ventaData.detalles && Array.isArray(ventaData.detalles)) {
                ventaData.detalles.forEach((detalle: any) => {
                    const producto = detalle.producto;
                    const cantidad = detalle.cantidad || 0;

                    // Buscar prestable CANASTILLA relacionado (ventas al por mayor son en canastillas)
                    if (producto && producto.prestables && producto.prestables.length > 0 && cantidad > 0) {
                        // ✅ Buscar CANASTILLA primero (ventas al por mayor)
                        const prestableCanastilla = producto.prestables.find(
                            (p: any) => prestables.find(pr => pr.id === p.prestable_id)?.tipo === 'CANASTILLA'
                        );

                        if (prestableCanastilla) {
                            const canastilla = prestables.find(p => p.id === prestableCanastilla.prestable_id);

                            if (canastilla) {
                                console.log('📦 Cargando CANASTILLA + EMBASES desde venta:', {
                                    producto: producto.nombre,
                                    canastilla: canastilla.nombre,
                                    cantidad_canastillas: cantidad,
                                    capacidad: canastilla.capacidad,
                                    cantidad_embases: cantidad * (canastilla.capacidad || 0),
                                });

                                // 1️⃣ Agregar CANASTILLA
                                nuevosPrestables.push({
                                    prestable_id: Number(canastilla.id),
                                    cantidad: cantidad,
                                    almacenes_ids: [],
                                    prestable: canastilla,
                                });

                                // 2️⃣ Agregar EMBASES automáticos relacionados
                                const embasesRelacionados = prestables.filter(
                                    p => p.tipo === 'EMBASES' &&
                                         (p as any).prestable_relacionado_id === canastilla.id
                                );

                                embasesRelacionados.forEach(embase => {
                                    const cantidadEmbases = cantidad * (canastilla.capacidad || 0);
                                    nuevosPrestables.push({
                                        prestable_id: Number(embase.id),
                                        cantidad: cantidadEmbases,
                                        almacenes_ids: [],
                                        prestable: embase,
                                        isAutomaticEmbase: true,
                                    });
                                });
                            }
                        }
                    }
                });
            }

            setFormData({
                ...formData,
                venta_id: venta.id,
                cliente_id: clienteId,
                telefono_cliente_1: telefonoCliente,
            });
            setClienteSeleccionado(clientes.find(c => c.id === clienteId));

            // Agregar prestables cargados
            if (nuevosPrestables.length > 0) {
                setPrestablesAgregados([...prestablesAgregados, ...nuevosPrestables]);
                toastSuccess(`✅ Cargados ${nuevosPrestables.length} prestables desde la venta`);
            }
        } catch (error) {
            console.error('Error obteniendo venta:', error);
            toastError('Error al cargar datos de la venta');
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

    // Búsqueda de almacenes
    const handleSearchAlmacenes = (query: string) => {
        setAlmacenesSearch(query);
        if (query.trim().length === 0) {
            setAlmacenesFiltered(almacenes);
        } else {
            setAlmacenesFiltered(
                almacenes.filter(a =>
                    a.nombre.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    const handleSelectAlmacen = (almacen: any) => {
        setAlmacenSeleccionado(almacen);
        setAlmacenesSearch('');
        setAlmacenesFiltered(almacenes);
        setFormData({
            ...formData,
            almacenes_prestables_id: almacen.id,
        });
    };

    // Búsqueda de vehículos
    const handleSearchVehiculos = (query: string) => {
        setVehiculosSearch(query);
        if (query.trim().length === 0) {
            setVehiculosFiltered(vehiculos);
        } else {
            setVehiculosFiltered(
                vehiculos.filter(v =>
                    v.placa.toLowerCase().includes(query.toLowerCase()) ||
                    v.marca?.toLowerCase().includes(query.toLowerCase()) ||
                    v.modelo?.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    const handleSelectVehiculo = (vehiculo: any) => {
        setVehiculoSeleccionado(vehiculo);
        setVehiculosSearch('');
        setVehiculosFiltered(vehiculos);
        setFormData({
            ...formData,
            vehiculo_id: vehiculo.id,
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

    const handleEditAlmacenes = async (item: PrestamoItem, index: number) => {
        try {
            // Refrescar datos del prestable desde el API para obtener stock actual
            if (item.prestable_id) {
                const response = await fetch(`/api/prestables/${item.prestable_id}`, {
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    const prestableActualizado = data.data || data;

                    // Actualizar el item con datos frescos del API
                    const itemConDatosActuales = {
                        ...item,
                        prestable: prestableActualizado,
                    };

                    setPrestamoItemEnEdicion(itemConDatosActuales);
                    console.log('✅ Stock refrescado del API:', {
                        prestable: prestableActualizado.nombre,
                        stocks: prestableActualizado.stocks,
                    });
                } else {
                    // Si falla, usar datos en memoria
                    setPrestamoItemEnEdicion(item);
                    toastWarning('⚠️ No se pudo refrescar el stock del servidor, usando datos locales');
                }
            } else {
                setPrestamoItemEnEdicion(item);
            }

            setIndexEnEdicion(index);
            setMostrarModalAlmacenes(true);
        } catch (error) {
            console.error('Error refrescando prestable:', error);
            setPrestamoItemEnEdicion(item);
            setIndexEnEdicion(index);
            setMostrarModalAlmacenes(true);
            toastWarning('⚠️ Usando datos de stock locales');
        }
    };

    const handleGuardarAlmacenes = (almacenesSeleccionados: Array<{ almacenes_prestables_id: number; cantidad: number }>) => {
        if (indexEnEdicion !== null && prestamoItemEnEdicion) {
            const nuevosItems = [...prestablesAgregados];
            const itemActual = nuevosItems[indexEnEdicion];
            const prestableActual = prestables.find(p => p.id === itemActual.prestable_id);

            // Actualizar el item actual con los almacenes seleccionados
            nuevosItems[indexEnEdicion] = {
                ...itemActual,
                almacenes: almacenesSeleccionados,
                almacenes_ids: almacenesSeleccionados.map(a => a.almacenes_prestables_id),
            };

            // Si es CANASTILLA, actualizar automáticamente los EMBASES relacionados
            if (prestableActual?.tipo === 'CANASTILLA') {
                const capacidadCanastilla = prestableActual.capacidad || 0;

                // Encontrar embases automáticos relacionados a esta canastilla
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

                // Actualizar cantidades de embases proporcionalmente
                embasesRelacionados.forEach(({ index }) => {
                    // Calcular cantidad de embases = cantidad canastilla × capacidad
                    const cantidadEmbasesNueva = itemActual.cantidad * capacidadCanastilla;

                    // Los embases usan la misma distribución de almacenes que la canastilla
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

        // Validar que cada prestable tiene almacenes especificados
        for (let i = 0; i < prestablesAgregados.length; i++) {
            const item = prestablesAgregados[i];
            const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
            if (!prestable) continue;

            // Usar almacenes del detalle si existen, sino almacén de cabecera
            const almacenesAUsar = (item.almacenes && item.almacenes.length > 0)
                ? item.almacenes
                : formData.almacenes_prestables_id
                    ? [{ almacenes_prestables_id: formData.almacenes_prestables_id, cantidad: item.cantidad }]
                    : [];

            if (almacenesAUsar.length === 0) {
                const msg = `${prestable.nombre}: Debes especificar almacenes (en cabecera o en el detalle)`;
                setError(msg);
                toastError(msg);
                return;
            }

            // Validar stock en cada almacén
            let cantidadValidadaTotal = 0;
            for (const almacenData of almacenesAUsar) {
                const stock = prestable.stocks?.find(s => Number(s.almacenes_prestables_id) === almacenData.almacenes_prestables_id);
                const cantidadDisponible = stock ? Number(stock.cantidad_disponible || 0) : 0;
                const cantidadSolicitada = almacenData.cantidad;

                if (cantidadSolicitada > cantidadDisponible) {
                    const almacenNombre = almacenes.find(a => a.id === almacenData.almacenes_prestables_id)?.nombre || `Almacén #${almacenData.almacenes_prestables_id}`;
                    const msg = `${prestable.nombre} en ${almacenNombre}: Stock insuficiente. Disponible: ${cantidadDisponible}, solicitado: ${cantidadSolicitada}`;
                    setError(msg);
                    toastError(msg);
                    return;
                }

                cantidadValidadaTotal += cantidadSolicitada;
            }

            if (cantidadValidadaTotal !== item.cantidad) {
                const msg = `${prestable.nombre}: Suma de cantidades en almacenes (${cantidadValidadaTotal}) no coincide con cantidad total (${item.cantidad})`;
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
                almacenes_prestables_id: formData.almacenes_prestables_id,
                chofer_id: formData.chofer_id,
                vehiculo_id: formData.vehiculo_id,
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
                detalles: prestablesAgregados.map(item => {
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

                    return detallePayload;
                }),
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
                            {/* Almacén - Búsqueda */}
                            <DynamicSearchSelect
                                label="🏭 Almacén *"
                                placeholder="Buscar almacén..."
                                selectedItem={almacenSeleccionado}
                                items={almacenesFiltered}
                                isLoading={false}
                                searchValue={almacenesSearch}
                                onSearch={handleSearchAlmacenes}
                                onSelect={handleSelectAlmacen}
                                onClear={() => {
                                    setAlmacenSeleccionado(null);
                                    setAlmacenesSearch('');
                                    setFormData({ ...formData, almacenes_prestables_id: undefined });
                                }}
                                renderItem={(almacen) => (
                                    <div>
                                        <p className="font-medium">{almacen.nombre}</p>
                                        <p className="text-xs text-gray-500">
                                            {almacen.es_proveedor ? 'Almacén Proveedor' : 'Almacén Distribuidora'}
                                        </p>
                                    </div>
                                )}
                                getItemId={(almacen) => almacen.id}
                                getDisplayValue={(almacen) => almacen.nombre}
                            />
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
                            {/* Vehículo - Búsqueda */}
                            <DynamicSearchSelect
                                label="🚗 Vehículo (Opcional)"
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
                                    setFormData({ ...formData, vehiculo_id: undefined });
                                }}
                                renderItem={(vehiculo) => (
                                    <div>
                                        <p className="font-medium">{vehiculo.placa}</p>
                                        {(vehiculo.marca || vehiculo.modelo) && (
                                            <p className="text-xs text-gray-500">{vehiculo.marca} {vehiculo.modelo}</p>
                                        )}
                                    </div>
                                )}
                                getItemId={(vehiculo) => vehiculo.id}
                                getDisplayValue={(vehiculo) => `${vehiculo.placa}${vehiculo.marca ? ` - ${vehiculo.marca} ${vehiculo.modelo}` : ''}`}
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
                            almacenes={almacenes}
                            onSelectItem={handleAgregarCanastilla}
                            onDeleteItem={handleEliminarPrestable}
                            onUpdateCantidad={handleCambiarCantidad}
                            onEditAlmacenes={handleEditAlmacenes}
                            getStockDisponibleTotal={getStockDisponibleTotal}
                            loading={loadingPrestables}
                            almacen_prestable_id={formData.almacenes_prestables_id}
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

            {/* Modal de Almacenes */}
            {prestamoItemEnEdicion && (() => {
                const prestableActual = prestamoItemEnEdicion.prestable;
                const esCanastilla = prestableActual?.tipo === 'CANASTILLA';
                const capacidadCanastilla = prestableActual?.capacidad || 0;

                // Buscar embases relacionados si es canastilla
                let embaseRelacionado = null;
                let embaseStockDisponible = [];

                if (esCanastilla) {
                    embaseRelacionado = prestables.find(p =>
                        p.tipo === 'EMBASES' &&
                        (p as any).prestable_relacionado_id === prestableActual?.id
                    );

                    if (embaseRelacionado) {
                        embaseStockDisponible = embaseRelacionado.stocks?.map(s => ({
                            almacenes_prestables_id: s.almacenes_prestables_id,
                            cantidad_disponible: s.cantidad_disponible,
                        })) || [];
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
                        onSave={(almacenesCanastilla, almacenesEmbase) => {
                            if (indexEnEdicion !== null) {
                                const nuevosItems = [...prestablesAgregados];

                                // Actualizar canastilla
                                nuevosItems[indexEnEdicion] = {
                                    ...nuevosItems[indexEnEdicion],
                                    almacenes: almacenesCanastilla,
                                    almacenes_ids: almacenesCanastilla.map(a => a.almacenes_prestables_id),
                                };

                                // Actualizar embase relacionado si existe
                                if (esCanastilla && almacenesEmbase && embaseRelacionado) {
                                    const embaseIndex = nuevosItems.findIndex(
                                        item => item.prestable_id === embaseRelacionado?.id &&
                                                 item.isAutomaticEmbase === true
                                    );

                                    if (embaseIndex !== -1) {
                                        const cantidadEmbase = prestamoItemEnEdicion.cantidad * capacidadCanastilla;
                                        nuevosItems[embaseIndex] = {
                                            ...nuevosItems[embaseIndex],
                                            cantidad: cantidadEmbase,
                                            almacenes: almacenesEmbase,
                                            almacenes_ids: almacenesEmbase.map(a => a.almacenes_prestables_id),
                                        };
                                    }
                                }

                                setPrestablesAgregados(nuevosItems);
                            }
                            setMostrarModalAlmacenes(false);
                            setPrestamoItemEnEdicion(null);
                            setIndexEnEdicion(null);
                        }}
                        prestableNombre={prestamoItemEnEdicion.prestable?.nombre || 'Prestable'}
                        cantidadTotal={prestamoItemEnEdicion.cantidad}
                        almacenes={almacenes}
                        stockDisponible={
                            prestamoItemEnEdicion.prestable?.stocks?.map(s => ({
                                almacenes_prestables_id: s.almacenes_prestables_id,
                                cantidad_disponible: s.cantidad_disponible,
                            })) || []
                        }
                        almacenesActuales={prestamoItemEnEdicion.almacenes || []}
                        esCanastilla={esCanastilla}
                        capacidadCanastilla={capacidadCanastilla}
                        embaseNombre={embaseRelacionado?.nombre || ''}
                        embaseStockDisponible={embaseStockDisponible}
                    />
                );
            })()}

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

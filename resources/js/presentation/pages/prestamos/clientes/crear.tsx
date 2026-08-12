import type { Prestable } from '@/domain/entities/prestamos';
import prestamoClienteService from '@/infrastructure/services/prestamo-cliente.service';
import AppLayout from '@/layouts/app-layout';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import PrestablesSelectionTable from '@/presentation/components/form-sections/PrestablesSelectionTable';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import ModalAlmacenesDetalle from '@/presentation/components/modales/ModalAlmacenesDetalle';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import { useToast } from '@/presentation/hooks/useToast';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { UbicacionMapModal } from './components/UbicacionMapModal';
import { type BreadcrumbItem } from '@/types';

/**
 * ============================================
 * 📍 REFERENCIA: DATOS DISPONIBLES AL SELECCIONAR VENTA
 * ============================================
 *
 * ENDPOINT: GET /api/ventas/{id}
 * CONTROLADOR: VentaController::show (línea 789)
 *
 * DATOS DEL CLIENTE (ventaData.cliente):
 *   - id: number
 *   - nombre: string
 *   - nit: string
 *   - telefono: string
 *   - foto_perfil: string | null
 *   - razon_social: string
 *
 * DATOS DE DIRECCIÓN (ventaData.direccionCliente):
 *   - id: number
 *   - direccion: string (texto de dirección)
 *   - localidad: object { id, nombre } o string (nombre)
 *   - observaciones: string
 *   - latitud: number
 *   - longitud: number
 *   - es_principal: boolean
 *
 * DATOS DE VENTA (ventaData):
 *   - id: number
 *   - numero: string (folio)
 *   - fecha: date
 *   - cliente_id: number
 *   - direccion_cliente_id: number
 *   - total: decimal
 *   - detalles: array (productos en la venta)
 *
 * ============================================
 */

interface Props {
    clientes: Array<{ id: number; nombre: string; razon_social?: string; telefono?: string | null }>;
    choferes: Array<{ id: number; nombre: string }>;
    almacenes: Array<{ id: number; nombre: string; es_proveedor?: boolean }>;
    vehiculos: Array<{ id: number; placa: string; marca?: string; modelo?: string }>;
    ventas: Array<{ id: number; numero: string; cliente_id: number; cliente?: { id: number; nombre: string; razon_social?: string } }>;
    prestables: Prestable[]; // ✅ Nuevo: prestables vienen del servidor
    localidades: Array<{ id: number; nombre: string }>; // ✅ Nuevo: localidades para ubicación
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Préstamos', href: '/prestamos/eventos' },
    { title: 'Crear Préstamo a Cliente', href: '/prestamos/clientes/crear' },
];

export default function CrearPrestamoCliente({ clientes, choferes, almacenes, vehiculos, ventas, prestables, localidades }: Props) {
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
        direccion_cliente_id: undefined as number | undefined,
        tipo_prestamo: 'canastillas_embases' as 'canastillas' | 'embases' | 'canastillas_embases',
        es_venta: false,
        venta_id: undefined as number | undefined,
        es_evento: false,
        fecha_prestamo: new Date().toISOString().split('T')[0],
        fecha_esperada_devolucion: getDateAdd7Days(),
        monto_garantia: 0,
        // ✅ Nuevo: Ubicación del préstamo
        ubicacion: {
            localidad_id: undefined as number | undefined,
            direccion: '',
            observaciones: undefined as string | undefined,
            es_ubicacion_manual: false,
            latitud: undefined as number | undefined,
            longitud: undefined as number | undefined,
        },
    });

    // Lista de prestables agregados
    const [prestablesAgregados, setPrestablesAgregados] = useState<PrestamoItem[]>([]);

    // ✅ NUEVO: Mapas de con_liquido y sin_liquido desde PrestablesSelectionTable
    const [conLiquidoMap, setConLiquidoMap] = useState<Record<string, number>>({});
    const [sinLiquidoMap, setSinLiquidoMap] = useState<Record<string, number>>({});

    // Estados para búsquedas dinámicas
    const [ventasSearch, setVentasSearch] = useState('');
    const [ventasResults, setVentasResults] = useState<any[]>([]);
    const [ventasLoading, setVentasLoading] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<any>(null);

    // ✅ NUEVO: Rastrear canastillas usadas en la venta para ajustar disponibilidad
    const [canastillasUsadasEnVenta, setCanastillasUsadasEnVenta] = useState<Map<number, number>>(new Map());

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

    // ✅ Nuevo: Estados para modal de ubicación en mapa
    const [mostrarModalUbicacion, setMostrarModalUbicacion] = useState(false);
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<
        | {
              localidad_id?: number;
              direccion?: string;
              observaciones?: string | null;
              latitud?: number;
              longitud?: number;
              direccion_cliente_id?: number;
              es_ubicacion_manual?: boolean;
          }
        | null
    >(null);

    // ✅ NUEVO (2026-07-16): Estados para seleccionar dirección alternativa del cliente
    const [mostrarSelectorDirecciones, setMostrarSelectorDirecciones] = useState(false);
    const [direccionesClienteDisponibles, setDireccionesClienteDisponibles] = useState<any[]>([]);

    // ✅ Nuevo: Preselectionar primer almacén no proveedor al cargar
    useEffect(() => {
        const almacenNoProveedor = almacenes.find((a) => !a.es_proveedor);
        if (almacenNoProveedor) {
            setAlmacenSeleccionado(almacenNoProveedor);
            setFormData((prev) => ({
                ...prev,
                almacenes_prestables_id: almacenNoProveedor.id,
            }));
        }
    }, [almacenes]);

    // ✅ NUEVO (2026-07-16): Leer query params y usar handleSelectVenta para cargar datos
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ventaId = params.get('venta_id');

        if (ventaId) {
            (async () => {
                try {
                    console.log('✅ Detectado venta_id en URL, cargando detalles desde venta...');

                    // Fetch de la venta completa
                    const response = await fetch(`/api/ventas/${ventaId}`, {
                        headers: { Accept: 'application/json' },
                    });
                    const data = await response.json();
                    const ventaData = data.data || data;

                    // Crear objeto venta compatible con handleSelectVenta
                    const venta = {
                        id: ventaData.id,
                        numero: ventaData.numero,
                    };

                    // Usar la función existente handleSelectVenta para cargar todo correctamente
                    await handleSelectVenta(venta);

                    toastSuccess('✅ Venta cargada desde URL automáticamente');
                } catch (error) {
                    console.error('⚠️ Error al cargar venta desde URL:', error);
                }
            })();
        }
    }, []); // Solo ejecutar una vez al montar

    // ✅ DEBUG: Monitorear cambios en formData.ubicacion
    useEffect(() => {
        console.log('%c🔍 CAMBIO EN formData.ubicacion', 'color: #e91e63; font-weight: bold; font-size: 13px', {
            ubicacion_actual: formData.ubicacion,
            ubicacionSeleccionada_actual: ubicacionSeleccionada,
            stack: new Error().stack?.split('\n').slice(0, 3).join('\n'),
        });
    }, [formData.ubicacion]);

    // ✅ Nuevo: Sincronizar automáticamente formData.ubicacion con ubicacionSeleccionada
    useEffect(() => {
        if (ubicacionSeleccionada && (ubicacionSeleccionada.localidad_id || ubicacionSeleccionada.direccion || ubicacionSeleccionada.latitud)) {
            console.log('%c🔗 AUTO-SINCRONIZANDO: ubicacionSeleccionada → formData.ubicacion', 'color: #4caf50; font-weight: bold; font-size: 12px', {
                ubicacionSeleccionada,
            });
            setFormData((prev) => ({
                ...prev,
                ubicacion: {
                    localidad_id: ubicacionSeleccionada.localidad_id,
                    direccion: ubicacionSeleccionada.observaciones || '',
                    observaciones: ubicacionSeleccionada.observaciones,
                    es_ubicacion_manual: ubicacionSeleccionada.es_ubicacion_manual ?? false,
                    direccion_cliente_id: ubicacionSeleccionada.direccion_cliente_id,
                    latitud: ubicacionSeleccionada.latitud,
                    longitud: ubicacionSeleccionada.longitud,
                },
            }));
        }
    }, [ubicacionSeleccionada]);

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
        return (prestable.stocks || []).reduce((sum, stock) => sum + Number(stock.cantidad_disponible || 0), 0);
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
                headers: { Accept: 'application/json' },
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
                headers: { Accept: 'application/json' },
            });
            const data = await response.json();
            const ventaData = data.data || data;

            /* console.log('📋 DETALLE DE VENTA SELECCIONADA - Respuesta del backend:', {
                respuesta_completa: data,
                venta_data: ventaData,
                detalles: ventaData.detalles,
                estructura_primer_detalle: ventaData.detalles?.[0],
                producto_primer_detalle: ventaData.detalles?.[0]?.producto,
                prestables_en_producto: ventaData.detalles?.[0]?.producto?.prestables,
            }); */

            // ✅ Nuevo: Log detallado del cliente y su información
            console.log('%c============================================', 'color: #0066cc; font-weight: bold');
            console.log('%c📍 ENDPOINT: GET /api/ventas/{id}', 'color: #00aa00; font-weight: bold; font-size: 14px');
            console.log('%c============================================', 'color: #0066cc; font-weight: bold');
            /* console.log('%c👥 DATOS DEL CLIENTE', 'color: #0066cc; font-weight: bold; font-size: 12px', {
                id: ventaData.cliente?.id,
                nombre: ventaData.cliente?.nombre,
                nit: ventaData.cliente?.nit,
                telefono: ventaData.cliente?.telefono,
                foto_perfil: ventaData.cliente?.foto_perfil,
                razon_social: ventaData.cliente?.razon_social,
            }); */
            console.log('%c📍 DIRECCIÓN DEL CLIENTE', 'color: #0066cc; font-weight: bold; font-size: 12px', {
                id: ventaData.direccion_cliente?.id,
                direccion: ventaData.direccion_cliente?.direccion,
                localidad: ventaData.direccion_cliente?.localidad,
                observaciones: ventaData.direccion_cliente?.observaciones,
                latitud: ventaData.direccion_cliente?.latitud,
                longitud: ventaData.direccion_cliente?.longitud,
                es_principal: ventaData.direccion_cliente?.es_principal,
            });
            /* console.log('%c🛒 DATOS DE LA VENTA', 'color: #0066cc; font-weight: bold; font-size: 12px', {
                venta_id: ventaData.id,
                numero: ventaData.numero,
                fecha: ventaData.fecha,
                cliente_id: ventaData.cliente_id,
                direccion_cliente_id: ventaData.direccion_cliente_id,
                total: ventaData.total,
            }); */

            const clienteId = ventaData.cliente_id;
            const telefonoVenta = (ventaData?.cliente?.telefono || '').trim();
            const telefonoCliente = telefonoVenta || obtenerTelefonoCliente(clienteId);
            const direccion = ventaData.direccion_cliente;

            console.log('📍 DIRECCIÓN CAPTURADA:', {
                direccion_cliente_id: ventaData.direccion_cliente_id,
                direccionCliente: direccion,
                localidad: direccion?.localidad,
                latitud: direccion?.latitud,
                longitud: direccion?.longitud,
            });

            // ✅ NUEVO (2026-07-16): Si venta no tiene dirección, usar dirección principal del cliente
            let direccionACargar = ventaData.direccion_cliente;

            if (!direccionACargar && ventaData.cliente?.direcciones && Array.isArray(ventaData.cliente.direcciones)) {
                // Buscar dirección principal del cliente
                const direccionPrincipal = ventaData.cliente.direcciones.find((d: any) => d.es_principal);
                if (direccionPrincipal) {
                    direccionACargar = direccionPrincipal;
                    console.log('✅ Usando dirección principal del cliente (venta sin dirección asignada):', direccionPrincipal);
                    // mostrar direccion selector modal
                    console.log('📍 modal direccion', direccionPrincipal.direccion);
                    // mostrar observaciones modal
                    console.log('📍 modal observaciones', direccionPrincipal.observaciones);
                }
            }

            // ✅ Nuevo: Si el cliente tiene dirección registrada, cargar en el mapa
            if (direccionACargar) {
                const dirCliente = direccionACargar;

                // Extraer ID de localidad (puede venir de localidad_id o como objeto)
                let localidadId = null;
                if (dirCliente.localidad_id) {
                    localidadId = dirCliente.localidad_id;
                } else if (dirCliente.localidad?.id) {
                    localidadId = dirCliente.localidad.id;
                } else if (dirCliente.localidad && typeof dirCliente.localidad === 'object') {
                    localidadId = dirCliente.localidad.id;
                }

                if (localidadId) {
                    const direccionTexto = dirCliente.observaciones || '';
                    const latitud = dirCliente.latitud;
                    const longitud = dirCliente.longitud;
                    const direccionClienteId = dirCliente.id;
                    const observaciones = dirCliente.observaciones;

                    console.log('📍 veririficando direccion:', direccionTexto);

                    setUbicacionSeleccionada({
                        localidad_id: localidadId,
                        direccion: direccionTexto,
                        latitud,
                        longitud,
                        direccion_cliente_id: direccionClienteId,
                        observaciones,
                    });

                    setFormData((prev) => {
                        const nuevoFormData = {
                            ...prev,
                            ubicacion: {
                                localidad_id: localidadId,
                                direccion: direccionTexto,
                                es_ubicacion_manual: false,
                                direccion_cliente_id: direccionClienteId,
                                observaciones,
                                latitud,
                                longitud,
                            },
                        };
                        console.log('%c📋 handleSelectVenta - Actualizando formData.ubicacion', 'color: #9c27b0; font-weight: bold; font-size: 12px', {
                            ubicacion_anterior: prev.ubicacion,
                            ubicacion_nueva: nuevoFormData.ubicacion,
                            localidadId,
                            direccionTexto,
                            direccionClienteId,
                            observaciones,
                            latitud,
                            longitud,
                        });
                        return nuevoFormData;
                    });

                    console.log('✅ Ubicación del cliente cargada automáticamente:', {
                        localidad_id: localidadId,
                        direccion: direccionTexto,
                        latitud,
                        longitud,
                        direccion_cliente_id: direccionClienteId,
                        observaciones,
                    });

                    toastSuccess('✓ Ubicación del cliente cargada automáticamente');
                }
            }

            // ✅ NUEVO: Cargar prestables desde productos de la venta
            const nuevosPrestables: PrestamoItem[] = [];
            if (ventaData.detalles && Array.isArray(ventaData.detalles)) {
                console.log('%c🛒 PROCESANDO DETALLES DE VENTA', 'color: #ff6b6b; font-weight: bold; font-size: 12px', {
                    total_detalles: ventaData.detalles.length,
                    detalles: ventaData.detalles.map((d: any) => ({
                        id: d.id,
                        cantidad: d.cantidad,
                        producto_nombre: d.producto?.nombre,
                        prestables_count: d.producto?.prestables?.length || 0,
                    })),
                });

                ventaData.detalles.forEach((detalle: any, index: number) => {
                    const producto = detalle.producto;
                    const cantidad = detalle.cantidad || 0;

                    console.log(`%c📋 DETALLE ${index + 1}/${ventaData.detalles.length}`, 'color: #4ecdc4; font-weight: bold; font-size: 11px', {
                        producto_nombre: producto?.nombre,
                        cantidad,
                        prestables_disponibles: producto?.prestables?.map((p: any) => ({
                            prestable_id: p.prestable_id,
                            tipo_en_maestro: prestables.find((pr) => pr.id === p.prestable_id)?.tipo,
                        })),
                    });

                    // ✅ Validar que el producto tenga prestables relacionados
                    if (producto && producto.prestables && Array.isArray(producto.prestables) && producto.prestables.length > 0 && cantidad > 0) {
                        console.log('%c🔍 BUSCANDO CANASTILLA EN PRODUCTO', 'color: #ff9ff3; font-weight: bold; font-size: 11px', {
                            prestables_array: producto.prestables,
                        });

                        // 1️⃣ Buscar CANASTILLA en el array de prestables del producto (DIRECTAMENTE DEL BACKEND)
                        const prestableCanastilla = producto.prestables.find((p: any) => {
                            console.log(`   Verificando: ${p.nombre} (tipo: ${p.tipo})`);
                            return p.tipo === 'CANASTILLA';
                        });

                        if (prestableCanastilla) {
                            const canastillaId = Number(prestableCanastilla.id || prestableCanastilla.prestable_id);
                            const capacidadCanastilla = prestableCanastilla.capacidad || 0;

                            console.log('%c✅ CANASTILLA ENCONTRADA EN PRODUCTO', 'color: #00b894; font-weight: bold; font-size: 11px', {
                                canastilla_id: canastillaId,
                                canastilla_nombre: prestableCanastilla.nombre,
                                cantidad_canastillas: cantidad,
                                capacidad: capacidadCanastilla,
                                cantidad_embases_calculada: cantidad * capacidadCanastilla,
                            });

                            // ✅ Agregar CANASTILLA
                            nuevosPrestables.push({
                                prestable_id: canastillaId,
                                cantidad: cantidad,
                                almacenes_ids: [],
                                prestable: prestableCanastilla,
                            });

                            // ✅ Buscar EMBASES en el array de prestables del producto
                            const embasesEnProducto = producto.prestables.filter((p: any) => p.tipo === 'EMBASES');

                            console.log('%c🥫 EMBASES EN PRODUCTO', 'color: #fdcb6e; font-weight: bold; font-size: 11px', {
                                total_embases: embasesEnProducto.length,
                                embases: embasesEnProducto.map((e: any) => ({
                                    id: e.id || e.prestable_id,
                                    nombre: e.nombre,
                                    cantidad_a_prestar: cantidad * capacidadCanastilla,
                                })),
                            });

                            // ✅ Agregar cada EMBASE encontrado
                            embasesEnProducto.forEach((embase: any) => {
                                const embaseId = Number(embase.id || embase.prestable_id);
                                const cantidadEmbases = cantidad * capacidadCanastilla;
                                nuevosPrestables.push({
                                    prestable_id: embaseId,
                                    cantidad: cantidadEmbases,
                                    almacenes_ids: [],
                                    prestable: embase,
                                    isAutomaticEmbase: true,
                                });

                                console.log(`   ✅ Agregado EMBASE: ${embase.nombre} (ID: ${embaseId}) x ${cantidadEmbases}`);
                            });
                        } else {
                            console.warn('⚠️ No se encontró CANASTILLA en el producto:', {
                                producto_nombre: producto.nombre,
                                prestables_en_producto: producto.prestables.map((p: any) => ({
                                    id: p.prestable_id,
                                    nombre: p.nombre,
                                    tipo: p.tipo,
                                })),
                            });
                        }
                    }
                });
            }

            // ✅ NUEVO: Calcular canastillas usadas en la venta por prestable
            const canastillasUsadas = new Map<number, number>();
            ventaData.detalles?.forEach((detalle: any) => {
                const cantidad = detalle.cantidad || 0;
                detalle.producto?.prestables?.forEach((p: any) => {
                    if (p.tipo === 'CANASTILLA') {
                        const prestableId = Number(p.id || p.prestable_id);
                        canastillasUsadas.set(prestableId, (canastillasUsadas.get(prestableId) || 0) + cantidad);
                    }
                });
            });

            console.log('📦 Canastillas usadas en esta venta:', {
                venta_numero: ventaData.numero,
                canastillasUsadas: Array.from(canastillasUsadas.entries()),
            });

            // ✅ CRÍTICO (2026-07-16): Actualizar ventaSeleccionada con datos completos del API
            setVentaSeleccionada(ventaData);
            setCanastillasUsadasEnVenta(canastillasUsadas);

            setFormData({
                ...formData,
                venta_id: venta.id,
                cliente_id: clienteId,
                telefono_cliente_1: telefonoCliente,
                direccion_cliente_id: ventaData.direccion_cliente_id,
            });
            setClienteSeleccionado(clientes.find((c) => c.id === clienteId));
            setDireccionSeleccionada(direccion);

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
                clientes.filter(
                    (c) => c.nombre.toLowerCase().includes(query.toLowerCase()) || c.razon_social?.toLowerCase().includes(query.toLowerCase()),
                ),
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
            setAlmacenesFiltered(almacenes.filter((a) => a.nombre.toLowerCase().includes(query.toLowerCase())));
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
                vehiculos.filter(
                    (v) =>
                        v.placa.toLowerCase().includes(query.toLowerCase()) ||
                        v.marca?.toLowerCase().includes(query.toLowerCase()) ||
                        v.modelo?.toLowerCase().includes(query.toLowerCase()),
                ),
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

    // ✅ Nuevo: Manejar ubicación seleccionada del mapa
    const handleUbicacionSeleccionada = (ubicacion: {
        latitud: number;
        longitud: number;
        localidad_id?: number;
        direccion?: string;
        es_ubicacion_manual?: boolean;
    }) => {
        console.log('%c📍 UBICACIÓN SELECCIONADA EN MAPA', 'color: #00ff00; font-weight: bold; font-size: 12px', {
            latitud: ubicacion.latitud,
            longitud: ubicacion.longitud,
            localidad_id: ubicacion.localidad_id,
            direccion: ubicacion.direccion,
            es_ubicacion_manual: ubicacion.es_ubicacion_manual,
        });

        setUbicacionSeleccionada({
            localidad_id: ubicacion.localidad_id,
            direccion: ubicacion.direccion,
            latitud: ubicacion.latitud,
            longitud: ubicacion.longitud,
            es_ubicacion_manual: ubicacion.es_ubicacion_manual,
            observaciones: ubicacion.observaciones, // ✅ Incluir observaciones del modal
        });

        setFormData({
            ...formData,
            ubicacion: {
                localidad_id: ubicacion.localidad_id,
                direccion: ubicacion.direccion || '',
                es_ubicacion_manual: ubicacion.es_ubicacion_manual || false,
                latitud: ubicacion.latitud,
                longitud: ubicacion.longitud,
                observaciones: ubicacion.observaciones, // ✅ Incluir observaciones del modal
            },
        });

        toastSuccess('✓ Ubicación seleccionada correctamente');
    };

    const handleEliminarPrestable = (prestable_id: number) => {
        // Si es una canastilla, eliminar también sus embases relacionados
        const prestable = prestables.find((p) => Number(p.id) === prestable_id);
        if (prestable?.tipo === 'CANASTILLA') {
            const embasesRelacionados = prestables.filter((p) => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === prestable_id);
            const idsAEliminar = [prestable_id, ...embasesRelacionados.map((e) => e.id)];
            setPrestablesAgregados(prestablesAgregados.filter((p) => !idsAEliminar.includes(p.prestable_id)));
        } else {
            setPrestablesAgregados(prestablesAgregados.filter((p) => p.prestable_id !== prestable_id));
        }
    };

    const handleCambiarCantidad = (itemIndex: number, nueva_cantidad: number) => {
        const itemActualizado = prestablesAgregados[itemIndex];
        if (!itemActualizado) return;

        const prestable = prestables.find((p) => Number(p.id) === itemActualizado.prestable_id);

        setPrestablesAgregados(
            prestablesAgregados.map((item, idx) => {
                // Actualizar solo el item específico por índice
                if (idx === itemIndex) {
                    return { ...item, cantidad: nueva_cantidad };
                }

                // Si el item actualizado es canastilla, actualizar SOLO embases automáticos relacionados
                if (
                    prestable?.tipo === 'CANASTILLA' &&
                    item.isAutomaticEmbase === true && // ✅ SOLO embases automáticos
                    (item.prestable as any)?.prestable_relacionado_id === prestable?.id
                ) {
                    const cantidadEmbasesAutomatica = nueva_cantidad * (prestable.capacidad || 0);
                    return { ...item, cantidad: cantidadEmbasesAutomatica };
                }

                return item;
            }),
        );
    };

    const handleEditAlmacenes = async (item: PrestamoItem, index: number) => {
        try {
            // Refrescar datos del prestable desde el API para obtener stock actual
            if (item.prestable_id) {
                const response = await fetch(`/api/prestables/${item.prestable_id}`, {
                    headers: { Accept: 'application/json' },
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
                (p) => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === Number(prestable.id) && getStockDisponibleTotal(p) > 0,
            );

            embasesRelacionados.forEach((embase) => {
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
        console.log(
            '   Items nuevos:',
            nuevosItems.map((i) => ({
                id: i.prestable_id,
                nombre: i.prestable?.nombre,
                tipo: i.prestable?.tipo,
                isAutomaticEmbase: i.isAutomaticEmbase,
                almacenes_ids: i.almacenes_ids, // ✅ Mostrar almacenes vacíos
            })),
        );
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
            const prestable = prestables.find((p) => Number(p.id) === item.prestable_id);
            if (!prestable) continue;

            // Usar almacenes del detalle si existen, sino almacén de cabecera
            const almacenesAUsar =
                item.almacenes && item.almacenes.length > 0
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
                const stock = prestable.stocks?.find((s) => Number(s.almacenes_prestables_id) === almacenData.almacenes_prestables_id);
                const cantidadDisponible = stock ? Number(stock.cantidad_disponible || 0) : 0;
                const cantidadSolicitada = almacenData.cantidad;

                if (cantidadSolicitada > cantidadDisponible) {
                    const almacenNombre =
                        almacenes.find((a) => a.id === almacenData.almacenes_prestables_id)?.nombre ||
                        `Almacén #${almacenData.almacenes_prestables_id}`;
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
            const payload: any = {
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
                detalles: prestablesAgregados.map((item) => {
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

                    // ✅ NUEVO: Agregar con_liquido y sin_liquido
                    const prestable = prestables.find(p => Number(p.id) === item.prestable_id);
                    if (prestable) {
                        const conLiqKey = prestable.tipo === 'EMBASES' && prestable.prestable_relacionado_id
                            ? `${prestable.prestable_relacionado_id}-embase-con`
                            : `${item.prestable_id}-con`;
                        const sinLiqKey = prestable.tipo === 'EMBASES' && prestable.prestable_relacionado_id
                            ? `${prestable.prestable_relacionado_id}-embase-sin`
                            : `${item.prestable_id}-sin`;

                        detallePayload.con_liquido = conLiquidoMap[conLiqKey] ?? 0;
                        detallePayload.sin_liquido = sinLiquidoMap[sinLiqKey] ?? 0;
                    }

                    return detallePayload;
                }),
            };

            // ✅ Agregar ubicación si está seleccionada
            console.log('%c📍 DEBUG: formData.ubicacion ANTES de verificar', 'color: #ff1744; font-weight: bold; font-size: 12px', formData.ubicacion);
            console.log('%c📍 DEBUG: ubicacionSeleccionada ANTES de verificar', 'color: #ff1744; font-weight: bold; font-size: 12px', ubicacionSeleccionada);

            if (formData.ubicacion?.localidad_id || formData.ubicacion?.direccion || formData.ubicacion?.latitud) {
                payload.ubicacion = {
                    localidad_id: formData.ubicacion.localidad_id || undefined,
                    direccion: formData.ubicacion.observaciones || undefined,
                    es_ubicacion_manual: formData.ubicacion.es_ubicacion_manual,
                    direccion_cliente_id: formData.ubicacion.direccion_cliente_id || undefined,
                    observaciones: formData.ubicacion.observaciones || undefined,
                    latitud: formData.ubicacion.latitud || undefined,
                    longitud: formData.ubicacion.longitud || undefined,
                };
                console.log('%c✅ Ubicación AGREGADA al payload', 'color: #4caf50; font-weight: bold; font-size: 12px', payload.ubicacion);
            } else {
                console.log('%c❌ Ubicación NO agregada (localidad_id, direccion y latitud vacías)', 'color: #ff9800; font-weight: bold; font-size: 12px');
            }

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Préstamo a Cliente" />
            <div className="min-h-screen bg-white p-2 dark:bg-gray-950">
                {/* <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">👥 Nuevo Préstamo a Cliente</h1> */}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="rounded-lg border border-red-300 bg-red-100 p-4 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Sección 1: Información del Préstamo */}
                    <div className="border rounded-lg border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
                        <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
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
                                    setDireccionSeleccionada(null);
                                    setFormData({ ...formData, venta_id: undefined, direccion_cliente_id: undefined });
                                }}
                                renderItem={(venta) => (
                                    <div>
                                        <p className="font-medium">#{venta.id}</p>
                                        <p className="text-xs text-gray-500">{venta.cliente?.nombre}</p>
                                    </div>
                                )}
                                getItemId={(venta) => venta.id}
                                getDisplayValue={(venta) => `#${venta.id} - ${venta.cliente?.nombre}`}
                            />
                            {/* Chofer - Pre cargados (sin búsqueda) */}
                            <DynamicSearchSelect
                                label="Chofer Encargado (Opcional)"
                                placeholder="Seleccionar chofer..."
                                selectedItem={choferes.find((ch) => ch.id === formData.chofer_id) || null}
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
                                renderItem={(chofer) => <p className="font-medium">{chofer.nombre}</p>}
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
                                            <p className="text-xs text-gray-500">
                                                {vehiculo.marca} {vehiculo.modelo}
                                            </p>
                                        )}
                                    </div>
                                )}
                                getItemId={(vehiculo) => vehiculo.id}
                                getDisplayValue={(vehiculo) => `${vehiculo.placa}${vehiculo.marca ? ` - ${vehiculo.marca} ${vehiculo.modelo}` : ''}`}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                                        {cliente.razon_social && <p className="text-xs text-gray-500">{cliente.razon_social}</p>}
                                    </div>
                                )}
                                getItemId={(cliente) => cliente.id}
                                getDisplayValue={(cliente) => cliente.nombre}
                            />
                            <div>
                                <label className="block text-xs font-small text-gray-700 dark:text-gray-300">
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
                                    className="w-full text-xs rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ej: 71234567"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-small text-gray-700 dark:text-gray-300">
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
                                    className="w-full text-xs rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="Ej: 76543210"
                                />
                            </div>

                            {/* ✅ Nuevo: Sección de Ubicación en Mapa */}
                            <div className="flex flex-center flex-col gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setMostrarModalUbicacion(true)}
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        📍 Seleccionar en Mapa
                                    </Button>
                                    {ubicacionSeleccionada && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setUbicacionSeleccionada(null);
                                                setFormData({
                                                    ...formData,
                                                    ubicacion: {
                                                        localidad_id: undefined,
                                                        observaciones: undefined,
                                                        direccion: '',
                                                        es_ubicacion_manual: false,
                                                    },
                                                });
                                            }}
                                            className="rounded-lg border border-red-200 px-2 py-1 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950/30"
                                        >
                                            ✗ Limpiar
                                        </Button>
                                    )}
                                </div>

                                {ubicacionSeleccionada && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-1 dark:border-green-800 dark:bg-green-950/30">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                {/* <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                                                    Ubicación Seleccionada
                                                </h3> */}
                                                {ubicacionSeleccionada.localidad_id && (
                                                    <p className="mb-1 text-xs text-green-800 dark:text-green-300">
                                                        📌 Localidad:{' '}
                                                        <span className="font-medium">
                                                            {localidades.find((l) => l.id === ubicacionSeleccionada.localidad_id)?.nombre ||
                                                                'No encontrada'}
                                                        </span>
                                                    </p>
                                                )}
                                                {ubicacionSeleccionada.observaciones && (
                                                    <p className="mb-1 text-xs text-green-800 dark:text-green-300">
                                                        📝 Observaciones: <span className="font-medium">{ubicacionSeleccionada.observaciones}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 md:grid-cols-3 mt-2">
                            <div>
                                <label className="block text-xs font-small text-gray-700 dark:text-gray-300">Garantía Total (Opcional)</label>
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
                                    className="w-full text-xs rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    placeholder="0.00"
                                />
                                {/* <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Escribe la garantía manualmente (Sugerencia: {totalGarantia.toFixed(2)})
                                </p> */}
                            </div>
                            <div>
                                <label className="block text-xs font-small text-gray-700 dark:text-gray-300">Fecha de Préstamo *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.fecha_prestamo}
                                    onChange={(e) => handleFechaPrestamo(e.target.value)}
                                    className="w-full text-xs rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-small text-gray-700 dark:text-gray-300">
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
                                    className="w-full text-xs rounded-lg border border-gray-300 bg-white px-2 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Prestables */}
                    <div className="border rounded-lg border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
                        {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-white">📦 Seleccionar Prestables</h2> */}

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
                            canastillasUsadasEnVenta={canastillasUsadasEnVenta}
                            onConLiquidoMapChange={setConLiquidoMap}
                            onSinLiquidoMapChange={setSinLiquidoMap}
                        />
                    </div>

                    {/* Botones de Acción */}
                    <Card className="border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex justify-end gap-2">
                            <a href="/prestamos/clientes">
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </a>
                            <Button
                                type="submit"
                                disabled={loading || prestablesAgregados.length === 0}
                                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Creando...' : '✅ Crear Préstamo'}
                            </Button>                            
                        </div>
                    </Card>
                </form>
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onClose={removeToast} />

            {/* Modal de Almacenes */}
            {prestamoItemEnEdicion &&
                (() => {
                    const prestableActual = prestamoItemEnEdicion.prestable;
                    const esCanastilla = prestableActual?.tipo === 'CANASTILLA';
                    const capacidadCanastilla = prestableActual?.capacidad || 0;

                    // Buscar embases relacionados si es canastilla
                    let embaseRelacionado = null;
                    let embaseStockDisponible = [];

                    if (esCanastilla) {
                        embaseRelacionado = prestables.find(
                            (p) => p.tipo === 'EMBASES' && (p as any).prestable_relacionado_id === prestableActual?.id,
                        );

                        if (embaseRelacionado) {
                            embaseStockDisponible =
                                embaseRelacionado.stocks?.map((s) => ({
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
                                        almacenes_ids: almacenesCanastilla.map((a) => a.almacenes_prestables_id),
                                    };

                                    // Actualizar embase relacionado si existe
                                    if (esCanastilla && almacenesEmbase && embaseRelacionado) {
                                        const embaseIndex = nuevosItems.findIndex(
                                            (item) => item.prestable_id === embaseRelacionado?.id && item.isAutomaticEmbase === true,
                                        );

                                        if (embaseIndex !== -1) {
                                            const cantidadEmbase = prestamoItemEnEdicion.cantidad * capacidadCanastilla;
                                            nuevosItems[embaseIndex] = {
                                                ...nuevosItems[embaseIndex],
                                                cantidad: cantidadEmbase,
                                                almacenes: almacenesEmbase,
                                                almacenes_ids: almacenesEmbase.map((a) => a.almacenes_prestables_id),
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
                                prestamoItemEnEdicion.prestable?.stocks?.map((s) => ({
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

            {/* ✅ Nuevo: Modal de Ubicación en Mapa */}
            {console.log('%c📍 UBICACION SELECCIONADA EN CREAR.TSX', 'color: #27ae60; font-weight: bold; font-size: 12px', {
                ubicacionSeleccionada,
                'observaciones': ubicacionSeleccionada?.observaciones,
            })}
            <UbicacionMapModal
                isOpen={mostrarModalUbicacion}
                onClose={() => setMostrarModalUbicacion(false)}
                onSelect={handleUbicacionSeleccionada}
                localidades={localidades}
                ubicacionInicial={
                    ubicacionSeleccionada?.latitud && ubicacionSeleccionada?.longitud
                        ? {
                              latitud: ubicacionSeleccionada.latitud,
                              longitud: ubicacionSeleccionada.longitud,
                              localidad_id: ubicacionSeleccionada.localidad_id,
                              direccion: ubicacionSeleccionada.direccion,
                              observaciones: ubicacionSeleccionada.observaciones,
                          }
                        : undefined
                }
                localidadPreseleccionada={ubicacionSeleccionada?.localidad_id}
                mostrarSelectLocalidad={true}
            />

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

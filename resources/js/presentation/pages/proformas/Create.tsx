import { usePrecioRangoCarrito } from '@/application/hooks/use-precio-rango-carrito';
import { useClienteSearch } from '@/infrastructure/hooks/use-api-search';
import AppLayout from '@/layouts/app-layout';
import ProductosTable, { DetalleProducto } from '@/presentation/components/ProductosTable';
import { LoadingOverlay } from '@/presentation/components/ui/LoadingOverlay';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import InputSearch from '@/presentation/components/ui/input-search';
import { Label } from '@/presentation/components/ui/label';
import ModalCrearCliente from '@/presentation/components/ui/modal-crear-cliente';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Separator } from '@/presentation/components/ui/separator';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

// ✅ NUEVOS: Componentes reutilizables Fase 1, 2 y 3
import DetallesEnvioPanel from '@/presentation/components/form-sections/DetallesEnvioPanel';
import DeudaClientePanel from '@/presentation/components/form-sections/DeudaClientePanel';
import RequiereEnvioToggle from '@/presentation/components/form-sections/RequiereEnvioToggle';
import { UbicacionesMultiplesModal } from '@/presentation/pages/logistica/entregas/components/UbicacionesMultiplesModal';

// ✅ NUEVO (2026-07-18): Hook para obtener deuda del cliente
import { useClienteDeuda } from '@/application/hooks/use-cliente-deuda';

// DOMAIN LAYER
import type { Cliente } from '@/domain/entities/clientes';
import type { Producto } from '@/domain/entities/productos';
import type { Id } from '@/domain/entities/shared';

// APPLICATION LAYER
import { useBuscarProductos } from '@/application/hooks/use-buscar-productos';

// Tipos locales
interface ProformaDetalleLocal {
    id: number | string;
    producto?: Producto;
    producto_id: Id;
    producto_nombre: string;
    sku?: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    stock_disponible?: number;
    peso?: number;
    categoria?: string | null;
    limite_venta?: number | null;
    // ✅ NUEVO: Tipo de precio para cálculos de rango y recalcular totales
    tipo_precio_id?: number | string;
    tipo_precio_nombre?: string;
}

interface ProformaData {
    // ✅ Campos básicos
    id: number;
    numero: string;
    estado: string;
    estado_proforma_id?: number;

    // ✅ Cliente
    cliente_id: number;
    cliente_nombre: string;

    // ✅ Fechas
    fecha: string;
    fecha_vencimiento: string;
    fecha_entrega_solicitada?: string;

    // ✅ Horario de entrega
    hora_entrega_solicitada?: string;
    hora_entrega_solicitada_fin?: string;

    // ✅ Montos
    subtotal: number;
    impuesto: number;
    total: number;
    descuento?: number | string;

    // ✅ Entrega
    tipo_entrega?: 'DELIVERY' | 'PICKUP';
    direccion_entrega_solicitada_id?: number | null;
    // ✅ NUEVO (2026-07-18): Dirección completa con coordenadas para mapa
    direccion_entrega_solicitada?: {
        id: number;
        direccion: string;
        observaciones?: string;
        es_principal?: boolean;
        activa?: boolean;
        latitud?: number | null;
        longitud?: number | null;
    } | null;
    direccion_entrega_confirmada_id?: number | null;

    // ✅ Configuración
    canal: string;
    canal_origen?: string;
    politica_pago: string;
    observaciones?: string;

    // ✅ Asignaciones
    preventista_id?: number | null;
    usuario_creador_id?: number;
    usuario_creador?: {
        id: number;
        name: string;
        email: string;
    };

    // ✅ Estado actual
    estado_logistica?: {
        id: number;
        codigo: string;
        nombre: string;
        categoria: string;
        icono: string;
        color: string;
    };
}

interface EstadoProforma {
    id: number;
    codigo: string;
    nombre: string;
    icono?: string;
    color?: string;
}

interface Props {
    clientes: Cliente[];
    productos: Producto[];
    almacenes: Array<{ id: number; nombre: string }>;
    preventistas: any[]; // Usuarios con rol 'preventista'
    almacen_id_empresa?: number; // ✅ NUEVO: ID del almacén principal de la empresa
    modo?: 'crear' | 'editar'; // ✅ NUEVO: Modo de operación
    proforma?: ProformaData; // ✅ NUEVO: Datos de proforma en modo edición
    detallesProforma?: ProformaDetalleLocal[]; // ✅ NUEVO: Detalles precargados
    direccionesCliente?: Array<{ id: number; direccion: string; localidad_id: number }>; // ✅ NUEVO: Direcciones del cliente
    default_tipo_precio_id?: number | string; // ✅ NUEVO: ID del tipo de precio por defecto (VENTA)
    logistica_envios?: boolean; // ✅ CORREGIDO (2026-04-05): Indicador para mostrar/ocultar logística de envíos
    estadosProforma?: EstadoProforma[]; // ✅ NUEVO (2026-07-18): Estados dinámicos de proforma
}

export default function ProformasCreate({
    clientes,
    productos: productosIniciales,
    almacenes,
    preventistas,
    almacen_id_empresa = 1,
    modo = 'crear',
    proforma,
    detallesProforma = [],
    direccionesCliente = [],
    default_tipo_precio_id = 1, // ✅ NUEVO: Tipo precio por defecto (fallback a 1)
    logistica_envios = false, // ✅ CORREGIDO (2026-04-05): Indicador para mostrar/ocultar logística de envíos
    estadosProforma = [], // ✅ NUEVO (2026-07-18): Estados dinámicos de proforma
}: Props) {
    console.log('🚀 ProformasCreate renderizado con props:', {
        clientes,
        productosIniciales,
        almacenes,
        preventistas,
        almacen_id_empresa,
        modo,
        proforma,
        detallesProforma,
        direccionesCliente,
        logistica_envios,
    });
    console.log('🔐 [Create.tsx] Pasando permitirProductosSinStock=true a ProductosTable');

    // ✅ NUEVO: Logs detallados cuando se abre en modo edición
    if (modo === 'editar' && proforma) {
        console.group('📋 INFORMACIÓN DE PROFORMA (Modo Edición)');
        console.log('%c📌 Datos Básicos de Proforma', 'font-weight: bold; color: #2563eb;', {
            id: proforma.id,
            numero: proforma.numero,
            estado: proforma.estado,
            estado_proforma_id: proforma.estado_proforma_id,
            cliente_id: proforma.cliente_id,
            cliente_nombre: proforma.cliente_nombre,
        });
        console.log('%c📅 Fechas', 'font-weight: bold; color: #7c3aed;', {
            fecha: proforma.fecha,
            fecha_vencimiento: proforma.fecha_vencimiento,
            fecha_entrega_solicitada: proforma.fecha_entrega_solicitada,
            hora_entrega_solicitada: proforma.hora_entrega_solicitada,
            hora_entrega_solicitada_fin: proforma.hora_entrega_solicitada_fin,
        });
        console.log('%c💰 Montos', 'font-weight: bold; color: #059669;', {
            subtotal: proforma.subtotal,
            impuesto: proforma.impuesto,
            total: proforma.total,
            descuento: proforma.descuento,
        });
        console.log('%c🚚 Entrega', 'font-weight: bold; color: #d97706;', {
            tipo_entrega: proforma.tipo_entrega,
            direccion_entrega_solicitada_id: proforma.direccion_entrega_solicitada_id,
            direccion_entrega_confirmada_id: proforma.direccion_entrega_confirmada_id,
        });
        console.log('%c⚙️ Configuración', 'font-weight: bold; color: #6b7280;', {
            canal: proforma.canal,
            canal_origen: proforma.canal_origen,
            politica_pago: proforma.politica_pago,
            observaciones: proforma.observaciones,
        });
        console.log('%c👤 Asignaciones', 'font-weight: bold; color: #8b5cf6;', {
            preventista_id: proforma.preventista_id,
            usuario_creador_id: proforma.usuario_creador_id,
            usuario_creador: proforma.usuario_creador,
        });
        console.log('%c📊 Estado Logístico', 'font-weight: bold; color: #0891b2;', proforma.estado_logistica);
        console.groupEnd();

        console.group('📦 DETALLES DE PROFORMA');
        console.log(`%cTotal de productos: ${detallesProforma.length}`, 'font-weight: bold; color: #dc2626;');
        detallesProforma.forEach((detalle, idx) => {
            console.group(`Producto ${idx + 1}: ${detalle.producto_nombre || 'N/A'}`);
            console.log('Datos básicos:', {
                id: detalle.id,
                producto_id: detalle.producto_id,
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio_unitario,
                tipo_precio_id: detalle.tipo_precio_id,
                tipo_precio_nombre: detalle.tipo_precio_nombre,
                subtotal: detalle.subtotal,
            });
            if (detalle.producto) {
                console.log('Producto completo:', detalle.producto);
            }
            if (detalle.es_combo) {
                console.log(`%c🎁 ES COMBO (${detalle.combo_items?.length || 0} items)`, 'font-weight: bold; color: #f59e0b;');
                console.log('Combo items:', detalle.combo_items);
                console.log('Combo items seleccionados:', detalle.combo_items_seleccionados);
            }
            console.groupEnd();
        });
        console.groupEnd();

        console.group('📍 DIRECCIONES DEL CLIENTE');
        console.log(`%cTotal de direcciones: ${direccionesCliente.length}`, 'font-weight: bold; color: #2563eb;');
        direccionesCliente.forEach((dir, idx) => {
            console.log(`Dirección ${idx + 1}:`, dir);
        });
        console.groupEnd();

        console.group('🏭 CONFIGURACIÓN DE ALMACÉN');
        console.log('%cAlmacenes disponibles', 'font-weight: bold;', almacenes);
        console.log('%cAlmacén de empresa', 'font-weight: bold;', almacen_id_empresa);
        console.log('%cTipo precio por defecto', 'font-weight: bold;', default_tipo_precio_id);
        console.groupEnd();

        console.log('%c👥 Preventistas disponibles', 'font-weight: bold; color: #7c3aed;', preventistas);
        console.log('%c🚚 Logística de envíos habilitada:', 'font-weight: bold; color: #d97706;', logistica_envios);
    }

    // ✅ NUEVO: Validaciones defensivas con useMemo para evitar renderizados múltiples
    const clientesSeguro = useMemo(() => clientes || [], [clientes]);
    const productosSeguro = useMemo(() => productosIniciales || [], [productosIniciales]);
    const almacenesSeguro = useMemo(() => almacenes || [], [almacenes]);
    const preventistasSeguro = useMemo(() => preventistas || [], [preventistas]);
    const almacenIdSeguro = useMemo(() => almacen_id_empresa || 1, [almacen_id_empresa]);

    // Estados principales
    const [detalles, setDetalles] = useState<ProformaDetalleLocal[]>([]);
    const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para cliente con búsqueda mejorada
    const [clienteValue, setClienteValue] = useState<string | number | null>(null);
    const [clienteDisplay, setClienteDisplay] = useState<string>('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [clienteSearchQuery, setClienteSearchQuery] = useState('');

    // ✅ NUEVO (2026-07-18): Hook para obtener deuda del cliente
    const { clienteDeuda, loading: loadingDeuda, obtenerClienteDeuda, limpiar: limpiarDeuda } = useClienteDeuda();

    // Fechas
    const hoy = new Date();
    const [fecha, setFecha] = useState(
        `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`,
    );

    const vencimiento = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    const [fechaVencimiento, setFechaVencimiento] = useState(
        `${vencimiento.getFullYear()}-${String(vencimiento.getMonth() + 1).padStart(2, '0')}-${String(vencimiento.getDate()).padStart(2, '0')}`,
    );

    // Otros campos
    const [canal, setCanal] = useState<'PRESENCIAL' | 'ONLINE' | 'TELEFONO'>('PRESENCIAL');
    const [requiereEnvio, setRequiereEnvio] = useState(false);

    // ✅ NUEVO (2026-07-18): Estado inicial (ID del estado de proforma) y preventista
    const [estadoInicial, setEstadoInicial] = useState<number>(() => {
        // Inicializar con BORRADOR si no hay proforma, sino con el estado de la proforma
        if (modo === 'editar' && proforma?.estado_proforma_id) {
            return proforma.estado_proforma_id;
        }
        return estadosProforma.find((e) => e.codigo === 'BORRADOR')?.id || 1;
    });
    const [preventistaId, setPreventistaId] = useState<number | null>(null);
    const [fechaEntregaSolicitada, setFechaEntregaSolicitada] = useState('');
    const [tipoEntrega, setTipoEntrega] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
    const [observaciones, setObservaciones] = useState('');
    // ✅ CORREGIDO (2026-07-18): Agregar 'CREDITO' como opción de política de pago
    const [politicaPago, setPoliticaPago] = useState<'CONTRA_ENTREGA' | 'ANTICIPADO_100' | 'CREDITO'>('CONTRA_ENTREGA');

    // ✅ NUEVOS (2026-04-06): Horarios de entrega
    const [turnoEntrega, setTurnoEntrega] = useState<'manana' | 'tarde' | ''>('');
    const [horaEntregaSolicitada, setHoraEntregaSolicitada] = useState('');
    const [horaEntregaSolicitadaFin, setHoraEntregaSolicitadaFin] = useState('');

    // ✅ CORREGIDO (2026-07-18): Usar direcciones del cliente - priorizar clienteSeleccionado, luego direccionesCliente (props)
    // Priorizar direcciones que vienen en clienteSeleccionado, sino usar las que vienen en props
    const direccionesDisponibles = useMemo(() => {
        if (clienteSeleccionado?.direcciones && Array.isArray(clienteSeleccionado.direcciones)) {
            return clienteSeleccionado.direcciones.filter((d: any) => d.activa !== false);
        }
        // ✅ FALLBACK: Usar direccionesCliente si vienen en las props (especialmente útil en modo edición)
        if (direccionesCliente && Array.isArray(direccionesCliente)) {
            return direccionesCliente.filter((d: any) => d.activa !== false);
        }
        return [];
    }, [clienteSeleccionado?.direcciones, direccionesCliente]);

    const cargandoDirecciones = false; // No necesita cargar si vienen en el cliente

    const [direccionEntregaId, setDireccionEntregaId] = useState<number | null>(null);

    // ✅ NUEVO (2026-07-18): Estado para mostrar modal de ubicación/mapa
    const [mostrarMapaDireccion, setMostrarMapaDireccion] = useState(false);

    // ✅ NUEVO: Auto-seleccionar dirección si solo hay una (sin bucle infinito)
    useEffect(() => {
        if (direccionesDisponibles.length === 1 && !direccionEntregaId) {
            setDireccionEntregaId(direccionesDisponibles[0].id);
        }
    }, [direccionesDisponibles.length]);

    // ✅ NUEVO: Función para transformar detalles del backend al formato que ProductosTable espera
    const transformarDetalles = (detalles: any[]) => {
        return detalles.map((d) => ({
            id: d.id,
            producto: d.producto, // ✅ Ya viene con la estructura correcta del backend (incluye precios array)
            producto_id: d.producto_id,
            producto_nombre: d.producto_nombre || d.producto?.nombre || '',
            sku: d.sku || d.producto?.sku || '',
            cantidad: parseFloat(d.cantidad),
            precio_unitario: parseFloat(d.precio_unitario),
            tipo_precio_id: d.tipo_precio_id, // ✅ ProductosTable lo usará para inicializar select + calcularCarrito
            tipo_precio_nombre: d.tipo_precio_nombre, // ✅ Nombre del tipo de precio para auditoría
            subtotal: d.subtotal ? parseFloat(d.subtotal) : parseFloat(d.cantidad) * parseFloat(d.precio_unitario),
            stock_disponible: d.stock_disponible || d.producto?.stock_disponible || 0,
            peso: d.peso || d.producto?.peso || 0,
            categoria: d.categoria || d.producto?.categoria || null,
            limite_venta: d.limite_venta || d.producto?.limite_venta || null,
            // ✅ NUEVO (2026-03-28): Preservar unidad_medida información
            unidad_medida_id: d.unidad_medida_id || d.producto?.unidad_medida_id || d.producto?.unidad_id || null,
            unidad_medida_nombre: d.unidad_medida_nombre || d.producto?.unidad_medida_nombre || d.producto?.unidad_nombre || null,
            // ✅ NUEVO (2026-02-20): Propiedades necesarias para combos en ProductosTable
            es_combo: d.es_combo || (d.producto?.es_combo ?? false),
            combo_items: d.combo_items || [],
            combo_items_seleccionados: d.combo_items_seleccionados || [],
            expanded: d.expanded || false,
        }));
    };

    // ✅ NUEVO: useEffect para precarga de datos en modo edición
    useEffect(() => {
        if (modo === 'editar' && proforma) {
            // ✅ Fechas
            setFecha(proforma.fecha);
            setFechaVencimiento(proforma.fecha_vencimiento);
            if (proforma.fecha_entrega_solicitada) {
                setFechaEntregaSolicitada(proforma.fecha_entrega_solicitada);
            }

            // ✅ Configuración
            setCanal(proforma.canal as any);
            setPoliticaPago(proforma.politica_pago as any);
            setObservaciones(proforma.observaciones || '');
            setTipoEntrega((proforma.tipo_entrega as 'DELIVERY' | 'PICKUP') || 'DELIVERY');

            // ✅ Horarios de entrega (si existen)
            if (proforma.hora_entrega_solicitada) {
                // Actualizar la hora si es necesario
            }

            // ✅ Auto-asignar preventista de la proforma
            console.log('%c👤 Asignando preventista', 'font-weight: bold; color: #8b5cf6;', {
                preventista_id_proforma: proforma.preventista_id,
                usuario_creador_id: proforma.usuario_creador_id,
                preventistas_disponibles: preventistasSeguro.length,
                preventistas_ids: preventistasSeguro.map(p => p.id),
            });

            if (proforma.preventista_id) {
                console.log(`%c✅ Estableciendo preventista ${proforma.preventista_id}`, 'color: green;');
                setPreventistaId(proforma.preventista_id);
            } else if (proforma.usuario_creador_id && preventistasSeguro.some((p) => p.id === proforma.usuario_creador_id)) {
                // Si no hay preventista asignado pero el usuario creador está en la lista de preventistas, asignar automáticamente
                console.log(`%c✅ Estableciendo preventista desde usuario_creador ${proforma.usuario_creador_id}`, 'color: green;');
                setPreventistaId(proforma.usuario_creador_id);
            } else {
                console.log('%c⚠️ No se asignó preventista', 'color: orange;');
                setPreventistaId(null);
            }

            // ✅ NUEVO (2026-07-18): Cargar cliente automáticamente en modo edición
            if (proforma.cliente_id) {
                const clienteEncontrado = clientesSeguro.find((c) => c.id === proforma.cliente_id);

                if (clienteEncontrado) {
                    setClienteValue(clienteEncontrado.id);
                    setClienteDisplay(clienteEncontrado.nombre);
                    setClienteSeleccionado(clienteEncontrado);
                    obtenerClienteDeuda(Number(clienteEncontrado.id));
                } else {
                    // Si no está en clientesSeguro, hacer fetch directo
                    fetch(`/api/clientes/${proforma.cliente_id}`)
                        .then((response) => response.json())
                        .then((result) => {
                            if (result.success && result.data) {
                                setClienteValue(result.data.id);
                                setClienteDisplay(result.data.nombre);
                                setClienteSeleccionado(result.data);
                                obtenerClienteDeuda(Number(result.data.id));
                            }
                        })
                        .catch((error) => console.error(`Error fetching cliente ${proforma.cliente_id}:`, error));
                }
            }

            // ✅ Precarga de detalles - Transformar al formato correcto para ProductosTable
            if (detallesProforma && detallesProforma.length > 0) {
                const detallesTransformados = transformarDetalles(detallesProforma);
                setDetalles(detallesTransformados);
            }

            // ✅ Activar envío si hay fecha de entrega solicitada
            if (proforma.fecha_entrega_solicitada) {
                setRequiereEnvio(true);
                // ✅ CORREGIDO (2026-04-05): Preseleccionar dirección de entrega
                if (proforma.direccion_entrega_solicitada_id) {
                    setDireccionEntregaId(proforma.direccion_entrega_solicitada_id);
                }
                // ✅ NUEVO (2026-04-06): Cargar horarios de entrega
                if (proforma.hora_entrega_solicitada) {
                    setHoraEntregaSolicitada(proforma.hora_entrega_solicitada);
                    // Detectar turno según la hora
                    if (proforma.hora_entrega_solicitada >= '08:00' && proforma.hora_entrega_solicitada < '14:00') {
                        setTurnoEntrega('manana');
                    } else if (proforma.hora_entrega_solicitada >= '14:00' && proforma.hora_entrega_solicitada <= '18:00') {
                        setTurnoEntrega('tarde');
                    }
                }
                if (proforma.hora_entrega_solicitada_fin) {
                    setHoraEntregaSolicitadaFin(proforma.hora_entrega_solicitada_fin);
                }
            }
        }
    }, [modo, proforma, detallesProforma, clientesSeguro, preventistasSeguro]);

    // Búsqueda de productos
    const {
        searchTerm: searchProducto,
        setSearchTerm: setSearchProducto,
        productos: productosDisponibles,
        isLoading: isLoadingProductos,
        error: errorProductos,
    } = useBuscarProductos({ debounceMs: 400 });

    // Búsqueda de cliente mejorada (patrón igual a ventas/create.tsx)
    const { search: buscarClientes } = useClienteSearch();

    // Cálculo de precios por rango
    const {
        calcularCarritoDebounced,
        getPrecioActualizado,
        carritoCalculado, // ✅ NUEVO (2026-02-17): Extraer datos calculados para ProductosTable
        loading: isCalculandoRangos,
        error: errorRangos,
    } = usePrecioRangoCarrito(400);

    // Calcular totales
    const calcularTotales = () => {
        const subtotal = detalles.reduce((sum, d) => {
            // ✅ CORREGIDO: Usar d.precio_unitario primero (que incluye cambios manuales inmediatos)
            // Solo usar getPrecioActualizado si es mejor (descuento por volumen)
            const precioActualizado = getPrecioActualizado(d.producto_id as number);
            const precioUnitario = d.precio_unitario ?? 0;
            // Usar el precio más bajo entre el manual y el calculado (si existe)
            const precio = precioActualizado && precioActualizado < precioUnitario ? precioActualizado : precioUnitario;
            return sum + d.cantidad * precio;
        }, 0);
        return { subtotal, total: subtotal };
    };

    const totales = calcularTotales();

    // Handlers para ProductosTable
    const handleAgregarProducto = (producto: Producto) => {
        // ✅ CAMBIO 2026-02-13: Usar tipo_precio_id_recomendado para seleccionar el precio correcto
        const tipoPrecioRecomendado = (producto as any).tipo_precio_id_recomendado;

        // Buscar el precio recomendado en el array de precios
        const preciosArray = (producto as any).precios || [];
        const precioRecomendado = preciosArray.find((p: any) => p.tipo_precio_id === tipoPrecioRecomendado);

        // Usar el precio recomendado si existe, si no, usar el precio de venta, si no, usar precio base
        const precioUnitario = precioRecomendado?.precio ?? (producto.precio_venta as number) ?? (producto.precio_base as number) ?? 0;

        console.debug('💰 [Agregar Producto] tipoPrecioRecomendado:', tipoPrecioRecomendado, 'precioUnitario:', precioUnitario);

        const nuevoDetalle: ProformaDetalleLocal = {
            id: Math.random(),
            producto,
            producto_id: producto.id,
            producto_nombre: producto.nombre,
            sku: producto.sku,
            cantidad: 1,
            precio_unitario: precioUnitario,
            subtotal: precioUnitario,
            stock_disponible: (producto as any).stock_disponible || 0,
            peso: (producto as any).peso || 0,
            categoria: (producto as any).categoria || undefined,
            limite_venta: (producto as any).limite_venta || null,
            // ✅ NUEVO: Guardar tipo_precio_id para que handleUpdateDetalle pueda usarlo al recalcular
            tipo_precio_id: tipoPrecioRecomendado,
            tipo_precio_nombre: precioRecomendado?.nombre,
        };

        const nuevosDetalles = [...detalles, nuevoDetalle];
        setDetalles(nuevosDetalles);

        const itemsParaCalcular = nuevosDetalles.map((d) => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            tipo_precio_id: tipoPrecioRecomendado, // ✅ CAMBIO: Usar el tipo_precio_id recomendado
        }));
        calcularCarritoDebounced(itemsParaCalcular);
    };

    const handleUpdateDetalle = (index: number, field: keyof ProformaDetalleLocal, value: number | string) => {
        const nuevosDetalles = [...detalles];
        const detalle = nuevosDetalles[index];

        if (field === 'cantidad') {
            const cantidadValida = Math.max(0.01, isNaN(value as any) ? 0.01 : (value as number));
            detalle.cantidad = cantidadValida;
            detalle.subtotal = cantidadValida * detalle.precio_unitario;
        } else if (field === 'precio_unitario') {
            detalle.precio_unitario = value as number;
            detalle.subtotal = detalle.cantidad * (value as number);
        } else {
            (detalle as any)[field] = value;
        }

        setDetalles(nuevosDetalles);

        const itemsParaCalcular = nuevosDetalles.map((d) => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            tipo_precio_id: d.tipo_precio_id, // ✅ CORREGIDO: Usar el tipo_precio_id del detalle para cálculos de rango
        }));
        calcularCarritoDebounced(itemsParaCalcular);
    };

    const handleRemoveDetalle = (index: number) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(nuevosDetalles);
    };

    const handleTotalsChange = (detalles: ProformaDetalleLocal[]) => {
        // Este handler se llamará desde ProductosTable cuando cambien los totales
        // Por ahora solo actualizamos el estado de detalles si es necesario
        setDetalles(detalles as any);
    };

    // ✅ NUEVO (2026-02-18): Handler para cuando el usuario selecciona/deselecciona items opcionales del combo
    // Sincronizado con Show.tsx para mantener consistencia en ProductosTable
    const handleComboItemsChange = (detailIndex: number, items: any[]) => {
        console.log(`🎁 [Create.tsx] Combo items cambiaron en detalle ${detailIndex}:`, items);

        const nuevosDetalles = [...detalles];
        const detalle = nuevosDetalles[detailIndex];

        if (detalle && (detalle.producto as any)?.es_combo) {
            // ✅ Convertir items actualizados a combo_items_seleccionados
            // Solo incluir los que tienen _isChecked = true
            const comboItemsSeleccionados = items
                .filter((item: any) => item._isChecked === true)
                .map((item: any) => ({
                    id: item.id,
                    combo_item_id: item.id,
                    producto_id: item.producto_id,
                    producto_nombre: item.producto_nombre,
                    cantidad: item.cantidad,
                    es_obligatorio: item.es_obligatorio,
                    incluido: true,
                }));

            // Actualizar el detalle con los nuevos combo_items_seleccionados
            detalle.combo_items_seleccionados = comboItemsSeleccionados;
            setDetalles(nuevosDetalles);

            console.log(`✅ [Create.tsx] combo_items_seleccionados actualizado con ${comboItemsSeleccionados.length} items`);
        }
    };

    const handleSeleccionarCliente = (cliente: Cliente) => {
        setClienteValue(cliente.id);
        setClienteDisplay(cliente.nombre);
        setClienteSeleccionado(cliente);
    };

    const handleCreateCliente = () => {
        setMostrarModalCliente(true);
    };

    const handleCrearProforma = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clienteValue) {
            toast.error('Selecciona un cliente');
            return;
        }

        if (detalles.length === 0) {
            toast.error('Agrega al menos un producto');
            return;
        }

        setIsSubmitting(true);

        try {
            // ✅ NUEVO: Diferencia entre crear y editar
            if (modo === 'editar' && proforma) {
                // 📝 MODO EDICIÓN: Actualizar detalles y otros campos de proforma existente

                // 🔍 DEBUG: Mostrar estado actual de detalles antes del mapeo
                console.log('📝 [EDICIÓN] Estado actual de detalles:', JSON.stringify(detalles, null, 2));

                const detallesPayload = {
                    // ✅ Cliente (ahora actualizable en edición)
                    cliente_id: clienteValue,
                    detalles: detalles.map((d, index) => {
                        const detalle = {
                            producto_id: d.producto_id,
                            cantidad: d.cantidad,
                            precio_unitario: getPrecioActualizado(d.producto_id as number) ?? d.precio_unitario,
                            subtotal: d.cantidad * (getPrecioActualizado(d.producto_id as number) ?? d.precio_unitario),
                            // ✅ NUEVO: Incluir campos de combo que ya vienen en detalles
                            tipo_precio_id: d.tipo_precio_id,
                            tipo_precio_nombre: d.tipo_precio_nombre,
                            combo_items_seleccionados: (d as any).combo_items_seleccionados || [],
                        };
                        console.log(`📝 [EDICIÓN] Detalle ${index} (Producto ${d.producto_id}):`, detalle);
                        return detalle;
                    }),
                    // ✅ NUEVO: Incluir campos adicionales opcionales para edición completa
                    fecha: fecha || undefined,
                    fecha_vencimiento: fechaVencimiento || undefined,
                    fecha_entrega_solicitada: requiereEnvio ? fechaEntregaSolicitada : null,
                    hora_entrega_solicitada: requiereEnvio ? horaEntregaSolicitada : null, // ✅ NUEVO (2026-04-06)
                    hora_entrega_solicitada_fin: requiereEnvio ? horaEntregaSolicitadaFin : null, // ✅ NUEVO (2026-04-06)
                    tipo_entrega: requiereEnvio ? 'DELIVERY' : 'PICKUP',
                    canal: canal,
                    politica_pago: politicaPago,
                    observaciones: observaciones || undefined,
                    direccion_entrega_solicitada_id: requiereEnvio ? direccionEntregaId : null, // ✅ CORREGIDO (2026-04-05): Enviar dirección de entrega
                    // ✅ ACTUALIZACIÓN: Incluir estado y preventista en modo edición
                    estado_inicial: estadosProforma.find((e) => e.id === estadoInicial)?.codigo || 'BORRADOR', // ✅ Enviar código del estado, no el ID
                    preventista_id: preventistaId,
                };

                // 🔍 DEBUG: Mostrar payload completo antes de enviar
                console.log('📤 [EDICIÓN] Payload COMPLETO que se enviará:', JSON.stringify(detallesPayload, null, 2));

                const response = await fetch(`/api/proformas/${proforma.id}/actualizar-detalles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(detallesPayload),
                });

                // 🔍 DEBUG: Mostrar respuesta del servidor
                const responseData = await response.json();
                console.log('📨 [EDICIÓN] Respuesta del servidor:', responseData);

                if (!response.ok) {
                    throw new Error(responseData.message || 'Error al actualizar proforma');
                }

                toast.success('✅ Proforma actualizada exitosamente');

                // Redirigir a la proforma actualizada
                setTimeout(() => {
                    window.location.href = `/proformas/${proforma.id}`;
                }, 1000);
            } else {
                // ✅ MODO CREACIÓN: Crear nueva proforma

                // 🔍 DEBUG: Mostrar estado actual de detalles antes del mapeo
                console.log('✨ [CREACIÓN] Estado actual de detalles:', JSON.stringify(detalles, null, 2));

                const payload = {
                    cliente_id: clienteValue,
                    fecha,
                    fecha_vencimiento: fechaVencimiento,
                    canal,
                    requiere_envio: requiereEnvio,
                    fecha_entrega_solicitada: requiereEnvio ? fechaEntregaSolicitada : null,
                    hora_entrega_solicitada: requiereEnvio ? horaEntregaSolicitada : null, // ✅ NUEVO (2026-04-06)
                    hora_entrega_solicitada_fin: requiereEnvio ? horaEntregaSolicitadaFin : null, // ✅ NUEVO (2026-04-06)
                    tipo_entrega: requiereEnvio ? 'DELIVERY' : 'PICKUP',
                    politica_pago: politicaPago,
                    observaciones,
                    direccion_entrega_solicitada_id: requiereEnvio ? direccionEntregaId : null, // ✅ CORREGIDO (2026-04-05): Enviar dirección de entrega
                    detalles: detalles.map((d, index) => {
                        const detalle = {
                            producto_id: d.producto_id,
                            cantidad: d.cantidad,
                            precio_unitario: getPrecioActualizado(d.producto_id as number) ?? d.precio_unitario,
                            // ✅ NUEVO: Incluir campos de combo que ya vienen en detalles
                            tipo_precio_id: d.tipo_precio_id,
                            tipo_precio_nombre: d.tipo_precio_nombre,
                            combo_items_seleccionados: (d as any).combo_items_seleccionados || [],
                        };
                        console.log(`✨ [CREACIÓN] Detalle ${index} (Producto ${d.producto_id}):`, detalle);
                        return detalle;
                    }),
                    subtotal: totales.subtotal,
                    impuesto: 0,
                    total: totales.total,
                    estado_inicial: estadosProforma.find((e) => e.id === estadoInicial)?.codigo || 'BORRADOR', // ✅ Enviar código del estado, no el ID
                    preventista_id: preventistaId, // ✅ NUEVO: Preventista asignado
                };

                // 🔍 DEBUG: Mostrar payload completo antes de enviar
                console.log('📤 [CREACIÓN] Payload COMPLETO que se enviará:', JSON.stringify(payload, null, 2));

                const response = await fetch('/proformas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify(payload),
                });

                // 🔍 DEBUG: Mostrar respuesta del servidor
                const data = await response.json();
                console.log('📨 [CREACIÓN] Respuesta del servidor:', data);

                if (!response.ok) {
                    throw new Error(data.message || 'Error al crear proforma');
                }

                toast.success('✅ Proforma creada exitosamente');

                // Redirigir a la proforma
                setTimeout(() => {
                    window.location.href = `/proformas/${data.data.id}`;
                }, 1000);
            }
        } catch (error) {
            console.error('❌ [ERROR] Error en handleCrearProforma:', error);
            toast.error(error instanceof Error ? error.message : modo === 'editar' ? 'Error al actualizar proforma' : 'Error al crear proforma');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AppLayout
                breadcrumbs={[
                    { title: 'Proformas', href: '/proformas' },
                    { title: modo === 'editar' ? `Editar Folio #${proforma?.id}` : 'Nueva proforma', href: '#' },
                ]}
            >
                <Head title={modo === 'editar' ? `Editar Folio #${proforma?.id}` : 'Nueva proforma'} />

                <form onSubmit={handleCrearProforma} className="space-y-6 p-4">
                    {/* Información básica */}
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-3 lg:grid-cols-3">
                            {/* ✅ NUEVO (2026-07-18): Estado Inicial - Dinámico desde estados_logistica */}
                            <div>
                                <Label htmlFor="estado-inicial" className="text-sm">
                                    📝 Estado
                                </Label>
                                <Select value={estadoInicial.toString()} onValueChange={(v) => setEstadoInicial(parseInt(v))}>
                                    <SelectTrigger id="estado-inicial">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {estadosProforma.map((estado) => (
                                            <SelectItem key={estado.id} value={estado.id.toString()}>
                                                {estado.icono || '📌'} {estado.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <InputSearch
                                    id="cliente_search"
                                    label="Cliente"
                                    value={clienteValue}
                                    displayValue={clienteDisplay}
                                    onSearch={buscarClientes}
                                    onChange={async (value, option) => {
                                        setClienteValue(value);
                                        if (option && value) {
                                            setClienteDisplay(option.label);
                                            // ✅ CORREGIDO (2026-04-06): Fetch cliente completo desde API con validación
                                            const clienteId = Number(value);
                                            if (!isNaN(clienteId) && clienteId > 0) {
                                                try {
                                                    const response = await fetch(`/api/clientes/${clienteId}`);
                                                    if (response.ok) {
                                                        const result = await response.json();
                                                        // ✅ NUEVO (2026-07-18): Log completo del JSON sin separar
                                                        console.group('📋 CLIENTE CARGADO DESDE API - JSON COMPLETO');
                                                        console.log(JSON.stringify(result, null, 2));
                                                        console.log('Estructura completa:', result);
                                                        console.groupEnd();

                                                        if (result.success && result.data) {
                                                            setClienteSeleccionado(result.data);

                                                            // ✅ NUEVO (2026-07-18): Cargar deuda del cliente automáticamente
                                                            console.log(`🔄 Cargando deuda para cliente ${clienteId}...`);
                                                            obtenerClienteDeuda(clienteId);
                                                        } else {
                                                            console.warn('⚠️ Respuesta API sin datos:', result);
                                                        }
                                                    } else {
                                                        console.error(`Error cargando cliente ${clienteId}:`, response.statusText);
                                                        setClienteSeleccionado(null);
                                                    }
                                                } catch (error) {
                                                    console.error(`Error fetching cliente ${clienteId}:`, error);
                                                    setClienteSeleccionado(null);
                                                }
                                            } else {
                                                console.warn('ID de cliente inválido:', value);
                                                setClienteSeleccionado(null);
                                            }
                                        } else {
                                            setClienteDisplay('');
                                            setClienteSeleccionado(null);
                                        }
                                    }}
                                    placeholder="Buscar cliente por nombre, NIT/CI o teléfono..."
                                    emptyText="No se encontraron clientes"
                                    required={true}
                                    allowScanner={false}
                                    showCreateButton={true}
                                    onCreateClick={handleCreateCliente}
                                    createButtonText="Crear Cliente"
                                    showCreateIconButton={true}
                                    createIconButtonTitle="Crear nuevo cliente"
                                    className="w-full"
                                />
                                {clienteSeleccionado && (
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                        {clienteSeleccionado.telefono && <span>📱 {clienteSeleccionado.telefono}</span>}
                                        {clienteSeleccionado.nit && (
                                            <span>
                                                {clienteSeleccionado.telefono ? ' • ' : ''}NIT: {clienteSeleccionado.nit}
                                            </span>
                                        )}
                                        {clienteSeleccionado.email && (
                                            <span>
                                                {clienteSeleccionado.telefono || clienteSeleccionado.nit ? ' • ' : ''}Email:{' '}
                                                {clienteSeleccionado.email}
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>

                            <RequiereEnvioToggle value={requiereEnvio} onChange={setRequiereEnvio} label="🚚 Requiere Envío" />
                        </div>
                        {/* ✅ NUEVO (2026-07-18): Panel de Deuda del Cliente - Solo si puede_tener_credito=true */}
                        {clienteDeuda && clienteDeuda.deuda && clienteDeuda.cliente.puede_tener_credito && (
                            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-zinc-700">
                                <DeudaClientePanel
                                    deuda={{
                                        cliente_nombre: clienteDeuda.cliente.nombre,
                                        limite_credito: Number(clienteDeuda.cliente.limite_credito),
                                        cuentas_por_cobrar: clienteDeuda.deuda.cuentas_por_cobrar,
                                        proformas_pendientes: clienteDeuda.deuda.proformas_pendientes,
                                        total_deuda: clienteDeuda.deuda.total_deuda,
                                        disponible_credito: clienteDeuda.deuda.disponible_credito,
                                        puede_hacer_credito: clienteDeuda.deuda.puede_hacer_credito,
                                    }}
                                    politicaPago={politicaPago}
                                    loading={loadingDeuda}
                                />
                            </div>
                        )}

                        {/* ✅ NUEVO: Sección con 4 selectores en una línea responsiva */}
                        {/* <div className="mt-6 border-t border-gray-200 pt-4 dark:border-zinc-700">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="tipo-entrega" className="text-sm">
                                        🚚 Tipo Entrega
                                    </Label>
                                    <Select value={tipoEntrega} onValueChange={(v) => setTipoEntrega(v as any)}>
                                        <SelectTrigger id="tipo-entrega">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="DELIVERY">Delivery</SelectItem>
                                            <SelectItem value="PICKUP">Pickup</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div> */}

                        {/* ✅ FASE 3: Panel completo de Detalles de Envío */}
                        {clienteSeleccionado && (
                            <DetallesEnvioPanel
                                visible={logistica_envios && requiereEnvio}
                                politicaPago={politicaPago}
                                onPoliticaPagoChange={setPoliticaPago}
                                puedeTenerCredito={clienteDeuda?.cliente?.puede_tener_credito ?? false}
                                clienteSeleccionado={clienteSeleccionado}
                                direccionesDisponibles={direccionesDisponibles}
                                cargandoDirecciones={cargandoDirecciones}
                                direccionClienteId={direccionEntregaId}
                                onDireccionChange={setDireccionEntregaId}
                                onShowDireccionMapa={() => setMostrarMapaDireccion(true)} // ✅ NUEVO (2026-07-18)
                                preventistas={preventistasSeguro}
                                cargandoPrevenstitas={false}
                                preventistaId={preventistaId}
                                onPreventistaChange={setPreventistaId}
                                entregaId={null}
                                onEntregaChange={() => {}}
                                showEntrega={false}
                                gridCols="3"
                            />
                        )}

                        {/* ✅ NUEVO: Grid responsivo de fechas en 3 columnas */}
                        <div className="mt-3">
                            {/* Fechas en 3 columnas responsivas */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 lg:grid-cols-5">
                                {/* Fecha */}
                                {/* <div>
                                    <Label htmlFor="fecha" className="text-sm">
                                        📅 Fecha Creación
                                    </Label>
                                    <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                                </div> */}

                                {/* Fecha Entrega Solicitada - solo si requiere_envio */}
                                {requiereEnvio && (
                                    <>
                                        <div>
                                            <Label htmlFor="fecha-entrega" className="text-sm">
                                                📅 Fecha Entrega Solicitada
                                            </Label>
                                            <Input
                                                id="fecha-entrega"
                                                type="date"
                                                value={fechaEntregaSolicitada}
                                                onChange={(e) => setFechaEntregaSolicitada(e.target.value)}
                                                required={requiereEnvio}
                                            />
                                        </div>
                                        {/* Selector de Turno */}
                                        <div>
                                            <Label htmlFor="turno-entrega" className="text-xs">
                                                ⏰ Turno de Entrega
                                            </Label>
                                            <Select
                                                value={turnoEntrega}
                                                onValueChange={(value: any) => {
                                                    setTurnoEntrega(value);
                                                    // Limpiar horas cuando cambia turno
                                                    setHoraEntregaSolicitada('');
                                                    setHoraEntregaSolicitadaFin('');
                                                }}
                                            >
                                                <SelectTrigger id="turno-entrega">
                                                    <SelectValue placeholder="Selecciona un turno" />
                                                </SelectTrigger>
                                                <SelectContent className="text-xs">
                                                    <SelectItem value="manana">🌅 Mañana (08:00 - 12:00)</SelectItem>
                                                    <SelectItem value="tarde">🌆 Tarde (14:00 - 18:00)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Horarios de Entrega - solo si turno está seleccionado */}
                                        {turnoEntrega && (
                                            <>
                                                <div>
                                                    <Label htmlFor="hora-inicio" className="text-sm">
                                                        🕐 Hora Inicio
                                                    </Label>
                                                    <Input
                                                        id="hora-inicio"
                                                        type="time"
                                                        value={horaEntregaSolicitada}
                                                        onChange={(e) => setHoraEntregaSolicitada(e.target.value)}
                                                        min={turnoEntrega === 'manana' ? '08:00' : '14:00'}
                                                        max={turnoEntrega === 'manana' ? '12:00' : '18:00'}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="hora-fin" className="text-sm">
                                                        🕐 Hora Fin
                                                    </Label>
                                                    <Input
                                                        id="hora-fin"
                                                        type="time"
                                                        value={horaEntregaSolicitadaFin}
                                                        onChange={(e) => setHoraEntregaSolicitadaFin(e.target.value)}
                                                        min={turnoEntrega === 'manana' ? '08:00' : '14:00'}
                                                        max={turnoEntrega === 'manana' ? '12:00' : '18:00'}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                {/* Fecha Vencimiento */}
                                <div>
                                    <Label htmlFor="fecha-vencimiento" className="text-sm">
                                        📅 Fecha Vencimiento
                                    </Label>
                                    <Input
                                        id="fecha-vencimiento"
                                        type="date"
                                        value={fechaVencimiento}
                                        onChange={(e) => setFechaVencimiento(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="mt-2">
                                <Label htmlFor="observaciones" className="text-sm">
                                    📝 Observaciones
                                </Label>
                                <Textarea
                                    id="observaciones"
                                    placeholder="Notas adicionales..."
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Card Productos - ProductosTable */}
                        <Card className="mt-2">
                            <CardHeader>
                                <CardTitle className="text-lg">🛒 Productos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProductosTable
                                    productos={productosDisponibles}
                                    detalles={detalles as DetalleProducto[]}
                                    onAddProduct={handleAgregarProducto}
                                    onUpdateDetail={handleUpdateDetalle}
                                    onRemoveDetail={handleRemoveDetalle}
                                    onTotalsChange={handleTotalsChange}
                                    onComboItemsChange={handleComboItemsChange}
                                    tipo="venta"
                                    almacen_id={almacenIdSeguro}
                                    isCalculatingPrices={isCalculandoRangos}
                                    errors={undefined}
                                    default_tipo_precio_id={default_tipo_precio_id}
                                    carritoCalculado={carritoCalculado}
                                    permitirProductosSinStock={true}
                                    onDetallesActualizados={(nuevosDetalles) => {
                                        console.log('🔄 [proformas/Create.tsx] ProductosTable notificó cambios en detalles por rangos');
                                        setDetalles(nuevosDetalles);
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Card Resumen */}
                        {detalles.length > 0 && (
                            <Card className="mt-2 bg-gradient-to-br from-primary/5 to-primary/10">
                                <CardContent>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-semibold">
                                            Bs. {totales.subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span>Bs. {totales.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Botones de acción */}
                        <div className="mt-2 flex gap-3">
                            <a href="/proformas" className="flex-1">
                                <Button type="button" variant="outline" className="w-full">
                                    Cancelar
                                </Button>
                            </a>
                            <Button type="submit" className="flex-1" disabled={!clienteValue || detalles.length === 0 || isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {modo === 'editar' ? 'Guardando...' : 'Creando...'}
                                    </>
                                ) : modo === 'editar' ? (
                                    'Guardar Cambios'
                                ) : (
                                    'Crear Proforma'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Modal crear cliente */}
                {mostrarModalCliente && (
                    <ModalCrearCliente
                        isOpen={mostrarModalCliente}
                        onClose={() => setMostrarModalCliente(false)}
                        onClienteCreated={(nuevoCliente) => {
                            handleSeleccionarCliente(nuevoCliente);
                            setMostrarModalCliente(false);
                        }}
                    />
                )}

                {isSubmitting && <LoadingOverlay />}

                {/* ✅ NUEVO (2026-07-18): Modal para ver dirección en mapa */}
                {clienteSeleccionado && direccionEntregaId && direccionesDisponibles.length > 0 && (
                    (() => {
                        // ✅ MEJORADO: Usar dirección completa desde proforma (modo editar) o del array (modo crear)
                        const direccionSeleccionada = modo === 'editar' && proforma?.direccion_entrega_solicitada
                            ? proforma.direccion_entrega_solicitada
                            : direccionesDisponibles.find(d => d.id === direccionEntregaId);

                        return (
                            <UbicacionesMultiplesModal
                                isOpen={mostrarMapaDireccion}
                                onClose={() => setMostrarMapaDireccion(false)}
                                ubicaciones={[
                                    {
                                        id: direccionSeleccionada?.id || 0,
                                        venta_id: proforma?.id || 0,
                                        venta_numero: proforma?.numero || '',
                                        cliente_nombre: clienteSeleccionado.nombre,
                                        cliente_telefono: clienteSeleccionado.telefono,
                                        cliente_foto: clienteSeleccionado.foto_perfil,
                                        direccion: direccionSeleccionada?.direccion || '',
                                        observaciones: direccionSeleccionada?.observaciones,
                                        latitud: (direccionSeleccionada as any)?.latitud,
                                        longitud: (direccionSeleccionada as any)?.longitud,
                                    },
                                ]}
                                titulo={`📍 Dirección de Entrega - ${proforma?.numero || 'Nueva Proforma'}`}
                            />
                        );
                    })()
                )}
            </AppLayout>
        </>
    );
}

import { useCajaWarning } from '@/application/hooks/use-caja-warning';
import AppLayout from '@/layouts/app-layout';
import VentaPreviewModal from '@/presentation/components/VentaPreviewModal';
import { AlertSinCaja } from '@/presentation/components/cajas/alert-sin-caja';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// Importar componentes y hooks adicionales
import { useClienteSearch } from '@/infrastructure/hooks/use-api-search';
import ProductosTable, { DetalleProducto } from '@/presentation/components/ProductosTable';
import EntregaSearchSelector from '@/presentation/components/entregas/EntregaSearchSelector';
import InputSearch from '@/presentation/components/ui/input-search';
import ModalCrearCliente from '@/presentation/components/ui/modal-crear-cliente';
import SearchSelect, { SelectOption } from '@/presentation/components/ui/search-select';

// Importar servicios adicionales
import { usePrecioRangoCarrito } from '@/application/hooks/use-precio-rango-carrito';
import { NotificationService } from '@/infrastructure/services/notification.service';

// Importar tipos del domain y servicio
import type { Cliente } from '@/domain/entities/clientes';
import type { TipoDocumento } from '@/domain/entities/tipos-documento';
import type { TipoPago } from '@/domain/entities/tipos-pago';
import type { DetalleVentaFormData, EstadoDocumento, Moneda, Producto, Venta } from '@/domain/entities/ventas';

import ventasService from '@/infrastructure/services/ventas.service';
import { formatCurrencyMinimalDecimals } from '@/lib/utils';
import { abrirPantallaPrestamoEnNuevaVentana, calcularPrestamesParaVenta, tieneProductosPrestables } from '@/infrastructure/helpers/prestables.helper';

interface TipoPrecio {
    id: number;
    codigo: string;
    nombre: string;
}

interface PageProps extends InertiaPageProps {
    clientes: Cliente[];
    cliente_general?: Cliente; // ✅ NUEVO (2026-08-24): Cliente GENERAL para auto-seleccionar
    productos: Producto[]; // ✅ Ahora array vacío (búsqueda via API)
    almacenes: Array<{ id: number; nombre: string }>; // ✅ NUEVO: Lista de almacenes
    monedas: Moneda[];
    estados_documento: EstadoDocumento[];
    tipos_pago: TipoPago[];
    tipos_documento: TipoDocumento[];
    tipos_precio: TipoPrecio[]; // ✅ NUEVO: Tipos de precio para asignar por defecto
    almacen_id_empresa: number; // ✅ NUEVO: Almacén de la empresa principal
    es_farmacia: boolean; // ✅ NUEVO: Indicador para mostrar/ocultar campos de medicamentos
    auth: {
        user: {
            id: number;
            name: string;
        };
    };
    venta?: Venta;
}

export default function VentaForm() {
    const {
        clientes,
        cliente_general,
        productos,
        monedas,
        estados_documento,
        tipos_pago,
        tipos_documento,
        tipos_precio,
        almacen_id_empresa,
        es_farmacia,
        logistica_envios,
        auth,
        venta,
    } = usePage<PageProps>().props;
    const isEditing = Boolean(venta);
    const isFarmacia = Boolean(es_farmacia);
    const { shouldShowBanner } = useCajaWarning();

    // ✅ DEBUG: Detectar cambios en es_farmacia y logistica_envios
    useEffect(() => {
        // Si cambió el valor, recarga la página para obtener datos frescos
        console.warn('⚠️ Si cambiaste es_farmacia o logistica_envios en Empresa, necesitas refrescar los datos');
    }, [es_farmacia, logistica_envios]);

    // Validaciones defensivas para evitar errores usando useMemo
    const clientesSeguro = useMemo(() => clientes || [], [clientes]);
    const productosSeguro = useMemo(() => productos || [], [productos]);
    const monedasSeguro = useMemo(() => monedas || [], [monedas]);
    const estadosSeguro = useMemo(() => estados_documento || [], [estados_documento]);
    const tiposPagoSeguro = useMemo(() => tipos_pago || [], [tipos_pago]);
    const tiposDocumentoSeguro = useMemo(() => tipos_documento || [], [tipos_documento]);

    // ✅ Obtener el ID del documento Recibo (REC) por defecto
    const tipoDocumentoReciboId = useMemo(() => {
        const recibo = tiposDocumentoSeguro.find((doc) => doc.codigo === 'REC' || doc.nombre === 'Recibo');
        return recibo?.id || 3; // Fallback a 3 si no se encuentra
    }, [tiposDocumentoSeguro]);

    // ✅ Obtener el ID del estado APROBADO por defecto
    const estadoDocumentoAprobadoId = useMemo(() => {
        const aprobado = estadosSeguro.find((estado) => estado.codigo === 'APROBADO');
        return aprobado?.id || estadosSeguro[0]?.id || 0; // Fallback al primer estado
    }, [estadosSeguro]);

    // Mapeo de iconos para tipos de pago
    const getIconoEmoji = (icono?: string): string => {
        return (
            {
                Banknote: '💵',
                Send: '📤',
                CreditCard: '💳',
                DollarSign: '💰',
            }[icono || ''] || '💰'
        );
    };

    // Opciones para SearchSelect
    const tiposPagoOptions: SelectOption[] = useMemo(
        () =>
            tiposPagoSeguro.map((tipo) => ({
                value: tipo.id,
                label: `${getIconoEmoji(tipo.icono)} ${tipo.nombre}`,
                description: tipo.codigo,
            })),
        [tiposPagoSeguro],
    );

    const [detallesWithProducts, setDetallesWithProducts] = useState<DetalleProducto[]>([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [stockValido, setStockValido] = useState(true);

    // ✅ NUEVO: Estados para direcciones del cliente
    const [direccionesDisponibles, setDireccionesDisponibles] = useState<
        Array<{
            id: number;
            direccion: string;
            localidad?: string;
            es_principal?: boolean;
            activa?: boolean;
        }>
    >([]);
    const [cargandoDirecciones, setCargandoDirecciones] = useState(false);

    // ✅ NUEVO: Estados para preventistas
    interface Preventista {
        id: number;
        name: string;
    }
    const [preventistas, setPrevenstitas] = useState<Preventista[]>([]);
    const [cargandoPrevenstitas, setCargandoPrevenstitas] = useState(true);

    // ✅ NUEVO: Estados para entregas disponibles
    interface Entrega {
        id: number;
        numero_entrega: string;
        estado?: string;
        chofer?: { name: string };
        vehiculo?: { placa: string };
    }

    // Estados para validación de caja abierta
    interface CajaInfo {
        tiene_caja_abierta: boolean;
        es_de_hoy?: boolean;
        dias_atras?: number;
        caja_nombre?: string;
        usuario_caja?: string;
        mensaje?: string;
    }

    const [cajaInfo, setCajaInfo] = useState<CajaInfo | null>(null);
    const [cargandoCaja, setCargandoCaja] = useState(true);

    // ✅ NUEVO: Rastrear qué tipos de precio han sido seleccionados manualmente por el usuario
    const [manuallySelectedTipoPrecio, setManuallySelectedTipoPrecio] = useState<Record<number, boolean>>({});

    // ✅ NUEVO: Rastrear items seleccionados en combos por cada detalle
    const [comboItemsMap, setComboItemsMap] = useState<Record<number, any[]>>({});

    // ✅ NUEVO: Obtener ID del tipo de precio LICORERIA desde props
    const tipoPrecioLicoreriId = useMemo(() => {
        const licoreria = tipos_precio?.find((tp) => tp.codigo === 'LICORERIA' || tp.nombre?.toUpperCase() === 'LICORERIA');
        return licoreria?.id || null;
    }, [tipos_precio]);

    // Verificar si hay caja abierta (de cualquier día)
    useEffect(() => {
        const verificarCaja = async () => {
            try {
                const response = await fetch('/ventas/check-caja-abierta');
                const data = await response.json();
                setCajaInfo(data);
            } catch (error) {
                console.error('❌ Error verificando caja (Ventas):', error);
                // Si hay error, permitir acceso (mejor UX que bloquear)
                setCajaInfo({ tiene_caja_abierta: true });
            } finally {
                setCargandoCaja(false);
            }
        };

        verificarCaja();
    }, []);

    // ✅ NUEVO: Cargar preventistas al montar el componente
    useEffect(() => {
        const cargarPrevenstitas = async () => {
            try {
                const response = await fetch('/api/preventistas');
                const data = await response.json();
                if (data.success && Array.isArray(data.preventistas)) {
                    setPrevenstitas(data.preventistas);
                } else {
                    console.warn('⚠️ Respuesta de preventistas inválida:', data);
                    setPrevenstitas([]);
                }
            } catch (error) {
                console.error('❌ Error al cargar preventistas:', error);
                setPrevenstitas([]);
            } finally {
                setCargandoPrevenstitas(false);
            }
        };

        cargarPrevenstitas();
    }, []);

    // ✅ NUEVO: Entrega search is now handled by EntregaSearchSelector component (backend search)

    // Hook para calcular carrito con precios por rango
    const precioRango = usePrecioRangoCarrito(500); // Debounce de 500ms

    // Estado para InputSearch de cliente
    const [clienteValue, setClienteValue] = useState<string | number | null>(null);
    const [clienteDisplay, setClienteDisplay] = useState<string>('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null); // ✅ NUEVO: Guardar cliente completo
    const [clienteRaw, setClienteRaw] = useState<any>(null); // ✅ NUEVO (2026-08-26): Guardar datos raw de búsqueda con direcciones

    // Hook para búsqueda de clientes
    const { search: searchClientes } = useClienteSearch();

    // Estado para el modal de crear cliente
    const [showCreateClienteModal, setShowCreateClienteModal] = useState(false);
    const [clienteSearchQuery, setClienteSearchQuery] = useState('');

    // Estado para el modal de selección de salida (imprimir, Excel, PDF)
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [ventaCreada, setVentaCreada] = useState<{ id: number; numero: string; fecha: string } | null>(null);

    // ✅ NUEVO: Estado para manejar el cargando al guardar venta
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, processing, errors, reset } = useForm({
        numero: venta?.numero || '', // Solo para edición, se genera automáticamente para nuevas ventas
        fecha: venta?.fecha || new Date().toISOString().split('T')[0],
        subtotal: venta?.subtotal || 0,
        descuento: venta?.descuento || 0,
        impuesto: venta?.impuesto || 0,
        total: venta?.total || 0,
        observaciones: venta?.observaciones || '',
        cliente_id: venta?.cliente_id || 0,
        usuario_id: auth?.user?.id || 0,
        estado_documento_id: venta?.estado_documento_id || estadoDocumentoAprobadoId, // ✅ MODIFICADO: Usa APROBADO por defecto
        moneda_id: venta?.moneda_id || 1, // Solo para edición, se establece automáticamente a BOB para nuevas ventas
        proforma_id: venta?.proforma_id || undefined,
        tipo_pago_id: venta?.tipo_pago_id || 1, // EFECTIVO por defecto
        tipo_documento_id: venta?.tipo_documento_id || tipoDocumentoReciboId, // ✅ MODIFICADO: Usa Recibo (REC) por defecto dinámicamente
        almacen_id: venta?.almacen_id || almacen_id_empresa, // ✅ MODIFICADO: Usa almacén de la empresa
        requiere_envio: venta?.requiere_envio || false,
        canal_origen: venta?.canal_origen || 'PRESENCIAL',
        estado_logistico: venta?.estado_logistico || undefined,
        // ✅ NUEVO: Campo para logística de envíos
        empresa_logistica_id: (venta?.empresa_logistica_id ? Number(venta.empresa_logistica_id) : null) as number | null,
        // ✅ NUEVO: Campos de pago y auditoría
        monto_pagado_inicial: venta?.monto_pagado_inicial || 0,
        referencia_pago: venta?.referencia_pago || '',
        // ✅ NUEVO: Política de pago por defecto ANTICIPADO_100 para ventas directas
        politica_pago: venta?.politica_pago || 'ANTICIPADO_100',
        // ✅ NUEVO: Estado de pago por defecto PAGADO (consistente con proformas)
        estado_pago: venta?.estado_pago || 'PAGADO',
        // ✅ NUEVO: Dirección del cliente para envío
        direccion_cliente_id: (venta?.direccion_cliente_id ? Number(venta.direccion_cliente_id) : null) as number | null,
        // ✅ NUEVO: Preventista (User con rol de preventista)
        preventista_id: (venta?.preventista_id ? Number(venta.preventista_id) : null) as number | null,
        // ✅ NUEVO: Entrega (para asignar venta a una entrega existente)
        entrega_id: (venta?.entrega_id ? Number(venta.entrega_id) : null) as number | null,
    });

    // ✅ NUEVO (2026-04-21): Estado para múltiples pagos por venta
    interface Pago {
        id: string;
        tipo_pago_id: number;
        monto: number;
        tipo_pago_nombre?: string;
    }
    const [pagos, setPagos] = useState<Pago[]>([]);

    // ✅ NUEVO (2026-05-02): Estados para desglose de pago (Efectivo + Transferencia/QR)
    const [montoEfectivo, setMontoEfectivo] = useState<number | ''>('');
    const [montoTransferencia, setMontoTransferencia] = useState<number | ''>('');

    // ✅ NUEVO (2026-05-03): Auto-seleccionar tipo de pago y actualizar monto_pagado_inicial basado en montos de pago
    useEffect(() => {
        // ✅ NUEVO: Solo ejecutar este efecto en modo farmacia (desglose de pagos)
        if (!isFarmacia) return;

        const efectivo = Number(montoEfectivo) || 0;
        const transferencia = Number(montoTransferencia) || 0;
        const totalPagado = efectivo + transferencia;

        let tipoPagoIdAutomatico: number | null = null;

        if (efectivo > 0 && transferencia > 0) {
            // Ambos montos: MIXTO (id=4)
            tipoPagoIdAutomatico = 4;
        } else if (efectivo > 0) {
            // Solo efectivo: EFECTIVO (id=1)
            tipoPagoIdAutomatico = 1;
        } else if (transferencia > 0) {
            // Solo transferencia: TRANSFERENCIA/QR (id=2)
            tipoPagoIdAutomatico = 2;
        }

        // Actualizar tipo de pago si hay cambio
        if (tipoPagoIdAutomatico !== null && tipoPagoIdAutomatico !== data.tipo_pago_id) {
            setData('tipo_pago_id', tipoPagoIdAutomatico);

            console.log('💳 [VentaForm] Tipo de pago detectado automáticamente:', {
                efectivo,
                transferencia,
                tipo_pago_id: tipoPagoIdAutomatico,
                tipo_pago_nombre:
                    tipoPagoIdAutomatico === 1
                        ? 'EFECTIVO'
                        : tipoPagoIdAutomatico === 2
                          ? 'TRANSFERENCIA/QR'
                          : tipoPagoIdAutomatico === 4
                            ? 'MIXTO'
                            : 'OTRO',
            });
        }

        // ✅ NUEVO (2026-05-03): Actualizar monto_pagado_inicial con la suma de pagos desglosados
        if (totalPagado > 0) {
            setData('monto_pagado_inicial', totalPagado);

            console.log('💰 [VentaForm] Monto pagado (desglose) actualizado:', {
                efectivo,
                transferencia,
                total_pagado: totalPagado,
                cambio: totalPagado - data.total,
            });
        } else if (totalPagado === 0 && data.monto_pagado_inicial > 0) {
            // Si ambos inputs se vacían, resetear monto_pagado_inicial a 0
            setData('monto_pagado_inicial', 0);

            console.log('💰 [VentaForm] Monto pagado reseteado (inputs vacíos)');
        }
    }, [isFarmacia, montoEfectivo, montoTransferencia, data.monto_pagado_inicial]);

    useEffect(() => {}, [data.requiere_envio, data.direccion_cliente_id]);

    // ✅ NUEVO: Guardar automáticamente en localStorage con debounce
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isEditing) return; // No guardar si estamos editando una venta existente

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            try {
                const datosAGuardar = {
                    data,
                    detallesWithProducts,
                    clienteValue,
                    clienteDisplay,
                    clienteSeleccionado,
                    manuallySelectedTipoPrecio,
                };
                localStorage.setItem('venta-create-draft', JSON.stringify(datosAGuardar));
                // console.log('✅ Venta guardada en localStorage');
            } catch (error) {
                console.error('❌ Error guardando venta en localStorage:', error);
            }
        }, 1000); // Debounce de 1 segundo

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [data, detallesWithProducts, clienteValue, clienteDisplay, clienteSeleccionado, manuallySelectedTipoPrecio, isEditing]);

    // ✅ NUEVO: Restaurar datos del localStorage al cargar
    useEffect(() => {
        if (isEditing) return; // No restaurar si estamos editando una venta existente

        const datosGuardados = localStorage.getItem('venta-create-draft');
        if (datosGuardados) {
            try {
                const parsed = JSON.parse(datosGuardados);
                // Restaurar datos del formulario
                if (parsed.data) {
                    Object.keys(parsed.data).forEach((key: string) => {
                        setData(key as any, parsed.data[key]);
                    });
                }

                // Restaurar detalles
                if (parsed.detallesWithProducts && parsed.detallesWithProducts.length > 0) {
                    setDetallesWithProducts(parsed.detallesWithProducts);
                }

                // Restaurar cliente
                if (parsed.clienteValue !== null) {
                    setClienteValue(parsed.clienteValue);
                }
                if (parsed.clienteDisplay) {
                    setClienteDisplay(parsed.clienteDisplay);
                }
                if (parsed.clienteSeleccionado) {
                    setClienteSeleccionado(parsed.clienteSeleccionado);
                }

                // Restaurar selecciones manuales de tipo de precio
                if (parsed.manuallySelectedTipoPrecio) {
                    setManuallySelectedTipoPrecio(parsed.manuallySelectedTipoPrecio);
                }

                NotificationService.success('✅ Venta restaurada desde borrador anterior');
            } catch (error) {
                console.error('❌ Error restaurando venta desde localStorage:', error);
            }
        }
    }, []); // Solo ejecutar al montar el componente

    // ✅ NUEVO (2026-08-24): Auto-seleccionar cliente GENERAL al montar si está disponible
    useEffect(() => {
        if (isEditing) return; // No aplicar si estamos editando
        if (data.cliente_id && data.cliente_id !== 0) return; // No cambiar si ya hay uno seleccionado

        if (cliente_general && cliente_general.id) {
            console.log('✅ Auto-seleccionando cliente GENERAL:', cliente_general);
            setData('cliente_id', cliente_general.id);
            setClienteValue(cliente_general.id);
            setClienteDisplay(cliente_general.nombre + (cliente_general.nit ? ` (${cliente_general.nit})` : ''));
            setClienteSeleccionado(cliente_general as Cliente);
        }
    }, []); // Solo ejecutar al montar

    // Inicializar detalles con productos y combo items map
    useEffect(() => {
        if (venta?.detalles) {
            setDetallesWithProducts(
                venta.detalles.map((d) => ({
                    id: d.id,
                    producto_id: d.producto_id,
                    cantidad: d.cantidad,
                    precio_unitario: d.precio_unitario,
                    descuento: d.descuento || 0,
                    subtotal: d.subtotal,
                    producto: d.producto,
                })),
            );

            // ✅ NUEVO: Inicializar comboItemsMap desde combo_items_seleccionados guardados
            const nuevoComboMap: Record<number, any[]> = {};
            venta.detalles.forEach((d, index) => {
                if ((d.producto as any)?.es_combo && d.combo_items_seleccionados?.length) {
                    // Convertir combo_items_seleccionados de vuelta al formato de combo_items para el mapa
                    const comboItemsDelDB = d.combo_items_seleccionados.map((item: any) => ({
                        id: item.combo_item_id,
                        producto_id: item.producto_id,
                        cantidad: item.cantidad,
                        incluido: item.incluido !== false,
                    }));
                    nuevoComboMap[index] = comboItemsDelDB;

                    /* console.log(`📦 [Inicializar venta] Combo desde DB (index ${index}):`, {
                        producto_id: d.producto_id,
                        items: comboItemsDelDB
                    }); */
                }
            });

            if (Object.keys(nuevoComboMap).length > 0) {
                setComboItemsMap(nuevoComboMap);
            }
        }
    }, [venta]);

    // Sincronizar el estado del InputSearch con los datos del formulario
    useEffect(() => {
        if (data.cliente_id !== clienteValue) {
            setClienteValue(data.cliente_id);
        }
    }, [data.cliente_id, clienteValue]);

    // Inicializar el display del cliente cuando se carga la venta existente
    useEffect(() => {
        if (venta?.cliente && !clienteDisplay) {
            setClienteDisplay(venta.cliente.nombre + (venta.cliente.nit ? ` (${venta.cliente.nit})` : ''));
            setClienteValue(venta.cliente.id);
            setClienteSeleccionado(venta.cliente);
        }
    }, [venta?.cliente, clienteDisplay]);

    // ✅ OPTIMIZADO (2026-08-26): Usar direcciones de búsqueda si están disponibles, sino fetch separado
    // Antes: Siempre hacía fetch a /api/clientes/{id}
    // Ahora: Primero intenta usar direcciones que vinieron en la búsqueda (clienteRaw)
    //        Solo si no están disponibles, hace fetch como fallback
    useEffect(() => {
        if (data.cliente_id && data.cliente_id !== 0 && typeof data.cliente_id === 'number') {
            setCargandoDirecciones(true);

            // ✅ PRIMER INTENTO: Usar direcciones que ya vienen de la búsqueda
            if (clienteRaw?.direcciones && Array.isArray(clienteRaw.direcciones)) {
                console.log('✅ [DIRECCIONES] Usando direcciones de búsqueda (NO fetch separado):', clienteRaw.direcciones);
                const direccionesActivas = clienteRaw.direcciones.filter((d: any) => d.activa !== false);
                setDireccionesDisponibles(direccionesActivas);
                setCargandoDirecciones(false);

                // Auto-seleccionar dirección si no hay una seleccionada
                if (!data.direccion_cliente_id && direccionesActivas.length > 0) {
                    const direccionPrincipal = direccionesActivas.find((d: any) => d.es_principal);
                    if (direccionPrincipal) {
                        console.log('✅ Auto-seleccionando dirección principal:', direccionPrincipal);
                        setData('direccion_cliente_id', direccionPrincipal.id);
                    } else if (direccionesActivas.length === 1) {
                        console.log('✅ Auto-seleccionando única dirección:', direccionesActivas[0]);
                        setData('direccion_cliente_id', direccionesActivas[0].id);
                    }
                }
                return;
            }

            // ✅ FALLBACK: Si no vienen direcciones en búsqueda, hacer fetch separado
            console.log('⚠️ [DIRECCIONES] clienteRaw no tiene direcciones, haciendo fetch...');
            const cargarClienteYDirecciones = async () => {
                try {
                    const response = await fetch(`/api/clientes/${data.cliente_id}`, {
                        headers: {
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data) {
                            // ✅ Guardar cliente completo
                            setClienteSeleccionado(result.data);

                            // ✅ Procesar direcciones
                            if (result.data?.direcciones) {
                                const direccionesActivas = result.data.direcciones.filter((d: any) => d.activa !== false);
                                console.log('📍 [DIRECCIONES CARGADAS] Estructura completa:', direccionesActivas);
                                setDireccionesDisponibles(direccionesActivas);

                                // ✅ Auto-seleccionar dirección si no hay una seleccionada
                                if (!data.direccion_cliente_id && direccionesActivas.length > 0) {
                                    const direccionPrincipal = direccionesActivas.find((d: any) => d.es_principal);
                                    if (direccionPrincipal) {
                                        console.log('✅ Auto-seleccionando dirección principal:', direccionPrincipal);
                                        setData('direccion_cliente_id', direccionPrincipal.id);
                                    } else if (direccionesActivas.length === 1) {
                                        const unica = direccionesActivas[0];
                                        console.log('✅ Auto-seleccionando única dirección:', unica);
                                        setData('direccion_cliente_id', unica.id);
                                    }
                                }
                            } else {
                                setDireccionesDisponibles([]);
                            }
                        }
                    }
                } catch (error) {
                    console.error('❌ Error cargando cliente y direcciones:', error);
                    setDireccionesDisponibles([]);
                } finally {
                    setCargandoDirecciones(false);
                }
            };
            cargarClienteYDirecciones();
        } else {
            setDireccionesDisponibles([]);
            setCargandoDirecciones(false);
        }
    }, [data.cliente_id, clienteRaw]);

    // ✅ REMOVIDO (2026-08-24): Búsqueda automática de cliente GENERAL
    // Optimización: Los clientes se buscan lazy via /api/ventas/search/clientes
    // El usuario debe buscar y seleccionar el cliente manualmente
    // Esto reduce tamaño inicial de página en ~10-20 KB

    // ✅ NUEVO: Sincronizar política de pago cuando se selecciona tipo de pago CREDITO
    useEffect(() => {
        // Acceder directamente a tipos_pago desde props sin usar tiposPagoSeguro para evitar problemas de dependencias
        const tiposDisponibles = tipos_pago || [];
        const tipoPagoSeleccionado = tiposDisponibles.find((t: any) => t.id === data.tipo_pago_id);

        if (tipoPagoSeleccionado?.codigo === 'CREDITO') {
            // Si es CREDITO, cambiar política de pago a CREDITO
            setData('politica_pago', 'CREDITO');
            // console.log(`💳 Tipo de pago CREDITO seleccionado - Política de pago actualizada a CREDITO`);
        } else if (data.politica_pago === 'CREDITO') {
            // Si no es CREDITO pero la política era CREDITO, revertir a ANTICIPADO_100
            setData('politica_pago', 'ANTICIPADO_100');
            // console.log(`💵 Tipo de pago no-CREDITO seleccionado - Política de pago revertida a ANTICIPADO_100`);
        }
    }, [data.tipo_pago_id]);

    // Función para manejar la creación de cliente
    const handleCreateCliente = (searchQuery: string) => {
        setClienteSearchQuery(searchQuery);
        setShowCreateClienteModal(true);
    };

    // Función para manejar cuando se crea un cliente exitosamente
    const handleClienteCreated = (cliente: Cliente) => {
        // Actualizar el valor del cliente en el formulario
        setData('cliente_id', cliente.id);

        // Actualizar el estado del InputSearch
        setClienteValue(cliente.id);
        setClienteDisplay(cliente.nombre + (cliente.telefono ? ` (${cliente.telefono})` : ''));

        // Crear una descripción completa del cliente para mostrar en la notificación
        const descripcionCliente = [
            cliente.nombre,
            cliente.nit ? `NIT/CI: ${cliente.nit}` : '',
            cliente.telefono ? `Tel: ${cliente.telefono}` : '',
            cliente.email ? `Email: ${cliente.email}` : '',
        ]
            .filter(Boolean)
            .join(' • ');

        // Mostrar notificación detallada del cliente creado y seleccionado
        try {
            NotificationService.success(`✅ Cliente creado y seleccionado: ${descripcionCliente}`);
        } catch (error) {
            console.error('Error en NotificationService:', error);
            // Fallback: mostrar mensaje básico
        }

        // Limpiar la query de búsqueda ya que ahora tenemos el cliente seleccionado
        setClienteSearchQuery('');
    };

    const addProductToDetail = (producto: Producto) => {
        // Verificar si el producto ya está en los detalles
        const existingDetail = detallesWithProducts.find((d) => d.producto_id === producto.id);

        if (existingDetail) {
            // ✅ NUEVO: En lugar de rechazar, incrementar la cantidad
            const updatedDetalles = detallesWithProducts.map((d) => {
                if (d.producto_id === producto.id) {
                    const newCantidad = d.cantidad + 1;
                    const newSubtotal = newCantidad * d.precio_unitario - d.descuento;
                    return {
                        ...d,
                        cantidad: newCantidad,
                        subtotal: newSubtotal,
                        // ✅ NUEVO: Preservar información de conversiones y unidad_venta_id
                        es_fraccionado: d.es_fraccionado || (producto as any).es_fraccionado || false,
                        conversiones: d.conversiones || (producto as any).conversiones || [],
                        unidad_venta_id: d.unidad_venta_id, // ✅ PRESERVADO: Mantener la unidad_venta_id actual
                    };
                }
                return d;
            });

            setDetallesWithProducts(updatedDetalles);

            // Recalcular precios según rangos con la nueva cantidad
            // ✅ COMENTADO: Deshabilitado temporalmente para evitar cambios automáticos de precio
            // ✅ NO calcular si el cliente es GENERAL (no se deben aplicar rangos)
            // ✅ NUEVO (2026-07-03): EXCLUIR productos con tipo_precio_id === null (OTROS)
            if (clienteSeleccionado?.codigo_cliente !== 'GENERAL') {
                precioRango.calcularCarritoDebounced(
                    updatedDetalles
                        .filter((d) => d.tipo_precio_id !== null) // ✅ EXCLUIR productos con OTROS
                        .map((d) => ({
                            producto_id: d.producto_id,
                            cantidad: d.cantidad,
                            tipo_precio_id: d.tipo_precio_id,
                        })),
                );
            }

            calculateTotals(updatedDetalles);
            calculatePeso(updatedDetalles);

            // Mostrar notificación de incremento
            // NotificationService.success(`✅ ${producto.nombre} - Cantidad: ${existingDetail.cantidad + 1}`);
            return;
        }

        // ✅ NUEVO: Determinar unidad_venta_id inicial - usar primera conversión si es fraccionado
        const conversiones = (producto as any).conversiones || [];
        const esProductoFraccionado = (producto as any).es_fraccionado && conversiones.length > 0;
        const unidadVentaInicial = esProductoFraccionado ? conversiones[0].unidad_destino_id : (producto as any).unidad_medida_id;

        // ✅ MODIFICADO (2026-02-17): Usar tipo_precio_id que viene del backend PRIMERO
        // El backend devuelve tipo_precio_id_recomendado basado en el código VENTA
        const tipoPrecioIdRecomendado = (producto as any).tipo_precio_id_recomendado || tipoPrecioLicoreriId;
        const tipoPrecioNombreRecomendado = (producto as any).tipo_precio_nombre_recomendado || 'LICORERIA';

        // ✅ NUEVO (2026-02-17): Obtener el precio específico del tipo_precio_recomendado ANTES de usarlo
        // En lugar de usar precio_venta genérico, buscar el precio específico del tipo_precio_id
        const precioDelTipoPrecio = (producto as any).precios?.find((p: any) => p.tipo_precio_id === tipoPrecioIdRecomendado)?.precio;

        // ✅ DEBUG: Loguear los IDs de precios disponibles para verificar coincidencias
        const preciosConIds =
            (producto as any).precios?.map((p: any) => ({
                nombre: p.nombre,
                tipo_precio_id: p.tipo_precio_id,
            })) || [];
        // ✅ NUEVO (2026-02-17): Calcular precio según la unidad de venta inicial
        // Usar el precio específico del tipo_precio_recomendado, no el genérico precio_venta
        const precioBase = precioDelTipoPrecio || producto.precio_venta || 0;
        let precioUnitarioInicial = precioBase;
        if (esProductoFraccionado && conversiones.length > 0) {
            const conversion = conversiones[0];
            if (conversion.factor_conversion > 0) {
                precioUnitarioInicial = precioBase / conversion.factor_conversion;
            }
        }

        const newDetail: DetalleProducto = {
            producto_id: producto.id,
            cantidad: 1,
            precio_unitario: precioUnitarioInicial,
            descuento: 0,
            subtotal: precioUnitarioInicial,
            producto: producto,
            // ✅ NUEVO: Información de conversiones para productos fraccionados
            es_fraccionado: (producto as any).es_fraccionado || false,
            unidad_medida_id: (producto as any).unidad_medida_id,
            unidad_medida_nombre: (producto as any).unidad_medida_nombre,
            conversiones: (producto as any).conversiones || [],
            unidad_venta_id: unidadVentaInicial, // ✅ MODIFICADO: Usa primera conversión si es fraccionado
            // ✅ MODIFICADO: Usar tipo_precio_id que viene del backend
            tipo_precio_id: tipoPrecioIdRecomendado,
            tipo_precio_nombre: tipoPrecioNombreRecomendado,
            // ✅ CRÍTICO: Pasar propiedades de tipo_precio recomendado para que ProductosTable pueda usarlas en el select inicial
            tipo_precio_id_recomendado: (producto as any).tipo_precio_id_recomendado,
            tipo_precio_nombre_recomendado: (producto as any).tipo_precio_nombre_recomendado,
        };

        // ✅ MODIFICADO: Agregar el producto al INICIO de la lista, no al final
        const newDetalles = [newDetail, ...detallesWithProducts];
        setDetallesWithProducts(newDetalles);

        // ✅ NUEVO (2026-07-03): Limpiar manuallySelectedTipoPrecio del nuevo producto para que use el tipo de precio por defecto
        // Esto asegura que respete la regla: GENERAL → LICORERIA, OTRO CLIENTE → VENTA
        // ✅ REFACTORIZADO (2026-07-03): Usar producto_id en lugar de índice
        setManuallySelectedTipoPrecio((prev) => {
            const updated = { ...prev };
            delete updated[producto.id]; // Limpiar la entrada del nuevo producto por su producto_id
            return updated;
        });

        // 🔑 NUEVO: Calcular precios según rangos
        // ✅ COMENTADO: Deshabilitado temporalmente para evitar cambios automáticos de precio
        // ✅ NO calcular si el cliente es GENERAL (no se deben aplicar rangos)
        // ✅ NUEVO (2026-07-03): EXCLUIR productos con tipo_precio_id === null (OTROS/Precio Personalizado)
        if (clienteSeleccionado?.codigo_cliente !== 'GENERAL') {
            precioRango.calcularCarritoDebounced(
                newDetalles
                    .filter((d) => d.tipo_precio_id !== null) // ✅ EXCLUIR productos con OTROS
                    .map((d) => ({
                        producto_id: d.producto_id,
                        cantidad: d.cantidad,
                        tipo_precio_id: d.tipo_precio_id,
                    })),
            );
        }

        calculateTotals(newDetalles);
        calculatePeso(newDetalles);
    };

    // ✅ NUEVO: Método para cambiar unidad y precio juntos (sin separar)
    const updateDetailUnidadConPrecio = (index: number, unidadDestinoId: number, nuevoPrecio: number) => {
        const updatedDetalles = [...detallesWithProducts];

        // Actualizar ambos campos a la vez
        updatedDetalles[index] = {
            ...updatedDetalles[index],
            unidad_venta_id: unidadDestinoId,
            precio_unitario: nuevoPrecio,
            // Recalcular subtotal con el nuevo precio
            subtotal: updatedDetalles[index].cantidad * nuevoPrecio - (updatedDetalles[index].descuento || 0),
        };

        console.log(`🔄 [updateDetailUnidadConPrecio] Detalle #${index}:`, {
            unidad_venta_id: unidadDestinoId,
            precio_unitario: nuevoPrecio,
            subtotal: updatedDetalles[index].subtotal,
        });

        setDetallesWithProducts(updatedDetalles);
        calculateTotals(updatedDetalles);
        calculatePeso(updatedDetalles);
    };

    // ✅ CRÍTICO (2026-07-03): Función para actualizar múltiples campos de un detalle de una sola vez
    // Esto evita el problema de "stale closure" donde cada updateDetail usa estado anterior
    const updateDetailMultiple = (index: number, updates: Record<string, number | string | null>) => {
        const updatedDetalles = [...detallesWithProducts];

        // Aplicar todos los cambios al detalle
        Object.entries(updates).forEach(([field, value]) => {
            const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value === null ? null : value;
            (updatedDetalles[index] as any)[field] = numericValue;
        });

        // Recalcular subtotal si fue necesario
        if (updates.cantidad || updates.precio_unitario || updates.descuento) {
            const cantidad =
                updates.cantidad !== undefined
                    ? typeof updates.cantidad === 'string'
                        ? parseFloat(updates.cantidad)
                        : updates.cantidad
                    : updatedDetalles[index].cantidad;
            const precio =
                updates.precio_unitario !== undefined
                    ? typeof updates.precio_unitario === 'string'
                        ? parseFloat(updates.precio_unitario)
                        : updates.precio_unitario
                    : updatedDetalles[index].precio_unitario;
            const descuento =
                updates.descuento !== undefined
                    ? typeof updates.descuento === 'string'
                        ? parseFloat(updates.descuento)
                        : updates.descuento
                    : updatedDetalles[index].descuento;

            updatedDetalles[index].subtotal = Number(cantidad) * Number(precio) - Number(descuento);
        }

        /* console.log(`💰 [updateDetailMultiple] Actualizando detalle #${index} con:`, {
            updates,
            resultado: {
                precio_unitario: updatedDetalles[index].precio_unitario,
                tipo_precio_id: updatedDetalles[index].tipo_precio_id,
                tipo_precio_nombre: updatedDetalles[index].tipo_precio_nombre
            }
        }); */

        setDetallesWithProducts(updatedDetalles);
        calculateTotals(updatedDetalles);
        calculatePeso(updatedDetalles);
    };

    const updateDetail = (index: number, field: keyof DetalleVentaFormData, value: number | string) => {
        const updatedDetalles = [...detallesWithProducts];
        const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
        updatedDetalles[index] = { ...updatedDetalles[index], [field]: numericValue };

        // Recalcular subtotal del detalle
        if (field === 'cantidad' || field === 'precio_unitario' || field === 'descuento') {
            const cantidad = field === 'cantidad' ? numericValue : updatedDetalles[index].cantidad;
            const precio = field === 'precio_unitario' ? numericValue : updatedDetalles[index].precio_unitario;
            const descuento = field === 'descuento' ? numericValue : updatedDetalles[index].descuento;

            updatedDetalles[index].subtotal = Number(cantidad) * Number(precio) - Number(descuento);
        }

        // ✅ DEBUG: Loguear cambios en detalles
        /* if (field === 'unidad_venta_id') {
            console.log(`🔄 [updateDetail] Cambio de unidad_venta_id para detalle #${index}:`, {
                anterior: detallesWithProducts[index].unidad_venta_id,
                nuevo: numericValue,
                precio_unitario: updatedDetalles[index].precio_unitario,
                es_fraccionado: (updatedDetalles[index] as any).es_fraccionado,
                detalle_antes: detallesWithProducts[index],
                detalle_despues: updatedDetalles[index]
            });
        } */

        // ✅ CRÍTICO: Log del estado actual antes de actualizar
        if (field === 'precio_unitario') {
            console.log(`💰 [updateDetail] ANTES - Precio #${index}:`, {
                precio_anterior: detallesWithProducts[index].precio_unitario,
                precio_nuevo: numericValue,
                tipo_precio_id: updatedDetalles[index].tipo_precio_id,
                tipo_precio_nombre: updatedDetalles[index].tipo_precio_nombre,
                detalles_array: detallesWithProducts.map((d, i) => (i === index ? '🎯 THIS' : '✓')),
            });
        }

        setDetallesWithProducts(updatedDetalles);

        // ✅ CRÍTICO: Log del estado después de actualizar
        if (field === 'precio_unitario') {
            console.log(`💰 [updateDetail] DESPUÉS - Precio #${index}:`, {
                precio_guardado: updatedDetalles[index].precio_unitario,
                tipo_precio_id: updatedDetalles[index].tipo_precio_id,
                tipo_precio_nombre: updatedDetalles[index].tipo_precio_nombre,
            });
        }

        console.log(`📊 [updateDetail] Estado ANTES de setDetallesWithProducts, detalle #${index}:`, {
            field,
            valor_nuevo: numericValue,
            unidad_venta_id: updatedDetalles[index].unidad_venta_id,
            es_fraccionado: (updatedDetalles[index] as any).es_fraccionado,
            all_detalles: updatedDetalles,
        });

        console.log(`📊 [updateDetail] Estado DESPUÉS de setDetallesWithProducts, detalle #${index}:`, {
            field,
            valor_nuevo: numericValue,
            unidad_venta_id_guardado: updatedDetalles[index].unidad_venta_id,
        });

        // ✅ MODIFICADO: Si cambió la cantidad O unidad de venta, recalcular precios por rango
        // PERO: No recalcular si cambió precio_unitario (es cambio manual del usuario)
        // y tampoco si cambió unidad_venta_id (el usuario está seleccionando otra unidad)
        const esProductoFraccionado = (updatedDetalles[index] as any).es_fraccionado;
        const esUnidadOPrecioFraccionado = esProductoFraccionado && (field === 'unidad_venta_id' || field === 'precio_unitario');

        if (field === 'cantidad' && !esUnidadOPrecioFraccionado) {
            console.log(`📊 [updateDetail] Recalculando rango para cantidad de producto ${updatedDetalles[index].producto_id}`);
            // ✅ COMENTADO: Deshabilitado temporalmente para evitar cambios automáticos de precio
            // ✅ NO calcular si el cliente es GENERAL (no se deben aplicar rangos)
            // ✅ NUEVO (2026-07-03): EXCLUIR productos con tipo_precio_id === null (OTROS)
            if (clienteSeleccionado?.codigo_cliente !== 'GENERAL') {
                precioRango.calcularCarritoDebounced(
                    updatedDetalles
                        .filter((d) => d.tipo_precio_id !== null) // ✅ EXCLUIR productos con OTROS
                        .map((d) => ({
                            producto_id: d.producto_id,
                            cantidad: d.cantidad,
                            tipo_precio_id: d.tipo_precio_id,
                        })),
                );
            }
        }

        calculateTotals(updatedDetalles);
        calculatePeso(updatedDetalles);
    };

    const removeDetail = (index: number) => {
        const updatedDetalles = detallesWithProducts.filter((_, i) => i !== index);
        setDetallesWithProducts(updatedDetalles);

        // ✅ NUEVO: Limpiar el estado de selección manual para el índice removido
        setManuallySelectedTipoPrecio((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });

        // 🔑 NUEVO: Recalcular rangos cuando se elimina un producto
        // ✅ COMENTADO: Deshabilitado temporalmente para evitar cambios automáticos de precio
        // ✅ NO calcular si el cliente es GENERAL (no se deben aplicar rangos)
        // ✅ NUEVO (2026-07-03): EXCLUIR productos con tipo_precio_id === null (OTROS)
        if (updatedDetalles.length > 0 && clienteSeleccionado?.codigo_cliente !== 'GENERAL') {
            precioRango.calcularCarritoDebounced(
                updatedDetalles
                    .filter((d) => d.tipo_precio_id !== null) // ✅ EXCLUIR productos con OTROS
                    .map((d) => ({
                        producto_id: d.producto_id,
                        cantidad: d.cantidad,
                        tipo_precio_id: d.tipo_precio_id,
                    })),
            );
        }

        calculateTotals(updatedDetalles);
        calculatePeso(updatedDetalles);
    };

    // ✅ MEMOIZADO: Callbacks para ProductosTable (evitar re-renders infinitos)
    // ✅ REFACTORIZADO (2026-07-03): Recibir producto_id en lugar de index
    const handleManualTipoPrecioChange = useCallback((productoId: number) => {
        setManuallySelectedTipoPrecio((prev) => ({
            ...prev,
            [productoId]: true,
        }));
    }, []);

    const handleComboItemsChange = useCallback((detailIndex: number, items: any[]) => {
        setComboItemsMap((prev) => ({
            ...prev,
            [detailIndex]: items,
        }));
        console.log(`🔄 [create.tsx] Items del combo actualizado (índice ${detailIndex}):`, items);
    }, []);

    const handleDetallesActualizados = useCallback((nuevosDetalles: DetalleProducto[]) => {
        console.log('🔄 [create.tsx] ProductosTable notificó cambios en detalles por rangos');
        setDetallesWithProducts(nuevosDetalles);
        calculateTotals(nuevosDetalles);
        calculatePeso(nuevosDetalles);
    }, []);

    const calculateTotals = (detalles: DetalleProducto[]) => {
        // ✅ SIMPLIFICADO: Usar directamente el subtotal ya calculado en cada detalle
        let subtotal = 0;

        detalles.forEach((detalle) => {
            subtotal += detalle.subtotal || 0;
        });

        const descuentoGeneral = data.descuento || 0;
        // Por ahora no se suma impuesto al total
        const total = subtotal - descuentoGeneral;

        setData((prev) => ({
            ...prev,
            subtotal: subtotal,
            total: total,
        }));
    };

    /**
     * ✅ NUEVO: Calcular peso total de la venta
     * Fórmula: pesoTotal = Σ(cantidad × peso_producto)
     * Mismo patrón que calculateTotals()
     */
    const calculatePeso = (detalles: DetalleProducto[]) => {
        let pesoTotal = 0;

        // 🔑 Iterar cada detalle y sumar: cantidad * peso_producto
        detalles.forEach((detalle) => {
            const peso = detalle.producto?.peso || 0; // Peso del producto en kg
            const cantidad = detalle.cantidad || 0; // Cantidad vendida

            // Sumar: cantidad × peso
            pesoTotal += Number(cantidad) * Number(peso);
        });

        setData((prev) => ({
            ...prev,
            peso_total_estimado: pesoTotal,
        }));
    };

    // ✅ NUEVO: Función para limpiar manualmente el borrador de localStorage
    const limpiarBorrador = () => {
        const confirmar = window.confirm('¿Deseas limpiar el borrador? Esta acción no se puede deshacer.');
        if (!confirmar) return;

        try {
            localStorage.removeItem('venta-create-draft');
            // Resetear estados
            reset();
            setDetallesWithProducts([]);
            setClienteSeleccionado(null);
            setClienteValue(null);
            setClienteDisplay('');
            setManuallySelectedTipoPrecio({});
            NotificationService.success('Borrador de venta eliminado');
        } catch (error) {
            console.error('Error limpiando borrador:', error);
            NotificationService.error('Error al limpiar el borrador');
        }
    };

    // ✅ NUEVO (2026-05-08): Verificar si es farmacia y todos los productos permiten venta sin stock
    const puedeVenderSinStock = (): boolean => {
        if (!es_farmacia) return false;

        // Si es farmacia, verificar que TODOS los productos permitan venta sin stock
        return detallesWithProducts.every((detalle) => (detalle.producto as any)?.permite_venta_sin_stock === true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ NUEVO: Permitir stock insuficiente para créditos O farmacias con productos sin stock
        const tipoPagoSeleccionado = tipos_pago?.find((t: any) => t.id === data.tipo_pago_id);
        const isCreditoPayment = tipoPagoSeleccionado?.codigo === 'CREDITO';
        const permiteSinStockFarmacia = puedeVenderSinStock(); // ✅ NUEVO (2026-05-08)

        // Validar stock antes de continuar (SOLO si NO es crédito Y NO es farmacia con productos sin stock)
        if (!stockValido && !isCreditoPayment && !permiteSinStockFarmacia) {
            NotificationService.error('No se puede proceder con la venta debido a stock insuficiente');
            return;
        }

        // Validar usando el servicio
        const dataToValidate = {
            ...data,
            detalles: detallesWithProducts.map((d) => ({
                id: d.id,
                producto_id: d.producto_id,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario,
                descuento: d.descuento,
                subtotal: d.subtotal,
            })),
        };
        const validationErrors = await ventasService.validateData(dataToValidate);
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => NotificationService.error(error));
            return;
        }

        // Mostrar modal de vista previa
        setShowPreviewModal(true);
    };

    const handleConfirmSubmit = async () => {
        // ✅ NUEVO: Prevenir múltiples clicks estableciendo loading state
        setIsSubmitting(true);
        setShowPreviewModal(false);

        // ✅ NUEVO: Verificar si el tipo de pago seleccionado es CREDITO y ajustar política de pago
        const tipoPagoSeleccionado = tipos_pago?.find((t: any) => t.id === data.tipo_pago_id);
        const politicaPagoFinal = tipoPagoSeleccionado?.codigo === 'CREDITO' ? 'CREDITO' : (data.politica_pago ?? 'ANTICIPADO_100');

        console.log(`🔍 handleConfirmSubmit - Verificación de tipo de pago:`, {
            tipo_pago_id: data.tipo_pago_id,
            tipoPagoSeleccionado: tipoPagoSeleccionado?.nombre,
            codigoTipoPago: tipoPagoSeleccionado?.codigo,
            politicaPagoOriginal: data.politica_pago,
            politicaPagoFinal,
        });

        const submitData = {
            ...data,
            // ✅ IMPORTANTE: Asegurar que estos campos se envíen explícitamente
            requiere_envio: data.requiere_envio ?? false,
            direccion_cliente_id: data.requiere_envio ? (data.direccion_cliente_id ?? null) : null,
            tipo_pago_id: data.tipo_pago_id ?? 1, // ✅ NUEVO: Tipo de pago seleccionado
            politica_pago: politicaPagoFinal, // ✅ MODIFICADO: Usar politica_pago calculada
            estado_pago: data.estado_pago ?? 'PAGADO',
            preventista_id: data.preventista_id ?? null, // ✅ ASEGURAR: Null si no está seleccionado
            detalles: detallesWithProducts.map((d, detailIndex) => {
                // ✅ MODIFICADO: Usar siempre d.precio_unitario (ya contiene valor editado manualmente o del tipo de precio)
                // NO usar precioRango para no sobrescribir ediciones manuales
                const precioFinal = d.precio_unitario;
                const subtotalFinal = Number(d.cantidad) * Number(precioFinal) - Number(d.descuento);

                const detalle: any = {
                    id: d.id,
                    producto_id: d.producto_id,
                    cantidad: d.cantidad,
                    precio_unitario: precioFinal,
                    descuento: d.descuento,
                    subtotal: subtotalFinal,
                    // ✅ NUEVO: Enviar información de fraccionado para que backend calcule correctamente
                    es_fraccionado: d.es_fraccionado || false,
                    unidad_venta_id: d.unidad_venta_id || undefined,
                    // ✅ NUEVO: Enviar tipo de precio seleccionado para guardar en BD
                    tipo_precio_id: d.tipo_precio_id || undefined,
                    tipo_precio_nombre: d.tipo_precio_nombre || undefined,
                };

                // ✅ NUEVO: Si es combo, agregar items seleccionados
                if ((d.producto as any)?.es_combo) {
                    const comboItems = comboItemsMap[detailIndex] || (d.producto as any).combo_items || [];
                    // ✅ IMPORTANTE: Incluir cantidad de cada item para que aparezca en impresión
                    detalle.combo_items_seleccionados = comboItems.map((item: any) => ({
                        combo_item_id: item.id,
                        producto_id: item.producto_id,
                        cantidad: item.cantidad || 0, // ✅ NUEVO: Incluir cantidad del item
                        precio_unitario: item.precio_unitario || item.producto?.precio_venta || 0, // ✅ NUEVO (2026-06-02): Precio del componente
                        incluido: item.incluido !== false, // true si está incluido, false si está excluido
                    }));

                    console.log(`📦 [handleConfirmSubmit] Combo ${d.producto?.nombre}:`, {
                        producto_id: d.producto_id,
                        cantidad_combo: d.cantidad,
                        total_items: comboItems.length,
                        items_incluidos: comboItems.filter((i: any) => i.incluido !== false).length,
                        items_almacenados: comboItems.map((i: any) => ({
                            id: i.id,
                            producto_id: i.producto_id,
                            cantidad: i.cantidad,
                            incluido: i.incluido,
                        })),
                        detalles_enviados: detalle.combo_items_seleccionados,
                    });
                }

                return detalle;
            }),
        };

        // ✅ NUEVO (2026-05-03): Preparar pagos según es_farmacia
        const pagosAEnviar = [];

        if (es_farmacia) {
            // 🏥 FARMACIA: Desglose de Efectivo + Transferencia
            const efectivo = Number(montoEfectivo) || 0;
            const transferencia = Number(montoTransferencia) || 0;

            if (efectivo > 0) {
                pagosAEnviar.push({
                    tipo_pago_id: 1, // EFECTIVO
                    monto: efectivo,
                });
            }

            if (transferencia > 0) {
                pagosAEnviar.push({
                    tipo_pago_id: 2, // TRANSFERENCIA/QR
                    monto: transferencia,
                });
            }

            console.log('💳 [VentaForm] Pagos desglosados (FARMACIA) a enviar:', {
                cantidad_formas_pago: pagosAEnviar.length,
                detalle_pagos: pagosAEnviar.map((p) => ({
                    tipo_pago_id: p.tipo_pago_id,
                    tipo_pago: p.tipo_pago_id === 1 ? 'EFECTIVO' : p.tipo_pago_id === 2 ? 'TRANSFERENCIA/QR' : 'OTRO',
                    monto: p.monto,
                })),
                total_pagado: pagosAEnviar.reduce((sum, p) => sum + p.monto, 0),
            });
        } else {
            // 🏪 NO FARMACIA: Monto único con tipo_pago_id seleccionado
            const montoPagado = Number(data.monto_pagado_inicial) || 0;

            if (montoPagado > 0 && data.tipo_pago_id) {
                pagosAEnviar.push({
                    tipo_pago_id: data.tipo_pago_id,
                    monto: montoPagado,
                });

                console.log('💳 [VentaForm] Pago único (NO FARMACIA) a enviar:', {
                    tipo_pago_id: data.tipo_pago_id,
                    tipo_pago_nombre:
                        data.tipo_pago_id === 1
                            ? 'EFECTIVO'
                            : data.tipo_pago_id === 2
                              ? 'TRANSFERENCIA/QR'
                              : data.tipo_pago_id === 3
                                ? 'CRÉDITO'
                                : data.tipo_pago_id === 4
                                  ? 'MIXTO'
                                  : 'OTRO',
                    monto: montoPagado,
                });
            }
        }

        if (pagosAEnviar.length > 0) {
            (submitData as any).pagos = pagosAEnviar;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const method = isEditing && venta ? 'PUT' : 'POST';
            const url = isEditing && venta ? `/ventas/${venta.id}` : '/ventas';

            console.log('🚚 [VentaForm] Estado final antes de enviar:', {
                requiere_envio: submitData.requiere_envio,
                direccion_cliente_id: submitData.direccion_cliente_id,
                cliente_id: submitData.cliente_id,
                entrega_id: submitData.entrega_id,
                politica_pago: submitData.politica_pago,
            });

            // ✅ NUEVO: Log detallado de lo que se envía al backend
            const requestBody = JSON.stringify(submitData);
            console.group(`📤 PETICIÓN AL BACKEND - ${method} ${url}`);
            console.log('Datos enviados (objeto):', submitData);
            console.log(
                'Detalles:',
                submitData.detalles.map((d, i) => ({
                    index: i,
                    producto_id: d.producto_id,
                    cantidad: d.cantidad,
                    precio_unitario: d.precio_unitario,
                    descuento: d.descuento,
                    subtotal: d.subtotal,
                    es_fraccionado: d.es_fraccionado,
                    unidad_venta_id: d.unidad_venta_id,
                })),
            );
            console.log('Totales:', {
                subtotal: submitData.subtotal,
                descuento: submitData.descuento,
                impuesto: submitData.impuesto,
                total: submitData.total,
            });
            console.log('JSON a enviar:', requestBody);
            console.groupEnd();

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                body: requestBody,
            });

            const result = await response.json();

            // ✅ NUEVO: Log de la respuesta del backend
            console.group(`📥 RESPUESTA DEL BACKEND - Status: ${response.status}`);
            console.log('Respuesta completa:', result);
            console.groupEnd();

            if (result.success && result.data?.id) {
                // ✅ ÉXITO: Mostrar notificación, limpiar formulario y mostrar modal de salida
                const ventaId = result.data.id;
                const mensaje = isEditing ? 'Venta actualizada exitosamente' : 'Venta creada exitosamente';

                console.group(`✅ VENTA CREADA EXITOSAMENTE`);
                console.log('ID:', result.data.id);
                console.log('Número:', result.data.numero);
                console.log('Total:', result.data.total);
                console.log('Datos completos:', result.data);
                console.groupEnd();

                NotificationService.success(mensaje);

                // ✅ NUEVO: Limpiar localStorage después de envío exitoso
                localStorage.removeItem('venta-create-draft');
                console.log('✅ Borrador de venta eliminado del localStorage');

                // ✅ Limpiar todo el formulario y estados
                reset(); // Limpiar datos del formulario
                setDetallesWithProducts([]); // Limpiar detalles de productos
                setClienteSeleccionado(null); // Limpiar cliente seleccionado
                setClienteValue(null); // Limpiar valor del cliente
                setClienteDisplay(''); // Limpiar display del cliente
                precioRango.reset(); // Limpiar estado del carrito de precios
                setMontoEfectivo(''); // Limpiar monto efectivo
                setMontoTransferencia(''); // Limpiar monto transferencia
                setPagos([]);

                // ✅ NUEVO: Guardar datos de la venta y mostrar modal de selección de salida
                setVentaCreada({
                    id: ventaId,
                    numero: result.data.numero,
                    fecha: result.data.fecha,
                });

                // ✅ NUEVO (2026-07-16): Detectar si hay prestables y abrir pantalla de préstamo
                (async () => {
                    try {
                        // Obtener detalles completos de la venta (incluyendo prestables)
                        const ventaCompleta = await fetch(`/api/ventas/${ventaId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                            },
                        }).then((res) => res.json());

                        if (ventaCompleta.success && ventaCompleta.data?.detalles) {
                            // Verificar si hay productos con prestables
                            if (tieneProductosPrestables(ventaCompleta.data.detalles)) {
                                console.log('✅ Detectados productos con prestables, abriendo pantalla de préstamo...');

                                // Calcular prestables para la venta
                                const prestables = calcularPrestamesParaVenta(ventaCompleta.data.detalles);

                                // Obtener código del cliente para determinar tipo de préstamo
                                const clienteCodigo = ventaCompleta.data.cliente?.codigo;

                                // ✅ DEBUG: Mostrar información del cliente
                                console.group('%c👥 CLIENTE INFORMACIÓN', 'color: #9c27b0; font-weight: bold; font-size: 12px');
                                console.log('ID:', ventaCompleta.data.cliente_id);
                                console.log('Nombre:', ventaCompleta.data.cliente?.nombre);
                                console.log('Código:', clienteCodigo);
                                console.log('Es EVENTO:', clienteCodigo === 'EVENTO');
                                console.groupEnd();

                                // Abrir pantalla de préstamo en nueva ventana
                                abrirPantallaPrestamoEnNuevaVentana(
                                    ventaCompleta.data.cliente_id,
                                    clienteCodigo,
                                    ventaId,
                                    prestables,
                                    ventaCompleta.data.direccion_cliente_id
                                );
                            }
                        }
                    } catch (error) {
                        console.error('⚠️ Error al detectar prestables:', error);
                        // No fallar el flujo si hay error al obtener detalles de prestables
                    }
                })();

                setShowOutputModal(true);
            } else {
                // ❌ ERROR: Mostrar mensaje y mantener formulario
                const errorMessage = result.message || 'Error al procesar la venta';

                // ✅ NUEVO: Log detallado del error del backend
                console.group(`❌ ERROR AL CREAR VENTA`);
                console.log('Status HTTP:', response.status, response.statusText);
                console.log('Mensaje:', result.message);
                console.log('Errores detallados:');
                if (result.errors) {
                    Object.entries(result.errors).forEach(([campo, mensajes]) => {
                        console.log(`  ${campo}:`, mensajes);
                    });
                }

                // ✅ NUEVO: Mostrar información de debug si está disponible
                if (result.debug) {
                    console.group('🔍 INFORMACIÓN DE DEBUG DEL BACKEND');
                    console.log('Detalles enviados:', result.debug.detalles_enviados);
                    console.log('Subtotal enviado:', result.debug.subtotal_enviado);
                    console.log('Total enviado:', result.debug.total_enviado);
                    console.groupEnd();
                }

                console.log('Respuesta completa:', result);
                console.groupEnd();

                // ✅ MEJORADO: Extraer mensajes específicos de los errores y mostrar en toast
                if (result.errors && Object.keys(result.errors).length > 0) {
                    // Si hay errores específicos por campo, mostrar el primero de cada campo
                    let primemerError = null;
                    Object.entries(result.errors).forEach(([campo, mensajes]: [string, any]) => {
                        if (Array.isArray(mensajes) && mensajes.length > 0) {
                            const mensaje = mensajes[0]; // Tomar el primer mensaje del campo
                            if (!primemerError) {
                                primemerError = mensaje;
                            }
                            // Log cada error
                            console.log(`❌ ${campo}:`, mensaje);
                        }
                    });

                    // Mostrar el primer error específico en el toast
                    if (primemerError) {
                        NotificationService.error(primemerError);
                    } else {
                        NotificationService.error(errorMessage);
                    }
                } else {
                    NotificationService.error(errorMessage);
                }
            }
        } catch (error) {
            console.error('❌ Error en la petición:', {
                error: error,
                mensaje: error instanceof Error ? error.message : 'Error desconocido',
                stack: error instanceof Error ? error.stack : undefined,
            });
            NotificationService.error('Error al procesar la venta. Intente nuevamente.');
        } finally {
            // ✅ NUEVO: Permitir volver a hacer click después de completar la petición
            setIsSubmitting(false);
        }
    };

    // ✅ MODIFICADO: Obtener entidades relacionadas - usar clienteSeleccionado si está cargado
    const selectedCliente = clienteSeleccionado || clientesSeguro.find((c) => c.id === data.cliente_id);
    const selectedClienteForModal = selectedCliente
        ? {
              id: selectedCliente.id,
              nombre: selectedCliente.nombre,
              nit: selectedCliente.nit || undefined,
              telefono: selectedCliente.telefono || undefined,
              email: selectedCliente.email || undefined,
              direccion: selectedCliente.direccion || undefined,
          }
        : undefined;
    const selectedMoneda = monedasSeguro.find((m) => m.id === data.moneda_id);
    const selectedEstado = estadosSeguro.find((e) => e.id === data.estado_documento_id);

    // Mostrar alert si no hay caja abierta
    if (!cargandoCaja && !cajaInfo?.tiene_caja_abierta) {
        return (
            <AppLayout
                breadcrumbs={[
                    { title: 'Ventas', href: '/ventas' },
                    { title: 'Nueva venta', href: '#' },
                ]}
            >
                <Head title="Nueva venta" />
                <div className="space-y-4 p-6">
                    <div className="rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">🚫 Caja Cerrada</h3>
                        <p className="mt-2 text-red-600 dark:text-red-300">
                            No puedes crear una venta sin una caja abierta. Por favor, abre una caja primero desde el módulo de Cajas.
                        </p>
                    </div>
                    <Link
                        href="/cajas"
                        className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        Ir a Cajas
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Ventas', href: '/ventas' },
                { title: isEditing ? 'Editar venta' : 'Nueva venta', href: '#' },
            ]}
        >
            <Head title={isEditing ? 'Editar venta' : 'Nueva venta'} />

            <form onSubmit={handleSubmit} className="space-y-6 px-4 py-2">
                {/* Indicador de verificación de caja */}
                {cargandoCaja && (
                    <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></span>
                            Verificando estado de caja...
                        </div>
                    </div>
                )}

                {/* Banner de advertencia - caja sin abrir */}
                {shouldShowBanner && (
                    <div className="mb-4">
                        <AlertSinCaja onAbrir={() => router.visit('/cajas')} onVerCajas={() => router.visit('/cajas')} />
                    </div>
                )}

                {/* Información básica */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 items-start">
                        {/* Campo número oculto - se genera automáticamente */}
                        <input type="hidden" value={data.numero} onChange={(e) => setData('numero', e.target.value)} />
                        <div>
                            <InputSearch
                                id="cliente_search"
                                label="Cliente"
                                value={clienteValue}
                                displayValue={clienteDisplay}
                                onSearch={searchClientes}
                                onChange={(value, option) => {
                                    setData('cliente_id', value || 0);
                                    setClienteValue(value);
                                    if (option) {
                                        setClienteDisplay(option.label);
                                        // ✅ NUEVO (2026-08-26): Guardar datos completos del cliente incluyendo direcciones
                                        setClienteRaw(option as any);
                                    } else {
                                        setClienteDisplay('');
                                        setClienteRaw(null);
                                    }
                                }}
                                placeholder="Buscar cliente por nombre, NIT/CI o teléfono..."
                                emptyText="No se encontraron clientes"
                                error={errors.cliente_id}
                                required={true}
                                allowScanner={false}
                                showCreateButton={true}
                                onCreateClick={handleCreateCliente}
                                createButtonText="Crear Cliente"
                                showCreateIconButton={true}
                                createIconButtonTitle="Crear nuevo cliente"
                                className="w-full"
                            />
                            {errors.cliente_id && <p className="mt-1 text-sm text-red-600">{errors.cliente_id}</p>}
                            {selectedCliente && (
                                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                    {selectedCliente.telefono && <span>📱 {selectedCliente.telefono}</span>}
                                    {selectedCliente.nit && (
                                        <span>
                                            {selectedCliente.telefono ? ' • ' : ''}NIT: {selectedCliente.nit}
                                        </span>
                                    )}
                                    {selectedCliente.email && (
                                        <span>
                                            {selectedCliente.telefono || selectedCliente.nit ? ' • ' : ''}Email: {selectedCliente.email}
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                        {/* Campo moneda oculto - se establece automáticamente a BOB */}
                        <input type="hidden" value={data.moneda_id} onChange={(e) => setData('moneda_id', Number(e.target.value))} />

                        <div>
                            <SearchSelect
                                label="Tipo de Pago"
                                placeholder="Seleccionar tipo de pago"
                                value={data.tipo_pago_id || ''}
                                options={tiposPagoOptions}
                                onChange={(value) => setData('tipo_pago_id', value ? Number(value) : 0)}
                                required
                                error={errors.tipo_pago_id}
                                searchPlaceholder="Buscar tipo de pago..."
                                emptyText="No se encontraron tipos de pago"
                            />
                        </div>

                        {/* ✅ REFACTORIZADO (2026-07-03): Toggle Switch elegante en lugar de dos botones */}
                        {logistica_envios && (
                            <div className="flex flex-col justify-end gap-2">
                                {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    🚚 Requiere Envío
                                </label> */}
                                <div className="flex items-center gap-3">
                                    {/* Toggle Switch */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nuevoValor = !data.requiere_envio;
                                            console.log('🚚 [VentaForm] Requiere envío:', nuevoValor);
                                            setData('requiere_envio', nuevoValor);
                                            if (!nuevoValor) {
                                                setData('direccion_cliente_id', null);
                                            }
                                        }}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                                            data.requiere_envio ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                                data.requiere_envio ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                    {/* Etiqueta descriptiva */}
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {data.requiere_envio ? '✅ Sí, requiere envío' : '❌ No requiere envío'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de Envío - Solo visible si logistica_envios = true Y requiere_envio = true */}
                    {logistica_envios && data.requiere_envio && (
                        <div className="mt-2 border-t border-gray-200 pt-2 dark:border-zinc-700">
                            <h3 className="text-md mb-2 font-medium text-gray-900 dark:text-white">🚚 Detalles de Envío</h3>

                            {/* Campos de envío */}
                            <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-900/20">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {/* ✅ NUEVO: Selector de política de pago para envíos - Moderno */}
                                    <div>
                                        {/* <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">💳 Política de Pago</label> */}
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                                            <button
                                                type="button"
                                                onClick={() => setData('politica_pago', 'CONTRA_ENTREGA')}
                                                className={`rounded-lg border-2 p-2 text-left transition-all duration-200 ${
                                                    data.politica_pago === 'CONTRA_ENTREGA'
                                                        ? 'border-blue-500 bg-blue-50 shadow-md dark:border-blue-500 dark:bg-blue-900/40'
                                                        : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-zinc-800 dark:hover:border-gray-500'
                                                }`}
                                            >
                                                <div
                                                    className={`text-2xl ${data.politica_pago === 'CONTRA_ENTREGA' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                                >
                                                    <p
                                                        className={`text-sm font-semibold ${data.politica_pago === 'CONTRA_ENTREGA' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}
                                                    >
                                                        🚚 Contra Entrega
                                                    </p>
                                                    <p
                                                        className={`text-xs ${data.politica_pago === 'CONTRA_ENTREGA' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                                    >
                                                        Pago al recibir
                                                    </p>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('politica_pago', 'ANTICIPADO_100')}
                                                className={`rounded-lg border-2 p-2 text-left transition-all duration-200 ${
                                                    data.politica_pago === 'ANTICIPADO_100'
                                                        ? 'border-green-500 bg-green-50 shadow-md dark:border-green-500 dark:bg-green-900/40'
                                                        : 'border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-zinc-800 dark:hover:border-gray-500'
                                                }`}
                                            >
                                                <p
                                                    className={`text-sm font-semibold ${data.politica_pago === 'ANTICIPADO_100' ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-100'}`}
                                                >
                                                    ⚡Anticipado 100%
                                                </p>
                                                <p
                                                    className={`text-xs ${data.politica_pago === 'ANTICIPADO_100' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                                                >
                                                    Antes de enviar
                                                </p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* ✅ NUEVO: Campo de Logística de Envíos - mostrar solo si logistica_envios (prop global) = true */}
                                    {(() => {
                                        const mostrar = logistica_envios;
                                        return (
                                            mostrar && (
                                                <div className="grid grid-cols-1 gap-3 rounded-lg border border-green-200 bg-green-50 p-3 sm:grid-cols-1 dark:border-green-800 dark:bg-green-900/20">
                                                    {/* ✅ NUEVO: Selector de Preventista */}
                                                    <div className="dark:border-green-800">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            👤 Preventista (Opcional)
                                                        </label>
                                                        {cargandoPrevenstitas ? (
                                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                                                                <span className="text-sm">Cargando preventistas...</span>
                                                            </div>
                                                        ) : preventistas.length > 0 ? (
                                                            <select
                                                                value={data.preventista_id || ''}
                                                                onChange={(e) =>
                                                                    setData('preventista_id', e.target.value ? Number(e.target.value) : null)
                                                                }
                                                                className="w-full rounded-md border border-gray-300 px-2 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                                            >
                                                                <option value="">-- Selecciona un preventista --</option>
                                                                {preventistas.map((prev) => (
                                                                    <option key={prev.id} value={prev.id}>
                                                                        {prev.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                                                ⚠️ No hay preventistas disponibles
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* ✅ NUEVO: Selector de Entrega con Búsqueda */}
                                                    <div className="dark:border-green-800">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            🚚 Asignar a Entrega (Opcional)
                                                        </label>
                                                        <EntregaSearchSelector
                                                            value={data.entrega_id}
                                                            onValueChange={(value) => setData('entrega_id', value ? Number(value) : null)}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        );
                                    })()}

                                    {/* ✅ NUEVO: Card de información del cliente */}
                                    {clienteSeleccionado && (
                                        <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-900/20">
                                            {/* Selector de direcciones */}
                                            <div className="dark:border-amber-800">
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                                    📍 Direcciones Disponibles
                                                </label>
                                                {cargandoDirecciones ? (
                                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent"></div>
                                                        <span className="text-sm">Cargando direcciones...</span>
                                                    </div>
                                                ) : direccionesDisponibles.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {direccionesDisponibles.map((dir) => (
                                                            <button
                                                                key={dir.id}
                                                                type="button"
                                                                onClick={() => setData('direccion_cliente_id', dir.id)}
                                                                className={`w-full rounded-lg border-2 px-3 py-3 text-left transition-all ${
                                                                    data.direccion_cliente_id === dir.id
                                                                        ? 'border-blue-500 bg-blue-50 shadow-md dark:border-blue-500 dark:bg-blue-900/30'
                                                                        : 'border-gray-300 bg-white hover:border-blue-400 dark:border-gray-600 dark:bg-zinc-800 dark:hover:border-blue-500'
                                                                }`}
                                                            >
                                                                {/* Observaciones como dato principal */}
                                                                {dir.observaciones ? (
                                                                    <>
                                                                        <div className="flex items-center justify-between">
                                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                                                                                🏷️ {dir.observaciones}
                                                                            </p>
                                                                            {dir.es_principal && (
                                                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100">
                                                                                    Principal
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {/* <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                                            📮 {dir.direccion}
                                                                        </p> */}
                                                                        {dir.localidad && (
                                                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                                                                                🏘️{' '}
                                                                                {typeof dir.localidad === 'string'
                                                                                    ? dir.localidad
                                                                                    : dir.localidad?.nombre}
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex items-center justify-between">
                                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                                📮 {dir.direccion}
                                                                            </p>
                                                                            {dir.es_principal && (
                                                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-100">
                                                                                    Principal
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {dir.localidad && (
                                                                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                                                                🏘️{' '}
                                                                                {typeof dir.localidad === 'string'
                                                                                    ? dir.localidad
                                                                                    : dir.localidad?.nombre}
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                )}
                                                                {data.direccion_cliente_id === dir.id && (
                                                                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                                                        ✅ Seleccionada
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="rounded bg-amber-100 p-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                                                        ⚠️ El cliente no tiene direcciones registradas. Completa la dirección manualmente a
                                                        continuación.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    
                                </div>
                            </div>
                        </div>
                    )}
                    <br />
                    <ProductosTable
                        productos={productosSeguro}
                        detalles={detallesWithProducts}
                        onAddProduct={addProductToDetail}
                        onUpdateDetail={updateDetail}
                        onUpdateDetailMultiple={updateDetailMultiple} // ✅ NUEVO (2026-07-03): Actualizar múltiples campos de una sola vez
                        onRemoveDetail={removeDetail}
                        onTotalsChange={calculateTotals}
                        tipo="venta"
                        errors={errors}
                        showLoteFields={false}
                        almacen_id={almacen_id_empresa} // ✅ MODIFICADO: Pasar almacén de la empresa
                        cliente_id={clienteSeleccionado?.id || null} // ✅ NUEVO: Pasar cliente para filtrar tipos_precio
                        isClienteGeneral={clienteSeleccionado?.codigo_cliente === 'GENERAL'} // ✅ NUEVO: Indicar si es cliente GENERAL para seleccionar tipo de precio
                        manuallySelectedTipoPrecio={manuallySelectedTipoPrecio} // ✅ NUEVO: Pasar estado de selecciones manuales
                        isCalculatingPrices={precioRango.loading} // ✅ NUEVO: Mostrar indicador de carga
                        onUpdateDetailUnidadConPrecio={updateDetailUnidadConPrecio} // ✅ NUEVO: Actualizar unidad y precio juntos
                        onManualTipoPrecioChange={handleManualTipoPrecioChange} // ✅ MEMOIZADO
                        onComboItemsChange={handleComboItemsChange} // ✅ MEMOIZADO
                        carritoCalculado={precioRango.carritoCalculado} // ✅ NUEVO (2026-02-17): Pasar datos de rangos al componente
                        onDetallesActualizados={handleDetallesActualizados} // ✅ MEMOIZADO
                        es_farmacia={es_farmacia} // ✅ NUEVO: Indicador para mostrar/ocultar campos de medicamentos
                    />
                </div>
                {/* Totales */}
                {detallesWithProducts.length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <div className={`grid grid-cols-1 gap-4 ${es_farmacia ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                            {/* Descuento general */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descuento general</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.descuento === 0 && data.descuento.toString() === '0' ? '' : data.descuento}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        const descuento = valor === '' ? 0 : parseFloat(valor);
                                        if (!isNaN(descuento) && descuento >= 0) {
                                            setData('descuento', descuento);
                                            setData('total', data.subtotal - descuento);
                                        }
                                    }}
                                    className="w-full rounded-md border border-gray-300 p-1 text-right shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* ✅ FARMACIA: Desglose de Pagos (Efectivo + Transferencia) */}
                            {es_farmacia ? (
                                <>
                                    {/* Desglose de Pagos: Efectivo */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Efectivo</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Bs.</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={montoEfectivo}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setMontoEfectivo(valor === '' ? '' : parseFloat(valor) || 0);
                                                }}
                                                onWheel={(e) => e.preventDefault()}
                                                disabled={isSubmitting}
                                                className="flex-1 [appearance:textfield] rounded-md border border-gray-300 p-1 text-right shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white [&::-webkit-inner-spin-button]:[appearance:none] [&::-webkit-outer-spin-button]:[appearance:none]"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {/* Desglose de Pagos: Transferencia/QR */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Transferencia/QR</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Bs.</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={montoTransferencia}
                                                onChange={(e) => {
                                                    const valor = e.target.value;
                                                    setMontoTransferencia(valor === '' ? '' : parseFloat(valor) || 0);
                                                }}
                                                onWheel={(e) => e.preventDefault()}
                                                disabled={isSubmitting}
                                                className="flex-1 [appearance:textfield] rounded-md border border-gray-300 p-1 text-right shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white [&::-webkit-inner-spin-button]:[appearance:none] [&::-webkit-outer-spin-button]:[appearance:none]"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* ✅ NO FARMACIA: Input único de Monto Pagado */
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Monto Pagado</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Bs.</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={
                                                data.monto_pagado_inicial === 0 && data.monto_pagado_inicial.toString() === '0'
                                                    ? ''
                                                    : data.monto_pagado_inicial
                                            }
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                const montoPagado = valor === '' ? 0 : parseFloat(valor);
                                                if (!isNaN(montoPagado) && montoPagado >= 0) {
                                                    setData('monto_pagado_inicial', montoPagado);
                                                }
                                            }}
                                            onWheel={(e) => e.preventDefault()}
                                            disabled={false}
                                            className="flex-1 [appearance:textfield] rounded-md border border-gray-300 p-1 text-right shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white [&::-webkit-inner-spin-button]:[appearance:none] [&::-webkit-outer-spin-button]:[appearance:none]"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ✅ NUEVO: Resumen completo de la transacción */}
                        <div className="mt-2">
                            {data.descuento > 0 && (
                                <>
                                    <div className="mt-6 space-y-2 border-t border-gray-200 pt-4 dark:border-zinc-700">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
                                            <span className="text-right font-medium text-gray-900 dark:text-white">
                                                {formatCurrencyMinimalDecimals(data.subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">Descuento:</span>
                                            <span className="text-right font-medium text-red-600 dark:text-red-400">
                                                -{formatCurrencyMinimalDecimals(data.descuento)}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-lg font-bold dark:border-zinc-700">
                                <span className="text-gray-900 dark:text-white">Total:</span>
                                <span className="text-right text-gray-900 dark:text-white">{formatCurrencyMinimalDecimals(data.total)}</span>
                            </div>

                            {data.monto_pagado_inicial > 0 && (
                                <>
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-sm dark:border-zinc-700">
                                        <span className="text-gray-700 dark:text-gray-300">Monto Pagado:</span>
                                        <span className="text-right font-medium text-gray-900 dark:text-white">
                                            {formatCurrencyMinimalDecimals(data.monto_pagado_inicial)}
                                        </span>
                                    </div>

                                    <div
                                        className={`flex items-center justify-between text-sm font-medium ${
                                            data.monto_pagado_inicial - data.total < 0
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-green-600 dark:text-green-400'
                                        }`}
                                    >
                                        <span>Cambio:</span>
                                        <span className="text-right">
                                            {formatCurrencyMinimalDecimals(Math.max(0, data.monto_pagado_inicial - data.total))}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Acciones */}
                <div className="flex justify-end space-x-3">
                    <Link
                        href="/ventas"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                        Cancelar
                    </Link>

                    {/* ✅ NUEVO: Botón para limpiar borrador manualmente */}
                    <button
                        type="button"
                        onClick={limpiarBorrador}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
                        title="Limpiar el borrador de venta guardado en localStorage"
                    >
                        🗑️ Limpiar borrador
                    </button>

                    {/* ✅ NUEVO: Botón para refrescar datos desde el servidor */}
                    {/* <button
                        type="button"
                        onClick={refrescarDatos}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-900/50 dark:focus:ring-offset-gray-900 transition-colors"
                        title="Refrescar datos desde el servidor (si cambió es_farmacia en Empresa)"
                    >
                        🔄 Refrescar datos
                    </button> */}

                    {/* ✅ NUEVO: Permitir CREDITO incluso con stock insuficiente */}
                    {(() => {
                        const tipoPagoSeleccionado = tipos_pago?.find((t: any) => t.id === data.tipo_pago_id);
                        const isCreditoPayment = tipoPagoSeleccionado?.codigo === 'CREDITO';
                        const buttonDisabled = isSubmitting || detallesWithProducts.length === 0 || (!isCreditoPayment && !stockValido);

                        return (
                            <button
                                type="submit"
                                disabled={buttonDisabled}
                                className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900 ${
                                    !stockValido && !isCreditoPayment
                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                }`}
                            >
                                {isSubmitting
                                    ? 'Guardando...'
                                    : !stockValido && !isCreditoPayment
                                      ? 'Stock insuficiente'
                                      : isEditing
                                        ? 'Actualizar venta'
                                        : 'Crear venta'}
                            </button>
                        );
                    })()}
                </div>
            </form>

            {/* Modal de Vista Previa */}
            <VentaPreviewModal
                isOpen={showPreviewModal}
                onClose={() => setShowPreviewModal(false)}
                onConfirm={handleConfirmSubmit}
                data={data}
                detallesWithProducts={detallesWithProducts}
                cliente={selectedClienteForModal}
                moneda={selectedMoneda}
                estadoDocumento={selectedEstado}
                processing={isSubmitting}
                isEditing={isEditing}
                comboItemsMap={comboItemsMap}
            />

            {/* Modal para crear cliente */}
            <ModalCrearCliente
                isOpen={showCreateClienteModal}
                onClose={() => setShowCreateClienteModal(false)}
                onClienteCreated={handleClienteCreated}
                searchQuery={clienteSearchQuery}
            />

            {/* Modal de Selección de Salida (Imprimir, Excel, PDF) */}
            {ventaCreada && (
                <OutputSelectionModal
                    isOpen={showOutputModal}
                    onClose={() => {
                        setShowOutputModal(false);
                        setVentaCreada(null);
                    }}
                    documentoId={ventaCreada.id}
                    tipoDocumento="venta"
                    documentoInfo={{
                        numero: ventaCreada.numero,
                        fecha: ventaCreada.fecha,
                    }}
                />
            )}
        </AppLayout>
    );
}

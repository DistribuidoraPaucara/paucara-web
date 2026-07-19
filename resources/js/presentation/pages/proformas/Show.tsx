import AppLayout from '@/layouts/app-layout';
import ProductosTable, { DetalleProducto } from '@/presentation/components/ProductosTable'; // ✅ NUEVO: Componente centralizado
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Separator } from '@/presentation/components/ui/separator';
import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import MapViewWithFallback from '@/presentation/components/maps/MapViewWithFallback';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { AlertCircle, Check, ChevronUp, FileText, MapPin, Package, Pencil, RefreshCw, Search, ShoppingCart, User, X } from 'lucide-react';

// DOMAIN LAYER: Importar tipos desde domain
import type { Producto } from '@/domain/entities/productos';
import type { Proforma } from '@/domain/entities/proformas';
import type { Id } from '@/domain/entities/shared';

// APPLICATION LAYER: Importar hooks de lógica de negocio
import { useApprovalFlow } from '@/application/hooks/use-approval-flow';
import { useBuscarProductos } from '@/application/hooks/use-buscar-productos';
import { usePrecioRangoCarrito } from '@/application/hooks/use-precio-rango-carrito';
import { useProformaActions, type CoordinacionData } from '@/application/hooks/use-proforma-actions';

// PRESENTATION LAYER: Componentes reutilizables
import { LoadingOverlay } from '@/presentation/components/ui/LoadingOverlay';
import { ProformaCard } from '@/presentation/components/ui/ProformaCard';
import { ProformaConvertirModal } from '@/presentation/pages/logistica/components/modals/ProformaConvertirModal';
import { UbicacionesMultiplesModal } from '@/presentation/pages/logistica/entregas/components/UbicacionesMultiplesModal';
import { ApprovalPaymentForm } from './components/ApprovalPaymentForm';

interface TipoPrecioOption {
    value: number;
    code: string;
    label: string;
    description?: string;
    color?: string;
    es_ganancia?: boolean;
    es_precio_base?: boolean;
    icono?: string;
    tooltip?: string;
}

interface Props {
    item: Proforma;
    tiposPrecio?: TipoPrecioOption[];
    almacen_id_empresa?: number;
}

// Interfaz para detalle que devuelve el diálogo de selección
interface ProformaDetalleDialogo {
    id: number;
    producto?: Producto;
    producto_id: Id;
    producto_nombre: string;
    sku?: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    // ✅ NUEVO: Datos de stock, peso, categoría y límite de venta para visualización
    stock_disponible?: number;
    peso?: number;
    categoria?: string | null;
    limite_venta?: number | null;
    // ✅ NUEVO: Tipo de precio
    tipo_precio_id?: number | null;
}

// Componente para seleccionar producto
interface ProductSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productos: Producto[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSelectProducto: (detalle: ProformaDetalleDialogo) => void;
    isLoading?: boolean;
    error?: string | null;
}

function ProductSelectionDialog({
    open,
    onOpenChange,
    productos,
    searchTerm,
    onSearchChange,
    onSelectProducto,
    isLoading = false,
    error = null,
}: ProductSelectionDialogProps) {
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [cantidad, setCantidad] = useState(1);

    // Los productos ya están filtrados por el servidor (servidor-side search)
    const productosFiltrados = productos;

    const handleAgregarProductoSeleccionado = () => {
        if (!selectedProducto) return;

        // Obtener precio del producto (precio_base es el campo disponible en Producto)
        const precioUnitario = (selectedProducto.precio_base as number) || 0;

        // Crear detalle con la cantidad especificada
        const nuevoDetalle = {
            id: Math.random(),
            producto: selectedProducto,
            producto_id: selectedProducto.id,
            producto_nombre: selectedProducto.nombre, // Campo directo para mostrar nombre
            sku: selectedProducto.sku, // Campo directo para mostrar código
            cantidad: Math.max(0.01, cantidad),
            precio_unitario: precioUnitario,
            subtotal: Math.max(0.01, cantidad) * precioUnitario,
            // ✅ NUEVO: Incluir stock, peso, categoría y límite de venta del producto
            stock_disponible: (selectedProducto as any).stock_disponible || 0,
            peso: (selectedProducto as any).peso || 0,
            categoria: (selectedProducto as any).categoria || undefined,
            limite_venta: (selectedProducto as any).limite_venta || null,
            // ✅ NUEVO: Marcar como detalle nuevo para validar sobrestock
            esNuevo: true,
        };

        onSelectProducto(nuevoDetalle);

        // Limpiar el formulario
        setSelectedProducto(null);
        setCantidad(1);
        onSearchChange('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-lg flex-col">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Agregar Producto</DialogTitle>
                    <DialogDescription className="text-xs">Busca y selecciona un producto para agregarlo a la proforma</DialogDescription>
                </DialogHeader>

                <div className="flex-1 space-y-3 overflow-y-auto px-1">
                    {/* Búsqueda de productos */}
                    <div className="relative sticky top-0 bg-background pb-2">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, SKU, código de barra, marca..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-9 pl-10 text-sm"
                            disabled={isLoading}
                        />
                        {isLoading && (
                            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        )}
                    </div>

                    {/* Mensaje de error */}
                    {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                    {/* Lista de productos */}
                    {isLoading ? (
                        <div className="rounded-lg border bg-muted/30 p-8 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">Buscando productos...</p>
                            </div>
                        </div>
                    ) : productosFiltrados.length > 0 ? (
                        <div className="divide-y rounded-lg border bg-background">
                            {productosFiltrados.map((producto) => (
                                <div
                                    key={producto.id}
                                    className={`cursor-pointer p-3 text-sm transition-colors hover:bg-accent/50 ${
                                        selectedProducto?.id === producto.id ? 'bg-accent' : ''
                                    }`}
                                    onClick={() => setSelectedProducto(producto)}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <p className="flex-1 truncate text-sm font-semibold">{producto.nombre}</p>
                                                {selectedProducto?.id === producto.id && <Check className="h-5 w-5 flex-shrink-0 text-green-500" />}
                                            </div>

                                            {/* Información técnica del producto */}
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                {/* SKU */}
                                                {(producto.sku || producto.codigo) && (
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">SKU: </span>
                                                        <span className="font-mono text-foreground">{producto.sku || producto.codigo}</span>
                                                    </div>
                                                )}

                                                {/* Códigos de barra */}
                                                {(producto.codigo_barras ||
                                                    (Array.isArray(producto.codigos_barra) && producto.codigos_barra?.length > 0)) && (
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">Código: </span>
                                                        <span className="font-mono text-foreground">
                                                            {producto.codigo_barras ||
                                                                (Array.isArray(producto.codigos_barra) ? producto.codigos_barra[0]?.codigo : '')}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Marca */}
                                                {producto.marca?.nombre && (
                                                    <div>
                                                        <span className="text-muted-foreground">Marca: </span>
                                                        <span className="text-foreground">{producto.marca.nombre}</span>
                                                    </div>
                                                )}

                                                {/* Unidad */}
                                                {producto.unidad?.nombre && (
                                                    <div>
                                                        <span className="text-muted-foreground">Unidad: </span>
                                                        <span className="text-foreground">{producto.unidad.nombre}</span>
                                                    </div>
                                                )}

                                                {/* Stock */}
                                                <div className="col-span-2">
                                                    <span className="text-muted-foreground">Stock: </span>
                                                    <span
                                                        className={
                                                            (producto.cantidad_disponible as number) || (producto.stock_disponible as number)
                                                                ? 'font-medium text-green-600'
                                                                : 'text-red-600'
                                                        }
                                                    >
                                                        {(producto.cantidad_disponible as number) || (producto.stock_disponible as number) || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Precio */}
                                            <p className="mt-2 text-sm font-semibold text-foreground">
                                                Bs. {((producto.precio_base as number) || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchTerm ? (
                        <div className="rounded-lg border bg-muted/30 p-4 text-center text-sm">
                            <p className="text-muted-foreground">No se encontraron productos para "{searchTerm}"</p>
                            <p className="mt-2 text-xs text-muted-foreground">Intenta con otro término: nombre, SKU, código de barra, marca, etc.</p>
                        </div>
                    ) : (
                        <div className="rounded-lg border bg-muted/30 p-4 text-center text-sm">
                            <p className="text-muted-foreground">Comienza a escribir para buscar productos</p>
                            <p className="mt-2 text-xs text-muted-foreground">Puedes buscar por: nombre, SKU, código de barra, marca, etc.</p>
                        </div>
                    )}

                    {/* Cantidad - Solo mostrar si hay producto seleccionado */}
                    {selectedProducto && (
                        <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                            <Label htmlFor="cantidad-input" className="text-sm">
                                Cantidad
                            </Label>
                            <Input
                                id="cantidad-input"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={cantidad || ''}
                                onChange={(e) => {
                                    const valor = parseFloat(e.target.value);
                                    if (!isNaN(valor) && valor > 0) {
                                        setCantidad(valor);
                                    }
                                }}
                                onBlur={(e) => {
                                    const valor = parseFloat(e.target.value);
                                    if (isNaN(valor) || valor <= 0) {
                                        setCantidad(1);
                                    }
                                }}
                                placeholder="1.00"
                                className="h-9 text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Subtotal: Bs.{' '}
                                {(cantidad * ((selectedProducto.precio_base as number) || 0)).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex shrink-0 gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            onOpenChange(false);
                            setSelectedProducto(null);
                            setCantidad(1);
                            onSearchChange('');
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button size="sm" onClick={handleAgregarProductoSeleccionado} disabled={!selectedProducto}>
                        Agregar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ✅ NUEVO: Helper para verificar si una proforma puede ser editada/aprobada
const puedeSerEditada = (estado: string) => ['PENDIENTE', 'BORRADOR'].includes(estado);

export default function ProformasShow({ item: proforma, tiposPrecio = [], almacen_id_empresa = 1 }: Props) {
    // APPLICATION LAYER: Lógica de negocio desde hook
    // ✅ LOGS COMPLETOS - Ver qué datos llegan al componente
    useEffect(() => {
        console.log('═════════════════════════════════════════');
        console.log('🔍 PROFORMAS/SHOW.TSX - DATOS COMPLETOS');
        console.log('═════════════════════════════════════════');
        console.log('📦 Proforma recibida:', proforma);
        console.log('   - ID:', proforma?.id);
        console.log('   - Número:', proforma?.numero);
        console.log('   - Estado:', proforma?.estado);
        console.log('   - Cliente:', proforma?.cliente);
        console.log('   - Detalles:', proforma?.detalles);
        console.log('💰 Tipos de Precio:', tiposPrecio);
        console.log('🏢 Almacén ID Empresa:', almacen_id_empresa);
        console.log('═════════════════════════════════════════');
    }, [proforma, tiposPrecio, almacen_id_empresa]);
    const {
        isSubmitting,
        isConverting,
        isGuardandoCoordinacion,
        isRenovandoReservas,
        puedeAprobar,
        puedeRechazar,
        puedeConvertir,
        aprobar,
        rechazar,
        convertirAVenta,
        renovarReservas,
    } = useProformaActions(proforma, {
        onSuccess: () => {
            // Cerrar diálogos cuando la operación sea exitosa
            // La página se recargaráy mostrará los cambios
            setShowAprobarDialog(false);
            setShowRechazarDialog(false);
            setShowConvertirDialog(false);
            setConvertErrorState(null);
        },
        onError: (error: Error & { code?: string; reservasExpiradas?: unknown }) => {
            console.error('Error en acción de proforma:', error);
            // console.log('📋 Error code:', (error as any).code);
            console.log('📋 Error message:', error.message);
            // console.log('📋 Error reservasExpiradas:', (error as any).reservasExpiradas);

            // Detectar si es error de reservas expiradas
            if (error.code === 'RESERVAS_EXPIRADAS') {
                console.log('⚠️ Detectado error de reservas expiradas - ESTABLECIENDO ESTADO');
                const newErrorState = {
                    code: 'RESERVAS_EXPIRADAS',
                    message: error.message,
                    reservasExpiradas: typeof error.reservasExpiradas === 'number' ? error.reservasExpiradas : undefined,
                };
                console.log('📋 Nuevo error state:', newErrorState);
                setConvertErrorState(newErrorState);
                console.log('✅ Error state establecido, showConvertirDialog debería estar true');
                // Mantener el diálogo abierto para que muestre las opciones
            } else {
                // Cerrar diálogos para otros errores
                setShowAprobarDialog(false);
                setShowRechazarDialog(false);
                setShowConvertirDialog(false);
                setConvertErrorState(null);
            }
        },
    });

    // APPROVAL FLOW CONTEXT: Estado del flujo de aprobación (puede ser null si el provider no existe)
    const approvalFlow = useApprovalFlow();

    // ✅ NUEVO: Validación defensiva para almacén con useMemo
    const almacenIdSeguro = useMemo(() => almacen_id_empresa || 1, [almacen_id_empresa]);

    // PRESENTATION LAYER: Estados locales solo de UI
    const [showAprobarDialog, setShowAprobarDialog] = useState(false);
    const [showRechazarDialog, setShowRechazarDialog] = useState(false);
    const [showConvertirDialog, setShowConvertirDialog] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [showCoordinacionForm, setShowCoordinacionForm] = useState(true);
    const [showMapaEntrega, setShowMapaEntrega] = useState(false);
    // ✅ Estado para mostrar/ocultar card de dirección (inicia OCULTO)
    const [showDireccionCard, setShowDireccionCard] = useState(false);
    const [showMapaResumen, setShowMapaResumen] = useState(false);
    const [direccionMapaResumen, setDireccionMapaResumen] = useState<'solicitada' | 'confirmada' | null>(null);
    const [convertErrorState, setConvertErrorState] = useState<{ code?: string; message?: string; reservasExpiradas?: number } | null>(null);
    // ✅ NUEVO: Estado para error de caja no disponible
    const [showCajaErrorDialog, setShowCajaErrorDialog] = useState(false);
    const [cajaErrorMessage, setCajaErrorMessage] = useState('');
    // ✅ NUEVO: Estado para verificar reservas al cargar la proforma
    const [verificandoReservas, setVerificandoReservas] = useState(false);
    const [reservasExpiradasAlCargar, setReservasExpiradasAlCargar] = useState(false);

    // ✅ NUEVO: Estados para navegación a siguiente proforma
    const [loadingSiguiente, setLoadingSiguiente] = useState(false);
    const [siguienteProforma, setSiguienteProforma] = useState<{
        id: number;
        numero: string;
        cliente_nombre: string;
        total: number;
        fecha_creacion: string;
    } | null>(null);

    // ✅ NUEVO: Flag para evitar que el componente se remonte durante flujo de aprobación + conversión
    const [isFlowAprobacionConversion, setIsFlowAprobacionConversion] = useState(false);

    // ✅ NUEVO: Estado local para deshabilitar botón de Aprobar mientras se procesa
    const [isAprohandoLocal, setIsAprohandoLocal] = useState(false);

    // ✅ NUEVO: Estado para el modal de selección de salida (OutputSelection)
    const [showOutputSelection, setShowOutputSelection] = useState(false);
    const [ventaParaImprimir, setVentaParaImprimir] = useState<any>(null);

    // ✅ NUEVO: Estado para modal de selección de salida de proforma
    const [showProformaOutputSelection, setShowProformaOutputSelection] = useState(false);

    // ✅ NUEVO (2026-06-09): Estado para resumen de crédito en header
    const [resumenCredito, setResumenCredito] = useState<any>(null);
    const [loadingResumenCredito, setLoadingResumenCredito] = useState(false);

    // ✅ NUEVO: Estado para foto del cliente
    const [imagenCargada, setImagenCargada] = useState(true);
    const [showImagenModal, setShowImagenModal] = useState(false);

    // Estados para edición de detalles
    const [editableDetalles, setEditableDetalles] = useState(
        proforma.detalles.map((d) => {
            // ✅ DEBUG: Verificar que el stock llega correctamente
            console.log(`✅ [Show.tsx InitState] Detalle ${d.producto_id}:`, {
                producto_id: d.producto_id,
                producto_nombre: d.producto_nombre,
                tiene_producto: !!d.producto,
                stock_disponible_en_detalle: d.stock_disponible,
                stock_disponible_en_producto: (d.producto as any)?.stock_disponible,
                stock_total_en_producto: (d.producto as any)?.stock_total,
            });

            // ✅ NUEVO: Actualizar combo_items con stock actual del producto
            // El backend devuelve stock antiguo en combo_items, necesitamos reemplazarlo
            let detalleActualizado = { ...d };

            if (d.es_combo && Array.isArray(d.combo_items)) {
                detalleActualizado.combo_items = d.combo_items.map((item: any) => {
                    // Buscar el producto del item en el detalle principal
                    const productoDelItem = (d.producto as any)?.combo_items?.find((ci: any) => ci.producto_id === item.producto_id);

                    if (productoDelItem && productoDelItem.stock_disponible !== undefined) {
                        console.log(
                            `🔄 [Actualizando stock combo] Producto ${item.producto_id}: ${item.stock_disponible} → ${productoDelItem.stock_disponible}`,
                        );
                        return {
                            ...item,
                            stock_disponible: productoDelItem.stock_disponible,
                            stock_total: productoDelItem.stock_total,
                        };
                    }
                    return item;
                });
            }

            return {
                ...detalleActualizado,
                // ✅ NUEVO: Preservar unidad_medida_nombre desde el detalle
                unidad_medida_id: d.unidad_medida_id || (d.producto as any)?.unidad_medida_id,
                unidad_medida_nombre: d.unidad_medida_nombre || (d.producto as any)?.unidad_medida_nombre,
                // ✅ Convertir cantidad de string a number si es necesario
                cantidad: typeof d.cantidad === 'string' ? parseFloat(d.cantidad) : d.cantidad || 1,
                // ✅ Asegurar que precio_unitario es número
                precio_unitario: typeof d.precio_unitario === 'string' ? parseFloat(d.precio_unitario) : d.precio_unitario || 0,
                // ✅ Asegurar que subtotal es número
                subtotal: typeof d.subtotal === 'string' ? parseFloat(d.subtotal) : d.subtotal || 0,
                // ✅ CRÍTICO: Usar d.producto directamente del backend EN LUGAR de reconstruirlo
                // El backend retorna toda la estructura con es_combo y combo_items dentro de producto
                // Si reconstruimos, perdemos esos campos críticos
                producto:
                    d.producto && typeof d.producto === 'object'
                        ? d.producto // ← USAR DIRECTAMENTE: tiene sku, es_combo, combo_items, etc.
                        : {
                              // FALLBACK: Por si no viniera producto del backend (compatibilidad)
                              id: d.producto_id,
                              nombre: d.producto_nombre,
                              sku: d.sku || null,
                              codigo: d.sku || null,
                              peso: d.peso || 0,
                              stock_disponible: d.stock_disponible || 0,
                              stock_total: d.stock_total || 0,
                              stock_reservado: d.stock_reservado || 0,
                              precio_venta: d.precio_unitario || 0,
                              precio_costo: d.precio_unitario || 0,
                              categoria: d.categoria || null,
                              limite_venta: d.limite_venta || null,
                              unidad_medida_id: d.unidad_medida_id || null,
                              unidad_medida_nombre: d.unidad_medida_nombre || null,
                              precios: Array.isArray(d.precios) ? d.precios : [],
                          },
            };
        }),
    );
    const [preciosEditadosManualmente, setPreciosEditadosManualmente] = useState<Set<number>>(new Set());
    // ✅ NUEVO: Track cambios en detalles que no han sido guardados
    const [haysCambiosSinGuardar, setHaysCambiosSinGuardar] = useState(false);
    const [showAgregarProductoDialog, setShowAgregarProductoDialog] = useState(false);

    // Estados para búsqueda rápida de productos
    const [busquedaRapidaCodigo, setBusquedaRapidaCodigo] = useState('');
    const [cargandoBusquedaRapida, setCargandoBusquedaRapida] = useState(false);
    const [errorBusquedaRapida, setErrorBusquedaRapida] = useState<string | null>(null);

    // Hook para búsqueda de productos con debounce
    const {
        searchTerm: searchProducto,
        setSearchTerm: setSearchProducto,
        productos: productosDisponibles,
        isLoading: isLoadingProductos,
        error: errorProductos,
    } = useBuscarProductos({ debounceMs: 400 });

    // Hook para cálculo de precios por rango de cantidad
    const {
        calcularCarritoDebounced,
        getPrecioActualizado,
        carritoCalculado, // ✅ NUEVO (2026-02-17): Extraer datos calculados para ProductosTable
        loading: isCalculandoRangos,
        error: errorRangos,
    } = usePrecioRangoCarrito(400);

    // Función helper para calcular fecha/hora por defecto (DEBE estar aquí para usarla en useState)
    // 🔧 Helper para extraer solo la hora (HH:ii) - mantener por compatibilidad con datos legados
    const extractTime = (timeValue: string | undefined, defaultTime: string = '09:00'): string => {
        if (!timeValue) return defaultTime;
        // Si contiene espacio, es un datetime completo - extraer la parte de hora (compatibilidad)
        if (timeValue.includes(' ')) {
            return timeValue.split(' ')[1].substring(0, 5);
        }
        // Si ya es solo hora, retornar como está
        return timeValue;
    };

    const defaultDelivery = (() => {
        // ✅ IMPORTANTE: Siempre usar hoy como fecha confirmada
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const day = String(hoy.getDate()).padStart(2, '0');
        const fechaConfirmada = `${year}-${month}-${day}`;

        // Usar las horas guardadas en la proforma si existen
        let horaConfirmada = '09:00';
        let horaConfirmadaFin = '17:00';

        if (proforma.hora_entrega_confirmada) {
            horaConfirmada = extractTime(proforma.hora_entrega_confirmada, '09:00');
        }
        if (proforma.hora_entrega_confirmada_fin) {
            horaConfirmadaFin = extractTime(proforma.hora_entrega_confirmada_fin, '17:00');
        }

        return {
            fecha: fechaConfirmada,
            hora: horaConfirmada,
            hora_fin: horaConfirmadaFin,
        };
    })();

    // Estado del formulario de coordinación
    const [coordinacion, setCoordinacion] = useState<CoordinacionData>({
        fecha_entrega_confirmada: defaultDelivery.fecha,
        hora_entrega_confirmada: defaultDelivery.hora,
        hora_entrega_confirmada_fin: defaultDelivery.hora_fin,
        comentario_coordinacion: proforma.comentario_coordinacion || '',
        notas_llamada: '',
        // Control de intentos
        numero_intentos_contacto: proforma.numero_intentos_contacto || 1,
        resultado_ultimo_intento: proforma.resultado_ultimo_intento || 'Aceptado',
        // Datos de entrega realizada
        entregado_en: proforma.entregado_en || '',
        entregado_a: proforma.entregado_a || '',
        observaciones_entrega: proforma.observaciones_entrega || '',
    });

    // Limpiar búsqueda cuando se cierra el diálogo
    useEffect(() => {
        if (!showAgregarProductoDialog) {
            // Limpiar el término de búsqueda cuando se cierra el modal
            setSearchProducto('');
        }
    }, [showAgregarProductoDialog, setSearchProducto]);

    // 🔄 CRÍTICO: Cuando el cálculo de rangos completa, actualizar detalles con nuevos precios
    // El backend retorna los detalles con precio_unitario y subtotal ya calculados
    useEffect(() => {
        if (!isCalculandoRangos && errorRangos === null) {
            // La carga completó sin errores, ahora actualizar editableDetalles
            // con los precios calculados del backend

            setEditableDetalles((prevDetalles) => {
                const detallesActualizados = prevDetalles.map((detalle) => {
                    // ✅ NO sobrescribir si tipo_precio_id === null (usuario seleccionó "OTROS")
                    if (detalle.tipo_precio_id === null) {
                        console.log(`🔒 [PROTEGIDO] Detalle ${detalle.id} tiene OTROS seleccionado - Ignorando respuesta del carrito`);
                        return detalle; // Mantener el precio manual
                    }

                    // Obtener el detalle calculado del hook
                    const precioActualizado = getPrecioActualizado(detalle.producto_id as number);

                    if (precioActualizado) {
                        // Si hay precio actualizado, recalcular subtotal
                        console.log(`📊 Actualizando precio para producto ${detalle.producto_id}: ${precioActualizado}`);
                        return {
                            ...detalle,
                            precio_unitario: precioActualizado,
                            subtotal: detalle.cantidad * precioActualizado,
                        };
                    }

                    return detalle;
                });

                console.log('📊 Tabla actualizada con nuevos precios:', detallesActualizados);
                return detallesActualizados;
            });
        }
    }, [isCalculandoRangos, errorRangos, preciosEditadosManualmente]); // ✅ FIX (2026-02-18): Remover getPrecioActualizado - se recrea en cada render causando loop infinito

    // Sincronizar datos de coordinación cuando la proforma cambia
    // ✅ CRÍTICO: No actualizar si estamos en el flujo de aprobación + conversión
    useEffect(() => {
        // Saltar si estamos en el flujo de aprobación + conversión
        if (isFlowAprobacionConversion) {
            console.log('⏭️ Saltando sincronización de coordinación - flujo en progreso');
            return;
        }

        console.log('📦 Datos de Proforma desde Backend:', proforma);

        // Calcular fecha/hora por defecto cuando cambia la proforma
        // ✅ IMPORTANTE: Siempre usar la fecha de hoy para fecha_entrega_confirmada
        const defaultDeliveryEffect = (() => {
            // Siempre usar hoy como fecha confirmada (no la guardada en la proforma)
            const hoy = new Date();
            const year = hoy.getFullYear();
            const month = String(hoy.getMonth() + 1).padStart(2, '0');
            const day = String(hoy.getDate()).padStart(2, '0');
            const fechaConfirmada = `${year}-${month}-${day}`;

            // Usar las horas guardadas en la proforma si existen
            let horaConfirmada = '09:00';
            let horaConfirmadaFin = '17:00';

            if (proforma.hora_entrega_confirmada) {
                horaConfirmada = extractTime(proforma.hora_entrega_confirmada, '09:00');
            }
            if (proforma.hora_entrega_confirmada_fin) {
                horaConfirmadaFin = extractTime(proforma.hora_entrega_confirmada_fin, '17:00');
            }

            return {
                fecha: fechaConfirmada,
                hora: horaConfirmada,
                hora_fin: horaConfirmadaFin,
            };
        })();

        setCoordinacion({
            fecha_entrega_confirmada: defaultDeliveryEffect.fecha,
            hora_entrega_confirmada: defaultDeliveryEffect.hora,
            hora_entrega_confirmada_fin: defaultDeliveryEffect.hora_fin,
            comentario_coordinacion: proforma.comentario_coordinacion || '',
            notas_llamada: '',
            numero_intentos_contacto: proforma.numero_intentos_contacto || 0,
            resultado_ultimo_intento: proforma.resultado_ultimo_intento || 'Aceptado',
            entregado_en: proforma.entregado_en || '',
            entregado_a: proforma.entregado_a || '',
            observaciones_entrega: proforma.observaciones_entrega || '',
        });
    }, [proforma.id, isFlowAprobacionConversion]);

    // ✅ NUEVO: Verificar reservas al cargar la proforma
    useEffect(() => {
        if (!proforma.id) return;

        const verificarReservasAlCargar = async () => {
            setVerificandoReservas(true);
            try {
                const response = await fetch(`/api/proformas/${proforma.id}/reservas`);
                const data = await response.json();

                if (data.success && data.data.reservas_expiradas) {
                    console.log('⚠️ Se detectó que las reservas han expirado al cargar la proforma');
                    setReservasExpiradasAlCargar(true);
                } else {
                    setReservasExpiradasAlCargar(false);
                }
            } catch (error) {
                console.error('Error al verificar reservas:', error);
                setReservasExpiradasAlCargar(false);
            } finally {
                setVerificandoReservas(false);
            }
        };

        verificarReservasAlCargar();
    }, [proforma.id]);

    // ✅ NUEVO (2026-06-09): Cargar resumen de crédito cuando la proforma es CREDITO
    useEffect(() => {
        if (proforma.politica_pago === 'CREDITO' && proforma.id) {
            setLoadingResumenCredito(true);
            fetch(`/proformas/${proforma.id}/resumen-credito`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data) {
                        setResumenCredito(data.data);
                        console.log('📊 Resumen de crédito cargado en header:', data.data);
                    }
                })
                .catch((error) => {
                    console.error('❌ Error al cargar resumen de crédito:', error);
                })
                .finally(() => setLoadingResumenCredito(false));
        }
    }, [proforma.id, proforma.politica_pago]);

    // Handlers para edición de detalles
    const handleEditarCantidad = (index: number, cantidad: number) => {
        const nuevosDetalles = [...editableDetalles];
        // Validar que sea un número válido y positivo
        const cantidadValida = Math.max(0.01, isNaN(cantidad) ? 0.01 : cantidad);
        const cantidadAnterior = nuevosDetalles[index].cantidad;
        nuevosDetalles[index].cantidad = cantidadValida;
        nuevosDetalles[index].subtotal = cantidadValida * nuevosDetalles[index].precio_unitario;
        setEditableDetalles(nuevosDetalles);

        // ✅ Log para verificar que se actualiza el subtotal
        console.log(
            '📦 Cantidad editada - Detalle:',
            index,
            'De:',
            cantidadAnterior,
            'A:',
            cantidadValida,
            'Nuevo subtotal:',
            nuevosDetalles[index].subtotal,
        );

        // Recalcular rangos de precio
        const itemsParaCalcular = nuevosDetalles.map((d) => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            tipo_precio_id: d.tipo_precio_id, // ✅ NUEVO: Respetar tipo_precio_id seleccionado
        }));
        calcularCarritoConRespeto(itemsParaCalcular);
    };

    // ✅ NUEVO: Handler para editar precio manualmente
    const handleEditarPrecio = (index: number, precioNuevo: number) => {
        const nuevosDetalles = [...editableDetalles];
        const precioValido = Math.max(0.01, isNaN(precioNuevo) ? nuevosDetalles[index].precio_unitario : precioNuevo);
        nuevosDetalles[index].precio_unitario = precioValido;
        nuevosDetalles[index].subtotal = nuevosDetalles[index].cantidad * precioValido;
        setEditableDetalles(nuevosDetalles);

        // ✅ Marcar este detalle como editado manualmente para que el API no lo sobrescriba
        const detalleId = nuevosDetalles[index].id;
        if (detalleId) {
            setPreciosEditadosManualmente((prev) => new Set(prev).add(detalleId));
        }

        // ✅ Recalcular totales (se hace automáticamente en el siguiente render,
        // pero aquí lo registramos en logs para feedback visual)
        console.log('💰 Precio editado - Detalle:', index, 'Nuevo precio:', precioValido, 'Nuevo subtotal:', nuevosDetalles[index].subtotal);
    };

    // ✅ NUEVO: Handler para cambiar tipo de precio
    const handleCambiarTipoPrecio = (index: number, tipoPrecioId: number | null) => {
        const nuevosDetalles = [...editableDetalles];
        const tipoAnterior = nuevosDetalles[index].tipo_precio_id;
        nuevosDetalles[index].tipo_precio_id = tipoPrecioId;
        setEditableDetalles(nuevosDetalles);

        // ✅ Limpiar marca de "editado manualmente" para este detalle
        // Así el nuevo precio del API carrito se aplicará automáticamente
        const detalleId = nuevosDetalles[index].id;
        if (detalleId) {
            setPreciosEditadosManualmente((prev) => {
                const newSet = new Set(prev);
                newSet.delete(detalleId);
                return newSet;
            });
        }

        // Recalcular rangos con el nuevo tipo de precio
        const itemsParaCalcular = nuevosDetalles.map((d) => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            tipo_precio_id: d.tipo_precio_id,
        }));
        console.log('🏷️ Tipo de precio cambiado - Detalle:', index, 'De:', tipoAnterior, 'A:', tipoPrecioId, '- Recalculando...');
        calcularCarritoConRespeto(itemsParaCalcular);
    };

    // ✅ NUEVO: Handlers para ProductosTable (centralizados)
    // ✅ NUEVO: Función wrapper para calcular carrito SIN enviar items con tipo_precio_id = null (OTROS)
    const calcularCarritoConRespeto = (items: any[]) => {
        // Filtrar items donde tipo_precio_id === null (usuario seleccionó "OTROS")
        const itemsFiltrados = items.filter((item) => {
            const tieneOtros = item.tipo_precio_id === null;
            if (tieneOtros) {
                console.log(`🔒 [calcularCarritoConRespeto] IGNORANDO producto ${item.producto_id} - tipo_precio_id = null (OTROS seleccionado)`);
            }
            return !tieneOtros; // Solo incluir si NO es null
        });

        // Si quedan items por calcular, enviar al backend
        if (itemsFiltrados.length > 0) {
            console.log(`📤 [calcularCarritoConRespeto] Enviando ${itemsFiltrados.length} items al backend`, itemsFiltrados);
            calcularCarritoDebounced(itemsFiltrados);
        } else {
            console.log('⏹️ [calcularCarritoConRespeto] TODOS los items tienen OTROS seleccionado, NO enviar al backend');
        }
    };

    const handleAgregarProducto = (producto: Producto) => {
        const precioRecomendado = (producto.precio_venta as number) ?? (producto.precio_base as number) ?? 0;

        // ✅ NUEVO: Buscar tipo_precio_nombre desde precios_venta del producto
        let tipo_precio_nombre = null;
        if ((producto as any).precios_venta && Array.isArray((producto as any).precios_venta)) {
            const precioCoincidente = (producto as any).precios_venta.find((p: any) => Math.abs(p.precio - precioRecomendado) < 0.01);
            if (precioCoincidente) {
                tipo_precio_nombre = precioCoincidente.tipo_precio_nombre;
            }
        }

        const nuevoDetalle: any = {
            id: Math.random(),
            producto,
            producto_id: producto.id,
            producto_nombre: producto.nombre,
            sku: producto.sku,
            cantidad: 1,
            precio_unitario: precioRecomendado,
            subtotal: precioRecomendado,
            stock_disponible: (producto as any).stock_disponible || 0,
            peso: (producto as any).peso || 0,
            categoria: (producto as any).categoria || undefined,
            limite_venta: (producto as any).limite_venta || null,
            tipo_precio_id: (producto as any).tipo_precio_id_recomendado || null,
            // ✅ NUEVO: Incluir tipo_precio_nombre
            tipo_precio_nombre: tipo_precio_nombre || (producto as any).tipo_precio_nombre_recomendado || null,
        };

        const nuevosDetalles = [...editableDetalles, nuevoDetalle];
        setEditableDetalles(nuevosDetalles);

        const itemsParaCalcular = nuevosDetalles.map((d) => ({
            producto_id: d.producto_id,
            cantidad: d.cantidad,
            tipo_precio_id: d.tipo_precio_id,
        }));

        // ✅ NUEVO: Marcar que hay cambios sin guardar
        setHaysCambiosSinGuardar(true);
        console.log('🔄 [handleAgregarProducto] Cambios detectados - Deshabilitando botón Aprobar');

        calcularCarritoConRespeto(itemsParaCalcular);
    };

    const handleUpdateDetalle = (index: number, field: keyof DetalleProducto, value: number | string) => {
        const nuevosDetalles = [...editableDetalles];
        const detalle = nuevosDetalles[index];

        // ✅ NUEVO: Flag para controlar si debemos recalcular el carrito
        let debeRecalcular = true;
        // ✅ NUEVO: Flag para saber si es cambio de cantidad o precio
        let escambioSignificativo = false;

        if (field === 'cantidad') {
            const cantidadValida = Math.max(0.01, isNaN(value as any) ? 0.01 : (value as number));
            detalle.cantidad = cantidadValida;
            detalle.subtotal = cantidadValida * detalle.precio_unitario;
            escambioSignificativo = true; // Cambio de cantidad requiere guardar
        } else if (field === 'precio_unitario') {
            // ✅ IMPORTANTE: Cuando se edita precio manualmente, DETENER el cálculo automático
            detalle.precio_unitario = value as number;
            detalle.subtotal = detalle.cantidad * (value as number);
            escambioSignificativo = true; // Cambio de precio requiere guardar
            const detalleId = detalle.id;
            if (detalleId) {
                setPreciosEditadosManualmente((prev) => new Set(prev).add(detalleId));
                console.log(`🔒 [handleUpdateDetalle] Precio editado manualmente - ID: ${detalleId}, NO recalcular carrito`);
                debeRecalcular = false; // ✅ NO RECALCULAR cuando el usuario edita manualmente
            }
        } else {
            (detalle as any)[field] = value;
        }

        // ✅ NUEVO: Marcar cambios sin guardar si se modificó cantidad o precio
        if (escambioSignificativo) {
            setHaysCambiosSinGuardar(true);
            console.log(`🔄 [handleUpdateDetalle] Campo '${field}' modificado - Cambios sin guardar activado`);
        }

        setEditableDetalles(nuevosDetalles);

        // ✅ NUEVO: Solo recalcular si no es una edición manual de precio
        if (debeRecalcular) {
            const itemsParaCalcular = nuevosDetalles.map((d) => ({
                producto_id: d.producto_id,
                cantidad: d.cantidad,
                tipo_precio_id: d.tipo_precio_id,
            }));
            calcularCarritoConRespeto(itemsParaCalcular);
        }
    };

    const handleRemoveDetalle = (index: number) => {
        const nuevosDetalles = editableDetalles.filter((_, i) => i !== index);
        setEditableDetalles(nuevosDetalles);
    };

    const handleTotalsChange = (detalles: any[]) => {
        // Handler opcional si ProductosTable notifica cambios de totales
    };

    // ✅ NUEVO (2026-02-20): Handler para cambios en items opcionales del combo
    const handleComboItemsChange = useCallback(
        (detailIndex: number, updatedItems: any[]) => {
            console.log(`📦 [Show.tsx] Combo items cambiaron en índice ${detailIndex}:`, updatedItems);

            const nuevosDetalles = [...editableDetalles];
            const detalle = nuevosDetalles[detailIndex];

            if (detalle && (detalle.producto as any)?.es_combo) {
                // Convertir items actualizados a combo_items_seleccionados
                // Solo incluir los que tienen _isChecked = true
                // ✅ IMPORTANTE: Incluir SIEMPRE items obligatorios + items opcionales seleccionados
                const comboItemsSeleccionados = updatedItems
                    .filter((item: any) => item.es_obligatorio === true || item._isChecked === true)
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

                console.log(
                    `✅ [handleComboItemsChange] Combo ${detalle.producto_id}: ${comboItemsSeleccionados.length} items incluidos (obligatorios + opcionales seleccionados)`,
                    comboItemsSeleccionados,
                );

                setEditableDetalles(nuevosDetalles);
                console.log(`✅ combo_items_seleccionados actualizado con ${comboItemsSeleccionados.length} items`);
            }
        },
        [editableDetalles],
    );

    // ✅ CRITICAL FIX (2026-02-18): Memorizar callback para evitar loop infinito
    // El callback se pasaba como prop inline a ProductosTable, causando que se recreara en cada render
    // Esto hacía que el useEffect de ProductosTable se disparara infinitamente
    const handleDetallesActualizadosPorRangos = useCallback((nuevosDetalles: any) => {
        console.log('🔄 [proformas/Show.tsx] ProductosTable notificó cambios en detalles por rangos');

        // ✅ NUEVO: DEBUG para verificar si combo_items_seleccionados se preserva
        nuevosDetalles.forEach((d: any) => {
            if (d.es_combo) {
                console.log(`🎁 [handleDetallesActualizadosPorRangos] Combo ${d.producto_id}:`, {
                    combo_items_seleccionados_count: d.combo_items_seleccionados?.length ?? 0,
                    combo_items_seleccionados: d.combo_items_seleccionados,
                });
            }
        });

        setEditableDetalles(nuevosDetalles);
    }, []); // ✅ EMPTY deps: Callback nunca cambia, perfectamente seguro

    // ✅ FIX (2026-02-18): Extraer productos de editableDetalles para pasarlos a ProductosTable
    // Esto permite que ProductosTable acceda a los combo_items, sku, stock y otras propiedades
    // que son necesarias para mostrar correctamente los productos combo
    const productosParaTabla = useMemo(() => {
        return editableDetalles
            .filter((d) => d.producto) // Asegurar que existe producto
            .map((d) => d.producto)
            .filter((p, idx, arr) => arr.findIndex((item) => item?.id === p?.id) === idx); // Eliminar duplicados por id
    }, [editableDetalles]);

    // Calcular total en tiempo real (usando precios actualizados por rango)
    const calcularTotales = () => {
        const subtotal = editableDetalles.reduce((sum, d) => {
            let precio: number;

            // ✅ PRIORIDAD 1: Si el precio fue editado manualmente, usar ese
            if (preciosEditadosManualmente.has(d.id)) {
                precio = d.precio_unitario ?? 0;
                console.log(`  ✏️ Precio MANUAL para Prod ${d.producto_id}: ${precio.toFixed(2)}`);
            } else {
                // ✅ PRIORIDAD 2: Si el API carrito tiene precio, usar ese
                const precioActualizado = getPrecioActualizado(d.producto_id as number);
                if (precioActualizado) {
                    precio = precioActualizado;
                    console.log(`  📊 Precio API para Prod ${d.producto_id}: ${precio.toFixed(2)}`);
                } else {
                    // ✅ FALLBACK: Usar precio actual del detalle
                    precio = d.precio_unitario ?? 0;
                }
            }

            const lineTotal = d.cantidad * precio;
            return sum + lineTotal;
        }, 0);
        const total = subtotal;

        // ✅ Log del total calculado
        if (editableDetalles.length > 0) {
            console.log(`💹 TOTALES RECALCULADOS - Subtotal: ${subtotal.toFixed(2)}, Total: ${total.toFixed(2)}`);
        }

        return { subtotal, total };
    };

    const totales = calcularTotales();

    const handleEliminarProducto = (index: number) => {
        const detalleEliminado = editableDetalles[index];
        const nuevosDetalles = editableDetalles.filter((_, i) => i !== index);
        setEditableDetalles(nuevosDetalles);

        // ✅ Limpiar marca de "editado manualmente" si existe
        if (detalleEliminado.id) {
            setPreciosEditadosManualmente((prev) => {
                const newSet = new Set(prev);
                newSet.delete(detalleEliminado.id);
                return newSet;
            });
        }
    };

    // ✅ NUEVO: Función para búsqueda rápida por código/ID de producto
    const handleBuscarYAgregarProducto = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!busquedaRapidaCodigo.trim()) {
            setErrorBusquedaRapida('Ingresa un código o ID de producto');
            return;
        }

        setCargandoBusquedaRapida(true);
        setErrorBusquedaRapida(null);

        try {
            // Construir query params para la búsqueda
            // tipo=venta asegura que busca productos aptos para venta
            const params = new URLSearchParams({
                q: busquedaRapidaCodigo.trim(),
                tipo: 'venta', // ✅ Especificar que es para venta
                tipo_busqueda: 'parcial', // ✅ Búsqueda parcial para mayor flexibilidad
            });

            const response = await fetch(`/api/productos/buscar?${params.toString()}`);

            if (!response.ok) {
                if (response.status === 404) {
                    setErrorBusquedaRapida('Producto no encontrado');
                } else {
                    setErrorBusquedaRapida('Error al buscar el producto');
                }
                return;
            }

            const data = await response.json();

            // Validar que la respuesta tiene estructura correcta
            if (!data.data || !Array.isArray(data.data)) {
                setErrorBusquedaRapida('Formato de respuesta inválido del servidor');
                return;
            }

            // Obtener lista de productos encontrados
            const productos = data.data as Producto[];

            if (productos.length === 0) {
                setErrorBusquedaRapida('Producto no encontrado');
                return;
            }

            // ✅ Si encuentra exactamente 1 producto, agregarlo automáticamente
            if (productos.length === 1) {
                const producto = productos[0];
                handleAgregarProducto(producto);
                setBusquedaRapidaCodigo('');
                toast.success(`Producto "${producto.nombre}" agregado a la proforma`);
                return;
            }

            // ✅ Si encuentra más de 1 producto, mostrar una alerta al usuario
            // El usuario debe ser más específico en su búsqueda
            const productosTexto = productos
                .slice(0, 5) // Mostrar máximo 5 opciones
                .map((p, i) => `${i + 1}. ${p.nombre} (SKU: ${p.sku || 'N/A'})`)
                .join('\n');

            setErrorBusquedaRapida(`Se encontraron ${productos.length} productos. Sé más específico:\n${productosTexto}`);
        } catch (error) {
            console.error('Error en búsqueda rápida:', error);
            setErrorBusquedaRapida('Error al conectar con el servidor');
        } finally {
            setCargandoBusquedaRapida(false);
        }
    };

    // PRESENTATION LAYER: Handlers simples que delegan al hook
    const handleAprobar = () => {
        // ✅ SIEMPRE usar flujo combinado: Aprobar + Convertir (incluso sin pago especificado)
        handleAprobarYConvertirConPago();
    };

    // Flujo combinado: Aprobar + Convertir con Pago
    /**
     * ✅ NUEVO: Función independiente para actualizar detalles de proforma
     *
     * Puede ser llamada:
     * 1. Desde un botón en la UI para guardar cambios sin aprobar
     * 2. Desde handleAprobarYConvertirConPago() como PASO 0 del flujo de aprobación
     *
     * @returns Promise<boolean> - true si se actualizó exitosamente, false si no hay cambios o error
     */
    const actualizarDetallesProforma = async (mostrarNotificaciones: boolean = true): Promise<boolean> => {
        console.log('%c✏️ Intentando actualizar detalles de proforma', 'color: blue;');

        // Validar que la proforma está en estado PENDIENTE
        if (!puedeSerEditada(proforma.estado)) {
            if (mostrarNotificaciones) {
                toast.error('Solo se pueden actualizar detalles de proformas pendientes');
            }
            console.log('%c⏭️ Actualización omitida: Proforma no está en estado "pendiente"', 'color: orange;', {
                estado: proforma.estado,
            });
            return false;
        }

        // Detectar si hay cambios entre los detalles editables y los originales
        const hayChangios =
            editableDetalles.length !== proforma.detalles.length ||
            editableDetalles.some((d, i) => {
                const original = proforma.detalles[i];
                if (!original) return true;

                // ✅ Comparar cantidad
                const cantidadCambió = d.cantidad !== (typeof original.cantidad === 'string' ? parseFloat(original.cantidad) : original.cantidad);

                // ✅ Comparar precio
                const precioCambió = d.precio_unitario !== original.precio_unitario;

                // ✅ NUEVO: Comparar combo_items_seleccionados (para combos)
                const comboItemsCambió = JSON.stringify(d.combo_items_seleccionados) !== JSON.stringify(original.combo_items_seleccionados);

                return cantidadCambió || precioCambió || comboItemsCambió;
            });

        if (!hayChangios) {
            if (mostrarNotificaciones) {
                console.log('%c⏭️ No hay cambios en los detalles', 'color: orange;');
            }
            return false;
        }

        try {
            console.log('%c📤 Enviando detalles actualizados al servidor...', 'color: blue;');

            // ✅ DEBUG: Ver si editableDetalles tiene combo_items_seleccionados ANTES de construir payload
            editableDetalles.forEach((d, idx) => {
                if (d.es_combo) {
                    console.log(`🎁 [actualizarDetallesProforma] Detalle ${idx} (Combo ${d.producto_id}):`, {
                        combo_items_seleccionados_count: d.combo_items_seleccionados?.length ?? 0,
                        combo_items_seleccionados: d.combo_items_seleccionados,
                    });
                }
            });

            // Preparar detalles para enviar
            const detallesParaGuardar = editableDetalles.map((d) => ({
                producto_id: d.producto_id,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario,
                subtotal: d.subtotal,
                // ✅ NUEVO: Incluir tipo_precio_id y tipo_precio_nombre (pueden ser null)
                tipo_precio_id: d.tipo_precio_id ?? null,
                tipo_precio_nombre: d.tipo_precio_nombre ?? null,
                // ✅ CORREGIDO: SIEMPRE incluir combo_items_seleccionados (incluso si es un array vacío)
                // Un array vacío es "falsy" en JS, así que necesitamos verificar !== undefined
                ...(d.combo_items_seleccionados !== undefined && {
                    combo_items_seleccionados: d.combo_items_seleccionados,
                }),
            }));

            // ✅ DEBUG: Ver EXACTAMENTE qué se envía
            const payloadParaEnviar = { detalles: detallesParaGuardar };
            console.log('%c🔍 PAYLOAD QUE SE ENVÍA:', 'color: purple; font-weight: bold;', JSON.stringify(payloadParaEnviar, null, 2));
            console.log('%c📊 DETALLES INDIVIDUALES:', 'color: purple;', detallesParaGuardar);

            // Realizar petición POST
            const response = await fetch(`/api/proformas/${proforma.id}/actualizar-detalles`, {
                method: 'POST',
                redirect: 'manual',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(payloadParaEnviar),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = `Error al actualizar detalles: ${errorData.message || 'Error desconocido'}`;
                if (mostrarNotificaciones) {
                    toast.error(errorMsg);
                }
                console.error('%c❌ Error en actualización de detalles', 'color: red;', errorData);
                throw new Error(errorMsg);
            }

            const actualizarData = await response.json();
            console.log('%c✅ Detalles actualizados exitosamente', 'color: green;', actualizarData);

            if (mostrarNotificaciones) {
                toast.success('✅ Detalles actualizados correctamente');
            }

            // ✅ NUEVO: Limpiar el flag de cambios sin guardar
            setHaysCambiosSinGuardar(false);
            console.log('✅ [actualizarDetallesProforma] Cambios guardados exitosamente - Botón Aprobar habilitado');

            return true;
        } catch (error) {
            console.error('%c❌ Error actualizando detalles:', 'color: red;', error);
            if (mostrarNotificaciones) {
                toast.error(error instanceof Error ? error.message : 'Error al actualizar detalles');
            }
            throw error;
        }
    };

    const handleAprobarYConvertirConPago = async () => {
        console.log('%c📋 Iniciando flujo combinado: Aprobar + Convertir', 'color: blue; font-weight: bold;');

        // ✅ NUEVO: Deshabilitar botón de Aprobar mientras se procesa
        setIsAprohandoLocal(true);

        // ✅ CRÍTICO: Establecer flag para evitar que el componente se remonte
        setIsFlowAprobacionConversion(true);
        // Inicializar flujo
        if (approvalFlow) {
            approvalFlow.initFlow(proforma);
            approvalFlow.updateCoordinacion(coordinacion);
            approvalFlow.updatePayment(coordinacion.payment!);
            approvalFlow.setLoading(true, 'approving');
        }

        try {
            // PASO 0: Intentar actualizar detalles usando función independiente
            // ✅ REFACTORIZADO: Usa actualizarDetallesProforma() que es reutilizable
            console.log('%c🔍 PASO 0: Detectando cambios en detalles...', 'color: blue;');

            try {
                // Intentar actualizar (mostrarNotificaciones=false para no duplicar mensajes)
                const seActualizaron = await actualizarDetallesProforma(false);

                if (seActualizaron) {
                    console.log('%c✅ PASO 0 completado: Detalles actualizados', 'color: green;');
                    toast.success('✅ Detalles actualizados correctamente');

                    // Actualizar estado del flujo
                    if (approvalFlow) {
                        approvalFlow.setLoading(true, 'approving');
                    }
                } else {
                    // Sin cambios o proforma no está pendiente
                    console.log('%c⏭️ PASO 0 omitido: Sin cambios en detalles o proforma no está pendiente', 'color: orange;');
                }
            } catch (error) {
                // Si hay error en actualización, propagar
                const errorMsg = error instanceof Error ? error.message : 'Error al actualizar detalles';
                console.error('%c❌ Error en PASO 0:', 'color: red;', errorMsg);
                toast.error(errorMsg);
                throw error;
            }

            // ✅ REFACTORIZADO (2026-04-05): PASO 1 & PASO 2 COMBINADOS
            // El endpoint convertir-venta ahora:
            // - Si proforma está PENDIENTE → la aprueba automáticamente (PASO 1)
            // - Luego la convierte a venta (PASO 2)
            // TODO en UNA transacción DB para evitar race conditions
            console.log('%c⏳ PASO 1&2: Aprobando y convirtiendo a venta (transacción única)...', 'color: blue;');

            // ✅ Preparar datos de coordinación (ahora solo informativos, no afectan conversión)
            const coordinacionData = {
                fecha_entrega_confirmada: coordinacion.fecha_entrega_confirmada,
                hora_entrega_confirmada: extractTime(coordinacion.hora_entrega_confirmada),
                hora_entrega_confirmada_fin: extractTime(coordinacion.hora_entrega_confirmada_fin),
                comentario_coordinacion: coordinacion.comentario_coordinacion,
                numero_intentos_contacto: coordinacion.numero_intentos_contacto,
                fecha_ultimo_intento: coordinacion.fecha_ultimo_intento || null,
                resultado_ultimo_intento: coordinacion.resultado_ultimo_intento,
                notas_llamada: coordinacion.notas_llamada || null,
            };

            console.log('%c📋 Datos de coordinación preparados (solo informativos)', 'color: gray;', coordinacionData);

            // ✅ Preparar datos de pago (pueden no existir si no se especificaron)
            const paymentData = coordinacion.payment
                ? {
                      con_pago: coordinacion.payment.con_pago,
                      tipo_pago_id: coordinacion.payment.tipo_pago_id,
                      politica_pago: coordinacion.payment.politica_pago,
                      monto_pagado: coordinacion.payment.monto_pagado,
                      fecha_pago: coordinacion.payment.fecha_pago,
                      numero_recibo: coordinacion.payment.numero_recibo,
                      numero_transferencia: coordinacion.payment.numero_transferencia,
                  }
                : {
                      con_pago: false,
                      politica_pago: 'CONTRA_ENTREGA', // Política por defecto
                  };

            console.log('%c💳 Datos de pago para conversión:', 'color: orange;', paymentData);

            const convertirResponse = await fetch(`/api/proformas/${proforma.id}/convertir-venta`, {
                method: 'POST',
                redirect: 'manual', // ✅ NO seguir redirects automáticamente
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest', // ✅ Indica que es AJAX
                },
                body: JSON.stringify({
                    ...paymentData,
                    ...coordinacionData, // ✅ Incluir datos de coordinación para actualizar proforma
                }),
            });

            // ✅ Detectar redirects
            if (convertirResponse.redirected || (convertirResponse.status >= 300 && convertirResponse.status < 400)) {
                console.error('❌ Servidor está redirigiendo en conversión:', {
                    redirectedTo: convertirResponse.url,
                    status: convertirResponse.status,
                });
                throw new Error(`El servidor está redirigiendo en conversión. Middleware issue.`);
            }

            if (!convertirResponse.ok) {
                const errorData = await convertirResponse.json();
                const errorMessage = errorData.message || 'Error al aprobar y convertir a venta';
                console.error('%c❌ Error en PASO 1&2:', 'color: red;', {
                    status: convertirResponse.status,
                    error: errorData,
                    razon: 'Posibles: Stock insuficiente, Caja no disponible, Proforma inválida',
                });
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }

            const convertirData = await convertirResponse.json();
            console.log('%c✅ PASO 1&2 COMPLETADOS: Proforma aprobada Y convertida a venta', 'color: green; font-weight: bold;', convertirData);

            // ✅ NUEVO: Mostrar detalles del stock consumido
            const stockConsumido = convertirData.data?.stock_consumido;
            if (stockConsumido) {
                toast.success(`✅ ${stockConsumido.mensaje}`, {
                    description: `Venta ${convertirData.data.venta.numero} - Total: Bs. ${convertirData.data.venta.total} (${stockConsumido.cantidad_productos} producto(s))`,
                });

                console.log('%c📦 Stock Consumido - Resumen:', 'color: green; font-weight: bold;', stockConsumido);
            } else {
                toast.success('✅ Proforma convertida a venta exitosamente');
            }

            // ✅ Actualizar estado del flujo con éxito (PASO 1&2 completados)
            if (approvalFlow) {
                approvalFlow.setProformaAprobada(convertirData.data?.proforma || proforma); // PASO 1 completado
                approvalFlow.setVentaCreada(convertirData.data?.venta || {}); // PASO 2 completado
                approvalFlow.markAsSuccess();
                approvalFlow.setLoading(false, 'success');
            }

            // Cerrar diálogo
            setShowAprobarDialog(false);

            // ✅ Mostrar notificación de éxito (PASO 0, PASO 1&2 completados)
            const successMessage = `Proforma aprobada, convertida a venta y reservas consumidas exitosamente`;
            console.log('%c🎉 ' + successMessage, 'color: green; font-weight: bold;');
            toast.success(successMessage);

            // ✅ NUEVO: Obtener la venta creada para imprimir
            const ventaCreada = convertirData.data?.venta;
            if (ventaCreada && ventaCreada.id) {
                console.log('%c📋 Abriendo modal de impresión para venta:', 'color: blue;', {
                    venta_id: ventaCreada.id,
                    venta_numero: ventaCreada.numero,
                });

                // Guardar la venta para imprimir
                setVentaParaImprimir(ventaCreada);

                // Abrir el modal de selección de salida
                setShowOutputSelection(true);
            } else {
                // Si no hay venta, recargar la página directamente
                console.warn('⚠️ No se obtuvo venta para imprimir, recargan página directamente');
                setIsFlowAprobacionConversion(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('%c❌ Error en flujo combinado:', 'color: red;', error);

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

            // ✅ NUEVO: Detectar si es error de caja no disponible
            const isCajaError =
                errorMessage.includes('caja abierta') || errorMessage.includes('caja consolidada') || errorMessage.includes('CAJA_NO_DISPONIBLE');

            if (isCajaError) {
                console.warn('%c⚠️ Error de caja detectado, mostrando dialog de redirección:', 'color: orange;', errorMessage);

                // Mostrar dialog para navegar a cajas
                setCajaErrorMessage(errorMessage);
                setShowCajaErrorDialog(true);
            } else {
                // Mostrar notificación de error en toast para otros errores
                toast.error(`Error: ${errorMessage}`);
            }

            // Actualizar estado de error
            if (approvalFlow) {
                approvalFlow.setError(errorMessage);
                approvalFlow.setLoading(false, 'error');
            }

            // ✅ CRÍTICO: Resetear flag para permitir que el componente se actualice nuevamente
            setIsFlowAprobacionConversion(false);
        } finally {
            // ✅ NUEVO: Deshabilitar el estado de cargando local
            setIsAprohandoLocal(false);
        }
    };

    const handleRechazar = async () => {
        if (!motivoRechazo.trim()) {
            toast.error('Debe indicar un motivo de rechazo');
            return;
        }

        try {
            setShowRechazarDialog(false);

            // Obtener token CSRF
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            // Realizar la solicitud POST
            const response = await fetch(`/proformas/${proforma.id}/rechazar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ motivo: motivoRechazo.trim() }),
            });

            const data = await response.json();

            // Mostrar toast con el mensaje del servidor
            if (data.success) {
                toast.success(data.message || 'Proforma rechazada correctamente');

                // Recargar la página después de 1 segundo
                setTimeout(() => {
                    window.location.href = '/proformas';
                }, 1000);
            } else {
                toast.error(data.message || 'Error al rechazar la proforma');
            }
        } catch (error) {
            console.error('Error al rechazar proforma:', error);
            toast.error('Error al procesar la solicitud');
        } finally {
            setMotivoRechazo('');
        }
    };

    const handleConvertir = () => {
        // Resetear estado de error previo
        setConvertErrorState(null);

        // Llamar a convertirAVenta
        // NO cerrar el modal aún - dejaremos que el callback onError lo maneje
        convertirAVenta();

        // El modal se cerrará desde el callback onSuccess o onError
        // si NO es RESERVAS_EXPIRADAS
    };

    // ✅ NUEVO: Manejar navegación a siguiente proforma pendiente
    const handleSiguiente = async () => {
        setLoadingSiguiente(true);
        try {
            const response = await fetch(`/api/proformas/siguiente-pendiente?current_id=${proforma.id}&incluir_stats=true`);
            const data = await response.json();

            if (!data.success) {
                toast.error('Error al obtener siguiente proforma');
                setLoadingSiguiente(false);
                return;
            }

            if (!data.existe_siguiente) {
                toast.success('¡No hay más proformas pendientes!');
                setLoadingSiguiente(false);
                return;
            }

            // Guardar información de siguiente proforma
            setSiguienteProforma(data.proforma);

            // Mostrar toast informativo
            if (data.stats) {
                toast.success(`Siguiente: ${data.proforma.numero} (${data.stats.indice})`);
            }

            // Navegar a la siguiente proforma
            setTimeout(() => {
                window.location.href = `/proformas/${data.proforma.id}`;
            }, 300);
        } catch (error) {
            console.error('Error al obtener siguiente proforma:', error);
            toast.error('Error al obtener siguiente proforma');
        } finally {
            setLoadingSiguiente(false);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Proformas', href: '/proformas' },
                { title: `Proforma ${proforma.id}`, href: '#' },
            ]}
        >
            <Head title={`Proforma #${proforma.id}`} />

            <div className="space-y-6 p-2">
                {/* Banner de advertencia si hay error de reservas */}
                {/* ✅ NUEVO: Banner de reservas expiradas al cargar */}
                {reservasExpiradasAlCargar && (
                    <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600" />
                            <div className="flex-1">
                                <h3 className="mb-2 text-lg font-bold text-red-900 dark:text-red-200">🚨 Las Reservas han Expirado</h3>
                                <p className="mb-4 text-sm text-red-800 dark:text-red-300">
                                    Las reservas de stock para esta proforma han expirado. Para poder procesar la venta, necesitas renovarlas primero.
                                </p>
                                <Button
                                    onClick={() => {
                                        renovarReservas(() => {
                                            console.log('✅ Reservas renovadas desde el banner inicial');
                                            setReservasExpiradasAlCargar(false);
                                        });
                                    }}
                                    disabled={isRenovandoReservas}
                                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {isRenovandoReservas ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Renovando Reservas...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-4 w-4" />
                                            Renovar Reservas por 7 Días
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {convertErrorState?.code === 'RESERVAS_EXPIRADAS' && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                            <div className="flex-1">
                                <h3 className="mb-1 font-semibold text-amber-900 dark:text-amber-200">⚠️ Reservas Expiradas</h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300">
                                    {convertErrorState.reservasExpiradas} reserva(s) de esta proforma han expirado. Para convertir a venta, necesitas
                                    renovar las reservas primero.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header - Similar a ventas: 1/3 título + 2/3 datos */}
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                    {/* Columnas 2-3: Datos secundarios (2/3) */}
                    <div className="mb-2 p-1">
                        <div className="grid grid-cols-6 gap-2">
                            {/* ✅ NUEVO: Foto del Cliente */}
                            {proforma.cliente.foto_perfil && (
                                <Dialog open={showImagenModal} onOpenChange={setShowImagenModal}>
                                    <DialogContent className="h-screen w-screen max-w-full rounded-none p-0">
                                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
                                            {proforma.cliente.foto_perfil && (
                                                <img
                                                    src={`/storage/${proforma.cliente.foto_perfil}`}
                                                    alt={proforma.cliente.nombre}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            )}
                                            <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                                                <div className="rounded-lg bg-black/70 px-3 py-2 text-white">
                                                    <p className="font-semibold">{proforma.cliente.nombre}</p>
                                                    {proforma.cliente.telefono && <p className="text-xs opacity-90">{proforma.cliente.telefono}</p>}
                                                </div>
                                                <button
                                                    onClick={() => setShowImagenModal(false)}
                                                    className="rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black"
                                                    title="Cerrar"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}

                            {/* Foto y Datos Principales */}
                            <div className="rounded-lg border border-slate-200 bg-white p-2 md:col-span-1 lg:col-span-1 dark:border-slate-700/50 dark:bg-slate-950/40">
                                <div className="flex items-start gap-3">
                                    {/* Foto de perfil */}
                                    <div className="flex-shrink-0">
                                        <div
                                            className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 transition-opacity hover:opacity-80 dark:border-zinc-700 dark:bg-zinc-700"
                                            onClick={() => proforma.cliente.foto_perfil && setShowImagenModal(true)}
                                        >
                                            {proforma.cliente.foto_perfil && typeof proforma.cliente.foto_perfil === 'string' && imagenCargada ? (
                                                <img
                                                    src={`/storage/${proforma.cliente.foto_perfil}`}
                                                    alt={proforma.cliente.nombre}
                                                    className="h-full w-full object-cover"
                                                    onError={() => setImagenCargada(false)}
                                                />
                                            ) : (
                                                <User className="h-7 w-7 text-gray-400 dark:text-gray-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Datos básicos del cliente */}
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            {/* <p className="mb-1 text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
                                                📝 Nombre
                                            </p> */}
                                            <p className="text-sm font-bold text-foreground">{proforma.cliente.nombre}</p>
                                        </div>
                                        {/* {proforma.cliente.email && (
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Email: {proforma.cliente.email}</p>
                                            </div>
                                        )} */}

                                        {proforma.cliente.telefono && (
                                            <div className="flex items-center gap-2">
                                                {/* <p className="text-xs text-gray-600 dark:text-gray-400">Tel: {proforma.cliente.telefono}</p> */}
                                                <a
                                                    href={`https://wa.me/${proforma.cliente.telefono.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Abrir en WhatsApp"
                                                    className="text-xs text-gray-600 dark:text-gray-400"
                                                >
                                                    {/* <MessageCircle className="h-4 w-4" /> */}
                                                    {proforma.cliente.telefono}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="flex-shrink-0">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                        <span className="text-sm">📄</span>
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Folio</p>
                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">#{proforma.id}</p>
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`truncate text-xs font-bold ${
                                                proforma.politica_pago === 'CREDITO'
                                                    ? 'text-purple-800 dark:text-purple-200'
                                                    : 'text-slate-900 dark:text-white'
                                            }`}
                                        >
                                            {proforma.politica_pago === 'CREDITO'
                                                ? '🔴 CRÉDITO'
                                                : proforma.politica_pago === 'ANTICIPADO_100'
                                                  ? 'ANTICIPADO 100%'
                                                  : proforma.politica_pago === 'CONTRA_ENTREGA'
                                                    ? 'CONTRA ENTREGA'
                                                    : proforma.politica_pago}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="flex-shrink-0">
                                    <div
                                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                            proforma.estado === 'APROBADA' || proforma.estado === 'CONVERTIDA'
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : proforma.estado === 'RECHAZADA'
                                                  ? 'bg-red-100 dark:bg-red-900/30'
                                                  : 'bg-yellow-100 dark:bg-yellow-900/30'
                                        }`}
                                    >
                                        <span className="text-sm">
                                            {proforma.estado === 'APROBADA' || proforma.estado === 'CONVERTIDA'
                                                ? '✅'
                                                : proforma.estado === 'RECHAZADA'
                                                  ? '❌'
                                                  : '⏳'}
                                        </span>
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    {/* <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase truncate">Estado</p> */}
                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{proforma.estado}</p>
                                    {proforma.venta ? (
                                        <a
                                            href={`/ventas/${proforma.venta.id}`}
                                            className="block truncate text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            F. Venta: {proforma.venta.id} →
                                        </a>
                                    ) : (
                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">F. Venta: Pendiente</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="flex-shrink-0">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        <span className="text-sm">📅</span>
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Creada por</p>
                                    {/* Usuario Creador */}
                                    {proforma.usuario_creador && (
                                        <p className="truncate text-xs font-bold text-blue-900 dark:text-blue-100">{proforma.usuario_creador.name}</p>
                                    )}
                                    <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                        {new Date(proforma.created_at).toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                            </div>

                            {/* Fecha Entrega Solicitada */}
                            {proforma.fecha_entrega_solicitada && (
                                <div className="flex items-center space-x-2 p-1">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                            <span className="text-sm">📦</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Entrega Sol.</p>
                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                            {proforma.fecha_entrega_solicitada.split('T')[0].split('-').reverse().join('-')}
                                        </p>
                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                            {proforma.hora_entrega_solicitada}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Fecha Vencimiento */}
                            {proforma.fecha_vencimiento && (
                                <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                            <span className="text-sm">⏰</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Vencimiento</p>
                                        <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                            {proforma.fecha_vencimiento.split('T')[0].split('-').reverse().join('-')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Preventista Asignado */}
                            {proforma.preventista ? (
                                <div className="flex items-center space-x-2 rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-700/50 dark:bg-amber-900/20">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-800">
                                            <span className="text-sm">💼</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-amber-600 uppercase dark:text-amber-400">Preventista</p>
                                        <p className="truncate text-xs font-bold text-amber-900 dark:text-amber-100">{proforma.preventista.nombre}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700/50 dark:bg-gray-800/20">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                                            <span className="text-sm">-</span>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">Preventista</p>
                                        <p className="truncate text-xs font-bold text-gray-900 dark:text-gray-100">No asignado</p>
                                    </div>
                                </div>
                            )}

                            {/* ✅ NUEVO: Tipo de Pago - Destacado cuando es CREDITO */}
                            {/* <div
                                className={`flex items-center space-x-2 rounded-lg border p-2 ${
                                    proforma.politica_pago === 'CREDITO'
                                        ? 'border-purple-200 bg-purple-100 dark:border-purple-700 dark:bg-purple-900/30'
                                        : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
                                }`}
                            >
                                <div className="flex-shrink-0">
                                    <div
                                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                            proforma.politica_pago === 'CREDITO'
                                                ? 'bg-purple-200 dark:bg-purple-800'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                    >
                                        <span className="text-sm">
                                            {proforma.politica_pago === 'CREDITO'
                                                ? '💳'
                                                : proforma.politica_pago === 'ANTICIPADO_100'
                                                  ? '💵'
                                                  : proforma.politica_pago === 'CONTRA_ENTREGA'
                                                    ? '📦'
                                                    : '💰'}
                                        </span>
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Forma de Pago</p>
                                    <p
                                        className={`truncate text-xs font-bold ${
                                            proforma.politica_pago === 'CREDITO'
                                                ? 'text-purple-800 dark:text-purple-200'
                                                : 'text-slate-900 dark:text-white'
                                        }`}
                                    >
                                        {proforma.politica_pago === 'CREDITO'
                                            ? '🔴 CRÉDITO'
                                            : proforma.politica_pago === 'ANTICIPADO_100'
                                              ? 'ANTICIPADO 100%'
                                              : proforma.politica_pago === 'CONTRA_ENTREGA'
                                                ? 'CONTRA ENTREGA'
                                                : proforma.politica_pago}
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* ✅ NUEVO: Usuario Creador y Preventista */}
                    <div className="mb-2 grid grid-cols-2 gap-2 p-1 md:grid-cols-2"></div>

                    {/* Botones de acción */}
                    <div className="flex flex-col flex-wrap items-center gap-2 md:flex-row">
                        {puedeAprobar && (
                            <Button
                                variant="default"
                                onClick={() => setShowAprobarDialog(true)}
                                disabled={haysCambiosSinGuardar}
                                title={haysCambiosSinGuardar ? 'Debes guardar los cambios en detalles antes de aprobar' : 'Aprobar proforma'}
                                className="bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Aprobar
                            </Button>
                        )}

                        {puedeRechazar && (
                            <Button variant="destructive" onClick={() => setShowRechazarDialog(true)}>
                                <X className="mr-2 h-4 w-4" />
                                Rechazar
                            </Button>
                        )}

                        {/* ✅ NUEVO: Botón para editar la proforma (solo disponible en estado PENDIENTE) */}
                        {proforma.estado === 'PENDIENTE' && (
                            <Button onClick={() => (window.location.href = `/proformas/${proforma.id}/edit`)} variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        )}

                        {puedeConvertir && (
                            <Button onClick={() => setShowAprobarDialog(true)} className="bg-purple-600 text-white hover:bg-purple-700">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Convertir a Venta
                            </Button>
                        )}

                        {/* ✅ NUEVO: Botón para abrir modal de selección de salida (impresión/descarga) */}
                        <Button onClick={() => setShowProformaOutputSelection(true)} variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Imprimir
                        </Button>

                        {/* Dirección Solicitada */}
                        {proforma.direccion_solicitada && (
                            <button
                                onClick={() => {
                                    if (proforma.direccion_solicitada?.latitud && proforma.direccion_solicitada?.longitud) {
                                        setDireccionMapaResumen('solicitada');
                                        setShowMapaResumen(true);
                                    }
                                }}
                                className={`cursor-pointer rounded-lg border p-2 text-left text-xs transition-all ${
                                    proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                        ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-900/30'
                                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/50'
                                }`}
                                disabled={!proforma.direccion_solicitada?.latitud || !proforma.direccion_solicitada?.longitud}
                            >
                                {/* <div className="mb-2 flex items-center gap-2">
                                        <span
                                            className={`text-xs font-semibold tracking-wide uppercase ${
                                                proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                    ? 'text-amber-700 dark:text-amber-300'
                                                    : 'text-blue-600 dark:text-blue-400'
                                            }`}
                                        >
                                            📍 Dirección Solicitada
                                        </span>
                                        {proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion && (
                                            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                                                ✅ Igual
                                            </span>
                                        )}
                                    </div> */}
                                <span
                                    className={`font-small block text-xs ${
                                        proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                            ? 'text-amber-800 dark:text-amber-300'
                                            : 'text-foreground'
                                    }`}
                                >
                                    {proforma.direccion_solicitada.observaciones}
                                </span>
                                {proforma.direccion_solicitada?.latitud && proforma.direccion_solicitada?.longitud && (
                                    <span
                                        className={`mt-2 inline-block text-xs font-semibold ${
                                            proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                ? 'text-amber-700 dark:text-amber-400'
                                                : 'text-blue-600 dark:text-blue-400'
                                        }`}
                                    >
                                        🗺️ Ver en mapa
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Información principal */}
                <div className="space-y-[var(--space-lg)] lg:col-span-2">
                    {/* Detalles de la proforma */}
                    <div className="space-y-4 p-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Detalles de la Proforma ({proforma.items_count} {(proforma.items_count ?? 0) !== 1 ? 'productos' : 'producto'})
                            </div>
                            {/* Advertencia sobre cambios locales */}
                            {haysCambiosSinGuardar && (
                                <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-900/20">
                                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                    <div className="text-amber-900 dark:text-amber-100">
                                        <p className="font-small">⚠️ Cambios sin guardar</p>
                                        <p className="text-xs">
                                            Has realizado cambios en los detalles. Debes presionar <strong>"Guardar Cambios"</strong> antes de poder
                                            aprobar la proforma.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {/* ✅ NUEVO: Botón para guardar cambios en detalles sin aprobar */}
                            {puedeSerEditada(proforma.estado) && haysCambiosSinGuardar && (
                                <Button
                                    variant="outline"
                                    onClick={() => actualizarDetallesProforma(true)}
                                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    title="Guardar los cambios realizados en los detalles sin aprobar la proforma"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Guardar Cambios
                                </Button>
                            )}
                        </div>

                        <Separator />

                        {/* ✅ FIX (2026-06-09): Envolver tabla en contenedor sin scroll (ProductosTable maneja el suyo) */}
                        <div className="w-full">
                            {/* ✅ FIX (2026-02-18): Pasar productos extraídos de editableDetalles + callback memoizado */}
                            <ProductosTable
                                productos={productosParaTabla}
                                detalles={editableDetalles as DetalleProducto[]}
                                onAddProduct={handleAgregarProducto}
                                onUpdateDetail={handleUpdateDetalle}
                                onRemoveDetail={handleRemoveDetalle}
                                onTotalsChange={handleTotalsChange}
                                onComboItemsChange={handleComboItemsChange}
                                tipo="venta"
                                almacen_id={almacenIdSeguro}
                                isCalculatingPrices={isCalculandoRangos}
                                readOnly={!puedeSerEditada(proforma.estado)}
                                errors={undefined}
                                carritoCalculado={carritoCalculado}
                                onDetallesActualizados={handleDetallesActualizadosPorRangos}
                                proformaConvertida={proforma.estado === 'CONVERTIDA'}
                            />
                        </div>

                        {/* Resumen de Totales en Tiempo Real */}
                        <div className="mt-6 space-y-3 border-t border-border/50 pt-6">
                            {/* Indicador de cálculo en progreso */}
                            {isCalculandoRangos && (
                                <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-900/20">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                    <p className="text-xs text-blue-700 dark:text-blue-200">Recalculando precios...</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-12">
                                {/* Subtotal */}
                                <div className="space-y-2 text-right">
                                    <p className="text-sm font-medium text-foreground">Subtotal:</p>
                                    <p className="text-xl font-semibold text-muted-foreground">
                                        Bs. {totales.subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                {/* Total */}
                                <div className="space-y-2 text-right">
                                    <p className="text-sm font-medium text-foreground">Total:</p>
                                    <p className="text-2xl font-bold text-[var(--brand-primary)]">
                                        Bs. {totales.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                            {/* {totales.total !== proforma.subtotal && (
                                        <p className="text-xs text-amber-600 dark:text-amber-400 text-right italic">
                                            ℹ️ Total modificado desde: Bs. {proforma.subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        </p>
                                    )} */}
                        </div>
                    </div>

                    {/* Observaciones */}
                    {proforma.observaciones && (
                        <ProformaCard variant="default" title="Observaciones">
                            <p className="leading-relaxed text-[var(--text-sm)] text-muted-foreground">{proforma.observaciones}</p>
                        </ProformaCard>
                    )}

                    {/* ✅ Card de Dirección - Se oculta completamente cuando showDireccionCard es false */}
                    {proforma.direccion_solicitada && showDireccionCard && (
                        <ProformaCard
                            variant="info"
                            title="Dirección de Entrega"
                            // ✅ Botón toggle en el header para mostrar/ocultar
                            headerAction={
                                <Button size="sm" variant="ghost" onClick={() => setShowDireccionCard(!showDireccionCard)} className="h-6 w-6 p-0">
                                    <ChevronUp className="h-4 w-4" />
                                </Button>
                            }
                        >
                            <div className="space-y-[var(--space-sm)]">
                                <div>
                                    <div className="font-medium text-[var(--text-xs)] text-muted-foreground uppercase">Dirección Solicitada</div>
                                    <div className="mt-2 text-[var(--text-sm)] text-muted-foreground">{proforma.direccion_solicitada.direccion}</div>
                                </div>

                                {proforma.direccion_solicitada.observaciones && (
                                    <div>
                                        <div className="font-medium text-[var(--text-xs)] text-muted-foreground uppercase">Observaciones</div>
                                        <div className="mt-2 text-[var(--text-sm)] text-muted-foreground italic">
                                            📝 {proforma.direccion_solicitada.observaciones}
                                        </div>
                                    </div>
                                )}

                                {proforma.direccion_solicitada.latitud && proforma.direccion_solicitada.longitud ? (
                                    <>
                                        {/* Mostrar coordenadas */}
                                        <div className="text-[var(--text-xs)] text-muted-foreground">
                                            <span className="font-medium">Coordenadas:</span> {proforma.direccion_solicitada.latitud.toFixed(4)},{' '}
                                            {proforma.direccion_solicitada.longitud.toFixed(4)}
                                        </div>

                                        {/* Botón para mostrar mapa - LAZY LOAD */}
                                        <Button size="sm" variant="outline" onClick={() => setShowMapaEntrega(true)} className="mt-2 w-full text-sm">
                                            <MapPin className="mr-1 h-4 w-4" />
                                            Ver ubicación en mapa
                                        </Button>

                                        {/* Modal expandible con mapa - Optimizado para mobile */}
                                        {showMapaEntrega && (
                                            <div className="space-y-[var(--space-sm)] border-t pt-[var(--space-sm)] duration-200 animate-in fade-in">
                                                <div className="mb-2 font-medium text-[var(--text-xs)] text-muted-foreground">
                                                    📍 Ubicación en el mapa:
                                                </div>

                                                {/* Contenedor responsive del mapa */}
                                                <div className="overflow-hidden rounded-lg border border-border/50">
                                                    <MapViewWithFallback
                                                        latitude={proforma.direccion_solicitada.latitud}
                                                        longitude={proforma.direccion_solicitada.longitud}
                                                        height="280px"
                                                        zoom={16}
                                                        markerTitle="Ubicación de entrega solicitada"
                                                    />
                                                </div>

                                                {/* Botón para cerrar - Mobile optimizado */}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setShowMapaEntrega(false)}
                                                    className="w-full text-xs hover:bg-muted"
                                                >
                                                    ✕ Cerrar mapa
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-[var(--text-xs)] text-amber-600 dark:text-amber-400">
                                        No hay coordenadas disponibles para esta dirección
                                    </div>
                                )}

                                {proforma.fecha_entrega_solicitada && (
                                    <div className="border-t pt-[var(--space-sm)]">
                                        <div className="mb-1 font-medium text-[var(--text-xs)] text-muted-foreground uppercase">Fecha Solicitada</div>
                                        <div className="font-medium text-[var(--text-sm)]">
                                            {proforma.fecha_entrega_solicitada.split('T')[0].split('-').reverse().join('-')}
                                        </div>
                                    </div>
                                )}
                                {proforma.hora_entrega_solicitada && (
                                    <div>
                                        <div className="mb-1 font-medium text-[var(--text-xs)] text-muted-foreground uppercase">Hora Solicitada</div>
                                        <div className="font-medium text-[var(--text-sm)]">
                                            {proforma.hora_entrega_solicitada}
                                            {proforma.hora_entrega_solicitada_fin && (
                                                <span>
                                                    {' - '}
                                                    {proforma.hora_entrega_solicitada_fin}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ProformaCard>
                    )}
                </div>
            </div>

            {/* Diálogo de aprobación con verificación de pago */}
            <Dialog open={showAprobarDialog} onOpenChange={setShowAprobarDialog}>
                <DialogContent className="max-h-[90vh] overflow-y-auto" style={{ maxWidth: '85vw', maxHeight: '95vh' }}>
                    <DialogHeader>
                        <DialogTitle>Aprobar Proforma con Verificación de Pago</DialogTitle>
                        <DialogDescription>Complete los datos de coordinación de entrega y verifique el pago</DialogDescription>
                    </DialogHeader>

                    <ApprovalPaymentForm
                        proforma={proforma}
                        coordinacion={coordinacion}
                        onCoordinacionChange={setCoordinacion}
                        onSubmit={handleAprobar}
                        onCancel={() => setShowAprobarDialog(false)}
                        isSubmitting={isSubmitting || isAprohandoLocal}
                        errorState={convertErrorState}
                        onRenovarReservas={() => {
                            renovarReservas(() => {
                                // Después de renovar, resetear el estado de error
                                console.log('✅ Reservas renovadas, habilitando aprobación...');
                                setConvertErrorState(null);
                                // Permitir que el usuario intente de nuevo
                            });
                        }}
                        isRenovando={isRenovandoReservas}
                    />
                </DialogContent>
            </Dialog>

            {/* Diálogo para rechazar con motivo */}
            <Dialog open={showRechazarDialog} onOpenChange={setShowRechazarDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rechazar Proforma</DialogTitle>
                        <DialogDescription>Por favor, indica el motivo del rechazo de la proforma {proforma.numero}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="motivo">Motivo del rechazo *</Label>
                            <Textarea
                                id="motivo"
                                placeholder="Escribe el motivo del rechazo (mínimo 10 caracteres)..."
                                value={motivoRechazo}
                                onChange={(e) => setMotivoRechazo(e.target.value)}
                                disabled={isSubmitting}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">{motivoRechazo.length}/500 caracteres</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRechazarDialog(false);
                                setMotivoRechazo('');
                            }}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleRechazar} disabled={isSubmitting || !motivoRechazo.trim()}>
                            {isSubmitting ? 'Rechazando...' : 'Rechazar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ✅ NUEVO: Diálogo para error de caja no disponible */}
            <Dialog open={showCajaErrorDialog} onOpenChange={setShowCajaErrorDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            Caja No Disponible
                        </DialogTitle>
                        <DialogDescription>No puedes convertir la proforma a venta sin una caja abierta</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                {cajaErrorMessage || 'Por favor, abre una caja antes de convertir esta proforma a venta.'}
                            </p>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                            <p className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">¿Qué necesitas hacer?</p>
                            <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                <li>Abre una nueva caja en el módulo de Cajas</li>
                                <li>O utiliza una caja consolidada del día anterior</li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowCajaErrorDialog(false)}>
                            Cerrar
                        </Button>
                        <Button
                            onClick={() => {
                                // Navegar a la página de cajas
                                window.location.href = '/cajas';
                            }}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Ir a Cajas
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal para convertir a venta */}
            <ProformaConvertirModal
                isOpen={showConvertirDialog}
                onClose={() => {
                    setShowConvertirDialog(false);
                    setConvertErrorState(null);
                }}
                proforma={proforma}
                onConvertir={handleConvertir}
                isProcessing={isConverting}
                onRenovarReservas={() => {
                    renovarReservas(() => {
                        // Después de renovar, reintentar conversión automáticamente
                        console.log('✅ Reservas renovadas, reintentando conversión...');
                        setConvertErrorState(null);
                        setTimeout(() => {
                            convertirAVenta();
                        }, 1500);
                    });
                }}
                isRenovando={isRenovandoReservas}
                errorState={convertErrorState}
            />

            {/* Diálogo para agregar productos */}
            <ProductSelectionDialog
                open={showAgregarProductoDialog}
                onOpenChange={setShowAgregarProductoDialog}
                productos={productosDisponibles as Producto[]}
                searchTerm={searchProducto}
                onSearchChange={setSearchProducto}
                onSelectProducto={handleAgregarProducto}
                isLoading={isLoadingProductos}
                error={errorProductos}
            />

            {/* Loading Overlay para flujo de aprobación */}
            {approvalFlow && (
                <LoadingOverlay
                    isVisible={approvalFlow.state.loading}
                    step={
                        approvalFlow.state.step === 'approving' ? 'approval' : approvalFlow.state.step === 'converting' ? 'conversion' : 'processing'
                    }
                    message={
                        approvalFlow.state.step === 'approving'
                            ? 'Aprobando proforma con datos de coordinación...'
                            : approvalFlow.state.step === 'converting'
                              ? 'Convirtiendo a venta y registrando pago...'
                              : 'Procesando solicitud...'
                    }
                />
            )}

            {/* ✅ NUEVO: Modal para seleccionar formato de salida (impresión) */}
            {ventaParaImprimir && (
                <OutputSelectionModal
                    isOpen={showOutputSelection}
                    onClose={() => {
                        console.log('%c📋 Modal cerrado, recargando página...', 'color: blue;');
                        setShowOutputSelection(false);
                        setVentaParaImprimir(null);

                        // ✅ CRÍTICO: Resetear flag ANTES de recargar la página
                        setIsFlowAprobacionConversion(false);

                        // Recargar la página después de cerrar el modal
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }}
                    documentoId={ventaParaImprimir.id}
                    tipoDocumento="venta"
                    documentoInfo={{
                        numero: ventaParaImprimir.numero,
                        fecha: ventaParaImprimir.fecha_venta,
                        monto: ventaParaImprimir.total,
                    }}
                />
            )}

            {/* ✅ NUEVO: Modal para seleccionar formato de salida de proforma */}
            <OutputSelectionModal
                isOpen={showProformaOutputSelection}
                onClose={() => setShowProformaOutputSelection(false)}
                documentoId={proforma.id}
                tipoDocumento="proforma"
                documentoInfo={{
                    numero: proforma.numero,
                    fecha: proforma.fecha,
                    monto: proforma.total,
                }}
            />

            {/* ✅ NUEVO: Modal de Ubicación de Entrega con Mapa Mejorado */}
            <UbicacionesMultiplesModal
                isOpen={showMapaResumen}
                onClose={() => setShowMapaResumen(false)}
                ubicaciones={
                    proforma.direccion_solicitada?.latitud && proforma.direccion_solicitada?.longitud
                        ? [
                              {
                                  id: proforma.direccion_solicitada.id,
                                  venta_id: proforma.id,
                                  venta_numero: proforma.numero,
                                  cliente_nombre: proforma.cliente?.nombre || 'Cliente desconocido',
                                  cliente_telefono: proforma.cliente?.telefono,
                                  cliente_foto: proforma.cliente?.foto_perfil ? `/storage/${proforma.cliente.foto_perfil}` : undefined,
                                  direccion: proforma.direccion_confirmada?.direccion || proforma.direccion_solicitada?.direccion || 'Sin dirección',
                                  observaciones: proforma.direccion_confirmada?.observaciones || proforma.direccion_solicitada?.observaciones,
                                  latitud:
                                      direccionMapaResumen === 'solicitada'
                                          ? proforma.direccion_solicitada.latitud
                                          : proforma.direccion_confirmada?.latitud || proforma.direccion_solicitada.latitud,
                                  longitud:
                                      direccionMapaResumen === 'solicitada'
                                          ? proforma.direccion_solicitada.longitud
                                          : proforma.direccion_confirmada?.longitud || proforma.direccion_solicitada.longitud,
                                  estado: proforma.estado,
                              },
                          ]
                        : []
                }
                titulo={`Ubicación de Entrega - Proforma ${proforma.numero}`}
            />

            {/* ✅ VIEJO: Modal para ver mapa de dirección en resumen (OCULTO - REEMPLAZADO POR UBICACIONESMULTIPLESMODAL) */}
            <Dialog open={false} onOpenChange={() => {}}>
                <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto" style={{ display: 'none' }}>
                    {/* Indicador si direcciones son iguales en modal */}
                    {proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion && (
                        <div className="-mx-6 -mt-2 rounded-lg border border-amber-300 bg-amber-100 p-2 px-6 dark:border-amber-800 dark:bg-amber-900/30">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                ⚠️ <strong>Nota:</strong> La dirección confirmada es igual a la solicitada
                            </p>
                        </div>
                    )}
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin
                                className={`h-5 w-5 ${
                                    proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                        ? 'text-amber-600'
                                        : 'text-blue-600'
                                }`}
                            />
                            <span
                                className={
                                    proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                        ? 'text-amber-700 dark:text-amber-300'
                                        : ''
                                }
                            >
                                {direccionMapaResumen === 'solicitada' ? 'Dirección Solicitada' : 'Dirección Confirmada'} - Mapa
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            {direccionMapaResumen === 'solicitada'
                                ? proforma.direccion_solicitada?.direccion
                                : proforma.direccion_confirmada?.direccion}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Datos de dirección */}
                        <div
                            className={`rounded-lg border p-4 ${
                                proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                    ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                                    : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                            }`}
                        >
                            <div className="space-y-2">
                                <div>
                                    <p
                                        className={`mb-1 text-xs font-medium uppercase ${
                                            proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                ? 'text-amber-600 dark:text-amber-300'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        Dirección
                                    </p>
                                    <p
                                        className={`text-sm font-medium ${
                                            proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                ? 'text-amber-800 dark:text-amber-200'
                                                : 'text-foreground'
                                        }`}
                                    >
                                        {direccionMapaResumen === 'solicitada'
                                            ? proforma.direccion_solicitada?.direccion
                                            : proforma.direccion_confirmada?.direccion}
                                    </p>
                                </div>

                                {(direccionMapaResumen === 'solicitada'
                                    ? proforma.direccion_solicitada?.observaciones
                                    : proforma.direccion_confirmada?.observaciones) && (
                                    <div>
                                        <p
                                            className={`mb-1 text-xs font-medium uppercase ${
                                                proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                    ? 'text-amber-600 dark:text-amber-300'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            Observaciones
                                        </p>
                                        <p
                                            className={`text-sm italic ${
                                                proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                    ? 'text-amber-800 dark:text-amber-200'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            📝{' '}
                                            {direccionMapaResumen === 'solicitada'
                                                ? proforma.direccion_solicitada?.observaciones
                                                : proforma.direccion_confirmada?.observaciones}
                                        </p>
                                    </div>
                                )}

                                {(direccionMapaResumen === 'solicitada'
                                    ? proforma.direccion_solicitada?.latitud && proforma.direccion_solicitada?.longitud
                                    : proforma.direccion_confirmada?.latitud && proforma.direccion_confirmada?.longitud) && (
                                    <div>
                                        <p
                                            className={`mb-1 text-xs font-medium uppercase ${
                                                proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                    ? 'text-amber-600 dark:text-amber-300'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            Coordenadas
                                        </p>
                                        <p
                                            className={`font-mono text-sm ${
                                                proforma.direccion_confirmada?.direccion === proforma.direccion_solicitada?.direccion
                                                    ? 'text-amber-700 dark:text-amber-300'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            {direccionMapaResumen === 'solicitada'
                                                ? `${proforma.direccion_solicitada?.latitud?.toFixed(6)}, ${proforma.direccion_solicitada?.longitud?.toFixed(6)}`
                                                : `${proforma.direccion_confirmada?.latitud?.toFixed(6)}, ${proforma.direccion_confirmada?.longitud?.toFixed(6)}`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mapa */}
                        {(direccionMapaResumen === 'solicitada'
                            ? proforma.direccion_solicitada?.latitud && proforma.direccion_solicitada?.longitud
                            : proforma.direccion_confirmada?.latitud && proforma.direccion_confirmada?.longitud) && (
                            <div className="h-96 overflow-hidden rounded-lg border border-border/50">
                                <MapViewWithFallback
                                    latitude={
                                        direccionMapaResumen === 'solicitada'
                                            ? proforma.direccion_solicitada!.latitud
                                            : proforma.direccion_confirmada!.latitud
                                    }
                                    longitude={
                                        direccionMapaResumen === 'solicitada'
                                            ? proforma.direccion_solicitada!.longitud
                                            : proforma.direccion_confirmada!.longitud
                                    }
                                    height="100%"
                                    zoom={16}
                                    markerTitle={
                                        direccionMapaResumen === 'solicitada' ? 'Dirección de entrega solicitada' : 'Dirección de entrega confirmada'
                                    }
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

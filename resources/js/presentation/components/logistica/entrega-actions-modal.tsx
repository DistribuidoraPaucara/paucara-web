import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { CheckCircle2, AlertCircle, MapPin, Camera, Phone, X, Image as ImageIcon } from 'lucide-react';
import logisticaService, { type Entrega } from '@/infrastructure/services/logistica.service';
import { toast } from 'react-toastify';

interface Venta {
    id: number;
    numero: string;
    total?: number;
    cliente_id?: number;
    cliente?: {
        nombre: string;
    };
    estado_logistico_id?: number;
}

interface DesglosePago {
    tipo_pago_id: number;
    tipo_pago_nombre: string;
    monto: number;
    referencia?: string;
}

interface EntregaActionsModalProps {
    entrega: Entrega | null;
    venta?: Venta | null; // ✅ Venta específica a confirmar (opcional)
    confirmacionExistente?: any; // ✅ Datos de una confirmación existente para editar (opcional)
    isOpen: boolean;
    onClose: () => void;
    actionType: 'marcar-llegada' | 'confirmar-entrega' | 'reportar-novedad' | null;
    onSuccess?: () => void;
}

export function EntregaActionsModal({
    entrega,
    venta, // ✅ Venta opcional
    confirmacionExistente, // ✅ Datos existentes para editar
    isOpen,
    onClose,
    actionType,
    onSuccess,
}: EntregaActionsModalProps) {
    const [loading, setLoading] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [fotos, setFotos] = useState<string[]>([]);
    // ✅ Tipo de confirmación (COMPLETA o CON_NOVEDAD)
    const [tipoConfirmacion, setTipoConfirmacion] = useState<'COMPLETA' | 'CON_NOVEDAD' | null>(null);
    // ✅ Subtipo de novedad (CLIENTE_CERRADO, DEVOLUCION_PARCIAL, RECHAZADO, NO_CONTACTADO)
    const [tipoNovedad, setTipoNovedad] = useState<string | null>(null);
    // ✅ Nuevos campos para contexto de entrega
    const [tiendaAbierta, setTiendaAbierta] = useState<boolean | null>(null);
    const [clientePresente, setClientePresente] = useState<boolean | null>(null);
    const [motivoRechazo, setMotivoRechazo] = useState<string | null>(null);
    // ✅ Múltiples pagos (desglose)
    const [desglose, setDesglose] = useState<DesglosePago[]>([]);
    // ✅ Productos devueltos (para DEVOLUCION_PARCIAL) - Mapa de {detalleId: cantidad}
    const [productosDevueltos, setProductosDevueltos] = useState<Record<number, number>>({});
    // ✅ FASE 2: Foto de comprobante
    const [fotoComprobante, setFotoComprobante] = useState<string | null>(null);
    // ✅ Tipos de pago cargados dinámicamente desde API
    const [tiposPago, setTiposPago] = useState<Array<{ id: number; codigo: string; nombre: string }>>([]);
    const [cargandoTiposPago, setCargandoTiposPago] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fotoComprobanteInputRef = useRef<HTMLInputElement>(null);

    // ✅ Cargar tipos de pago al abrir el modal
    useEffect(() => {
        if (isOpen && actionType === 'confirmar-entrega') {
            cargarTiposPago();
        }
    }, [isOpen, actionType]);

    // ✅ Cargar datos de confirmación existente para editar
    useEffect(() => {
        if (isOpen && confirmacionExistente) {
            // Cargar datos de la confirmación existente
            setTipoConfirmacion(confirmacionExistente.tipo_confirmacion || null);
            setTipoNovedad(confirmacionExistente.tipo_novedad || null);
            setTiendaAbierta(confirmacionExistente.tienda_abierta ?? null);
            setClientePresente(confirmacionExistente.cliente_presente ?? null);
            setMotivoRechazo(confirmacionExistente.motivo_rechazo || null);
            setObservaciones(confirmacionExistente.observaciones_logistica || '');

            // Cargar pagos
            if (confirmacionExistente.pagos && Array.isArray(confirmacionExistente.pagos)) {
                setDesglose(confirmacionExistente.pagos);
            }

            // Cargar productos devueltos
            if (confirmacionExistente.productos_devueltos && Array.isArray(confirmacionExistente.productos_devueltos)) {
                const productosMap: Record<number, number> = {};
                confirmacionExistente.productos_devueltos.forEach((p: any) => {
                    // Encontrar el detalle_id correspondiente en la venta
                    const detalle = venta?.detalles?.find(d =>
                        d.producto?.id === p.producto_id || d.id === p.id
                    );
                    if (detalle) {
                        productosMap[detalle.id] = p.cantidad;
                    }
                });
                setProductosDevueltos(productosMap);
            }

            // Cargar fotos
            if (confirmacionExistente.fotos && Array.isArray(confirmacionExistente.fotos)) {
                setFotos(confirmacionExistente.fotos);
            }
        }
    }, [isOpen, confirmacionExistente, venta]);

    // ✅ NUEVO: Limpiar campos según tipo de confirmación y novedad seleccionado
    useEffect(() => {
        if (tipoConfirmacion === 'COMPLETA') {
            // ✅ ENTREGA COMPLETA: Limpiar TODO excepto pagos
            setTipoNovedad(null);
            setMotivoRechazo(null);
            setTiendaAbierta(null);
            setClientePresente(null);
            setProductosDevueltos({});
            setFotos([]);
        } else if (tipoConfirmacion === 'CON_NOVEDAD') {
            // ✅ CON NOVEDAD: Limpiar según el tipo de novedad
            if (tipoNovedad === 'DEVOLUCION_PARCIAL') {
                // Solo devoluciones, limpiar otros campos
                setMotivoRechazo(null);
                setTiendaAbierta(null);
                setClientePresente(null);
            } else if (tipoNovedad === 'CLIENTE_CERRADO') {
                // Solo contexto de tienda, limpiar productos devueltos
                setProductosDevueltos({});
                setMotivoRechazo(null);
            } else if (tipoNovedad === 'RECHAZADO') {
                // Puede haber motivo de rechazo, limpiar productos devueltos
                setProductosDevueltos({});
            } else if (tipoNovedad === 'NO_CONTACTADO') {
                // No contactado, limpiar todo
                setMotivoRechazo(null);
                setTiendaAbierta(null);
                setClientePresente(null);
                setProductosDevueltos({});
            }
        }
    }, [tipoConfirmacion, tipoNovedad]);

    const cargarTiposPago = async () => {
        try {
            setCargandoTiposPago(true);
            const response = await fetch('/api/tipos-pago');
            const data = await response.json();
            if (data.success && data.data) {
                setTiposPago(data.data);
            }
        } catch (error) {
            console.error('Error cargando tipos de pago:', error);
        } finally {
            setCargandoTiposPago(false);
        }
    };

    // ✅ Calcular total recibido
    const totalRecibido = desglose.reduce((sum, p) => sum + (p.monto || 0), 0);

    // ✅ Calcular monto de devoluciones
    const montoDevolucion = venta?.detalles ? venta.detalles.reduce((sum, detalle) => {
        const precioUnitario = typeof detalle.precio_unitario === 'string' ? parseFloat(detalle.precio_unitario) : detalle.precio_unitario;
        const cantidadDevuelta = productosDevueltos[detalle.id] || 0;
        return sum + (cantidadDevuelta * precioUnitario);
    }, 0) : 0;

    // ✅ Calcular monto pendiente
    const montoAjustado = Math.max(0, (venta?.total || 0) - montoDevolucion);
    const montoPendiente = Math.max(0, montoAjustado - totalRecibido);

    // ✅ Derivar estado de pago automáticamente
    const estadoPago = desglose.length === 0 ? 'NO_PAGADO' : (montoPendiente > 0 ? 'PARCIAL' : 'PAGADO');

    // ✅ Agregar fila de pago
    const agregarPago = () => {
        const nuevoId = Math.max(0, ...tiposPago.map(t => t.id)) + 1;
        setDesglose([...desglose, { tipo_pago_id: 0, tipo_pago_nombre: '', monto: 0 }]);
    };

    // ✅ Actualizar fila de pago
    const actualizarPago = (index: number, campo: keyof DesglosePago, valor: any) => {
        const nuevosDesglose = [...desglose];
        nuevosDesglose[index] = { ...nuevosDesglose[index], [campo]: valor };
        setDesglose(nuevosDesglose);
    };

    // ✅ Remover fila de pago
    const removerPago = (index: number) => {
        setDesglose(desglose.filter((_, i) => i !== index));
    };

    // ✅ Auto-fill según tipo de novedad
    const manejarTipoNovedad = (tipo: string) => {
        setTipoNovedad(tipo);

        switch (tipo) {
            case 'CLIENTE_CERRADO':
                setTiendaAbierta(false);
                setMotivoRechazo('TIENDA_CERRADA');
                break;
            case 'RECHAZADO':
                setMotivoRechazo('CLIENTE_RECHAZA');
                break;
            case 'NO_CONTACTADO':
                setClientePresente(false);
                setMotivoRechazo('CLIENTE_AUSENTE');
                break;
            case 'DEVOLUCION_PARCIAL':
                // No auto-fill, muestra sección de pagos
                break;
        }
    };

    // ✅ Opciones de motivos de rechazo
    const motivosRechazo = [
        { value: 'TIENDA_CERRADA', label: '🏪 Tienda Cerrada' },
        { value: 'CLIENTE_AUSENTE', label: '👤 Cliente Ausente' },
        { value: 'CLIENTE_RECHAZA', label: '🚫 Cliente Rechaza' },
        { value: 'DIRECCION_INCORRECTA', label: '📍 Dirección Incorrecta' },
        { value: 'CLIENTE_NO_IDENTIFICADO', label: '🆔 Cliente No Identificado' },
        { value: 'OTRO', label: '❓ Otro Motivo' },
    ];


    if (!entrega) return null;

    // ✅ Manejar múltiples fotos
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tamaño (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La imagen no puede superar 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setFotos([...fotos, reader.result]);
                    toast.success(`Foto ${fotos.length + 1} cargada`);
                }
            };
            reader.readAsDataURL(file);
        }
        // Limpiar input para permitir cargar la misma foto otra vez
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ✅ Remover una foto del array
    const handleRemoveFoto = (index: number) => {
        setFotos(fotos.filter((_, i) => i !== index));
    };

    // ✅ FASE 2: Manejar foto de comprobante
    const handleFotoComprobanteChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tamaño (máx 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('La imagen no puede superar 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setFotoComprobante(reader.result);
                    toast.success('Foto de comprobante cargada');
                }
            };
            reader.readAsDataURL(file);
        }
        // Limpiar input
        if (fotoComprobanteInputRef.current) {
            fotoComprobanteInputRef.current.value = '';
        }
    };

    const handleMarcarLlegada = async () => {
        try {
            if (!navigator.geolocation) {
                toast.error('Geolocalización no disponible en este navegador');
                return;
            }

            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        await logisticaService.marcarLlegada(entrega.id, {
                            latitud: position.coords.latitude,
                            longitud: position.coords.longitude,
                        });
                        toast.success('Llegada marcada correctamente');
                        onClose();
                        onSuccess?.();
                    } catch (error) {
                        console.error('Error:', error);
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    toast.error('No se pudo obtener la ubicación: ' + error.message);
                    setLoading(false);
                },
                { timeout: 10000 }
            );
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al marcar llegada');
            setLoading(false);
        }
    };

    const handleConfirmarEntrega = async () => {
        try {
            setLoading(true);

            // ✅ Validar que se haya seleccionado tipo de confirmación
            if (!tipoConfirmacion) {
                toast.error('Selecciona el tipo de entrega (Completa o Con Novedad)');
                setLoading(false);
                return;
            }

            // ✅ Validar que si es CON_NOVEDAD, se haya seleccionado subtipo
            if (tipoConfirmacion === 'CON_NOVEDAD' && !tipoNovedad) {
                toast.error('Selecciona el tipo de novedad');
                setLoading(false);
                return;
            }

            // ✅ Si hay una venta específica, confirmar esa venta con nuevo contexto
            if (venta && venta.id) {
                // ✅ Construir array de productos devueltos con cantidad
                const productosDevueltosArray = venta.detalles
                    ?.filter(d => productosDevueltos[d.id] && productosDevueltos[d.id] > 0)
                    .map(d => {
                        const precioUnitario = typeof d.precio_unitario === 'string' ? parseFloat(d.precio_unitario) : d.precio_unitario;
                        const cantidadDevuelta = productosDevueltos[d.id];
                        return {
                            producto_id: d.producto?.id || d.id,
                            producto_nombre: d.producto?.nombre || 'Producto sin nombre',
                            cantidad: cantidadDevuelta,
                            precio_unitario: precioUnitario,
                            subtotal: cantidadDevuelta * precioUnitario
                        };
                    }) || [];

                const datos = {
                    tipo_confirmacion: tipoConfirmacion,
                    tipo_novedad: tipoNovedad || undefined,
                    pagos: desglose.length > 0 ? desglose : undefined,
                    tienda_abierta: tiendaAbierta !== null ? tiendaAbierta : undefined,
                    cliente_presente: clientePresente !== null ? clientePresente : undefined,
                    motivo_rechazo: motivoRechazo || undefined,
                    observaciones_logistica: observaciones || undefined,
                    fotos: fotos.length > 0 ? fotos : undefined,
                    foto_comprobante: fotoComprobante || undefined,
                    productos_devueltos: productosDevueltosArray.length > 0 ? productosDevueltosArray : undefined,
                };

                // ✅ DEBUG: Mostrar datos en consola
                console.log('📤 ENVIANDO AL BACKEND:', {
                    url: `/api/chofer/entregas/${entrega.id}/ventas/${venta.id}/confirmaciones/${confirmacionExistente?.id || 'NUEVA'}`,
                    metodo: confirmacionExistente?.id ? 'PUT' : 'POST',
                    datos: datos,
                    tipoConfirmacion,
                    tipoNovedad,
                    productosDevueltos,
                    desglose,
                });

                // ✅ Si hay confirmación existente, editar; si no, crear
                if (confirmacionExistente?.id) {
                    // ✅ Obtener token CSRF del meta tag
                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

                    const response = await fetch(`/api/chofer/entregas/${entrega.id}/ventas/${venta.id}/confirmaciones/${confirmacionExistente.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(datos)
                    });

                    const responseData = await response.json();
                    console.log('✅ RESPUESTA DEL BACKEND:', {
                        status: response.status,
                        ok: response.ok,
                        data: responseData,
                    });

                    if (!response.ok) {
                        console.error('❌ ERROR EN LA RESPUESTA:', responseData);
                        throw new Error(responseData.message || 'Error al actualizar la confirmación');
                    }

                    toast.success(`Venta #${venta.numero} actualizada correctamente`);
                } else {
                    console.log('📤 CREANDO NUEVA CONFIRMACIÓN (POST)');
                    await logisticaService.confirmarVentaEnEntrega(entrega.id, venta.id, datos);
                    console.log('✅ CONFIRMACIÓN CREADA EXITOSAMENTE');
                    toast.success(`Venta #${venta.numero} entregada correctamente`);
                }
            } else {
                await logisticaService.confirmarEntrega(entrega.id, {
                    fotos: fotos.length > 0 ? fotos : undefined,
                    observaciones: observaciones || undefined,
                });
                toast.success('Entrega confirmada correctamente');
            }

            onClose();
            onSuccess?.();

            // ✅ Recargar la página para ver los cambios actualizados
            setTimeout(() => {
                router.reload();
            }, 500);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al confirmar');
        } finally {
            setLoading(false);
        }
    };

    const handleReportarNovedad = async () => {
        if (!motivo.trim()) {
            toast.error('El motivo es obligatorio');
            return;
        }

        try {
            setLoading(true);
            await logisticaService.reportarNovedad(entrega.id, {
                motivo,
                descripcion: descripcion || undefined,
                foto: fotos.length > 0 ? fotos[0] : undefined,
            });
            toast.success('Novedad reportada correctamente');
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error('❌ ERROR EN HANDLECONFIRMARENTREGA:', {
                message: error instanceof Error ? error.message : String(error),
                error: error,
            });
            toast.error(error instanceof Error ? error.message : 'Error al confirmar entrega');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setMotivo('');
        setDescripcion('');
        setObservaciones('');
        setFotos([]);
        setProductosDevueltos({});
        // ✅ Resetear tipos de confirmación
        setTipoConfirmacion(null);
        setTipoNovedad(null);
        // ✅ Resetear campos de contexto
        setTiendaAbierta(null);
        setClientePresente(null);
        setMotivoRechazo(null);
        // ✅ Resetear desglose de pagos
        setDesglose([]);
        // ✅ Resetear foto de comprobante
        setFotoComprobante(null);
        onClose();
    };

    const getTitle = () => {
        switch (actionType) {
            case 'marcar-llegada':
                return 'Marcar Llegada';
            case 'confirmar-entrega':
                // ✅ Mostrar si es venta o entrega, y si estamos editando
                const baseTitle = venta ? `Entrega de Venta #${venta.id}` : 'Entrega';
                return confirmacionExistente?.id ? `Editar ${baseTitle}` : `Confirmar ${baseTitle}`;
            case 'reportar-novedad':
                return 'Reportar Novedad';
            default:
                return '';
        }
    };

    const getDescription = () => {
        switch (actionType) {
            case 'marcar-llegada':
                return 'Confirma que has llegado al destino';
            case 'confirmar-entrega':
                // ✅ Descripción específica para venta o entrega
                return venta
                    ? `Confirma la entrega de la venta #${venta.numero} al cliente`
                    : 'Completa la entrega con fotos';
            case 'reportar-novedad':
                return 'Reporta un problema con la entrega';
            default:
                return '';
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
            <AlertDialogContent className="max-w-2xl max-h-[90vh] flex flex-col dark:bg-slate-950 dark:border-slate-800">
                <AlertDialogHeader className="flex-shrink-0">
                    <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-slate-50">
                        {actionType === 'marcar-llegada' && <MapPin className="text-orange-500" />}
                        {actionType === 'confirmar-entrega' && <CheckCircle2 className="text-green-500" />}
                        {actionType === 'reportar-novedad' && <AlertCircle className="text-red-500" />}
                        {getTitle()}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-slate-400">{getDescription()}</AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-4">
                    {/* Información de la entrega y venta */}
                    <Card className="p-4 bg-gray-50 dark:bg-slate-950 dark:border-slate-800">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600 dark:text-slate-400">Entrega ID</p>
                                <p className="font-semibold text-gray-900 dark:text-slate-50">#{entrega.id}</p>
                            </div>
                            {/* ✅ Mostrar ID de venta si está disponible */}
                            {venta && (
                                <div>
                                    <p className="text-gray-600 dark:text-slate-400">Venta ID</p>
                                    <p className="font-semibold text-gray-900 dark:text-slate-50">#{venta.id}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-gray-600 dark:text-slate-400">Estado</p>
                                <Badge>{entrega.estado}</Badge>
                            </div>
                            {/* ✅ Mostrar número de venta si está disponible */}
                            {venta && (
                                <div>
                                    <p className="text-gray-600 dark:text-slate-400">Venta #</p>
                                    <p className="font-semibold text-gray-900 dark:text-slate-50">{venta.numero}</p>
                                </div>
                            )}
                            <div className="col-span-2">
                                <p className="text-gray-600 dark:text-slate-400">Dirección</p>
                                <p className="font-semibold text-gray-900 dark:text-slate-50">{entrega.direccion || 'No disponible'}</p>
                            </div>
                            {/* ✅ Mostrar cliente si está disponible */}
                            {venta?.cliente && (
                                <div className="col-span-2">
                                    <p className="text-gray-600 dark:text-slate-400">Cliente</p>
                                    <p className="font-semibold text-gray-900 dark:text-slate-50">{venta.cliente.nombre || 'No disponible'}</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Marcar Llegada */}
                    {actionType === 'marcar-llegada' && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                Se enviará tu ubicación actual al servidor
                            </p>
                            <p className="text-xs text-gray-500">
                                Asegúrate de tener habilitado el GPS para mayor precisión
                            </p>
                        </div>
                    )}

                    {/* Confirmar Entrega */}
                    {actionType === 'confirmar-entrega' && (
                        <div className="space-y-4">
                            {/* SECCIÓN A: Tipo de Entrega (botones grandes, primero) */}
                            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/70 border-2 border-blue-300 dark:border-slate-700">
                                <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-slate-200">Tipo de Entrega</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTipoConfirmacion('COMPLETA');
                                            setTipoNovedad(null);
                                            setDesglose([]);
                                            setMotivoRechazo(null);
                                            setTiendaAbierta(null);
                                            setClientePresente(null);
                                        }}
                                        className={`p-4 rounded-lg font-semibold transition-all border-2 ${tipoConfirmacion === 'COMPLETA'
                                            ? 'bg-green-500 text-white border-green-600'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-500'
                                            }`}
                                    >
                                        ✅ Entrega Completa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTipoConfirmacion('CON_NOVEDAD');
                                            setDesglose([]);
                                        }}
                                        className={`p-4 rounded-lg font-semibold transition-all border-2 ${tipoConfirmacion === 'CON_NOVEDAD'
                                            ? 'bg-orange-500 text-white border-orange-600'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-orange-500'
                                            }`}
                                    >
                                        ⚠️ Con Novedad
                                    </button>
                                </div>
                            </Card>

                            {/* SECCIÓN B: Subtipos de novedad (visible solo si CON_NOVEDAD) */}
                            {tipoConfirmacion === 'CON_NOVEDAD' && (
                                <Card className="p-4 bg-orange-50 dark:bg-slate-800/50 border-orange-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold mb-3 text-orange-900 dark:text-slate-200">Tipo de Novedad</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: 'CLIENTE_CERRADO', label: '🏪 Tienda Cerrada' },
                                            { value: 'RECHAZADO', label: '🚫 Rechazado' },
                                            { value: 'DEVOLUCION_PARCIAL', label: '📦 Dev. Parcial' },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => manejarTipoNovedad(option.value)}
                                                className={`p-2 text-sm rounded-lg font-medium transition-all border ${tipoNovedad === option.value
                                                    ? 'bg-orange-500 text-white border-orange-600'
                                                    : 'bg-white dark:bg-slate-900/50 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-400'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* SECCIÓN B.5: Productos Devueltos (visible solo si DEVOLUCION_PARCIAL) - NO visible si es COMPLETA */}
                            {tipoConfirmacion !== 'COMPLETA' && tipoNovedad === 'DEVOLUCION_PARCIAL' && venta?.detalles && venta.detalles.length > 0 && (
                                <Card className="p-4 bg-purple-50 dark:bg-slate-800/50 border-purple-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold mb-3 text-purple-900 dark:text-slate-200">📦 Productos Devueltos</h3>
                                    <p className="text-xs text-gray-600 dark:text-slate-400 mb-3">Ingresa la cantidad devuelta de cada producto:</p>

                                    <div className="space-y-3 mb-4">
                                        {venta.detalles.map((detalle) => {
                                            const precioUnitario = typeof detalle.precio_unitario === 'string' ? parseFloat(detalle.precio_unitario) : detalle.precio_unitario;
                                            const cantidadDevuelta = productosDevueltos[detalle.id] || 0;
                                            const subtotalDevuelto = cantidadDevuelta * precioUnitario;

                                            return (
                                                <div key={detalle.id} className="p-3 bg-white dark:bg-slate-900/50 rounded border border-gray-200 dark:border-slate-700">
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-slate-50">{detalle.producto?.nombre || 'Producto sin nombre'}</p>
                                                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                                                Cantidad original: {parseFloat(detalle.cantidad).toFixed(2)}x | Precio: Bs. {precioUnitario.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs font-medium text-gray-600 dark:text-slate-400">Cantidad devuelta:</label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max={detalle.cantidad}
                                                            value={cantidadDevuelta || ''}
                                                            onChange={(e) => {
                                                                const valor = parseFloat(e.target.value) || 0;
                                                                const nuevos = { ...productosDevueltos };
                                                                if (valor > 0 && valor <= detalle.cantidad) {
                                                                    nuevos[detalle.id] = valor;
                                                                } else {
                                                                    delete nuevos[detalle.id];
                                                                }
                                                                setProductosDevueltos(nuevos);
                                                            }}
                                                            placeholder="0"
                                                            className="w-20 text-sm h-8 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50"
                                                        />
                                                        <span className="text-xs text-gray-600 dark:text-slate-400">
                                                            {cantidadDevuelta > 0 && `= Bs. ${subtotalDevuelto.toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            )}



                            {/* SECCIÓN D: Pagos (visible solo si COMPLETA o DEVOLUCION_PARCIAL) */}
                            {(tipoConfirmacion === 'COMPLETA' || (tipoConfirmacion === 'CON_NOVEDAD' && tipoNovedad === 'DEVOLUCION_PARCIAL')) && !(tipoNovedad === 'CLIENTE_CERRADO' || tipoNovedad === 'RECHAZADO') && (
                                <Card className="p-4 bg-green-50 dark:bg-slate-800/50 border-green-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold mb-3 text-green-900 dark:text-slate-200">💰 Métodos de Pago</h3>

                                    {/* Tabla de pagos */}
                                    <div className="space-y-2 mb-4">
                                        {desglose.length === 0 ? (
                                            <p className="text-sm text-gray-600 dark:text-slate-400 italic">Sin métodos de pago agregados aún</p>
                                        ) : (
                                            desglose.map((pago, index) => (
                                                <div key={index} className="flex gap-2 items-end">
                                                    {/* Tipo de pago */}
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                                                            Tipo
                                                        </label>
                                                        <select
                                                            value={pago.tipo_pago_id ? String(pago.tipo_pago_id) : ''}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value) || 0;
                                                                const tipoPago = tiposPago.find(t => t.id === id);
                                                                const nuevosDesglose = [...desglose];
                                                                nuevosDesglose[index] = {
                                                                    ...nuevosDesglose[index],
                                                                    tipo_pago_id: id,
                                                                    tipo_pago_nombre: tipoPago?.nombre || ''
                                                                };
                                                                setDesglose(nuevosDesglose);
                                                            }}
                                                            className="w-full px-2 py-1 border border-gray-300 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-50 rounded text-sm"
                                                        >
                                                            <option value="">-- Seleccionar --</option>
                                                            {tiposPago.map((tipo) => (
                                                                <option key={tipo.id} value={String(tipo.id)}>
                                                                    {tipo.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Monto */}
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                                                            Monto (Bs.)
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={pago.monto || ''}
                                                            onChange={(e) =>
                                                                actualizarPago(index, 'monto', parseFloat(e.target.value) || 0)
                                                            }
                                                            className="text-sm h-8 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50"
                                                        />
                                                    </div>

                                                    {/* Referencia */}
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">
                                                            Referencia (opt.)
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Ref..."
                                                            value={pago.referencia || ''}
                                                            onChange={(e) =>
                                                                actualizarPago(index, 'referencia', e.target.value)
                                                            }
                                                            className="text-sm h-8 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50"
                                                        />
                                                    </div>

                                                    {/* Remover */}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removerPago(index)}
                                                        className="bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:border-red-800 dark:text-red-300 h-8"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Botón agregar pago */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={agregarPago}
                                        className="w-full mb-4 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50 dark:hover:bg-slate-900"
                                    >
                                        + Agregar método de pago
                                    </Button>

                                    {/* Footer con totales */}
                                    <div className="bg-white dark:bg-slate-900/50 rounded p-2 border border-green-200 dark:border-slate-700 text-sm">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-gray-900 dark:text-slate-50">Total Original:</span>
                                            <span className="text-gray-900 dark:text-slate-50">Bs. {(typeof venta?.total === 'string' ? parseFloat(venta.total) : venta?.total || 0).toFixed(2)}</span>
                                        </div>
                                        {montoDevolucion > 0 && (
                                            <div className="flex justify-between mb-1 text-red-600 dark:text-red-400">
                                                <span className="font-medium">Devolución:</span>
                                                <span>- Bs. {montoDevolucion.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {montoDevolucion > 0 && (
                                            <div className="flex justify-between mb-1 border-t border-gray-200 dark:border-slate-800 pt-1">
                                                <span className="font-medium text-gray-900 dark:text-slate-50">Total Ajustado:</span>
                                                <span className="text-gray-900 dark:text-slate-50">Bs. {montoAjustado.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between mb-1">
                                            <span className="font-medium text-gray-900 dark:text-slate-50">Recibido:</span>
                                            <span className="text-gray-900 dark:text-slate-50">Bs. {totalRecibido.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-gray-200 dark:border-slate-800 pt-1">
                                            <span className="font-medium text-gray-900 dark:text-slate-50">Pendiente:</span>
                                            <span className={montoPendiente > 0 ? 'text-orange-600 dark:text-yellow-300 font-semibold' : 'text-green-600 dark:text-emerald-300 font-semibold'}>
                                                Bs. {montoPendiente.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-slate-800">
                                            <span className="font-medium text-gray-900 dark:text-slate-50">Estado:</span>
                                            <Badge
                                                className={`${estadoPago === 'PAGADO'
                                                    ? 'bg-green-500'
                                                    : estadoPago === 'PARCIAL'
                                                        ? 'bg-orange-500'
                                                        : 'bg-red-500'
                                                    }`}
                                            >
                                                {estadoPago}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* ✅ FASE 2: Foto de Comprobante (Opcional) */}
                            {/* <Card className="p-4 bg-green-50 border-green-200">
                                <h3 className="text-sm font-semibold mb-3 text-green-900">
                                    📸 Foto de Comprobante (Opcional)
                                </h3>
                                <p className="text-xs text-gray-600 mb-3">
                                    Captura foto del dinero o comprobante de pago (Transferencia, Cheque)
                                </p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fotoComprobanteInputRef}
                                    onChange={handleFotoComprobanteChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => fotoComprobanteInputRef.current?.click()}
                                >
                                    <Camera className="mr-2 h-4 w-4" />
                                    {fotoComprobante ? '✓ Foto cargada' : 'Capturar foto de comprobante'}
                                </Button>

                                {fotoComprobante && (
                                    <div className="mt-3">
                                        <img
                                            src={fotoComprobante}
                                            alt="Comprobante"
                                            className="w-full h-32 object-cover rounded border"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setFotoComprobante(null)}
                                            className="mt-2 w-full"
                                        >
                                            Remover foto
                                        </Button>
                                    </div>
                                )}
                            </Card> */}

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-50">
                                    Observaciones
                                </label>
                                <Textarea
                                    placeholder="Notas sobre la entrega..."
                                    value={observaciones}
                                    onChange={(e) => setObservaciones(e.target.value)}
                                    className="h-20 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50"
                                />
                            </div>

                            {/* ✅ Fotos - Soporte para múltiples - NO visible si es COMPLETA - Opcional para CLIENTE_CERRADO y RECHAZADO */}
                            {tipoConfirmacion !== 'COMPLETA' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-50">
                                        <Camera className="inline mr-2 h-4 w-4" />
                                        Fotos de entrega ({fotos.length})
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="mr-2 h-4 w-4" />
                                        {fotos.length === 0 ? 'Añadir foto' : 'Añadir otra foto'}
                                    </Button>

                                    {/* Vista previa de fotos */}
                                    {fotos.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {fotos.map((foto, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={foto}
                                                        alt={`Foto ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded border border-gray-300"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFoto(index)}
                                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remover foto"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reportar Novedad */}
                    {actionType === 'reportar-novedad' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-50">
                                    Motivo *
                                </label>
                                <Input
                                    placeholder="Ej: Cliente ausente, Dirección incorrecta"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    className="dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-50">
                                    Descripción (opcional)
                                </label>
                                <Textarea
                                    placeholder="Detalles adicionales..."
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="h-20 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-50">
                                    <Camera className="inline mr-2 h-4 w-4" />
                                    Foto de evidencia (opcional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {fotos.length > 0 ? '✓ Foto cargada' : 'Seleccionar foto'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 justify-end flex-shrink-0 border-t border-gray-200 dark:border-slate-800 pt-4">
                    <AlertDialogCancel disabled={loading} className="dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-50 dark:hover:bg-slate-800">
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            if (actionType === 'marcar-llegada') {
                                handleMarcarLlegada();
                            } else if (actionType === 'confirmar-entrega') {
                                handleConfirmarEntrega();
                            } else if (actionType === 'reportar-novedad') {
                                handleReportarNovedad();
                            }
                        }}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        {loading ? 'Procesando...' : confirmacionExistente?.id ? 'Actualizar' : 'Confirmar'}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

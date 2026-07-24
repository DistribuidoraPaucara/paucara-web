import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal'; // ✅ NUEVO (2026-06-27)
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface CuentaPendiente {
    id: number;
    venta_id?: number;
    numero_venta?: string;
    referencia_documento?: string;
    fecha_venta?: string;
    monto_original: number;
    saldo_pendiente: number;
    fecha_vencimiento: string;
    dias_vencido: number;
    estado: string;
}

interface TipoPago {
    id: number;
    nombre: string;
    codigo: string;
}

interface RegistrarPagoModalProps {
    show: boolean;
    onHide: () => void;
    clienteId: number;
    cuentaPorCobrar?: CuentaPendiente; // ✅ NUEVO: Cambiar de cuentasPendientes a cuentaPorCobrar
    onPagoRegistrado: () => void;
    tipo?: 'compras' | 'ventas';
    verificarCaja?: boolean;
    tipos_pago?: TipoPago[];
}

export default function RegistrarPagoModal({
    show,
    onHide,
    clienteId,
    cuentaPorCobrar,
    onPagoRegistrado,
    tipo = 'compras',
    verificarCaja = true,
    tipos_pago = [],
}: RegistrarPagoModalProps) {
    console.log('✅ RegistrarPagoModal abierto:', {
        show,
        clienteId,
        cuentaId: cuentaPorCobrar?.id,
        saldoPendiente: cuentaPorCobrar?.saldo_pendiente,
    });
    const [formData, setFormData] = useState({
        cuenta_id: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        observaciones: '',
        // ✅ NUEVO: Pagos desglosados por tipo
        montoEfectivo: '',
        montoTransferencia: '',
        numeroReciboEfectivo: '',
        numeroTransferenciaTransferencia: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ✅ NUEVO (2026-06-27): Estados para modal de impresión
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [pagoRegistrado, setPagoRegistrado] = useState<any>(null);
    const [cuentaIdParaImpresion, setCuentaIdParaImpresion] = useState<number>(0);

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
    const [cargandoCaja, setCargandoCaja] = useState(false);

    // ✅ Resetear formulario cuando se abre el modal
    useEffect(() => {
        if (show) {
            setFormData({
                cuenta_id: cuentaPorCobrar?.id ? String(cuentaPorCobrar.id) : '',
                fecha_pago: new Date().toISOString().split('T')[0],
                observaciones: '',
                montoEfectivo: '',
                montoTransferencia: '',
                numeroReciboEfectivo: '',
                numeroTransferenciaTransferencia: '',
            });
            setError('');
        }
    }, [show, cuentaPorCobrar?.id]);

    // ✅ NUEVO: Verificar si hay caja abierta cuando se abre el modal (solo si verificarCaja es true)
    useEffect(() => {
        if (show && verificarCaja) {
            verificarCajaAbierta();
        }
    }, [show, verificarCaja]);

    const verificarCajaAbierta = async () => {
        try {
            setCargandoCaja(true);
            const ruta = tipo === 'ventas' ? '/ventas/cuentas-por-cobrar/check-caja-abierta' : '/compras/pagos/check-caja-abierta';
            const response = await fetch(ruta);
            const data = await response.json();
            setCajaInfo(data);
            console.log('✅ Estado de caja (Modal Pagos):', data);
        } catch (error) {
            console.error('❌ Error verificando caja (Modal Pagos):', error);
            // Si hay error, permitir acceso (mejor UX que bloquear)
            setCajaInfo({ tiene_caja_abierta: true });
        } finally {
            setCargandoCaja(false);
        }
    };

    // 🔍 Debug: Log de cuenta por cobrar
    useEffect(() => {
        if (show) {
            console.log('RegistrarPagoModal - Cuenta por cobrar:', {
                cuentaId: cuentaPorCobrar?.id,
                numeroVenta: cuentaPorCobrar?.numero_venta,
                saldoPendiente: cuentaPorCobrar?.saldo_pendiente,
                estado: cuentaPorCobrar?.estado,
            });
        }
    }, [show, cuentaPorCobrar?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('');
    };

    const validateForm = (): boolean => {
        if (!cuentaPorCobrar) {
            setError('No hay cuenta seleccionada');
            return false;
        }

        const montoEfectivo = parseFloat(formData.montoEfectivo || '0');
        const montoTransferencia = parseFloat(formData.montoTransferencia || '0');
        const montoTotal = montoEfectivo + montoTransferencia;

        if (montoTotal <= 0) {
            setError('Ingrese al menos un monto (Efectivo o Transferencia)');
            return false;
        }

        if (montoTotal > cuentaPorCobrar.saldo_pendiente) {
            setError(`El monto total no puede exceder el saldo pendiente de ${cuentaPorCobrar.saldo_pendiente.toFixed(2)}`);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError('');

            const montoEfectivo = parseFloat(formData.montoEfectivo || '0');
            const montoTransferencia = parseFloat(formData.montoTransferencia || '0');

            // ✅ NUEVO: Construir array de pagos a registrar
            const pagosARegistrar: any[] = [];

            if (montoEfectivo > 0) {
                pagosARegistrar.push({
                    tipo_pago_id: 1, // Efectivo
                    monto: montoEfectivo,
                    fecha_pago: formData.fecha_pago,
                    numero_recibo: formData.numeroReciboEfectivo || null,
                    numero_transferencia: null,
                    numero_cheque: null,
                    observaciones: formData.observaciones || null,
                });
            }

            if (montoTransferencia > 0) {
                pagosARegistrar.push({
                    tipo_pago_id: 2, // Transferencia/QR
                    monto: montoTransferencia,
                    fecha_pago: formData.fecha_pago,
                    numero_recibo: null,
                    numero_transferencia: formData.numeroTransferenciaTransferencia || null,
                    numero_cheque: null,
                    observaciones: formData.observaciones || null,
                });
            }

            // ✅ Usar ID de la cuenta directamente
            if (!cuentaPorCobrar) {
                setError('No hay cuenta seleccionada');
                setLoading(false);
                return;
            }

            // Usar endpoint diferente según tipo
            const url =
                tipo === 'ventas'
                    ? `/ventas/cuentas-por-cobrar/${cuentaPorCobrar.id}/registrar-pagos`
                    : `/compras/cuentas-por-pagar/${cuentaPorCobrar.id}/registrar-pagos`;

            const response = await axios.post(url, { pagos: pagosARegistrar });

            // ✅ NUEVO: Mostrar información del pago registrado en toast
            if (response.data.success && response.data.data?.pagos && response.data.data.pagos.length > 0) {
                // Usar el primer pago registrado como referencia
                const pagoData = response.data.data.pagos[0];
                // Calcular monto total de todos los pagos
                const montoTotal = response.data.data.pagos.reduce((sum: number, p: any) => sum + p.monto, 0);
                const montoPagado = new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(montoTotal);

                const cuentaData = response.data.data.cuenta;
                const nuevoSaldo = new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(cuentaData.saldo_pendiente);

                toast.success(
                    `✅ Pago de ${montoPagado} registrado correctamente\nNuevo saldo: ${nuevoSaldo}\nRecibo: ${formData.numero_recibo || 'Sin recibo'}`,
                    {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    },
                );
            }

            // ✅ NUEVO (2026-06-27): Abrir modal de impresión en lugar de cerrar directamente
            setTimeout(() => {
                if (response.data.success && response.data.data?.pagos && response.data.data.pagos.length > 0) {
                    // Usar el primer pago registrado para el modal de impresión
                    setPagoRegistrado(response.data.data.pagos[0]);
                    // Guardar el ID de la cuenta para el modal de impresión (ANTES de cerrar)
                    if (cuentaPorCobrar?.id) {
                        setCuentaIdParaImpresion(cuentaPorCobrar.id);
                    }
                    // Cerrar el modal de pago primero para que no bloquee el modal de impresión
                    onHide();
                    // Abrir el modal de impresión después de cerrar el anterior
                    setTimeout(() => {
                        setMostrarModalImpresion(true);
                    }, 300);
                } else {
                    onPagoRegistrado();
                    onHide();
                }
            }, 1500);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error al registrar el pago';
            setError(message);

            // ✅ NUEVO: También mostrar error en toast
            toast.error(message.split('\n')[0], {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // ✅ NUEVO: Función para formatear días decimales a días y horas
    const formatearDias = (diasDecimales: number): string => {
        const dias = Math.floor(diasDecimales);
        const horasDecimales = (diasDecimales - dias) * 24;
        const horas = Math.round(horasDecimales);

        if (dias === 0) {
            return `${horas} hora${horas !== 1 ? 's' : ''}`;
        }
        if (horas === 0) {
            return `${dias} día${dias !== 1 ? 's' : ''}`;
        }
        return `${dias} día${dias !== 1 ? 's' : ''} y ${horas} hora${horas !== 1 ? 's' : ''}`;
    };

    // ✅ NUEVO: Función para mejorar el mensaje de caja
    const mejorarMensajeCaja = (mensaje: string, diasAtras?: number): string => {
        if (!diasAtras) return mensaje;
        const diasFormateados = formatearDias(diasAtras);
        return mensaje.replace(/desde hace \d+\.?\d* día\(s\)/, `desde hace ${diasFormateados}`);
    };

    return (
        <>
            <Dialog open={show} onOpenChange={onHide}>
                <DialogContent
                    className="flex max-h-[90vh] max-w-[90vw] max-w-lg flex-col border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                    style={{ maxWidth: '95vw', maxHeight: '95vh' }}
                >
                    <DialogHeader className="flex-shrink-0 border-b border-gray-200 pb-4 dark:border-gray-800">
                        <DialogTitle className="text-gray-900 dark:text-white">Registrar Pago Credito {/* Total */}
                                    {(formData.montoEfectivo || formData.montoTransferencia) && (
                                        <div className="mt-2 pl-2 border-l border-blue-300 dark:border-blue-600">
                                            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                Total:{' '}
                                                {formatCurrency(
                                                    parseFloat(formData.montoEfectivo || '0') + parseFloat(formData.montoTransferencia || '0'),
                                                )}
                                            </p>
                                            {cuentaPorCobrar && (
                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                    Saldo: {formatCurrency(cuentaPorCobrar.saldo_pendiente)}
                                                </p>
                                            )}
                                        </div>
                                    )}</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {/* Indicador de verificación de caja */}
                        {cargandoCaja && (
                            <Alert className="border-blue-300 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                                <AlertDescription className="flex items-center gap-2 text-xs">
                                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></span>
                                    Verificando estado de caja...
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Indicador de caja no abierta - solo si verificarCaja es true */}
                        {verificarCaja && !cargandoCaja && cajaInfo && !cajaInfo.tiene_caja_abierta && (
                            <Alert variant="destructive" className="border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    🚫 No hay caja abierta. Abre una caja antes de registrar pagos.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Indicador de caja abierta (hoy o días anteriores) - solo si verificarCaja es true */}
                        {/* {verificarCaja && !cargandoCaja && cajaInfo?.tiene_caja_abierta && (
                        <Alert className={`border text-xs ${cajaInfo.es_de_hoy
                            ? 'border-green-300 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200'
                            : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200'
                            }`}>
                            <AlertDescription className="flex items-center gap-2">
                                <span>{cajaInfo.es_de_hoy ? '✅' : '⚠️'}</span>
                                <span>
                                    {mejorarMensajeCaja(cajaInfo.mensaje, cajaInfo.dias_atras)}
                                    {cajaInfo.caja_nombre && (
                                        <span className="block text-xs mt-1">
                                            {cajaInfo.caja_nombre}
                                            {cajaInfo.usuario_caja && ` • ${cajaInfo.usuario_caja}`}
                                        </span>
                                    )}
                                </span>
                            </AlertDescription>
                        </Alert>
                    )} */}

                        {error && (
                            <Alert variant="destructive" className="border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-xs">{error.split('\n')[0]}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* ✅ NUEVO: Mostrar información de la cuenta directamente */}
                            {cuentaPorCobrar && (
                                <div className="rounded-md border-2 border-green-200 bg-green-50 p-4 text-sm dark:border-green-700 dark:bg-green-950">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-green-900 dark:text-green-100">
                                                {tipo === 'ventas' ? '📋 Cuenta por Cobrar' : '📋 Cuenta por Pagar'}
                                            </span>
                                            <span className="rounded bg-green-200 px-2 py-1 text-xs dark:bg-green-800">#{cuentaPorCobrar.id}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {cuentaPorCobrar.venta_id && (
                                                <p className="text-green-800 dark:text-green-200">
                                                    <strong>Folio Venta:</strong> #{cuentaPorCobrar.venta_id}
                                                </p>
                                            )}
                                            <p className="text-grey-800 dark:text-grey-200">
                                                <strong>Monto original:</strong> {formatCurrency(cuentaPorCobrar.monto_original)}
                                            </p>
                                            <p className="text-yellow-800 dark:text-yellow-200">
                                                <strong>Saldo pendiente:</strong> {formatCurrency(cuentaPorCobrar.saldo_pendiente)}
                                            </p>

                                            <p className="text-green-800 dark:text-green-200">
                                                <strong>Vencimiento:</strong>{' '}
                                                {new Date(cuentaPorCobrar.fecha_vencimiento).toLocaleDateString('es-BO')}
                                            </p>

                                            {cuentaPorCobrar.dias_vencido > 0 && (
                                                <p className="font-semibold text-red-600 dark:text-red-400">
                                                    ⚠️ <strong>{cuentaPorCobrar.dias_vencido} días vencido</strong>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ✅ NUEVO: Montos desglosados por tipo de pago */}
                            <div className="space-y-3 p-2">
                                {/* <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">💰 Desglose de Pago</p> */}

                                <div className="flex flex-wrap gap-4 items-center justify-center">
                                    {/* Efectivo */}
                                    <div className="space-y-1">
                                        <Label htmlFor="montoEfectivo" className="text-sm text-gray-700 dark:text-gray-300">
                                            💵 Efectivo
                                        </Label>
                                        <Input
                                            id="montoEfectivo"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="montoEfectivo"
                                            value={formData.montoEfectivo}
                                            onChange={handleChange}
                                            disabled={loading}
                                            placeholder="0.00"
                                            className="text-sm"
                                        />
                                        {/* {formData.montoEfectivo && (
                                            <Input
                                                id="numeroReciboEfectivo"
                                                type="text"
                                                name="numeroReciboEfectivo"
                                                value={formData.numeroReciboEfectivo}
                                                onChange={handleChange}
                                                disabled={loading}
                                                placeholder="Nº Recibo (opcional)"
                                                className="text-sm"
                                            />
                                        )} */}
                                    </div>

                                    {/* Transferencia/QR */}
                                    <div className="space-y-1">
                                        <Label htmlFor="montoTransferencia" className="text-sm text-gray-700 dark:text-gray-300">
                                            🔄 Transferencia / QR
                                        </Label>
                                        <Input
                                            id="montoTransferencia"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="montoTransferencia"
                                            value={formData.montoTransferencia}
                                            onChange={handleChange}
                                            disabled={loading}
                                            placeholder="0.00"
                                            className="text-sm"
                                        />
                                        {/* {formData.montoTransferencia && (
                                            <Input
                                                id="numeroTransferenciaTransferencia"
                                                type="text"
                                                name="numeroTransferenciaTransferencia"
                                                value={formData.numeroTransferenciaTransferencia}
                                                onChange={handleChange}
                                                disabled={loading}
                                                placeholder="Nº Transferencia (opcional)"
                                                className="text-sm"
                                            />
                                        )} */}
                                    </div>
                                    
                                    {/* Fecha de Pago */}
                                    <div className="space-y-2">
                                        <Label htmlFor="fecha_pago" className="text-gray-700 dark:text-gray-300">
                                            Fecha de Pago
                                        </Label>
                                        <Input
                                            id="fecha_pago"
                                            type="date"
                                            name="fecha_pago"
                                            value={formData.fecha_pago}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Número de Recibo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="numero_recibo" className="text-gray-700 dark:text-gray-300">
                                            Número de Recibo (Opcional)
                                        </Label>
                                        <Input
                                            id="numero_recibo"
                                            type="text"
                                            name="numero_recibo"
                                            value={formData.numero_recibo}
                                            onChange={handleChange}
                                            disabled={loading}
                                            placeholder="Ej: REC-001"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="space-y-2">
                                <Label htmlFor="observaciones" className="text-gray-700 dark:text-gray-300">
                                    Observaciones (Opcional)
                                </Label>
                                <textarea
                                    id="observaciones"
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Notas o comentarios del pago"
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:text-white"
                                />
                            </div>
                        </form>
                    </div>

                    <DialogFooter className="mt-4 flex flex-shrink-0 justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={onHide}
                            disabled={loading}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                loading ||
                                !formData.cuenta_id ||
                                cargandoCaja ||
                                (verificarCaja && !cajaInfo?.tiene_caja_abierta)
                            }
                            className="bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
                            title={verificarCaja && !cajaInfo?.tiene_caja_abierta ? 'Abre una caja para registrar pagos' : ''}
                        >
                            {loading ? (
                                <>
                                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    Registrando...
                                </>
                            ) : (
                                'Registrar Pago'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ✅ NUEVO (2026-06-27): Modal de impresión del pago registrado */}
            <OutputSelectionModal
                isOpen={mostrarModalImpresion}
                onClose={() => {
                    setMostrarModalImpresion(false);
                    setPagoRegistrado(null);
                    setCuentaIdParaImpresion(0);
                    onPagoRegistrado();
                    onHide();
                }}
                documentoId={cuentaIdParaImpresion}
                tipoDocumento="cuenta-por-cobrar"
                documentoInfo={{
                    numero: cuentaIdParaImpresion ? `Pago CxC #${cuentaIdParaImpresion}` : 'Pago',
                    monto: pagoRegistrado?.monto,
                }}
                // ✅ NUEVO: Pasar montos desglosados para mostrar en impresión
                printParams={{
                    efectivo: parseFloat(formData.montoEfectivo) || 0,
                    transferencia: parseFloat(formData.montoTransferencia) || 0,
                }}
            />
        </>
    );
}

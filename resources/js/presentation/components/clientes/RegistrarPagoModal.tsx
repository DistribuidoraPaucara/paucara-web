import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

interface CuentaPendiente {
    id: number;
    venta_id: number;
    numero_venta: string;
    referencia_documento?: string;
    fecha_venta: string;
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
    cuentasPendientes: CuentaPendiente[];
    onPagoRegistrado: () => void;
    cuentaIdPreseleccionada?: number;
    tipo?: 'compras' | 'ventas';
    verificarCaja?: boolean;
    tipos_pago?: TipoPago[];
}

export default function RegistrarPagoModal({
    show,
    onHide,
    clienteId,
    cuentasPendientes,
    onPagoRegistrado,
    cuentaIdPreseleccionada,
    tipo = 'compras',
    verificarCaja = true,
    tipos_pago = [],
}: RegistrarPagoModalProps) {

    console.log('✅ RegistrarPagoModal abierto:', {
        show,
        clienteId,
        cuentaIdPreseleccionada,
        cuentasDisponibles: cuentasPendientes.length,
    });
    const [formData, setFormData] = useState({
        cuenta_id: '',
        tipo_pago_id: '1',  // ✅ Por defecto: Efectivo
        monto: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        numero_recibo: '',
        numero_transferencia: '',
        numero_cheque: '',
        observaciones: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            // Convertir ID a string para sincronización con select
            const defaultCuentaId = cuentaIdPreseleccionada ? String(cuentaIdPreseleccionada) : '';
            setFormData({
                cuenta_id: defaultCuentaId,
                tipo_pago_id: '1',  // ✅ Por defecto: Efectivo
                monto: '',
                fecha_pago: new Date().toISOString().split('T')[0],
                numero_recibo: '',
                numero_transferencia: '',
                numero_cheque: '',
                observaciones: '',
            });
            setError('');
        }
    }, [show]);

    // ✅ NUEVO: Actualizar cuenta preseleccionada si cambia
    useEffect(() => {
        if (show && cuentaIdPreseleccionada) {
            setFormData((prev) => ({
                ...prev,
                cuenta_id: String(cuentaIdPreseleccionada),
            }));
            console.log('✅ Cuenta preseleccionada en modal:', {
                cuentaIdPreseleccionada,
                cuentasDisponibles: cuentasPendientes.length,
            });
        }
    }, [cuentaIdPreseleccionada, show, cuentasPendientes]);

    // ✅ NUEVO: Verificar si hay caja abierta cuando se abre el modal (solo si verificarCaja es true)
    useEffect(() => {
        if (show && verificarCaja) {
            verificarCajaAbierta();
        }
    }, [show, verificarCaja]);

    const verificarCajaAbierta = async () => {
        try {
            setCargandoCaja(true);
            const ruta = tipo === 'ventas'
                ? '/ventas/cuentas-por-cobrar/check-caja-abierta'
                : '/compras/pagos/check-caja-abierta';
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

    // 🔍 Debug: Log de cuentas disponibles
    useEffect(() => {
        if (show) {
            console.log('RegistrarPagoModal - Cuentas disponibles:', {
                isArray: Array.isArray(cuentasPendientes),
                length: Array.isArray(cuentasPendientes) ? cuentasPendientes.length : 0,
                cuentas: cuentasPendientes,
            });
        }
    }, [show, cuentasPendientes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setError('');
    };

    const validateForm = (): boolean => {
        if (!formData.cuenta_id) {
            setError('Seleccione una cuenta pendiente');
            return false;
        }
        if (!formData.tipo_pago_id) {
            setError('Seleccione un tipo de pago');
            return false;
        }
        if (!formData.monto || parseFloat(formData.monto) <= 0) {
            setError('Ingrese un monto válido');
            return false;
        }

        // Get the selected account
        if (!Array.isArray(cuentasPendientes) || cuentasPendientes.length === 0) {
            setError('No hay cuentas pendientes disponibles');
            return false;
        }

        const cuenta = cuentasPendientes.find((c) => c.id === parseInt(formData.cuenta_id));
        if (!cuenta) {
            setError('Cuenta inválida');
            return false;
        }

        if (parseFloat(formData.monto) > cuenta.saldo_pendiente) {
            setError(`El monto no puede exceder el saldo pendiente de ${cuenta.saldo_pendiente.toFixed(2)}`);
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

            // Usar endpoint diferente según tipo de pago
            let url: string;
            let payload: any;

            if (tipo === 'ventas') {
                // Para cuentas por cobrar (ventas)
                url = `/ventas/cuentas-por-cobrar/${formData.cuenta_id}/registrar-pago`;
                payload = {
                    tipo_pago_id: Number(formData.tipo_pago_id),
                    monto: parseFloat(formData.monto),
                    fecha_pago: formData.fecha_pago,
                    numero_recibo: formData.numero_recibo || null,
                    numero_transferencia: formData.numero_transferencia || null,
                    numero_cheque: formData.numero_cheque || null,
                    observaciones: formData.observaciones || null,
                };
            } else {
                // Para cuentas por pagar (compras)
                url = `/compras/cuentas-por-pagar/${formData.cuenta_id}/registrar-pago`;
                payload = {
                    tipo_pago_id: Number(formData.tipo_pago_id),
                    monto: parseFloat(formData.monto),
                    fecha_pago: formData.fecha_pago,
                    numero_recibo: formData.numero_recibo || null,
                    numero_transferencia: formData.numero_transferencia || null,
                    numero_cheque: formData.numero_cheque || null,
                    observaciones: formData.observaciones || null,
                };
            }

            const response = await axios.post(url, payload);

            // ✅ NUEVO: Mostrar información del pago registrado en toast
            if (response.data.success && response.data.data?.pago) {
                const pagoData = response.data.data.pago;
                const montoPagado = new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(pagoData.monto);

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
                    }
                );
            }

            setTimeout(() => {
                onPagoRegistrado();
                onHide();
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

    const selectedCuenta =
        formData.cuenta_id && Array.isArray(cuentasPendientes) && cuentasPendientes.length > 0
            ? cuentasPendientes.find((c) => c.id === parseInt(formData.cuenta_id))
            : null;

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
        <Dialog open={show} onOpenChange={onHide}>
            <DialogContent className="max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 max-h-[90vh] flex flex-col">
                <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4 flex-shrink-0">
                    <DialogTitle className="text-gray-900 dark:text-white">Registrar Pago de Crédito</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                    {/* Indicador de verificación de caja */}
                    {cargandoCaja && (
                        <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
                            <AlertDescription className="text-xs flex items-center gap-2">
                                <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                Verificando estado de caja...
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Indicador de caja no abierta - solo si verificarCaja es true */}
                    {verificarCaja && !cargandoCaja && cajaInfo && !cajaInfo.tiene_caja_abierta && (
                        <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                                🚫 No hay caja abierta. Abre una caja antes de registrar pagos.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Indicador de caja abierta (hoy o días anteriores) - solo si verificarCaja es true */}
                    {verificarCaja && !cargandoCaja && cajaInfo?.tiene_caja_abierta && (
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
                    )}

                    {error && (
                        <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-xs">{error.split('\n')[0]}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Cuenta Pendiente */}
                        <div className="space-y-2">
                            <Label htmlFor="cuenta_id" className="text-gray-700 dark:text-gray-300">
                                {tipo === 'ventas' ? 'Seleccionar Cuenta por Cobrar' : 'Seleccionar Cuenta por Pagar'}
                            </Label>
                            <select
                                id="cuenta_id"
                                name="cuenta_id"
                                value={formData.cuenta_id}
                                onChange={handleChange}
                                disabled={loading}
                                className="flex h-9 w-full rounded-md border border-input bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">-- Seleccionar --</option>
                                {Array.isArray(cuentasPendientes) && cuentasPendientes.map((cuenta) => {
                                    let displayLabel = '';

                                    if (tipo === 'ventas') {
                                        if (cuenta.numero_venta) {
                                            displayLabel = `Venta-${cuenta.numero_venta} | Cuenta-${cuenta.id}`;
                                        } else {
                                            displayLabel = `Crédito #${cuenta.id} | #${cuenta.referencia_documento || 'N/A'}`;
                                        }
                                    } else {
                                        if (cuenta.numero_venta) {
                                            displayLabel = `Compra #${cuenta.numero_venta} | Cuenta #${cuenta.id}`;
                                        } else {
                                            displayLabel = `Deuda #${cuenta.id}`;
                                        }
                                    }

                                    return (
                                        <option key={cuenta.id} value={String(cuenta.id)}>
                                            {displayLabel} - {formatCurrency(cuenta.saldo_pendiente)} - Vence:{' '}
                                            {new Date(cuenta.fecha_vencimiento).toLocaleDateString('es-BO')}
                                        </option>
                                    );
                                })}
                                {/* Fallback: Si la cuenta preseleccionada no está en la lista, mostrarla de todas formas */}
                                {cuentaIdPreseleccionada &&
                                    !cuentasPendientes.find((c) => c.id === cuentaIdPreseleccionada) && (
                                        <option key={`selected-${cuentaIdPreseleccionada}`} value={String(cuentaIdPreseleccionada)}>
                                            Cuenta #{cuentaIdPreseleccionada} (Seleccionada)
                                        </option>
                                    )}
                            </select>
                        </div>

                        {/* Mostrar detalles de la cuenta seleccionada */}
                        {selectedCuenta && (
                            <div className="rounded-md border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-800 dark:text-blue-200">
                                <p className="mb-1">
                                    <strong>Saldo pendiente:</strong> {formatCurrency(selectedCuenta.saldo_pendiente)}
                                </p>
                                <p className="mb-1">
                                    <strong>Monto original:</strong> {formatCurrency(selectedCuenta.monto_original)}
                                </p>
                                <p>
                                    <strong>Vencimiento:</strong>{' '}
                                    {new Date(selectedCuenta.fecha_vencimiento).toLocaleDateString('es-BO')}
                                </p>
                            </div>
                        )}

                        {/* Tipo de Pago */}
                        <div className="space-y-2">
                            <Label htmlFor="tipo_pago_id" className="text-gray-700 dark:text-gray-300">Tipo de Pago</Label>
                            <select
                                id="tipo_pago_id"
                                name="tipo_pago_id"
                                value={formData.tipo_pago_id}
                                onChange={handleChange}
                                disabled={loading}
                                className="flex h-9 w-full rounded-md border border-input bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">-- Seleccionar --</option>
                                {Array.isArray(tipos_pago) && tipos_pago.length > 0 ? (
                                    tipos_pago.map((tipo) => (
                                        <option key={tipo.id} value={String(tipo.id)}>
                                            {tipo.nombre}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="1">Efectivo</option>
                                        <option value="2">Transferencia / QR</option>
                                        <option value="4">Cheque</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Monto */}
                        <div className="space-y-2">
                            <Label htmlFor="monto" className="text-gray-700 dark:text-gray-300">Monto a Pagar</Label>
                            <Input
                                id="monto"
                                type="number"
                                step="0.01"
                                min="0"
                                name="monto"
                                value={formData.monto}
                                onChange={handleChange}
                                disabled={loading}
                                max={selectedCuenta ? selectedCuenta.saldo_pendiente : undefined}
                                placeholder="0.00"
                            />
                            {selectedCuenta && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Máximo: {formatCurrency(selectedCuenta.saldo_pendiente)}
                                </p>
                            )}
                        </div>

                        {/* Fecha de Pago */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha_pago" className="text-gray-700 dark:text-gray-300">Fecha de Pago</Label>
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
                            <Label htmlFor="numero_recibo" className="text-gray-700 dark:text-gray-300">Número de Recibo (Opcional)</Label>
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

                        {/* Campos específicos según tipo de pago */}
                        {formData.tipo_pago_id === '2' && (
                            <div className="space-y-2">
                                <Label htmlFor="numero_transferencia" className="text-gray-700 dark:text-gray-300">Número de Transferencia (Opcional)</Label>
                                <Input
                                    id="numero_transferencia"
                                    type="text"
                                    name="numero_transferencia"
                                    value={formData.numero_transferencia}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Ej: TRF-12345"
                                />
                            </div>
                        )}

                        {formData.tipo_pago_id === '3' && (
                            <div className="space-y-2">
                                <Label htmlFor="numero_cheque" className="text-gray-700 dark:text-gray-300">Número de Cheque (Opcional)</Label>
                                <Input
                                    id="numero_cheque"
                                    type="text"
                                    name="numero_cheque"
                                    value={formData.numero_cheque}
                                    onChange={handleChange}
                                    disabled={loading}
                                    placeholder="Ej: CHQ-12345"
                                />
                            </div>
                        )}

                        {/* Observaciones */}
                        <div className="space-y-2">
                            <Label htmlFor="observaciones" className="text-gray-700 dark:text-gray-300">Observaciones (Opcional)</Label>
                            <textarea
                                id="observaciones"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Notas o comentarios del pago"
                                rows={3}
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </form>
                </div>

                <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 flex justify-end gap-2 flex-shrink-0 mt-4">
                    <Button
                        variant="outline"
                        onClick={onHide}
                        disabled={loading}
                        className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !formData.cuenta_id ||
                            !formData.tipo_pago_id ||
                            !formData.monto ||
                            cargandoCaja ||
                            (verificarCaja && !cajaInfo?.tiene_caja_abierta)
                        }
                        className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
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
    );
}

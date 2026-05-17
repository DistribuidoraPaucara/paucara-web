import React, { useState, useEffect } from 'react';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { Banknote, Send, CreditCard, Truck, Split, CheckCircle2, AlertCircle, Info, Loader2, RefreshCw } from 'lucide-react';
import type { Proforma, PaymentData } from '@/domain/entities/proformas';
import type { CoordinacionData } from '@/application/hooks/use-proforma-actions';
import { usePoliticasPago } from '@/application/hooks/use-politicas-pago';

interface TipoPago {
    id: number;
    codigo: string;
    nombre: string;
    activo: boolean;
}

interface ApprovalPaymentFormProps {
    proforma: Proforma;
    coordinacion: CoordinacionData;
    onCoordinacionChange: (data: CoordinacionData) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
    // Props para manejar reservas expiradas
    errorState?: {
        code?: string;
        message?: string;
        reservasExpiradas?: number;
    } | null;
    onRenovarReservas?: () => void;
    isRenovando?: boolean;
}

export function ApprovalPaymentForm({
    proforma,
    coordinacion,
    onCoordinacionChange,
    onSubmit,
    onCancel,
    isSubmitting,
    errorState = null,
    onRenovarReservas,
    isRenovando = false
}: ApprovalPaymentFormProps) {

    const [tiposPago, setTiposPago] = useState<TipoPago[]>([]);
    const [loadingTiposPago, setLoadingTiposPago] = useState(true);
    const [payment, setPayment] = useState<PaymentData>({
        con_pago: false,
        politica_pago: proforma.politica_pago || 'CONTRA_ENTREGA', // ✅ NUEVO: Usar politica_pago de proforma
        monto_pagado: 0,
    });

    // ✅ NUEVO: Estado para datos de crédito del cliente
    const [clienteConCredito, setClienteConCredito] = useState(proforma.cliente);

    // ✅ NUEVO: Estado para advertencia de fecha comprometida diferente a solicitada
    const [userConfirmedDateWarning, setUserConfirmedDateWarning] = useState(false);
    // ✅ NUEVO: Estado para mostrar cargando después de confirmar fecha
    const [isLoadingAfterConfirm, setIsLoadingAfterConfirm] = useState(false);

    // ✅ NUEVO: Hook para obtener políticas de pago disponibles (desde API)
    const {
        loading: loadingPoliticas,
        politicasDisponibles,
        puedeUsarPolitica,
        calcularMinimo,
        validarMonto,
        getMensajeCreditoNoDisponible
    } = usePoliticasPago({
        cliente: clienteConCredito,
    });

    // ✅ NUEVO: Helper para detectar si la fecha comprometida es diferente a la solicitada
    const fechaSolicitada = proforma.fecha_entrega_solicitada?.split('T')[0];
    const fechaComprometida = (coordinacion.fecha_entrega_confirmada || (() => {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const day = String(hoy.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    })()).split('T')[0];

    const fechasDiferentes = fechaSolicitada !== fechaComprometida;

    // ✅ NUEVO: Handler para botón de aprobación con advertencia de fecha
    const handleApprobalWithDateWarning = () => {
        if (fechasDiferentes && !userConfirmedDateWarning) {
            // Primera vez: mostrar advertencia y estado de cargando
            setIsLoadingAfterConfirm(true);
            setUserConfirmedDateWarning(true);
        } else {
            // Segunda vez o fechas iguales: ejecutar aprobación
            setIsLoadingAfterConfirm(false); // Resetear antes de enviar
            onSubmit();
        }
    };

    // Cargar tipos de pago al montar el componente
    useEffect(() => {
        fetch('/api/tipos-pago')
            .then(res => res.json())
            .then(data => {
                setTiposPago(data.data || []);

                // ✅ MEJORADO: Establecer tipo de pago coherente con política
                // Si la política es CREDITO, usar CREDITO tipo de pago
                // Si no, usar EFECTIVO como default
                let defaultTipo;

                if (proforma.politica_pago === 'CREDITO') {
                    defaultTipo = data.data?.find((t: TipoPago) => t.codigo === 'CREDITO' && t.activo);
                    console.log('%c💳 Política es CREDITO, usando tipo CREDITO por defecto:', 'color: blue;');
                } else {
                    const efectivo = data.data?.find((t: TipoPago) => t.codigo === 'EFECTIVO' && t.activo);
                    defaultTipo = efectivo || data.data?.find((t: TipoPago) => t.activo);
                }

                if (defaultTipo) {
                    console.log('%c💰 Tipo de pago por defecto:', 'color: green;', {
                        codigo: defaultTipo.codigo,
                        nombre: defaultTipo.nombre,
                    });
                    setPayment(prev => ({ ...prev, tipo_pago_id: defaultTipo.id }));
                }
            })
            .catch(error => {
                console.error('Error al cargar tipos de pago:', error);
                // Fallback a opciones básicas si el endpoint falla
                setTiposPago([
                    { id: 1, codigo: 'EFECTIVO', nombre: 'Efectivo', activo: true },
                    { id: 2, codigo: 'TRANSFERENCIA', nombre: 'Transferencia', activo: true },
                ]);
                // ✅ MEJORADO: Establecer default coherente en fallback también
                const defaultId = proforma.politica_pago === 'CREDITO' ? 3 : 1; // 3 sería CREDITO si existiera
                setPayment(prev => ({ ...prev, tipo_pago_id: proforma.politica_pago === 'CREDITO' ? undefined : 1 }));
            })
            .finally(() => setLoadingTiposPago(false));
    }, [proforma.politica_pago]);

    // ✅ NUEVO: Cargar cliente completo SIEMPRE (no solo si es CRÉDITO)
    // Esto es necesario para filtrar tipos de pago según puede_tener_credito
    useEffect(() => {
        if (proforma.cliente?.id) {
            console.log('%c📊 Cargando datos completos del cliente:', 'color: green;', {
                cliente_id: proforma.cliente.id,
                cliente_nombre: proforma.cliente.nombre,
            });

            fetch(`/api/clientes/${proforma.cliente.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.data) {
                        // Convertir limite_credito a número si viene como string
                        const clienteActualizado = {
                            ...data.data,
                            limite_credito: parseFloat(data.data.limite_credito || '0'),
                        };

                        // Actualizar el estado con el cliente completo
                        setClienteConCredito(clienteActualizado);

                        console.log('%c✅ Cliente cargado completamente:', 'color: green;', {
                            puede_tener_credito: clienteActualizado.puede_tener_credito,
                            credito_utilizado: clienteActualizado.credito_utilizado,
                            saldo_credito: clienteActualizado.saldo_credito,
                            limite_credito: clienteActualizado.limite_credito,
                        });
                    }
                })
                .catch(error => {
                    console.error('❌ Error al cargar datos del cliente:', error);
                });
        }
    }, [proforma.cliente?.id]);

    // ✅ NUEVO: Filtrar tipos de pago según permisos del cliente
    useEffect(() => {
        if (tiposPago.length > 0) {
            const puedeCredito = clienteConCredito?.puede_tener_credito === true;

            const tiposFiltrados = tiposPago.filter(tipo => {
                // Si es tipo de pago CRÉDITO, solo mostrarlo si el cliente puede tener crédito
                if (tipo.codigo === 'CREDITO') {
                    console.log('%c💳 Filtrando tipo CRÉDITO:', 'color: orange;', {
                        puede_tener_credito: puedeCredito,
                        mostrar: puedeCredito,
                    });
                    return puedeCredito;
                }
                // Los demás tipos siempre están disponibles
                return true;
            });

            console.log('%c📊 Tipos de pago filtrados:', 'color: green;', {
                total: tiposPago.length,
                filtrados: tiposFiltrados.length,
                tipos: tiposFiltrados.map(t => t.codigo),
            });

            // Solo actualizar si hay cambios
            if (tiposFiltrados.length !== tiposPago.length) {
                setTiposPago(tiposFiltrados);

                // ✅ NUEVO: Si el cliente NO puede tener crédito y la política seleccionada es CRÉDITO,
                // cambiar a CONTRA_ENTREGA
                if (!puedeCredito && payment.politica_pago === 'CREDITO') {
                    console.log('%c⚠️ Cliente sin permiso de crédito, cambiando política a CONTRA_ENTREGA:', 'color: red;');
                    setPayment(prev => ({
                        ...prev,
                        politica_pago: 'CONTRA_ENTREGA',
                        monto_pagado: 0,
                    }));
                }
            }
        }
    }, [clienteConCredito?.puede_tener_credito, payment.politica_pago]);

    // Actualizar estado de coordinación cuando cambie el pago
    useEffect(() => {
        // 🔍 DEBUG
        console.log('%c🔄 ApprovalPaymentForm - Actualizando coordinacion con payment:', 'color: blue;');
        console.log('payment state:', payment);
        console.log('con_pago:', payment.con_pago);

        onCoordinacionChange({
            ...coordinacion,
            payment
        });
    }, [payment, onCoordinacionChange]);

    // ✅ MEJORADO: Calcular monto mínimo usando el hook
    const getMinimumPayment = (): number => {
        return calcularMinimo(payment.politica_pago as any, proforma.subtotal);
    };

    // ✅ MEJORADO: Manejo de cambio de tipo de pago con sincronización a política
    const handleTipoPagoChange = (tipoPagoIdStr: string) => {
        const tipoPagoId = parseInt(tipoPagoIdStr) || undefined;
        const tipoSeleccionado = tiposPago.find(t => t.id === tipoPagoId);

        setPayment(prev => {
            const nuevoPayment = { ...prev, tipo_pago_id: tipoPagoId };

            // Si el tipo de pago seleccionado es CREDITO, sincronizar politica_pago a CREDITO
            if (tipoSeleccionado?.codigo === 'CREDITO') {
                console.log('%c🔄 Tipo de pago cambiado a CREDITO, sincronizando política de pago:', 'color: green;');
                nuevoPayment.politica_pago = 'CREDITO' as any;
                nuevoPayment.monto_pagado = 0;
            }

            return nuevoPayment;
        });
    };

    // ✅ MEJORADO: Manejo de cambio de política con sincronización a tipo de pago
    const handlePolicyChange = (policy: string) => {
        // Validar si el cliente puede usar esta política
        if (!puedeUsarPolitica(policy as any)) {
            const mensajeCredito = getMensajeCreditoNoDisponible();
            if (policy === 'CREDITO' && mensajeCredito) {
                alert(mensajeCredito);
            }
            return;
        }

        setPayment(prev => {
            const nuevoPayment = {
                ...prev,
                politica_pago: policy as any,
                // Resetear monto si es contra entrega o crédito
                monto_pagado: (policy === 'CONTRA_ENTREGA' || policy === 'CREDITO') ? 0 : prev.monto_pagado
            };

            // Si la política seleccionada es CREDITO, sincronizar tipo_pago a CREDITO
            if (policy === 'CREDITO') {
                const creditoTipo = tiposPago.find(t => t.codigo === 'CREDITO');
                if (creditoTipo) {
                    console.log('%c🔄 Política de pago cambiada a CREDITO, sincronizando tipo de pago:', 'color: green;');
                    nuevoPayment.tipo_pago_id = creditoTipo.id;
                }
            }

            return nuevoPayment;
        });
    };

    // Validar si el formulario de pago es válido
    const isPaymentValid = (): boolean => {
        // Si no hay pago, es válido
        if (!payment.con_pago) return true;

        // Si hay pago, debe haber tipo_pago_id
        if (!payment.tipo_pago_id) return false;

        // Validar monto según política
        const minPayment = getMinimumPayment();
        if (payment.monto_pagado === undefined || payment.monto_pagado < minPayment) {
            return false;
        }

        // No puede exceder el total
        if (payment.monto_pagado > proforma.total) {
            return false;
        }

        return true;
    };

    // Formatear moneda
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2
        }).format(value);
    };

    // Mapear código de pago a ícono
    const getPaymentIcon = (codigo: string) => {
        const iconProps = { className: 'w-4 h-4' };
        switch (codigo) {
            case 'EFECTIVO':
                return <Banknote {...iconProps} />;
            case 'TRANSFERENCIA':
                return <Send {...iconProps} />;
            case 'CREDITO':
                return <CreditCard {...iconProps} />;
            case 'TARJETA':
                return <CreditCard {...iconProps} />;
            default:
                return null;
        }
    };

    // Mapear política de pago a ícono
    const getPolicyIcon = (policy: string) => {
        const iconProps = { className: 'w-4 h-4' };
        switch (policy) {
            case 'CONTRA_ENTREGA':
                return <Truck {...iconProps} />;
            case 'MEDIO_MEDIO':
                return <Split {...iconProps} />;
            case 'ANTICIPADO_100':
                return <CheckCircle2 {...iconProps} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 py-4">
            {/* ⚠️ ADVERTENCIA: Reservas Expiradas */}
            {errorState?.code === 'RESERVAS_EXPIRADAS' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                                ⚠️ Reservas Expiradas
                            </h3>
                            <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
                                {errorState.reservasExpiradas} reserva(s) de esta proforma han expirado.
                                Para continuar, necesitas renovar las reservas primero.
                            </p>
                            <Button
                                onClick={onRenovarReservas}
                                disabled={isRenovando || isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                size="sm"
                            >
                                {isRenovando ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Renovando Reservas...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Renovar Reservas
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen de Coordinación de Entrega */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Resumen de Coordinación de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha solicitada:</span>
                        <span className="font-medium">{fechaSolicitada || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha comprometida:</span>
                        <span className={`font-medium ${fechasDiferentes ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                            {fechaComprometida}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Hora confirmada:</span>
                        <span className="font-medium">
                            {coordinacion.hora_entrega_confirmada}
                            {coordinacion.hora_entrega_confirmada_fin && (
                                <> - {coordinacion.hora_entrega_confirmada_fin}</>
                            )}
                        </span>
                    </div>
                    {coordinacion.comentario_coordinacion && (
                        <div>
                            <span className="text-muted-foreground">Comentario:</span>
                            <p className="mt-1 text-foreground">{coordinacion.comentario_coordinacion}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ✅ NUEVO: Advertencia si la fecha comprometida es diferente a la solicitada */}
            {fechasDiferentes && !userConfirmedDateWarning && (
                <Alert className="border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                        <div className="font-semibold mb-1">⚠️ Atención: Fecha de Entrega Comprometida Diferente</div>
                        <p className="text-sm">
                            Estás aprobando una proforma con una fecha de entrega comprometida (<strong>{fechaComprometida}</strong>) diferente a la solicitada por el cliente (<strong>{fechaSolicitada}</strong>).
                        </p>
                        <p className="text-sm mt-2">
                            Haz clic en el botón "Aprobar" nuevamente para confirmar esta acción.
                        </p>
                    </AlertDescription>
                </Alert>
            )}

            {/* ✅ NUEVO: Confirmación después de la primera advertencia */}
            {fechasDiferentes && userConfirmedDateWarning && (
                <Alert className="border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        <div className="font-semibold">✓ Aprobación Confirmada</div>
                        <p className="text-sm">
                            Procederá a aprobar con fecha comprometida del <strong>{fechaComprometida}</strong>.
                        </p>
                    </AlertDescription>
                </Alert>
            )}

            {/* ✅ NUEVO: Resumen de Política Solicitada */}
            {proforma.politica_pago && (
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    {/* <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Política Solicitada por el Cliente
                            </CardTitle>
                        </div>
                    </CardHeader> */}
                    <CardContent className="text-sm">
                        <div className="flex justify-between">
                            <span className="text-blue-700 dark:text-blue-300">Política Solicitada:</span>
                            <span className="font-semibold text-blue-900 dark:text-blue-100">
                                {proforma.politica_pago === 'CONTRA_ENTREGA' && 'Contra Entrega'}
                                {proforma.politica_pago === 'ANTICIPADO_100' && '100% Anticipado'}
                                {proforma.politica_pago === 'MEDIO_MEDIO' && '50% Anticipo + 50% Contra Entrega'}
                                {proforma.politica_pago === 'CREDITO' && 'Crédito'}
                            </span>
                        </div>
                        {proforma.politica_pago === 'CREDITO' && (
                            <div className="mt-2 space-y-2 rounded bg-gradient-to-br from-blue-50 to-indigo-50 p-3 dark:from-slate-800 dark:to-slate-900">
                                {/* Límite de crédito */}
                                <div className="flex items-center justify-between border-b border-blue-200 pb-2 dark:border-slate-700">
                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                        Límite de crédito:
                                    </p>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        Bs. {(parseFloat(clienteConCredito?.limite_credito || '0') || 0).toFixed(2)}
                                    </p>
                                </div>

                                {/* Crédito utilizado */}
                                <div className="flex items-center justify-between border-b border-orange-200 pb-2 dark:border-orange-900/30">
                                    <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                                        Crédito utilizado:
                                    </p>
                                    <p className="font-semibold text-orange-900 dark:text-orange-100">
                                        Bs. {(clienteConCredito?.credito_utilizado ?? 0).toFixed(2)}
                                    </p>
                                </div>

                                {/* Crédito disponible (calculado) */}
                                <div className="flex items-center justify-between rounded bg-white p-2 dark:bg-slate-800">
                                    <p className="text-xs font-medium font-bold text-green-700 dark:text-green-300">
                                        Crédito disponible:
                                    </p>
                                    <p className={`font-bold ${((clienteConCredito?.saldo_credito ?? 0) >= proforma.total)
                                        ? 'text-green-900 dark:text-green-100'
                                        : 'text-red-900 dark:text-red-100'
                                        }`}>
                                        Bs. {(clienteConCredito?.saldo_credito ?? 0).toFixed(2)}
                                    </p>
                                </div>

                                {/* Advertencia si no hay suficiente crédito */}
                                {(clienteConCredito?.saldo_credito ?? 0) < proforma.total && (
                                    <div className="mt-2 rounded bg-red-50 p-2 dark:bg-red-950">
                                        <p className="text-xs text-red-700 dark:text-red-300">
                                            ⚠️ Crédito insuficiente. Necesita Bs. {(proforma.total - (clienteConCredito?.saldo_credito ?? 0)).toFixed(2)} adicional.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Sección de Verificación de Pago */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Verificación de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">


                    {/* Método de Pago */}
                    <div className="space-y-2">
                        <Label htmlFor="tipo_pago" className="text-sm font-medium">
                            Método de Pago *
                        </Label>
                        <Select
                            value={payment.tipo_pago_id?.toString() || ''}
                            onValueChange={handleTipoPagoChange}
                            disabled={isSubmitting || loadingTiposPago}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione método de pago" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground border-input dark:border-input">
                                {tiposPago.filter(t =>
                                    t.activo &&
                                    // ✅ Filtrar CRÉDITO solo si el cliente puede tener crédito
                                    (t.codigo !== 'CREDITO' || clienteConCredito?.puede_tener_credito === true)
                                ).map(tipo => (
                                    <SelectItem
                                        key={tipo.id}
                                        value={tipo.id.toString()}
                                        className="cursor-pointer focus:bg-accent dark:focus:bg-accent focus:text-accent-foreground dark:focus:text-accent-foreground"
                                    >
                                        <div className="flex items-center gap-2">
                                            {getPaymentIcon(tipo.codigo)}
                                            <span>{tipo.nombre}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ✅ MEJORADO: Política de Pago Dinámica */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Política de Pago *</Label>
                        {loadingPoliticas ? (
                            <div className="flex items-center justify-center p-4">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent border-t-transparent"></div>
                                <span className="ml-2 text-sm text-muted-foreground">Cargando políticas...</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {politicasDisponibles
                                    // ✅ Filtrar CRÉDITO solo si el cliente puede tener crédito
                                    .filter(p => p.codigo !== 'CREDITO' || clienteConCredito?.puede_tener_credito === true)
                                    .map((politica) => {
                                        const isSelected = payment.politica_pago === politica.codigo;
                                        const isDisabled = !puedeUsarPolitica(politica.codigo);
                                        const creditoMsg = politica.codigo === 'CREDITO' ? getMensajeCreditoNoDisponible() : null;

                                        return (
                                            <label
                                                key={politica.codigo}
                                                htmlFor={`politica_${politica.codigo}`}
                                                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${isDisabled
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-accent/5 dark:hover:bg-accent/10'
                                                    } ${isSelected
                                                        ? 'border-accent bg-accent/5 dark:bg-accent/10'
                                                        : 'border-input'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    id={`politica_${politica.codigo}`}
                                                    name="politica_pago"
                                                    value={politica.codigo}
                                                    checked={isSelected}
                                                    onChange={(e) => handlePolicyChange(e.target.value)}
                                                    disabled={isSubmitting || isDisabled}
                                                    className="h-4 w-4 cursor-pointer"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="flex items-center gap-2 font-medium text-sm">
                                                        {getPolicyIcon(politica.codigo)}
                                                        <span>{politica.nombre}</span>
                                                        {politica.codigo === 'CREDITO' && isDisabled && (
                                                            <AlertCircle className="h-4 w-4 text-amber-500" title={creditoMsg || ''} />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {politica.descripcion}
                                                    </p>
                                                    {creditoMsg && isDisabled && (
                                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                            {creditoMsg}
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* ✅ MEJORADO: Monto Pagado (condicional) */}
                    {payment.politica_pago !== 'CONTRA_ENTREGA' && payment.politica_pago !== 'CREDITO' && (
                        <>
                            <Alert>
                                <AlertDescription>
                                    {(() => {
                                        const minimo = getMinimumPayment();
                                        if (minimo === 0) {
                                            return 'No se requiere pago por adelantado';
                                        }
                                        return `Se requiere mínimo: ${formatCurrency(minimo)}`;
                                    })()}
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="monto_pagado" className="text-sm font-medium">
                                    Monto Pagado (Bs.) *
                                </Label>
                                <Input
                                    type="number"
                                    id="monto_pagado"
                                    step="0.01"
                                    min="0"
                                    max={proforma.total}
                                    value={payment.monto_pagado || 0}
                                    onChange={(e) => setPayment(prev => ({
                                        ...prev,
                                        monto_pagado: parseFloat(e.target.value) || 0
                                    }))}
                                    disabled={isSubmitting}
                                    className={
                                        (payment.monto_pagado < getMinimumPayment() ||
                                            payment.monto_pagado > proforma.total) && payment.monto_pagado > 0
                                            ? 'border-red-500'
                                            : ''
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Total de la proforma: {formatCurrency(proforma.total)}
                                </p>
                            </div>

                            {/* Fecha de Pago */}
                            <div className="space-y-2">
                                <Label htmlFor="fecha_pago" className="text-sm font-medium">
                                    Fecha de Pago
                                </Label>
                                <Input
                                    type="date"
                                    id="fecha_pago"
                                    value={payment.fecha_pago || (() => {
                                        const hoy = new Date();
                                        const year = hoy.getFullYear();
                                        const month = String(hoy.getMonth() + 1).padStart(2, '0');
                                        const day = String(hoy.getDate()).padStart(2, '0');
                                        return `${year}-${month}-${day}`;
                                    })()}
                                    onChange={(e) => setPayment(prev => ({ ...prev, fecha_pago: e.target.value }))}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Referencias de Pago */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="numero_recibo" className="text-sm font-medium">
                                        Número de Recibo
                                    </Label>
                                    <Input
                                        type="text"
                                        id="numero_recibo"
                                        placeholder="Ej: REC-001"
                                        value={payment.numero_recibo || ''}
                                        onChange={(e) => setPayment(prev => ({ ...prev, numero_recibo: e.target.value }))}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numero_transferencia" className="text-sm font-medium">
                                        Número de Transferencia
                                    </Label>
                                    <Input
                                        type="text"
                                        id="numero_transferencia"
                                        placeholder="Ej: TRANS-12345"
                                        value={payment.numero_transferencia || ''}
                                        onChange={(e) => setPayment(prev => ({ ...prev, numero_transferencia: e.target.value }))}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ✅ NUEVO: Información especial para CREDITO */}
                    {payment.politica_pago === 'CREDITO' && (
                        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <AlertDescription className="text-amber-800 dark:text-amber-200">
                                Esta venta se registrará como crédito. No requiere pago inmediato pero se generará una cuenta por cobrar.
                                El cliente tiene un límite de crédito de <span className="font-semibold">{formatCurrency(proforma.cliente?.limite_credito ?? 0)}</span>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Mensajes de Validación */}
                    {payment.monto_pagado < getMinimumPayment() && payment.monto_pagado > 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                El monto pagado es menor al mínimo requerido para la política seleccionada
                            </AlertDescription>
                        </Alert>
                    )}

                    {payment.monto_pagado > proforma.total && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                El monto pagado no puede exceder el total de la proforma
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-2 pt-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        setUserConfirmedDateWarning(false); // Resetear estado al cancelar
                        setIsLoadingAfterConfirm(false); // Resetear cargando al cancelar
                        onCancel();
                    }}
                    disabled={isSubmitting || isRenovando || errorState?.code === 'RESERVAS_EXPIRADAS'}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleApprobalWithDateWarning}
                    disabled={isSubmitting || !isPaymentValid() || isRenovando || errorState?.code === 'RESERVAS_EXPIRADAS'}
                    className={`text-white ${userConfirmedDateWarning && fechasDiferentes ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {payment.con_pago ? 'Aprobando y Convirtiendo...' : 'Aprobando...'}
                        </>
                    ) : userConfirmedDateWarning && fechasDiferentes ? (
                        payment.con_pago ? '✓ Confirmar: Aprobar y Convertir a Venta' : '✓ Confirmar: Aprobar'
                    ) : (
                        payment.con_pago ? 'Aprobar y Convertir a Venta' : 'Aprobar'
                    )}
                </Button>
            </div>
        </div>
    );
}

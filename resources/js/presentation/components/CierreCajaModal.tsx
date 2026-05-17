import React, { Fragment, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import toast from 'react-hot-toast';
import { OutputSelectionModal, type TipoDocumento } from '@/presentation/components/impresion/OutputSelectionModal';

interface AperturaCaja {
    id: number;
    caja_id: number;
    user_id: number;
    fecha: string;
    monto_apertura: number;
    observaciones?: string;
    caja: {
        id: number;
        nombre: string;
        ubicacion: string;
    };
}

interface DatosCierre {
    apertura_id: number;
    caja_nombre: string;
    fecha_apertura: string;
    fecha_cierre: string;
    sumatoria_ventas_total: number;
    sumatoria_ventas_efectivo: number;
    sumatoria_ventas_credito: number;
    sumatoria_ventas_anuladas: number;
    sumatoria_gastos: number;
    monto_pagos_creditos: number;
    movimientos_agrupados: Array<{ tipo: string; total: number; cantidad: number }>;  // ← ACTUALIZADO
    movimientos_por_tipo_pago: Record<string, { cantidad: number; total: number }>;
    detalles_pagos_venta_por_tipo?: Record<string, { codigo: string; cantidad: number; total: number }>;  // ✅ NUEVO: Pagos desde detalles_pago_venta
    ventas_por_tipo_pago: Record<string, { cantidad: number; total: number }>;
    ventas_por_estado: Array<{ estado: string; count: number; total: number }>;
    pagos_credito_por_tipo_pago: Array<{ tipo: string; cantidad: number; total: number }>;
    gastos_por_tipo_pago: Array<{ tipo: string; cantidad: number; total: number }>;
    efectivo_esperado: {
        apertura: number;
        ventas_efectivo: number;
        pagos_credito: number;
        gastos: number;
        total: number;
    };
    rango_ventas_ids: { minId: number | null; maxId: number | null; totalVentas: number };
    rango_creditos: { minId: number | null; maxId: number | null; totalCreditos: number; montoCreditos: number };
    rango_pagos: { minId: number | null; maxId: number | null; totalPagos: number; montoPagos: number };
    total_ingresos: number;
    total_egresos: number;
}

interface Props {
    show: boolean;
    onClose: () => void;
    cajaAbierta: AperturaCaja | null;
    montoEsperado: number;
}

export default function CierreCajaModal({ show, onClose, cajaAbierta, montoEsperado }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        monto_real: '',
        observaciones: '',
        fecha_cierre: new Date().toISOString().split('T')[0]
    });

    const [outputModal, setOutputModal] = useState<{ isOpen: boolean; aperturaId?: number }>({ isOpen: false });
    const [datosCierre, setDatosCierre] = useState<DatosCierre | null>(null);
    const [cargandoDatos, setCargandoDatos] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            console.log('📤 [CierreCajaModal] Enviando petición POST /cajas/cerrar');

            // ✅ Usar fetch directamente (no Inertia) para evitar redirección
            const response = await fetch('/cajas/cerrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    monto_real: data.monto_real,
                    observaciones: data.observaciones,
                    fecha_cierre: data.fecha_cierre,
                }),
            });

            const result = await response.json();

            if (result.success) {
                console.log('✅ [CierreCajaModal] Éxito en cerrar caja');
                toast.success('Caja cerrada exitosamente');

                // ✅ Abrir OutputSelectionModal INMEDIATAMENTE
                if (cajaAbierta?.id) {
                    console.log('🔓 [CierreCajaModal] Abriendo OutputSelectionModal con apertura_id:', cajaAbierta.id);
                    setOutputModal({ isOpen: true, aperturaId: cajaAbierta.id });
                    reset();
                } else {
                    console.warn('⚠️ No hay cajaAbierta.id');
                    reset();
                    onClose();
                }
            } else {
                console.error('❌ Error en respuesta:', result);
                toast.error(result.message || 'Error al cerrar la caja');
            }
        } catch (error) {
            console.error('❌ [CierreCajaModal] Error en petición:', error);
            toast.error('Error al cerrar la caja. Intenta nuevamente.');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Nota: Los cálculos ahora vienen del servidor (CierreCajaService)
    // Los métodos locales han sido eliminados para evitar duplicación de lógica

    // ✅ NUEVO: Cargar datos desde el servidor (CierreCajaService)
    React.useEffect(() => {
        if (show && cajaAbierta?.id) {
            setCargandoDatos(true);
            console.log('🔵 [CierreCajaModal] Iniciando petición a /cajas/' + cajaAbierta.id + '/datos-cierre');

            fetch(`/cajas/${cajaAbierta.id}/datos-cierre`)
                .then(res => {
                    console.log('🟦 [CierreCajaModal] Response status:', res.status);
                    return res.json();
                })
                .then(result => {
                    console.log('🟩 [CierreCajaModal] Respuesta completa del backend:', result);
                    console.log('📊 [CierreCajaModal] Datos desglosados:', {
                        apertura_id: result.data?.apertura_id,
                        caja_nombre: result.data?.caja_nombre,
                        sumatoria_ventas_total: result.data?.sumatoria_ventas_total,
                        sumatoria_ventas_efectivo: result.data?.sumatoria_ventas_efectivo,
                        sumatoria_gastos: result.data?.sumatoria_gastos,
                        monto_pagos_creditos: result.data?.monto_pagos_creditos,
                        total_ingresos: result.data?.total_ingresos,
                        total_egresos: result.data?.total_egresos,
                        efectivo_esperado: result.data?.efectivo_esperado,
                        movimientos_agrupados: result.data?.movimientos_agrupados,
                    });
                    console.log('🔢 [CierreCajaModal] Efectivo esperado calculadosssss:', result);

                    if (result.success && result.data) {
                        console.log('✅ [CierreCajaModal] Datos cargados exitosamente');
                        setDatosCierre(result.data);
                    }
                })
                .catch(err => {
                    console.error('❌ [CierreCajaModal] Error cargando datos de cierre:', err);
                })
                .finally(() => {
                    console.log('🔴 [CierreCajaModal] Petición finalizada');
                    setCargandoDatos(false);
                });
        }
    }, [show, cajaAbierta?.id]);

    // Usar datos del servidor si están disponibles, si no usar valores por defecto
    const efectivoEsperado = datosCierre?.efectivo_esperado || {
        apertura: cajaAbierta?.monto_apertura || 0,
        ventas_efectivo: 0,
        pagos_credito: 0,
        gastos: 0,
        total: cajaAbierta?.monto_apertura || 0,
    };

    // Totales de ingresos y egresos (desde servidor)
    const ventasTotales = datosCierre?.sumatoria_ventas_total || 0;
    const ventasEnEfectivo = datosCierre?.sumatoria_ventas_efectivo || 0;
    const ventasCredito = datosCierre?.sumatoria_ventas_credito || 0;
    const pagosDeCredito = datosCierre?.monto_pagos_creditos || 0;
    const gastosTotales = datosCierre?.sumatoria_gastos || 0;

    // ✅ ACTUALIZADO (2026-03-09): Incluir Servicios en los ingresos y Devoluciones en los egresos
    const serviciosTotales = datosCierre?.sumatoria_servicio || 0;
    const devolucionesTotales = datosCierre?.sumatoria_devoluciones || 0;

    // ✅ CORREGIDO (2026-02-20): Total Ingresos = Ventas Efectivo + Pagos de Crédito + Servicios (dinero que realmente entra)
    const ingresos = ventasEnEfectivo + pagosDeCredito + ventasCredito + serviciosTotales;
    const egresos = datosCierre?.total_egresos || 0;
    const apertura = datosCierre?.apertura || cajaAbierta?.monto_apertura || 0;

    // ✅ ACTUALIZADO (2026-03-09): Total Esperado = Apertura + Ventas Efectivo + Pagos Crédito + Servicios - Total Egresos
    // Es la cantidad TOTAL de dinero que debería haber en caja al cierre
    const totalEsperadoMejorado = apertura + ventasEnEfectivo + pagosDeCredito + serviciosTotales - egresos;

    // ✅ DEBUG: Log de cómo se calcula Total Esperado (ACTUALIZADO 2026-03-09)
    console.log('💰 [CierreCajaModal] TOTAL ESPERADO CORRECTO:', {
        apertura: apertura,
        ventasEfectivo: ventasEnEfectivo,
        pagosCredito: pagosDeCredito,
        servicios: serviciosTotales,
        totalEgresos: egresos,
        devoluciones: devolucionesTotales,
        formula: `${apertura} + ${ventasEnEfectivo} + ${pagosDeCredito} + ${serviciosTotales} - ${egresos}`,
        total: totalEsperadoMejorado,
    });

    const efectivoReal = ventasEnEfectivo + pagosDeCredito - gastosTotales;
    const ventasAnuladas = datosCierre?.sumatoria_ventas_anuladas || 0;

    const diferencia = data.monto_real ? parseFloat(data.monto_real) - totalEsperadoMejorado : 0;

    const rangoVentas = datosCierre?.rango_ventas_ids
        ? {
            minId: datosCierre.rango_ventas_ids.minId,
            maxId: datosCierre.rango_ventas_ids.maxId,
            totalVentas: datosCierre.rango_ventas_ids.totalVentas,
        }
        : null;

    // 🔍 DEBUG: Logs en consola para verificar los datos
    React.useEffect(() => {
        if (datosCierre) {
            console.log('📊 CierreCajaModal - Datos del Servidor (CierreCajaService):', {
                efectivo_esperado: datosCierre.efectivo_esperado,
                sumatoria_ventas_total: datosCierre.sumatoria_ventas_total,
                sumatoria_ventas_efectivo: datosCierre.sumatoria_ventas_efectivo,
                sumatoria_gastos: datosCierre.sumatoria_gastos,
                monto_pagos_creditos: datosCierre.monto_pagos_creditos,
            });
        }
    }, [datosCierre]);

    // Guard check: only render if cajaAbierta exists (after hooks are declared)
    if (!cajaAbierta) return null;

    return (
        <Fragment>
            <Dialog open={show && !outputModal.isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            🔒 Cerrar Caja del Día
                        </DialogTitle>
                        <DialogDescription>
                            Cuenta el dinero físico en caja y registra el cierre del día.
                        </DialogDescription>
                    </DialogHeader>

                    {cargandoDatos && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-gray-600 dark:text-gray-400">Cargando datos de cierre...</p>
                            </div>
                        </div>
                    )}

                    {!cargandoDatos && (
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="space-y-4 overflow-y-auto flex-1 px-6">
                                {/* Información de la caja */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">
                                        {cajaAbierta.caja.nombre}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Apertura:</span>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {new Date(cajaAbierta.fecha).toLocaleDateString('es-BO', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })} {new Date(cajaAbierta.fecha).toLocaleTimeString('es-BO', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-300 dark:border-gray-500 pt-2">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Cierre:</span>
                                            <input
                                                type="date"
                                                value={data.fecha_cierre}
                                                onChange={(e) => setData('fecha_cierre', e.target.value)}
                                                max={new Date().toISOString().split('T')[0]}
                                                className="w-full mt-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Totales de Ingresos y Egresos */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                        <p className="text-xs text-green-600 dark:text-green-400 mb-2">⬆️ Total Ingresos</p>
                                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                            {formatCurrency(ingresos)}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                                        <p className="text-xs text-red-600 dark:text-red-400 mb-2">⬇️ Total Egresos</p>
                                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                            {formatCurrency(egresos)}
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-lg border ${(ingresos - egresos) >= 0
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
                                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                                        }`}>
                                        <p className={`text-xs mb-2 ${(ingresos - egresos) >= 0
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-orange-600 dark:text-orange-400'
                                            }`}>💰 Total Neto</p>
                                        <p className={`text-2xl font-bold ${(ingresos - egresos) >= 0
                                            ? 'text-emerald-700 dark:text-emerald-300'
                                            : 'text-orange-700 dark:text-orange-300'
                                            }`}>
                                            {formatCurrency(ingresos - egresos)}
                                        </p>
                                    </div>
                                </div>
                                {/* Resumen financiero - ✅ MEJORADO: Usa efectivo real en lugar de todas las operaciones */}
                                <div className="space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-semibold text-teal-900 dark:text-teal-300">
                                            📊 Resumen
                                        </h4>
                                        {rangoVentas && (
                                            <div className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                                                IDs: #{rangoVentas.minId} → #{rangoVentas.maxId} ({rangoVentas.totalVentas})
                                            </div>
                                        )}
                                    </div>
                                    {/* ENTRADAS - Verde */}
                                    <div className="flex justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
                                        <span className="text-green-700 dark:text-green-300">⬆️ Monto Inicial:</span>
                                        <span className="font-medium text-green-900 dark:text-green-100">{formatCurrency(cajaAbierta.monto_apertura)}</span>
                                    </div>

                                    {/* ✅ ACTUALIZADO (2026-05-03): Desglose de Ventas por Tipo de Pago desde detalles_pago_venta */}
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700 p-3 space-y-2">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-green-700 dark:text-green-300">⬆️ Dinero Pagado por Tipo:</span>
                                            <span className="text-green-900 dark:text-green-100">
                                                {/* ✅ ACTUALIZADO (2026-05-03): SOLO sumar EFECTIVO + TRANSFERENCIA (CRÉDITO tiene su propio card) */}
                                                {formatCurrency(
                                                    Object.entries(datosCierre?.detalles_pagos_venta_por_tipo || {})
                                                        .filter(([tipo]) =>
                                                            tipo === 'Efectivo' || tipo === 'EFECTIVO' ||
                                                            tipo === 'Transferencia / QR' || tipo === 'TRANSFERENCIA/QR'
                                                        )
                                                        .reduce((sum, [_, datos]: [string, any]) => sum + (datos.total || 0), 0)
                                                )}
                                            </span>
                                        </div>
                                        {datosCierre?.detalles_pagos_venta_por_tipo && Object.entries(datosCierre.detalles_pagos_venta_por_tipo).length > 0 ? (
                                            <div className="space-y-1 pl-4 border-l-2 border-green-300 dark:border-green-700">
                                                {/* ✅ ACTUALIZADO (2026-05-03): SOLO mostrar EFECTIVO + TRANSFERENCIA (CRÉDITO tiene su propio card) */}
                                                {Object.entries(datosCierre.detalles_pagos_venta_por_tipo)
                                                    .filter(([tipo]) =>
                                                        tipo === 'Efectivo' || tipo === 'EFECTIVO' ||
                                                        tipo === 'Transferencia / QR' || tipo === 'TRANSFERENCIA/QR'
                                                    )
                                                    .map(([tipo, datos]: [string, any]) => (
                                                    <div key={tipo} className="flex justify-between text-sm">
                                                        <span className="text-green-600 dark:text-green-400">{tipo}</span>
                                                        <span className="text-green-700 dark:text-green-300">
                                                            {formatCurrency(datos.total)} ({datos.cantidad})
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="flex justify-between px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                                        <span className="text-blue-700 dark:text-blue-300">ℹ️ Ventas a Crédito:</span>
                                        <span className="font-medium text-blue-900 dark:text-blue-100">
                                            {formatCurrency(ventasCredito)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
                                        <span className="text-green-700 dark:text-green-300">⬆️ CxC Efectivo <small>(Pagos Creditos):</small></span>
                                        <span className="font-medium text-green-900 dark:text-green-100">{formatCurrency(pagosDeCredito)}</span>
                                    </div>
                                    {/* ✅ NUEVO (2026-03-09): Servicios */}
                                    {serviciosTotales > 0 && (
                                        <div className="flex justify-between px-3 py-2 bg-teal-50 dark:bg-teal-900/20 rounded border border-teal-200 dark:border-teal-700">
                                            <span className="text-teal-700 dark:text-teal-300">⬆️ Servicios:</span>
                                            <span className="font-medium text-teal-900 dark:text-teal-100">{formatCurrency(serviciosTotales)}</span>
                                        </div>
                                    )}
                                    {/* SALIDAS - Rojo */}
                                    <div className="flex justify-between px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700">
                                        <span className="text-red-700 dark:text-red-300">⬇️ Anulaciones de Ventas</span>
                                        <span className="font-medium text-red-900 dark:text-red-100">{formatCurrency(ventasAnuladas)}</span>
                                    </div>
                                    {/* ✅ NUEVO (2026-03-09): Devoluciones */}
                                    {devolucionesTotales > 0 && (
                                        <div className="flex justify-between px-3 py-2 bg-rose-50 dark:bg-rose-900/20 rounded border border-rose-200 dark:border-rose-700">
                                            <span className="text-rose-700 dark:text-rose-300">⬇️ Devoluciones de Productos:</span>
                                            <span className="font-medium text-rose-900 dark:text-rose-100">{formatCurrency(devolucionesTotales)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700">
                                        <span className="text-red-700 dark:text-red-300">⬇️ Total Egresos:</span>
                                        <span className="font-medium text-red-900 dark:text-red-100">
                                            {formatCurrency(egresos)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-lg font-semibold border-t border-yellow-300 dark:border-yellow-600 pt-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded">
                                        <span className="text-yellow-900 dark:text-yellow-200">💰 Total Esperado:</span>
                                        <span className="text-yellow-700 dark:text-yellow-300">{formatCurrency(totalEsperadoMejorado)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Ventas Totales:</span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(ventasEnEfectivo + ventasCredito)}
                                        </span>
                                    </div>
                                    {montoEsperado !== totalEsperadoMejorado && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic pt-2 border-t border-gray-300 dark:border-gray-600">
                                            ℹ️ Total esperado corregido: No incluye ventas a crédito pendientes de pago
                                        </p>
                                    )}
                                </div>

                                {/* Mostrar diferencia si hay monto ingresado */}
                                {data.monto_real && (
                                    <div className={`p-3 rounded-lg ${diferencia === 0
                                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                                        : diferencia > 0
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                                        }`}>
                                        <div className="flex justify-between items-center">
                                            <span className={`font-medium ${diferencia === 0
                                                ? 'text-gray-900 dark:text-green-300'
                                                : diferencia > 0
                                                    ? 'text-gray-900 dark:text-blue-300'
                                                    : 'text-gray-900 dark:text-red-300'
                                                }`}>Diferencia:</span>
                                            <span className={`font-bold text-lg ${diferencia === 0
                                                ? 'text-green-600 dark:text-green-400'
                                                : diferencia > 0
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                {diferencia === 0 ? '✅ ' : diferencia > 0 ? '📈 +' : '📉 '}
                                                {formatCurrency(Math.abs(diferencia))}
                                            </span>
                                        </div>
                                        <p className={`text-xs mt-1 ${diferencia === 0
                                            ? 'text-gray-600 dark:text-green-300'
                                            : diferencia > 0
                                                ? 'text-gray-600 dark:text-blue-300'
                                                : 'text-gray-600 dark:text-red-300'
                                            }`}>
                                            {diferencia === 0 && 'Perfecto! No hay diferencias.'}
                                            {diferencia > 0 && 'Sobrante - Tienes más dinero del esperado.'}
                                            {diferencia < 0 && 'Faltante - Tienes menos dinero del esperado.'}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="monto_real" className="text-gray-900 dark:text-gray-100">Dinero Físico Contado (Bs) *</Label>
                                    <Input
                                        id="monto_real"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.monto_real}
                                        onChange={(e) => setData('monto_real', e.target.value)}
                                        placeholder="0.00"
                                        className="text-right text-lg font-medium dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    {errors.monto_real && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.monto_real}</p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Cuenta todo el dinero físico que tienes en la caja
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="observaciones" className="text-gray-900 dark:text-gray-100">
                                        Observaciones {diferencia !== 0 && '(Explica la diferencia)'}
                                    </Label>
                                    <Textarea
                                        id="observaciones"
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        placeholder={
                                            diferencia !== 0
                                                ? "Explica el motivo de la diferencia..."
                                                : "Notas adicionales sobre el cierre..."
                                        }
                                        rows={3}
                                        className="dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    {errors.observaciones && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.observaciones}</p>
                                    )}
                                </div>
                                <div className='py-2'></div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-2 bg-white dark:bg-gray-800 flex-shrink-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={processing}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.monto_real}
                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Cerrando...
                                        </span>
                                    ) : (
                                        '🔒 Cerrar Caja'
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal de selección de salida (impresión/PDF) */}
            {outputModal.isOpen && outputModal.aperturaId && (
                <OutputSelectionModal
                    isOpen={outputModal.isOpen}
                    onClose={() => {
                        console.log('🔴 [OutputSelectionModal] Cerrando y recargando página');
                        setOutputModal({ isOpen: false });
                        // Pequeño delay para permitir que se complete la descarga antes de recargar
                        setTimeout(() => {
                            window.location.href = '/cajas';
                        }, 500);
                    }}
                    documentoId={outputModal.aperturaId}
                    tipoDocumento={'caja' as TipoDocumento}
                    printType="cierre"
                />
            )}
        </Fragment>
    );
}

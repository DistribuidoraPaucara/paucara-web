/**
 * Component: CajaEstadoCard
 *
 * Responsabilidades:
 * ✅ Renderizar estado actual de la caja del usuario
 * ✅ Mostrar información de apertura/cierre
 * ✅ Mostrar montos y movimientos
 * ✅ Proveer botones de acción (Abrir/Cerrar)
 * ✅ Mostrar estado del cierre (PENDIENTE/CONSOLIDADA/RECHAZADA)
 * ✅ Permitir corrección si está rechazado
 */

import type { AperturaCaja } from '@/domain/entities/cajas';
import { formatCurrency, formatTime } from '@/lib/cajas.utils';
import EstadoCierreBadge from '@/presentation/components/cajas/EstadoCierreBadge';
import { useState } from 'react';

interface Cierre {
    id: number;
    estado?: string;
    observaciones_rechazo?: string;
    requiere_reapertura?: boolean;
    diferencia: number;
    monto_esperado: number;
    monto_real: number;
}

interface DesgloseIngreso {
    codigo: string;
    nombre: string;
    total: number;
    cantidad: number;
}

interface DesgloseEgreso {
    codigo: string;
    nombre: string;
    total: number;
    cantidad: number;
}

interface VentaPorTipoPago {
    tipo: string;
    codigo: string;
    total: number;
    cantidad: number;
}

interface DesgloseMovimientos {
    entradas: {
        efectivo: number;
        transferencia: number;
        total: number;
    };
    salidas: {
        efectivo: number;
        transferencia: number;
        total: number;
    };
    totales: {
        efectivo: number;
        transferencia: number;
        general: number;
    };
}

interface Props {
    cajaAbiertaHoy: AperturaCaja | null;
    totalMovimientos: number;
    efectivoEsperado?: {
        apertura: number;
        ventas_efectivo: number;
        pagos_credito: number;
        gastos: number;
        pagos_sueldo?: number;
        anticipos?: number;
        anulaciones?: number;
        total_egresos?: number;
        total: number;
    }; // ✅ Efectivo real esperado
    datosActualizados?: any; // ✅ NUEVO: Datos frescos del servidor
    cargandoDatos?: boolean; // ✅ NUEVO: Indicador de carga
    ventasCreditoTotales?: number; // ✅ NUEVO: Sumatoria de ventas a crédito de esta caja
    desgloseIngresos?: DesgloseIngreso[]; // ✅ NUEVO (2026-06-20): Desglose dinámico de ingresos
    desgloseEgresos?: DesgloseEgreso[]; // ✅ NUEVO (2026-06-20): Desglose dinámico de egresos
    ventasPorTipoPago?: VentaPorTipoPago[]; // ✅ NUEVO: Resumen de ventas por tipo de pago
    desgloseMovimientos?: DesgloseMovimientos | null; // ✅ NUEVO (2026-07-24): Desglose de movimientos por tipo de pago
    onAbrirClick: () => void;
    onCerrarClick: () => void;
    onGastoClick?: () => void;
    onCorregirClick?: () => void;
    onConsolidarClick?: () => void; // ✅ NUEVO: Para consolidar cajas
    cierreDatos?: Cierre | null;
    esVistaAdmin?: boolean; // ✅ NUEVO
    cierresPendientes?: number; // ✅ NUEVO: Cantidad de cierres pendientes
    isConsolidating?: boolean; // ✅ NUEVO: Estado de consolidación
}

export function CajaEstadoCard({
    cajaAbiertaHoy,
    efectivoEsperado,
    datosActualizados,
    cargandoDatos = false,
    desgloseIngresos = [],
    desgloseEgresos = [],
    ventasPorTipoPago = [],
    desgloseMovimientos = null,
    onAbrirClick,
    onCerrarClick,
    onGastoClick,
    onCorregirClick,
    onConsolidarClick,
    cierreDatos,
    esVistaAdmin = false,
    cierresPendientes = 0,
    isConsolidating = false,
}: Props) {
    console.log('Renderizando CajaEstadoCard - cajaAbiertaHoy:', cajaAbiertaHoy);
    console.log('Efectivo esperado:', efectivoEsperado);

    // ✅ DEBUG COMPLETO: Ver TODO lo que llega en datosActualizados
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 DATOS ACTUALIZADOS COMPLETOS - ESTRUCTURA COMPLETA:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(datosActualizados);
    console.log('');
    console.log('📊 VALORES PRINCIPALES:');
    console.log({
        totalEfectivo: datosActualizados?.totalEfectivo,
        totalVentas: datosActualizados?.totalVentas,
        totalEgresos: datosActualizados?.totalEgresos,
        totalIngresos: datosActualizados?.totalIngresos,
    });
    console.log('');
    console.log('💵 DETALLE EFECTIVO:');
    console.log(datosActualizados?.detalleEfectivo);
    console.log('');
    console.log('📝 SUMATORIAS DESGLOSADAS:');
    console.log({
        sumatorialVentas: datosActualizados?.sumatorialVentas,
        sumatorialVentasEfectivo: datosActualizados?.sumatorialVentasEfectivo,
        sumatorialVentasCredito: datosActualizados?.sumatorialVentasCredito,
        sumatorialGastos: datosActualizados?.sumatorialGastos,
        sumatorialPagosSueldo: datosActualizados?.sumatorialPagosSueldo,
        sumatorialAnticipos: datosActualizados?.sumatorialAnticipos,
        sumatorialCompras: datosActualizados?.sumatorialCompras,
        sumatorialAnulaciones: datosActualizados?.sumatorialAnulaciones,
        sumatorialVueltos: datosActualizados?.sumatorialVueltos, // ✅ NUEVO (2026-05-03)
    });
    console.log('');
    console.log('💳 VENTAS POR TIPO PAGO:');
    console.log(datosActualizados?.ventasPorTipoPago);
    console.log('');
    console.log('💰 DETALLES DE PAGO DESGLOSADO (detalles_pago_venta):');
    console.log({
        detallesPagoDesglosado: datosActualizados?.detallesPagoDesglosado,
        totalDetallesPago: datosActualizados?.totalDetallesPago,
    });
    console.log('');
    console.log('🎯 CÁLCULO DE INGRESOS NETOS:');
    console.log({
        'Pagos desglosados': datosActualizados?.totalDetallesPago,
        'Pagos de Crédito': datosActualizados?.pagosCredito,
        Servicios: datosActualizados?.sumatorialServicio,
        'Menos Vueltos': -datosActualizados?.sumatorialVueltos,
        'Total Ingresos (mostrado)': datosActualizados?.totalIngresos,
    });
    console.log('');
    console.log('═══════════════════════════════════════════════════════');

    // ✅ NUEVO (2026-07-24): Estado para expandir/colapsar desglose de movimientos
    const [desgloseExpanded, setDesgloseExpanded] = useState(false);

    // ✅ NUEVO: Detectar si la caja es del día anterior o anterior
    const esDiaAnterior = () => {
        if (!cajaAbiertaHoy) return false;
        const fechaCaja = new Date(cajaAbiertaHoy.fecha);
        const hoy = new Date();
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);

        // Comparar solo las fechas (sin hora)
        const fechaCajaDate = new Date(fechaCaja.getFullYear(), fechaCaja.getMonth(), fechaCaja.getDate());
        const hoyDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const ayerDate = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate());

        return fechaCajaDate < hoyDate;
    };

    const isDiaAnterior = esDiaAnterior();

    // ✅ SIMPLIFICADO (2026-03-03): Confiar en los cálculos del backend
    // No hacer lógica duplicada - el servidor ya calculó todo esto
    const totalEgresos = datosActualizados?.totalEgresos || 0;
    const totalIngresos = datosActualizados?.totalIngresos || 0;

    if (!cajaAbiertaHoy) {
        return (
            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                <div className="p-2">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Mi Caja del Día</h3>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                            ⚠️ Sin abrir
                        </span>
                    </div>

                    <div className="py-8 text-center">
                        <div className="mx-auto h-12 w-12 text-4xl text-gray-400">💰</div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No tienes caja abierta hoy</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {isDiaAnterior
                                ? '💡 Tienes una caja abierta de días anteriores. Verifica el historial.'
                                : 'Debes abrir una caja para comenzar a trabajar.'}
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={onAbrirClick}
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
                            >
                                💰 Abrir Caja
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-6">
                        <div className="block">
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                Apertura: {formatCurrency(datosActualizados?.apertura || cajaAbiertaHoy?.monto_apertura || 0)}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Entradas (Ingresos)</label>
                                {datosActualizados ? (
                                    <>
                                        {/* ✅ REFACTORIZADO (2026-06-20): Mostrar dinámicamente todos los ingresos (ENTRADA) */}
                                        {desgloseIngresos && desgloseIngresos.length > 0 ? (
                                            <div className="space-y-1">
                                                {desgloseIngresos.map((ingreso: DesgloseIngreso, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-row items-center justify-between rounded bg-green-50 p-1 text-sm dark:bg-green-900/10"
                                                    >
                                                        <div>{ingreso.nombre}:</div>
                                                        <div>{formatCurrency(ingreso.total)}</div>
                                                    </div>
                                                ))}

                                                <p className="mt-1 border-t border-gray-300 pt-1 text-right text-lg font-semibold text-green-600 dark:text-green-400">
                                                    +{formatCurrency(datosActualizados.totalIngresos || 0)}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">Sin movimientos</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">Sin movimientos</p>
                                )}
                                {/* ✅ REFERENCIAL: Total de TODAS las ventas (incluye crédito) */}
                                {(datosActualizados?.totalVentas || datosActualizados?.ventasCreditoTotales) && (
                                    <div>
                                        {/* <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                                            📊 TOTAL DE VENTAS (Contado + Crédito)
                                        </label> */}
                                        {/* mostrar detalles del credito */}
                                        {(datosActualizados?.ventasCreditoTotales || 0) > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Crédito:</span>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {formatCurrency(datosActualizados.ventasCreditoTotales)}
                                                </span>
                                            </div>
                                        )}
                                        {/* mostrar si sumatoria es > 0*/}
                                        {(datosActualizados.totalDetallesPago || 0) + (datosActualizados.ventasCreditoTotales || 0) > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold dark:border-gray-700">
                                                    <span className="text-gray-900 dark:text-white">TOTAL VENTAS:</span>
                                                    <span className="text-purple-600 dark:text-purple-400">
                                                        {/* ✅ ACTUALIZADO (2026-05-03): Sumar totalDetallesPago (efectivo+transferencia) + ventasCreditoTotales */}
                                                        {formatCurrency(
                                                            (datosActualizados.totalDetallesPago || 0) +
                                                                (datosActualizados.ventasCreditoTotales || 0),
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* SALIDAS */}
                            <div className="mt-4 border-t border-gray-300 pt-4 md:mt-0 md:border-t-0 md:border-l md:pt-0 md:pl-4 dark:border-gray-700">
                                <div className="block items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salidas (Egresos Desglosado)</label>
                                    {cargandoDatos && <span className="text-xs text-blue-600 dark:text-blue-400">Actualizando...</span>}
                                </div>
                                {datosActualizados ? (
                                    <div className="mt-2 space-y-2">
                                        {/* ✅ REFACTORIZADO (2026-06-20): Mostrar dinámicamente todos los egresos (SALIDA) */}
                                        {desgloseEgresos && desgloseEgresos.length > 0 ? (
                                            <>
                                                {desgloseEgresos.map((egreso: DesgloseEgreso, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between rounded bg-red-50 p-2 text-sm dark:bg-red-900/10"
                                                    >
                                                        <span className="text-gray-700 dark:text-gray-300">• {egreso.nombre}</span>
                                                        <span className="font-semibold text-red-600 dark:text-red-400">
                                                            {formatCurrency(egreso.total)}
                                                        </span>
                                                    </div>
                                                ))}

                                                {/* ✅ Anulaciones - dato referencial */}
                                                {(datosActualizados?.sumatorialAnulaciones ?? 0) > 0 && (
                                                    <div className="flex items-center justify-between rounded bg-gray-50 p-2 text-sm dark:bg-gray-900/10">
                                                        <span className="text-gray-700 dark:text-gray-300">• Anulaciones (Referencial)</span>
                                                        <span className="font-semibold text-gray-600 dark:text-gray-400">
                                                            {formatCurrency(datosActualizados.sumatorialAnulaciones)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* ✅ Vueltos - dato informativo */}
                                                {(datosActualizados?.sumatorialVueltos ?? 0) > 0 && (
                                                    <div className="flex items-center justify-between rounded bg-gray-50 p-2 text-sm dark:bg-gray-900/10">
                                                        <span className="text-gray-700 dark:text-gray-300">• Vueltos / Cambio (Informativo)</span>
                                                        <span className="font-semibold text-gray-600 dark:text-gray-400">
                                                            {formatCurrency(datosActualizados.sumatorialVueltos)}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Total Egresos */}
                                                <div className="flex items-center justify-between rounded border border-red-200 bg-red-100 p-2 text-sm font-bold dark:border-red-700 dark:bg-red-900/20">
                                                    <span className="text-red-800 dark:text-red-200">Total Egresos</span>
                                                    <span className="text-red-700 dark:text-red-300">-{formatCurrency(totalEgresos)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Sin egresos</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">Sin egresos</p>
                                )}
                            </div>
                            {/* EFECTIVO ESPERADO */}
                            <div className="mt-4 border-t border-gray-300 pt-4 md:mt-0 md:border-t-0 md:border-l md:pt-0 md:pl-4 dark:border-gray-700">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">💰 Efectivo Esperado</label>
                                    <p className="text-center text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {/* ✅ Backend calcula: efectivoEsperado = apertura + ingresos - egresos */}
                                        {formatCurrency(datosActualizados?.efectivoEsperado || 0)}
                                    </p>
                                </div>
                                {/* Totales por tipo */}
                                {desgloseMovimientos && (
                                    <div className="mt-4">
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div className="rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Total Efectivo</p>
                                                <p className="font-bold text-green-700 dark:text-green-300">
                                                    {formatCurrency(desgloseMovimientos.totales.efectivo)}
                                                </p>
                                            </div>
                                            <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Total Transferencia</p>
                                                <p className="font-bold text-blue-700 dark:text-blue-300">
                                                    {formatCurrency(desgloseMovimientos.totales.transferencia)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Montos - EFECTIVO REAL */}
                        {/* ✅ NUEVO (2026-07-24): Desglose de movimientos por tipo de pago - COLAPSABLE */}
                        {desgloseMovimientos && (
                            <div>
                                {/* Encabezado expandible */}
                                <button onClick={() => setDesgloseExpanded(!desgloseExpanded)} className="flex w-full items-center justify-between">
                                    <p className="text-xs font-semibold tracking-widest text-purple-700 uppercase dark:text-purple-300">
                                        💳 Efectivo Real Esperado
                                    </p>
                                </button>

                                {/* Contenido expandible */}
                                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                    <div className="flex flex-col gap-3">
                                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Entradas:</div>
                                        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
                                            {/* Entradas Efectivo */}
                                            <div className="rounded-md bg-white p-1 text-left shadow-sm dark:bg-slate-800">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    💵Efectivo: {formatCurrency(desgloseMovimientos.entradas.efectivo)}
                                                </p>
                                            </div>

                                            {/* Entradas Transferencia */}
                                            <div className="rounded-md bg-white p-1 text-left shadow-sm dark:bg-slate-800">
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    🔄Transferencia: {formatCurrency(desgloseMovimientos.entradas.transferencia)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <p className="text-xs font-medium text-gray-700 dark:text-red-300">Salidas:</p>
                                        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
                                            {/* Salidas Efectivo */}
                                            <div className="rounded-md bg-white p-1 text-left shadow-sm dark:bg-slate-800">
                                                <p className="text-xs text-gray-600 dark:text-red-400">
                                                    💵 Efectivo: {formatCurrency(desgloseMovimientos.salidas.efectivo)}
                                                </p>
                                            </div>

                                            {/* Salidas Transferencia */}
                                            <div className="rounded-md bg-white p-1 text-left shadow-sm dark:bg-slate-800">
                                                <p className="text-xs text-gray-600 dark:text-red-400">
                                                    🔄 Transferencia {formatCurrency(desgloseMovimientos.salidas.transferencia)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Acciones - Usuario Normal */}
                    {!esVistaAdmin && (
                        <div className="mt-6 border-t border-gray-300 pt-6 lg:mt-0 lg:w-auto lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 dark:border-gray-700">
                            {/* Información de la Caja */}
                            <div className="space-y-2">
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Caja {isDiaAnterior ? 'del Día Anterior' : 'del Día'}
                                        </h3>
                                        <div>
                                            {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Caja</label> */}
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{cajaAbiertaHoy.caja.nombre}</p>
                                            {cajaAbiertaHoy.cierre ? (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    ❌ Cerrada
                                                </span>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isDiaAnterior ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}
                                                >
                                                    {isDiaAnterior ? '⏳ Abierta (Antigua)' : '✅ Abierta'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Abierta desde</label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {/* ✅ NUEVO: Mostrar fecha completa si es de otro día */}
                                        {new Date(cajaAbiertaHoy.fecha).toLocaleDateString('es-BO', {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric',
                                        })}{' '}
                                        a las {formatTime(cajaAbiertaHoy.fecha)}
                                    </p>
                                </div>
                            </div>
                            {!cajaAbiertaHoy.cierre ? (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    <button
                                        onClick={onCerrarClick}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
                                    >
                                        🔒 Cerrar Caja
                                    </button>
                                    {onGastoClick && (
                                        <button
                                            onClick={onGastoClick}
                                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
                                        >
                                            💱 Registrar Movimiento
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-700">
                                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                            Caja cerrada a las {formatTime(cajaAbiertaHoy.cierre.created_at)}
                                        </p>
                                        {cajaAbiertaHoy.cierre.diferencia !== 0 && (
                                            <p
                                                className={`text-sm font-medium ${
                                                    cajaAbiertaHoy.cierre.diferencia > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}
                                            >
                                                Diferencia: {formatCurrency(cajaAbiertaHoy.cierre.diferencia)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Estado del Cierre - NUEVO */}
                                    {cierreDatos && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                                                <EstadoCierreBadge estado={cierreDatos.estado as any} size="md" />
                                            </div>

                                            {cierreDatos.estado === 'RECHAZADA' && cierreDatos.observaciones_rechazo && (
                                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                                    <p className="mb-1 text-xs font-semibold text-red-800 dark:text-red-300">
                                                        ⚠️ Motivo del Rechazo:
                                                    </p>
                                                    <p className="text-sm text-red-700 dark:text-red-200">{cierreDatos.observaciones_rechazo}</p>
                                                    {cierreDatos.requiere_reapertura && (
                                                        <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">
                                                            ⚠️ Requiere reapertura de caja
                                                        </p>
                                                    )}
                                                    {onCorregirClick && (
                                                        <button
                                                            onClick={onCorregirClick}
                                                            className="mt-3 w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                                        >
                                                            🔧 Corregir Cierre
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {cierreDatos.estado === 'CONSOLIDADA' && (
                                                <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                                                    <p className="text-sm text-green-700 dark:text-green-200">
                                                        ✅ Tu cierre fue consolidado y aprobado
                                                    </p>
                                                </div>
                                            )}

                                            {cierreDatos.estado === 'PENDIENTE' && (
                                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                                                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                                        ⏳ Tu cierre está pendiente de verificación por el administrador
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

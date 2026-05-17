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
import { formatCurrency, formatTime, getMovimientoColor } from '@/lib/cajas.utils';
import EstadoCierreBadge from '@/presentation/components/cajas/EstadoCierreBadge';

interface Cierre {
    id: number;
    estado?: string;
    observaciones_rechazo?: string;
    requiere_reapertura?: boolean;
    diferencia: number;
    monto_esperado: number;
    monto_real: number;
}

interface Props {
    cajaAbiertaHoy: AperturaCaja | null;
    totalMovimientos: number;
    efectivoEsperado?: { apertura: number; ventas_efectivo: number; pagos_credito: number; gastos: number; pagos_sueldo?: number; anticipos?: number; anulaciones?: number; total_egresos?: number; total: number };  // ✅ Efectivo real esperado
    datosActualizados?: any; // ✅ NUEVO: Datos frescos del servidor
    cargandoDatos?: boolean; // ✅ NUEVO: Indicador de carga
    ventasCreditoTotales?: number; // ✅ NUEVO: Sumatoria de ventas a crédito de esta caja
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
    totalMovimientos,
    efectivoEsperado,
    datosActualizados,
    cargandoDatos = false,
    ventasCreditoTotales = 0,
    onAbrirClick,
    onCerrarClick,
    onGastoClick,
    onCorregirClick,
    onConsolidarClick,
    cierreDatos,
    esVistaAdmin = false,
    cierresPendientes = 0,
    isConsolidating = false
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
        sumatorialVueltos: datosActualizados?.sumatorialVueltos,  // ✅ NUEVO (2026-05-03)
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
        'Servicios': datosActualizados?.sumatorialServicio,
        'Menos Vueltos': -datosActualizados?.sumatorialVueltos,
        'Total Ingresos (mostrado)': datosActualizados?.totalIngresos,
    });
    console.log('');
    console.log('═══════════════════════════════════════════════════════');

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
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Mi Caja del Día
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            ⚠️ Sin abrir
                        </span>
                    </div>

                    <div className="text-center py-8">
                        <div className="mx-auto h-12 w-12 text-gray-400 text-4xl">💰</div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            No tienes caja abierta hoy
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {isDiaAnterior
                                ? '💡 Tienes una caja abierta de días anteriores. Verifica el historial.'
                                : 'Debes abrir una caja para comenzar a trabajar.'}
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={onAbrirClick}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
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
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Mi Caja {isDiaAnterior ? 'del Día Anterior' : 'del Día'}
                        </h3>
                        {isDiaAnterior && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                ⚠️ Esta caja fue abierta hace varios días
                            </p>
                        )}
                    </div>

                    {cajaAbiertaHoy.cierre ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            ❌ Cerrada
                        </span>
                    ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDiaAnterior ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                            {isDiaAnterior ? '⏳ Abierta (Antigua)' : '✅ Abierta'}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Información de la Caja */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Caja
                            </label>
                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {cajaAbiertaHoy.caja.nombre}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Abierta desde
                            </label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {/* ✅ NUEVO: Mostrar fecha completa si es de otro día */}
                                {new Date(cajaAbiertaHoy.fecha).toLocaleDateString('es-BO', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric'
                                })} a las {formatTime(cajaAbiertaHoy.fecha)}
                            </p>
                        </div>
                    </div>

                    {/* Montos - EFECTIVO REAL */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Apertura
                            </label>
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                {formatCurrency(datosActualizados?.apertura || cajaAbiertaHoy?.monto_apertura || 0)}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Entradas (Ingresos)
                            </label>
                            {datosActualizados ? (
                                <>
                                    {/* ✅ CORREGIDO (2026-05-03): Mostrar SOLO EFECTIVO y TRANSFERENCIA en desglose */}
                                    {datosActualizados.ventasPorTipoPago && datosActualizados.ventasPorTipoPago.length > 0 ? (
                                        <div className="space-y-1">
                                            {datosActualizados.ventasPorTipoPago
                                                .filter((tipoPago: any) =>
                                                    tipoPago.codigo === 'EFECTIVO' || tipoPago.codigo === 'TRANSFERENCIA/QR'
                                                )
                                                .map((tipoPago: any, idx: number) => (
                                                <p key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                                    {tipoPago.tipo}: {formatCurrency(tipoPago.total)}
                                                </p>
                                            ))}
                                            {/* ✅ MOSTRAR Pagos de Crédito - ES dinero real que entra cuando se cobra deuda anterior */}
                                            {(datosActualizados?.pagosCredito || 0) > 0 && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Pagos de Crédito: {formatCurrency(datosActualizados.pagosCredito)}
                                                </p>
                                            )}
                                            {(datosActualizados?.sumatorialServicio || 0) > 0 && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Servicios: {formatCurrency(datosActualizados.sumatorialServicio)}
                                                </p>
                                            )}
                                            <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1 border-t border-gray-300 pt-1">
                                                +{formatCurrency(datosActualizados.totalIngresos || 0)}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                                            Sin movimientos
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                                    Sin movimientos
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Salidas (Egresos Desglosado)
                                </label>
                                {cargandoDatos && (
                                    <span className="text-xs text-blue-600 dark:text-blue-400">Actualizando...</span>
                                )}
                            </div>
                            {datosActualizados ? (
                                <div className="mt-2 space-y-2">
                                    {/* Gastos */}
                                    {(datosActualizados?.sumatorialGastos ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm p-2 bg-red-50 dark:bg-red-900/10 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">• Gastos</span>
                                            <span className="font-semibold text-red-600 dark:text-red-400">
                                                {formatCurrency(datosActualizados.sumatorialGastos)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Pagos de Sueldo */}
                                    {(datosActualizados?.sumatorialPagosSueldo ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm p-2 bg-red-50 dark:bg-red-900/10 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">• Pagos de Sueldo</span>
                                            <span className="font-semibold text-red-600 dark:text-red-400">
                                                {formatCurrency(datosActualizados.sumatorialPagosSueldo)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Anticipos */}
                                    {(datosActualizados?.sumatorialAnticipos ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm p-2 bg-red-50 dark:bg-red-900/10 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">• Anticipos</span>
                                            <span className="font-semibold text-red-600 dark:text-red-400">
                                                {formatCurrency(datosActualizados.sumatorialAnticipos)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Compras */}
                                    {(datosActualizados?.sumatorialCompras ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm p-2 bg-orange-50 dark:bg-orange-900/10 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">• Compras a Proveedores</span>
                                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                                                {formatCurrency(datosActualizados.sumatorialCompras)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Anulaciones */}
                                    {(datosActualizados?.sumatorialAnulaciones ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-900/10 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">• Anulaciones</span>
                                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                                                {formatCurrency(datosActualizados.sumatorialAnulaciones)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Devoluciones */}
                                    {(datosActualizados?.sumatorialDevoluciones ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm p-2 bg-orange-50 dark:bg-orange-900/10 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">• Devoluciones</span>
                                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                                                {formatCurrency(datosActualizados.sumatorialDevoluciones)}
                                            </span>
                                        </div>
                                    )}

                                    {/* ✅ NUEVO (2026-05-05): Vueltos / Cambio - Solo Informativo */}
                                    {(datosActualizados?.sumatorialVueltos ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-900/10 rounded">
                                            <span className="text-gray-700 dark:text-gray-300">• Vueltos / Cambio</span>
                                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                                                {formatCurrency(datosActualizados.sumatorialVueltos)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Total Egresos */}
                                    <div className="flex justify-between items-center text-sm p-2 bg-red-100 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700 font-bold">
                                        <span className="text-red-800 dark:text-red-200">Total Egresos</span>
                                        <span className="text-red-700 dark:text-red-300">
                                            -{formatCurrency(totalEgresos)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                                    Sin egresos
                                </p>
                            )}
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                💰 Efectivo Esperado
                            </label>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {/* ✅ Backend calcula: efectivoEsperado = apertura + ingresos - egresos */}
                                {formatCurrency(datosActualizados?.efectivoEsperado || 0)}
                            </p>
                        </div>

                        {/* ✅ REFERENCIAL: Total de TODAS las ventas (incluye crédito) */}
                        {(datosActualizados?.totalVentas || datosActualizados?.ventasCreditoTotales) && (
                            <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    📊 TOTAL DE VENTAS (Contado + Crédito)
                                </label>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Ventas Contado (Efectivo + Transferencia/QR):</span>
                                        {/* ✅ ACTUALIZADO (2026-05-03): Mostrar SOLO totalDetallesPago (efectivo+transferencia), no totalVentas que incluye crédito */}
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(datosActualizados.totalDetallesPago || 0)}</span>
                                    </div>
                                    {(datosActualizados?.ventasCreditoTotales || 0) > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Ventas a Crédito:</span>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(datosActualizados.ventasCreditoTotales)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700 font-bold">
                                        <span className="text-gray-900 dark:text-white">TOTAL VENTAS:</span>
                                        <span className="text-purple-600 dark:text-purple-400">
                                            {/* ✅ ACTUALIZADO (2026-05-03): Sumar totalDetallesPago (efectivo+transferencia) + ventasCreditoTotales */}
                                            {formatCurrency((datosActualizados.totalDetallesPago || 0) + (datosActualizados.ventasCreditoTotales || 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Acciones - Usuario Normal */}
                    {!esVistaAdmin && (
                        <div className="flex flex-col justify-center space-y-3">
                            {!cajaAbiertaHoy.cierre ? (
                                <>
                                    <button
                                        onClick={onCerrarClick}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                                    >
                                        🔒 Cerrar Caja
                                    </button>
                                    {onGastoClick && (
                                        <button
                                            onClick={onGastoClick}
                                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                        >
                                            💱 Registrar Movimiento
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            Caja cerrada a las {formatTime(cajaAbiertaHoy.cierre.created_at)}
                                        </p>
                                        {cajaAbiertaHoy.cierre.diferencia !== 0 && (
                                            <p className={`text-sm font-medium ${cajaAbiertaHoy.cierre.diferencia > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                Diferencia: {formatCurrency(cajaAbiertaHoy.cierre.diferencia)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Estado del Cierre - NUEVO */}
                                    {cierreDatos && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Estado:
                                                </span>
                                                <EstadoCierreBadge
                                                    estado={cierreDatos.estado as any}
                                                    size="md"
                                                />
                                            </div>

                                            {cierreDatos.estado === 'RECHAZADA' && cierreDatos.observaciones_rechazo && (
                                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                                    <p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">
                                                        ⚠️ Motivo del Rechazo:
                                                    </p>
                                                    <p className="text-sm text-red-700 dark:text-red-200">
                                                        {cierreDatos.observaciones_rechazo}
                                                    </p>
                                                    {cierreDatos.requiere_reapertura && (
                                                        <p className="text-xs text-red-600 dark:text-red-300 mt-2 font-semibold">
                                                            ⚠️ Requiere reapertura de caja
                                                        </p>
                                                    )}
                                                    {onCorregirClick && (
                                                        <button
                                                            onClick={onCorregirClick}
                                                            className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                                                        >
                                                            🔧 Corregir Cierre
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {cierreDatos.estado === 'CONSOLIDADA' && (
                                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                                    <p className="text-sm text-green-700 dark:text-green-200">
                                                        ✅ Tu cierre fue consolidado y aprobado
                                                    </p>
                                                </div>
                                            )}

                                            {cierreDatos.estado === 'PENDIENTE' && (
                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
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

                    {/* Acciones - Admin */}
                    {esVistaAdmin && (
                        <div className="flex flex-col justify-center space-y-3">
                            {cajaAbiertaHoy.cierre && (
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Caja cerrada a las {formatTime(cajaAbiertaHoy.cierre.created_at)}
                                    </p>
                                    {cajaAbiertaHoy.cierre.diferencia !== 0 && (
                                        <p className={`text-sm font-medium ${cajaAbiertaHoy.cierre.diferencia > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            Diferencia: {formatCurrency(cajaAbiertaHoy.cierre.diferencia)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ✅ NUEVO: Botón de consolidación si hay pendientes */}
                            {cierresPendientes > 0 && onConsolidarClick && (
                                <button
                                    onClick={onConsolidarClick}
                                    disabled={isConsolidating}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                                >
                                    {isConsolidating ? '⏳ Consolidando...' : `✅ Consolidar cajas (${cierresPendientes})`}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

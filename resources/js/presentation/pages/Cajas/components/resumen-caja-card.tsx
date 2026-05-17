/**
 * ResumenCajaCard Component - Tabla Format
 *
 * Responsabilidades:
 * ✅ Mostrar resumen de datos de cierre de caja en tabla
 * ✅ Mostrar ventas por tipo de pago
 * ✅ Mostrar ingresos, egresos y efectivo esperado
 * ✅ Manejo de estados de carga
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface VentaPorTipoPago {
    tipo: string;
    total: number;
    cantidad: number;
}

interface DatosResumen {
    apertura: number;
    totalVentas: number;
    ventasAnuladas: number;
    pagosCredito: number;
    totalSalidas: number;
    totalIngresos: number;
    totalEgresos: number;
    efectivoEsperado: number;
    ventasPorTipoPago: VentaPorTipoPago[];
    sumatorialGastos?: number;  // ✅ NUEVO: Desglose de gastos
    sumatorialPagosSueldo?: number;  // ✅ NUEVO: Desglose de sueldos
    sumatorialAnticipos?: number;  // ✅ NUEVO: Desglose de anticipos
    sumatorialCompras?: number;  // ✅ NUEVO: Desglose de compras
    sumatorialAnulaciones?: number;  // ✅ NUEVO: Desglose de anulaciones
    totalDetallesPago?: number;  // ✅ NUEVO: Dinero real de ventas (desde detalles_pago_venta)
}

interface ResumenCajaCardProps {
    datosResumen: DatosResumen | null;
    cargando?: boolean;
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export function ResumenCajaCard({ datosResumen, cargando = false }: ResumenCajaCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (cargando) {
        return (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">📊 Resumen de Cajass</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando datos...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!datosResumen) {
        return (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">📊 Resumen de Cajasss</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No hay datos disponibles
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-gray-900 dark:text-white">📊 Resumen de Caja</CardTitle>
                        <CardDescription>
                            Detalles financieros de la apertura actual
                        </CardDescription>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent>
                    <div className="space-y-6">
                        {/* Tabla simple de resumen */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-300 dark:border-gray-600">
                                        <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Concepto</th>
                                        <th className="text-right py-2 px-4 font-semibold text-gray-900 dark:text-white">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-1">
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Apertura</td>
                                        <td className="text-right py-2 px-4 font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(datosResumen.apertura)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Dinero Pagado (Ventas)</td>
                                        <td className="text-right py-2 px-4 font-semibold text-green-600 dark:text-green-400">{formatCurrency(datosResumen.totalDetallesPago ?? 0)}</td>
                                    </tr>
                                    {datosResumen.ventasAnuladas > 0 && (
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Ventas Anuladas</td>
                                            <td className="text-right py-2 px-4 font-semibold text-red-600 dark:text-red-400">{formatCurrency(datosResumen.ventasAnuladas)}</td>
                                        </tr>
                                    )}
                                    {datosResumen.pagosCredito > 0 && (
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Pagos Crédito</td>
                                            <td className="text-right py-2 px-4 font-semibold text-green-600 dark:text-green-400">{formatCurrency(datosResumen.pagosCredito)}</td>
                                        </tr>
                                    )}
                                    <tr className="border-t-2 border-b border-gray-300 dark:border-gray-600 font-bold bg-green-50 dark:bg-green-900/20">
                                        <td className="py-2 px-4 text-gray-900 dark:text-white">Total Ingresos</td>
                                        <td className="text-right py-2 px-4 text-green-700 dark:text-green-300">{formatCurrency(datosResumen.totalIngresos)}</td>
                                    </tr>

                                    {datosResumen.sumatorialGastos > 0 && (
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Gastos</td>
                                            <td className="text-right py-2 px-4 font-semibold text-red-600 dark:text-red-400">{formatCurrency(datosResumen.sumatorialGastos)}</td>
                                        </tr>
                                    )}
                                    {datosResumen.sumatorialPagosSueldo > 0 && (
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Sueldos</td>
                                            <td className="text-right py-2 px-4 font-semibold text-red-600 dark:text-red-400">{formatCurrency(datosResumen.sumatorialPagosSueldo)}</td>
                                        </tr>
                                    )}
                                    {datosResumen.sumatorialAnticipos > 0 && (
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Anticipos</td>
                                            <td className="text-right py-2 px-4 font-semibold text-red-600 dark:text-red-400">{formatCurrency(datosResumen.sumatorialAnticipos)}</td>
                                        </tr>
                                    )}
                                    {datosResumen.sumatorialCompras > 0 && (
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Compras</td>
                                            <td className="text-right py-2 px-4 font-semibold text-red-600 dark:text-red-400">{formatCurrency(datosResumen.sumatorialCompras)}</td>
                                        </tr>
                                    )}
                                    {datosResumen.sumatorialAnulaciones > 0 && (
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Anulaciones</td>
                                            <td className="text-right py-2 px-4 font-semibold text-red-600 dark:text-red-400">{formatCurrency(datosResumen.sumatorialAnulaciones)}</td>
                                        </tr>
                                    )}
                                    <tr className="border-t-2 border-b border-gray-300 dark:border-gray-600 font-bold bg-red-50 dark:bg-red-900/20">
                                        <td className="py-2 px-4 text-gray-900 dark:text-white">Total Egresos</td>
                                        <td className="text-right py-2 px-4 text-red-700 dark:text-red-300">{formatCurrency(datosResumen.totalEgresos)}</td>
                                    </tr>

                                    <tr className="border-t-2 border-gray-400 dark:border-gray-500 font-bold text-base bg-blue-50 dark:bg-blue-900/20">
                                        <td className="py-3 px-4 text-blue-900 dark:text-blue-100">Efectivo Esperado</td>
                                        <td className="text-right py-3 px-4 text-blue-900 dark:text-blue-100">{formatCurrency(datosResumen.efectivoEsperado)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Desglose de Ventas por Tipo */}
                        {datosResumen.ventasPorTipoPago.length > 0 && (
                            <div>
                                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Ventas por Tipo de Pago</h5>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-300 dark:border-gray-600">
                                                <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Tipo</th>
                                                <th className="text-center py-2 px-4 font-semibold text-gray-900 dark:text-white">Cant.</th>
                                                <th className="text-right py-2 px-4 font-semibold text-gray-900 dark:text-white">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datosResumen.ventasPorTipoPago.map((venta, index) => (
                                                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                                    <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{venta.tipo}</td>
                                                    <td className="text-center py-2 px-4 text-gray-600 dark:text-gray-400">{venta.cantidad}</td>
                                                    <td className="text-right py-2 px-4 font-semibold text-green-600 dark:text-green-400">{formatCurrency(venta.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

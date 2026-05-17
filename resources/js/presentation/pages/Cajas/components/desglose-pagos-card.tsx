/**
 * DesglosePageosCard Component
 *
 * Responsabilidades:
 * ✅ Mostrar desglose de pagos por tipo desde detalles_pago_venta
 * ✅ Mostrar cantidad y monto total por tipo de pago
 * ✅ Mostrar sumatoria total de pagos desglosados
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Loader2 } from 'lucide-react';

interface DetallePagoDesglosado {
    tipo_pago_id: number;
    tipo: string;
    codigo: string;
    total: number;
    cantidad: number;
}

interface DesglosePageosCardProps {
    detallesPagoDesglosado: DetallePagoDesglosado[] | null;
    totalDetallesPago: number;
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

export function DesglosePageosCard({
    detallesPagoDesglosado,
    totalDetallesPago = 0,
    cargando = false
}: DesglosePageosCardProps) {

    if (cargando) {
        return (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">💳 Desglose de Pagos por Tipo</CardTitle>
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

    if (!detallesPagoDesglosado || detallesPagoDesglosado.length === 0) {
        return (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">💳 Desglose de Pagos por Tipo</CardTitle>
                    <CardDescription>
                        Sumatoria de pagos registrados en detalles_pago_venta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No hay pagos desglosados registrados
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">💳 Desglose de Pagos por Tipo</CardTitle>
                <CardDescription>
                    Sumatoria de pagos registrados en detalles_pago_venta
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Tabla de desglose */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                        Tipo de Pago
                                    </th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                        Cantidad
                                    </th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                                        Monto Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {detallesPagoDesglosado.map((detalle, index) => (
                                    <tr
                                        key={`${detalle.tipo_pago_id}-${index}`}
                                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                    >
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {detalle.tipo}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({detalle.codigo})
                                                </p>
                                            </div>
                                        </td>
                                        <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-300">
                                            {detalle.cantidad}
                                        </td>
                                        <td className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(detalle.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Sumatoria Total */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                            <span className="font-semibold text-gray-900 dark:text-white text-lg">
                                Total Pagos Desglosados:
                            </span>
                            <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl">
                                {formatCurrency(totalDetallesPago)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Componente: TablaComparativo
 *
 * Responsabilidades:
 * - Renderizar tabla comparativa por período
 * - Mostrar variaciones entre períodos
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { ResumenComprasPorPeriodo } from '@/domain/entities/compras-reportes';
import { formatCurrency, formatPercentage, getVariacionIcon, getVariacionColor, getVariacionClasses } from '@/lib/compras.utils';

interface TablaComparativoProps {
    periodos: ResumenComprasPorPeriodo[];
}

/**
 * Componente que renderiza tabla comparativa por período
 */
export const TablaComparativo: React.FC<TablaComparativoProps> = ({ periodos }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Análisis Comparativo por Período
                </CardTitle>
                <CardDescription>
                    Comparación de rendimiento entre diferentes períodos
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Período
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total Compras
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Promedio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Variación
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {(periodos || []).length > 0 ? (
                                periodos.map((periodo, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {periodo.periodo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {formatCurrency(periodo.total_compras)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {periodo.cantidad_compras}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatCurrency(periodo.promedio_compra)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={getVariacionClasses(periodo.variacion_anterior)}>
                                                {getVariacionIcon(periodo.variacion_anterior)}
                                                <span className="ml-1 text-sm font-medium">
                                                    {formatPercentage(periodo.variacion_anterior)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No hay datos comparativos disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

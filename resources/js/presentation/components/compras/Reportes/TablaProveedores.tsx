/**
 * Componente: TablaProveedores
 *
 * Responsabilidades:
 * - Renderizar tabla de compras por proveedor
 * - Mostrar ranking de proveedores
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Users } from 'lucide-react';
import type { ComprasPorProveedor } from '@/domain/entities/compras-reportes';
import { formatCurrency, formatDate } from '@/lib/compras.utils';

interface TablaProveedoresProps {
    compras: ComprasPorProveedor[];
}

/**
 * Componente que renderiza tabla de compras por proveedor
 */
export const TablaProveedores: React.FC<TablaProveedoresProps> = ({ compras }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Análisis por Proveedores
                </CardTitle>
                <CardDescription>
                    Ranking de proveedores por volumen de compras
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Proveedor
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
                                    % Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Última Compra
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {(compras || []).length > 0 ? (
                                compras.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.proveedor.nombre}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {item.proveedor.nit}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(item.total_compras)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {item.cantidad_compras}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatCurrency(item.promedio_compra)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="outline">
                                                {item.porcentaje_total.toFixed(1)}%
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(item.ultima_compra)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No hay datos de proveedores disponibles
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

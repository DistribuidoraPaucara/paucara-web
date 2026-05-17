/**
 * Componente: SeccionCategorias
 *
 * Responsabilidades:
 * - Renderizar análisis de compras por categorías
 * - Mostrar barras de progreso para visualizar distribución
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { PieChart } from 'lucide-react';
import type { ComprasPorCategoria } from '@/domain/entities/compras-reportes';
import { formatCurrency } from '@/lib/compras.utils';

interface SeccionCategoriasProps {
    categorias: ComprasPorCategoria[];
}

/**
 * Componente que renderiza análisis de compras por categorías
 */
export const SeccionCategorias: React.FC<SeccionCategoriasProps> = ({ categorias }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Análisis por Categorías
                </CardTitle>
                <CardDescription>
                    Distribución de compras por tipo de producto
                </CardDescription>
            </CardHeader>
            <CardContent>
                {(categorias || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categorias.map((categoria, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-lg">{categoria.categoria}</h4>
                                    <Badge variant="secondary">
                                        {categoria.porcentaje_total.toFixed(1)}%
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                        <span className="font-medium">
                                            {formatCurrency(categoria.total_compras)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Cantidad:</span>
                                        <span className="font-medium">{categoria.cantidad_compras}</span>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min(categoria.porcentaje_total, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No hay datos de categorías disponibles
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

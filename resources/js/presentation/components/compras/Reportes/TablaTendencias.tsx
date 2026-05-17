/**
 * Componente: TablaTendencias
 *
 * Responsabilidades:
 * - Renderizar tabla de tendencias mensuales
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { LineChart } from 'lucide-react';
import type { TendenciasCompras } from '@/domain/entities/compras-reportes';
import { formatCurrency } from '@/lib/compras.utils';

interface TablaTendenciasProps {
    tendencias: TendenciasCompras[];
}

/**
 * Componente que renderiza tabla de tendencias mensuales
 */
export const TablaTendencias: React.FC<TablaTendenciasProps> = ({ tendencias }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2" />
                    Tendencias Mensuales
                </CardTitle>
                <CardDescription>
                    Evolución de las compras a lo largo del tiempo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {(tendencias || []).length > 0 ? (
                        tendencias.map((tendencia, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex-1">
                                    <h4 className="font-medium">{tendencia.mes}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {tendencia.cantidad} compras
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg">
                                        {formatCurrency(tendencia.total)}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Promedio: {formatCurrency(tendencia.promedio)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No hay datos de tendencias disponibles
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

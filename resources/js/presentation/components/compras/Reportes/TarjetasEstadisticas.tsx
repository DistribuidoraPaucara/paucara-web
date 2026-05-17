/**
 * Componente: TarjetasEstadisticas
 *
 * Responsabilidades:
 * - Renderizar tarjetas con métricas principales
 * - Mostrar variaciones y tendencias
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { DollarSign, Package, Users, Calendar } from 'lucide-react';
import type { EstadisticasGenerales } from '@/domain/entities/compras-reportes';
import { formatCurrency, formatPercentage, getVariacionIcon, getVariacionColor } from '@/lib/compras.utils';

interface TarjetasEstadisticasProps {
    estadisticas?: EstadisticasGenerales | null;
}

/**
 * Componente que renderiza las tarjetas de estadísticas generales
 *
 * Muestra:
 * - Total de compras del período
 * - Cantidad de compras
 * - Proveedor principal
 * - Mejor mes del período
 */
export const TarjetasEstadisticas: React.FC<TarjetasEstadisticasProps> = ({ estadisticas }) => {
    // ✅ Valores por defecto si no hay datos
    const datosSeguro = estadisticas || {
        total_compras_periodo: 0,
        cantidad_compras_periodo: 0,
        promedio_compra_periodo: 0,
        variacion_mes_anterior: 0,
        proveedor_principal: { id: 0, nombre: 'N/A' } as any,
        categoria_principal: 'N/A',
        mes_mayor_compra: 'N/A',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Compras */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(datosSeguro.total_compras_periodo)}
                    </div>
                    <div className={`flex items-center text-xs ${getVariacionColor(datosSeguro.variacion_mes_anterior)}`}>
                        {getVariacionIcon(datosSeguro.variacion_mes_anterior)}
                        <span className="ml-1">
                            {formatPercentage(datosSeguro.variacion_mes_anterior)} vs mes anterior
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Cantidad Compras */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cantidad Compras</CardTitle>
                    <Package className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {datosSeguro.cantidad_compras_periodo}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Promedio: {formatCurrency(datosSeguro.promedio_compra_periodo)}
                    </p>
                </CardContent>
            </Card>

            {/* Proveedor Principal */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proveedor Principal</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-bold">
                        {datosSeguro.proveedor_principal?.nombre || 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Mayor volumen de compras
                    </p>
                </CardContent>
            </Card>

            {/* Mejor Mes */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mejor Mes</CardTitle>
                    <Calendar className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-bold">
                        {datosSeguro.mes_mayor_compra || 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Mes con mayores compras
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

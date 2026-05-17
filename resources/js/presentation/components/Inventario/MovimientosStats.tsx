import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { TrendingUp, TrendingDown, ArrowUpDown, Package } from 'lucide-react';

interface MovimientosStatsData {
    total_movimientos: number;
    total_entradas: number;
    total_salidas: number;
    total_transferencias: number;
    valor_total_entradas?: number;
    valor_total_salidas?: number;
}

interface MovimientosStatsProps {
    stats: MovimientosStatsData;
    isLoading?: boolean;
}

const MovimientosStats: React.FC<MovimientosStatsProps> = ({
    stats,
    isLoading = false
}) => {
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Movimientos',
            value: stats.total_movimientos,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Entradas',
            value: stats.total_entradas,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Salidas',
            value: stats.total_salidas,
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
        {
            title: 'Transferencias',
            value: stats.total_transferencias,
            icon: ArrowUpDown,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-md ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value.toLocaleString()}
                            </div>
                            {stat.title === 'Entradas' && stats.valor_total_entradas && (
                                <p className="text-xs text-muted-foreground">
                                    Valor: ${stats.valor_total_entradas.toLocaleString()}
                                </p>
                            )}
                            {stat.title === 'Salidas' && stats.valor_total_salidas && (
                                <p className="text-xs text-muted-foreground">
                                    Valor: ${stats.valor_total_salidas.toLocaleString()}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default MovimientosStats;

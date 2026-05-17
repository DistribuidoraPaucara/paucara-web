// Presentation Layer: DashboardMetricas Component
// Dashboard avanzado de métricas y analíticas para movimientos de inventario

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Package,
    MapPin,
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    Calendar
} from 'lucide-react';
import type { EstadisticasMovimientos } from '@/domain/entities/movimientos-inventario';
import { CONFIGURACION_MOVIMIENTOS } from '@/presentation/config/inventory.config';

interface DashboardMetricasProps {
    estadisticas: EstadisticasMovimientos;
    periodo?: string;
    comparacion?: EstadisticasMovimientos; // Para comparar con período anterior
}

interface MetricaKPI {
    titulo: string;
    valor: number;
    formato: 'numero' | 'moneda' | 'porcentaje';
    tendencia?: 'up' | 'down' | 'neutral';
    cambio?: number;
    descripcion?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

// Componente Progress simple
const Progress: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 ${className}`}>
        <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
    </div>
);

export const DashboardMetricas: React.FC<DashboardMetricasProps> = ({
    estadisticas,
    periodo = 'Mes actual',
    comparacion
}) => {
    // Validación defensiva para evitar errores cuando estadisticas es undefined
    if (!estadisticas) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center text-gray-500">
                            Cargando estadísticas...
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatearValor = (valor: number, formato: 'numero' | 'moneda' | 'porcentaje') => {
        switch (formato) {
            case 'numero':
                return valor.toLocaleString('es-ES');
            case 'moneda':
                return `Bs. ${valor.toFixed(2)}`;
            case 'porcentaje':
                return `${valor.toFixed(1)}%`;
            default:
                return valor.toString();
        }
    };

    const calcularTendencia = (actual: number, anterior?: number): { tendencia: 'up' | 'down' | 'neutral', cambio: number } => {
        if (!anterior || anterior === 0) return { tendencia: 'neutral', cambio: 0 };

        const cambio = ((actual - anterior) / anterior) * 100;
        return {
            tendencia: cambio > 0 ? 'up' : cambio < 0 ? 'down' : 'neutral',
            cambio: Math.abs(cambio)
        };
    };

    // KPIs principales con valores por defecto
    const kpis: MetricaKPI[] = [
        {
            titulo: 'Total Movimientos',
            valor: estadisticas.total_movimientos || 0,
            formato: 'numero',
            ...calcularTendencia(estadisticas.total_movimientos || 0, comparacion?.total_movimientos),
            descripcion: 'Todos los movimientos del período',
            icon: Activity,
            color: 'text-blue-600'
        },
        {
            titulo: 'Valor Total Entradas',
            valor: estadisticas.valor_total_entradas || 0,
            formato: 'moneda',
            ...calcularTendencia(estadisticas.valor_total_entradas || 0, comparacion?.valor_total_entradas),
            descripcion: 'Valor monetario de las entradas',
            icon: TrendingUp,
            color: 'text-green-600'
        },
        {
            titulo: 'Valor Total Salidas',
            valor: estadisticas.valor_total_salidas || 0,
            formato: 'moneda',
            ...calcularTendencia(estadisticas.valor_total_salidas || 0, comparacion?.valor_total_salidas),
            descripcion: 'Valor monetario de las salidas',
            icon: TrendingDown,
            color: 'text-red-600'
        },
        {
            titulo: 'Movimientos Pendientes',
            valor: estadisticas.movimientos_pendientes || 0,
            formato: 'numero',
            ...calcularTendencia(estadisticas.movimientos_pendientes || 0, comparacion?.movimientos_pendientes),
            descripcion: 'Requieren atención inmediata',
            icon: AlertTriangle,
            color: 'text-orange-600'
        }
    ];

    // Métricas por tipo de movimiento con valores por defecto
    const tiposMovimiento = [
        { tipo: 'ENTRADA', valor: estadisticas.total_entradas || 0, color: 'bg-green-100 text-green-800' },
        { tipo: 'SALIDA', valor: estadisticas.total_salidas || 0, color: 'bg-red-100 text-red-800' },
        { tipo: 'TRANSFERENCIA', valor: estadisticas.total_transferencias || 0, color: 'bg-purple-100 text-purple-800' },
        { tipo: 'MERMA', valor: estadisticas.total_mermas || 0, color: 'bg-orange-100 text-orange-800' },
        { tipo: 'AJUSTE', valor: estadisticas.total_ajustes || 0, color: 'bg-blue-100 text-blue-800' }
    ];

    const totalMovimientosTipo = tiposMovimiento.reduce((sum, tipo) => sum + tipo.valor, 0);

    const IconoTendencia = ({ tendencia }: { tendencia: 'up' | 'down' | 'neutral' }) => {
        if (tendencia === 'neutral') return <ArrowRight className="h-4 w-4 text-gray-400" />;
        if (tendencia === 'up') return <ArrowUpRight className="h-4 w-4 text-green-500" />;
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    };

    return (
        <div className="space-y-6">
            {/* Header con período */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Dashboard de Métricas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {periodo} • Actualizado en tiempo real
                    </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {periodo}
                </Badge>
            </div>

            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {kpi.titulo}
                            </CardTitle>
                            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatearValor(kpi.valor, kpi.formato)}
                            </div>

                            {comparacion && (
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <IconoTendencia tendencia={kpi.tendencia!} />
                                    <span className="ml-1">
                                        {kpi.cambio!.toFixed(1)}% vs período anterior
                                    </span>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground mt-1">
                                {kpi.descripcion}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Métricas de Operación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distribución por Tipo de Movimiento */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Distribución por Tipo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tiposMovimiento.map((tipo) => {
                            const config = CONFIGURACION_MOVIMIENTOS[tipo.tipo as keyof typeof CONFIGURACION_MOVIMIENTOS];
                            const porcentaje = totalMovimientosTipo > 0 ? (tipo.valor / totalMovimientosTipo) * 100 : 0;

                            return (
                                <div key={tipo.tipo} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${config.bgColor}`}></div>
                                            <span className="text-sm font-medium">{config.label}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold">{tipo.valor}</span>
                                            <span className="text-xs text-muted-foreground ml-2">
                                                ({porcentaje.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        value={porcentaje}
                                        className="h-2"
                                    />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Métricas de Alcance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Alcance de Operaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">Productos Afectados</span>
                                </div>
                                <span className="text-lg font-bold text-blue-600">
                                    {estadisticas.productos_afectados}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium">Almacenes Activos</span>
                                </div>
                                <span className="text-lg font-bold text-purple-600">
                                    {estadisticas.almacenes_activos}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">Valor Total Mermas</span>
                                </div>
                                <span className="text-lg font-bold text-orange-600">
                                    Bs. {estadisticas.valor_total_mermas.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tendencia Semanal */}
            {estadisticas.tendencia_semanal && estadisticas.tendencia_semanal.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Tendencia Semanal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {estadisticas.tendencia_semanal.map((semana, index) => {
                                const totalSemana = semana.entradas + semana.salidas + semana.transferencias + semana.mermas;
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                Semana {new Date(semana.fecha).toLocaleDateString('es-ES')}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {totalSemana} movimientos
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="text-center">
                                                <div className="text-xs text-green-600">Entradas</div>
                                                <div className="text-sm font-bold">{semana.entradas}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-red-600">Salidas</div>
                                                <div className="text-sm font-bold">{semana.salidas}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-purple-600">Transferencias</div>
                                                <div className="text-sm font-bold">{semana.transferencias}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-orange-600">Mermas</div>
                                                <div className="text-sm font-bold">{semana.mermas}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Alertas y Estado */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Estado del Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            {estadisticas.movimientos_pendientes > 0 ? (
                                <>
                                    <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                                    <div className="text-lg font-bold text-orange-600">
                                        {estadisticas.movimientos_pendientes}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Pendientes</div>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                    <div className="text-lg font-bold text-green-600">Al día</div>
                                    <div className="text-sm text-muted-foreground">Sin pendientes</div>
                                </>
                            )}
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                            <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                            <div className="text-lg font-bold">
                                {((estadisticas.total_entradas / Math.max(estadisticas.total_movimientos, 1)) * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Entradas vs Total</div>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                            <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                            <div className="text-lg font-bold">
                                {((estadisticas.total_mermas / Math.max(estadisticas.total_movimientos, 1)) * 100).toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Tasa de Mermas</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardMetricas;

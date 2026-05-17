// Presentation Layer: GraficosTendencias Component
// Componente para mostrar gráficos de tendencias y analíticas visuales

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import {
    TrendingUp,
    BarChart3,
    LineChart,
    Calendar,
    Download
} from 'lucide-react';
import type { EstadisticasMovimientos } from '@/domain/entities/movimientos-inventario';

interface GraficosTendenciasProps {
    estadisticas: EstadisticasMovimientos;
    periodo?: 'diario' | 'semanal' | 'mensual';
    onPeriodoChange?: (periodo: 'diario' | 'semanal' | 'mensual') => void;
}

// Componente simple de gráfico de barras
const GraficoBarras: React.FC<{
    datos: Array<{ label: string; valor: number; color: string }>;
    titulo?: string;
}> = ({ datos, titulo }) => {
    const maxValor = Math.max(...datos.map(d => d.valor));

    return (
        <div className="space-y-4">
            {titulo && <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{titulo}</h4>}
            <div className="space-y-3">
                {datos.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="text-sm text-muted-foreground">{item.valor}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${item.color}`}
                                style={{ width: `${maxValor > 0 ? (item.valor / maxValor) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente de línea de tiempo simple
const LineaTiempo: React.FC<{
    datos: Array<{ fecha: string; entradas: number; salidas: number; transferencias: number; mermas: number }>;
}> = ({ datos }) => {
    if (!datos || datos.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No hay datos de tendencia disponibles
            </div>
        );
    }

    const maxValor = Math.max(...datos.flatMap(d => [d.entradas, d.salidas, d.transferencias, d.mermas]));

    return (
        <div className="space-y-4">
            {datos.map((item, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                            {new Date(item.fecha).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Total: {item.entradas + item.salidas + item.transferencias + item.mermas}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 h-6">
                        <div
                            className="bg-green-500 rounded-sm relative group"
                            style={{ height: `${maxValor > 0 ? (item.entradas / maxValor) * 100 : 0}%` }}
                            title={`Entradas: ${item.entradas}`}
                        />
                        <div
                            className="bg-red-500 rounded-sm relative group"
                            style={{ height: `${maxValor > 0 ? (item.salidas / maxValor) * 100 : 0}%` }}
                            title={`Salidas: ${item.salidas}`}
                        />
                        <div
                            className="bg-purple-500 rounded-sm relative group"
                            style={{ height: `${maxValor > 0 ? (item.transferencias / maxValor) * 100 : 0}%` }}
                            title={`Transferencias: ${item.transferencias}`}
                        />
                        <div
                            className="bg-orange-500 rounded-sm relative group"
                            style={{ height: `${maxValor > 0 ? (item.mermas / maxValor) * 100 : 0}%` }}
                            title={`Mermas: ${item.mermas}`}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-xs text-center text-muted-foreground">
                        <span>{item.entradas}</span>
                        <span>{item.salidas}</span>
                        <span>{item.transferencias}</span>
                        <span>{item.mermas}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const GraficosTendencias: React.FC<GraficosTendenciasProps> = ({
    estadisticas,
    periodo = 'semanal',
    onPeriodoChange
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
    // Preparar datos para gráfico de tipos de movimiento con valores por defecto
    const datosTipos = [
        {
            label: 'Entradas',
            valor: estadisticas.total_entradas || 0,
            color: 'bg-green-500'
        },
        {
            label: 'Salidas',
            valor: estadisticas.total_salidas || 0,
            color: 'bg-red-500'
        },
        {
            label: 'Transferencias',
            valor: estadisticas.total_transferencias || 0,
            color: 'bg-purple-500'
        },
        {
            label: 'Mermas',
            valor: estadisticas.total_mermas || 0,
            color: 'bg-orange-500'
        },
        {
            label: 'Ajustes',
            valor: estadisticas.total_ajustes || 0,
            color: 'bg-blue-500'
        }
    ].filter(item => item.valor > 0);

    // Preparar datos para gráfico de valores con valores por defecto
    const datosValores = [
        {
            label: 'Valor Entradas',
            valor: estadisticas.valor_total_entradas || 0,
            color: 'bg-green-500'
        },
        {
            label: 'Valor Salidas',
            valor: estadisticas.valor_total_salidas || 0,
            color: 'bg-red-500'
        },
        {
            label: 'Valor Mermas',
            valor: estadisticas.valor_total_mermas || 0,
            color: 'bg-orange-500'
        }
    ].filter(item => item.valor > 0);

    // Calcular ratios y métricas derivadas con valores por defecto
    const totalMovimientos = estadisticas.total_movimientos || 0;
    const ratioEntradas = totalMovimientos > 0 ? ((estadisticas.total_entradas || 0) / totalMovimientos) * 100 : 0;
    const ratioSalidas = totalMovimientos > 0 ? ((estadisticas.total_salidas || 0) / totalMovimientos) * 100 : 0;
    const ratioMermas = totalMovimientos > 0 ? ((estadisticas.total_mermas || 0) / totalMovimientos) * 100 : 0;

    const datosRatios = [
        {
            label: 'Entradas (%)',
            valor: ratioEntradas,
            color: 'bg-green-500'
        },
        {
            label: 'Salidas (%)',
            valor: ratioSalidas,
            color: 'bg-red-500'
        },
        {
            label: 'Mermas (%)',
            valor: ratioMermas,
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header con controles */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Análisis de Tendencias
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Visualización avanzada de movimientos de inventario
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {onPeriodoChange && (
                        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                            {(['diario', 'semanal', 'mensual'] as const).map((p) => (
                                <Button
                                    key={p}
                                    variant={periodo === p ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => onPeriodoChange(p)}
                                    className="text-xs"
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </Button>
                            ))}
                        </div>
                    )}

                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Grid de gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribución de Movimientos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Distribución de Movimientos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GraficoBarras
                            datos={datosTipos}
                            titulo="Cantidad por tipo"
                        />
                    </CardContent>
                </Card>

                {/* Distribución de Valores */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Valores Monetarios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GraficoBarras
                            datos={datosValores.map(item => ({
                                ...item,
                                label: item.label.replace('Valor ', ''),
                                valor: Math.round(item.valor)
                            }))}
                            titulo="Bolivianos por categoría"
                        />
                    </CardContent>
                </Card>

                {/* Ratios y Porcentajes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5" />
                            Ratios de Operación
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GraficoBarras
                            datos={datosRatios.map(item => ({
                                ...item,
                                valor: Math.round(item.valor * 10) / 10 // Redondear a 1 decimal
                            }))}
                            titulo="Porcentaje del total"
                        />

                        <div className="mt-4 pt-4 border-t">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Rotación:</span>
                                    <span className="ml-2 font-medium">
                                        {(ratioEntradas + ratioSalidas).toFixed(1)}%
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Eficiencia:</span>
                                    <span className="ml-2 font-medium">
                                        {(100 - ratioMermas).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tendencia Temporal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Tendencia {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LineaTiempo datos={estadisticas.tendencia_semanal || []} />

                        {/* Leyenda */}
                        <div className="mt-4 pt-4 border-t">
                            <div className="grid grid-cols-4 gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                                    <span>Entradas</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                                    <span>Salidas</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                                    <span>Transf.</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-orange-500 rounded-sm" />
                                    <span>Mermas</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Métricas de Rendimiento */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Indicadores de Rendimiento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {estadisticas.productos_afectados}
                            </div>
                            <div className="text-sm text-muted-foreground">Productos Activos</div>
                            <div className="text-xs text-blue-600 mt-1">
                                {(estadisticas.productos_afectados / Math.max(estadisticas.total_movimientos, 1) * 100).toFixed(1)}% participación
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {estadisticas.almacenes_activos}
                            </div>
                            <div className="text-sm text-muted-foreground">Almacenes Activos</div>
                            <div className="text-xs text-purple-600 mt-1">
                                {Math.round(estadisticas.total_movimientos / Math.max(estadisticas.almacenes_activos, 1))} mov/almacén
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {((estadisticas.valor_total_entradas - estadisticas.valor_total_salidas) / 1000).toFixed(1)}K
                            </div>
                            <div className="text-sm text-muted-foreground">Flujo Neto (Bs.)</div>
                            <div className="text-xs text-green-600 mt-1">
                                {estadisticas.valor_total_entradas > estadisticas.valor_total_salidas ? 'Positivo' : 'Negativo'}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {ratioMermas.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Tasa de Mermas</div>
                            <div className="text-xs text-orange-600 mt-1">
                                {ratioMermas < 5 ? 'Excelente' : ratioMermas < 10 ? 'Bueno' : 'Revisar'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GraficosTendencias;

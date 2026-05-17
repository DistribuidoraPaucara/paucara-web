import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { RefreshCw, Clock, CheckCircle, AlertCircle, FileCheck, TrendingUp } from 'lucide-react';
import type { ProformaStats } from '@/application/hooks/use-proforma-stats';

interface Props {
    stats: ProformaStats | null;
    loading: boolean;
    lastUpdate: Date | null;
    onRefresh: () => void;
}

export function ProformasDashboardStats({ stats, loading, lastUpdate, onRefresh }: Props) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Estadísticas de Proformas</h2>
                <div className="flex items-center gap-2">
                    {lastUpdate && (
                        <span className="text-xs text-muted-foreground">
                            Actualizado: {lastUpdate.toLocaleTimeString()}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={loading}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>
            </div>

            {/* Grid de KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Pendientes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {loading ? '...' : stats?.por_estado.pendiente ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Esperando aprobación</p>
                    </CardContent>
                </Card>

                {/* Aprobadas */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {loading ? '...' : stats?.por_estado.aprobada ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Listas para convertir</p>
                    </CardContent>
                </Card>

                {/* Vencidas */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {loading ? '...' : stats?.alertas.vencidas ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Requieren atención</p>
                    </CardContent>
                </Card>

                {/* Por Vencer */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {loading ? '...' : stats?.alertas.por_vencer ?? 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Próximos 2 días</p>
                    </CardContent>
                </Card>
            </div>

            {/* Card de Monto Total */}
            {stats && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Monto Total en Proformas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            Bs {stats.monto_total.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                            <div className="space-y-1">
                                <p className="text-muted-foreground font-medium">Pendientes</p>
                                <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                                    Bs {stats.montos_por_estado.pendiente.toLocaleString('es-BO')}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground font-medium">Aprobadas</p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                    Bs {stats.montos_por_estado.aprobada.toLocaleString('es-BO')}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground font-medium">Convertidas</p>
                                <p className="font-semibold text-blue-600 dark:text-blue-400">
                                    Bs {stats.montos_por_estado.convertida.toLocaleString('es-BO')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

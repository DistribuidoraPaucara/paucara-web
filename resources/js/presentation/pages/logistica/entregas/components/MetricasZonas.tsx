import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { MapPin, TrendingUp } from 'lucide-react';
import type { MetricaZona } from '@/application/hooks/use-entregas-dashboard-stats';

/**
 * MetricasZonas - Métricas de entregas por localidad
 *
 * ✅ SINCRONIZADO: Agrupa entregas por localidad (zona_id)
 * ✅ SINCRONIZADO: Usa estados finales dinámicos desde BD
 * ✅ SINCRONIZADO: Calcula tiempo promedio con fecha_salida y fecha_entrega
 */

interface MetricasZonasProps {
    zonasData: MetricaZona[];
    loading: boolean;
}

export function MetricasZonas({ zonasData, loading }: MetricasZonasProps) {
    if (loading) {
        return (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Métricas por Localidad</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-2">
                                <div className="h-4 bg-muted rounded w-20"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!zonasData || zonasData.length === 0) {
        return (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Métricas por Localidad</h3>
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        No hay datos de localidades disponibles
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Métricas por Localidad</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {zonasData.map((localidad) => (
                    <Card
                        key={localidad.zona_id || 'sin-localidad'}
                        className="hover:shadow-md transition-shadow"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {localidad.nombre}
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Entregas
                                </p>
                                <p className="text-2xl font-bold">
                                    {localidad.total}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <p className="text-muted-foreground">
                                        Completadas
                                    </p>
                                    <p className="font-semibold text-green-600">
                                        {localidad.completadas}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        % Completa
                                    </p>
                                    <p className="font-semibold">
                                        {localidad.porcentaje}%
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tiempo promedio
                                </p>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-blue-600" />
                                    <p className="text-sm font-semibold">
                                        {localidad.tiempo_promedio_minutos} min
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { AlertCircle, CheckCircle2, MapPin, Clock, Zap, AlertTriangle, Lightbulb, Layers } from 'lucide-react';
import type { PreviewResponse } from '@/application/services/optimizacion-entregas.service';

interface BatchOptimizationResultProps {
    preview: PreviewResponse | null;
    error: string | null;
    isLoading: boolean;
}

export default function BatchOptimizationResult({
    preview,
    error,
    isLoading,
}: BatchOptimizationResultProps) {
    if (isLoading) {
        return (
            <Card className="p-6 dark:bg-slate-900 dark:border-slate-700">
                <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin">
                        <Zap className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">Calculando optimización...</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">Error</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!preview) {
        return (
            <Card className="p-4 text-center text-gray-500 dark:bg-slate-900 dark:border-slate-700 dark:text-gray-400">
                Configura los parámetros y presiona "Ver Preview" para ver la optimización
            </Card>
        );
    }

    const { data } = preview;
    const { optimizacion, vehiculo, peso_total } = data;
    const { rutas, estadisticas, clustering_stats, problemas, sugerencias } = optimizacion;

    // Calcular métricas
    const distanciaPromedio = (estadisticas.distancia_total / rutas.length).toFixed(1);
    const tiempoPromedio = Math.round(estadisticas.tiempo_total_minutos / rutas.length);

    // Helper para color de severidad
    const getSeverityColor = (severidad: string) => {
        switch (severidad) {
            case 'CRITICA':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'MEDIA':
                return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
            case 'BAJA':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
        }
    };

    const getSeverityTextColor = (severidad: string) => {
        switch (severidad) {
            case 'CRITICA':
                return 'text-red-600 dark:text-red-400';
            case 'MEDIA':
                return 'text-orange-600 dark:text-orange-400';
            case 'BAJA':
                return 'text-yellow-600 dark:text-yellow-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {/* Encabezado con éxito */}
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-4">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200">
                            Optimización calculada correctamente
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Se optimizarán {data.ventas} ventas en {rutas.length} ruta(s)
                        </p>
                    </div>
                </div>
            </Card>

            {/* Estadísticas generales */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Resumen de Optimización</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Entregas</p>
                        <p className="font-bold text-gray-900 dark:text-white">{estadisticas.total_entregas}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Rutas</p>
                        <p className="font-bold text-gray-900 dark:text-white">{estadisticas.rutas_creadas}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Uso Promedio</p>
                        <p className="font-bold text-gray-900 dark:text-white">
                            {estadisticas.uso_promedio_capacidad.toFixed(0)}%
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            <p className="text-xs text-blue-600 dark:text-blue-400">Distancia</p>
                        </div>
                        <p className="font-bold text-blue-900 dark:text-blue-200">
                            {estadisticas.distancia_total.toFixed(1)} km
                        </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                            <p className="text-xs text-orange-600 dark:text-orange-400">Tiempo</p>
                        </div>
                        <p className="font-bold text-orange-900 dark:text-orange-200">
                            {Math.round(estadisticas.tiempo_total_minutos)} min
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Peso Total</p>
                        <p className="font-bold text-purple-900 dark:text-purple-200">{peso_total.toFixed(1)} kg</p>
                    </div>
                </div>
            </Card>

            {/* Información del vehículo */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recurso Asignado</h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p>
                        <span className="font-medium">Vehículo:</span> {vehiculo.placa} ({vehiculo.capacidad_kg} kg)
                    </p>
                    <p>
                        <span className="font-medium">Peso Total:</span> {peso_total.toFixed(1)} kg
                    </p>
                </div>
            </Card>

            {/* Phase 3.1: Clustering Statistics */}
            {clustering_stats && (
                <Card className="dark:bg-slate-900 dark:border-slate-700 p-4 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-3">
                        <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Análisis de Clustering (Phase 3.1)</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Entregas Agrupadas</p>
                            <p className="font-bold text-blue-900 dark:text-blue-200">
                                {clustering_stats.entregas_en_clusters}
                            </p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded p-2">
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-1">Clusters Detectados</p>
                            <p className="font-bold text-indigo-900 dark:text-indigo-200">
                                {clustering_stats.clusters_formados}
                            </p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2">
                            <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">% Clusterizado</p>
                            <p className="font-bold text-purple-900 dark:text-purple-200">
                                {clustering_stats.porcentaje_clusterizado}%
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Problems Detected */}
            {problemas && problemas.length > 0 && (
                <Card className={`border-l-4 p-4 ${getSeverityColor(problemas[0].severidad)}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className={`h-5 w-5 ${getSeverityTextColor(problemas[0].severidad)}`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Problemas Detectados</h4>
                    </div>
                    <div className="space-y-2">
                        {problemas.map((problema, idx) => (
                            <div key={idx} className="text-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <Badge className={`text-xs ${
                                        problema.severidad === 'CRITICA' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                                        problema.severidad === 'MEDIA' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                                    }`}>
                                        {problema.tipo}
                                    </Badge>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{problema.severidad}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{problema.mensaje}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Rebalancing Suggestions */}
            {sugerencias && sugerencias.length > 0 && (
                <Card className="dark:bg-slate-900 dark:border-slate-700 p-4 border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white">Sugerencias de Optimización (Phase 3.4)</h4>
                    </div>
                    <div className="space-y-2">
                        {sugerencias.map((sugerencia, idx) => (
                            <div key={idx} className="text-sm bg-green-50 dark:bg-green-900/20 rounded p-2 border-l-2 border-green-400">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900 dark:text-white">{sugerencia.tipo}</span>
                                    <Badge className={`text-xs ${
                                        sugerencia.prioridad === 'ALTA' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                                        sugerencia.prioridad === 'MEDIA' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200' :
                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                                    }`}>
                                        {sugerencia.prioridad}
                                    </Badge>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{sugerencia.recomendacion}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Detalle de rutas */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Rutas Optimizadas</h4>

                <div className="space-y-3">
                    {rutas.map((ruta, index) => (
                        <div
                            key={index}
                            className="border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10 p-3 rounded"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                    Ruta {index + 1} - {ruta.paradas} parada(s)
                                </h5>
                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                    {ruta.porcentaje_uso.toFixed(0)}% capacidad
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs">Distancia</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {ruta.distancia_total.toFixed(1)} km
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs">Tiempo</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {ruta.tiempo_estimado} min
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs">Peso</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {ruta.peso_total.toFixed(1)} kg
                                    </p>
                                </div>
                            </div>

                            {/* Paradas */}
                            <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Orden de paradas:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {ruta.ruta.map((parada, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="outline"
                                            className="bg-white dark:bg-slate-800 text-xs"
                                        >
                                            {idx + 1}. {parada.direccion?.substring(0, 15)}...
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Nota informativa */}
            <Card className="bg-gray-50 dark:bg-slate-800 p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Nota:</strong> Esta es una simulación de la optimización. Los datos reales pueden variar
                    según coordenadas GPS precisas y condiciones del tráfico.
                </p>
            </Card>
        </div>
    );
}

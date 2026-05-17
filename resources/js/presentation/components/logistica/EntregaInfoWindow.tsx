import React, { useState, useEffect } from 'react';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Separator } from '@/presentation/components/ui/separator';
import {
    User,
    Truck,
    MapPin,
    Clock,
    Navigation,
    Eye,
    ExternalLink,
    AlertCircle,
} from 'lucide-react';
import type { Entrega, UbicacionEntrega } from '@/domain/entities/logistica';

interface EntregaInfoWindowProps {
    entrega: Entrega;
    ubicacion?: UbicacionEntrega | null;
    distanciaRecorrida?: number;
    eta?: Date | null;
    onFollow?: (entregaId: number) => void;
    onViewDetails?: (entregaId: number) => void;
}

/**
 * Helper: Calcular tiempo transcurrido desde el timestamp
 */
function formatTimeSince(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `hace ${seconds}s`;
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;

    return date.toLocaleTimeString('es-ES');
}

/**
 * Helper: Obtener color del estado
 */
function getEstadoColor(estado: string): { bg: string; text: string } {
    const colores: Record<string, { bg: string; text: string }> = {
        PROGRAMADO: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-800 dark:text-blue-200' },
        ASIGNADA: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-800 dark:text-purple-200' },
        EN_CAMINO: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-800 dark:text-orange-200' },
        LLEGO: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-800 dark:text-cyan-200' },
        ENTREGADO: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-800 dark:text-green-200' },
        NOVEDAD: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-800 dark:text-yellow-200' },
        CANCELADA: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-800 dark:text-red-200' },
    };

    return (
        colores[estado] || { bg: 'bg-gray-100 dark:bg-gray-900/40', text: 'text-gray-800 dark:text-gray-200' }
    );
}

/**
 * Componente EntregaInfoWindow
 *
 * Renderiza información detallada de una entrega seleccionada
 * - Estado actual
 * - Datos del chofer y vehículo
 * - Ubicación actual con coordenadas
 * - Velocidad en tiempo real
 * - Distancia recorrida
 * - ETA estimada
 * - Acciones (Seguir, Ver detalles)
 *
 * @example
 * <EntregaInfoWindow
 *     entrega={entrega}
 *     ubicacion={ubicacion}
 *     distanciaRecorrida={12.5}
 *     onFollow={(id) => console.log(id)}
 * />
 */
export function EntregaInfoWindow({
    entrega,
    ubicacion,
    distanciaRecorrida = 0,
    eta = null,
    onFollow,
    onViewDetails,
}: EntregaInfoWindowProps) {
    const [tiempoDesdeActualizacion, setTiempoDesdeActualizacion] = useState<string>('');

    // Actualizar tiempo desde la última actualización cada 5 segundos
    useEffect(() => {
        if (!ubicacion) return;

        const updateTime = () => {
            setTiempoDesdeActualizacion(formatTimeSince(ubicacion.timestamp));
        };

        updateTime();
        const interval = setInterval(updateTime, 5000);

        return () => clearInterval(interval);
    }, [ubicacion]);

    const estadoColor = getEstadoColor(entrega.estado);
    const velocidadActual = ubicacion?.velocidad ?? 0;

    return (
        <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header con estado */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Entrega #{entrega.id}
                    </h3>
                    <Badge className={`${estadoColor.bg} ${estadoColor.text} border-0`}>
                        {entrega.estado.replace(/_/g, ' ')}
                    </Badge>
                </div>
                {entrega.proforma_id && (
                    <p className="text-xs text-muted-foreground">
                        Proforma: #{entrega.proforma_id}
                    </p>
                )}
            </div>

            {/* Contenido principal */}
            <div className="p-4 space-y-4">
                {/* Datos del chofer y vehículo */}
                {(entrega.chofer_id || entrega.vehiculo_id) && (
                    <div className="space-y-2">
                        {entrega.chofer_id && (
                            <div className="flex items-center gap-3 text-sm">
                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {entrega.chofer?.user?.name || 'Sin asignar'}
                                </span>
                            </div>
                        )}

                        {entrega.vehiculo_id && (
                            <div className="flex items-center gap-3 text-sm">
                                <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">
                                    {entrega.vehiculo?.placa || 'Sin asignar'}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Dirección de entrega */}
                {entrega.direccion_entrega && (
                    <>
                        <Separator className="my-2" />
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Dirección</p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {entrega.direccion_entrega}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Datos de ubicación en tiempo real */}
                {ubicacion ? (
                    <>
                        <Separator className="my-2" />
                        <div className="space-y-3">
                            <p className="text-xs font-medium text-muted-foreground">
                                Ubicación en tiempo real
                            </p>

                            {/* Coordenadas */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                                <div>{ubicacion.latitud.toFixed(6)}</div>
                                <div>{ubicacion.longitud.toFixed(6)}</div>
                            </div>

                            {/* Grid de métricas */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Velocidad */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                        <Navigation className="h-3 w-3" />
                                        Velocidad
                                    </p>
                                    <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                                        {velocidadActual.toFixed(1)} km/h
                                    </p>
                                </div>

                                {/* Última actualización */}
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                                        <Clock className="h-3 w-3" />
                                        Actualizado
                                    </p>
                                    <p className="text-sm font-bold text-green-700 dark:text-green-400">
                                        {tiempoDesdeActualizacion || 'ahora'}
                                    </p>
                                </div>
                            </div>

                            {/* Distancia y ETA */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Distancia recorrida */}
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Distancia
                                    </p>
                                    <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
                                        {distanciaRecorrida.toFixed(1)} km
                                    </p>
                                </div>

                                {/* ETA */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        ETA
                                    </p>
                                    <p className="text-sm font-bold text-purple-700 dark:text-purple-400">
                                        {eta ? eta.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Calculando...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Separator className="my-2" />
                        <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                            <span className="text-sm text-yellow-700 dark:text-yellow-200">
                                Sin ubicación registrada
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Acciones */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 space-y-2">
                {onFollow && ubicacion && (
                    <Button
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => onFollow(entrega.id)}
                    >
                        <Eye className="h-4 w-4" />
                        Seguir entrega
                    </Button>
                )}

                {onViewDetails && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => onViewDetails(entrega.id)}
                    >
                        <ExternalLink className="h-4 w-4" />
                        Ver detalles
                    </Button>
                )}
            </div>
        </div>
    );
}

export default EntregaInfoWindow;

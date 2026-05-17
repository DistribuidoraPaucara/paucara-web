// Presentation Layer: Component for real-time delivery tracking
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { useTracking, type UbicacionData, type EntregaEstadoData } from '@/application/hooks/use-tracking';
import {
    MapPin,
    Navigation,
    Clock,
    AlertCircle,
    CheckCircle,
    Loader
} from 'lucide-react';

interface DeliveryTrackingCardProps {
    entregaId: number;
    entregaNumero?: string;
    clienteNombre?: string;
    onLocationUpdate?: (location: UbicacionData) => void;
    onStatusChange?: (estado: EntregaEstadoData) => void;
}

/**
 * Componente para mostrar rastreo en tiempo real de una entrega
 *
 * Ejemplo de uso:
 * ```tsx
 * <DeliveryTrackingCard
 *   entregaId={123}
 *   entregaNumero="ENT-001"
 *   clienteNombre="Cliente ACME"
 *   onLocationUpdate={(location) => console.log('Location:', location)}
 * />
 * ```
 */
export function DeliveryTrackingCard({
    entregaId,
    entregaNumero = `#${entregaId}`,
    clienteNombre = 'Cliente',
    onLocationUpdate,
    onStatusChange
}: DeliveryTrackingCardProps) {
    const { ubicacion, estadoActual, novedades, isTracking, startTracking, stopTracking } = useTracking({
        entregaId,
        autoSubscribe: true
    });
    const [isExpanded, setIsExpanded] = useState(false);

    // Ejecutar callback cuando la ubicación se actualiza
    useEffect(() => {
        if (ubicacion && onLocationUpdate) {
            onLocationUpdate(ubicacion);
        }
    }, [ubicacion, onLocationUpdate]);

    const getEstadoBadgeColor = (estado: string | null) => {
        if (!estado) return 'bg-gray-100 text-gray-800';

        const statusMap: Record<string, string> = {
            'en_camino': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
            'llegada': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
            'entregado': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
            'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
            'pendiente': 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200',
        };

        return statusMap[estado.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoLabel = (estado: string | null) => {
        if (!estado) return 'Sin estado';

        const labelMap: Record<string, string> = {
            'en_camino': '🚗 En Camino',
            'llegada': '📍 Llegada',
            'entregado': '✅ Entregado',
            'cancelado': '❌ Cancelado',
            'pendiente': '⏳ Pendiente',
        };

        return labelMap[estado.toLowerCase()] || estado;
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">Entrega {entregaNumero}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{clienteNombre}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isTracking && !ubicacion && (
                            <Loader className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        <Badge className={getEstadoBadgeColor(estadoActual)}>
                            {getEstadoLabel(estadoActual)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4">
                    {/* Ubicación actual */}
                    {ubicacion ? (
                        <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-green-600" />
                                <span className="font-mono">
                                    {ubicacion.latitud.toFixed(6)}, {ubicacion.longitud.toFixed(6)}
                                </span>
                            </div>

                            {ubicacion.velocidad !== undefined && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Navigation className="h-4 w-4 text-blue-600" />
                                    <span>{ubicacion.velocidad.toFixed(1)} km/h</span>
                                </div>
                            )}

                            {ubicacion.direccion && (
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-amber-600 mt-0.5" />
                                    <span>{ubicacion.direccion}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                <Clock className="h-3 w-3" />
                                <span>
                                    Actualizado: {new Date(ubicacion.timestamp).toLocaleTimeString('es-ES')}
                                </span>
                            </div>
                        </div>
                    ) : isTracking ? (
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader className="h-4 w-4 animate-spin" />
                                <span>Buscando ubicación...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                <span>Sin ubicación registrada</span>
                            </div>
                        </div>
                    )}

                    {/* Novedades */}
                    {novedades.length > 0 && (
                        <div className="border-t pt-3">
                            <h4 className="text-sm font-medium mb-2">Novedades</h4>
                            <div className="space-y-2">
                                {novedades.slice(0, 3).map((novedad, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-yellow-900 dark:text-yellow-200">{novedad.descripcion}</p>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                                {new Date(novedad.timestamp).toLocaleTimeString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Info en tiempo real */}
                    <div className="text-xs text-muted-foreground pt-3 border-t">
                        {isTracking && ubicacion && (
                            <p className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></span>
                                Rastreo en vivo
                            </p>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

// Google Maps Route Visualization Component
import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Route, Navigation, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export interface RoutePoint {
    id: string | number;
    name: string;
    latitude: number;
    longitude: number;
    type?: 'origin' | 'destination' | 'waypoint';
    description?: string;
}

interface RouteMapProps {
    points: RoutePoint[];
    showRoute?: boolean;
    showDistance?: boolean;
    showDuration?: boolean;
    height?: string;
    optimizeRoute?: boolean;
    onRouteCalculated?: (distance: number, duration: number) => void;
}

const DEFAULT_CENTER = { lat: -17.78629, lng: -63.18117 };
const DEFAULT_ZOOM = 12;

export default function RouteMap({
    points,
    showRoute = true,
    showDistance = true,
    showDuration = true,
    height = '500px',
    optimizeRoute = false,
    onRouteCalculated
}: RouteMapProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [routeInfo, setRouteInfo] = useState<{
        distance: number;
        duration: number;
        distanceText: string;
        durationText: string;
    } | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calcular centro del mapa basado en los puntos
    const calculateCenter = useCallback(() => {
        if (points.length === 0) return DEFAULT_CENTER;
        if (points.length === 1) return { lat: points[0].latitude, lng: points[0].longitude };

        const avgLat = points.reduce((sum, p) => sum + p.latitude, 0) / points.length;
        const avgLng = points.reduce((sum, p) => sum + p.longitude, 0) / points.length;

        return { lat: avgLat, lng: avgLng };
    }, [points]);

    // Calcular ruta
    const calculateRoute = useCallback(async () => {
        if (!map || points.length < 2 || !showRoute) return;

        setIsCalculating(true);
        setError(null);

        try {
            const directionsService = new google.maps.DirectionsService();

            // Preparar origen, destino y puntos intermedios
            const origin = { lat: points[0].latitude, lng: points[0].longitude };
            const destination = { lat: points[points.length - 1].latitude, lng: points[points.length - 1].longitude };

            const waypoints = points.slice(1, -1).map(point => ({
                location: { lat: point.latitude, lng: point.longitude },
                stopover: true
            }));

            const request: google.maps.DirectionsRequest = {
                origin,
                destination,
                waypoints,
                optimizeWaypoints: optimizeRoute,
                travelMode: google.maps.TravelMode.DRIVING,
            };

            const result = await directionsService.route(request);

            if (!directionsRenderer) {
                const renderer = new google.maps.DirectionsRenderer({
                    map,
                    suppressMarkers: true, // Usaremos nuestros propios marcadores
                    polylineOptions: {
                        strokeColor: '#2563eb',
                        strokeWeight: 5,
                        strokeOpacity: 0.8
                    }
                });
                setDirectionsRenderer(renderer);
                renderer.setDirections(result);
            } else {
                directionsRenderer.setDirections(result);
            }

            // Calcular distancia y duración total
            const route = result.routes[0];
            let totalDistance = 0;
            let totalDuration = 0;

            route.legs.forEach(leg => {
                if (leg.distance) totalDistance += leg.distance.value;
                if (leg.duration) totalDuration += leg.duration.value;
            });

            const info = {
                distance: totalDistance,
                duration: totalDuration,
                distanceText: (totalDistance / 1000).toFixed(2) + ' km',
                durationText: Math.round(totalDuration / 60) + ' min'
            };

            setRouteInfo(info);

            if (onRouteCalculated) {
                onRouteCalculated(totalDistance, totalDuration);
            }

        } catch (err) {
            console.error('Error calculando ruta:', err);
            setError('No se pudo calcular la ruta. Verifica que todos los puntos sean accesibles.');
        } finally {
            setIsCalculating(false);
        }
    }, [map, points, showRoute, optimizeRoute, directionsRenderer, onRouteCalculated]);

    // Recalcular ruta cuando cambien los puntos
    useEffect(() => {
        if (showRoute && points.length >= 2) {
            calculateRoute();
        }
    }, [points, showRoute, calculateRoute]);

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            if (directionsRenderer) {
                directionsRenderer.setMap(null);
            }
        };
    }, [directionsRenderer]);

    // Determinar color del pin según el tipo
    const getPinColor = (type?: string) => {
        switch (type) {
            case 'origin':
                return { background: '#22c55e', borderColor: '#16a34a' }; // Verde
            case 'destination':
                return { background: '#ef4444', borderColor: '#dc2626' }; // Rojo
            case 'waypoint':
                return { background: '#f59e0b', borderColor: '#d97706' }; // Amarillo
            default:
                return { background: '#2563eb', borderColor: '#1e40af' }; // Azul
        }
    };

    if (!apiKey) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error de configuración</CardTitle>
                    <CardDescription>
                        La API key de Google Maps no está configurada.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Route className="h-5 w-5" />
                            Mapa de Ruta
                        </CardTitle>
                        <CardDescription>
                            {points.length === 0 && 'No hay puntos para mostrar'}
                            {points.length === 1 && 'Se muestra 1 ubicación'}
                            {points.length > 1 && `Se muestran ${points.length} ubicaciones`}
                        </CardDescription>
                    </div>

                    {routeInfo && (showDistance || showDuration) && (
                        <div className="flex gap-2">
                            {showDistance && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Navigation className="h-3 w-3" />
                                    {routeInfo.distanceText}
                                </Badge>
                            )}
                            {showDuration && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {routeInfo.durationText}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Mensajes de estado */}
                {isCalculating && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <TrendingUp className="h-4 w-4 animate-pulse text-blue-600" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">Calculando ruta...</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">{error}</span>
                    </div>
                )}

                {/* Mapa */}
                <div className="relative rounded-lg overflow-hidden" style={{ height }}>
                    <APIProvider apiKey={apiKey}>
                        <Map
                            defaultCenter={calculateCenter()}
                            defaultZoom={DEFAULT_ZOOM}
                            mapId="route-map"
                            gestureHandling="greedy"
                            disableDefaultUI={false}
                            onCameraChanged={(ev) => setMap(ev.map)}
                        >
                            {/* Marcadores personalizados */}
                            {!showRoute && points.map((point, index) => {
                                const colors = getPinColor(point.type);
                                return (
                                    <AdvancedMarker
                                        key={point.id}
                                        position={{ lat: point.latitude, lng: point.longitude }}
                                    >
                                        <Pin
                                            background={colors.background}
                                            borderColor={colors.borderColor}
                                            glyphColor="#ffffff"
                                        >
                                            {index + 1}
                                        </Pin>
                                    </AdvancedMarker>
                                );
                            })}

                            {/* Si mostramos ruta, los marcadores los gestiona DirectionsRenderer */}
                            {showRoute && points.map((point, index) => {
                                const colors = getPinColor(point.type);
                                return (
                                    <AdvancedMarker
                                        key={point.id}
                                        position={{ lat: point.latitude, lng: point.longitude }}
                                    >
                                        <Pin
                                            background={colors.background}
                                            borderColor={colors.borderColor}
                                            glyphColor="#ffffff"
                                        >
                                            {index + 1}
                                        </Pin>
                                    </AdvancedMarker>
                                );
                            })}
                        </Map>
                    </APIProvider>
                </div>

                {/* Lista de puntos */}
                {points.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Puntos de la ruta:</h4>
                        <div className="space-y-1">
                            {points.map((point, index) => (
                                <div
                                    key={point.id}
                                    className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 text-sm"
                                >
                                    <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center p-0">
                                        {index + 1}
                                    </Badge>
                                    <div className="flex-1">
                                        <span className="font-medium">{point.name}</span>
                                        {point.description && (
                                            <span className="text-muted-foreground ml-2">- {point.description}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useTrackingMap } from '@/application/hooks/use-tracking-map';
import type { Entrega, UbicacionEntrega } from '@/domain/entities/logistica';
import type { Id } from '@/domain/entities/shared';
import { createMarkerElement } from './CustomMarkerIcon';
import { AlertCircle } from 'lucide-react';

interface LiveTrackingMapProps {
    entregas: Entrega[];
    ubicaciones: Map<Id, UbicacionEntrega>;
    onMarkerClick?: (entregaId: number) => void;
    onInfoWindowClose?: () => void;
    followingEntregaId?: number | null;
    showPolylines?: boolean;
    height?: string;
    userLocation?: { latitude: number; longitude: number } | null;
}

const DEFAULT_CENTER = { lat: -17.78629, lng: -63.18117 }; // Bolivia
const DEFAULT_ZOOM = 12;

/**
 * Componente LiveTrackingMap
 *
 * Renderiza un mapa de Google Maps con tracking en tiempo real de entregas
 * - Marcadores personalizados por estado
 * - Animaciones suaves de movimiento
 * - Polylines de recorrido histórico
 * - Modo de seguimiento (follow)
 *
 * @example
 * <LiveTrackingMap
 *     entregas={entregas}
 *     ubicaciones={ubicaciones}
 *     onMarkerClick={(id) => console.log(id)}
 *     followingEntregaId={123}
 * />
 */
export function LiveTrackingMap({
    entregas,
    ubicaciones,
    onMarkerClick,
    onInfoWindowClose,
    followingEntregaId,
    showPolylines = true,
    height = '600px',
    userLocation,
}: LiveTrackingMapProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const {
        mapRef,
        setMapRef,
        markers,
        polylines,
        setFollowingId,
        addMarker,
        updateMarkerPosition,
        removeMarker,
        setMarkerIcon,
        fitMapToMarkers,
    } = useTrackingMap();

    const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<{
        entregaId: number;
        position: google.maps.LatLngLiteral;
    } | null>(null);

    // Actualizar el ID de seguimiento
    useEffect(() => {
        if (followingEntregaId !== undefined) {
            setFollowingId(followingEntregaId ?? null);
        }
    }, [followingEntregaId, setFollowingId]);

    // Agregar o actualizar marcadores cuando cambian las entregas/ubicaciones
    useEffect(() => {
        entregas.forEach((entrega) => {
            const ubicacion = ubicaciones.get(entrega.id);
            const existentMarker = markers.get(entrega.id);

            if (ubicacion) {
                const position = {
                    lat: ubicacion.latitud,
                    lng: ubicacion.longitud,
                };

                if (existentMarker) {
                    // Actualizar posición con animación
                    updateMarkerPosition(entrega.id, position, 800);
                } else {
                    // Crear nuevo marcador
                    addMarker(entrega.id, position);
                }
            }
        });

        // Remover marcadores de entregas que ya no están
        markers.forEach((marker) => {
            if (!entregas.find((e) => e.id === marker.id)) {
                removeMarker(marker.id);
            }
        });
    }, [entregas, ubicaciones, markers, addMarker, updateMarkerPosition, removeMarker]);

    // Actualizar iconos de los marcadores
    useEffect(() => {
        markers.forEach((marker) => {
            const entrega = entregas.find((e) => e.id === marker.id);
            const ubicacion = ubicaciones.get(marker.id);

            if (entrega && ubicacion && marker.marker) {
                const iconElement = createMarkerElement(
                    entrega.estado,
                    ubicacion.velocidad,
                    entrega.id
                );
                marker.marker.content = iconElement;
            }
        });
    }, [markers, entregas, ubicaciones]);

    // Auto-fit cuando hay marcadores
    useEffect(() => {
        if (markers.size > 0) {
            const timeoutId = setTimeout(() => {
                fitMapToMarkers();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [markers, fitMapToMarkers]);

    if (!apiKey) {
        return (
            <div className="flex items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-red-600">
                        Error de configuración: API key de Google Maps no configurada
                    </p>
                </div>
            </div>
        );
    }

    const calculateCenter = () => {
        // Si tenemos ubicación del usuario, usarla como centro preferido
        if (userLocation) {
            return {
                lat: userLocation.latitude,
                lng: userLocation.longitude,
            };
        }

        if (entregas.length === 0) return DEFAULT_CENTER;

        // Si estamos siguiendo una entrega, usar su posición
        if (followingEntregaId) {
            const ubicacion = ubicaciones.get(followingEntregaId);
            if (ubicacion) {
                return {
                    lat: ubicacion.latitud,
                    lng: ubicacion.longitud,
                };
            }
        }

        // De lo contrario, calcular el centro de todas las entregas
        const validUbicaciones = Array.from(ubicaciones.values());
        if (validUbicaciones.length === 0) return DEFAULT_CENTER;

        const avgLat =
            validUbicaciones.reduce((sum, u) => sum + u.latitud, 0) /
            validUbicaciones.length;
        const avgLng =
            validUbicaciones.reduce((sum, u) => sum + u.longitud, 0) /
            validUbicaciones.length;

        return { lat: avgLat, lng: avgLng };
    };

    return (
        <div
            className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            style={{ height }}
        >
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={calculateCenter()}
                    defaultZoom={followingEntregaId ? 16 : DEFAULT_ZOOM}
                    mapId="live-tracking-map"
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    onCameraChanged={(ev) => {
                        if (ev.map) {
                            setMapRef(ev.map);
                        }
                    }}
                >
                    {/* Marcador de ubicación del usuario */}
                    {userLocation && (
                        <AdvancedMarker
                            position={{
                                lat: userLocation.latitude,
                                lng: userLocation.longitude,
                            }}
                            title="Mi ubicación"
                        >
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-lg">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </AdvancedMarker>
                    )}

                    {/* Renderizar los marcadores de entregas */}
                    {Array.from(markers.values()).map((marker) => (
                        <AdvancedMarker
                            key={marker.id}
                            position={marker.position}
                            onClick={() => {
                                onMarkerClick?.(marker.id);
                                setSelectedMarkerInfo({
                                    entregaId: marker.id,
                                    position: marker.position,
                                });
                            }}
                        >
                            {/* El contenido se establece mediante setMarkerIcon */}
                        </AdvancedMarker>
                    ))}
                </Map>
            </APIProvider>

            {/* Indicador de carga si no hay entregas */}
            {entregas.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-lg">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            No hay entregas para mostrar
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LiveTrackingMap;

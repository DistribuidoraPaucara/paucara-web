import { useState, useCallback, useRef, useEffect } from 'react';
import type { Id } from '@/domain/entities/shared';
import type { Entrega, UbicacionEntrega } from '@/domain/entities/logistica';

interface MarkerData {
    id: number;
    position: google.maps.LatLngLiteral;
    marker: google.maps.marker.AdvancedMarkerElement | null;
}

interface PolylineData {
    entregaId: number;
    polyline: google.maps.Polyline | null;
    path: google.maps.LatLngLiteral[];
}

interface UseTrackingMapOptions {
    defaultCenter?: { lat: number; lng: number };
    defaultZoom?: number;
}

interface UseTrackingMapReturn {
    mapRef: React.MutableRefObject<google.maps.Map | null>;
    setMapRef: (map: google.maps.Map | null) => void;
    markers: Map<number, MarkerData>;
    polylines: Map<number, PolylineData>;
    followingId: number | null;
    setFollowingId: (id: number | null) => void;
    addMarker: (entregaId: number, position: google.maps.LatLngLiteral) => void;
    updateMarkerPosition: (entregaId: number, position: google.maps.LatLngLiteral, duration?: number) => void;
    removeMarker: (entregaId: number) => void;
    addPolylinePoint: (entregaId: number, position: google.maps.LatLngLiteral) => void;
    clearPolyline: (entregaId: number) => void;
    setMarkerIcon: (entregaId: number, element: HTMLElement | null) => void;
    fitMapToMarkers: () => void;
}

/**
 * Application Layer Hook - useTrackingMap
 *
 * Encapsula toda la lógica de Google Maps para tracking GPS:
 * - Inicialización del mapa
 * - Gestión de marcadores con posiciones
 * - Gestión de polylines de historial
 * - Modo de seguimiento (auto-center)
 * - Animaciones suaves de movimiento
 *
 * @example
 * const { mapRef, setMapRef, markers, updateMarkerPosition, fitMapToMarkers } = useTrackingMap();
 */
export function useTrackingMap(options: UseTrackingMapOptions = {}) {
    const {
        defaultCenter = { lat: -17.78629, lng: -63.18117 }, // Bolivia
        defaultZoom = 12,
    } = options;

    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<Map<number, MarkerData>>(new Map());
    const polylinesRef = useRef<Map<number, PolylineData>>(new Map());
    const animationFrameRef = useRef<Map<number, number>>(new Map());
    const [markers, setMarkers] = useState<Map<number, MarkerData>>(new Map());
    const [polylines, setPolylines] = useState<Map<number, PolylineData>>(new Map());
    const [followingId, setFollowingId] = useState<number | null>(null);

    const setMapRef = useCallback((map: google.maps.Map | null) => {
        mapRef.current = map;
    }, []);

    /**
     * Agregar un nuevo marcador al mapa
     */
    const addMarker = useCallback(
        (entregaId: number, position: google.maps.LatLngLiteral) => {
            if (!mapRef.current) return;

            try {
                // Crear el marcador avanzado (sin icono por ahora, se agregará después)
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map: mapRef.current,
                    position,
                    title: `Entrega #${entregaId}`,
                });

                const markerData: MarkerData = {
                    id: entregaId,
                    position,
                    marker,
                };

                markersRef.current.set(entregaId, markerData);
                setMarkers(new Map(markersRef.current));
            } catch (error) {
                console.error(`Error agregando marcador para entrega ${entregaId}:`, error);
            }
        },
        []
    );

    /**
     * Actualizar posición de un marcador con animación suave
     */
    const updateMarkerPosition = useCallback(
        (entregaId: number, position: google.maps.LatLngLiteral, duration: number = 1000) => {
            const markerData = markersRef.current.get(entregaId);
            if (!markerData?.marker) return;

            // Cancelar animación anterior si existe
            const prevFrameId = animationFrameRef.current.get(entregaId);
            if (prevFrameId !== undefined) {
                cancelAnimationFrame(prevFrameId);
                animationFrameRef.current.delete(entregaId);
            }

            const fromPos = markerData.position;
            const toPos = position;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function: ease-in-out-cubic
                const eased = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                // Interpolación de coordenadas
                const lat = fromPos.lat + (toPos.lat - fromPos.lat) * eased;
                const lng = fromPos.lng + (toPos.lng - fromPos.lng) * eased;

                markerData.marker!.position = { lat, lng };
                markerData.position = { lat, lng };

                if (progress < 1) {
                    const nextFrameId = requestAnimationFrame(animate);
                    animationFrameRef.current.set(entregaId, nextFrameId);
                } else {
                    animationFrameRef.current.delete(entregaId);
                    // Actualizar la referencia final
                    markersRef.current.set(entregaId, {
                        ...markerData,
                        position: toPos,
                    });
                }
            };

            const frameId = requestAnimationFrame(animate);
            animationFrameRef.current.set(entregaId, frameId);

            // También agregar punto al polyline
            addPolylinePoint(entregaId, position);
        },
        []
    );

    /**
     * Remover un marcador del mapa
     */
    const removeMarker = useCallback((entregaId: number) => {
        const markerData = markersRef.current.get(entregaId);
        if (markerData?.marker) {
            markerData.marker.map = null;
        }
        markersRef.current.delete(entregaId);
        setMarkers(new Map(markersRef.current));

        // Limpiar animación si existe
        const frameId = animationFrameRef.current.get(entregaId);
        if (frameId !== undefined) {
            cancelAnimationFrame(frameId);
            animationFrameRef.current.delete(entregaId);
        }
    }, []);

    /**
     * Agregar un punto al polyline de una entrega
     */
    const addPolylinePoint = useCallback(
        (entregaId: number, position: google.maps.LatLngLiteral) => {
            let polylineData = polylinesRef.current.get(entregaId);

            if (!polylineData) {
                // Crear nuevo polyline si no existe
                if (!mapRef.current) return;

                const polyline = new google.maps.Polyline({
                    map: mapRef.current,
                    path: [position],
                    strokeColor: '#f97316', // Orange por defecto
                    strokeWeight: 3,
                    strokeOpacity: 0.7,
                    geodesic: true,
                });

                polylineData = {
                    entregaId,
                    polyline,
                    path: [position],
                };
                polylinesRef.current.set(entregaId, polylineData);
            } else {
                // Agregar punto al polyline existente (máximo 100 puntos)
                if (polylineData.path.length >= 100) {
                    polylineData.path.shift();
                }
                polylineData.path.push(position);
                polylineData.polyline?.setPath(polylineData.path);
            }

            setPolylines(new Map(polylinesRef.current));
        },
        []
    );

    /**
     * Limpiar polyline de una entrega
     */
    const clearPolyline = useCallback((entregaId: number) => {
        const polylineData = polylinesRef.current.get(entregaId);
        if (polylineData?.polyline) {
            polylineData.polyline.setMap(null);
        }
        polylinesRef.current.delete(entregaId);
        setPolylines(new Map(polylinesRef.current));
    }, []);

    /**
     * Establecer icono personalizado para un marcador
     */
    const setMarkerIcon = useCallback(
        (entregaId: number, element: HTMLElement | null) => {
            const markerData = markersRef.current.get(entregaId);
            if (markerData?.marker && element) {
                markerData.marker.content = element;
            }
        },
        []
    );

    /**
     * Ajustar vista del mapa para mostrar todos los marcadores
     */
    const fitMapToMarkers = useCallback(() => {
        if (!mapRef.current || markersRef.current.size === 0) return;

        const bounds = new google.maps.LatLngBounds();
        markersRef.current.forEach((markerData) => {
            bounds.extend(markerData.position);
        });

        mapRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }, []);

    /**
     * Efecto para seguir una entrega (auto-center)
     */
    useEffect(() => {
        if (!followingId || !mapRef.current) return;

        const markerData = markersRef.current.get(followingId);
        if (!markerData) return;

        // Pan to marcador con zoom cercano
        mapRef.current.panTo(markerData.position);
        mapRef.current.setZoom(16);
    }, [followingId]);

    return {
        mapRef,
        setMapRef,
        markers,
        polylines,
        followingId,
        setFollowingId,
        addMarker,
        updateMarkerPosition,
        removeMarker,
        addPolylinePoint,
        clearPolyline,
        setMarkerIcon,
        fitMapToMarkers,
    };
}

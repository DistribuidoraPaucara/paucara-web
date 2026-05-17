import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useTracking } from '@/application/hooks/use-tracking';
import { useTrackingMap } from '@/application/hooks/use-tracking-map';
import type { Entrega } from '@/domain/entities/entregas';
import { AlertCircle, Satellite, Map as MapIcon } from 'lucide-react';

interface EstregaMapProps {
    entrega: Entrega;
    altura?: string;
    autoSuscribir?: boolean;
    mostrarPolilinea?: boolean;
    permitirSatellite?: boolean;
    onUbicacionActualizada?: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER = { lat: -17.78629, lng: -63.18117 }; // Bolivia
const DEFAULT_ZOOM = 14;

/**
 * EstregaMap Component
 *
 * Muestra un mapa de Google Maps con tracking en tiempo real de una entrega específica
 * Características:
 * - Marcador azul para el chofer (ubicación actual)
 * - Marcadores para cada venta con colores dinámicos
 * - Animación suave del movimiento del chofer
 * - Polyline con ruta histórica
 * - Toggle Normal/Satélite
 * - Info windows con información detallada
 * - WebSocket en tiempo real
 *
 * @example
 * <EstregaMap
 *     entrega={entrega}
 *     altura="500px"
 *     mostrarPolilinea={true}
 * />
 */
export default function EstregaMap({
    entrega,
    altura = '400px',
    autoSuscribir = true,
    mostrarPolilinea = true,
    permitirSatellite = true,
    onUbicacionActualizada,
}: EstregaMapProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
    const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

    // Hooks para tracking
    const { ubicacion, estadoActual, isTracking, startTracking, stopTracking } =
        useTracking({ entregaId: entrega.id, autoSubscribe: false });

    // Hooks para manejo del mapa
    const {
        mapRef,
        setMapRef,
        markers,
        addMarker,
        updateMarkerPosition,
        removeMarker,
        fitMapToMarkers,
    } = useTrackingMap();

    // Iniciar tracking
    useEffect(() => {
        if (autoSuscribir) {
            startTracking();
            return () => stopTracking();
        }
    }, [entrega.id, autoSuscribir, startTracking, stopTracking]);

    // Actualizar marcador del chofer
    useEffect(() => {
        if (ubicacion && ubicacion.latitud && ubicacion.longitud) {
            const position = { lat: ubicacion.latitud, lng: ubicacion.longitud };

            const choferMarkerId = `chofer_${entrega.chofer_id || 'default'}`;
            const existentMarker = markers.get(choferMarkerId as any);

            if (existentMarker) {
                // Animar movimiento
                updateMarkerPosition(choferMarkerId as any, position, 800);
            } else {
                // Crear nuevo marcador
                addMarker(choferMarkerId as any, position);
            }

            onUbicacionActualizada?.(ubicacion.latitud, ubicacion.longitud);
        }
    }, [ubicacion, entrega.chofer_id, markers, addMarker, updateMarkerPosition, onUbicacionActualizada]);

    // Agregar marcadores de ventas
    useEffect(() => {
        if (!entrega.ventas || entrega.ventas.length === 0) return;

        entrega.ventas.forEach((venta) => {
            // Usar coordenadas de dirección cliente si existen
            const latitud = venta.direccionCliente?.latitud || venta.latitud;
            const longitud = venta.direccionCliente?.longitud || venta.longitud;

            if (latitud && longitud) {
                const ventaMarkerId = `venta_${venta.id}`;
                const position = { lat: latitud, lng: longitud };

                const existentMarker = markers.get(ventaMarkerId as any);
                if (!existentMarker) {
                    addMarker(ventaMarkerId as any, position);
                }
            }
        });
    }, [entrega.ventas, markers, addMarker]);

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
            <div className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-6"
                style={{ height }}>
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-red-600">
                        Error de configuración: API key de Google Maps no configurada
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                        Contacta al administrador para configurar VITE_GOOGLE_MAPS_API_KEY
                    </p>
                </div>
            </div>
        );
    }

    // Función para obtener información de un marcador
    const getMarkerInfo = (markerId: string | number) => {
        if (typeof markerId === 'string') {
            if (markerId.startsWith('chofer_')) {
                return {
                    titulo: `Chofer: ${entrega.chofer?.name || 'N/A'}`,
                    detalles: `Velocidad: ${ubicacion?.velocidad ?? 0} km/h\nEstado: ${estadoActual || 'Desconocido'}`,
                    tipo: 'chofer' as const,
                };
            } else if (markerId.startsWith('venta_')) {
                const ventaId = parseInt(markerId.replace('venta_', ''));
                const venta = entrega.ventas?.find((v) => v.id === ventaId);
                if (venta) {
                    return {
                        titulo: `Venta #${venta.numero}`,
                        detalles: `Cliente: ${venta.cliente?.nombre || 'N/A'}\nTotal: $${venta.subtotal?.toFixed(2) || '0.00'}`,
                        tipo: 'venta' as const,
                    };
                }
            }
        }
        return null;
    };

    // Función para obtener color del marcador
    const getMarkerColor = (markerId: string | number): string => {
        if (typeof markerId === 'string' && markerId.startsWith('chofer_')) {
            return '#3B82F6'; // Azul para chofer
        }

        if (typeof markerId === 'string' && markerId.startsWith('venta_')) {
            const ventaId = parseInt(markerId.replace('venta_', ''));
            const venta = entrega.ventas?.find((v) => v.id === ventaId);
            if (venta) {
                // Usar color del estado logístico si está disponible
                if (venta.estadoLogistico?.color) {
                    return venta.estadoLogistico.color;
                }
                // Fallback a colores por defecto
                const colorMap: Record<string, string> = {
                    ENTREGADO: '#10B981', // Verde
                    EN_PREPARACION: '#F59E0B', // Naranja
                    CARGADA: '#8B5CF6', // Púrpura
                    EN_TRANSITO: '#06B6D4', // Cian
                    NOVEDAD: '#EF4444', // Rojo
                };
                return colorMap[venta.estadoLogistico?.codigo || ''] || '#FFEB3B';
            }
        }

        return '#FFEB3B'; // Amarillo por defecto
    };

    // Crear SVG para marcador personalizado
    const createMarkerSVG = (color: string, label: string): SVGElement => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '40');
        svg.setAttribute('height', '56');
        svg.setAttribute('viewBox', '0 0 40 56');
        svg.setAttribute('fill', 'none');

        // Cuerpo del marcador
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M20 0C8.95 0 0 8.95 0 20c0 12.5 20 36 20 36s20-23.5 20-36c0-11.05-8.95-20-20-20z');
        path.setAttribute('fill', color);
        svg.appendChild(path);

        // Círculo interior
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '20');
        circle.setAttribute('cy', '15');
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', 'white');
        svg.appendChild(circle);

        // Texto del label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '20');
        text.setAttribute('y', '50');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', '#333');
        text.setAttribute('font-weight', 'bold');
        text.textContent = label;
        svg.appendChild(text);

        return svg;
    };

    return (
        <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height: altura }}>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={
                        ubicacion
                            ? { lat: ubicacion.latitud, lng: ubicacion.longitud }
                            : DEFAULT_CENTER
                    }
                    defaultZoom={DEFAULT_ZOOM}
                    mapId="entrega-tracking-map"
                    mapTypeId={mapType}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    onCameraChanged={(ev) => {
                        if (ev.map) {
                            setMapRef(ev.map);
                        }
                    }}
                >
                    {/* Marcadores del mapa */}
                    {Array.from(markers).map(([markerId, marker]) => {
                        const markerInfo = getMarkerInfo(markerId);
                        const color = getMarkerColor(markerId);
                        const label = typeof markerId === 'string'
                            ? (markerId.startsWith('chofer_') ? '🚚' : '📍')
                            : '•';

                        return (
                            <AdvancedMarker
                                key={markerId}
                                position={marker.position}
                                onClick={() => setSelectedMarkerId(markerId as any)}
                                title={markerInfo?.titulo}
                            >
                                <div
                                    className="w-10 h-14 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                    dangerouslySetInnerHTML={{
                                        __html: createMarkerSVG(color, label).outerHTML,
                                    }}
                                />
                            </AdvancedMarker>
                        );
                    })}

                    {/* Info Window */}
                    {selectedMarkerId && (
                        (() => {
                            const marker = markers.get(selectedMarkerId as any);
                            const info = getMarkerInfo(selectedMarkerId);
                            if (!marker || !info) return null;

                            return (
                                <InfoWindow
                                    position={marker.position}
                                    onCloseClick={() => setSelectedMarkerId(null)}
                                    headerDisabled={true}
                                >
                                    <div className="p-3 max-w-xs">
                                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                                            {info.titulo}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">
                                            {info.detalles}
                                        </p>
                                    </div>
                                </InfoWindow>
                            );
                        })()
                    )}
                </Map>
            </APIProvider>

            {/* Botón Toggle Normal/Satélite */}
            {permitirSatellite && (
                <button
                    onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
                    className="absolute top-4 right-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg p-2 shadow-md transition-colors"
                    title={mapType === 'roadmap' ? 'Cambiar a Satélite' : 'Cambiar a Normal'}
                >
                    {mapType === 'roadmap' ? (
                        <Satellite className="w-5 h-5" />
                    ) : (
                        <MapIcon className="w-5 h-5" />
                    )}
                </button>
            )}

            {/* Status Indicator */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg p-2 text-xs shadow-md">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                        }`}
                    />
                    <span>{isTracking ? 'En vivo' : 'Desconectado'}</span>
                </div>
                {ubicacion && (
                    <div className="mt-1 text-gray-600 dark:text-gray-300">
                        Vel: {ubicacion.velocidad?.toFixed(1) || '0.0'} km/h
                    </div>
                )}
            </div>

            {/* Message when no tracking data */}
            {!ubicacion && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 rounded-lg">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center max-w-xs">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Esperando datos de ubicación del chofer...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

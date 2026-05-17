import { useRef, useCallback, useEffect } from 'react';
import L from 'leaflet';
import type { Id } from '@/domain/entities/shared';
import type { Entrega, UbicacionEntrega } from '@/domain/entities/logistica';

interface UseDeliveryMapOptions {
    centro?: [number, number];
    zoom?: number;
}

interface UseDeliveryMapReturn {
    mapContainer: React.RefObject<HTMLDivElement>;
    mapRef: React.RefObject<L.Map | null>;
    inicializarMapa: () => void;
    actualizarMarcadores: (ubicaciones: Map<Id, UbicacionEntrega>, entregas: Entrega[]) => void;
}

/**
 * Application Layer Hook
 *
 * Encapsula toda la lógica de mapa Leaflet para entregas:
 * - Inicialización del mapa
 * - Gestión de marcadores
 * - Auto-ajuste de vista (fitBounds)
 * - Actualización de marcadores según ubicaciones
 *
 * @example
 * const { mapContainer, actualizarMarcadores } = useDeliveryMap();
 * useEffect(() => {
 *     actualizarMarcadores(ubicaciones, entregas);
 * }, [ubicaciones]);
 */
export function useDeliveryMap(options: UseDeliveryMapOptions = {}) {
    const {
        centro = [-16.5, -68.15], // Bolivia como centro predeterminado
        zoom = 6,
    } = options;

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<Map<Id, L.Marker>>(new Map());

    /**
     * Inicializa el mapa Leaflet en el contenedor
     */
    const inicializarMapa = useCallback(() => {
        if (!mapContainer.current) {
            console.warn('Map container no está disponible');
            return;
        }

        try {
            // No inicializar si ya existe
            if (mapRef.current) {
                return;
            }

            mapRef.current = L.map(mapContainer.current).setView(centro, zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(mapRef.current);

            console.log('✅ Mapa inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar Leaflet:', error);
        }
    }, [centro, zoom]);

    /**
     * Actualiza los marcadores del mapa según las ubicaciones de entregas
     * Limpia marcadores anteriores y agrega nuevos, ajustando automáticamente la vista
     */
    const actualizarMarcadores = useCallback(
        (ubicaciones: Map<Id, UbicacionEntrega>, entregas: Entrega[]) => {
            if (!mapRef.current) return;

            try {
                // Limpiar marcadores previos
                markersRef.current.forEach((marker) => {
                    mapRef.current!.removeLayer(marker);
                });
                markersRef.current.clear();

                // Agregar nuevos marcadores
                ubicaciones.forEach((ubicacion) => {
                    const entrega = entregas.find(e => e.id === ubicacion.entrega_id);
                    if (entrega) {
                        const marker = L.marker(
                            [ubicacion.latitud, ubicacion.longitud],
                            {
                                title: `Entrega #${entrega.id}`,
                            }
                        ).addTo(mapRef.current!);

                        marker.bindPopup(`
                            <div style="min-width: 200px;">
                                <strong>Entrega #${entrega.id}</strong><br/>
                                <small>Proforma: #${entrega.proforma_id}</small><br/>
                                ${ubicacion.velocidad ? `<small>Velocidad: ${ubicacion.velocidad.toFixed(1)} km/h</small><br/>` : ''}
                                <small>Actualizado: ${new Date(ubicacion.timestamp).toLocaleTimeString('es-ES')}</small>
                            </div>
                        `);

                        markersRef.current.set(ubicacion.entrega_id, marker);
                    }
                });

                // Auto-ajustar vista si hay marcadores
                if (markersRef.current.size > 0) {
                    const bounds = L.latLngBounds(
                        Array.from(ubicaciones.values()).map(
                            u => [u.latitud, u.longitud] as L.LatLngExpression
                        )
                    );
                    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                }
            } catch (error) {
                console.error('Error al actualizar marcadores:', error);
            }
        },
        []
    );

    /**
     * Inicializar mapa cuando el contenedor está disponible
     */
    useEffect(() => {
        if (mapContainer.current && !mapRef.current) {
            inicializarMapa();
        }
    }, [mapContainer, inicializarMapa]);

    return {
        mapContainer,
        mapRef,
        inicializarMapa,
        actualizarMarcadores,
    };
}

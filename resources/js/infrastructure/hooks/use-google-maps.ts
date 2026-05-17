// Hook personalizado para facilitar el uso de Google Maps
import { useState, useCallback } from 'react';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface AddressComponents {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    formattedAddress?: string;
}

export interface RouteInfo {
    distance: number; // metros
    duration: number; // segundos
    distanceText: string;
    durationText: string;
}

export function useGoogleMaps() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Geocodifica una dirección a coordenadas
     */
    const geocodeAddress = useCallback(async (address: string): Promise<Coordinates | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ address });

            if (response.results[0]) {
                const location = response.results[0].geometry.location;
                return {
                    latitude: location.lat(),
                    longitude: location.lng()
                };
            }

            setError('No se encontró la dirección');
            return null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al geocodificar';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Geocodificación inversa: coordenadas a dirección
     */
    const reverseGeocode = useCallback(async (
        latitude: number,
        longitude: number
    ): Promise<AddressComponents | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({
                location: { lat: latitude, lng: longitude }
            });

            if (response.results[0]) {
                const result = response.results[0];
                const components: AddressComponents = {
                    formattedAddress: result.formatted_address
                };

                // Parsear componentes de dirección
                result.address_components.forEach(component => {
                    if (component.types.includes('route')) {
                        components.street = component.long_name;
                    }
                    if (component.types.includes('locality')) {
                        components.city = component.long_name;
                    }
                    if (component.types.includes('administrative_area_level_1')) {
                        components.state = component.long_name;
                    }
                    if (component.types.includes('country')) {
                        components.country = component.long_name;
                    }
                    if (component.types.includes('postal_code')) {
                        components.postalCode = component.long_name;
                    }
                });

                return components;
            }

            setError('No se encontró información de la ubicación');
            return null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error en geocodificación inversa';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Calcula la distancia entre dos puntos
     */
    const calculateDistance = useCallback((
        point1: Coordinates,
        point2: Coordinates
    ): number => {
        const R = 6371e3; // Radio de la Tierra en metros
        const φ1 = (point1.latitude * Math.PI) / 180;
        const φ2 = (point2.latitude * Math.PI) / 180;
        const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
        const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distancia en metros
    }, []);

    /**
     * Calcula una ruta entre múltiples puntos
     */
    const calculateRoute = useCallback(async (
        origin: Coordinates,
        destination: Coordinates,
        waypoints?: Coordinates[],
        optimize = false
    ): Promise<RouteInfo | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const directionsService = new google.maps.DirectionsService();

            const request: google.maps.DirectionsRequest = {
                origin: { lat: origin.latitude, lng: origin.longitude },
                destination: { lat: destination.latitude, lng: destination.longitude },
                waypoints: waypoints?.map(wp => ({
                    location: { lat: wp.latitude, lng: wp.longitude },
                    stopover: true
                })),
                optimizeWaypoints: optimize,
                travelMode: google.maps.TravelMode.DRIVING
            };

            const result = await directionsService.route(request);

            if (result.routes[0]) {
                const route = result.routes[0];
                let totalDistance = 0;
                let totalDuration = 0;

                route.legs.forEach(leg => {
                    if (leg.distance) totalDistance += leg.distance.value;
                    if (leg.duration) totalDuration += leg.duration.value;
                });

                return {
                    distance: totalDistance,
                    duration: totalDuration,
                    distanceText: (totalDistance / 1000).toFixed(2) + ' km',
                    durationText: Math.round(totalDuration / 60) + ' min'
                };
            }

            setError('No se pudo calcular la ruta');
            return null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al calcular ruta';
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtiene la ubicación actual del usuario
     */
    const getCurrentLocation = useCallback((): Promise<Coordinates | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                setError('La geolocalización no está disponible en este navegador');
                resolve(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setIsLoading(false);
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (err) => {
                    setIsLoading(false);
                    setError(err.message || 'Error al obtener ubicación');
                    resolve(null);
                }
            );
        });
    }, []);

    /**
     * Valida que las coordenadas sean válidas
     */
    const validateCoordinates = useCallback((coordinates: Coordinates): boolean => {
        const { latitude, longitude } = coordinates;

        if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number' ||
            isNaN(latitude) ||
            isNaN(longitude)
        ) {
            return false;
        }

        if (latitude < -90 || latitude > 90) {
            return false;
        }

        if (longitude < -180 || longitude > 180) {
            return false;
        }

        return true;
    }, []);

    /**
     * Formatea coordenadas a string legible
     */
    const formatCoordinates = useCallback((coordinates: Coordinates, decimals = 6): string => {
        return `${coordinates.latitude.toFixed(decimals)}, ${coordinates.longitude.toFixed(decimals)}`;
    }, []);

    return {
        isLoading,
        error,
        geocodeAddress,
        reverseGeocode,
        calculateDistance,
        calculateRoute,
        getCurrentLocation,
        validateCoordinates,
        formatCoordinates
    };
}

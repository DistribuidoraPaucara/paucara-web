import { useState, useEffect, useCallback } from 'react';

interface GeolocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
    heading?: number;
    speed?: number;
}

interface UseGeolocationReturn {
    location: GeolocationCoordinates | null;
    loading: boolean;
    error: string | null;
    requestLocation: () => void;
}

/**
 * Hook para obtener la geolocalización del dispositivo
 *
 * Utiliza la Geolocation API del navegador para obtener la ubicación actual
 * del usuario en tiempo real.
 *
 * @param options - Opciones de configuración
 * @param options.enableHighAccuracy - Solicitar alta precisión (consume más batería)
 * @param options.timeout - Tiempo máximo para obtener la ubicación (ms)
 * @param options.maximumAge - Usar ubicación en caché si es más reciente que esto (ms)
 * @param options.autoRequest - Solicitar automáticamente al montar el componente
 *
 * @example
 * const { location, loading, error } = useGeolocation({
 *     autoRequest: true,
 *     enableHighAccuracy: true
 * });
 *
 * if (loading) return <div>Obteniendo ubicación...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (location) {
 *     return <div>Lat: {location.latitude}, Lng: {location.longitude}</div>;
 * }
 */
export function useGeolocation({
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    autoRequest = true,
}: {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    autoRequest?: boolean;
} = {}): UseGeolocationReturn {
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('La geolocalización no está soportada en este navegador');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy, heading, speed } =
                    position.coords;
                setLocation({
                    latitude,
                    longitude,
                    accuracy,
                    heading: heading ?? undefined,
                    speed: speed ?? undefined,
                });
                setLoading(false);
            },
            (err) => {
                let errorMessage = 'Error al obtener la geolocalización';

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage =
                            'Permiso denegado. Habilita la geolocalización en la configuración del navegador.';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage =
                            'Ubicación no disponible. Verifica tu conexión GPS.';
                        break;
                    case err.TIMEOUT:
                        errorMessage = 'Tiempo agotado al obtener la ubicación.';
                        break;
                }

                setError(errorMessage);
                setLoading(false);
            },
            {
                enableHighAccuracy,
                timeout,
                maximumAge,
            }
        );
    }, [enableHighAccuracy, timeout, maximumAge]);

    // Solicitar ubicación automáticamente al montar
    useEffect(() => {
        if (autoRequest) {
            requestLocation();
        }
    }, [autoRequest, requestLocation]);

    return { location, loading, error, requestLocation };
}

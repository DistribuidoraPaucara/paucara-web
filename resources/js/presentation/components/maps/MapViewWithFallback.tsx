/**
 * MapView Mejorado con Fallback y Manejo de Errores
 * Intenta cargar Google Maps con reintentos automáticos
 */
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Loader2, Satellite, Map, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

interface MapViewProps {
    latitude: number;
    longitude: number;
    height?: string;
    zoom?: number;
    markerTitle?: string;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const getMapOptions = (mapType: string): google.maps.MapOptions => ({
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'cooperative',
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    mapTypeId: mapType as google.maps.MapTypeId,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
});

export default function MapViewWithFallback({
    latitude,
    longitude,
    height = '300px',
    zoom = 16,
    markerTitle = 'Ubicación'
}: MapViewProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [mapType, setMapType] = useState<string>('roadmap');
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    // Log API key status
    useEffect(() => {
        console.log('[MapViewWithFallback] Initialization:', {
            hasApiKey: !!apiKey,
            apiKeyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'undefined',
            timestamp: new Date().toISOString(),
            domain: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
        });
    }, [apiKey]);

    // Usar useLoadScript hook
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey || '',
        onError: () => {
            console.error('[MapViewWithFallback] Script load error detected');
            // Intentar recargar el script
            if (retryCount < maxRetries) {
                setTimeout(() => {
                    console.log(`[MapViewWithFallback] Retry attempt ${retryCount + 1}/${maxRetries}`);
                    setRetryCount(prev => prev + 1);
                    // Forzar recarga
                    window.location.reload();
                }, 2000);
            }
        }
    });

    const center = { lat: latitude, lng: longitude };

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
        console.log('[MapViewWithFallback] Map loaded successfully');
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Sin API Key
    if (!apiKey) {
        return (
            <div className="flex items-center justify-center p-6 border border-destructive rounded-lg bg-destructive/10" style={{ height }}>
                <div className="text-center">
                    <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm font-semibold text-destructive">
                        Configuración faltante
                    </p>
                    <p className="text-xs text-destructive/80 mt-1">
                        VITE_GOOGLE_MAPS_API_KEY no está configurada
                    </p>
                    <p className="text-xs text-destructive/60 mt-3">
                        Contacta al administrador
                    </p>
                </div>
            </div>
        );
    }

    // Error al cargar
    if (loadError) {
        const errorMessage = loadError?.message || 'Error desconocido';
        const isKeyError = errorMessage.includes('RefererNotAllowed') ||
                          errorMessage.includes('InvalidKey') ||
                          errorMessage.includes('PermissionDenied');

        console.error('[MapViewWithFallback] Load Error:', {
            message: errorMessage,
            isKeyError,
            retryCount,
            maxRetries,
            timestamp: new Date().toISOString()
        });

        return (
            <div className="flex flex-col items-center justify-center p-6 border border-destructive rounded-lg bg-destructive/10 gap-3" style={{ height }}>
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <div className="text-center">
                    <p className="text-sm font-semibold text-destructive">
                        Error al cargar el mapa
                    </p>
                    <p className="text-xs text-destructive/80 mt-2">
                        {isKeyError
                            ? 'Problema con la API Key o dominio no autorizado'
                            : errorMessage.substring(0, 100)
                        }
                    </p>

                    {isKeyError && (
                        <div className="mt-3 text-xs text-destructive/70 bg-white/50 p-2 rounded">
                            <p className="font-semibold mb-1">Solución:</p>
                            <ul className="list-disc list-inside text-left space-y-0.5">
                                <li>Verifica que VITE_GOOGLE_MAPS_API_KEY esté en .env</li>
                                <li>Agrega tu dominio a Google Cloud Console</li>
                                <li>Habilita "Maps JavaScript API"</li>
                            </ul>
                        </div>
                    )}

                    {retryCount < maxRetries && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="mt-3"
                        >
                            Reintentar ({retryCount}/{maxRetries})
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // Cargando
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center border border-border rounded-lg bg-muted" style={{ height }}>
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Cargando mapa...</p>
                </div>
            </div>
        );
    }

    // Mapa cargado exitosamente
    return (
        <div className="relative rounded-lg overflow-hidden border border-border" style={{ height }}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                options={getMapOptions(mapType)}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <Marker
                    position={center}
                    title={markerTitle}
                />
            </GoogleMap>

            {/* Controles de tipo de mapa */}
            <div className="absolute top-2 right-2 flex gap-1 z-10">
                <Button
                    size="sm"
                    variant={mapType === 'roadmap' ? 'default' : 'outline'}
                    onClick={() => setMapType('roadmap')}
                    className="h-8 px-2"
                    title="Vista de carretera"
                >
                    <Map className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant={mapType === 'satellite' ? 'default' : 'outline'}
                    onClick={() => setMapType('satellite')}
                    className="h-8 px-2"
                    title="Vista satélite"
                >
                    <Satellite className="h-4 w-4" />
                </Button>
            </div>

            {/* Indicador de ubicación */}
            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-700 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </div>
        </div>
    );
}

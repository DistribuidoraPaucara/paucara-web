// Componente de visualización de mapa (solo lectura) - Usando @react-google-maps/api
import React, { useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Loader2, Satellite, Map } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

interface MapViewProps {
    latitude: number;
    longitude: number;
    height?: string;
    zoom?: number;
    markerTitle?: string;
}

// Estilos del mapa
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

export default function MapView({
    latitude,
    longitude,
    height = '300px',
    zoom = 16,
    markerTitle = 'Ubicación'
}: MapViewProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [mapType, setMapType] = useState<string>('roadmap');

    // Debug: Log API key availability
    React.useEffect(() => {
        console.log('[MapView] Environment Check:', {
            hasApiKey: !!apiKey,
            apiKeyLength: apiKey ? apiKey.length : 0,
            apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'undefined',
            environment: process.env.NODE_ENV,
            url: typeof window !== 'undefined' ? window.location.origin : 'server-side'
        });
    }, [apiKey]);

    // Usar useLoadScript hook en lugar de LoadScript component
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey || '',
    });

    const center = { lat: latitude, lng: longitude };

    // Callback cuando el mapa se carga
    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    // Callback cuando el mapa se desmonta
    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    if (!apiKey) {
        return (
            <div className="flex items-center justify-center p-4 border border-destructive rounded-lg bg-destructive/10">
                <p className="text-sm text-destructive">
                    La API key de Google Maps no está configurada
                </p>
            </div>
        );
    }

    if (loadError) {
        console.error('[MapView] Load Error Details:', {
            error: loadError,
            message: loadError?.message,
            apiKeyExists: !!apiKey,
        });
        return (
            <div className="flex flex-col items-center justify-center p-4 border border-destructive rounded-lg bg-destructive/10 gap-2">
                <p className="text-sm text-destructive font-semibold">
                    Error al cargar Google Maps
                </p>
                <p className="text-xs text-destructive/80">
                    {loadError?.message || 'API key inválida o error de permisos'}
                </p>
                <p className="text-xs text-destructive/60 mt-2">
                    Verifica la consola del navegador para más detalles
                </p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center border border-border rounded-lg bg-muted" style={{ height }}>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

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
        </div>
    );
}

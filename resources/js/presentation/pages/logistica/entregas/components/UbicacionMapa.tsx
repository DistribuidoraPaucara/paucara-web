import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import type { Id } from '@/domain/entities/shared';

interface VentaUbicacion {
    id: Id;
    numero: string;
    cliente: {
        nombre: string;
    };
    direccion_cliente?: {
        latitud?: number;
        longitud?: number;
        direccion: string;
    };
}

interface UbicacionMapaProps {
    ventas?: VentaUbicacion[];
    latitud?: number;
    longitud?: number;
    nombreChofer?: string;
    placa?: string;
    entregaId: Id;
}

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
};

const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoom: 15,
};

export default function UbicacionMapa({
    ventas = [],
    latitud,
    longitud,
    nombreChofer,
    placa,
    entregaId,
}: UbicacionMapaProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey || '',
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<Id | null>(null);

    /**
     * Verificar si hay ubicaciones disponibles:
     * - De la entrega (latitud/longitud del chofer en tránsito)
     * - O de las ventas (direccion_cliente de los clientes)
     */
    const hayUbicacionEntrega = !!(latitud && longitud);
    const hayUbicacionesVentas = ventas.length > 0 && ventas.some(v => v.direccion_cliente?.latitud && v.direccion_cliente?.longitud);
    const hayAlgunaUbicacion = hayUbicacionEntrega || hayUbicacionesVentas;

    // Calcular ubicación inicial del mapa
    const ubicacionInicial = latitud && longitud
        ? { lat: latitud, lng: longitud }
        : ventas[0]?.direccion_cliente?.latitud
            ? { lat: ventas[0].direccion_cliente.latitud, lng: ventas[0].direccion_cliente.longitud! }
            : { lat: -18.964261, lng: -57.8011669 }; // Puerto Suárez por defecto

    // Recargar ubicación del servidor
    const handleRefresh = useCallback(async () => {
        setIsUpdating(true);
        try {
            const response = await fetch(`/api/entregas/${entregaId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.data?.latitud && result.data?.longitud) {
                    setLastUpdate(new Date());
                }
            }
        } catch (error) {
            console.error('❌ Error recargando ubicación:', error);
        } finally {
            setIsUpdating(false);
        }
    }, [entregaId]);

    // Auto-actualizar ubicación cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            handleRefresh();
        }, 10000);

        return () => clearInterval(interval);
    }, [handleRefresh]);

    // Ajustar zoom cuando cambian las coordenadas
    useEffect(() => {
        if (map && hayAlgunaUbicacion) {
            const bounds = new google.maps.LatLngBounds();

            // Agregar ubicación del chofer
            if (latitud && longitud) {
                bounds.extend({ lat: latitud, lng: longitud });
            }

            // Agregar ubicaciones de ventas
            ventas.forEach(venta => {
                if (venta.direccion_cliente?.latitud && venta.direccion_cliente?.longitud) {
                    bounds.extend({
                        lat: venta.direccion_cliente.latitud,
                        lng: venta.direccion_cliente.longitud,
                    });
                }
            });

            map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
    }, [map, latitud, longitud, ventas, hayAlgunaUbicacion]);

    // Obtener coordenadas de la ruta (usar objetos simples en lugar de google.maps.LatLng)
    const coordenadasRuta = ventas
        .filter(v => v.direccion_cliente?.latitud && v.direccion_cliente?.longitud)
        .map(v => ({
            lat: v.direccion_cliente!.latitud!,
            lng: v.direccion_cliente!.longitud!,
        }));

    if (!isLoaded) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">Cargando mapa...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">Error al cargar el mapa</p>
            </div>
        );
    }

    if (!hayAlgunaUbicacion) {
        return (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    ⚠️ Ubicación no disponible aún
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    Las ubicaciones de los clientes y la posición del vehículo no están disponibles en este momento.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Botón de actualización */}
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Ubicación en Tiempo Real
                </h3>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isUpdating}
                >
                    <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                    {isUpdating ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </div>

            {/* Mapa de Google */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={ubicacionInicial}
                options={mapOptions}
                onLoad={setMap}
            >
                {/* Marcadores de ventas (azul) */}
                {ventas.map((venta) => {
                    if (!venta.direccion_cliente?.latitud || !venta.direccion_cliente?.longitud) {
                        return null;
                    }

                    const isSelected = selectedMarker === venta.id;

                    return (
                        <div key={venta.id}>
                            <Marker
                                position={{
                                    lat: venta.direccion_cliente.latitud,
                                    lng: venta.direccion_cliente.longitud,
                                }}
                                title={venta.cliente.nombre}
                                onMouseOver={() => setSelectedMarker(venta.id)}
                                onMouseOut={() => setSelectedMarker(null)}
                                icon={{
                                    path: 'M12 0C5.37 0 0 5.37 0 12c0 7.2 12 20 12 20s12-12.8 12-20c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
                                    fillColor: '#3B82F6',
                                    fillOpacity: 1,
                                    strokeColor: '#FFF',
                                    strokeWeight: 2,
                                    scale: 1.5,
                                    anchor: new google.maps.Point(12, 24),
                                }}
                            />

                            {/* Tooltip con detalles de la venta */}
                            {isSelected && (
                                <InfoWindow
                                    position={{
                                        lat: venta.direccion_cliente.latitud,
                                        lng: venta.direccion_cliente.longitud,
                                    }}
                                    options={{
                                        pixelOffset: new google.maps.Size(0, -40),
                                    }}
                                >
                                    <div className="bg-white p-2 rounded-lg shadow-xl text-xs max-w-sm border border-blue-200">
                                        <h4 className="font-bold text-blue-600 mb-1">{venta.cliente.nombre}</h4>
                                        <div className="space-y-0.5 text-gray-700">
                                            <p><strong>Venta:</strong> {venta.numero}</p>
                                            <p><strong>Dirección:</strong> {venta.direccion_cliente.direccion}</p>
                                            <p><strong>Total:</strong> Bs {typeof venta.subtotal === 'string' ? parseFloat(venta.subtotal).toFixed(2) : venta.subtotal?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </InfoWindow>
                            )}
                        </div>
                    );
                })}

                {/* Marcador de chofer (verde) */}
                {latitud && longitud && (
                    <div>
                        <Marker
                            position={{ lat: latitud, lng: longitud }}
                            title={nombreChofer || 'Chofer'}
                            onMouseOver={() => setSelectedMarker('chofer')}
                            onMouseOut={() => setSelectedMarker(null)}
                            icon={{
                                path: 'M12 0C5.37 0 0 5.37 0 12c0 7.2 12 20 12 20s12-12.8 12-20c0-6.63-5.37-12-12-12zm0 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
                                fillColor: '#10B981',
                                fillOpacity: 1,
                                strokeColor: '#FFF',
                                strokeWeight: 2,
                                scale: 1.8,
                                anchor: new google.maps.Point(12, 24),
                            }}
                        />

                        {/* Tooltip del chofer */}
                        {selectedMarker === 'chofer' && (
                            <InfoWindow
                                position={{ lat: latitud, lng: longitud }}
                                options={{
                                    pixelOffset: new google.maps.Size(0, -40),
                                }}
                            >
                                <div className="bg-white p-2 rounded-lg shadow-xl text-xs max-w-sm border border-green-200">
                                    <h4 className="font-bold text-green-600 mb-1">🚗 {nombreChofer || 'Chofer'}</h4>
                                    <div className="space-y-0.5 text-gray-700">
                                        <p><strong>Vehículo:</strong> {placa || 'N/A'}</p>
                                    </div>
                                </div>
                            </InfoWindow>
                        )}
                    </div>
                )}

                {/* Polyline para la ruta */}
                {coordenadasRuta.length > 1 && (
                    <Polyline
                        path={coordenadasRuta}
                        options={{
                            strokeColor: '#3B82F6',
                            strokeOpacity: 0.7,
                            strokeWeight: 3,
                            geodesic: true,
                        }}
                    />
                )}
            </GoogleMap>

            {/* Info de última actualización */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 text-sm">
                <p className="text-blue-700 dark:text-blue-300">
                    <strong>Última actualización:</strong>{' '}
                    {lastUpdate.toLocaleString('es-ES')}
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
                    💡 Haz clic en los marcadores para ver más detalles
                </p>
            </div>
        </div>
    );
}

import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Loader, MapPin, Satellite } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UbicacionSeleccionada {
    latitud: number;
    longitud: number;
    localidad_id?: number;
    direccion?: string;
    es_ubicacion_manual?: boolean;
}

interface Localidad {
    id: number;
    nombre: string;
}

interface UbicacionMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (ubicacion: UbicacionSeleccionada) => void;
    localidades: Localidad[];
    ubicacionInicial?: { latitud: number; longitud: number; observaciones?: string };
    localidadPreseleccionada?: number; // ✅ Nuevo: ID de localidad preseleccionada
    mostrarSelectLocalidad?: boolean; // ✅ Nuevo: Si mostrar el select de localidad
}

export function UbicacionMapModal({
    isOpen,
    onClose,
    onSelect,
    localidades,
    ubicacionInicial,
    localidadPreseleccionada, // ✅ Nuevo
    mostrarSelectLocalidad = false, // ✅ Nuevo: Por defecto no mostrar
}: UbicacionMapModalProps) {
    // ✅ Nuevo: Log detallado de props recibidos
    console.log('%c🗺️ UBICACION MAP MODAL - PROPS RECIBIDOS', 'color: #ff6b6b; font-weight: bold; font-size: 12px', {
        isOpen,
        localidadPreseleccionada,
        mostrarSelectLocalidad,
        ubicacionInicial,
        'observaciones en ubicacionInicial': ubicacionInicial?.observaciones,
        localidades: localidades.length,
    });

    const [tipoMapa, setTipoMapa] = useState<'osm' | 'satelite'>('osm');
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<{
        lat: number;
        lng: number;
    } | null>(ubicacionInicial ? { lat: ubicacionInicial.latitud, lng: ubicacionInicial.longitud } : null);

    const [localidadSeleccionada, setLocalidadSeleccionada] = useState<number | undefined>(localidadPreseleccionada);
    // ✅ Inicializar direccionManual con observaciones de ubicacionInicial
    const [direccionManual, setDireccionManual] = useState(ubicacionInicial?.observaciones || '');
    const [mensaje, setMensaje] = useState('');
    const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

    // ✅ Nuevo: Sincronizar localidadSeleccionada cuando cambia localidadPreseleccionada
    useEffect(() => {
        if (isOpen && localidadPreseleccionada !== undefined) {
            console.log('%c🔄 SINCRONIZANDO LOCALIDAD', 'color: #fdcb6e; font-weight: bold; font-size: 12px', {
                localidadPreseleccionada,
                localidadSeleccionada,
                'será actualizada a': localidadPreseleccionada,
            });
            setLocalidadSeleccionada(localidadPreseleccionada);
        }
    }, [isOpen, localidadPreseleccionada]);

    // ✅ Nuevo: Log cuando cambia localidadSeleccionada
    useEffect(() => {
        console.log('%c📍 LOCALIDAD SELECCIONADA CAMBIÓ', 'color: #4ecdc4; font-weight: bold; font-size: 12px', {
            localidadSeleccionada,
            mostrarSelectLocalidad,
            localidadNombre: localidades.find((l) => l.id === localidadSeleccionada)?.nombre || 'No encontrada',
        });
    }, [localidadSeleccionada, localidades]);

    // ✅ Nuevo: Sincronizar ubicacionSeleccionada cuando cambia ubicacionInicial
    useEffect(() => {
        if (isOpen && ubicacionInicial) {
            console.log('%c🎯 SINCRONIZANDO UBICACION INICIAL', 'color: #ff9ff3; font-weight: bold; font-size: 12px', {
                ubicacionInicial,
                'será actualizada a': { lat: ubicacionInicial.latitud, lng: ubicacionInicial.longitud },
            });
            setUbicacionSeleccionada({
                lat: ubicacionInicial.latitud,
                lng: ubicacionInicial.longitud,
            });
        }
    }, [isOpen, ubicacionInicial]);

    // ✅ Nuevo: Sincronizar direccionManual cuando cambia ubicacionInicial
    useEffect(() => {
        if (isOpen && ubicacionInicial?.observaciones) {
            console.log('%c📝 SINCRONIZANDO DIRECCION MANUAL', 'color: #fdcb6e; font-weight: bold; font-size: 12px', {
                observaciones: ubicacionInicial.observaciones,
            });
            setDireccionManual(ubicacionInicial.observaciones);
        }
    }, [isOpen, ubicacionInicial?.observaciones]);

    // ✅ Nuevo: Obtener ubicación actual del usuario cuando se abre el modal
    useEffect(() => {
        if (!isOpen) return;

        console.log('%c🗺️ MODAL ABIERTO - ESTADO ACTUAL', 'color: #a29bfe; font-weight: bold; font-size: 12px', {
            isOpen,
            localidadPreseleccionada,
            localidadSeleccionada,
            ubicacionSeleccionada,
            mostrarSelectLocalidad,
            direccionManual,
        });

        // ✅ Si ya tiene ubicación (del cliente o manual), no pedir geolocalización
        if (ubicacionSeleccionada || ubicacionInicial) return;

        setCargandoUbicacion(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUbicacionSeleccionada({
                        lat: latitude,
                        lng: longitude,
                    });
                    setMensaje(`✓ Ubicación actual: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                    setCargandoUbicacion(false);
                },
                (error) => {
                    console.warn('Error obteniendo ubicación:', error);
                    // Fallback a ubicación por defecto (La Paz, Bolivia)
                    setUbicacionSeleccionada({
                        lat: -16.5,
                        lng: -68.15,
                    });
                    setMensaje('📍 Usando ubicación por defecto (La Paz)');
                    setCargandoUbicacion(false);
                },
                { timeout: 5000 },
            );
        } else {
            // Fallback si no tiene soporte de geolocalización
            setUbicacionSeleccionada({
                lat: -16.5,
                lng: -68.15,
            });
            setMensaje('📍 Navegador sin soporte de geolocalización');
            setCargandoUbicacion(false);
        }
    }, [isOpen, ubicacionSeleccionada]);

    const generarMapaSelectable = () => {
        const centerLat = ubicacionSeleccionada?.lat ?? -18.5;
        const centerLng = ubicacionSeleccionada?.lng ?? -65.0;

        const tileUrl =
            tipoMapa === 'satelite'
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const attribution = tipoMapa === 'satelite' ? '© Esri, DigitalGlobe, Earthstar Geographics' : 'Distribuidora Paucara';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>
                <style>
                    body { margin: 0; padding: 0; }
                    #map { position: absolute; top: 0; bottom: 0; width: 100%; cursor: crosshair; }
                    .leaflet-container { background-color: #f0f0f0; }
                </style>
            </head>
            <body>
                <div id="map"><\/div>
                <script>
                    window.addEventListener('load', function() {
                        try {
                            var map = L.map('map').setView([${centerLat}, ${centerLng}], 14);

                            L.tileLayer('${tileUrl}', {
                                attribution: '${attribution}',
                                maxZoom: ${tipoMapa === 'satelite' ? 18 : 19}
                            }).addTo(map);

                            var marcador = null;

                            // Mostrar marcador inicial si existe
                            ${
                                ubicacionSeleccionada
                                    ? `
                            marcador = L.marker([${ubicacionSeleccionada.lat}, ${ubicacionSeleccionada.lng}])
                                .addTo(map)
                                .setIcon(L.divIcon({
                                    className: 'custom-marker',
                                    html: '<div style="background: #2563eb; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 18px;">📍<\/div>',
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 20]
                                }));
                            `
                                    : ''
                            }

                            // Evento: clic en el mapa para seleccionar ubicación
                            map.on('click', function(e) {
                                var lat = e.latlng.lat.toFixed(6);
                                var lng = e.latlng.lng.toFixed(6);

                                // Remover marcador anterior
                                if (marcador) {
                                    map.removeLayer(marcador);
                                }

                                // Crear nuevo marcador
                                marcador = L.marker([lat, lng])
                                    .addTo(map)
                                    .setIcon(L.divIcon({
                                        className: 'custom-marker',
                                        html: '<div style="background: #2563eb; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 18px;">📍<\/div>',
                                        iconSize: [40, 40],
                                        iconAnchor: [20, 20]
                                    }));

                                // Enviar datos al parent
                                window.parent.postMessage({
                                    type: 'ubicacion_seleccionada',
                                    lat: parseFloat(lat),
                                    lng: parseFloat(lng)
                                }, '*');
                            });

                            console.log('✓ Mapa inicializado. Haz clic en el mapa para seleccionar una ubicación');
                        } catch (e) {
                            console.error('Error inicializando mapa:', e);
                            document.body.innerHTML = '<div style="padding: 20px; color: red;">Error al cargar el mapa: ' + e.message + '<\/div>';
                        }
                    });
                <\/script>
            </body>
            </html>
        `;
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'ubicacion_seleccionada') {
                setUbicacionSeleccionada({
                    lat: event.data.lat,
                    lng: event.data.lng,
                });
                setMensaje(`✓ Ubicación seleccionada: ${event.data.lat.toFixed(4)}, ${event.data.lng.toFixed(4)}`);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen]);

    const handleGuardarUbicacion = () => {
        if (!ubicacionSeleccionada) {
            setMensaje('❌ Selecciona una ubicación en el mapa');
            return;
        }

        if (!localidadSeleccionada && !direccionManual) {
            setMensaje('❌ Especifica localidad y/o dirección');
            return;
        }

        const ubicacion: UbicacionSeleccionada = {
            latitud: ubicacionSeleccionada.lat,
            longitud: ubicacionSeleccionada.lng,
            localidad_id: localidadSeleccionada,
            direccion: direccionManual || undefined,
            es_ubicacion_manual: true,
        };

        console.log('%c✅ GUARDANDO UBICACIÓN', 'color: #00b894; font-weight: bold; font-size: 12px', {
            ubicacion,
            localidadNombre: localidades.find((l) => l.id === localidadSeleccionada)?.nombre,
        });

        onSelect(ubicacion);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex h-screen w-screen flex-col overflow-hidden p-0" style={{ maxWidth: '95vw', maxHeight: '95vh' }}>
                <DialogHeader className="flex-shrink-0 space-y-4 border-b bg-white px-6 pt-6 pb-4 dark:bg-gray-900">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <DialogTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                Seleccionar Ubicación en Mapa
                            </DialogTitle>
                            <DialogDescription>
                                
                                {/* Coordenadas seleccionadas */}
                                {ubicacionSeleccionada && (
                                    <div>
                                        <div className="font-small text-blue-900 dark:text-blue-100">📍 Haz clic en el mapa para seleccionar una ubicación, luego especifica la localidad y dirección</div>
                                        <p className="text-xs text-blue-800 dark:text-blue-300">
                                            Latitud: {ubicacionSeleccionada.lat.toFixed(6)} | Longitud: {ubicacionSeleccionada.lng.toFixed(6)}
                                        </p>
                                    </div>
                                )}
                            </DialogDescription>
                        </div>

                        {/* Selector de tipo de mapa */}
                        <div className="flex gap-3">
                            <Button
                                size="sm"
                                variant={tipoMapa === 'osm' ? 'default' : 'outline'}
                                onClick={() => setTipoMapa('osm')}
                                className="flex items-center gap-2"
                            >
                                <MapPin className="h-4 w-4" />
                                Mapa
                            </Button>
                            <Button
                                size="sm"
                                variant={tipoMapa === 'satelite' ? 'default' : 'outline'}
                                onClick={() => setTipoMapa('satelite')}
                                className="flex items-center gap-2"
                            >
                                <Satellite className="h-4 w-4" />
                                Satélite
                            </Button>
                            {/* Botón para obtener ubicación actual */}
                            <Button
                                onClick={() => {
                                    setCargandoUbicacion(true);
                                    if ('geolocation' in navigator) {
                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                                const { latitude, longitude } = position.coords;
                                                setUbicacionSeleccionada({
                                                    lat: latitude,
                                                    lng: longitude,
                                                });
                                                setMensaje(`✓ Ubicación actual: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                                                setCargandoUbicacion(false);
                                            },
                                            (error) => {
                                                console.warn('Error obteniendo ubicación:', error);
                                                setMensaje('❌ Error al obtener tu ubicación. Asegúrate de permitir acceso a la ubicación');
                                                setCargandoUbicacion(false);
                                            },
                                            { timeout: 5000 },
                                        );
                                    } else {
                                        setMensaje('❌ Tu navegador no soporta geolocalización');
                                        setCargandoUbicacion(false);
                                    }
                                }}
                                disabled={cargandoUbicacion}
                                className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {cargandoUbicacion ? (
                                    <div className="flex items-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin" />
                                        Obteniendo ubicación...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Mi Ubicación Actual
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Layout 2 columnas: Mapa (izquierda) + Panel (derecha) */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Columna 1: Mapa */}
                    <div className="flex-1 border-r">
                        <div className="relative h-full w-full">
                            <iframe
                                key={tipoMapa}
                                srcDoc={generarMapaSelectable()}
                                className="h-full w-full border-0"
                                title="Selector de ubicación en mapa"
                            />
                        </div>
                    </div>

                    {/* Columna 2: Panel de configuración */}
                    <div className="flex w-96 flex-col border-l bg-gray-50 dark:bg-gray-900">
                        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
                            {/* Cargando ubicación */}
                            {cargandoUbicacion && (
                                <div className="flex items-center gap-2 rounded bg-blue-100 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Obteniendo tu ubicación actual...
                                </div>
                            )}

                            {/* Mensaje */}
                            {/* {mensaje && !cargandoUbicacion && (
                                <div
                                    className={`rounded p-3 text-sm ${
                                        mensaje.startsWith('✓')
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}
                                >
                                    {mensaje}
                                </div>
                            )} */}

                            {/* ✅ Nuevo: Seleccionar Localidad - Solo si mostrarSelectLocalidad es true */}
                            {mostrarSelectLocalidad && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">📌 Localidad (Opcional)</label>
                                    <select
                                        value={localidadSeleccionada || ''}
                                        onChange={(e) => setLocalidadSeleccionada(e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">Selecciona localidad...</option>
                                        {localidades.map((localidad) => (
                                            <option key={localidad.id} value={localidad.id}>
                                                {localidad.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Dirección Manual */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">🏠 Dirección (Opcional)</label>
                                <textarea
                                    value={direccionManual}
                                    onChange={(e) => setDireccionManual(e.target.value)}
                                    placeholder="Ej: Calle Principal 123, esquina con Avenida Central..."
                                    maxLength={255}
                                    className="h-24 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{direccionManual.length}/255</p>
                            </div>

                            {/* Info */}
                            {/* <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                                💡 Haz clic en el mapa para seleccionar una ubicación. Puedes cambiar entre vista de mapa y satélite para mejor
                                precisión.
                            </div> */}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-shrink-0 gap-2 border-t bg-white p-4 dark:bg-gray-800">
                            <Button
                                onClick={handleGuardarUbicacion}
                                disabled={!ubicacionSeleccionada}
                                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                ✓ Guardar Ubicación
                            </Button>
                            <Button onClick={onClose} variant="outline" className="flex-1">
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

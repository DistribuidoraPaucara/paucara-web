import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Map as MapIcon, MapPin, Satellite } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Ubicacion {
    id: number;
    venta_id: number;
    venta_numero: string;
    cliente_nombre: string;
    cliente_telefono?: string;
    cliente_foto?: string;
    direccion: string;
    observaciones?: string;
    latitud?: number;
    longitud?: number;
    estado?: string;
    tipo_entrega?: 'COMPLETA' | 'CON_NOVEDAD';
    confirmacion_entrega?: {
        tipo_confirmacion?: string;
        total_dinero_recibido?: number;
        monto_pendiente?: number;
        confirmado_en?: string;
    };
}

interface UbicacionesMultiplesModalProps {
    isOpen: boolean;
    onClose: () => void;
    ubicaciones: Ubicacion[];
    titulo?: string;
}

export function UbicacionesMultiplesModal({ isOpen, onClose, ubicaciones, titulo = 'Ubicaciones de Entrega' }: UbicacionesMultiplesModalProps) {
    // ✅ DEBUG: Console log de datos
    console.log('🗺️ [UbicacionesMultiplesModal] Props recibidas:', {
        isOpen,
        ubicacionesCount: ubicaciones.length,
        titulo,
        ubicacionesDetalle: ubicaciones.map((u) => ({
            id: u.id,
            venta_id: u.venta_id,
            venta_numero: u.venta_numero,
            cliente_nombre: u.cliente_nombre,
            cliente_telefono: u.cliente_telefono,
            direccion: u.direccion,
            latitud: u.latitud,
            longitud: u.longitud,
            estado: u.estado,
            observaciones: u.observaciones,
        })),
        ubicacionesRaw: ubicaciones,
    });

    // ✅ NUEVO (2026-06-11): Estado para cambiar tipo de mapa
    const [tipoMapa, setTipoMapa] = useState<'osm' | 'satelite'>('osm');
    // ✅ NUEVO: Estado para panel de debug
    const [mostrarDebug, setMostrarDebug] = useState(false);

    // Calcular bounds del mapa para mostrar todos los puntos
    const mapBounds = useMemo(() => {
        const ubicacionesValidas = ubicaciones.filter((u) => u.latitud && u.longitud);
        if (ubicacionesValidas.length === 0) return null;

        const latitudes = ubicacionesValidas.map((u) => u.latitud!);
        const longitudes = ubicacionesValidas.map((u) => u.longitud!);

        return {
            north: Math.max(...latitudes),
            south: Math.min(...latitudes),
            east: Math.max(...longitudes),
            west: Math.min(...longitudes),
        };
    }, [ubicaciones]);

    // ✅ NUEVO: Generar HTML para el mapa con diferentes capas base
    const generateMapHTML = () => {
        const ubicacionesValidas = ubicaciones.filter((u) => u.latitud && u.longitud);
        if (ubicacionesValidas.length === 0) {
            return '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0;"><p>Sin coordenadas disponibles</p></div>';
        }

        // Calcular center
        const centerLat = ubicacionesValidas.reduce((sum, u) => sum + u.latitud!, 0) / ubicacionesValidas.length;
        const centerLng = ubicacionesValidas.reduce((sum, u) => sum + u.longitud!, 0) / ubicacionesValidas.length;

        // Generar JSON con datos de ubicaciones para evitar problemas de escape
        const ubicacionesJSON = JSON.stringify(
            ubicacionesValidas.map((u) => ({
                lat: u.latitud,
                lng: u.longitud,
                cliente: u.cliente_nombre || 'Cliente',
                venta: u.venta_numero || '',
                observaciones: u.observaciones || '',
                direccion: u.observaciones || '',
                venta_id: u.venta_id,
                tipo_entrega: u.tipo_entrega || 'COMPLETA',
                color: u.tipo_entrega === 'CON_NOVEDAD' ? '#f97316' : '#22c55e', // Naranja si CON_NOVEDAD, verde si COMPLETA
            })),
        );

        // ✅ NUEVO: Seleccionar capa base según tipo de mapa
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
                    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
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

                            var ubicaciones = ${ubicacionesJSON};
                            var bounds = null;

                            ubicaciones.forEach(function(u) {
                                var popupHTML = '<div style="font-size: 12px;"><b>' + u.cliente + '<\/b><br\/>Venta #' + u.venta + '<br\/>' + u.direccion + '<\/div>';

                                L.marker([u.lat, u.lng])
                                    .bindPopup(popupHTML)
                                    .addTo(map)
                                    .setIcon(L.divIcon({
                                        className: 'custom-marker',
                                        html: '<div style="background: ' + u.color + '; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 11px;">' + u.venta_id + '<\/div>',
                                        iconSize: [36, 36],
                                        iconAnchor: [18, 18]
                                    }));

                                if (!bounds) {
                                    bounds = L.latLngBounds([u.lat, u.lng], [u.lat, u.lng]);
                                } else {
                                    bounds.extend([u.lat, u.lng]);
                                }
                            });

                            if (bounds && ubicaciones.length > 1) {
                                map.fitBounds(bounds, { padding: [50, 50] });
                            }
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

    const ubicacionesValidas = ubicaciones.filter((u) => u.latitud && u.longitud);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex h-screen w-screen flex-col overflow-hidden p-0" style={{ maxWidth: '95vw', maxHeight: '95vh' }}>
                <DialogHeader className="flex-shrink-0 space-y-4 border-b bg-white px-6 pt-6 pb-4 dark:bg-gray-900">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <DialogTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                {titulo}
                            </DialogTitle>
                            <DialogDescription>
                                {ubicacionesValidas.length} punto{ubicacionesValidas.length !== 1 ? 's' : ''} de entrega en el mapa
                            </DialogDescription>
                        </div>

                        {/* ✅ NUEVO: Selector de tipo de mapa */}
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={tipoMapa === 'osm' ? 'default' : 'outline'}
                                onClick={() => setTipoMapa('osm')}
                                className="flex items-center gap-2"
                            >
                                <MapIcon className="h-4 w-4" />
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

                            {/* ✅ NUEVO: Botón de debug */}
                            {/* <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setMostrarDebug(!mostrarDebug)}
                                className="flex items-center gap-2 text-xs"
                                title="Mostrar datos de debug en la consola"
                            >
                                {mostrarDebug ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                Debug
                            </Button> */}
                        </div>
                    </div>

                    {/* ✅ NUEVO: Panel de debug */}
                    {mostrarDebug && (
                        <div className="mt-4 max-h-40 overflow-x-auto overflow-y-auto rounded border border-gray-700 bg-gray-900 p-3 font-mono text-xs text-gray-100">
                            <div className="mb-2 text-yellow-400">📋 Datos Recibidos:</div>
                            <div className="space-y-1">
                                <div>
                                    Total ubicaciones: <span className="text-cyan-400">{ubicaciones.length}</span>
                                </div>
                                <div>
                                    Con coordenadas: <span className="text-cyan-400">{ubicacionesValidas.length}</span>
                                </div>
                                <div>
                                    Título: <span className="text-cyan-400">"{titulo}"</span>
                                </div>
                            </div>
                            <div className="mt-3 border-t border-gray-700 pt-3">
                                <div className="mb-2 text-yellow-400">📍 Ubicaciones:</div>
                                {ubicaciones.length > 0 ? (
                                    <div className="space-y-2">
                                        {ubicaciones.map((u, idx) => (
                                            <div key={u.id} className="text-gray-300">
                                                <div>
                                                    [{idx + 1}] Venta #{u.venta_numero} - {u.cliente_nombre}
                                                </div>
                                                <div className="ml-4 text-gray-500">
                                                    📍 ({u.latitud || 'sin'}, {u.longitud || 'sin'}) | {u.direccion}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-red-400">Sin ubicaciones</div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogHeader>

                {/* Layout 2 columnas: Mapa (izquierda) + Listado (derecha) */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Columna 1: Mapa */}
                    <div className="flex-1 border-r">
                        {ubicacionesValidas.length > 0 ? (
                            <div className="relative h-full w-full">
                                <iframe key={tipoMapa} srcDoc={generateMapHTML()} className="h-full w-full border-0" title="Mapa de ubicaciones" />
                            </div>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                <p className="text-gray-500">No hay coordenadas disponibles para mostrar en el mapa</p>
                            </div>
                        )}
                    </div>

                    {/* Columna 2: Listado de ubicaciones */}
                    <div className="flex w-1/3 flex-col border-l bg-gray-50 dark:bg-gray-900">
                        <div className="sticky top-0 border-b bg-white px-6 py-4 dark:bg-gray-800">
                            <p className="text-sm font-semibold">Puntos de entrega ({ubicacionesValidas.length})</p>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <div className="space-y-2">
                                {ubicaciones.map((u) => {
                                    const pinColor = u.tipo_entrega === 'CON_NOVEDAD' ? 'bg-orange-600' : 'bg-green-600';
                                    const borderColor = u.tipo_entrega === 'CON_NOVEDAD' ? 'border-orange-200 dark:border-orange-900' : 'border-green-200 dark:border-green-900';
                                    const bgConfirmacion = u.tipo_entrega === 'CON_NOVEDAD' ? 'bg-orange-50 dark:bg-orange-950' : 'bg-green-50 dark:bg-green-950';

                                    return (
                                        <div
                                            key={u.id}
                                            className={`cursor-pointer rounded border ${borderColor} bg-white p-3 transition-shadow hover:shadow-md dark:bg-gray-800`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex flex-shrink-0 flex-col gap-2">
                                                    {u.latitud && u.longitud && (
                                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${pinColor} text-xs font-bold text-white`}>
                                                            {u.venta_id}
                                                        </div>
                                                    )}
                                                    {u.cliente_foto && (
                                                        <img
                                                            src={u.cliente_foto}
                                                            alt={u.cliente_nombre}
                                                            className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">{u.cliente_nombre}</div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">Folio #{u.venta_numero}</div>

                                                    {/* Tipo de entrega */}
                                                    {u.tipo_entrega && (
                                                        <div className={`mt-1 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                                                            u.tipo_entrega === 'CON_NOVEDAD'
                                                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        }`}>
                                                            {u.tipo_entrega === 'CON_NOVEDAD' ? '⚠️ Novedad' : '✓ Completa'}
                                                        </div>
                                                    )}

                                                    {/* Confirmación de entrega */}
                                                    {u.confirmacion_entrega && (
                                                        <div className={`mt-2 rounded p-2 text-xs ${bgConfirmacion}`}>
                                                            <div className="font-semibold text-gray-900 dark:text-white">Confirmación</div>
                                                            {u.confirmacion_entrega.tipo_confirmacion && (
                                                                <div className="text-gray-700 dark:text-gray-300">
                                                                    {u.confirmacion_entrega.tipo_confirmacion}
                                                                </div>
                                                            )}
                                                            {u.confirmacion_entrega.total_dinero_recibido !== undefined && (
                                                                <div className="text-gray-700 dark:text-gray-300">
                                                                    💵 {u.confirmacion_entrega.total_dinero_recibido.toFixed(2)} Bs.
                                                                </div>
                                                            )}
                                                            {u.confirmacion_entrega.monto_pendiente !== undefined && u.confirmacion_entrega.monto_pendiente > 0 && (
                                                                <div className="font-semibold text-orange-700 dark:text-orange-300">
                                                                    Pendiente: {u.confirmacion_entrega.monto_pendiente.toFixed(2)} Bs.
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {u.observaciones && (
                                                        <div className="mt-1 text-xs italic text-gray-500 dark:text-gray-500">
                                                            📝 {u.observaciones}
                                                        </div>
                                                    )}
                                                    {u.latitud && u.longitud ? (
                                                        <div className="mt-1 text-xs text-green-600 dark:text-green-400">✓ Con coordenadas</div>
                                                    ) : (
                                                        <div className="mt-1 text-xs text-red-600 dark:text-red-400">✗ Sin coordenadas</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

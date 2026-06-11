import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import { MapPin, Satellite, Map as MapIcon } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { useMemo, useState } from 'react';

interface Ubicacion {
    id: number;
    venta_id: number;
    venta_numero: string;
    cliente_nombre: string;
    cliente_telefono?: string;
    direccion: string;
    observaciones?: string;
    latitud?: number;
    longitud?: number;
    estado?: string;
}

interface UbicacionesMultiplesModalProps {
    isOpen: boolean;
    onClose: () => void;
    ubicaciones: Ubicacion[];
    titulo?: string;
}

export function UbicacionesMultiplesModal({
    isOpen,
    onClose,
    ubicaciones,
    titulo = "Ubicaciones de Entrega"
}: UbicacionesMultiplesModalProps) {
    // ✅ NUEVO (2026-06-11): Estado para cambiar tipo de mapa
    const [tipoMapa, setTipoMapa] = useState<'osm' | 'satelite'>('osm');

    // Calcular bounds del mapa para mostrar todos los puntos
    const mapBounds = useMemo(() => {
        const ubicacionesValidas = ubicaciones.filter(u => u.latitud && u.longitud);
        if (ubicacionesValidas.length === 0) return null;

        const latitudes = ubicacionesValidas.map(u => u.latitud!);
        const longitudes = ubicacionesValidas.map(u => u.longitud!);

        return {
            north: Math.max(...latitudes),
            south: Math.min(...latitudes),
            east: Math.max(...longitudes),
            west: Math.min(...longitudes),
        };
    }, [ubicaciones]);

    // ✅ NUEVO: Generar HTML para el mapa con diferentes capas base
    const generateMapHTML = () => {
        const ubicacionesValidas = ubicaciones.filter(u => u.latitud && u.longitud);
        if (ubicacionesValidas.length === 0) {
            return '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0;"><p>Sin coordenadas disponibles</p></div>';
        }

        // Calcular center
        const centerLat = ubicacionesValidas.reduce((sum, u) => sum + u.latitud!, 0) / ubicacionesValidas.length;
        const centerLng = ubicacionesValidas.reduce((sum, u) => sum + u.longitud!, 0) / ubicacionesValidas.length;

        // Generar marcadores
        const markers = ubicacionesValidas
            .map((u, idx) => `
                L.marker([${u.latitud}, ${u.longitud}])
                    .bindPopup('<div style="font-size: 12px;"><b>${u.cliente_nombre}</b><br/>Venta #${u.venta_numero}<br/>${u.direccion}</div>')
                    .addTo(map)
                    .setIcon(L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${idx + 1}</div>',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    }));
            `)
            .join('\n');

        // ✅ NUEVO: Seleccionar capa base según tipo de mapa
        const tileLayer = tipoMapa === 'satelite'
            ? `L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri, DigitalGlobe, Earthstar Geographics',
                maxZoom: 18
            }).addTo(map);`
            : `L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);`;

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
                <style>
                    body { margin: 0; padding: 0; }
                    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    var map = L.map('map').setView([${centerLat}, ${centerLng}], 14);
                    ${tileLayer}

                    ${markers}

                    // Ajustar vista para mostrar todos los marcadores
                    map.fitBounds([
                        [${Math.min(...ubicacionesValidas.map(u => u.latitud!))}, ${Math.min(...ubicacionesValidas.map(u => u.longitud!))}],
                        [${Math.max(...ubicacionesValidas.map(u => u.latitud!))}, ${Math.max(...ubicacionesValidas.map(u => u.longitud!))}]
                    ], { padding: [50, 50] });
                </script>
            </body>
            </html>
        `;
    };

    const ubicacionesValidas = ubicaciones.filter(u => u.latitud && u.longitud);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 space-y-4">
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
                        </div>
                    </div>
                </DialogHeader>

                {ubicacionesValidas.length > 0 ? (
                    <div className="w-full h-[60vh] relative">
                        <iframe
                            key={tipoMapa}
                            srcDoc={generateMapHTML()}
                            className="w-full h-full border-0"
                            title="Mapa de ubicaciones"
                        />
                    </div>
                ) : (
                    <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                        <p className="text-gray-500">No hay coordenadas disponibles para mostrar en el mapa</p>
                    </div>
                )}

                {/* Lista de ubicaciones en la parte inferior */}
                <div className="px-6 pb-6 pt-4 border-t max-h-40 overflow-y-auto">
                    <p className="text-sm font-semibold mb-3">Puntos de entrega:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {ubicaciones.map((u, idx) => (
                            <div key={u.id} className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                                <div className="font-bold text-blue-600">
                                    {u.latitud && u.longitud && <span className="text-lg mr-1">{idx + 1}.</span>}
                                    {u.cliente_nombre}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    Venta #{u.venta_numero}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 line-clamp-1">
                                    {u.direccion}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

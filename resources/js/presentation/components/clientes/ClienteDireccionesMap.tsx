import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { MapIcon, MapPin, Satellite, Trash2, Edit2, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';

interface ClienteDireccion {
    id?: number;
    direccion?: string;
    observaciones?: string;
    latitud?: number;
    longitud?: number;
    es_principal?: boolean;
}

interface ClienteDireccionesMapProps {
    direcciones: ClienteDireccion[];
    onDireccionesChange: (direcciones: ClienteDireccion[]) => void;
    disabled?: boolean;
}

export function ClienteDireccionesMap({
    direcciones: initialDirecciones,
    onDireccionesChange,
    disabled = false
}: ClienteDireccionesMapProps) {
    const [direcciones, setDirecciones] = useState<ClienteDireccion[]>(initialDirecciones);
    const [tipoMapa, setTipoMapa] = useState<'osm' | 'satelite'>('osm');
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<ClienteDireccion>({});
    const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    // Obtener ubicación actual del usuario
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    console.log('📍 Ubicación obtenida:', position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.log('❌ Error obteniendo ubicación:', error.message);
                    // Fallback a coordenadas por defecto
                }
            );
        }
    }, []);

    const direccionesValidas = direcciones.filter((d) => d.latitud && d.longitud);

    // Generar HTML del mapa
    const generateMapHTML = () => {
        // Calcular center - usar ubicación actual, luego direcciones, luego defecto
        let centerLat = userLocation?.lat ?? -17.78629;
        let centerLng = userLocation?.lng ?? -63.18117;

        if (direccionesValidas.length > 0) {
            centerLat = direccionesValidas.reduce((sum, d) => sum + d.latitud!, 0) / direccionesValidas.length;
            centerLng = direccionesValidas.reduce((sum, d) => sum + d.longitud!, 0) / direccionesValidas.length;
        }

        const direccionesJSON = JSON.stringify(
            direccionesValidas.map((d, idx) => ({
                id: d.id || idx,
                lat: d.latitud,
                lng: d.longitud,
                direccion: d.direccion || 'Sin descripción',
                observaciones: d.observaciones || '',
                esPrincipal: d.es_principal ? '⭐ Principal' : '',
                color: d.es_principal ? '#3b82f6' : '#22c55e',
            }))
        );

        const tileUrl =
            tipoMapa === 'satelite'
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const attribution = tipoMapa === 'satelite' ? '© Esri, DigitalGlobe' : 'Distribuidora Paucara';

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

                            var direcciones = ${direccionesJSON};
                            var bounds = null;

                            // Agregar marcadores existentes
                            direcciones.forEach(function(d, idx) {
                                var popupHTML = '<div style="font-size: 12px;"><b>' + d.direccion + '<\/b><br\/>' + d.esPrincipal + '<br\/>' + d.observaciones + '<\/div>';

                                L.marker([d.lat, d.lng])
                                    .bindPopup(popupHTML)
                                    .addTo(map)
                                    .setIcon(L.divIcon({
                                        className: 'custom-marker',
                                        html: '<div style="background: ' + d.color + '; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 14px;">' + (idx + 1) + '<\/div>',
                                        iconSize: [36, 36],
                                        iconAnchor: [18, 18]
                                    }));

                                if (!bounds) {
                                    bounds = L.latLngBounds([d.lat, d.lng], [d.lat, d.lng]);
                                } else {
                                    bounds.extend([d.lat, d.lng]);
                                }
                            });

                            // Ajustar bounds si hay múltiples marcadores
                            if (bounds && direcciones.length > 1) {
                                map.fitBounds(bounds, { padding: [50, 50] });
                            }

                            // Mostrar overlay si no hay direcciones
                            if (direcciones.length === 0) {
                                var overlay = document.createElement('div');
                                overlay.style.position = 'absolute';
                                overlay.style.top = '50%';
                                overlay.style.left = '50%';
                                overlay.style.transform = 'translate(-50%, -50%)';
                                overlay.style.zIndex = '500';
                                overlay.innerHTML = '<div style="background: rgba(0,0,0,0.8); color: white; padding: 20px 30px; border-radius: 8px; font-size: 16px; text-align: center; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">📍 Haz clic en el mapa para agregar una dirección</div>';
                                map._container.appendChild(overlay);
                            }

                            // Listener para click en el mapa
                            map.on('click', function(e) {
                                var msg = 'lat:' + e.latlng.lat.toFixed(5) + '|lng:' + e.latlng.lng.toFixed(5);
                                console.log('📍 Click en mapa:', msg);
                                parent.postMessage({ type: 'mapClick', data: msg }, '*');
                            });

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

    // Manejar clicks del mapa
    const handleMapMessage = (event: MessageEvent) => {
        if (event.data.type === 'mapClick') {
            const [lat, lng] = event.data.data.split('|').map((coord: string) => parseFloat(coord.split(':')[1]));
            setClickedCoords({ lat, lng });
            setEditingIndex(null);
            setFormData({ latitud: lat, longitud: lng, es_principal: false });
            setShowFormModal(true);
        }
    };

    React.useEffect(() => {
        window.addEventListener('message', handleMapMessage);
        return () => window.removeEventListener('message', handleMapMessage);
    }, []);

    const handleSaveDireccion = () => {
        if (!formData.latitud || !formData.longitud) {
            alert('Falta seleccionar ubicación en el mapa');
            return;
        }

        let newDirecciones: ClienteDireccion[];
        if (editingIndex !== null) {
            newDirecciones = [...direcciones];
            newDirecciones[editingIndex] = formData;
        } else {
            newDirecciones = [...direcciones, { id: Date.now(), ...formData }];
        }

        setDirecciones(newDirecciones);
        onDireccionesChange(newDirecciones);

        setShowFormModal(false);
        setFormData({});
        setClickedCoords(null);
    };

    const handleEditDireccion = (index: number) => {
        setEditingIndex(index);
        setFormData(direcciones[index]);
        setClickedCoords(null);
        setShowFormModal(true);
    };

    const handleDeleteDireccion = (index: number) => {
        if (confirm('¿Eliminar esta dirección?')) {
            const newDirecciones = direcciones.filter((_, i) => i !== index);
            setDirecciones(newDirecciones);
            onDireccionesChange(newDirecciones);
        }
    };

    return (
        <div className="flex h-[500px] gap-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
            {/* Mapa */}
            <div className="flex-1 relative">
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setTipoMapa('osm')}
                        className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                            tipoMapa === 'osm'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                        }`}
                    >
                        <MapIcon className="h-4 w-4" /> Mapa
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipoMapa('satelite')}
                        className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                            tipoMapa === 'satelite'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                        }`}
                    >
                        <Satellite className="h-4 w-4" /> Satélite
                    </button>
                </div>
                <iframe
                    key={tipoMapa}
                    srcDoc={generateMapHTML()}
                    className="w-full h-full border-0"
                    title="Mapa de direcciones"
                />
            </div>

            {/* Lista de direcciones */}
            <div className="w-80 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-sm font-semibold">Direcciones ({direcciones.length})</span>
                    <button
                        type="button"
                        onClick={() => {
                            setEditingIndex(null);
                            setFormData({ es_principal: false });
                            setShowFormModal(true);
                        }}
                        disabled={disabled}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 rounded text-blue-600 dark:text-blue-400"
                        title="Agregar nueva dirección"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {direcciones.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            Haz clic en el mapa o en el botón (+) para agregar una dirección
                        </div>
                    ) : (
                        <div className="space-y-2 p-3">
                            {direcciones.map((d, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                                d.es_principal ? 'bg-blue-600' : 'bg-green-600'
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            {d.es_principal && <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">⭐ Principal</span>}
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditDireccion(idx)}
                                                disabled={disabled}
                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                title="Editar"
                                            >
                                                <Edit2 className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteDireccion(idx)}
                                                disabled={disabled}
                                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                                        {/* <div className="font-medium">{d.direccion || 'Sin descripción'}</div> */}
                                        {d.observaciones && <div className="text-gray-500 italic">{d.observaciones}</div>}
                                        {d.latitud && d.longitud && (
                                            <div className="text-gray-400 text-xs">
                                                📍 {d.latitud.toFixed(4)}, {d.longitud.toFixed(4)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar dirección */}
            {showFormModal && (
                <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingIndex !== null ? 'Editar Dirección' : 'Nueva Dirección'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {formData.latitud && formData.longitud && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
                                    📍 {formData.latitud.toFixed(4)}, {formData.longitud.toFixed(4)}
                                </div>
                            )}
                            {/* <div>
                                <label className="text-sm font-medium">Descripción</label>
                                <input
                                    type="text"
                                    value={formData.direccion || ''}
                                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                    placeholder="Ej: Calle Principal #123"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                />
                            </div> */}
                            <div>
                                <label className="text-sm font-medium">Observaciones</label>
                                <textarea
                                    value={formData.observaciones || ''}
                                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                    placeholder="Ej: Casa roja, junto a la tienda"
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                                    rows={3}
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.es_principal || false}
                                    onChange={(e) => setFormData({ ...formData, es_principal: e.target.checked })}
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-sm font-medium">Marcar como principal</span>
                            </label>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveDireccion}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}

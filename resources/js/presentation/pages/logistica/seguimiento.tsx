import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { toast } from 'react-toastify';

interface Envio {
    id: number;
    numero_seguimiento: string;
    estado: string;
    fecha_envio?: string;
    fecha_entrega_estimada?: string;
    direccion_entrega: string;
    cliente_nombre: string;
    ubicacion_actual?: {
        latitud: number;
        longitud: number;
        direccion: string;
    };
    historial_seguimiento?: Array<{
        estado: string;
        fecha: string;
        descripcion: string;
        ubicacion?: string;
    }>;
}

interface Props {
    envio: Envio;
}

export default function SeguimientoEnvio({ envio }: Props) {
    const [ubicacionActual, setUbicacionActual] = useState<{ lat: number, lng: number } | null>(
        envio.ubicacion_actual ? {
            lat: envio.ubicacion_actual.latitud,
            lng: envio.ubicacion_actual.longitud
        } : null
    );
    const [actualizandoUbicacion, setActualizandoUbicacion] = useState(false);

    const obtenerUbicacion = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocalización no disponible');
            return;
        }

        setActualizandoUbicacion(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const nuevaUbicacion = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUbicacionActual(nuevaUbicacion);
                actualizarUbicacionEnvio(nuevaUbicacion);
                setActualizandoUbicacion(false);
            },
            (error) => {
                toast.error('Error al obtener ubicación: ' + error.message);
                setActualizandoUbicacion(false);
            }
        );
    };

    const actualizarUbicacionEnvio = async (ubicacion: { lat: number, lng: number }) => {
        try {
            const response = await fetch(`/api/dashboard/envios/${envio.id}/ubicacion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    latitud: ubicacion.lat,
                    longitud: ubicacion.lng
                }),
            });

            if (response.ok) {
                toast.success('Ubicación actualizada');
            } else {
                toast.error('Error al actualizar ubicación');
            }
        } catch {
            toast.error('Error de conexión');
        }
    };

    const actualizarEstado = async (nuevoEstado: string) => {
        try {
            const response = await fetch(`/api/dashboard/envios/${envio.id}/estado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    estado: nuevoEstado
                }),
            });

            if (response.ok) {
                toast.success('Estado actualizado');
                window.location.reload(); // Recargar para mostrar cambios
            } else {
                toast.error('Error al actualizar estado');
            }
        } catch {
            toast.error('Error de conexión');
        }
    };

    const getEstadoBadgeVariant = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'pendiente': return 'outline';
            case 'en_transito': return 'default';
            case 'entregado': return 'secondary'; // Cambio success por secondary
            case 'cancelado': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <>
            <Head title={`Seguimiento - ${envio.numero_seguimiento}`} />

            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Seguimiento de Envío
                                </h1>
                                <p className="text-lg text-gray-600 mt-1">
                                    {envio.numero_seguimiento}
                                </p>
                                <p className="text-gray-500">
                                    Cliente: {envio.cliente_nombre}
                                </p>
                            </div>
                            <Badge variant={getEstadoBadgeVariant(envio.estado)}>
                                {envio.estado.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    {/* Información del Envío */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del Envío</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <label className="font-medium text-gray-700">Dirección de Entrega:</label>
                                    <p className="text-gray-600">{envio.direccion_entrega}</p>
                                </div>
                                {envio.fecha_envio && (
                                    <div>
                                        <label className="font-medium text-gray-700">Fecha de Envío:</label>
                                        <p className="text-gray-600">{envio.fecha_envio}</p>
                                    </div>
                                )}
                                {envio.fecha_entrega_estimada && (
                                    <div>
                                        <label className="font-medium text-gray-700">Entrega Estimada:</label>
                                        <p className="text-gray-600">{envio.fecha_entrega_estimada}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Ubicación Actual */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ubicación Actual</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {ubicacionActual ? (
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Lat: {ubicacionActual.lat.toFixed(6)}<br />
                                            Lng: {ubicacionActual.lng.toFixed(6)}
                                        </p>
                                        {envio.ubicacion_actual?.direccion && (
                                            <p className="text-gray-700">{envio.ubicacion_actual.direccion}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Ubicación no disponible</p>
                                )}

                                <Button
                                    onClick={obtenerUbicacion}
                                    disabled={actualizandoUbicacion}
                                    className="w-full"
                                >
                                    {actualizandoUbicacion ? 'Actualizando...' : 'Actualizar Ubicación'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Acciones de Estado */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actualizar Estado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => actualizarEstado('EN_TRANSITO')}
                                    variant="outline"
                                    disabled={envio.estado === 'EN_TRANSITO'}
                                >
                                    En Tránsito
                                </Button>
                                <Button
                                    onClick={() => actualizarEstado('ENTREGADO')}
                                    variant="default"
                                    disabled={envio.estado === 'ENTREGADO'}
                                >
                                    Marcar como Entregado
                                </Button>
                                <Button
                                    onClick={() => actualizarEstado('INCIDENCIA')}
                                    variant="destructive"
                                    disabled={envio.estado === 'INCIDENCIA'}
                                >
                                    Reportar Incidencia
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Historial de Seguimiento */}
                    {envio.historial_seguimiento && envio.historial_seguimiento.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Historial de Seguimiento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {envio.historial_seguimiento.map((item, index) => (
                                        <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Badge variant="outline" className="mb-1">
                                                        {item.estado.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                    <p className="text-gray-700">{item.descripcion}</p>
                                                    {item.ubicacion && (
                                                        <p className="text-sm text-gray-500">{item.ubicacion}</p>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500">{item.fecha}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

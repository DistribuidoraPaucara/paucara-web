/**
 * Presentación: EntregaFlujoCarga
 *
 * Componente para gestionar el flujo de carga de una entrega:
 * PREPARACION_CARGA → EN_CARGA → LISTO_PARA_ENTREGA → EN_TRANSITO → ENTREGADO
 *
 * ARQUITECTURA LIMPIA:
 * ✅ Solo renderiza UI
 * ✅ Maneja transiciones de estado
 */

import { useState, useMemo } from 'react';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import {
    CheckCircle,
    AlertCircle,
    MapPin,
    Truck,
    Loader,
    Package,
} from 'lucide-react';
import type { Entrega } from '@/domain/entities/entregas';
import type { Estado } from '@/domain/entities/estados-centralizados';
import { useEstadosContext } from '@/application/contexts/EstadosContext';
import { FALLBACK_ESTADOS_ENTREGA } from '@/domain/entities/estados-centralizados';
import UbicacionMapa from './UbicacionMapa';

interface EntregaFlujoCargoProps {
    entrega: Entrega;
    onStateChange?: (newState: string) => void;
}

export default function EntregaFlujoCarga({
    entrega,
    onStateChange,
}: EntregaFlujoCargoProps) {
    const { getEstadosPorCategoria } = useEstadosContext();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutoGeolocating, setIsAutoGeolocating] = useState(false);

    /**
     * Mapea códigos de estado a iconos de lucide-react
     */
    const getIconForEstado = (codigo: string) => {
        const iconMap: Record<string, typeof Package> = {
            PREPARACION_CARGA: Package,
            EN_CARGA: Truck,
            LISTO_PARA_ENTREGA: CheckCircle,
            EN_TRANSITO: MapPin,
            EN_CAMINO: Truck,
            ENTREGADO: CheckCircle,
            PROGRAMADO: Package,
            ASIGNADA: Truck,
        };
        return iconMap[codigo] || Package;
    };

    /**
     * Convierte color hexadecimal a clases de Tailwind
     * Fallback a clases genéricas si no se puede convertir
     */
    const getColorClasses = (hexColor?: string) => {
        if (!hexColor) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';

        // Mapeo simple de colores comunes a clases Tailwind
        const colorMap: Record<string, string> = {
            '#FFC107': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
            '#0275D8': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
            '#9C27B0': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
            '#673AB7': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
            '#3F51B5': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
            '#2196F3': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
            '#03A9F4': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
            '#00BCD4': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
            '#28A745': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
            '#FF9800': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
            '#F44336': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
            '#6C757D': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
        };

        return colorMap[hexColor] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    };

    /**
     * Obtiene los estados de entrega desde la tabla estados_logistica
     * Ordenados por el campo `orden`
     * Usa fallback si el contexto aún no ha cargado
     */
    const flujoEstados = useMemo(() => {
        const estadosDelContexto = getEstadosPorCategoria('entrega');
        // Usar el array del contexto si tiene datos, sino usar el fallback
        const estados = estadosDelContexto.length > 0 ? estadosDelContexto : FALLBACK_ESTADOS_ENTREGA;

        return estados
            .sort((a, b) => a.orden - b.orden)
            .map((estado: Estado) => ({
                estado: estado.codigo,
                label: estado.nombre,
                descripcion: estado.descripcion || '',
                icon: getIconForEstado(estado.codigo),
                color: getColorClasses(estado.color),
                estado_obj: estado,
            }));
    }, [getEstadosPorCategoria]);

    // Obtener el código del estado actual
    // Prioridad: estado_entrega_codigo > estado_entrega.codigo > estado
    const estadoActual = entrega.estado_entrega_codigo ?? entrega.estado_entrega?.codigo ?? entrega.estado;
    const currentStateIndex = flujoEstados.findIndex((e) => e.estado === estadoActual);
    const currentState = flujoEstados[currentStateIndex];

    const handleConfirmarCarga = async () => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`/api/entregas/${entrega.id}/confirmar-carga`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                let errorMsg = `Error confirmando carga (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                    console.error('❌ [EntregaFlujoCarga] Error confirmando carga:', {
                        status: response.status,
                        message: errorData.message,
                        errors: errorData.errors,
                        fullResponse: errorData,
                    });
                } catch {
                    console.error('❌ [EntregaFlujoCarga] Error confirmando carga (no JSON):', response.statusText);
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log('✅ [EntregaFlujoCarga] Carga confirmada exitosamente:', result);
            if (result.success) {
                onStateChange?.('EN_CARGA');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('❌ [EntregaFlujoCarga] Error capturado:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const obtenerGeolocalización = (): Promise<{ latitud: number; longitud: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no disponible en tu navegador'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                    });
                    console.log('✅ [EntregaFlujoCarga] Geolocalización obtenida:', {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    });
                },
                (error) => {
                    console.warn('⚠️ [EntregaFlujoCarga] Error obteniendo geolocalización:', error.message);
                    // Usar ubicación por defecto si falla
                    resolve({
                        latitud: 0,
                        longitud: 0,
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    };

    // Ejecutar flujo automático: obtener ubicación e iniciar tránsito sin pasar por LISTO_PARA_ENTREGA
    const ejecutarFlujoAutomatico = async () => {
        setIsAutoGeolocating(true);
        setError(null);
        console.log('🔍 [EntregaFlujoCarga] Iniciando flujo automático: obteniendo geolocalización...');
        try {
            const geoLocation = await obtenerGeolocalización();
            console.log('📍 [EntregaFlujoCarga] Ubicación obtenida:', geoLocation);
            console.log('🚀 [EntregaFlujoCarga] Iniciando tránsito automáticamente...');
            await iniciarTransitoAutomatico(geoLocation);
        } catch (geoError) {
            console.warn('⚠️ [EntregaFlujoCarga] Error obteniendo geolocalización, usando 0,0:', geoError);
            // Iniciar tránsito incluso sin ubicación válida
            await iniciarTransitoAutomatico({ latitud: 0, longitud: 0 });
        } finally {
            setIsAutoGeolocating(false);
        }
    };

    const handleMarcarListoParaEntrega = async () => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`/api/entregas/${entrega.id}/listo-para-entrega`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                let errorMsg = `Error marcando como listo (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                    console.error('❌ [EntregaFlujoCarga] Error marcando como listo:', {
                        status: response.status,
                        message: errorData.message,
                        errors: errorData.errors,
                    });
                } catch {
                    console.error('❌ [EntregaFlujoCarga] Error marcando como listo (no JSON):', response.statusText);
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log('✅ [EntregaFlujoCarga] Marcado como LISTO_PARA_ENTREGA');
            if (result.success) {
                onStateChange?.('LISTO_PARA_ENTREGA');
                // Ejecutar flujo automático después de marcar como listo
                await ejecutarFlujoAutomatico();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('❌ [EntregaFlujoCarga] Error:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const iniciarTransitoAutomatico = async (geoLocation: { latitud: number; longitud: number }) => {
        try {
            const response = await fetch(`/api/entregas/${entrega.id}/iniciar-transito`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    latitud: geoLocation.latitud,
                    longitud: geoLocation.longitud,
                }),
            });

            if (!response.ok) {
                let errorMsg = `Error iniciando tránsito (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    // Sin error message
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log('✅ [EntregaFlujoCarga] Tránsito iniciado automáticamente:', result);
            if (result.success) {
                // Actualizar ubicación inmediatamente en el objeto entrega
                entrega.latitud = geoLocation.latitud;
                entrega.longitud = geoLocation.longitud;
                console.log('📍 [EntregaFlujoCarga] Ubicación actualizada en entrega:', { latitud: geoLocation.latitud, longitud: geoLocation.longitud });
                onStateChange?.('EN_TRANSITO');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('❌ [EntregaFlujoCarga] Error iniciando tránsito automático:', errorMessage);
        }
    };

    /* const handleIniciarTransito = async () => {
        if (gpsData.latitud === 0 || gpsData.longitud === 0) {
            setError('Ingrese coordenadas GPS válidas');
            return;
        }

        try {
            setError(null);
            setIsLoading(true);
            await iniciarTransitoAutomatico(gpsData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('❌ [EntregaFlujoCarga] Error capturado:', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }; */

    if (!currentState) {
        return (
            <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                            Estado no configurado
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            El estado "{estadoActual}" no está disponible en el flujo de carga.
                            Por favor, contacte al administrador.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Estado Actual */}
            <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Estado Actual de la Entrega
                </h3>
                <div className="flex items-center gap-4">
                    <currentState.icon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    <div>
                        <Badge className={currentState.color}>
                            {currentState.label}
                        </Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {currentState.descripcion}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Errores */}
            {error && (
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                </Card>
            )}

            {/* Timeline de Flujo */}
            <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
                    Flujo de Carga
                </h3>

                <div className="relative">
                    {/* Línea de progreso */}
                    <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200 dark:bg-slate-700" />

                    {/* Pasos */}
                    <div className="space-y-6 relative z-10">
                        {flujoEstados.map((paso, index) => {
                            const isCompleted = index < currentStateIndex;
                            const isCurrent = index === currentStateIndex;
                            const isPending = index > currentStateIndex;
                            const PasoIcon = paso.icon;

                            return (
                                <div key={paso.estado} className="flex gap-4">
                                    {/* Indicador */}
                                    <div
                                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                            ? 'bg-green-500'
                                            : isCurrent
                                                ? 'bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-900'
                                                : 'bg-gray-300 dark:bg-slate-600'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-5 h-5 text-white" />
                                        ) : (
                                            <PasoIcon className="w-4 h-4 text-white" />
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 pb-6">
                                        <h4
                                            className={`font-medium ${isCurrent
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : isCompleted
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {paso.label}
                                        </h4>
                                        <p
                                            className={`text-sm mt-1 ${isPending
                                                ? 'text-gray-400 dark:text-gray-500'
                                                : 'text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {paso.descripcion}
                                        </p>

                                        {/* Acciones para estado actual */}
                                        {isCurrent && (
                                            <div className="mt-4">
                                                {paso.estado === 'PREPARACION_CARGA' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={handleConfirmarCarga}

                                                    >
                                                        Confirmar Carga
                                                    </Button>
                                                )}

                                                {paso.estado === 'EN_CARGA' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={handleMarcarListoParaEntrega}

                                                    >
                                                        Marcar Listo
                                                    </Button>
                                                )}

                                                {paso.estado === 'LISTO_PARA_ENTREGA' && (
                                                    <>
                                                        {isAutoGeolocating ? (
                                                            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                                <Loader className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                                                                <span className="text-sm text-blue-600 dark:text-blue-400">
                                                                    Obteniendo ubicación e iniciando tránsito automáticamente...
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                onClick={ejecutarFlujoAutomatico}
                                                                disabled={isAutoGeolocating}
                                                            >
                                                                <MapPin className="w-4 h-4 mr-2" />
                                                                Reintentar Flujo Automático
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Mapa de ubicación en tiempo real (si está en tránsito) */}
            {(entrega.estado_entrega_codigo ?? entrega.estado) === 'EN_TRANSITO' && (
                <Card className="p-6">
                    <UbicacionMapa
                        ventas={entrega.ventas || []}
                        latitud={entrega.latitud || 0}
                        longitud={entrega.longitud || 0}
                        nombreChofer={entrega.chofer?.nombre}
                        placa={entrega.vehiculo?.placa}
                        entregaId={entrega.id}
                    />
                </Card>
            )}
        </div>
    );
}

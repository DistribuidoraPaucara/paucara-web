import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { Badge } from '@/presentation/components/ui/badge';
import {
    Truck,
    MapPin,
    Clock,
    Navigation,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Users,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import type { Entrega, UbicacionEntrega } from '@/domain/entities/logistica';
import type { Id } from '@/domain/entities/shared';
import VentaEnEntregaCard from './VentaEnEntregaCard';
import EntregaDetalleModal from './EntregaDetalleModal';

type SortOption = 'tiempo' | 'distancia' | 'estado' | 'velocidad';

interface TrackingPanelProps {
    entregas: Entrega[];
    ubicaciones: Map<Id, UbicacionEntrega>;
    onEntregaClick?: (entregaId: number) => void;
    onFollowClick?: (entregaId: number) => void;
    followingId?: number | null;
    height?: string;
}

/**
 * Helper: Obtener etiqueta del estado
 */
function getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
        PROGRAMADO: 'Programada',
        ASIGNADA: 'Asignada',
        EN_CAMINO: 'En Camino',
        LLEGO: 'Llegó',
        ENTREGADO: 'Entregado',
        NOVEDAD: 'Novedad',
        CANCELADA: 'Cancelada',
    };
    return labels[estado] || estado;
}

/**
 * Helper: Obtener color del estado
 */
function getEstadoColorClass(estado: string): string {
    const colors: Record<string, string> = {
        PROGRAMADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
        ASIGNADA: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
        EN_CAMINO: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
        LLEGO: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
        ENTREGADO: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
        NOVEDAD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
        CANCELADA: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200';
}

/**
 * Componente TrackingPanel
 *
 * Panel lateral mostrando lista de entregas en tiempo real
 * - Ordenamiento por tiempo, distancia, estado o velocidad
 * - Indicadores visuales de estado
 * - Click para seleccionar/enfocar en mapa
 * - Botón para seguir una entrega (follow mode)
 *
 * @example
 * <TrackingPanel
 *     entregas={entregas}
 *     ubicaciones={ubicaciones}
 *     onEntregaClick={(id) => console.log(id)}
 *     followingId={123}
 * />
 */
export function TrackingPanel({
    entregas,
    ubicaciones,
    onEntregaClick,
    onFollowClick,
    followingId,
    height = '600px',
}: TrackingPanelProps) {
    const [sortBy, setSortBy] = useState<SortOption>('tiempo');
    const [expandedEntregaId, setExpandedEntregaId] = useState<number | null>(null);
    const [modalEntrega, setModalEntrega] = useState<Entrega | null>(null);

    const entregasOrdenadas = useMemo(() => {
        const entregas_copy = [...entregas];

        switch (sortBy) {
            case 'velocidad': {
                return entregas_copy.sort((a, b) => {
                    const velA = ubicaciones.get(a.id)?.velocidad ?? 0;
                    const velB = ubicaciones.get(b.id)?.velocidad ?? 0;
                    return velB - velA; // Mayor velocidad primero
                });
            }

            case 'distancia': {
                return entregas_copy.sort((a, b) => {
                    // Intentar calcular distancia basada en coordenadas (simple)
                    const ubA = ubicaciones.get(a.id);
                    const ubB = ubicaciones.get(b.id);
                    if (!ubA || !ubB) return 0;

                    // Usar valor absoluto de coordenadas como proxy (no es exacto pero da ordenamiento)
                    const distA = Math.abs(ubA.latitud) + Math.abs(ubA.longitud);
                    const distB = Math.abs(ubB.latitud) + Math.abs(ubB.longitud);
                    return distA - distB;
                });
            }

            case 'estado': {
                const estadoOrder = [
                    'EN_CAMINO',
                    'ASIGNADA',
                    'LLEGO',
                    'PROGRAMADO',
                    'ENTREGADO',
                    'NOVEDAD',
                    'CANCELADA',
                ];
                return entregas_copy.sort((a, b) => {
                    const orderA = estadoOrder.indexOf(a.estado);
                    const orderB = estadoOrder.indexOf(b.estado);
                    return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
                });
            }

            case 'tiempo':
            default: {
                return entregas_copy.sort((a, b) => {
                    const fechaA = new Date(a.fecha_inicio || a.fecha_creacion || 0).getTime();
                    const fechaB = new Date(b.fecha_inicio || b.fecha_creacion || 0).getTime();
                    return fechaB - fechaA; // Más reciente primero
                });
            }
        }
    }, [entregas, sortBy, ubicaciones]);

    return (
        <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-3 border-b">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            Entregas en Tránsito
                            <span className="ml-2 inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {entregas.length}
                            </span>
                        </CardTitle>
                    </div>

                    <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-2">
                            Ordenar por:
                        </label>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                            <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tiempo">Tiempo (Reciente)</SelectItem>
                                <SelectItem value="velocidad">Velocidad (Mayor)</SelectItem>
                                <SelectItem value="estado">Estado</SelectItem>
                                <SelectItem value="distancia">Distancia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
                {entregas.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                        <div>
                            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">
                                No hay entregas en tránsito
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="space-y-2 p-3">
                            {entregasOrdenadas.map((entrega) => {
                                const ubicacion = ubicaciones.get(entrega.id);
                                const isFollowing = followingId === entrega.id;
                                const isExpanded = expandedEntregaId === entrega.id;

                                return (
                                    <div
                                        key={entrega.id}
                                        className={`
                                            group relative rounded-lg border transition-all
                                            ${isFollowing
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 shadow-md'
                                                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:shadow-sm'
                                            }
                                        `}
                                    >
                                        {/* ✅ SECCIÓN 1: Header Principal - Resumen de la Entrega */}
                                        <div
                                            className="p-3 cursor-pointer"
                                            onClick={() => onEntregaClick?.(entrega.id)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                                                        #{entrega.id}
                                                    </span>
                                                    {entrega.numero_entrega && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {entrega.numero_entrega}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getEstadoColorClass(entrega.estado)}>
                                                        {getEstadoLabel(entrega.estado)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* ✅ NUEVO: Resumen de Ventas */}
                                            <div className="mb-2 flex items-center gap-4 text-xs">
                                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                    <Users className="h-3 w-3" />
                                                    <span>{entrega.cantidad_ventas} venta{entrega.cantidad_ventas !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span className="font-semibold">Bs. {entrega.total_consolidado.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* ✅ NUEVO: Clientes de la entrega */}
                                            {entrega.clientes_nombres && entrega.clientes_nombres.length > 0 && (
                                                <div className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Clientes:</span>{' '}
                                                    {entrega.clientes_nombres.join(', ')}
                                                </div>
                                            )}

                                            {/* Información de ubicación y velocidad */}
                                            {ubicacion ? (
                                                <div className="space-y-2 text-xs">
                                                    {/* Velocidad y tiempo */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                            <Navigation className="h-3 w-3" />
                                                            <span className="font-semibold">
                                                                {ubicacion.velocidad?.toFixed(1) || '0'} km/h
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                            <Clock className="h-3 w-3" />
                                                            <span>
                                                                {new Date(ubicacion.timestamp).toLocaleTimeString(
                                                                    'es-ES',
                                                                    {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Ubicación */}
                                                    <div className="flex items-start gap-1 text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs">
                                                            {ubicacion.latitud.toFixed(4)}, {ubicacion.longitud.toFixed(4)}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-amber-600 dark:text-amber-400">
                                                    Sin ubicación registrada
                                                </div>
                                            )}
                                        </div>

                                        {/* ✅ NUEVO: Botones de acción */}
                                        <div className="flex items-center justify-between px-3 pb-2 gap-1 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            {/* Botón expandir/contraer ventas */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1 h-7 text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedEntregaId(isExpanded ? null : entrega.id);
                                                }}
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        <ChevronUp className="h-3 w-3 mr-1" />
                                                        Contraer
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="h-3 w-3 mr-1" />
                                                        Ver Detalles
                                                    </>
                                                )}
                                            </Button>

                                            {/* Botón abrir modal completo */}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1 h-7 text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalEntrega(entrega);
                                                }}
                                            >
                                                Expandir
                                            </Button>

                                            {/* Botón de seguimiento - visible al hover */}
                                            {onFollowClick && ubicacion && (
                                                <Button
                                                    size="sm"
                                                    variant={isFollowing ? 'default' : 'ghost'}
                                                    className="h-7 w-7 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onFollowClick(entrega.id);
                                                    }}
                                                    title={isFollowing ? 'Dejar de seguir' : 'Seguir entrega'}
                                                >
                                                    {isFollowing ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            )}
                                        </div>

                                        {/* ✅ NUEVO: Panel expandible de ventas */}
                                        {isExpanded && (
                                            <div className="px-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                    {entrega.cantidad_ventas} Venta{entrega.cantidad_ventas !== 1 ? 's' : ''} en esta Entrega
                                                </p>
                                                <div className="space-y-2">
                                                    {entrega.ventas.map((venta) => (
                                                        <VentaEnEntregaCard
                                                            key={venta.id}
                                                            venta={venta}
                                                            onExpand={() => setModalEntrega(entrega)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>

            {/* ✅ NUEVO: Modal de detalles expandido */}
            <EntregaDetalleModal
                entrega={modalEntrega}
                isOpen={!!modalEntrega}
                onClose={() => setModalEntrega(null)}
            />
        </Card>
    );
}

export default TrackingPanel;

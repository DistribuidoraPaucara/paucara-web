import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/presentation/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
    Truck,
    Users,
    MapPin,
    DollarSign,
    Package,
    Clock,
    Navigation,
    X,
} from 'lucide-react';
import type { Entrega, VentaEnEntrega } from '@/domain/entities/logistica';
import VentaEnEntregaCard from './VentaEnEntregaCard';

interface EntregaDetalleModalProps {
    entrega: Entrega | null;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Componente EntregaDetalleModal
 *
 * Modal expandido que muestra:
 * - Información de la entrega consolidada
 * - Chofer y vehículo asignado
 * - Ubicación actual y velocidad
 * - Lista detallada de todas las ventas
 * - Información de confirmación de cada venta
 * - Total consolidado
 */
export function EntregaDetalleModal({
    entrega,
    isOpen,
    onClose,
}: EntregaDetalleModalProps) {
    const [expandedVentaId, setExpandedVentaId] = useState<number | null>(null);

    if (!entrega) return null;

    // Estado badge color
    const getEstadoColor = (estado: string): string => {
        const colors: Record<string, string> = {
            'PROGRAMADO': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
            'ASIGNADA': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
            'EN_CAMINO': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
            'LLEGO': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
            'ENTREGADO': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
            'NOVEDAD': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
            'CANCELADA': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        };
        return colors[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <DialogTitle className="text-2xl">
                                Entrega #{entrega.id}
                                {entrega.numero_entrega && (
                                    <span className="text-gray-600 dark:text-gray-400 text-lg ml-2">
                                        ({entrega.numero_entrega})
                                    </span>
                                )}
                            </DialogTitle>
                            <DialogDescription>
                                {entrega.cantidad_ventas} venta{entrega.cantidad_ventas !== 1 ? 's' : ''}
                                {' '} | Total: Bs. {entrega.total_consolidado.toFixed(2)}
                            </DialogDescription>
                        </div>
                        <Badge className={getEstadoColor(entrega.estado)}>
                            {entrega.estado}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* SECCIÓN 1: Información de Recursos (Chofer y Vehículo) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Chofer */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Chofer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {entrega.chofer.name}
                                </p>
                                {entrega.chofer.telefono && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        📞 {entrega.chofer.telefono}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Vehículo */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Vehículo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {entrega.vehiculo.placa}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {entrega.vehiculo.marca}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* SECCIÓN 2: Ubicación y Velocidad Actuales */}
                    {entrega.ubicacion_actual && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Ubicación Actual
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Latitud</p>
                                        <p className="font-mono text-sm font-semibold">
                                            {entrega.ubicacion_actual.latitud.toFixed(6)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Longitud</p>
                                        <p className="font-mono text-sm font-semibold">
                                            {entrega.ubicacion_actual.longitud.toFixed(6)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Velocidad</p>
                                        <p className="font-semibold text-blue-600">
                                            {entrega.ubicacion_actual.velocidad?.toFixed(1) || '0'} km/h
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Actualizado: {new Date(entrega.ubicacion_actual.timestamp).toLocaleString('es-ES')}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* SECCIÓN 3: Resumen Financiero */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Resumen Financiero
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Total Consolidado ({entrega.cantidad_ventas} ventas):
                                </span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    Bs. {entrega.total_consolidado.toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECCIÓN 4: Lista Detallada de Ventas */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Ventas en esta Entrega ({entrega.cantidad_ventas})
                        </h3>
                        <div className="space-y-3">
                            {entrega.ventas.map((venta) => (
                                <div key={venta.id} className="relative">
                                    <VentaEnEntregaCard
                                        venta={venta}
                                        onExpand={() =>
                                            setExpandedVentaId(
                                                expandedVentaId === venta.id ? null : venta.id
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECCIÓN 5: Información de Fechas */}
                    <Card className="bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Información de Fechas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            {entrega.fecha_inicio && (
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Inicio</p>
                                    <p className="font-medium">
                                        {new Date(entrega.fecha_inicio).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            )}
                            {entrega.fecha_llegada && (
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Llegada</p>
                                    <p className="font-medium">
                                        {new Date(entrega.fecha_llegada).toLocaleString('es-ES')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botón de cierre */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EntregaDetalleModal;

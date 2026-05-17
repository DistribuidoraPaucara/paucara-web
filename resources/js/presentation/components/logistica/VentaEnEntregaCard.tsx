import React from 'react';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import {
    Package,
    User,
    DollarSign,
    Calendar,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import type { VentaEnEntrega } from '@/domain/entities/logistica';

interface VentaEnEntregaCardProps {
    venta: VentaEnEntrega;
    onExpand?: () => void;
}

/**
 * Componente VentaEnEntregaCard
 *
 * Muestra información de una venta individual dentro de una entrega consolidada
 * - Cliente y su teléfono
 * - Total y cantidad de items
 * - Estado logístico
 * - Información de confirmación
 * - Orden de entrega
 */
export function VentaEnEntregaCard({
    venta,
    onExpand,
}: VentaEnEntregaCardProps) {
    // Determinar color del estado
    const getEstadoColor = (estado?: string): string => {
        const colors: Record<string, string> = {
            'EN_TRANSITO': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
            'ENTREGADA': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
            'PENDIENTE_ENVIO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
            'EN_PREPARACION': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
            'PROBLEMAS': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        };
        return colors[estado ?? ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200';
    };

    // Determinar icono del estado
    const getEstadoIcon = (estado?: string) => {
        switch (estado) {
            case 'ENTREGADA':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'EN_TRANSITO':
            case 'EN_PREPARACION':
                return <Clock className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    return (
        <Card
            className={`border-l-4 transition-all cursor-pointer hover:shadow-md ${
                venta.fecha_confirmacion ? 'border-l-green-500' : 'border-l-blue-500'
            }`}
            onClick={onExpand}
        >
            <CardContent className="pt-4 space-y-3">
                {/* Encabezado: Orden y Estado */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-bold">
                            {venta.orden}
                        </span>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            Venta {venta.numero}
                        </span>
                    </div>
                    {venta.estado_logistico && (
                        <Badge className={getEstadoColor(venta.estado_logistico)}>
                            <span className="flex items-center gap-1">
                                {getEstadoIcon(venta.estado_logistico)}
                                {venta.estado_logistico.replace(/_/g, ' ')}
                            </span>
                        </Badge>
                    )}
                </div>

                {/* Cliente y Contacto */}
                <div className="flex items-start gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {venta.cliente.nombre}
                        </p>
                        {venta.cliente.telefono && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {venta.cliente.telefono}
                            </p>
                        )}
                    </div>
                </div>

                {/* Total y Items */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                            <p className="font-semibold text-green-600">
                                Bs. {venta.subtotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Package className="h-4 w-4 text-blue-600" />
                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Items</p>
                            <p className="font-semibold text-blue-600">
                                {venta.cantidad_items}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fecha de entrega comprometida */}
                {venta.fecha_entrega_comprometida && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <Calendar className="h-4 w-4" />
                        <span>Entrega: {new Date(venta.fecha_entrega_comprometida).toLocaleDateString('es-ES')}</span>
                    </div>
                )}

                {/* Información de confirmación */}
                {venta.fecha_confirmacion && (
                    <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 pt-2 border-t border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 rounded px-2 py-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Confirmado: {new Date(venta.fecha_confirmacion).toLocaleString('es-ES')}</span>
                    </div>
                )}

                {/* Notas */}
                {venta.notas && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700 italic">
                        📝 {venta.notas}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default VentaEnEntregaCard;

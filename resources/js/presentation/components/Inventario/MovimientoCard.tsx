// Presentation Layer: MovimientoCard Component
// Componente de tarjeta universal para mostrar cualquier tipo de movimiento de inventario

import React from 'react';
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
    ArrowDown,
    ArrowUp,
    ArrowLeftRight,
    Settings,
    AlertTriangle,
    Factory,
    Undo,
    Eye,
    Edit,
    Calendar,
    User,
    Package,
    MapPin,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { router } from '@inertiajs/react';
import type { MovimientoUnificado } from '@/domain/entities/movimientos-inventario';
import { CONFIGURACION_MOVIMIENTOS } from '@/presentation/config/inventory.config';

interface MovimientoCardProps {
    movimiento: MovimientoUnificado;
    showActions?: boolean;
    compact?: boolean;
}

const iconMap = {
    ArrowDown,
    ArrowUp,
    ArrowLeftRight,
    Settings,
    AlertTriangle,
    Factory,
    Undo
};

export const MovimientoCard: React.FC<MovimientoCardProps> = ({
    movimiento,
    showActions = true,
    compact = false
}) => {
    const config = CONFIGURACION_MOVIMIENTOS[movimiento.tipo];

    // Fallback si el tipo de movimiento no está configurado
    if (!config) {
        return (
            <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">
                    Tipo de movimiento desconocido: <strong>{movimiento.tipo}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Por favor, revisa la configuración del sistema
                </p>
            </div>
        );
    }

    const IconComponent = iconMap[config.icon as keyof typeof iconMap] || Package;

    const getStockChangeIcon = () => {
        if (config.afecta_stock === 'POSITIVO') return TrendingUp;
        if (config.afecta_stock === 'NEGATIVO') return TrendingDown;
        return ArrowLeftRight;
    };

    const StockIcon = getStockChangeIcon();

    const handleVerDetalle = () => {
        if (movimiento.referencia_tipo === 'transferencia') {
            router.visit(`/inventario/transferencias/${movimiento.referencia_id}`);
        } else if (movimiento.referencia_tipo === 'merma') {
            router.visit(`/inventario/mermas/${movimiento.referencia_id}`);
        }
        // Agregar más tipos según se implementen
    };

    const formatCurrency = (value?: number) => {
        if (!value) return 'Bs. 0.00';
        return `Bs. ${value.toFixed(2)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (compact) {
        return (
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${config.textColor}`} />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{movimiento.producto?.nombre || 'Producto desconocido'}</p>
                        <p className="text-xs text-muted-foreground">
                            {movimiento.almacen?.nombre || 'Almacén desconocido'} • {formatDate(movimiento.fecha)}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1">
                        <StockIcon className="h-3 w-3" />
                        <span className="text-sm font-medium">
                            {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                        </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {config.label}
                    </Badge>
                </div>
            </div>
        );
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${config.bgColor}`}>
                            <IconComponent className={`h-5 w-5 ${config.textColor}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{config.label}</h3>
                                <Badge
                                    variant="outline"
                                    className={`${config.bgColor} ${config.textColor} border-current`}
                                >
                                    {movimiento.subtipo?.replace('_', ' ') || 'Subtipo desconocido'}
                                </Badge>
                            </div>
                            {movimiento.numero_referencia && (
                                <p className="text-sm text-muted-foreground">
                                    Ref: {movimiento.numero_referencia}
                                </p>
                            )}
                        </div>
                    </div>

                    {movimiento.estado && (
                        <Badge
                            variant={movimiento.estado === 'PROCESADO' ? 'default' : 'secondary'}
                            className="ml-auto"
                        >
                            {movimiento.estado}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Información del Producto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{movimiento.producto?.nombre || 'Producto desconocido'}</span>
                        </div>
                        {movimiento.producto?.codigo && (
                            <p className="text-sm text-muted-foreground pl-6">
                                Código: {movimiento.producto.codigo}
                            </p>
                        )}
                        {movimiento.producto?.categoria && (
                            <p className="text-sm text-muted-foreground pl-6">
                                Categoría: {movimiento.producto.categoria.nombre}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{movimiento.almacen?.nombre || 'Almacén desconocido'}</span>
                        </div>
                        {movimiento.almacen_origen && movimiento.almacen_destino && (
                            <p className="text-sm text-muted-foreground pl-6">
                                {movimiento.almacen_origen.nombre} → {movimiento.almacen_destino.nombre}
                            </p>
                        )}
                    </div>
                </div>

                {/* Información de Cantidad y Stock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Cantidad</p>
                        <div className="flex items-center justify-center gap-1">
                            <StockIcon className="h-4 w-4" />
                            <span className="font-bold text-lg">
                                {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                            </span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Stock Anterior</p>
                        <p className="font-medium">{movimiento.cantidad_anterior}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Stock Nuevo</p>
                        <p className="font-medium">{movimiento.cantidad_nueva}</p>
                    </div>
                    {movimiento.valor_total && (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Valor Total</p>
                            <p className="font-medium">{formatCurrency(movimiento.valor_total)}</p>
                        </div>
                    )}
                </div>

                {/* Información Adicional */}
                <div className="space-y-2">
                    {movimiento.lote && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Lote:</span>
                            <Badge variant="outline">{movimiento.lote}</Badge>
                        </div>
                    )}

                    {movimiento.fecha_vencimiento && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Vencimiento:</span>
                            <span className="text-sm">{formatDate(movimiento.fecha_vencimiento)}</span>
                        </div>
                    )}

                    <div className="text-sm">
                        <span className="text-muted-foreground">Motivo:</span>
                        <span className="ml-2">{movimiento.motivo}</span>
                    </div>

                    {movimiento.observaciones && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Observaciones:</span>
                            <p className="mt-1 p-2 bg-muted rounded text-sm">{movimiento.observaciones}</p>
                        </div>
                    )}
                </div>

                {/* Información de Usuario y Fecha */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{movimiento.usuario?.name || 'Usuario desconocido'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(movimiento.fecha)} {formatTime(movimiento.hora)}</span>
                    </div>
                </div>

                {/* Información de Aprobación */}
                {movimiento.aprobado_por && (
                    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <span className="text-sm text-green-800 dark:text-green-300">
                            Aprobado por: {movimiento.aprobado_por.name}
                        </span>
                        <span className="text-xs text-green-600">
                            {movimiento.fecha_aprobacion && formatDate(movimiento.fecha_aprobacion)}
                        </span>
                    </div>
                )}

                {/* Acciones */}
                {showActions && (
                    <div className="flex gap-2 pt-2">
                        {movimiento.referencia_id && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleVerDetalle}
                                className="flex items-center gap-2"
                            >
                                <Eye className="h-4 w-4" />
                                Ver Detalle
                            </Button>
                        )}

                        {config.permite_edicion && movimiento.estado === 'PENDIENTE' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Editar
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MovimientoCard;

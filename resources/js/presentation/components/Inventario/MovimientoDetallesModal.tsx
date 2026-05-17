import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Copy, X, ChevronDown } from 'lucide-react';
import ObservacionesDetalle from './ObservacionesDetalle';

interface MovimientoDetallesModalProps {
    isOpen: boolean;
    onClose: () => void;
    movimiento: {
        id: number;
        numero_documento?: string;
        tipo: string;
        producto: { id: number; nombre: string; sku: string };
        cantidad: number;
        cantidad_anterior?: number;
        cantidad_posterior?: number;
        observaciones?: string;
        created_at: string;
        usuario: { name: string };
        referencia?: string;
        // ✅ NUEVO (2026-03-26): Información adicional de cantidades
        cantidad_total_anterior?: number;
        cantidad_total_posterior?: number;
        cantidad_reservada_anterior?: number;
        cantidad_reservada_posterior?: number;
    } | null;
}

export default function MovimientoDetallesModal({
    isOpen,
    onClose,
    movimiento
}: MovimientoDetallesModalProps) {
    if (!movimiento) return null;

    // Intentar parsear el JSON de observación
    let observacionParsed: any = null;
    try {
        if (movimiento.observaciones) {
            observacionParsed = JSON.parse(movimiento.observaciones);
        }
    } catch (e) {
        // Si no es JSON válido, mostrar como texto
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!w-[95vw] !h-[95vh] !max-w-none !rounded-lg p-0 flex flex-col">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex items-center justify-between">
                        <span>📋 Detalles del Movimiento #{movimiento.id}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-6 w-6 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 flex-1 overflow-y-auto p-6">
                    {/* Información General */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                        <h3 className="font-semibold text-sm">📌 Información General</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-muted-foreground">Tipo de Movimiento</span>
                                <div className="mt-1">
                                    <Badge>{movimiento.tipo}</Badge>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Número de Documento</span>
                                <p className="font-medium text-sm mt-1">
                                    {movimiento.numero_documento || '-'}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Referencia</span>
                                <p className="font-medium text-sm mt-1">
                                    {movimiento.referencia || '-'}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Fecha/Hora</span>
                                <p className="font-medium text-sm mt-1">
                                    {new Date(movimiento.created_at).toLocaleString('es-ES')}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">Usuario</span>
                                <p className="font-medium text-sm mt-1">
                                    {movimiento.usuario.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información del Producto */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                        <h3 className="font-semibold text-sm">📦 Información del Producto</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-muted-foreground">Producto</span>
                                <p className="font-medium text-sm mt-1">
                                    {movimiento.producto.nombre}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">SKU</span>
                                <p className="font-medium text-sm mt-1">
                                    {movimiento.producto.sku}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">ID Producto</span>
                                <p className="font-medium text-sm mt-1">
                                    #{movimiento.producto.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cambios de Stock */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg space-y-3">
                        <h3 className="font-semibold text-sm">📊 Cambios de Stock</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <span className="text-xs text-muted-foreground block">Cantidad Anterior</span>
                                <p className="text-2xl font-bold mt-1">
                                    {movimiento.cantidad_anterior ?? 'N/A'}
                                </p>
                            </div>
                            <div className="text-center flex items-center justify-center">
                                <div>
                                    <span className="text-xs text-muted-foreground block">Cambio</span>
                                    <p className={`text-2xl font-bold mt-1 ${
                                        movimiento.cantidad > 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-xs text-muted-foreground block">Cantidad Posterior</span>
                                <p className="text-2xl font-bold mt-1">
                                    {movimiento.cantidad_posterior ?? 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ✅ NUEVO (2026-03-26): Observaciones Detalladas - Información completa */}
                    {(observacionParsed || movimiento.observaciones) && (
                        <>
                            {/* SECCIÓN 1: Observaciones Detalladas con Componente */}
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-sm">📝 Observaciones Detalladas</h3>
                                    {movimiento.observaciones && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(movimiento.observaciones || '')}
                                            className="h-7 gap-1"
                                        >
                                            <Copy className="h-3 w-3" />
                                            Copiar JSON
                                        </Button>
                                    )}
                                </div>

                                {/* Usar componente ObservacionesDetalle para mostrar información formateada */}
                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                    <ObservacionesDetalle observaciones={movimiento.observaciones} />
                                </div>
                            </div>

                            {/* SECCIÓN 2: Detalles de Stock Expandido */}
                            {(movimiento.cantidad_total_anterior !== undefined ||
                                movimiento.cantidad_disponible_anterior !== undefined ||
                                movimiento.cantidad_reservada_anterior !== undefined) && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
                                    <h3 className="font-semibold text-sm">📊 Detalles Completos del Stock</h3>

                                    {/* Stock Anterior */}
                                    <div className="space-y-2">
                                        <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                                            📈 Stock ANTES del movimiento:
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 ml-2">
                                            {movimiento.cantidad_total_anterior !== undefined && (
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs text-muted-foreground">📦 Total</p>
                                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                        {movimiento.cantidad_total_anterior}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">stock.cantidad</p>
                                                </div>
                                            )}
                                            {movimiento.cantidad_disponible_anterior !== undefined && (
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs text-muted-foreground">📊 Disponible</p>
                                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        {movimiento.cantidad_disponible_anterior}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">cantidad_disponible</p>
                                                </div>
                                            )}
                                            {movimiento.cantidad_reservada_anterior !== undefined && (
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs text-muted-foreground">🔒 Reservada</p>
                                                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                                        {movimiento.cantidad_reservada_anterior}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">cantidad_reservada</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Stock Posterior */}
                                    <div className="space-y-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                        <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                                            📉 Stock DESPUÉS del movimiento:
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 ml-2">
                                            {movimiento.cantidad_total_posterior !== undefined && (
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs text-muted-foreground">📦 Total</p>
                                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                        {movimiento.cantidad_total_posterior}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">stock.cantidad</p>
                                                </div>
                                            )}
                                            {movimiento.cantidad_disponible_posterior !== undefined && (
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs text-muted-foreground">📊 Disponible</p>
                                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        {movimiento.cantidad_disponible_posterior}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">cantidad_disponible</p>
                                                </div>
                                            )}
                                            {movimiento.cantidad_reservada_posterior !== undefined && (
                                                <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs text-muted-foreground">🔒 Reservada</p>
                                                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                                        {movimiento.cantidad_reservada_posterior}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">cantidad_reservada</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

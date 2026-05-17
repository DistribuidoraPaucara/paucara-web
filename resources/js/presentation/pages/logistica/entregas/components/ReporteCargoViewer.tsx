/**
 * Presentación: ReporteCargoViewer
 *
 * Componente para visualizar y gestionar un reporte de carga:
 * - Mostrar detalles de carga
 * - Actualizar cantidades cargadas
 * - Verificar productos
 * - Cambiar estado del reporte
 *
 * ARQUITECTURA LIMPIA:
 * ✅ Solo renderiza UI
 * ✅ Delega lógica al hook use-reporte-carga.ts
 */

import { useEffect, useState } from 'react';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import {
    Package,
    Check,
    AlertCircle,
    BarChart3,
    Loader,
    ChevronDown,
    ChevronUp,
    Truck,
} from 'lucide-react';
import type { ReporteCarga, DetalleReporteCarga } from '@/domain/entities/entregas';
import { useReporteCarga } from '@/application/hooks/use-reporte-carga';

interface ReporteCargoViewerProps {
    reporteId: number;
    onStateChange?: (reporte: ReporteCarga) => void;
}

export default function ReporteCargoViewer({
    reporteId,
    onStateChange,
}: ReporteCargoViewerProps) {
    const {
        reporte,
        isLoading,
        error,
        obtenerReporte,
        actualizarCantidad,
        verificarDetalle,
        confirmarCarga,
        marcarListoParaEntrega,
        cancelarReporte,
    } = useReporteCarga({
        reporteId,
        onSuccess: onStateChange,
    });

    const [expandedDetalles, setExpandedDetalles] = useState<Set<number>>(new Set());
    const [editingDetalle, setEditingDetalle] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Record<number, { cantidad: number; notas: string }>>({});

    useEffect(() => {
        obtenerReporte();
    }, [reporteId]);

    if (isLoading && !reporte) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!reporte) {
        return (
            <Card className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No se encontró el reporte</p>
            </Card>
        );
    }

    const estadoColor: Record<string, string> = {
        PENDIENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
        CONFIRMADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        ENTREGADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        CANCELADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    };

    const toggleDetalle = (detalleId: number) => {
        const newExpanded = new Set(expandedDetalles);
        if (newExpanded.has(detalleId)) {
            newExpanded.delete(detalleId);
        } else {
            newExpanded.add(detalleId);
        }
        setExpandedDetalles(newExpanded);
    };

    const handleActualizarCantidad = async (detalle: DetalleReporteCarga) => {
        const values = editValues[detalle.id] || { cantidad: detalle.cantidad_cargada, notas: detalle.notas || '' };
        await actualizarCantidad(detalle.id, values.cantidad, values.notas);
        setEditingDetalle(null);
        setEditValues((prev) => {
            const newValues = { ...prev };
            delete newValues[detalle.id];
            return newValues;
        });
    };

    const canConfirmCarga = reporte.estado === 'PENDIENTE' && reporte.detalles?.length > 0;
    const canMarkReady = reporte.estado === 'CONFIRMADO';

    return (
        <div className="space-y-6">
            {/* Header del Reporte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reporte</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {reporte.numero_reporte}
                        </p>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                        <Badge className={estadoColor[reporte.estado] || ''}>
                            {reporte.estado}
                        </Badge>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Progreso</p>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            <span className="text-2xl font-bold text-blue-600">
                                {reporte.porcentaje_cargado?.toFixed(1) || 0}%
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Resumen de Carga */}
            {reporte.resumen && (
                <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resumen de Carga</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Líneas</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {reporte.resumen.total_lineas}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Solicitado</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {reporte.resumen.total_solicitado}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cargado</p>
                            <p className="text-lg font-bold text-blue-600">
                                {reporte.resumen.total_cargado}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Verificados</p>
                            <p className="text-lg font-bold text-green-600">
                                {reporte.resumen.lineas_verificadas}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Peso (kg)</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {(reporte.resumen.peso_total_cargado || 0).toFixed(1)}
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Detalles de Carga */}
            <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Productos a Cargar
                </h3>

                <div className="space-y-2">
                    {reporte.detalles && reporte.detalles.length > 0 ? (
                        reporte.detalles.map((detalle) => (
                            <div
                                key={detalle.id}
                                className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
                            >
                                {/* Resumen del Detalle */}
                                <button
                                    onClick={() => toggleDetalle(detalle.id)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                                >
                                    <div className="flex items-center gap-4 flex-1 text-left">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {detalle.producto?.nombre}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {detalle.producto?.codigo}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {detalle.cantidad_cargada} / {detalle.cantidad_solicitada}
                                            </p>
                                            <div className="w-24 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                                                <div
                                                    className="h-full bg-blue-500 transition-all"
                                                    style={{
                                                        width: `${detalle.porcentaje_cargado || 0}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {detalle.verificado && (
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        )}

                                        {expandedDetalles.has(detalle.id) ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </div>
                                </button>

                                {/* Detalles Expandidos */}
                                {expandedDetalles.has(detalle.id) && (
                                    <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-800/30 space-y-4">
                                        {editingDetalle === detalle.id ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Cantidad Cargada
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={detalle.cantidad_solicitada}
                                                        value={
                                                            editValues[detalle.id]?.cantidad ||
                                                            detalle.cantidad_cargada
                                                        }
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                [detalle.id]: {
                                                                    cantidad: parseInt(e.target.value) || 0,
                                                                    notas: prev[detalle.id]?.notas || detalle.notas || '',
                                                                },
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Notas
                                                    </label>
                                                    <textarea
                                                        value={
                                                            editValues[detalle.id]?.notas ||
                                                            detalle.notas || ''
                                                        }
                                                        onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                [detalle.id]: {
                                                                    cantidad: prev[detalle.id]?.cantidad || detalle.cantidad_cargada,
                                                                    notas: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                                                        rows={2}
                                                        placeholder="Notas adicionales..."
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleActualizarCantidad(detalle)}
                                                        
                                                    >
                                                        Guardar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingDetalle(null);
                                                            setEditValues((prev) => {
                                                                const newValues = { ...prev };
                                                                delete newValues[detalle.id];
                                                                return newValues;
                                                            });
                                                        }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {detalle.notas && (
                                                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-yellow-800 dark:text-yellow-200">
                                                        {detalle.notas}
                                                    </div>
                                                )}

                                                {detalle.peso_kg && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">Peso:</span> {detalle.peso_kg.toFixed(2)} kg
                                                    </p>
                                                )}

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditingDetalle(detalle.id)}
                                                    >
                                                        Editar
                                                    </Button>

                                                    {!detalle.verificado && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => verificarDetalle(detalle.id)}
                                                            
                                                        >
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Verificar
                                                        </Button>
                                                    )}

                                                    {detalle.verificado && (
                                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                                            Verificado
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No hay detalles para este reporte
                        </p>
                    )}
                </div>
            </Card>

            {/* Acciones */}
            <div className="flex gap-3 justify-end pt-4">
                {reporte.estado === 'PENDIENTE' && (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => cancelarReporte('Cancelado por usuario')}
                            
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => confirmarCarga()}
                            
                            disabled={!canConfirmCarga}
                        >
                            Confirmar Carga
                        </Button>
                    </>
                )}

                {reporte.estado === 'CONFIRMADO' && (
                    <Button
                        onClick={() => marcarListoParaEntrega()}
                        
                        disabled={!canMarkReady}
                    >
                        <Truck className="w-4 h-4 mr-2" />
                        Listo para Partir
                    </Button>
                )}
            </div>
        </div>
    );
}

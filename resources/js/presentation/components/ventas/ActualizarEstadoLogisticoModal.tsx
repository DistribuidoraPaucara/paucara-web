import React, { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { useToast } from '@/presentation/hooks/useToast';
import { Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface EstadoLogistica {
    id: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
    color?: string;
    icono?: string;
    activo: boolean;
}

interface ActualizarEstadoLogisticoModalProps {
    isOpen: boolean;
    onClose: () => void;
    venta: any;
    onSuccess?: () => void;
}

export default function ActualizarEstadoLogisticoModal({
    isOpen,
    onClose,
    venta,
    onSuccess,
}: ActualizarEstadoLogisticoModalProps) {
    const { error: toastError, success: toastSuccess } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [estados, setEstados] = useState<EstadoLogistica[]>([]);
    const [selectedEstadoId, setSelectedEstadoId] = useState<number | null>(null);
    const [observaciones, setObservaciones] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            cargarEstados();
            setObservaciones('');
            setError(null);
        }
    }, [isOpen]);

    const cargarEstados = async () => {
        setIsLoadingStates(true);
        try {
            const response = await axios.get('/api/estados-logistica?categoria=venta_logistica&activo=true');
            if (response.data?.data?.data) {
                setEstados(response.data.data.data);
            }
        } catch (err) {
            console.error('Error cargando estados logísticos:', err);
            setError('No se pudo cargar los estados logísticos disponibles');
            toastError('No se pudo cargar los estados logísticos');
        } finally {
            setIsLoadingStates(false);
        }
    };

    const handleActualizar = async () => {
        if (!selectedEstadoId) {
            setError('Debes seleccionar un estado logístico');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                estado_logistico_id: selectedEstadoId,
                observaciones: observaciones || undefined,
            };

            const response = await axios.patch(
                `/api/ventas/${venta.id}/actualizar-estado-logistico`,
                payload
            );

            if (response.data.success) {
                toastSuccess('✅ Estado logístico actualizado correctamente');
                setSelectedEstadoId(null);
                setObservaciones('');
                onClose();
                onSuccess?.();
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Error actualizando el estado logístico';
            setError(message);
            toastError('❌ ' + message);
        } finally {
            setIsLoading(false);
        }
    };

    const estadoActual = venta?.estado_logistica;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        📦 Actualizar Estado Logístico
                    </DialogTitle>
                    <DialogDescription>
                        Venta <strong>#{venta?.id}</strong> - {venta?.cliente?.nombre}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Estado Actual */}
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">
                            Estado Actual
                        </p>
                        {estadoActual ? (
                            <div className="mt-2 flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: estadoActual.color || '#e5e7eb' }}
                                />
                                <span className="font-medium text-blue-900 dark:text-blue-100">
                                    {estadoActual.icono} {estadoActual.nombre}
                                </span>
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">Sin estado definido</p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Estados Disponibles */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Nuevo Estado Logístico
                        </label>
                        {isLoadingStates ? (
                            <div className="flex items-center justify-center py-4 text-gray-500 dark:text-gray-400">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Cargando estados...
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2">
                                {estados.length > 0 ? (
                                    estados.map((estado) => (
                                        <label
                                            key={estado.id}
                                            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                                        >
                                            <input
                                                type="radio"
                                                name="estado"
                                                value={estado.id}
                                                checked={selectedEstadoId === estado.id}
                                                onChange={() => setSelectedEstadoId(estado.id)}
                                                disabled={isLoading}
                                                className="h-4 w-4 cursor-pointer"
                                            />
                                            <div className="flex items-center gap-2 flex-1">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: estado.color || '#e5e7eb' }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {estado.icono} {estado.nombre}
                                                    </span>
                                                    {estado.descripcion && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {estado.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                        No hay estados disponibles
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Observaciones (opcional)
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Ej: Retraso por condiciones climáticas, cliente no disponible, etc."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white text-sm"
                            rows={3}
                            disabled={isLoading || isLoadingStates}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Las observaciones se añadirán al registro de logística de la venta.
                        </p>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose} disabled={isLoading || isLoadingStates}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleActualizar}
                        disabled={isLoading || isLoadingStates || !selectedEstadoId}
                        className="gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isLoading ? 'Actualizando...' : 'Actualizar Estado'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

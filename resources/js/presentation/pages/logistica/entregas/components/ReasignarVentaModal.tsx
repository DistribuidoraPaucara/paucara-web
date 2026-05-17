import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { SearchableSelect } from '@/presentation/components/ui/searchable-select';
import { AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { Entrega, VentaEntrega } from '@/domain/entities/entregas';
import axios from 'axios';

interface ReasignarVentaModalProps {
    isOpen: boolean;
    venta?: VentaEntrega;
    entregaActual?: Entrega;
    onClose: () => void;
    onSuccess: () => void;
}

export function ReasignarVentaModal({
    isOpen,
    venta,
    entregaActual,
    onClose,
    onSuccess,
}: ReasignarVentaModalProps) {
    const [entregas, setEntregas] = useState<Entrega[]>([]);
    const [entregaDestino, setEntregaDestino] = useState<string>('');
    const [cargando, setCargando] = useState(false);
    const [cargandoEntregas, setCargandoEntregas] = useState(false);
    const [estado, setEstado] = useState<'idle' | 'success' | 'error'>('idle');
    const [mensaje, setMensaje] = useState('');

    // Cargar lista de entregas disponibles
    useEffect(() => {
        if (isOpen) {
            cargarEntregas();
            setEntregaDestino('');
            setEstado('idle');
            setMensaje('');
        }
    }, [isOpen]);

    const cargarEntregas = async () => {
        try {
            setCargandoEntregas(true);
            // Obtener entregas disponibles específicamente para reasignar
            // (automáticamente excluye la entrega actual)
            const response = await axios.get(
                `/api/chofer/entregas/${entregaActual?.id}/entregas-disponibles`
            );

            console.log('📦 Entregas disponibles:', response.data);

            // El nuevo endpoint retorna directamente un array
            const entregasList = Array.isArray(response.data.data)
                ? response.data.data
                : [];

            setEntregas(entregasList);
        } catch (error) {
            console.error('Error cargando entregas:', error);
            setEstado('error');
            setMensaje('Error cargando las entregas disponibles');
        } finally {
            setCargandoEntregas(false);
        }
    };

    const handleReasignar = async () => {
        if (!venta || !entregaActual || !entregaDestino) {
            setMensaje('Por favor selecciona una entrega destino');
            return;
        }

        try {
            setCargando(true);
            setEstado('idle');
            setMensaje('');

            const response = await axios.put(
                `/api/chofer/entregas/${entregaActual.id}/reasignar-venta`,
                {
                    venta_id: venta.id,
                    entrega_destino_id: parseInt(entregaDestino),
                }
            );

            if (response.data.success) {
                setEstado('success');
                setMensaje(`✅ Venta #${venta.numero} reasignada exitosamente`);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                setEstado('error');
                setMensaje(response.data.message || 'Error al reasignar la venta');
            }
        } catch (error: any) {
            setCargando(false);
            setEstado('error');
            setMensaje(error.response?.data?.message || 'Error al reasignar la venta');
            console.error('Error reasignando venta:', error);
        }
    };

    const entregaDestinoPrinter = entregas.find((e) => e.id === parseInt(entregaDestino));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>🚚 Reasignar Venta</span>
                    </DialogTitle>
                </DialogHeader>

                {estado === 'idle' && (
                    <div className="space-y-4 py-4">
                        {/* Información de la venta */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Venta a reasignar:</p>
                            <p className="font-semibold text-lg">#{venta?.numero}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Cliente: <span className="font-medium">{venta?.cliente_nombre}</span>
                            </p>
                        </div>

                        {/* Entrega actual */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                            <p className="text-sm text-blue-600 dark:text-blue-400">Entrega actual:</p>
                            <p className="font-medium">#{entregaActual?.numero_entrega}</p>
                        </div>

                        {/* Selector de entrega destino con búsqueda */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Entrega destino:</label>
                            {cargandoEntregas ? (
                                <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cargando entregas...</span>
                                </div>
                            ) : entregas && entregas.length > 0 ? (
                                <SearchableSelect
                                    value={entregaDestino}
                                    onValueChange={setEntregaDestino}
                                    items={entregas}
                                    placeholder="Selecciona una entrega..."
                                    searchPlaceholder="Busca por ID, chofer, vehículo..."
                                    searchFields={['numero_entrega', 'id', 'chofer.nombre', 'vehiculo.placa', 'estado']}
                                    renderOption={(entrega) => (
                                        <div className="flex items-center gap-2 w-full">
                                            <span className="font-medium">#{entrega.numero_entrega}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                                {entrega.estado || 'N/A'}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm">{entrega.chofer?.nombre || 'Sin chofer'}</span>
                                            <span className="text-gray-400">/</span>
                                            <span className="text-sm">{entrega.vehiculo?.placa || 'Sin vehículo'}</span>
                                        </div>
                                    )}
                                />
                            ) : (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        No hay entregas disponibles para reasignar
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Resumen de destino */}
                        {entregaDestinoPrinter && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg">
                                <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-2">Nueva entrega (destino):</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">#{entregaDestinoPrinter.numero_entrega}</span>
                                        <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                            {entregaDestinoPrinter.estado || 'N/A'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Chofer: <span className="font-medium">{entregaDestinoPrinter.chofer?.nombre || '-'}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Vehículo: <span className="font-medium">{entregaDestinoPrinter.vehiculo?.placa || '-'}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {estado === 'success' && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mb-3" />
                        <p className="text-center text-green-700 dark:text-green-300 font-medium">{mensaje}</p>
                    </div>
                )}

                {estado === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 dark:text-red-300">{mensaje}</p>
                    </div>
                )}

                <DialogFooter>
                    {estado === 'idle' && (
                        <>
                            <Button variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleReasignar}
                                disabled={cargando || !entregaDestino || entregas.length === 0}
                                className="gap-2"
                            >
                                {cargando && <Loader2 className="w-4 h-4 animate-spin" />}
                                {cargando ? 'Reasignando...' : 'Reasignar Venta'}
                            </Button>
                        </>
                    )}
                    {estado !== 'idle' && (
                        <Button onClick={onClose} className="w-full">
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

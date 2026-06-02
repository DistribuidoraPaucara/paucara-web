import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { AlertCircle, Printer } from 'lucide-react';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { formatDate } from '@/lib/utils';

interface Prestable {
    id: number;
    nombre: string;
    codigo: string;
    tipo: string;
}

interface PrestamoEventoDetalle {
    id: number;
    prestable_id: number;
    cantidad: number;
    prestable?: Prestable;
}

interface Cliente {
    id: number;
    nombre: string;
    razon_social?: string;
}

interface Usuario {
    id: number;
    name: string;
}

interface PrestamoEvento {
    id: number;
    nombre_evento: string;
    encargado_evento?: string;
    vehiculo_asignado?: string;
    direccion_evento?: string;
    telefono_uno?: string;
    telefono_dos?: string;
    chofer_id?: number;
    monto_garantia: number;
    fecha_prestamo: string;
    fecha_entrega?: string;
    fecha_esperada_devolucion?: string;
    estado: string;
    detalles: PrestamoEventoDetalle[];
    cliente?: Cliente;
    chofer?: Usuario;
    created_at: string;
    updated_at: string;
}

const getEstadoBadgeStyle = (estado: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
        ACTIVO: { bg: 'bg-blue-100', text: 'text-blue-700' },
        PARCIALMENTE_DEVUELTO: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
        COMPLETAMENTE_DEVUELTO: { bg: 'bg-green-100', text: 'text-green-700' },
        CANCELADO: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return styles[estado] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export default function ShowPrestamoEvento({ prestamo }: { prestamo: PrestamoEvento }) {
    const [loading, setLoading] = useState(false);
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [error, setError] = useState('');

    const handlePrint = () => {
        setShowOutputModal(true);
    };

    const handleAnular = async () => {
        if (!confirm('¿Estás seguro de que deseas anular este préstamo?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/prestamos-evento/${prestamo.id}/anular`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ razon_anulacion: 'Anulado manualmente' }),
            });

            if (!response.ok) {
                throw new Error('Error anulando préstamo');
            }

            // Recargar la página
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Error anulando préstamo');
        } finally {
            setLoading(false);
        }
    };

    const handleDevolver = () => {
        window.location.href = `/prestamos/eventos/${prestamo.id}/devoluciones`;
    };

    const estatoStyle = getEstadoBadgeStyle(prestamo.estado);

    return (
        <AppLayout>
            <Head title={`Préstamo a Evento #${prestamo.id}`} />

            <div className="space-y-6 p-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Préstamo a Evento #{prestamo.id}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {prestamo.nombre_evento}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-semibold ${estatoStyle.bg} ${estatoStyle.text}`}>
                        {prestamo.estado}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Información Principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Información del Evento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nombre del Evento</label>
                                <p className="text-gray-900 dark:text-white mt-1">{prestamo.nombre_evento}</p>
                            </div>
                            {prestamo.encargado_evento && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Encargado</label>
                                    <p className="text-gray-900 dark:text-white mt-1">{prestamo.encargado_evento}</p>
                                </div>
                            )}
                            {prestamo.direccion_evento && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección</label>
                                    <p className="text-gray-900 dark:text-white mt-1">{prestamo.direccion_evento}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                {prestamo.telefono_uno && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono 1</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{prestamo.telefono_uno}</p>
                                    </div>
                                )}
                                {prestamo.telefono_dos && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono 2</label>
                                        <p className="text-gray-900 dark:text-white mt-1">{prestamo.telefono_dos}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Información del Transporte</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {prestamo.chofer && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Chofer</label>
                                    <p className="text-gray-900 dark:text-white mt-1">{prestamo.chofer.name}</p>
                                </div>
                            )}
                            {prestamo.vehiculo_asignado && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehículo</label>
                                    <p className="text-gray-900 dark:text-white mt-1">{prestamo.vehiculo_asignado}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto de Garantía</label>
                                <p className="text-gray-900 dark:text-white mt-1">
                                    Bs {Number(prestamo.monto_garantia).toFixed(2)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Fecha de Préstamo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatDate(prestamo.fecha_prestamo)}
                            </p>
                        </CardContent>
                    </Card>
                    {prestamo.fecha_entrega && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Fecha de Entrega</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {formatDate(prestamo.fecha_entrega)}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Fecha Esperada Devolución</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatDate(prestamo.fecha_esperada_devolucion)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detalles de Prestables */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Detalles de Prestables</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Prestable
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Código
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Tipo
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                            Cantidad
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {prestamo.detalles.map((detalle) => (
                                        <tr key={detalle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                {detalle.prestable?.nombre || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {detalle.prestable?.codigo || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {detalle.prestable?.tipo || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white font-medium">
                                                {detalle.cantidad}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Botones de Acción */}
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" />
                        Imprimir
                    </Button>

                    {prestamo.estado === 'ACTIVO' && (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleDevolver}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Registrar Devolución
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleAnular}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Anular Préstamo
                            </Button>
                        </>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        disabled={loading}
                    >
                        Volver
                    </Button>
                </div>

                {/* Modal de Impresión */}
                {showOutputModal && (
                    <OutputSelectionModal
                        documentoId={prestamo.id}
                        tipoDocumento="prestamo-evento"
                        documentoInfo={prestamo}
                        onClose={() => setShowOutputModal(false)}
                    />
                )}
            </div>
        </AppLayout>
    );
}

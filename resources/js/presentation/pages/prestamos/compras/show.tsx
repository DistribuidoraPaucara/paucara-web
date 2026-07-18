import AppLayout from '@/layouts/app-layout';
import { formatCurrencyWith2Decimals, formatDate } from '@/lib/utils';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Printer, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Prestable {
    id: number;
    nombre: string;
    codigo: string;
}

interface Detalle {
    id: number;
    prestable_id: number;
    almacen_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    prestable?: Prestable;
    observaciones?: string;
}

interface Proveedor {
    id: number;
    nombre: string;
    razon_social?: string;
    nit?: string;
    telefono?: string;
    email?: string;
}

interface Usuario {
    id: number;
    name: string;
}

interface Compra {
    id: number;
    numero_compra: string;
    proveedor_id: number | null;
    usuario_id: number;
    estado: 'BORRADOR' | 'CONFIRMADA' | 'CANCELADA';
    subtotal: number;
    iva: number;
    total: number;
    observaciones?: string;
    fecha_compra: string;
    fecha_confirmacion?: string;
    fecha_cancelacion?: string;
    motivo_cancelacion?: string;
    proveedor?: Proveedor;
    usuario: Usuario;
    detalles: Detalle[];
    created_at: string;
    updated_at: string;
}

const getEstadoBadgeStyle = (estado: string) => {
    const styles: Record<string, { bg: string; text: string; dot: string }> = {
        BORRADOR: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
        CONFIRMADA: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
        CANCELADA: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    };
    return styles[estado] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
};

export default function ShowCompra({ compra }: { compra: Compra }) {
    const [loading, setLoading] = useState(false);
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{ type: 'confirmar' | 'cancelar'; open: boolean }>({
        type: 'confirmar',
        open: false,
    });
    const [motivo, setMotivo] = useState('');

    const handleConfirmar = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/compras-prestables/${compra.id}/confirmar`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (result.success) {
                // Recargar la página
                window.location.reload();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error confirmando compra:', error);
            alert('Error confirmando compra');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/compras-prestables/${compra.id}/cancelar`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ motivo }),
            });

            const result = await response.json();
            if (result.success) {
                // Recargar la página
                window.location.reload();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error cancelando compra:', error);
            alert('Error cancelando compra');
        } finally {
            setLoading(false);
            setConfirmDialog({ type: 'cancelar', open: false });
            setMotivo('');
        }
    };

    const estadoStyle = getEstadoBadgeStyle(compra.estado);

    return (
        <AppLayout>
            <Head title={`Compra #${compra.id}`} />

            <div className="space-y-6 p-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compra {compra.numero_compra}</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Folio #{compra.id}</p>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            {compra.proveedor?.razon_social || compra.proveedor?.nombre || 'Sin proveedor'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4">
                        <Badge
                            className={`inline-flex items-center gap-2 ${estadoStyle.bg} ${estadoStyle.text} px-3 py-1 text-sm font-medium rounded-full shadow-sm ring-1 ring-inset ring-gray-200 dark:ring-gray-700 uppercase tracking-wide`}
                        >
                            <span className={`inline-block h-2 w-2 rounded-full ${estadoStyle.dot} ring-1 ring-white/60`} />
                            {compra.estado}
                        </Badge>
                        {compra.estado === 'BORRADOR' && (
                            <>
                                <Button onClick={handleConfirmar} disabled={loading} className="gap-2 bg-green-600 text-white hover:bg-green-700">
                                    <CheckCircle size={18} />
                                    Confirmar Compra
                                </Button>

                                <Button
                                    onClick={() => setConfirmDialog({ type: 'cancelar', open: true })}
                                    disabled={loading}
                                    className="gap-2 bg-red-600 text-white hover:bg-red-700"
                                >
                                    <Trash2 size={18} />
                                    Cancelar Compra
                                </Button>
                            </>
                        )}

                        {compra.estado === 'CONFIRMADA' && (
                            <>
                                <Button
                                    onClick={() => setConfirmDialog({ type: 'cancelar', open: true })}
                                    disabled={loading}
                                    className="gap-2 bg-red-600 text-white hover:bg-red-700"
                                >
                                    <Trash2 size={18} />
                                    Cancelar Compra
                                </Button>
                            </>
                        )}

                        <Button onClick={() => setShowOutputModal(true)} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                            <Printer size={18} />
                            Imprimir
                        </Button>
                    </div>
                </div>

                {/* Main Info Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Fecha */}
                    <Card>
                        <CardContent>
                            Fecha de Compra
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(compra.fecha_compra)}</p>
                        </CardContent>
                    </Card>

                    {/* Usuario */}
                    <Card>
                        <CardContent>
                            Usuario
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.usuario.name}</p>
                        </CardContent>
                    </Card>

                    {/* Cantidad de Detalles */}
                    <Card>
                        <CardContent>
                            Prestables
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.detalles?.length || 0}</p>
                        </CardContent>
                    </Card>

                    {/* Total */}
                    <Card>
                        <CardContent>
                            Total
                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrencyWith2Decimals(compra.total)}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Proveedor Info */}
                {compra.proveedor && (
                    <Card>
                        <CardContent>
                            Información del Proveedor
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Razón Social</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {compra.proveedor.razon_social || compra.proveedor.nombre}
                                    </p>
                                </div>
                                {compra.proveedor.nit && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">NIT</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.proveedor.nit}</p>
                                    </div>
                                )}
                                {compra.proveedor.telefono && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.proveedor.telefono}</p>
                                    </div>
                                )}
                                {compra.proveedor.email && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.proveedor.email}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Detalles Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles de la Compra</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Prestable</th>
                                        <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Cantidad</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Precio Unit.</th>
                                        <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compra.detalles && compra.detalles.length > 0 ? (
                                        compra.detalles.map((detalle) => (
                                            <tr key={detalle.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                                <td className="px-4 py-3 text-gray-900 dark:text-white">
                                                    <div>
                                                        <p className="font-semibold">{detalle.prestable?.nombre}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{detalle.prestable?.codigo}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-900 dark:text-white">{detalle.cantidad}</td>
                                                <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                                                    {formatCurrencyWith2Decimals(detalle.precio_unitario)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrencyWith2Decimals(detalle.subtotal)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                                                No hay detalles registrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Totales */}
                        <div className="mt-6 flex justify-end">
                            <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between border-t py-2 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrencyWith2Decimals(compra.subtotal)}
                                    </span>
                                </div>
                                {compra.iva > 0 && (
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600 dark:text-gray-400">IVA</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrencyWith2Decimals(compra.iva)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between rounded border-t bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {formatCurrencyWith2Decimals(compra.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Observaciones */}
                {compra.observaciones && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Observaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 dark:text-gray-300">{compra.observaciones}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Cancelación Info */}
                {compra.estado === 'CANCELADA' && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                        <CardHeader>
                            <CardTitle className="text-red-700 dark:text-red-400">Información de Cancelación</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {compra.fecha_cancelacion && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Cancelación</p>
                                        <p className="text-lg font-semibold text-red-700 dark:text-red-400">{formatDate(compra.fecha_cancelacion)}</p>
                                    </div>
                                )}
                                {compra.motivo_cancelacion && (
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Motivo</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{compra.motivo_cancelacion}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Cancel Dialog Modal */}
                <Dialog open={confirmDialog.open && confirmDialog.type === 'cancelar'} onOpenChange={(open) => !open && setConfirmDialog({ type: 'cancelar', open: false })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertCircle size={24} />
                                Confirmar Cancelación
                            </DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas cancelar esta compra? Esta acción revertirá todos los movimientos de stock.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Motivo de Cancelación <span className="text-gray-400">(Opcional)</span>
                                </label>
                                <textarea
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Ingresa el motivo de la cancelación..."
                                    className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setConfirmDialog({ type: 'cancelar', open: false })} variant="outline">
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleCancelar}
                                disabled={loading}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Print Modal */}
            <OutputSelectionModal
                isOpen={showOutputModal}
                onClose={() => setShowOutputModal(false)}
                documentoId={compra.id}
                tipoDocumento="compras-prestables"
                documentoInfo={{
                    numero: compra.numero_compra,
                    fecha: formatDate(compra.fecha_compra),
                    monto: compra.total,
                }}
            />
        </AppLayout>
    );
}

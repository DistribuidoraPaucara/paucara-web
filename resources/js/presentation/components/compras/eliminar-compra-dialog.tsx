import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import { AlertTriangle, Trash2, Ban } from 'lucide-react';
import type { Compra } from '@/domain/entities/compras';

interface Props {
    compra: Compra;
    onSuccess?: () => void;
}

const EliminarCompraDialog: React.FC<Props> = ({ compra, onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [step, setStep] = useState<'confirm' | 'reason' | 'final'>('confirm');
    const [reason, setReason] = useState('');
    const [confirmText, setConfirmText] = useState('');

    const puedeEliminar = () => {
        // Solo se pueden eliminar compras en estados específicos
        const estadosEliminables = ['BORRADOR', 'PENDIENTE', 'RECHAZADO', 'ANULADO'];
        return estadosEliminables.includes(compra.estado_documento?.nombre?.toUpperCase() || '');
    };

    const motivosEliminacion = [
        'Error en los datos de la compra',
        'Compra duplicada',
        'Cancelación por el proveedor',
        'Error en el registro',
        'Solicitud del usuario',
        'Otro motivo'
    ];

    const handleEliminar = async () => {
        if (step === 'confirm') {
            setStep('reason');
            return;
        }

        if (step === 'reason' && reason) {
            setStep('final');
            return;
        }

        if (step === 'final' && confirmText.toLowerCase() === 'eliminar') {
            setIsDeleting(true);

            try {
                router.delete(`/compras/${compra.id}`, {
                    data: { motivo: reason },
                    onSuccess: () => {
                        setIsOpen(false);
                        setStep('confirm');
                        setReason('');
                        setConfirmText('');
                        onSuccess?.();
                    },
                    onError: (errors) => {
                        console.error('Error al eliminar compra:', errors);
                    },
                    onFinish: () => {
                        setIsDeleting(false);
                    }
                });
            } catch (error) {
                console.error('Error al eliminar compra:', error);
                setIsDeleting(false);
            }
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setStep('confirm');
        setReason('');
        setConfirmText('');
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    if (!puedeEliminar()) {
        return (
            <Button
                size="sm"
                variant="outline"
                disabled
                className="text-gray-400 cursor-not-allowed"
                title="No se puede eliminar una compra en este estado"
            >
                <Ban className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Eliminar compra"
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                            {step === 'confirm' && 'Confirmar Eliminación'}
                            {step === 'reason' && 'Motivo de Eliminación'}
                            {step === 'final' && 'Confirmación Final'}
                        </DialogTitle>
                        <DialogDescription>
                            {step === 'confirm' && 'Esta acción eliminará permanentemente la compra seleccionada.'}
                            {step === 'reason' && 'Por favor, especifique el motivo de la eliminación.'}
                            {step === 'final' && 'Esta acción es irreversible. Por favor, confirme que desea continuar.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Información de la compra */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Datos de la Compra</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Número:</span>
                                    <span className="font-medium">{compra.numero}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Proveedor:</span>
                                    <span className="font-medium">{compra.proveedor?.nombre || 'Sin proveedor'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium">{formatCurrency(compra.total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Estado:</span>
                                    <span className="font-medium">{compra.estado_documento?.nombre}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contenido específico por paso */}
                        {step === 'confirm' && (
                            <div className="space-y-3">
                                <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                                    <div className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Advertencia:</strong> Esta acción eliminará permanentemente la compra y no se puede deshacer.
                                    </div>
                                </div>

                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>• Se eliminará el registro de la compra</li>
                                    <li>• Se eliminarán todos los detalles asociados</li>
                                    <li>• Se registrará un log de auditoría</li>
                                    <li>• Las cuentas por pagar relacionadas serán canceladas</li>
                                </ul>
                            </div>
                        )}

                        {step === 'reason' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Seleccione el motivo:
                                    </label>
                                    <div className="space-y-2">
                                        {motivosEliminacion.map((motivo) => (
                                            <label key={motivo} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="motivo"
                                                    value={motivo}
                                                    checked={reason === motivo}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">{motivo}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {reason === 'Otro motivo' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Especifique el motivo:
                                        </label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                            rows={3}
                                            placeholder="Describa el motivo de la eliminación..."
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 'final' && (
                            <div className="space-y-3">
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <div className="flex items-center">
                                        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                            <strong>Última confirmación:</strong> Esta acción es irreversible.
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Motivo seleccionado:
                                    </label>
                                    <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">{reason}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Para confirmar, escriba <strong>"eliminar"</strong>:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder="Escriba 'eliminar' para confirmar"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="button"
                                onClick={handleEliminar}
                                disabled={
                                    isDeleting ||
                                    (step === 'reason' && !reason) ||
                                    (step === 'final' && confirmText.toLowerCase() !== 'eliminar')
                                }
                                className={step === 'final' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                                {isDeleting ? (
                                    'Eliminando...'
                                ) : step === 'confirm' ? (
                                    'Continuar'
                                ) : step === 'reason' ? (
                                    'Continuar'
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar Compra
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EliminarCompraDialog;

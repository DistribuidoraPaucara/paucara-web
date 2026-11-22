import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import { Button } from '@/presentation/components/ui/button';
import { AlertCircle, Ban } from 'lucide-react';

/** Error devuelto por POST /compras/{id}/anular cuando la compra no se puede anular */
export interface ErrorAnulacion {
    message: string;
    motivos?: string[];
}

interface AnularCompraModalProps {
    isOpen: boolean;
    onClose: () => void;
    compraNumero: string;
    onConfirm: (motivo?: string) => void;
    isLoading?: boolean;
    /** Motivos por los que el servidor rechazó la anulación (se muestran dentro del modal) */
    error?: ErrorAnulacion | null;
    /** Si es true, al anular se abre la copia de la compra para rehacerla (Anular y duplicar) */
    duplicarDespues?: boolean;
}

export default function AnularCompraModal({
    isOpen,
    onClose,
    compraNumero,
    onConfirm,
    isLoading = false,
    error = null,
    duplicarDespues = false,
}: AnularCompraModalProps) {
    const [motivo, setMotivo] = useState('');

    const handleConfirm = () => {
        onConfirm(motivo || undefined);
    };

    const handleClose = () => {
        setMotivo('');
        onClose();
    };

    const bloqueada = !!error?.motivos?.length;

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        {duplicarDespues ? 'Anular y duplicar compra' : 'Anular Compra'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas anular la compra <strong>{compraNumero}</strong>?
                        {duplicarDespues && (
                            <span className="block mt-2">
                                Se abrirá una copia en "Nueva compra" para que la rehagas con los cambios que necesites.
                            </span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 px-6">
                    {error ? (
                        <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                            <p className="flex items-center gap-2 text-sm font-semibold text-red-900 dark:text-red-200">
                                <Ban className="h-4 w-4 shrink-0" />
                                {error.message}
                            </p>
                            {bloqueada && (
                                <ul className="mt-2 max-h-56 list-disc space-y-1 overflow-y-auto pl-6 text-sm text-red-800 dark:text-red-300">
                                    {error.motivos!.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-sm text-red-900 dark:text-red-200">
                                ⚠️ Esta acción cambiará el estado de la compra a <strong>ANULADA</strong>, devolverá el
                                stock de los lotes donde ingresó y anulará su cuenta por pagar si no tiene pagos. Esta
                                acción es irreversible en este módulo.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Motivo de anulación (opcional)
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Ej: Solicitado por el proveedor, error en el pedido, etc."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-zinc-800 dark:text-white text-sm"
                            rows={3}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            El motivo se añadirá a las observaciones de la compra.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>{bloqueada ? 'Cerrar' : 'Cancelar'}</AlertDialogCancel>
                    {/* Button normal (no AlertDialogAction) para que el modal siga abierto si el servidor rechaza la anulación */}
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? 'Anulando...' : bloqueada ? 'Reintentar' : duplicarDespues ? 'Anular y duplicar' : 'Anular Compra'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

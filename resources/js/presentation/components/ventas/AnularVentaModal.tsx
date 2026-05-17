import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';

interface AnularVentaModalProps {
    isOpen: boolean;
    onClose: () => void;
    ventaNumero: string;
    onConfirm: (motivo?: string) => void;
    isLoading?: boolean;
}

export default function AnularVentaModal({
    isOpen,
    onClose,
    ventaNumero,
    onConfirm,
    isLoading = false
}: AnularVentaModalProps) {
    const [motivo, setMotivo] = useState('');

    const handleConfirm = () => {
        onConfirm(motivo || undefined);
        setMotivo('');
    };

    const handleClose = () => {
        setMotivo('');
        onClose();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Anular Venta
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas anular la venta <strong>{ventaNumero}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 px-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-sm text-red-900 dark:text-red-200">
                            ⚠️ Esta acción cambiará el estado de la venta a <strong>ANULADA</strong>.
                            Esta acción es irreversible en este módulo.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Motivo de anulación (opcional)
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Ej: Solicitado por el cliente, error en la factura, etc."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 dark:bg-zinc-800 dark:text-white text-sm"
                            rows={3}
                            disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            El motivo se añadirá a las observaciones de la venta.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading ? 'Anulando...' : 'Anular Venta'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

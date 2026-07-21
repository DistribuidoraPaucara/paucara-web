import { useState } from 'react';
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
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/presentation/hooks/useToast';
import axios from 'axios';

interface QuitarVentaDeEntregaModalProps {
    isOpen: boolean;
    onClose: () => void;
    ventaId: number;
    ventaNumero: string;
    entregaId: number;
    entregaNumero: string;
    onSuccess: () => void;
}

export default function QuitarVentaDeEntregaModal({
    isOpen,
    onClose,
    ventaId,
    ventaNumero,
    entregaId,
    entregaNumero,
    onSuccess,
}: QuitarVentaDeEntregaModalProps) {
    const { success: toastSuccess, error: toastError } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);

        try {
            const response = await axios.delete(
                `/api/chofer/entregas/${entregaId}/ventas/${ventaId}`
            );

            if (response.data.success) {
                toastSuccess(`✅ ${response.data.message}`);
                onClose();
                setTimeout(() => onSuccess(), 300);
            } else {
                toastError(response.data.message || 'Error al remover la venta');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al remover la venta';
            toastError(message);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        Quitar Venta de Entrega
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas remover la venta <strong>#{ventaNumero}</strong> de la entrega{' '}
                        <strong>#{entregaNumero}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 px-6">
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <p className="text-sm text-orange-900 dark:text-orange-200">
                            ⚠️ La venta será desasignada de esta entrega pero <strong>NO será eliminada</strong>. Podrás
                            reasignarla a otra entrega después.
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                        <div>
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Venta a remover:</p>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">#{ventaNumero}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Entrega actual:</p>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">#{entregaNumero}</p>
                        </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Estado logístico:</p>
                        <p className="text-sm text-purple-900 dark:text-purple-200">
                            El estado logístico cambiará a <strong>PENDIENTE_ENVIO</strong> para permitir reasignación.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {isLoading ? 'Removiendo...' : 'Quitar Venta'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

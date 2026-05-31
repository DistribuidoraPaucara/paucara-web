import React from 'react';
import { Button } from '@/presentation/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/presentation/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface PrestableDeleteConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
    prestableName?: string;
    prestableCodigo?: string;
}

export default function PrestableDeleteConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    isDeleting,
    prestableName,
    prestableCodigo,
}: PrestableDeleteConfirmModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 p-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            Confirmar eliminación
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="px-6 py-4 space-y-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        ¿Estás seguro de que deseas eliminar este prestable?
                    </p>

                    {(prestableName || prestableCodigo) && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            {prestableName && (
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Nombre: <span className="font-normal">{prestableName}</span>
                                </p>
                            )}
                            {prestableCodigo && (
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Código: <span className="font-normal">{prestableCodigo}</span>
                                </p>
                            )}
                        </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        ⚠️ Esta acción no se puede deshacer. Se eliminarán todos los datos relacionados.
                    </p>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isDeleting}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? '⏳ Eliminando...' : '🗑️ Eliminar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

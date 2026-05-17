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
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ProformaConvertirModalProps {
    isOpen: boolean;
    onClose: () => void;
    proforma: any;
    onConvertir: () => void;
    isProcessing: boolean;
    onRenovarReservas?: () => void;
    isRenovando?: boolean;
    errorState?: {
        code?: string;
        message?: string;
        reservasExpiradas?: number;
    } | null;
}

export function ProformaConvertirModal({
    isOpen,
    onClose,
    proforma,
    onConvertir,
    isProcessing,
    onRenovarReservas,
    isRenovando = false,
    errorState = null,
}: ProformaConvertirModalProps) {
    if (!proforma) return null;

    console.log('🎬 ProformaConvertirModal renderizado');
    console.log('   - isOpen:', isOpen);
    console.log('   - errorState:', errorState);
    console.log('   - isProcessing:', isProcessing);
    console.log('   - isRenovando:', isRenovando);

    const handleConvertirClick = () => {
        onConvertir();
    };

    // Si hay error de reservas expiradas, mostrar opciones
    if (errorState?.code === 'RESERVAS_EXPIRADAS') {
        console.log('🎬 Mostrando diálogo de renovación de reservas');
        return (
            <AlertDialog open={isOpen} onOpenChange={onClose}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            Reservas Expiradas
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Las reservas de stock para esta proforma han expirado
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 px-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                            <p className="text-sm text-amber-900 dark:text-amber-200">
                                <strong>{errorState?.reservasExpiradas}</strong> reserva(s) de esta proforma han expirado.
                            </p>
                            <p className="text-sm text-amber-800 dark:text-amber-300 mt-2">
                                Para convertir esta proforma a venta, necesitas renovar las reservas primero.
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-900 dark:text-blue-200">
                                ✨ <strong>Renovar</strong> extenderá las reservas por 7 días más con los mismos productos y cantidades.
                            </p>
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRenovando || isProcessing}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onRenovarReservas?.();
                            }}
                            disabled={isRenovando || isProcessing}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        >
                            {isRenovando ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Renovando...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Renovar Reservas
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    // Modal normal de conversión
    const fechaHoy = new Date().toISOString().split('T')[0];

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Convertir Proforma a Venta</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas convertir la proforma {proforma.numero} a una venta?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 text-sm text-foreground px-6">
                    {/* Fechas de Entrega */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
                        <p className="font-semibold text-blue-900 dark:text-blue-200">Fechas de Entrega</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-foreground/70">Fecha Solicitada:</span>
                                <span className="font-medium">{proforma.fecha_entrega_solicitada || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-foreground/70">Fecha Confirmada:</span>
                                <span className="font-medium">{fechaHoy}</span>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-2">
                        <p>Esta acción:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Creará una nueva venta con los detalles de esta proforma</li>
                            <li>Consumirá el stock reservado de los productos</li>
                            <li>Generará los números de serie correspondientes</li>
                            <li>Marcará esta proforma como CONVERTIDA</li>
                        </ul>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConvertirClick}
                        disabled={isProcessing}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isProcessing ? 'Convirtiendo...' : 'Convertir a Venta'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

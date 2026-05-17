import { useState } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { Tooltip } from '@/presentation/components/ui/tooltip';

interface ReversionStockIndicadorProps {
    ventaId: number;
    ventaNumero: string;
    estadoVenta: string;
    onVerDetalles?: (data: any) => void;
}

export default function ReversionStockIndicador({
    ventaId,
    ventaNumero,
    estadoVenta,
    onVerDetalles,
}: ReversionStockIndicadorProps) {
    const [isVerificando, setIsVerificando] = useState(false);
    const [estadoVerificacion, setEstadoVerificacion] = useState<'sin-verificar' | 'completa' | 'incompleta' | 'sin-reversiones' | null>(null);
    const [datos, setDatos] = useState<any>(null);

    // Solo mostrar para ventas anuladas
    if (estadoVenta?.toUpperCase() !== 'ANULADO') {
        return null;
    }

    const handleVerificar = async () => {
        setIsVerificando(true);
        try {
            const response = await fetch(`/api/ventas/${ventaId}/verificar-reversion-stock`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Error al verificar reversión');
            }

            const data = await response.json();
            setDatos(data);
            setEstadoVerificacion(data.estado);

            if (onVerDetalles) {
                onVerDetalles(data);
            }
        } catch (error) {
            console.error('Error al verificar reversión:', error);
            setEstadoVerificacion(null);
        } finally {
            setIsVerificando(false);
        }
    };

    // Determinar icono y color basado en estado
    const getIconoYColor = () => {
        switch (estadoVerificacion) {
            case 'completa':
                return {
                    Icono: CheckCircle2,
                    color: 'text-green-600 dark:text-green-400',
                    bgColor: 'bg-green-50 dark:bg-green-900/20',
                    borderColor: 'border-green-200 dark:border-green-800',
                    label: 'Reversión Completa',
                };
            case 'incompleta':
                return {
                    Icono: AlertCircle,
                    color: 'text-yellow-600 dark:text-yellow-400',
                    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                    borderColor: 'border-yellow-200 dark:border-yellow-800',
                    label: 'Reversión Incompleta',
                };
            case 'sin-reversiones':
                return {
                    Icono: XCircle,
                    color: 'text-red-600 dark:text-red-400',
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    borderColor: 'border-red-200 dark:border-red-800',
                    label: 'Sin Reversión',
                };
            default:
                return {
                    Icono: AlertCircle,
                    color: 'text-gray-600 dark:text-gray-400',
                    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
                    borderColor: 'border-gray-200 dark:border-gray-800',
                    label: 'Sin Verificar',
                };
        }
    };

    const { Icono, color, bgColor, borderColor, label } = getIconoYColor();

    return (
        <div className="flex items-center gap-2">
            <Tooltip
                content={label}
                side="top"
            >
                <button
                    onClick={handleVerificar}
                    disabled={isVerificando}
                    className={`p-2 rounded-lg border transition-all ${bgColor} ${borderColor} hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isVerificando ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                    ) : (
                        <Icono className={`w-4 h-4 ${color}`} />
                    )}
                </button>
            </Tooltip>

            {/* Mostrar detalles si está disponible */}
            {datos && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className={estadoVerificacion === 'completa' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                        {datos.movimientos_original?.CONSUMO_RESERVA || 0}+{datos.movimientos_original?.SALIDA_VENTA || 0} mov.
                    </span>
                </div>
            )}
        </div>
    );
}

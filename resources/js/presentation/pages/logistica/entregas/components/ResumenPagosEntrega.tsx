import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, CreditCard, DollarSign, TrendingUp, Zap } from 'lucide-react';
import { useToastNotifications } from '@/application/hooks/use-toast-notifications';

// ✅ NUEVA 2026-02-12: Interfaces para resumen de pagos
interface PagoVenta {
    venta_id: number;
    venta_numero: string;
    monto_recibido: number;
    referencia: string | null;
    tipo_entrega: string;
    tipo_novedad: string | null;
}

interface PagoTipo {
    tipo_pago_id: number;
    tipo_pago: string;
    tipo_pago_codigo: string;
    total: number;
    cantidad_ventas: number;
    ventas: PagoVenta[];
}

interface VentaSinRegistrar {
    venta_id: number;
    venta_numero: string;
    monto: number;
    tipo_pago_id: number;
    tipo_pago: string;
    tipo_pago_codigo: string;
}

interface ResumenPagosData {
    entrega_id: number;
    numero_entrega: string;
    total_esperado: number;
    pagos: PagoTipo[];
    sin_registrar: VentaSinRegistrar[];
    total_recibido: number;
    diferencia: number;
    porcentaje_recibido: number;
}

interface ResumenPagosEntregaProps {
    entregaId: number | string;
}

export default function ResumenPagosEntrega({ entregaId }: ResumenPagosEntregaProps) {
    const [resumen, setResumen] = useState<ResumenPagosData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showNotification } = useToastNotifications();

    useEffect(() => {
        const fetchResumen = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/chofer/entregas/${entregaId}/resumen-pagos`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('[ResumenPagos] Fetching resumen from API...', { entregaId, response });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const json = await response.json();

                console.log('[ResumenPagos] 📊 RESPUESTA COMPLETA DEL BACKEND:', JSON.stringify(json, null, 2));
                console.log('[ResumenPagos] 💳 Pagos retornados:', json.data?.pagos);
                console.log('[ResumenPagos] 📋 Sin registrar:', json.data?.sin_registrar);

                if (json.success && json.data) {
                    setResumen(json.data);
                } else {
                    setError('No se pudo obtener el resumen de pagos');
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(`Error al cargar resumen: ${message}`);
                console.error('[ResumenPagos]', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResumen();
    }, [entregaId]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 animate-spin text-blue-500" />
                    <p className="text-gray-600 dark:text-gray-400">Cargando resumen de pagos...</p>
                </div>
            </div>
        );
    }

    if (error || !resumen) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-red-200 dark:border-red-800 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-800 dark:text-red-200 font-medium">{error || 'Sin datos'}</p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            No se pudo cargar el resumen de pagos para esta entrega
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Calcular estado
    const estaPerfecto = resumen.total_recibido >= resumen.total_esperado;
    const esParcial = resumen.total_recibido > 0 && resumen.total_recibido < resumen.total_esperado;
    const sinPagar = resumen.total_recibido === 0;

    // Colores según estado
    const statusColor = estaPerfecto
        ? 'from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800'
        : esParcial
            ? 'from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-200 dark:border-orange-800'
            : 'from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 border-red-200 dark:border-red-800';

    const statusTextColor = estaPerfecto
        ? 'text-green-900 dark:text-green-200'
        : esParcial
            ? 'text-orange-900 dark:text-orange-200'
            : 'text-red-900 dark:text-red-200';

    const statusBadgeColor = estaPerfecto
        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
        : esParcial
            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';

    const progressColor = estaPerfecto
        ? 'bg-green-500'
        : esParcial
            ? 'bg-orange-500'
            : 'bg-red-500';

    return (
        <div className={`bg-gradient-to-br ${statusColor} rounded-lg border p-6 space-y-4`}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${statusTextColor}`}>
                        <CreditCard className="w-5 h-5" />
                        Resumen de Pagos
                    </h3>
                    <p className={`text-sm ${statusTextColor} opacity-75`}>
                        {resumen.numero_entrega}
                    </p>
                </div>

                {/* Estado Badge */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColor}`}>
                    {estaPerfecto ? '✅ Pagado Completo' : esParcial ? '⚠️ Pagado Parcial' : '❌ Sin Pagar'}
                </div>
            </div>

            {/* Totales Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Esperado */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Esperado</span>
                        <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        Bs. {resumen.total_esperado.toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>

                {/* Total Recibido */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recibido</span>
                        <CheckCircle className={`w-4 h-4 ${estaPerfecto ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
                    </div>
                    <p className={`text-2xl font-bold ${estaPerfecto ? 'text-green-600 dark:text-green-400' : esParcial ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                        Bs. {resumen.total_recibido.toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>

                {/* Diferencia */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Falta por Recibir</span>
                        <AlertCircle className={`w-4 h-4 ${resumen.diferencia > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
                    </div>
                    <p className={`text-2xl font-bold ${resumen.diferencia > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        Bs. {resumen.diferencia.toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso de Pago</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {resumen.porcentaje_recibido}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                        className={`${progressColor} h-full transition-all duration-300`}
                        style={{ width: `${Math.min(resumen.porcentaje_recibido, 100)}%` }}
                    />
                </div>
            </div>

            {/* Desglose por Tipo de Pago */}
            {resumen.pagos.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Desglose por Tipo de Pago</h4>
                    <div className="space-y-2">
                        {resumen.pagos.map((pago) => (
                            <div
                                key={pago.tipo_pago_id}
                                className="flex items-center justify-between bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">{pago.tipo_pago}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {pago.cantidad_ventas} venta{pago.cantidad_ventas !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        Bs. {pago.total.toLocaleString('es-BO', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Ventas sin Pagar */}
            {resumen.sin_registrar.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        Ventas sin Pago Registrado ({resumen.sin_registrar.length})
                    </h4>
                    <div className="space-y-2">
                        {resumen.sin_registrar.map((venta) => (
                            <div
                                key={venta.venta_id}
                                className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800"
                            >
                                <div className="flex-1 flex items-center gap-3">
                                    <div>
                                        <p className="font-medium text-orange-900 dark:text-orange-200">{venta.venta_numero}</p>
                                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
                                            💳 {venta.tipo_pago || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-orange-900 dark:text-orange-200">
                                        Bs. {venta.monto.toLocaleString('es-BO', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info Footer */}
            <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
                📊 Este resumen se obtiene de los pagos registrados en el sistema de logística
            </div>
        </div>
    );
}

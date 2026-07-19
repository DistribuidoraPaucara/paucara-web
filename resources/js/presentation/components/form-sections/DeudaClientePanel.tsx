import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { AlertCircle, TrendingUp, CreditCard, CheckCircle2, XCircle } from 'lucide-react'

export interface DeudaInfo {
    cliente_nombre: string
    limite_credito: number
    cuentas_por_cobrar: number
    proformas_pendientes: number
    total_deuda: number
    disponible_credito: number
    puede_hacer_credito: boolean
}

interface DeudaClientePanelProps {
    deuda: DeudaInfo | null
    politicaPago?: string
    loading?: boolean
}

/**
 * ✅ NUEVO (2026-07-18): Componente que muestra:
 * - Deuda actual del cliente
 * - Disponible para crédito
 * - Validación de límite de crédito
 */
export default function DeudaClientePanel({
    deuda,
    politicaPago = 'CONTRA_ENTREGA',
    loading = false,
}: DeudaClientePanelProps) {
    if (!deuda || loading) return null

    const mostrarAlerta = politicaPago === 'CREDITO' && !deuda.puede_hacer_credito

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(amount)
    }

    return (
        <div className="space-y-4">
            {/* Tarjeta de alerta si no puede hacer crédito */}
            {mostrarAlerta && (
                <Card className="border-2 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                    <CardContent>
                        <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                            <div>
                                <p className="font-semibold text-red-900 dark:text-red-200">
                                    ⚠️ Límite de crédito excedido
                                </p>
                                <p className="text-sm text-red-800 dark:text-red-300">
                                    La deuda total (Bs {formatCurrency(deuda.total_deuda)}) excede el límite de crédito
                                    permitido (Bs {formatCurrency(deuda.limite_credito)})
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Grid de información */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Cuentas por Cobrar */}
                <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-amber-600" />
                            Cuentas por Cobrar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                            {formatCurrency(deuda.cuentas_por_cobrar)}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            Estados: ACTIVA, PENDIENTE, PARCIAL
                        </p>
                    </CardContent>
                </Card>

                {/* Proformas Pendientes */}
                <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            Proformas Pendientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            {formatCurrency(deuda.proformas_pendientes)}
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                            En aprobación
                        </p>
                    </CardContent>
                </Card>

                {/* Total Deuda */}
                <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-4 w-4 text-red-600" />
                            Total Deuda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                            {formatCurrency(deuda.total_deuda)}
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300">
                            Suma de ambas deudas
                        </p>
                    </CardContent>
                </Card>

                {/* Disponible para Crédito */}
                <Card className={`border-2 ${
                    deuda.disponible_credito > 0
                        ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                }`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            {deuda.disponible_credito > 0 ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                                <XCircle className="h-4 w-4 text-gray-600" />
                            )}
                            Disponible para Crédito
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-2xl font-bold ${
                            deuda.disponible_credito > 0
                                ? 'text-green-900 dark:text-green-100'
                                : 'text-gray-900 dark:text-gray-100'
                        }`}>
                            {formatCurrency(deuda.disponible_credito)}
                        </p>
                        <p className={`text-xs ${
                            deuda.disponible_credito > 0
                                ? 'text-green-700 dark:text-green-300'
                                : 'text-gray-700 dark:text-gray-400'
                        }`}>
                            Límite: {formatCurrency(deuda.limite_credito)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Info adicional */}
            {politicaPago === 'CREDITO' && (
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                    <CardContent className="pt-6">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                            <strong>ℹ️ Nota:</strong> Esta proforma se registrará como <strong>CRÉDITO</strong>.
                            {deuda.puede_hacer_credito ? (
                                <span className="block text-green-700 dark:text-green-300">
                                    ✓ El cliente tiene disponibilidad de crédito
                                </span>
                            ) : (
                                <span className="block text-red-700 dark:text-red-300">
                                    ✗ Advertencia: Excede el límite de crédito
                                </span>
                            )}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

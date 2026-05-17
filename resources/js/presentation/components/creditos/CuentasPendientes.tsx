/**
 * CuentasPendientes Component
 * Displays list of pending/overdue accounts with details
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { AlertCircle, Calendar, AlertTriangle } from 'lucide-react';
import type { CuentaPorCobrar } from '@/domain/entities/credito';
import { getCuentaColorByEstado, getCuentaEstadoLabel } from '@/domain/entities/credito';

interface CuentasPendientesProps {
  cuentas: CuentaPorCobrar[];
  loading?: boolean;
  emptyMessage?: string;
}

const getEstadoBadgeVariant = (estado: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (estado) {
    case 'pendiente':
      return 'default';
    case 'vencida':
      return 'destructive';
    case 'pagada':
      return 'secondary';
    case 'parcial':
      return 'outline';
    default:
      return 'outline';
  }
};

export const CuentasPendientes: React.FC<CuentasPendientesProps> = ({
  cuentas,
  loading = false,
  emptyMessage = 'No hay cuentas pendientes',
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getPorcentajePagado = (montoOriginal: number, saldoPendiente: number) => {
    if (montoOriginal === 0) return 0;
    return ((montoOriginal - saldoPendiente) / montoOriginal) * 100;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cuentas Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Cuentas Pendientes
          {cuentas.length > 0 && (
            <Badge variant="outline">{cuentas.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {cuentas.length === 0 ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {emptyMessage}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {cuentas.map((cuenta) => {
              const porcentajePagado = getPorcentajePagado(
                cuenta.monto_original,
                cuenta.saldo_pendiente
              );
              const estaVencida = cuenta.estado === 'vencida';

              return (
                <div
                  key={cuenta.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {cuenta.venta_numero || `Venta #${cuenta.venta_id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cuenta.cliente_nombre || 'Cliente desconocido'}
                      </p>
                    </div>
                    <Badge variant={getEstadoBadgeVariant(cuenta.estado)}>
                      {getCuentaEstadoLabel(cuenta.estado)}
                    </Badge>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Original</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(cuenta.monto_original)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Pendiente</p>
                      <p className="font-semibold text-orange-600">
                        {formatCurrency(cuenta.saldo_pendiente)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Pagado</p>
                      <p className="font-semibold text-green-600">
                        {porcentajePagado.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${porcentajePagado}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer with dates */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Vencimiento: {formatDate(cuenta.fecha_vencimiento)}</span>
                    </div>
                    {estaVencida && (
                      <div className="flex items-center gap-1 text-red-600 font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Vencida hace {cuenta.dias_vencido} días</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CuentasPendientes;

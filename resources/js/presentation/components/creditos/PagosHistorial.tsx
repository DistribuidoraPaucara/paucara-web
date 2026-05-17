/**
 * PagosHistorial Component
 * Displays payment history with details
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { AlertCircle, CreditCard, User, Calendar } from 'lucide-react';
import type { Pago } from '@/domain/entities/credito';
import { getTipoPagoLabel } from '@/domain/entities/credito';

interface PagosHistorialProps {
  pagos: Pago[];
  loading?: boolean;
  emptyMessage?: string;
}

const getTipoPagoBadgeVariant = (tipo: string): 'default' | 'secondary' | 'outline' => {
  switch (tipo) {
    case 'efectivo':
      return 'secondary';
    case 'transferencia':
      return 'default';
    case 'cheque':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const PagosHistorial: React.FC<PagosHistorialProps> = ({
  pagos,
  loading = false,
  emptyMessage = 'No hay pagos registrados',
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPagado = pagos.reduce((sum, pago) => sum + pago.monto, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Historial de Pagos
            {pagos.length > 0 && (
              <Badge variant="outline">{pagos.length}</Badge>
            )}
          </CardTitle>
          {pagos.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-600 font-medium">Total Pagado</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(totalPagado)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {pagos.length === 0 ? (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              {emptyMessage}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {pagos.map((pago) => (
              <div
                key={pago.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(pago.monto)}
                      </p>
                    </div>
                    <Badge variant={getTipoPagoBadgeVariant(pago.tipo_pago)}>
                      {getTipoPagoLabel(pago.tipo_pago)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 font-medium">Pago #</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {pago.numero_recibo || `#${pago.id}`}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(pago.fecha_pago)}</span>
                  </div>

                  {pago.usuario_nombre && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Registrado por: {pago.usuario_nombre}</span>
                    </div>
                  )}

                  {pago.observaciones && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <p className="font-medium text-gray-700 mb-1">Observaciones:</p>
                      <p className="text-gray-600">{pago.observaciones}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PagosHistorial;

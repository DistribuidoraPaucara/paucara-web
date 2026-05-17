/**
 * CreditoResumen Component
 * Displays credit summary with limit, available, used, and utilization percentage
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Progress } from '@/presentation/components/ui/progress';
import { Badge } from '@/presentation/components/ui/badge';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import type { Credito } from '@/domain/entities/credito';
import { getCreditoColorByEstado, getCreditoEstadoLabel } from '@/domain/entities/credito';

interface CreditoResumenProps {
  credito: Credito;
  onVerDetalles?: () => void;
}

const getEstadoBadgeVariant = (estado: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (estado) {
    case 'disponible':
      return 'secondary';
    case 'en_uso':
      return 'default';
    case 'critico':
      return 'destructive';
    case 'excedido':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const CreditoResumen: React.FC<CreditoResumenProps> = ({
  credito,
  onVerDetalles,
}) => {
  const color = getCreditoColorByEstado(credito.estado);
  const estadoLabel = getCreditoEstadoLabel(credito.estado);
  const esCritico = credito.estado === 'critico' || credito.estado === 'excedido';
  const tieneVencidas = credito.cuentas_vencidas_count > 0;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Mi Crédito</CardTitle>
          <Badge variant={getEstadoBadgeVariant(credito.estado)}>
            {estadoLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Disponible */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Disponible</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(credito.saldo_disponible)}
            </p>
          </div>

          {/* Límite */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Límite</p>
            <p className="text-lg font-bold text-gray-700">
              {formatCurrency(credito.limite_credito_aprobado)}
            </p>
          </div>

          {/* Utilizado */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Utilizado</p>
            <p className="text-lg font-bold text-orange-600">
              {formatCurrency(credito.saldo_utilizado)}
            </p>
          </div>
        </div>

        {/* Utilization Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Utilización</p>
            <p className="text-sm font-bold" style={{ color }}>
              {credito.porcentaje_utilizado.toFixed(1)}%
            </p>
          </div>
          <Progress
            value={Math.min(credito.porcentaje_utilizado, 100)}
            className="h-3"
            style={{
              '--progress-background': color,
            } as any}
          />
        </div>

        {/* Pending and Overdue Info */}
        {(credito.cuentas_pendientes_count > 0 || credito.cuentas_vencidas_count > 0) && (
          <div className="flex gap-2 pt-2">
            {credito.cuentas_pendientes_count > 0 && (
              <div className="flex-1 bg-blue-50 rounded p-2 text-center">
                <p className="text-xs text-blue-700 font-semibold">
                  {credito.cuentas_pendientes_count}
                </p>
                <p className="text-xs text-blue-600">Pendientes</p>
              </div>
            )}
            {credito.cuentas_vencidas_count > 0 && (
              <div className="flex-1 bg-red-50 rounded p-2 text-center">
                <p className="text-xs text-red-700 font-semibold">
                  {credito.cuentas_vencidas_count}
                </p>
                <p className="text-xs text-red-600">Vencidas</p>
              </div>
            )}
          </div>
        )}

        {/* Alerts */}
        {esCritico && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 text-sm">
              {credito.estado === 'excedido'
                ? 'Tu crédito está excedido. Contacta a ventas.'
                : 'Tu crédito está al 80% o más. Por favor realiza un pago.'}
            </AlertDescription>
          </Alert>
        )}

        {tieneVencidas && !esCritico && (
          <Alert variant="destructive" className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700 text-sm">
              Tienes {credito.cuentas_vencidas_count} cuenta
              {credito.cuentas_vencidas_count > 1 ? 's' : ''} vencida
              {credito.cuentas_vencidas_count > 1 ? 's' : ''}.
            </AlertDescription>
          </Alert>
        )}

        {/* Ver Detalles Button */}
        {onVerDetalles && (
          <button
            onClick={onVerDetalles}
            className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Ver Detalles →
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditoResumen;

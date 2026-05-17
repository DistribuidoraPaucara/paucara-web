/**
 * CreditoAlert Component
 * Reusable alert component for credit-related warnings
 */

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/presentation/components/ui/alert';
import { AlertTriangle, AlertCircle, Info, CheckCircle, TrendingDown } from 'lucide-react';

export type CreditoAlertType = 'vencido' | 'critico' | 'excedido' | 'info' | 'success' | 'warning';

interface CreditoAlertProps {
  type: CreditoAlertType;
  title: string;
  description: string;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

const getAlertConfig = (type: CreditoAlertType) => {
  const configs: Record<CreditoAlertType, {
    variant: 'default' | 'destructive';
    icon: React.ReactNode;
    bgClass: string;
    borderClass: string;
    textClass: string;
  }> = {
    vencido: {
      variant: 'destructive',
      icon: <AlertTriangle className="h-4 w-4" />,
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200',
      textClass: 'text-orange-700',
    },
    critico: {
      variant: 'destructive',
      icon: <AlertCircle className="h-4 w-4" />,
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      textClass: 'text-red-700',
    },
    excedido: {
      variant: 'destructive',
      icon: <TrendingDown className="h-4 w-4" />,
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      textClass: 'text-red-700',
    },
    info: {
      variant: 'default',
      icon: <Info className="h-4 w-4" />,
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      textClass: 'text-blue-700',
    },
    success: {
      variant: 'default',
      icon: <CheckCircle className="h-4 w-4" />,
      bgClass: 'bg-green-50',
      borderClass: 'border-green-200',
      textClass: 'text-green-700',
    },
    warning: {
      variant: 'default',
      icon: <AlertTriangle className="h-4 w-4" />,
      bgClass: 'bg-yellow-50',
      borderClass: 'border-yellow-200',
      textClass: 'text-yellow-700',
    },
  };

  return configs[type];
};

export const CreditoAlert: React.FC<CreditoAlertProps> = ({
  type,
  title,
  description,
  details,
  action,
  onDismiss,
}) => {
  const config = getAlertConfig(type);

  return (
    <Alert
      variant={config.variant}
      className={`${config.bgClass} ${config.borderClass}`}
    >
      <div className="flex items-start gap-3">
        <div className={config.textClass}>{config.icon}</div>
        <div className="flex-1">
          <AlertTitle className={config.textClass}>{title}</AlertTitle>
          <AlertDescription className={`${config.textClass} mt-1`}>
            {description}
          </AlertDescription>
          {details && (
            <p className={`${config.textClass} text-xs mt-2 opacity-75`}>
              {details}
            </p>
          )}

          {/* Actions */}
          {(action || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {action && (
                <button
                  onClick={action.onClick}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    type === 'vencido' || type === 'critico' || type === 'excedido'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {action.label}
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="px-3 py-1 rounded text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
                >
                  Descartar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

// Preset alert components for common scenarios
export const CreditoVencidoAlert: React.FC<{
  clienteNombre: string;
  diasVencido: number;
  saldoPendiente: number;
  onPagar?: () => void;
  onDismiss?: () => void;
}> = ({ clienteNombre, diasVencido, saldoPendiente, onPagar, onDismiss }) => {
  return (
    <CreditoAlert
      type="vencido"
      title="⚠️ Crédito Vencido"
      description={`${clienteNombre} tiene una deuda vencida.`}
      details={`Vencido hace ${diasVencido} días • Deuda: Bs. ${saldoPendiente.toFixed(2)}`}
      action={onPagar ? { label: 'Registrar Pago', onClick: onPagar } : undefined}
      onDismiss={onDismiss}
    />
  );
};

export const CreditoCriticoAlert: React.FC<{
  clienteNombre: string;
  porcentajeUtilizado: number;
  saldoDisponible: number;
  onPagar?: () => void;
  onDismiss?: () => void;
}> = ({ clienteNombre, porcentajeUtilizado, saldoDisponible, onPagar, onDismiss }) => {
  return (
    <CreditoAlert
      type="critico"
      title="🔴 Crédito Crítico"
      description={`${clienteNombre} está utilizando más del 80% de su límite de crédito.`}
      details={`Utilización: ${porcentajeUtilizado.toFixed(1)}% • Disponible: Bs. ${saldoDisponible.toFixed(2)}`}
      action={onPagar ? { label: 'Realizar Pago', onClick: onPagar } : undefined}
      onDismiss={onDismiss}
    />
  );
};

export const CreditoExcedidoAlert: React.FC<{
  clienteNombre: string;
  montoExcedido: number;
  onContactar?: () => void;
  onDismiss?: () => void;
}> = ({ clienteNombre, montoExcedido, onContactar, onDismiss }) => {
  return (
    <CreditoAlert
      type="excedido"
      title="❌ Crédito Excedido"
      description={`${clienteNombre} ha excedido su límite de crédito aprobado.`}
      details={`Monto excedido: Bs. ${montoExcedido.toFixed(2)}`}
      action={
        onContactar ? { label: 'Contactar a Ventas', onClick: onContactar } : undefined
      }
      onDismiss={onDismiss}
    />
  );
};

export const CreditoInfoAlert: React.FC<{
  title: string;
  description: string;
  details?: string;
  onDismiss?: () => void;
}> = ({ title, description, details, onDismiss }) => {
  return (
    <CreditoAlert
      type="info"
      title={title}
      description={description}
      details={details}
      onDismiss={onDismiss}
    />
  );
};

export default CreditoAlert;

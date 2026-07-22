import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface MetricasCardProps {
  metricas: {
    total_ingresos: number;
    total_egresos: number;
    efectivo_esperado: number;
    montos_apertura: number;
  };
}

export function MetricasCard({ metricas }: MetricasCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Montos de Apertura */}
      <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              Apertura
            </CardTitle>
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {formatCurrency(metricas.montos_apertura)}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Dinero inicial en cajas
          </p>
        </CardContent>
      </Card>

      {/* Total Ingresos */}
      <Card className="border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-300">
              Ingresos
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
            {formatCurrency(metricas.total_ingresos)}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Dinero que entra hoy
          </p>
        </CardContent>
      </Card>

      {/* Total Egresos */}
      <Card className="border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-red-900 dark:text-red-300">
              Egresos
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(metricas.total_egresos)}
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Dinero que sale hoy
          </p>
        </CardContent>
      </Card>

      {/* Efectivo Esperado */}
      <Card className="border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-300">
              Efectivo Esperado
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {formatCurrency(metricas.efectivo_esperado)}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Apertura + Ingresos - Egresos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

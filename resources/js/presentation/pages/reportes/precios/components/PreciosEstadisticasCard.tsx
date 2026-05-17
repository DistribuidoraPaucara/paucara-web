import { Card, CardContent } from '@/presentation/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/reportes.utils';
import type { PreciosEstadisticas } from '@/domain/entities/reportes';

interface PreciosEstadisticasCardProps {
  estadisticas: PreciosEstadisticas;
}

export function PreciosEstadisticasCard({ estadisticas }: PreciosEstadisticasCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{estadisticas.total_precios}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Precios</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(estadisticas.precio_promedio)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Precio Promedio</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(estadisticas.precio_minimo)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Precio Mínimo</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(estadisticas.precio_maximo)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Precio Máximo</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{estadisticas.total_productos_con_precio}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Productos</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

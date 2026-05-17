import { Card, CardContent } from '@/presentation/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/reportes.utils';
import type { GananciasEstadisticas } from '@/domain/entities/reportes';

interface EstadisticasCardProps {
  estadisticas: GananciasEstadisticas;
}

/**
 * Componente que muestra tarjetas de estadísticas del reporte de ganancias
 */
export function EstadisticasCard({ estadisticas }: EstadisticasCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {/* Total Productos */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{estadisticas.total_productos}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Productos</p>
          </div>
        </CardContent>
      </Card>

      {/* Ganancia Total */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(estadisticas.ganancia_total)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ganancia Total</p>
          </div>
        </CardContent>
      </Card>

      {/* Ganancia Promedio */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500 dark:text-green-300">
              {formatCurrency(estadisticas.ganancia_promedio)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ganancia Promedio</p>
          </div>
        </CardContent>
      </Card>

      {/* Porcentaje Promedio */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatPercentage(estadisticas.porcentaje_promedio)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">% Promedio</p>
          </div>
        </CardContent>
      </Card>

      {/* Mejor Ganancia */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(estadisticas.mejor_ganancia)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mejor Ganancia</p>
          </div>
        </CardContent>
      </Card>

      {/* Peor Ganancia */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              estadisticas.peor_ganancia >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(estadisticas.peor_ganancia)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Peor Ganancia</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/inventario.utils';
import type { MovimientosEstadisticas } from '@/domain/entities/reportes';

interface MovimientosEstadisticasCardProps {
  estadisticas: MovimientosEstadisticas;
}

export function MovimientosEstadisticasCard({ estadisticas }: MovimientosEstadisticasCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Total Entradas</div>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            +{formatNumber(estadisticas.total_entradas)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Total Salidas</div>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            -{formatNumber(estadisticas.total_salidas)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Movimientos Netos</div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatNumber(estadisticas.total_entradas - estadisticas.total_salidas)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

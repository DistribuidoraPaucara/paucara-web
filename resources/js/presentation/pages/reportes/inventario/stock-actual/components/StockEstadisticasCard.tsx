import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Package2, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/inventario.utils';
import type { StockEstadisticas } from '@/domain/entities/reportes';

interface StockEstadisticasCardProps {
  estadisticas: StockEstadisticas;
}

export function StockEstadisticasCard({ estadisticas }: StockEstadisticasCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Total Productos</div>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(estadisticas.total_productos)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Stock Total</div>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(estadisticas.total_stock)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Stock Bajo</div>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{estadisticas.productos_stock_bajo}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Stock Alto</div>
          <TrendingUp className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{estadisticas.productos_stock_alto}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Valor Total</div>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(estadisticas.valor_total_inventario)}</div>
        </CardContent>
      </Card>
    </div>
  );
}

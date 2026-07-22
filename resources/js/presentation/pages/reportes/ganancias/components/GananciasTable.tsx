import { Link } from '@inertiajs/react';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
  getColorClass,
  getGananciaColor,
  getEstadoGanancia,
  formatCurrency,
  formatPercentage,
} from '@/lib/reportes.utils';
import type { Ganancia } from '@/domain/entities/reportes';

interface GananciasTableProps {
  ganancias: Ganancia[] | any;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
}

/**
 * Componente que muestra la tabla de ganancias con análisis detallado
 */
export function GananciasTable({ ganancias, isLoading = false }: GananciasTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Ganancias</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Index</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tipo de Precio</TableHead>
                <TableHead className="text-right">Precio Costo</TableHead>
                <TableHead className="text-right">Precio Venta</TableHead>
                <TableHead className="text-right">Ganancia</TableHead>
                <TableHead className="text-right">% Ganancia</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Fecha de Venta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!ganancias.data || ganancias.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No se encontraron datos de ganancia con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                ganancias.data.map((item: Ganancia, index: number) => {
                  const estadoGanancia = getEstadoGanancia(item.porcentaje_ganancia);

                  return (
                    <TableRow key={index}>
                      <TableCell className="text-left">{index + 1}</TableCell>
                      {/* Producto */}
                      <TableCell>
                        <Link
                          href={`/productos/${item.producto.id}/edit`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium"
                        >
                          {item.producto.nombre}
                        </Link>
                      </TableCell>

                      {/* Categoría */}
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.producto.categoria?.nombre || 'Sin categoría'}
                        </span>
                      </TableCell>

                      {/* Tipo de Precio */}
                      <TableCell>
                        <Badge className={getColorClass(item.tipo_precio.color)}>
                          <span className="mr-1">
                            {item.tipo_precio.configuracion?.icono || '💰'}
                          </span>
                          {item.tipo_precio.nombre}
                        </Badge>
                      </TableCell>

                      {/* Precio Costo */}
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.precio_costo)}
                      </TableCell>

                      {/* Precio Venta */}
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.precio_venta)}
                      </TableCell>

                      {/* Ganancia */}
                      <TableCell
                        className={`text-right font-semibold ${
                          item.ganancia >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatCurrency(item.ganancia)}
                      </TableCell>

                      {/* % Ganancia */}
                      <TableCell
                        className={`text-right font-bold ${getGananciaColor(
                          item.porcentaje_ganancia
                        )}`}
                      >
                        {formatPercentage(item.porcentaje_ganancia)}
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="text-center">
                        <Badge className={estadoGanancia.badge}>
                          {estadoGanancia.icon} {estadoGanancia.label}
                        </Badge>
                      </TableCell>

                      {/* Fecha de Venta */}
                      <TableCell className="text-center text-sm text-gray-600 dark:text-gray-400">
                        {item.fecha_actualizacion
                          ? new Date(item.fecha_actualizacion).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : '-'
                        }
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

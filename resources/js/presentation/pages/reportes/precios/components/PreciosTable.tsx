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
import { Button } from '@/presentation/components/ui/button';
import { formatCurrency, formatDateOnly, getColorClass } from '@/lib/reportes.utils';
import type { PreciosPaginatedData } from '@/domain/entities/reportes';

interface PreciosTableProps {
  precios: PreciosPaginatedData;
}

export function PreciosTable({ precios }: PreciosTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Precios</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo de Precio</TableHead>
              <TableHead>Nombre del Precio</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Última Actualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {precios.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No se encontraron precios con los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              precios.data.map((precio) => (
                <TableRow key={precio.id}>
                  <TableCell>
                    <Link
                      href={`/productos/${precio.producto.id}/edit`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium"
                    >
                      {precio.producto.nombre}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <span className="text-gray-600 dark:text-gray-400">
                      {precio.producto.categoria?.nombre || 'Sin categoría'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge className={getColorClass(precio.tipo_precio.color)}>
                      <span className="mr-1">
                        {precio.tipo_precio.configuracion?.icono || '💰'}
                      </span>
                      {precio.tipo_precio.nombre}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-gray-900 dark:text-gray-100">{precio.nombre}</span>
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {formatCurrency(precio.precio)}
                  </TableCell>

                  <TableCell className="text-center text-gray-600 dark:text-gray-400">
                    {precio.fecha_ultima_actualizacion
                      ? formatDateOnly(precio.fecha_ultima_actualizacion)
                      : 'N/A'
                    }
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Paginación */}
      {precios.links && precios.links.length > 3 && (
        <div className="flex justify-center gap-1 p-4">
          {precios.links.map((link, index) => (
            <Button
              key={index}
              variant={link.active ? "default" : "outline"}
              size="sm"
              disabled={!link.url}
              onClick={() => link.url && (window.location.href = link.url)}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

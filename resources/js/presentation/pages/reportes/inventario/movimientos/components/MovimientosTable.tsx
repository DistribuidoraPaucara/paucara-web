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
import { Calendar, Package, Building2, User } from 'lucide-react';
import {
  formatDate,
  formatNumber,
  getTipoMovimientoColor,
  getTipoMovimientoIcon,
} from '@/lib/inventario.utils';
import type { MovimientosPaginatedData } from '@/domain/entities/reportes';

interface MovimientosTableProps {
  movimientos: MovimientosPaginatedData;
  tipos: Record<string, string>;
}

export function MovimientosTable({ movimientos, tipos }: MovimientosTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos de Inventario ({movimientos.total} registros)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Almacén</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Referencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.data.map((movimiento) => {
                const TipoIcon = getTipoMovimientoIcon(movimiento.tipo);
                const tipoColor = getTipoMovimientoColor(movimiento.tipo);

                return (
                  <TableRow key={movimiento.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(movimiento.fecha)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={tipoColor} className="gap-1">
                        <TipoIcon className="h-3 w-3" />
                        {tipos[movimiento.tipo] || movimiento.tipo}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {movimiento.stock_producto.producto.nombre}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {movimiento.stock_producto.almacen.nombre}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <span className={`font-mono font-semibold ${movimiento.cantidad > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {movimiento.cantidad > 0 ? '+' : ''}{formatNumber(movimiento.cantidad)}
                      </span>
                    </TableCell>

                    <TableCell>
                      {movimiento.user && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {movimiento.user.name}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {movimiento.numero_referencia || movimiento.motivo || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {movimientos.last_page > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((movimientos.current_page - 1) * movimientos.per_page) + 1} a{' '}
              {Math.min(movimientos.current_page * movimientos.per_page, movimientos.total)} de{' '}
              {movimientos.total} registros
            </div>
            <div className="flex items-center space-x-2">
              {movimientos.links.map((link, index) => (
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}

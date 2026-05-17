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
import { formatNumber, getStockStatus } from '@/lib/inventario.utils';
import GenericPagination from '@/presentation/components/generic/generic-pagination';
import type { StockPaginatedData } from '@/domain/entities/reportes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StockTableProps {
  stock: StockPaginatedData;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
}

export function StockTable({ stock, isLoading = false, onPageChange, onPerPageChange }: StockTableProps) {
  console.log('🔍 StockTable - Datos recibidos del backend:', stock);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock por Producto ({stock.total} registros)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Código</TableHead>
                {/* <TableHead>Categoría</TableHead> */}
                <TableHead>Almacén</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Disponible</TableHead>
                <TableHead className="text-right">Reservada</TableHead>
                {/* <TableHead className="text-right">Min/Max</TableHead> */}
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.data.map((item) => {
                const stockInfo = getStockStatus(item);
                const Icon = stockInfo.icon;

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/productos/${item.producto.id}/edit`}
                        className="hover:underline"
                      >
                        {item.producto.nombre}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.producto.sku}</TableCell>
                    {/* <TableCell>{item.producto.categoria?.nombre || 'Sin categoría'}</TableCell> */}
                    <TableCell>{item.almacen.nombre}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {formatNumber(item.cantidad)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-green-600 dark:text-green-400">
                      {formatNumber(item.cantidad_disponible)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-600 dark:text-amber-400">
                      {formatNumber(item.cantidad_reservada)}
                    </TableCell>
                    {/* <TableCell className="text-right text-sm text-muted-foreground">
                      {item.producto.stock_minimo} / {item.producto.stock_maximo}
                    </TableCell> */}
                    <TableCell>
                      <Badge variant={stockInfo.color as "default" | "secondary" | "destructive" | "outline"} className="gap-1">
                        <Icon className="h-3 w-3" />
                        {stockInfo.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {((stock.current_page - 1) * stock.per_page) + 1} a{' '}
              {Math.min(stock.current_page * stock.per_page, stock.total)} de{' '}
              {stock.total} registros
            </div>
            {onPerPageChange && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Por página:</label>
                <select
                  value={stock.per_page}
                  onChange={(e) => onPerPageChange(parseInt(e.target.value))}
                  disabled={isLoading}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-900 disabled:opacity-50"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            )}
          </div>
          {stock.last_page > 1 && (
            <>
              {onPageChange ? (
                <div className="flex gap-1 items-center justify-center flex-wrap">
                  <Button
                    onClick={() => onPageChange(stock.current_page - 1)}
                    disabled={stock.current_page === 1 || isLoading}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>

                  {/* Números de página */}
                  <div className="flex gap-1">
                    {Array.from({ length: stock.last_page }, (_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === stock.current_page;
                      const isVisible =
                        pageNum === 1 ||
                        pageNum === stock.last_page ||
                        (pageNum >= stock.current_page - 1 && pageNum <= stock.current_page + 1);

                      if (!isVisible && pageNum !== stock.current_page - 2 && pageNum !== stock.current_page + 2) {
                        return null;
                      }

                      if (pageNum === stock.current_page - 2 || pageNum === stock.current_page + 2) {
                        return (
                          <span key={`dots-${pageNum}`} className="px-2 py-1 text-muted-foreground">
                            ...
                          </span>
                        );
                      }

                      return (
                        <Button
                          key={pageNum}
                          onClick={() => onPageChange(pageNum)}
                          disabled={isLoading}
                          variant={isActive ? 'default' : 'outline'}
                          size="sm"
                          className="w-10 h-10 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => onPageChange(stock.current_page + 1)}
                    disabled={stock.current_page === stock.last_page || isLoading}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <GenericPagination links={stock.links} />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

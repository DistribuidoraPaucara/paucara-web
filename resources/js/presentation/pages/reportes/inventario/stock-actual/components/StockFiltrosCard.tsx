import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Almacen {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Marca {
  id: number;
  nombre: string;
}

interface StockFiltrosCardProps {
  filters: Record<string, any>;
  almacenes: Almacen[];
  categorias: Categoria[];
  marcas: Marca[];
  onUpdateField: (updates: Record<string, any>) => void;
  onClear: () => void;
  isLoading?: boolean;
}

export function StockFiltrosCard({
  filters,
  almacenes,
  categorias,
  marcas,
  onUpdateField,
  onClear,
  isLoading = false,
}: StockFiltrosCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros (Búsqueda en Tiempo Real)</CardTitle>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="busqueda">Buscar (ID, Nombre, SKU, Código de Barra)</Label>
            <div className="relative">
              <Input
                id="busqueda"
                type="text"
                placeholder="Escribe para buscar..."
                value={filters.busqueda || ''}
                onChange={(e) => onUpdateField({ busqueda: e.target.value })}
                className="mt-2"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Almacén</Label>
              <Select
                value={filters.almacen_id || 'all'}
                onValueChange={(value) => onUpdateField({ almacen_id: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los almacenes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los almacenes</SelectItem>
                  {almacenes.map((almacen) => (
                    <SelectItem key={almacen.id} value={almacen.id.toString()}>
                      {almacen.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Categoría</Label>
              <Select
                value={filters.categoria_id || 'all'}
                onValueChange={(value) => onUpdateField({ categoria_id: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Marca</Label>
              <Select
                value={filters.marca_id || 'all'}
                onValueChange={(value) => onUpdateField({ marca_id: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.id.toString()}>
                      {marca.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Filtros de Stock</Label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.con_stock || false}
                    onChange={(e) => onUpdateField({ con_stock: e.target.checked, sin_stock: false })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Solo con Stock (&gt; 0)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.sin_stock || false}
                    onChange={(e) => onUpdateField({ sin_stock: e.target.checked, con_stock: false })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Solo sin Stock (= 0)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            

            <div className="flex items-end">
              <Button onClick={onClear} variant="outline" className="w-full">
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';

interface TipoPrecio {
  id: number;
  nombre: string;
  color: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface PreciosFiltrosCardProps {
  formData: {
    fecha_desde: string;
    fecha_hasta: string;
    tipo_precio_id: string;
    categoria_id: string;
  };
  tipos_precio: TipoPrecio[];
  categorias: Categoria[];
  ALL_VALUE: string;
  onUpdateField: (key: string, value: string) => void;
  onFilter: () => void;
  onClear: () => void;
}

export function PreciosFiltrosCard({
  formData,
  tipos_precio,
  categorias,
  ALL_VALUE,
  onUpdateField,
  onFilter,
  onClear,
}: PreciosFiltrosCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Fecha Desde */}
          <div>
            <Label>Fecha Desde</Label>
            <Input
              type="date"
              value={formData.fecha_desde}
              onChange={(e) => onUpdateField('fecha_desde', e.target.value)}
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <Label>Fecha Hasta</Label>
            <Input
              type="date"
              value={formData.fecha_hasta}
              onChange={(e) => onUpdateField('fecha_hasta', e.target.value)}
            />
          </div>

          {/* Tipo de Precio */}
          <div>
            <Label>Tipo de Precio</Label>
            <Select
              value={formData.tipo_precio_id}
              onValueChange={(value) => onUpdateField('tipo_precio_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos los tipos</SelectItem>
                {tipos_precio.map(tipo => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Categoría */}
          <div>
            <Label>Categoría</Label>
            <Select
              value={formData.categoria_id}
              onValueChange={(value) => onUpdateField('categoria_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todas las categorías</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria.id} value={categoria.id.toString()}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex items-end gap-2">
            <Button onClick={onFilter} className="flex-1">
              Filtrar
            </Button>
            <Button variant="outline" onClick={onClear} className="flex-1">
              Limpiar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

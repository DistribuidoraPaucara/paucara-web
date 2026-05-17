import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';

interface Almacen {
  id: number;
  nombre: string;
}

interface MovimientosFiltrosCardProps {
  formData: {
    fecha_inicio: string;
    fecha_fin: string;
    tipo: string;
    almacen_id: string;
  };
  tipos: Record<string, string>;
  almacenes: Almacen[];
  ALL_VALUE: string;
  onUpdateField: (key: string, value: string) => void;
  onFilter: () => void;
  onClear: () => void;
}

export function MovimientosFiltrosCard({
  formData,
  tipos,
  almacenes,
  ALL_VALUE,
  onUpdateField,
  onFilter,
  onClear,
}: MovimientosFiltrosCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Fecha Inicio */}
          <div>
            <Label>Fecha Inicio</Label>
            <Input
              type="date"
              value={formData.fecha_inicio}
              onChange={(e) => onUpdateField('fecha_inicio', e.target.value)}
            />
          </div>

          {/* Fecha Fin */}
          <div>
            <Label>Fecha Fin</Label>
            <Input
              type="date"
              value={formData.fecha_fin}
              onChange={(e) => onUpdateField('fecha_fin', e.target.value)}
            />
          </div>

          {/* Tipo de Movimiento */}
          <div>
            <Label>Tipo de Movimiento</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => onUpdateField('tipo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos los tipos</SelectItem>
                {Object.entries(tipos).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Almacén */}
          <div>
            <Label>Almacén</Label>
            <Select
              value={formData.almacen_id}
              onValueChange={(value) => onUpdateField('almacen_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los almacenes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos los almacenes</SelectItem>
                {almacenes.map((almacen) => (
                  <SelectItem key={almacen.id} value={almacen.id.toString()}>
                    {almacen.nombre}
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

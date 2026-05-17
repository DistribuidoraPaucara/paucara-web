// Presentation Layer: Componente para el formulario de categorías
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import type { CategoriaFormData } from '@/domain/entities/categorias';

interface CategoriaFormFieldsProps {
  data: CategoriaFormData;
  errors: Partial<Record<keyof CategoriaFormData, string>>;
  onChange: (field: keyof CategoriaFormData, value: string | boolean) => void;
  disabled?: boolean;
}

export default function CategoriaFormFields({
  data,
  errors,
  onChange,
  disabled = false
}: CategoriaFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Campo Nombre */}
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-sm font-medium">
          Nombre *
        </Label>
        <Input
          id="nombre"
          value={data.nombre}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('nombre', e.target.value)}
          placeholder="Ingrese el nombre de la categoría"
          disabled={disabled}
          className={errors.nombre ? 'border-red-500' : ''}
        />
        {errors.nombre && (
          <p className="text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* Campo Descripción */}
      <div className="space-y-2">
        <Label htmlFor="descripcion" className="text-sm font-medium">
          Descripción
        </Label>
        <textarea
          id="descripcion"
          value={data.descripcion || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('descripcion', e.target.value)}
          placeholder="Ingrese una descripción opcional"
          disabled={disabled}
          rows={3}
          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.descripcion ? 'border-red-500' : ''}`}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      {/* Campo Activo */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="activo"
          checked={data.activo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('activo', e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Label htmlFor="activo" className="text-sm font-medium">
          Categoría activa
        </Label>
        {errors.activo && (
          <p className="text-sm text-red-600">{errors.activo}</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        * Campos obligatorios
      </p>
    </div>
  );
}

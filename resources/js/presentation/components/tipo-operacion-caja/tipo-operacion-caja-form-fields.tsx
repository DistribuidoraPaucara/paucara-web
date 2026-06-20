// Presentation Layer: Componente para el formulario de tipos de operación de caja
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { ArrowDown, ArrowUp, Settings } from 'lucide-react';
import type { TipoOperacionCajaFormData } from '@/domain/entities/tipo-operacion-caja';

interface TipoOperacionCajaFormFieldsProps {
  data: TipoOperacionCajaFormData;
  errors: Partial<Record<keyof TipoOperacionCajaFormData, string>>;
  onChange: (field: keyof TipoOperacionCajaFormData, value: string | boolean) => void;
  disabled?: boolean;
}

export default function TipoOperacionCajaFormFields({
  data,
  errors,
  onChange,
  disabled = false
}: TipoOperacionCajaFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Campo Código */}
        <div className="space-y-2">
          <Label htmlFor="codigo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Código *
          </Label>
          <Input
            id="codigo"
            value={data.codigo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('codigo', e.target.value)}
            placeholder="Ingrese el código de operación"
            disabled={disabled}
            className={errors.codigo ? 'border-red-500 dark:border-red-400' : ''}
          />
          {errors.codigo && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.codigo}</p>
          )}
        </div>

        {/* Campo Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre *
          </Label>
          <Input
            id="nombre"
            value={data.nombre}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('nombre', e.target.value)}
            placeholder="Ingrese el nombre de la operación"
            disabled={disabled}
            className={errors.nombre ? 'border-red-500 dark:border-red-400' : ''}
          />
          {errors.nombre && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.nombre}</p>
          )}
        </div>
      </div>

      {/* Campo Descripción */}
      <div className="space-y-2">
        <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Descripción
        </Label>
        <textarea
          id="descripcion"
          value={data.descripcion || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('descripcion', e.target.value)}
          placeholder="Ingrese una descripción opcional"
          disabled={disabled}
          rows={3}
          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background dark:bg-gray-700 dark:border-gray-600 px-3 py-2 text-sm dark:text-white ring-offset-background placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.descripcion ? 'border-red-500 dark:border-red-400' : ''}`}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.descripcion}</p>
        )}
      </div>

      {/* Campo Dirección */}
      <div className="space-y-2">
        <Label htmlFor="direccion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Dirección
        </Label>
        <div className="relative">
          <select
            id="direccion"
            value={data.direccion || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange('direccion', e.target.value)}
            disabled={disabled}
            className={`flex w-full rounded-md border border-input bg-background dark:bg-gray-700 dark:border-gray-600 pl-10 pr-3 py-2 text-sm dark:text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${errors.direccion ? 'border-red-500 dark:border-red-400' : ''}`}
          >
            <option value="">Selecciona una dirección</option>
            <option value="ENTRADA">⬇ENTRADA</option>
            <option value="SALIDA">⬆SALIDA</option>
            <option value="AJUSTE">🔧AJUSTE</option>
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            {data.direccion === 'ENTRADA' && <ArrowDown className="h-4 w-4 text-green-600 dark:text-green-400" />}
            {data.direccion === 'SALIDA' && <ArrowUp className="h-4 w-4 text-red-600 dark:text-red-400" />}
            {data.direccion === 'AJUSTE' && <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
            {!data.direccion && <div className="h-4 w-4" />}
          </div>
        </div>
        {errors.direccion && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.direccion}</p>
        )}
      </div>

      {/* Campo Activo */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="activo"
          checked={data.activo ?? true}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('activo', e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-gray-700"
        />
        <Label htmlFor="activo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipo activo
        </Label>
        {errors.activo && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.activo}</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground dark:text-gray-400">
        * Campos obligatorios
      </p>
    </div>
  );
}

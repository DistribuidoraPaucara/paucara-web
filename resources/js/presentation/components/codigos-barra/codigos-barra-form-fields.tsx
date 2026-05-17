// Presentation Layer: Fields para formulario de códigos de barra
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { CodigoBarraFormData, TipoCodigoOption } from '@/domain/entities/codigos-barra';

interface CodigosBarraFormFieldsProps {
  data: CodigoBarraFormData;
  errors: Partial<Record<keyof CodigoBarraFormData, string>>;
  tiposDisponibles: TipoCodigoOption[];
  onChange: (field: keyof CodigoBarraFormData, value: string | boolean | number) => void;
  onGenerarCodigo?: () => void;
  codigoGenerado?: string | null;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function CodigosBarraFormFields({
  data,
  errors,
  tiposDisponibles,
  onChange,
  onGenerarCodigo,
  codigoGenerado,
  isLoading = false,
  disabled = false,
}: CodigosBarraFormFieldsProps) {
  const mostrarCodigoManual = !data.auto_generar;

  return (
    <div className="space-y-6">
      {/* Tipo de código */}
      <div className="space-y-2">
        <Label htmlFor="tipo" className="text-sm font-medium">
          Tipo de Código *
        </Label>
        <select
          id="tipo"
          value={data.tipo}
          onChange={(e) => onChange('tipo', e.target.value)}
          disabled={disabled || isLoading}
          className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors.tipo ? 'border-red-500' : ''
          }`}
        >
          <option value="">Seleccionar tipo...</option>
          {tiposDisponibles.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
        {errors.tipo && <p className="text-sm text-red-600">{errors.tipo}</p>}
      </div>

      {/* Opción: Generar automáticamente */}
      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-md">
        <input
          type="checkbox"
          id="auto_generar"
          checked={data.auto_generar || false}
          onChange={(e) => onChange('auto_generar', e.target.checked)}
          disabled={disabled || isLoading}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Label htmlFor="auto_generar" className="text-sm font-medium cursor-pointer flex-1">
          Generar código automáticamente
        </Label>
        {data.auto_generar && onGenerarCodigo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGenerarCodigo}
            disabled={disabled || isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Generar
          </Button>
        )}
      </div>

      {/* Campo Código (si no es automático) */}
      {mostrarCodigoManual && (
        <div className="space-y-2">
          <Label htmlFor="codigo" className="text-sm font-medium">
            Código de Barra {!data.auto_generar && '*'}
          </Label>
          <Input
            id="codigo"
            value={data.codigo || codigoGenerado || ''}
            onChange={(e) => onChange('codigo', e.target.value)}
            placeholder="Ingrese el código de barra o deje vacío para generar automáticamente"
            disabled={disabled || isLoading}
            className={`font-mono text-lg tracking-wide ${errors.codigo ? 'border-red-500' : ''}`}
          />
          {errors.codigo && <p className="text-sm text-red-600">{errors.codigo}</p>}
          <p className="text-xs text-muted-foreground">
            Formato: debe ser válido según el tipo seleccionado
          </p>
        </div>
      )}

      {/* Mostrar código generado */}
      {data.auto_generar && codigoGenerado && (
        <div className="p-3 bg-green-50 rounded-md border border-green-200">
          <Label className="text-sm font-medium text-green-900">Código Generado:</Label>
          <p className="text-2xl font-mono font-bold text-green-700 mt-1">{codigoGenerado}</p>
        </div>
      )}

      {/* Marcar como principal */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="es_principal"
          checked={data.es_principal || false}
          onChange={(e) => onChange('es_principal', e.target.checked)}
          disabled={disabled || isLoading}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Label htmlFor="es_principal" className="text-sm font-medium">
          Marcar como código principal
        </Label>
        {errors.es_principal && <p className="text-sm text-red-600">{errors.es_principal}</p>}
      </div>

      {/* Estado activo */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="activo"
          checked={data.activo !== false}
          onChange={(e) => onChange('activo', e.target.checked)}
          disabled={disabled || isLoading}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <Label htmlFor="activo" className="text-sm font-medium">
          Código activo
        </Label>
        {errors.activo && <p className="text-sm text-red-600">{errors.activo}</p>}
      </div>

      <p className="text-xs text-muted-foreground">
        * Campos obligatorios
      </p>
    </div>
  );
}

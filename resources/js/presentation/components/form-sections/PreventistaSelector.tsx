import { Label } from '@/presentation/components/ui/label';

export interface Preventista {
  id: number;
  name: string;
  email?: string;
}

interface PreventistaSelectorProps {
  preventistas: Preventista[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  cargando?: boolean;
  label?: string;
  optional?: boolean;
  placeholder?: string;
  infoText?: string;
  noPreventistaText?: string;
}

export default function PreventistaSelector({
  preventistas,
  selectedId,
  onSelect,
  cargando = false,
  label = '👤 Preventista (Opcional)',
  optional = true,
  placeholder = '-- Selecciona un preventista --',
  infoText = 'ℹ️ Asigna un preventista responsable de esta venta',
  noPreventistaText = '⚠️ No hay preventistas disponibles',
}: PreventistaSelectorProps) {
  return (
    <div>
      <Label htmlFor="preventista" className="text-sm font-medium">
        {label}
      </Label>

      {cargando ? (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mt-2">
          <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
          <span className="text-sm">Cargando preventistas...</span>
        </div>
      ) : preventistas.length > 0 ? (
        <>
          <select
            id="preventista"
            value={selectedId || ''}
            onChange={(e) => {
              const value = e.target.value;
              onSelect(value && value !== '' ? parseInt(value, 10) : null);
            }}
            className="w-full px-3 py-2 mt-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-zinc-800 dark:text-white text-sm"
          >
            <option value="">{placeholder}</option>
            {preventistas.map((preventista) => (
              <option key={preventista.id} value={preventista.id}>
                #{preventista.id} | {preventista.name}
              </option>
            ))}
          </select>
          {infoText && (
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              {infoText}
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
          {noPreventistaText}
        </p>
      )}
    </div>
  );
}

import { Label } from '@/presentation/components/ui/label';

export interface Direccion {
  id: number;
  direccion: string;
  localidad?: string;
  observaciones?: string;
  es_principal?: boolean;
  activa?: boolean;
}

interface DireccionesClienteSelectorProps {
  direcciones: Direccion[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  cargando?: boolean;
  label?: string;
  sinDireccionesText?: string;
  mostrarClienteRequired?: boolean;
}

export default function DireccionesClienteSelector({
  direcciones,
  selectedId,
  onSelect,
  cargando = false,
  label = '📍 Dirección de Entrega',
  sinDireccionesText = '⚠️ El cliente no tiene direcciones registradas. Completa la dirección manualmente a continuación.',
  mostrarClienteRequired = true,
}: DireccionesClienteSelectorProps) {
  if (mostrarClienteRequired && direcciones.length === 0 && !cargando) {
    return null;
  }

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">
        {label}
      </Label>

      {cargando ? (
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm">Cargando direcciones...</span>
        </div>
      ) : direcciones.length > 0 ? (
        <div className="space-y-2">
          {direcciones.map((dir) => (
            <button
              key={dir.id}
              type="button"
              onClick={() => onSelect(dir.id)}
              className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all ${
                selectedId === dir.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {/* Mostrar observaciones como dato principal si existen */}
              {dir.observaciones ? (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    🏷️ {dir.observaciones}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    📍 {dir.direccion}
                  </p>
                  {dir.es_principal && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {dir.direccion}
                  </p>
                  {dir.localidad && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      📍 {dir.localidad}
                    </p>
                  )}
                  {dir.es_principal && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {sinDireccionesText}
        </p>
      )}
    </div>
  );
}

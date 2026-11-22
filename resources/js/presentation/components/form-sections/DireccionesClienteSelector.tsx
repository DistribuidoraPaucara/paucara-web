import { MapPin } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';

export interface Localidad {
    id: number;
    nombre: string;
    codigo?: string;
    [key: string]: any;
}

export interface Direccion {
    id: number;
    direccion: string;
    localidad_id?: number;
    localidad?: string | Localidad;
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
    // ✅ NUEVO (2026-07-18): Callback para mostrar dirección en mapa
    onShowMap?: () => void;
}

export default function DireccionesClienteSelector({
    direcciones,
    selectedId,
    onSelect,
    cargando = false,
    label = '📍 Dirección de Entrega',
    sinDireccionesText = '⚠️ El cliente no tiene direcciones registradas. Completa la dirección manualmente a continuación.',
    mostrarClienteRequired = true,
    onShowMap, // ✅ NUEVO (2026-07-18): Callback para mostrar mapa
}: DireccionesClienteSelectorProps) {
    if (mostrarClienteRequired && direcciones.length === 0 && !cargando) {
        return null;
    }

    return (
        <div title={label}>
            {/* El título se muestra como tooltip; se mantiene accesible para lectores de pantalla */}
            <span className="sr-only">{label}</span>

            {cargando ? (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm">Cargando direcciones...</span>
                </div>
            ) : direcciones.length > 0 ? (
                <div className="space-y-2">
                    {direcciones.map((dir) => (
                        <div key={dir.id} className="flex items-stretch gap-2">
                        <button
                            type="button"
                            onClick={() => onSelect(dir.id)}
                            className={`min-w-0 flex-1 rounded-lg border-2 px-3 py-2 text-left transition-all ${
                                selectedId === dir.id
                                    ? 'border-blue-600 bg-blue-50 shadow-sm dark:bg-blue-900/30'
                                    : 'border-gray-200 bg-white hover:border-blue-300 dark:border-gray-700 dark:bg-zinc-800 dark:hover:border-blue-700'
                            }`}
                        >
                            {/* Mostrar observaciones como dato principal si existen */}
                            {dir.observaciones ? (
                                <>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">🏷️ {dir.observaciones}</p>
                                    {dir.localidad && (
                                        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                                            📍 {typeof dir.localidad === 'string' ? dir.localidad : dir.localidad.nombre}
                                        </p>
                                    )}

                                    {/* <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    📍 {dir.direccion}
                  </p>
                  {dir.es_principal && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-0.5 rounded">
                      Principal
                    </span>
                  )} */}
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{dir.direccion}</p>
                                    {dir.localidad && (
                                        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                                            📍 {typeof dir.localidad === 'string' ? dir.localidad : dir.localidad.nombre}
                                        </p>
                                    )}
                                    {dir.es_principal && (
                                        <span className="mt-1 inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-800 dark:text-green-100">
                                            Principal
                                        </span>
                                    )}
                                </>
                            )}
                        </button>
                        {/* Ver la dirección seleccionada en el mapa, al lado de su tarjeta */}
                        {selectedId === dir.id && onShowMap && (
                            <Button
                                type="button"
                                onClick={onShowMap}
                                variant="outline"
                                size="sm"
                                className="shrink-0 self-center gap-2 whitespace-nowrap"
                            >
                                <MapPin className="h-4 w-4 shrink-0" />
                            </Button>
                        )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-amber-600 dark:text-amber-400">{sinDireccionesText}</p>
            )}
        </div>
    );
}

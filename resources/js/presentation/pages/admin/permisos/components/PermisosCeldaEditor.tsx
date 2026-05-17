import { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { X, Search } from 'lucide-react';

interface PermisosCeldaEditorProps {
  rolNombre: string;
  moduloTitulo: string;
  permisosDisponibles: string[];
  permisosActuales: string[];
  onConfirm: (permisos: string[], accion: 'agregar' | 'eliminar' | 'reemplazar') => void;
  onCancel: () => void;
}

type Accion = 'agregar' | 'eliminar' | 'reemplazar';

export function PermisosCeldaEditor({
  rolNombre,
  moduloTitulo,
  permisosDisponibles,
  permisosActuales,
  onConfirm,
  onCancel,
}: PermisosCeldaEditorProps) {
  const [busqueda, setBusqueda] = useState('');
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<Set<string>>(
    new Set(permisosActuales)
  );
  const [accion, setAccion] = useState<Accion>('reemplazar');

  const permisosFiltered = permisosDisponibles.filter((permiso) =>
    permiso.toLowerCase().includes(busqueda.toLowerCase())
  );

  const togglePermiso = (permiso: string) => {
    const nuevos = new Set(permisosSeleccionados);
    if (nuevos.has(permiso)) {
      nuevos.delete(permiso);
    } else {
      nuevos.add(permiso);
    }
    setPermisosSeleccionados(nuevos);
  };

  const seleccionarTodos = () => {
    setPermisosSeleccionados(new Set(permisosDisponibles));
  };

  const deseleccionarTodos = () => {
    setPermisosSeleccionados(new Set());
  };

  const handleConfirm = () => {
    onConfirm(Array.from(permisosSeleccionados), accion);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Editar Permisos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {rolNombre} → {moduloTitulo}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Acción */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Acción
          </Label>
          <select
            value={accion}
            onChange={(e) => setAccion(e.target.value as Accion)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="reemplazar">Reemplazar todos los permisos</option>
            <option value="agregar">Agregar estos permisos</option>
            <option value="eliminar">Eliminar estos permisos</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar permisos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Botones de selección */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={seleccionarTodos}
            variant="outline"
            size="sm"
          >
            Seleccionar todos
          </Button>
          <Button
            onClick={deseleccionarTodos}
            variant="outline"
            size="sm"
          >
            Deseleccionar todos
          </Button>
          <div className="flex-1" />
          <span className="text-sm text-gray-600 dark:text-gray-400 pt-2">
            {permisosSeleccionados.size} de {permisosDisponibles.length}
          </span>
        </div>

        {/* Lista de permisos */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 space-y-2 max-h-96 overflow-y-auto">
          {permisosFiltered.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
              No se encontraron permisos
            </p>
          ) : (
            permisosFiltered.map((permiso) => (
              <label
                key={permiso}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              >
                <Checkbox
                  checked={permisosSeleccionados.has(permiso)}
                  onChange={() => togglePermiso(permiso)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                  {permiso}
                </span>
              </label>
            ))
          )}
        </div>

        {/* Resumen de permisos seleccionados */}
        {permisosSeleccionados.size > 0 && (
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
              Permisos a {accion}:
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(permisosSeleccionados)
                .sort()
                .map((permiso) => (
                  <span
                    key={permiso}
                    className="inline-block px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded text-xs font-mono"
                  >
                    {permiso}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Confirmar {permisosSeleccionados.size} Permiso{permisosSeleccionados.size !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}

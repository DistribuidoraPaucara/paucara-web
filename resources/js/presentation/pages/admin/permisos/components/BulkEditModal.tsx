import { useState } from 'react';
import PermisosCheckboxForm from './PermisosCheckboxForm';
import type { PermissionGroup } from '@/domain/entities/admin-permisos';

interface BulkEditModalProps {
  tipo: 'usuario' | 'rol';
  cantidad: number;
  selectedIds: Set<number>;
  todosLosPermisos: PermissionGroup[];
  onClose: () => void;
  onSubmit: (selectedIds: Set<number>, permisos: number[], accion: 'reemplazar' | 'agregar' | 'eliminar') => Promise<void>;
  cargando: boolean;
}

export function BulkEditModal({
  tipo,
  cantidad,
  selectedIds,
  todosLosPermisos,
  onClose,
  onSubmit,
  cargando,
}: BulkEditModalProps) {
  const [accion, setAccion] = useState<'reemplazar' | 'agregar' | 'eliminar'>('reemplazar');
  const [permisos, setPermisos] = useState<number[]>([]);

  const handleSubmit = async () => {
    await onSubmit(selectedIds, permisos, accion);
  };

  return (
    <div className="fixed inset-0 bg-black dark:bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Editar {cantidad} {tipo === 'usuario' ? 'usuarios' : 'roles'}
        </h2>

        {/* Acción */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Acción:</label>
          <select
            value={accion}
            onChange={(e) => setAccion(e.target.value as 'reemplazar' | 'agregar' | 'eliminar')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
          >
            <option value="reemplazar">Reemplazar todos los permisos</option>
            <option value="agregar">Agregar estos permisos</option>
            <option value="eliminar">Eliminar estos permisos</option>
          </select>
        </div>

        {/* Permisos */}
        <div className="mb-6">
          <PermisosCheckboxForm
            permisosActuales={permisos}
            todosLosPermisos={todosLosPermisos}
            onPermisosChange={setPermisos}
            themeColor="purple"
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition disabled:opacity-50"
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition disabled:opacity-50"
            disabled={cargando || permisos.length === 0}
          >
            {cargando ? 'Guardando...' : 'Aplicar'}
          </button>
        </div>
      </div>
    </div>
  );
}

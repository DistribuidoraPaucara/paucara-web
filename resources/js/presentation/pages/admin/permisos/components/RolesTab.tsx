import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import type { AdminRol, PermissionGroup } from '@/domain/entities/admin-permisos';
import { BulkEditModal } from './BulkEditModal';
import { rolesService, permisosService } from '@/infrastructure/services';

interface RolesTabProps {
  roles: AdminRol[];
  cargando: boolean;
  todosLosPermisos: PermissionGroup[];
  onLoadData: (search: string) => Promise<void>;
  onBulkEdit: (selectedIds: Set<number>, permisos: number[], accion: 'reemplazar' | 'agregar' | 'eliminar') => Promise<void>;
}

export function RolesTab({
  roles,
  cargando,
  todosLosPermisos,
  onLoadData,
  onBulkEdit,
}: RolesTabProps) {
  const [search, setSearch] = useState('');
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());
  const [todosSeleccionados, setTodosSeleccionados] = useState(false);
  const [mostrarBulkEdit, setMostrarBulkEdit] = useState(false);
  const [bulkEditGuardando, setBulkEditGuardando] = useState(false);

  useEffect(() => {
    onLoadData(search);
  }, [search]);

  const toggleSeleccion = (id: number) => {
    const nuevo = new Set(seleccionados);
    if (nuevo.has(id)) {
      nuevo.delete(id);
    } else {
      nuevo.add(id);
    }
    setSeleccionados(nuevo);
    setTodosSeleccionados(false);
  };

  const toggleTodos = () => {
    if (todosSeleccionados) {
      setSeleccionados(new Set());
      setTodosSeleccionados(false);
    } else {
      const todas = new Set(roles.map(r => Number(r.id)));
      setSeleccionados(todas);
      setTodosSeleccionados(true);
    }
  };

  const handleBulkEdit = async (selectedIds: Set<number>, permisos: number[], accion: 'reemplazar' | 'agregar' | 'eliminar') => {
    setBulkEditGuardando(true);
    try {
      await onBulkEdit(selectedIds, permisos, accion);
      setMostrarBulkEdit(false);
      setSeleccionados(new Set());
      setTodosSeleccionados(false);
    } finally {
      setBulkEditGuardando(false);
    }
  };

  return (
    <>
      {/* Barra de búsqueda */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-slate-700">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar rol
            </label>
            <input
              type="text"
              placeholder="Nombre del rol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {seleccionados.size > 0 && (
            <button
              onClick={() => setMostrarBulkEdit(true)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Editar {seleccionados.size} seleccionados
            </button>
          )}
        </div>
      </div>

      {/* Modal de Bulk Edit */}
      {mostrarBulkEdit && (
        <BulkEditModal
          tipo="rol"
          cantidad={seleccionados.size}
          selectedIds={seleccionados}
          todosLosPermisos={todosLosPermisos}
          onClose={() => setMostrarBulkEdit(false)}
          onSubmit={handleBulkEdit}
          cargando={bulkEditGuardando}
        />
      )}

      {/* Tabla de roles */}
      {cargando ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin text-blue-600 dark:text-blue-400">
            <div className="text-3xl">⏳</div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Cargando...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
          {roles.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">No hay roles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={todosSeleccionados}
                        onChange={toggleTodos}
                        className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Permisos
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {roles.map((rol) => (
                    <tr key={rol.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={seleccionados.has(Number(rol.id))}
                          onChange={() => toggleSeleccion(Number(rol.id))}
                          className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{rol.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {rol.display_name || '-'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-slate-600">
                          {rol.permissions_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={rolesService.showUrl(rol.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 dark:bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition"
                          >
                            Ver
                          </Link>
                          <Link
                            href={rolesService.editUrl(rol.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                          >
                            Editar
                          </Link>
                          <Link
                            href={permisosService.editarRolUrl(rol.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 dark:bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                          >
                            Permisos
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}

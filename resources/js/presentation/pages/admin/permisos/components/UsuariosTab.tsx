import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import type { AdminUsuario, PermissionGroup } from '@/domain/entities/admin-permisos';
import { getRoleColor } from '@/lib/admin-permisos.utils';
import { permisosService } from '@/infrastructure/services';
import { BulkEditModal } from './BulkEditModal';

interface UsuariosTabProps {
  usuarios: AdminUsuario[];
  cargando: boolean;
  todosLosPermisos: PermissionGroup[];
  onLoadData: (search: string) => Promise<void>;
  onBulkEdit: (selectedIds: Set<number>, permisos: number[], accion: 'reemplazar' | 'agregar' | 'eliminar') => Promise<void>;
}

export function UsuariosTab({
  usuarios,
  cargando,
  todosLosPermisos,
  onLoadData,
  onBulkEdit,
}: UsuariosTabProps) {
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
      const todas = new Set(usuarios.map(u => u.id));
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
      {/* Barra de búsqueda y acciones */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 mb-2 border border-gray-200 dark:border-slate-700">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar usuario
            </label>
            <input
              type="text"
              placeholder="Nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          tipo="usuario"
          cantidad={seleccionados.size}
          selectedIds={seleccionados}
          todosLosPermisos={todosLosPermisos}
          onClose={() => setMostrarBulkEdit(false)}
          onSubmit={handleBulkEdit}
          cargando={bulkEditGuardando}
        />
      )}

      {/* Tabla de usuarios */}
      {cargando ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin text-purple-600 dark:text-purple-400">
            <div className="text-3xl">⏳</div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Cargando...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
          {usuarios.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">No hay usuarios</p>
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
                        className="w-4 h-4 text-purple-600 dark:text-purple-400 rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Roles
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
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={seleccionados.has(usuario.id)}
                          onChange={() => toggleSeleccion(usuario.id)}
                          className="w-4 h-4 text-purple-600 dark:text-purple-400 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{usuario.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{usuario.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {usuario.roles && usuario.roles.length > 0 ? (
                            usuario.roles.map((role) => (
                              <span
                                key={role}
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
                              >
                                {role}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                              Sin roles
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-slate-700 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-slate-600">
                          {usuario.permissions_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={permisosService.editarUsuarioUrl(usuario.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 dark:bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition"
                        >
                          Editar
                        </Link>
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

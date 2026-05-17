import { useState, useMemo } from 'react';
import { Grid3x3, Table2 } from 'lucide-react';
import type { Permission, PermissionGroup } from '@/domain/entities/admin-permisos';

interface PermisosCheckboxFormProps {
  permisosActuales: number[];
  permisosDirectos?: number[];
  permisosHeredados?: number[];
  permisoPorRoles?: Record<number, string[]>;
  rolesActuales?: string[];
  todosLosPermisos: PermissionGroup[];
  onPermisosChange: (permisos: number[]) => void;
  themeColor?: 'blue' | 'purple';
}

export default function PermisosCheckboxForm({
  permisosActuales,
  permisosDirectos = [],
  permisosHeredados = [],
  permisoPorRoles = {},
  rolesActuales = [],
  todosLosPermisos,
  onPermisosChange,
  themeColor = 'blue',
}: PermisosCheckboxFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(permisosActuales.length === getAllPermissionIds().length);
  const [permisos, setPermisos] = useState<number[]>(permisosActuales);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [rolFilter, setRolFilter] = useState<string>('todos');

  function getAllPermissionIds() {
    return todosLosPermisos.flatMap(group => group.permissions.map(p => p.id));
  }

  // Filter groups based on search and role filter
  const filteredGroups = useMemo(() => {
    let filtered = todosLosPermisos;

    // Filtrar por rol si está seleccionado
    if (rolFilter !== 'todos') {
      if (rolFilter === 'directos') {
        // Mostrar solo permisos directos
        filtered = filtered.map(group => ({
          ...group,
          permissions: group.permissions.filter(p => permisosDirectos.includes(p.id)),
        }));
      } else {
        // Mostrar permisos del rol seleccionado (heredados y directos)
        filtered = filtered.map(group => ({
          ...group,
          permissions: group.permissions.filter(p => {
            const rolesDelPermiso = permisoPorRoles[p.id] || [];
            return rolesDelPermiso.includes(rolFilter) || permisosDirectos.includes(p.id);
          }),
        }));
      }
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.map(group => ({
        ...group,
        permissions: group.permissions.filter(
          p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }));
    }

    return filtered.filter(group => group.permissions.length > 0);
  }, [searchQuery, todosLosPermisos, rolFilter, permisosDirectos, permisoPorRoles]);

  function togglePermission(permissionId: number) {
    const newPermisos = permisos.includes(permissionId)
      ? permisos.filter(id => id !== permissionId)
      : [...permisos, permissionId];

    setPermisos(newPermisos);
    setSelectAll(newPermisos.length === getAllPermissionIds().length);
    onPermisosChange(newPermisos);
  }

  function toggleSelectAll() {
    if (selectAll) {
      setPermisos([]);
      setSelectAll(false);
      onPermisosChange([]);
    } else {
      const allIds = getAllPermissionIds();
      setPermisos(allIds);
      setSelectAll(true);
      onPermisosChange(allIds);
    }
  }

  const buttonColorClass = themeColor === 'purple'
    ? 'bg-purple-600 text-white hover:bg-purple-700'
    : 'bg-blue-600 text-white hover:bg-blue-700';

  const borderColorClass = themeColor === 'purple' ? 'border-purple-500' : 'border-blue-500';
  const focusRingClass = themeColor === 'purple' ? 'focus:border-purple-500' : 'focus:border-blue-500';

  return (
    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Permisos</h3>

        {/* Leyenda */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
          <div className="flex items-start gap-2">
            <span className="text-xl">👤</span>
            <div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Directo</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Asignado al usuario</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xl">🔗</span>
            <div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Heredado</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Viene de un rol</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xl">✓</span>
            <div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dir + Rol</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Directo + Heredado</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Buscar permisos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              className={`flex-1 rounded-md border border-gray-300 dark:border-slate-600 px-3 py-2 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${focusRingClass}`}
            />

            <select
              value={rolFilter}
              onChange={e => setRolFilter(e.target.value)}
              className={`rounded-md border border-gray-300 dark:border-slate-600 px-3 py-2 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${focusRingClass}`}
            >
              <option value="todos">Todos los permisos</option>
              <option value="directos">📌 Permisos Directos</option>
              {rolesActuales.map(rol => (
                <option key={rol} value={rol}>
                  🔗 {rol}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={toggleSelectAll}
              className={`whitespace-nowrap rounded-md px-4 py-2 font-medium text-sm ${
                selectAll
                  ? buttonColorClass
                  : 'border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              {selectAll ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
            </button>
          </div>

          {/* Vista Toggle */}
          <div className="flex gap-2 border border-gray-300 dark:border-slate-600 rounded-md p-1 bg-white dark:bg-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-100 dark:bg-slate-600 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Vista Grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-gray-100 dark:bg-slate-600 text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Vista Tabla"
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No se encontraron permisos que coincidan con tu búsqueda
        </div>
      ) : viewMode === 'grid' ? (
        // ==================== VISTA GRID ====================
        <div className="space-y-6">
          {filteredGroups.map(group => (
            <div key={group.module} className={`border-l-4 ${borderColorClass} pl-4`}>
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white capitalize">
                {group.module.replace(/_/g, ' ')}
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {group.permissions.map(permission => {
                  const esDirecto = permisosDirectos.includes(permission.id);
                  const esHeredado = permisosHeredados.includes(permission.id);
                  const rolesOrigen = permisoPorRoles[permission.id] || [];

                  return (
                    <div
                      key={permission.id}
                      className={`relative rounded p-2 border transition-colors ${
                        esHeredado && !esDirecto
                          ? 'border-amber-200 dark:border-amber-700/30 bg-amber-50 dark:bg-amber-900/10'
                          : 'border-transparent'
                      }`}
                      title={esHeredado && !esDirecto ? `Heredado de: ${rolesOrigen.join(', ')}` : ''}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={permisos.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700 accent-blue-600 dark:accent-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{permission.name}</div>
                            {/* Indicadores */}
                            {esDirecto && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                👤 Directo
                              </span>
                            )}
                            {esHeredado && !esDirecto && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                title={`De: ${rolesOrigen.join(', ')}`}
                              >
                                🔗 {rolesOrigen.join(', ')}
                              </span>
                            )}
                            {esDirecto && esHeredado && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                ✓ Dir + {rolesOrigen.join(', ')}
                              </span>
                            )}
                          </div>
                          {permission.description && (
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{permission.description}</div>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ==================== VISTA TABLA ====================
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50">
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700 accent-blue-600 dark:accent-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Permiso</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Módulo</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.flatMap(group =>
                group.permissions.map(permission => {
                  const esDirecto = permisosDirectos.includes(permission.id);
                  const esHeredado = permisosHeredados.includes(permission.id);
                  const rolesOrigen = permisoPorRoles[permission.id] || [];

                  return (
                    <tr
                      key={permission.id}
                      className={`border-b border-gray-200 dark:border-slate-700 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30 ${
                        esHeredado && !esDirecto
                          ? 'bg-amber-50 dark:bg-amber-900/10'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={permisos.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700 accent-blue-600 dark:accent-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{permission.name}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {permission.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {esDirecto && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 whitespace-nowrap">
                              👤 Directo
                            </span>
                          )}
                          {esHeredado && !esDirecto && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 whitespace-nowrap"
                              title={`De: ${rolesOrigen.join(', ')}`}
                            >
                              🔗 {rolesOrigen.join(', ')}
                            </span>
                          )}
                          {esDirecto && esHeredado && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 whitespace-nowrap">
                              ✓ Dir + {rolesOrigen.join(', ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 capitalize">
                        {group.module.replace(/_/g, ' ')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 border-t dark:border-slate-700 pt-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{permisos.length}</span> de{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{getAllPermissionIds().length}</span> permisos seleccionados
        </div>
      </div>
    </div>
  );
}

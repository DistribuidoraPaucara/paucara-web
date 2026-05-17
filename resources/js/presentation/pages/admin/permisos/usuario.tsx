import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PermisosCheckboxForm from './components/PermisosCheckboxForm';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { Grid3x3, Table2, Shield, Lock } from 'lucide-react';
import type { AdminUsuario, PermissionGroup } from '@/domain/entities/admin-permisos';

interface Rol {
  id: number;
  name: string;
  description: string;
  permissions_count: number;
}

interface UsuarioEditProps {
  usuario: AdminUsuario;
  permisosActuales: number[];
  permisosDirectos: number[];
  permisosHeredados: number[];
  permisoPorRoles: Record<number, string[]>;
  rolesActuales: string[];
  todosLosPermisos: PermissionGroup[];
  todosLosRoles: Rol[];
}

export default function UsuarioEdit({
  usuario,
  permisosActuales,
  permisosDirectos,
  permisosHeredados,
  permisoPorRoles,
  rolesActuales,
  todosLosPermisos,
  todosLosRoles
}: UsuarioEditProps) {
  const [activeTab, setActiveTab] = useState<'roles' | 'permisos'>('roles');
  const [rolesViewMode, setRolesViewMode] = useState<'grid' | 'table'>('table');
  const { data, setData, patch, processing } = useForm({
    permisos: permisosActuales,
    roles: rolesActuales,
  });

  function handlePermisosChange(permisos: number[]) {
    setData('permisos', permisos);
  }

  function handleRolesChange(roleName: string) {
    if (data.roles.includes(roleName)) {
      setData('roles', data.roles.filter((r: string) => r !== roleName));
    } else {
      setData('roles', [...data.roles, roleName]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('🔐 [handleSubmit] Guardando permisos...', { permisos: data.permisos, roles: data.roles });

    patch(`/permisos/usuario/${usuario.id}`, {
      onSuccess: () => {
        NotificationService.success('Permisos actualizados correctamente');
        router.visit('/permisos');
      },
      onError: (errors) => {
        console.error('❌ Error al actualizar permisos:', errors);
        NotificationService.error('Error al actualizar permisos');
      },
    });
  }

  return (
    <AppLayout>
      <Head title={`Editar Permisos - ${usuario.name}`} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Permisos de Usuario</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gestiona los permisos para <span className="font-semibold">{usuario.name}</span> ({usuario.email})
              </p>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-lg">
              <div className="flex gap-1 px-4">
              <button
                type="button"
                onClick={() => setActiveTab('roles')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'roles'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
              >
                <Shield className="h-4 w-4" />
                Roles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('permisos')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'permisos'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
              >
                <Lock className="h-4 w-4" />
                Permisos
              </button>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="bg-white dark:bg-slate-800 rounded-b-lg border border-gray-200 dark:border-slate-700 border-t-0">
            {/* TAB 1: Roles */}
            {activeTab === 'roles' && (
              <div className="p-6">
                {/* Roles Editor Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestionar Roles</h3>

                  {/* Vista Toggle */}
                  <div className="flex gap-2 border border-gray-300 dark:border-slate-600 rounded-md p-1 bg-white dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setRolesViewMode('grid')}
                      className={`p-2 rounded transition-colors ${rolesViewMode === 'grid'
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      title="Vista Grid"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRolesViewMode('table')}
                      className={`p-2 rounded transition-colors ${rolesViewMode === 'table'
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      title="Vista Tabla"
                    >
                      <Table2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  {rolesViewMode === 'grid' ? (
                    // ==================== VISTA GRID ====================
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {todosLosRoles.map(rol => (
                        <label key={rol.name} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={data.roles.includes(rol.name)}
                            onChange={() => handleRolesChange(rol.name)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900 dark:text-white">{rol.name}</p>
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                {rol.permissions_count} permisos
                              </span>
                            </div>
                            {rol.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{rol.description}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    // ==================== VISTA TABLA ====================
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white w-12">
                              ☑
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Rol</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white w-24">Permisos</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todosLosRoles.map(rol => (
                            <tr key={rol.name} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={data.roles.includes(rol.name)}
                                  onChange={() => handleRolesChange(rol.name)}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <span className="font-medium text-gray-900 dark:text-white">{rol.name}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                  {rol.permissions_count}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                {rol.description || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Permisos */}
            {activeTab === 'permisos' && (
              <div className="p-6">
                {/* Permissions Editor */}
                <PermisosCheckboxForm
                  permisosActuales={permisosActuales}
                  permisosDirectos={permisosDirectos}
                  permisosHeredados={permisosHeredados}
                  permisoPorRoles={permisoPorRoles}
                  rolesActuales={rolesActuales}
                  todosLosPermisos={todosLosPermisos}
                  onPermisosChange={handlePermisosChange}
                  themeColor="blue"
                />
              </div>
            )}
          </div>

          {/* Action Buttons - Globales para ambas pestañas */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-blue-600 dark:bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {processing ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => router.visit('/permisos')}
              className="rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      </form>
    </AppLayout>
  );
}

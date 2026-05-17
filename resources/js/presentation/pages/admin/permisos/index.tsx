import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import type { AdminUsuario, AdminRol, PermisoAudit, PermissionGroup, Permission, ModuloSidebar } from '@/domain/entities/admin-permisos';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { PermisosService } from '@/infrastructure/services/permisos.service';
import { UsuariosTab } from './components/UsuariosTab';
import { RolesTab } from './components/RolesTab';
import { HistorialTab } from './components/HistorialTab';
import { PermisosTab } from './components/PermisosTab';
import { ModulosTab } from './components/ModulosTab';

type TabType = 'usuarios' | 'roles' | 'historial' | 'permisos' | 'modulos';

interface EstadisticasHistorial {
  total_cambios: number;
  cambios_hoy: number;
  cambios_esta_semana: number;
  cambios_este_mes: number;
}

export default function PermisosIndex() {
  const [activeTab, setActiveTab] = useState<TabType>('usuarios');
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [roles, setRoles] = useState<AdminRol[]>([]);
  const [historial, setHistorial] = useState<PermisoAudit[]>([]);
  const [permisos, setPermisos] = useState<Permission[]>([]);
  const [modulosSelectList, setModulosSelectList] = useState<string[]>([]);
  const [modulosSidebar, setModulosSidebar] = useState<ModuloSidebar[]>([]);
  const [todosLosPermisos, setTodosLosPermisos] = useState<PermissionGroup[]>([]);
  const [cargando, setCargando] = useState(false);
  const [estadisticas, setEstadisticas] = useState<EstadisticasHistorial | null>(null);

  // Cargar permisos disponibles al montar el componente
  useEffect(() => {
    cargarPermisosDisponibles();
    cargarModulos();
    cargarModulosSidebar();
  }, []);

  // Cargar permisos cuando se abre el tab de permisos
  useEffect(() => {
    if (activeTab === 'permisos') {
      cargarPermisos('', '');
    }
  }, [activeTab]);

  const cargarPermisosDisponibles = async () => {
    try {
      const permisos = await PermisosService.getPermisosDisponibles();
      setTodosLosPermisos(permisos);
    } catch (err) {
      console.log(err);
      NotificationService.error('Error al cargar permisos disponibles');
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const cargarUsuarios = async (search: string) => {
    setCargando(true);
    try {
      const usuarios = await PermisosService.getUsuarios(search);
      setUsuarios(usuarios);
    } catch {
      NotificationService.error('Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  const cargarRoles = async (search: string) => {
    setCargando(true);
    try {
      const roles = await PermisosService.getRoles(search);
      setRoles(roles);
    } catch {
      NotificationService.error('Error al cargar roles');
    } finally {
      setCargando(false);
    }
  };

  const cargarHistorial = async (filtro: string | null) => {
    setCargando(true);
    try {
      const { data, estadisticas } = await PermisosService.getHistorial(filtro);
      setHistorial(data);
      setEstadisticas(estadisticas);
    } catch {
      NotificationService.error('Error al cargar historial');
    } finally {
      setCargando(false);
    }
  };

  const cargarPermisos = async (search: string, modulo: string) => {
    setCargando(true);
    try {
      const permisos = await PermisosService.getPermisos(search, modulo);
      setPermisos(permisos);
    } catch {
      NotificationService.error('Error al cargar permisos');
    } finally {
      setCargando(false);
    }
  };

  const cargarModulos = async () => {
    try {
      const modulos = await PermisosService.getModulos();
      setModulosSelectList(modulos);
    } catch {
      console.log('Error al cargar módulos');
    }
  };

  const cargarModulosSidebar = async () => {
    try {
      const response = await fetch('/api/modulos-sidebar/admin', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // El endpoint apiIndexAdmin devuelve un array de módulos directamente
      const modulos = Array.isArray(data) ? data : (data.data || []);

      setModulosSidebar(modulos);
    } catch (error) {
      console.error('Error al cargar módulos del sidebar:', error);
      NotificationService.error('Error al cargar módulos del sidebar');
    }
  };

  const handleBulkEdit = async (selectedIds: Set<number>, permisos: number[], accion: 'reemplazar' | 'agregar' | 'eliminar') => {
    try {
      await PermisosService.bulkEdit(activeTab as 'usuarios' | 'roles', Array.from(selectedIds), permisos, accion);

      NotificationService.success('Operación realizada con éxito');

      // Recargar datos del tab actual
      if (activeTab === 'usuarios') {
        await cargarUsuarios('');
      } else if (activeTab === 'roles') {
        await cargarRoles('');
      } else if (activeTab === 'historial') {
        await cargarHistorial(null);
      }
    } catch {
      NotificationService.error('Error en bulk edit');
    }
  };

  return (
    <AppLayout>
      <Head title="Centro de Permisos y Roles" />

      <div className="py-2">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 text-white rounded-lg p-4 mb-1 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">Centro de Permisos</h1>
                <p className="text-purple-100 dark:text-purple-200">
                  Panel unificado con búsqueda, edición en lote e historial de cambios
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-1 border border-gray-200 dark:border-slate-700">
            <div className="flex border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
              <button
                onClick={() => handleTabChange('usuarios')}
                className={`px-6 py-4 font-medium text-center transition whitespace-nowrap ${activeTab === 'usuarios'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-slate-700'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
              >
                Usuarios
              </button>

              <button
                onClick={() => handleTabChange('roles')}
                className={`px-6 py-4 font-medium text-center transition whitespace-nowrap ${activeTab === 'roles'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-slate-700'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
              >
                Roles
              </button>

              <button
                onClick={() => handleTabChange('permisos')}
                className={`px-6 py-4 font-medium text-center transition whitespace-nowrap ${activeTab === 'permisos'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-slate-700'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
              >
                Permisos
              </button>
              
              <button
                onClick={() => handleTabChange('modulos')}
                className={`px-6 py-4 font-medium text-center transition whitespace-nowrap ${activeTab === 'modulos'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-slate-700'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
              >
                Módulos
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'usuarios' && (
            <UsuariosTab
              usuarios={usuarios}
              cargando={cargando}
              todosLosPermisos={todosLosPermisos}
              onLoadData={cargarUsuarios}
              onBulkEdit={handleBulkEdit}
            />
          )}

          {activeTab === 'roles' && (
            <>
              <div className="mb-4 flex justify-end">
                <Link href="/admin/permisos/roles/create">
                  <Button>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Nuevo Rol
                  </Button>
                </Link>
              </div>
              <RolesTab
                roles={roles}
                cargando={cargando}
                todosLosPermisos={todosLosPermisos}
                onLoadData={cargarRoles}
                onBulkEdit={handleBulkEdit}
              />
            </>
          )}

          {activeTab === 'historial' && (
            <HistorialTab
              historial={historial}
              estadisticas={estadisticas}
              cargando={cargando}
              onLoadData={cargarHistorial}
            />
          )}

          {activeTab === 'permisos' && (
            <PermisosTab
              permisos={permisos}
              cargando={cargando}
              modulos={modulosSelectList}
              onLoadData={cargarPermisos}
            />
          )}

          {activeTab === 'modulos' && (
            <ModulosTab
              modulos={modulosSidebar}
              cargando={cargando}
              onLoadData={cargarModulosSidebar}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

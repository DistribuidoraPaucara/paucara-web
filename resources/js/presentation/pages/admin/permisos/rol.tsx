import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import PermisosCheckboxForm from './components/PermisosCheckboxForm';
import { NotificationService } from '@/infrastructure/services/notification.service';
import type { AdminRol, PermissionGroup } from '@/domain/entities/admin-permisos';

interface RolEditProps {
  rol: AdminRol;
  permisosActuales: number[];
  todosLosPermisos: PermissionGroup[];
}

export default function RolEdit({ rol, permisosActuales, todosLosPermisos }: RolEditProps) {
  const { setData, patch, processing } = useForm({
    permisos: permisosActuales,
  });

  function handlePermisosChange(permisos: number[]) {
    setData('permisos', permisos);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    patch(`/permisos/rol/${rol.id}`, {
      onSuccess: () => {
        NotificationService.success('Permisos del rol actualizados correctamente');
        router.visit('/permisos');
      },
      onError: () => {
        NotificationService.error('Error al actualizar permisos del rol');
      },
    });
  }

  return (
    <AppLayout>
      <Head title={`Editar Permisos - ${rol.display_name || rol.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Permisos de Rol</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gestiona los permisos para el rol <span className="font-semibold">{rol.display_name || rol.name}</span>
            </p>
            {rol.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{rol.description}</p>
            )}
          </div>

          {/* Permissions Editor */}
          <form onSubmit={handleSubmit}>
            <PermisosCheckboxForm
              permisosActuales={permisosActuales}
              todosLosPermisos={todosLosPermisos}
              onPermisosChange={handlePermisosChange}
              themeColor="purple"
            />

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-purple-600 dark:bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 transition-colors"
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
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

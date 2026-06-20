// Presentation: Página de editar Permiso
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Permission {
  id: number;
  name: string;
  description?: string;
  guard_name: string;
}

interface Props {
  permission: Permission;
}

export default function PermisosEditPage({ permission }: Props) {
  const { data, setData, put, errors, processing } = useForm({
    description: permission.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/permisos/${permission.id}`);
  };

  return (
    <AppLayout>
      <Head title="Editar Permiso" />
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Editar Permiso</h1>
        <div className="rounded-lg bg-white dark:bg-gray-800 shadow dark:shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
              <input
                type="text"
                value={permission.name}
                disabled
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No se puede cambiar el nombre</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.description && <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50"
            >
              {processing ? 'Guardando...' : 'Actualizar'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

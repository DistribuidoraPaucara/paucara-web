// Presentation: Página de crear Permiso
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Props {
  modulosSugeridos: string[];
}

export default function PermisosCreatePage({ modulosSugeridos }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    name: '',
    description: '',
    guard_name: 'web',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/permisos');
  };

  return (
    <AppLayout>
      <Head title="Crear Permiso" />
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Crear Nuevo Permiso</h1>
        <div className="rounded-lg bg-white dark:bg-gray-800 shadow dark:shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="ej: usuarios.manage"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
              <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Guard *</label>
              <select
                value={data.guard_name}
                onChange={(e) => setData('guard_name', e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="web">web</option>
                <option value="api">api</option>
                <option value="sanctum">sanctum</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50"
            >
              {processing ? 'Guardando...' : 'Crear Permiso'}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

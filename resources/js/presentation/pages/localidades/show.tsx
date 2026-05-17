// Pages: Localidades show page
import AppLayout from '@/layouts/app-layout';
import localidadesService from '@/infrastructure/services/localidades.service';
import type { Localidad } from '@/domain/entities/localidades';

interface LocalidadesShowProps {
    localidad: Localidad;
}

export default function LocalidadesShow({ localidad }: LocalidadesShowProps) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: localidadesService.indexUrl() },
            { title: 'Localidades', href: localidadesService.indexUrl() },
            { title: localidad.nombre, href: '#' }
        ]}>
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">Detalles de Localidad</h1>
                            <div className="flex space-x-2">
                                <a
                                    href={localidadesService.editUrl(localidad.id)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Editar
                                </a>
                                <a
                                    href={localidadesService.indexUrl()}
                                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Volver
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nombre
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {localidad.nombre}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Código
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {localidad.codigo}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Estado
                                </label>
                                <p className="mt-1 text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${localidad.activo
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                        {localidad.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha de Creación
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(localidad.created_at as string).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

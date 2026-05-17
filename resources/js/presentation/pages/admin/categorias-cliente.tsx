import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Edit2, Plus, Check, X } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';

interface CategoriaCliente {
    id: number;
    clave: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    clientes_count?: number;
}

interface CategoriasClientePageProps {
    categorias: CategoriaCliente[];
}

const breadcrumbs = [
    { title: 'Admin', href: '/admin' },
    { title: 'Categorías de Cliente', href: '#' },
];

export default function CategoriasClientePage({ categorias = [] }: CategoriasClientePageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        clave: '',
        nombre: '',
        descripcion: '',
        activo: true,
    });
    const [loading, setLoading] = useState(false);

    const handleOpenModal = (categoria?: CategoriaCliente) => {
        if (categoria) {
            setEditingId(categoria.id);
            setFormData({
                clave: categoria.clave,
                nombre: categoria.nombre,
                descripcion: categoria.descripcion || '',
                activo: categoria.activo,
            });
        } else {
            setEditingId(null);
            setFormData({
                clave: '',
                nombre: '',
                descripcion: '',
                activo: true,
            });
        }
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setEditingId(null);
        setFormData({
            clave: '',
            nombre: '',
            descripcion: '',
            activo: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingId
                ? `/api/categorias-cliente/${editingId}`
                : '/api/categorias-cliente';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success || response.ok) {
                NotificationService.success(
                    editingId
                        ? 'Categoría actualizada exitosamente'
                        : 'Categoría creada exitosamente'
                );
                handleCloseModal();
                // Recargar la página
                router.visit('/admin/categorias-cliente');
            } else {
                NotificationService.error(result.message || 'Error al guardar la categoría');
            }
        } catch (error) {
            NotificationService.error('Error al procesar la solicitud');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, nombre: string) => {
        if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/categorias-cliente/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (result.success || response.ok) {
                NotificationService.success(result.message || 'Categoría eliminada/desactivada exitosamente');
                router.visit('/admin/categorias-cliente');
            } else {
                NotificationService.error(result.message || 'Error al eliminar la categoría');
            }
        } catch (error) {
            NotificationService.error('Error al procesar la solicitud');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Categorías de Cliente" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Categorías de Cliente
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Gestiona las categorías de clientes para clasificación y filtrado
                            </p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Nueva Categoría
                        </button>
                    </div>

                    {/* Tabla */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow">
                        {categorias.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No hay categorías de cliente registradas
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Clave
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Descripción
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Clientes
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {categorias.map((categoria) => (
                                            <tr key={categoria.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {categoria.clave}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {categoria.nombre}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                                                    {categoria.descripcion || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 dark:text-gray-400">
                                                    {categoria.clientes_count || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {categoria.activo ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-800 dark:text-green-200">
                                                            <Check className="h-3 w-3" />
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-medium text-red-800 dark:text-red-200">
                                                            <X className="h-3 w-3" />
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(categoria)}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(categoria.id, categoria.nombre)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                            title="Eliminar/Desactivar"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Modal */}
                    {isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="space-y-4">
                                        {/* Clave */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Clave *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.clave}
                                                onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                                                placeholder="ej: mayorista"
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                                required
                                            />
                                        </div>

                                        {/* Nombre */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nombre *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                                placeholder="ej: Mayorista"
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                                required
                                            />
                                        </div>

                                        {/* Descripción */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Descripción
                                            </label>
                                            <textarea
                                                value={formData.descripcion}
                                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                                placeholder="Descripción opcional..."
                                                rows={3}
                                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        {/* Activo */}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="activo"
                                                checked={formData.activo}
                                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <label htmlFor="activo" className="text-sm text-gray-700 dark:text-gray-300">
                                                Activo
                                            </label>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="mt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? 'Guardando...' : 'Guardar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}

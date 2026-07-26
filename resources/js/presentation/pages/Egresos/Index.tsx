import { useAuth } from '@/application/hooks/use-auth';
import type { Pagination } from '@/domain/entities/shared';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

interface Egreso {
    id: number;
    numero: string;
    tipo_operacion: { id: number; nombre: string; codigo: string };
    estado_documento: { id: number; nombre: string; codigo: string; color?: string };
    usuario: { id: number; name: string };
    fecha: string;
    descripcion: string;
    total: number;
    estado_pago: string;
    created_at: string;
}

interface TipoOperacion { id: number; nombre: string }
interface Usuario { id: number; name: string }

interface PageProps extends InertiaPageProps {
    egresos: Pagination<Egreso>;
    tipos_operacion: TipoOperacion[];
    usuarios: Usuario[];
}

export default function EgresosIndex() {
    const { props } = usePage<PageProps>();
    const { can } = useAuth();
    const { egresos, tipos_operacion, usuarios } = props;

    const [filters, setFilters] = useState({
        numero: '',
        tipo_operacion_id: '',
        usuario_id: '',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleBuscar = () => {
        const params = new URLSearchParams();
        if (filters.numero) params.append('numero', filters.numero);
        if (filters.tipo_operacion_id) params.append('tipo_operacion_id', filters.tipo_operacion_id);
        if (filters.usuario_id) params.append('usuario_id', filters.usuario_id);

        router.get('/egresos', Object.fromEntries(params));
    };

    const handleLimpiar = () => {
        setFilters({ numero: '', tipo_operacion_id: '', usuario_id: '' });
        router.get('/egresos');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleBuscar();
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Egresos', href: '/egresos' }]}>
            <Head title="Egresos" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white">Egresos</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Gestión de egresos y gastos</p>
                    </div>
                    {can('egresos.create') && (
                        <Button onClick={() => router.visit('/egresos/create')} className="gap-2">
                            <Plus className="h-4 w-4" /> Nuevo Egreso
                        </Button>
                    )}
                </div>

                {/* Buscador */}
                <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-4 flex items-center gap-2">
                        <Search className="h-5 w-5 text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filtros</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {/* Búsqueda por Número */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                Número / ID
                            </label>
                            <Input
                                type="text"
                                name="numero"
                                value={filters.numero}
                                onChange={handleFilterChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Ej: EGRE20260725-0005"
                                className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                            />
                        </div>

                        {/* Filtro por Tipo de Operación */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                Tipo de Operación
                            </label>
                            <select
                                name="tipo_operacion_id"
                                value={filters.tipo_operacion_id}
                                onChange={handleFilterChange}
                                className="w-full rounded border px-2 py-2 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            >
                                <option value="">Todos</option>
                                {tipos_operacion.map(t => (
                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro por Usuario */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                                Usuario Creador
                            </label>
                            <select
                                name="usuario_id"
                                value={filters.usuario_id}
                                onChange={handleFilterChange}
                                className="w-full rounded border px-2 py-2 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            >
                                <option value="">Todos</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex items-end gap-2">
                            <Button
                                onClick={handleBuscar}
                                className="w-full"
                                size="sm"
                            >
                                <Search className="h-4 w-4 mr-1" /> Buscar
                            </Button>
                            <Button
                                onClick={handleLimpiar}
                                variant="outline"
                                size="sm"
                                className="dark:border-slate-600 dark:text-white"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <table className="w-full">
                        <thead className="border-b bg-gray-50 dark:border-slate-700 dark:bg-slate-800">
                            <tr>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Folio</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Número</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Fecha</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Tipo Operación</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Descripción</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Usuario</th>
                                <th className="px-2 py-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Total</th>
                                <th className="px-2 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Estado</th>
                                <th className="px-2 py-2 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">-</th>
                            </tr>
                        </thead>
                        <tbody>
                            {egresos.data?.length ? (
                                egresos.data.map((egreso) => (
                                    <tr key={egreso.id} className="border-b hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800">
                                        <td className="px-2 py-2 text-xs font-medium text-gray-900 dark:text-gray-100">#{egreso.id}</td>
                                        <td className="px-2 py-2 text-xs font-medium text-gray-900 dark:text-gray-100">{egreso.numero}</td>
                                        <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300">
                                            {new Date(egreso.fecha).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300">{egreso.tipo_operacion.nombre}</td>
                                        <td className="px-2 py-2 text-xs text-gray-600 dark:text-gray-400">{egreso.descripcion || '-'}</td>
                                        <td className="px-2 py-2 text-xs text-gray-700 dark:text-gray-300">{egreso.usuario.name}</td>
                                        <td className="px-2 py-2 text-right text-xs font-semibold text-gray-900 dark:text-gray-100">
                                            Bs. {parseFloat(String(egreso.total)).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-2 text-xs">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    egreso.estado_documento.codigo === 'APROBADO'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                }`}
                                            >
                                                {egreso.estado_documento.nombre}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2 text-xs text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.visit(`/egresos/${egreso.id}`)}
                                                className="bg-transparent text-xs hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white transition-colors duration-200"
                                            >
                                                Ver
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        No hay egresos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {egresos.links && (
                    <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Mostrando {egresos.from} a {egresos.to} de {egresos.total} egresos
                        </div>
                        <div className="flex gap-2">
                            {egresos.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 rounded text-sm transition-colors ${
                                        link.active
                                            ? 'bg-blue-500 text-white dark:bg-blue-600'
                                            : link.url
                                            ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700'
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-gray-600'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

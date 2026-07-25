import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import { Plus } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import type { Pagination } from '@/domain/entities/shared';

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

interface PageProps extends InertiaPageProps { egresos: Pagination<Egreso> }

export default function EgresosIndex() {
    const { props } = usePage<PageProps>();
    const { can } = useAuth();
    const egresos = props.egresos;

    return (
        <AppLayout breadcrumbs={[{ title: 'Egresos', href: '/egresos' }]}>
            <Head title="Egresos" />
            <div className="space-y-4 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white">Egresos</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de egresos y gastos</p>
                    </div>
                    {can('egresos.create') && (
                        <Button onClick={() => router.visit('/egresos/create')} className="gap-2">
                            <Plus className="w-4 h-4" /> Nuevo Egreso
                        </Button>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-700 overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Número</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Fecha</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Tipo Operación</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Descripción</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Usuario</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Total</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Estado</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {egresos.data?.map((egreso) => (
                                <tr key={egreso.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{egreso.numero}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{new Date(egreso.fecha).toLocaleDateString('es-ES')}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{egreso.tipo_operacion.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{egreso.descripcion || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{egreso.usuario.name}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900 dark:text-gray-100">Bs. {parseFloat(egreso.total).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            egreso.estado_documento.codigo === 'APROBADO'
                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                        }`}>
                                            {egreso.estado_documento.nombre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Button variant="ghost" size="sm" onClick={() => router.visit(`/egresos/${egreso.id}`)}>Ver</Button>
                                    </td>
                                </tr>
                            )) || <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No hay egresos registrados</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

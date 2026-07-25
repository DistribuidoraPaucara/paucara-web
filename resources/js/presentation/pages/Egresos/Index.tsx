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
                        <h1 className="text-3xl font-bold">Egresos</h1>
                        <p className="text-gray-500 mt-1">Gestión de egresos y gastos</p>
                    </div>
                    {can('egresos.create') && (
                        <Button onClick={() => router.visit('/egresos/create')} className="gap-2">
                            <Plus className="w-4 h-4" /> Nuevo Egreso
                        </Button>
                    )}
                </div>
                <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Número</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Tipo Operación</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Descripción</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Usuario</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold">Total</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {egresos.data?.map((egreso) => (
                                <tr key={egreso.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium">{egreso.numero}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(egreso.fecha).toLocaleDateString('es-ES')}</td>
                                    <td className="px-6 py-4 text-sm">{egreso.tipo_operacion.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{egreso.descripcion || '-'}</td>
                                    <td className="px-6 py-4 text-sm">{egreso.usuario.name}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-right">Bs. {parseFloat(egreso.total).toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${egreso.estado_documento.codigo === 'APROBADO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {egreso.estado_documento.nombre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <Button variant="ghost" size="sm" onClick={() => router.visit(`/egresos/${egreso.id}`)}>Ver</Button>
                                    </td>
                                </tr>
                            )) || <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">No hay egresos registrados</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

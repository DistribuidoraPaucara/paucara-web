import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface TipoOperacion { id: number; nombre: string }
interface TipoPago { id: number; nombre: string }
interface PageProps extends InertiaPageProps {
    [key: string]: any;
    tipos_operacion: TipoOperacion[];
    tipos_pago: TipoPago[];
}

interface DetalleForm {
    concepto: string;
    tipo_operacion_caja_id: string;
    monto_efectivo: number;
    monto_transferencia: number;
}

export default function CreateEgreso() {
    const { props } = usePage<PageProps>();
    const initialDetalle: DetalleForm = { concepto: '', tipo_operacion_caja_id: '', monto_efectivo: 0, monto_transferencia: 0 };
    const [detalles, setDetalles] = useState<DetalleForm[]>([initialDetalle]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    interface FormData {
        descripcion: string;
        detalles: DetalleForm[];
        observaciones: string;
    }

    const { data, setData } = useForm<FormData>({ descripcion: '', detalles: [initialDetalle], observaciones: '' });

    const handleDetalleChange = (index: number, field: keyof DetalleForm, value: any) => {
        const newDetalles = [...detalles];
        (newDetalles[index] as any)[field] = value;
        setDetalles(newDetalles);
        setData('detalles', newDetalles);
    };

    const handleAddDetalle = () => {
        const newDetalles = [...detalles, { concepto: '', tipo_operacion_caja_id: '', monto_efectivo: 0, monto_transferencia: 0 }];
        setDetalles(newDetalles);
        setData('detalles', newDetalles);
    };

    const handleRemoveDetalle = (index: number) => {
        const newDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(newDetalles);
        setData('detalles', newDetalles);
    };

    const getDetalleTotal = (detalle: DetalleForm) => detalle.monto_efectivo + detalle.monto_transferencia;
    const totalEgreso = detalles.reduce((sum, d) => sum + getDetalleTotal(d), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/egresos', { ...data, detalles });
            if (response.data.success) router.visit('/egresos');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear egreso');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Egresos', href: '/egresos' }, { title: 'Nuevo', href: '/egresos/create' }]}>
            <Head title="Nuevo Egreso" />
            <div className="space-y-4 p-4">
                <h1 className="text-3xl font-bold dark:text-white">Nuevo Egreso</h1>
                {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-700">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-100 mb-2">Descripción General</label>
                        <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white" rows={2} placeholder="Descripción general del egreso (opcional)" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold dark:text-white">Detalles del Egreso</h2>
                            <Button variant="outline" onClick={handleAddDetalle} className="dark:border-slate-600 dark:text-white">
                                <Plus className="w-4 h-4 mr-2" /> Agregar Detalle
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-slate-700">
                                        <th className="border dark:border-slate-600 px-4 py-3 text-left text-sm font-semibold dark:text-gray-100">Concepto</th>
                                        <th className="border dark:border-slate-600 px-4 py-3 text-left text-sm font-semibold dark:text-gray-100">Tipo de Operación</th>
                                        <th className="border dark:border-slate-600 px-4 py-3 text-right text-sm font-semibold dark:text-gray-100">Efectivo</th>
                                        <th className="border dark:border-slate-600 px-4 py-3 text-right text-sm font-semibold dark:text-gray-100">Transferencia/QR</th>
                                        <th className="border dark:border-slate-600 px-4 py-3 text-right text-sm font-semibold dark:text-gray-100">Total</th>
                                        <th className="border dark:border-slate-600 px-4 py-3 text-center text-sm font-semibold dark:text-gray-100">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((detalle, index) => {
                                        const total = getDetalleTotal(detalle);
                                        return (
                                            <tr key={index} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                                                <td className="border dark:border-slate-600 px-4 py-3">
                                                    <Input value={detalle.concepto} onChange={(e) => handleDetalleChange(index, 'concepto', e.target.value)} placeholder="Ej: Café..." required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" />
                                                </td>
                                                <td className="border dark:border-slate-600 px-4 py-3">
                                                    <select value={detalle.tipo_operacion_caja_id} onChange={(e) => handleDetalleChange(index, 'tipo_operacion_caja_id', e.target.value)} className="w-full px-2 py-1 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" required>
                                                        <option value="">Seleccionar...</option>
                                                        {props.tipos_operacion.map((t) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
                                                    </select>
                                                </td>
                                                <td className="border dark:border-slate-600 px-4 py-3">
                                                    <Input type="number" value={detalle.monto_efectivo} onChange={(e) => handleDetalleChange(index, 'monto_efectivo', parseFloat(e.target.value) || 0)} step="0.01" min="0" placeholder="0.00" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm text-right" />
                                                </td>
                                                <td className="border dark:border-slate-600 px-4 py-3">
                                                    <Input type="number" value={detalle.monto_transferencia} onChange={(e) => handleDetalleChange(index, 'monto_transferencia', parseFloat(e.target.value) || 0)} step="0.01" min="0" placeholder="0.00" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm text-right" />
                                                </td>
                                                <td className="border dark:border-slate-600 px-4 py-3 text-right font-bold dark:text-white">
                                                    Bs. {total.toFixed(2)}
                                                </td>
                                                <td className="border dark:border-slate-600 px-4 py-3 text-center">
                                                    {detalles.length > 1 && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveDetalle(index)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Total General */}
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                        <p className="text-center text-gray-600 dark:text-gray-300 mb-2">Total del Egreso</p>
                        <p className="text-center text-4xl font-bold text-blue-600 dark:text-blue-300">Bs. {totalEgreso.toFixed(2)}</p>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">Cada detalle crea un movimiento de caja por separado</p>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-100 mb-2">Observaciones</label>
                        <textarea value={data.observaciones} onChange={(e) => setData('observaciones', e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white" rows={2} placeholder="Observaciones opcionales" />
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Egreso'}
                        </Button>
                        <Button variant="outline" onClick={() => router.visit('/egresos')} className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

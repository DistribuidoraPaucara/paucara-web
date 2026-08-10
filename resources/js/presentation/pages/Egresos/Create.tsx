import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { CATEGORIAS_GASTO, CATEGORIAS_PAGO_SUELDO, CATEGORIAS_ANTICIPO } from '@/constants/categorias-gasto';
import { OutputSelectionModal, type TipoDocumento } from '@/presentation/components/impresion/OutputSelectionModal';
import toast from 'react-hot-toast';

interface TipoOperacion { id: number; nombre: string }
interface TipoPago { id: number; nombre: string }
interface PageProps extends InertiaPageProps {
    [key: string]: any;
    tipos_operacion: TipoOperacion[];
    tipos_pago: TipoPago[];
}

interface DetalleForm {
    concepto: string;
    categoria?: string;
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
    const [outputModal, setOutputModal] = useState<{ isOpen: boolean; egresoId?: number }>({ isOpen: false });

    interface FormData {
        descripcion: string;
        detalles: DetalleForm[];
        observaciones: string;
    }

    // Obtener fecha actual formateada
    const fechaHoy = new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const { data, setData } = useForm<FormData>({ descripcion: `Salida Diaria - ${fechaHoy}`, detalles: [initialDetalle], observaciones: '' });

    const handleDetalleChange = (index: number, field: keyof DetalleForm, value: any) => {
        const newDetalles = [...detalles];
        (newDetalles[index] as any)[field] = value;
        setDetalles(newDetalles);
        setData('detalles', newDetalles);
    };

    const handleAddDetalle = () => {
        const newDetalles = [...detalles, { concepto: '', categoria: '', tipo_operacion_caja_id: '', monto_efectivo: 0, monto_transferencia: 0 }];
        setDetalles(newDetalles);
        setData('detalles', newDetalles);
    };

    // Obtener categorías según el tipo de operación
    const getCategoriasPorTipo = (tipoId: string): Record<string, string> => {
        const tipo = props.tipos_operacion.find(t => t.id.toString() === tipoId);
        if (!tipo) return {};

        const codigo = tipo.nombre?.toUpperCase() || '';
        if (codigo.includes('GASTO')) return CATEGORIAS_GASTO;
        if (codigo.includes('PAGO') || codigo.includes('SUELDO')) return CATEGORIAS_PAGO_SUELDO;
        if (codigo.includes('ANTICIPO')) return CATEGORIAS_ANTICIPO;
        return CATEGORIAS_GASTO; // Default
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
        setError('');
        try {
            const response = await axios.post('/api/egresos', { ...data, detalles });
            if (response.data.success) {
                console.log('✅ Egreso creado exitosamente:', response.data);
                toast.success('Egreso registrado correctamente');

                // ✅ Abrir modal de impresión con el ID del egreso
                setOutputModal({
                    isOpen: true,
                    egresoId: response.data.egreso_id || response.data.data?.id,
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Error al crear egreso';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('❌ Error al crear egreso:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Egresos', href: '/egresos' }, { title: 'Nuevo', href: '/egresos/create' }]}>
            <Head title="Nuevo Egreso" />
            <div className="space-y-4 p-2">
                <h1 className="text-3xl font-bold dark:text-white">Nuevo Egreso</h1>
                {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-lg border dark:border-slate-700">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-100 mb-2">Descripción General</label>
                        <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} className="w-full px-2 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white" placeholder="Descripción general del egreso (opcional)" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold dark:text-white">Detalles del Egreso</h3>
                            <Button variant="outline" onClick={handleAddDetalle} className="dark:border-slate-600 dark:text-white">
                                <Plus className="w-4 h-4 mr-2" /> Agregar Detalle
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-slate-700">
                                        <th className="border dark:border-slate-600 px-2 py-2 text-left text-sm font-semibold dark:text-gray-100">Tipo de Operación</th>
                                        <th className="border dark:border-slate-600 px-2 py-2 text-left text-sm font-semibold dark:text-gray-100">Categoría</th>
                                        <th className="border dark:border-slate-600 px-2 py-2 text-left text-sm font-semibold dark:text-gray-100">Concepto</th>
                                        <th className="border dark:border-slate-600 px-2 py-2 text-right text-sm font-semibold dark:text-gray-100">Efectivo</th>
                                        <th className="border dark:border-slate-600 px-2 py-2 text-right text-sm font-semibold dark:text-gray-100">Transferencia/QR</th>
                                        <th className="border dark:border-slate-600 px-2 py-2 text-right text-sm font-semibold dark:text-gray-100">Total</th>
                                        <th className="border dark:border-slate-600 px-2 py-2 text-center text-sm font-semibold dark:text-gray-100">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((detalle, index) => {
                                        const total = getDetalleTotal(detalle);
                                        const categoriasDisponibles = getCategoriasPorTipo(detalle.tipo_operacion_caja_id);
                                        return (
                                            <tr key={index} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                                                <td className="border dark:border-slate-600 px-2 py-2">
                                                    <select value={detalle.tipo_operacion_caja_id} onChange={(e) => handleDetalleChange(index, 'tipo_operacion_caja_id', e.target.value)} className="w-full px-2 py-1 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" required>
                                                        <option value="">Seleccionar...</option>
                                                        {props.tipos_operacion.map((t) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
                                                    </select>
                                                </td>
                                                <td className="border dark:border-slate-600 px-2 py-2">
                                                    <select value={detalle.categoria || ''} onChange={(e) => handleDetalleChange(index, 'categoria', e.target.value)} className="w-full px-2 py-1 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm">
                                                        <option value="">Seleccionar...</option>
                                                        {Object.entries(categoriasDisponibles).map(([key, valor]) => (<option key={key} value={key}>{valor}</option>))}
                                                    </select>
                                                </td>
                                                <td className="border dark:border-slate-600 px-2 py-2">
                                                    <Input value={detalle.concepto} onChange={(e) => handleDetalleChange(index, 'concepto', e.target.value)} placeholder="Concepto (opcional)" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm" />
                                                </td>
                                                <td className="border dark:border-slate-600 px-2 py-2">
                                                    <Input type="number" value={detalle.monto_efectivo} onChange={(e) => handleDetalleChange(index, 'monto_efectivo', parseFloat(e.target.value) || 0)} step="0.01" min="0" placeholder="0.00" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm text-right" />
                                                </td>
                                                <td className="border dark:border-slate-600 px-2 py-2">
                                                    <Input type="number" value={detalle.monto_transferencia} onChange={(e) => handleDetalleChange(index, 'monto_transferencia', parseFloat(e.target.value) || 0)} step="0.01" min="0" placeholder="0.00" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white text-sm text-right" />
                                                </td>
                                                <td className="border dark:border-slate-600 px-2 py-2 text-right font-bold dark:text-white">
                                                    Bs. {total.toFixed(2)}
                                                </td>
                                                <td className="border dark:border-slate-600 px-2 py-2 text-center">
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
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-2 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                        <p className="text-center text-gray-600 dark:text-gray-300 mb-2">Total del Egreso</p>
                        <p className="text-center text-4xl font-bold text-blue-600 dark:text-blue-300">Bs. {totalEgreso.toFixed(2)}</p>
                        {/* <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">Cada detalle crea un movimiento de caja por separado</p> */}
                    </div>

                    {/* Observaciones */}
                    {/* <div>
                        <label className="block text-sm font-medium dark:text-gray-100 mb-2">Observaciones</label>
                        <textarea value={data.observaciones} onChange={(e) => setData('observaciones', e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white" rows={2} placeholder="Observaciones opcionales" />
                    </div> */}

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

            {/* ✅ Modal de selección de formato/acción para impresión */}
            {outputModal.egresoId && (
                <OutputSelectionModal
                    isOpen={outputModal.isOpen}
                    onClose={() => {
                        setOutputModal({ isOpen: false });
                        // ✅ Después de cerrar el modal, volver al listado
                        setTimeout(() => router.visit('/egresos'), 500);
                    }}
                    documentoId={outputModal.egresoId}
                    tipoDocumento="egreso"
                    documentoInfo={{
                        numero: `Egreso #${outputModal.egresoId}`,
                        fecha: new Date().toLocaleDateString('es-BO'),
                    }}
                />
            )}
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, Printer } from 'lucide-react';
import { useState } from 'react';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

interface Egreso {
    id: number;
    numero: string;
    tipo_operacion: { nombre: string };
    estado_documento: { nombre: string; codigo: string };
    usuario: { name: string };
    fecha: string;
    descripcion: string;
    total: number;
    detalles: Array<{
        id: number;
        concepto: string;
        tipo_operacion_caja_id?: number;
        tipoOperacion?: { nombre: string };
        monto_efectivo?: number;
        monto_transferencia?: number;
        subtotal?: number;
    }>;
    detalles_pago?: Array<{ tipo_pago: { nombre: string }; monto: number }>;
}

interface PageProps {
    egreso: Egreso;
}

export default function ShowEgreso() {
    const { props } = usePage<PageProps>();
    const egreso = props.egreso;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [printModal, setPrintModal] = useState<{ isOpen: boolean; egresoId?: number; egresoNumero?: string }>({ isOpen: false });

    const handleAnular = async () => {
        if (!confirm('¿Estás seguro de que deseas anular este egreso?')) return;
        setLoading(true);
        try {
            await axios.post(`/api/egresos/${egreso.id}/anular`);
            router.visit('/egresos');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al anular');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Egresos', href: '/egresos' },
                { title: egreso.numero, href: `/egresos/${egreso.id}` },
            ]}
        >
            <Head title={`Egreso ${egreso.numero}`} />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white">{egreso.numero}</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">{new Date(egreso.fecha).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setPrintModal({ isOpen: true, egresoId: egreso.id, egresoNumero: egreso.numero })}
                            variant="outline"
                            className="gap-2 dark:border-slate-600 dark:text-white"
                        >
                            <Printer className="h-4 w-4" /> Imprimir
                        </Button>
                        {egreso.estado_documento.codigo === 'APROBADO' && (
                            <Button variant="destructive" onClick={handleAnular} disabled={loading}>
                                {loading ? 'Anulando...' : 'Anular Egreso'}
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="flex gap-2 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-200">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-4 gap-4 rounded-lg border bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de Operación</p>
                        <p className="text-lg font-semibold dark:text-white">{egreso.tipo_operacion.nombre}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</p>
                        <p
                            className={`text-lg font-semibold ${egreso.estado_documento.codigo === 'APROBADO' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                        >
                            {egreso.estado_documento.nombre}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuario</p>
                        <p className="text-lg font-semibold dark:text-white">{egreso.usuario.name}</p>
                    </div>
                    {egreso.descripcion && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Descripción</p>
                            <p className="dark:text-gray-200">{egreso.descripcion}</p>
                        </div>
                    )}
                </div>

                <div className="rounded-lg border bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="mb-4 text-xl font-bold dark:text-white">Detalles de Egresos</h2>
                    <div className="space-y-3">
                        {egreso.detalles.map((d) => {
                            const totalDetalle = parseFloat(String(d.monto_efectivo || 0)) + parseFloat(String(d.monto_transferencia || 0));
                            return (
                                <div key={d.id}>
                                                                        
                                    <div className="grid grid-cols-3 gap-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900">
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Concepto</p>
                                            <p className="text-base font-semibold dark:text-white">{d.concepto}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-300">Efectivo</p>
                                            <p className="text-lg font-bold text-blue-700 dark:text-blue-200">
                                                Bs. {parseFloat(String(d.monto_efectivo || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-blue-600 dark:text-blue-300">Transferencia/QR</p>
                                            <p className="text-lg font-bold text-blue-700 dark:text-blue-200">
                                                Bs. {parseFloat(String(d.monto_transferencia || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* {egreso.detalles_pago && egreso.detalles_pago.length > 0 && (
                    <div className="rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="mb-4 text-xl font-bold dark:text-white">Resumen de Pagos</h2>
                        <div className="space-y-2">
                            {egreso.detalles_pago.map((p, i) => (
                                <div key={i} className="flex justify-between border-b py-2 dark:border-slate-700 dark:text-gray-200">
                                    <span>{p.tipo_pago.nombre}</span>
                                    <span className="font-semibold">Bs. {parseFloat(String(p.monto)).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="mt-4 flex justify-between rounded bg-blue-50 px-4 py-2 text-lg font-bold dark:bg-blue-900 dark:text-blue-100">
                                <span>Total</span>
                                <span>Bs. {parseFloat(String(egreso.total)).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )} */}

                <div className="rounded-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-2 dark:border-green-700 dark:from-green-900 dark:to-green-800">
                    <p className="mb-1 text-center text-gray-600 dark:text-gray-300">Total del Egreso</p>
                    <p className="text-center text-4xl font-bold text-green-600 dark:text-green-300">
                        Bs. {parseFloat(String(egreso.total)).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* ✅ Modal de selección de formato/acción para impresión */}
            {printModal.egresoId && (
                <OutputSelectionModal
                    isOpen={printModal.isOpen}
                    onClose={() => setPrintModal({ isOpen: false })}
                    documentoId={printModal.egresoId}
                    tipoDocumento="egreso"
                    documentoInfo={{
                        numero: printModal.egresoNumero || `Egreso #${printModal.egresoId}`,
                        fecha: new Date().toLocaleDateString('es-BO'),
                    }}
                />
            )}
        </AppLayout>
    );
}

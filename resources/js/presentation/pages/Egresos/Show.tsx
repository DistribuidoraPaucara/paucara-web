import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/presentation/components/ui/button";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { useState } from "react";

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

interface PageProps { egreso: Egreso }

export default function ShowEgreso() {
    const { props } = usePage<PageProps>();
    const egreso = props.egreso;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAnular = async () => {
        if (!confirm("¿Estás seguro de que deseas anular este egreso?")) return;
        setLoading(true);
        try {
            await axios.post(`/api/egresos/${egreso.id}/anular`);
            router.visit("/egresos");
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al anular");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Egresos", href: "/egresos" }, { title: egreso.numero, href: `/egresos/${egreso.id}` }]}>
            <Head title={`Egreso ${egreso.numero}`} />
            <div className="space-y-4 p-4 max-w-4xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white">{egreso.numero}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{new Date(egreso.fecha).toLocaleDateString("es-ES")}</p>
                    </div>
                    {egreso.estado_documento.codigo === "APROBADO" && (
                        <Button variant="destructive" onClick={handleAnular} disabled={loading}>
                            {loading ? "Anulando..." : "Anular Egreso"}
                        </Button>
                    )}
                </div>

                {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded flex gap-2"><AlertCircle className="w-5 h-5" />{error}</div>}

                <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-700">
                    <div><p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de Operación</p><p className="text-lg font-semibold dark:text-white">{egreso.tipo_operacion.nombre}</p></div>
                    <div><p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</p><p className={`text-lg font-semibold ${egreso.estado_documento.codigo === "APROBADO" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{egreso.estado_documento.nombre}</p></div>
                    <div><p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuario</p><p className="text-lg font-semibold dark:text-white">{egreso.usuario.name}</p></div>
                </div>

                {egreso.descripcion && <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-700"><p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Descripción</p><p className="dark:text-gray-200">{egreso.descripcion}</p></div>}

                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Detalles de Egresos</h2>
                    <div className="space-y-3">
                        {egreso.detalles.map((d) => {
                            const totalDetalle = (d.monto_efectivo || 0) + (d.monto_transferencia || 0);
                            return (
                                <div key={d.id} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border dark:border-slate-700">
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Concepto</p>
                                            <p className="text-base font-semibold dark:text-white">{d.concepto}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo de Operación</p>
                                            <p className="text-base font-semibold dark:text-white">{d.tipoOperacion?.nombre || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                                        <div>
                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-300 mb-1">Efectivo</p>
                                            <p className="text-lg font-bold text-blue-700 dark:text-blue-200">Bs. {parseFloat(String(d.monto_efectivo || 0)).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-blue-600 dark:text-blue-300 mb-1">Transferencia/QR</p>
                                            <p className="text-lg font-bold text-blue-700 dark:text-blue-200">Bs. {parseFloat(String(d.monto_transferencia || 0)).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <div className="bg-white dark:bg-slate-700 px-3 py-1 rounded">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                                            <p className="text-sm font-bold dark:text-white">Bs. {totalDetalle.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {egreso.detalles_pago && egreso.detalles_pago.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-700">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Resumen de Pagos</h2>
                        <div className="space-y-2">
                            {egreso.detalles_pago.map((p, i) => (<div key={i} className="flex justify-between py-2 border-b dark:border-slate-700 dark:text-gray-200"><span>{p.tipo_pago.nombre}</span><span className="font-semibold">Bs. {parseFloat(String(p.monto)).toFixed(2)}</span></div>))}
                            <div className="flex justify-between py-2 text-lg font-bold bg-blue-50 dark:bg-blue-900 px-4 rounded mt-4 dark:text-blue-100"><span>Total</span><span>Bs. {parseFloat(String(egreso.total)).toFixed(2)}</span></div>
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-6 rounded-lg border-2 border-green-200 dark:border-green-700">
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-2">Total del Egreso</p>
                    <p className="text-center text-4xl font-bold text-green-600 dark:text-green-300">Bs. {parseFloat(String(egreso.total)).toFixed(2)}</p>
                </div>

                <Button variant="outline" onClick={() => router.visit("/egresos")} className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">Volver</Button>
            </div>
        </AppLayout>
    );
}

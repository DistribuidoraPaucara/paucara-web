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
    detalles: Array<{ id: number; concepto: string; cantidad: number; monto_unitario: number; subtotal: number }>;
    detalles_pago: Array<{ tipo_pago: { nombre: string }; monto: number }>;
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
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Detalles</h2>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800"><tr><th className="px-4 py-2 text-left dark:text-gray-100">Concepto</th><th className="px-4 py-2 text-center dark:text-gray-100">Cantidad</th><th className="px-4 py-2 text-right dark:text-gray-100">Monto Unit.</th><th className="px-4 py-2 text-right dark:text-gray-100">Subtotal</th></tr></thead>
                        <tbody>
                            {egreso.detalles.map((d) => (<tr key={d.id} className="border-b dark:border-slate-700"><td className="px-4 py-2 dark:text-gray-200">{d.concepto}</td><td className="px-4 py-2 text-center dark:text-gray-200">{d.cantidad}</td><td className="px-4 py-2 text-right dark:text-gray-200">Bs. {d.monto_unitario.toFixed(2)}</td><td className="px-4 py-2 text-right font-semibold dark:text-gray-100">Bs. {d.subtotal.toFixed(2)}</td></tr>))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Pagos</h2>
                    <div className="space-y-2">
                        {egreso.detalles_pago.map((p, i) => (<div key={i} className="flex justify-between py-2 border-b dark:border-slate-700 dark:text-gray-200"><span>{p.tipo_pago.nombre}</span><span className="font-semibold">Bs. {p.monto.toFixed(2)}</span></div>))}
                        <div className="flex justify-between py-2 text-lg font-bold bg-blue-50 dark:bg-blue-900 px-4 rounded mt-4 dark:text-blue-100"><span>Total</span><span>Bs. {egreso.total.toFixed(2)}</span></div>
                    </div>
                </div>

                <Button variant="outline" onClick={() => router.visit("/egresos")} className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">Volver</Button>
            </div>
        </AppLayout>
    );
}

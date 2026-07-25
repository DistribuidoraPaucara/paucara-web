import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import axios from "axios";

interface TipoOperacion { id: number; nombre: string }
interface TipoPago { id: number; nombre: string }
interface PageProps { tipos_operacion: TipoOperacion[]; tipos_pago: TipoPago[] }
interface DetalleForm { concepto: string; cantidad: number; monto_unitario: number; descuento: number; subtotal: number }

export default function CreateEgreso() {
    const { props } = usePage<PageProps>();
    const [detalles, setDetalles] = useState<DetalleForm[]>([{ concepto: "", cantidad: 1, monto_unitario: 0, descuento: 0, subtotal: 0 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { data, setData } = useForm({ tipo_operacion_caja_id: "", descripcion: "", monto_efectivo: 0, monto_transferencia: 0, detalles, observaciones: "" });

    const handleDetalleChange = (index: number, field: string, value: any) => {
        const newDetalles = [...detalles];
        newDetalles[index][field as keyof DetalleForm] = value;
        if (["cantidad", "monto_unitario", "descuento"].includes(field)) {
            newDetalles[index].subtotal = (newDetalles[index].cantidad * newDetalles[index].monto_unitario) - newDetalles[index].descuento;
        }
        setDetalles(newDetalles);
        setData("detalles", newDetalles);
    };

    const handleAddDetalle = () => {
        const newDetalles = [...detalles, { concepto: "", cantidad: 1, monto_unitario: 0, descuento: 0, subtotal: 0 }];
        setDetalles(newDetalles);
        setData("detalles", newDetalles);
    };

    const handleRemoveDetalle = (index: number) => {
        const newDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(newDetalles);
        setData("detalles", newDetalles);
    };

    const totalDetalles = detalles.reduce((sum, d) => sum + d.subtotal, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/egresos", { ...data, detalles });
            if (response.data.success) router.visit("/egresos");
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al crear egreso");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Egresos", href: "/egresos" }, { title: "Nuevo", href: "/egresos/create" }]}>
            <Head title="Nuevo Egreso" />
            <div className="space-y-4 p-4">
                <h1 className="text-3xl font-bold dark:text-white">Nuevo Egreso</h1>
                {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-2 py-2 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-2 rounded-lg border dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-100">Tipo de Operación *</label>
                            <select value={data.tipo_operacion_caja_id} onChange={(e) => setData("tipo_operacion_caja_id", e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white" required>
                                <option value="">Seleccionar...</option>
                                {props.tipos_operacion.map((t) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium dark:text-gray-100">Descripción</label>
                            <textarea value={data.descripcion} onChange={(e) => setData("descripcion", e.target.value)} className="w-full px-2 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-100">Detalles *</label>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-800"><tr><th className="px-3 py-2 text-left dark:text-gray-100">Concepto</th><th className="px-3 py-2 text-center w-20 dark:text-gray-100">Cant.</th><th className="px-3 py-2 text-right w-32 dark:text-gray-100">Monto Unit.</th><th className="px-3 py-2 text-right w-32 dark:text-gray-100">Descuento</th><th className="px-3 py-2 text-right w-32 dark:text-gray-100">Subtotal</th><th className="w-10"></th></tr></thead>
                                <tbody>
                                    {detalles.map((d, i) => (<tr key={i} className="border-b dark:border-slate-700"><td className="px-3 py-2"><Input value={d.concepto} onChange={(e) => handleDetalleChange(i, "concepto", e.target.value)} placeholder="Concepto" required className="dark:bg-slate-800 dark:border-slate-600 dark:text-white" /></td><td className="px-3 py-2"><Input type="number" value={d.cantidad} onChange={(e) => handleDetalleChange(i, "cantidad", parseFloat(e.target.value))} min="1" className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-center" /></td><td className="px-3 py-2"><Input type="number" value={d.monto_unitario} onChange={(e) => handleDetalleChange(i, "monto_unitario", parseFloat(e.target.value))} step="0.01" className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-right" /></td><td className="px-3 py-2"><Input type="number" value={d.descuento} onChange={(e) => handleDetalleChange(i, "descuento", parseFloat(e.target.value))} step="0.01" className="dark:bg-slate-800 dark:border-slate-600 dark:text-white text-right" /></td><td className="px-3 py-2 text-right font-semibold dark:text-gray-100">Bs. {d.subtotal.toFixed(2)}</td><td className="px-3 py-2"><Button variant="ghost" size="sm" onClick={() => handleRemoveDetalle(i)} disabled={detalles.length === 1}><Trash2 className="w-4 h-4" /></Button></td></tr>))}
                                </tbody>
                            </table>
                        </div>
                        <Button variant="outline" onClick={handleAddDetalle} className="mt-2 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"><Plus className="w-4 h-4 mr-2" /> Agregar Detalle</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-slate-800 p-2 rounded-lg">
                        <div><label className="block text-sm font-medium mb-2 dark:text-gray-100">Efectivo</label><Input type="number" value={data.monto_efectivo} onChange={(e) => setData("monto_efectivo", parseFloat(e.target.value))} step="0.01" min="0" className="text-lg font-semibold dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></div>
                        <div><label className="block text-sm font-medium mb-2 dark:text-gray-100">Transferencia/QR</label><Input type="number" value={data.monto_transferencia} onChange={(e) => setData("monto_transferencia", parseFloat(e.target.value))} step="0.01" min="0" className="text-lg font-semibold dark:bg-slate-700 dark:border-slate-600 dark:text-white" /></div>
                        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg"><p className="text-sm font-medium mb-1 dark:text-blue-200">Total</p><p className="text-2xl font-bold dark:text-blue-100">Bs. {totalDetalles.toFixed(2)}</p></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-100">Observaciones</label>
                        <textarea value={data.observaciones} onChange={(e) => setData("observaciones", e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white" rows={2} />
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar Egreso"}
                        </Button>
                        <Button variant="outline" onClick={() => router.visit("/egresos")} className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import { useToast } from '@/presentation/hooks/useToast';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { PrestamoCliente } from '@/domain/entities/prestamos';
import prestamoClienteService from '@/infrastructure/services/prestamo-cliente.service';

interface Props {
    prestamoId: number;
}

interface DevolucionData {
    fecha_devolucion: string;
    monto_cobrado_daño_total: number;
    observaciones: string;
    detalles: Array<{
        prestamo_cliente_detalle_id: number;
        cantidad_devuelta?: number;
        cantidad_dañada_total?: number;
    }>;
}

export default function RegistrarDevolucionCliente({ prestamoId }: Props) {
    const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

    const [prestamo, setPrestamo] = useState<PrestamoCliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [devolucionData, setDevolucionData] = useState<DevolucionData>({
        fecha_devolucion: new Date().toISOString().split('T')[0],
        monto_cobrado_daño_total: 0,
        observaciones: '',
        detalles: [],
    });

    useEffect(() => {
        cargarPrestamo();
    }, []);

    const cargarPrestamo = async () => {
        setLoading(true);
        try {
            const data = await prestamoClienteService.getById(prestamoId);
            setPrestamo(data);
            console.log('📦 Detalles del préstamo:', data.detalles);
            data.detalles?.forEach((d: any) => {
                console.log(`  - Detalle ${d.id}: ${d.prestable?.nombre}`, d);
            });
            // Inicializar detalles de devolución
            setDevolucionData(prev => ({
                ...prev,
                detalles: data.detalles.map((d: any) => ({
                    prestamo_cliente_detalle_id: d.id,
                    cantidad_devuelta: 0,
                    cantidad_dañada_total: 0,
                })),
            }));
        } catch (err: any) {
            const msg = err.message || 'Error cargando préstamo';
            setError(msg);
            toastError(msg);
        } finally {
            setLoading(false);
        }
    };

    const obtenerMontoDanioTotal = (detalle: any): number => {
        const precios = Array.isArray(detalle?.prestable?.precios) ? detalle.prestable.precios : [];
        const precioDanio = precios.find((p: any) => {
            const tipoPrecio = String(p?.tipo_precio || '').toUpperCase().replace(/\s+/g, '_');
            return tipoPrecio === 'DAÑO_TOTAL' || (tipoPrecio.includes('DAÑO') && tipoPrecio.includes('TOTAL'));
        });
        if (precioDanio?.valor != null) {
            return Number(precioDanio.valor) || 0;
        }

        const condiciones = detalle?.prestable?.condiciones;
        if (!condiciones) return 0;

        if (Array.isArray(condiciones)) {
            const condicionActiva = condiciones.find((c: any) => Boolean(c?.activo)) || condiciones?.[0];
            return Number(condicionActiva?.monto_daño_total || 0);
        }

        return Number(condiciones?.monto_daño_total || 0);
    };

    // Calcular monto total de daños cuando cambian los detalles
    useEffect(() => {
        if (!prestamo) return;

        const montoTotalDanios = devolucionData.detalles.reduce((sum, det) => {
            const detallePrestamo = prestamo.detalles?.find((d: any) => d.id === det.prestamo_cliente_detalle_id);
            const montoDanioUnitario = obtenerMontoDanioTotal(detallePrestamo);
            return sum + (Number(det.cantidad_dañada_total || 0) * montoDanioUnitario);
        }, 0);

        if (Number(devolucionData.monto_cobrado_daño_total) !== Number(montoTotalDanios)) {
            setDevolucionData(prev => ({
                ...prev,
                monto_cobrado_daño_total: Number(montoTotalDanios.toFixed(2)),
            }));
        }
    }, [devolucionData.detalles, prestamo]);

    const handleRegistrarDevolucion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prestamo || devolucionData.detalles.length === 0) return;

        setSubmitting(true);
        try {
            const payload = {
                fecha_devolucion: devolucionData.fecha_devolucion,
                monto_cobrado_daño_total: devolucionData.monto_cobrado_daño_total,
                observaciones: devolucionData.observaciones,
                detalles: devolucionData.detalles.map((d) => ({
                    prestamo_cliente_detalle_id: d.prestamo_cliente_detalle_id,
                    cantidad_devuelta: Math.max(0, Number(d.cantidad_devuelta || 0) - Number(d.cantidad_dañada_total || 0)),
                    cantidad_dañada_parcial: 0,
                    cantidad_dañada_total: Number(d.cantidad_dañada_total || 0),
                })),
            };

            await prestamoClienteService.registrarDevolucion(prestamo.id, payload as any);
            toastSuccess('✅ Devolución registrada exitosamente');

            // Redirigir al listado después de 1 segundo
            setTimeout(() => {
                window.location.href = '/prestamos/clientes';
            }, 1000);
        } catch (error: any) {
            const mensajeError = error?.message || 'Error al registrar devolución';
            toastError(`❌ ${mensajeError}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">Cargando información...</p>
                </div>
            </AppLayout>
        );
    }

    if (!prestamo) {
        return (
            <AppLayout>
                <div className="p-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error || 'No se pudo cargar el préstamo'}</span>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const detalles = prestamo.detalles || [];

    return (
        <AppLayout>
            <Head title="Registrar Devolución - Cliente" />

            <div className="space-y-6 p-6">
                {/* Encabezado */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Registrar Devolución
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {prestamo.cliente?.nombre || prestamo.cliente?.razon_social}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Información del Préstamo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card className="p-1">
                        <CardHeader>
                            <CardTitle className="text-xs">Número de Préstamo</CardTitle>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                #{prestamo.id}
                            </p>
                        </CardHeader>
                    </Card>
                    <Card className="p-1">
                        <CardHeader>
                            <CardTitle className="text-xs">Cliente</CardTitle>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {prestamo.cliente?.nombre || prestamo.cliente?.razon_social}
                            </p>
                        </CardHeader>
                    </Card>
                    <Card className="p-1">
                        <CardHeader >
                            <CardTitle className="text-xs">Garantía</CardTitle>
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                Bs {Number(prestamo.monto_garantia || 0).toFixed(2)}
                            </p>
                        </CardHeader>
                    </Card>
                </div>

                {/* Formulario de Devoluciones */}
                <form onSubmit={handleRegistrarDevolucion} className="space-y-6">
                    {/* Campos de Devolución */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Devolución</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* Monto a Pagar */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        💰 Monto Total a Pagar por Daños
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={devolucionData.monto_cobrado_daño_total}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                                    />
                                </div>

                                {/* Fecha Devolución */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Fecha Devolución *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={devolucionData.fecha_devolucion}
                                        onChange={(e) =>
                                            setDevolucionData({
                                                ...devolucionData,
                                                fecha_devolucion: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Observaciones */}
                                <div>
                                    <label className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Observaciones
                                    </label>
                                    <textarea
                                        value={devolucionData.observaciones}
                                        onChange={(e) =>
                                            setDevolucionData({
                                                ...devolucionData,
                                                observaciones: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Tabla de Devoluciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de Devolución</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                                            <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">📦 Prestable</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📏 Capacidad</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">🏷️ Tipo</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📤 Prestado</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">✏️ Devolviendo</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">⚫ Dev. Dañado</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">💸 Daño unit.</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">🧮 Subtotal daño</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detalles.map((detalle: any) => {
                                            const detalleAct = devolucionData.detalles.find(d => d.prestamo_cliente_detalle_id === detalle.id);
                                            const montoDanioUnitario = obtenerMontoDanioTotal(detalle);
                                            const montoDanioFila = Number(detalleAct?.cantidad_dañada_total || 0) * montoDanioUnitario;

                                            return (
                                                <tr key={detalle.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">
                                                        {detalle.prestable?.nombre}
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                                                        {detalle.prestable?.capacidad || '—'}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                            {detalle.prestable?.tipo || '—'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                                                        {detalle.cantidad_prestada}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={detalle.cantidad_prestada}
                                                            value={detalleAct?.cantidad_devuelta || ''}
                                                            placeholder="0"
                                                            onChange={(e) => {
                                                                const cantidad = e.target.value === '' ? 0 : Number(e.target.value);
                                                                console.log(`📝 Escribiendo ${cantidad} en ${detalle.prestable?.nombre}`);
                                                                console.log(`  Tipo: ${detalle.prestable?.tipo}, prestable_relacionado_id: ${detalle.prestable?.prestable_relacionado_id}`);

                                                                let detallesActualizados = devolucionData.detalles.map(d =>
                                                                    d.prestamo_cliente_detalle_id === detalle.id
                                                                        ? { ...d, cantidad_devuelta: cantidad }
                                                                        : d
                                                                );

                                                                // Si es CANASTILLA, actualizar el embase relacionado automáticamente
                                                                if (detalle.prestable?.tipo === 'CANASTILLA') {
                                                                    const capacidadCanastilla = detalle.prestable?.capacidad || 0;
                                                                    console.log(`  ✅ Es CANASTILLA con capacidad: ${capacidadCanastilla}`);

                                                                    // Buscar el embase relacionado (donde prestable_relacionado_id = esta canastilla)
                                                                    const detalleEmbase = prestamo?.detalles?.find((d: any) =>
                                                                        d.prestable?.prestable_relacionado_id === detalle.prestable_id
                                                                    );
                                                                    console.log(`  Embase encontrado:`, detalleEmbase ? `${detalleEmbase.prestable?.nombre}` : 'NO');

                                                                    if (detalleEmbase) {
                                                                        const cantidadEmbases = cantidad * capacidadCanastilla;
                                                                        console.log(`  📊 Cálculo: ${cantidad} canastillas × ${capacidadCanastilla} = ${cantidadEmbases} embases`);
                                                                        detallesActualizados = detallesActualizados.map(d =>
                                                                            d.prestamo_cliente_detalle_id === detalleEmbase.id
                                                                                ? { ...d, cantidad_devuelta: cantidadEmbases }
                                                                                : d
                                                                        );
                                                                    } else {
                                                                        console.log(`  ❌ Embase no encontrado en detalles`);
                                                                    }
                                                                } else {
                                                                    console.log(`  ❌ No es CANASTILLA`);
                                                                }

                                                                setDevolucionData({
                                                                    ...devolucionData,
                                                                    detalles: detallesActualizados,
                                                                });
                                                            }}
                                                            className="w-full px-2 py-1 border border-blue-400 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={detalleAct?.cantidad_devuelta || 0}
                                                            value={detalleAct?.cantidad_dañada_total || 0}
                                                            onChange={(e) => {
                                                                setDevolucionData({
                                                                    ...devolucionData,
                                                                    detalles: devolucionData.detalles.map(d =>
                                                                        d.prestamo_cliente_detalle_id === detalle.id
                                                                            ? { ...d, cantidad_dañada_total: Number(e.target.value) }
                                                                            : d
                                                                    ),
                                                                });
                                                            }}
                                                            className="w-full px-2 py-1 border border-red-400 dark:border-red-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-blue-700 dark:text-blue-300 font-semibold">
                                                        Bs {montoDanioUnitario.toFixed(2)}
                                                    </td>
                                                    <td className="px-3 py-2 text-center text-red-700 dark:text-red-300 font-semibold">
                                                        Bs {montoDanioFila.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Botones */}
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {submitting ? 'Registrando...' : 'Registrar Devolución'}
                        </Button>
                    </div>
                </form>

                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </div>
        </AppLayout>
    );
}

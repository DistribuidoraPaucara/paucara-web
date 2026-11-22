import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { ExternalLink, Package, RotateCcw, CalendarClock } from 'lucide-react';

interface Producto {
    id: number;
    nombre: string;
    sku?: string | null;
    unidad?: string | null;
}

interface StockAlmacen {
    almacen?: string | null;
    cantidad: number;
    disponible: number;
    reservada: number;
}

interface Reserva {
    id: number;
    estado: string;
    cantidad_reservada: number;
    fecha_reserva?: string | null;
    fecha_expiracion?: string | null;
    proforma_id?: number | null;
    proforma_numero?: string | null;
    cliente_nombre?: string | null;
    venta_id?: number | null;
    venta_numero?: string | null;
    almacen?: string | null;
}

interface Paginado<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number | null;
    to: number | null;
    current_page: number;
    last_page: number;
}

interface Props {
    producto: Producto;
    stock: StockAlmacen[];
    activas: Reserva[];
    historial: Paginado<Reserva>;
    busqueda: string;
}

const fecha = (valor?: string | null) => (valor ? new Date(valor).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' }) : '-');

const badgeEstado = (estado: string) => {
    switch (estado) {
        case 'ACTIVA':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200';
        case 'CONSUMIDA':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
        case 'LIBERADA':
            return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        default:
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
    }
};

export default function ReservasProducto({ producto, stock, activas, historial, busqueda: busquedaInicial }: Props) {
    const { can } = useAuth();
    const [busqueda, setBusqueda] = useState(busquedaInicial ?? '');

    // Búsqueda del historial: solo recarga el historial, en la página 1
    const buscarHistorial = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            window.location.pathname,
            busqueda.trim() ? { busqueda: busqueda.trim() } : {},
            { preserveState: true, preserveScroll: true, replace: true, only: ['historial', 'busqueda'] },
        );
    };
    const puedeLiberar = can('inventario.reservas.liberar');
    const puedeExtender = can('inventario.reservas.extender');

    const totales = stock.reduce(
        (acc, s) => ({
            cantidad: acc.cantidad + s.cantidad,
            disponible: acc.disponible + s.disponible,
            reservada: acc.reservada + s.reservada,
        }),
        { cantidad: 0, disponible: 0, reservada: 0 },
    );

    const liberar = async (reserva: Reserva) => {
        const confirmado = await NotificationService.confirm(
            `¿Liberar ${reserva.cantidad_reservada} unidades de la proforma ${reserva.proforma_numero ?? ''}? El stock volverá a estar disponible.`,
            { confirmText: 'Liberar', cancelText: 'Cancelar' },
        );
        if (!confirmado) return;
        router.post(`/inventario/reservas/${reserva.id}/liberar`, {}, { preserveScroll: true });
    };

    const extender = (reserva: Reserva) => {
        router.post(`/inventario/reservas/${reserva.id}/extender`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title={`Reservas · ${producto.nombre}`} />

            <div className="space-y-4 p-2">
                {/* Encabezado del producto */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Package className="h-6 w-6 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{producto.nombre}</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {producto.sku ? `SKU ${producto.sku}` : `ID ${producto.id}`}
                                {producto.unidad ? ` · ${producto.unidad}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`/productos/${producto.id}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-800"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Editar producto
                        </a>
                        <Link href="/reservas" className="rounded-md px-3 py-1.5 text-sm text-blue-600 hover:underline dark:text-blue-400">
                            ← Volver a reservas
                        </Link>
                    </div>
                </div>

                {/* Resumen de stock */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-xs uppercase text-gray-500">Stock total</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{totales.cantidad}</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                        <p className="text-xs uppercase text-emerald-700 dark:text-emerald-300">Disponible</p>
                        <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">{totales.disponible}</p>
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                        <p className="text-xs uppercase text-blue-700 dark:text-blue-300">Reservado</p>
                        <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{totales.reservada}</p>
                    </div>
                </div>

                {stock.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Almacén</th>
                                    <th className="px-3 py-2 text-center text-xs uppercase text-gray-500">Total</th>
                                    <th className="px-3 py-2 text-center text-xs uppercase text-gray-500">Disponible</th>
                                    <th className="px-3 py-2 text-center text-xs uppercase text-gray-500">Reservado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {stock.map((s, i) => (
                                    <tr key={i}>
                                        <td className="px-3 py-2 text-gray-900 dark:text-white">{s.almacen ?? '-'}</td>
                                        <td className="px-3 py-2 text-center">{s.cantidad}</td>
                                        <td className="px-3 py-2 text-center">{s.disponible}</td>
                                        <td className="px-3 py-2 text-center">{s.reservada}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Reservas activas */}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reservas activas ({activas.length})</h2>
                    {activas.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Este producto no tiene reservas activas.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-zinc-800">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Proforma</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Cliente</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Almacén</th>
                                        <th className="px-3 py-2 text-center text-xs uppercase text-gray-500">Cantidad</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Reservada</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Vence</th>
                                        <th className="px-3 py-2 text-right text-xs uppercase text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                    {activas.map((r) => {
                                        const vencida = r.fecha_expiracion ? new Date(r.fecha_expiracion).getTime() < Date.now() : false;
                                        return (
                                            <tr key={r.id}>
                                                <td className="px-3 py-2">
                                                    {r.proforma_id ? (
                                                        <Link href={`/proformas/${r.proforma_id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                                                            {r.proforma_numero ?? `#${r.proforma_id}`}
                                                        </Link>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">{r.cliente_nombre ?? '-'}</td>
                                                <td className="px-3 py-2">{r.almacen ?? '-'}</td>
                                                <td className="px-3 py-2 text-center font-semibold">{r.cantidad_reservada}</td>
                                                <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{fecha(r.fecha_reserva)}</td>
                                                <td className={`px-3 py-2 text-xs ${vencida ? 'font-semibold text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                                    {fecha(r.fecha_expiracion)}
                                                    {vencida && ' · vencida'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex justify-end gap-2">
                                                        {puedeExtender && (
                                                            <button
                                                                type="button"
                                                                onClick={() => extender(r)}
                                                                className="inline-flex items-center gap-1 rounded-md border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20"
                                                            >
                                                                <CalendarClock className="h-3.5 w-3.5" />
                                                                Extender 7 días
                                                            </button>
                                                        )}
                                                        {puedeLiberar && (
                                                            <button
                                                                type="button"
                                                                onClick={() => liberar(r)}
                                                                className="inline-flex items-center gap-1 rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                                                            >
                                                                <RotateCcw className="h-3.5 w-3.5" />
                                                                Liberar
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Historial */}
                <section className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Historial ({historial.total})</h2>
                        <form onSubmit={buscarHistorial} className="flex gap-2">
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar proforma, cliente, venta o ID de venta…"
                                className="w-72 rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                            />
                            <button type="submit" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
                                Buscar
                            </button>
                        </form>
                    </div>
                    {historial.data.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sin movimientos anteriores.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-700">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-zinc-800">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Estado</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Proforma</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Cliente</th>
                                        <th className="px-3 py-2 text-center text-xs uppercase text-gray-500">Cantidad</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Reservada</th>
                                        <th className="px-3 py-2 text-left text-xs uppercase text-gray-500">Venta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                    {historial.data.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-3 py-2">
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeEstado(r.estado)}`}>{r.estado}</span>
                                            </td>
                                            <td className="px-3 py-2">{r.proforma_numero ?? (r.proforma_id ? `#${r.proforma_id}` : '-')}</td>
                                            <td className="px-3 py-2">{r.cliente_nombre ?? '-'}</td>
                                            <td className="px-3 py-2 text-center">{r.cantidad_reservada}</td>
                                            <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{fecha(r.fecha_reserva)}</td>
                                            <td className="px-3 py-2">
                                                {r.venta_id ? (
                                                    <Link href={`/ventas/${r.venta_id}`} className="font-medium text-emerald-700 hover:underline dark:text-emerald-300">
                                                        #{r.venta_id} {r.venta_numero ? `· ${r.venta_numero}` : ''}
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {historial.last_page > 1 && (
                        <div className="flex items-center justify-between pt-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                {historial.from}–{historial.to} de {historial.total}
                            </span>
                            <div className="flex gap-1">
                                {historial.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            only={['historial', 'busqueda']}
                                            className={`rounded-md px-3 py-1 ${
                                                link.active ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-800'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="rounded-md px-3 py-1 text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}

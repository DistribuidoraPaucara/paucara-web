import AppLayout from '@/layouts/app-layout';
import RegistrarPagoModal from '@/presentation/components/clientes/RegistrarPagoModal';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, CreditCard, FileText, Printer, XCircle } from 'lucide-react';
import { useState } from 'react';

// Detalle de una cuenta por cobrar (crédito): datos, saldo, cobros realizados y productos de la venta.

interface PagoDetalle {
    id: number;
    monto: number | string;
    fecha_pago: string;
    estado?: string | null;
    observaciones?: string | null;
    tipo_pago?: { nombre?: string | null } | null;
    usuario?: { name?: string | null } | null;
}

interface DetalleVenta {
    id: number;
    cantidad: number | string;
    precio_unitario: number | string;
    descuento?: number | string | null;
    subtotal: number | string;
    producto?: { nombre?: string | null; sku?: string | null } | null;
}

interface CuentaDetalle {
    id: number;
    estado: string;
    monto_original: number | string;
    monto_pagado?: number | string | null;
    saldo_pendiente: number | string;
    fecha_vencimiento: string;
    created_at?: string | null;
    referencia_documento?: string | null;
    observaciones?: string | null;
    dias_vencido?: number | null;
    cliente?: { id: number; nombre: string; codigo_cliente?: string | null; telefono?: string | null } | null;
    venta?: {
        id: number;
        numero?: string | null;
        cliente?: { id: number; nombre: string } | null;
        detalles?: DetalleVenta[];
    } | null;
    pagos?: PagoDetalle[];
}

interface TipoPagoOpcion {
    id: number;
    nombre: string;
    codigo: string;
}

interface Props {
    cuenta: CuentaDetalle;
    tipos_pago?: TipoPagoOpcion[];
}

const numero = (valor: number | string | null | undefined) => Number(valor ?? 0);

const formatoMoneda = (valor: number | string | null | undefined) =>
    new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(numero(valor));

const formatoFecha = (fecha?: string | null) => (fecha ? new Date(fecha).toLocaleDateString('es-BO') : '—');

const estadoClases: Record<string, string> = {
    PENDIENTE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    PARCIAL: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
    PAGADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    ANULADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
};

export default function CuentaPorCobrarShow({ cuenta, tipos_pago = [] }: Props) {
    const [mostrarModalPago, setMostrarModalPago] = useState(false);

    const estado = (cuenta.estado || '').toUpperCase();
    const saldo = numero(cuenta.saldo_pendiente);
    const puedeAbonar = estado !== 'PAGADO' && estado !== 'ANULADO' && saldo > 0;

    // Formato que espera el modal de pago (mismo que usa la lista)
    const cuentaParaPago = {
        id: cuenta.id,
        venta_id: cuenta.venta?.id,
        numero_venta: cuenta.venta?.numero ?? undefined,
        referencia_documento: cuenta.referencia_documento ?? undefined,
        monto_original: numero(cuenta.monto_original),
        saldo_pendiente: saldo,
        fecha_vencimiento: cuenta.fecha_vencimiento,
        dias_vencido: cuenta.dias_vencido ?? 0,
        estado: cuenta.estado,
    };
    const montoOriginal = numero(cuenta.monto_original);
    const pagado = cuenta.monto_pagado !== undefined && cuenta.monto_pagado !== null ? numero(cuenta.monto_pagado) : montoOriginal - saldo;
    const progreso = montoOriginal > 0 ? Math.min(100, Math.max(0, (pagado / montoOriginal) * 100)) : 0;

    const diasVencido = cuenta.dias_vencido ?? 0;
    const vencida = estado !== 'PAGADO' && estado !== 'ANULADO' && saldo > 0 && diasVencido > 0;
    const clienteNombre = cuenta.cliente?.nombre ?? cuenta.venta?.cliente?.nombre ?? 'Sin cliente';
    const clienteTelefono = cuenta.cliente?.telefono ?? null;
    const detalles = cuenta.venta?.detalles ?? [];
    const pagos = cuenta.pagos ?? [];

    const tarjetas = [
        { titulo: 'Monto original', valor: formatoMoneda(montoOriginal), clase: 'text-gray-900 dark:text-white' },
        { titulo: 'Pagado', valor: formatoMoneda(pagado), clase: 'text-green-700 dark:text-green-400' },
        { titulo: 'Saldo pendiente', valor: formatoMoneda(saldo), clase: 'text-red-700 dark:text-red-400' },
        { titulo: 'Vencimiento', valor: formatoFecha(cuenta.fecha_vencimiento), clase: 'text-gray-900 dark:text-white' },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Ventas', href: '/ventas' },
                { title: 'Cuentas por Cobrar', href: '/ventas/cuentas-por-cobrar' },
                { title: `Cuenta #${cuenta.id}`, href: `/ventas/cuentas-por-cobrar/${cuenta.id}/show` },
            ]}
        >
            <Head title={`Cuenta #${cuenta.id}`} />

            <div className="space-y-4 p-4">
                {/* Cabecera */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Cuenta por cobrar #{cuenta.id}</h1>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${estadoClases[estado] ?? estadoClases.PENDIENTE}`}>
                                {estado || 'PENDIENTE'}
                            </span>
                            {vencida && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                    <AlertTriangle className="h-3.5 w-3.5" />
                                    Vencida hace {diasVencido} {diasVencido === 1 ? 'día' : 'días'}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {clienteNombre}
                            {cuenta.venta && (
                                <>
                                    {' · '}
                                    <button
                                        type="button"
                                        onClick={() => router.visit(`/ventas/${cuenta.venta?.id}`)}
                                        className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
                                    >
                                        Venta {cuenta.venta.numero ?? `#${cuenta.venta.id}`}
                                    </button>
                                </>
                            )}
                            {cuenta.referencia_documento && <> · Ref. {cuenta.referencia_documento}</>}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {puedeAbonar && (
                            <Button onClick={() => setMostrarModalPago(true)} className="bg-green-600 text-white hover:bg-green-700">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Abonar 💵
                            </Button>
                        )}
                        {/* <Button variant="outline" onClick={() => router.visit('/ventas/cuentas-por-cobrar')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button> */}
                        <Button variant="outline" onClick={() => window.open(`/ventas/cuentas-por-cobrar/${cuenta.id}/imprimir`, '_blank')}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </Button>
                    </div>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {tarjetas.map((t) => (
                        <div key={t.titulo} className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{t.titulo}</p>
                            <p className={`mt-1 text-lg font-bold ${t.clase}`}>{t.valor}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avance de cobro</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{progreso.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div className="h-full bg-green-500" style={{ width: `${progreso}%` }} />
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                        <p className="text-gray-600 dark:text-gray-400">
                            Cliente: <span className="font-medium text-gray-900 dark:text-white">{clienteNombre}</span>
                            {cuenta.cliente?.codigo_cliente && <span className="text-gray-500"> ({cuenta.cliente.codigo_cliente})</span>}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            Teléfono: <span className="font-medium text-gray-900 dark:text-white">{clienteTelefono || '—'}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            Creada: <span className="font-medium text-gray-900 dark:text-white">{formatoFecha(cuenta.created_at)}</span>
                        </p>
                    </div>
                    {cuenta.observaciones && (
                        <p className="mt-3 rounded-md bg-gray-50 p-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">{cuenta.observaciones}</p>
                    )}
                </div>

                {/* Cobros */}
                <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Cobros ({pagos.length})</h2>
                    </div>
                    {pagos.length === 0 ? (
                        <p className="flex items-center gap-2 px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            Aún no hay cobros registrados.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Fecha</th>
                                        <th className="px-3 py-2 text-left">Tipo de pago</th>
                                        <th className="px-3 py-2 text-left">Registró</th>
                                        <th className="px-3 py-2 text-right">Monto</th>
                                        <th className="px-3 py-2 text-center">Estado</th>
                                        <th className="px-3 py-2 text-left">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {pagos.map((pago) => {
                                        const anulado = (pago.estado || '').toUpperCase() === 'ANULADO';
                                        return (
                                            <tr key={pago.id} className={anulado ? 'opacity-60' : ''}>
                                                <td className="px-3 py-2">{formatoFecha(pago.fecha_pago)}</td>
                                                <td className="px-3 py-2">{pago.tipo_pago?.nombre || 'Sin tipo'}</td>
                                                <td className="px-3 py-2">{pago.usuario?.name || '—'}</td>
                                                <td className={`px-3 py-2 text-right font-medium ${anulado ? 'line-through' : ''}`}>{formatoMoneda(pago.monto)}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <Badge variant={anulado ? 'destructive' : 'default'}>{pago.estado || 'CONFIRMADO'}</Badge>
                                                </td>
                                                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{pago.observaciones || '—'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Productos de la venta */}
                {cuenta.venta && (
                    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Productos de la venta</h2>
                        </div>
                        {detalles.length === 0 ? (
                            <p className="flex items-center gap-2 px-4 py-6 text-sm text-gray-500 dark:text-gray-400">
                                <XCircle className="h-4 w-4" />
                                La venta no tiene productos registrados.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                        <tr>
                                            <th className="px-3 py-2 text-center">Cant.</th>
                                            <th className="px-3 py-2 text-left">SKU</th>
                                            <th className="px-3 py-2 text-left">Producto</th>
                                            <th className="px-3 py-2 text-right">P. unitario</th>
                                            <th className="px-3 py-2 text-right">Descuento</th>
                                            <th className="px-3 py-2 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {detalles.map((d) => (
                                            <tr key={d.id}>
                                                <td className="px-3 py-2 text-center">{numero(d.cantidad)}</td>
                                                <td className="px-3 py-2">{d.producto?.sku ?? '—'}</td>
                                                <td className="px-3 py-2">{d.producto?.nombre ?? 'Producto eliminado'}</td>
                                                <td className="px-3 py-2 text-right">{formatoMoneda(d.precio_unitario)}</td>
                                                <td className="px-3 py-2 text-right">{formatoMoneda(d.descuento)}</td>
                                                <td className="px-3 py-2 text-right font-medium">{formatoMoneda(d.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <RegistrarPagoModal
                show={mostrarModalPago}
                onHide={() => setMostrarModalPago(false)}
                clienteId={cuenta.cliente?.id ?? cuenta.venta?.cliente?.id ?? 0}
                cuentaPorCobrar={cuentaParaPago}
                onPagoRegistrado={() => router.reload({ only: ['cuenta'] })}
                tipo="ventas"
                tipos_pago={tipos_pago}
            />
        </AppLayout>
    );
}

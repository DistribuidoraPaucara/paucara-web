import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatCurrencyWith2Decimals } from '@/lib/utils';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User, Edit, AlertCircle, Printer } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/application/hooks/use-auth';
import { toast } from 'react-toastify';
import type { VentaShow, EstadoDocumento } from '@/domain/entities/ventas';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import AnularVentaModal from '@/presentation/components/ventas/AnularVentaModal';
import ConfirmacionEntregaModal from '@/presentation/components/ventas/confirmacion-entrega-modal';

interface PageProps extends InertiaPageProps {
    venta: VentaShow;
}

export default function VentaShow() {
    const { venta } = usePage<PageProps>().props;
    const { can } = useAuth();
    const [imagenCargada, setImagenCargada] = useState(true);
    const [anularModal, setAnularModal] = useState<{ isOpen: boolean }>({ isOpen: false });
    const [isAnulando, setIsAnulando] = useState(false);
    const [outputModal, setOutputModal] = useState(false);
    // ✅ NUEVO: Estado para modal de confirmación de entrega
    const [confirmacionEntregaModal, setConfirmacionEntregaModal] = useState<{ isOpen: boolean }>({ isOpen: false });

    // Verificar si la venta está APROBADA
    const esAprobada = venta.estado_documento?.nombre?.toLowerCase() === 'aprobada' || venta.estado_documento?.codigo === 'APROBADO';

    const handleAnularVenta = async (motivo?: string) => {
        setIsAnulando(true);
        try {
            const response = await fetch(`/ventas/${venta.id}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Error al anular la venta');
                return;
            }

            toast.success('Venta anulada exitosamente');
            setAnularModal({ isOpen: false });

            // Recargar la página
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Error al anular venta:', error);
            toast.error('Error al anular la venta');
        } finally {
            setIsAnulando(false);
        }
    };

    // Debug: Verificar datos que llegan
    console.log('🚀 VentaShow - Props recibidos:', venta);
    console.log('🔍 VentaShow - Venta cargada:', venta.numero);
    console.log('📦 TODOS LOS DATOS DE LA VENTA:', JSON.stringify(venta, null, 2));
    console.log('  requiere_envio:', venta.requiere_envio, '(tipo:', typeof venta.requiere_envio + ')');
    console.log('  estado_logistico:', venta.estado_logistico);
    console.log('  canal_origen:', venta.canal_origen);
    console.log('  ⏳ estado_pago:', venta.estado_pago);
    console.log('  💳 politica_pago:', venta.politica_pago);

    const getEstadoColor = (estado: EstadoDocumento) => {
        switch (estado.nombre.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'completada':
            case 'pagada':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'cancelada':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'facturada':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getCuentaEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'pagada':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'vencida':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Ventas', href: '/ventas' },
            { title: `Venta ${venta.numero}`, href: '#' }
        ]}>
            <Head title={`Venta ${venta.numero}`} />

            <div className="flex items-center justify-between mb-2 px-6 pt-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Venta {venta.numero}
                </h1>
                <div className="flex space-x-3">
                    {/* Botón de Impresión/Exportación */}
                    <button
                        onClick={() => setOutputModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                        title="Exportar/Imprimir documento"
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                    </button>

                    {/* Botón Editar - Solo si NO está aprobada */}
                    {can('ventas.update') && !esAprobada && (
                        <Link
                            href={`/ventas/${venta.id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Link>
                    )}

                    {/* Botón Anular - Solo si está aprobada */}
                    {can('ventas.update') && esAprobada && (
                        <button
                            onClick={() => setAnularModal({ isOpen: true })}
                            disabled={isAnulando}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                        >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {isAnulando ? 'Anulando...' : 'Anular'}
                        </button>
                    )}

                    {/* Botón Crear Devolución - Solo si está APROBADO */}
                    {esAprobada && (
                        <Link
                            href={`/ventas/${venta.id}/devoluciones/create`}
                            className="inline-flex items-center px-4 py-2 bg-orange-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                        >
                            ↩️ Devolución
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6">
                {/* Información principal */}
                <div className="space-y-6">
                    {/* Información de la venta + Cliente */}
                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-3">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Título */}
                            <div className="flex items-center">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Información de la venta
                                </h2>
                            </div>
                            {/* Datos secundarios - Card unificado */}
                            <div className="col-span-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-4 border border-slate-200 dark:border-zinc-700">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30">
                                                <span className="text-lg">👤</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Vendedor</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{venta.usuario.name}</p>
                                        </div>
                                    </div>

                                    {/* Creada */}
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                                <span className="text-lg">📅</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Creada</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {new Date(venta.created_at).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actualizado */}
                                    {/* <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30">
                                                <span className="text-lg">🔄</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Actualizado</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {new Date(venta.updated_at).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div> */}
                                    {/* Estado */}
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            {/* estado */}
                                            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${esAprobada
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : 'bg-orange-100 dark:bg-orange-900/30'
                                                }`}>
                                                <span className="text-lg">{esAprobada ? '✅' : '🛑'}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Estado</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {venta.estado_documento.nombre}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Foto y datos del cliente + Tipo de Pago y Entrega + Proforma */}
                        <div className="mb-2 pb-2 border-b border-gray-200 dark:border-zinc-700">
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase mb-2">Cliente</h3>
                            <div className={`grid gap-6 ${venta.proforma ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                {/* Columna 1: Foto y datos del cliente */}
                                <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-1 border border-gray-200 dark:border-zinc-700">
                                    <div className="flex gap-2">
                                        {/* Foto de perfil */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-zinc-700 flex items-center justify-center bg-gray-100 dark:bg-zinc-700">
                                                {venta.cliente.foto_perfil && typeof venta.cliente.foto_perfil === 'string' && imagenCargada ? (
                                                    <img
                                                        src={venta.cliente.foto_perfil as string}
                                                        alt={venta.cliente.nombre}
                                                        className="w-full h-full object-cover"
                                                        onError={() => setImagenCargada(false)}
                                                    />
                                                ) : (
                                                    <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Datos del cliente */}
                                        <div className="flex-1 space-y-1">
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nombre</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {venta.cliente.nombre}
                                                </p>
                                            </div>

                                            {venta.cliente.nit && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">NIT</p>
                                                    <p className="text-xs text-gray-900 dark:text-white">{venta.cliente.nit}</p>
                                                </div>
                                            )}

                                            {venta.cliente.telefono && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tel.</p>
                                                    <p className="text-xs text-gray-900 dark:text-white">{venta.cliente.telefono}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Columna 2: Tipo de Pago */}
                                {venta.tipo_pago && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                                        <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 uppercase mb-2">💳 Tipo de Pago</label>
                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{venta.tipo_pago.nombre}</p>
                                    </div>
                                )}

                                {/* Columna 3: Tipo de Entrega */}
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
                                    <label className="block text-xs font-bold text-orange-900 dark:text-orange-200 uppercase mb-2">🚚 Tipo de Entrega</label>
                                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                        {venta.requiere_envio ? 'Envío a Domicilio' : 'Retiro en Local'}
                                    </p>
                                </div>

                                {/* Columna 4: Proforma (si existe) */}
                                {venta.proforma && (
                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                                        <label className="block text-xs font-bold text-purple-900 dark:text-purple-200 uppercase mb-2">📋 Proforma</label>
                                        <Link
                                            href={`/proformas/${venta.proforma.id}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
                                        >
                                            Folio: {venta.proforma.id}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Productos + Resumen */}
                    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Productos ({venta.detalles.length})
                        </h2>

                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                                <thead className="bg-gray-50 dark:bg-zinc-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Código
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Códigos Barra
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Marca
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Unidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Precio unit.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700">
                                    {venta.detalles.map((detalle) => {
                                        // ✅ NUEVO: Detectar si es combo y tiene items
                                        const esCombo = (detalle.producto as any)?.es_combo === true;
                                        const comboItems = detalle.combo_items_seleccionados || [];
                                        const codigosBarraStr = (detalle.producto as any).codigos_barra && (detalle.producto as any).codigos_barra.length > 0
                                            ? (detalle.producto as any).codigos_barra.map((cb: any) => `${cb.codigo}${cb.es_principal ? ' ★' : ''}`).join(', ')
                                            : '-';

                                        return (
                                            <>
                                                <tr key={detalle.id}>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {esCombo && <span className="mr-2">📦</span>}
                                                            {detalle.producto.nombre}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                        {(detalle.producto as any).sku || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                        <code className="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">
                                                            {codigosBarraStr}
                                                        </code>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                        {(detalle.producto as any).marca?.nombre || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                        {(detalle.producto as any).unidad
                                                            ? `${(detalle.producto as any).unidad.nombre}`
                                                            : '-'
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(detalle.cantidad)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(detalle.precio_unitario, venta.moneda.codigo)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(detalle.subtotal, venta.moneda.codigo)}
                                                    </td>
                                                </tr>

                                                {/* ✅ NUEVO: Mostrar items del combo si existen */}
                                                {esCombo && comboItems.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-50 dark:bg-zinc-800">
                                                            <td colSpan={8} className="px-6 py-3">
                                                                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                                                    Componentes del combo ({comboItems.length})
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {comboItems.map((item: any, idx: number) => {
                                                            const cantidadTotal = (item.cantidad || 0) * (detalle.cantidad || 1);
                                                            return (
                                                                <tr key={`${detalle.id}-item-${idx}`} className="bg-gray-50 dark:bg-zinc-800">
                                                                    <td className="px-6 py-3 pl-12 text-sm text-gray-700 dark:text-gray-300">
                                                                        {item.producto ? (
                                                                            <>
                                                                                <span className="mr-2">└─</span>
                                                                                <span className="font-medium">{item.producto.nombre}</span>
                                                                            </>
                                                                        ) : (
                                                                            <>└─ Producto #{item.producto_id}</>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                                        {item.producto?.sku || '-'}
                                                                    </td>
                                                                    <td colSpan={3}></td>
                                                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                                        {formatCurrencyWith2Decimals(cantidadTotal)}
                                                                    </td>
                                                                    <td colSpan={2} className="px-6 py-3 text-xs text-gray-500 dark:text-gray-400">
                                                                        (cantidad base: {item.cantidad})
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Resumen Financiero */}
                        <div className="border-t border-gray-200 dark:border-zinc-700 pt-6">
                            <div className="space-y-3">
                                {/* Subtotal */}
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {formatCurrencyWith2Decimals(venta.subtotal, venta.moneda.codigo)}
                                    </span>
                                </div>

                                {/* Descuento */}
                                {venta.descuento > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Descuento</span>
                                        <span className="text-red-600 dark:text-red-400">
                                            -{formatCurrencyWith2Decimals(venta.descuento, venta.moneda.codigo)}
                                        </span>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="border-t border-gray-200 dark:border-zinc-700 pt-3 mb-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {formatCurrencyWith2Decimals(venta.total, venta.moneda.codigo)}
                                        </span>
                                    </div>
                                </div>

                                {/* Detalles de Pagos - Tipo y Monto */}
                                {venta.detalles_pago_venta && venta.detalles_pago_venta.length > 0 && (
                                    <div className="space-y-2 py-3 border-t border-gray-200 dark:border-zinc-700">
                                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Pagos:</div>
                                        {venta.detalles_pago_venta.map((detalle) => (
                                            <div key={detalle.id} className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">{detalle.tipo_pago?.nombre || '-'}</span>
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    {formatCurrencyWith2Decimals(detalle.monto, venta.moneda.codigo)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Monto Pagado */}
                                {venta.monto_pagado !== null && venta.monto_pagado > 0 && (
                                    <div className="flex justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                        <span className="font-medium text-green-700 dark:text-green-400">Monto Pagado</span>
                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                            +{formatCurrencyWith2Decimals(venta.monto_pagado, venta.moneda.codigo)}
                                        </span>
                                    </div>
                                )}

                                {/* Saldo Pendiente */}
                                {venta.monto_pagado !== null && (
                                    <div className={`flex justify-between p-3 rounded font-semibold ${(venta.total - venta.monto_pagado) > 0
                                        ? 'bg-red-50 dark:bg-red-900/20'
                                        : 'bg-green-50 dark:bg-green-900/20'
                                        }`}>
                                        <span className={`${(venta.total - venta.monto_pagado) > 0
                                            ? 'text-red-700 dark:text-red-400'
                                            : 'text-green-700 dark:text-green-400'
                                            }`}>
                                            Saldo Pendiente
                                        </span>
                                        <span className={`${(venta.total - venta.monto_pagado) > 0
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-green-600 dark:text-green-400'
                                            }`}>
                                            {formatCurrencyWith2Decimals(Math.max(0, venta.total - venta.monto_pagado), venta.moneda.codigo)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

{/* Pagos si existen */}
                    {venta.pagos && venta.pagos.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Pagos ({venta.pagos.length})
                            </h2>

                            <div className="space-y-4">
                                {venta.pagos.map((pago) => (
                                    <div key={pago.id} className="border border-gray-200 dark:border-zinc-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {pago.tipo_pago.nombre}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(pago.fecha).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                                {pago.numero_comprobante && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        Comprobante: {pago.numero_comprobante}
                                                    </p>
                                                )}
                                                {pago.observaciones && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {pago.observaciones}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                    {formatCurrencyWith2Decimals(pago.monto, venta.moneda.codigo)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cuenta por cobrar si existe */}
                    {venta.cuenta_por_cobrar && (
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Cuenta por cobrar
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Monto</span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {formatCurrencyWith2Decimals(venta.cuenta_por_cobrar.monto, venta.moneda.codigo)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Saldo</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrencyWith2Decimals(venta.cuenta_por_cobrar.saldo, venta.moneda.codigo)}
                                    </span>
                                </div>

                                {venta.cuenta_por_cobrar.fecha_vencimiento && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Vencimiento</span>
                                        <span className="text-sm text-gray-900 dark:text-white">
                                            {new Date(venta.cuenta_por_cobrar.fecha_vencimiento).toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCuentaEstadoColor(venta.cuenta_por_cobrar.estado)}`}>
                                        {venta.cuenta_por_cobrar.estado}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de anulación */}
            <AnularVentaModal
                isOpen={anularModal.isOpen}
                onClose={() => setAnularModal({ isOpen: false })}
                ventaNumero={venta.numero}
                onConfirm={handleAnularVenta}
                isLoading={isAnulando}
            />

            {/* Modal de exportación/impresión */}
            <OutputSelectionModal
                isOpen={outputModal}
                onClose={() => setOutputModal(false)}
                documentoId={venta.id}
                tipoDocumento="venta"
                documentoInfo={{
                    numero: venta.numero,
                    fecha: venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-ES') : undefined,
                    monto: venta.total,
                }}
            />

            {/* ✅ NUEVO: Modal de Confirmación de Entrega */}
            <ConfirmacionEntregaModal
                isOpen={confirmacionEntregaModal.isOpen}
                entrega={venta.entregaConfirmacion}
                ventaNumero={venta.numero}
                onClose={() => setConfirmacionEntregaModal({ isOpen: false })}
            />
        </AppLayout>
    );
}

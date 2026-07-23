import { useAuth } from '@/application/hooks/use-auth';
import type { VentaShow } from '@/domain/entities/ventas';
import AppLayout from '@/layouts/app-layout';
import { formatCurrencyWith2Decimals } from '@/lib/utils';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Dialog, DialogContent } from '@/presentation/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import ActualizarEstadoLogisticoModal from '@/presentation/components/ventas/ActualizarEstadoLogisticoModal';
import AnularVentaModal from '@/presentation/components/ventas/AnularVentaModal';
import ConfirmacionEntregaModal from '@/presentation/components/ventas/confirmacion-entrega-modal';
import { ConfirmacionesModal } from '@/presentation/components/ventas/ConfirmacionesModal';
import RegistrarConfirmacionModal from '@/presentation/components/ventas/RegistrarConfirmacionModal';
import { UbicacionesMultiplesModal } from '@/presentation/pages/logistica/entregas/components/UbicacionesMultiplesModal';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, Edit, MapPin, Package, Printer, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

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
    // ✅ NUEVO (2026-06-02): Estado para modo de reporte en modal de impresión
    const [modoReporte, setModoReporte] = useState<string>('');
    // ✅ NUEVO: Estado para modal de ubicación de entrega
    const [showMapaUbicacion, setShowMapaUbicacion] = useState(false);
    // ✅ NUEVO: Estado para modal de confirmaciones de entrega
    const [showConfirmacionesModal, setShowConfirmacionesModal] = useState(false);
    // ✅ NUEVO: Estado para modal de imagen ampliada del cliente
    const [showImagenModal, setShowImagenModal] = useState(false);
    // ✅ NUEVO: Estado para modal de registrar confirmación
    const [showRegistrarConfirmacionModal, setShowRegistrarConfirmacionModal] = useState(false);
    // ✅ NUEVO: Estado para modal de actualizar estado logístico
    const [showActualizarEstadoModal, setShowActualizarEstadoModal] = useState(false);

    // Verificar si la venta está APROBADA
    const esAprobada = venta.estado_documento?.nombre?.toLowerCase() === 'aprobada' || venta.estado_documento?.codigo === 'APROBADO';
    const ultimaConfirmacion = venta.confirmaciones && venta.confirmaciones.length > 0 ? venta.confirmaciones[venta.confirmaciones.length - 1] : null;
    const confirmacionEntrega = ultimaConfirmacion ?? venta.entregaConfirmacion;

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

    const getEstadoLogisticoColor = (codigo?: string) => {
        const estadoMap: Record<string, { clase: string; emoji: string; nombre: string }> = {
            PROGRAMADO: {
                clase: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
                emoji: '📅',
                nombre: 'Programada',
            },
            EN_PREPARACION: {
                clase: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
                emoji: '📦',
                nombre: 'En Preparación',
            },
            EN_TRANSITO: {
                clase: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
                emoji: '🚚',
                nombre: 'En Tránsito',
            },
            ENTREGADA: {
                clase: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
                emoji: '✅',
                nombre: 'Entregada',
            },
            PROBLEMAS: {
                clase: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
                emoji: '⚠️',
                nombre: 'Problemas',
            },
            CANCELADA: {
                clase: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
                emoji: '❌',
                nombre: 'Cancelada',
            },
        };

        return (
            estadoMap[codigo || ''] || {
                clase: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
                emoji: '❓',
                nombre: codigo || 'Desconocido',
            }
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Ventas', href: '/ventas' },
                { title: `Venta ${venta.id}`, href: '#' },
            ]}
        >
            <Head title={`Venta ${venta.id}`} />

            <div className="flex items-center justify-between px-6 pt-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    <p>{venta.numero}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Folio: #{venta.id}</p>
                </h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                            Acciones ⋮
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        {/* Ver Ubicación */}
                        {venta.requiere_envio && venta.direccion_cliente && (
                            <>
                                <DropdownMenuItem onClick={() => setShowMapaUbicacion(true)}>
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Ver Ubicación
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        {/* Registrar Confirmación */}
                        {can('ventas.update') && esAprobada && (
                            <DropdownMenuItem onClick={() => setShowRegistrarConfirmacionModal(true)}>
                                <Package className="mr-2 h-4 w-4" />+ Registrar Confirmación
                            </DropdownMenuItem>
                        )}

                        {/* Ver Confirmaciones */}
                        {venta.confirmaciones && venta.confirmaciones.length > 0 && (
                            <DropdownMenuItem onClick={() => setShowConfirmacionesModal(true)}>
                                <Package className="mr-2 h-4 w-4" />
                                Ver Confirmaciones
                            </DropdownMenuItem>
                        )}

                        {/* Reporte de Entrega */}
                        {venta.entregaConfirmacion && (
                            <DropdownMenuItem
                                onClick={() => {
                                    setModoReporte('entrega');
                                    setOutputModal(true);
                                }}
                            >
                                <Package className="mr-2 h-4 w-4" />
                                Reporte Entrega
                            </DropdownMenuItem>
                        )}

                        {/* Imprimir */}
                        <DropdownMenuItem
                            onClick={() => {
                                setModoReporte('');
                                setOutputModal(true);
                            }}
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </DropdownMenuItem>

                        {/* Actualizar Estado Logístico */}
                        <DropdownMenuItem onClick={() => setShowActualizarEstadoModal(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Actualizar Estado Logístico
                        </DropdownMenuItem>

                        {can('ventas.update') && <DropdownMenuSeparator />}

                        {/* Editar - Solo si NO está aprobada */}
                        {can('ventas.update') && !esAprobada && (
                            <DropdownMenuItem asChild>
                                <Link href={`/ventas/${venta.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Link>
                            </DropdownMenuItem>
                        )}

                        {/* Anular - Solo si está aprobada */}
                        {can('ventas.update') && esAprobada && (
                            <DropdownMenuItem onClick={() => setAnularModal({ isOpen: true })} disabled={isAnulando}>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                {isAnulando ? 'Anulando...' : 'Anular'}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 gap-6 p-2">
                {/* Información principal */}
                <div className="space-y-6">
                    {/* Información de la venta + Cliente */}
                    <div>
                        {/* Datos secundarios - Card unificado */}
                        <div className="col-span-2 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-2 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900">
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-5 lg:grid-cols-6">
                                <div>
                                    <ClienteInfo
                                        venta={venta}
                                        imagenCargada={imagenCargada}
                                        setImagenCargada={setImagenCargada}
                                        setShowImagenModal={setShowImagenModal}
                                        setShowMapaUbicacion={setShowMapaUbicacion}
                                    />
                                </div>
                                <div className="col-span-4 lg:col-span-5">
                                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-5 items-start">
                                        {/* Vendedor */}
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                                    <span className="text-lg">👤</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Vendedor</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{venta.usuario.name}</p>
                                            </div>
                                        </div>
                                        {/* Preventista */}
                                        {venta.preventista && ( <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                                    <span className="text-lg">🧑‍💼</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Preventista</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {venta.preventista?.name || 'No asignado'}
                                                </p>
                                            </div>
                                        </div> )}
                                        {/* Creada */}
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                                    <span className="text-lg">📅</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Creada</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {new Date(venta.created_at).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Estado */}
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        esAprobada ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                                                    }`}
                                                >
                                                    <span className="text-lg">{esAprobada ? '✅' : '🛑'}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Estado</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{venta.estado_documento.nombre}</p>
                                            </div>
                                        </div>
                                        {/* Proforma */}
                                        {venta.proforma && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                                        <span className="text-lg">📋</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Proforma</p>
                                                    <Link
                                                        href={`/proformas/${venta.proforma.id}`}
                                                        className="inline-flex items-center gap-1 text-sm font-semibold text-purple-700 transition-colors hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100"
                                                    >
                                                        #{venta.proforma.id}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        {/* Entrega */}
                                        {venta.entrega && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                                        <span className="text-lg">📋</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Entrega</p>
                                                    <Link
                                                        href={`/logistica/entregas/${venta.entrega.id}`}
                                                        className="inline-flex items-center gap-1 text-sm font-semibold text-purple-700 transition-colors hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100"
                                                    >
                                                        #{venta.entrega.id}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                        {/* Tipo Pago */}
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                                    <span className="text-lg">💵</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Tipo Pago</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {venta.tipo_pago?.nombre || 'No especificado'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Tipo de Entrega */}
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                                                    <span className="text-lg">🚚</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Tipo de Entrega</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {venta.requiere_envio ? 'Envío a Domicilio' : 'Retiro en Local'}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Estado Logístico */}
                                        {venta.estado_logistica && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div
                                                        className="flex h-10 w-10 items-center justify-center rounded-full"
                                                        style={{ backgroundColor: `${venta.estado_logistica.color}20` }}
                                                    >
                                                        <span className="text-lg">{venta.estado_logistica.icono}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                        Est. Logístico
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <div
                                                            className="inline-block rounded-full border px-2 py-1 text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: `${venta.estado_logistica.color}15`,
                                                                color: venta.estado_logistica.color,
                                                                borderColor: venta.estado_logistica.color,
                                                            }}
                                                        >
                                                            {venta.estado_logistica.nombre}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* ✅ NUEVO: Fecha Entrega Comprometida */}
                                        {venta.fecha_entrega_comprometida && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <span className="text-lg">📆</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                        Fecha Entrega Comprometida
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {new Date(venta.fecha_entrega_comprometida).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {/* ✅ NUEVO: Hora Entrega Comprometida */}
                                        {venta.hora_entrega_comprometida && (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <span className="text-lg">🕐</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                        Hora Entrega Comprometida
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {venta.hora_entrega_comprometida.substring(0, 5)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Productos + Resumen */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Productos ({venta.detalles.length})</h2>

                        <div className="mb-1 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                                <thead className="bg-gray-50 dark:bg-zinc-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Imagen
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Producto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Código
                                        </th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Códigos Barra
                                        </th> */}
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Marca
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Unidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Cantidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Precio unit.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                                    {venta.detalles.map((detalle) => {
                                        const esCombo = (detalle.producto as any)?.es_combo === true;
                                        const comboItems = (detalle.producto as any)?.combo_items || [];

                                        const codigosBarraStr =
                                            (detalle.producto as any).codigos_barra && (detalle.producto as any).codigos_barra.length > 0
                                                ? (detalle.producto as any).codigos_barra
                                                      .map((cb: any) => `${cb.codigo}${cb.es_principal ? ' ★' : ''}`)
                                                      .join(', ')
                                                : '-';

                                        const imagenPrincipal =
                                            ((detalle.producto as any)?.imagenes || []).find((img: any) => img.es_principal) ||
                                            ((detalle.producto as any)?.imagenes || [])[0];

                                        return (
                                            <>
                                                <tr key={detalle.id}>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                        {imagenPrincipal ? (
                                                            <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                                                <img
                                                                    src={imagenPrincipal.url}
                                                                    alt={detalle.producto.nombre}
                                                                    className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                                                                    onClick={() => window.open(imagenPrincipal.url, '_blank')}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-zinc-800">
                                                                <span>📦</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                                                        #{detalle.producto_id}
                                                    </td>
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
                                                        {(detalle.producto as any).marca?.nombre || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                        {(detalle.producto as any).unidad ? `${(detalle.producto as any).unidad.nombre}` : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(detalle.cantidad)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(detalle.precio_unitario, venta.moneda.codigo)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(detalle.subtotal, venta.moneda.codigo)}
                                                    </td>
                                                </tr>

                                                {/* ✅ NUEVO: Mostrar items del combo si existen */}
                                                {esCombo && comboItems.length > 0 && (
                                                    <>
                                                        <tr className="bg-gray-50 dark:bg-zinc-800">
                                                            <td colSpan={9} className="px-6 py-3">
                                                                <div className="text-xs font-semibold tracking-wide text-gray-600 uppercase dark:text-gray-300">
                                                                    Componentes del combo ({comboItems.length})
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {comboItems.map((item: any, idx: number) => {
                                                            const cantidadTotal = (item.cantidad || 0) * (detalle.cantidad || 1);
                                                            // ✅ Si precio_unitario es 0 o undefined, usar precio_venta del producto
                                                            const precioUnitario =
                                                                item.precio_unitario && item.precio_unitario > 0
                                                                    ? item.precio_unitario
                                                                    : item.producto?.precio_venta || 0;
                                                            const subtotal = cantidadTotal * precioUnitario;
                                                            const imagenCombo =
                                                                (item.producto?.imagenes || []).find((img: any) => img.es_principal) ||
                                                                (item.producto?.imagenes || [])[0];
                                                            return (
                                                                <tr key={`${detalle.id}-item-${idx}`} className="bg-gray-50 dark:bg-zinc-800">
                                                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                                        {imagenCombo ? (
                                                                            <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-200 dark:bg-zinc-700">
                                                                                <img
                                                                                    src={imagenCombo.url}
                                                                                    alt={item.producto?.nombre}
                                                                                    className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                                                                                    onClick={() => window.open(imagenCombo.url, '_blank')}
                                                                                />
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-400 dark:bg-zinc-700">
                                                                                📦
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-3 pl-12 text-sm text-gray-700 dark:text-gray-300">
                                                                        {item.producto?.id}
                                                                    </td>
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
                                                                    <td colSpan={2}></td>
                                                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                                        {formatCurrencyWith2Decimals(cantidadTotal)}
                                                                    </td>
                                                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                                        {formatCurrencyWith2Decimals(precioUnitario, venta.moneda.codigo)}
                                                                    </td>
                                                                    <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                                        {formatCurrencyWith2Decimals(subtotal, venta.moneda.codigo)}
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
                        <div className="border-t border-gray-200 pt-6 dark:border-zinc-700">
                            <div className="space-y-1">
                                {/* Subtotal */}
                                <div className="flex justify-between px-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {formatCurrencyWith2Decimals(venta.subtotal, venta.moneda.codigo)}
                                    </span>
                                </div>

                                {/* Descuento */}
                                {venta.descuento > 0 && (
                                    <div className="flex justify-between px-2">
                                        <span className="text-gray-500 dark:text-gray-400">Descuento</span>
                                        <span className="text-red-600 dark:text-red-400">
                                            -{formatCurrencyWith2Decimals(venta.descuento, venta.moneda.codigo)}
                                        </span>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="mb-3 border-t border-gray-200 px-2 pt-3 dark:border-zinc-700">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {formatCurrencyWith2Decimals(venta.total, venta.moneda.codigo)}
                                        </span>
                                    </div>
                                </div>

                                {/* Detalles de Pagos - Tipo y Monto */}
                                {venta.detalles_pago_venta && venta.detalles_pago_venta.length > 0 && (
                                    <div className="space-y-2 border-t border-gray-200 py-3 dark:border-zinc-700">
                                        <div className="text-xs font-semibold text-gray-600 uppercase dark:text-gray-400">Pagos:</div>
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
                                    <div className="flex justify-between rounded bg-green-50 p-2 dark:bg-green-900/20">
                                        <span className="font-medium text-green-700 dark:text-green-400">Monto Pagado</span>
                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                            +{formatCurrencyWith2Decimals(venta.monto_pagado, venta.moneda.codigo)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    {(venta.observaciones || venta.observaciones_logistica) && (
                        <div className="space-y-4">
                            {/* Observaciones generales */}
                            {venta.observaciones && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex-shrink-0">
                                            <span className="text-lg">📝</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-1 text-sm font-semibold text-blue-900 uppercase dark:text-blue-200">Observaciones</h3>
                                            <p className="text-sm break-words whitespace-pre-wrap text-blue-800 dark:text-blue-300">
                                                {venta.observaciones}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cuenta por cobrar si existe */}
                    {venta.cuenta_por_cobrar && (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">💳 Cuenta por Cobrar</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Monto Original</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {formatCurrencyWith2Decimals(venta.cuenta_por_cobrar.monto_original, venta.moneda.codigo)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Saldo Pendiente</span>
                                    <span
                                        className={`text-sm font-semibold ${
                                            parseFloat(venta.cuenta_por_cobrar.saldo_pendiente) > 0
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-green-600 dark:text-green-400'
                                        }`}
                                    >
                                        {formatCurrencyWith2Decimals(venta.cuenta_por_cobrar.saldo_pendiente, venta.moneda.codigo)}
                                    </span>
                                </div>

                                {venta.cuenta_por_cobrar.fecha_vencimiento && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Vencimiento</span>
                                        <span
                                            className={`text-sm ${
                                                venta.cuenta_por_cobrar.dias_vencido > 0
                                                    ? 'font-semibold text-red-600 dark:text-red-400'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {new Date(venta.cuenta_por_cobrar.fecha_vencimiento).toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Estado</span>
                                    <span
                                        className={`rounded px-2 py-1 text-sm font-semibold ${
                                            venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'PAGADO'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'PARCIAL'
                                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                  : venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'PENDIENTE' ||
                                                      venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'PENDIENTE'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'VENCIDO'
                                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                      : venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'ANULADO'
                                                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}
                                    >
                                        {venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'PAGADO' && '✅ Pagado'}
                                        {venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'PARCIAL' && '💙 Pago Parcial'}
                                        {venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'PENDIENTE' && '⏳ Pendiente'}
                                        {venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'VENCIDO' && '⚠️ Vencido'}
                                        {venta.cuenta_por_cobrar.estado.toLocaleUpperCase() === 'ANULADO' && '❌ Anulado'}
                                    </span>
                                </div>

                                {venta.cuenta_por_cobrar.observaciones && (
                                    <div className="border-t border-gray-200 pt-1 dark:border-zinc-700">
                                        <p className="mb-1 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Observaciones</p>
                                        <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                            {venta.cuenta_por_cobrar.observaciones}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ✅ NUEVO: Sección de Confirmación de Entrega EXPANDIDA */}
                    {confirmacionEntrega && (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">📦 Confirmación de Entrega</h2>
                            <div className="mb-2 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                venta.confirmaciones[venta.confirmaciones.length - 1].tipo_confirmacion === 'COMPLETA'
                                                    ? 'bg-green-100 dark:bg-green-900/30'
                                                    : 'bg-yellow-100 dark:bg-yellow-900/30'
                                            }`}
                                        >
                                            <span className="text-lg">
                                                {venta.confirmaciones[venta.confirmaciones.length - 1].tipo_confirmacion === 'COMPLETA' ? '✅' : '📋'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Tipo Confirmación</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {venta.confirmaciones[venta.confirmaciones.length - 1].tipo_confirmacion}
                                        </p>
                                    </div>
                                </div>
                                {confirmacionEntrega.confirmado_por && (
                                    <>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                        venta.confirmaciones[venta.confirmaciones.length - 1].tipo_confirmacion === 'COMPLETA'
                                                            ? 'bg-green-100 dark:bg-green-900/30'
                                                            : 'bg-yellow-100 dark:bg-yellow-900/30'
                                                    }`}
                                                >
                                                    <span className="text-lg">🧑‍💼</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Confirmado por</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {confirmacionEntrega.confirmado_por.name}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {confirmacionEntrega.confirmado_en && (
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                    venta.confirmaciones[venta.confirmaciones.length - 1].tipo_confirmacion === 'COMPLETA'
                                                        ? 'bg-green-100 dark:bg-green-900/30'
                                                        : 'bg-yellow-100 dark:bg-yellow-900/30'
                                                }`}
                                            >
                                                <span className="text-lg">📆</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium uppercase">Registrado</p>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {new Date(confirmacionEntrega.confirmado_en).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Desglose de Pagos */}
                                {(() => {
                                    // ✅ Parsear desglose_pagos SOLO si realmente tiene datos
                                    if (!confirmacionEntrega.desglose_pagos) {
                                        return null;
                                    }

                                    let pagos: any[] = [];
                                    if (typeof confirmacionEntrega.desglose_pagos === 'string') {
                                        try {
                                            pagos = JSON.parse(confirmacionEntrega.desglose_pagos);
                                        } catch (e) {
                                            return null;
                                        }
                                    } else if (Array.isArray(confirmacionEntrega.desglose_pagos)) {
                                        pagos = confirmacionEntrega.desglose_pagos;
                                    }

                                    if (!Array.isArray(pagos) || pagos.length === 0) {
                                        return null;
                                    }

                                    return (
                                        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                                            <h3 className="mb-3 font-semibold text-purple-900 dark:text-purple-200">📊 Desglose de Pagos</h3>
                                            <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                                                {pagos.map((pago: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between rounded bg-white p-2 dark:bg-zinc-800"
                                                    >
                                                        <span className="text-sm text-purple-700 dark:text-purple-300">
                                                            {pago.tipo_pago_nombre || 'Desconocido'}
                                                        </span>
                                                        <span className="font-bold text-purple-900 dark:text-purple-100">
                                                            {formatCurrencyWith2Decimals(pago.monto || 0, venta.moneda.codigo)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Monto recibido en la entrega */}
                                            {ultimaConfirmacion.total_dinero_recibido && (
                                                <div className="flex justify-between rounded bg-green-50 p-3 dark:bg-green-900/20">
                                                    <span className="text-sm text-green-700 dark:text-green-400">Monto Recibido</span>
                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                        +{formatCurrencyWith2Decimals(ultimaConfirmacion.total_dinero_recibido, venta.moneda.codigo)}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Saldo pendiente en entrega */}
                                            {ultimaConfirmacion.monto_pendiente && (
                                                <div className="flex justify-between rounded bg-orange-50 p-3 dark:bg-orange-900/20">
                                                    <span className="text-sm text-orange-700 dark:text-orange-400">Saldo Pendiente en Entrega</span>
                                                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                                                        {formatCurrencyWith2Decimals(ultimaConfirmacion.monto_pendiente, venta.moneda.codigo)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Devoluciones Parciales */}
                                {(() => {
                                    // ✅ Parsear productos_devueltos SOLO si realmente tiene datos
                                    if (!confirmacionEntrega.productos_devueltos) {
                                        return null;
                                    }

                                    let productos: any[] = [];
                                    if (typeof confirmacionEntrega.productos_devueltos === 'string') {
                                        try {
                                            productos = JSON.parse(confirmacionEntrega.productos_devueltos);
                                        } catch (e) {
                                            return null;
                                        }
                                    } else if (Array.isArray(confirmacionEntrega.productos_devueltos)) {
                                        productos = confirmacionEntrega.productos_devueltos;
                                    }

                                    if (!Array.isArray(productos) || productos.length === 0) {
                                        return null;
                                    }

                                    return (
                                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                                            <h3 className="mb-3 font-semibold text-orange-900 dark:text-orange-200">
                                                🔄 Productos Devueltos ({productos.length})
                                            </h3>
                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                                                {productos.map((prod: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between rounded bg-white p-3 dark:bg-zinc-800"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                                                                {prod.producto_nombre || 'Producto desconocido'}
                                                            </p>
                                                            <p className="text-xs text-orange-700 dark:text-orange-300">Cantidad: {prod.cantidad}</p>
                                                        </div>
                                                        <span className="font-bold text-orange-900 dark:text-orange-100">
                                                            {formatCurrencyWith2Decimals(prod.subtotal || 0, venta.moneda.codigo)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Imágenes */}
                                {(() => {
                                    // ✅ Parsear fotos SOLO si realmente tiene datos
                                    let fotos: string[] = [];
                                    if (confirmacionEntrega.fotos) {
                                        if (typeof confirmacionEntrega.fotos === 'string') {
                                            try {
                                                fotos = JSON.parse(confirmacionEntrega.fotos);
                                            } catch (e) {
                                                fotos = [];
                                            }
                                        } else if (Array.isArray(confirmacionEntrega.fotos)) {
                                            fotos = confirmacionEntrega.fotos;
                                        }
                                    }

                                    const tieneFirma = !!confirmacionEntrega.firma_digital_url;
                                    const tieneComprobante = !!confirmacionEntrega.foto_comprobante;
                                    const totalFotos = (Array.isArray(fotos) ? fotos.length : 0) + (tieneFirma ? 1 : 0) + (tieneComprobante ? 1 : 0);

                                    if (totalFotos === 0) {
                                        return null;
                                    }

                                    return (
                                        <div className="rounded-lg border border-gray-200 p-4 dark:border-zinc-700">
                                            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">📸 Evidencia Fotográfica</h3>
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                                {/* Fotos de entrega */}
                                                {fotos.length > 0 &&
                                                    fotos.map((foto: string, idx: number) => (
                                                        <div
                                                            key={`foto-${idx}`}
                                                            className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800"
                                                        >
                                                            <img
                                                                src={foto}
                                                                alt={`Foto entrega ${idx + 1}`}
                                                                className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                                onClick={() => window.open(foto, '_blank')}
                                                            />
                                                            <div className="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 text-xs font-semibold text-white">
                                                                📷 {idx + 1}
                                                            </div>
                                                        </div>
                                                    ))}

                                                {/* Firma digital */}
                                                {tieneFirma && (
                                                    <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                                        <img
                                                            src={confirmacionEntrega.firma_digital_url}
                                                            alt="Firma digital"
                                                            className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                            onClick={() => window.open(confirmacionEntrega.firma_digital_url, '_blank')}
                                                        />
                                                        <div className="absolute top-2 left-2 rounded bg-blue-600/80 px-2 py-1 text-xs font-semibold text-white">
                                                            ✍️ Firma
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Comprobante de pago */}
                                                {tieneComprobante && (
                                                    <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                                        <img
                                                            src={confirmacionEntrega.foto_comprobante}
                                                            alt="Comprobante de pago"
                                                            className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                            onClick={() => window.open(confirmacionEntrega.foto_comprobante, '_blank')}
                                                        />
                                                        <div className="absolute top-2 left-2 rounded bg-green-600/80 px-2 py-1 text-xs font-semibold text-white">
                                                            🧾 Comprobante
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Observaciones */}
                                {confirmacionEntrega.observaciones_logistica && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">📝 Observaciones</h3>
                                        <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                            {confirmacionEntrega.observaciones_logistica}
                                        </p>
                                    </div>
                                )}

                                {/* Información de Confirmación */}
                                <div className="grid grid-cols-2 gap-4 rounded-lg border border-blue-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400">
                                    {confirmacionEntrega.confirmado_por && (
                                        <>
                                            <div>
                                                <p className="font-medium uppercase">Confirmado por</p>
                                                <p className="text-gray-900 dark:text-gray-100">{confirmacionEntrega.confirmado_por.name}</p>
                                            </div>
                                        </>
                                    )}
                                    {confirmacionEntrega.confirmado_en && (
                                        <div>
                                            <p className="font-medium uppercase">Fecha</p>
                                            <p className="text-gray-900 dark:text-gray-100">
                                                {new Date(confirmacionEntrega.confirmado_en).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    )}
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
                onClose={() => {
                    setOutputModal(false);
                    setModoReporte('');
                }}
                documentoId={venta.id}
                tipoDocumento="venta"
                documentoInfo={{
                    numero: venta.numero,
                    fecha: venta.fecha ? new Date(venta.fecha).toLocaleDateString('es-ES') : undefined,
                    monto: venta.total,
                }}
                // ✅ NUEVO (2026-06-02): Modo de reporte para filtrar formatos
                modoReporte={modoReporte}
            />

            {/* ✅ Modal de Confirmación de Entrega DEPRECADO */}
            <ConfirmacionEntregaModal
                isOpen={confirmacionEntregaModal.isOpen}
                entrega={venta.entregaConfirmacion}
                ventaNumero={venta.numero}
                onClose={() => setConfirmacionEntregaModal({ isOpen: false })}
            />

            {/* ✅ NUEVO: Modal de Ubicación de Entrega con Mapa Mejorado */}
            <UbicacionesMultiplesModal
                isOpen={showMapaUbicacion}
                onClose={() => setShowMapaUbicacion(false)}
                ubicaciones={
                    venta.direccion_cliente?.latitud && venta.direccion_cliente?.longitud
                        ? [
                              {
                                  id: venta.direccion_cliente.id,
                                  venta_id: venta.id,
                                  venta_numero: venta.numero,
                                  cliente_nombre: venta.cliente?.nombre || 'Cliente desconocido',
                                  cliente_telefono: venta.cliente?.telefono,
                                  cliente_foto: venta.cliente?.foto_perfil ? `/storage/${venta.cliente.foto_perfil}` : undefined,
                                  direccion: venta.direccion_cliente.direccion || 'Sin dirección',
                                  observaciones: venta.direccion_cliente.observaciones,
                                  latitud: venta.direccion_cliente.latitud,
                                  longitud: venta.direccion_cliente.longitud,
                                  estado: venta.estado_documento?.nombre,
                                  tipo_entrega: venta.confirmacion_entrega?.tipo_entrega || 'COMPLETA',
                                  confirmacion_entrega: venta.confirmacion_entrega
                                      ? {
                                            tipo_confirmacion: venta.confirmacion_entrega.tipo_confirmacion,
                                            total_dinero_recibido: venta.confirmacion_entrega.total_dinero_recibido,
                                            monto_pendiente: venta.confirmacion_entrega.monto_pendiente,
                                            confirmado_en: venta.confirmacion_entrega.confirmado_en,
                                        }
                                      : undefined,
                              },
                          ]
                        : []
                }
                titulo={`Ubicación de Entrega - Venta ${venta.numero}`}
            />

            {/* ✅ Modal de Confirmaciones de Entrega */}
            <ConfirmacionesModal
                open={showConfirmacionesModal}
                onOpenChange={setShowConfirmacionesModal}
                confirmaciones={venta.confirmaciones}
                venta={venta}
                onConfirmacionDeleted={() => window.location.reload()}
            />
            {/* ✅ Modal de Registrar Confirmación de Entrega */}
            <RegistrarConfirmacionModal
                isOpen={showRegistrarConfirmacionModal}
                ventaId={venta.id}
                ventaNumero={venta.numero}
                entregaId={venta.entrega?.id}
                politicaPago={venta.tipo_pago?.codigo || ''}
                detalles={venta.detalles}
                onClose={() => setShowRegistrarConfirmacionModal(false)}
                onSuccess={() => {
                    // Recargar la página para mostrar la nueva confirmación
                    setTimeout(() => window.location.reload(), 500);
                }}
            />

            {/* ✅ Modal de Imagen Ampliada del Cliente */}
            <Dialog open={showImagenModal} onOpenChange={setShowImagenModal}>
                <DialogContent className="h-screen w-screen max-w-full rounded-none p-0">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
                        {venta.cliente.foto_perfil && (
                            <img
                                src={`/storage/${venta.cliente.foto_perfil}`}
                                alt={venta.cliente.nombre}
                                className="max-h-full max-w-full object-contain"
                            />
                        )}
                        <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                            <div className="rounded-lg bg-black/70 px-3 py-2 text-white">
                                <p className="font-semibold">{venta.cliente.nombre}</p>
                                {venta.cliente.telefono && <p className="text-xs opacity-90">{venta.cliente.telefono}</p>}
                            </div>
                            <button
                                onClick={() => setShowImagenModal(false)}
                                className="rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black"
                                title="Cerrar"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ✅ Modal de Actualizar Estado Logístico */}
            <ActualizarEstadoLogisticoModal
                isOpen={showActualizarEstadoModal}
                onClose={() => setShowActualizarEstadoModal(false)}
                venta={venta}
                onSuccess={() => {
                    setShowActualizarEstadoModal(false);
                    setTimeout(() => window.location.reload(), 500);
                }}
            />
        </AppLayout>
    );
}

/**
 * ✅ COMPONENTE: Información del Cliente
 * Muestra foto, nombre, NIT, teléfono y botón de ubicación
 */
function ClienteInfo({ venta, imagenCargada, setImagenCargada, setShowImagenModal, setShowMapaUbicacion }: any) {
    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
                {/* Foto de perfil */}
                <div
                    className="flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 transition-opacity hover:opacity-80 dark:border-zinc-700 dark:bg-zinc-700"
                    onClick={() => venta.cliente.foto_perfil && setShowImagenModal(true)}
                >
                    {venta.cliente.foto_perfil && typeof venta.cliente.foto_perfil === 'string' && imagenCargada ? (
                        <img
                            src={`/storage/${venta.cliente.foto_perfil}`}
                            alt={venta.cliente.nombre}
                            className="h-full w-full object-cover"
                            onError={() => setImagenCargada(false)}
                        />
                    ) : (
                        <User className="h-7 w-7 text-gray-400 dark:text-gray-500" />
                    )}
                </div>

                {/* Datos del cliente */}
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{venta.cliente.nombre}</p>

                    {venta.cliente.nit && <p className="text-xs text-gray-600 dark:text-gray-400">NIT: {venta.cliente.nit}</p>}

                    {venta.cliente.telefono && (
                        <div className="flex items-center gap-2">
                            {/* <p className="text-xs text-gray-600 dark:text-gray-400">Tel: {venta.cliente.telefono}</p> */}
                            <a
                                href={`https://wa.me/${venta.cliente.telefono.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Abrir en WhatsApp"
                                className="text-xs text-gray-600 dark:text-gray-400"
                            >
                                {/* <MessageCircle className="h-4 w-4" /> */}
                                {venta.cliente.telefono}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

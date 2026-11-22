import { useAuth } from '@/application/hooks/use-auth';
import { useExport } from '@/infrastructure/hooks/use-export';
import AppLayout from '@/layouts/app-layout';
import { compraToExportData, getDefaultCompraExportOptions } from '@/lib/export-helpers';
import AnularCompraModal, { type ErrorAnulacion } from '@/presentation/components/compras/AnularCompraModal';
import { PrintableContent } from '@/presentation/components/Export/PrintableContent';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, ChevronDown, Copy, CreditCard, Edit, FileText, Hash, Package, Printer, RotateCcw, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

// Importar tipos del domain
import type { Compra } from '@/domain/entities/compras';
import type { EstadoDocumento } from '@/domain/entities/estados-documento';

interface PagoResumen {
    id: number;
    numero_pago?: string | null;
    monto: string | number;
    fecha?: string | null;
    estado?: string | null;
    anulado: boolean;
}

interface CuentaPorPagarResumen {
    id: number;
    estado?: string | null;
    monto_total: string | number;
    monto_pagado: string | number;
    saldo_pendiente: string | number;
    fecha_vencimiento?: string | null;
    pagos: PagoResumen[];
}

interface AnulacionResumen {
    aprobada: boolean;
    motivos: string[];
}

interface PageProps extends InertiaPageProps {
    compra: Compra;
    cuenta_por_pagar?: CuentaPorPagarResumen | null;
    anulacion?: AnulacionResumen;
}

// Color del vencimiento: vencido (rojo), vence en 30 días o menos (ámbar), normal (gris)
const claseVencimiento = (fecha?: string | null): string => {
    if (!fecha) return 'text-gray-500 dark:text-gray-400';
    const dias = Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
    if (dias < 0) return 'font-semibold text-red-600 dark:text-red-400';
    if (dias <= 30) return 'font-semibold text-amber-600 dark:text-amber-400';
    return 'text-gray-500 dark:text-gray-400';
};

// ✅ NUEVO 2026-03-24: Formateador de números que muestra decimales solo cuando existen
const formatDecimal = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return '0';

    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';

    // Convertir a string con suficientes decimales
    const str = num.toString();

    // Si es un número entero o no tiene decimales significativos
    if (!str.includes('.') || /\.0+$/.test(str)) {
        return Math.round(num).toString();
    }

    // Si tiene decimales, eliminar ceros al final
    return parseFloat(num.toFixed(10)).toString();
};

// ✅ NUEVO 2026-03-24: Formateador de moneda inteligente (sin decimales innecesarios)
const formatCurrencySmartDecimal = (value: number | string | null | undefined, symbol: string = '$'): string => {
    if (value === null || value === undefined) return symbol + '0';

    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return symbol + '0';

    // Formatear el número quitando decimales innecesarios
    const formatted = formatDecimal(num);

    // Formatear como número con separadores de miles
    const parts = formatted.split('.');
    const intPart = parts[0];
    const decPart = parts[1];

    const formattedInt = parseFloat(intPart).toLocaleString('es-ES');

    if (decPart) {
        return symbol + formattedInt + ',' + decPart;
    }

    return symbol + formattedInt;
};

const getEstadoColor = (estado?: EstadoDocumento) => {
    if (!estado) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

    switch (estado.nombre.toLowerCase()) {
        case 'pendiente':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'completada':
        case 'aprobada':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'cancelada':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
};

export default function CompraShow() {
    const { props } = usePage<PageProps>();
    const { can } = useAuth();
    const { isExporting, exportToPDF, exportToExcel, exportToCSV, print, error } = useExport();
    const compra = props.compra;
    const cuenta = props.cuenta_por_pagar ?? null;
    const anulacion = props.anulacion;
    const simbolo = compra.moneda?.simbolo || '$';
    const totalUnidades = (compra.detalles || []).reduce((acc, d) => acc + Number(d.cantidad || 0), 0);
    const subtotalLineas = (compra.detalles || []).reduce((acc, d) => acc + Number(d.subtotal || 0), 0);
    const printableRef = useRef<HTMLDivElement>(null);
    const [mostrarModalAnular, setMostrarModalAnular] = useState(false);
    // Anular y duplicar: al anular con éxito se abre la copia para rehacer la compra
    const [duplicarDespuesAnular, setDuplicarDespuesAnular] = useState(false);
    const [errorAnulacion, setErrorAnulacion] = useState<ErrorAnulacion | null>(null);
    const [isAnulando, setIsAnulando] = useState(false);
    const [outputModal, setOutputModal] = useState(false);

    // Verificar si la compra está APROBADA
    const esAprobada = compra.estado_documento?.nombre?.toLowerCase() === 'aprobada' || compra.estado_documento?.codigo === 'APROBADO';

    const handleAnularCompra = async (motivo?: string) => {
        setIsAnulando(true);
        setErrorAnulacion(null);
        try {
            const response = await fetch(`/compras/${compra.id}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Mostrar el motivo dentro del modal (sigue abierto)
                setErrorAnulacion({ message: data.message || 'Error al anular la compra', motivos: data.motivos });
                return;
            }

            // Anular y duplicar: abrir la copia para rehacer la compra (la original ya quedó ANULADA)
            if (duplicarDespuesAnular) {
                toast.success('Compra anulada. Abriendo copia para rehacerla...');
                setMostrarModalAnular(false);
                router.visit(`/compras/${compra.id}/duplicar`);
                return;
            }

            toast.success('Compra anulada exitosamente');
            setMostrarModalAnular(false);

            // Recargar la página
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            console.error('Error al anular compra:', error);
            toast.error('Error al anular la compra');
        } finally {
            setIsAnulando(false);
        }
    };

    // Preparar datos para exportación
    const exportData = compraToExportData(compra);
    const defaultExportOptions = getDefaultCompraExportOptions(compra);

    const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
        try {
            switch (format) {
                case 'pdf':
                    await exportToPDF(exportData, defaultExportOptions);
                    break;
                case 'excel':
                    await exportToExcel(exportData, defaultExportOptions);
                    break;
                case 'csv':
                    await exportToCSV(exportData, defaultExportOptions);
                    break;
            }
        } catch (err) {
            console.error(`Error exportando a ${format}:`, err);
        }
    };

    const handlePrint = async () => {
        try {
            await print('printable-content', defaultExportOptions);
        } catch (err) {
            console.error('Error imprimiendo:', err);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Compras', href: '/compras' },
                { title: `Compra ${compra.numero}`, href: '#' },
            ]}
        >
            <Head title={`Compra ${compra.numero}`} />

            {/* Header mejorado */}
            <div className="mb-2 flex items-center justify-between p-2">
                <div className="flex items-center space-x-4">
                    {/* <Link
                        href="/compras"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </Link> */}
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Folio #{compra.id} | {compra.numero}
                            </h1>
                            <span className={`inline-flex rounded-full px-2 py-1 text-sm font-medium ${getEstadoColor(compra.estado_documento)}`}>
                                {compra.estado_documento?.nombre || 'Sin estado'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Creada el{' '}
                            {compra.created_at
                                ? new Date(compra.created_at).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                  })
                                : 'Fecha no disponible'}
                        </p>

                        {anulacion?.aprobada && anulacion.motivos.length === 0 && (
                            <p className="text-xs text-green-700 dark:text-green-400">Esta compra se puede anular.</p>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* Editar: acción principal, solo si la compra no está aprobada */}
                    {can('compras.update') && !esAprobada && (
                        <Link
                            href={`/compras/${compra.id}/edit`}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-2 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-blue-900 dark:focus:ring-offset-gray-800"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Link>
                    )}

                    {/* Acciones secundarias agrupadas */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                Acciones
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60">
                            <DropdownMenuItem onClick={() => setOutputModal(true)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Exportar / Imprimir
                            </DropdownMenuItem>

                            {can('compras.create') && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/compras/${compra.id}/duplicar`}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Duplicar
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            {can('compras.update') && esAprobada && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setErrorAnulacion(null);
                                            setDuplicarDespuesAnular(false);
                                            setMostrarModalAnular(true);
                                        }}
                                        disabled={isAnulando}
                                        className="text-red-600 focus:text-red-700 dark:text-red-400"
                                    >
                                        <AlertCircle className="mr-2 h-4 w-4" />
                                        {isAnulando ? 'Anulando...' : 'Anular'}
                                    </DropdownMenuItem>
                                </>
                            )}

                            {can('compras.anular') && can('compras.create') && esAprobada && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        setErrorAnulacion(null);
                                        setDuplicarDespuesAnular(true);
                                        setMostrarModalAnular(true);
                                    }}
                                    disabled={isAnulando}
                                    className="text-amber-600 focus:text-amber-700 dark:text-amber-400"
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Anular y duplicar
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="space-y-2 px-2">
                {/* Aviso: por qué la compra no se puede anular (o confirmación de que sí se puede) */}
                {anulacion?.aprobada && anulacion.motivos.length > 0 && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-100">
                        <p className="font-semibold">Esta compra no se puede anular por ahora:</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            {anulacion.motivos.map((motivo, i) => (
                                <li key={i}>{motivo}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Información General - Card Principal Consolidado */}
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    {/* SECCIÓN 1: Información General de la Compra */}
                    <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                            <FileText className="mr-2 h-5 w-5" />
                            Información General
                        </h3>
                    </div>
                    <div className="border-b border-gray-200 p-2 dark:border-gray-700">
                        <dl className="grid grid-cols-1 gap-6 md:grid-cols-4">
                            <div className="flex items-start space-x-3">
                                <Hash className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de Compra</dt>
                                    <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-white">{compra.numero}</dd>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Compra</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(compra.fecha).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </dd>
                                </div>
                            </div>

                            {/* <div className="flex items-start space-x-3">
                                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Moneda
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                                            {compra.moneda ? `${compra.moneda.codigo} - ${compra.moneda.nombre}` : 'Moneda no especificada'}
                                        </span>
                                    </dd>
                                </div>
                            </div> */}

                            <div className="flex items-start space-x-3">
                                <User className="mt-0.5 h-5 w-5 text-gray-400" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registrado por</dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {compra.usuario?.name || 'Usuario no especificado'}
                                    </dd>
                                </div>
                            </div>
                            {compra.proveedor?.nombre && (
                                <div className="flex items-start space-x-3">
                                    <User className="mt-0.5 h-5 w-5 text-gray-400" />
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Proveedor</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{compra.proveedor.nombre}</dd>
                                    </div>
                                </div>
                            )}
                            {compra.numero_factura && (
                                <div className="flex items-start space-x-3">
                                    <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Número de Factura</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">
                                                {compra.numero_factura}
                                            </span>
                                        </dd>
                                    </div>
                                </div>
                            )}
                            {compra.observaciones && (
                                <div className="flex items-start space-x-3 md:col-span-2">
                                    <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Observaciones</dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">{compra.observaciones}</div>
                                        </dd>
                                    </div>
                                </div>
                            )}
                        </dl>
                    </div>
                    <div className="border-b border-gray-200 p-2 dark:border-gray-700">
                        <dl className="space-y-4">
                            {compra.descuento > 0 && (
                                <div className="flex justify-between text-sm">
                                    <dt className="text-gray-600 dark:text-gray-400">Descuento:</dt>
                                    <dd className="font-mono text-red-600 dark:text-red-400">
                                        -{formatCurrencySmartDecimal(compra.descuento, compra.moneda?.simbolo || '$')}
                                    </dd>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between">
                                    <dt className="text-base font-semibold text-gray-900 dark:text-white">Total:</dt>
                                    <dd className="font-mono text-base font-bold text-gray-900 dark:text-white">
                                        {formatCurrencySmartDecimal(compra.total, compra.moneda?.simbolo || '$')}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    {/* Pagos y cuenta por pagar */}
                    <div className="border-b border-gray-200 p-2 dark:border-gray-700">
                        <h3 className="mb-2 flex items-center text-lg font-medium text-gray-900 dark:text-white">
                            <CreditCard className="mr-2 h-5 w-5" />
                            Pagos y cuenta por pagar
                        </h3>

                        {cuenta ? (
                            <div className="space-y-4">
                                <dl className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                    <div>
                                        <dt className="text-gray-500 dark:text-gray-400">Monto total</dt>
                                        <dd className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrencySmartDecimal(cuenta.monto_total, simbolo)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 dark:text-gray-400">Pagado</dt>
                                        <dd className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrencySmartDecimal(cuenta.monto_pagado, simbolo)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 dark:text-gray-400">Saldo pendiente</dt>
                                        <dd
                                            className={`font-mono font-semibold ${Number(cuenta.saldo_pendiente) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}
                                        >
                                            {formatCurrencySmartDecimal(cuenta.saldo_pendiente, simbolo)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 dark:text-gray-400">Estado</dt>
                                        <dd className="font-medium text-gray-900 dark:text-white">{cuenta.estado ?? 'Sin estado'}</dd>
                                    </div>
                                </dl>

                                {cuenta.fecha_vencimiento && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Vence el {new Date(cuenta.fecha_vencimiento).toLocaleDateString('es-ES')}
                                    </p>
                                )}

                                {cuenta.pagos.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Sin pagos registrados.</p>
                                ) : (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {cuenta.pagos.map((pago) => (
                                            <li
                                                key={pago.id}
                                                className={`flex items-center justify-between py-2 text-sm ${pago.anulado ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}
                                            >
                                                <span>
                                                    {pago.numero_pago ?? `Pago #${pago.id}`}
                                                    {pago.fecha && (
                                                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                                                            {new Date(pago.fecha).toLocaleDateString('es-ES')}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="font-mono">
                                                    {formatCurrencySmartDecimal(pago.monto, simbolo)}
                                                    {pago.anulado && <span className="ml-2 text-xs no-underline">(anulado)</span>}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Esta compra no tiene cuenta por pagar.</p>
                        )}
                    </div>
                </div>

                {/* Detalles de productos mejorados */}
                <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-2 py-2 dark:border-gray-700">
                        <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                            <Package className="mr-2 h-5 w-5" />
                            Productos ({compra.detalles?.length || 0})
                        </h3>
                    </div>
                    {/* Vista móvil: una tarjeta por producto */}
                    <ul className="divide-y divide-gray-200 md:hidden dark:divide-gray-700">
                        {(compra.detalles || []).map((detalle) => (
                            <li key={`m-${detalle.id}`} className="space-y-2 px-4 py-3 text-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        {detalle.imagen_url && (
                                            <img
                                                src={detalle.imagen_url}
                                                alt={detalle.producto?.nombre}
                                                loading="lazy"
                                                className="mb-1 h-14 w-14 rounded border border-gray-200 object-cover dark:border-gray-600"
                                            />
                                        )}
                                        {can('productos.manage') && detalle.producto ? (
                                            <a
                                                href={`/productos/${detalle.producto.id}/edit`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block truncate font-medium text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {detalle.producto.nombre}
                                            </a>
                                        ) : (
                                            <p className="truncate font-medium text-gray-900 dark:text-white">{detalle.producto?.nombre}</p>
                                        )}
                                        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
                                            {detalle.producto?.sku ? `SKU ${detalle.producto.sku}` : `ID ${detalle.producto?.id}`}
                                        </p>
                                    </div>
                                    <span className="shrink-0 font-mono font-semibold text-gray-900 dark:text-white">
                                        {formatCurrencySmartDecimal(detalle.subtotal, simbolo)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
                                    <span>
                                        {Number(detalle.cantidad).toLocaleString()} × {formatCurrencySmartDecimal(detalle.precio_unitario, simbolo)}
                                    </span>
                                    <span>Lote: {detalle.lote || '-'}</span>
                                    <span className={claseVencimiento(detalle.fecha_vencimiento)}>
                                        Vence: {detalle.fecha_vencimiento ? new Date(detalle.fecha_vencimiento).toLocaleDateString('es-ES') : '-'}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-3 py-2 text-left font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">ID</th>
                                    <th className="px-3 py-2 text-center font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Imagen
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Nombre
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">SKU</th>
                                    {/* <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Códigos de Barra
                                        </th> */}
                                    <th className="px-3 py-2 text-center font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Cantidad
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Precio Unit.
                                    </th>
                                    <th className="px-3 py-2 text-right font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Subtotal
                                    </th>
                                    {/* <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Stock Ant.
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Stock Post.
                                        </th> */}
                                    <th className="px-3 py-2 text-center font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Lote
                                    </th>
                                    <th className="px-3 py-2 text-center font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Vencimiento
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {(compra.detalles || []).map((detalle) => (
                                    <tr key={detalle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-3 py-2 text-gray-900 dark:text-white">
                                            <div className="font-medium">#{detalle.producto.id}</div>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            {detalle.imagen_url ? (
                                                <img
                                                    src={detalle.imagen_url}
                                                    alt={detalle.producto.nombre}
                                                    loading="lazy"
                                                    className="mx-auto h-12 w-12 rounded border border-gray-200 object-cover dark:border-gray-600"
                                                />
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {can('productos.manage') && detalle.producto ? (
                                                    <a
                                                        href={`/productos/${detalle.producto.id}/edit`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline dark:text-blue-400"
                                                        title="Editar producto (se abre en otra pestaña)"
                                                    >
                                                        {detalle.producto.nombre}
                                                    </a>
                                                ) : (
                                                    detalle.producto.nombre
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 font-mono text-xs text-gray-900 dark:text-white">{detalle.producto.sku || '-'}</td>
                                        {/* <td className="px-3 py-2 text-gray-900 dark:text-white text-xs">
                                                {detalle.producto.codigosBarra && detalle.producto.codigosBarra.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {detalle.producto.codigosBarra.map((codigo) => (
                                                            <div key={codigo.id} className="font-mono">
                                                                {codigo.codigo}
                                                                {codigo.es_principal && (
                                                                    <span className="ml-1 inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 rounded text-xs">
                                                                        Principal
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td> */}
                                        <td className="px-3 py-2 text-center font-mono text-gray-900 dark:text-white">
                                            {formatDecimal(detalle.cantidad)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-900 dark:text-white">
                                            {formatCurrencySmartDecimal(detalle.precio_unitario, compra.moneda?.simbolo || '$')}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrencySmartDecimal(detalle.subtotal, compra.moneda?.simbolo || '$')}
                                        </td>
                                        {/* <td className="px-3 py-2 text-center text-gray-900 dark:text-white font-mono">
                                                {detalle.cantidad_anterior !== null ? (
                                                    <span>{formatDecimal(detalle.cantidad_anterior)}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-center text-gray-900 dark:text-white font-mono">
                                                {detalle.cantidad_posterior !== null ? (
                                                    <span>{formatDecimal(detalle.cantidad_posterior)}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>*/}
                                        <td className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
                                            {detalle.lote ? (
                                                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-700">
                                                    {detalle.lote}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
                                            {detalle.fecha_vencimiento ? (
                                                <span className={`text-xs ${claseVencimiento(detalle.fecha_vencimiento)}`}>
                                                    {new Date(detalle.fecha_vencimiento).toLocaleDateString('es-ES')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-semibold dark:bg-gray-700">
                                <tr>
                                    <td colSpan={4} className="px-3 py-2 text-left text-gray-700 dark:text-gray-200">
                                        Totales ({compra.detalles?.length || 0} productos)
                                    </td>
                                    <td className="px-3 py-2 text-center font-mono text-gray-900 dark:text-white">
                                        {totalUnidades.toLocaleString()}
                                    </td>
                                    <td />
                                    <td className="px-3 py-2 text-right font-mono text-gray-900 dark:text-white">
                                        {formatCurrencySmartDecimal(subtotalLineas, simbolo)}
                                    </td>
                                    <td colSpan={2} />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* Contenido para impresión (oculto visualmente pero disponible en DOM) */}
            <div className="pointer-events-none absolute -top-full -left-full opacity-0 print:pointer-events-auto print:relative print:top-0 print:left-0 print:block print:opacity-100">
                <PrintableContent ref={printableRef} compra={compra} title={`Compra ${compra.numero}`} />
            </div>

            {/* Modal de anulación */}
            <AnularCompraModal
                isOpen={mostrarModalAnular}
                onClose={() => {
                    setMostrarModalAnular(false);
                    setErrorAnulacion(null);
                }}
                compraNumero={compra.numero}
                onConfirm={handleAnularCompra}
                isLoading={isAnulando}
                error={errorAnulacion}
                duplicarDespues={duplicarDespuesAnular}
            />

            {/* Modal de exportación/impresión */}
            <OutputSelectionModal
                isOpen={outputModal}
                onClose={() => setOutputModal(false)}
                documentoId={compra.id}
                tipoDocumento="compra"
                documentoInfo={{
                    numero: compra.numero,
                    fecha: compra.fecha ? new Date(compra.fecha).toLocaleDateString('es-ES') : undefined,
                    monto: compra.total,
                }}
            />
        </AppLayout>
    );
}

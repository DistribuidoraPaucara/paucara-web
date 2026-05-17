import React, { useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/application/hooks/use-auth';
import { useExport } from '@/infrastructure/hooks/use-export';
import { compraToExportData, getDefaultCompraExportOptions } from '@/lib/export-helpers';
import { ExportButtons } from '@/presentation/components/Export/ExportButtons';
import { PrintableContent } from '@/presentation/components/Export/PrintableContent';
import { ArrowLeft, Edit, Printer, Package, User, Calendar, FileText, Hash, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import AnularCompraModal from '@/presentation/components/compras/AnularCompraModal';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

// Importar tipos del domain
import type { Compra } from '@/domain/entities/compras';
import type { EstadoDocumento } from '@/domain/entities/estados-documento';

interface PageProps extends InertiaPageProps {
    compra: Compra;
}

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
    const printableRef = useRef<HTMLDivElement>(null);
    const [mostrarModalAnular, setMostrarModalAnular] = useState(false);
    const [isAnulando, setIsAnulando] = useState(false);
    const [outputModal, setOutputModal] = useState(false);

    // Verificar si la compra está APROBADA
    const esAprobada = compra.estado_documento?.nombre?.toLowerCase() === 'aprobada' || compra.estado_documento?.codigo === 'APROBADO';

    const handleAnularCompra = async (motivo?: string) => {
        setIsAnulando(true);
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
                toast.error(data.message || 'Error al anular la compra');
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
        <AppLayout breadcrumbs={[
            { title: 'Compras', href: '/compras' },
            { title: `Compra ${compra.numero}`, href: '#' }
        ]}>
            <Head title={`Compra ${compra.numero}`} />

            {/* Header mejorado */}
            <div className="flex items-center justify-between mb-6 p-4">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/compras"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Folio #{compra.id} | {compra.numero}
                            </h1>
                            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getEstadoColor(compra.estado_documento)}`}>
                                {compra.estado_documento?.nombre || 'Sin estado'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Creada el {compra.created_at ? new Date(compra.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : 'Fecha no disponible'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* Botón Exportar/Imprimir */}
                    <button
                        onClick={() => setOutputModal(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center gap-2 transition-colors"
                        title="Exportar/Imprimir documento"
                    >
                        <Printer className="h-4 w-4" />
                        Exportar
                    </button>

                    {/* Botón Editar - Solo si NO está aprobada */}
                    {can('compras.update') && !esAprobada && (
                        <Link
                            href={`/compras/${compra.id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Link>
                    )}

                    {/* Botón Anular - Solo si está aprobada */}
                    {can('compras.update') && esAprobada && (
                        <button
                            onClick={() => setMostrarModalAnular(true)}
                            disabled={isAnulando}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                        >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {isAnulando ? 'Anulando...' : 'Anular'}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6 px-6">
                {/* Información General - Card Principal Consolidado */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    {/* SECCIÓN 1: Información General de la Compra */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Información General
                        </h3>
                    </div>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <dl className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex items-start space-x-3">
                                <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Número de Compra
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                                        {compra.numero}
                                    </dd>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Fecha de Compra
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {new Date(compra.fecha).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </dd>
                                </div>
                            </div>

                            {compra.numero_factura && (
                                <div className="flex items-start space-x-3">
                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Número de Factura
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-xs">
                                                {compra.numero_factura}
                                            </span>
                                        </dd>
                                    </div>
                                </div>
                            )}

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
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Registrado por
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {compra.usuario?.name || 'Usuario no especificado'}
                                    </dd>
                                </div>
                            </div>

                            {compra.observaciones && (
                                <div className="md:col-span-2 flex items-start space-x-3">
                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Observaciones
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                {compra.observaciones}
                                            </div>
                                        </dd>
                                    </div>
                                </div>
                            )}
                            {compra.proveedor?.nombre && (
                                <div className="flex items-start space-x-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Proveedor
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {compra.proveedor.nombre}
                                    </dd>
                                </div>
                            </div>
                        )}
                        </dl>
                    </div>

                    {/* SECCIÓN 2: Proveedor */}
                    {/* <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Proveedor: 
                        </h3>
                        
                    </div> */}
                    {/* <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                            {compra.proveedor?.razon_social && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Razón Social:</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                                        {compra.proveedor.razon_social}
                                    </span>
                                </div>
                            )}

                            {compra.proveedor?.nit && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">NIT:</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs font-mono">
                                        {compra.proveedor.nit}
                                    </span>
                                </div>
                            )}

                            {compra.proveedor?.telefono && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tel:</span>
                                    <a href={`tel:${compra.proveedor.telefono}`} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs hover:underline">
                                        {compra.proveedor.telefono}
                                    </a>
                                </div>
                            )}

                            {compra.proveedor?.email && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email:</span>
                                    <a href={`mailto:${compra.proveedor.email}`} className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs hover:underline truncate">
                                        {compra.proveedor.email}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div> */}

                    {/* SECCIÓN 3: Resumen Financiero */}
                    {/* <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs font-medium text-gray-900 dark:text-white flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Resumen Financiero
                        </h3>
                    </div> */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
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
                                    <dd className="text-base font-bold font-mono text-gray-900 dark:text-white">
                                        {formatCurrencySmartDecimal(compra.total, compra.moneda?.simbolo || '$')}
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    {/* SECCIÓN 4: Información de Auditoría */}
                    {/* <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            Información de Auditoría
                        </h3>
                    </div>
                    <div className="p-6">
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Creada
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {compra.created_at ? new Date(compra.created_at).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Fecha no disponible'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Última modificación
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {compra.updated_at ? new Date(compra.updated_at).toLocaleString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'Fecha no disponible'}
                                </dd>
                            </div>
                        </dl>
                    </div> */}
                </div>

                    {/* Detalles de productos mejorados */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-gray-900 dark:text-white flex items-center">
                                <Package className="h-5 w-5 mr-2" />
                                Productos ({compra.detalles?.length || 0})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            ID/Nombre
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Códigos de Barra
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Precio Unit.
                                        </th>
                                        <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Subtotal
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Stock Ant.
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Stock Post.
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Lote
                                        </th>
                                        <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Vencimiento
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {(compra.detalles || []).map((detalle) => (
                                        <tr key={detalle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-3 py-2 text-gray-900 dark:text-white">
                                                <div className="font-medium">#{detalle.producto.id}</div>
                                                <div className="text-gray-500 dark:text-gray-400 text-xs">
                                                    {detalle.producto.nombre}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-gray-900 dark:text-white font-mono text-xs">
                                                {detalle.producto.sku || '-'}
                                            </td>
                                            <td className="px-3 py-2 text-gray-900 dark:text-white text-xs">
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
                                            </td>
                                            <td className="px-3 py-2 text-center text-gray-900 dark:text-white font-mono">
                                                {formatDecimal(detalle.cantidad)}
                                            </td>
                                            <td className="px-3 py-2 text-right text-gray-900 dark:text-white font-mono">
                                                {formatCurrencySmartDecimal(detalle.precio_unitario, compra.moneda?.simbolo || '$')}
                                            </td>
                                            <td className="px-3 py-2 text-right text-gray-900 dark:text-white font-mono font-semibold">
                                                {formatCurrencySmartDecimal(detalle.subtotal, compra.moneda?.simbolo || '$')}
                                            </td>
                                            <td className="px-3 py-2 text-center text-gray-900 dark:text-white font-mono">
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
                                            </td>
                                            <td className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
                                                {detalle.lote ? (
                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                        {detalle.lote}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-center text-gray-500 dark:text-gray-400">
                                                {detalle.fecha_vencimiento ? (
                                                    <span className="text-xs">
                                                        {new Date(detalle.fecha_vencimiento).toLocaleDateString('es-ES')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            </div>

            {/* Contenido para impresión (oculto visualmente pero disponible en DOM) */}
            <div className="absolute -left-full -top-full opacity-0 pointer-events-none print:block print:relative print:left-0 print:top-0 print:opacity-100 print:pointer-events-auto">
                <PrintableContent
                    ref={printableRef}
                    compra={compra}
                    title={`Compra ${compra.numero}`}
                />
            </div>

            {/* Modal de anulación */}
            <AnularCompraModal
                isOpen={mostrarModalAnular}
                onClose={() => setMostrarModalAnular(false)}
                compraNumero={compra.numero}
                onConfirm={handleAnularCompra}
                isLoading={isAnulando}
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

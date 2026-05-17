import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { ArrowLeft, User, Calendar, FileText, Hash } from 'lucide-react';

// Tipos para asientos contables
interface DetalleAsientoContable {
    id: number;
    codigo_cuenta: string;
    descripcion: string;
    debe: number;
    haber: number;
    orden: number;
}

interface AsientoContable {
    id: number;
    numero: string;
    fecha: string;
    concepto: string;
    tipo_documento: string;
    total_debe: number;
    total_haber: number;
    usuario?: {
        id: number;
        name: string;
    };
    detalles: DetalleAsientoContable[];
    asientable_type?: string;
    asientable_id?: number;
    asientable?: Record<string, unknown>;
}

interface PageProps extends InertiaPageProps {
    asiento: AsientoContable;
}

export default function AsientoContableShow() {
    const { props } = usePage<PageProps>();
    const { asiento } = props;

    const formatearMoneda = (valor: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(valor);
    };

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-BO');
    };

    const getTipoDocumentoBadgeColor = (tipo: string) => {
        switch (tipo) {
            case 'VENTA':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'COMPRA':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'AJUSTE':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getAsientableInfo = () => {
        if (!asiento.asientable_type) return null;

        const tipo = asiento.asientable_type.replace('App\\Models\\', '');
        return {
            tipo,
            id: asiento.asientable_id,
        };
    };

    const asientableInfo = getAsientableInfo();

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Contabilidad', href: '/contabilidad/asientos' },
            { title: 'Asientos Contables', href: '/contabilidad/asientos' },
            { title: `Asiento ${asiento.numero}`, href: `/contabilidad/asientos/${asiento.id}` }
        ]}>
            <Head title={`Asiento Contable ${asiento.numero}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/contabilidad/asientos">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Asiento Contable {asiento.numero}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Detalle del asiento contable
                            </p>
                        </div>
                    </div>
                </div>

                {/* Información del asiento */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Información General
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Número:
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {asiento.numero}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Fecha:
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {formatearFecha(asiento.fecha)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Tipo Documento:
                                </span>
                                <Badge className={getTipoDocumentoBadgeColor(asiento.tipo_documento)}>
                                    {asiento.tipo_documento}
                                </Badge>
                            </div>

                            {asiento.usuario && (
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Usuario:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {asiento.usuario.name}
                                    </span>
                                </div>
                            )}

                            {asientableInfo && (
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Hash className="w-4 h-4" />
                                        Origen:
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {asientableInfo.tipo} #{asientableInfo.id}
                                    </span>
                                </div>
                            )}

                            <div className="pt-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                                    Concepto:
                                </span>
                                <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                    {asiento.concepto}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resumen de totales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen de Totales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Debe:
                                    </span>
                                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                        {formatearMoneda(asiento.total_debe)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Haber:
                                    </span>
                                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                                        {formatearMoneda(asiento.total_haber)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center py-3 bg-gray-50 dark:bg-gray-800 rounded-md px-4">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        Diferencia:
                                    </span>
                                    <span className={`font-bold text-lg ${Math.abs(asiento.total_debe - asiento.total_haber) < 0.01
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {formatearMoneda(asiento.total_debe - asiento.total_haber)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detalles del asiento */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles del Asiento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Orden
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Código Cuenta
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Descripción
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Debe
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Haber
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {asiento.detalles.map((detalle) => (
                                        <tr key={detalle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                                                {detalle.orden}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {detalle.codigo_cuenta}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                {detalle.descripcion}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                                                {detalle.debe > 0 ? (
                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                        {formatearMoneda(detalle.debe)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                                                {detalle.haber > 0 ? (
                                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                                        {formatearMoneda(detalle.haber)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                                            TOTALES:
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold text-right text-green-600 dark:text-green-400">
                                            {formatearMoneda(asiento.total_debe)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold text-right text-red-600 dark:text-red-400">
                                            {formatearMoneda(asiento.total_haber)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

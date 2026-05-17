import { Head, router, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Search, FileText, Printer, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

// Tipos
interface CuentaContable {
    codigo: string;
    nombre: string;
    tipo: string;
    naturaleza: 'deudora' | 'acreedora';
}

interface MovimientoLibroMayor {
    fecha: string;
    numero: string;
    concepto: string;
    debe: number;
    haber: number;
    descripcion: string;
    saldo: number;
}

interface FiltrosLibroMayor {
    [key: string]: string | undefined;
    cuenta_codigo?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
}

interface PageProps extends InertiaPageProps {
    cuenta?: CuentaContable;
    movimientos?: MovimientoLibroMayor[];
    fecha_desde?: string;
    fecha_hasta?: string;
    saldo_final?: number;
    cuentas_disponibles?: CuentaContable[];
}

export default function LibroMayor() {
    const { props } = usePage<PageProps>();
    const { cuenta, movimientos, fecha_desde, fecha_hasta, saldo_final, cuentas_disponibles } = props;

    const [filtros, setFiltros] = useState<FiltrosLibroMayor>({
        cuenta_codigo: cuenta?.codigo || '',
        fecha_desde: fecha_desde || '',
        fecha_hasta: fecha_hasta || '',
    });

    const [cuentas] = useState<CuentaContable[]>(cuentas_disponibles || []);

    // Cargar cuentas disponibles si no están cargadas
    useEffect(() => {
        if (!cuentas_disponibles || cuentas_disponibles.length === 0) {
            // Aquí podrías hacer una llamada a la API para obtener las cuentas
            // Por ahora lo dejamos vacío
        }
    }, [cuentas_disponibles]);

    const generarReporte = () => {
        if (!filtros.cuenta_codigo || !filtros.fecha_desde || !filtros.fecha_hasta) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }

        router.get('/contabilidad/reportes/libro-mayor', filtros, {
            preserveState: true,
            replace: true,
        });
    };

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

    const imprimir = () => {
        window.print();
    };

    const exportarExcel = () => {
        // Implementar exportación a Excel
        console.log('Exportar a Excel');
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Contabilidad', href: '/contabilidad/asientos' },
            { title: 'Libro Mayor', href: '/contabilidad/reportes/libro-mayor' }
        ]}>
            <Head title="Libro Mayor" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Libro Mayor
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Reporte de movimientos por cuenta contable
                        </p>
                    </div>

                    {movimientos && movimientos.length > 0 && (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={imprimir} className="flex items-center gap-2">
                                <Printer className="w-4 h-4" />
                                Imprimir
                            </Button>
                            <Button variant="outline" onClick={exportarExcel} className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Excel
                            </Button>
                        </div>
                    )}
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Filtros de Búsqueda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cuenta Contable *
                                </label>
                                <Select
                                    value={filtros.cuenta_codigo || ''}
                                    onValueChange={(value) => setFiltros({ ...filtros, cuenta_codigo: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una cuenta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cuentas.map((cuenta) => (
                                            <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                                                {cuenta.codigo} - {cuenta.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha Desde *
                                </label>
                                <Input
                                    type="date"
                                    value={filtros.fecha_desde || ''}
                                    onChange={(e) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha Hasta *
                                </label>
                                <Input
                                    type="date"
                                    value={filtros.fecha_hasta || ''}
                                    onChange={(e) => setFiltros({ ...filtros, fecha_hasta: e.target.value })}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button onClick={generarReporte} className="w-full flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    Generar Reporte
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resultados del reporte */}
                {cuenta && movimientos && (
                    <div className="space-y-6">
                        {/* Información de la cuenta */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de la Cuenta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Código:
                                        </span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {cuenta.codigo}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Nombre:
                                        </span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {cuenta.nombre}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Tipo:
                                        </span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {cuenta.tipo}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Naturaleza:
                                        </span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                            {cuenta.naturaleza}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Período: {formatearFecha(fecha_desde!)} - {formatearFecha(fecha_hasta!)}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                                            Saldo Final: {formatearMoneda(saldo_final || 0)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabla de movimientos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Movimientos de la Cuenta
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Asiento
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Concepto
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
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Saldo
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {movimientos.map((movimiento, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {formatearFecha(movimiento.fecha)}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {movimiento.numero}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                        <div className="max-w-xs truncate" title={movimiento.concepto}>
                                                            {movimiento.concepto}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="max-w-xs truncate" title={movimiento.descripcion}>
                                                            {movimiento.descripcion}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                                        {movimiento.debe > 0 ? (
                                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                                {formatearMoneda(movimiento.debe)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                                        {movimiento.haber > 0 ? (
                                                            <span className="font-semibold text-red-600 dark:text-red-400">
                                                                {formatearMoneda(movimiento.haber)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold">
                                                        <span className={movimiento.saldo >= 0
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                        }>
                                                            {formatearMoneda(movimiento.saldo)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {movimientos.length === 0 && (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            No hay movimientos
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No se encontraron movimientos para los criterios seleccionados.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Estado inicial */}
                {!cuenta && (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            Libro Mayor
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Seleccione una cuenta contable y el rango de fechas para generar el reporte.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import { Head, router, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Search, TrendingUp, Printer, Download } from 'lucide-react';
import { useState } from 'react';

// Tipos
interface CuentaBalance {
    codigo: string;
    nombre: string;
    tipo: string;
    naturaleza: 'deudora' | 'acreedora';
    debe: number;
    haber: number;
    saldo: number;
}

interface TotalesBalance {
    debe: number;
    haber: number;
}

interface FiltrosBalance {
    [key: string]: string | undefined;
    fecha_desde?: string;
    fecha_hasta?: string;
}

interface PageProps extends InertiaPageProps {
    cuentas?: CuentaBalance[];
    totales?: TotalesBalance;
    fecha_desde?: string;
    fecha_hasta?: string;
}

export default function BalanceComprobacion() {
    const { props } = usePage<PageProps>();
    const { cuentas, totales, fecha_desde, fecha_hasta } = props;

    const [filtros, setFiltros] = useState<FiltrosBalance>({
        fecha_desde: fecha_desde || '',
        fecha_hasta: fecha_hasta || '',
    });

    const generarReporte = () => {
        if (!filtros.fecha_desde || !filtros.fecha_hasta) {
            alert('Por favor complete las fechas requeridas');
            return;
        }

        router.get('/contabilidad/reportes/balance-comprobacion', filtros, {
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

    const getTipoCuentaBadgeColor = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case 'activo':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pasivo':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'patrimonio':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'ingreso':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'gasto':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    // Agrupar cuentas por tipo
    const agruparCuentasPorTipo = (cuentas: CuentaBalance[]) => {
        const grupos: { [key: string]: CuentaBalance[] } = {};

        cuentas.forEach(cuenta => {
            if (!grupos[cuenta.tipo]) {
                grupos[cuenta.tipo] = [];
            }
            grupos[cuenta.tipo].push(cuenta);
        });

        return grupos;
    };

    const cuentasAgrupadas = cuentas ? agruparCuentasPorTipo(cuentas) : {};

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Contabilidad', href: '/contabilidad/asientos' },
            { title: 'Balance de Comprobación', href: '/contabilidad/reportes/balance-comprobacion' }
        ]}>
            <Head title="Balance de Comprobación" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Balance de Comprobación
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Resumen de saldos de todas las cuentas contables
                        </p>
                    </div>

                    {cuentas && cuentas.length > 0 && (
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
                            Período de Consulta
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    Generar Balance
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resultados del balance */}
                {cuentas && totales && (
                    <div className="space-y-6">
                        {/* Información del período */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Información del Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                            Período Consultado
                                        </span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatearFecha(fecha_desde!)} - {formatearFecha(fecha_hasta!)}
                                        </span>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                                        <span className="block text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                                            Total Debe
                                        </span>
                                        <span className="text-xl font-bold text-green-700 dark:text-green-300">
                                            {formatearMoneda(totales.debe)}
                                        </span>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                                        <span className="block text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                                            Total Haber
                                        </span>
                                        <span className="text-xl font-bold text-red-700 dark:text-red-300">
                                            {formatearMoneda(totales.haber)}
                                        </span>
                                    </div>
                                </div>

                                {/* Verificación de balance */}
                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex justify-center">
                                        <div className={`px-6 py-3 rounded-lg ${Math.abs(totales.debe - totales.haber) < 0.01
                                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                            }`}>
                                            <span className="block text-sm font-medium mb-1">
                                                Estado del Balance
                                            </span>
                                            <span className="text-lg font-bold">
                                                {Math.abs(totales.debe - totales.haber) < 0.01
                                                    ? '✓ BALANCEADO'
                                                    : `⚠ DIFERENCIA: ${formatearMoneda(Math.abs(totales.debe - totales.haber))}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Balance por tipos de cuenta */}
                        {Object.keys(cuentasAgrupadas).map((tipo) => (
                            <Card key={tipo}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Badge className={getTipoCuentaBadgeColor(tipo)}>
                                            {tipo.toUpperCase()}
                                        </Badge>
                                        <span>({cuentasAgrupadas[tipo].length} cuentas)</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Código
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Nombre de la Cuenta
                                                    </th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Naturaleza
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
                                                {cuentasAgrupadas[tipo].map((cuenta) => (
                                                    <tr key={cuenta.codigo} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                            {cuenta.codigo}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                                            {cuenta.nombre}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge variant="outline" className="text-xs">
                                                                {cuenta.naturaleza}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                                            {cuenta.debe > 0 ? (
                                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                                    {formatearMoneda(cuenta.debe)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                                            {cuenta.haber > 0 ? (
                                                                <span className="font-semibold text-red-600 dark:text-red-400">
                                                                    {formatearMoneda(cuenta.haber)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold">
                                                            <span className={cuenta.saldo >= 0
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-red-600 dark:text-red-400'
                                                            }>
                                                                {formatearMoneda(Math.abs(cuenta.saldo))}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            {/* Subtotales por tipo */}
                                            <tfoot className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                                                        SUBTOTAL {tipo.toUpperCase()}:
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-right text-green-600 dark:text-green-400">
                                                        {formatearMoneda(cuentasAgrupadas[tipo].reduce((sum, c) => sum + c.debe, 0))}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-right text-red-600 dark:text-red-400">
                                                        {formatearMoneda(cuentasAgrupadas[tipo].reduce((sum, c) => sum + c.haber, 0))}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-right text-gray-900 dark:text-white">
                                                        {formatearMoneda(Math.abs(cuentasAgrupadas[tipo].reduce((sum, c) => sum + c.saldo, 0)))}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Totales finales */}
                        <Card className="border-2 border-gray-300 dark:border-gray-600">
                            <CardContent className="p-6">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left text-lg font-bold text-gray-900 dark:text-white">
                                                TOTALES GENERALES:
                                            </th>
                                            <th className="text-right text-lg font-bold text-green-600 dark:text-green-400">
                                                {formatearMoneda(totales.debe)}
                                            </th>
                                            <th className="text-right text-lg font-bold text-red-600 dark:text-red-400">
                                                {formatearMoneda(totales.haber)}
                                            </th>
                                            <th className="text-right text-lg font-bold text-gray-900 dark:text-white">
                                                {formatearMoneda(Math.abs(totales.debe - totales.haber))}
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Estado inicial */}
                {!cuentas && (
                    <div className="text-center py-12">
                        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            Balance de Comprobación
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Seleccione el rango de fechas para generar el balance de comprobación.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

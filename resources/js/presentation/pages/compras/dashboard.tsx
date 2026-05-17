import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import DashboardReportesRapidos, { reportesRapidosEjemplo } from '@/presentation/components/compras/dashboard-reportes-rapidos';
import {
    CreditCard,
    Package,
    FileText,
    AlertTriangle,
    TrendingUp,
    Calendar,
    ArrowRight,
    Plus,
    BarChart3,
    CheckCircle
} from 'lucide-react';

interface ResumenModulo {
    total_compras_mes: number;
    cantidad_compras_mes: number;
    cuentas_pendientes: number;
    pagos_realizados_mes: number;
    lotes_por_vencer: number;
    lotes_vencidos: number;
    proveedores_activos: number;
}

interface AccesoRapido {
    titulo: string;
    descripcion: string;
    icono: React.ReactNode;
    href: string;
    color: string;
    badge?: string;
    badgeColor?: string;
}

interface Props {
    resumen: ResumenModulo;
}

const DashboardCompras: React.FC<Props> = ({ resumen }) => {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const accesosRapidos: AccesoRapido[] = [
        {
            titulo: 'Nueva Compra',
            descripcion: 'Registrar una nueva orden de compra',
            icono: <Plus className="w-5 h-5" />,
            href: '/compras/create',
            color: 'bg-blue-500 hover:bg-blue-600 text-white'
        },
        {
            titulo: 'Cuentas por Pagar',
            descripcion: 'Gestionar deudas con proveedores',
            icono: <CreditCard className="w-5 h-5" />,
            href: '/compras/cuentas-por-pagar',
            color: 'bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900 dark:text-orange-100',
            badge: resumen.cuentas_pendientes > 0 ? resumen.cuentas_pendientes.toString() : undefined,
            badgeColor: 'bg-orange-500'
        },
        {
            titulo: 'Registrar Pago',
            descripcion: 'Registrar pagos a proveedores',
            icono: <CreditCard className="w-5 h-5" />,
            href: '/compras/pagos/create',
            color: 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-100'
        },
        {
            titulo: 'Lotes y Vencimientos',
            descripcion: 'Control de productos perecederos',
            icono: <Package className="w-5 h-5" />,
            href: '/compras/lotes-vencimientos',
            color: 'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-100',
            badge: resumen.lotes_por_vencer > 0 ? resumen.lotes_por_vencer.toString() : undefined,
            badgeColor: resumen.lotes_vencidos > 0 ? 'bg-red-500' : 'bg-yellow-500'
        },
        {
            titulo: 'Reportes y Análisis',
            descripcion: 'Reportes detallados de compras',
            icono: <BarChart3 className="w-5 h-5" />,
            href: '/compras/reportes',
            color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
        },
        {
            titulo: 'Ver Todas las Compras',
            descripcion: 'Lista completa de órdenes de compra',
            icono: <FileText className="w-5 h-5" />,
            href: '/compras',
            color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-100'
        }
    ];

    const verDetalleReporte = (reporteId: string) => {
        // Redirigir a la página de reportes con el reporte específico
        window.location.href = `/compras/reportes?tipo=${reporteId}`;
    };

    return (
        <AppLayout>
            <Head title="Dashboard de Compras" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Dashboard de Compras
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Resumen ejecutivo y acceso rápido a todas las funcionalidades
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Link href="/compras/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Compra
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Alertas y Notificaciones */}
                {(resumen.lotes_vencidos > 0 || resumen.lotes_por_vencer > 0 || resumen.cuentas_pendientes > 0) && (
                    <div className="space-y-3">
                        {resumen.lotes_vencidos > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <div className="flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                            Productos Vencidos
                                        </h3>
                                        <div className="text-sm text-red-700 dark:text-red-300">
                                            Tienes {resumen.lotes_vencidos} lote{resumen.lotes_vencidos !== 1 ? 's' : ''} vencido{resumen.lotes_vencidos !== 1 ? 's' : ''} que requieren atención inmediata.
                                        </div>
                                    </div>
                                    <Link href="/compras/lotes-vencimientos?estado_vencimiento=VENCIDO">
                                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                            Ver Lotes
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {resumen.lotes_por_vencer > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <div className="flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            Productos Próximos a Vencer
                                        </h3>
                                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                            {resumen.lotes_por_vencer} lote{resumen.lotes_por_vencer !== 1 ? 's' : ''} vencerá{resumen.lotes_por_vencer !== 1 ? 'n' : ''} en los próximos 30 días.
                                        </div>
                                    </div>
                                    <Link href="/compras/lotes-vencimientos?estado_vencimiento=PROXIMO_VENCER">
                                        <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                                            Revisar
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {resumen.cuentas_pendientes > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 text-orange-400 mr-2" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                            Cuentas Pendientes de Pago
                                        </h3>
                                        <div className="text-sm text-orange-700 dark:text-orange-300">
                                            Tienes {resumen.cuentas_pendientes} cuenta{resumen.cuentas_pendientes !== 1 ? 's' : ''} pendiente{resumen.cuentas_pendientes !== 1 ? 's' : ''} por pagar a proveedores.
                                        </div>
                                    </div>
                                    <Link href="/compras/cuentas-por-pagar?estado=PENDIENTE">
                                        <Button size="sm" variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                                            Ver Cuentas
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Reportes Rápidos */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Métricas Clave</h2>
                    <DashboardReportesRapidos
                        reportes={reportesRapidosEjemplo}
                        onVerDetalle={verDetalleReporte}
                    />
                </div>

                {/* Accesos Rápidos */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Accesos Rápidos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accesosRapidos.map((acceso, index) => (
                            <Link key={index} href={acceso.href}>
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-3 rounded-lg ${acceso.color} group-hover:scale-105 transition-transform`}>
                                                    {acceso.icono}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {acceso.titulo}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {acceso.descripcion}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {acceso.badge && (
                                                    <Badge className={`${acceso.badgeColor} text-white`}>
                                                        {acceso.badge}
                                                    </Badge>
                                                )}
                                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Resumen de Actividad Reciente */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Resumen del Mes
                            </CardTitle>
                            <CardDescription>
                                Estadísticas de compras de septiembre 2025
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Compras:</span>
                                    <span className="font-semibold">{formatCurrency(resumen.total_compras_mes)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Órdenes Procesadas:</span>
                                    <span className="font-semibold">{resumen.cantidad_compras_mes}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Pagos Realizados:</span>
                                    <span className="font-semibold">{formatCurrency(resumen.pagos_realizados_mes)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Proveedores Activos:</span>
                                    <span className="font-semibold">{resumen.proveedores_activos}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Próximas Acciones
                            </CardTitle>
                            <CardDescription>
                                Tareas que requieren atención
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {resumen.cuentas_pendientes > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <div className="flex items-center">
                                            <CreditCard className="w-4 h-4 text-orange-600 mr-2" />
                                            <span className="text-sm">Revisar cuentas por pagar</span>
                                        </div>
                                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                                            {resumen.cuentas_pendientes}
                                        </Badge>
                                    </div>
                                )}

                                {resumen.lotes_por_vencer > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <div className="flex items-center">
                                            <Package className="w-4 h-4 text-yellow-600 mr-2" />
                                            <span className="text-sm">Productos próximos a vencer</span>
                                        </div>
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                            {resumen.lotes_por_vencer}
                                        </Badge>
                                    </div>
                                )}

                                {resumen.lotes_vencidos > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <div className="flex items-center">
                                            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                                            <span className="text-sm">Productos vencidos</span>
                                        </div>
                                        <Badge variant="outline" className="text-red-600 border-red-600">
                                            {resumen.lotes_vencidos}
                                        </Badge>
                                    </div>
                                )}

                                {resumen.cuentas_pendientes === 0 && resumen.lotes_por_vencer === 0 && resumen.lotes_vencidos === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-sm">¡Todo al día! No hay acciones pendientes.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardCompras;

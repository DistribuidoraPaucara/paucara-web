import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
    TrendingUp,
    TrendingDown,
    Calendar,
    DollarSign,
    Package,
    Users,
    AlertTriangle,
    CheckCircle,
    Eye
} from 'lucide-react';

interface ReporteRapido {
    id: string;
    titulo: string;
    descripcion: string;
    valor_principal: number;
    valor_secundario?: number;
    unidad: 'currency' | 'number' | 'percentage';
    tendencia?: number;
    icono: React.ReactNode;
    color: string;
    periodo: string;
    estado: 'excelente' | 'bueno' | 'regular' | 'critico';
}

interface Props {
    reportes: ReporteRapido[];
    onVerDetalle: (reporteId: string) => void;
}

const DashboardReportesRapidos: React.FC<Props> = ({ reportes, onVerDetalle }) => {
    const formatValue = (value: number, unidad: string): string => {
        switch (unidad) {
            case 'currency':
                return new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB',
                    minimumFractionDigits: 2,
                }).format(value);
            case 'percentage':
                return `${value.toFixed(1)}%`;
            default:
                return value.toLocaleString('es-ES');
        }
    };

    const getTendenciaIcon = (tendencia?: number) => {
        if (!tendencia) return null;
        return tendencia > 0 ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
        );
    };

    const getTendenciaColor = (tendencia?: number) => {
        if (!tendencia) return 'text-gray-600';
        return tendencia > 0 ? 'text-green-600' : 'text-red-600';
    };

    const getEstadoBadge = (estado: string) => {
        const configs = {
            excelente: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: <CheckCircle className="w-3 h-3" /> },
            bueno: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: <CheckCircle className="w-3 h-3" /> },
            regular: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: <AlertTriangle className="w-3 h-3" /> },
            critico: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: <AlertTriangle className="w-3 h-3" /> }
        };

        const config = configs[estado as keyof typeof configs] || configs.regular;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                {config.icon}
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </Badge>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportes.map((reporte) => (
                <Card key={reporte.id} className="relative hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${reporte.color}`}>
                                {reporte.icono}
                            </div>
                            <div>
                                <CardTitle className="text-sm font-medium">{reporte.titulo}</CardTitle>
                                <CardDescription className="text-xs">
                                    {reporte.descripcion}
                                </CardDescription>
                            </div>
                        </div>
                        {getEstadoBadge(reporte.estado)}
                    </CardHeader>

                    <CardContent>
                        <div className="space-y-3">
                            {/* Valor Principal */}
                            <div>
                                <div className="text-2xl font-bold">
                                    {formatValue(reporte.valor_principal, reporte.unidad)}
                                </div>
                                {reporte.valor_secundario && (
                                    <div className="text-sm text-gray-600">
                                        Anterior: {formatValue(reporte.valor_secundario, reporte.unidad)}
                                    </div>
                                )}
                            </div>

                            {/* Tendencia */}
                            {reporte.tendencia !== undefined && (
                                <div className={`flex items-center text-sm ${getTendenciaColor(reporte.tendencia)}`}>
                                    {getTendenciaIcon(reporte.tendencia)}
                                    <span className="ml-1">
                                        {reporte.tendencia >= 0 ? '+' : ''}{reporte.tendencia.toFixed(1)}% vs anterior
                                    </span>
                                </div>
                            )}

                            {/* Período */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {reporte.periodo}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onVerDetalle(reporte.id)}
                                    className="text-xs"
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Ver más
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Datos de ejemplo para los reportes rápidos
export const reportesRapidosEjemplo: ReporteRapido[] = [
    {
        id: 'total-compras-mes',
        titulo: 'Compras del Mes',
        descripcion: 'Total de compras realizadas este mes',
        valor_principal: 125000.50,
        valor_secundario: 98000.00,
        unidad: 'currency',
        tendencia: 27.5,
        icono: <DollarSign className="w-4 h-4 text-white" />,
        color: 'bg-blue-500',
        periodo: 'Septiembre 2025',
        estado: 'excelente'
    },
    {
        id: 'cantidad-ordenes',
        titulo: 'Órdenes Procesadas',
        descripcion: 'Número de órdenes de compra procesadas',
        valor_principal: 45,
        valor_secundario: 38,
        unidad: 'number',
        tendencia: 18.4,
        icono: <Package className="w-4 h-4 text-white" />,
        color: 'bg-green-500',
        periodo: 'Últimos 30 días',
        estado: 'bueno'
    },
    {
        id: 'proveedores-activos',
        titulo: 'Proveedores Activos',
        descripcion: 'Proveedores con compras recientes',
        valor_principal: 23,
        valor_secundario: 25,
        unidad: 'number',
        tendencia: -8.0,
        icono: <Users className="w-4 h-4 text-white" />,
        color: 'bg-purple-500',
        periodo: 'Este mes',
        estado: 'regular'
    },
    {
        id: 'promedio-compra',
        titulo: 'Promedio por Compra',
        descripcion: 'Valor promedio de cada orden de compra',
        valor_principal: 2777.78,
        valor_secundario: 2578.95,
        unidad: 'currency',
        tendencia: 7.7,
        icono: <TrendingUp className="w-4 h-4 text-white" />,
        color: 'bg-orange-500',
        periodo: 'Septiembre 2025',
        estado: 'bueno'
    },
    {
        id: 'productos-vencidos',
        titulo: 'Productos por Vencer',
        descripcion: 'Lotes próximos a vencer (próximos 30 días)',
        valor_principal: 8,
        unidad: 'number',
        icono: <AlertTriangle className="w-4 h-4 text-white" />,
        color: 'bg-red-500',
        periodo: 'Próximos 30 días',
        estado: 'critico'
    },
    {
        id: 'cuentas-pendientes',
        titulo: 'Cuentas Pendientes',
        descripcion: 'Saldo total de cuentas por pagar',
        valor_principal: 87500.25,
        valor_secundario: 95200.80,
        unidad: 'currency',
        tendencia: -8.1,
        icono: <DollarSign className="w-4 h-4 text-white" />,
        color: 'bg-yellow-500',
        periodo: 'Al día de hoy',
        estado: 'regular'
    }
];

export default DashboardReportesRapidos;

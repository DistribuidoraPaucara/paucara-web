import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { AlertTriangle, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import DataTable from '@/presentation/components/DataTable';

interface Cliente {
    id: number;
    codigo_cliente: string;
    nombre: string;
    razon_social: string | null;
    nit: string | null;
    limite_credito: number;
    saldo_utilizado: number;
    saldo_disponible: number;
    porcentaje_utilizacion: number;
    estado: 'normal' | 'critico' | 'vencido' | 'excedido';
    cantidad_cuentas_pendientes: number;
    cantidad_cuentas_vencidas: number;
    monto_vencido: number;
    dias_maximo_vencido: number;
}

interface PageProps {
    clientes: {
        data: Cliente[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    estadisticas: {
        total_clientes: number;
        total_credito: number;
        total_utilizado: number;
        total_disponible: number;
        clientes_vencidos: number;
        clientes_criticos: number;
        clientes_excedidos: number;
        monto_total_vencido: number;
    };
    filtros: {
        estado: string | null;
        buscar: string | null;
        orden_by: string;
        orden_dir: string;
    };
}

export default function ReporteCreditoPage() {
    const { clientes, estadisticas, filtros } = usePage<PageProps>().props;
    const { data, setData, get } = useForm({
        q: filtros.buscar || '',
        estado: filtros.estado || '',
        order_by: filtros.orden_by || 'saldo_utilizado',
        order_dir: filtros.orden_dir || 'desc',
        page: 1,
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get(reportes.credito.index.url());
    };

    const handleFilterChange = (key: string, value: string) => {
        setData(key as any, value);
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'normal':
                return <Badge className="bg-green-600 dark:bg-green-700 text-white">Normal</Badge>;
            case 'critico':
                return <Badge className="bg-yellow-600 dark:bg-yellow-700 text-white">Crítico</Badge>;
            case 'vencido':
                return <Badge className="bg-red-600 dark:bg-red-700 text-white">Vencido</Badge>;
            case 'excedido':
                return <Badge className="bg-red-800 dark:bg-red-900 text-white">Excedido</Badge>;
            default:
                return <Badge className="dark:bg-gray-700 dark:text-gray-200">Desconocido</Badge>;
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const columns = [
        {
            key: 'codigo_cliente',
            label: 'Código',
            render: (value: string) => <span className="font-mono text-sm dark:text-gray-300">{value}</span>,
        },
        {
            key: 'nombre',
            label: 'Nombre',
            render: (value: string) => <span className="font-medium dark:text-gray-200">{value}</span>,
        },
        {
            key: 'limite_credito',
            label: 'Límite',
            render: (value: number) => <span className="dark:text-gray-300">{formatCurrency(value)}</span>,
        },
        {
            key: 'saldo_utilizado',
            label: 'Utilizado',
            render: (value: number) => (
                <span className="font-semibold dark:text-gray-300">{formatCurrency(value)}</span>
            ),
        },
        {
            key: 'saldo_disponible',
            label: 'Disponible',
            render: (value: number) => (
                <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(Math.round(value * 100) / 100)}</span>
            ),
        },
        {
            key: 'porcentaje_utilizacion',
            label: 'Uso %',
            render: (value: number, row: Cliente) => (
                <div className="flex items-center gap-2">
                    <span className={value > 80 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-yellow-600 dark:text-yellow-400'}>
                        {value}%
                    </span>
                </div>
            ),
        },
        {
            key: 'estado',
            label: 'Estado',
            render: (value: string) => getEstadoBadge(value),
        },
        {
            key: 'cantidad_cuentas_vencidas',
            label: 'Vencidas',
            render: (value: number) =>
                value > 0 ? (
                    <Badge className="bg-red-600 dark:bg-red-700">{value}</Badge>
                ) : (
                    <span className="text-gray-500 dark:text-gray-400">0</span>
                ),
        },
        {
            key: 'monto_vencido',
            label: 'Monto Vencido',
            render: (value: number) =>
                value > 0 ? (
                    <span className="font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(value)}
                    </span>
                ) : (
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                ),
        },
    ];

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: dashboard().url },
            { title: 'Reportes', href: '#' },
            { title: 'Crédito', href: '#' },
        ]}>
            <div className="space-y-6 p-6">
                {/* Encabezado */}
                <div>
                    <h1 className="text-4xl font-bold dark:text-white">📊 Reporte de Crédito</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Análisis detallado del crédito de clientes, clientes vencidos y cercanos al límite
                    </p>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Clientes */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {estadisticas.total_clientes}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Clientes con crédito</p>
                        </CardContent>
                    </Card>

                    {/* Crédito Utilizado */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {((estadisticas.total_utilizado / estadisticas.total_credito) * 100).toFixed(1)}%
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Crédito utilizado</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {formatCurrency(estadisticas.total_utilizado)} / {formatCurrency(estadisticas.total_credito)}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Clientes Críticos */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {estadisticas.clientes_criticos}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Clientes críticos</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Uso &gt; 80%</p>
                        </CardContent>
                    </Card>

                    {/* Vencidos */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                {estadisticas.clientes_vencidos}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Clientes con vencido</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {formatCurrency(estadisticas.monto_total_vencido)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Alertas */}
                {estadisticas.clientes_vencidos > 0 && (
                    <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-red-800 dark:text-red-300">
                                        ⚠️ {estadisticas.clientes_vencidos} cliente{estadisticas.clientes_vencidos > 1 ? 's' : ''} con cuentas vencidas
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                        Monto total vencido: {formatCurrency(estadisticas.monto_total_vencido)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {estadisticas.clientes_excedidos > 0 && (
                    <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-red-800 dark:text-red-300">
                                        ⚠️ {estadisticas.clientes_excedidos} cliente{estadisticas.clientes_excedidos > 1 ? 's' : ''} ha excedido su límite
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                        Estos clientes requieren atención inmediata
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Filtros y Búsqueda */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="dark:text-white">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Buscar</label>
                                    <Input
                                        type="text"
                                        placeholder="Nombre, código, NIT..."
                                        value={data.q}
                                        onChange={(e) => setData('q', e.target.value)}
                                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Estado</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={data.estado}
                                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="normal">Normal</option>
                                        <option value="critico">Crítico</option>
                                        <option value="vencido">Vencido</option>
                                        <option value="excedido">Excedido</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Ordenar por</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        value={data.order_by}
                                        onChange={(e) => handleFilterChange('order_by', e.target.value)}
                                    >
                                        <option value="saldo_utilizado">Saldo Utilizado</option>
                                        <option value="nombre">Nombre</option>
                                        <option value="porcentaje">Porcentaje</option>
                                    </select>
                                </div>

                                <div className="flex items-end gap-2">
                                    <Button type="submit" className="w-full">
                                        Buscar
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Tabla de Clientes */}
                <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                        <CardTitle className="dark:text-white">
                            Clientes con Crédito ({clientes.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                                    <tr>
                                        {columns.map((col) => (
                                            <th
                                                key={col.key}
                                                className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes.data.length > 0 ? (
                                        clientes.data.map((cliente) => (
                                            <tr key={cliente.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                                                {columns.map((col) => (
                                                    <td key={col.key} className="px-4 py-3 dark:text-gray-300">
                                                        {col.render
                                                            ? col.render((cliente as any)[col.key], cliente)
                                                            : (cliente as any)[col.key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                No hay clientes que coincidan con los filtros
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {clientes.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Mostrando {(clientes.current_page - 1) * clientes.per_page + 1} a{' '}
                                    {Math.min(clientes.current_page * clientes.per_page, clientes.total)} de{' '}
                                    {clientes.total}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={clientes.current_page === 1}
                                        onClick={() => get(reportes.credito.index.url({ ...data, page: clientes.current_page - 1 }))}
                                        className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={clientes.current_page === clientes.last_page}
                                        onClick={() => get(reportes.credito.index.url({ ...data, page: clientes.current_page + 1 }))}
                                        className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, Lock } from 'lucide-react';

interface ClienteEntrega {
    id: number;
    nombre: string;
    codigo_cliente: string;
    total_entregas: number;
    dinero_recibido?: number;
    monto_rechazado?: number;
    monto_intento?: number;
}

interface EntregasPorClienteProps {
    completadas: ClienteEntrega[];
    rechazadas: ClienteEntrega[];
    tiendaCerrada: ClienteEntrega[];
    filtros: {
        fecha_desde?: string;
        fecha_hasta?: string;
        limite?: number;
    };
    fecha_desde: string;
    fecha_hasta: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reportes', href: '#' },
    { title: 'Entregas por Cliente', href: '#' },
];

const getMedalColor = (posicion: number): string => {
    switch (posicion) {
        case 1:
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        case 2:
            return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-300';
        case 3:
            return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300';
        default:
            return 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
    }
};

const getMedalIcon = (posicion: number) => {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return null;
};

export default function EntregasPorCliente({
    completadas,
    rechazadas,
    tiendaCerrada,
    filtros,
    fecha_desde,
    fecha_hasta,
    error,
}: EntregasPorClienteProps) {
    const [activeTab, setActiveTab] = useState<'completadas' | 'rechazadas' | 'cerrada'>('completadas');
    const [fechaDesde, setFechaDesde] = useState(filtros.fecha_desde || fecha_desde);
    const [fechaHasta, setFechaHasta] = useState(filtros.fecha_hasta || fecha_hasta);
    const [limite, setLimite] = useState(filtros.limite?.toString() || '20');

    const handleFiltrar = () => {
        router.get('/reportes/ventas/entregas-por-cliente', {
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            limite: parseInt(limite),
        });
    };

    const renderTabla = (data: ClienteEntrega[], tipo: 'completadas' | 'rechazadas' | 'cerrada') => {
        if (data.length === 0) {
            return (
                <div className="py-12 text-center">
                    <Lock className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Posición</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Código</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total Entregas</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                {tipo === 'completadas' && 'Dinero Recibido'}
                                {tipo === 'rechazadas' && 'Monto Rechazado'}
                                {tipo === 'cerrada' && 'Monto Intento'}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((cliente, idx) => {
                            const posicion = idx + 1;
                            const medalColor = getMedalColor(posicion);
                            const medalIcon = getMedalIcon(posicion);
                            const monto =
                                tipo === 'completadas'
                                    ? cliente.dinero_recibido
                                    : tipo === 'rechazadas'
                                        ? cliente.monto_rechazado
                                        : cliente.monto_intento;

                            return (
                                <tr
                                    key={cliente.id}
                                    className={`${medalColor} transition-colors hover:opacity-75`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {medalIcon && <span className="text-lg">{medalIcon}</span>}
                                            <span className="font-semibold"># {posicion}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{cliente.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{cliente.codigo_cliente}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">{cliente.total_entregas}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                                        Bs. {(monto || 0).toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const calcularTotales = (data: ClienteEntrega[]) => {
        return {
            clientes: data.length,
            totalEntregas: data.reduce((sum, item) => sum + item.total_entregas, 0),
        };
    };

    const totalesCompletadas = calcularTotales(completadas);
    const totalesRechazadas = calcularTotales(rechazadas);
    const totalesTotaleCerrada = calcularTotales(tiendaCerrada);

    return (
        <>
            <Head title="Entregas por Cliente" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entregas por Cliente</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Análisis de entregas completadas, rechazadas y donde la tienda estaba cerrada
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Panel de Filtros */}
                    <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Filtros</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Desde</label>
                                <input
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hasta</label>
                                <input
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Límite</label>
                                <select
                                    value={limite}
                                    onChange={(e) => setLimite(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="10">Top 10</option>
                                    <option value="20">Top 20</option>
                                    <option value="50">Top 50</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleFiltrar}
                                    className="w-full rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tarjetas de Resumen */}
                    {/* <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 p-4">
                            <p className="text-sm text-green-600 dark:text-green-400">Entregas Completadas</p>
                            <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-200">{totalesCompletadas.totalEntregas}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">
                                {totalesCompletadas.clientes} clientes
                            </p>
                        </div>
                        <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4">
                            <p className="text-sm text-red-600 dark:text-red-400">Entregas Rechazadas</p>
                            <p className="mt-2 text-2xl font-bold text-red-900 dark:text-red-200">{totalesRechazadas.totalEntregas}</p>
                            <p className="text-xs text-red-600 dark:text-red-400">{totalesRechazadas.clientes} clientes</p>
                        </div>
                        <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-4">
                            <p className="text-sm text-amber-600 dark:text-amber-400">Tienda Cerrada</p>
                            <p className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-200">{totalesTotaleCerrada.totalEntregas}</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                {totalesTotaleCerrada.clientes} clientes
                            </p>
                        </div>
                    </div> */}

                    {/* Tabs */}
                    <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('completadas')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'completadas'
                                        ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <CheckCircle className="mb-1 inline h-4 w-4 mr-2" />
                                Completadas
                            </button>
                            <button
                                onClick={() => setActiveTab('rechazadas')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'rechazadas'
                                        ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <XCircle className="mb-1 inline h-4 w-4 mr-2" />
                                Rechazadas
                            </button>
                            <button
                                onClick={() => setActiveTab('cerrada')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'cerrada'
                                        ? 'border-b-2 border-amber-600 text-amber-600 dark:text-amber-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Lock className="mb-1 inline h-4 w-4 mr-2" />
                                Tienda Cerrada
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'completadas' && renderTabla(completadas, 'completadas')}
                            {activeTab === 'rechazadas' && renderTabla(rechazadas, 'rechazadas')}
                            {activeTab === 'cerrada' && renderTabla(tiendaCerrada, 'cerrada')}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

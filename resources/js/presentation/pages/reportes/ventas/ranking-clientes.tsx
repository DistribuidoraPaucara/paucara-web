import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowDown, ArrowUp, Award, Users } from 'lucide-react';

interface ClienteRanking {
    id: number;
    nombre: string;
    codigo_cliente: string;
    total_ventas?: number;
    total_productos?: number;
    monto_total: number;
}

interface CategoriaCliente {
    id: number;
    nombre: string;
}

interface RankingClientesProps {
    topAprobadas: ClienteRanking[];
    topAnuladas: ClienteRanking[];
    topProductos: ClienteRanking[];
    menosProductos: ClienteRanking[];
    filtros: {
        fecha_desde?: string;
        fecha_hasta?: string;
        limite?: number;
        categoria_cliente_id?: number;
    };
    fecha_desde: string;
    fecha_hasta: string;
    categoriasClientes: CategoriaCliente[];
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reportes', href: '#' },
    { title: 'Ranking de Clientes', href: '#' },
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

export default function RankingClientes({
    topAprobadas,
    topAnuladas,
    topProductos,
    menosProductos,
    filtros,
    fecha_desde,
    fecha_hasta,
    categoriasClientes = [],
    error,
}: RankingClientesProps) {
    const [activeTab, setActiveTab] = useState<'aprobadas' | 'anuladas' | 'productos' | 'menos'>('productos');
    const [fechaDesde, setFechaDesde] = useState(filtros.fecha_desde || fecha_desde);
    const [fechaHasta, setFechaHasta] = useState(filtros.fecha_hasta || fecha_hasta);
    const [limite, setLimite] = useState(filtros.limite?.toString() || '20');
    const [categoriaClienteId, setCategoriaClienteId] = useState(filtros.categoria_cliente_id?.toString() || '');

    const handleFiltrar = () => {
        const params: any = {
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            limite: parseInt(limite),
        };

        if (categoriaClienteId) {
            params.categoria_cliente_id = parseInt(categoriaClienteId);
        }

        router.get('/reportes/ventas/ranking-clientes', params);
    };

    const renderTabla = (data: ClienteRanking[], tipo: 'aprobadas' | 'anuladas' | 'productos' | 'menos') => {
        if (data.length === 0) {
            return (
                <div className="py-12 text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                </div>
            );
        }

        const columnaProductos = tipo === 'productos' || tipo === 'menos';
        const columnaVentas = tipo === 'aprobadas' || tipo === 'anuladas';

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Posición</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Código</th>
                            {columnaVentas && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ventas</th>
                            )}
                            {columnaProductos && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Productos</th>
                            )}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Monto Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((cliente, idx) => {
                            const posicion = idx + 1;
                            const medalColor = getMedalColor(posicion);
                            const medalIcon = getMedalIcon(posicion);

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
                                    {columnaVentas && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">{cliente.total_ventas}</td>
                                    )}
                                    {columnaProductos && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            {cliente.total_productos?.toFixed(0)}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                                        Bs. {cliente.monto_total.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const calcularTotales = (data: ClienteRanking[]) => {
        return {
            clientes: data.length,
            montoTotal: data.reduce((sum, item) => sum + item.monto_total, 0),
        };
    };

    const totalesAprobadas = calcularTotales(topAprobadas);
    const totalesAnuladas = calcularTotales(topAnuladas);
    const totalesProductos = calcularTotales(topProductos);
    const totalesmenos = calcularTotales(menosProductos);

    return (
        <>
            <Head title="Ranking de Clientes" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ranking de Clientes</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Análisis de clientes por ventas aprobadas, anuladas y productos comprados
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
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría Cliente</label>
                                <select
                                    value={categoriaClienteId}
                                    onChange={(e) => setCategoriaClienteId(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categoriasClientes && Array.isArray(categoriasClientes) && categoriasClientes.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
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
                    {/* <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 p-4">
                            <p className="text-sm text-green-600 dark:text-green-400">Más Productos</p>
                            <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-200">{totalesProductos.clientes}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">Bs. {totalesProductos.montoTotal.toFixed(2)}</p>
                        </div>

                        <div className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-4">
                            <p className="text-sm text-blue-600 dark:text-blue-400">Más Ventas Aprobadas</p>
                            <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-200">{totalesAprobadas.clientes}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">Bs. {totalesAprobadas.montoTotal.toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-4">
                            <p className="text-sm text-red-600 dark:text-red-400">Más Ventas Anuladas</p>
                            <p className="mt-2 text-2xl font-bold text-red-900 dark:text-red-200">{totalesAnuladas.clientes}</p>
                            <p className="text-xs text-red-600 dark:text-red-400">Bs. {totalesAnuladas.montoTotal.toFixed(2)}</p>
                        </div>

                        <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-4">
                            <p className="text-sm text-amber-600 dark:text-amber-400">Menos Productos</p>
                            <p className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-200">{totalesmenos.clientes}</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400">Bs. {totalesmenos.montoTotal.toFixed(2)}</p>
                        </div>
                    </div> */}

                    {/* Tabs */}
                    <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setActiveTab('productos')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'productos'
                                    ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Award className="mb-1 inline h-4 w-4 mr-2" />
                                Más Productos
                            </button>
                            <button
                                onClick={() => setActiveTab('aprobadas')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'aprobadas'
                                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <ArrowUp className="mb-1 inline h-4 w-4 mr-2" />
                                Más Ventas Aprobadas
                            </button>
                            <button
                                onClick={() => setActiveTab('anuladas')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'anuladas'
                                    ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <ArrowDown className="mb-1 inline h-4 w-4 mr-2" />
                                Más Ventas Anuladas
                            </button>

                            <button
                                onClick={() => setActiveTab('menos')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'menos'
                                    ? 'border-b-2 border-amber-600 text-amber-600 dark:text-amber-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <ArrowDown className="mb-1 inline h-4 w-4 mr-2" />
                                Menos Productos
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'aprobadas' && renderTabla(topAprobadas, 'aprobadas')}
                            {activeTab === 'anuladas' && renderTabla(topAnuladas, 'anuladas')}
                            {activeTab === 'productos' && renderTabla(topProductos, 'productos')}
                            {activeTab === 'menos' && renderTabla(menosProductos, 'menos')}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

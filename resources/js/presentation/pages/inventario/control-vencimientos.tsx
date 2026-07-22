import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';
import { useState } from 'react';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Printer } from 'lucide-react';

interface ProductoVencimiento {
    id: number;
    producto: {
        id: number;
        nombre: string;
        sku: string;
        categoria: {
            nombre: string;
        };
    };
    almacen: {
        id: number;
        nombre: string;
    };
    lote: string | null;
    stock_actual: number;
    cantidad_disponible: number;
    cantidad_reservada: number;
    fecha_vencimiento: string;
    dias_para_vencer: number;
    estado_vencimiento: 'vencido' | 'critico' | 'urgente' | 'atencion' | 'vigente';
}

interface Almacen {
    id: number;
    nombre: string;
}

interface PageProps extends InertiaPageProps {
    productos: ProductoVencimiento[];
    almacenes: Almacen[];
    filters: {
        almacen_id: number | null;
        estado: string;
        busqueda: string;
        solo_con_stock: boolean;
    };
}

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
    {
        title: 'Control de Vencimientos',
        href: '/inventario/control-vencimientos',
    },
];

export default function ControlVencimientos() {
    const { props } = usePage<PageProps>();
    const { productos: productosRaw, almacenes, filters } = props;
    const productos = Array.isArray(productosRaw) ? productosRaw : [];
    const { can } = useAuth();

    const [busqueda, setBusqueda] = useState(filters.busqueda || '');
    const [almacenId, setAlmacenId] = useState<number | null>(filters.almacen_id || null);
    const [estado, setEstado] = useState(filters.estado || 'todos');
    const [soloConStock, setSoloConStock] = useState(filters.solo_con_stock !== false && filters.solo_con_stock !== 'false');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!can('inventario.proximos-vencer')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Acceso Denegado" />
                <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        No tienes permisos para acceder a esta página
                    </h3>
                </div>
            </AppLayout>
        );
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const obtenerClasesEstado = (estadoVenc: string) => {
        switch (estadoVenc) {
            case 'vencido':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'critico':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'urgente':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'atencion':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'vigente':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const obtenerLabelEstado = (estadoVenc: string) => {
        switch (estadoVenc) {
            case 'vencido':
                return 'Vencido';
            case 'critico':
                return 'Crítico (≤7 días)';
            case 'urgente':
                return 'Urgente (8-15 días)';
            case 'atencion':
                return 'Atención (16-30 días)';
            case 'vigente':
                return 'Vigente (>30 días)';
            default:
                return 'Desconocido';
        }
    };

    const estadosDisponibles = [
        { value: 'todos', label: 'Todos' },
        { value: 'vencido', label: 'Vencido' },
        { value: 'critico', label: 'Crítico (≤7 días)' },
        { value: 'urgente', label: 'Urgente (8-15 días)' },
        { value: 'atencion', label: 'Atención (16-30 días)' },
        { value: 'vigente', label: 'Vigente (+30 días)' },
    ];

    const aplicarFiltros = () => {
        const params = new URLSearchParams();
        if (busqueda) params.append('busqueda', busqueda);
        if (almacenId) params.append('almacen_id', almacenId.toString());
        if (estado) params.append('estado', estado);
        if (soloConStock) params.append('solo_con_stock', 'true');

        const url = `/inventario/control-vencimientos${params.toString() ? '?' + params.toString() : ''}`;
        router.get(url, {}, {
            preserveState: true,
            replace: true,
        });
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setAlmacenId(null);
        setEstado('todos');
        router.get('/inventario/control-vencimientos');
    };

    const estadisticas = {
        vencido: productos.filter(p => p.estado_vencimiento === 'vencido').length,
        critico: productos.filter(p => p.estado_vencimiento === 'critico').length,
        urgente: productos.filter(p => p.estado_vencimiento === 'urgente').length,
        atencion: productos.filter(p => p.estado_vencimiento === 'atencion').length,
        vigente: productos.filter(p => p.estado_vencimiento === 'vigente').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Control de Vencimientos" />

            <div className="flex flex-col gap-2 p-4">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Control de Vencimientos
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Vista completa de todos los lotes con fecha de vencimiento
                    </p>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Búsqueda */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Buscar Producto
                            </label>
                            <Input
                                type="text"
                                placeholder="Nombre del producto..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
                            />
                        </div>

                        {/* Almacén */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Almacén
                            </label>
                            <select
                                value={almacenId || ''}
                                onChange={(e) => setAlmacenId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todos</option>
                                {almacenes.map(a => (
                                    <option key={a.id} value={a.id}>{a.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Estado
                            </label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {estadosDisponibles.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Solo con stock */}
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={soloConStock}
                                    onChange={(e) => setSoloConStock(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Solo con stock
                                </span>
                            </label>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2 items-end">
                            <Button
                                type="button"
                                onClick={aplicarFiltros}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Filtrar
                            </Button>
                            <Button
                                type="button"
                                onClick={limpiarFiltros}
                                variant="outline"
                                className="flex-1"
                            >
                                Limpiar
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Imprimir
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{estadisticas.vencido}</div>
                        <div className="text-xs text-red-700 dark:text-red-300">Vencidos</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{estadisticas.critico}</div>
                        <div className="text-xs text-red-700 dark:text-red-300">Crítico (≤7d)</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{estadisticas.urgente}</div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">Urgente (8-15d)</div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{estadisticas.atencion}</div>
                        <div className="text-xs text-yellow-700 dark:text-yellow-300">Atención (16-30d)</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{estadisticas.vigente}</div>
                        <div className="text-xs text-green-700 dark:text-green-300">Vigente (+30d)</div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    {productos.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Sin resultados
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay lotes que coincidan con los filtros seleccionados.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="overflow-x-auto">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: '600px' }}>
                                <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Codigo
                                        </th>
                                        {/* <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Categoría
                                        </th> */}
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Almacén
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Lote
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Stock Total
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Disponible
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Fecha Vencimiento
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Días
                                        </th>
                                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {productos.map((producto) => {
                                        const getRowBgColor = () => {
                                            switch (producto.estado_vencimiento) {
                                                case 'vencido':
                                                case 'critico':
                                                    return 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30';
                                                case 'urgente':
                                                    return 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30';
                                                case 'atencion':
                                                    return 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30';
                                                case 'vigente':
                                                    return 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30';
                                                default:
                                                    return 'hover:bg-gray-50 dark:hover:bg-gray-700';
                                            }
                                        };
                                        return (
                                        <tr key={producto.id} className={getRowBgColor()}>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {producto.producto.nombre}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
                                                    {producto.producto.sku}
                                                </div>
                                            </td>
                                            {/* <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {producto.producto.categoria.nombre}
                                                </div>
                                            </td> */}
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {producto.almacen.nombre}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-900 dark:text-gray-100">
                                                    {producto.lote || '—'}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                    {producto.stock_actual}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {producto.cantidad_disponible}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                    {formatearFecha(producto.fecha_vencimiento)}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${producto.dias_para_vencer <= 7
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : producto.dias_para_vencer <= 15
                                                        ? 'text-orange-600 dark:text-orange-400'
                                                        : producto.dias_para_vencer <= 30
                                                            ? 'text-yellow-600 dark:text-yellow-400'
                                                            : 'text-green-600 dark:text-green-400'
                                                    }`}>
                                                    {Math.round(producto.dias_para_vencer)} d
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerClasesEstado(producto.estado_vencimiento)}`}>
                                                    {obtenerLabelEstado(producto.estado_vencimiento)}
                                                </span>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info de resultados */}
                {productos.length > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {productos.length} lote{productos.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Modal de impresión */}
            <OutputSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                documentoId={0}
                tipoDocumento="control-vencimientos"
            />
        </AppLayout>
    );
}

import { useAuth } from '@/application/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useState } from 'react';

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
    const [soloConStock, setSoloConStock] = useState(filters.solo_con_stock ?? true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!can('inventario.proximos-vencer')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Acceso Denegado" />
                <div className="py-12 text-center">
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No tienes permisos para acceder a esta página</h3>
                </div>
            </AppLayout>
        );
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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
        router.get(
            url,
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setAlmacenId(null);
        setEstado('todos');
        router.get('/inventario/control-vencimientos');
    };

    const estadisticas = {
        vencido: productos.filter((p) => p.estado_vencimiento === 'vencido').length,
        critico: productos.filter((p) => p.estado_vencimiento === 'critico').length,
        urgente: productos.filter((p) => p.estado_vencimiento === 'urgente').length,
        atencion: productos.filter((p) => p.estado_vencimiento === 'atencion').length,
        vigente: productos.filter((p) => p.estado_vencimiento === 'vigente').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Control de Vencimientos" />

            <div className="flex flex-col gap-2 p-4">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Control de Vencimientos</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Vista completa de todos los lotes con fecha de vencimiento</p>
                </div>

                {/* Filtros */}
                <div className="space-y-4 rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800">
                    <div className="justify-space-between grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                        {/* Búsqueda */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Buscar Producto</label>
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
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Almacén</label>
                            <select
                                value={almacenId || ''}
                                onChange={(e) => setAlmacenId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todos</option>
                                {almacenes.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                {estadosDisponibles.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Solo con stock */}
                        <div>
                            <label className="flex flex-wrap cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={soloConStock}
                                    onChange={(e) => setSoloConStock(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solo con stock</span>
                            </label>
                        </div>
                    </div>
                    {/* Botones */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" onClick={aplicarFiltros} className="bg-blue-600 text-white hover:bg-blue-700">
                            Filtrar
                        </Button>
                        <Button type="button" onClick={limpiarFiltros} variant="outline">
                            Limpiar
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir
                        </Button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{estadisticas.vencido}</div>
                        <div className="text-xs text-red-700 dark:text-red-300">Vencidos</div>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{estadisticas.critico}</div>
                        <div className="text-xs text-red-700 dark:text-red-300">Crítico (≤7d)</div>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{estadisticas.urgente}</div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">Urgente (8-15d)</div>
                    </div>
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{estadisticas.atencion}</div>
                        <div className="text-xs text-yellow-700 dark:text-yellow-300">Atención (16-30d)</div>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{estadisticas.vigente}</div>
                        <div className="text-xs text-green-700 dark:text-green-300">Vigente (+30d)</div>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                    {productos.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="mx-auto mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">Sin resultados</h3>
                            <p className="text-gray-500 dark:text-gray-400">No hay lotes que coincidan con los filtros seleccionados.</p>
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
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Producto
                                            </th>
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Codigo
                                            </th>
                                            {/* <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Categoría
                                        </th> */}
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Almacén
                                            </th>
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Lote
                                            </th>
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Stock Total
                                            </th>
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Disponible
                                            </th>
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Fecha Vencimiento
                                            </th>
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Días
                                            </th>
                                            <th className="px-2 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
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
                                                        <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                                            {producto.producto.sku}
                                                        </div>
                                                    </td>
                                                    {/* <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {producto.producto.categoria.nombre}
                                                </div>
                                            </td> */}
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{producto.almacen.nombre}</div>
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        <div className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                            {producto.lote || '—'}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {producto.stock_actual}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">{producto.cantidad_disponible}</div>
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-gray-100">
                                                            {formatearFecha(producto.fecha_vencimiento)}
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        <div
                                                            className={`text-sm font-medium ${
                                                                producto.dias_para_vencer <= 7
                                                                    ? 'text-red-600 dark:text-red-400'
                                                                    : producto.dias_para_vencer <= 15
                                                                      ? 'text-orange-600 dark:text-orange-400'
                                                                      : producto.dias_para_vencer <= 30
                                                                        ? 'text-yellow-600 dark:text-yellow-400'
                                                                        : 'text-green-600 dark:text-green-400'
                                                            }`}
                                                        >
                                                            {Math.round(producto.dias_para_vencer)} d
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-2 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${obtenerClasesEstado(producto.estado_vencimiento)}`}
                                                        >
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
            <OutputSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} documentoId={0} tipoDocumento="control-vencimientos" />
        </AppLayout>
    );
}

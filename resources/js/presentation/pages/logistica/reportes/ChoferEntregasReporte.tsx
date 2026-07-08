import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Filter, Loader, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { formatCurrencyWith2Decimals } from '@/lib/utils';

interface Filtros {
    chofer_id: number | null;
    fecha_desde: string;
    fecha_hasta: string;
}

interface ProductoDetalle {
    producto_id: number;
    nombre: string;
    sku: string;
    unidad_medida: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

interface VentaAgrupada {
    venta_id: number;
    numero_venta: string;
    cliente: {
        id: number;
        nombre: string;
        nit: string;
    };
    total_venta: number;
    tipo_confirmacion: 'COMPLETA' | 'DEVOLUCION_PARCIAL';
    confirmado_en: string;
    monto_devuelto: number;
    productos: ProductoDetalle[];
}

interface Resumen {
    total_confirmaciones: number;
    confirmaciones_completas: number;
    devoluciones_parciales: number;
    total_ventas: number;
    total_productos: number;
    total_monetario: number;
    total_devuelto: number;
}

interface ProductoResumen {
    producto_id: number;
    nombre: string;
    sku: string;
    unidad_medida: string;
    cantidad_total: number;
    valor_total: number;
}

interface Reporte {
    chofer: {
        id: number;
        nombre: string;
        email: string;
    };
    filtros: Filtros;
    resumen: Resumen;
    productos_resumen: ProductoResumen[];
    productos_por_venta: VentaAgrupada[];
}

interface Chofer {
    id: number;
    nombre: string;
}

interface Props {
    choferes: Chofer[];
}

export default function ChoferEntregasReporte({ choferes }: Props) {
    const hoy = new Date().toISOString().split('T')[0];
    const primeroDeMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0];

    const [filtros, setFiltros] = useState<Filtros>({
        chofer_id: null,
        fecha_desde: primeroDeMes,
        fecha_hasta: hoy,
    });

    const [reporte, setReporte] = useState<Reporte | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(true);
    const [activeTab, setActiveTab] = useState<'ventas' | 'productos'>('ventas');

    const handleBuscar = async () => {
        if (!filtros.chofer_id) {
            setError('Selecciona un chofer');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                fecha_desde: filtros.fecha_desde,
                fecha_hasta: filtros.fecha_hasta,
            });

            const response = await fetch(
                `/api/choferes/${filtros.chofer_id}/entregas-reporte?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error('Error al obtener reporte');
            }

            const data = await response.json();
            setReporte(data.data);
            setActiveTab('ventas');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener reporte');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFiltros({
            chofer_id: null,
            fecha_desde: primeroDeMes,
            fecha_hasta: hoy,
        });
        setReporte(null);
    };

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getEstadoConfirmacionColor = (tipo: 'COMPLETA' | 'DEVOLUCION_PARCIAL') => {
        switch (tipo) {
            case 'COMPLETA':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            case 'DEVOLUCION_PARCIAL':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
        }
    };

    const getEstadoConfirmacionLabel = (tipo: 'COMPLETA' | 'DEVOLUCION_PARCIAL') => {
        switch (tipo) {
            case 'COMPLETA':
                return '✅ Completa';
            case 'DEVOLUCION_PARCIAL':
                return '⚠️ Devolución Parcial';
            default:
                return 'Desconocido';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Logística', href: '#' }, { title: 'Reporte Entregas Chofer', href: '#' }]}>
            <Head title="Reporte Entregas Chofer" />

            <div className="px-6 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporte de Entregas por Confirmación</h1>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Filtros */}
                {showFilters && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Chofer */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Chofer *
                                </label>
                                <select
                                    value={filtros.chofer_id || ''}
                                    onChange={(e) =>
                                        setFiltros({
                                            ...filtros,
                                            chofer_id: e.target.value ? parseInt(e.target.value) : null,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Selecciona chofer...</option>
                                    {choferes.map((chofer) => (
                                        <option key={chofer.id} value={chofer.id}>
                                            {chofer.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha Desde */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    value={filtros.fecha_desde}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, fecha_desde: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Fecha Hasta */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    value={filtros.fecha_hasta}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, fecha_hasta: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 justify-end pt-4">
                            <Button variant="outline" onClick={handleReset}>
                                Resetear
                            </Button>
                            <Button onClick={handleBuscar} disabled={loading}>
                                {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                                Buscar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}

                {/* Reporte */}
                {reporte && (
                    <div className="space-y-6">
                        {/* Header del Reporte */}
                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                            <h2 className="text-xl font-bold mb-2">{reporte.chofer.nombre}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Período: {reporte.filtros.fecha_desde} a {reporte.filtros.fecha_hasta}
                            </p>
                        </div>

                        {/* Resumen Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Confirmaciones</p>
                                <p className="text-2xl font-bold">{reporte.resumen.total_confirmaciones}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completas</p>
                                <p className="text-2xl font-bold text-green-600">{reporte.resumen.confirmaciones_completas}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Devoluciones Parciales</p>
                                <p className="text-2xl font-bold text-orange-600">{reporte.resumen.devoluciones_parciales}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Monetario</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrencyWith2Decimals(reporte.resumen.total_monetario, 'BOB')}
                                </p>
                            </div>
                        </div>

                        {/* Card adicional para devoluciones */}
                        {reporte.resumen.total_devuelto > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                                    Total Devuelto: {formatCurrencyWith2Decimals(reporte.resumen.total_devuelto, 'BOB')}
                                </p>
                            </div>
                        )}

                        {/* Pestañas */}
                        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => setActiveTab('ventas')}
                                className={`px-4 py-3 font-semibold border-b-2 transition ${
                                    activeTab === 'ventas'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                Ventas Entregadas
                            </button>
                            <button
                                onClick={() => setActiveTab('productos')}
                                className={`px-4 py-3 font-semibold border-b-2 transition ${
                                    activeTab === 'productos'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                Resumen de Productos
                            </button>
                        </div>

                        {/* Contenido Ventas */}
                        {activeTab === 'ventas' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">Ventas Entregadas</h3>
                                {reporte.productos_por_venta.length === 0 ? (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                        <p className="text-yellow-800 dark:text-yellow-200">No hay confirmaciones para los filtros seleccionados</p>
                                    </div>
                                ) : (
                                    reporte.productos_por_venta.map((ventaAgrupada) => (
                                        <div
                                            key={ventaAgrupada.venta_id}
                                            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
                                        >
                                            {/* Header Venta */}
                                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                                                <div>
                                                    <h4 className="font-bold text-lg">{ventaAgrupada.numero_venta}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Cliente: {ventaAgrupada.cliente.nombre} (NIT: {ventaAgrupada.cliente.nit})
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={getEstadoConfirmacionColor(ventaAgrupada.tipo_confirmacion)}>
                                                        {getEstadoConfirmacionLabel(ventaAgrupada.tipo_confirmacion)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Info de la Venta */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Venta</p>
                                                    <p className="font-bold">
                                                        {formatCurrencyWith2Decimals(ventaAgrupada.total_venta, 'BOB')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Confirmado En</p>
                                                    <p className="font-bold text-sm">{formatearFecha(ventaAgrupada.confirmado_en)}</p>
                                                </div>
                                                {ventaAgrupada.monto_devuelto > 0 && (
                                                    <div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Monto Devuelto</p>
                                                        <p className="font-bold text-orange-600">
                                                            {formatCurrencyWith2Decimals(ventaAgrupada.monto_devuelto, 'BOB')}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Productos */}
                                            <div>
                                                <p className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                                    Productos ({ventaAgrupada.productos.length})
                                                </p>
                                                <div className="space-y-2">
                                                    {ventaAgrupada.productos.map((prod) => (
                                                        <div
                                                            key={prod.producto_id}
                                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm"
                                                        >
                                                            <div>
                                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                                    {prod.nombre}
                                                                </p>
                                                                <p className="text-gray-600 dark:text-gray-400">
                                                                    SKU: {prod.sku} | Unidad: {prod.unidad_medida}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold">
                                                                    {prod.cantidad.toFixed(2)} x{' '}
                                                                    {formatCurrencyWith2Decimals(prod.precio_unitario, 'BOB')}
                                                                </p>
                                                                <p className="text-gray-600 dark:text-gray-400">
                                                                    {formatCurrencyWith2Decimals(prod.subtotal, 'BOB')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Contenido Productos */}
                        {activeTab === 'productos' && (
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                        #
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                        Producto
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                        SKU
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                        Cantidad Total
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                        Unidad
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                        Valor Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {reporte.productos_resumen.map((producto, index) => (
                                                    <tr
                                                        key={producto.producto_id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                                            {index + 1}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                            {producto.nombre}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                            {producto.sku}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                            {producto.cantidad_total.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                            {producto.unidad_medida}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                            {formatCurrencyWith2Decimals(producto.valor_total, 'BOB')}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-100 dark:bg-gray-800 font-semibold border-t-2 border-gray-200 dark:border-gray-700">
                                                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                        TOTAL
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                                                        {reporte.productos_resumen
                                                            .reduce((sum, p) => sum + p.cantidad_total, 0)
                                                            .toFixed(2)}
                                                    </td>
                                                    <td></td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(
                                                            reporte.productos_resumen.reduce((sum, p) => sum + p.valor_total, 0),
                                                            'BOB'
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Filter, Loader, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrencyWith2Decimals } from '@/lib/utils';

interface Filtros {
    chofer_id: number | null;
    fecha_desde: string;
    fecha_hasta: string;
    estado_logistico: string;
    estado_documento: string;
    estado_venta_logistica: string;
    tipo_entrega: string;
}

interface Confirmacion {
    id: number;
    tipo_entrega: string;
    tipo_confirmacion: string;
    fecha: string;
    observaciones: string;
}

interface Producto {
    id: number;
    nombre: string;
    sku: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

interface Venta {
    id: number;
    numero: string;
    cliente: {
        id: number;
        nombre: string;
        nit: string;
    };
    estado_documento: {
        id: number;
        codigo: string;
        nombre: string;
    };
    total: number;
    productos: Producto[];
    confirmaciones: Confirmacion[];
}

interface Entrega {
    id: number;
    numero_entrega: string;
    fecha_entrega: string;
    estado_logistico: {
        id: number;
        codigo: string;
        nombre: string;
    };
    ventas: Venta[];
}

interface Resumen {
    total_entregas: number;
    entregas_completas: number;
    entregas_con_novedad: number;
    total_ventas: number;
    total_productos: number;
    total_monetario: number;
    fecha_desde: string;
    fecha_hasta: string;
}

interface ProductoResumen {
    id: number;
    nombre: string;
    sku: string;
    cantidad: number;
    subtotal: number;
    unidad_medida: string;
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
    total_ventas: number;
    entregas: Entrega[];
}

interface Chofer {
    id: number;
    nombre: string;
}

interface EstadoLogistico {
    id: number;
    codigo: string;
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
        estado_logistico: '',
        estado_documento: '',
        estado_venta_logistica: '',
        tipo_entrega: '',
    });

    const [reporte, setReporte] = useState<Reporte | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(true);
    const [activeTab, setActiveTab] = useState<'entregas' | 'productos'>('entregas');
    const [estadosLogisticos, setEstadosLogisticos] = useState<EstadoLogistico[]>([]);
    const [estadosDocumento, setEstadosDocumento] = useState<EstadoLogistico[]>([]);
    const [estadosVentaLogistica, setEstadosVentaLogistica] = useState<EstadoLogistico[]>([]);

    // Cargar estados al montar el componente
    useEffect(() => {
        const cargarEstados = async () => {
            try {
                // Cargar estados logísticos (entregas)
                const responseEntrega = await fetch('/api/estados/entrega');
                if (responseEntrega.ok) {
                    const dataEntrega = await responseEntrega.json();
                    setEstadosLogisticos(dataEntrega.data || []);
                }

                // Cargar estados de documento
                const responseDocumento = await fetch('/api/estados-documento');
                if (responseDocumento.ok) {
                    const dataDocumento = await responseDocumento.json();
                    setEstadosDocumento(dataDocumento.data || []);
                }

                // Cargar estados de venta logística
                const responseVentaLogistica = await fetch('/api/estados/venta_logistica');
                if (responseVentaLogistica.ok) {
                    const dataVentaLogistica = await responseVentaLogistica.json();
                    setEstadosVentaLogistica(dataVentaLogistica.data || []);
                }
            } catch (err) {
                console.error('Error cargando estados:', err);
            }
        };

        cargarEstados();
    }, []);

    // Obtener reporte
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
                ...(filtros.estado_logistico && { estado_logistico: filtros.estado_logistico }),
                ...(filtros.estado_documento && { estado_documento: filtros.estado_documento }),
                ...(filtros.estado_venta_logistica && { estado_venta_logistica: filtros.estado_venta_logistica }),
                ...(filtros.tipo_entrega && { tipo_entrega: filtros.tipo_entrega }),
            });

            const response = await fetch(
                `/api/choferes/${filtros.chofer_id}/entregas-reporte?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error('Error al obtener reporte');
            }

            const data = await response.json();
            setReporte(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener reporte');
        } finally {
            setLoading(false);
        }
    };

    // Resetear filtros
    const handleReset = () => {
        setFiltros({
            chofer_id: null,
            fecha_desde: primeroDeMes,
            fecha_hasta: hoy,
            estado_logistico: '',
            estado_documento: '',
            estado_venta_logistica: '',
            tipo_entrega: '',
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
            second: '2-digit',
        }).format(date);
    };

    const getTipoEntregaColor = (tipo: string) => {
        switch (tipo) {
            case 'COMPLETA':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            case 'CON_NOVEDAD':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
        }
    };

    const getEstadoLogisticoColor = (codigo: string) => {
        switch (codigo) {
            case 'ENTREGADA':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            case 'EN_TRANSITO':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
            case 'PROGRAMADO':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Logística', href: '#' }, { title: 'Reporte Entregas Chofer' }]}>
            <Head title="Reporte Entregas Chofer" />

            <div className="px-6 py-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporte de Entregas</h1>
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

                            {/* Estado Logístico */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estado Logístico
                                </label>
                                <select
                                    value={filtros.estado_logistico}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, estado_logistico: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    {estadosLogisticos.map((estado) => (
                                        <option key={estado.id} value={estado.codigo}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Estado Documento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estado Documento
                                </label>
                                <select
                                    value={filtros.estado_documento}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, estado_documento: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    {estadosDocumento.map((estado) => (
                                        <option key={estado.id} value={estado.codigo}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Estado Venta Logística */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estado Venta Logística
                                </label>
                                <select
                                    value={filtros.estado_venta_logistica}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, estado_venta_logistica: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    {estadosVentaLogistica.map((estado) => (
                                        <option key={estado.id} value={estado.codigo}>
                                            {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tipo Entrega */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tipo Entrega
                                </label>
                                <select
                                    value={filtros.tipo_entrega}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, tipo_entrega: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="">Todos</option>
                                    <option value="COMPLETA">Completa</option>
                                    <option value="CON_NOVEDAD">Con Novedad</option>
                                    <option value="RECHAZADA">Rechazada</option>
                                    <option value="CLIENTE_CERRADO">Cliente Cerrado</option>
                                </select>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Entregas</p>
                                <p className="text-2xl font-bold">{reporte.resumen.total_entregas}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completas</p>
                                <p className="text-2xl font-bold text-green-600">{reporte.resumen.entregas_completas}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Con Novedad</p>
                                <p className="text-2xl font-bold text-orange-600">{reporte.resumen.entregas_con_novedad}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Monetario</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrencyWith2Decimals(reporte.resumen.total_monetario, 'BOB')}
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Ventas</p>
                                <p className="text-2xl font-bold">{reporte.resumen.total_ventas}</p>
                            </div>
                        </div>

                        {/* Pestañas */}
                        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => setActiveTab('entregas')}
                                className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'entregas'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                Entregas
                            </button>
                            <button
                                onClick={() => setActiveTab('productos')}
                                className={`px-4 py-3 font-semibold border-b-2 transition ${activeTab === 'productos'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                Resumen de Productos
                            </button>
                        </div>

                        {/* Contenido Entregas */}
                        {activeTab === 'entregas' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">Entregas</h3>
                                {reporte.entregas.map((entrega) => (
                                    <div
                                        key={entrega.id}
                                        className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
                                    >
                                        {/* Header Entrega */}
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                                            <div>
                                                <h4 className="font-bold text-lg">{entrega.numero_entrega}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatearFecha(entrega.fecha_entrega)}
                                                </p>
                                            </div>
                                            <Badge className={getEstadoLogisticoColor(entrega.estado_logistico.codigo)}>
                                                {entrega.estado_logistico.nombre}
                                            </Badge>
                                        </div>

                                        {/* Ventas */}
                                        <div className="space-y-4">
                                            {entrega.ventas.map((venta) => (
                                                <div
                                                    key={venta.id}
                                                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3"
                                                >
                                                    {/* Venta Header */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold">{venta.numero}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {venta.cliente.nombre}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold">
                                                                {formatCurrencyWith2Decimals(venta.total, 'BOB')}
                                                            </p>
                                                            <Badge className="mt-1">
                                                                {venta.estado_documento.nombre}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Confirmaciones */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {venta.confirmaciones.map((conf) => (
                                                            <Badge
                                                                key={conf.id}
                                                                className={getTipoEntregaColor(conf.tipo_entrega)}
                                                            >
                                                                {conf.tipo_entrega}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    {/* Productos */}
                                                    <div className="text-sm">
                                                        <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                                                            Productos ({venta.productos.length})
                                                        </p>
                                                        <div className="space-y-1">
                                                            {venta.productos.map((prod) => (
                                                                <div
                                                                    key={prod.id}
                                                                    className="flex items-center justify-between text-gray-600 dark:text-gray-400"
                                                                >
                                                                    <span>
                                                                        {prod.nombre} ({prod.sku}) - {prod.cantidad} unidades
                                                                    </span>
                                                                    <span>
                                                                        {formatCurrencyWith2Decimals(prod.subtotal, 'BOB')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sin resultados Entregas */}
                        {activeTab === 'entregas' && reporte.entregas.length === 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <p className="text-yellow-800 dark:text-yellow-200">No hay entregas para los filtros seleccionados</p>
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
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">#</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Producto</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
                                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Cantidad</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Unidad</th>
                                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {reporte.productos_resumen.map((producto, index) => (
                                                    <tr key={producto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{producto.nombre}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{producto.sku}</td>
                                                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                            {producto.cantidad.toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{producto.unidad_medida}</td>
                                                        <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                                                            {formatCurrencyWith2Decimals(producto.subtotal, 'BOB')}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-100 dark:bg-gray-800 font-semibold border-t-2 border-gray-200 dark:border-gray-700">
                                                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-900 dark:text-white">TOTAL</td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                                                        {reporte.productos_resumen.reduce((sum, p) => sum + p.cantidad, 0).toFixed(2)}
                                                    </td>
                                                    <td></td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(reporte.productos_resumen.reduce((sum, p) => sum + p.subtotal, 0), 'BOB')}
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

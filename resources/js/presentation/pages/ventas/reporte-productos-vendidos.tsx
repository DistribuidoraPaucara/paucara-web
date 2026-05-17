import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatCurrencyWith2Decimals } from '@/lib/utils';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import SearchSelect from '@/presentation/components/ui/search-select';
import EntregaDetallesModal from '@/presentation/components/ventas/entrega-detalles-modal';

interface Producto {
    id: number;
    nombre: string;
    codigo: string;
    cantidad_total: number;
    precio_promedio: number;
    total_venta: number;
    usuario_creador_id: number;
    // ✅ NUEVO (2026-04-28): Datos de movimientos de inventario
    total_anterior: number;
    disponible_anterior: number;
    reservado_anterior: number;
    total_posterior: number;
    disponible_posterior: number;
    reservado_posterior: number;
}

interface Venta {
    id: number;
    numero: string;
    proforma_id: number;
    proforma_numero: string;
    proforma_fecha: string;
    cliente: string;
    usuario: string;
    total: number;
    fecha: string;
    estado: string;
    estado_entrega?: string;
    motivo_entrega?: string;
    tienda_abierta?: boolean;
    cliente_presente?: boolean;
    observaciones_logistica?: string;
    tipo_entrega?: string;
    tipo_novedad?: string;
    tuvo_problema?: boolean;
    estado_pago?: string;
    total_dinero_recibido?: number;
    monto_pendiente?: number;
    confirmado_en?: string;
}

interface PageProps {
    productos: Producto[];
    ventas: Venta[];
    totales: {
        cantidad_productos: number;
        cantidad_total_vendida: number;
        total_venta_general: number;
        precio_promedio_general: number;
    };
    filtros: {
        fecha_desde?: string;
        fecha_hasta?: string;
        usuario_creador_id?: string;
        cliente_id?: string;
    };
    usuarios: Array<{ id: number; name: string; email: string }>;
    clientes: Array<{ id: number; nombre: string; email: string }>;
    fecha_desde: string;
    fecha_hasta: string;
    es_preventista: boolean;
    error?: string;
}

export default function ReporteProductosVendidos({
    productos = [],
    ventas = [],
    totales = {},
    filtros = {},
    usuarios = [],
    clientes = [],
    fecha_desde,
    fecha_hasta,
    es_preventista,
    error,
}: PageProps) {
    const [activeTab, setActiveTab] = useState<'productos' | 'ventas'>('productos');
    const [ventasOrder, setVentasOrder] = useState<'asc' | 'desc'>('desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [selectedVenta, setSelectedVenta] = useState<Venta | undefined>();
    const [fechaDesde, setFechaDesde] = useState(filtros.fecha_desde || fecha_desde);
    const [fechaHasta, setFechaHasta] = useState(filtros.fecha_hasta || fecha_hasta);
    // ✅ CORREGIDO: Convertir usuario_creador_id a string si existe, sino usar 'TODOS'
    const [usuarioId, setUsuarioId] = useState(
        filtros.usuario_creador_id ? String(filtros.usuario_creador_id) : (es_preventista ? '' : 'TODOS')
    );
    const [clienteId, setClienteId] = useState(
        filtros.cliente_id ? String(filtros.cliente_id) : 'TODOS'
    );

    // ✅ NUEVO: Estados para impresión automática
    const [impresoras, setImpresoras] = useState<string[]>([]);
    const [impresoraSeleccionada, setImpresoraSeleccionada] = useState<string>('default');
    const [imprimiendo, setImprimiendo] = useState(false);

    // ✅ NUEVO: Cargar impresoras disponibles al montar
    React.useEffect(() => {
        const cargarImpresoras = async () => {
            try {
                const response = await fetch('/api/ventas/impresoras/disponibles');
                const data = await response.json();
                if (data.success && data.impresoras.length > 0) {
                    setImpresoras(data.impresoras);
                    setImpresoraSeleccionada(data.impresoras[0]);
                }
            } catch (error) {
                console.error('Error al cargar impresoras:', error);
            }
        };
        cargarImpresoras();
    }, []);

    const handleAbrirDetalleEntrega = (venta: Venta) => {
        setSelectedVenta(venta);
        setIsDeliveryModalOpen(true);
    };

    const ventasOrdenadas = useMemo(() => {
        const sorted = [...ventas];
        if (ventasOrder === 'asc') {
            sorted.sort((a, b) => a.id - b.id);
        } else {
            sorted.sort((a, b) => b.id - a.id);
        }
        return sorted;
    }, [ventas, ventasOrder]);

    const handleBuscar = () => {
        const params = new URLSearchParams();
        if (fechaDesde) params.append('fecha_desde', fechaDesde);
        if (fechaHasta) params.append('fecha_hasta', fechaHasta);
        if (usuarioId && usuarioId !== 'TODOS') params.append('usuario_creador_id', usuarioId);
        if (clienteId && clienteId !== 'TODOS') params.append('cliente_id', clienteId);

        const queryString = params.toString();
        const url = queryString ? `/ventas/reporte-productos-vendidos?${queryString}` : '/ventas/reporte-productos-vendidos';
        router.visit(url);
    };

    // ✅ NUEVO: Imprimir directamente en la impresora con diálogo
    const handleImprimirDirecto = () => {
        const params = new URLSearchParams();
        if (fechaDesde) params.append('fecha_desde', fechaDesde);
        if (fechaHasta) params.append('fecha_hasta', fechaHasta);
        if (usuarioId && usuarioId !== 'TODOS') params.append('usuario_creador_id', usuarioId);
        if (clienteId && clienteId !== 'TODOS') params.append('cliente_id', clienteId);

        const url = `/ventas/reporte-productos-vendidos/imprimir?${params.toString()}`;

        // Abrir en una ventana nueva
        const ventana = window.open(url, 'print', 'width=900,height=700');

        // Esperar a que cargue el PDF y luego abrir el diálogo de impresión
        if (ventana) {
            setTimeout(() => {
                ventana.print();
            }, 1500);
        }
    };

    // ✅ NUEVO: Imprimir automáticamente sin diálogos
    const handleImprimirAutomatico = async () => {
        if (!impresoraSeleccionada) {
            alert('Por favor selecciona una impresora');
            return;
        }

        setImprimiendo(true);
        try {
            const params = new URLSearchParams();
            if (fechaDesde) params.append('fecha_desde', fechaDesde);
            if (fechaHasta) params.append('fecha_hasta', fechaHasta);
            if (usuarioId && usuarioId !== 'TODOS') params.append('usuario_creador_id', usuarioId);
            if (clienteId && clienteId !== 'TODOS') params.append('cliente_id', clienteId);
            params.append('impresora', impresoraSeleccionada);

            const response = await fetch('/ventas/reporte-productos-vendidos/imprimir-directo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    fecha_desde: fechaDesde,
                    fecha_hasta: fechaHasta,
                    usuario_creador_id: usuarioId !== 'TODOS' ? usuarioId : null,
                    cliente_id: clienteId !== 'TODOS' ? clienteId : null,
                    impresora: impresoraSeleccionada,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ ${data.mensaje}`);
            } else {
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            alert(`❌ Error al imprimir: ${error}`);
        } finally {
            setImprimiendo(false);
        }
    };

    const handleLimpiar = () => {
        setFechaDesde(fecha_desde);
        setFechaHasta(fecha_hasta);
        setUsuarioId('TODOS');
        setClienteId('TODOS');
        router.visit('/ventas/reporte-productos-vendidos');
    };

    return (
        <AppLayout>
            <Head title="Reporte de Productos Vendidos" />

            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                📊 Reporte de Productos Vendidosss
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Análisis de productos vendidos en proformas convertidas a ventas aprobadas
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                            >
                                💾 Imp/Exportar
                            </button>
                            <Link
                                href="/proformas"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                            >
                                ← Volver
                            </Link>
                        </div>
                    </div>

                    {/* Accesos rápidos por Preventista */}
                    {usuarios.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                🚀 Accesos rápidos por preventista:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        setUsuarioId('TODOS');
                                        handleBuscar();
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        usuarioId === 'TODOS'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                                    }`}
                                >
                                    📋 Todos
                                </button>
                                {usuarios.map((usuario) => (
                                    <button
                                        key={usuario.id}
                                        onClick={() => {
                                            setUsuarioId(String(usuario.id));
                                            // Actualizar automáticamente después de seleccionar
                                            setTimeout(() => {
                                                const params = new URLSearchParams();
                                                if (fechaDesde) params.append('fecha_desde', fechaDesde);
                                                if (fechaHasta) params.append('fecha_hasta', fechaHasta);
                                                params.append('usuario_creador_id', String(usuario.id));
                                                if (clienteId && clienteId !== 'TODOS') params.append('cliente_id', clienteId);
                                                const url = `/ventas/reporte-productos-vendidos?${params.toString()}`;
                                                router.visit(url);
                                            }, 0);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${
                                            String(usuarioId) === String(usuario.id)
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                                        }`}
                                    >
                                        👤 {usuario.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Mostrar Usuario Preventista Seleccionado */}
                {usuarioId && usuarioId !== 'TODOS' && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-xl">👤</span>
                                <div>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase">Filtro de Preventista Activo</p>
                                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                        {usuarios.find((u) => String(u.id) === usuarioId)?.name || 'Usuario no encontrado'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setUsuarioId('TODOS')}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                            >
                                ✕ Cambiar
                            </button>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🔍 Filtros</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Preventista/Usuario Creador */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                👤 Preventista
                            </label>
                            <select
                                value={usuarioId}
                                onChange={(e) => setUsuarioId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                            >
                                <option value="TODOS">Todos</option>
                                {usuarios.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Cliente */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                🏪 Cliente
                            </label>
                            <SearchSelect
                                label=""
                                placeholder="Seleccione un cliente"
                                value={clienteId}
                                onChange={(value) => setClienteId(String(value))}
                                options={[
                                    { value: 'TODOS', label: 'Todos' },
                                    ...clientes.map((c) => ({
                                        value: c.id,
                                        label: c.nombre,
                                        description: c.email,
                                    })),
                                ]}
                                searchPlaceholder="Buscar cliente..."
                                allowClear={true}
                            />
                        </div>
                        {/* Fecha Desde */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                📅 Desde
                            </label>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Fecha Hasta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                📅 Hasta
                            </label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="flex gap-2 items-end">
                            <button
                                onClick={handleBuscar}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                            >
                                🔍 Buscar
                            </button>
                            <button
                                onClick={handleLimpiar}
                                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
                            >
                                🔄 Limpiar
                            </button>
                        </div>
                    </div>


                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-zinc-700">
                    <button
                        onClick={() => setActiveTab('productos')}
                        className={`px-4 py-2 font-medium transition border-b-2 ${activeTab === 'productos'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                    >
                        📦 Productos Vendidos ({productos.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ventas')}
                        className={`px-4 py-2 font-medium transition border-b-2 ${activeTab === 'ventas'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                    >
                        💳 Ventas Aprobadas ({ventas.length})
                    </button>
                </div>

                {/* Resumen - Solo visible en tab de Productos */}
                {activeTab === 'productos' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Productos Únicos</p>
                            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                {totales.cantidad_productos || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-6 border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-600 dark:text-green-300 font-medium">Cantidad Total Vendida</p>
                            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                                {totales.cantidad_total_vendida?.toFixed(2) || '0.00'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Total Venta General</p>
                            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                {formatCurrencyWith2Decimals(totales.total_venta_general || 0)}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                            <p className="text-sm text-amber-600 dark:text-amber-300 font-medium">Precio Promedio</p>
                            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                                {formatCurrencyWith2Decimals(totales.precio_promedio_general || 0)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tabla de Productos */}
                {activeTab === 'productos' && productos.length > 0 ? (
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-zinc-700 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Producto
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Código
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase bg-blue-50 dark:bg-blue-900/20">
                                        Vendido
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Precio Prom.
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Total Venta
                                    </th>
                                    {/* ✅ NUEVO (2026-04-28): Stock ANTERIOR */}
                                    <th colSpan={3} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase bg-orange-50 dark:bg-orange-900/20">
                                        📊 Stock ANTERIOR
                                    </th>
                                    {/* ✅ NUEVO (2026-04-28): Stock POSTERIOR */}
                                    <th colSpan={3} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase bg-green-50 dark:bg-green-900/20">
                                        📊 Stock POSTERIOR
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan={5} className="px-0"></th>
                                    {/* Headers sub-niveles ANTERIOR */}
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20">Total</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20">Disp.</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20">Res.</th>
                                    {/* Headers sub-niveles POSTERIOR */}
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20">Total</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20">Disp.</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20">Res.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {productos.map((producto) => (
                                    <tr key={producto.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                            {producto.nombre}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                            {producto.codigo}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right bg-blue-50/50 dark:bg-blue-900/10">
                                            {producto.cantidad_total.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                                            {formatCurrencyWith2Decimals(producto.precio_promedio)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                                            {formatCurrencyWith2Decimals(producto.total_venta)}
                                        </td>
                                        {/* Stock ANTERIOR */}
                                        <td className="px-4 py-3 text-sm text-orange-700 dark:text-orange-300 text-right bg-orange-50/50 dark:bg-orange-900/10 font-medium">
                                            {Number(producto.total_anterior || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-orange-700 dark:text-orange-300 text-right bg-orange-50/50 dark:bg-orange-900/10">
                                            {Number(producto.disponible_anterior || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-orange-700 dark:text-orange-300 text-right bg-orange-50/50 dark:bg-orange-900/10">
                                            {Number(producto.reservado_anterior || 0).toFixed(2)}
                                        </td>
                                        {/* Stock POSTERIOR */}
                                        <td className="px-4 py-3 text-sm text-green-700 dark:text-green-300 text-right bg-green-50/50 dark:bg-green-900/10 font-medium">
                                            {Number(producto.total_posterior || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-green-700 dark:text-green-300 text-right bg-green-50/50 dark:bg-green-900/10">
                                            {Number(producto.disponible_posterior || 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-green-700 dark:text-green-300 text-right bg-green-50/50 dark:bg-green-900/10">
                                            {Number(producto.reservado_posterior || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'productos' ? (
                    <div className="bg-white dark:bg-zinc-800 rounded-lg p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No hay productos vendidos en el período seleccionado
                        </p>
                    </div>
                ) : null}

                {/* Tabla de Ventas */}
                {activeTab === 'ventas' && ventas.length > 0 ? (
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-zinc-700">
                                <tr>
                                    <th
                                        onClick={() => setVentasOrder(ventasOrder === 'desc' ? 'asc' : 'desc')}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600 transition"
                                    >
                                        <div className="flex items-center gap-2">
                                            ID
                                            <span className="text-lg">
                                                {ventasOrder === 'desc' ? '↓' : '↑'}
                                            </span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        # Proforma
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        # Venta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Usuario
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Estado Documento
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Estado Entrega
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {ventasOrdenadas.map((venta) => (
                                    <tr key={venta.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {venta.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-purple-600 dark:text-purple-400">
                                                    {venta.proforma_numero}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(venta.proforma_fecha).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {venta.numero}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {venta.cliente}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {venta.usuario}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(venta.fecha).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                venta.estado === 'APROBADO'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : venta.estado === 'PENDIENTE'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    : venta.estado === 'CANCELADO'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                            }`}>
                                                {venta.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {venta.confirmado_en ? (
                                                <div className="flex flex-col gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                                                        venta.estado_entrega === 'ENTREGADO'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                            : venta.estado_entrega === 'NOVEDAD'
                                                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                            : venta.estado_entrega === 'RECHAZADO'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}>
                                                        {venta.estado_entrega}
                                                    </span>
                                                    <button
                                                        onClick={() => handleAbrirDetalleEntrega(venta)}
                                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded text-xs font-medium transition inline-block"
                                                    >
                                                        📋 Ver detalles
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400 text-xs">Sin confirmar</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                                            {formatCurrencyWith2Decimals(venta.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'ventas' ? (
                    <div className="bg-white dark:bg-zinc-800 rounded-lg p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No hay ventas aprobadas en el período seleccionado
                        </p>
                    </div>
                ) : null}
            </div>

            {/* Modal de Impresión/Exportación */}
            <OutputSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                documentoId="reporte"
                tipoDocumento="reporte-productos-vendidos"
                documentoInfo={{
                    numero: 'Reporte de Productos Vendidos',
                    fecha: `${filtros.fecha_desde || fecha_desde} a ${filtros.fecha_hasta || fecha_hasta}`,
                }}
            />

            {/* Modal de Detalles de Entrega */}
            <EntregaDetallesModal
                isOpen={isDeliveryModalOpen}
                venta={selectedVenta}
                onClose={() => {
                    setIsDeliveryModalOpen(false);
                    setSelectedVenta(undefined);
                }}
            />
        </AppLayout>
    );
}

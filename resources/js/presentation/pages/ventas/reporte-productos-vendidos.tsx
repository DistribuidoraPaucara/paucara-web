import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { formatCurrencyWith2Decimals } from '@/lib/utils';
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
    proforma_id?: number;
    proforma_numero: string;
    proforma_fecha?: string;
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
    preventista_id?: number;

    // ✅ NUEVAS RELACIONES COMPLETAS del backend
    proforma?: {
        id: number;
        numero: string;
        fecha: string;
        subtotal: number;
        impuesto: number;
        total: number;
        descuento: number;
        estado_logistica?: {
            id: number;
            codigo: string;
            nombre: string;
            color?: string;
            icono?: string;
        };
    };
    cliente_completo?: {
        id: number;
        nombre: string;
        nit?: string;
        email?: string;
        telefono?: string;
        razon_social?: string;
    };
    usuario_completo?: {
        id: number;
        name: string;
        email: string;
    };
    tipo_pago?: {
        id: number;
        codigo: string;
        nombre: string;
    };
    estado_logistica_completo?: {
        id: number;
        codigo: string;
        nombre: string;
        color?: string;
        icono?: string;
        categoria?: string;
        descripcion?: string;
    };
    entrega?: {
        id: number;
        numero_entrega: string;
        estado: string;
        fecha_entrega?: string;
        observaciones?: string;
    } | null;
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

    // ✅ DEBUG: Mostrar datos que llegan del backend
    React.useEffect(() => {
        console.log('📊 [REPORTE-PRODUCTOS] Datos del Backend:', {
            productos: {
                cantidad: productos.length,
                muestra: productos.slice(0, 2),
            },
            ventas: {
                cantidad: ventas.length,
                muestra: ventas.slice(0, 2),
            },
            totales,
            filtros,
            usuarios: usuarios.length,
            clientes: clientes.length,
            fecha_desde,
            fecha_hasta,
            es_preventista,
            error,
        });
    }, [productos, ventas, totales, filtros, usuarios, clientes, fecha_desde, fecha_hasta, es_preventista, error]);

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

            <div className="px-2 sm:px-2 lg:px-2">
                {/* Header */}
                <div className="mb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                📊 Reporte de Productos Vendidos del Preventista
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Análisis de productos vendidos en proformas convertidas a ventas aprobadas, para los preventistas
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                            >
                                💾 Imp/Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Filtros */}
                <div className="rounded-lg shadow-md p-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🔍 Filtros</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                        {/* Preventista/Usuario Creador */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                📅 Hasta
                            </label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleBuscar}
                                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                            >
                                🔍 Buscar
                            </button>
                            <button
                                onClick={handleLimpiar}
                                className="p-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
                            >
                                🔄 Limpiar
                            </button>
                        </div>
                    </div>


                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-2 border-b border-gray-200 dark:border-zinc-700">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-2">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-center text-blue-600 dark:text-blue-300 font-medium">Productos Únicos</p>
                            <p className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100">
                                {totales.cantidad_productos || 0}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-2 border border-green-200 dark:border-green-800">
                            <p className="text-sm text-center text-green-600 dark:text-green-300 font-medium">Cantidad Total Vendida</p>
                            <p className="text-3xl font-bold text-center text-green-900 dark:text-green-100">
                                {totales.cantidad_total_vendida?.toFixed(2) || '0.00'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                            <p className="text-sm text-center text-purple-600 dark:text-purple-300 font-medium">Total Venta General</p>
                            <p className="text-3xl font-bold text-center text-purple-900 dark:text-purple-100">
                                {formatCurrencyWith2Decimals(totales.total_venta_general || 0)}
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
                                        className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600 transition"
                                    >
                                        <div className="flex items-center gap-2">
                                            #Folio V
                                            <span className="text-lg">
                                                {ventasOrder === 'desc' ? '↓' : '↑'}
                                            </span>
                                        </div>
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        #Folio P
                                    </th>
                                    {/* <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        # Venta
                                    </th> */}
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Cliente
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Creado por
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Fecha
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Estado Documento
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Estado Entrega
                                    </th>
                                    <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {ventasOrdenadas.map((venta) => (
                                    <tr key={venta.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/50">
                                        <td className="px-2 py-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            #{venta.id}
                                        </td>
                                        <td className="px-2 py-2 text-xs">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-small text-xs text-purple-600 dark:text-purple-400">
                                                    #{venta.proforma?.id || "-"}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {venta.proforma?.fecha ? new Date(venta.proforma.fecha).toLocaleDateString('es-ES') : venta.proforma_fecha ? new Date(venta.proforma_fecha).toLocaleDateString('es-ES') : '-'}
                                                </span>
                                            </div>
                                        </td>
                                        {/* <td className="px-2 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {venta.numero}
                                        </td> */}
                                        <td className="px-2 py-2 text-xs text-gray-900 dark:text-white">
                                            {venta.cliente}
                                        </td>
                                        <td className="px-2 py-2 text-xs text-gray-600 dark:text-gray-400">
                                            {venta.usuario}
                                        </td>
                                        <td className="px-2 py-2 text-xs text-gray-600 dark:text-gray-400">
                                            {new Date(venta.fecha).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-2 py-2 text-xs">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                                        <td className="px-2 py-2 text-xs">
                                            {venta.estado_logistica_completo?.nombre || '-'}
                                        </td>
                                        <td className="px-2 py-2 text-xs font-semibold text-green-600 dark:text-green-400 text-right">
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

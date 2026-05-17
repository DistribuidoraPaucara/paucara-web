import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

interface Cliente {
    id: number;
    nombre: string;
}

interface Usuario {
    id: number;
    name: string;
}

interface Venta {
    id: number;
    numero_venta: string;
    cliente_id: number | null;
    usuario_id: number;
    estado: 'BORRADOR' | 'CONFIRMADA' | 'CANCELADA';
    subtotal: number;
    total: number;
    cliente?: Cliente;
    usuario: Usuario;
    detalles_count?: number;
    fecha_venta: string;
    fecha_confirmacion?: string;
}

interface PaginationData {
    data: Venta[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const getEstadoBadgeStyle = (estado: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
        BORRADOR: { bg: 'bg-amber-100', text: 'text-amber-700' },
        CONFIRMADA: { bg: 'bg-green-100', text: 'text-green-700' },
        CANCELADA: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return styles[estado] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export default function ListadoVentas() {
    const [ventas, setVentas] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [buscar, setBuscar] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [page, setPage] = useState(1);

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);

    React.useEffect(() => {
        cargarVentas();
    }, [page, buscar, estadoFiltro]);

    const cargarVentas = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (buscar) params.append('buscar', buscar);
            if (estadoFiltro) params.append('estado', estadoFiltro);
            params.append('page', page.toString());

            const response = await fetch(`/api/prestamos-vendidos?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            if (result.success) {
                setVentas(result.data);
            }
        } catch (error) {
            console.error('Error cargando ventas:', error);
        } finally {
            setLoading(false);
        }
    };

    const abrirModalImpresion = (venta: Venta) => {
        setVentaSeleccionada(venta);
        setShowOutputModal(true);
    };

    const verDetalle = (ventaId: number) => {
        window.location.href = `/prestamos/ventas/${ventaId}`;
    };

    const cancelarVenta = async (ventaId: number) => {
        const motivo = prompt('¿Cuál es el motivo de la cancelación?');
        if (!motivo) return;

        try {
            const response = await fetch(`/api/prestamos-vendidos/${ventaId}/cancelar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo }),
            });

            const result = await response.json();
            if (result.success) {
                alert('✅ Venta cancelada exitosamente');
                cargarVentas();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error cancelando venta:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Préstamos', href: '/prestamos' }, { label: 'Ventas de Prestables' }]}>
            <Head title="Listado de Ventas de Prestables" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🛒 Ventas de Prestables</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Listado de todas las ventas registradas
                        </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => (window.location.href = '/prestamos/ventas/crear')}>
                        ➕ Nueva Venta
                    </Button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Buscar
                            </label>
                            <Input
                                type="text"
                                placeholder="Número venta o cliente..."
                                value={buscar}
                                onChange={(e) => {
                                    setBuscar(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Estado
                            </label>
                            <select
                                value={estadoFiltro}
                                onChange={(e) => {
                                    setEstadoFiltro(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                            >
                                <option value="">Todos los estados</option>
                                <option value="BORRADOR">Borrador</option>
                                <option value="CONFIRMADA">Confirmada</option>
                                <option value="CANCELADA">Cancelada</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de Ventas */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Folio
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Cliente
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Fecha
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Usuario
                                </th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">Cargando...</span>
                                    </td>
                                </tr>
                            ) : ventas?.data && ventas.data.length > 0 ? (
                                ventas.data.map((venta) => {
                                    const estilo = getEstadoBadgeStyle(venta.estado);

                                    return (
                                        <tr
                                            key={venta.id}
                                            className={`border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 ${
                                                venta.estado === 'CANCELADA' ? 'bg-red-50 opacity-60 dark:bg-red-900/10' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {venta.id}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {venta.cliente?.nombre || '(Sin cliente)'}
                                            </td>
                                            {/* <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                                                {venta.detalles_count || 0}
                                            </td> */}
                                            <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                                {(Number(venta.total) || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className={`${estilo.bg} ${estilo.text}`}>
                                                    {venta.estado}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {new Date(venta.fecha_venta).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {venta.usuario.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => verDetalle(venta.id)}
                                                        title="Ver detalle"
                                                    >
                                                        👁️
                                                    </Button>

                                                    {venta.estado === 'CONFIRMADA' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => abrirModalImpresion(venta)}
                                                            title="Imprimir / Descargar"
                                                        >
                                                            🖨️
                                                        </Button>
                                                    )}

                                                    {venta.estado !== 'CANCELADA' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => cancelarVenta(venta.id)}
                                                            title="Cancelar venta"
                                                        >
                                                            ⛔
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">No hay ventas registradas</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {ventas && ventas.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Mostrando página {ventas.current_page} de {ventas.last_page}
                            {' '} ({ventas.total} ventas totales)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                ← Anterior
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === ventas.last_page}
                            >
                                Siguiente →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Modal de selección de formato de impresión */}
                {ventaSeleccionada && (
                    <OutputSelectionModal
                        isOpen={showOutputModal}
                        onClose={() => {
                            setShowOutputModal(false);
                            setVentaSeleccionada(null);
                        }}
                        documentoId={ventaSeleccionada.id}
                        tipoDocumento="prestamos-vendidos"
                        documentoInfo={{
                            numero: ventaSeleccionada.numero_venta,
                            fecha: new Date(ventaSeleccionada.fecha_venta).toLocaleDateString('es-ES'),
                            monto: ventaSeleccionada.total,
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}

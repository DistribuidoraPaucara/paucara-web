import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

interface Proveedor {
    id: number;
    nombre: string;
}

interface Usuario {
    id: number;
    name: string;
}

interface Compra {
    id: number;
    numero_compra: string;
    proveedor_id: number | null;
    usuario_id: number;
    estado: 'BORRADOR' | 'CONFIRMADA' | 'CANCELADA';
    subtotal: number;
    total: number;
    proveedor?: Proveedor;
    usuario: Usuario;
    detalles_count?: number;
    fecha_compra: string;
    fecha_confirmacion?: string;
}

interface PaginationData {
    data: Compra[];
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

export default function ListadoCompras() {
    const [compras, setCompras] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [buscar, setBuscar] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [page, setPage] = useState(1);

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null);

    React.useEffect(() => {
        cargarCompras();
    }, [page, buscar, estadoFiltro]);

    const cargarCompras = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (buscar) params.append('buscar', buscar);
            if (estadoFiltro) params.append('estado', estadoFiltro);
            params.append('page', page.toString());

            const response = await fetch(`/api/compras-prestables?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            if (result.success) {
                setCompras(result.data);
            }
        } catch (error) {
            console.error('Error cargando compras:', error);
        } finally {
            setLoading(false);
        }
    };

    const abrirModalImpresion = (compra: Compra) => {
        setCompraSeleccionada(compra);
        setShowOutputModal(true);
    };

    const verDetalle = (compraId: number) => {
        window.location.href = `/prestamos/compras/${compraId}`;
    };

    const cancelarCompra = async (compraId: number) => {
        const motivo = prompt('¿Cuál es el motivo de la cancelación?');
        if (!motivo) return;

        try {
            const response = await fetch(`/api/compras-prestables/${compraId}/cancelar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo }),
            });

            const result = await response.json();
            if (result.success) {
                alert('✅ Compra cancelada exitosamente');
                cargarCompras();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error cancelando compra:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ label: 'Préstamos', href: '/prestamos' }, { label: 'Compras de Prestables' }]}>
            <Head title="Listado de Compras de Prestables" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📦 Compras de Prestables</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Listado de todas las compras registradas
                        </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => (window.location.href = '/prestamos/compras/crear')}>
                        ➕ Nueva Compra
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
                                placeholder="Número compra o proveedor..."
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

                {/* Tabla de Compras */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Folio
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Proveedor
                                </th>
                                {/* <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Items
                                </th> */}
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
                            ) : compras?.data && compras.data.length > 0 ? (
                                compras.data.map((compra) => {
                                    const estilo = getEstadoBadgeStyle(compra.estado);

                                    return (
                                        <tr
                                            key={compra.id}
                                            className={`border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 ${
                                                compra.estado === 'CANCELADA' ? 'bg-red-50 opacity-60 dark:bg-red-900/10' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {compra.id}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {compra.proveedor?.nombre || '(Sin proveedor)'}
                                            </td>
                                            {/* <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                                                {compra.detalles_count || 0}
                                            </td> */}
                                            <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                                {(Number(compra.total) || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className={`${estilo.bg} ${estilo.text}`}>
                                                    {compra.estado}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {new Date(compra.fecha_compra).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {compra.usuario.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => verDetalle(compra.id)}
                                                        title="Ver detalle"
                                                    >
                                                        👁️
                                                    </Button>

                                                    {compra.estado === 'CONFIRMADA' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => abrirModalImpresion(compra)}
                                                            title="Imprimir / Descargar"
                                                        >
                                                            🖨️
                                                        </Button>
                                                    )}

                                                    {compra.estado !== 'CANCELADA' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => cancelarCompra(compra.id)}
                                                            title="Cancelar compra"
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
                                        <span className="text-slate-500 dark:text-slate-400">No hay compras registradas</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {compras && compras.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Mostrando página {compras.current_page} de {compras.last_page}
                            {' '} ({compras.total} compras totales)
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
                                disabled={page === compras.last_page}
                            >
                                Siguiente →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Modal de selección de formato de impresión */}
                {compraSeleccionada && (
                    <OutputSelectionModal
                        isOpen={showOutputModal}
                        onClose={() => {
                            setShowOutputModal(false);
                            setCompraSeleccionada(null);
                        }}
                        documentoId={compraSeleccionada.id}
                        tipoDocumento="compras-prestables"
                        documentoInfo={{
                            numero: compraSeleccionada.numero_compra,
                            fecha: new Date(compraSeleccionada.fecha_compra).toLocaleDateString('es-ES'),
                            monto: compraSeleccionada.total,
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}

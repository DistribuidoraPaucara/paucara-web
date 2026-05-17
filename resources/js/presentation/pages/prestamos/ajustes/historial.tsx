import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';

interface Ajuste {
    id: number;
    prestable: { id: number; nombre: string; codigo: string };
    almacen_prestable: { id: number; nombre: string };
    usuario: { id: number; name: string };
    cantidad_disponible_antes: number;
    cantidad_en_prestamo_cliente_antes: number;
    cantidad_en_prestamo_proveedor_antes: number;
    cantidad_vendida_antes: number;
    cantidad_disponible_despues: number;
    cantidad_en_prestamo_cliente_despues: number;
    cantidad_en_prestamo_proveedor_despues: number;
    cantidad_vendida_despues: number;
    motivo: string | null;
    comentarios: string | null;
    created_at: string;
}

interface PaginationData {
    data: Ajuste[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function HistorialAjustes() {
    const [ajustes, setAjustes] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [buscar, setBuscar] = useState('');
    const [page, setPage] = useState(1);

    React.useEffect(() => {
        cargarHistorial();
    }, [page, buscar]);

    const cargarHistorial = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (buscar) params.append('buscar', buscar);
            params.append('page', page.toString());

            const response = await fetch(`/api/prestables/ajustes/historial?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            if (result.success) {
                setAjustes(result.data);
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReimprimir = (ajuste: Ajuste) => {
        if (!ajuste.prestable?.id) {
            console.error('Prestable no disponible');
            return;
        }

        const documentoUrl = new URL(
            `/api/prestables/${ajuste.prestable.id}/ajuste-documento`,
            window.location.origin
        );

        documentoUrl.searchParams.append('fecha', new Date(ajuste.created_at).toLocaleString('es-ES'));
        documentoUrl.searchParams.append('almacen', ajuste.almacen_prestable?.nombre || 'N/A');

        // Valores antes
        documentoUrl.searchParams.append('disponible_antes', ajuste.cantidad_disponible_antes.toString());
        documentoUrl.searchParams.append('prestamo_cliente_antes', ajuste.cantidad_en_prestamo_cliente_antes.toString());
        documentoUrl.searchParams.append('prestamo_proveedor_antes', ajuste.cantidad_en_prestamo_proveedor_antes.toString());
        documentoUrl.searchParams.append('vendida_antes', ajuste.cantidad_vendida_antes.toString());

        // Valores después
        documentoUrl.searchParams.append('disponible_despues', ajuste.cantidad_disponible_despues.toString());
        documentoUrl.searchParams.append('prestamo_cliente_despues', ajuste.cantidad_en_prestamo_cliente_despues.toString());
        documentoUrl.searchParams.append('prestamo_proveedor_despues', ajuste.cantidad_en_prestamo_proveedor_despues.toString());
        documentoUrl.searchParams.append('vendida_despues', ajuste.cantidad_vendida_despues.toString());

        documentoUrl.searchParams.append('motivo', ajuste.motivo || '');
        documentoUrl.searchParams.append('comentarios', ajuste.comentarios || '');

        window.open(documentoUrl.toString(), '_blank');
    };

    const calcularCambio = (antes: number, despues: number) => {
        return despues - antes;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Préstamos', href: '/prestamos' }, { title: 'Historial de Ajustes', href: '/prestamos/ajustes/historial' }]}>
            <Head title="Historial de Ajustes de Stock" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">📊 Historial de Ajustes de Stock</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Ver y reimprimir todos los ajustes realizados
                        </p>
                    </div>
                </div>

                {/* Búsqueda */}
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre o código de prestable..."
                        value={buscar}
                        onChange={(e) => {
                            setBuscar(e.target.value);
                            setPage(1);
                        }}
                        className="flex-1"
                    />
                    <Button variant="outline">🔍 Buscar</Button>
                </div>

                {/* Tabla de Ajustes */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Fecha
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Prestable
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Almacén
                                </th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Cambio Total
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
                                    <td colSpan={6} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">Cargando...</span>
                                    </td>
                                </tr>
                            ) : ajustes?.data && ajustes.data.length > 0 ? (
                                ajustes.data.map((ajuste) => {
                                    const totalAntes =
                                        ajuste.cantidad_disponible_antes +
                                        ajuste.cantidad_en_prestamo_cliente_antes +
                                        ajuste.cantidad_en_prestamo_proveedor_antes +
                                        ajuste.cantidad_vendida_antes;

                                    const totalDespues =
                                        ajuste.cantidad_disponible_despues +
                                        ajuste.cantidad_en_prestamo_cliente_despues +
                                        ajuste.cantidad_en_prestamo_proveedor_despues +
                                        ajuste.cantidad_vendida_despues;

                                    const cambio = calcularCambio(totalAntes, totalDespues);
                                    const esPositivo = cambio >= 0;

                                    return (
                                        <tr
                                            key={ajuste.id}
                                            className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {new Date(ajuste.created_at).toLocaleString('es-ES')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {ajuste.prestable?.nombre || 'Sin prestable'}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {ajuste.prestable?.codigo || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {ajuste.almacen_prestable?.nombre || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                                                        esPositivo
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                                >
                                                    {esPositivo ? '+' : ''}{cambio}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {ajuste.usuario?.name || 'Sin usuario'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleReimprimir(ajuste)}
                                                    className="gap-2 text-xs"
                                                >
                                                    🖨️ Reimprimir
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">No hay ajustes registrados</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {ajustes && ajustes.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Mostrando página {ajustes.current_page} de {ajustes.last_page}
                            {' '} ({ajustes.total} ajustes totales)
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
                                disabled={page === ajustes.last_page}
                            >
                                Siguiente →
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

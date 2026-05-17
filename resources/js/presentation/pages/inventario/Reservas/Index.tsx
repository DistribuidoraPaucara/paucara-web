import { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import ReservasStats from './components/ReservasStats';
import ReservasFilters from './components/ReservasFilters';
import ReservasTable from './components/ReservasTable';

interface Reserva {
    id: number;
    proforma_id: number;
    stock_producto_id: number;
    cantidad_reservada: number;
    fecha_reserva: string;
    fecha_expiracion: string;
    estado: string;
    proforma: {
        id: number;
        numero: string;
        estadoLogistica: {
            nombre: string;
        };
        cliente: {
            id: number;
            nombre: string;
        };
    };
    stockProducto: {
        producto: {
            id: number;
            sku: string;
            nombre: string;
        };
        almacen: {
            id: number;
            nombre: string;
        };
    };
}

interface Props {
    reservas: {
        data: Reserva[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    stats: {
        total_activas: number;
        inconsistentes: number;
        proximas_expirar: number;
        stock_bloqueado: number;
    };
    filtros: {
        tipo: string | null;
        estado: string | null;
        busqueda: string | null;
        page: number;
        per_page: number;
    };
}

export default function ReservasIndex({ reservas, stats, filtros }: Props) {
    const [seleccionados, setSeleccionados] = useState<number[]>([]);
    const [cargando, setCargando] = useState(false);

    const handleSeleccionar = useCallback((id: number) => {
        setSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }, []);

    const handleSeleccionarTodos = useCallback(() => {
        if (seleccionados.length === reservas.data.length) {
            setSeleccionados([]);
        } else {
            setSeleccionados(reservas.data.map((r) => r.id));
        }
    }, [reservas.data, seleccionados.length]);

    const handleLiberarMasivo = useCallback(async () => {
        if (!confirm(`¿Liberar ${seleccionados.length} reservas?`)) return;

        setCargando(true);
        try {
            const response = await fetch('/inventario/reservas/liberar-masivo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ reserva_ids: seleccionados }),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error al liberar reservas');
            }
        } finally {
            setCargando(false);
        }
    }, [seleccionados]);

    return (
        <AppLayout>
            <Head title="Gestión de Reservas de Inventario" />

            <div className="space-y-6">
                {/* Encabezado */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Reservas</h1>
                    <p className="text-muted-foreground mt-2">
                        Administra reservas de inventario y libera stock bloqueado innecesariamente
                    </p>
                </div>

                {/* Estadísticas */}
                <ReservasStats stats={stats} />

                {/* Tarjeta principal */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reservas de Inventario</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filtros */}
                        <ReservasFilters filtros={filtros} />

                        {/* Acciones masivas */}
                        {seleccionados.length > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                                <span className="text-sm text-blue-800 dark:text-blue-200">
                                    {seleccionados.length} reservas seleccionadas
                                </span>
                                <Button
                                    onClick={handleLiberarMasivo}
                                    disabled={cargando}
                                    size="sm"
                                    variant="destructive"
                                >
                                    {cargando ? 'Liberando...' : 'Liberar Seleccionadas'}
                                </Button>
                            </div>
                        )}

                        {/* Tabla */}
                        <ReservasTable
                            reservas={reservas.data}
                            seleccionados={seleccionados}
                            onSeleccionar={handleSeleccionar}
                            onSeleccionarTodos={handleSeleccionarTodos}
                            todosSeleccionados={
                                reservas.data.length > 0 && seleccionados.length === reservas.data.length
                            }
                            algunoSeleccionado={seleccionados.length > 0}
                        />

                        {/* Paginación */}
                        {reservas.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {reservas.data.length} de {reservas.total} reservas
                                </div>
                                <div className="flex gap-2">
                                    {Array.from({ length: reservas.last_page }, (_, i) => i + 1).map((page) => (
                                        <a
                                            key={page}
                                            href={`?page=${page}`}
                                            className={`px-3 py-1 rounded text-sm ${
                                                page === reservas.current_page
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'border hover:bg-muted'
                                            }`}
                                        >
                                            {page}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

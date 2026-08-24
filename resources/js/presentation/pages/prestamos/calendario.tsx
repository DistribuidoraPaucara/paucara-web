import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import CalendarGrid from '@/presentation/components/prestamos/calendar-grid';
import PrestamosFilters from '@/presentation/components/prestamos/prestamos-filters';
import { format, addMonths, subMonths, parse } from 'date-fns';
import { es } from 'date-fns/locale';

interface Prestamo {
    id: number;
    tipo: 'cliente' | 'evento' | 'proveedor';
    tabla: string;
    fecha: string;
    nombre: string;
    encargado?: string;
    estado: string;
    cantidad_items: number;
    monto_garantia: number;
    observaciones: string;
    fecha_prestamo: string;
}

interface CalendarioProps {
    mesActual: string;
}

export default function PrestamosCalendario({ mesActual }: CalendarioProps) {
    const [mes, setMes] = useState<string>(mesActual);
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        tipo: ['cliente', 'evento', 'proveedor'],
        estado: [],
        busqueda: '',
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Cargar préstamos cuando cambia el mes o los filtros
    useEffect(() => {
        cargarPrestamos();
    }, [mes, filtros]);

    const cargarPrestamos = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('mes', mes);
            params.append('tipo', filtros.tipo.join(','));
            if (filtros.estado.length > 0) {
                params.append('estado', filtros.estado.join(','));
            }
            if (filtros.busqueda) {
                params.append('busqueda', filtros.busqueda);
            }

            const response = await fetch(`/api/prestamos/calendario?${params}`);
            const data = await response.json();

            if (data.success) {
                setPrestamos(data.data);
            }
        } catch (error) {
            console.error('Error cargando préstamos:', error);
        } finally {
            setLoading(false);
        }
    };

    const mesActualObj = parse(mes, 'yyyy-MM', new Date());
    const mesAnterior = format(subMonths(mesActualObj, 1), 'yyyy-MM');
    const mesSiguiente = format(addMonths(mesActualObj, 1), 'yyyy-MM');

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Préstamos', href: '/prestamos' },
                { title: 'Calendario', href: '/prestamos/calendario' },
            ]}
        >
            <Head title="Calendario de Entregas - Préstamos" />

            <div className="space-y-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            📅 Calendario de Entregas
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Gestiona las fechas de entrega de préstamos
                        </p>
                    </div>
                    <button
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </button>
                </div>

                {/* Filtros (colapsable) */}
                {mostrarFiltros && (
                    <PrestamosFilters
                        filtros={filtros}
                        onFiltrosChange={setFiltros}
                    />
                )}

                {/* Controles del calendario */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                    <button
                        onClick={() => setMes(mesAnterior)}
                        className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {format(mesActualObj, 'MMMM yyyy', { locale: es })}
                    </h2>

                    <button
                        onClick={() => setMes(mesSiguiente)}
                        className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total préstamos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{prestamos.length}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Clientes</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {prestamos.filter((p) => p.tipo === 'cliente').length}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Eventos</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {prestamos.filter((p) => p.tipo === 'evento').length}
                        </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Proveedores</p>
                        <p className="text-2xl font-bold text-green-600">
                            {prestamos.filter((p) => p.tipo === 'proveedor').length}
                        </p>
                    </div>
                </div>

                {/* Calendario */}
                {loading ? (
                    <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-gray-500 dark:text-gray-400">Cargando préstamos...</p>
                    </div>
                ) : (
                    <CalendarGrid prestamos={prestamos} mes={mes} />
                )}
            </div>
        </AppLayout>
    );
}

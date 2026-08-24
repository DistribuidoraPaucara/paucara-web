import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import CalendarioVencimientosGrid from '@/presentation/components/admin/calendario-vencimientos-grid';
import FiltrosVencimientos from '@/presentation/components/admin/filtros-vencimientos';
import { format, addMonths, subMonths, parse } from 'date-fns';
import { es } from 'date-fns/locale';

interface Vencimiento {
    id: number;
    tipo: 'prestamo_cliente' | 'prestamo_evento' | 'prestamo_proveedor' | 'cuenta_por_cobrar';
    categoria: string;
    fecha: string;
    nombre: string;
    estado: string;
    monto: number;
    cantidad_items: number;
    referencia: string;
    observaciones?: string;
    link: string;
}

interface CalendarioVencimientosProps {
    mesActual: string;
}

export default function CalendarioVencimientos({ mesActual }: CalendarioVencimientosProps) {
    const [mes, setMes] = useState<string>(mesActual);
    const [vencimientos, setVencimientos] = useState<Vencimiento[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState({
        tipo: ['prestamos', 'cuentas'],
        estado: [],
        busqueda: '',
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    useEffect(() => {
        cargarVencimientos();
    }, [mes, filtros]);

    const cargarVencimientos = async () => {
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

            const response = await fetch(`/api/calendario-vencimientos?${params}`);
            const data = await response.json();

            if (data.success) {
                setVencimientos(data.data);
            }
        } catch (error) {
            console.error('Error cargando vencimientos:', error);
        } finally {
            setLoading(false);
        }
    };

    const mesActualObj = parse(mes, 'yyyy-MM', new Date());
    const mesAnterior = format(subMonths(mesActualObj, 1), 'yyyy-MM');
    const mesSiguiente = format(addMonths(mesActualObj, 1), 'yyyy-MM');

    // Estadísticas
    const totalVencimientos = vencimientos.length;
    const montoTotal = vencimientos.reduce((sum, v) => sum + Number(v.monto), 0);
    const vencidosCount = vencimientos.filter((v) => {
        const dias = Math.floor((new Date(v.fecha).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return dias < 0;
    }).length;
    const urgentesCount = vencimientos.filter((v) => {
        const dias = Math.floor((new Date(v.fecha).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return dias >= 0 && dias <= 7;
    }).length;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Calendario de Vencimientos', href: '/admin/calendario-vencimientos' },
            ]}
        >
            <Head title="Calendario de Vencimientos" />

            <div className="space-y-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            📅 Calendario de Vencimientos
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Préstamos + Cuentas por Cobrar
                        </p>
                    </div>
                    <button
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </button>
                </div>

                {/* Filtros */}
                {mostrarFiltros && (
                    <FiltrosVencimientos filtros={filtros} onFiltrosChange={setFiltros} />
                )}

                {/* Controles del calendario */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                    <button
                        onClick={() => setMes(mesAnterior)}
                        className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total vencimientos</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalVencimientos}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monto total</p>
                        <p className="text-2xl font-bold text-green-600">
                            Bs {montoTotal.toLocaleString('es-ES', { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                        <p className="text-sm text-red-600 dark:text-red-400">Vencidos</p>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{vencidosCount}</p>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                        <p className="text-sm text-orange-600 dark:text-orange-400">Próximos (≤7 días)</p>
                        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{urgentesCount}</p>
                    </div>
                </div>

                {/* Calendario */}
                {loading ? (
                    <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12 dark:border-zinc-700 dark:bg-zinc-900">
                        <p className="text-gray-500 dark:text-gray-400">Cargando vencimientos...</p>
                    </div>
                ) : (
                    <CalendarioVencimientosGrid vencimientos={vencimientos} mes={mes} />
                )}
            </div>
        </AppLayout>
    );
}

import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import FiltrosEgresos from './components/FiltrosEgresos';
import ResumenEgresos from './components/ResumenEgresos';
import GraficoEgresoPorCategoria from './components/GraficoEgresoPorCategoria';
import GraficoEgresoPorTipo from './components/GraficoEgresoPorTipo';
import TablaEgresos from './components/TablaEgresos';
import ComparativaPeriocos from './components/ComparativaPeriocos';

interface Filtros {
    fecha_desde?: string;
    fecha_hasta?: string;
    tipo_operacion_id?: number;
    categoria?: string;
    monto_min?: number;
    monto_max?: number;
    estado_caja?: 'abierta' | 'cerrada' | 'todas';
    per_page?: number;
}

export default function Index() {
    const [filtros, setFiltros] = useState<Filtros>({
        estado_caja: 'todas',
        per_page: 15,
    });

    const [datos, setDatos] = useState<any>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos cuando cambien los filtros
    useEffect(() => {
        cargarDatos();
    }, [filtros]);

    const cargarDatos = async () => {
        setCargando(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
            if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
            if (filtros.tipo_operacion_id) params.append('tipo_operacion_id', filtros.tipo_operacion_id.toString());
            if (filtros.categoria) params.append('categoria', filtros.categoria);
            if (filtros.monto_min) params.append('monto_min', filtros.monto_min.toString());
            if (filtros.monto_max) params.append('monto_max', filtros.monto_max.toString());
            if (filtros.estado_caja) params.append('estado_caja', filtros.estado_caja);
            if (filtros.per_page) params.append('per_page', filtros.per_page.toString());

            const response = await fetch(`/api/egresos?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar datos de egresos');
            }

            const resultado = await response.json();
            setDatos(resultado.data);
        } catch (err: any) {
            setError(err.message);
            toast.error('Error al cargar datos: ' + err.message);
        } finally {
            setCargando(false);
        }
    };

    const handleFiltrosChange = (nuevosFiltros: Filtros) => {
        setFiltros(nuevosFiltros);
    };

    return (
        <AppLayout>
            <Head title="Análisis de Egresos" />

            <div className="px-2 py-2">
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            📊 Análisis de Egresos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Monitorea y analiza todos los egresos del sistema
                        </p>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            🔍 Filtros
                        </h2>
                        <FiltrosEgresos
                            filtros={filtros}
                            onFiltrosChange={handleFiltrosChange}
                            cargando={cargando}
                        />
                    </div>

                    {/* Resumen y Comparativa */}
                    {/* {datos && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ResumenEgresos totales={datos.totales} />
                            <ComparativaPeriocos comparativa={datos.comparativa_periodo_anterior} />
                        </div>
                    )} */}

                    {/* Tabs: Gráficos y Tabla */}
                    {datos && (
                        <Tabs defaultValue="graficos" className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <div className="px-6 pb-0">
                                    <TabsList className="bg-transparent border-gray-200 dark:border-gray-700">
                                        <TabsTrigger value="graficos" className="dark:text-gray-300">
                                            📈 Gráficos
                                        </TabsTrigger>
                                        <TabsTrigger value="tabla" className="dark:text-gray-300">
                                            📋 Detalle
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>

                            {/* Tab: Gráficos */}
                            <TabsContent value="graficos">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                        <GraficoEgresoPorCategoria datos={datos.por_categoria} />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                        <GraficoEgresoPorTipo datos={datos.por_tipo} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Tab: Tabla Detallada */}
                            <TabsContent value="tabla">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <TablaEgresos
                                        egresos={datos.egresos}
                                        cargando={cargando}
                                        onPageChange={(page) => {
                                            // Implementar paginación si es necesario
                                        }}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}

                    {cargando && (
                        <div className="flex justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                            <p className="text-red-800 dark:text-red-300">
                                ❌ Error: {error}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

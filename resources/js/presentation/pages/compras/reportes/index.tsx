import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { FileText } from 'lucide-react';

// Domain types
import type { ReportesComprasPageProps, FormatoExportacion } from '@/domain/entities/compras-reportes';

// Application hooks
import { useReportesCompras } from '@/application/hooks/use-reportes-compras';

// Sub-components
import { FiltrosReportes } from '@/presentation/components/compras/Reportes/FiltrosReportes';
import { TarjetasEstadisticas } from '@/presentation/components/compras/Reportes/TarjetasEstadisticas';
import { TablaTendencias } from '@/presentation/components/compras/Reportes/TablaTendencias';
import { TablaProveedores } from '@/presentation/components/compras/Reportes/TablaProveedores';
import { SeccionCategorias } from '@/presentation/components/compras/Reportes/SeccionCategorias';
import { TablaComparativo } from '@/presentation/components/compras/Reportes/TablaComparativo';

/**
 * Página: Reportes de Compras
 *
 * Renderiza reportes y análisis de compras con:
 * - Filtros personalizables
 * - Estadísticas generales
 * - Análisis por tendencias, proveedores, categorías y comparativo
 *
 * Arquitectura:
 * - Usa hook useReportesCompras para manejo de lógica
 * - Delega renderizado a sub-componentes especializados
 * - Importa tipos del dominio para type-safety
 */
export default function ReportesCompras({
    estadisticas_generales,
    resumen_por_periodo,
    compras_por_proveedor,
    compras_por_categoria,
    tendencias_mensuales,
    proveedores,
    monedas,
    filtros,
}: ReportesComprasPageProps) {
    // ✅ Hook de aplicación para manejo de lógica
    const {
        filtroLocal,
        actualizarFiltro,
        cargando,
        error,
        aplicarFiltros,
        exportarReporte,
        limpiarFiltros,
    } = useReportesCompras(filtros);

    return (
        <AppLayout>
            <Head title="Reportes de Compras" />

            <div className="space-y-6 p-6">
                {/* Header con botones de exportación */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Reportes de Compras
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Análisis detallado de las compras y tendencias del negocio
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* <Button
                            variant="outline"
                            onClick={() => exportarReporte('excel' as FormatoExportacion)}
                            disabled={cargando}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Excel
                        </Button> */}
                        <Button
                            variant="outline"
                            onClick={() => exportarReporte('pdf' as FormatoExportacion)}
                            disabled={cargando}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            PDF
                        </Button>
                    </div>
                </div>

                {/* ✅ Componente de Filtros */}
                <FiltrosReportes
                    filtros={filtroLocal}
                    onFiltroChange={actualizarFiltro}
                    onAplicarFiltros={aplicarFiltros}
                    onLimpiarFiltros={limpiarFiltros}
                    cargando={cargando}
                    error={error}
                    proveedores={proveedores}
                    monedas={monedas}
                />

                {/* ✅ Componente de Estadísticas Generales */}
                <TarjetasEstadisticas estadisticas={estadisticas_generales} />

                {/* ✅ Tabs con reportes detallados */}
                <Tabs defaultValue="tendencias" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
                        <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
                        <TabsTrigger value="categorias">Categorías</TabsTrigger>
                        <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
                    </TabsList>

                    {/* Tab: Tendencias */}
                    <TabsContent value="tendencias">
                        <TablaTendencias tendencias={tendencias_mensuales} />
                    </TabsContent>

                    {/* Tab: Proveedores */}
                    <TabsContent value="proveedores">
                        <TablaProveedores compras={compras_por_proveedor} />
                    </TabsContent>

                    {/* Tab: Categorías */}
                    <TabsContent value="categorias">
                        <SeccionCategorias categorias={compras_por_categoria} />
                    </TabsContent>

                    {/* Tab: Comparativo */}
                    <TabsContent value="comparativo">
                        <TablaComparativo periodos={resumen_por_periodo} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

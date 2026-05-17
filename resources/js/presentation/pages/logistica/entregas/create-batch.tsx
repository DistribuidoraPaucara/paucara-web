import { Head } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useEntregaBatch } from '@/application/hooks/use-entrega-batch';
import BatchVentaSelector from './components/BatchVentaSelector';
import BatchVehiculoAssignment from './components/BatchVehiculoAssignment';
import BatchOptimizationResult from './components/BatchOptimizationResult';
import { Card } from '@/presentation/components/ui/card';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { AlertCircle, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

interface Venta {
    id: number;
    numero_venta: string;
    total: number;
    fecha_venta: string;
    cliente: {
        id: number;
        nombre: string;
    };
    cantidad_items: number;
    peso_estimado: number;
}

interface Vehiculo {
    id: number;
    placa: string;
    marca: string;
    modelo: string;
    capacidad_kg: number;
}

interface Chofer {
    id: number;
    nombre: string;
    email?: string;
}

interface Props extends PageProps {
    ventas: Venta[];
    vehiculos: Vehiculo[];
    choferes: Chofer[];
}

/**
 * Página de Crear Entregas en Lote - FASE 2
 *
 * Features:
 * ✅ Selección múltiple de ventas
 * ✅ Asignación de vehículo y chofer
 * ✅ Preview de optimización sin crear
 * ✅ Creación masiva con historial
 * ✅ Dark mode completo
 */
export default function CreateBatch({ ventas, vehiculos, choferes }: Props) {
    const {
        formData,
        isLoading,
        isSubmitting,
        preview,
        previewError,
        submitError,
        successMessage,
        updateFormData,
        toggleVenta,
        selectAllVentas,
        clearVentas,
        obtenerPreview,
        handleSubmit,
        handleCancel,
    } = useEntregaBatch();

    // Calcular peso total seleccionado
    const pesoTotalSeleccionado = ventas
        .filter((v) => formData.venta_ids.includes(v.id))
        .reduce((sum, v) => sum + v.peso_estimado, 0);

    // Validaciones
    const puedeVerPreview =
        formData.venta_ids.length > 0 && formData.vehiculo_id && formData.chofer_id;
    const puedeCrear =
        puedeVerPreview &&
        pesoTotalSeleccionado > 0 &&
        formData.vehiculo_id &&
        formData.chofer_id;

    const selectedVehiculo = vehiculos.find((v) => v.id === formData.vehiculo_id);
    const capacidadInsuficiente =
        selectedVehiculo && pesoTotalSeleccionado > selectedVehiculo.capacidad_kg;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Logística', href: '/logistica' },
                { title: 'Entregas', href: '/logistica/entregas' },
                { title: 'Crear en Lote', href: '#' },
            ]}
        >
            <Head title="Crear Entregas en Lote - Optimización Masiva" />

            <div className="min-h-screen bg-white dark:bg-slate-950 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado */}
                    <div className="mb-6">
                        <button
                            onClick={handleCancel}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a entregas
                        </button>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Crear Entregas en Lote
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Optimiza la creación de múltiples entregas con algoritmos de rutas inteligentes
                        </p>
                    </div>

                    {/* Mensajes de estado */}
                    {successMessage && (
                        <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-green-800 dark:text-green-200">¡Éxito!</h3>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        {successMessage}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {submitError && (
                        <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-800 dark:text-red-200">Error</h3>
                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{submitError}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Contenido principal - Grid de 3 columnas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Panel Izquierdo - Selección de Ventas */}
                        <div className="lg:col-span-1">
                            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                                <BatchVentaSelector
                                    ventas={ventas}
                                    selectedIds={formData.venta_ids}
                                    onToggleVenta={toggleVenta}
                                    onSelectAll={() => selectAllVentas(ventas.map((v) => v.id))}
                                    onClearSelection={clearVentas}
                                />
                            </Card>
                        </div>

                        {/* Panel Derecho - Asignación de Recursos y Preview */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Asignación de Vehículo y Chofer */}
                            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                                <BatchVehiculoAssignment
                                    vehiculos={vehiculos}
                                    choferes={choferes}
                                    selectedVehiculoId={formData.vehiculo_id}
                                    selectedChoferId={formData.chofer_id}
                                    pesoTotal={pesoTotalSeleccionado}
                                    onVehiculoSelect={(id) => updateFormData({ vehiculo_id: id })}
                                    onChoferSelect={(id) => updateFormData({ chofer_id: id })}
                                />
                            </Card>

                            {/* Opciones de optimización */}
                            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Checkbox
                                        checked={formData.optimizar}
                                        onChange={(checked) =>
                                            updateFormData({ optimizar: checked })
                                        }
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Calcular optimización de rutas
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Usa algoritmos inteligentes para sugerir el mejor orden de entregas
                                        </p>
                                    </div>
                                </label>
                            </Card>

                            {/* Preview de Optimización */}
                            {formData.optimizar && (
                                <div className="space-y-3">
                                    <button
                                        onClick={obtenerPreview}
                                        disabled={!puedeVerPreview || isLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Calculando...' : 'Ver Preview de Optimización'}
                                    </button>
                                    <BatchOptimizationResult
                                        preview={preview}
                                        error={previewError}
                                        isLoading={isLoading}
                                    />
                                </div>
                            )}

                            {/* Advertencias */}
                            {capacidadInsuficiente && (
                                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                                Capacidad insuficiente
                                            </p>
                                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                                El peso total ({pesoTotalSeleccionado.toFixed(1)} kg) excede la
                                                capacidad del vehículo ({selectedVehiculo?.capacidad_kg} kg)
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!puedeCrear || capacidadInsuficiente || isSubmitting}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:bg-green-700 dark:hover:bg-green-600 dark:disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed inline-flex items-center gap-2"
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Entregas'}
                            {!isSubmitting && <ChevronRight className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

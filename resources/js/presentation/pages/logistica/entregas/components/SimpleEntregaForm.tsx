/**
 * Presentación: Componente SimpleEntregaForm (Mejorado)
 *
 * ARQUITECTURA LIMPIA:
 * ✅ Solo renderiza UI
 * ✅ Delega lógica a hooks especializados
 * ✅ Usa SearchSelect para mejor UX
 * ✅ Usa tipos de domain (EntregaFormData)
 *
 * FLUJO MEJORADO (FASE 2):
 * 1. useSimpleEntregaForm: Validación y transformación de datos
 * 2. useSimpleEntregaWithLoading: Crea entrega + Genera reporte automáticamente
 * 3. Componente renderiza: UI con estados de loading y errores
 * 4. Botón mejorado: "Crear y Generar Carga" (ambas operaciones en una transacción lógica)
 *
 * NUEVAS CARACTERÍSTICAS:
 * - Generación automática de reporte de carga
 * - Peso calculado desde detalles de venta
 * - Indicador de progreso durante ambas operaciones
 * - Manejo de errores específicos por operación
 * - Redirección a detalle de entrega al completar
 */

import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import SearchSelect from '@/presentation/components/ui/search-select';
import { AlertCircle, Package, Loader } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { VentaConDetalles, VehiculoCompleto, ChoferEntrega, EntregaFormData } from '@/domain/entities/entregas';
import { useSimpleEntregaForm } from '@/application/hooks/use-simple-entrega-form';
import { useSimpleEntregaWithLoading } from '@/application/hooks/use-simple-entrega-with-loading';

interface SimpleEntregaFormProps {
    venta: VentaConDetalles;
    vehiculos: VehiculoCompleto[];
    choferes: ChoferEntrega[];
    onSubmit: (data: EntregaFormData) => Promise<void>;
}

export default function SimpleEntregaForm({
    venta,
    vehiculos,
    choferes,
}: SimpleEntregaFormProps) {
    // ==================== OBTENER ERRORES DE INERTIA.JS ====================
    // Inertia.js proporciona los errores de validación del servidor cuando redirige atrás
    const { errors: serverErrors } = usePage().props;

    // ==================== LÓGICA DELEGADA A HOOKS ====================
    // useSimpleEntregaForm: validación, transformación de datos, conversión a SelectOptions
    const {
        formData,
        errors,
        vehiculosOptions,
        choferesOptions,
        selectedVehiculo,
        pesoEstimado,
        capacidadInsuficiente,
        vehiculoTieneChofer,
        isFormValid,
        validate,
        handleFieldChange,
        handleVehiculoSelect,
        handleChoferSelect,
    } = useSimpleEntregaForm(venta, vehiculos, choferes);

    // useSimpleEntregaWithLoading: Crear entrega + Generar reporte automáticamente
    const { submitEntregaWithReporte, isLoading: isLoadingReporte, error: errorReporte } =
        useSimpleEntregaWithLoading(venta);

    // ==================== HANDLER DE SUBMIT ====================
    // Ahora ejecuta ambas operaciones: crear entrega + generar reporte
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            // Usar el nuevo hook que maneja ambas operaciones
            await submitEntregaWithReporte(formData);
        } catch (error) {
            console.error('Error al crear entrega y generar carga:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Errores del nuevo hook (crear entrega + generar reporte) */}
            {errorReporte && (
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
                            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{errorReporte}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Errores del servidor (Inertia.js) */}
            {serverErrors && Object.keys(serverErrors).length > 0 && (
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800 dark:text-red-200">
                                Errores de validación
                            </h3>
                            <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300">
                                {Object.entries(serverErrors).map(([field, messages]: [string, any]) => {
                                    const msgs = Array.isArray(messages) ? messages : [messages];
                                    return (
                                        <li key={field}>
                                            <strong>{field}:</strong> {msgs.join(', ')}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </Card>
            )}

            {/* Resumen de Venta */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 p-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                            Venta: {venta.numero_venta}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300 ml-7">
                        <div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                Cliente
                            </p>
                            <p className="font-semibold">{venta.cliente.nombre}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                Monto Total
                            </p>
                            <p className="font-semibold">Bs {venta.subtotal.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                Items
                            </p>
                            <p className="font-semibold">{venta.cantidad_items ?? 0} productos</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                Peso Estimado
                            </p>
                            <p className="font-semibold">{pesoEstimado.toFixed(1)} kg</p>
                        </div>
                    </div>

                    {/* Ventana de Entrega Comprometida (heredada de proforma) */}
                    {(venta.fecha_entrega_comprometida || venta.ventana_entrega_ini) && (
                        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">
                                📅 Ventana de Entrega Comprometida
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {venta.fecha_entrega_comprometida && (
                                    <div className="text-xs">
                                        <span className="text-blue-600 dark:text-blue-300 font-medium">Fecha: </span>
                                        <span className="text-blue-900 dark:text-blue-100">
                                            {new Date(venta.fecha_entrega_comprometida).toLocaleDateString('es-BO')}
                                        </span>
                                    </div>
                                )}
                                {venta.hora_entrega_comprometida && (
                                    <div className="text-xs">
                                        <span className="text-blue-600 dark:text-blue-300 font-medium">Hora: </span>
                                        <span className="text-blue-900 dark:text-blue-100">
                                            {venta.hora_entrega_comprometida}
                                        </span>
                                    </div>
                                )}
                                {venta.ventana_entrega_ini && venta.ventana_entrega_fin && (
                                    <div className="text-xs col-span-2">
                                        <span className="text-blue-600 dark:text-blue-300 font-medium">Ventana: </span>
                                        <span className="text-blue-900 dark:text-blue-100">
                                            {venta.ventana_entrega_ini} - {venta.ventana_entrega_fin}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
                <Card className="dark:bg-slate-900 dark:border-slate-700 p-6 space-y-6">
                    {/* Vehículo - Usa SearchSelect */}
                    <SearchSelect
                        label="Vehículo"
                        placeholder="Buscar vehículo..."
                        value={formData.vehiculo_id ?? ''}
                        options={vehiculosOptions}
                        onChange={handleVehiculoSelect}
                        error={errors.vehiculo_id}
                        required
                        searchPlaceholder="Buscar por placa, marca o modelo..."
                        allowClear
                    />

                    {/* Advertencia de capacidad insuficiente */}
                    {capacidadInsuficiente && (
                        <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-800 dark:text-red-300">
                                <p className="font-semibold">Capacidad insuficiente</p>
                                <p className="text-xs mt-1">
                                    El peso estimado ({pesoEstimado.toFixed(1)} kg) excede la capacidad
                                    del vehículo ({(selectedVehiculo?.capacidad_kg ?? 0).toFixed(1)} kg)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Chofer - Mostrar/ocultar según si vehículo tiene chofer */}
                    {vehiculoTieneChofer ? (
                        // Si el vehículo tiene chofer asociado, mostrar badge
                        <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    ✅ Chofer asignado al vehículo
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                    {selectedVehiculo?.chofer?.nombre || selectedVehiculo?.chofer?.name}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleChoferSelect('')}
                                className="text-xs text-green-600 dark:text-green-400 hover:underline self-center font-medium"
                            >
                                Cambiar
                            </button>
                        </div>
                    ) : (
                        // Si no tiene chofer, mostrar SearchSelect para seleccionar
                        <SearchSelect
                            label="Chofer"
                            placeholder="Buscar chofer..."
                            value={formData.chofer_id ?? ''}
                            options={choferesOptions}
                            onChange={handleChoferSelect}
                            error={errors.chofer_id}
                            required
                            searchPlaceholder="Buscar por nombre o email..."
                            allowClear
                        />
                    )}

                    {/* Fecha Programada */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Fecha y Hora Programada *
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.fecha_programada}
                            onChange={(e) =>
                                handleFieldChange('fecha_programada', e.target.value)
                            }
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white transition-colors ${errors.fecha_programada
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-300 dark:border-slate-600'
                                }`}
                        />
                        {errors.fecha_programada && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.fecha_programada}
                            </p>
                        )}
                    </div>

                    {/* Dirección de Entrega */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Dirección de Entrega *
                        </label>
                        <input
                            type="text"
                            value={formData.direccion_entrega || ''}
                            onChange={(e) =>
                                handleFieldChange('direccion_entrega', e.target.value)
                            }
                            placeholder="Ej: Calle Principal 123, Zona Sur"
                            className={`w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-white transition-colors ${errors.direccion_entrega
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-300 dark:border-slate-600'
                                }`}
                        />
                        {errors.direccion_entrega && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.direccion_entrega}
                            </p>
                        )}
                    </div>

                    {/* Observaciones (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Observaciones (opcional)
                        </label>
                        <textarea
                            value={formData.observaciones || ''}
                            onChange={(e) =>
                                handleFieldChange('observaciones', e.target.value)
                            }
                            rows={3}
                            placeholder="Notas adicionales para la entrega (horario, instrucciones especiales, etc.)"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white transition-colors"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-4 border-t dark:border-slate-700">
                        <Button
                            type="submit"
                            disabled={isLoadingReporte || !isFormValid}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:bg-green-700 dark:hover:bg-green-600 disabled:cursor-not-allowed text-white"
                        >
                            {isLoadingReporte ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Creando y Generando Carga...
                                </>
                            ) : (
                                'Crear y Generar Carga'
                            )}
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    );
}

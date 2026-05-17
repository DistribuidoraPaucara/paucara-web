import { Label } from '@/presentation/components/ui/label';
import { Card } from '@/presentation/components/ui/card';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Input } from '@/presentation/components/ui/input';
import { CheckCircle2, Package, MapPin, Truck, Calendar } from 'lucide-react';
import type { VentaConDetalles, VehiculoCompleto, ChoferEntrega } from '@/domain/entities/entregas';
import type { WizardFormData } from '../EntregaFormWizard';

interface WizardStep3ConfirmarProps {
    venta: VentaConDetalles;
    vehiculo?: VehiculoCompleto;
    chofer?: ChoferEntrega;
    formData: WizardFormData;
    onUpdate: (data: Partial<WizardFormData>) => void;
}

export default function WizardStep3Confirmar({
    venta,
    vehiculo,
    chofer,
    formData,
    onUpdate,
}: WizardStep3ConfirmarProps) {
    return (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Verifica los detalles antes de crear la entrega. Puedes hacer cambios si es necesario.
                    </p>
                </div>
            </div>

            {/* Resumen de venta */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Información de la Venta
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Número</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {venta.numero_venta}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cliente</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {venta.cliente.nombre}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                Bs {venta.subtotal.toLocaleString('es-BO', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Artículos</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {venta.detalles?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Resumen de recursos */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Recursos Asignados
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Vehículo */}
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vehículo</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {vehiculo?.placa || 'No asignado'}
                            </p>
                            {vehiculo && (
                                <>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {vehiculo.marca} {vehiculo.modelo}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Capacidad: {vehiculo.capacidad_kg || 'N/A'} kg
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Chofer */}
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chofer</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {chofer?.nombre || chofer?.name || 'No asignado'}
                            </p>
                            {chofer?.licencia && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Lic: {chofer.licencia}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Validación de capacidad */}
                    {vehiculo && formData.peso_kg && (
                        <div
                            className={`rounded-lg p-3 ${formData.peso_kg <= (vehiculo.capacidad_kg || 0)
                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                }`}
                        >
                            <p className="text-sm font-medium">
                                {formData.peso_kg} kg / {vehiculo.capacidad_kg} kg capacidad
                            </p>
                            <p
                                className={`text-xs mt-1 ${formData.peso_kg <= (vehiculo.capacidad_kg || 0)
                                        ? 'text-green-700 dark:text-green-200'
                                        : 'text-red-700 dark:text-red-200'
                                    }`}
                            >
                                {formData.peso_kg <= (vehiculo.capacidad_kg || 0)
                                    ? `✓ Espacio disponible: ${((vehiculo.capacidad_kg || 0) - formData.peso_kg).toFixed(1)} kg`
                                    : `✗ Sobrepeso: ${(formData.peso_kg - (vehiculo.capacidad_kg || 0)).toFixed(1)} kg`}
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Detalles de entrega */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Detalles de Entrega
                    </h3>

                    {/* Dirección */}
                    <div>
                        <Label htmlFor="direccion" className="dark:text-gray-300">
                            Dirección de Entrega
                        </Label>
                        <Input
                            id="direccion"
                            value={formData.direccion_entrega || ''}
                            onChange={(e) => onUpdate({ direccion_entrega: e.target.value })}
                            placeholder="Calle, número, referencias..."
                            className="mt-1 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                        />
                    </div>

                    {/* Peso */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="peso" className="dark:text-gray-300">
                                Peso (kg)
                            </Label>
                            <Input
                                id="peso"
                                type="number"
                                value={formData.peso_kg || ''}
                                onChange={(e) =>
                                    onUpdate({ peso_kg: parseFloat(e.target.value) || undefined })
                                }
                                placeholder="0.00"
                                step="0.1"
                                className="mt-1 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            />
                        </div>

                        <div>
                            <Label htmlFor="volumen" className="dark:text-gray-300">
                                Volumen (m³) - Opcional
                            </Label>
                            <Input
                                id="volumen"
                                type="number"
                                value={formData.volumen_m3 || ''}
                                onChange={(e) =>
                                    onUpdate({ volumen_m3: parseFloat(e.target.value) || undefined })
                                }
                                placeholder="0.00"
                                step="0.01"
                                className="mt-1 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Fecha */}
                    <div>
                        <Label htmlFor="fecha-confirm" className="dark:text-gray-300 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Fecha Programada
                        </Label>
                        <div className="mt-1 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border dark:border-slate-600">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formData.fecha_programada
                                    ? new Date(formData.fecha_programada).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : 'No asignada'}
                            </p>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <Label htmlFor="observaciones" className="dark:text-gray-300">
                            Observaciones - Opcional
                        </Label>
                        <Textarea
                            id="observaciones"
                            value={formData.observaciones || ''}
                            onChange={(e) => onUpdate({ observaciones: e.target.value })}
                            placeholder="Notas adicionales sobre la entrega..."
                            className="mt-1 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                            rows={3}
                        />
                    </div>
                </div>
            </Card>

            {/* Checklist de confirmación */}
            <Card className="dark:bg-slate-900 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Antes de crear:</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={!!formData.venta_id} disabled className="rounded" />
                        <span className="text-gray-700 dark:text-gray-300">✓ Venta seleccionada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!formData.vehiculo_id}
                            disabled
                            className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">✓ Vehículo asignado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={!!formData.chofer_id} disabled className="rounded" />
                        <span className="text-gray-700 dark:text-gray-300">✓ Chofer asignado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!formData.fecha_programada}
                            disabled
                            className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">✓ Fecha programada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!formData.direccion_entrega && formData.direccion_entrega.length > 5}
                            disabled
                            className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">✓ Dirección completa</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={
                                !!formData.peso_kg &&
                                vehiculo &&
                                formData.peso_kg <= (vehiculo.capacidad_kg || 0)
                            }
                            disabled
                            className="rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">✓ Capacidad validada</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}

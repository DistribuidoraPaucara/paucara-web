/**
 * Presentación: GenerarReporteCargo
 *
 * Componente para generar un nuevo reporte de carga desde una entrega.
 * Permite especificar vehículo y detalles adicionales del reporte.
 *
 * ARQUITECTURA LIMPIA:
 * ✅ Solo renderiza formulario
 * ✅ Maneja envío a API
 */

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { AlertCircle, FileText, Loader } from 'lucide-react';
import type { Entrega, VehiculoCompleto, GenerarReporteFormData } from '@/domain/entities/entregas';

interface GenerarReporteCargoProps {
    entrega: Entrega;
    vehiculos: VehiculoCompleto[];
    onSuccess?: (reporteId: number) => void;
}

export default function GenerarReporteCargo({
    entrega,
    vehiculos,
    onSuccess,
}: GenerarReporteCargoProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<GenerarReporteFormData>({
        entrega_id: entrega.id!,
        vehiculo_id: entrega.vehiculo_id || vehiculos[0]?.id,
        descripcion: '',
        peso_total_kg: 0,
        volumen_total_m3: undefined,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/reportes-carga', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error creando reporte');
            }

            const result = await response.json();
            if (result.success && result.data?.id) {
                onSuccess?.(result.data.id);
                // Redirigir a la página del reporte
                router.visit(`/logistica/entregas/reportes/${result.data.id}`);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Información de la Entrega */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Generar Reporte de Carga
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600 dark:text-gray-400">Entrega ID</p>
                        <p className="font-medium text-gray-900 dark:text-white">{entrega.id}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 dark:text-gray-400">Estado Actual</p>
                        <p className="font-medium text-gray-900 dark:text-white">{entrega.estado}</p>
                    </div>
                    {entrega.venta && (
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Venta</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {entrega.venta.numero}
                            </p>
                        </div>
                    )}
                    {entrega.cliente && (
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Cliente</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {entrega.cliente.nombre}
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Errores */}
            {error && (
                <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                    <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
                            <p className="text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Formulario */}
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Vehículo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Vehículo Asignado
                        </label>
                        <select
                            value={formData.vehiculo_id || ''}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    vehiculo_id: parseInt(e.target.value) || undefined,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">Seleccionar vehículo...</option>
                            {vehiculos.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.placa} - {v.marca} {v.modelo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Peso Total */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Peso Total (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.peso_total_kg || 0}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    peso_total_kg: parseFloat(e.target.value) || 0,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Volumen Total */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Volumen Total (m³) <span className="text-gray-500">(opcional)</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.volumen_total_m3 || ''}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    volumen_total_m3: e.target.value ? parseFloat(e.target.value) : undefined,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descripción <span className="text-gray-500">(opcional)</span>
                        </label>
                        <textarea
                            value={formData.descripcion || ''}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    descripcion: e.target.value || undefined,
                                }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                            rows={3}
                            placeholder="Descripción adicional del reporte..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                            Generar Reporte
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

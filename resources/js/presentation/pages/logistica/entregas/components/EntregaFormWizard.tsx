import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import type { VentaConDetalles, VehiculoCompleto, ChoferEntrega } from '@/domain/entities/entregas';
import type { Id } from '@/domain/entities/shared';
import WizardStep1Venta from './wizard/WizardStep1Venta';
import WizardStep2Recursos from './wizard/WizardStep2Recursos';
import WizardStep3Confirmar from './wizard/WizardStep3Confirmar';

export interface WizardFormData {
    venta_id?: Id;
    vehiculo_id?: Id;
    chofer_id?: Id;
    fecha_programada?: string;
    direccion_entrega?: string;
    peso_kg?: number;
    volumen_m3?: number;
    observaciones?: string;
}

interface EntregaFormWizardProps {
    ventas: VentaConDetalles[];
    vehiculos: VehiculoCompleto[];
    choferes: ChoferEntrega[];
    onSubmit: (formData: WizardFormData) => Promise<void>;
    onCancel: () => void;
}

const PASOS = ['Venta', 'Recursos', 'Confirmar'];

export default function EntregaFormWizard({
    ventas,
    vehiculos,
    choferes,
    onSubmit,
    onCancel,
}: EntregaFormWizardProps) {
    const [pasoActual, setPasoActual] = useState(0);
    const [formData, setFormData] = useState<WizardFormData>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleNext = () => {
        if (pasoActual < PASOS.length - 1) {
            setPasoActual(pasoActual + 1);
            setError(null);
        }
    };

    const handleBack = () => {
        if (pasoActual > 0) {
            setPasoActual(pasoActual - 1);
            setError(null);
        }
    };

    const handleUpdateFormData = (data: Partial<WizardFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setError(null);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await onSubmit(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear entrega');
            setIsLoading(false);
        }
    };

    const selectedVenta = ventas.find((v) => v.id === formData.venta_id);
    const selectedVehiculo = vehiculos.find((v) => v.id === formData.vehiculo_id);
    const selectedChofer = choferes.find((c) => c.id === formData.chofer_id);

    return (
        <div className="space-y-6 p-6">
            {/* Indicador de progreso */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Crear Nueva Entrega
                    </h1>
                    <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                        Paso {pasoActual + 1} de {PASOS.length}
                    </Badge>
                </div>

                {/* Barra de progreso */}
                <div className="flex gap-2">
                    {PASOS.map((paso, index) => (
                        <div key={paso} className="flex-1">
                            <div
                                className={`h-2 rounded-full transition-colors ${
                                    index <= pasoActual
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200 dark:bg-slate-700'
                                }`}
                            />
                            <p className="text-xs font-medium mt-2 text-center dark:text-gray-300">
                                {paso}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
                    </div>
                </div>
            )}

            {/* Contenido del paso */}
            <Card className="dark:bg-slate-900 dark:border-slate-700">
                <CardContent className="pt-6">
                    {pasoActual === 0 && (
                        <WizardStep1Venta
                            ventas={ventas}
                            formData={formData}
                            onUpdate={handleUpdateFormData}
                        />
                    )}

                    {pasoActual === 1 && selectedVenta && (
                        <WizardStep2Recursos
                            venta={selectedVenta}
                            vehiculos={vehiculos}
                            choferes={choferes}
                            formData={formData}
                            onUpdate={handleUpdateFormData}
                        />
                    )}

                    {pasoActual === 2 && selectedVenta && (
                        <WizardStep3Confirmar
                            venta={selectedVenta}
                            vehiculo={selectedVehiculo}
                            chofer={selectedChofer}
                            formData={formData}
                            onUpdate={handleUpdateFormData}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Panel lateral con resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"></div>
                <div>
                    <Card className="dark:bg-slate-900 dark:border-slate-700 sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-sm dark:text-white">Resumen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            {selectedVenta && (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Venta</p>
                                    <p className="font-semibold dark:text-white">
                                        {selectedVenta.numero_venta} - {selectedVenta.cliente.nombre}
                                    </p>
                                </div>
                            )}

                            {formData.peso_kg && (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Peso</p>
                                    <p className="font-semibold dark:text-white">{formData.peso_kg} kg</p>
                                </div>
                            )}

                            {selectedVehiculo && (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Vehículo</p>
                                    <p className="font-semibold dark:text-white">{selectedVehiculo.placa}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Capacidad: {selectedVehiculo.capacidad_kg || 'N/A'} kg
                                    </p>
                                </div>
                            )}

                            {selectedChofer && (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Chofer</p>
                                    <p className="font-semibold dark:text-white">{selectedChofer.nombre}</p>
                                </div>
                            )}

                            {formData.fecha_programada && (
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">Fecha</p>
                                    <p className="font-semibold dark:text-white">
                                        {new Date(formData.fecha_programada).toLocaleDateString('es-ES')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Botones de navegación */}
            <div className="flex gap-3 justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    Cancelar
                </Button>

                <div className="flex gap-3">
                    {pasoActual > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleBack}
                            disabled={isLoading}
                            className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Atrás
                        </Button>
                    )}

                    {pasoActual < PASOS.length - 1 ? (
                        <Button onClick={handleNext} disabled={!canProceed(pasoActual, formData)}>
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit(formData) || isLoading}
                        >
                            Crear Entrega
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Validadores
function canProceed(step: number, formData: WizardFormData): boolean {
    if (step === 0) {
        return !!formData.venta_id;
    }
    if (step === 1) {
        return !!formData.vehiculo_id && !!formData.chofer_id && !!formData.fecha_programada;
    }
    return true;
}

function canSubmit(formData: WizardFormData): boolean {
    return (
        !!formData.venta_id &&
        !!formData.vehiculo_id &&
        !!formData.chofer_id &&
        !!formData.fecha_programada &&
        !!formData.direccion_entrega &&
        !!formData.peso_kg
    );
}

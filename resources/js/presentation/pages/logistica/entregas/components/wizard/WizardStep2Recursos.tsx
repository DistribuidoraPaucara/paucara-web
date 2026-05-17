import { useState, useEffect, useMemo } from 'react';
import { Label } from '@/presentation/components/ui/label';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { AlertCircle, CheckCircle2, AlertTriangle, Truck, Clock } from 'lucide-react';
import type { VentaConDetalles, VehiculoCompleto, ChoferEntrega } from '@/domain/entities/entregas';
import type { WizardFormData } from '../EntregaFormWizard';
import { Input } from '@/presentation/components/ui/input';
import { getMinDateTimeLocal } from '@/lib/entregas.utils';
import { choferPreferenciasService, type ChoferPreferencia } from '@/application/services/chofer-preferencias.service';

interface WizardStep2RecursosProps {
    venta: VentaConDetalles;
    vehiculos: VehiculoCompleto[];
    choferes: ChoferEntrega[];
    formData: WizardFormData;
    onUpdate: (data: Partial<WizardFormData>) => void;
}

export default function WizardStep2Recursos({
    vehiculos,
    choferes,
    formData,
    onUpdate,
}: WizardStep2RecursosProps) {
    const peso = formData.peso_kg || 0;
    const [preferencias, setPreferencias] = useState<ChoferPreferencia[]>([]);

    // Cargar preferencias de choferes al montar el componente
    useEffect(() => {
        choferPreferenciasService.cargarPreferencias().then((prefs) => {
            setPreferencias(prefs);
        });
    }, []);

    // Sugerir vehículos por orden de capacidad
    const vehiculosSugeridos = useMemo(() => {
        return vehiculos
            .filter((v) => (v.capacidad_kg || 0) >= peso)
            .sort((a, b) => (a.capacidad_kg || 0) - (b.capacidad_kg || 0));
    }, [vehiculos, peso]);

    const vehiculosNoCompatibles = useMemo(() => {
        return vehiculos.filter((v) => (v.capacidad_kg || 0) < peso);
    }, [vehiculos, peso]);

    // Ordenar choferes por preferencia (más usados primero)
    const choferesOrdenados = useMemo(() => {
        return choferPreferenciasService.ordenarPorPreferencia(choferes, preferencias);
    }, [choferes, preferencias]);

    const selectedVehiculo = vehiculos.find((v) => v.id === formData.vehiculo_id);
    // const selectedChofer = choferes.find((c) => c.id === formData.chofer_id);

    // Validación de fecha
    const minDate = getMinDateTimeLocal();
    const [fechaError, setFechaError] = useState<string | null>(null);

    const handleFechaChange = (value: string) => {
        const selectedDate = new Date(value);
        const minDateObj = new Date(minDate);

        if (selectedDate < minDateObj) {
            setFechaError('La fecha debe ser al menos 1 hora en el futuro');
        } else {
            setFechaError(null);
        }

        onUpdate({ fecha_programada: value });
    };

    const capacidadOK =
        selectedVehiculo && peso && peso <= (selectedVehiculo.capacidad_kg || 0);
    const capacidadInsuficiente =
        selectedVehiculo && peso && peso > (selectedVehiculo.capacidad_kg || 0);

    return (
        <div className="space-y-6">
            {/* Información del peso */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                            Capacidad Requerida
                        </h3>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        Peso total de la venta: <strong>{peso} kg</strong>
                    </p>
                </div>
            </Card>

            {/* Seleccionar vehículo */}
            <div>
                <Label className="dark:text-gray-300">Vehículo</Label>

                {/* Vehículos compatibles */}
                {vehiculosSugeridos.length > 0 && (
                    <div className="mt-2 space-y-2">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Sugerencias compatibles:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {vehiculosSugeridos.map((v) => (
                                <Card
                                    key={v.id}
                                    onClick={() => onUpdate({ vehiculo_id: v.id })}
                                    className={`cursor-pointer transition-all p-3 ${formData.vehiculo_id === v.id
                                        ? 'ring-2 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-green-900/20'
                                        : 'hover:shadow-md dark:hover:bg-slate-800'
                                        } dark:bg-slate-900 dark:border-slate-700`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {v.placa}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {v.marca} {v.modelo}
                                            </p>
                                        </div>
                                        {formData.vehiculo_id === v.id && (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Capacidad: {v.capacidad_kg || 'N/A'} kg
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={
                                                (v.capacidad_kg || 0) - peso >= 50
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                                            }
                                        >
                                            {((v.capacidad_kg || 0) - peso).toFixed(1)} kg
                                            disponibles
                                        </Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Advertencia si peso excede todos los vehículos */}
                {vehiculosSugeridos.length === 0 && vehiculosNoCompatibles.length > 0 && (
                    <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-3 mt-2">
                        <div className="flex gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Ningún vehículo disponible
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                    El peso total ({peso} kg) excede la capacidad máxima disponible (
                                    {Math.max(...vehiculosNoCompatibles.map((v) => v.capacidad_kg || 0))} kg)
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Validación de capacidad */}
            {selectedVehiculo && (
                <div>
                    {capacidadOK && (
                        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-3">
                            <div className="flex gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    ✓ Capacidad suficiente. Espacio disponible:{' '}
                                    <strong>
                                        {((selectedVehiculo.capacidad_kg || 0) - peso).toFixed(1)} kg
                                    </strong>
                                </p>
                            </div>
                        </Card>
                    )}

                    {capacidadInsuficiente && (
                        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-3">
                            <div className="flex gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-800 dark:text-red-200">
                                    ⚠️ Capacidad insuficiente. Falta:{' '}
                                    <strong>{(peso - (selectedVehiculo.capacidad_kg || 0)).toFixed(1)} kg</strong>
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Seleccionar chofer */}
            <div>
                <Label className="dark:text-gray-300">Chofer</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {choferesOrdenados.map((c) => {
                        const preferencia = preferencias.find((p) => p.chofer_id === c.id);
                        const esFavorito = preferencia && preferencia.frecuencia > 0;

                        return (
                            <Card
                                key={c.id}
                                onClick={() => {
                                    onUpdate({ chofer_id: c.id });
                                    // Guardar uso del chofer en la BD
                                    choferPreferenciasService.guardarUso(c.id);
                                }}
                                className={`cursor-pointer transition-all p-3 ${formData.chofer_id === c.id
                                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'hover:shadow-md dark:hover:bg-slate-800'
                                    } dark:bg-slate-900 dark:border-slate-700`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {c.nombre || c.name}
                                            {esFavorito && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                                                >
                                                    ★ {preferencia.frecuencia}
                                                </Badge>
                                            )}
                                        </h4>
                                        {c.licencia && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Lic: {c.licencia}
                                            </p>
                                        )}
                                    </div>
                                    {formData.chofer_id === c.id && (
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Seleccionar fecha */}
            <div>
                <Label htmlFor="fecha" className="dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Fecha Programada
                    </div>
                </Label>
                <Input
                    id="fecha"
                    type="datetime-local"
                    value={formData.fecha_programada || ''}
                    onChange={(e) => handleFechaChange(e.target.value)}
                    min={minDate}
                    className={`mt-2 dark:bg-slate-800 dark:border-slate-600 dark:text-white ${fechaError ? 'border-red-500' : ''
                        }`}
                />
                {fechaError && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{fechaError}</p>
                )}
            </div>
        </div>
    );
}

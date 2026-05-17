import { useMemo } from 'react';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Label } from '@/presentation/components/ui/label';
import { CheckCircle2, AlertCircle, Truck, User } from 'lucide-react';
import type { VehiculoCompleto, ChoferEntrega } from '@/domain/entities/entregas';
import type { Id } from '@/domain/entities/shared';

interface BatchVehiculoAssignmentProps {
    vehiculos: VehiculoCompleto[];
    choferes: ChoferEntrega[];
    selectedVehiculoId: Id | null | undefined;
    selectedChoferId: Id | null | undefined;
    pesoTotal: number;
    onVehiculoSelect: (vehiculoId: Id) => void;
    onChoferSelect: (choferId: Id) => void;
}

export default function BatchVehiculoAssignment({
    vehiculos,
    choferes,
    selectedVehiculoId,
    selectedChoferId,
    pesoTotal,
    onVehiculoSelect,
    onChoferSelect,
}: BatchVehiculoAssignmentProps) {
    const selectedVehiculo = useMemo(
        () => vehiculos.find((v) => v.id === selectedVehiculoId),
        [vehiculos, selectedVehiculoId]
    );

    const vehiculosCompatibles = useMemo(() => {
        return vehiculos.filter((v) => (v.capacidad_kg ?? 0) >= pesoTotal);
    }, [vehiculos, pesoTotal]);

    const capacidadSuficiente = selectedVehiculo && pesoTotal <= (selectedVehiculo.capacidad_kg ?? 0);
    const capacidadInsuficiente = selectedVehiculo && pesoTotal > (selectedVehiculo.capacidad_kg ?? 0);

    return (
        <div className="space-y-6">
            {/* Seleccionar Vehículo */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                        Seleccionar Vehículo
                    </Label>
                </div>

                {pesoTotal > 0 && (
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 p-3">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Peso total: <strong>{pesoTotal.toFixed(1)} kg</strong> - Se necesita capacidad mínima de{' '}
                            <strong>{pesoTotal} kg</strong>
                        </p>
                    </Card>
                )}

                {vehiculosCompatibles.length === 0 ? (
                    <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-3">
                        <div className="flex gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    No hay vehículos disponibles
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                    El peso total excede la capacidad de todos los vehículos disponibles
                                </p>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {vehiculosCompatibles.map((vehiculo) => {
                            const espacioDisponible = (vehiculo.capacidad_kg ?? 0) - pesoTotal;
                            const isSelected = selectedVehiculoId === vehiculo.id;

                            return (
                                <Card
                                    key={vehiculo.id}
                                    onClick={() => onVehiculoSelect(vehiculo.id)}
                                    className={`cursor-pointer transition-all p-3 ${
                                        isSelected
                                            ? 'ring-2 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-green-900/20'
                                            : 'hover:shadow-md dark:hover:bg-slate-800'
                                    } dark:bg-slate-900 dark:border-slate-700`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {vehiculo.placa}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {vehiculo.marca} {vehiculo.modelo}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Capacidad:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {vehiculo.capacidad_kg} kg
                                            </span>
                                        </div>

                                        {pesoTotal > 0 && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Disponible:
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        espacioDisponible >= 50
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                                                    }
                                                >
                                                    {espacioDisponible.toFixed(1)} kg
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Validación de capacidad */}
                {capacidadSuficiente && (
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 p-3">
                        <p className="text-sm text-green-800 dark:text-green-200">
                            ✓ Capacidad validada correctamente
                        </p>
                    </Card>
                )}

                {capacidadInsuficiente && (
                    <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-3">
                        <p className="text-sm text-red-800 dark:text-red-200">
                            ⚠️ Capacidad insuficiente: Faltarían{' '}
                            {(pesoTotal - (selectedVehiculo?.capacidad_kg ?? 0)).toFixed(1)} kg
                        </p>
                    </Card>
                )}
            </div>

            {/* Seleccionar Chofer */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                        Seleccionar Chofer
                    </Label>
                </div>

                {choferes.length === 0 ? (
                    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            No hay choferes disponibles
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {choferes.map((chofer) => {
                            const isSelected = selectedChoferId === chofer.id;

                            return (
                                <Card
                                    key={chofer.id}
                                    onClick={() => onChoferSelect(chofer.id)}
                                    className={`cursor-pointer transition-all p-3 ${
                                        isSelected
                                            ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                            : 'hover:shadow-md dark:hover:bg-slate-800'
                                    } dark:bg-slate-900 dark:border-slate-700`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {chofer.name}
                                            </h4>
                                            {chofer.email && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    {chofer.email}
                                                </p>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Resumen de asignación */}
            {selectedVehiculoId && selectedChoferId && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Asignación Confirmada</h4>
                    <div className="space-y-1 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Vehículo:</span> {selectedVehiculo?.placa} (
                            {selectedVehiculo?.capacidad_kg} kg)
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Chofer:</span>{' '}
                            {choferes.find((c) => c.id === selectedChoferId)?.nombre}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Peso Total:</span> {pesoTotal.toFixed(1)} kg
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}

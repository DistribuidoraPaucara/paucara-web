import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Loader2, Route, Truck, User, MapPin, Clock, Weight, TrendingUp } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Ruta {
    bin_numero: number;
    ruta: Array<{
        entrega_id: number;
        direccion: string;
        peso: number;
        distancia_anterior: number;
    }>;
    distancia_total: number;
    distancia_regreso: number;
    tiempo_estimado: number;
    peso_total_bin: number;
    porcentaje_uso: number;
    paradas: number;
    sugerencia_vehiculo?: {
        id: number;
        placa: string;
        marca: string;
        modelo: string;
        capacidad_kg: number;
    };
    sugerencia_chofer?: {
        id: number;
        nombre: string;
        licencia: string;
    };
    entregas_ids: number[];
}

interface ResultadoOptimizacion {
    rutas: Ruta[];
    estadisticas: {
        cantidad_bins: number;
        items_totales: number;
        peso_total: number;
        distancia_total: number;
        tiempo_total_minutos: number;
        uso_promedio: number;
    };
}

interface AsignacionRuta {
    vehiculo_id: number | null;
    chofer_id: number | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    entregasIds: number[];
    vehiculos?: Array<{ id: number; placa: string; marca: string; modelo: string; capacidad_kg: number }>;
    choferes?: Array<{ id: number; nombre: string }>;
}

export function ModalOptimizacionRutas({ open, onClose, entregasIds, vehiculos = [], choferes = [] }: Props) {
    const [optimizando, setOptimizando] = useState(false);
    const [resultado, setResultado] = useState<ResultadoOptimizacion | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [asignaciones, setAsignaciones] = useState<Record<number, AsignacionRuta>>({});
    const [asignando, setAsignando] = useState(false);

    const ejecutarOptimizacion = async () => {
        setOptimizando(true);
        setError(null);

        try {
            const response = await fetch('/logistica/entregas/optimizar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    entrega_ids: entregasIds,
                    capacidad_vehiculo: 1200, // Capacidad por defecto
                }),
            });

            if (!response.ok) {
                throw new Error('Error al optimizar rutas');
            }

            const data = await response.json();
            setResultado(data.data);

            // Inicializar asignaciones con sugerencias
            const nuevasAsignaciones: Record<number, AsignacionRuta> = {};
            data.data.rutas.forEach((ruta: Ruta) => {
                nuevasAsignaciones[ruta.bin_numero] = {
                    vehiculo_id: ruta.sugerencia_vehiculo?.id || null,
                    chofer_id: ruta.sugerencia_chofer?.id || null,
                };
            });
            setAsignaciones(nuevasAsignaciones);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setOptimizando(false);
        }
    };

    const asignarRutas = async () => {
        if (!resultado) return;

        setAsignando(true);
        try {
            // Asignar cada ruta
            for (const ruta of resultado.rutas) {
                const asignacion = asignaciones[ruta.bin_numero];
                if (!asignacion?.vehiculo_id || !asignacion?.chofer_id) {
                    continue;
                }

                // Asignar cada entrega de la ruta
                for (const entregaId of ruta.entregas_ids) {
                    await fetch(`/logistica/entregas/${entregaId}/asignar`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                        body: JSON.stringify({
                            chofer_id: asignacion.chofer_id,
                            vehiculo_id: asignacion.vehiculo_id,
                        }),
                    });
                }
            }

            // Recargar la página para ver los cambios
            router.reload({ only: ['entregas'] });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al asignar rutas');
        } finally {
            setAsignando(false);
        }
    };

    // Auto-ejecutar optimización al abrir
    if (open && !resultado && !optimizando && !error) {
        ejecutarOptimizacion();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Route className="h-6 w-6 text-green-600" />
                        Optimización de Rutas
                    </DialogTitle>
                    <DialogDescription>
                        Algoritmo: First Fit Decreasing (FFD) + Nearest Neighbor (NN)
                    </DialogDescription>
                </DialogHeader>

                {optimizando && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-green-600 mb-4" />
                        <p className="text-lg font-medium">Optimizando rutas...</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Analizando {entregasIds.length} entregas
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200">{error}</p>
                        <Button onClick={ejecutarOptimizacion} className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                )}

                {resultado && (
                    <div className="space-y-6">
                        {/* Estadísticas Globales */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <Route className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                                        <p className="text-2xl font-bold">{resultado.estadisticas.cantidad_bins}</p>
                                        <p className="text-sm text-muted-foreground">Rutas</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <MapPin className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                        <p className="text-2xl font-bold">{resultado.estadisticas.distancia_total.toFixed(1)} km</p>
                                        <p className="text-sm text-muted-foreground">Distancia Total</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <Clock className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                                        <p className="text-2xl font-bold">{resultado.estadisticas.tiempo_total_minutos} min</p>
                                        <p className="text-sm text-muted-foreground">Tiempo Total</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                                        <p className="text-2xl font-bold">{resultado.estadisticas.uso_promedio.toFixed(1)}%</p>
                                        <p className="text-sm text-muted-foreground">Uso Promedio</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Rutas */}
                        <div className="space-y-4">
                            {resultado.rutas.map((ruta) => (
                                <Card key={ruta.bin_numero} className="border-l-4 border-l-green-500">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Route className="h-5 w-5" />
                                                Ruta {ruta.bin_numero}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{ruta.paradas} paradas</Badge>
                                                <Badge className={ruta.porcentaje_uso > 90 ? 'bg-red-600' : 'bg-green-600'}>
                                                    {ruta.porcentaje_uso.toFixed(1)}% capacidad
                                                </Badge>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Métricas de la ruta */}
                                        <div className="grid grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Weight className="h-4 w-4 text-muted-foreground" />
                                                <span>{ruta.peso_total_bin.toFixed(1)} kg</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>{ruta.distancia_total.toFixed(1)} km</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{ruta.tiempo_estimado} min</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Retorno: {ruta.distancia_regreso.toFixed(1)} km
                                            </div>
                                        </div>

                                        {/* Asignación de recursos */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                                    <Truck className="h-4 w-4" />
                                                    Vehículo
                                                </label>
                                                <Select
                                                    value={asignaciones[ruta.bin_numero]?.vehiculo_id?.toString() || ''}
                                                    onValueChange={(value) => {
                                                        setAsignaciones(prev => ({
                                                            ...prev,
                                                            [ruta.bin_numero]: {
                                                                ...prev[ruta.bin_numero],
                                                                vehiculo_id: parseInt(value),
                                                            },
                                                        }));
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar vehículo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {vehiculos.map((v) => (
                                                            <SelectItem key={v.id} value={v.id.toString()}>
                                                                {v.placa} - {v.marca} {v.modelo} ({v.capacidad_kg} kg)
                                                                {ruta.sugerencia_vehiculo?.id === v.id && ' ⭐'}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                                                    <User className="h-4 w-4" />
                                                    Chofer
                                                </label>
                                                <Select
                                                    value={asignaciones[ruta.bin_numero]?.chofer_id?.toString() || ''}
                                                    onValueChange={(value) => {
                                                        setAsignaciones(prev => ({
                                                            ...prev,
                                                            [ruta.bin_numero]: {
                                                                ...prev[ruta.bin_numero],
                                                                chofer_id: parseInt(value),
                                                            },
                                                        }));
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar chofer" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {choferes.map((c) => (
                                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                                {c.nombre}
                                                                {ruta.sugerencia_chofer?.id === c.id && ' ⭐'}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Orden de entregas */}
                                        <div>
                                            <p className="text-sm font-medium mb-2">Orden optimizado:</p>
                                            <ol className="space-y-1 text-sm">
                                                {ruta.ruta.map((parada, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                                                        <div className="flex-1">
                                                            <span className="font-medium">#{parada.entrega_id}</span> - {parada.direccion}
                                                            <span className="text-muted-foreground ml-2">
                                                                ({parada.peso.toFixed(1)} kg, +{parada.distancia_anterior.toFixed(1)} km)
                                                            </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button variant="outline" onClick={onClose} disabled={asignando}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={asignarRutas}
                                disabled={asignando || resultado.rutas.some(r => !asignaciones[r.bin_numero]?.vehiculo_id || !asignaciones[r.bin_numero]?.chofer_id)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {asignando ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Asignando...
                                    </>
                                ) : (
                                    'Confirmar y Asignar Rutas'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

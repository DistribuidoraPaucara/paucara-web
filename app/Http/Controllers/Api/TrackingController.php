<?php

namespace App\Http\Controllers\Api;

use App\Models\Entrega;
use App\Models\UbicacionTracking;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TrackingController extends Controller
{
    /**
     * GET /api/tracking/entregas/{id}/ubicaciones
     * Obtener las últimas ubicaciones de una entrega
     */
    public function obtenerUbicaciones($entregaId)
    {
        try {
            $entrega = Entrega::findOrFail($entregaId);

            $ubicaciones = $entrega->ubicaciones()
                ->latest('timestamp')
                ->limit(50)
                ->get()
                ->reverse() // Ordenar cronológicamente
                ->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'entrega_id' => $entrega->id,
                    'estado' => $entrega->estado,
                    'ubicaciones' => $ubicaciones->map(function ($ub) {
                        return [
                            'id' => $ub->id,
                            'latitud' => $ub->latitud,
                            'longitud' => $ub->longitud,
                            'velocidad' => $ub->velocidad,
                            'rumbo' => $ub->rumbo,
                            'altitud' => $ub->altitud,
                            'precision' => $ub->precision,
                            'timestamp' => $ub->timestamp,
                            'evento' => $ub->evento,
                        ];
                    }),
                    'total' => $ubicaciones->count(),
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Entrega no encontrada',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ubicaciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/tracking/entregas/{id}/ultima-ubicacion
     * Obtener la última ubicación registrada de una entrega
     */
    public function ultimaUbicacion($entregaId)
    {
        try {
            $entrega = Entrega::findOrFail($entregaId);

            $ubicacion = $entrega->ubicaciones()
                ->latest('timestamp')
                ->first();

            if (!$ubicacion) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay ubicaciones registradas para esta entrega',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $ubicacion->id,
                    'entrega_id' => $ubicacion->entrega_id,
                    'chofer_id' => $ubicacion->chofer_id,
                    'latitud' => $ubicacion->latitud,
                    'longitud' => $ubicacion->longitud,
                    'velocidad' => $ubicacion->velocidad,
                    'rumbo' => $ubicacion->rumbo,
                    'altitud' => $ubicacion->altitud,
                    'precision' => $ubicacion->precision,
                    'timestamp' => $ubicacion->timestamp,
                    'evento' => $ubicacion->evento,
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Entrega no encontrada',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener última ubicación',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/tracking/entregas/{id}/calcular-eta
     * Calcular ETA (tiempo estimado de llegada)
     *
     * Nota: En producción, usar Google Maps Distance Matrix API o similar
     */
    public function calcularETA(Request $request, $entregaId)
    {
        try {
            $validated = $request->validate([
                'lat_destino' => 'required|numeric|between:-90,90',
                'lng_destino' => 'required|numeric|between:-180,180',
            ]);

            $entrega = Entrega::findOrFail($entregaId);

            $ubicacionActual = $entrega->ultimaUbicacion();

            if (!$ubicacionActual) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay ubicación actual registrada',
                ], 404);
            }

            // Calcular distancia usando fórmula Haversine
            $distancia = $this->calcularDistanciaHaversine(
                $ubicacionActual->latitud,
                $ubicacionActual->longitud,
                $validated['lat_destino'],
                $validated['lng_destino']
            );

            // Estimar tiempo basado en velocidad promedio (40 km/h en ciudad)
            $velocidadPromedio = $ubicacionActual->velocidad ?? 40;
            $tiempoMinutos = ($distancia / $velocidadPromedio) * 60;

            // Sumar algunos minutos extras por semáforos, tráfico, etc
            $tiempoEstimadoMinutos = ceil($tiempoMinutos * 1.15);

            return response()->json([
                'success' => true,
                'data' => [
                    'distancia_km' => round($distancia, 2),
                    'velocidad_actual_kmh' => $ubicacionActual->velocidad,
                    'tiempo_estimado_minutos' => $tiempoEstimadoMinutos,
                    'tiempo_estimado_formato' => $this->formatearTiempo($tiempoEstimadoMinutos),
                    'ubicacion_actual' => [
                        'latitud' => $ubicacionActual->latitud,
                        'longitud' => $ubicacionActual->longitud,
                    ],
                    'ubicacion_destino' => [
                        'latitud' => $validated['lat_destino'],
                        'longitud' => $validated['lng_destino'],
                    ],
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Entrega no encontrada',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al calcular ETA',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Métodos auxiliares
     */

    /**
     * Calcular distancia entre dos puntos usando fórmula Haversine
     * Retorna distancia en km
     */
    private function calcularDistanciaHaversine(
        float $lat1,
        float $lng1,
        float $lat2,
        float $lng2
    ): float {
        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lng1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lng2);

        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;

        $a = sin($dlat / 2) ** 2 + cos($lat1) * cos($lat2) * sin($dlon / 2) ** 2;
        $c = 2 * asin(sqrt($a));
        $r = 6371; // Radio de la tierra en km

        return $c * $r;
    }

    /**
     * Formatear minutos a formato legible (ej: "45 min", "1h 30min")
     */
    private function formatearTiempo(int $minutos): string
    {
        if ($minutos < 60) {
            return "{$minutos} min";
        }

        $horas = floor($minutos / 60);
        $mins = $minutos % 60;

        if ($mins == 0) {
            return "{$horas}h";
        }

        return "{$horas}h {$mins}min";
    }
}

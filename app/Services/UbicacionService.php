<?php

namespace App\Services;

use App\Events\UbicacionActualizada;
use App\Models\Entrega;
use App\Models\UbicacionTracking;
use Illuminate\Support\Collection;

class UbicacionService
{
    /**
     * Registrar una nueva ubicación para una entrega
     */
    public function registrarUbicacion(
        Entrega $entrega,
        float $latitud,
        float $longitud,
        array $datosAdicionales = []
    ): UbicacionTracking {
        // Validar coordenadas
        if ($latitud < -90 || $latitud > 90) {
            throw new \Exception('Latitud debe estar entre -90 y 90');
        }
        if ($longitud < -180 || $longitud > 180) {
            throw new \Exception('Longitud debe estar entre -180 y 180');
        }

        // Crear ubicación
        $ubicacion = $entrega->ubicaciones()->create([
            'chofer_id' => $datosAdicionales['chofer_id'] ?? $entrega->chofer_id,
            'latitud' => $latitud,
            'longitud' => $longitud,
            'velocidad' => $datosAdicionales['velocidad'] ?? null,
            'rumbo' => $datosAdicionales['rumbo'] ?? null,
            'altitud' => $datosAdicionales['altitud'] ?? null,
            'precision' => $datosAdicionales['precision'] ?? null,
            'timestamp' => $datosAdicionales['timestamp'] ?? now(),
            'evento' => $datosAdicionales['evento'] ?? null,
        ]);

        // Disparar evento de ubicación actualizada
        UbicacionActualizada::dispatch($ubicacion);

        return $ubicacion;
    }

    /**
     * Calcular distancia entre dos puntos usando fórmula Haversine
     * Retorna distancia en km
     */
    public function calcularDistancia(
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
     * Calcular ETA (tiempo estimado de llegada)
     * Retorna array con tiempo estimado en minutos
     */
    public function calcularETA(
        Entrega $entrega,
        float $latDestino,
        float $lngDestino,
        float $velocidadPromedio = 40 // km/h
    ): array {
        $ubicacionActual = $entrega->ultimaUbicacion();

        if (!$ubicacionActual) {
            throw new \Exception('No hay ubicación registrada para la entrega');
        }

        // Calcular distancia
        $distancia = $this->calcularDistancia(
            $ubicacionActual->latitud,
            $ubicacionActual->longitud,
            $latDestino,
            $lngDestino
        );

        // Calcular tiempo basado en velocidad
        $velocidadActual = $ubicacionActual->velocidad ?? $velocidadPromedio;
        $tiempoHoras = $distancia / $velocidadActual;
        $tiempoMinutos = $tiempoHoras * 60;

        // Sumar 15% por tráfico, semáforos, etc
        $tiempoEstimado = ceil($tiempoMinutos * 1.15);

        return [
            'distancia_km' => round($distancia, 2),
            'tiempo_estimado_minutos' => $tiempoEstimado,
            'tiempo_estimado_formato' => $this->formatearTiempo($tiempoEstimado),
            'velocidad_actual_kmh' => $velocidadActual,
            'ubicacion_actual' => [
                'latitud' => $ubicacionActual->latitud,
                'longitud' => $ubicacionActual->longitud,
            ],
            'ubicacion_destino' => [
                'latitud' => $latDestino,
                'longitud' => $lngDestino,
            ],
        ];
    }

    /**
     * Obtener historial de ubicaciones de una entrega
     */
    public function obtenerHistorial(Entrega $entrega, int $limite = 100): Collection
    {
        return $entrega->ubicaciones()
            ->latest('timestamp')
            ->limit($limite)
            ->get()
            ->reverse()
            ->values();
    }

    /**
     * Obtener ruta reciente para mapa
     */
    public function obtenerRutaReciente(Entrega $entrega, int $limitar = 50): Collection
    {
        return $entrega->ubicaciones()
            ->latest('timestamp')
            ->limit($limitar)
            ->get()
            ->reverse()
            ->values()
            ->map(function ($ubicacion) {
                return [
                    'latitud' => (float) $ubicacion->latitud,
                    'longitud' => (float) $ubicacion->longitud,
                    'timestamp' => $ubicacion->timestamp,
                ];
            });
    }

    /**
     * Obtener velocidad promedio en un periodo
     */
    public function obtenerVelocidadPromedio(Entrega $entrega, int $minutosAtras = 30): float
    {
        $desde = now()->subMinutes($minutosAtras);

        $velocidades = $entrega->ubicaciones()
            ->where('timestamp', '>=', $desde)
            ->whereNotNull('velocidad')
            ->pluck('velocidad')
            ->toArray();

        if (empty($velocidades)) {
            return 0;
        }

        return array_sum($velocidades) / count($velocidades);
    }

    /**
     * Detectar si el chofer se detuvo (velocidad = 0 por X minutos)
     */
    public function estaDetenido(Entrega $entrega, int $minutosDetencion = 5): bool
    {
        $desde = now()->subMinutes($minutosDetencion);

        $ubicacionesRecientes = $entrega->ubicaciones()
            ->where('timestamp', '>=', $desde)
            ->orderBy('timestamp')
            ->get();

        if ($ubicacionesRecientes->count() < 2) {
            return false;
        }

        // Verificar si todas las ubicaciones están muy cercas entre sí
        $ultimaUbicacion = $ubicacionesRecientes->last();
        $primeraUbicacion = $ubicacionesRecientes->first();

        $distancia = $this->calcularDistancia(
            $primeraUbicacion->latitud,
            $primeraUbicacion->longitud,
            $ultimaUbicacion->latitud,
            $ultimaUbicacion->longitud
        );

        // Si ha recorrido menos de 100m en los últimos X minutos, está detenido
        return $distancia < 0.1;
    }

    /**
     * Formatear minutos a formato legible
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

    /**
     * Limpiar ubicaciones antiguas (por ejemplo, mayores a 90 días)
     */
    public function limpiarUbicacionesAntiguas(int $diasAtras = 90): int
    {
        $fecha = now()->subDays($diasAtras);

        return UbicacionTracking::where('created_at', '<', $fecha)->delete();
    }
}

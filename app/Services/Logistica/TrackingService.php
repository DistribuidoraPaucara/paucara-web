<?php

namespace App\Services\Logistica;

use App\Events\UbicacionActualizada;
use App\Models\Entrega;
use App\Models\UbicacionTracking;
use Illuminate\Support\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * TrackingService - Gestión de tracking GPS en tiempo real
 *
 * Responsabilidades:
 * - Registrar ubicaciones GPS de entregas
 * - Persistir datos en base de datos
 * - Disparar eventos WebSocket
 * - Calcular ETA y distancias
 * - Mantener historial de rutas
 */
class TrackingService
{
    /**
     * Registrar nueva ubicación GPS de una entrega
     *
     * @param int $entregaId
     * @param float $latitud
     * @param float $longitud
     * @param float|null $velocidad (km/h)
     * @param float|null $rumbo (grados 0-360)
     * @param float|null $altitud (metros)
     * @param float|null $precision (metros)
     * @param string $evento (tracking, inicio_ruta, llegada, entrega)
     * @return UbicacionTracking
     * @throws \InvalidArgumentException
     */
    public function registrarUbicacion(
        int $entregaId,
        float $latitud,
        float $longitud,
        ?float $velocidad = null,
        ?float $rumbo = null,
        ?float $altitud = null,
        ?float $precision = null,
        string $evento = 'tracking'
    ): UbicacionTracking {
        try {
            // 1. Validar que la entrega existe
            $entrega = Entrega::findOrFail($entregaId);

            // 2. Validar que la entrega está en estado apropiado para tracking
            // FASE 1 + FASE 3: Ahora soportamos LISTO_PARA_ENTREGA, EN_TRANSITO, etc.
            // Legacy: ASIGNADA, EN_CAMINO, LLEGO
            $estadosValidos = [
                'ASIGNADA',              // Legacy
                'EN_CAMINO',             // Legacy
                'LLEGO',                 // Legacy
                'LISTO_PARA_ENTREGA',    // FASE 1
                'EN_TRANSITO',           // FASE 1 (nuevo flujo)
            ];

            if (!in_array($entrega->estado, $estadosValidos)) {
                throw new \InvalidArgumentException(
                    "No se puede registrar ubicación. Entrega en estado {$entrega->estado}. Estados válidos: " . implode(', ', $estadosValidos)
                );
            }

            // 3. Validar que el chofer está asignado
            if (!$entrega->chofer_id) {
                throw new \InvalidArgumentException('Entrega sin chofer asignado');
            }

            // 4. Validar rango de coordenadas
            if ($latitud < -90 || $latitud > 90) {
                throw new \InvalidArgumentException('Latitud fuera de rango: -90 a 90');
            }
            if ($longitud < -180 || $longitud > 180) {
                throw new \InvalidArgumentException('Longitud fuera de rango: -180 a 180');
            }

            // 5. Crear registro de ubicación
            $ubicacion = UbicacionTracking::create([
                'entrega_id' => $entregaId,
                'chofer_id'  => $entrega->chofer_id,
                'latitud'    => $latitud,
                'longitud'   => $longitud,
                'velocidad'  => $velocidad,
                'rumbo'      => $rumbo,
                'altitud'    => $altitud,
                'precision'  => $precision,
                'timestamp'  => now(),
                'evento'     => $evento,
            ]);

            Log::info("Ubicación registrada para entrega #{$entregaId}", [
                'ubicacion_id' => $ubicacion->id,
                'lat'          => $latitud,
                'lng'          => $longitud,
                'velocidad'    => $velocidad,
            ]);

            // 6. Disparar evento de WebSocket para actualizar en tiempo real
            $this->dispararEventoUbicacion($entrega, $ubicacion);

            // 7. Actualizar estado si es necesario
            $this->actualizarEstadoSegunEvento($entrega, $evento, $ubicacion);

            return $ubicacion;

        } catch (\ModelNotFoundException $e) {
            throw new \InvalidArgumentException("Entrega #{$entregaId} no encontrada");
        }
    }

    /**
     * Obtener historial de ubicaciones de una entrega
     *
     * @param int $entregaId
     * @param int $limite (máximo 500)
     * @return Collection<UbicacionTracking>
     */
    public function obtenerHistorial(int $entregaId, int $limite = 100): Collection
    {
        $limite = min($limite, 500); // Máximo 500 registros

        return UbicacionTracking::where('entrega_id', $entregaId)
            ->latest('timestamp')
            ->limit($limite)
            ->get()
            ->reverse() // Invertir para que esté en orden cronológico
            ->values();
    }

    /**
     * Obtener última ubicación registrada de una entrega
     *
     * @param int $entregaId
     * @return UbicacionTracking|null
     */
    public function obtenerUltimaUbicacion(int $entregaId): ?UbicacionTracking
    {
        return UbicacionTracking::where('entrega_id', $entregaId)
            ->latest('timestamp')
            ->first();
    }

    /**
     * Calcular ETA (Estimated Time of Arrival) basado en velocidad promedio
     *
     * @param int $entregaId
     * @return Carbon|null
     */
    public function calcularETA(int $entregaId): ?Carbon
    {
        try {
            $entrega = Entrega::findOrFail($entregaId);

            // Obtener última ubicación
            $ultimaUbicacion = $this->obtenerUltimaUbicacion($entregaId);
            if (!$ultimaUbicacion) {
                return null;
            }

            // Si no hay dirección de entrega, no podemos calcular ETA
            $primeraVenta = $entrega->ventas?->first();
            $tieneDirectionInfo = $entrega->direccion_entrega || $primeraVenta?->direccion || $primeraVenta?->direccionCliente;
            if (!$tieneDirectionInfo) {
                return null;
            }

            // Velocidad promedio de los últimos registros (km/h)
            $velocidadPromedio = UbicacionTracking::where('entrega_id', $entregaId)
                ->whereNotNull('velocidad')
                ->where('velocidad', '>', 0)
                ->avg('velocidad');

            // Si no hay velocidad registrada, usar velocidad promedio estimada (40 km/h en ciudad)
            $velocidadPromedio = $velocidadPromedio ?? 40;

            // Calcular distancia aproximada (se necesitaría Google Maps API para precisión)
            // Por ahora, usar una estimación simple
            // En producción, usar Google Maps Distance Matrix API

            // Estimación simple: 1 km promedio a velocidad actual = distancia estimada
            $distanciaEstimada = 1; // 1 km por defecto
            $tiempoMinutos = ($distanciaEstimada / $velocidadPromedio) * 60;

            return now()->addMinutes(intval($tiempoMinutos));

        } catch (\Exception $e) {
            Log::error("Error calculando ETA para entrega #{$entregaId}", [
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Obtener distancia recorrida en una entrega
     *
     * @param int $entregaId
     * @return float (en km)
     */
    public function obtenerDistanciaRecorrida(int $entregaId): float
    {
        $ubicaciones = $this->obtenerHistorial($entregaId, 500);

        if ($ubicaciones->count() < 2) {
            return 0;
        }

        $distanciaTotal = 0;

        // Iterar sobre ubicaciones consecutivas y calcular distancia
        for ($i = 0; $i < $ubicaciones->count() - 1; $i++) {
            $ubi1 = $ubicaciones[$i];
            $ubi2 = $ubicaciones[$i + 1];

            $distanciaTotal += $ubi1->distanciaA(
                (float) $ubi2->latitud,
                (float) $ubi2->longitud
            );
        }

        return round($distanciaTotal, 2);
    }

    /**
     * Obtener tiempo promedio de desplazamiento
     *
     * @param int $entregaId
     * @return int (en minutos)
     */
    public function obtenerTiempoPromedio(int $entregaId): int
    {
        $ubicaciones = UbicacionTracking::where('entrega_id', $entregaId)
            ->orderBy('timestamp')
            ->get();

        if ($ubicaciones->count() < 2) {
            return 0;
        }

        $primeraUbicacion = $ubicaciones->first();
        $ultimaUbicacion = $ubicaciones->last();

        $diferenciaTiempo = $ultimaUbicacion->timestamp->diffInMinutes(
            $primeraUbicacion->timestamp
        );

        return max(0, $diferenciaTiempo);
    }

    /**
     * Disparar evento WebSocket para actualizar clients en tiempo real
     *
     * @param Entrega $entrega
     * @param UbicacionTracking $ubicacion
     * @return void
     */
    private function dispararEventoUbicacion(Entrega $entrega, UbicacionTracking $ubicacion): void
    {
        try {
            broadcast(new UbicacionActualizada(
                entregaId: $entrega->id,
                latitud: (float) $ubicacion->latitud,
                longitud: (float) $ubicacion->longitud,
                velocidad: (float) ($ubicacion->velocidad ?? 0),
                rumbo: (float) ($ubicacion->rumbo ?? 0),
                altitud: (float) ($ubicacion->altitud ?? 0),
                precision: (float) ($ubicacion->precision ?? 0),
                timestamp: $ubicacion->timestamp,
                choferNombre: $entrega->chofer?->user?->name ?? 'Desconocido',
            ));

            Log::debug("Evento UbicacionActualizada disparado para entrega #{$entrega->id}");

        } catch (\Exception $e) {
            Log::error("Error disparando evento de ubicación", [
                'entrega_id' => $entrega->id,
                'error'      => $e->getMessage(),
            ]);
        }
    }

    /**
     * Actualizar estado de entrega según el evento de tracking
     *
     * @param Entrega $entrega
     * @param string $evento
     * @param UbicacionTracking $ubicacion
     * @return void
     */
    private function actualizarEstadoSegunEvento(
        Entrega $entrega,
        string $evento,
        UbicacionTracking $ubicacion
    ): void {
        try {
            switch ($evento) {
                case 'inicio_ruta':
                    if ($entrega->estado === 'ASIGNADA') {
                        $entrega->update(['estado' => 'EN_CAMINO', 'fecha_inicio' => now()]);
                        Log::info("Entrega #{$entrega->id} marcada como EN_CAMINO");
                    }
                    break;

                case 'llegada':
                    if ($entrega->estado === 'EN_CAMINO') {
                        $entrega->update(['estado' => 'LLEGO', 'fecha_llegada' => now()]);
                        Log::info("Entrega #{$entrega->id} marcada como LLEGÓ");
                    }
                    break;

                case 'entrega':
                    if (in_array($entrega->estado, ['LLEGO', 'EN_CAMINO'])) {
                        $entrega->update(['estado' => 'ENTREGADO', 'fecha_entrega' => now()]);
                        Log::info("Entrega #{$entrega->id} marcada como ENTREGADA");
                    }
                    break;

                default:
                    // El evento 'tracking' es solo para ubicaciones, no cambia estado
                    break;
            }
        } catch (\Exception $e) {
            Log::error("Error actualizando estado de entrega", [
                'entrega_id' => $entrega->id,
                'evento'     => $evento,
                'error'      => $e->getMessage(),
            ]);
        }
    }

    /**
     * Limpiar ubicaciones antiguas (más de 30 días)
     * Usar en scheduled task o manually
     *
     * @param int $diasAntiguedad
     * @return int (cantidad eliminada)
     */
    public function limpiarUbicacionesAntiguas(int $diasAntiguedad = 30): int
    {
        $fechaLimite = now()->subDays($diasAntiguedad);

        $cantidad = UbicacionTracking::where('timestamp', '<', $fechaLimite)->delete();

        Log::info("Ubicaciones antiguas eliminadas", ['cantidad' => $cantidad, 'dias' => $diasAntiguedad]);

        return $cantidad;
    }
}

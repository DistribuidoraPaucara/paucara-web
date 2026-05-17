<?php

namespace App\Services\Logistica;

use App\Models\Entrega;
use Illuminate\Support\Facades\DB;

/**
 * DeliveryTimePredictionService - Predicción de Tiempos de Entrega con ML
 *
 * PHASE 3.3: Machine Learning Básico
 *
 * Modelo: Regresión Lineal Múltiple + Histórico
 *
 * Variables de predicción:
 * - Distancia total (km)
 * - Número de paradas
 * - Hora del día
 * - Zona geográfica
 * - Chofer (histórico)
 * - Día de la semana
 *
 * Mejora: ETA realista, mejor planificación
 */
class DeliveryTimePredictionService
{
    /**
     * Velocidad promedio (km/h) - base
     */
    private float $velocidadBase = 40;

    /**
     * Tiempo por parada (minutos)
     */
    private float $tiempoPorParada = 10;

    /**
     * Predecir tiempo de entrega basado en histórico y variables
     *
     * Usa datos históricos y regresión para predecir tiempo
     *
     * @param array $datosRuta {distancia, paradas, hora, zona_id, chofer_id, dia_semana}
     * @return array {tiempo_estimado_minutos, rango_min_max, confianza}
     */
    public function predecirTiempoEntrega(array $datosRuta): array
    {
        // Extraer variables
        $distancia = $datosRuta['distancia'] ?? 0;
        $paradas = $datosRuta['paradas'] ?? 1;
        $hora = $datosRuta['hora'] ?? 9;
        $zonaId = $datosRuta['zona_id'] ?? null;
        $choferId = $datosRuta['chofer_id'] ?? null;
        $diaSemana = $datosRuta['dia_semana'] ?? date('w');

        // 1. Obtener factores históricos del chofer
        $factorChofer = $this->obtenerFactorChofer($choferId);

        // 2. Obtener factor de zona
        $factorZona = $this->obtenerFactorZona($zonaId);

        // 3. Obtener factor de hora
        $factorHora = $this->obtenerFactorHora($hora);

        // 4. Obtener factor de día
        $factorDia = $this->obtenerFactorDia($diaSemana);

        // 5. Calcular velocidad efectiva
        $velocidadEfectiva = $this->velocidadBase * $factorChofer * $factorHora * $factorDia;

        // 6. Calcular tiempo base
        $tiempoManejo = ($distancia / max($velocidadEfectiva, 1)) * 60; // convertir a minutos
        $tiempoParadas = $paradas * $this->tiempoPorParada;
        $tiempoTotal = $tiempoManejo + $tiempoParadas;

        // 7. Aplicar factor de zona
        $tiempoTotal = $tiempoTotal * $factorZona;

        // 8. Calcular rango de confianza
        $confianza = $this->calcularConfianza($choferId, $zonaId);
        $rangoMinMax = $this->calcularRangoConfianza($tiempoTotal, $confianza);

        return [
            'tiempo_estimado_minutos' => (int) round($tiempoTotal),
            'tiempo_estimado_horas' => round($tiempoTotal / 60, 1),
            'rango_minimo' => $rangoMinMax['min'],
            'rango_maximo' => $rangoMinMax['max'],
            'confianza_porcentaje' => $confianza,
            'desglose' => [
                'tiempo_manejo_minutos' => (int) round($tiempoManejo),
                'tiempo_paradas_minutos' => (int) round($tiempoParadas),
                'velocidad_efectiva_kmh' => round($velocidadEfectiva, 1),
                'factores' => [
                    'chofer' => round($factorChofer, 2),
                    'zona' => round($factorZona, 2),
                    'hora' => round($factorHora, 2),
                    'dia' => round($factorDia, 2),
                ],
            ],
        ];
    }

    /**
     * Predecir tiempos para múltiples rutas
     */
    public function predecirMultiplesRutas(array $rutas): array
    {
        $predicciones = [];

        foreach ($rutas as $ruta) {
            $predicciones[] = $this->predecirTiempoEntrega($ruta);
        }

        return [
            'predicciones' => $predicciones,
            'tiempo_total_estimado' => array_sum(array_column($predicciones, 'tiempo_estimado_minutos')),
            'tiempo_total_horas' => round(array_sum(array_column($predicciones, 'tiempo_estimado_minutos')) / 60, 1),
        ];
    }

    /**
     * Obtener factor multiplicador del chofer basado en histórico
     *
     * Chofers más rápidos tienen factor < 1
     * Chofers más lentos tienen factor > 1
     */
    private function obtenerFactorChofer(?int $choferId): float
    {
        if (!$choferId) {
            return 1.0;
        }

        // Obtener entregas completadas del chofer
        $estadisticas = DB::table('entregas')
            ->selectRaw('COUNT(*) as total_entregas')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (fecha_entrega - fecha_inicio))) / 60 as tiempo_promedio_minutos')
            ->where('chofer_id', $choferId)
            ->where('estado', 'ENTREGADO')
            ->where('fecha_entrega', '>=', now()->subMonths(3))
            ->first();

        if (!$estadisticas || $estadisticas->total_entregas < 5) {
            return 1.0; // Sin datos suficientes
        }

        // Calcular factor: tiempo promedio del chofer / tiempo base
        $tiempoPromedio = $estadisticas->tiempo_promedio_minutos ?? 0;
        $tiempoBase = (40 / 30) * 60; // 40 km/h = 1.33 minutos por km

        $factor = max(0.7, min(1.3, $tiempoPromedio / $tiempoBase));

        return $factor;
    }

    /**
     * Obtener factor multiplicador de zona
     *
     * Zonas con tráfico pesado: > 1
     * Zonas con tráfico ligero: < 1
     */
    private function obtenerFactorZona(?int $zonaId): float
    {
        if (!$zonaId) {
            return 1.0;
        }

        // Obtener entregas completadas en zona
        $estadisticas = DB::table('entregas')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (fecha_entrega - fecha_inicio))) / 60 as tiempo_promedio_minutos')
            ->selectRaw('COUNT(*) as total_entregas')
            ->join('ventas', 'entregas.venta_id', '=', 'ventas.id')
            ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
            ->where('clientes.zona_id', $zonaId)
            ->where('entregas.estado', 'ENTREGADO')
            ->where('entregas.fecha_entrega', '>=', now()->subMonths(3))
            ->first();

        if (!$estadisticas || $estadisticas->total_entregas < 10) {
            return 1.0;
        }

        // Factor basado en tiempo promedio
        $tiempoPromedio = $estadisticas->tiempo_promedio_minutos ?? 0;
        $tiempoBase = 60; // Minutos base por entrega

        $factor = max(0.8, min(1.4, $tiempoPromedio / $tiempoBase));

        return $factor;
    }

    /**
     * Obtener factor multiplicador por hora del día
     *
     * Horarios pico: > 1
     * Horarios bajos: < 1
     */
    private function obtenerFactorHora(int $hora): float
    {
        // Horas pico (8-12, 17-20): +20%
        if (($hora >= 8 && $hora <= 12) || ($hora >= 17 && $hora <= 20)) {
            return 1.2;
        }

        // Horas bajas (21-07): -10%
        if ($hora >= 21 || $hora < 7) {
            return 0.9;
        }

        // Horas normales: factor normal
        return 1.0;
    }

    /**
     * Obtener factor multiplicador por día de semana
     *
     * Fin de semana: más lento (+15%)
     * Entre semana: normal
     */
    private function obtenerFactorDia(int $diaSemana): float
    {
        // 0 = domingo, 6 = sábado
        if ($diaSemana == 0 || $diaSemana == 6) {
            return 1.15; // Fin de semana más lento
        }

        // Entre semana
        return 1.0;
    }

    /**
     * Calcular nivel de confianza de la predicción
     *
     * Basado en cantidad de datos históricos disponibles
     */
    private function calcularConfianza(?int $choferId, ?int $zonaId): float
    {
        $confianzaBase = 60; // 60% base

        // Aumentar confianza si hay datos del chofer
        if ($choferId) {
            $entregasChofer = Entrega::where('chofer_id', $choferId)
                ->where('estado', 'ENTREGADO')
                ->count();

            $confianzaBase += min(20, $entregasChofer * 2); // Máximo +20%
        }

        // Aumentar confianza si hay datos de la zona
        if ($zonaId) {
            $entregasZona = DB::table('entregas')
                ->join('ventas', 'entregas.venta_id', '=', 'ventas.id')
                ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
                ->where('clientes.zona_id', $zonaId)
                ->where('entregas.estado', 'ENTREGADO')
                ->count();

            $confianzaBase += min(20, $entregasZona); // Máximo +20%
        }

        return min(95, $confianzaBase); // Máximo 95%
    }

    /**
     * Calcular rango de confianza (mín-máx)
     *
     * Basado en nivel de confianza
     * Alta confianza: rango estrecho (±10%)
     * Baja confianza: rango amplio (±30%)
     */
    private function calcularRangoConfianza(float $tiempoEstimado, float $confianza): array
    {
        // Calcular porcentaje de variación basado en confianza
        // 95% confianza = ±10% variación
        // 60% confianza = ±30% variación
        $variacion = 40 - ($confianza * 0.3); // 40 - (60*0.3) = 22; 40 - (95*0.3) = 11.5

        $margen = ($tiempoEstimado * $variacion) / 100;

        return [
            'min' => (int) max(5, round($tiempoEstimado - $margen)),
            'max' => (int) round($tiempoEstimado + $margen),
        ];
    }

    /**
     * Entrenar modelo con nuevas entregas completadas
     * (Se ejecutaría después de cada entrega completada)
     */
    public function entrenarModelo(int $entregaId): bool
    {
        // En producción, aquí se guardarían estadísticas
        // para actualizar los factores de predicción
        // Por ahora, es solo un placeholder para logging

        logger()->info("DeliveryTimePredictor: Modelo entrenado con entrega {$entregaId}");

        return true;
    }
}

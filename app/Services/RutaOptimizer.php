<?php

namespace App\Services;

use Exception;

/**
 * RutaOptimizer - Optimización de rutas con Bin Packing + Nearest Neighbor
 *
 * ALGORITMO HÍBRIDO:
 * 1. First Fit Decreasing (FFD) → Agrupar por capacidad
 * 2. Nearest Neighbor (NN) → Optimizar orden por distancia
 *
 * Input: Lista de entregas + capacidad
 * Output: Múltiples rutas optimizadas (si excede capacidad)
 */
class RutaOptimizer
{
    private BinPacker $binPacker;

    public function __construct()
    {
        $this->binPacker = new BinPacker();
    }
    /**
     * Punto de inicio (base/oficina)
     */
    private array $punto_inicio = [
        'nombre' => 'OFICINA_PAUCARA',
        'lat' => -17.3895,
        'lon' => -66.1568
    ];

    /**
     * Velocidad promedio (km/hora)
     */
    private float $velocidad_promedio = 40;

    /**
     * Tiempo en parada (minutos)
     */
    private int $tiempo_parada = 10;

    /**
     * ALGORITMO: Nearest Neighbor (Greedy) con Retorno a Base
     *
     * FLUJO:
     * 1. Inicia en punto_inicio (base/oficina)
     * 2. Loop: Selecciona entrega más cercana sin visitar
     * 3. Valida capacidad del vehículo
     * 4. Agrega a ruta y actualiza ubicación
     * 5. Retorna a base (cierre de circuito)
     *
     * COMPLEJIDAD: O(n²) - Funciona bien para <100 entregas
     * OPTIMALIDAD: No garantizada (greedy), típicamente 15-25% sobre óptimo
     *
     * @param array $entregas Lista de entregas con ['cliente_id', 'lat', 'lon', 'peso']
     * @param float $capacidad_max Capacidad máxima del vehículo (kg)
     * @return array ['ruta', 'distancia_total', 'distancia_regreso', 'tiempo_estimado', ...]
     */
    public function obtenerRutaOptimizada(array $entregas, float $capacidad_max): array
    {
        if (empty($entregas)) {
            throw new Exception("Lista de entregas vacía");
        }

        // Inicializar
        $ruta = [];
        $ubicacion_actual = $this->punto_inicio;
        $entregas_pendientes = array_values($entregas);  // Reset keys
        $distancia_total = 0;
        $peso_acumulado = 0;

        // LOOP PRINCIPAL: Greedy - ir siempre al más cercano
        while (!empty($entregas_pendientes)) {

            // 1. Encontrar ENTREGA MÁS CERCANA
            $indice_cercana = $this->encontrarMasCercana(
                $ubicacion_actual,
                $entregas_pendientes
            );

            if ($indice_cercana === null) {
                break;
            }

            $entrega_cercana = $entregas_pendientes[$indice_cercana];

            // 2. Validar capacidad
            $peso_entrega = $entrega_cercana['peso'] ?? 0;
            if (($peso_acumulado + $peso_entrega) > $capacidad_max) {
                // No cabe más - parar aquí y crear nueva ruta
                break;
            }

            // 3. Calcular distancia
            $distancia = $this->calcularDistanciaHaversine(
                $ubicacion_actual['lat'],
                $ubicacion_actual['lon'],
                $entrega_cercana['lat'],
                $entrega_cercana['lon']
            );

            // 4. Agregar a ruta
            $ruta[] = [
                'cliente_id' => $entrega_cercana['cliente_id'],
                'venta_id' => $entrega_cercana['venta_id'] ?? $entrega_cercana['id'] ?? null,
                'entrega_id' => $entrega_cercana['entrega_id'] ?? $entrega_cercana['id'] ?? null,
                'direccion' => $entrega_cercana['direccion'] ?? 'N/A',
                'lat' => $entrega_cercana['lat'],
                'lon' => $entrega_cercana['lon'],
                'peso' => $peso_entrega,
                'distancia_anterior' => $distancia,
                'distancia_siguiente' => 0  // Se actualiza en próxima iteración
            ];

            // 5. Actualizar estado
            $distancia_total += $distancia;
            $peso_acumulado += $peso_entrega;
            $ubicacion_actual = [
                'lat' => $entrega_cercana['lat'],
                'lon' => $entrega_cercana['lon']
            ];

            // 6. Remover de pendientes
            unset($entregas_pendientes[$indice_cercana]);
            $entregas_pendientes = array_values($entregas_pendientes);  // Reset keys
        }

        // ✅ IMPORTANTE: Retornar a base (cierre del circuito)
        $distancia_regreso = $this->calcularDistanciaHaversine(
            $ubicacion_actual['lat'],
            $ubicacion_actual['lon'],
            $this->punto_inicio['lat'],
            $this->punto_inicio['lon']
        );
        $distancia_total += $distancia_regreso;

        // Calcular distancia a siguiente parada para cada item
        for ($i = 0; $i < count($ruta) - 1; $i++) {
            $ruta[$i]['distancia_siguiente'] = $this->calcularDistanciaHaversine(
                $ruta[$i]['lat'],
                $ruta[$i]['lon'],
                $ruta[$i + 1]['lat'],
                $ruta[$i + 1]['lon']
            );
        }

        // Última parada a base
        $ruta[count($ruta) - 1]['distancia_siguiente'] = $distancia_regreso;

        // Calcular tiempo total (incluye regreso a base)
        $tiempo_estimado_minutos = $this->calcularTiempoTotal($distancia_total, count($ruta));

        return [
            'ruta' => $ruta,
            'distancia_total' => round($distancia_total, 2),  // Ya incluye retorno a base
            'distancia_regreso' => round($distancia_regreso, 2),  // Distancia de retorno explícita
            'tiempo_estimado' => $tiempo_estimado_minutos,  // Incluye tiempo de retorno
            'paradas' => count($ruta),
            'peso_total' => $peso_acumulado,
            'entregas_no_asignadas' => count($entregas_pendientes)
        ];
    }

    /**
     * Encontrar la entrega más cercana a la ubicación actual
     */
    private function encontrarMasCercana(array $ubicacion_actual, array $entregas_pendientes): ?int
    {
        $distancia_minima = PHP_FLOAT_MAX;
        $indice_cercana = null;

        foreach ($entregas_pendientes as $indice => $entrega) {
            $distancia = $this->calcularDistanciaHaversine(
                $ubicacion_actual['lat'],
                $ubicacion_actual['lon'],
                $entrega['lat'],
                $entrega['lon']
            );

            if ($distancia < $distancia_minima) {
                $distancia_minima = $distancia;
                $indice_cercana = $indice;
            }
        }

        return $indice_cercana;
    }

    /**
     * FÓRMULA HAVERSINE: Distancia entre 2 puntos GPS
     *
     * Calcula la distancia en kilómetros entre dos coordenadas (lat/lon)
     * usando la fórmula de Haversine (tierra redonda)
     */
    private function calcularDistanciaHaversine(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $RADIO_TIERRA = 6371; // km

        // Convertir a radianes
        $lat1_rad = deg2rad($lat1);
        $lon1_rad = deg2rad($lon1);
        $lat2_rad = deg2rad($lat2);
        $lon2_rad = deg2rad($lon2);

        // Diferencias
        $delta_lat = $lat2_rad - $lat1_rad;
        $delta_lon = $lon2_rad - $lon1_rad;

        // Fórmula Haversine
        $a = sin($delta_lat / 2) ** 2 +
             cos($lat1_rad) * cos($lat2_rad) * sin($delta_lon / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distancia = $RADIO_TIERRA * $c;

        return $distancia;
    }

    /**
     * Calcular tiempo total estimado
     * Tiempo = (distancia / velocidad) + (paradas × tiempo_parada)
     */
    private function calcularTiempoTotal(float $distancia_km, int $paradas): int
    {
        // Minutos manejando
        $tiempo_manejo = ($distancia_km / $this->velocidad_promedio) * 60;

        // Minutos en paradas
        $tiempo_paradas = $paradas * $this->tiempo_parada;

        return (int) ceil($tiempo_manejo + $tiempo_paradas);
    }

    /**
     * ALGORITMO HÍBRIDO: FFD (Bin Packing) + Nearest Neighbor
     *
     * FLUJO COMPLETO:
     * 1. Agrupar entregas por capacidad (First Fit Decreasing)
     * 2. Para cada grupo, optimizar orden por distancia (Nearest Neighbor)
     * 3. Retornar múltiples rutas optimizadas
     *
     * Este método es ideal para planificación diaria con múltiples vehículos
     *
     * @param array $entregas Lista completa de entregas del día
     * @param float $capacidad_max Capacidad estándar de vehículos (kg)
     * @return array ['rutas' => [...], 'estadisticas' => [...]]
     */
    public function optimizarMultiplesRutas(array $entregas, float $capacidad_max): array
    {
        if (empty($entregas)) {
            return [
                'rutas' => [],
                'estadisticas' => [
                    'total_entregas' => 0,
                    'rutas_creadas' => 0,
                    'uso_promedio_capacidad' => 0,
                ],
            ];
        }

        // PASO 1: Agrupar por capacidad usando FFD
        $bins = $this->binPacker->agrupar($entregas, $capacidad_max, 0.95);

        // PASO 2: Optimizar cada bin por distancia
        $rutasOptimizadas = [];
        foreach ($bins as $bin) {
            $entregasBin = $bin['items'];

            // Aplicar Nearest Neighbor a este grupo
            $rutaOptimizada = $this->obtenerRutaOptimizada($entregasBin, $capacidad_max);

            // Agregar metadata del bin
            $rutaOptimizada['bin_numero'] = $bin['bin_numero'];
            $rutaOptimizada['peso_total_bin'] = $bin['peso_total'];
            $rutaOptimizada['porcentaje_uso'] = $bin['porcentaje_uso'];
            $rutaOptimizada['sobrecargado'] = $bin['sobrecargado'] ?? false;

            $rutasOptimizadas[] = $rutaOptimizada;
        }

        // PASO 3: Calcular estadísticas globales
        $estadisticas = $this->binPacker->obtenerEstadisticas($bins, $capacidad_max);
        $estadisticas['distancia_total'] = array_sum(array_column($rutasOptimizadas, 'distancia_total'));
        $estadisticas['tiempo_total_minutos'] = array_sum(array_column($rutasOptimizadas, 'tiempo_estimado'));

        return [
            'rutas' => $rutasOptimizadas,
            'estadisticas' => $estadisticas,
        ];
    }

    /**
     * Optimizar entregas con balanceo de carga (Best Fit)
     *
     * Similar a optimizarMultiplesRutas pero usa Best Fit en lugar de First Fit
     * Resulta en mejor distribución de peso entre rutas
     */
    public function optimizarMultiplesRutasBalanceado(array $entregas, float $capacidad_max): array
    {
        if (empty($entregas)) {
            return [
                'rutas' => [],
                'estadisticas' => [
                    'total_entregas' => 0,
                    'rutas_creadas' => 0,
                    'uso_promedio_capacidad' => 0,
                ],
            ];
        }

        // PASO 1: Agrupar con Best Fit
        $bins = $this->binPacker->agruparBalanceado($entregas, $capacidad_max, 0.95);

        // PASO 2: Optimizar cada bin
        $rutasOptimizadas = [];
        foreach ($bins as $bin) {
            $entregasBin = $bin['items'];

            $rutaOptimizada = $this->obtenerRutaOptimizada($entregasBin, $capacidad_max);

            $rutaOptimizada['bin_numero'] = $bin['bin_numero'];
            $rutaOptimizada['peso_total_bin'] = $bin['peso_total'];
            $rutaOptimizada['porcentaje_uso'] = $bin['porcentaje_uso'];
            $rutaOptimizada['sobrecargado'] = $bin['sobrecargado'] ?? false;

            $rutasOptimizadas[] = $rutaOptimizada;
        }

        // PASO 3: Estadísticas
        $estadisticas = $this->binPacker->obtenerEstadisticas($bins, $capacidad_max);
        $estadisticas['distancia_total'] = array_sum(array_column($rutasOptimizadas, 'distancia_total'));
        $estadisticas['tiempo_total_minutos'] = array_sum(array_column($rutasOptimizadas, 'tiempo_estimado'));

        return [
            'rutas' => $rutasOptimizadas,
            'estadisticas' => $estadisticas,
        ];
    }
}

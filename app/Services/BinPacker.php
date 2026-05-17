<?php

namespace App\Services;

/**
 * BinPacker - Algoritmo First Fit Decreasing (FFD) para Bin Packing
 *
 * PROBLEMA: Agrupar N entregas en M vehículos minimizando cantidad de vehículos
 * ALGORITMO: First Fit Decreasing (FFD)
 *
 * FLUJO:
 * 1. Ordenar entregas por peso DESCENDENTE (más pesadas primero)
 * 2. Para cada entrega, intentar asignarla al PRIMER bin que tenga espacio
 * 3. Si ningún bin tiene espacio, crear nuevo bin
 *
 * COMPLEJIDAD: O(n log n) por sorting + O(n * m) por asignación = O(n²) worst case
 * APROXIMACIÓN: FFD garantiza usar ≤ 11/9 * OPT + 6/9 bins (muy bueno)
 */
class BinPacker
{
    /**
     * Agrupar entregas en bins (vehículos/rutas) usando First Fit Decreasing
     *
     * @param array $entregas Array de entregas con ['id', 'peso', ...otros campos]
     * @param float $capacidadBin Capacidad máxima por bin (kg)
     * @param float $margenSeguridad Porcentaje de margen (0.9 = 90% de capacidad)
     * @return array Array de bins, cada bin = ['items' => [...], 'peso_total' => float, 'capacidad_restante' => float]
     */
    public function agrupar(array $entregas, float $capacidadBin, float $margenSeguridad = 0.95): array
    {
        if (empty($entregas)) {
            return [];
        }

        // Aplicar margen de seguridad (ej: usar solo 95% de capacidad real)
        $capacidadEfectiva = $capacidadBin * $margenSeguridad;

        // PASO 1: Ordenar entregas por peso DESCENDENTE (First Fit DECREASING)
        usort($entregas, function ($a, $b) {
            $pesoA = $a['peso'] ?? $a['peso_kg'] ?? 0;
            $pesoB = $b['peso'] ?? $b['peso_kg'] ?? 0;
            return $pesoB <=> $pesoA; // Orden descendente
        });

        // PASO 2: Inicializar bins
        $bins = [];

        // PASO 3: Asignar cada entrega al PRIMER bin que tenga espacio
        foreach ($entregas as $entrega) {
            $peso = $entrega['peso'] ?? $entrega['peso_kg'] ?? 0;

            // Validar que la entrega no exceda capacidad máxima
            if ($peso > $capacidadEfectiva) {
                // Entrega muy pesada - crear bin dedicado (excepcional)
                $bins[] = [
                    'items' => [$entrega],
                    'peso_total' => $peso,
                    'capacidad_restante' => $capacidadEfectiva - $peso,
                    'sobrecargado' => true,
                ];
                continue;
            }

            // Buscar PRIMER bin con espacio suficiente
            $asignado = false;
            foreach ($bins as &$bin) {
                if ($bin['capacidad_restante'] >= $peso) {
                    // ✅ Cabe en este bin
                    $bin['items'][] = $entrega;
                    $bin['peso_total'] += $peso;
                    $bin['capacidad_restante'] -= $peso;
                    $asignado = true;
                    break;
                }
            }
            unset($bin); // Romper referencia

            // Si no cupo en ningún bin, crear nuevo
            if (!$asignado) {
                $bins[] = [
                    'items' => [$entrega],
                    'peso_total' => $peso,
                    'capacidad_restante' => $capacidadEfectiva - $peso,
                    'sobrecargado' => false,
                ];
            }
        }

        // PASO 4: Agregar metadata útil
        foreach ($bins as $index => &$bin) {
            $bin['bin_numero'] = $index + 1;
            $bin['cantidad_items'] = count($bin['items']);
            $bin['porcentaje_uso'] = round(($bin['peso_total'] / $capacidadEfectiva) * 100, 2);
        }
        unset($bin);

        return $bins;
    }

    /**
     * Agrupar con balanceo de carga
     *
     * Intenta distribuir entregas más uniformemente entre bins
     * Usa BEST FIT en lugar de FIRST FIT
     *
     * @param array $entregas
     * @param float $capacidadBin
     * @param float $margenSeguridad
     * @return array
     */
    public function agruparBalanceado(array $entregas, float $capacidadBin, float $margenSeguridad = 0.95): array
    {
        if (empty($entregas)) {
            return [];
        }

        $capacidadEfectiva = $capacidadBin * $margenSeguridad;

        // Ordenar por peso descendente
        usort($entregas, function ($a, $b) {
            $pesoA = $a['peso'] ?? $a['peso_kg'] ?? 0;
            $pesoB = $b['peso'] ?? $b['peso_kg'] ?? 0;
            return $pesoB <=> $pesoA;
        });

        $bins = [];

        foreach ($entregas as $entrega) {
            $peso = $entrega['peso'] ?? $entrega['peso_kg'] ?? 0;

            if ($peso > $capacidadEfectiva) {
                $bins[] = [
                    'items' => [$entrega],
                    'peso_total' => $peso,
                    'capacidad_restante' => $capacidadEfectiva - $peso,
                    'sobrecargado' => true,
                ];
                continue;
            }

            // BEST FIT: Buscar bin con MENOR espacio restante que aún quepa
            $mejorBin = null;
            $menorEspacioRestante = PHP_FLOAT_MAX;

            foreach ($bins as $index => &$bin) {
                if ($bin['capacidad_restante'] >= $peso) {
                    $espacioRestanteDespues = $bin['capacidad_restante'] - $peso;
                    if ($espacioRestanteDespues < $menorEspacioRestante) {
                        $menorEspacioRestante = $espacioRestanteDespues;
                        $mejorBin = $index;
                    }
                }
            }
            unset($bin);

            if ($mejorBin !== null) {
                // Asignar al mejor bin
                $bins[$mejorBin]['items'][] = $entrega;
                $bins[$mejorBin]['peso_total'] += $peso;
                $bins[$mejorBin]['capacidad_restante'] -= $peso;
            } else {
                // Crear nuevo bin
                $bins[] = [
                    'items' => [$entrega],
                    'peso_total' => $peso,
                    'capacidad_restante' => $capacidadEfectiva - $peso,
                    'sobrecargado' => false,
                ];
            }
        }

        // Agregar metadata
        foreach ($bins as $index => &$bin) {
            $bin['bin_numero'] = $index + 1;
            $bin['cantidad_items'] = count($bin['items']);
            $bin['porcentaje_uso'] = round(($bin['peso_total'] / $capacidadEfectiva) * 100, 2);
        }
        unset($bin);

        return $bins;
    }

    /**
     * Obtener estadísticas de empaquetado
     */
    public function obtenerEstadisticas(array $bins, float $capacidadBin): array
    {
        if (empty($bins)) {
            return [
                'cantidad_bins' => 0,
                'items_totales' => 0,
                'peso_total' => 0,
                'uso_promedio' => 0,
                'bins_sobrecargados' => 0,
            ];
        }

        $itemsTotales = 0;
        $pesoTotal = 0;
        $usoPromedio = 0;
        $binsSobrecargados = 0;

        foreach ($bins as $bin) {
            $itemsTotales += $bin['cantidad_items'] ?? 0;
            $pesoTotal += $bin['peso_total'] ?? 0;
            $usoPromedio += $bin['porcentaje_uso'] ?? 0;
            if ($bin['sobrecargado'] ?? false) {
                $binsSobrecargados++;
            }
        }

        return [
            'cantidad_bins' => count($bins),
            'items_totales' => $itemsTotales,
            'peso_total' => round($pesoTotal, 2),
            'uso_promedio' => round($usoPromedio / count($bins), 2),
            'bins_sobrecargados' => $binsSobrecargados,
            'capacidad_bin' => $capacidadBin,
        ];
    }
}

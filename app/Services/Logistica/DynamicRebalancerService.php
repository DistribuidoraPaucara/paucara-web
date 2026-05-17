<?php

namespace App\Services\Logistica;

/**
 * DynamicRebalancerService - Rebalanceo Dinámico de Cargas
 *
 * PHASE 3.4: Rebalanceo Dinámico
 *
 * Algoritmo: Best Fit Decreasing + Análisis de Alternativas
 *
 * Características:
 * ✓ Detecta cuando vehículos se llenarían
 * ✓ Sugiere reasignaciones automáticas
 * ✓ Optimiza uso de múltiples vehículos
 * ✓ Balanceo de carga equitativo
 *
 * Mejora: Mejor distribución de entregas, menos rechazos
 */
class DynamicRebalancerService
{
    /**
     * Porcentaje máximo de utilización recomendado
     */
    private float $umbralUtilizacion = 0.85; // 85%

    /**
     * Rebalancear entregas entre múltiples vehículos
     *
     * Entrada:
     * - Lista de entregas con pesos
     * - Lista de vehículos disponibles
     *
     * Salida:
     * - Asignaciones optimizadas
     * - Sugerencias de cambios
     * - Estadísticas de balance
     *
     * @param array $entregas Lista de entregas {id, peso, ...}
     * @param array $vehiculos Lista de vehículos {id, capacidad_kg, ...}
     * @return array ['asignaciones' => [...], 'sugerencias' => [...], 'estadisticas' => [...]]
     */
    public function rebalancearEntregas(array $entregas, array $vehiculos): array
    {
        if (empty($entregas) || empty($vehiculos)) {
            return [
                'asignaciones' => [],
                'sugerencias' => [],
                'estadisticas' => [],
                'exitoso' => true,
            ];
        }

        // 1. Ordenar entregas por peso (descendente)
        usort($entregas, function ($a, $b) {
            return ($b['peso'] ?? 0) <=> ($a['peso'] ?? 0);
        });

        // 2. Asignar usando Best Fit Decreasing
        $asignaciones = $this->asignarBestFitDecreasing($entregas, $vehiculos);

        // 3. Detectar problemas de balance
        $problemas = $this->detectarProblemas($asignaciones, $vehiculos);

        // 4. Generar sugerencias de rebalanceo
        $sugerencias = [];
        if (!empty($problemas)) {
            $sugerencias = $this->generarSugerenciasRebalanceo($asignaciones, $vehiculos, $problemas);
        }

        // 5. Calcular estadísticas
        $estadisticas = $this->calcularEstadisticasBalance($asignaciones, $vehiculos);

        return [
            'asignaciones' => $asignaciones,
            'problemas_detectados' => $problemas,
            'sugerencias_rebalanceo' => $sugerencias,
            'estadisticas' => $estadisticas,
            'exitoso' => empty($problemas),
        ];
    }

    /**
     * Asignar entregas usando Best Fit Decreasing
     *
     * Best Fit: Asignar cada entrega al vehículo que tenga
     * MENOS espacio sobrante después de la asignación
     *
     * Este método produce mejor balance que First Fit
     */
    private function asignarBestFitDecreasing(array $entregas, array $vehiculos): array
    {
        $asignaciones = [];
        $capacidadesDisponibles = [];

        // Inicializar capacidades
        foreach ($vehiculos as $vehiculo) {
            $asignaciones[$vehiculo['id']] = [
                'vehiculo_id' => $vehiculo['id'],
                'vehiculo_info' => $vehiculo,
                'entregas' => [],
                'peso_total' => 0,
                'capacidad_maxima' => $vehiculo['capacidad_kg'],
            ];
            $capacidadesDisponibles[$vehiculo['id']] = $vehiculo['capacidad_kg'];
        }

        // Asignar entregas (Best Fit)
        foreach ($entregas as $entrega) {
            $pesoEntrega = $entrega['peso'] ?? 0;

            // Encontrar mejor fit
            $mejorVehiculo = null;
            $menorEspacioSobrante = PHP_FLOAT_MAX;

            foreach ($capacidadesDisponibles as $vehiculoId => $capacidadDisponible) {
                if ($pesoEntrega <= $capacidadDisponible) {
                    $espacioSobrante = $capacidadDisponible - $pesoEntrega;

                    if ($espacioSobrante < $menorEspacioSobrante) {
                        $menorEspacioSobrante = $espacioSobrante;
                        $mejorVehiculo = $vehiculoId;
                    }
                }
            }

            // Si no cabe en ningún vehículo, dejar sin asignar
            if ($mejorVehiculo === null) {
                continue;
            }

            // Asignar a mejor vehículo
            $asignaciones[$mejorVehiculo]['entregas'][] = $entrega;
            $asignaciones[$mejorVehiculo]['peso_total'] += $pesoEntrega;
            $capacidadesDisponibles[$mejorVehiculo] -= $pesoEntrega;
        }

        return $asignaciones;
    }

    /**
     * Detectar problemas de balance
     *
     * Problemas identificados:
     * - Sobrecarga (peso > capacidad)
     * - Desequilibrio (diferencia > 20%)
     * - Subutilización (< 50% capacidad)
     */
    private function detectarProblemas(array $asignaciones, array $vehiculos): array
    {
        $problemas = [];

        // Calcular utilización por vehículo
        $utilizaciones = [];
        foreach ($asignaciones as $asignacion) {
            $capacidad = $asignacion['capacidad_maxima'];
            $utilizada = $asignacion['peso_total'];
            $porcentaje = ($utilizada / max($capacidad, 1)) * 100;

            $utilizaciones[] = [
                'vehiculo_id' => $asignacion['vehiculo_id'],
                'porcentaje' => $porcentaje,
                'peso' => $utilizada,
                'capacidad' => $capacidad,
            ];
        }

        // Detectar problemas
        foreach ($utilizaciones as $util) {
            // Problema 1: Sobrecarga
            if ($util['porcentaje'] > 100) {
                $problemas[] = [
                    'tipo' => 'SOBRECARGA',
                    'vehiculo_id' => $util['vehiculo_id'],
                    'mensaje' => "Vehículo sobrecargado: {$util['peso']} kg de {$util['capacidad']} kg",
                    'exceso_kg' => $util['peso'] - $util['capacidad'],
                    'severidad' => 'CRITICA',
                ];
            }
        }

        // Problema 2: Desequilibrio
        if (count($utilizaciones) > 1) {
            $utilizacionesPromedio = array_sum(array_column($utilizaciones, 'porcentaje')) / count($utilizaciones);

            foreach ($utilizaciones as $util) {
                $diferencia = abs($util['porcentaje'] - $utilizacionesPromedio);

                if ($diferencia > 20) {
                    $problemas[] = [
                        'tipo' => 'DESEQUILIBRIO',
                        'vehiculo_id' => $util['vehiculo_id'],
                        'mensaje' => "Desequilibrio: {$util['porcentaje']}% vs {$utilizacionesPromedio}% promedio",
                        'diferencia_porcentaje' => $diferencia,
                        'severidad' => 'MEDIA',
                    ];
                }
            }
        }

        // Problema 3: Subutilización
        foreach ($utilizaciones as $util) {
            if ($util['porcentaje'] < 50) {
                $problemas[] = [
                    'tipo' => 'SUBUTILIZACION',
                    'vehiculo_id' => $util['vehiculo_id'],
                    'mensaje' => "Vehículo subutilizado: solo {$util['porcentaje']}% de capacidad",
                    'capacidad_disponible' => $util['capacidad'] - $util['peso'],
                    'severidad' => 'BAJA',
                ];
            }
        }

        return $problemas;
    }

    /**
     * Generar sugerencias de rebalanceo
     */
    private function generarSugerenciasRebalanceo(
        array $asignaciones,
        array $vehiculos,
        array $problemas
    ): array {
        $sugerencias = [];

        // Para cada problema de sobrecarga
        foreach ($problemas as $problema) {
            if ($problema['tipo'] === 'SOBRECARGA') {
                $vehiculoProblema = $asignaciones[$problema['vehiculo_id']];
                $exceso = $problema['exceso_kg'];

                // Encontrar entregas para mover (menores primero)
                $entregasOrdenadas = $vehiculoProblema['entregas'];
                usort($entregasOrdenadas, function ($a, $b) {
                    return ($a['peso'] ?? 0) <=> ($b['peso'] ?? 0);
                });

                $entregasAMover = [];
                $pesoAMover = 0;

                foreach ($entregasOrdenadas as $entrega) {
                    if ($pesoAMover >= $exceso + 10) { // 10 kg de margen
                        break;
                    }

                    $entregasAMover[] = $entrega;
                    $pesoAMover += $entrega['peso'] ?? 0;
                }

                // Buscar vehículo alternativo
                foreach ($asignaciones as $alt) {
                    if ($alt['vehiculo_id'] === $problema['vehiculo_id']) {
                        continue;
                    }

                    $espacioDisponible = $alt['capacidad_maxima'] - $alt['peso_total'];

                    if ($pesoAMover <= $espacioDisponible) {
                        $sugerencias[] = [
                            'tipo' => 'MOVER_ENTREGAS',
                            'desde_vehiculo' => $problema['vehiculo_id'],
                            'hacia_vehiculo' => $alt['vehiculo_id'],
                            'entregas_ids' => array_column($entregasAMover, 'id'),
                            'peso_a_mover' => $pesoAMover,
                            'mensaje' => "Mover {count($entregasAMover)} entregas ({$pesoAMover} kg) de {$problema['vehiculo_id']} a {$alt['vehiculo_id']}",
                            'prioridad' => 'ALTA',
                        ];
                        break;
                    }
                }
            }

            // Para cada problema de subutilización
            if ($problema['tipo'] === 'SUBUTILIZACION') {
                $sugerencias[] = [
                    'tipo' => 'COMBINAR_VEHICULOS',
                    'vehiculo_id' => $problema['vehiculo_id'],
                    'capacidad_disponible' => $problema['capacidad_disponible'],
                    'mensaje' => "Considerar combinar entregas de este vehículo con otro",
                    'prioridad' => 'BAJA',
                ];
            }
        }

        return $sugerencias;
    }

    /**
     * Calcular estadísticas de balance
     */
    private function calcularEstadisticasBalance(array $asignaciones, array $vehiculos): array
    {
        $utilizaciones = [];
        $pesoTotalAsignado = 0;
        $capacidadTotal = 0;

        foreach ($asignaciones as $asignacion) {
            $utilizacion = ($asignacion['peso_total'] / max($asignacion['capacidad_maxima'], 1)) * 100;
            $utilizaciones[] = $utilizacion;
            $pesoTotalAsignado += $asignacion['peso_total'];
            $capacidadTotal += $asignacion['capacidad_maxima'];
        }

        // Calcular desviación estándar (medir varianza en balance)
        $promedio = array_sum($utilizaciones) / max(count($utilizaciones), 1);
        $varianzas = array_map(function ($u) use ($promedio) {
            return pow($u - $promedio, 2);
        }, $utilizaciones);
        $varianza = array_sum($varianzas) / max(count($varianzas), 1);
        $desviacionEstandar = sqrt($varianza);

        return [
            'vehiculos_utilizados' => count($asignaciones),
            'peso_total_asignado' => round($pesoTotalAsignado, 2),
            'capacidad_total' => round($capacidadTotal, 2),
            'utilizacion_promedio_porcentaje' => round($promedio, 2),
            'desviacion_estandar' => round($desviacionEstandar, 2),
            'balance_score' => $this->calcularBalanceScore($desviacionEstandar),
            'utilizaciones_por_vehiculo' => $utilizaciones,
        ];
    }

    /**
     * Calcular score de balance (0-100)
     * 100 = Balance perfecto
     * 0 = Balance muy malo
     */
    private function calcularBalanceScore(float $desviacionEstandar): int
    {
        // Mapear desviación estándar a score
        // Desv. 0 = 100 puntos (perfecto)
        // Desv. 20 = 50 puntos
        // Desv. 40+ = 0 puntos (muy malo)

        return max(0, min(100, (int) (100 - ($desviacionEstandar * 2.5))));
    }

    /**
     * Aplicar sugerencias de rebalanceo
     */
    public function aplicarRebalanceo(
        array $asignacionesActual,
        array $sugerencias,
        array $vehiculos
    ): array {
        $asignacionesNuevas = $asignacionesActual;

        foreach ($sugerencias as $sugerencia) {
            if ($sugerencia['tipo'] === 'MOVER_ENTREGAS') {
                // Mover entregas de un vehículo a otro
                $desde = $sugerencia['desde_vehiculo'];
                $hacia = $sugerencia['hacia_vehiculo'];
                $entregasIds = $sugerencia['entregas_ids'];

                // Remover de origen
                $asignacionesNuevas[$desde]['entregas'] = array_filter(
                    $asignacionesNuevas[$desde]['entregas'],
                    fn($e) => !in_array($e['id'], $entregasIds)
                );

                // Actualizar peso
                $asignacionesNuevas[$desde]['peso_total'] -= $sugerencia['peso_a_mover'];

                // Agregar a destino
                foreach ($asignacionesActual[$desde]['entregas'] as $entrega) {
                    if (in_array($entrega['id'], $entregasIds)) {
                        $asignacionesNuevas[$hacia]['entregas'][] = $entrega;
                    }
                }

                // Actualizar peso destino
                $asignacionesNuevas[$hacia]['peso_total'] += $sugerencia['peso_a_mover'];
            }
        }

        return $asignacionesNuevas;
    }
}

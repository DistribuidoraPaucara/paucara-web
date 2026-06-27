<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VentasStatisticsService
{
    /**
     * Obtener estadísticas de ventas del preventista
     *
     * @param int $preventistaId - ID del preventista
     * @return array Con estructura: ['ventas_aprobadas' => N, 'ventas_anuladas' => N]
     */
    public static function obtenerEstadisticasVentas(int $preventistaId): array
    {
        try {
            // ✅ DEBUG: Log inicial
            Log::info('📊 [VentasStatisticsService] Obteniendo estadísticas para preventista', [
                'preventista_id' => $preventistaId,
            ]);

            // Obtener IDs de estados de documento
            $estadoAprobadoId = DB::table('estados_documento')
                ->where('codigo', 'APROBADO')
                ->value('id');

            $estadoAnuladoId = DB::table('estados_documento')
                ->where('codigo', 'ANULADO')
                ->value('id');

            Log::info('🔍 [VentasStatisticsService] Estados encontrados', [
                'estado_aprobado_id' => $estadoAprobadoId,
                'estado_anulado_id' => $estadoAnuladoId,
            ]);

            // Filtro de fechas: Solo del día actual
            $fechaDesde = now()->startOfDay();
            $fechaHasta = now();

            // Contar ventas por estado (solo del día actual)
            $ventasAprobadas = DB::table('ventas')
                ->where('preventista_id', $preventistaId)
                ->whereDate('created_at', '>=', $fechaDesde)
                ->whereDate('created_at', '<=', $fechaHasta)
                ->when($estadoAprobadoId, function ($query) use ($estadoAprobadoId) {
                    $query->where('estado_documento_id', $estadoAprobadoId);
                })
                ->count();

            $ventasAnuladas = DB::table('ventas')
                ->where('preventista_id', $preventistaId)
                ->whereDate('created_at', '>=', $fechaDesde)
                ->whereDate('created_at', '<=', $fechaHasta)
                ->when($estadoAnuladoId, function ($query) use ($estadoAnuladoId) {
                    $query->where('estado_documento_id', $estadoAnuladoId);
                })
                ->count();

            Log::info('✅ [VentasStatisticsService] Conteos finales', [
                'ventas_aprobadas' => $ventasAprobadas,
                'ventas_anuladas' => $ventasAnuladas,
            ]);

            return [
                'success' => true,
                'ventas_aprobadas' => (int) $ventasAprobadas,
                'ventas_anuladas' => (int) $ventasAnuladas,
                'total_ventas' => (int) ($ventasAprobadas + $ventasAnuladas),
            ];

        } catch (\Exception $e) {
            Log::error('❌ [VentasStatisticsService] Error obteniendo estadísticas', [
                'error' => $e->getMessage(),
                'preventista_id' => $preventistaId,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Error al obtener estadísticas de ventas: ' . $e->getMessage(),
                'ventas_aprobadas' => 0,
                'ventas_anuladas' => 0,
                'total_ventas' => 0,
            ];
        }
    }
}

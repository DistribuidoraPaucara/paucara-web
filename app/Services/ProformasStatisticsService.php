<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProformasStatisticsService
{
    /**
     * Obtener estadísticas de proformas del preventista
     * Separa: proformas CREADAS hoy vs proformas con ENTREGA_SOLICITADA hoy
     *
     * @param int $usuarioCreadorId - ID del usuario (preventista)
     * @return array Con estructura: ['creadas_hoy' => [...], 'entrega_solicitada_hoy' => [...]]
     */
    public static function obtenerEstadisticasProformas(int $usuarioCreadorId): array
    {
        try {
            $hoy = now()->startOfDay();

            Log::info('📊 [ProformasStatisticsService] Obteniendo estadísticas para usuario (HOY)', [
                'usuario_id' => $usuarioCreadorId,
                'fecha' => $hoy->format('Y-m-d'),
            ]);

            // Obtener IDs de estados de logística
            $estadoPendienteId = DB::table('estados_logistica')
                ->where('categoria', 'proforma')
                ->where('codigo', 'PENDIENTE')
                ->value('id');

            $estadoConvertidaId = DB::table('estados_logistica')
                ->where('categoria', 'proforma')
                ->where('codigo', 'CONVERTIDA')
                ->value('id');

            $estadoRechazadaId = DB::table('estados_logistica')
                ->where('categoria', 'proforma')
                ->where('codigo', 'RECHAZADA')
                ->value('id');

            Log::info('🔍 [ProformasStatisticsService] Estados encontrados', [
                'estado_pendiente_id' => $estadoPendienteId,
                'estado_convertida_id' => $estadoConvertidaId,
                'estado_rechazada_id' => $estadoRechazadaId,
            ]);

            // ========================================
            // PROFORMAS CREADAS HOY
            // ========================================
            $creadasHoyPendientes = DB::table('proformas')
                ->where('usuario_creador_id', $usuarioCreadorId)
                ->whereDate('created_at', $hoy)
                ->when($estadoPendienteId, function ($query) use ($estadoPendienteId) {
                    $query->where('estado_proforma_id', $estadoPendienteId);
                })
                ->count();

            $creadasHoyConvertidas = DB::table('proformas')
                ->where('usuario_creador_id', $usuarioCreadorId)
                ->whereDate('created_at', $hoy)
                ->when($estadoConvertidaId, function ($query) use ($estadoConvertidaId) {
                    $query->where('estado_proforma_id', $estadoConvertidaId);
                })
                ->count();

            $creadasHoyRechazadas = DB::table('proformas')
                ->where('usuario_creador_id', $usuarioCreadorId)
                ->whereDate('created_at', $hoy)
                ->when($estadoRechazadaId, function ($query) use ($estadoRechazadaId) {
                    $query->where('estado_proforma_id', $estadoRechazadaId);
                })
                ->count();

            // ========================================
            // PROFORMAS CON ENTREGA SOLICITADA HOY
            // ========================================
            $entregaHoyPendientes = DB::table('proformas')
                ->where('usuario_creador_id', $usuarioCreadorId)
                ->whereDate('fecha_entrega_solicitada', $hoy)
                ->when($estadoPendienteId, function ($query) use ($estadoPendienteId) {
                    $query->where('estado_proforma_id', $estadoPendienteId);
                })
                ->count();

            $entregaHoyConvertidas = DB::table('proformas')
                ->where('usuario_creador_id', $usuarioCreadorId)
                ->whereDate('fecha_entrega_solicitada', $hoy)
                ->when($estadoConvertidaId, function ($query) use ($estadoConvertidaId) {
                    $query->where('estado_proforma_id', $estadoConvertidaId);
                })
                ->count();

            $entregaHoyRechazadas = DB::table('proformas')
                ->where('usuario_creador_id', $usuarioCreadorId)
                ->whereDate('fecha_entrega_solicitada', $hoy)
                ->when($estadoRechazadaId, function ($query) use ($estadoRechazadaId) {
                    $query->where('estado_proforma_id', $estadoRechazadaId);
                })
                ->count();

            Log::info('✅ [ProformasStatisticsService] Conteos finales', [
                'creadas_hoy' => [
                    'pendientes' => $creadasHoyPendientes,
                    'convertidas' => $creadasHoyConvertidas,
                    'rechazadas' => $creadasHoyRechazadas,
                ],
                'entrega_solicitada_hoy' => [
                    'pendientes' => $entregaHoyPendientes,
                    'convertidas' => $entregaHoyConvertidas,
                    'rechazadas' => $entregaHoyRechazadas,
                ],
            ]);

            return [
                'success' => true,
                'creadas_hoy' => [
                    'pendientes' => (int) $creadasHoyPendientes,
                    'convertidas' => (int) $creadasHoyConvertidas,
                    'rechazadas' => (int) $creadasHoyRechazadas,
                    'total' => (int) ($creadasHoyPendientes + $creadasHoyConvertidas + $creadasHoyRechazadas),
                ],
                'entrega_solicitada_hoy' => [
                    'pendientes' => (int) $entregaHoyPendientes,
                    'convertidas' => (int) $entregaHoyConvertidas,
                    'rechazadas' => (int) $entregaHoyRechazadas,
                    'total' => (int) ($entregaHoyPendientes + $entregaHoyConvertidas + $entregaHoyRechazadas),
                ],
            ];

        } catch (\Exception $e) {
            Log::error('❌ [ProformasStatisticsService] Error obteniendo estadísticas', [
                'error' => $e->getMessage(),
                'usuario_creador_id' => $usuarioCreadorId,
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Error al obtener estadísticas de proformas: ' . $e->getMessage(),
                'creadas_hoy' => [
                    'pendientes' => 0,
                    'convertidas' => 0,
                    'rechazadas' => 0,
                    'total' => 0,
                ],
                'entrega_solicitada_hoy' => [
                    'pendientes' => 0,
                    'convertidas' => 0,
                    'rechazadas' => 0,
                    'total' => 0,
                ],
            ];
        }
    }
}

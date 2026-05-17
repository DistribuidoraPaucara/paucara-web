<?php

namespace App\Services;

use App\Models\EntregaVentaConfirmacion;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * ✅ NUEVO: Servicio para generar reportes desde entregas_venta_confirmaciones
 *
 * Permite:
 * - Filtrar entregas por tipo (COMPLETA, CON_NOVEDAD)
 * - Filtrar por tipo de novedad específico
 * - Generar reportes de entregas problemáticas
 * - Estadísticas de entregas
 * - Análisis de problemas más comunes
 */
class EntregaReportesService
{
    /**
     * Obtener todas las entregas confirmadas en un rango de fechas
     */
    public static function obtenerEntregasEnRango(Carbon $desde, Carbon $hasta)
    {
        return EntregaVentaConfirmacion::whereBetween('confirmado_en', [$desde, $hasta])
            ->with(['entrega', 'venta', 'confirmadobPor'])
            ->orderBy('confirmado_en', 'desc')
            ->get();
    }

    /**
     * Obtener solo entregas completas (sin problemas)
     */
    public static function obtenerEntregasCompletas(Carbon $desde = null, Carbon $hasta = null)
    {
        $query = EntregaVentaConfirmacion::where('tipo_entrega', 'COMPLETA')
            ->with(['entrega', 'venta']);

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        return $query->orderBy('confirmado_en', 'desc')->get();
    }

    /**
     * Obtener solo entregas con novedades (problemas)
     */
    public static function obtenerEntregasConNovedades(Carbon $desde = null, Carbon $hasta = null)
    {
        $query = EntregaVentaConfirmacion::where('tipo_entrega', 'CON_NOVEDAD')
            ->with(['entrega', 'venta', 'confirmadobPor']);

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        return $query->orderBy('confirmado_en', 'desc')->get();
    }

    /**
     * Obtener entregas por tipo de novedad específico
     */
    public static function obtenerEntregasPorTipoNovedad(string $tipoNovedad, Carbon $desde = null, Carbon $hasta = null)
    {
        $query = EntregaVentaConfirmacion::where('tipo_novedad', $tipoNovedad)
            ->with(['entrega', 'venta', 'confirmadobPor']);

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        return $query->orderBy('confirmado_en', 'desc')->get();
    }

    /**
     * Contar entregas por tipo
     */
    public static function contarPorTipo(Carbon $desde = null, Carbon $hasta = null): array
    {
        $query = EntregaVentaConfirmacion::query();

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        return [
            'completas' => $query->where('tipo_entrega', 'COMPLETA')->count(),
            'novedades' => $query->where('tipo_entrega', 'CON_NOVEDAD')->count(),
            'total' => $query->count(),
        ];
    }

    /**
     * Contar por tipo de novedad
     */
    public static function contarPorTipoNovedad(Carbon $desde = null, Carbon $hasta = null): array
    {
        $query = EntregaVentaConfirmacion::where('tipo_entrega', 'CON_NOVEDAD');

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        return [
            'cliente_cerrado' => $query->where('tipo_novedad', 'CLIENTE_CERRADO')->count(),
            'devolucion_parcial' => $query->where('tipo_novedad', 'DEVOLUCION_PARCIAL')->count(),
            'rechazada' => $query->where('tipo_novedad', 'RECHAZADO')->count(),
        ];
    }

    /**
     * Obtener tasa de éxito (% entregas completas)
     */
    public static function obtenerTasaExito(Carbon $desde = null, Carbon $hasta = null): float
    {
        $query = EntregaVentaConfirmacion::query();

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        $total = $query->count();
        if ($total === 0) {
            return 0.0;
        }

        $completas = $query->where('tipo_entrega', 'COMPLETA')->count();
        return ($completas / $total) * 100;
    }

    /**
     * Obtener entregas por chofer (usuario que confirmó)
     */
    public static function obtenerEntregasPorChofer(int $userId, Carbon $desde = null, Carbon $hasta = null)
    {
        $query = EntregaVentaConfirmacion::where('confirmado_por', $userId)
            ->with(['entrega', 'venta']);

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        return $query->orderBy('confirmado_en', 'desc')->get();
    }

    /**
     * Obtener estadísticas completas
     */
    public static function obtenerEstadisticasCompletas(Carbon $desde = null, Carbon $hasta = null): array
    {
        $query = EntregaVentaConfirmacion::query();

        if ($desde && $hasta) {
            $query->whereBetween('confirmado_en', [$desde, $hasta]);
        }

        $counts = self::contarPorTipo($desde, $hasta);
        $countsByNovedad = self::contarPorTipoNovedad($desde, $hasta);

        return [
            'periodo' => [
                'desde' => $desde?->format('Y-m-d H:i:s'),
                'hasta' => $hasta?->format('Y-m-d H:i:s'),
            ],
            'resumen_entregas' => $counts,
            'tasa_exito_porcentaje' => self::obtenerTasaExito($desde, $hasta),
            'desglose_novedades' => $countsByNovedad,
            'entregas' => [
                'completas' => $counts['completas'],
                'con_problemas' => $counts['novedades'],
                'total' => $counts['total'],
            ],
            'novedades_detalles' => [
                'cliente_cerrado' => $countsByNovedad['cliente_cerrado'],
                'devolucion_parcial' => $countsByNovedad['devolucion_parcial'],
                'rechazada' => $countsByNovedad['rechazada'],
            ],
        ];
    }

    /**
     * Exportar a formato para gráficos
     */
    public static function obtenerDataParaGraficos(Carbon $desde = null, Carbon $hasta = null): array
    {
        $completas = $this->contarPorTipo($desde, $hasta)['completas'];
        $novedades = $this->contarPorTipo($desde, $hasta)['novedades'];
        $tipos = $this->contarPorTipoNovedad($desde, $hasta);

        return [
            'tipo_entrega' => [
                'labels' => ['Completas', 'Con Novedades'],
                'data' => [$completas, $novedades],
            ],
            'tipo_novedad' => [
                'labels' => ['Cliente Cerrado', 'Devolución Parcial', 'Rechazada'],
                'data' => [
                    $tipos['cliente_cerrado'],
                    $tipos['devolucion_parcial'],
                    $tipos['rechazada'],
                ],
            ],
        ];
    }
}

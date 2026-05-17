<?php

namespace App\Models\Traits;

use Carbon\Carbon;

/**
 * Trait con scopes comunes para filtros por fecha
 *
 * Elimina duplicación de código para scopeDelDia(), scopePorFecha(), etc.
 * Usado en modelos donde es frecuente filtrar por fechas:
 *
 * - AperturaCaja
 * - CierreCaja
 * - MovimientoCaja
 * - MovimientoInventario
 * - TransferenciaInventario
 * - Pago
 * - HistorialPrecio
 * - UbicacionTracking
 * - PermissionAudit
 *
 * Métodos disponibles:
 * - scopeDelDia($query, $fecha, $column)
 * - scopePorFecha($query, $inicio, $fin, $column)
 * - scopeEntreFechas($query, $inicio, $fin, $column)
 * - scopeRecientes($query, $dias, $column)
 * - scopePorMes($query, $mes, $año, $column)
 * - scopePorAño($query, $año, $column)
 */
trait HasDateScopes
{
    /**
     * Scope para filtrar registros de un día específico
     *
     * Busca todos los registros cuya fecha es igual a la especificada.
     * Por defecto filtra por hoy.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Carbon|string|null $fecha Fecha a filtrar (default: hoy)
     * @param string $column Nombre de la columna de fecha (default: 'fecha')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // Registros de hoy
     * MovimientoCaja::delDia()->get();
     *
     * // Registros de una fecha específica
     * MovimientoCaja::delDia(Carbon::parse('2025-12-01'))->get();
     *
     * // Registros de hoy en columna específica
     * HistorialPrecio::delDia(null, 'fecha_cambio')->get();
     */
    public function scopeDelDia($query, $fecha = null, string $column = 'fecha')
    {
        $fecha = $fecha instanceof Carbon ? $fecha : Carbon::parse($fecha ?? now());

        return $query->whereDate($column, $fecha);
    }

    /**
     * Scope para filtrar por rango de fechas (INCLUSIVE)
     *
     * Retorna registros donde fecha >= inicio AND fecha <= fin
     * Si solo se especifica inicio, filtra desde esa fecha en adelante.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Carbon|string $fechaInicio Fecha de inicio del rango (INCLUSIVE)
     * @param Carbon|string|null $fechaFin Fecha de fin del rango (INCLUSIVE), default null = sin límite superior
     * @param string $column Nombre de la columna de fecha (default: 'fecha')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // Registros entre dos fechas
     * Pago::porFecha('2025-12-01', '2025-12-31')->get();
     *
     * // Registros desde una fecha en adelante
     * Pago::porFecha('2025-12-01')->get();
     *
     * // Registros entre fechas en columna específica
     * TransferenciaInventario::porFecha(
     *     Carbon::now()->subMonth(),
     *     Carbon::now(),
     *     'fecha_envio'
     * )->get();
     */
    public function scopePorFecha($query, $fechaInicio, $fechaFin = null, string $column = 'fecha')
    {
        $fechaInicio = $fechaInicio instanceof Carbon ? $fechaInicio : Carbon::parse($fechaInicio);

        $query->whereDate($column, '>=', $fechaInicio);

        if ($fechaFin) {
            $fechaFin = $fechaFin instanceof Carbon ? $fechaFin : Carbon::parse($fechaFin);
            $query->whereDate($column, '<=', $fechaFin);
        }

        return $query;
    }

    /**
     * Alias para scopePorFecha - Filtrar entre dos fechas
     *
     * Método adicional para mayor claridad en algunos casos.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Carbon|string $inicio
     * @param Carbon|string $fin
     * @param string $column
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplo:
     * MovimientoInventario::entreFechas('2025-12-01', '2025-12-31')->get();
     */
    public function scopeEntreFechas($query, $inicio, $fin, string $column = 'fecha')
    {
        return $this->scopePorFecha($query, $inicio, $fin, $column);
    }

    /**
     * Scope para filtrar registros RECIENTES
     *
     * Retorna registros de los últimos N días.
     * Útil para dashboards y reportes de actividad reciente.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $dias Últimos N días (default: 30)
     * @param string $column Nombre de la columna de fecha (default: 'created_at')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // Registros del último mes
     * HistorialPrecio::recientes()->get();
     *
     * // Registros de los últimos 7 días
     * MovimientoCaja::recientes(7)->get();
     *
     * // Registros recientes en columna específica
     * PermissionAudit::recientes(14, 'fecha_auditoria')->get();
     */
    public function scopeRecientes($query, int $dias = 30, string $column = 'created_at')
    {
        return $query->where($column, '>=', now()->subDays($dias));
    }

    /**
     * Scope para filtrar por mes y año específico
     *
     * Retorna todos los registros del mes/año indicado.
     * Por defecto filtra el mes/año actual.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int|null $mes Número de mes (1-12), null = mes actual
     * @param int|null $año Año, null = año actual
     * @param string $column Nombre de la columna de fecha (default: 'fecha')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // Registros del mes actual
     * MovimientoCaja::porMes()->get();
     *
     * // Registros de un mes específico
     * Pago::porMes(12, 2024)->get();  // Diciembre 2024
     *
     * // Registros del mes actual en columna específica
     * TransferenciaInventario::porMes(null, null, 'fecha_entrega')->get();
     */
    public function scopePorMes($query, $mes = null, $año = null, string $column = 'fecha')
    {
        $mes = $mes ?? now()->month;
        $año = $año ?? now()->year;

        return $query->whereYear($column, $año)
                     ->whereMonth($column, $mes);
    }

    /**
     * Scope para filtrar por año específico
     *
     * Retorna todos los registros del año indicado.
     * Por defecto filtra el año actual.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int|null $año Año, null = año actual
     * @param string $column Nombre de la columna de fecha (default: 'fecha')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // Registros del año actual
     * Pago::porAño()->get();
     *
     * // Registros de un año específico
     * MovimientoCaja::porAño(2024)->get();
     *
     * // Registros del año actual en columna específica
     * HistorialPrecio::porAño(null, 'fecha_cambio')->get();
     */
    public function scopePorAño($query, $año = null, string $column = 'fecha')
    {
        $año = $año ?? now()->year;

        return $query->whereYear($column, $año);
    }

    /**
     * Scope para filtrar registros de HOY
     *
     * Shortcut para delDia() sin parámetros.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $column
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplo:
     * MovimientoCaja::hoy()->get();
     */
    public function scopeHoy($query, string $column = 'fecha')
    {
        return $this->scopeDelDia($query, now(), $column);
    }

    /**
     * Scope para filtrar registros de AYER
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $column
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplo:
     * MovimientoCaja::ayer()->get();
     */
    public function scopeAyer($query, string $column = 'fecha')
    {
        return $this->scopeDelDia($query, now()->subDay(), $column);
    }

    /**
     * Scope para filtrar registros de ESTA SEMANA
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $column
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplo:
     * Pago::estaSemana()->get();
     */
    public function scopeEstaSemana($query, string $column = 'fecha')
    {
        return $query->whereBetween($column, [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ]);
    }

    /**
     * Scope para filtrar registros de ESTE MES
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $column
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplo:
     * MovimientoCaja::esteMes()->get();
     */
    public function scopeEsteMes($query, string $column = 'fecha')
    {
        return $query->whereBetween($column, [
            now()->startOfMonth(),
            now()->endOfMonth(),
        ]);
    }

    /**
     * Scope para filtrar registros de ESTE AÑO
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $column
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplo:
     * Pago::esteAño()->get();
     */
    public function scopeEsteAño($query, string $column = 'fecha')
    {
        return $query->whereBetween($column, [
            now()->startOfYear(),
            now()->endOfYear(),
        ]);
    }
}

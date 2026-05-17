<?php

namespace App\Models\Traits;

/**
 * Trait con scopes genéricos para filtrar por estado
 *
 * Propósito: Centralizar lógica de filtros por estado de manera genérica.
 * Cada modelo define sus propias constantes y alias específicos.
 *
 * Usado en modelos:
 * - Proforma (PENDIENTE, APROBADA, RECHAZADA, CONVERTIDA, VENCIDA)
 * - Venta (PENDIENTE, CONFIRMADA, RECHAZADA, CANCELADA)
 * - Entrega (PENDIENTE, EN_RUTA, ENTREGADA, RECHAZADA)
 * - Envio (PROGRAMADO, EN_RUTA, ENTREGADO, FALLIDO)
 * - Ruta (ACTIVA, COMPLETADA, CANCELADA)
 * - ConteoFisico (PENDIENTE, EN_PROGRESO, FINALIZADO)
 * - TransferenciaInventario (PENDIENTE, ENVIADA, RECIBIDA)
 * - CuentaPorCobrar (PENDIENTE, PARCIALMENTE_PAGADA, PAGADA, VENCIDA)
 * - FacturaElectronica (VIGENTE, ANULADA, OBSERVADA)
 * - LibroVentasIva (VIGENTE, ANULADA)
 *
 * Métodos disponibles:
 * - scopePorEstado($query, $estado, $column)
 * - scopePorEstados($query, $estados, $column)
 * - scopeSinEstados($query, $estados, $column)
 *
 * Uso en modelo:
 * class Proforma extends Model {
 *     use HasEstadoScopes;
 *
 *     const PENDIENTE = 'PENDIENTE';
 *     const APROBADA = 'APROBADA';
 *
 *     public function scopePendientes($query) {
 *         return $this->scopePorEstado($query, self::PENDIENTE);
 *     }
 *
 *     public function scopeAprobadas($query) {
 *         return $this->scopePorEstado($query, self::APROBADA);
 *     }
 * }
 */
trait HasEstadoScopes
{
    /**
     * Scope genérico para filtrar por UN estado específico
     *
     * Método base que pueden usar todos los modelos.
     * Los modelos específicos crean aliases como scopePendientes(), scopeAprobadas(), etc.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $estado Valor del estado
     * @param string $column Nombre de la columna de estado (default: 'estado')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // En ProformaService o Controller
     * $proformas = Proforma::porEstado('APROBADA')->get();
     *
     * // Con columna específica
     * Venta::porEstado('CONFIRMADA', 'estado_venta')->get();
     */
    public function scopePorEstado($query, string $estado, string $column = 'estado')
    {
        return $query->where($column, $estado);
    }

    /**
     * Scope para filtrar por MÚLTIPLES estados
     *
     * Retorna registros cuyo estado está en la lista proporcionada.
     * Equivalente a: WHERE estado IN (estado1, estado2, estado3)
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $estados Array de estados a incluir
     * @param string $column Nombre de la columna de estado (default: 'estado')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // Proformas pendientes de procesamiento
     * $pendientes = Proforma::porEstados(['PENDIENTE', 'PARCIALMENTE_REVISADA'])->get();
     *
     * // Envíos finalizados (completados o fallidos)
     * $finalizados = Envio::porEstados(['ENTREGADO', 'FALLIDO'])->get();
     *
     * // Con columna específica
     * Venta::porEstados(['CONFIRMADA', 'ENVIADA'], 'estado_logistico')->get();
     */
    public function scopePorEstados($query, array $estados, string $column = 'estado')
    {
        return $query->whereIn($column, $estados);
    }

    /**
     * Scope para EXCLUIR estados específicos
     *
     * Retorna registros cuyo estado NO está en la lista proporcionada.
     * Equivalente a: WHERE estado NOT IN (estado1, estado2)
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $estados Array de estados a excluir
     * @param string $column Nombre de la columna de estado (default: 'estado')
     * @return \Illuminate\Database\Eloquent\Builder
     *
     * Ejemplos:
     * // Todas las proformas EXCEPTO las rechazadas y vencidas
     * $activas = Proforma::sinEstados(['RECHAZADA', 'VENCIDA'])->get();
     *
     * // Entregas que no fueron fallidas
     * $exitosas = Entrega::sinEstados(['RECHAZADA', 'FALLIDA'])->get();
     *
     * // Con columna específica
     * Venta::sinEstados(['CANCELADA'], 'estado_venta')->get();
     */
    public function scopeSinEstados($query, array $estados, string $column = 'estado')
    {
        return $query->whereNotIn($column, $estados);
    }

    /**
     * Método helper: Verificar si un registro está en un estado específico
     *
     * Útil en lógica de controladores y servicios.
     *
     * @param string $estado Estado a verificar
     * @param string $column Nombre de la columna (default: 'estado')
     * @return bool true si está en ese estado, false si no
     *
     * Ejemplos:
     * if ($proforma->estaEnEstado('PENDIENTE')) {
     *     $proforma->aprobar();
     * }
     *
     * if ($envio->estaEnEstado('EN_RUTA', 'estado_logistico')) {
     *     // Hacer algo
     * }
     */
    public function estaEnEstado(string $estado, string $column = 'estado'): bool
    {
        return $this->{$column} === $estado;
    }

    /**
     * Método helper: Verificar si está en ALGUNO de los estados
     *
     * @param array $estados Array de estados a verificar
     * @param string $column Nombre de la columna (default: 'estado')
     * @return bool true si está en alguno de los estados
     *
     * Ejemplo:
     * if ($venta->estaEnAlgunEstado(['PENDIENTE', 'CONFIRMADA'])) {
     *     // Puede procesarse
     * }
     */
    public function estaEnAlgunEstado(array $estados, string $column = 'estado'): bool
    {
        return in_array($this->{$column}, $estados);
    }

    /**
     * Método helper: Cambiar el estado del registro
     *
     * Realiza el cambio de estado Y lo persiste en la BD.
     * Usa save() por lo que dispara eventos del modelo (updating, updated).
     *
     * @param string $nuevoEstado Nuevo valor de estado
     * @param string $column Nombre de la columna (default: 'estado')
     * @return bool true si se guardó exitosamente
     *
     * Ejemplos:
     * $proforma->cambiarEstado('APROBADA');  // Guarda y dispara eventos
     *
     * $envio->cambiarEstado('ENTREGADO', 'estado_logistico');
     */
    public function cambiarEstado(string $nuevoEstado, string $column = 'estado'): bool
    {
        $this->{$column} = $nuevoEstado;
        return $this->save();
    }

    /**
     * Obtener el nombre legible del estado actual
     *
     * Puede ser sobrescrito en el modelo para personalizaciones.
     * Por defecto retorna el valor tal cual.
     *
     * @param string $column
     * @return string Estado en formato legible
     *
     * Ejemplo (sobrescribir en modelo):
     * public function getNombreEstadoAttribute(): string {
     *     return match($this->estado) {
     *         'PENDIENTE' => 'Pendiente de Aprobación',
     *         'APROBADA' => 'Aprobada',
     *         'RECHAZADA' => 'Rechazada',
     *         default => $this->estado,
     *     };
     * }
     */
    public function getNombreEstado(string $column = 'estado'): string
    {
        // Convertir ESTADO_SEPARADO_POR_GUION a Formato Legible
        return str_replace('_', ' ', ucfirst(strtolower($this->{$column})));
    }

    /**
     * Scope para filtrar registros activos (estado != cancelado/inactivo)
     *
     * Asume que hay estados que indican "inactividad" como CANCELADA, RECHAZADA.
     * Puede ser sobrescrito en modelos específicos.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $column
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActivos($query, string $column = 'estado')
    {
        // Estados por defecto que indican "inactivo"
        $estadosInactivos = ['CANCELADA', 'RECHAZADA', 'ANULADA', 'ELIMINADA'];
        return $query->whereNotIn($column, $estadosInactivos);
    }
}

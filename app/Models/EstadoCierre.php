<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Model: EstadoCierre
 *
 * Responsabilidades:
 * ✅ Definir los posibles estados para cierres de caja
 * ✅ Proporcionar relaciones con CierreCaja
 * ✅ Mantener configuración de colores y orden de presentación
 *
 * Estados:
 * - PENDIENTE: Cierre creado, pendiente de verificación por admin
 * - CONSOLIDADA: Cierre verificado y aprobado
 * - RECHAZADA: Cierre rechazado con motivo, requiere corrección
 * - CORREGIDA: Cierre rechazado que fue corregido
 */
class EstadoCierre extends Model
{
    protected $table = 'estados_cierre';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'color',
        'orden',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    // ========== RELACIONES ==========

    /**
     * Relación: Un estado tiene muchos cierres
     */
    public function cierres(): HasMany
    {
        return $this->hasMany(CierreCaja::class, 'estado_cierre_id');
    }

    // ========== SCOPES ==========

    /**
     * Filtrar solo estados activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true)->orderBy('orden');
    }

    /**
     * Obtener estado por código
     */
    public function scopePorCodigo($query, string $codigo)
    {
        return $query->where('codigo', $codigo);
    }

    // ========== CONSTANTES ==========

    const PENDIENTE = 'PENDIENTE';
    const CONSOLIDADA = 'CONSOLIDADA';
    const RECHAZADA = 'RECHAZADA';
    const CORREGIDA = 'CORREGIDA';

    // ========== MÉTODOS ESTÁTICOS ==========

    /**
     * Obtener estado por código
     */
    public static function obtenerPorCodigo(string $codigo): ?self
    {
        return static::where('codigo', $codigo)->first();
    }

    /**
     * Obtener ID del estado PENDIENTE
     */
    public static function obtenerIdPendiente(): ?int
    {
        return static::where('codigo', self::PENDIENTE)->value('id');
    }

    /**
     * Obtener ID del estado CONSOLIDADA
     */
    public static function obtenerIdConsolidada(): ?int
    {
        return static::where('codigo', self::CONSOLIDADA)->value('id');
    }

    /**
     * Obtener ID del estado RECHAZADA
     */
    public static function obtenerIdRechazada(): ?int
    {
        return static::where('codigo', self::RECHAZADA)->value('id');
    }

    /**
     * Obtener ID del estado CORREGIDA
     */
    public static function obtenerIdCorregida(): ?int
    {
        return static::where('codigo', self::CORREGIDA)->value('id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AjusteInventario extends Model
{
    use HasFactory;

    protected $table = 'ajustes_inventario';

    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'numero',
        'almacen_id',
        'user_id',
        'cantidad_entradas',
        'cantidad_salidas',
        'cantidad_productos',
        'observacion',
        'estado',
        'fecha_anulacion',
        'user_anulacion_id',
        'motivo_anulacion',
        'created_at',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_entradas'  => 'integer',
            'cantidad_salidas'   => 'integer',
            'cantidad_productos' => 'integer',
            'created_at'         => 'datetime',
            'updated_at'         => 'datetime',
            'fecha_anulacion'    => 'datetime',
        ];
    }

    // Constantes de estado
    const ESTADO_PENDIENTE = 'pendiente';
    const ESTADO_PROCESADO = 'procesado';
    const ESTADO_ANULADO = 'anulado';

    /**
     * Relaciones
     */
    public function almacen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class, 'almacen_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function userAnulacion(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_anulacion_id');
    }

    /**
     * Relación con movimientos de inventario asociados al ajuste
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'ajuste_inventario_id');
    }

    /**
     * Generar número único para el ajuste usando el ID del registro
     * Formato: AJ20260215-0045 (donde 45 es el ID del registro)
     */
    public static function generarNumero($idOAlmacenId = null): string
    {
        // Si es un número pequeño (ID), usarlo directamente
        // Si es un almacén_id o null, generar número temporal
        if (is_numeric($idOAlmacenId) && $idOAlmacenId > 0) {
            // Es un ID - usar directamente
            $id = (int) $idOAlmacenId;
            $fecha = now()->format('Ymd');
            return "AJ{$fecha}-" . str_pad($id, 4, '0', STR_PAD_LEFT);
        } else {
            // Generar número temporal (solo para compatibilidad)
            $almacenId = $idOAlmacenId ?? auth()->user()->empresa->almacen_id ?? 1;
            $fecha = now()->format('Ymd');
            $prefijo = "AJ{$fecha}";
            return "{$prefijo}-TEMP";
        }
    }

    /**
     * Scope: obtener ajustes procesados
     */
    public function scopeProcesados($query)
    {
        return $query->where('estado', self::ESTADO_PROCESADO);
    }

    /**
     * Scope: obtener ajustes pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', self::ESTADO_PENDIENTE);
    }

    /**
     * Scope: filtrar por almacén
     */
    public function scopePorAlmacen($query, $almacenId)
    {
        return $query->where('almacen_id', $almacenId);
    }

    /**
     * Scope: obtener ajustes de una fecha
     */
    public function scopePorFecha($query, $fecha)
    {
        return $query->whereDate('created_at', $fecha);
    }
}

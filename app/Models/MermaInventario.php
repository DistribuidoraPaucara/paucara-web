<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MermaInventario extends Model
{
    use HasFactory;

    protected $table = 'mermas_inventario';

    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'numero',
        'almacen_id',
        'user_id',
        'tipo_merma',
        'cantidad_productos',
        'costo_total',
        'observacion',
        'estado',
        'created_at',
        'updated_at',
    ];

    protected function casts(): array
    {
        return [
            'cantidad_productos' => 'integer',
            'costo_total'        => 'decimal:2',
            'created_at'         => 'datetime',
            'updated_at'         => 'datetime',
        ];
    }

    // Constantes de estado
    const ESTADO_PENDIENTE = 'pendiente';
    const ESTADO_PROCESADO = 'procesado';

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

    /**
     * Relación con movimientos de inventario asociados a la merma
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'merma_inventario_id');
    }

    /**
     * Generar número único para la merma usando el ID del registro
     * Formato: MERMA20260215-0045 (donde 45 es el ID del registro)
     */
    public static function generarNumero($idOAlmacenId = null): string
    {
        // Si es un número pequeño (ID), usarlo directamente
        // Si es un almacén_id o null, generar número temporal
        if (is_numeric($idOAlmacenId) && $idOAlmacenId > 0) {
            // Es un ID - usar directamente
            $id = (int) $idOAlmacenId;
            $fecha = now()->format('Ymd');
            return "MERMA{$fecha}-" . str_pad($id, 4, '0', STR_PAD_LEFT);
        } else {
            // Generar número temporal (solo para compatibilidad)
            $almacenId = $idOAlmacenId ?? auth()->user()->empresa->almacen_id ?? 1;
            $fecha = now()->format('Ymd');
            $prefijo = "MERMA{$fecha}";
            return "{$prefijo}-TEMP";
        }
    }

    /**
     * Scope: obtener mermas procesadas
     */
    public function scopeProcesadas($query)
    {
        return $query->where('estado', self::ESTADO_PROCESADO);
    }

    /**
     * Scope: obtener mermas pendientes
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
     * Scope: obtener mermas de una fecha
     */
    public function scopePorFecha($query, $fecha)
    {
        return $query->whereDate('created_at', $fecha);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockProducto extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $table = 'stock_productos';

    protected $fillable = [
        'producto_id',
        'almacen_id',
        'sector_id',
        'cantidad',
        'cantidad_reservada',
        'cantidad_disponible',
        'fecha_actualizacion',
        'lote',
        'fecha_vencimiento',
        'precio_costo',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'int',
            'cantidad_reservada' => 'int',
            'cantidad_disponible' => 'int',
            'precio_costo' => 'decimal:2',
            'fecha_actualizacion' => 'datetime',
            'fecha_vencimiento' => 'date',
            'deleted_at' => 'datetime', // ✓ Para SoftDeletes
        ];
    }

    /**
     * Nombre del campo deleted_at para soft deletes
     */
    const DELETED_AT = 'deleted_at';

    /**
     * Relaciones
     */
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'almacen_id');
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class, 'sector_id');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class, 'stock_producto_id');
    }

    /**
     * Scopes
     */
    public function scopePorProducto($query, $productoId)
    {
        return $query->where('producto_id', $productoId);
    }

    public function scopePorAlmacen($query, $almacenId)
    {
        return $query->where('almacen_id', $almacenId);
    }

    public function scopeConStock($query)
    {
        return $query->where('cantidad', '>', 0);
    }

    public function scopeProximoVencer($query, int $diasAnticipacion = 30)
    {
        $fechaLimite = now()->addDays($diasAnticipacion);

        return $query->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<=', $fechaLimite)
            ->where('fecha_vencimiento', '>', now());
    }

    public function scopeVencido($query)
    {
        return $query->whereNotNull('fecha_vencimiento')
            ->where('fecha_vencimiento', '<', now());
    }

    /**
     * FASE 3: Scopes adicionales para optimización
     */

    /**
     * Scope: Stock disponible (cantidad_disponible > 0)
     * Uso: StockProducto::disponible()->get()
     */
    public function scopeDisponible($query)
    {
        return $query->where('cantidad_disponible', '>', 0);
    }

    /**
     * Scope: Con reservas activas
     */
    public function scopeConReservas($query)
    {
        return $query->where('cantidad_reservada', '>', 0);
    }

    /**
     * Scope: Filtrar por lote
     */
    public function scopePorLote($query, string $lote)
    {
        return $query->where('lote', $lote);
    }

    /**
     * Scope: Ordenar por FIFO (usado en procesamiento de ventas)
     * Uso: StockProducto::ordenFifo()->get()
     */
    public function scopeOrdenFifo($query)
    {
        return $query->orderBy('fecha_vencimiento', 'asc')
                     ->orderBy('id', 'asc');
    }

    /**
     * Scope: Cargar relaciones básicas (previene N+1)
     */
    public function scopeConRelaciones($query)
    {
        return $query->with([
            'producto:id,nombre,sku',
            'almacen:id,nombre',
            'sector:id,nombre,es_generico'
        ]);
    }

    /**
     * Métodos auxiliares
     */
    public function estaVencido(): bool
    {
        return $this->fecha_vencimiento && $this->fecha_vencimiento < now()->toDateString();
    }

    public function proximoVencer(int $diasAnticipacion = 30): bool
    {
        if (! $this->fecha_vencimiento) {
            return false;
        }

        $fechaLimite = now()->addDays($diasAnticipacion);

        return $this->fecha_vencimiento <= $fechaLimite->toDateString() &&
        $this->fecha_vencimiento > now()->toDateString();
    }

    public function diasParaVencer(): ?int
    {
        if (! $this->fecha_vencimiento) {
            return null;
        }

        return now()->diffInDays($this->fecha_vencimiento, false);
    }

    /**
     * Relación con reservas
     */
    public function reservas()
    {
        return $this->hasMany(ReservaProforma::class, 'stock_producto_id');
    }

    public function reservasActivas()
    {
        return $this->reservas()->activas();
    }

    /**
     * Métodos para gestión de reservas
     *
     * IMPORTANTE: Este método debe llamarse dentro de una transacción DB
     * y el stock debe obtenerse con lockForUpdate() previamente
     */
    public function reservar(int $cantidad): bool
    {
        // Validación de cantidad
        if ($cantidad <= 0) {
            return false;
        }

        // Recargar desde DB para obtener valores actuales
        $this->refresh();

        // Verificar stock disponible
        if ($this->cantidad_disponible < $cantidad) {
            \Illuminate\Support\Facades\Log::warning('Intento de reservar más stock del disponible', [
                'stock_producto_id' => $this->id,
                'producto_id' => $this->producto_id,
                'almacen_id' => $this->almacen_id,
                'cantidad_solicitada' => $cantidad,
                'cantidad_disponible' => $this->cantidad_disponible,
            ]);
            return false;
        }

        // Actualización atómica usando UPDATE WHERE para evitar race conditions
        $affected = \Illuminate\Support\Facades\DB::table('stock_productos')
            ->where('id', $this->id)
            ->where('cantidad_disponible', '>=', $cantidad) // Doble validación en la query
            ->update([
                'cantidad_disponible' => \Illuminate\Support\Facades\DB::raw("cantidad_disponible - {$cantidad}"),
                'cantidad_reservada' => \Illuminate\Support\Facades\DB::raw("cantidad_reservada + {$cantidad}"),
                'fecha_actualizacion' => now(),
            ]);

        if ($affected === 0) {
            // No se pudo actualizar (otro proceso reservó el stock primero)
            \Illuminate\Support\Facades\Log::warning('Fallo al reservar stock (race condition detectada)', [
                'stock_producto_id' => $this->id,
                'producto_id' => $this->producto_id,
                'cantidad_solicitada' => $cantidad,
            ]);
            return false;
        }

        // Actualizar modelo en memoria
        $this->cantidad_disponible -= $cantidad;
        $this->cantidad_reservada += $cantidad;
        $this->fecha_actualizacion = now();

        \Illuminate\Support\Facades\Log::info('Stock reservado exitosamente', [
            'stock_producto_id' => $this->id,
            'producto_id' => $this->producto_id,
            'cantidad_reservada' => $cantidad,
            'cantidad_disponible_restante' => $this->cantidad_disponible,
        ]);

        return true;
    }

    public function liberarReserva(int $cantidad): bool
    {
        // Validación de cantidad
        if ($cantidad <= 0) {
            return false;
        }

        // Recargar desde DB
        $this->refresh();

        if ($this->cantidad_reservada < $cantidad) {
            \Illuminate\Support\Facades\Log::warning('Intento de liberar más reserva de la existente', [
                'stock_producto_id' => $this->id,
                'producto_id' => $this->producto_id,
                'cantidad_solicitada' => $cantidad,
                'cantidad_reservada' => $this->cantidad_reservada,
            ]);
            return false;
        }

        // Actualización atómica
        $affected = \Illuminate\Support\Facades\DB::table('stock_productos')
            ->where('id', $this->id)
            ->where('cantidad_reservada', '>=', $cantidad) // Doble validación
            ->update([
                'cantidad_disponible' => \Illuminate\Support\Facades\DB::raw("cantidad_disponible + {$cantidad}"),
                'cantidad_reservada' => \Illuminate\Support\Facades\DB::raw("cantidad_reservada - {$cantidad}"),
                'fecha_actualizacion' => now(),
            ]);

        if ($affected === 0) {
            \Illuminate\Support\Facades\Log::warning('Fallo al liberar reserva (race condition detectada)', [
                'stock_producto_id' => $this->id,
                'producto_id' => $this->producto_id,
                'cantidad_solicitada' => $cantidad,
            ]);
            return false;
        }

        // Actualizar modelo en memoria
        $this->cantidad_disponible += $cantidad;
        $this->cantidad_reservada -= $cantidad;
        $this->fecha_actualizacion = now();

        \Illuminate\Support\Facades\Log::info('Reserva liberada exitosamente', [
            'stock_producto_id' => $this->id,
            'producto_id' => $this->producto_id,
            'cantidad_liberada' => $cantidad,
        ]);

        return true;
    }

    public function tieneStockDisponible(int $cantidadRequerida): bool
    {
        return $this->cantidad_disponible >= $cantidadRequerida;
    }

    /**
     * Actualizar cantidad_disponible basándose en reservas activas
     *
     * IMPORTANTE: Recalcula y valida el invariante
     */
    public function actualizarCantidadDisponible(): void
    {
        $reservasActivas = $this->reservasActivas()->sum('cantidad_reservada');
        $cantidadDisponible = $this->cantidad - $reservasActivas;

        // Validar que no quede negativo
        if ($cantidadDisponible < 0) {
            \Illuminate\Support\Facades\Log::error('INVARIANTE ROTO: cantidad_disponible quedaría negativa', [
                'stock_producto_id' => $this->id,
                'producto_id' => $this->producto_id,
                'almacen_id' => $this->almacen_id,
                'cantidad' => $this->cantidad,
                'reservas_activas' => $reservasActivas,
                'cantidad_disponible_calculada' => $cantidadDisponible,
            ]);

            // Ajustar a 0 para evitar negativos, pero loggear el error
            $cantidadDisponible = 0;
        }

        $this->update([
            'cantidad_reservada' => $reservasActivas,
            'cantidad_disponible' => $cantidadDisponible,
            'fecha_actualizacion' => now(),
        ]);
    }

    /**
     * Validar integridad del invariante: cantidad = cantidad_disponible + cantidad_reservada
     *
     * @return bool True si el invariante se cumple
     */
    public function validarInvariante(): bool
    {
        $suma = $this->cantidad_disponible + $this->cantidad_reservada;
        $esValido = $suma == $this->cantidad;

        if (!$esValido) {
            \Illuminate\Support\Facades\Log::error('INVARIANTE ROTO: cantidad != (disponible + reservada)', [
                'stock_producto_id' => $this->id,
                'producto_id' => $this->producto_id,
                'almacen_id' => $this->almacen_id,
                'cantidad' => $this->cantidad,
                'cantidad_disponible' => $this->cantidad_disponible,
                'cantidad_reservada' => $this->cantidad_reservada,
                'suma' => $suma,
                'diferencia' => $this->cantidad - $suma,
            ]);
        }

        return $esValido;
    }

    /**
     * Boot del modelo para agregar validaciones automáticas y asignaciones
     */
    protected static function booted()
    {
        // 🔄 CREACIÓN: Asignar sector automáticamente si no viene en el request
        static::creating(function ($stockProducto) {
            // Si no tiene sector asignado, usar el sector genérico del almacén
            if (!$stockProducto->sector_id && $stockProducto->almacen_id) {
                $almacen = Almacen::find($stockProducto->almacen_id);
                if ($almacen) {
                    $sectorGenerico = $almacen->sectorGenerico();
                    if ($sectorGenerico) {
                        $stockProducto->sector_id = $sectorGenerico->id;
                        \Illuminate\Support\Facades\Log::info('StockProducto: Sector asignado automáticamente', [
                            'stock_producto_id' => $stockProducto->id,
                            'almacen_id' => $stockProducto->almacen_id,
                            'sector_id' => $sectorGenerico->id,
                            'sector_nombre' => $sectorGenerico->nombre,
                        ]);
                    }
                }
            }
        });

        // Validar antes de guardar
        static::saving(function ($stockProducto) {
            // ⚡ Saltear validaciones si estamos en carga masiva (optimización)
            if (!empty($GLOBALS['cargando_masiva'])) {
                return; // No loguear durante carga masiva
            }

            // Validar que no haya cantidades negativas
            if ($stockProducto->cantidad < 0) {
                \Illuminate\Support\Facades\Log::warning('Intento de guardar cantidad negativa', [
                    'stock_producto_id' => $stockProducto->id,
                    'producto_id' => $stockProducto->producto_id,
                    'cantidad' => $stockProducto->cantidad,
                ]);
            }

            if ($stockProducto->cantidad_disponible < 0) {
                \Illuminate\Support\Facades\Log::warning('Intento de guardar cantidad_disponible negativa', [
                    'stock_producto_id' => $stockProducto->id,
                    'producto_id' => $stockProducto->producto_id,
                    'cantidad_disponible' => $stockProducto->cantidad_disponible,
                ]);
            }

            if ($stockProducto->cantidad_reservada < 0) {
                \Illuminate\Support\Facades\Log::warning('Intento de guardar cantidad_reservada negativa', [
                    'stock_producto_id' => $stockProducto->id,
                    'producto_id' => $stockProducto->producto_id,
                    'cantidad_reservada' => $stockProducto->cantidad_reservada,
                ]);
            }

            // Validar invariante
            if ($stockProducto->cantidad !== null &&
                $stockProducto->cantidad_disponible !== null &&
                $stockProducto->cantidad_reservada !== null) {

                $suma = $stockProducto->cantidad_disponible + $stockProducto->cantidad_reservada;

                if ($suma !== $stockProducto->cantidad) {
                    \Illuminate\Support\Facades\Log::warning('INVARIANTE ROTO al guardar', [
                        'stock_producto_id' => $stockProducto->id,
                        'producto_id' => $stockProducto->producto_id,
                        'cantidad' => $stockProducto->cantidad,
                        'cantidad_disponible' => $stockProducto->cantidad_disponible,
                        'cantidad_reservada' => $stockProducto->cantidad_reservada,
                        'suma' => $suma,
                        'diferencia' => $stockProducto->cantidad - $suma,
                    ]);
                }
            }
        });
    }
}

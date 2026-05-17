<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CargoCSVProducto extends Model
{
    use HasFactory;

    protected $table = 'cargo_csv_productos';

    protected $fillable = [
        'usuario_id',
        'nombre_archivo',
        'hash_archivo',
        'cantidad_filas',
        'cantidad_validas',
        'cantidad_errores',
        'estado',
        'datos_json',
        'errores_json',
        'cambios_json',
        'revertido_por_usuario_id',
        'fecha_reversion',
        'motivo_reversion',
    ];

    protected $casts = [
        'cantidad_filas' => 'integer',
        'cantidad_validas' => 'integer',
        'cantidad_errores' => 'integer',
        'datos_json' => 'array',
        'errores_json' => 'array',
        'cambios_json' => 'array',
        'fecha_reversion' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con el usuario que realizó la carga
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Relación con el usuario que revirtió la carga
     */
    public function usuarioReversion(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revertido_por_usuario_id');
    }

    /**
     * Relación con movimientos de inventario asociados
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'referencia_id')
            ->where('referencia_tipo', 'CARGA_CSV_PRODUCTOS');
    }

    /**
     * Validar si la carga puede ser revertida
     *
     * Condiciones para reversión:
     * - Estado debe ser 'procesado'
     * - No debe tener movimientos posteriores de venta
     * - Los productos no deben estar en ventas activas
     */
    public function puedeRevertir(): bool
    {
        if ($this->estado !== 'procesado') {
            return false;
        }

        if ($this->revertido_por_usuario_id !== null) {
            return false;
        }

        // Verificar que no hay ventas posteriores
        $movimientosPosteriores = MovimientoInventario::where('referencia_tipo', 'CARGA_CSV_PRODUCTOS')
            ->where('referencia_id', $this->id)
            ->where('tipo', 'SALIDA_VENTA')
            ->exists();

        if ($movimientosPosteriores) {
            return false;
        }

        return true;
    }

    /**
     * Obtener razón por la que no se puede revertir
     */
    public function obtenerRazonNoRevertible(): ?string
    {
        if ($this->estado !== 'procesado') {
            return "La carga no está en estado 'procesado' (estado actual: {$this->estado})";
        }

        if ($this->revertido_por_usuario_id !== null) {
            return "La carga ya fue revertida en {$this->fecha_reversion->format('d/m/Y H:i')}";
        }

        $movimientosPosteriores = MovimientoInventario::where('referencia_tipo', 'CARGA_CSV_PRODUCTOS')
            ->where('referencia_id', $this->id)
            ->where('tipo', 'SALIDA_VENTA')
            ->count();

        if ($movimientosPosteriores > 0) {
            return "Hay {$movimientosPosteriores} venta(s) posterior(es) que usan productos de esta carga";
        }

        return null;
    }

    /**
     * Obtener productos que fueron creados/actualizados en esta carga
     * desde el campo cambios_json
     */
    public function obtenerProductosAfectados(): array
    {
        if (!$this->cambios_json) {
            return [];
        }

        $productos = [];
        foreach ($this->cambios_json as $cambio) {
            if (isset($cambio['producto_id'])) {
                $productos[] = [
                    'id' => $cambio['producto_id'],
                    'nombre' => $cambio['producto_nombre'] ?? 'N/A',
                    'accion' => $cambio['accion'] ?? 'actualizado', // 'creado' o 'actualizado'
                    'stock_anterior' => $cambio['stock_anterior'] ?? null,
                    'stock_nuevo' => $cambio['stock_nuevo'] ?? null,
                ];
            }
        }

        return $productos;
    }

    /**
     * Marcar como revertida
     */
    public function marcarComoRevertida(User $usuario, string $motivo = null): void
    {
        $this->update([
            'estado' => 'revertido',
            'revertido_por_usuario_id' => $usuario->id,
            'fecha_reversion' => now(),
            'motivo_reversion' => $motivo,
        ]);
    }

    /**
     * Obtener el porcentaje de validez de la carga
     */
    public function obtenerPorcentajeValidez(): int
    {
        if ($this->cantidad_filas === 0) {
            return 0;
        }

        return round(($this->cantidad_validas / $this->cantidad_filas) * 100);
    }

    /**
     * Determinar si la carga fue exitosa
     */
    public function fueExitosa(): bool
    {
        return $this->cantidad_errores === 0 && $this->cantidad_validas > 0;
    }
}

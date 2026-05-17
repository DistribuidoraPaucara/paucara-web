<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CargoCSVInventario extends Model
{
    protected $table = 'cargo_csv_inventarios';

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

    protected function casts(): array
    {
        return [
            'datos_json' => 'array',
            'errores_json' => 'array',
            'cambios_json' => 'array',
            'fecha_reversion' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Usuario que realizó la carga
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Usuario que revirtió la carga
     */
    public function revertidoPorUsuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revertido_por_usuario_id');
    }

    /**
     * Movimientos de inventario creados por esta carga
     */
    public function movimientos(): BelongsToMany
    {
        return $this->belongsToMany(
            MovimientoInventario::class,
            'cargo_csv_movimientos',
            'cargo_csv_id',
            'movimiento_inventario_id'
        );
    }

    /**
     * Obtener el resumen de la carga
     */
    public function getResumenAttribute(): array
    {
        return [
            'id' => $this->id,
            'archivo' => $this->nombre_archivo,
            'fecha' => $this->created_at->format('d/m/Y H:i'),
            'usuario' => $this->usuario->name,
            'total' => $this->cantidad_filas,
            'validas' => $this->cantidad_validas,
            'errores' => $this->cantidad_errores,
            'procesadas' => $this->movimientos()->count(),
            'estado' => $this->estado,
            'puede_revertir' => $this->estado === 'procesado',
        ];
    }

    /**
     * Marcar como procesado
     */
    public function marcarComoProcessado(): void
    {
        $this->update(['estado' => 'procesado']);
    }

    /**
     * Revertir carga
     */
    public function revertir(User $usuario, string $motivo): bool
    {
        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            // Obtener todos los movimientos asociados
            $movimientos = $this->movimientos()->get();

            foreach ($movimientos as $movimiento) {
                // Revertir el stock
                $stock = $movimiento->stockProducto;
                $stock->cantidad -= $movimiento->cantidad;
                if ($movimiento->tipo === MovimientoInventario::TIPO_ENTRADA_AJUSTE ||
                    $movimiento->tipo === MovimientoInventario::TIPO_ENTRADA_MERMA) {
                    $stock->cantidad -= $movimiento->cantidad;
                } else {
                    $stock->cantidad += $movimiento->cantidad;
                }
                $stock->save();

                // Marcar el movimiento como anulado
                $movimiento->update(['anulado' => true]);
            }

            // Marcar la carga como revertida
            $this->update([
                'estado' => 'revertido',
                'revertido_por_usuario_id' => $usuario->id,
                'fecha_reversion' => now(),
                'motivo_reversion' => $motivo,
            ]);

            \Illuminate\Support\Facades\DB::commit();

            return true;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            \Log::error('Error al revertir carga CSV', [
                'cargo_id' => $this->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}

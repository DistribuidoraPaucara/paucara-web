<?php
namespace App\Models\Traits;

use App\Models\Almacen;
use App\Models\ConteoFisico;
use App\Models\MovimientoInventario;
use App\Models\StockProducto;
use App\Models\TransferenciaInventario;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * Trait para empleados con rol de Gestor de Almacén
 */
trait GestorAlmacenTrait
{
    /**
     * Verifica si el empleado es un gestor de almacén
     */
    public function esGestorAlmacen(): bool
    {
        return $this->user && $this->user->hasRole('Gestor de Almacén');
    }

    /**
     * Almacenes asignados a este gestor
     */
    public function almacenesAsignados(): BelongsToMany
    {
        return $this->belongsToMany(Almacen::class, 'empleado_almacen', 'empleado_id', 'almacen_id')
            ->withPivot('es_encargado', 'fecha_asignacion')
            ->withTimestamps();
    }

    /**
     * Movimientos de inventario registrados por este gestor
     */
    public function movimientosInventario(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'registrado_por');
    }

    /**
     * Conteos físicos realizados por este gestor
     */
    public function conteosFisicos(): HasMany
    {
        return $this->hasMany(ConteoFisico::class, 'realizado_por');
    }

    /**
     * Transferencias iniciadas por este gestor
     */
    public function transferenciasIniciadas(): HasMany
    {
        return $this->hasMany(TransferenciaInventario::class, 'iniciado_por');
    }

    /**
     * Verifica si es encargado del almacén específico
     */
    public function esEncargadoDeAlmacen(int $almacenId): bool
    {
        return $this->almacenesAsignados()
            ->wherePivot('almacen_id', $almacenId)
            ->wherePivot('es_encargado', true)
            ->exists();
    }

    /**
     * Obtiene los productos con stock bajo en los almacenes asignados
     *
     * @return Collection
     */
    public function productosStockBajo(): Collection
    {
        $almacenesIds = $this->almacenesAsignados()->pluck('id');

        return StockProducto::whereIn('almacen_id', $almacenesIds)
            ->whereColumn('cantidad', '<', 'stock_minimo')
            ->with(['producto', 'almacen'])
            ->get();
    }

    /**
     * Verifica si tiene permisos para gestionar un almacén específico
     */
    public function puedeGestionarAlmacen(int $almacenId): bool
    {
        return $this->esGestorAlmacen() &&
        $this->almacenesAsignados()->where('almacen_id', $almacenId)->exists();
    }
}

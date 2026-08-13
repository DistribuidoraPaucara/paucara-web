<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class Prestable extends Model
{
    protected $table = 'prestables';

    protected $fillable = [
        'nombre',
        'codigo',
        'tipo',
        'capacidad',
        'producto_id',
        'proveedor_id',
        'prestable_relacionado_id',
        'embase_asociado_id',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'capacidad' => 'integer',
    ];

    // ============================================
    // RELACIONES
    // ============================================

    /**
     * Producto al que pertenece esta canastilla (referencia)
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Proveedor que fabrica esta canastilla
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    /**
     * Canastilla relacionada (si este prestable es de tipo EMBASES)
     */
    public function prestablePadre(): BelongsTo
    {
        return $this->belongsTo(Prestable::class, 'prestable_relacionado_id');
    }

    /**
     * Embases relacionados (si este prestable es de tipo CANASTILLA)
     */
    public function embasesRelacionados(): HasMany
    {
        return $this->hasMany(Prestable::class, 'prestable_relacionado_id');
    }

    /**
     * Embase asociado de una canastilla (relación directa)
     */
    public function embaseAsociado(): BelongsTo
    {
        return $this->belongsTo(Prestable::class, 'embase_asociado_id');
    }

    /**
     * Precios de venta y préstamo
     */
    public function precios(): HasMany
    {
        return $this->hasMany(PrestablePrice::class);
    }

    /**
     * Condiciones (garantía, montos por daño)
     */
    public function condiciones(): HasMany
    {
        return $this->hasMany(PrestableCondicion::class);
    }

    /**
     * Stock en almacenes
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(PrestableStock::class);
    }

    /**
     * Préstamos a clientes
     */
    public function prestamosCliente(): HasMany
    {
        return $this->hasMany(PrestamoCliente::class);
    }

    /**
     * Préstamos de proveedores
     */
    public function prestamosProveedor(): HasMany
    {
        return $this->hasMany(PrestamoProveedor::class);
    }

    /**
     * Productos que pueden estar en este prestable (N:N)
     * Ej: Una canastilla puede contener diferentes productos
     */
    public function productos()
    {
        return $this->belongsToMany(
            Producto::class,
            'productos_relacionado_prestables',
            'prestable_id',
            'producto_id'
        )
        ->withPivot('descripcion', 'es_principal', 'orden')
        ->withTimestamps()
        ->orderByPivot('orden');
    }

    /**
     * Productos relacionados a este prestable (relación antigua)
     */
    public function productosRelacionados(): HasMany
    {
        return $this->hasMany(ProductoRelacionadoPrestable::class);
    }

    /**
     * Último detalle de compra confirmado para precio referencial dinámico.
     */
    public function ultimoDetalleCompra(): HasOne
    {
        return $this->hasOne(CompraPrestableDetalle::class)
            ->whereHas('compraPrestable', function ($q) {
                $q->where('estado', 'CONFIRMADA');
            })
            ->latestOfMany('id');
    }

    /**
     * Obtiene la cantidad total de stock de todos los productos asociados a este prestable.
     * Suma la cantidad de stock_productos para todos los productos relacionados via ProductoRelacionadoPrestable.
     */
    public function obtenerCantidadTotalStock(): int
    {
        return (int) DB::table('productos_relacionado_prestables')
            ->join('stock_productos', 'productos_relacionado_prestables.producto_id', '=', 'stock_productos.producto_id')
            ->where('productos_relacionado_prestables.prestable_id', $this->id)
            ->sum('stock_productos.cantidad');
    }

    /**
     * Sincroniza la cantidad disponible en prestable_stock con la suma total de productos.
     * Actualiza cantidad_disponible en todos los registros de prestable_stock para este prestable.
     * Si es una CANASTILLA, también sincroniza su EMBASE ASOCIADO multiplicando por capacidad.
     *
     * @return array Array con info de sincronizaciones (canastilla + embase si aplica)
     */
    public function sincronizarStockDisponible(): array
    {
        $cantidadTotal = $this->obtenerCantidadTotalStock();
        $resultado = [
            'canastilla' => [
                'prestable_id' => $this->id,
                'prestable_nombre' => $this->nombre,
                'tipo' => $this->tipo,
                'cantidad_total_stock' => $cantidadTotal,
                'registros_actualizados' => 0,
            ],
            'embase' => null,
        ];

        // Sincronizar la canastilla/prestable actual
        $resultado['canastilla']['registros_actualizados'] = DB::table('prestable_stock')
            ->where('prestable_id', $this->id)
            ->update(['cantidad_disponible' => $cantidadTotal]);

        // Si es una CANASTILLA, sincronizar su EMBASE ASOCIADO
        if ($this->tipo === 'CANASTILLA' && $this->embase_asociado_id && $this->capacidad) {
            $embaseAsociado = Prestable::find($this->embase_asociado_id);

            if ($embaseAsociado) {
                // Fórmula: embase.cantidad_disponible = canastilla.cantidad * canastilla.capacidad
                $cantidadEmbaseTotal = $cantidadTotal * $this->capacidad;

                $registrosEmbaseActualizados = DB::table('prestable_stock')
                    ->where('prestable_id', $embaseAsociado->id)
                    ->update(['cantidad_disponible' => $cantidadEmbaseTotal]);

                $resultado['embase'] = [
                    'prestable_id' => $embaseAsociado->id,
                    'prestable_nombre' => $embaseAsociado->nombre,
                    'tipo' => $embaseAsociado->tipo,
                    'cantidad_total_stock' => $cantidadEmbaseTotal,
                    'registros_actualizados' => $registrosEmbaseActualizados,
                    'capacidad_canastilla' => $this->capacidad,
                    'formula' => "{$cantidadTotal} × {$this->capacidad} = {$cantidadEmbaseTotal}",
                ];

                \Illuminate\Support\Facades\Log::info('✅ Stock disponible sincronizado (Canastilla + Embase)', [
                    'canastilla_id' => $this->id,
                    'canastilla_nombre' => $this->nombre,
                    'canastilla_cantidad' => $cantidadTotal,
                    'embase_id' => $embaseAsociado->id,
                    'embase_nombre' => $embaseAsociado->nombre,
                    'embase_cantidad' => $cantidadEmbaseTotal,
                    'capacidad' => $this->capacidad,
                ]);
            }
        } else {
            \Illuminate\Support\Facades\Log::info('✅ Stock disponible sincronizado (solo Prestable)', [
                'prestable_id' => $this->id,
                'prestable_nombre' => $this->nombre,
                'prestable_tipo' => $this->tipo,
                'cantidad_total_stock' => $cantidadTotal,
            ]);
        }

        return $resultado;
    }
}

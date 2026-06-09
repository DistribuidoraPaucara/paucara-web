<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PrestamoEvento extends Model
{
    protected $table = 'prestamo_evento';

    protected $fillable = [
        'evento_id',
        'cliente_id',
        'almacenes_prestables_id',
        'nombre_evento',
        'encargado_evento',
        'vehiculo_asignado',
        'direccion_evento',
        'telefono_uno',
        'telefono_dos',
        'chofer_id',
        'cantidad',
        'monto_garantia',
        'fecha_prestamo',
        'fecha_entrega',
        'fecha_esperada_devolucion',
        'estado',
    ];

    protected $casts = [
        'monto_garantia' => 'decimal:2',
        'fecha_prestamo' => 'date',
        'fecha_entrega' => 'date',
        'fecha_esperada_devolucion' => 'date',
    ];


    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function almacen(): BelongsTo
    {
        return $this->belongsTo(AlmacenPrestable::class, 'almacenes_prestables_id');
    }

    /**
     * ✅ Relación muchos-a-muchos con ventas
     */
    public function ventas(): BelongsToMany
    {
        return $this->belongsToMany(Venta::class, 'prestamo_evento_venta');
    }

    /**
     * Accessor para compatibilidad: obtiene la primera venta
     */
    public function getVentaAttribute()
    {
        if ($this->relationLoaded('ventas')) {
            return $this->ventas->first();
        }
        return null;
    }

    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(PrestamoEventoDetalle::class, 'prestamo_evento_id');
    }

    public function devoluciones(): HasMany
    {
        return $this->hasMany(DevolucionEvento::class, 'prestamo_evento_id');
    }
}

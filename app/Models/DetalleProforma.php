<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleProforma extends Model
{
    use HasFactory;

    protected $fillable = [
        'proforma_id',
        'producto_id',
        'cantidad',
        'precio_unitario',
        'descuento',
        'subtotal',
        'unidad_medida_id',
        'tipo_precio_id',               // ✅ NUEVO: ID del tipo de precio seleccionado
        'tipo_precio_nombre',            // ✅ NUEVO: Nombre del tipo de precio (referencia rápida)
        'combo_items_seleccionados',     // ✅ NUEVO: Items del combo seleccionados (JSON)
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'float',  // ✅ FIXED 2026-03-24: Cambié a float para evitar problemas con decimal:6
            'precio_unitario' => 'float',
            'descuento' => 'float',
            'subtotal' => 'float',
            'combo_items_seleccionados' => 'array',  // ✅ NUEVO: Castear JSON a array
        ];
    }

    // Relaciones
    public function proforma()
    {
        return $this->belongsTo(Proforma::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function unidadMedida()
    {
        return $this->belongsTo(UnidadMedida::class, 'unidad_medida_id');
    }

    // ✅ NUEVO: Relación con TipoPrecio
    public function tipoPrecio()
    {
        return $this->belongsTo(TipoPrecio::class, 'tipo_precio_id');
    }
}

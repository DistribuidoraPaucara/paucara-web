<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleTransferenciaInventario extends Model
{
    use HasFactory;

    protected $table = 'detalle_transferencia_inventarios';

    protected $fillable = [
        'transferencia_id',
        'producto_id',
        'cantidad',
        'lote',
        'fecha_vencimiento',
        'cantidad_recibida',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
            'cantidad_recibida' => 'integer',
            'fecha_vencimiento' => 'date',
        ];
    }

    public function transferencia()
    {
        return $this->belongsTo(TransferenciaInventario::class, 'transferencia_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function cantidadPendiente(): int
    {
        return $this->cantidad - ($this->cantidad_recibida ?? 0);
    }

    public function estaCompleto(): bool
    {
        return $this->cantidad_recibida >= $this->cantidad;
    }
}

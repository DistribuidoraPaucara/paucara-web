<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoteVencimiento extends Model
{
    use HasFactory;

    protected $table = "lotes_vencimientos";

    protected $fillable = [
        "detalle_compra_id",
        "numero_lote",
        "fecha_vencimiento",
        "cantidad_inicial",
        "cantidad_actual",
        "estado_vencimiento",
        "observaciones",
    ];

    protected function casts(): array
    {
        return [
            "fecha_vencimiento" => "date",
            "cantidad_inicial"  => "integer",
            "cantidad_actual"   => "integer",
        ];
    }

    public function detalleCompra()
    {
        return $this->belongsTo(DetalleCompra::class);
    }

    public function scopePorEstado($query, $estado)
    {
        return $query->where("estado_vencimiento", $estado);
    }

    public function estaVencido(): bool
    {
        return $this->fecha_vencimiento < now()->toDateString();
    }

    public function getValorTotalAttribute(): float
    {
        if (! $this->detalleCompra) {
            return 0;
        }

        return $this->cantidad_actual * $this->detalleCompra->precio_unitario;
    }
}

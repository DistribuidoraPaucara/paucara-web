<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoMerma extends Model
{
    use HasFactory;

    protected $table = 'tipo_mermas';

    protected $fillable = [
        'clave',
        'label',
        'descripcion',
        'color',
        'bg_color',
        'text_color',
        'requiere_aprobacion',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'requiere_aprobacion' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    public function movimientosInventario()
    {
        return $this->hasMany(MovimientoInventario::class, 'tipo_merma_id');
    }
}

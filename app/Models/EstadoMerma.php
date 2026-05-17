<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoMerma extends Model
{
    protected $table = 'estado_mermas';

    protected $fillable = [
        'clave',
        'label',
        'descripcion',
        'color',
        'bg_color',
        'text_color',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
        ];
    }

    public function movimientosInventario()
    {
        return $this->hasMany(MovimientoInventario::class, 'estado_merma_id');
    }
}

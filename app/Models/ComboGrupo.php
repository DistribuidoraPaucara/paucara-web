<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ComboGrupo extends Model
{
    use HasFactory;

    protected $table = 'combo_grupos';

    protected $fillable = [
        'combo_id',
        'nombre_grupo',
        'cantidad_a_llevar',
        'precio_grupo',
    ];

    protected function casts(): array
    {
        return [
            'precio_grupo' => 'decimal:2',
        ];
    }

    public function combo(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'combo_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ComboGrupoItem::class, 'grupo_id');
    }

    public function productos()
    {
        return $this->hasManyThrough(
            Producto::class,
            ComboGrupoItem::class,
            'grupo_id',
            'id',
            'id',
            'producto_id'
        );
    }
}

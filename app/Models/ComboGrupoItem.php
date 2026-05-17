<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComboGrupoItem extends Model
{
    use HasFactory;

    protected $table = 'combo_grupo_items';

    protected $fillable = [
        'grupo_id',
        'producto_id',
    ];

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(ComboGrupo::class, 'grupo_id');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}

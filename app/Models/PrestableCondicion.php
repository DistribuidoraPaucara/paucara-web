<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestableCondicion extends Model
{
    protected $table = 'prestable_condiciones';

    protected $fillable = [
        'prestable_id',
        'monto_garantia',
        'monto_daño_total',
        'descripcion_daño',
        'activo',
    ];

    protected $casts = [
        'monto_garantia' => 'decimal:2',
        'monto_daño_total' => 'decimal:2',
        'activo' => 'boolean',
    ];

    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrestablePrice extends Model
{
    protected $table = 'prestable_precios';

    protected $fillable = [
        'prestable_id',
        'tipo_precio',
        'valor',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
        'activo' => 'boolean',
    ];

    public function prestable(): BelongsTo
    {
        return $this->belongsTo(Prestable::class);
    }
}

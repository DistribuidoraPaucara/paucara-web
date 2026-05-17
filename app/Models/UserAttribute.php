<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAttribute extends Model
{
    protected $fillable = [
        'user_id',
        'attribute_type',
        'attribute_value',
        'description',
        'is_primary',
        'priority',
        'valid_from',
        'valid_until',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'valid_from' => 'datetime',
            'valid_until' => 'datetime',
        ];
    }

    /**
     * Usuario propietario del atributo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Verificar si el atributo está vigente (no expirado)
     */
    public function isValid(): bool
    {
        $now = now();

        if ($this->valid_from && $this->valid_from > $now) {
            return false;
        }

        if ($this->valid_until && $this->valid_until < $now) {
            return false;
        }

        return true;
    }

    /**
     * Obtener atributos del mismo tipo ordenados por prioridad
     */
    public function getAttributesOfSameType()
    {
        return UserAttribute::where('user_id', $this->user_id)
            ->where('attribute_type', $this->attribute_type)
            ->where(function ($query) {
                $now = now();
                $query->where(function ($q) use ($now) {
                    $q->whereNull('valid_from')->orWhere('valid_from', '<=', $now);
                })
                ->where(function ($q) use ($now) {
                    $q->whereNull('valid_until')->orWhere('valid_until', '>=', $now);
                });
            })
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}

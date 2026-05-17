<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuloAudit extends Model
{
    use HasFactory;

    protected $table = 'modulo_audits';

    protected $fillable = [
        'modulo_id',
        'usuario_id',
        'accion',
        'datos_anteriores',
        'datos_nuevos',
    ];

    protected function casts(): array
    {
        return [
            'datos_anteriores' => 'json',
            'datos_nuevos' => 'json',
        ];
    }

    public $timestamps = true;

    /**
     * Relación con el módulo
     */
    public function modulo(): BelongsTo
    {
        return $this->belongsTo(ModuloSidebar::class, 'modulo_id');
    }

    /**
     * Relación con el usuario
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopeEntreFechas($query, $desde = null, $hasta = null)
    {
        if ($desde) {
            $query->where('created_at', '>=', $desde);
        }

        if ($hasta) {
            $query->where('created_at', '<=', $hasta);
        }

        return $query;
    }

    /**
     * Scope para filtrar por acción
     */
    public function scopeConAccion($query, $accion)
    {
        return $query->where('accion', $accion);
    }

    /**
     * Scope para filtrar por módulo
     */
    public function scopeDelModulo($query, $moduloId)
    {
        return $query->where('modulo_id', $moduloId);
    }
}

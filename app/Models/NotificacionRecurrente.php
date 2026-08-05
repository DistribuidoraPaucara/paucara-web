<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotificacionRecurrente extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'frecuencia',
        'hora_envio',
        'dias_semana',
        'dia_mes',
        'fecha_inicio',
        'fecha_fin',
        'ultimo_envio',
        'activo',
        'total_enviadas',
        'vistas',
        'usuario_id',
    ];

    protected $casts = [
        'dias_semana' => 'json',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'ultimo_envio' => 'datetime',
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    public function scopeVigentes($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('fecha_inicio')->orWhereDate('fecha_inicio', '<=', now());
        })->where(function ($q) {
            $q->whereNull('fecha_fin')->orWhereDate('fecha_fin', '>=', now());
        });
    }

    // Métodos helpers
    public function debeEnviarseHoy(): bool
    {
        if (!$this->activo || !$this->vigentes()->exists()) {
            return false;
        }

        $hoy = now()->dayOfWeek; // 0 = domingo, 1 = lunes, etc.

        return match ($this->frecuencia) {
            'una_vez' => $this->ultimo_envio === null,
            'diario' => true,
            'semanal' => in_array($hoy, $this->dias_semana ?? []),
            'mensual' => now()->day == ($this->dia_mes ?? 1),
            default => false,
        };
    }

    public function registrarEnvio(int $cantidad = 1): void
    {
        $this->update([
            'total_enviadas' => $this->total_enviadas + $cantidad,
            'ultimo_envio' => now(),
        ]);
    }
}

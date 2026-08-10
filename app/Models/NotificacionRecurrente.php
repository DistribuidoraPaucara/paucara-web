<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role;

class NotificacionRecurrente extends Model
{
    use HasFactory;

    protected $table = 'notificaciones_recurrentes';

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
        'activo',
        'total_enviadas',
        'vistas',
        'ultimo_envio',
        'usuario_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'ultimo_envio' => 'datetime',
            'activo' => 'boolean',
            'dias_semana' => 'array',
            'dia_mes' => 'integer',
            'total_enviadas' => 'integer',
            'vistas' => 'integer',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'notificacion_recurrente_rol');
    }

    public function scopeActivas($query)
    {
        return $query->where('activo', true)
            ->where('fecha_inicio', '<=', now()->toDateString())
            ->where(function ($q) {
                $q->whereNull('fecha_fin')
                  ->orWhere('fecha_fin', '>=', now()->toDateString());
            });
    }

    public function scopeParaEstaHora($query)
    {
        $horaActual = now()->format('H:i');
        return $query->where('hora_envio', '=', $horaActual);
    }

    public function debeEnviarsePorFrecuencia(): bool
    {
        $ahora = now();
        $diaHoy = strtolower($ahora->dayName);

        return match ($this->frecuencia) {
            'una_vez' => true,
            'diario' => true,
            'semanal' => in_array($diaHoy, $this->dias_semana ?? []),
            'mensual' => $ahora->day === $this->dia_mes,
            default => false,
        };
    }

    public function yaFueEnviadaHoy(): bool
    {
        return $this->ultimo_envio &&
               $this->ultimo_envio->toDateString() === now()->toDateString();
    }

    public function incrementarEnvios(): void
    {
        $this->increment('total_enviadas');
        $this->update(['ultimo_envio' => now()]);
    }
}

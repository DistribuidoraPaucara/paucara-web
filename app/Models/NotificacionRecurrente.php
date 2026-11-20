<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'imagen_url', // ✅ NUEVO: URL de imagen
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

    public function horarios(): HasMany
    {
        return $this->hasMany(HorarioNotificacion::class, 'notificacion_recurrente_id');
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

    /**
     * Obtener notificaciones que deben enviarse en la hora actual
     * Verifica los horarios asociados en lugar de hora_envio directa
     */
    public function scopeParaEstaHora($query)
    {
        $horaActual = now()->format('H:i');
        return $query->whereHas('horarios', function ($q) use ($horaActual) {
            $q->where('hora', '=', $horaActual)
              ->where('activo', true);
        });
    }

    // Los días se guardan en español desde el formulario; índice = Carbon::dayOfWeek (0 = domingo)
    private const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    public function estaVigente(): bool
    {
        $hoy = now()->toDateString();

        return (! $this->fecha_inicio || $this->fecha_inicio->toDateString() <= $hoy)
            && (! $this->fecha_fin || $this->fecha_fin->toDateString() >= $hoy);
    }

    public function debeEnviarsePorFrecuencia(): bool
    {
        $ahora = now();
        $diaHoy = self::DIAS_SEMANA[$ahora->dayOfWeek];
        // Normalizar por si hay registros guardados sin tilde (miercoles, sabado)
        $diasProgramados = array_map(
            fn($d) => str_replace(['é', 'á'], ['e', 'a'], mb_strtolower((string) $d)),
            $this->dias_semana ?? []
        );

        return match ($this->frecuencia) {
            // Una sola vez: solo el día de inicio, en cada uno de sus horarios
            'una_vez' => $this->fecha_inicio?->isSameDay($ahora) ?? false,
            'diario' => true,
            'semanal' => in_array(str_replace(['é', 'á'], ['e', 'a'], $diaHoy), $diasProgramados, true),
            'mensual' => $ahora->day === $this->dia_mes
                // Si el día no existe este mes (p. ej. 31 en abril), enviar el último día del mes
                || ($this->dia_mes > $ahora->daysInMonth && $ahora->day === $ahora->daysInMonth),
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

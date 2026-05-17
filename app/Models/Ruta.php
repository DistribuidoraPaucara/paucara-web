<?php

namespace App\Models;

use App\Models\Traits\GeneratesSequentialCode;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ruta extends Model
{
    use HasFactory, GeneratesSequentialCode, SoftDeletes;

    protected $fillable = [
        'codigo',
        'fecha_ruta',
        'localidad_id',
        'zona_id',
        'chofer_id',
        'vehiculo_id',
        'estado',
        'cantidad_paradas',
        'hora_salida',
        'hora_llegada',
        'distancia_km',
        'tiempo_estimado_minutos',
        'tiempo_real_minutos',
        'observaciones',
        'ruta_gps',
        'creado_por',
    ];

    protected function casts(): array
    {
        return [
            'fecha_ruta' => 'date',
            'hora_salida' => 'datetime',
            'hora_llegada' => 'datetime',
            'distancia_km' => 'decimal:2',
            'ruta_gps' => 'array',
        ];
    }

    /**
     * Localidad de la ruta
     */
    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class);
    }

    /**
     * Zona de la ruta (para compatibilidad backwards)
     */
    public function zona(): BelongsTo
    {
        return $this->belongsTo(Zona::class);
    }

    /**
     * Chofer asignado a la ruta (User con rol 'Chofer')
     * FK a users.id (mismo que Entrega.chofer_id)
     *
     * Relación inversa: User -> empleado() para acceder a datos del empleado
     */
    public function chofer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_id');
    }

    /**
     * Vehículo asignado
     */
    public function vehiculo(): BelongsTo
    {
        return $this->belongsTo(Vehiculo::class);
    }

    /**
     * Usuario que creó la ruta
     */
    public function creadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por');
    }

    /**
     * Detalles de la ruta (entregas/paradas)
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(RutaDetalle::class);
    }

    /**
     * Scope para rutas de hoy
     */
    public function scopeHoy($query)
    {
        return $query->whereDate('fecha_ruta', today());
    }

    /**
     * Scope para rutas activas
     */
    public function scopeActivas($query)
    {
        return $query->whereIn('estado', ['planificada', 'en_progreso']);
    }

    /**
     * Scope para rutas completadas
     */
    public function scopeCompletadas($query)
    {
        return $query->where('estado', 'completada');
    }

    /**
     * Generar código de ruta automáticamente
     * ✅ CONSOLIDADO: Usa GeneratesSequentialCode trait
     */
    public static function generarCodigo(Zona $zona = null): string
    {
        return static::generateSequentialCode('RTA', 'numero', true, 'Ymd', 6);
    }

    /**
     * Obtener progreso de entregas
     */
    public function obtenerProgreso(): array
    {
        $total = $this->detalles()->count();
        $entregados = $this->detalles()->where('estado', 'entregado')->count();
        $noEntregados = $this->detalles()->whereIn('estado', ['no_entregado', 'reprogramado'])->count();
        $pendientes = $this->detalles()->where('estado', 'pendiente')->count();

        return [
            'total' => $total,
            'entregados' => $entregados,
            'no_entregados' => $noEntregados,
            'pendientes' => $pendientes,
            'porcentaje' => $total > 0 ? round(($entregados / $total) * 100, 2) : 0,
        ];
    }

    /**
     * Marcar ruta como iniciada
     */
    public function iniciar(): bool
    {
        return $this->update([
            'estado' => 'en_progreso',
            'hora_salida' => now(),
        ]);
    }

    /**
     * Marcar ruta como completada
     */
    public function completar(): bool
    {
        return $this->update([
            'estado' => 'completada',
            'hora_llegada' => now(),
            'tiempo_real_minutos' => now()->diffInMinutes($this->hora_salida),
        ]);
    }

    /**
     * Calcular cantidad de paradas según detalles
     */
    public function recalcularParadas(): void
    {
        $this->update([
            'cantidad_paradas' => $this->detalles()->count(),
        ]);
    }

    /**
     * Obtener entregas pendientes
     */
    public function entregarPendientes()
    {
        return $this->detalles()->where('estado', 'pendiente')->orderBy('secuencia')->get();
    }
}

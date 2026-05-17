<?php

namespace App\Models;

use App\Enums\TipoVisitaPreventista;
use App\Enums\EstadoVisitaPreventista;
use App\Enums\MotivoNoAtencionVisita;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitaPreventistaCliente extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'visitas_preventista_cliente';

    protected $fillable = [
        'preventista_id',
        'cliente_id',
        'fecha_hora_visita',
        'tipo_visita',
        'estado_visita',
        'motivo_no_atencion',
        'latitud',
        'longitud',
        'foto_local',
        'observaciones',
        'dentro_ventana_horaria',
        'ventana_entrega_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha_hora_visita' => 'datetime',
            'tipo_visita' => TipoVisitaPreventista::class,
            'estado_visita' => EstadoVisitaPreventista::class,
            'motivo_no_atencion' => MotivoNoAtencionVisita::class,
            'latitud' => 'decimal:8',
            'longitud' => 'decimal:8',
            'dentro_ventana_horaria' => 'boolean',
        ];
    }

    /**
     * Preventista que realizó la visita
     */
    public function preventista(): BelongsTo
    {
        return $this->belongsTo(Empleado::class, 'preventista_id');
    }

    /**
     * Cliente visitado
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Ventana de entrega asociada (si aplica)
     */
    public function ventanaEntrega(): BelongsTo
    {
        return $this->belongsTo(VentanaEntregaCliente::class, 'ventana_entrega_id');
    }

    /**
     * Scope: Visitas del preventista actual
     */
    public function scopeDelPreventista($query, int $preventistaId)
    {
        return $query->where('preventista_id', $preventistaId);
    }

    /**
     * Scope: Visitas por rango de fechas
     */
    public function scopeEntreFechas($query, $fechaInicio, $fechaFin)
    {
        return $query->whereBetween('fecha_hora_visita', [$fechaInicio, $fechaFin]);
    }

    /**
     * Scope: Visitas exitosas
     */
    public function scopeExitosas($query)
    {
        return $query->where('estado_visita', EstadoVisitaPreventista::EXITOSA);
    }

    /**
     * Scope: Visitas no atendidas
     */
    public function scopeNoAtendidas($query)
    {
        return $query->where('estado_visita', EstadoVisitaPreventista::NO_ATENDIDO);
    }

    /**
     * Scope: Visitas fuera de horario
     */
    public function scopeFueraDeHorario($query)
    {
        return $query->where('dentro_ventana_horaria', false);
    }

    /**
     * Accessor: URL completa de la foto
     */
    public function getFotoLocalUrlAttribute(): ?string
    {
        if (!$this->foto_local) {
            return null;
        }

        return asset('storage/' . $this->foto_local);
    }
}

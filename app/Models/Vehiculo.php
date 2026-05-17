<?php
namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehiculo extends Model
{
    use HasFactory, HasActiveScope;

    protected $fillable = [
        'placa',
        'marca',
        'modelo',
        'anho',
        'capacidad_kg',
        'capacidad_volumen',
        'estado',
        'activo',
        'chofer_asignado_id',
        'localidad_id',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'anho'              => 'integer',
            'capacidad_kg'      => 'decimal:2',
            'capacidad_volumen' => 'decimal:2',
            'activo'            => 'boolean',
        ];
    }

    // Estados del vehículo
    const DISPONIBLE = 'DISPONIBLE';

    const EN_RUTA = 'EN_RUTA';

    const MANTENIMIENTO = 'MANTENIMIENTO';

    const FUERA_SERVICIO = 'FUERA_SERVICIO';

    // Relaciones
    public function choferAsignado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'chofer_asignado_id');
    }

    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class);
    }

    /**
     * Entregas asignadas a este vehículo (reemplaza la relación anterior con Envio)
     */
    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class);
    }

    /**
     * Vehículos activos
     */

    /**
     * Vehículos disponibles
     */
    public function scopeDisponibles($query)
    {
        return $query->where('estado', self::DISPONIBLE)->where('activo', true);
    }

    /**
     * Vehículos en ruta
     */
    public function scopeEnRuta($query)
    {
        return $query->where('estado', self::EN_RUTA);
    }

    /**
     * Transferencias asignadas a este vehículo
     */
    public function transferencias(): HasMany
    {
        return $this->hasMany(TransferenciaInventario::class);
    }

    // Métodos de utilidad
    public function estaDisponible(): bool
    {
        return $this->estado === self::DISPONIBLE && $this->activo;
    }

    public function puedeAsignarse(): bool
    {
        return $this->estaDisponible();
    }

    /**
     * Verificar si está disponible para una fecha específica
     * (no tiene rutas activas en esa fecha)
     *
     * @param string $fecha Fecha en formato Y-m-d
     * @return bool
     */
    public function estaDisponiblePara(string $fecha): bool
    {
        if (!$this->estaDisponible()) {
            return false;
        }

        // Verificar si NO tiene rutas activas en esa fecha
        $rutasActivas = Ruta::where('vehiculo_id', $this->id)
            ->whereDate('fecha_ruta', $fecha)
            ->whereIn('estado', ['planificada', 'en_progreso'])
            ->count();

        return $rutasActivas === 0;
    }

    /**
     * Verificar si tiene capacidad suficiente para un peso dado
     *
     * @param float $pesoRequerido Peso en kg
     * @return bool
     */
    /**
     * Obtener peso total cargado actualmente (entregas en estado NO completadas)
     */
    public function obtenerPesoCargado(): float
    {
        return $this->entregas()
            ->whereNotIn('estado', ['ENTREGADO', 'CANCELADA'])  // Entregas pendientes o en progreso
            ->sum('peso_kg') ?? 0.0;
    }

    /**
     * Obtener peso disponible restante
     */
    public function obtenerCapacidadDisponible(): float
    {
        $pesoCargado = $this->obtenerPesoCargado();
        return max(0, (float) $this->capacidad_kg - $pesoCargado);
    }

    /**
     * Verificar si el vehículo tiene capacidad para un peso adicional
     * Considera el peso ya cargado en entregas pendientes
     */
    public function tieneCapacidadPara(float $pesoRequerido): bool
    {
        return $this->obtenerCapacidadDisponible() >= $pesoRequerido;
    }

    /**
     * Scope: Vehículos disponibles para una fecha específica
     */
    public function scopeDisponiblesPara($query, string $fecha)
    {
        return $query->where('estado', self::DISPONIBLE)
                     ->where('activo', true)
                     ->whereDoesntHave('rutas', function ($q) use ($fecha) {
                         $q->whereDate('fecha_ruta', $fecha)
                           ->whereIn('estado', ['planificada', 'en_progreso']);
                     });
    }

    /**
     * Scope: Vehículos con capacidad mínima
     */
    public function scopeConCapacidadMinima($query, float $pesoMinimo)
    {
        return $query->where('capacidad_kg', '>=', $pesoMinimo);
    }

    /**
     * Relación con rutas asignadas
     */
    public function rutas(): HasMany
    {
        return $this->hasMany(Ruta::class);
    }
}

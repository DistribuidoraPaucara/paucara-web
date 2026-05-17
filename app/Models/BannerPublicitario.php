<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class BannerPublicitario extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'banners_publicitarios';

    protected $fillable = [
        'titulo',
        'descripcion',
        'imagen',
        'nombre_archivo',
        'fecha_inicio',
        'fecha_fin',
        'activo',
        'orden',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'activo' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Getter para URL completa de la imagen
     */
    public function getUrlImagenAttribute(): string
    {
        return asset('storage/' . $this->imagen);
    }

    /**
     * Verificar si el banner está vigente (dentro de las fechas)
     */
    public function getEstaVigenteAttribute(): bool
    {
        $hoy = Carbon::today();

        if ($this->fecha_inicio && $hoy < $this->fecha_inicio) {
            return false; // Banner aún no ha iniciado
        }

        if ($this->fecha_fin && $hoy > $this->fecha_fin) {
            return false; // Banner ha vencido
        }

        return true; // Banner está vigente
    }

    /**
     * Obtener estado de vigencia (para mostrar en UI)
     */
    public function getEstadoVigenciaAttribute(): string
    {
        if (!$this->activo) {
            return 'inactivo';
        }

        $hoy = Carbon::today();

        if ($this->fecha_inicio && $hoy < $this->fecha_inicio) {
            return 'proximo';
        }

        if ($this->fecha_fin && $hoy > $this->fecha_fin) {
            return 'vencido';
        }

        return 'vigente';
    }

    /**
     * Scope: obtener solo banners activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope: obtener solo banners vigentes (activos y dentro de fechas)
     */
    public function scopeVigentes($query)
    {
        $hoy = Carbon::today();

        return $query
            ->activos()
            ->where(function ($q) use ($hoy) {
                $q->whereNull('fecha_inicio')
                    ->orWhere('fecha_inicio', '<=', $hoy);
            })
            ->where(function ($q) use ($hoy) {
                $q->whereNull('fecha_fin')
                    ->orWhere('fecha_fin', '>=', $hoy);
            })
            ->orderBy('orden', 'asc');
    }

    /**
     * Scope: ordenar por orden (para dashboard admin)
     */
    public function scopeOrdenado($query)
    {
        return $query->orderBy('orden', 'asc')->orderBy('created_at', 'desc');
    }
}

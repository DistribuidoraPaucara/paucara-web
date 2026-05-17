<?php

namespace App\Models;

use App\Models\Traits\HasActiveScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class ModuloSidebar extends Model
{
    /** @use HasFactory<\Database\Factories\ModuloSidebarFactory> */
    use HasFactory, HasActiveScope;

    protected $table = 'modulos_sidebar';

    protected $fillable = [
        'titulo',
        'ruta',
        'icono',
        'descripcion',
        'orden',
        'activo',
        'es_submenu',
        'modulo_padre_id',
        'permisos',
        'color',
        'categoria',
        'visible_dashboard',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'es_submenu' => 'boolean',
            'visible_dashboard' => 'boolean',
            'permisos' => 'array',
            'orden' => 'integer',
        ];
    }

    /**
     * Obtener el módulo padre
     */
    public function padre(): BelongsTo
    {
        return $this->belongsTo(ModuloSidebar::class, 'modulo_padre_id');
    }

    /**
     * Obtener los submódulos
     */
    public function submodulos(): HasMany
    {
        return $this->hasMany(ModuloSidebar::class, 'modulo_padre_id')->orderBy('orden');
    }

    /**
     * Scope para obtener solo módulos activos
     */

    /**
     * Scope para obtener solo módulos principales (no submódulos)
     */
    public function scopePrincipales($query)
    {
        return $query->where('es_submenu', false);
    }

    /**
     * Scope para obtener submódulos
     */
    public function scopeSubmodulos($query)
    {
        return $query->where('es_submenu', true);
    }

    /**
     * Scope para ordenar por orden
     */
    public function scopeOrdenados($query)
    {
        return $query->orderBy('orden')->orderBy('titulo');
    }

    /**
     * Scope para obtener módulos por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Obtener módulos para el sidebar con estructura jerárquica
     */
    public static function obtenerParaSidebar()
    {
        return self::activos()
            ->principales()
            ->ordenados()
            ->with(['submodulos' => function ($query) {
                $query->activos()->ordenados();
            }])
            ->get()
            ->filter(function ($modulo) {
                return $modulo->usuarioTienePermiso();
            })
            ->map(function ($modulo) {
                // Filtrar submódulos que el usuario puede ver
                $modulo->submodulos = $modulo->submodulos->filter(function ($submodulo) {
                    return $submodulo->usuarioTienePermiso();
                });

                return $modulo;
            });
    }

    /**
     * Verificar si el usuario tiene permisos para este módulo
     */
    public function usuarioTienePermiso($usuario = null): bool
    {
        $usuario = $usuario ?? Auth::user();

        // Si no hay permisos especificados, permitir acceso
        if (empty($this->permisos) || ! is_array($this->permisos)) {
            return true;
        }

        if (! $usuario) {
            return false;
        }

        // Verificar permisos usando Spatie/Permission
        foreach ($this->permisos as $permiso) {
            if ($usuario->can($permiso)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Convertir a formato para frontend
     */
    public function toNavItem(): array
    {
        $navItem = [
            'id' => $this->id,
            'title' => $this->titulo,
            'href' => $this->ruta,
            'icon' => $this->icono,
        ];

        if ($this->submodulos->isNotEmpty()) {
            $navItem['children'] = $this->submodulos
                ->filter(fn ($submodulo) => $submodulo->usuarioTienePermiso())
                ->map(fn ($submodulo) => $submodulo->toNavItem())
                ->values()
                ->toArray();
        }

        return $navItem;
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\EstadoLogistica;

/**
 * EstadosLogisticaController - CRUD de Estados de Logística
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * Gestiona estados de logística, categorías, transiciones y visualización
 */
class EstadosLogisticaController extends Controller
{
    use SimpleCrudController;

    /**
     * Retorna el modelo a usar
     */
    protected function getModel(): string
    {
        return EstadoLogistica::class;
    }

    /**
     * Retorna el nombre de las rutas
     */
    protected function getRouteName(): string
    {
        return 'estados-logistica';
    }

    /**
     * Retorna el path de las vistas
     */
    protected function getViewPath(): string
    {
        return 'estados-logistica';
    }

    /**
     * Retorna el nombre del recurso
     */
    protected function getResourceName(): string
    {
        return 'estadosLogistica';
    }

    /**
     * Retorna las reglas de validación
     */
    protected function getValidationRules(): array
    {
        return [
            'codigo' => ['required', 'string', 'max:50'],
            'categoria' => ['required', 'string', 'max:50'],
            'nombre' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'activo' => ['boolean'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icono' => ['nullable', 'string', 'max:50'],
            'es_estado_final' => ['boolean'],
            'permite_edicion' => ['boolean'],
            'requiere_aprobacion' => ['boolean'],
            'metadatos' => ['nullable', 'json'],
        ];
    }
}

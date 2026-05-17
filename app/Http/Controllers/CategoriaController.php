<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\Categoria;

/**
 * CategoriaController - CRUD de Categorías
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * Reducción: ~75 líneas → 30 líneas (-60%)
 */
class CategoriaController extends Controller
{
    use SimpleCrudController;

    /**
     * Retorna el modelo a usar
     */
    protected function getModel(): string
    {
        return Categoria::class;
    }

    /**
     * Retorna el nombre de las rutas
     */
    protected function getRouteName(): string
    {
        return 'categorias';
    }

    /**
     * Retorna el path de las vistas
     */
    protected function getViewPath(): string
    {
        return 'categorias';
    }

    /**
     * Retorna el nombre del recurso
     */
    protected function getResourceName(): string
    {
        return 'categorias';
    }

    /**
     * Retorna las reglas de validación
     */
    protected function getValidationRules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'activo' => ['boolean'],
        ];
    }
}

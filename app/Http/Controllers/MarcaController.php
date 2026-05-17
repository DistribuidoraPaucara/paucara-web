<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\Marca;

/**
 * MarcaController - CRUD de Marcas
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 * Reducción: ~76 líneas → 50 líneas (-35%)
 */
class MarcaController extends Controller
{
    use SimpleCrudController;

    protected function getModel(): string
    {
        return Marca::class;
    }

    protected function getRouteName(): string
    {
        return 'marcas';
    }

    protected function getViewPath(): string
    {
        return 'marcas';
    }

    protected function getResourceName(): string
    {
        return 'marcas';
    }

    protected function getValidationRules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'activo' => ['boolean'],
        ];
    }
}

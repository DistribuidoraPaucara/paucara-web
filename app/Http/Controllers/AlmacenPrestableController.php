<?php

namespace App\Http\Controllers;

use App\Http\Traits\SimpleCrudController;
use App\Models\AlmacenPrestable;

/**
 * AlmacenPrestableController - CRUD de Almacenes Prestables
 *
 * ✅ CONSOLIDADO: Usa SimpleCrudController trait
 */
class AlmacenPrestableController extends Controller
{
    use SimpleCrudController;

    protected function getModel(): string
    {
        return AlmacenPrestable::class;
    }

    protected function getRouteName(): string
    {
        return 'almacenes-prestables';
    }

    protected function getViewPath(): string
    {
        return 'almacenes-prestables';
    }

    protected function getResourceName(): string
    {
        return 'almacenes_prestables';
    }

    protected function getValidationRules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'ubicacion_fisica' => ['nullable', 'string'],
            'responsable' => ['nullable', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'requiere_transporte_externo' => ['boolean'],
            'es_proveedor' => ['boolean'],
            'activo' => ['boolean'],
        ];
    }
}

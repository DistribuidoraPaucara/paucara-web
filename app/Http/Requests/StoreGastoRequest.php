<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreGastoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'monto' => 'required|numeric|min:0.01',
            'descripcion' => 'required|string|max:255',
            'categoria' => 'required|in:TRANSPORTE,LIMPIEZA,MANTENIMIENTO,SERVICIOS,VARIOS',
            'numero_comprobante' => 'nullable|string|max:50',
            'proveedor' => 'nullable|string|max:100',
            'observaciones' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'monto.required' => 'El monto es obligatorio',
            'monto.min' => 'El monto debe ser mayor a 0',
            'descripcion.required' => 'La descripción es obligatoria',
            'categoria.required' => 'Debe seleccionar una categoría',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = Auth::user();
            if ($user->empleado && !$user->empleado->cajaAbierta()) {
                $validator->errors()->add('caja', 'Debe tener una caja abierta');
            }
        });
    }
}

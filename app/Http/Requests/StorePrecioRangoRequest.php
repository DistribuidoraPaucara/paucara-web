<?php

namespace App\Http\Requests;

use App\Models\TipoPrecio;
use Illuminate\Foundation\Http\FormRequest;

class StorePrecioRangoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cantidad_minima' => 'required|integer|min:1',
            'cantidad_maxima' => 'nullable|integer|min:1|gte:cantidad_minima',
            // ✅ ACTUALIZADO: Aceptar tanto ID (integer) como código (string)
            'tipo_precio_id' => 'required',
            'fecha_vigencia_inicio' => 'nullable|date|date_format:Y-m-d',
            'fecha_vigencia_fin' => 'nullable|date|date_format:Y-m-d|after_or_equal:fecha_vigencia_inicio',
        ];
    }

    /**
     * ✅ NUEVO: Preparar los datos del request
     * Si tipo_precio_id es un código, convertirlo a ID
     */
    public function prepareForValidation(): void
    {
        $tipoPrecio = $this->input('tipo_precio_id');

        // Si es un string, intentar obtener el ID por código
        if (is_string($tipoPrecio) && !is_numeric($tipoPrecio)) {
            $tipo = TipoPrecio::where('codigo', strtoupper($tipoPrecio))->first();
            if ($tipo) {
                $this->merge(['tipo_precio_id' => $tipo->id]);
            }
        }
    }

    /**
     * ✅ ACTUALIZADO: Validaciones adicionales personalizadas
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $tipoPrecioId = $this->input('tipo_precio_id');

            // Validar que el tipo de precio exista
            if ($tipoPrecioId && !TipoPrecio::where('id', $tipoPrecioId)->exists()) {
                $validator->errors()->add('tipo_precio_id', 'El tipo de precio seleccionado no existe.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'cantidad_minima.required' => 'La cantidad mínima es requerida',
            'cantidad_minima.integer' => 'La cantidad mínima debe ser un número entero',
            'cantidad_minima.min' => 'La cantidad mínima debe ser mayor a 0',
            'cantidad_maxima.gte' => 'La cantidad máxima debe ser igual o mayor a la mínima',
            'tipo_precio_id.required' => 'El tipo de precio es requerido',
            'fecha_vigencia_fin.after_or_equal' => 'La fecha de fin debe ser posterior o igual a la de inicio',
        ];
    }
}

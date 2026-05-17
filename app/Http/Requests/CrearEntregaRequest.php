<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CrearEntregaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->can('entregas.create');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * Regla importante: Una entrega DEBE tener al menos proforma_id o venta_id
     * Nueva política: Soporta ambos flujos (legacy con proformas, nuevo con ventas)
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Fuente: Debe tener al menos una (venta o proforma)
            'proforma_id' => 'nullable|integer|exists:proformas,id',
            'venta_id' => 'nullable|integer|exists:ventas,id',

            // Asignación
            'chofer_id' => 'nullable|integer|exists:empleados,id',
            'vehiculo_id' => 'nullable|integer|exists:vehiculos,id',
            'direccion_cliente_id' => 'nullable|integer|exists:direcciones_cliente,id',

            // Información de entrega
            'fecha_programada' => 'nullable|date_format:Y-m-d H:i:s',
            'direccion_entrega' => 'nullable|string|max:1000',

            // Peso y volumen
            'peso_kg' => 'nullable|numeric|min:0',
            'volumen_m3' => 'nullable|numeric|min:0',

            // Observaciones
            'observaciones' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Asegurar que al menos uno esté presente
        if (!$this->proforma_id && !$this->venta_id) {
            $this->merge([
                'proforma_id' => null,  // Esto hará que falle la validación personalizada
            ]);
        }
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'proforma_id.exists' => 'La proforma seleccionada no existe',
            'venta_id.exists' => 'La venta seleccionada no existe',
            'chofer_id.exists' => 'El chofer seleccionado no existe',
            'vehiculo_id.exists' => 'El vehículo seleccionado no existe',
            'direccion_cliente_id.exists' => 'La dirección seleccionada no existe',
            'fecha_programada.date_format' => 'La fecha debe estar en formato: YYYY-MM-DD HH:MM:SS',
            'direccion_entrega.max' => 'La dirección no puede exceder 1000 caracteres',
            'peso_kg.numeric' => 'El peso debe ser un número',
            'peso_kg.min' => 'El peso no puede ser negativo',
            'volumen_m3.numeric' => 'El volumen debe ser un número',
            'volumen_m3.min' => 'El volumen no puede ser negativo',
            'observaciones.max' => 'Las observaciones no pueden exceder 1000 caracteres',
        ];
    }

    /**
     * Validación personalizada después del validador
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validar que al menos uno esté presente
            if (!$this->proforma_id && !$this->venta_id) {
                $validator->errors()->add('fuente', 'Debe proporcionar al menos una proforma_id o venta_id');
            }

            // Validar que no ambos estén nulos en el estado final
            if ($this->method() === 'POST' && !$this->proforma_id && !$this->venta_id) {
                $validator->errors()->add('proforma_id', 'Debe seleccionar una proforma o una venta');
            }
        });
    }
}

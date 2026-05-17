<?php

namespace App\Http\Requests;

use App\Enums\TipoCodigoBarraEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCodigoBarraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('productos.manage');
    }

    public function rules(): array
    {
        return [
            'es_principal' => ['sometimes', 'boolean'],
            'activo' => ['sometimes', 'boolean'],
            'tipo' => ['sometimes', 'string', Rule::enum(TipoCodigoBarraEnum::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'es_principal.boolean' => 'El valor para código principal debe ser verdadero o falso',
            'activo.boolean' => 'El valor para activo debe ser verdadero o falso',
            'tipo.enum' => 'El tipo de código seleccionado no es válido',
        ];
    }

    public function attributes(): array
    {
        return [
            'es_principal' => 'código principal',
            'activo' => 'estado activo',
            'tipo' => 'tipo de código',
        ];
    }

    /**
     * Preparar datos para validación
     */
    public function prepareForValidation(): void
    {
        if ($this->has('es_principal')) {
            $this->merge([
                'es_principal' => $this->boolean('es_principal'),
            ]);
        }

        if ($this->has('activo')) {
            $this->merge([
                'activo' => $this->boolean('activo'),
            ]);
        }
    }

    /**
     * Validación adicional personalizada
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $codigoBarra = \App\Models\CodigoBarra::find($this->route('codigo_barra'));

            if (!$codigoBarra) {
                return;
            }

            // Validar que no se inactiven todos los códigos activos
            if ($this->has('activo') && !$this->boolean('activo')) {
                $codigosActivos = $codigoBarra->producto->codigosBarra()
                    ->where('activo', true)
                    ->count();

                if ($codigosActivos === 1) {
                    $validator->errors()->add(
                        'activo',
                        'No se puede inactivar el único código activo del producto'
                    );
                }
            }

            // Validar que no se inactíve el código principal si es el único activo
            if ($this->has('es_principal') && $this->boolean('es_principal')) {
                if (!$codigoBarra->activo) {
                    $validator->errors()->add(
                        'es_principal',
                        'No se puede marcar como principal un código inactivo'
                    );
                }
            }
        });
    }
}

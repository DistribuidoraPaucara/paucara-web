<?php

namespace App\Http\Requests;

use App\Enums\TipoCodigoBarraEnum;
use App\Services\CodigoBarraService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCodigoBarraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('productos.manage');
    }

    public function rules(): array
    {
        return [
            'producto_id' => ['required', 'integer', 'exists:productos,id'],
            'codigo' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Z0-9\-]+$/',
                Rule::unique('codigos_barra')->where('activo', true)->ignore($this->input('codigo'), 'codigo'),
            ],
            'tipo' => ['required', 'string', Rule::enum(TipoCodigoBarraEnum::class)],
            'es_principal' => ['boolean'],
            'auto_generar' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'producto_id.required' => 'El producto es obligatorio',
            'producto_id.exists' => 'El producto seleccionado no existe',
            'codigo.required' => 'El código de barra es obligatorio',
            'codigo.regex' => 'El código solo puede contener letras, números y guiones',
            'codigo.unique' => 'Este código ya existe en otro producto activo',
            'tipo.required' => 'El tipo de código es obligatorio',
            'tipo.enum' => 'El tipo de código seleccionado no es válido',
        ];
    }

    public function attributes(): array
    {
        return [
            'producto_id' => 'producto',
            'codigo' => 'código de barra',
            'tipo' => 'tipo de código',
            'es_principal' => 'código principal',
            'auto_generar' => 'generación automática',
        ];
    }

    /**
     * Preparar datos para validación
     */
    public function prepareForValidation(): void
    {
        $this->merge([
            'codigo' => trim($this->input('codigo', '')),
            'es_principal' => $this->boolean('es_principal'),
            'auto_generar' => $this->boolean('auto_generar'),
        ]);
    }

    /**
     * Validación adicional personalizada
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Si no es auto-generar, validar el formato del código
            if (!$this->boolean('auto_generar')) {
                $tipo = TipoCodigoBarraEnum::tryFrom($this->input('tipo'));

                if ($tipo && $tipo->requiereValidacion()) {
                    $service = app(CodigoBarraService::class);
                    $validacion = $service->validar($this->input('codigo'), $tipo);

                    if (!$validacion['valido']) {
                        $validator->errors()->add('codigo', $validacion['mensaje']);
                    }
                }
            }

            // Verificar unicidad entre códigos activos de otros productos
            if (!$this->boolean('auto_generar')) {
                $existente = \App\Models\CodigoBarra::where('codigo', $this->input('codigo'))
                    ->where('activo', true)
                    ->where('producto_id', '!=', $this->input('producto_id'))
                    ->first();

                if ($existente) {
                    $validator->errors()->add(
                        'codigo',
                        "Este código ya existe en el producto: {$existente->producto->nombre}"
                    );
                }
            }
        });
    }

    /**
     * Obtener datos validados para crear el código
     */
    public function getCodigoData(): array
    {
        if ($this->boolean('auto_generar')) {
            $service = app(CodigoBarraService::class);
            $codigo = $service->generarEAN13();
        } else {
            $codigo = $this->input('codigo');
        }

        return [
            'producto_id' => $this->input('producto_id'),
            'codigo' => $codigo,
            'tipo' => $this->input('tipo'),
            'es_principal' => $this->boolean('es_principal', false),
        ];
    }
}

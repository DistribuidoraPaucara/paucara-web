<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAjusteInventarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('inventario.ajuste.procesar');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * NOTA: Se usa 'nueva_cantidad' en lugar de 'cantidad' para distinguir claramente
     * que este es el valor objetivo final del stock, no la diferencia a ajustar.
     * La diferencia se calcula en el controlador: diferencia = nueva_cantidad - cantidad_actual
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ajustes' => ['required', 'array', 'min:1'],
            'ajustes.*.stock_producto_id' => ['required', 'integer', 'exists:stock_productos,id'],
            'ajustes.*.nueva_cantidad' => ['required', 'integer', 'min:0'],
            'ajustes.*.observacion' => ['nullable', 'string', 'max:500'],
            'ajustes.*.tipo_ajuste_id' => ['nullable', 'integer', 'exists:tipos_ajuste_inventario,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ajustes.required' => 'Debe proporcionar al menos un ajuste de inventario',
            'ajustes.array' => 'Los ajustes deben ser un arreglo',
            'ajustes.min' => 'Debe proporcionar al menos un ajuste de inventario',
            'ajustes.*.stock_producto_id.required' => 'El producto es requerido',
            'ajustes.*.stock_producto_id.exists' => 'El producto seleccionado no existe',
            'ajustes.*.nueva_cantidad.required' => 'La nueva cantidad es requerida',
            'ajustes.*.nueva_cantidad.integer' => 'La cantidad debe ser un número entero',
            'ajustes.*.nueva_cantidad.min' => 'La cantidad no puede ser negativa',
            'ajustes.*.observacion.max' => 'La observación no puede exceder 500 caracteres',
            'ajustes.*.tipo_ajuste_id.exists' => 'El tipo de ajuste seleccionado no existe',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'ajustes.*.stock_producto_id' => 'producto',
            'ajustes.*.nueva_cantidad' => 'cantidad',
            'ajustes.*.observacion' => 'observación',
            'ajustes.*.tipo_ajuste_id' => 'tipo de ajuste',
        ];
    }
}

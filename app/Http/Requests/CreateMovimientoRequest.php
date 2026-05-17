<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class CreateMovimientoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // TODO: Implementar autorización con permisos
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'stock_producto_id' => ['required', 'exists:stock_productos,id'],
            'cantidad'          => ['required', 'integer', 'not_in:0'],
            'tipo'              => ['required', 'in:entrada_ajuste,salida_ajuste'],
            'observacion'       => ['required', 'string', 'max:500'],
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'stock_producto_id.required' => 'El producto es obligatorio.',
            'stock_producto_id.exists'   => 'El producto seleccionado no existe.',

            'cantidad.required'          => 'La cantidad es obligatoria.',
            'cantidad.integer'           => 'La cantidad debe ser un número entero.',
            'cantidad.not_in'            => 'La cantidad no puede ser cero.',

            'tipo.required'              => 'El tipo de movimiento es obligatorio.',
            'tipo.in'                    => 'El tipo de movimiento debe ser "entrada_ajuste" o "salida_ajuste".',

            'observacion.required'       => 'La observación es obligatoria.',
            'observacion.string'         => 'La observación debe ser texto.',
            'observacion.max'            => 'La observación no puede exceder 500 caracteres.',
        ];
    }

    /**
     * Custom attribute names for better error messages
     */
    public function attributes(): array
    {
        return [
            'stock_producto_id' => 'producto',
            'cantidad'          => 'cantidad',
            'tipo'              => 'tipo de movimiento',
            'observacion'       => 'observación',
        ];
    }

    /**
     * Add custom validation logic after Laravel validation
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $this->validarStockSuficiente($validator);
        });
    }

    /**
     * Validar que haya stock suficiente para salidas
     */
    private function validarStockSuficiente(Validator $validator): void
    {
        $tipo = $this->input('tipo');
        $cantidad = (int) $this->input('cantidad');
        $stockProductoId = $this->input('stock_producto_id');

        if ($tipo === 'salida_ajuste' && $stockProductoId) {
            $stockProducto = \App\Models\StockProducto::find($stockProductoId);

            if ($stockProducto && $stockProducto->cantidad < abs($cantidad)) {
                $validator->errors()->add('cantidad',
                    "Stock insuficiente. Disponible: {$stockProducto->cantidad}, solicitado: " . abs($cantidad)
                );
            }
        }
    }
}

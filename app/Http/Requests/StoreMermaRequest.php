<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMermaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('inventario.mermas.registrar');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'almacen_id' => ['required', 'integer', 'exists:almacenes,id'],
            'tipo_merma' => ['required', 'string', 'max:100'],
            'motivo' => ['required', 'string', 'max:500'],
            'observaciones' => ['nullable', 'string', 'max:1000'],
            'productos' => ['required', 'array', 'min:1'],
            'productos.*.producto_id' => ['required', 'integer', 'exists:productos,id'],
            'productos.*.stock_producto_id' => ['nullable', 'integer', 'exists:stock_productos,id'],
            'productos.*.cantidad' => ['required', 'numeric', 'min:0.01'],
            'productos.*.costo_unitario' => ['nullable', 'numeric', 'min:0'],
            'productos.*.lote' => ['nullable', 'string', 'max:100'],
            'productos.*.fecha_vencimiento' => ['nullable', 'date'],
            'productos.*.observaciones' => ['nullable', 'string', 'max:500'],
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
            'almacen_id.required' => 'El almacén es requerido',
            'almacen_id.exists' => 'El almacén seleccionado no existe',
            'tipo_merma.required' => 'El tipo de merma es requerido',
            'motivo.required' => 'El motivo de la merma es requerido',
            'productos.required' => 'Debe agregar al menos un producto',
            'productos.*.producto_id.required' => 'El producto es requerido',
            'productos.*.producto_id.exists' => 'El producto seleccionado no existe',
            'productos.*.cantidad.required' => 'La cantidad es requerida',
            'productos.*.cantidad.min' => 'La cantidad debe ser mayor a 0',
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
            'almacen_id' => 'almacén',
            'tipo_merma' => 'tipo de merma',
            'motivo' => 'motivo',
            'observaciones' => 'observaciones',
            'productos' => 'productos',
        ];
    }
}

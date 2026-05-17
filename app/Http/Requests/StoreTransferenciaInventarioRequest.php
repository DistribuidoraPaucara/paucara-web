<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransferenciaInventarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('inventario.transferencias.crear');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'almacen_origen_id' => ['required', 'integer', 'exists:almacenes,id'],
            'almacen_destino_id' => ['required', 'integer', 'exists:almacenes,id', 'different:almacen_origen_id'],
            'vehiculo_id' => ['nullable', 'integer', 'exists:vehiculos,id'],
            'chofer_id' => ['nullable', 'integer', 'exists:choferes,id'],
            'observaciones' => ['nullable', 'string', 'max:500'],
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.producto_id' => ['required', 'integer', 'exists:productos,id'],
            'detalles.*.cantidad' => ['required', 'integer', 'min:1'],
            'detalles.*.lote' => ['nullable', 'string', 'max:50'],
            'detalles.*.fecha_vencimiento' => ['nullable', 'date', 'after:today'],
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
            'almacen_origen_id.required' => 'El almacén de origen es requerido',
            'almacen_origen_id.exists' => 'El almacén de origen seleccionado no existe',
            'almacen_destino_id.required' => 'El almacén de destino es requerido',
            'almacen_destino_id.exists' => 'El almacén de destino seleccionado no existe',
            'almacen_destino_id.different' => 'El almacén de destino debe ser diferente al de origen',
            'vehiculo_id.exists' => 'El vehículo seleccionado no existe',
            'chofer_id.exists' => 'El chofer seleccionado no existe',
            'observaciones.max' => 'Las observaciones no pueden exceder 500 caracteres',
            'detalles.required' => 'Debe agregar al menos un producto a la transferencia',
            'detalles.min' => 'Debe agregar al menos un producto a la transferencia',
            'detalles.*.producto_id.required' => 'El producto es requerido',
            'detalles.*.producto_id.exists' => 'El producto seleccionado no existe',
            'detalles.*.cantidad.required' => 'La cantidad es requerida',
            'detalles.*.cantidad.min' => 'La cantidad debe ser al menos 1',
            'detalles.*.lote.max' => 'El lote no puede exceder 50 caracteres',
            'detalles.*.fecha_vencimiento.after' => 'La fecha de vencimiento debe ser posterior a hoy',
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
            'almacen_origen_id' => 'almacén de origen',
            'almacen_destino_id' => 'almacén de destino',
            'vehiculo_id' => 'vehículo',
            'chofer_id' => 'chofer',
            'observaciones' => 'observaciones',
            'detalles.*.producto_id' => 'producto',
            'detalles.*.cantidad' => 'cantidad',
            'detalles.*.lote' => 'lote',
            'detalles.*.fecha_vencimiento' => 'fecha de vencimiento',
        ];
    }
}

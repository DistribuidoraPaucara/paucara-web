<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OptimizarEntregasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->can('entregas.create');
    }

    public function rules(): array
    {
        return [
            'venta_ids' => 'required|array|min:1|max:100',
            'venta_ids.*' => 'required|integer|exists:ventas,id',
            'vehiculo_ids' => 'required|array|min:1|max:20',
            'vehiculo_ids.*' => 'required|integer|exists:vehiculos,id',
            'chofer_ids' => 'required|array|min:1|max:20',
            'chofer_ids.*' => 'required|integer|exists:empleados,id',
            'opciones.radio_cluster_km' => 'nullable|numeric|min:0.5|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'venta_ids.required' => 'Debe seleccionar al menos una venta',
            'venta_ids.array' => 'Las ventas deben ser un array',
            'venta_ids.min' => 'Debe seleccionar al menos una venta',
            'venta_ids.max' => 'No puede optimizar más de 100 ventas a la vez',
            'venta_ids.*.required' => 'Cada venta debe ser válida',
            'venta_ids.*.integer' => 'Cada ID de venta debe ser un número entero',
            'venta_ids.*.exists' => 'Una o más ventas no existen en el sistema',

            'vehiculo_ids.required' => 'Debe seleccionar al menos un vehículo',
            'vehiculo_ids.array' => 'Los vehículos deben ser un array',
            'vehiculo_ids.min' => 'Debe seleccionar al menos un vehículo',
            'vehiculo_ids.max' => 'No puede asignar más de 20 vehículos a la vez',
            'vehiculo_ids.*.required' => 'Cada vehículo debe ser válido',
            'vehiculo_ids.*.integer' => 'Cada ID de vehículo debe ser un número entero',
            'vehiculo_ids.*.exists' => 'Uno o más vehículos no existen en el sistema',

            'chofer_ids.required' => 'Debe seleccionar al menos un chofer',
            'chofer_ids.array' => 'Los choferes deben ser un array',
            'chofer_ids.min' => 'Debe seleccionar al menos un chofer',
            'chofer_ids.max' => 'No puede asignar más de 20 choferes a la vez',
            'chofer_ids.*.required' => 'Cada chofer debe ser válido',
            'chofer_ids.*.integer' => 'Cada ID de chofer debe ser un número entero',
            'chofer_ids.*.exists' => 'Uno o más choferes no existen en el sistema',

            'opciones.radio_cluster_km.numeric' => 'El radio de clustering debe ser un número',
            'opciones.radio_cluster_km.min' => 'El radio de clustering debe ser al menos 0.5 km',
            'opciones.radio_cluster_km.max' => 'El radio de clustering no puede exceder 10 km',
        ];
    }
}

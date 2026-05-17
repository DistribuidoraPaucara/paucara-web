<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request para crear una nueva proforma
 *
 * Valida:
 * - Datos básicos (cliente, fechas)
 * - Detalles (productos y cantidades)
 * - Cálculos (subtotal, impuesto, total)
 */
class StoreProformaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Cliente
            'cliente_id' => ['required', 'integer', 'exists:clientes,id'],

            // Fechas
            'fecha' => ['required', 'date_format:Y-m-d'],
            'fecha_vencimiento' => ['required', 'date_format:Y-m-d', 'after_or_equal:fecha'],

            // Almacén (opcional, por defecto 2)
            'almacen_id' => ['nullable', 'integer', 'exists:almacenes,id'],

            // Detalles (array de productos)
            'detalles' => ['required', 'array', 'min:1'],
            'detalles.*.producto_id' => ['required', 'integer', 'exists:productos,id'],
            'detalles.*.cantidad' => ['required', 'numeric', 'min:0.000001'],
            'detalles.*.unidad_medida_id' => ['nullable', 'integer', 'exists:unidades_medida,id'],
            'detalles.*.precio_unitario' => ['nullable', 'numeric', 'min:0'],

            // Cálculos
            'subtotal' => ['required', 'numeric', 'min:0'],
            'impuesto' => ['required', 'numeric', 'min:0'],
            'total' => ['required', 'numeric', 'min:0'],

            // Política de pago
            'politica_pago' => ['sometimes', 'string', 'in:CONTRA_ENTREGA,ANTICIPADO_100,MEDIO_MEDIO,CREDITO'],

            // Opcionales
            'observaciones' => ['nullable', 'string', 'max:1000'],
            'canal' => ['nullable', 'string', 'in:PRESENCIAL,ONLINE,TELEFONO'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'cliente_id.required' => 'El cliente es requerido',
            'cliente_id.exists' => 'El cliente seleccionado no existe',

            'fecha.required' => 'La fecha es requerida',
            'fecha.date_format' => 'La fecha debe tener el formato YYYY-MM-DD',

            'fecha_vencimiento.required' => 'La fecha de vencimiento es requerida',
            'fecha_vencimiento.after_or_equal' => 'La fecha de vencimiento debe ser igual o posterior a la fecha',

            'detalles.required' => 'Debe incluir al menos un producto',
            'detalles.min' => 'Debe incluir al menos un producto',

            'detalles.*.producto_id.required' => 'Cada detalle debe tener un producto',
            'detalles.*.producto_id.exists' => 'El producto seleccionado no existe',

            'detalles.*.cantidad.required' => 'La cantidad es requerida',
            'detalles.*.cantidad.min' => 'La cantidad debe ser mayor a 0',

            'detalles.*.unidad_medida_id.exists' => 'La unidad de medida seleccionada no existe',

            'subtotal.required' => 'El subtotal es requerido',
            'impuesto.required' => 'El impuesto es requerido',
            'total.required' => 'El total es requerido',

            'politica_pago.in' => 'La política de pago seleccionada no es válida',
        ];
    }

    /**
     * Configure el validador para agregar validaciones personalizadas
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $data = $validator->getData();

            // Validar conversiones de unidad para productos fraccionados
            if (isset($data['detalles']) && is_array($data['detalles'])) {
                foreach ($data['detalles'] as $index => $detalle) {
                    $producto = \App\Models\Producto::find($detalle['producto_id'] ?? null);

                    if ($producto) {
                        $unidadId = $detalle['unidad_medida_id'] ?? $producto->unidad_medida_id;

                        // Si NO es fraccionado y la unidad es diferente a la base
                        if (!$producto->es_fraccionado && $unidadId != $producto->unidad_medida_id) {
                            $validator->errors()->add(
                                "detalles.{$index}.unidad_medida_id",
                                "El producto '{$producto->nombre}' no es fraccionado y solo puede cotizarse en su unidad base"
                            );
                        }

                        // Si ES fraccionado, validar que existe conversión
                        if ($producto->es_fraccionado && $unidadId != $producto->unidad_medida_id) {
                            $existe = \App\Models\ConversionUnidadProducto::where('producto_id', $producto->id)
                                ->where(function($q) use ($unidadId, $producto) {
                                    $q->where(function($q2) use ($unidadId, $producto) {
                                        $q2->where('unidad_base_id', $producto->unidad_medida_id)
                                           ->where('unidad_destino_id', $unidadId);
                                    })->orWhere(function($q2) use ($unidadId, $producto) {
                                        $q2->where('unidad_base_id', $unidadId)
                                           ->where('unidad_destino_id', $producto->unidad_medida_id);
                                    });
                                })
                                ->where('activo', true)
                                ->exists();

                            if (!$existe) {
                                $validator->errors()->add(
                                    "detalles.{$index}.unidad_medida_id",
                                    "No existe conversión de unidad configurada para el producto '{$producto->nombre}'"
                                );
                            }
                        }
                    }
                }
            }
        });
    }
}

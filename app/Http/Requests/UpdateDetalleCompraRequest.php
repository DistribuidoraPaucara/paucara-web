<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDetalleCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'compra_id' => 'sometimes|exists:compras,id',
            'producto_id' => 'sometimes|exists:productos,id',
            'cantidad' => 'sometimes|integer',
            'precio_unitario' => 'sometimes|numeric',
            'descuento' => 'nullable|numeric',
            'subtotal' => 'sometimes|numeric',
            'lote' => 'nullable|string',
            'fecha_vencimiento' => 'nullable|date',
        ];
    }
}

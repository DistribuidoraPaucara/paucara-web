<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDetalleCompraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'compra_id' => 'required|exists:compras,id',
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer',
            'precio_unitario' => 'required|numeric',
            'descuento' => 'nullable|numeric',
            'subtotal' => 'required|numeric',
            'lote' => 'nullable|string',
            'fecha_vencimiento' => 'nullable|date',
        ];
    }
}

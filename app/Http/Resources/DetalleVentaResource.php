<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DetalleVentaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'producto' => $this->when($this->producto, [
                'id' => $this->producto?->id,
                'nombre' => $this->producto?->nombre,
                'codigo' => $this->producto?->codigo,
            ]),
            'cantidad' => $this->cantidad,
            'precio_unitario' => (float) $this->precio_unitario,
            'subtotal' => (float) $this->subtotal,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DireccionClienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'direccion' => $this->direccion,
            'observaciones' => $this->observaciones,
            'latitud' => $this->latitud,
            'longitud' => $this->longitud,
            'localidad' => $this->when($this->localidad, [
                'id' => $this->localidad?->id,
                'nombre' => $this->localidad?->nombre,
                'codigo' => $this->localidad?->codigo,
            ]),
        ];
    }
}

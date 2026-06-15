<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntregaResource extends JsonResource
{
    /**
     * ✅ Transformar entrega a JSON con ventas y sus relaciones completas
     * Incluye ventas con tipoPago sin mostrar tipo_pago_id
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_entrega' => $this->numero_entrega,
            'numero_envio' => $this->numero_envio,
            'estado' => $this->estado,
            'estado_entrega_id' => $this->estado_entrega_id,
            'estado_entrega' => $this->when($this->estadoEntrega, [
                'id' => $this->estadoEntrega?->id,
                'codigo' => $this->estadoEntrega?->codigo,
                'nombre' => $this->estadoEntrega?->nombre,
                'color' => $this->estadoEntrega?->color,
                'icono' => $this->estadoEntrega?->icono,
            ]),
            'chofer' => $this->when($this->chofer, [
                'id' => $this->chofer?->id,
                'name' => $this->chofer?->name,
                'nombre' => $this->chofer?->nombre,
            ]),
            'vehiculo' => $this->when($this->vehiculo, [
                'id' => $this->vehiculo?->id,
                'placa' => $this->vehiculo?->placa,
                'marca' => $this->vehiculo?->marca,
                'modelo' => $this->vehiculo?->modelo,
            ]),
            // ✅ NUEVO: Incluir ventas con tipoPago completo
            'ventas' => VentaResource::collection($this->whenLoaded('ventas')),
            'fecha_asignacion' => $this->fecha_asignacion,
            'fecha_entrega' => $this->fecha_entrega,
            'fecha_programada' => $this->fecha_programada,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'peso_kg' => $this->peso_kg,
            'observaciones' => $this->observaciones,
        ];
    }
}

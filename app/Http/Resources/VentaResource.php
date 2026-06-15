<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VentaResource extends JsonResource
{
    /**
     * ✅ Transformar venta a JSON con tipoPago completo
     * Incluye la relación tipoPago sin mostrar tipo_pago_id
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero' => $this->numero,
            'cliente' => $this->when($this->cliente, [
                'id' => $this->cliente?->id,
                'nombre' => $this->cliente?->nombre,
                'telefono' => $this->cliente?->telefono,
                'foto_perfil' => $this->cliente?->foto_perfil,
            ]),
            'total' => (float) $this->total,
            'subtotal' => (float) $this->subtotal,
            'impuesto' => (float) $this->impuesto,
            'peso_total_estimado' => $this->peso_total_estimado,
            'estado_logistico_id' => $this->estado_logistico_id,
            'direccion_cliente_id' => $this->direccion_cliente_id,
            'entrega_id' => $this->entrega_id,
            // ✅ NUEVO: Incluir tipoPago completo (nombre, código) sin mostrar ID
            'tipo_pago' => $this->when($this->tipoPago, [
                'id' => $this->tipoPago?->id,
                'nombre' => $this->tipoPago?->nombre,
                'codigo' => $this->tipoPago?->codigo,
            ]),
            // ✅ Incluir detalles si están cargados
            'detalles' => $this->when(
                $this->relationLoaded('detalles'),
                fn() => DetalleVentaResource::collection($this->detalles)
            ),
            // ✅ Incluir dirección cliente si está cargada
            'direccion_cliente' => $this->when(
                $this->relationLoaded('direccionCliente'),
                fn() => new DireccionClienteResource($this->direccionCliente)
            ),
            // ✅ Incluir estado logístico si está cargado
            'estado_logistica' => $this->when(
                $this->relationLoaded('estadoLogistica'),
                fn() => [
                    'id' => $this->estadoLogistica?->id,
                    'codigo' => $this->estadoLogistica?->codigo,
                    'nombre' => $this->estadoLogistica?->nombre,
                    'color' => $this->estadoLogistica?->color,
                    'icono' => $this->estadoLogistica?->icono,
                ]
            ),
        ];
    }
}

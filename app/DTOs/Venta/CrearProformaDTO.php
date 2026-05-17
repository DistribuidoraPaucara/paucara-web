<?php

namespace App\DTOs\Venta;

use App\DTOs\BaseDTO;
use Illuminate\Http\Request;

/**
 * DTO para crear una proforma
 */
class CrearProformaDTO extends BaseDTO
{
    public function __construct(
        public int $cliente_id,
        public string $fecha,
        public string $fecha_vencimiento,
        public array $detalles,
        public float $subtotal,
        public float $impuesto,
        public float $total,
        public ?int $almacen_id = 2,
        public ?string $observaciones = null,
        public ?string $canal = 'PRESENCIAL',
        public ?string $politica_pago = 'CONTRA_ENTREGA',
        public ?int $usuario_id = null,
        public ?int $preventista_id = null,
        public ?string $estado_inicial = 'BORRADOR',  // BORRADOR o PENDIENTE
        // ✅ NUEVOS CAMPOS (2026-04-06): Detalles de envío
        public ?bool $requiere_envio = false,
        public ?string $fecha_entrega_solicitada = null,
        public ?string $hora_entrega_solicitada = null,
        public ?string $hora_entrega_solicitada_fin = null,
        public ?string $tipo_entrega = 'DELIVERY',
        public ?int $direccion_entrega_solicitada_id = null,
        public ?string $canal_origen = 'WEB',  // WEB, PRESENCIAL, TELEFONO, etc.
    ) {}

    /**
     * Factory: Crear desde Request
     *
     * IMPORTANTE: usuario_id siempre será el usuario autenticado (Auth::id())
     * NO el user_id de la relación cliente, sino el ID del usuario logueado
     */
    public static function fromRequest(Request $request): self
    {
        $estadoInicial = $request->input('estado_inicial', 'BORRADOR');
        $preventistaId = $request->input('preventista_id');

        // ✅ NUEVO (2026-04-06): Debug log para preventista_id
        \Illuminate\Support\Facades\Log::debug('🔍 [CrearProformaDTO::fromRequest] Datos recibidos', [
            'cliente_id' => $request->input('cliente_id'),
            'preventista_id' => $preventistaId,
            'estado_inicial' => $estadoInicial,
            'requiere_envio' => $request->input('requiere_envio'),
            'all_request' => $request->all(),
        ]);

        // ✅ Validar que estado sea BORRADOR o PENDIENTE
        if (!in_array($estadoInicial, ['BORRADOR', 'PENDIENTE'])) {
            $estadoInicial = 'BORRADOR';
        }

        return new self(
            cliente_id: (int) $request->input('cliente_id'),
            fecha: $request->input('fecha', today()->toDateString()),
            fecha_vencimiento: $request->input('fecha_vencimiento', today()->addDays(15)->toDateString()),
            detalles: $request->input('detalles', []),
            subtotal: (float) $request->input('subtotal', 0),
            impuesto: (float) $request->input('impuesto', 0),
            total: (float) $request->input('total', 0),
            almacen_id: (int) $request->input('almacen_id', 1),
            observaciones: $request->input('observaciones'),
            canal: $request->input('canal', 'PRESENCIAL'),
            politica_pago: $request->input('politica_pago', 'CONTRA_ENTREGA'),
            usuario_id: \Illuminate\Support\Facades\Auth::id(),
            preventista_id: $preventistaId ? (int) $preventistaId : null,
            estado_inicial: $estadoInicial,
            // ✅ NUEVOS CAMPOS (2026-04-06): Detalles de envío
            requiere_envio: (bool) $request->input('requiere_envio', false),
            fecha_entrega_solicitada: $request->input('fecha_entrega_solicitada'),
            hora_entrega_solicitada: $request->input('hora_entrega_solicitada'),
            hora_entrega_solicitada_fin: $request->input('hora_entrega_solicitada_fin'),
            tipo_entrega: $request->input('tipo_entrega', 'DELIVERY'),
            direccion_entrega_solicitada_id: $request->input('direccion_entrega_solicitada_id') ? (int) $request->input('direccion_entrega_solicitada_id') : null,
            canal_origen: 'WEB',  // Siempre WEB cuando se crea desde la aplicación web
        );
    }

    /**
     * Validar detalles
     */
    public function validarDetalles(): void
    {
        if (empty($this->detalles)) {
            throw new \InvalidArgumentException('Una proforma debe tener al menos un detalle');
        }

        foreach ($this->detalles as $detalle) {
            if (!isset($detalle['producto_id']) || !isset($detalle['cantidad'])) {
                throw new \InvalidArgumentException(
                    'Cada detalle debe tener producto_id y cantidad'
                );
            }

            if ($detalle['cantidad'] <= 0) {
                throw new \InvalidArgumentException('Cantidad debe ser mayor a 0');
            }
        }
    }
}

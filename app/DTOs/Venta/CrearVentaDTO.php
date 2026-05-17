<?php

namespace App\DTOs\Venta;

use App\DTOs\BaseDTO;
use Illuminate\Http\Request;

/**
 * DTO para crear una venta
 *
 * Representa los datos necesarios para crear una venta desde cualquier cliente
 * (Web, API Mobile, etc)
 */
class CrearVentaDTO extends BaseDTO
{
    public function __construct(
        public int $cliente_id,
        public string $fecha,
        public array $detalles, // Array de { producto_id, cantidad, precio_unitario }
        public float $subtotal,
        public float $descuento = 0,  // ✅ NUEVO: Descuento que viene del frontend
        public float $impuesto,
        public float $total,
        public ?float $peso_total_estimado = null,  // ✅ NUEVO: Peso total en kg (cantidad * peso_producto)
        public int $almacen_id = 2,
        public ?string $observaciones = null,
        public ?int $usuario_id = null,
        public ?int $proforma_id = null,
        // Campos de dirección y logística
        public ?int $direccion_cliente_id = null,
        public ?bool $requiere_envio = null,
        public ?string $canal_origen = 'WEB',
        public ?int $estado_logistico_id = null,
        // Campos de política de pago
        public ?int $tipo_pago_id = null,  // ✅ NUEVO: Tipo de pago seleccionado
        public ?string $politica_pago = 'ANTICIPADO_100',  // ✅ CAMBIO: Por defecto ANTICIPADO_100 para ventas directas
        public ?string $estado_pago = 'PENDIENTE',  // ✅ CAMBIO (2026-02-10): Por defecto PENDIENTE (ventas nuevas siempre sin pagar)
        // Campos de SLA y compromisos de entrega
        public ?string $fecha_entrega_comprometida = null,
        public ?string $hora_entrega_comprometida = null,
        public ?string $ventana_entrega_ini = null,
        public ?string $ventana_entrega_fin = null,
        public ?string $idempotency_key = null,
        // ✅ NUEVO: Estado inicial del documento (permite especificar PENDIENTE o APROBADA)
        public ?int $estado_documento_id = null,
        // ✅ NUEVO: Información de pago (para calcular estado_pago dinámicamente)
        public ?float $monto_pagado_inicial = null,  // Monto pagado en el momento de la aprobación
        // ✅ NUEVO (2026-03-01): Preventista responsable de la venta
        public ?int $preventista_id = null,
        // ✅ NUEVO (2026-03-03): Entrega para asignar venta a una entrega existente
        public ?int $entrega_id = null,
        // ✅ NUEVO (2026-03-09): Pagos parciales - Array de { tipo_pago_id, monto }
        public array $pagos = [],
    ) {}

    /**
     * Factory: Crear desde Request
     */
    public static function fromRequest(Request $request): self
    {
        $user = auth()->user();

        // ✅ NUEVO: Obtener almacén de la empresa principal
        $empresaPrincipal = \App\Models\Empresa::principal();
        $almacenIdPorDefecto = $empresaPrincipal?->almacen_id ?? 1;

        // ✨ CORREGIR: Transformar unidad_venta_id a unidad_medida_id para StockService
        // ✅ NUEVO: Preservar combo_items_seleccionados del frontend
        $detalles = $request->input('detalles', []);
        $detallesCorregidos = array_map(function ($detalle) {
            // Si viene unidad_venta_id, renombrarlo a unidad_medida_id para que StockService lo entienda
            if (isset($detalle['unidad_venta_id']) && !isset($detalle['unidad_medida_id'])) {
                $detalle['unidad_medida_id'] = $detalle['unidad_venta_id'];
            }
            // ✅ NUEVO: Preservar combo_items_seleccionados si viene en el request
            // Estructura: [{ combo_item_id, producto_id, incluido }]
            if (isset($detalle['combo_items_seleccionados'])) {
                $detalle['combo_items_seleccionados'] = $detalle['combo_items_seleccionados'];
            }
            return $detalle;
        }, $detalles);

        return new self(
            cliente_id: (int) $request->input('cliente_id'),
            fecha: $request->input('fecha', today()->toDateString()),
            detalles: $detallesCorregidos,
            subtotal: (float) $request->input('subtotal', 0),
            descuento: (float) $request->input('descuento', 0),  // ✅ NUEVO: Mapear descuento del frontend
            impuesto: (float) $request->input('impuesto', 0),
            total: (float) $request->input('total', 0),
            peso_total_estimado: $request->has('peso_total_estimado') ? (float) $request->input('peso_total_estimado') : null,  // ✅ NUEVO
            almacen_id: (int) $request->input('almacen_id', $almacenIdPorDefecto), // ✅ MODIFICADO: Usa almacén de empresa
            observaciones: $request->input('observaciones'),
            usuario_id: $user ? $user->id : null,
            proforma_id: $request->has('proforma_id') ? (int) $request->input('proforma_id') : null,
            direccion_cliente_id: $request->has('direccion_cliente_id') ? (int) $request->input('direccion_cliente_id') : null,
            requiere_envio: $request->has('requiere_envio') ? (bool) $request->input('requiere_envio') : false,  // ✅ IMPORTANTE: Asegurar que se envíe false si no viene
            canal_origen: $request->input('canal_origen', 'WEB'),
            estado_logistico_id: $request->has('estado_logistico_id') ? (int) $request->input('estado_logistico_id') : null,
            tipo_pago_id: $request->has('tipo_pago_id') ? (int) $request->input('tipo_pago_id') : null,  // ✅ NUEVO: Tipo de pago
            politica_pago: $request->input('politica_pago', 'ANTICIPADO_100'),
            estado_pago: $request->input('estado_pago', 'PENDIENTE'),  // ✅ CAMBIO (2026-02-10): Estado por defecto PENDIENTE para ventas nuevas
            fecha_entrega_comprometida: $request->input('fecha_entrega_comprometida'),
            hora_entrega_comprometida: $request->input('hora_entrega_comprometida'),
            ventana_entrega_ini: $request->input('ventana_entrega_ini'),
            ventana_entrega_fin: $request->input('ventana_entrega_fin'),
            idempotency_key: $request->input('idempotency_key'),
            estado_documento_id: $request->has('estado_documento_id') ? (int) $request->input('estado_documento_id') : null,
            monto_pagado_inicial: $request->has('monto_pagado_inicial') ? (float) $request->input('monto_pagado_inicial') : null,
            // ✅ NUEVO (2026-03-01): Mapear preventista_id del frontend
            // ✅ CORREGIDO: Convertir 0 a null para evitar error de FK
            preventista_id: $request->has('preventista_id') && $request->input('preventista_id') ? (int) $request->input('preventista_id') : null,
            // ✅ NUEVO (2026-03-03): Mapear entrega_id del frontend (para asignar a entrega existente)
            entrega_id: $request->has('entrega_id') && $request->input('entrega_id') ? (int) $request->input('entrega_id') : null,
            // ✅ NUEVO (2026-03-09): Mapear pagos parciales del frontend
            pagos: self::mapearPagos($request->input('pagos', [])),
        );
    }

    /**
     * Mapear y filtrar pagos parciales
     * Solo mantiene pagos válidos (con tipo_pago_id y monto > 0)
     */
    private static function mapearPagos(array $pagos): array
    {
        return array_values(array_filter(
            array_map(function ($pago) {
                return [
                    'tipo_pago_id' => (int) ($pago['tipo_pago_id'] ?? 0),
                    'monto' => (float) ($pago['monto'] ?? 0),
                ];
            }, $pagos),
            fn($p) => $p['tipo_pago_id'] > 0 && $p['monto'] > 0
        ));
    }

    /**
     * Validar que los detalles sean válidos
     *
     * @throws \InvalidArgumentException
     */
    public function validarDetalles(): void
    {
        if (empty($this->detalles)) {
            throw new \InvalidArgumentException('Una venta debe tener al menos un detalle');
        }

        foreach ($this->detalles as $detalle) {
            if (!isset($detalle['producto_id']) || !isset($detalle['cantidad'])) {
                throw new \InvalidArgumentException(
                    'Cada detalle debe tener producto_id y cantidad'
                );
            }

            if ($detalle['cantidad'] <= 0) {
                throw new \InvalidArgumentException(
                    "Cantidad debe ser mayor a 0 para producto {$detalle['producto_id']}"
                );
            }
        }
    }
}

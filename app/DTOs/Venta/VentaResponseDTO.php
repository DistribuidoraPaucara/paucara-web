<?php

namespace App\DTOs\Venta;

use App\DTOs\BaseDTO;
use App\Models\Venta;

/**
 * DTO para respuesta de Venta
 *
 * Se retorna desde Service para ser consumido por Controllers
 * Controllers lo convierten a JSON, Inertia props, etc
 */
class VentaResponseDTO extends BaseDTO
{
    public function __construct(
        public int $id = 0,
        public string $numero = '',
        public int $cliente_id = 0,
        public string $cliente_nombre = '',
        public string $cliente_nit = '',
        public ?array $cliente = null,
        public ?string $estado = null,
        public ?array $estado_documento = null,
        public string $fecha = '',
        public float $subtotal = 0,
        public float $descuento = 0,  // ✅ NUEVO: Descuento de la venta
        public float $impuesto = 0,
        public float $total = 0,
        public ?float $monto_pagado = 0,  // ✅ NUEVO: Monto ya pagado
        public ?array $moneda = null,
        public ?array $usuario = null,
        public ?string $observaciones = null,
        public ?string $observaciones_logistica = null,  // ✅ NUEVO: Observaciones sobre entrega/logística
        public array $detalles = [],
        public string $created_at = '',
        public string $updated_at = '',
        public ?bool $requiere_envio = null,
        public ?string $estado_logistico = null,
        public ?int $estado_logistico_id = null,  // ✅ NUEVO: ID del estado logístico
        public ?array $estadoLogistica = null,    // ✅ NUEVO: Objeto con id, codigo, nombre
        public ?string $canal_origen = null,
        public ?array $tipo_pago = null,
        public ?string $politica_pago = 'CONTRA_ENTREGA',
        public ?string $estado_pago = null,  // ✅ NUEVO: Estado de pago
        public ?array $proforma = null,
        public ?array $direccion_cliente = null,
        public ?array $entregaConfirmacion = null,  // ✅ NUEVO: Confirmación de entrega (entregas_venta_confirmaciones)
        public ?int $preventista_id = null,  // ✅ NUEVO (2026-03-01): ID del preventista
        public ?array $preventista = null,   // ✅ NUEVO (2026-03-01): Datos del preventista
        public array $detalles_pago_venta = [],  // ✅ NUEVO: Detalles de pagos múltiples
    ) {}

    /**
     * Enriquecer combo items con datos del producto
     * Toma los combo_items_seleccionados (que solo tienen IDs) y agrega nombre y SKU del producto
     */
    private static function enrichComboItems(array $comboItems): array
    {
        if (empty($comboItems)) {
            return [];
        }

        // Obtener IDs únicos de productos
        $productoIds = array_column($comboItems, 'producto_id');

        if (empty($productoIds)) {
            return [];
        }

        // Cargar todos los productos de una vez (eficiencia)
        $productos = \App\Models\Producto::whereIn('id', array_unique($productoIds))
            ->get(['id', 'nombre', 'sku'])
            ->keyBy('id');

        // Enriquecer cada combo item con los datos del producto
        return array_map(function ($item) use ($productos) {
            $producto = $productos->get($item['producto_id']);

            return [
                'combo_item_id' => $item['combo_item_id'] ?? null,
                'producto_id' => $item['producto_id'],
                'cantidad' => $item['cantidad'],
                'incluido' => $item['incluido'] ?? true,
                // ✅ NUEVO (2026-06-02): Precio unitario del componente
                'precio_unitario' => $item['precio_unitario'] ?? $producto?->precio_venta ?? 0,
                // ✅ NUEVO: Datos del producto
                'producto' => $producto ? [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'sku' => $producto->sku,
                    'precio_venta' => $producto->precio_venta ?? 0,
                ] : null,
            ];
        }, $comboItems);
    }

    /**
     * Factory: Crear desde Model Eloquent
     */
    public static function fromModel($venta): static
    {
        // ✅ ACTUALIZADO: Cargar todas las relaciones necesarias
        if (!isset($venta->estadoDocumento)) {
            $venta->load('estadoDocumento');
        }
        if (!isset($venta->moneda)) {
            $venta->load('moneda');
        }
        if (!isset($venta->usuario)) {
            $venta->load('usuario');
        }
        if (!isset($venta->tipoPago)) {
            $venta->load('tipoPago');
        }
        if (!isset($venta->proforma)) {
            $venta->load('proforma');
        }
        if (!isset($venta->direccionCliente)) {
            $venta->load('direccionCliente.localidad');  // ✅ Cargar con localidad para mapas
        } elseif (!isset($venta->direccionCliente->localidad)) {
            // Si direccionCliente existe pero no localidad, cargar solo localidad
            $venta->direccionCliente->load('localidad');
        }
        if (!isset($venta->estadoLogistica)) {
            $venta->load('estadoLogistica');  // ✅ NUEVO: Cargar estado logístico
        }
        if (!isset($venta->confirmaciones)) {
            $venta->load('confirmaciones.confirmadobPor', 'confirmaciones.tipoPago');  // ✅ NUEVO: Cargar confirmaciones con relaciones
        }
        if (!isset($venta->preventista)) {
            $venta->load('preventista');  // ✅ NUEVO (2026-03-01): Cargar preventista
        }
        if (!isset($venta->detallesPagoVenta)) {
            $venta->load('detallesPagoVenta.tipoPago');  // ✅ NUEVO: Cargar detalles de pagos
        }
        // ✅ NUEVO: Cargar datos completos de productos en detalles
        if (!isset($venta->detalles[0]->producto->categoria)) {
            $venta->load('detalles.producto.categoria', 'detalles.producto.marca', 'detalles.producto.unidad', 'detalles.producto.codigosBarra');
        }

        // ✅ NUEVO (2026-06-02): Cargar comboItems para obtener precios correctos de componentes
        if (!isset($venta->detalles[0]->producto->comboItems)) {
            $venta->load('detalles.producto.comboItems.producto');
        }

        return new self(
            id: $venta->id,
            numero: $venta->numero ?? '',
            cliente_id: $venta->cliente_id,
            cliente_nombre: $venta->cliente->nombre ?? 'N/A',
            cliente_nit: $venta->cliente->nit ?? 'N/A',
            cliente: $venta->cliente ? [
                'id' => $venta->cliente->id,
                'nombre' => $venta->cliente->nombre,
                'nit' => $venta->cliente->nit,
                'email' => $venta->cliente->email ?? null,
                'telefono' => $venta->cliente->telefono ?? null,
                'foto_perfil' => $venta->cliente->foto_perfil ?? null,
            ] : null,
            estado: $venta->estado ?? 'PENDIENTE',
            estado_documento: $venta->estadoDocumento ? [
                'id' => $venta->estadoDocumento->id,
                'codigo' => $venta->estadoDocumento->codigo,
                'nombre' => $venta->estadoDocumento->nombre,
                'descripcion' => $venta->estadoDocumento->descripcion,
            ] : null,
            fecha: $venta->fecha->toDateString(),
            subtotal: (float) $venta->subtotal,
            descuento: (float) $venta->descuento,  // ✅ NUEVO: Incluir descuento
            impuesto: (float) $venta->impuesto,
            total: (float) $venta->total,
            monto_pagado: (float) ($venta->monto_pagado ?? 0),  // ✅ NUEVO: Incluir monto pagado
            moneda: $venta->moneda ? [
                'id' => $venta->moneda->id,
                'codigo' => $venta->moneda->codigo,
                'nombre' => $venta->moneda->nombre,
            ] : null,
            usuario: $venta->usuario ? [
                'id' => $venta->usuario->id,
                'name' => $venta->usuario->name,
                'email' => $venta->usuario->email,
            ] : null,
            observaciones: $venta->observaciones,
            observaciones_logistica: $venta->observaciones_logistica,  // ✅ NUEVO: Observaciones de logística
            detalles: $venta->detalles->map(fn($det) => [
                'id' => $det->id,
                'producto_id' => $det->producto_id,
                'producto' => $det->producto ? [
                    'id' => $det->producto->id,
                    'nombre' => $det->producto->nombre ?? 'N/A',
                    'codigo' => $det->producto->codigo ?? null,
                    'sku' => $det->producto->sku ?? null,  // ✅ NUEVO: SKU del producto
                    'descripcion' => $det->producto->descripcion ?? null,
                    'es_combo' => $det->producto->es_combo ?? false,
                    // ✅ NUEVO: Marca
                    'marca' => $det->producto->marca ? [
                        'id' => $det->producto->marca->id,
                        'nombre' => $det->producto->marca->nombre,
                    ] : null,
                    // ✅ NUEVO: Unidad de medida
                    'unidad' => $det->producto->unidad ? [
                        'id' => $det->producto->unidad->id,
                        'nombre' => $det->producto->unidad->nombre,
                        'simbolo' => $det->producto->unidad->simbolo ?? null,
                    ] : null,
                    // ✅ NUEVO: Categoría
                    'categoria' => $det->producto->categoria ? [
                        'id' => $det->producto->categoria->id,
                        'nombre' => $det->producto->categoria->nombre,
                    ] : null,
                    // ✅ NUEVO: Códigos de barra
                    'codigos_barra' => $det->producto->codigosBarra ?
                        $det->producto->codigosBarra->map(fn($cb) => [
                            'id' => $cb->id,
                            'codigo' => $cb->codigo,
                            'es_principal' => $cb->es_principal ?? false,
                        ])->toArray()
                        : [],
                ] : null,
                'cantidad' => $det->cantidad,
                'precio_unitario' => (float) $det->precio_unitario,
                'descuento' => (float) ($det->descuento ?? 0),
                'subtotal' => (float) $det->subtotal,
                // ✅ NUEVO (2026-06-02): Usar comboItems cargados si existen, sino usar el array guardado
                'combo_items_seleccionados' => ($det->producto && $det->producto->comboItems && $det->producto->comboItems->count() > 0)
                    ? $det->producto->comboItems->map(fn($item) => [
                        'combo_item_id' => $item->id,
                        'producto_id' => $item->producto_id,
                        'cantidad' => $item->cantidad,
                        'precio_unitario' => (float) ($item->precio_unitario ?? $item->producto?->precio_venta ?? 0),
                        'incluido' => true,
                        'producto' => $item->producto ? [
                            'id' => $item->producto->id,
                            'nombre' => $item->producto->nombre,
                            'sku' => $item->producto->sku,
                            'precio_venta' => (float) ($item->producto->precio_venta ?? 0),
                        ] : null,
                    ])->toArray()
                    : static::enrichComboItems($det->combo_items_seleccionados ?? []),
            ])->toArray(),
            created_at: $venta->created_at->toIso8601String(),
            updated_at: $venta->updated_at->toIso8601String(),
            requiere_envio: $venta->requiere_envio,
            estado_logistico: $venta->estado_logistico,
            estado_logistico_id: $venta->estado_logistico_id,  // ✅ NUEVO: ID de la FK
            estadoLogistica: $venta->estadoLogistica ? [       // ✅ NUEVO: Relación completa
                'id' => $venta->estadoLogistica->id,
                'codigo' => $venta->estadoLogistica->codigo,
                'nombre' => $venta->estadoLogistica->nombre ?? null,
                'categoria' => $venta->estadoLogistica->categoria ?? null,
            ] : null,
            canal_origen: $venta->canal_origen,
            tipo_pago: $venta->tipoPago ? [
                'id' => $venta->tipoPago->id,
                'nombre' => $venta->tipoPago->nombre,
            ] : null,
            politica_pago: $venta->politica_pago ?? 'CONTRA_ENTREGA',
            estado_pago: $venta->estado_pago ?? 'PENDIENTE',  // ✅ NUEVO: Estado de pago
            proforma: $venta->proforma ? [
                'id' => $venta->proforma->id,
                'numero' => $venta->proforma->numero,
            ] : null,
            direccion_cliente: $venta->direccionCliente ? [
                'id' => $venta->direccionCliente->id,
                'direccion' => $venta->direccionCliente->direccion,
                'referencias' => $venta->direccionCliente->observaciones ?? null,
                'localidad' => $venta->direccionCliente->localidad?->nombre ?? null,
                'localidad_id' => $venta->direccionCliente->localidad_id,
                'latitud' => (float) ($venta->direccionCliente->latitud ?? 0),    // ✅ NUEVO: Para mapas
                'longitud' => (float) ($venta->direccionCliente->longitud ?? 0), // ✅ NUEVO: Para mapas
                'es_principal' => $venta->direccionCliente->es_principal ?? false,
                'activa' => $venta->direccionCliente->activa ?? true,
            ] : null,
            // ✅ NUEVO: Confirmación de entrega (EXPANDIDO con todas las imágenes y detalles)
            entregaConfirmacion: (function () use ($venta) {
                $firstConfirmacion = $venta->confirmaciones?->first();

                if (!$firstConfirmacion) {
                    return null;
                }

                return [
                    'id'                      => $firstConfirmacion->id,
                    'entrega_id'              => $firstConfirmacion->entrega_id ?? null,
                    'venta_id'                => $firstConfirmacion->venta_id,
                    'tipo_entrega'            => $firstConfirmacion->tipo_entrega ?? null,
                    'tipo_novedad'            => $firstConfirmacion->tipo_novedad ?? null,
                    'tuvo_problema'           => $firstConfirmacion->tuvo_problema ?? false,
                    'tienda_abierta'          => $firstConfirmacion->tienda_abierta,
                    'cliente_presente'        => $firstConfirmacion->cliente_presente,
                    'motivo_rechazo'          => $firstConfirmacion->motivo_rechazo ?? null,
                    'observaciones_logistica' => $firstConfirmacion->observaciones_logistica ?? null,
                    // ✅ IMÁGENES Y FIRMA
                    'fotos'                   => $firstConfirmacion->fotos ?? [],
                    'firma_digital_url'       => $firstConfirmacion->firma_digital_url ?? null,
                    'foto_comprobante'        => $firstConfirmacion->foto_comprobante ?? null,
                    // ✅ INFORMACIÓN DE PAGO
                    'estado_pago'             => $firstConfirmacion->estado_pago ?? null,
                    'total_dinero_recibido'   => (float) ($firstConfirmacion->total_dinero_recibido ?? 0),
                    'monto_pendiente'         => (float) ($firstConfirmacion->monto_pendiente ?? 0),
                    'monto_recibido'          => (float) ($firstConfirmacion->monto_recibido ?? 0),
                    'desglose_pagos'          => $firstConfirmacion->desglose_pagos ?? [],
                    'tipo_pago'               => $firstConfirmacion->tipoPago ? [
                        'id'    => $firstConfirmacion->tipoPago->id,
                        'nombre' => $firstConfirmacion->tipoPago->nombre,
                    ] : null,
                    // ✅ DEVOLUCIONES PARCIALES
                    'productos_devueltos'     => $firstConfirmacion->productos_devueltos ?? [],
                    'monto_devuelto'          => (float) ($firstConfirmacion->monto_devuelto ?? 0),
                    'monto_aceptado'          => (float) ($firstConfirmacion->monto_aceptado ?? 0),
                    // ✅ INFORMACIÓN DE CONFIRMACIÓN
                    'confirmado_por'          => $firstConfirmacion->confirmadobPor ? [
                        'id'   => $firstConfirmacion->confirmadobPor->id,
                        'name' => $firstConfirmacion->confirmadobPor->name,
                    ] : null,
                    'confirmado_en'           => $firstConfirmacion->confirmado_en ?? null,
                    'created_at'              => $firstConfirmacion->created_at ?? null,
                ];
            })(),
            // ✅ NUEVO (2026-03-01): Preventista
            preventista_id: $venta->preventista_id,
            preventista: $venta->preventista ? [
                'id' => $venta->preventista->id,
                'name' => $venta->preventista->name,
                'email' => $venta->preventista->email,
            ] : null,
            // ✅ NUEVO: Detalles de pagos múltiples
            detalles_pago_venta: $venta->detallesPagoVenta ? $venta->detallesPagoVenta->map(fn($detallePago) => [
                'id' => $detallePago->id,
                'venta_id' => $detallePago->venta_id,
                'tipo_pago_id' => $detallePago->tipo_pago_id,
                'monto' => (float) $detallePago->monto,
                'fecha_pago' => $detallePago->fecha_pago,
                'numero_comprobante' => $detallePago->numero_comprobante ?? null,
                'observaciones' => $detallePago->observaciones ?? null,
                'tipo_pago' => $detallePago->tipoPago ? [
                    'id' => $detallePago->tipoPago->id,
                    'nombre' => $detallePago->tipoPago->nombre,
                ] : null,
            ])->toArray() : [],
        );
    }

    /**
     * Convertir a Inertia props (para Inertia::render)
     */
    public function toInertiaProps(): array
    {
        return $this->toArray();
    }

    /**
     * Convertir a JSON para API
     */
    public function toJsonResponse(): array
    {
        return [
            'success' => true,
            'message' => 'Venta obtenida exitosamente',
            'data' => $this->toArray(),
        ];
    }
}

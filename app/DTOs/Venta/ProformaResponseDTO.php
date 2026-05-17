<?php

namespace App\DTOs\Venta;

use App\DTOs\BaseDTO;
use App\Models\Proforma;
use App\Services\ProductoStockService;

/**
 * DTO para respuesta de Proforma
 */
class ProformaResponseDTO extends BaseDTO
{
    public function __construct(
        public int $id,
        public string $numero,
        public int $cliente_id,
        public string $cliente_nombre,
        public array $cliente,
        public string $estado,
        public string $fecha,
        public string $fecha_vencimiento,
        public float $subtotal,
        public float $descuento,
        public float $impuesto,
        public float $total,
        public ?string $observaciones = null,
        public string $canal = 'PRESENCIAL',
        public ?string $tipo_entrega = null,
        public ?string $estado_pago = 'PENDIENTE',
        public ?array $moneda = null,
        public ?string $fecha_entrega_solicitada = null,
        public ?string $hora_entrega_solicitada = null,
        public ?string $hora_entrega_solicitada_fin = null,
        public ?string $fecha_entrega_confirmada = null,
        public ?string $hora_entrega_confirmada = null,
        public ?string $hora_entrega_confirmada_fin = null,
        public ?array $direccion_solicitada = null,
        public ?array $direccion_confirmada = null,
        public array $detalles = [],
        public ?string $politica_pago = 'CONTRA_ENTREGA',
        public ?string $canal_origen = null,
        public int $items_count = 0,
        public string $created_at = '',
        public string $updated_at = '',
        public ?int $usuario_creador_id = null,
        public ?array $usuario_creador = null,
        // ✅ CRÍTICO: Incluir datos completos del estado logístico para Show.tsx
        public ?array $estado_logistica = null,
        // ✅ NUEVO: Incluir datos de venta cuando la proforma es CONVERTIDA
        public ?array $venta = null,
    ) {}

    /**
     * Factory: Crear desde Model
     */
    public static function fromModel($model): static
    {
        /** @var Proforma $model */
        return new self(
            id: $model->id,
            numero: $model->numero,
            cliente_id: $model->cliente_id,
            cliente_nombre: $model->cliente->nombre ?? 'N/A',
            cliente: [
                'id' => $model->cliente->id,
                'nombre' => $model->cliente->nombre,
                'email' => $model->cliente->email ?? null,
                'telefono' => $model->cliente->telefono ?? null,
                'direccion' => $model->cliente->direccion ?? null,
                'limite_credito' => (float) ($model->cliente->limite_credito ?? 0),
                'puede_tener_credito' => $model->cliente->puede_tener_credito ?? false,
            ],
            estado: $model->estado,
            fecha: $model->fecha->toDateString(),
            fecha_vencimiento: $model->fecha_vencimiento->toDateString(),
            subtotal: (float) $model->subtotal,
            descuento: (float) $model->descuento,
            impuesto: (float) $model->impuesto,
            total: (float) $model->total,
            observaciones: $model->observaciones,
            canal: $model->canal ?? 'PRESENCIAL',
            tipo_entrega: $model->tipo_entrega ?? null,
            estado_pago: $model->estado_pago ?? 'PENDIENTE',
            moneda: $model->relationLoaded('moneda') && $model->moneda ? [
                'id' => $model->moneda->id,
                'codigo' => $model->moneda->codigo,
                'nombre' => $model->moneda->nombre,
                'simbolo' => $model->moneda->simbolo ?? 'Bs.',
            ] : null,
            fecha_entrega_solicitada: $model->fecha_entrega_solicitada?->toDateString(),
            hora_entrega_solicitada: self::extractTimeFromField($model->hora_entrega_solicitada),
            hora_entrega_solicitada_fin: self::extractTimeFromField($model->hora_entrega_solicitada_fin),
            fecha_entrega_confirmada: $model->fecha_entrega_confirmada?->toDateString(),
            hora_entrega_confirmada: self::extractTimeFromField($model->hora_entrega_confirmada),
            hora_entrega_confirmada_fin: self::extractTimeFromField($model->hora_entrega_confirmada_fin),
            direccion_solicitada: $model->relationLoaded('direccionSolicitada') && $model->direccionSolicitada ? [
                'id' => $model->direccionSolicitada->id,
                'direccion' => $model->direccionSolicitada->direccion,
                'latitud' => (float) ($model->direccionSolicitada->latitud ?? 0),
                'longitud' => (float) ($model->direccionSolicitada->longitud ?? 0),
                'ciudad' => $model->direccionSolicitada->ciudad ?? null,
                'departamento' => $model->direccionSolicitada->departamento ?? null,
                'observaciones' => $model->direccionSolicitada->observaciones ?? null,
            ] : null,
            direccion_confirmada: $model->relationLoaded('direccionConfirmada') && $model->direccionConfirmada ? [
                'id' => $model->direccionConfirmada->id,
                'direccion' => $model->direccionConfirmada->direccion,
                'latitud' => (float) ($model->direccionConfirmada->latitud ?? 0),
                'longitud' => (float) ($model->direccionConfirmada->longitud ?? 0),
                'ciudad' => $model->direccionConfirmada->ciudad ?? null,
                'departamento' => $model->direccionConfirmada->departamento ?? null,
                'observaciones' => $model->direccionConfirmada->observaciones ?? null,
            ] : null,
            detalles: $model->detalles->map(function($det) use ($model) {
                // ✅ NUEVO: Lógica de fallback para tipo_precio_id basada en cliente_id
                $tipoPrecioId = $det->tipo_precio_id;

                if (is_null($tipoPrecioId)) {
                    // Si no tiene tipo_precio asignado, usar lógica de fallback según cliente
                    if ($model->cliente_id == 32) {
                        // Cliente general (id=32) → usar LICORERIA
                        $tipoPrecioFallback = \App\Models\TipoPrecio::porCodigo('LICORERIA');
                    } else {
                        // Otros clientes → usar VENTA
                        $tipoPrecioFallback = \App\Models\TipoPrecio::porCodigo('VENTA');
                    }

                    $tipoPrecioId = $tipoPrecioFallback?->id;
                }

                // ✅ CRÍTICO (2026-02-17): Construir objeto producto anidado para ProductosTable.tsx
                // ProductosTable busca detalle.producto.es_combo, no detalle.es_combo

                // ✅ CRÍTICO (2026-02-18): Para COMBOS, calcular capacidad en lugar de stock directo
                // ✅ PATRÓN: Usar ProductoStockService (mismo que buscarApi endpoint)
                $esCombo = (bool) ($det->producto->es_combo ?? false);

                // Obtener stock usando el servicio centralizado (maneja combos + normales)
                $almacenId = auth()->user()->empresa->almacen_id ?? null;
                $stockInfo = ProductoStockService::obtenerStockProducto($det->producto_id, $almacenId);

                if ($esCombo) {
                    // Para combos: usar capacidad (cuántos combos se pueden hacer)
                    $stockDisponible = (int) ($stockInfo['capacidad'] ?? 0); // ← Capacidad de manufactura
                    $stockTotal = (int) ($stockInfo['capacidad'] ?? 0);
                    $stockReservado = 0; // Los combos no se reservan individualmente
                } else {
                    // Para productos normales: usar stock directo
                    $stockDisponible = (int) $stockInfo['stock_disponible'];
                    $stockTotal = (int) $stockInfo['stock_total'];
                    $stockReservado = (int) $stockInfo['stock_reservado'];
                }

                $productoAnidado = [
                    'id' => $det->producto_id,
                    'nombre' => $det->producto->nombre ?? 'N/A',
                    'producto_id' => $det->producto_id,
                    'sku' => $det->producto->sku ?? null,
                    'marca' => $det->producto->marca?->nombre ?? null,
                    'peso' => (float) ($det->producto->peso ?? 0),
                    'categoria' => $det->producto->categoria?->nombre ?? null,
                    'stock_disponible' => $stockDisponible,
                    'stock_total' => $stockTotal,
                    'stock_reservado' => $stockReservado,
                    'limite_venta' => $det->producto->limite_venta ? (int) $det->producto->limite_venta : null,
                    'unidad_medida_id' => $det->producto->unidad_medida_id ?? $det->unidad_medida_id,
                    'unidad_medida_nombre' => $det->producto->relationLoaded('unidad') && $det->producto->unidad ? $det->producto->unidad->nombre : null,
                    'precios' => $det->producto->relationLoaded('precios') && $det->producto->precios
                        ? $det->producto->precios->map(fn($p) => [
                            'id' => $p->id,
                            'tipo_precio_id' => $p->tipo_precio_id,
                            'nombre' => $p->tipoPrecio?->nombre ?? 'Precio',
                            'precio' => (float) $p->precio,
                        ])->toArray()
                        : [],
                    // ✅ CRÍTICO: Campos de combo DENTRO del objeto producto
                    'es_combo' => (bool) ($det->producto->es_combo ?? false),
                    'combo_items' => $det->producto->relationLoaded('comboItems') && $det->producto->comboItems
                        ? (function() use ($det, $almacenId) {
                            // Calcular capacidad UNA vez para obtener es_cuello_botella y combos_posibles
                            $capacidadInfo = null;
                            if ($almacenId) {
                                try {
                                    $capacidadInfo = \App\Services\ComboStockService::calcularCapacidadConDetalles(
                                        $det->producto_id,
                                        $almacenId
                                    );
                                } catch (\Exception $e) {
                                    \Log::warning('No se pudo calcular capacidad combo: ' . $e->getMessage());
                                }
                            }

                            return $det->producto->comboItems->map(function($combo) use ($capacidadInfo, $almacenId) {
                                // Buscar datos de capacidad para este item específico
                                $detalleCapacidad = null;
                                if ($capacidadInfo) {
                                    $detalleCapacidad = collect($capacidadInfo['detalles'] ?? [])
                                        ->firstWhere('producto_id', $combo->producto_id);
                                }

                                // Stock del ingrediente en el almacén
                                $stockItem = null;
                                if ($almacenId && $combo->producto) {
                                    $stockItem = $combo->producto->stock()
                                        ->where('almacen_id', $almacenId)
                                        ->first();
                                }

                                return [
                                    'id'                    => $combo->id,
                                    'combo_id'              => $combo->combo_id ?? $combo->producto_id,
                                    'producto_id'           => $combo->producto_id,
                                    'producto_nombre'       => $combo->producto?->nombre ?? 'N/A',
                                    'producto_sku'          => $combo->producto?->sku ?? null,
                                    'producto_codigo_barras'=> $combo->producto?->codigo_barras ?? null,
                                    'cantidad'              => (float) $combo->cantidad,
                                    'precio_unitario'       => (float) ($combo->precio_unitario ?? 0),
                                    'tipo_precio_id'        => $combo->tipo_precio_id ?? null,
                                    'tipo_precio_nombre'    => $combo->relationLoaded('tipoPrecio') ? ($combo->tipoPrecio?->nombre ?? null) : null,
                                    'unidad_medida_id'      => $combo->producto?->unidad_medida_id ?? null,
                                    'unidad_medida_nombre'  => $combo->producto?->unidad?->nombre ?? null,
                                    'stock_disponible'      => (int) ($stockItem?->cantidad_disponible ?? 0),
                                    'stock_total'           => (int) ($stockItem?->cantidad ?? 0),
                                    'es_obligatorio'        => (bool) $combo->es_obligatorio,
                                    'es_cuello_botella'     => (bool) ($detalleCapacidad['es_cuello_botella'] ?? false),
                                    'combos_posibles'       => (int) ($detalleCapacidad['combos_posibles'] ?? 0),
                                ];
                            })->toArray();
                        })()
                        : [],
                ];

                return [
                    'id' => $det->id,
                    'producto_id' => $det->producto_id,
                    'producto' => $productoAnidado, // ✅ CRÍTICO: Anidado para ProductosTable.tsx
                    'producto_nombre' => $det->producto->nombre ?? 'N/A',
                    'cantidad' => (float) $det->cantidad,
                    'precio_unitario' => (float) $det->precio_unitario,
                    'descuento' => (float) ($det->descuento ?? 0),
                    'subtotal' => (float) $det->subtotal,
                    'tipo_precio_id' => $tipoPrecioId,
                    'tipo_precio_nombre' => $det->tipo_precio_nombre,
                    // ✅ DUPLICADO: También incluir en nivel superior (compatibilidad con frontend anterior)
                    'es_combo' => (bool) ($det->producto->es_combo ?? false),
                    'combo_items' => $productoAnidado['combo_items'],
                    'combo_items_seleccionados' => self::buildComboItemsSeleccionados(
                        $det->combo_items_seleccionados ?? [],
                        $det->producto->relationLoaded('comboItems') ? $det->producto->comboItems : collect([])
                    ),
                    // ✅ NUEVO (2026-02-17): Indicar si el combo debería estar expandido
                    // ProductosTable.tsx usa este campo para pre-expandir combos que vienen del backend
                    'expanded' => (bool) ($det->producto->es_combo ?? false), // ← Expandir todos los combos por defecto
                ];
            })->toArray(),
            politica_pago: $model->politica_pago ?? 'CONTRA_ENTREGA',
            canal_origen: $model->canal_origen ?? $model->canal ?? null,
            items_count: $model->detalles->count(),
            created_at: $model->created_at->toIso8601String(),
            updated_at: $model->updated_at->toIso8601String(),
            usuario_creador_id: $model->usuario_creador_id,
            usuario_creador: $model->relationLoaded('usuarioCreador') && $model->usuarioCreador ? [
                'id' => $model->usuarioCreador->id,
                'name' => $model->usuarioCreador->name,
                'email' => $model->usuarioCreador->email,
            ] : null,
            // ✅ CRÍTICO: Incluir datos del estado logístico para que Show.tsx muestre icon/nombre/color
            estado_logistica: $model->relationLoaded('estadoLogistica') && $model->estadoLogistica ? [
                'id' => $model->estadoLogistica->id,
                'codigo' => $model->estadoLogistica->codigo,
                'nombre' => $model->estadoLogistica->nombre,
                'icono' => $model->estadoLogistica->icono ?? null,
                'color' => $model->estadoLogistica->color ?? null,
                'categoria' => $model->estadoLogistica->categoria,
                'descripcion' => $model->estadoLogistica->descripcion ?? null,
                'activo' => $model->estadoLogistica->activo,
            ] : null,
            // ✅ NUEVO: Incluir datos de venta cuando la proforma fue convertida (para mostrar en Show.tsx)
            venta: $model->relationLoaded('venta') && $model->venta ? [
                'id' => $model->venta->id,
                'numero' => $model->venta->numero,
            ] : null,
        );
    }

    /**
     * ✅ CRÍTICO: Construir array de items seleccionados del combo
     * Si combo_items_seleccionados está vacío, por defecto:
     * - Incluir TODOS los items obligatorios (es_obligatorio = true)
     * - Incluir TODOS los items opcionales (es_obligatorio = false) que existan
     *
     * ProductosTable.tsx necesita saber exactamente cuáles items están incluidos
     */
    public static function buildComboItemsSeleccionados($seleccionadosGuardados, $comboItems): array
    {
        // Si no hay items guardados, construir array con todos los items del combo
        // (asumiendo que todos están seleccionados por defecto, como debe ser el comportamiento)
        if (empty($comboItems)) {
            return [];
        }

        // ✅ CRÍTICO (2026-02-18): Si hay items seleccionados guardados, ENRIQUECER con detalles de comboItems
        // El estado guardado solo tiene: combo_item_id, producto_id, incluido
        // Necesitamos AGREGAR: id, producto_nombre, cantidad, es_obligatorio desde comboItems
        if (is_array($seleccionadosGuardados) && count($seleccionadosGuardados) > 0) {
            // Convertir comboItems a Collection si no lo es, luego crear mapa por producto_id
            // ✅ IMPORTANTE: Mantener como Collection (NO convertir a array) para preservar relaciones Eloquent
            $comboItemsCollection = collect($comboItems);

            // Crear mapa de producto_id => combo item para búsqueda rápida (mantiene Eloquent models)
            $comboItemsMap = $comboItemsCollection->keyBy('producto_id');

            return array_map(function($item) use ($comboItemsMap) {
                $productoId = $item['producto_id'] ?? null;

                // Buscar el combo item por producto_id (ahora es un Eloquent model, no array)
                $comboItemEncontrado = $comboItemsMap[$productoId] ?? null;

                // Si encontramos el combo item, enriquecer con sus detalles
                if ($comboItemEncontrado) {
                    return [
                        'id' => $comboItemEncontrado->id ?? null,
                        'producto_id' => $productoId,
                        // ✅ FIJO: Accede a ->producto->nombre correctamente en Eloquent model
                        'producto_nombre' => ($comboItemEncontrado->producto?->nombre ?? null) ??
                                          ($comboItemEncontrado->producto_nombre ?? 'N/A'),
                        'cantidad' => (int) ($comboItemEncontrado->cantidad ?? 0),
                        'es_obligatorio' => (bool) ($comboItemEncontrado->es_obligatorio ?? false),
                        'incluido' => (bool) ($item['incluido'] ?? false),
                    ];
                }

                // Si no encontramos el combo item, devolver lo que tenemos con defaults
                return [
                    'id' => null,
                    'producto_id' => $productoId,
                    'producto_nombre' => 'N/A',
                    'cantidad' => 0,
                    'es_obligatorio' => false,
                    'incluido' => (bool) ($item['incluido'] ?? false),
                ];
            }, $seleccionadosGuardados);
        }

        // Si no hay items guardados, construir array con todos los items del combo por defecto
        return collect($comboItems)->map(function($combo) {
            // Manejar tanto objetos Eloquent como arrays
            $id = (is_object($combo) ? $combo->id : $combo['id'] ?? null) ?? null;
            $productoId = (is_object($combo) ? $combo->producto_id : $combo['producto_id'] ?? null) ?? null;
            $productoNombre = (is_object($combo)
                ? ($combo->producto?->nombre ?? 'N/A')
                : ($combo['producto_nombre'] ?? $combo['nombre'] ?? 'N/A'));
            $cantidad = (is_object($combo) ? $combo->cantidad : $combo['cantidad'] ?? 0) ?? 0;
            $esObligatorio = (is_object($combo) ? $combo->es_obligatorio : $combo['es_obligatorio'] ?? false) ?? false;

            return [
                'id' => $id,
                'producto_id' => $productoId,
                'producto_nombre' => $productoNombre,
                'cantidad' => (int) $cantidad,
                'es_obligatorio' => (bool) $esObligatorio,
                'incluido' => true, // ✅ CRÍTICO: Marcar como incluido por defecto
            ];
        })->toArray();
    }

    /**
     * Extraer la hora en formato HH:mm de un campo que puede ser:
     * - Null
     * - Una hora simple (HH:mm:ss)
     * - Un timestamp completo (YYYY-MM-DD HH:mm:ss)
     * - Un objeto Carbon
     */
    private static function extractTimeFromField($value): ?string
    {
        if (!$value) {
            return null;
        }

        // Si es una cadena de texto
        if (is_string($value)) {
            // Si contiene espacio, es un timestamp completo (YYYY-MM-DD HH:mm:ss)
            if (str_contains($value, ' ')) {
                return substr($value, 11, 5); // Extrae HH:mm
            }
            // Si no contiene espacio, es una hora simple (HH:mm:ss)
            return substr($value, 0, 5); // Extrae HH:mm
        }

        // Si es un objeto Carbon o DateTime
        if (method_exists($value, 'format')) {
            return $value->format('H:i');
        }

        return null;
    }
}

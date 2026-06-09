<?php

/**
 * EJEMPLOS DE USO - MovimientoStockService
 *
 * Este archivo muestra cómo usar los servicios en los controladores
 * IMPORTANTE: Esto REEMPLAZA las llamadas manuales a registrarMovimientoAgrupado
 */

// ==================== EJEMPLO 1: Reserva en Proforma ====================
// En ApiProformaController::store()

use App\Services\Stock\MovimientoStockService;

class ApiProformaControllerExample
{
    public function __construct(
        private MovimientoStockService $movimientoService,
    ) {}

    public function store(Request $request)
    {
        // ... validaciones ...

        $proforma = Proforma::create($proformaData);

        // Para cada producto en la proforma
        foreach ($detalles as $detalle) {
            $stockProductoId = $detalle['stock_producto_id'];
            $cantidadAReservar = $detalle['cantidad'];

            // ✅ NUEVO: Una sola llamada que hace TODO (validar, registrar movimiento, actualizar stock)
            try {
                $this->movimientoService->registrarMovimientoYActualizar(
                    stockProductoId: $stockProductoId,
                    cantidad: -$cantidadAReservar,  // Negativo para reservar
                    tipo: MovimientoInventario::TIPO_RESERVA_PROFORMA,
                    referencia_tipo: 'proforma',
                    referencia_id: $proforma->id,
                    metadataAdicional: [
                        'lote' => $detalle['lote'],
                        'vencimiento' => $detalle['vencimiento'],
                        'precio_unitario' => $detalle['precio_unitario'],
                    ]
                );
            } catch (InvalidArgumentException $e) {
                // Si no hay stock suficiente, rechazar todo (transacción rollback automático)
                return response()->json(['error' => $e->getMessage()], 422);
            }
        }

        return response()->json($proforma, 201);
    }
}

// ==================== EJEMPLO 2: Validar disponibilidad ANTES de crear ====================

public function validarStockAntes(int $stockProductoId, int $cantidad): bool
{
    // Usar este método para validaciones previas (ej: en JS antes de enviar)
    return $this->movimientoService->validarDisponibilidad(
        stockProductoId: $stockProductoId,
        cantidad: -$cantidad,
        tipo: MovimientoInventario::TIPO_RESERVA_PROFORMA
    );
}

// ==================== EJEMPLO 3: Venta Directa ====================
// En VentaController::store() - para ventas que NO reservan stock

public function crearVentaDirecta(Request $request)
{
    $venta = Venta::create($ventaData);

    foreach ($detalles as $detalle) {
        // Para venta directa: reduce TOTAL y DISPONIBLE
        $this->movimientoService->registrarMovimientoYActualizar(
            stockProductoId: $detalle['stock_producto_id'],
            cantidad: -$detalle['cantidad'],  // Negativo (sale del inventario)
            tipo: MovimientoInventario::TIPO_VENTA_DIRECTA,  // ← Tipo diferente
            referencia_tipo: 'venta',
            referencia_id: $venta->id,
        );
    }
}

// ==================== EJEMPLO 4: Venta por Consumo ====================
// En ConsumoController::store() - para consumo de stock reservado

public function consumirStockReservado(Request $request)
{
    $consumo = StockConsumo::create($consumoData);

    foreach ($detalles as $detalle) {
        // Para consumo: reduce TOTAL y RESERVADO (disponible no cambia)
        $this->movimientoService->registrarMovimientoYActualizar(
            stockProductoId: $detalle['stock_producto_id'],
            cantidad: -$detalle['cantidad'],
            tipo: MovimientoInventario::TIPO_VENTA_CONSUMO,  // ← Tipo diferente
            referencia_tipo: 'consumo',
            referencia_id: $consumo->id,
        );
    }
}

// ==================== EJEMPLO 5: Liberar Reserva ====================
// En ProformaController::destroy() - cuando se cancela una proforma

public function cancelarProforma(Proforma $proforma)
{
    foreach ($proforma->detalles as $detalle) {
        // Para liberar: aumenta DISPONIBLE, reduce RESERVADO (total no cambia)
        $this->movimientoService->registrarMovimientoYActualizar(
            stockProductoId: $detalle->stock_producto_id,
            cantidad: $detalle->cantidad,  // ← Positivo para liberar
            tipo: MovimientoInventario::TIPO_LIBERACION_RESERVA,
            referencia_tipo: 'proforma_cancelada',
            referencia_id: $proforma->id,
        );
    }

    $proforma->delete();
}

// ==================== EJEMPLO 6: Obtener Estado Actual ====================

public function obtenerEstadoStock(int $stockProductoId)
{
    $estado = $this->movimientoService->obtenerEstadoActual($stockProductoId);

    return response()->json([
        'estado_actual' => $estado,
        'historial' => $this->movimientoService->obtenerHistorial($stockProductoId, limit: 20),
    ]);
}

// ==================== DIFERENCIAS IMPORTANTES ====================
/*
❌ ANTES (inconsistente):
- Registrar movimiento en MovimientoInventario manualmente
- Actualizar stock_productos en otro lugar
- Riesgo de que se registre un movimiento pero no se actualice el stock

✅ AHORA (consistente):
- Una sola llamada a registrarMovimientoYActualizar()
- Movimiento y stock se actualizan JUNTOS en una transacción
- Si hay error, TODO hace rollback (movimiento + stock)
- Imposible tener inconsistencia

TIPOS DE MOVIMIENTO (IMPORTANTE):
├── TIPO_RESERVA_PROFORMA
│   └─ Reduce: cantidad_disponible
│   └─ Aumenta: cantidad_reservada
│   └─ Total: NO CAMBIA
│
├── TIPO_LIBERACION_RESERVA
│   └─ Aumenta: cantidad_disponible
│   └─ Reduce: cantidad_reservada
│   └─ Total: NO CAMBIA
│
├── TIPO_VENTA_DIRECTA
│   └─ Reduce: cantidad_total y cantidad_disponible
│   └─ Reservado: NO CAMBIA
│
└── TIPO_VENTA_CONSUMO
    └─ Reduce: cantidad_total y cantidad_reservada
    └─ Disponible: NO CAMBIA
*/

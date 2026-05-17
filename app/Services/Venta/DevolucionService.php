<?php

namespace App\Services\Venta;

use App\DTOs\Venta\CrearDevolucionDTO;
use App\Models\DetalleDevolucion;
use App\Models\DetalleCambio;
use App\Models\Devolucion;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Models\Venta;
use App\Services\Stock\StockService;
use App\Services\Traits\LogsOperations;
use App\Services\Traits\ManagesTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * DevolucionService - Lógica de negocio para Devoluciones
 *
 * RESPONSABILIDADES:
 * ✓ Crear devoluciones (parciales o totales)
 * ✓ Crear cambios de productos
 * ✓ Procesar reembolsos en caja
 * ✓ Coordinar con StockService para devolver/restar stock
 *
 * FLUJO:
 * 1. Validar datos
 * 2. Dentro de transacción:
 *    a. Crear Devolucion
 *    b. Crear DetalleDevolucion[] y devolver stock
 *    c. Si CAMBIO: Crear DetalleCambio[] y restar stock
 *    d. Registrar movimientos de caja
 */
class DevolucionService
{
    use ManagesTransactions, LogsOperations;

    public function __construct(
        private StockService $stockService,
    ) {}

    /**
     * Crear una devolución o cambio
     *
     * @param CrearDevolucionDTO $dto
     * @param int|null $cajaId
     * @return Devolucion
     */
    public function crear(CrearDevolucionDTO $dto, ?int $cajaId = null): Devolucion
    {
        Log::info('🔄 [DevolucionService::crear] Iniciando creación de devolución', [
            'tipo' => $dto->tipo,
            'venta_id' => $dto->venta_id,
            'cliente_id' => $dto->cliente_id,
            'detalles_count' => count($dto->detalles),
            'detalles_cambio_count' => $dto->detalles_cambio ? count($dto->detalles_cambio) : 0,
        ]);

        return $this->transaction(function () use ($dto, $cajaId) {
            // Obtener la venta
            $venta = Venta::findOrFail($dto->venta_id);
            $almacenId = auth()->user()?->empresa?->almacen_id ?? 1;

            // Calcular montos
            $subtotalDevuelto = collect($dto->detalles)
                ->sum(fn($det) => ($det['cantidad_devuelta'] ?? 0) * ($det['precio_unitario'] ?? 0));

            $subtotalCambio = 0;
            if ($dto->tipo === 'CAMBIO' && !empty($dto->detalles_cambio)) {
                $subtotalCambio = collect($dto->detalles_cambio)
                    ->sum(fn($det) => ($det['cantidad'] ?? 0) * ($det['precio_unitario'] ?? 0));
            }

            $diferencia = $subtotalCambio - $subtotalDevuelto;
            $totalDevuelto = $subtotalDevuelto; // Monto que se devuelve al cliente

            // Crear la devolución
            $devolucion = Devolucion::create([
                'numero' => Devolucion::generarNumero(),
                'fecha' => now()->toDateString(),
                'tipo' => $dto->tipo,
                'venta_id' => $dto->venta_id,
                'cliente_id' => $dto->cliente_id,
                'usuario_id' => Auth::id(),
                'caja_id' => $cajaId,
                'motivo' => $dto->motivo,
                'subtotal_devuelto' => $subtotalDevuelto,
                'total_devuelto' => $totalDevuelto,
                'tipo_reembolso' => $dto->tipo_reembolso,
                'monto_reembolso' => 0, // Se actualiza después
                'subtotal_cambio' => $dto->tipo === 'CAMBIO' ? $subtotalCambio : null,
                'diferencia' => $dto->tipo === 'CAMBIO' ? $diferencia : null,
                'observaciones' => $dto->observaciones,
            ]);

            Log::info('✅ [DevolucionService::crear] Devolucion creada', [
                'devolucion_id' => $devolucion->id,
                'numero' => $devolucion->numero,
            ]);

            // Crear detalles de devolución y devolver stock
            $productosADevolver = [];
            foreach ($dto->detalles as $detalle) {
                DetalleDevolucion::create([
                    'devolucion_id' => $devolucion->id,
                    'detalle_venta_id' => $detalle['detalle_venta_id'],
                    'producto_id' => $detalle['producto_id'],
                    'cantidad_devuelta' => $detalle['cantidad_devuelta'],
                    'precio_unitario' => $detalle['precio_unitario'],
                    'subtotal' => $detalle['cantidad_devuelta'] * $detalle['precio_unitario'],
                ]);

                $productosADevolver[] = [
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad_devuelta'],
                ];
            }

            // Devolver stock
            $this->stockService->devolverStock(
                $productosADevolver,
                $devolucion->numero,
                $almacenId
            );

            Log::info('✅ [DevolucionService::crear] Stock devuelto', [
                'devolucion_numero' => $devolucion->numero,
                'productos_count' => count($productosADevolver),
            ]);

            // Si es CAMBIO, procesar productos nuevos
            if ($dto->tipo === 'CAMBIO' && !empty($dto->detalles_cambio)) {
                $productosARestar = [];
                foreach ($dto->detalles_cambio as $cambio) {
                    DetalleCambio::create([
                        'devolucion_id' => $devolucion->id,
                        'producto_id' => $cambio['producto_id'],
                        'cantidad' => $cambio['cantidad'],
                        'precio_unitario' => $cambio['precio_unitario'],
                        'subtotal' => $cambio['cantidad'] * $cambio['precio_unitario'],
                    ]);

                    $productosARestar[] = [
                        'producto_id' => $cambio['producto_id'],
                        'cantidad' => $cambio['cantidad'],
                    ];
                }

                // Consumir stock de productos nuevos
                $this->stockService->procesarSalidaVenta(
                    $productosARestar,
                    $devolucion->numero . '-CAMBIO',
                    $almacenId
                );

                Log::info('✅ [DevolucionService::crear] Stock consumido para cambio', [
                    'devolucion_numero' => $devolucion->numero,
                    'productos_count' => count($productosARestar),
                ]);
            }

            // Procesar movimientos de caja
            $monto_reembolso = 0;

            if ($dto->tipo === 'CAMBIO') {
                // Para CAMBIO, hay 3 escenarios:
                // 1. diferencia > 0: Cliente debe pagar más (monto positivo en caja)
                // 2. diferencia < 0: Se devuelve al cliente (monto negativo si EFECTIVO)
                // 3. diferencia = 0: No hay movimiento

                if ($diferencia > 0) {
                    // Cliente paga la diferencia
                    $this->registrarMovimientoCaja(
                        $devolucion,
                        $diferencia,
                        'VENTA',
                        'Diferencia a pagar en cambio ' . $devolucion->numero,
                        $cajaId,
                        $dto->tipo_pago_id
                    );
                } elseif ($diferencia < 0) {
                    // Se devuelve al cliente
                    $monto_reembolso = abs($diferencia);
                    if ($dto->tipo_reembolso === 'EFECTIVO') {
                        $this->registrarMovimientoCaja(
                            $devolucion,
                            -$monto_reembolso,
                            'DEVOLUCION',
                            'Devolución de diferencia en cambio ' . $devolucion->numero,
                            $cajaId,
                            $dto->tipo_pago_id
                        );
                    }
                    // Si es CREDITO, no se registra movimiento de caja
                }
            } else {
                // Para DEVOLUCION pura, se devuelve el monto si es en EFECTIVO
                $monto_reembolso = $totalDevuelto;
                if ($dto->tipo_reembolso === 'EFECTIVO') {
                    $this->registrarMovimientoCaja(
                        $devolucion,
                        -$monto_reembolso,
                        'DEVOLUCION',
                        'Devolución ' . $devolucion->numero,
                        $cajaId,
                        $dto->tipo_pago_id
                    );
                }
                // Si es CREDITO, se acumula a la cuenta por cobrar
            }

            // Actualizar monto_reembolso en la devolución
            $devolucion->update(['monto_reembolso' => $monto_reembolso]);

            Log::info('✅ [DevolucionService::crear] Devolucion completada', [
                'devolucion_id' => $devolucion->id,
                'devolucion_numero' => $devolucion->numero,
                'tipo' => $devolucion->tipo,
                'monto_reembolso' => $monto_reembolso,
            ]);

            return $devolucion->load(['detalles', 'detallesCambio', 'venta', 'cliente', 'usuario']);
        });
    }

    /**
     * Registrar un movimiento de caja para la devolución
     *
     * @param Devolucion $devolucion
     * @param float $monto
     * @param string $tipoOperacion (VENTA | DEVOLUCION)
     * @param string $observaciones
     * @param int|null $cajaId
     */
    private function registrarMovimientoCaja(
        Devolucion $devolucion,
        float $monto,
        string $tipoOperacion,
        string $observaciones,
        ?int $cajaId = null,
        ?int $tipoPagoId = null
    ): void {
        // Obtener o buscar el tipo de operación
        $tipo = TipoOperacionCaja::where('codigo', $tipoOperacion)->first();

        if (!$tipo) {
            Log::warning("⚠️ [DevolucionService] Tipo de operación '{$tipoOperacion}' no encontrado");
            return;
        }

        // ✅ El middleware CheckCajaAbierta garantiza que hay caja_id válido
        if (!$cajaId) {
            Log::error('❌ [DevolucionService] No hay caja_id - El middleware debería haberlo validado', [
                'tipo_operacion' => $tipoOperacion,
                'user_id' => Auth::id(),
            ]);
            return;
        }

        MovimientoCaja::create([
            'caja_id' => $cajaId,
            'user_id' => Auth::id(),
            'fecha' => now(),
            'monto' => $monto,
            'observaciones' => $observaciones,
            'numero_documento' => $devolucion->numero,
            'tipo_operacion_id' => $tipo->id,
            'tipo_pago_id' => $tipoPagoId,
        ]);

        Log::info('✅ [DevolucionService] Movimiento de caja registrado', [
            'devolucion_numero' => $devolucion->numero,
            'tipo_operacion' => $tipoOperacion,
            'monto' => $monto,
            'caja_id' => $cajaId,
        ]);
    }
}

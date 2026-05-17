<?php

namespace App\Services;

use App\Models\CompraPrestable;
use App\Models\CompraPrestableDetalle;
use App\Models\PrestableStock;
use App\Models\MovimientoPrestable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CompraPrestableService
{
    public function __construct(
        private MovimientoPrestableService $movimientoService,
    ) {}

    /**
     * Crear una nueva compra de prestables
     */
    public function crearCompra(array $data): CompraPrestable
    {
        try {
            // Generar número de compra único
            $numeroCompra = $this->generarNumeroCompra();

            $compra = CompraPrestable::create([
                'numero_compra' => $numeroCompra,
                'proveedor_id' => $data['proveedor_id'] ?? null,
                'usuario_id' => $data['usuario_id'] ?? auth()->id(),
                'estado' => 'BORRADOR',
                'observaciones' => $data['observaciones'] ?? null,
                'ip_usuario' => $data['ip_usuario'] ?? request()?->ip(),
                'user_agent' => $data['user_agent'] ?? request()?->userAgent(),
            ]);

            Log::info('✅ Compra de prestables creada', [
                'compra_id' => $compra->id,
                'numero_compra' => $numeroCompra,
            ]);

            return $compra;
        } catch (\Exception $e) {
            Log::error('❌ Error creando compra de prestables', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Agregar detalle a una compra
     */
    public function agregarDetalle(
        CompraPrestable $compra,
        int $prestableId,
        int $almacenId,
        int $cantidad,
        float $precioUnitario = 0,
        ?string $observaciones = null,
    ): CompraPrestableDetalle {
        try {
            // Verificar que el prestable existe
            $prestable = \App\Models\Prestable::findOrFail($prestableId);

            $subtotal = $cantidad * $precioUnitario;

            $detalle = CompraPrestableDetalle::create([
                'compra_prestable_id' => $compra->id,
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'cantidad' => $cantidad,
                'precio_unitario' => $precioUnitario,
                'subtotal' => $subtotal,
                'observaciones' => $observaciones,
            ]);

            // Actualizar totales de la compra
            $this->actualizarTotales($compra);

            Log::info('✅ Detalle agregado a compra', [
                'compra_id' => $compra->id,
                'prestable_id' => $prestableId,
                'cantidad' => $cantidad,
            ]);

            return $detalle;
        } catch (\Exception $e) {
            Log::error('❌ Error agregando detalle a compra', [
                'compra_id' => $compra->id,
                'prestable_id' => $prestableId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Confirmar la compra (actualiza stock y registra movimientos)
     */
    public function confirmarCompra(CompraPrestable $compra): CompraPrestable
    {
        return DB::transaction(function () use ($compra) {
            try {
                // Validar que tenga detalles
                if ($compra->detalles()->count() === 0) {
                    throw new \Exception('La compra debe tener al menos un detalle');
                }

                // Procesar cada detalle
                foreach ($compra->detalles as $detalle) {
                    $this->procesarDetalleCompra($compra, $detalle);
                }

                // Confirmar la compra
                $compra->confirmar();

                Log::info('✅ Compra de prestables confirmada', [
                    'compra_id' => $compra->id,
                    'numero_compra' => $compra->numero_compra,
                    'cantidad_total' => $compra->cantidad_total,
                ]);

                return $compra;
            } catch (\Exception $e) {
                Log::error('❌ Error confirmando compra', [
                    'compra_id' => $compra->id,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }
        });
    }

    /**
     * Procesar un detalle de compra
     */
    private function procesarDetalleCompra(CompraPrestable $compra, CompraPrestableDetalle $detalle): void
    {
        // Obtener o crear stock para el almacén
        $stock = PrestableStock::firstOrCreate(
            [
                'prestable_id' => $detalle->prestable_id,
                'almacenes_prestables_id' => $detalle->almacenes_prestables_id,
            ],
            [
                'cantidad_disponible' => 0,
                'cantidad_prestamo_cliente_activo' => 0,
                'cantidad_prestamo_cliente_devuelto' => 0,
                'cantidad_prestamo_evento_activo' => 0,
                'cantidad_prestamo_evento_devuelto' => 0,
                'cantidad_prestamo_proveedor_activo' => 0,
                'cantidad_prestamo_proveedor_devuelto' => 0,
            ]
        );

        $stockAntes = $this->snapshotStock($stock);

        // Actualizar stock (agregar a disponible)
        $disponibleDespues = $stockAntes['cantidad_disponible'] + $detalle->cantidad;
        $stock->update([
            'cantidad_disponible' => $disponibleDespues,
        ]);
        $stock->refresh();
        $stockDespues = $this->snapshotStock($stock);

        // Registrar movimiento con tipo específico de compra
        $this->movimientoService->registrarMovimiento([
            'prestable_stock_id' => $stock->id,
            'almacenes_prestables_id' => $detalle->almacenes_prestables_id,
            'usuario_id' => $compra->usuario_id,
            'tipo' => 'COMPRA_PRESTABLE',
            'cantidad' => $detalle->cantidad,
            'disponible_anterior' => $stockAntes['cantidad_disponible'],
            'prestamo_cliente_anterior' => $stockAntes['cantidad_prestamo_cliente_activo'],
            'prestamo_proveedor_anterior' => $stockAntes['cantidad_prestamo_proveedor_activo'],
            'vendida_anterior' => 0,
            'disponible_posterior' => $stockDespues['cantidad_disponible'],
            'prestamo_cliente_posterior' => $stockDespues['cantidad_prestamo_cliente_activo'],
            'prestamo_proveedor_posterior' => $stockDespues['cantidad_prestamo_proveedor_activo'],
            'vendida_posterior' => 0,
            'categoria_afectada' => 'disponible',
            'motivo' => 'Compra de prestable',
            'observaciones' => json_encode([
                'operacion' => 'COMPRA_PRESTABLE',
                'stock_antes' => $stockAntes,
                'stock_despues' => $stockDespues,
            ], JSON_UNESCAPED_UNICODE),
            'numero_referencia' => $compra->numero_compra,
            'referencia_tipo' => 'COMPRA_PRESTABLE',
            'referencia_id' => $compra->id,
        ]);

        Log::info('📥 Movimiento registrado para compra', [
            'compra_id' => $compra->id,
            'prestable_id' => $detalle->prestable_id,
            'cantidad' => $detalle->cantidad,
            'stock_antes' => $stockAntes,
            'stock_despues' => $stockDespues,
        ]);
    }

    /**
     * Cancelar una compra (revierte stock y movimientos)
     */
    public function cancelarCompra(CompraPrestable $compra, string $motivo): CompraPrestable
    {
        return DB::transaction(function () use ($compra, $motivo) {
            try {
                // Revertir cada detalle
                foreach ($compra->detalles as $detalle) {
                    $this->revertirDetalleCompra($compra, $detalle);
                }

                // Cancelar la compra
                $compra->cancelar($motivo);

                // Marcar movimientos como anulados
                MovimientoPrestable::where('referencia_tipo', 'COMPRA_PRESTABLE')
                    ->where('referencia_id', $compra->id)
                    ->update([
                        'anulado' => true,
                        'motivo_anulacion' => "Compra cancelada: $motivo",
                        'fecha_anulacion' => now(),
                    ]);

                Log::info('⛔ Compra de prestables cancelada', [
                    'compra_id' => $compra->id,
                    'numero_compra' => $compra->numero_compra,
                    'motivo' => $motivo,
                ]);

                return $compra;
            } catch (\Exception $e) {
                Log::error('❌ Error cancelando compra', [
                    'compra_id' => $compra->id,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }
        });
    }

    /**
     * Revertir un detalle de compra
     */
    private function revertirDetalleCompra(CompraPrestable $compra, CompraPrestableDetalle $detalle): void
    {
        $stock = PrestableStock::where('prestable_id', $detalle->prestable_id)
            ->where('almacenes_prestables_id', $detalle->almacenes_prestables_id)
            ->firstOrFail();

        $stockAntes = $this->snapshotStock($stock);

        // Restaurar cantidad disponible (revertir la compra)
        $disponibleDespues = $stockAntes['cantidad_disponible'] - $detalle->cantidad;

        $stock->update([
            'cantidad_disponible' => $disponibleDespues,
        ]);
        $stock->refresh();
        $stockDespues = $this->snapshotStock($stock);

        // Registrar movimiento de anulación con tipo específico
        $this->movimientoService->registrarMovimiento([
            'prestable_stock_id' => $stock->id,
            'almacenes_prestables_id' => $detalle->almacenes_prestables_id,
            'usuario_id' => $compra->usuario_id,
            'tipo' => 'ANULACION_COMPRA_PRESTABLE',
            'cantidad' => -$detalle->cantidad, // Negativa = reversión del incremento de compra
            'disponible_anterior' => $stockAntes['cantidad_disponible'],
            'prestamo_cliente_anterior' => $stockAntes['cantidad_prestamo_cliente_activo'],
            'prestamo_proveedor_anterior' => $stockAntes['cantidad_prestamo_proveedor_activo'],
            'vendida_anterior' => 0,
            'disponible_posterior' => $stockDespues['cantidad_disponible'],
            'prestamo_cliente_posterior' => $stockDespues['cantidad_prestamo_cliente_activo'],
            'prestamo_proveedor_posterior' => $stockDespues['cantidad_prestamo_proveedor_activo'],
            'vendida_posterior' => 0,
            'categoria_afectada' => 'disponible',
            'motivo' => 'Anulación de compra de prestable',
            'observaciones' => json_encode([
                'operacion' => 'ANULACION_COMPRA_PRESTABLE',
                'stock_antes' => $stockAntes,
                'stock_despues' => $stockDespues,
            ], JSON_UNESCAPED_UNICODE),
            'numero_referencia' => $compra->numero_compra,
            'referencia_tipo' => 'ANULACION_COMPRA_PRESTABLE',
            'referencia_id' => $compra->id,
        ]);

        Log::info('🔄 Stock y movimiento registrado por cancelación de compra', [
            'compra_id' => $compra->id,
            'prestable_id' => $detalle->prestable_id,
            'cantidad' => $detalle->cantidad,
            'stock_antes' => $stockAntes,
            'stock_despues' => $stockDespues,
        ]);
    }

    /**
     * Snapshot consistente del estado de stock para trazabilidad de movimientos.
     */
    private function snapshotStock(PrestableStock $stock): array
    {
        return [
            'cantidad_disponible' => (int) ($stock->cantidad_disponible ?? 0),
            'cantidad_prestamo_cliente_activo' => (int) ($stock->cantidad_prestamo_cliente_activo ?? 0),
            'cantidad_prestamo_cliente_devuelto' => (int) ($stock->cantidad_prestamo_cliente_devuelto ?? 0),
            'cantidad_prestamo_evento_activo' => (int) ($stock->cantidad_prestamo_evento_activo ?? 0),
            'cantidad_prestamo_evento_devuelto' => (int) ($stock->cantidad_prestamo_evento_devuelto ?? 0),
            'cantidad_prestamo_proveedor_activo' => (int) ($stock->cantidad_prestamo_proveedor_activo ?? 0),
            'cantidad_prestamo_proveedor_devuelto' => (int) ($stock->cantidad_prestamo_proveedor_devuelto ?? 0),
            'total_general' => (int) $stock->getTotalGeneralAttribute(),
        ];
    }

    /**
     * Actualizar totales de la compra (sin IVA)
     */
    private function actualizarTotales(CompraPrestable $compra): void
    {
        $subtotal = $compra->detalles()->sum('subtotal');
        $total = $subtotal; // Sin IVA

        $compra->update([
            'subtotal' => $subtotal,
            'iva' => 0,
            'total' => $total,
        ]);
    }

    /**
     * Generar número de compra único
     */
    private function generarNumeroCompra(): string
    {
        $anio = date('Y');
        $ultimaCompra = CompraPrestable::whereYear('created_at', $anio)
            ->orderBy('id', 'desc')
            ->first();

        $numero = ($ultimaCompra ? (int) substr($ultimaCompra->numero_compra, -5) + 1 : 1);
        return sprintf('CP-%s-%05d', $anio, $numero);
    }
}

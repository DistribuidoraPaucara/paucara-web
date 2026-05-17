<?php

namespace App\Services;

use App\Models\PrestamoVendido;
use App\Models\PrestamoVendidoDetalle;
use App\Models\PrestableStock;
use App\Models\MovimientoPrestable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PrestamoVendidoService
{
    public function __construct(
        private MovimientoPrestableService $movimientoService,
    ) {}

    /**
     * Crear una nueva venta de prestables
     */
    public function crearVenta(array $data): PrestamoVendido
    {
        try {
            // Generar número de venta único
            $numeroVenta = $this->generarNumeroVenta();

            $venta = PrestamoVendido::create([
                'numero_venta' => $numeroVenta,
                'cliente_id' => $data['cliente_id'] ?? null,
                'usuario_id' => $data['usuario_id'] ?? auth()->id(),
                'estado' => 'BORRADOR',
                'observaciones' => $data['observaciones'] ?? null,
                'ip_usuario' => $data['ip_usuario'] ?? request()?->ip(),
                'user_agent' => $data['user_agent'] ?? request()?->userAgent(),
            ]);

            Log::info('✅ Venta de prestables creada', [
                'venta_id' => $venta->id,
                'numero_venta' => $numeroVenta,
            ]);

            return $venta;
        } catch (\Exception $e) {
            Log::error('❌ Error creando venta de prestables', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Agregar detalle a una venta
     */
    public function agregarDetalle(
        PrestamoVendido $venta,
        int $prestableId,
        int $almacenId,
        int $cantidad,
        float $precioUnitario = 0,
        ?string $observaciones = null,
    ): PrestamoVendidoDetalle {
        try {
            // Verificar que existe stock disponible
            $stock = PrestableStock::where('prestable_id', $prestableId)
                ->where('almacenes_prestables_id', $almacenId)
                ->firstOrFail();

            if ($stock->cantidad_disponible < $cantidad) {
                throw new \Exception(
                    "Stock insuficiente. Disponible: {$stock->cantidad_disponible}, Solicitado: $cantidad"
                );
            }

            $subtotal = $cantidad * $precioUnitario;

            $detalle = PrestamoVendidoDetalle::create([
                'prestamo_vendido_id' => $venta->id,
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'cantidad' => $cantidad,
                'precio_unitario' => $precioUnitario,
                'subtotal' => $subtotal,
                'observaciones' => $observaciones,
            ]);

            // Actualizar totales de la venta
            $this->actualizarTotales($venta);

            Log::info('✅ Detalle agregado a venta', [
                'venta_id' => $venta->id,
                'prestable_id' => $prestableId,
                'cantidad' => $cantidad,
            ]);

            return $detalle;
        } catch (\Exception $e) {
            Log::error('❌ Error agregando detalle a venta', [
                'venta_id' => $venta->id,
                'prestable_id' => $prestableId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Confirmar la venta (actualiza stock y registra movimientos)
     */
    public function confirmarVenta(PrestamoVendido $venta): PrestamoVendido
    {
        return DB::transaction(function () use ($venta) {
            try {
                // Validar que tenga detalles
                if ($venta->detalles()->count() === 0) {
                    throw new \Exception('La venta debe tener al menos un detalle');
                }

                // Procesar cada detalle
                foreach ($venta->detalles as $detalle) {
                    $this->procesarDetalleVenta($venta, $detalle);
                }

                // Confirmar la venta
                $venta->confirmar();

                Log::info('✅ Venta de prestables confirmada', [
                    'venta_id' => $venta->id,
                    'numero_venta' => $venta->numero_venta,
                    'cantidad_total' => $venta->cantidad_total,
                ]);

                return $venta;
            } catch (\Exception $e) {
                Log::error('❌ Error confirmando venta', [
                    'venta_id' => $venta->id,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }
        });
    }

    /**
     * Procesar un detalle de venta
     */
    private function procesarDetalleVenta(PrestamoVendido $venta, PrestamoVendidoDetalle $detalle): void
    {
        // Obtener stock actual
        $stock = PrestableStock::where('prestable_id', $detalle->prestable_id)
            ->where('almacenes_prestables_id', $detalle->almacenes_prestables_id)
            ->firstOrFail();

        // Verificar stock disponible
        if ($stock->cantidad_disponible < $detalle->cantidad) {
            throw new \Exception(
                "Stock insuficiente para {$stock->prestable->nombre} en {$stock->almacenPrestable->nombre}"
            );
        }

        // Valores antes
        $disponibleAntes = $stock->cantidad_disponible;
        $prestamoClienteAntes = $stock->cantidad_en_prestamo_cliente;
        $prestamoProveedorAntes = $stock->cantidad_que_debo_devolver;

        // Actualizar stock (restar de disponible)
        $disponibleDespues = $disponibleAntes - $detalle->cantidad;
        $stock->update([
            'cantidad_disponible' => $disponibleDespues,
        ]);

        // Registrar movimiento
        $this->movimientoService->registrarMovimiento([
            'prestable_stock_id' => $stock->id,
            'almacenes_prestables_id' => $detalle->almacenes_prestables_id,
            'usuario_id' => $venta->usuario_id,
            'tipo' => 'VENTA_PRESTABLE',
            'cantidad' => -$detalle->cantidad,
            'disponible_anterior' => $disponibleAntes,
            'prestamo_cliente_anterior' => $prestamoClienteAntes,
            'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
            'vendida_anterior' => 0,
            'disponible_posterior' => $disponibleDespues,
            'prestamo_cliente_posterior' => $prestamoClienteAntes,
            'prestamo_proveedor_posterior' => $prestamoProveedorAntes,
            'vendida_posterior' => 0,
            'categoria_afectada' => 'disponible',
            'motivo' => 'Venta de prestable',
            'numero_referencia' => $venta->numero_venta,
            'referencia_tipo' => 'VENTA_PRESTABLE',
            'referencia_id' => $venta->id,
        ]);

        Log::info('📤 Movimiento registrado para venta', [
            'venta_id' => $venta->id,
            'prestable_id' => $detalle->prestable_id,
            'cantidad' => $detalle->cantidad,
        ]);
    }

    /**
     * Cancelar una venta (revierte stock y movimientos)
     */
    public function cancelarVenta(PrestamoVendido $venta, string $motivo): PrestamoVendido
    {
        return DB::transaction(function () use ($venta, $motivo) {
            try {
                // Revertir cada detalle
                foreach ($venta->detalles as $detalle) {
                    $this->revertirDetalleVenta($venta, $detalle);
                }

                // Cancelar la venta
                $venta->cancelar($motivo);

                // Marcar movimientos como anulados
                MovimientoPrestable::where('referencia_tipo', 'VENTA_PRESTABLE')
                    ->where('referencia_id', $venta->id)
                    ->update([
                        'anulado' => true,
                        'motivo_anulacion' => "Venta cancelada: $motivo",
                        'fecha_anulacion' => now(),
                    ]);

                Log::info('⛔ Venta de prestables cancelada', [
                    'venta_id' => $venta->id,
                    'numero_venta' => $venta->numero_venta,
                    'motivo' => $motivo,
                ]);

                return $venta;
            } catch (\Exception $e) {
                Log::error('❌ Error cancelando venta', [
                    'venta_id' => $venta->id,
                    'error' => $e->getMessage(),
                ]);
                throw $e;
            }
        });
    }

    /**
     * Revertir un detalle de venta
     */
    private function revertirDetalleVenta(PrestamoVendido $venta, PrestamoVendidoDetalle $detalle): void
    {
        $stock = PrestableStock::where('prestable_id', $detalle->prestable_id)
            ->where('almacenes_prestables_id', $detalle->almacenes_prestables_id)
            ->firstOrFail();

        // Capturar valores antes de la reversión
        $disponibleAntes = $stock->cantidad_disponible;
        $prestamoClienteAntes = $stock->cantidad_en_prestamo_cliente;
        $prestamoProveedorAntes = $stock->cantidad_que_debo_devolver;

        // Restaurar cantidad disponible (revertir la venta)
        $disponibleDespues = $disponibleAntes + $detalle->cantidad;

        $stock->update([
            'cantidad_disponible' => $disponibleDespues,
        ]);

        // Registrar movimiento de anulación (cantidad positiva porque revierte la resta de venta)
        $this->movimientoService->registrarMovimiento([
            'prestable_stock_id' => $stock->id,
            'almacenes_prestables_id' => $detalle->almacenes_prestables_id,
            'usuario_id' => $venta->usuario_id,
            'tipo' => 'ANULACION_VENTA_PRESTABLE',
            'cantidad' => $detalle->cantidad, // Positiva = revierte el decremento de venta
            'disponible_anterior' => $disponibleAntes,
            'prestamo_cliente_anterior' => $prestamoClienteAntes,
            'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
            'vendida_anterior' => 0,
            'disponible_posterior' => $disponibleDespues,
            'prestamo_cliente_posterior' => $prestamoClienteAntes,
            'prestamo_proveedor_posterior' => $prestamoProveedorAntes,
            'vendida_posterior' => 0,
            'categoria_afectada' => 'disponible',
            'motivo' => 'Anulación de venta de prestable',
            'numero_referencia' => $venta->numero_venta,
            'referencia_tipo' => 'ANULACION_VENTA_PRESTABLE',
            'referencia_id' => $venta->id,
        ]);

        Log::info('🔄 Stock y movimiento registrado por cancelación de venta', [
            'venta_id' => $venta->id,
            'prestable_id' => $detalle->prestable_id,
            'cantidad' => $detalle->cantidad,
            'disponible_antes' => $disponibleAntes,
            'disponible_despues' => $disponibleDespues,
        ]);
    }

    /**
     * Actualizar totales de la venta (sin IVA)
     */
    private function actualizarTotales(PrestamoVendido $venta): void
    {
        $subtotal = $venta->detalles()->sum('subtotal');
        $total = $subtotal; // Sin IVA

        $venta->update([
            'subtotal' => $subtotal,
            'iva' => 0,
            'total' => $total,
        ]);
    }

    /**
     * Generar número de venta único
     */
    private function generarNumeroVenta(): string
    {
        $anio = date('Y');
        $ultimaVenta = PrestamoVendido::whereYear('created_at', $anio)
            ->orderBy('id', 'desc')
            ->first();

        $numero = ($ultimaVenta ? (int) substr($ultimaVenta->numero_venta, -5) + 1 : 1);
        return sprintf('PV-%s-%05d', $anio, $numero);
    }
}

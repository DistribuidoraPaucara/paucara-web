<?php

namespace App\Services\Prestamos;

use App\Models\Venta;
use App\Models\PrestamoCliente;
use App\Models\PrestamoEvento;
use App\Models\PrestableStock;
use App\Models\MovimientoPrestable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

/**
 * PrestamoReversalService
 *
 * Servicio para REVERTIR prestables cuando se anula una venta
 * DIFERENTE a anularPrestamo() que es para anulación manual de préstamos
 *
 * RESPONSABILIDADES:
 * ✓ Decrementar sin_liquido (reversa del +10 que la venta agregó)
 * ✓ Decrementar cliente_deudor o evento_deudor (reversa del préstamo)
 * ✓ Incrementar disponible (por la venta que se anula)
 * ✓ Cambiar estado de PrestamoCliente/Evento a CANCELADO
 * ✓ Crear MovimientoPrestable de auditoría
 */
class PrestamoReversalService
{
    /**
     * Revertir PrestamoCliente cuando se anula venta
     *
     * Lógica de reversión (OPUESTA a anularPrestamo):
     * ├─ cantidad_disponible += (revierte lo que la venta consumió)
     * ├─ cantidad_sin_liquido -= (revierte lo que la venta agregó)
     * ├─ cantidad_cliente_deudor -= (revierte el préstamo)
     * └─ MovimientoPrestable tipo='ENTRADA' (auditoría completa)
     *
     * @param PrestamoCliente $prestamo El préstamo a revertir
     * @param Venta $venta La venta que se anula
     * @param string $motivo Razón de la anulación
     * @throws \Exception Si falla la reversión
     */
    public function revertirPrestamoCliente(PrestamoCliente $prestamo, Venta $venta, string $motivo): void
    {
        try {
            // Cargar detalles del préstamo
            $prestamo->load(['detalles']);

            Log::info('🔄 [PrestamoReversalService::revertirPrestamoCliente] Iniciando reversión', [
                'prestamo_id' => $prestamo->id,
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'cantidad_detalles' => $prestamo->detalles->count(),
                'motivo' => $motivo,
            ]);

            // POR CADA DETALLE DEL PRÉSTAMO
            foreach ($prestamo->detalles as $detalle) {
                Log::info('🔄 Procesando detalle de PrestamoCliente', [
                    'detalle_id' => $detalle->id,
                    'prestable_id' => $detalle->prestable_id,
                    'cantidad' => $detalle->cantidad_prestada,
                ]);

                // POR CADA ALMACÉN DEL DETALLE
                $almacenes = DB::table('prestamo_cliente_almacenes')
                    ->where('prestamo_cliente_detalle_id', $detalle->id)
                    ->get();

                foreach ($almacenes as $almacen) {
                    $this->revertirStockDelAlmacen(
                        $detalle->prestable_id,
                        $almacen->almacenes_prestables_id,
                        $almacen->cantidad,
                        'CLIENTE',
                        $venta,
                        $prestamo,
                        'canastillas_embases' // tipo_prestamo por defecto
                    );
                }
            }

            // Cambiar estado de PrestamoCliente a CANCELADO
            $prestamo->update([
                'estado' => 'CANCELADO',
                'motivo_cancelacion' => "Venta #{$venta->numero} anulada. {$motivo}",
                'fecha_cancelacion' => now(),
            ]);

            Log::info('✅ PrestamoCliente revertido correctamente', [
                'prestamo_id' => $prestamo->id,
                'venta_id' => $venta->id,
                'nuevo_estado' => 'CANCELADO',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo PrestamoCliente', [
                'prestamo_id' => $prestamo->id,
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Revertir PrestamoEvento cuando se anula venta
     *
     * Lógica de reversión (OPUESTA a anularPrestamo):
     * ├─ cantidad_disponible += (revierte lo que la venta consumió)
     * ├─ cantidad_sin_liquido -= (revierte lo que la venta agregó)
     * ├─ cantidad_evento_deudor -= (revierte el préstamo)
     * └─ MovimientoPrestable tipo='ENTRADA' (auditoría)
     *
     * @param PrestamoEvento $prestamo El préstamo a revertir
     * @param Venta $venta La venta que se anula
     * @param string $motivo Razón de la anulación
     * @throws \Exception Si falla la reversión
     */
    public function revertirPrestamoEvento(PrestamoEvento $prestamo, Venta $venta, string $motivo): void
    {
        try {
            // Cargar detalles del préstamo
            $prestamo->load(['detalles']);

            Log::info('🔄 [PrestamoReversalService::revertirPrestamoEvento] Iniciando reversión', [
                'prestamo_evento_id' => $prestamo->id,
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'cantidad_detalles' => $prestamo->detalles->count(),
                'motivo' => $motivo,
            ]);

            // POR CADA DETALLE DEL PRÉSTAMO
            foreach ($prestamo->detalles as $detalle) {
                Log::info('🔄 Procesando detalle de PrestamoEvento', [
                    'detalle_id' => $detalle->id,
                    'prestable_id' => $detalle->prestable_id,
                    'cantidad' => $detalle->cantidad_prestada,
                ]);

                // POR CADA ALMACÉN DEL DETALLE
                $almacenes = DB::table('prestamo_evento_almacenes')
                    ->where('prestamo_evento_detalle_id', $detalle->id)
                    ->get();

                foreach ($almacenes as $almacen) {
                    $this->revertirStockDelAlmacen(
                        $detalle->prestable_id,
                        $almacen->almacenes_prestables_id,
                        $almacen->cantidad,
                        'EVENTO',
                        $venta,
                        $prestamo,
                        'canastillas_embases' // tipo_prestamo por defecto
                    );
                }
            }

            // Cambiar estado de PrestamoEvento a CANCELADO
            $prestamo->update([
                'estado' => 'CANCELADO',
                'motivo_cancelacion' => "Venta #{$venta->numero} anulada. {$motivo}",
                'fecha_cancelacion' => now(),
            ]);

            Log::info('✅ PrestamoEvento revertido correctamente', [
                'prestamo_evento_id' => $prestamo->id,
                'venta_id' => $venta->id,
                'nuevo_estado' => 'CANCELADO',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo PrestamoEvento', [
                'prestamo_evento_id' => $prestamo->id,
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Revertir stock de un almacén específico
     *
     * Funciona para VENTA, COMPRA, CLIENTE, EVENTO y PROVEEDOR
     *
     * @param int $prestableId ID del prestable
     * @param int $almacenId ID del almacén
     * @param int $cantidad Cantidad a revertir
     * @param string $tipoPrestamo 'CLIENTE', 'EVENTO' o 'PROVEEDOR'
     * @param mixed $referencia La venta o compra que se anula
     * @param mixed $prestamo El préstamo (PrestamoCliente|PrestamoEvento|PrestamoProveedor)
     * @param string $tipoPrestamoCodigo Código del tipo de préstamo (canastillas_embases, etc)
     */
    private function revertirStockDelAlmacen(
        int $prestableId,
        int $almacenId,
        int $cantidad,
        string $tipoPrestamo,
        $referencia,
        $prestamo,
        string $tipoPrestamoCodigo = 'canastillas_embases'
    ): void {
        $stock = PrestableStock::where('prestable_id', $prestableId)
            ->where('almacenes_prestables_id', $almacenId)
            ->lockForUpdate()
            ->first();

        if (!$stock) {
            Log::warning('⚠️ PrestableStock no encontrado para revertir', [
                'prestable_id' => $prestableId,
                'almacen_id' => $almacenId,
            ]);
            return;
        }

        // VALORES ANTERIORES (para auditoría)
        $disponibleAnterior = $stock->cantidad_disponible;
        $sinLiquidoAnterior = $stock->cantidad_sin_liquido;
        $clienteDeudorAnterior = $stock->cantidad_cliente_deudor ?? 0;
        $eventoDeudorAnterior = $stock->cantidad_evento_deudor ?? 0;
        $proveedorAcreedorAnterior = $stock->cantidad_proveedor_acreedor ?? 0;

        // CALCULAR NUEVOS VALORES
        if ($tipoPrestamo === 'CLIENTE') {
            $disponiblePosterior = $disponibleAnterior + $cantidad; // ← Revierte venta
            $sinLiquidoPosterior = max(0, $sinLiquidoAnterior - $cantidad); // ← Decrementa
            $clienteDeudorPosterior = max(0, $clienteDeudorAnterior - $cantidad); // ← Decrementa
            $eventoDeudorPosterior = $eventoDeudorAnterior; // ← Sin cambios
            $proveedorAcreedorPosterior = $proveedorAcreedorAnterior; // ← Sin cambios
        } elseif ($tipoPrestamo === 'EVENTO') {
            $disponiblePosterior = $disponibleAnterior + $cantidad; // ← Revierte venta
            $sinLiquidoPosterior = max(0, $sinLiquidoAnterior - $cantidad); // ← Decrementa
            $clienteDeudorPosterior = $clienteDeudorAnterior; // ← Sin cambios
            $eventoDeudorPosterior = max(0, $eventoDeudorAnterior - $cantidad); // ← Decrementa
            $proveedorAcreedorPosterior = $proveedorAcreedorAnterior; // ← Sin cambios
        } elseif ($tipoPrestamo === 'COMPRA_ENTRADA') {
            // Revertir COMPRA: disminuir disponible
            $disponiblePosterior = max(0, $disponibleAnterior - $cantidad); // ← Revierte compra
            $sinLiquidoPosterior = $sinLiquidoAnterior; // ← Sin cambios
            $clienteDeudorPosterior = $clienteDeudorAnterior; // ← Sin cambios
            $eventoDeudorPosterior = $eventoDeudorAnterior; // ← Sin cambios
            $proveedorAcreedorPosterior = $proveedorAcreedorAnterior; // ← Sin cambios
        } else { // PROVEEDOR
            // Revertir PRESTAMO: disminuir proveedor_acreedor
            $disponiblePosterior = $disponibleAnterior; // ← Sin cambios (ya revirtió COMPRA_ENTRADA)
            $sinLiquidoPosterior = $sinLiquidoAnterior; // ← Sin cambios
            $clienteDeudorPosterior = $clienteDeudorAnterior; // ← Sin cambios
            $eventoDeudorPosterior = $eventoDeudorAnterior; // ← Sin cambios
            $proveedorAcreedorPosterior = max(0, $proveedorAcreedorAnterior - $cantidad); // ← Decrementa
        }

        Log::info('🔄 Revertiendo stock del almacén', [
            'prestable_id' => $prestableId,
            'almacen_id' => $almacenId,
            'tipo_prestamo' => $tipoPrestamo,
            'cantidad' => $cantidad,
            'disponible_anterior' => $disponibleAnterior,
            'disponible_posterior' => $disponiblePosterior,
            'sin_liquido_anterior' => $sinLiquidoAnterior,
            'sin_liquido_posterior' => $sinLiquidoPosterior,
            'cliente_deudor_anterior' => $clienteDeudorAnterior,
            'cliente_deudor_posterior' => $clienteDeudorPosterior,
            'evento_deudor_anterior' => $eventoDeudorAnterior,
            'evento_deudor_posterior' => $eventoDeudorPosterior,
            'proveedor_acreedor_anterior' => $proveedorAcreedorAnterior,
            'proveedor_acreedor_posterior' => $proveedorAcreedorPosterior,
        ]);

        // ACTUALIZAR STOCK
        $stock->update([
            'cantidad_disponible' => $disponiblePosterior,
            'cantidad_sin_liquido' => $sinLiquidoPosterior,
            'cantidad_cliente_deudor' => $clienteDeudorPosterior,
            'cantidad_evento_deudor' => $eventoDeudorPosterior,
            'cantidad_proveedor_acreedor' => $proveedorAcreedorPosterior,
        ]);

        // REGISTRAR MOVIMIENTO DE AUDITORÍA CON CAMPOS COMPLETOS
        $request = request();

        // Determinar tipo de categoría según la operación
        $categoriaAfectada = match ($tipoPrestamo) {
            'CLIENTE', 'EVENTO' => 'reversión_por_anulación_venta',
            'COMPRA_ENTRADA' => 'reversión_compra_disponible',
            'PROVEEDOR' => 'reversión_prestamo_proveedor',
            default => 'reversión_desconocida',
        };

        $motivo = match ($tipoPrestamo) {
            'CLIENTE', 'EVENTO' => "Reversión por anulación de venta #{$referencia->numero}",
            'COMPRA_ENTRADA' => "Reversión de compra: disponible disminuido por compra #{$referencia->numero}",
            'PROVEEDOR' => "Reversión de préstamo proveedor: anulación de compra #{$referencia->numero}",
            default => "Reversión desconocida #{$referencia->numero}",
        };

        MovimientoPrestable::create([
            'prestable_stock_id' => $stock->id,
            'prestable_id' => $prestableId,
            'almacenes_prestables_id' => $almacenId,
            'usuario_id' => Auth::user()->id ?? 1,
            'tipo' => 'ENTRADA',
            'cantidad' => -$cantidad,
            'disponible_anterior' => $disponibleAnterior,
            'disponible_posterior' => $disponiblePosterior,
            'cantidad_sin_liquido_anterior' => $sinLiquidoAnterior,
            'cantidad_sin_liquido_posterior' => $sinLiquidoPosterior,
            'prestamo_cliente_anterior' => $clienteDeudorAnterior,
            'prestamo_cliente_posterior' => $clienteDeudorPosterior,
            'prestamo_proveedor_anterior' => $proveedorAcreedorAnterior,
            'prestamo_proveedor_posterior' => $proveedorAcreedorPosterior,
            'prestamo_evento_anterior' => $eventoDeudorAnterior,
            'prestamo_evento_posterior' => $eventoDeudorPosterior,
            'categoria_afectada' => $categoriaAfectada,
            'motivo' => $motivo,
            'observaciones' => "Reversión automática. Tipo prestamo: {$tipoPrestamoCodigo}",
            'numero_referencia' => $referencia->numero,
            'referencia_tipo' => match ($tipoPrestamo) {
                'CLIENTE', 'EVENTO' => 'venta_anulada',
                'COMPRA_ENTRADA', 'PROVEEDOR' => 'compra_anulada',
                default => 'desconocida',
            },
            'referencia_id' => $referencia->id,
            'tipo_prestamo' => $tipoPrestamoCodigo,
            'ip_usuario' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'prestamo_cliente_id' => $tipoPrestamo === 'CLIENTE' ? $prestamo->id : null,
            'prestamo_evento_id' => $tipoPrestamo === 'EVENTO' ? $prestamo->id : null,
            'prestamo_proveedor_id' => $tipoPrestamo === 'PROVEEDOR' ? $prestamo->id : null,
            'venta_id' => $tipoPrestamo !== 'PROVEEDOR' && $tipoPrestamo !== 'COMPRA_ENTRADA' ? $referencia->id : null,
            'compra_id' => ($tipoPrestamo === 'PROVEEDOR' || $tipoPrestamo === 'COMPRA_ENTRADA') ? $referencia->id : null,
        ]);

        Log::info('✅ Stock del almacén revertido', [
            'prestable_id' => $prestableId,
            'almacen_id' => $almacenId,
            'tipo_prestamo' => $tipoPrestamo,
            'cantidad_revertida' => $cantidad,
            'disponible_final' => $disponiblePosterior,
            'sin_liquido_final' => $sinLiquidoPosterior,
        ]);
    }

    /**
     * Obtener cuánto una COMPRA agregó a cantidad_disponible
     *
     * Busca en MovimientoPrestable registros donde:
     * - compra_id = compra que se está anulando
     * - prestable_id = prestable específico
     * - almacenes_prestables_id = almacén específico
     * - tipo = 'COMPRA_ENTRADA'
     *
     * @return float Cantidad que la compra agregó a disponible
     */
    private function obtenerCantidadCompra(int $prestableId, int $almacenId, int $compraId): float
    {
        // Buscar MovimientoPrestable de la COMPRA
        $movimientos = MovimientoPrestable::where('compra_id', $compraId)
            ->where('almacenes_prestables_id', $almacenId)
            ->whereHas('prestableStock', function ($q) use ($prestableId) {
                $q->where('prestable_id', $prestableId);
            })
            ->get();

        if ($movimientos->isEmpty()) {
            Log::warning('⚠️ No se encontró MovimientoPrestable de COMPRA', [
                'prestable_id' => $prestableId,
                'almacen_id' => $almacenId,
                'compra_id' => $compraId,
            ]);
            return 0;
        }

        // Sumar todos los cambios en disponible causados por la COMPRA
        $totalCantidad = 0;
        foreach ($movimientos as $mov) {
            $cambioDisponible = $mov->disponible_posterior - $mov->disponible_anterior;
            $totalCantidad += $cambioDisponible;

            Log::debug('📝 Movimiento de compra encontrado', [
                'movimiento_id' => $mov->id,
                'disponible_anterior' => $mov->disponible_anterior,
                'disponible_posterior' => $mov->disponible_posterior,
                'cambio' => $cambioDisponible,
            ]);
        }

        Log::info('✅ Cantidad de COMPRA encontrada', [
            'prestable_id' => $prestableId,
            'almacen_id' => $almacenId,
            'compra_id' => $compraId,
            'cantidad_total' => $totalCantidad,
        ]);

        return $totalCantidad;
    }

    /**
     * Revertir PrestamoProveedor cuando se anula una compra
     *
     * Lógica de reversión (OPUESTA a anularPrestamo):
     * ├─ cantidad_disponible -= (revierte lo que la compra agregó)
     * ├─ cantidad_proveedor_acreedor -= (revierte el préstamo)
     * └─ MovimientoPrestable tipo='SALIDA' (auditoría completa)
     *
     * @param PrestamoProveedor $prestamo El préstamo a revertir
     * @param Compra $compra La compra que se anula
     * @param string $motivo Razón de la anulación
     * @throws \Exception Si falla la reversión
     */
    public function revertirPrestamoProveedor($prestamo, $compra, string $motivo): void
    {
        try {
            $prestamo->load(['detalles']);

            Log::info('🔄 [PrestamoReversalService::revertirPrestamoProveedor] Iniciando reversión', [
                'prestamo_id' => $prestamo->id,
                'compra_id' => $compra->id,
                'compra_numero' => $compra->numero,
                'cantidad_detalles' => $prestamo->detalles->count(),
                'motivo' => $motivo,
            ]);

            // POR CADA DETALLE DEL PRÉSTAMO
            foreach ($prestamo->detalles as $detalle) {
                Log::info('🔄 Procesando detalle de PrestamoProveedor', [
                    'detalle_id' => $detalle->id,
                    'prestable_id' => $detalle->prestable_id,
                    'cantidad_prestada' => $detalle->cantidad_prestada,
                ]);

                // POR CADA ALMACÉN DEL DETALLE
                $almacenes = DB::table('prestamo_proveedor_almacenes')
                    ->where('prestamo_proveedor_detalle_id', $detalle->id)
                    ->get();

                foreach ($almacenes as $almacen) {
                    // BUSCAR cuánto la COMPRA agregó a disponible para este prestable/almacén
                    $cantidadCompra = $this->obtenerCantidadCompra(
                        $detalle->prestable_id,
                        $almacen->almacenes_prestables_id,
                        $compra->id
                    );

                    Log::info('📊 Cantidad que la COMPRA agregó a disponible', [
                        'prestable_id' => $detalle->prestable_id,
                        'almacen_id' => $almacen->almacenes_prestables_id,
                        'cantidad_compra' => $cantidadCompra,
                        'cantidad_prestamo' => $almacen->cantidad,
                    ]);

                    // Revertir COMPRA (disminuir disponible)
                    if ($cantidadCompra > 0) {
                        $this->revertirStockDelAlmacen(
                            $detalle->prestable_id,
                            $almacen->almacenes_prestables_id,
                            $cantidadCompra,
                            'COMPRA_ENTRADA',
                            $compra,
                            $prestamo,
                            'canastillas_embases'
                        );
                    }

                    // Revertir PRESTAMO (disminuir proveedor_acreedor)
                    $this->revertirStockDelAlmacen(
                        $detalle->prestable_id,
                        $almacen->almacenes_prestables_id,
                        $almacen->cantidad,
                        'PROVEEDOR',
                        $compra,
                        $prestamo,
                        'canastillas_embases'
                    );
                }
            }

            // Cambiar estado de PrestamoProveedor a CANCELADO
            $prestamo->update([
                'estado' => 'CANCELADO',
                'motivo_cancelacion' => "Compra #{$compra->numero} anulada. {$motivo}",
                'fecha_cancelacion' => now(),
            ]);

            Log::info('✅ PrestamoProveedor revertido correctamente', [
                'prestamo_id' => $prestamo->id,
                'compra_id' => $compra->id,
                'nuevo_estado' => 'CANCELADO',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo PrestamoProveedor', [
                'prestamo_id' => $prestamo->id,
                'compra_id' => $compra->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}

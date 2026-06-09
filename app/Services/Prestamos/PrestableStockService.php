<?php

namespace App\Services\Prestamos;

use App\Models\AlmacenPrestable;
use App\Models\PrestableStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * PrestableStockService
 *
 * Gestiona el stock de canastillas/embases:
 * - cantidad_disponible: puedo vender o prestar
 * - cantidad_en_prestamo_cliente: en poder del cliente
 * - cantidad_que_debo_devolver: debo al proveedor
 * - cantidad_vendida: cliente compró (no se devuelve)
 */
class PrestableStockService
{
    /**
     * Obtener o crear registro de stock
     */
    public function obtenerStock(int $prestableId, int $almacenId): PrestableStock
    {
        return PrestableStock::firstOrCreate(
            [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
            ],
            [
                'cantidad_disponible' => 0,
                'cantidad_cliente_deudor' => 0,
                'cantidad_cliente_devuelto' => 0,
                'cantidad_evento_deudor' => 0,
                'cantidad_evento_devuelto' => 0,
                'cantidad_proveedor_acreedor' => 0,
                'cantidad_proveedor_devuelto' => 0,
            ]
        );
    }

    /**
     * Obtener cantidad total real de un prestable
     * total = disponible + prestamos_cliente (activo+devuelto) + prestamos_evento (activo+devuelto) + prestamos_proveedor (activo+devuelto)
     */
    public function obtenerCantidadTotal(int $prestableId, int $almacenId): int
    {
        $stock = $this->obtenerStock($prestableId, $almacenId);

        return $stock->cantidad_disponible +
               $stock->cantidad_cliente_deudor +
               $stock->cantidad_cliente_devuelto +
               $stock->cantidad_evento_deudor +
               $stock->cantidad_evento_devuelto +
               $stock->cantidad_proveedor_acreedor +
               $stock->cantidad_proveedor_devuelto;
    }

    /**
     * Prestar canastillas a cliente
     *
     * Reduce: cantidad_disponible
     * Incrementa: cantidad_cliente_deudor
     */
    public function prestarAlCliente(int $prestableId, int $almacenId, int $cantidad): bool
    {
        $stock = $this->obtenerStock($prestableId, $almacenId);

        // Validar que hay suficiente disponible
        if ($stock->cantidad_disponible < $cantidad) {
            Log::warning('❌ Stock insuficiente para prestar', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'disponible' => $stock->cantidad_disponible,
                'solicitado' => $cantidad,
            ]);
            return false;
        }

        DB::transaction(function () use ($stock, $cantidad) {
            $stock->update([
                'cantidad_disponible' => $stock->cantidad_disponible - $cantidad,
                'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor + $cantidad,
            ]);

            Log::info('✅ Canastillas prestadas al cliente', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'cantidad' => $cantidad,
            ]);
        });

        return true;
    }

    /**
     * Devolver canastillas del cliente
     *
     * Parámetros:
     * - $cantidadDevuelta: cantidad en buen estado (vuelve a disponible)
     * - $cantidadDañadaTotal: cantidad inutilizable (se registra como dañada, no disponible)
     */
    public function devolverDelCliente(
        int $prestableId,
        int $almacenId,
        int $cantidadDevuelta,
        int $cantidadDañadaTotal = 0
    ): bool {
        $stock = $this->obtenerStock($prestableId, $almacenId);
        $cantidadTotal = $cantidadDevuelta + $cantidadDañadaTotal;

        // Validar que no devuelve más de lo que pidió prestado
        if ($stock->cantidad_cliente_deudor < $cantidadTotal) {
            Log::warning('❌ Intento de devolución inválida', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'en_prestamo' => $stock->cantidad_cliente_deudor,
                'intenta_devolver' => $cantidadTotal,
            ]);
            return false;
        }

        DB::transaction(function () use ($stock, $cantidadDevuelta, $cantidadDañadaTotal, $cantidadTotal) {
            // Lo devuelto en buen estado vuelve a disponible
            $nuevoDisponible = $stock->cantidad_disponible + $cantidadDevuelta;

            Log::info('📝 Antes de actualizar stock', [
                'prestable_stock_id' => $stock->id,
                'cantidad_disponible_antes' => $stock->cantidad_disponible,
                'cantidad_cliente_deudor_antes' => $stock->cantidad_cliente_deudor,
                'cantidad_cliente_dañada_antes' => $stock->cantidad_cliente_dañada,
                'nuevo_disponible' => $nuevoDisponible,
                'cantidad_devuelta' => $cantidadDevuelta,
                'cantidad_dañada_total' => $cantidadDañadaTotal,
            ]);

            // ✅ NUEVO: Diferenciar por tipo de almacén para actualizar dañadas correctamente
            $almacen = AlmacenPrestable::find($stock->almacenes_prestables_id);
            $actualizacion = [
                'cantidad_disponible' => $nuevoDisponible,
                'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor - ($cantidadDevuelta + $cantidadDañadaTotal),
                'cantidad_cliente_devuelto' => $stock->cantidad_cliente_devuelto + $cantidadDevuelta,
            ];

            if ($almacen && $almacen->es_proveedor) {
                // Si es almacén PROVEEDOR → actualizar cantidad_proveedor_dañada
                $actualizacion['cantidad_proveedor_dañada'] = $stock->cantidad_proveedor_dañada + $cantidadDañadaTotal;
            } else {
                // Si es almacén DISTRIBUIDORA → actualizar cantidad_cliente_dañada
                $actualizacion['cantidad_cliente_dañada'] = $stock->cantidad_cliente_dañada + $cantidadDañadaTotal;
            }

            $updateResult = $stock->update($actualizacion);

            Log::info('📝 Update result: ' . ($updateResult ? 'SUCCESS' : 'FAILED'), [
                'prestable_stock_id' => $stock->id,
            ]);

            Log::info('✅ Canastillas devueltas por cliente', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'devueltas_buen_estado' => $cantidadDevuelta,
                'devueltas_daño_total' => $cantidadDañadaTotal,
            ]);
        });

        return true;
    }

    /**
     * ✅ NUEVO: Devolver canastillas/embases a almacén proveedor
     *
     * Parámetros:
     * - $cantidadDevuelta: cantidad en buen estado (vuelve a disponible)
     * - $cantidadDañadaTotal: cantidad inutilizable (se registra como dañada, no disponible)
     */
    public function devolverDelProveedor(
        int $prestableId,
        int $almacenId,
        int $cantidadDevuelta,
        int $cantidadDañadaTotal = 0
    ): bool {
        $stock = $this->obtenerStock($prestableId, $almacenId);
        $cantidadTotal = $cantidadDevuelta + $cantidadDañadaTotal;

        // Validar que no devuelve más de lo que pidió prestado al proveedor
        if ($stock->cantidad_proveedor_acreedor < $cantidadTotal) {
            Log::warning('❌ Intento de devolución inválida al proveedor', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'en_prestamo' => $stock->cantidad_proveedor_acreedor,
                'intenta_devolver' => $cantidadTotal,
            ]);
            return false;
        }

        DB::transaction(function () use ($stock, $cantidadDevuelta, $cantidadDañadaTotal, $cantidadTotal) {
            // Lo devuelto en buen estado vuelve a disponible
            $nuevoDisponible = $stock->cantidad_disponible + $cantidadDevuelta;

            Log::info('📝 Antes de actualizar stock (PROVEEDOR)', [
                'prestable_stock_id' => $stock->id,
                'cantidad_disponible_antes' => $stock->cantidad_disponible,
                'cantidad_proveedor_acreedor_antes' => $stock->cantidad_proveedor_acreedor,
                'cantidad_proveedor_dañada_antes' => $stock->cantidad_proveedor_dañada,
                'nuevo_disponible' => $nuevoDisponible,
                'cantidad_devuelta' => $cantidadDevuelta,
                'cantidad_dañada_total' => $cantidadDañadaTotal,
            ]);

            $updateResult = $stock->update([
                'cantidad_disponible' => $nuevoDisponible,
                'cantidad_proveedor_acreedor' => $stock->cantidad_proveedor_acreedor - ($cantidadDevuelta + $cantidadDañadaTotal),
                'cantidad_proveedor_devuelto' => $stock->cantidad_proveedor_devuelto + $cantidadDevuelta,
                'cantidad_proveedor_dañada' => $stock->cantidad_proveedor_dañada + $cantidadDañadaTotal,  // ✅ PROVEEDOR
            ]);

            Log::info('📝 Update result (PROVEEDOR): ' . ($updateResult ? 'SUCCESS' : 'FAILED'), [
                'prestable_stock_id' => $stock->id,
            ]);

            Log::info('✅ Devuelto al proveedor', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'devueltas_buen_estado' => $cantidadDevuelta,
                'devueltas_daño_total' => $cantidadDañadaTotal,
            ]);
        });

        return true;
    }

    /**
     * Devolver canastillas/embases del evento
     *
     * Parámetros:
     * - $cantidadDevuelta: cantidad en buen estado (vuelve a disponible)
     * - $cantidadDañadaTotal: cantidad inutilizable (se registra como dañada, no disponible)
     */
    public function devolverDelEvento(
        int $prestableId,
        int $almacenId,
        int $cantidadDevuelta,
        int $cantidadDañadaTotal = 0
    ): bool {
        $stock = $this->obtenerStock($prestableId, $almacenId);
        $cantidadTotal = $cantidadDevuelta + $cantidadDañadaTotal;

        // Validar que no devuelve más de lo que pidió prestado
        if ($stock->cantidad_evento_deudor < $cantidadTotal) {
            Log::warning('❌ Intento de devolución inválida a evento', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'en_prestamo' => $stock->cantidad_evento_deudor,
                'intenta_devolver' => $cantidadTotal,
            ]);
            return false;
        }

        DB::transaction(function () use ($stock, $cantidadDevuelta, $cantidadDañadaTotal, $cantidadTotal) {
            // Lo devuelto en buen estado vuelve a disponible
            $nuevoDisponible = $stock->cantidad_disponible + $cantidadDevuelta;

            Log::info('📝 Antes de actualizar stock evento', [
                'prestable_stock_id' => $stock->id,
                'cantidad_disponible_antes' => $stock->cantidad_disponible,
                'cantidad_evento_deudor_antes' => $stock->cantidad_evento_deudor,
                'cantidad_evento_dañada_antes' => $stock->cantidad_evento_dañada,
                'nuevo_disponible' => $nuevoDisponible,
                'cantidad_devuelta' => $cantidadDevuelta,
                'cantidad_dañada_total' => $cantidadDañadaTotal,
            ]);

            $updateResult = $stock->update([
                'cantidad_disponible' => $nuevoDisponible,
                'cantidad_evento_deudor' => $stock->cantidad_evento_deudor - ($cantidadDevuelta + $cantidadDañadaTotal),
                'cantidad_evento_devuelto' => $stock->cantidad_evento_devuelto + $cantidadDevuelta,
                'cantidad_evento_dañada' => $stock->cantidad_evento_dañada + $cantidadDañadaTotal,
            ]);

            Log::info('📝 Update result evento: ' . ($updateResult ? 'SUCCESS' : 'FAILED'), [
                'prestable_stock_id' => $stock->id,
            ]);

            Log::info('✅ Items devueltos por evento', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'devueltas_buen_estado' => $cantidadDevuelta,
                'devueltas_daño_total' => $cantidadDañadaTotal,
            ]);
        });

        return true;
    }

    /**
     * Vender canastillas al cliente
     *
     * IMPORTANTE: Las ventas ahora se registran en tabla prestamos_vendido
     * Este método SOLO reduce: cantidad_disponible
     * Las ventas se completan en la tabla PrestamoVendido
     */
    public function venderAlCliente(int $prestableId, int $almacenId, int $cantidad): bool
    {
        $stock = $this->obtenerStock($prestableId, $almacenId);

        if ($stock->cantidad_disponible < $cantidad) {
            Log::warning('❌ Stock insuficiente para vender', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'disponible' => $stock->cantidad_disponible,
                'solicitado' => $cantidad,
            ]);
            return false;
        }

        DB::transaction(function () use ($stock, $cantidad) {
            $stock->update([
                'cantidad_disponible' => $stock->cantidad_disponible - $cantidad,
            ]);

            Log::info('✅ Canastillas vendidas al cliente (stock reducido)', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'cantidad' => $cantidad,
            ]);
        });

        return true;
    }

    /**
     * Registrar préstamo de proveedor
     *
     * Cuando el proveedor nos presta canastillas/embases:
     * - incrementa el stock disponible para operar
     * - incrementa la deuda activa con proveedor
     *
     * Incrementa:
     * - cantidad_disponible
     * - cantidad_proveedor_acreedor
     */
    public function recibirPrestamoProveedor(int $prestableId, int $almacenId, int $cantidad): bool
    {
        $stock = $this->obtenerStock($prestableId, $almacenId);

        DB::transaction(function () use ($stock, $cantidad) {
            $stock->update([
                'cantidad_disponible' => $stock->cantidad_disponible + $cantidad,
                'cantidad_proveedor_acreedor' => $stock->cantidad_proveedor_acreedor + $cantidad,
            ]);

            Log::info('✅ Préstamo de proveedor registrado', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'cantidad' => $cantidad,
            ]);
        });

        return true;
    }

    /**
     * Devolver canastillas al proveedor
     *
        * Al devolver al proveedor reducimos tanto:
        * - disponibilidad operativa
        * - deuda activa con proveedor
        *
        * Incrementamos cantidad_proveedor_devuelto solo para unidades
        * efectivamente devueltas (buen estado + daño parcial).
     *
     * $cantidadDevuelta: En buen estado (se devuelven al proveedor)
     * $cantidadDañadaParcial: Con daño parcial (se devuelven + se reparan)
     * $cantidadDañadaTotal: Inutilizables (se cobran a garantía)
     */
    public function devolverAlProveedor(int $prestableId, int $almacenId, int $cantidadDevuelta = 0, int $cantidadDañadaTotal = 0): bool
    {
        // ✅ SIMPLIFICADO: cantidad_devuelta es el TOTAL, cantidad_dañada_total es solo información
        $stock = $this->obtenerStock($prestableId, $almacenId);

        // Solo procesar si hay cantidad devuelta
        if ($cantidadDevuelta === 0) {
            Log::info('ℹ️ Devolución registrada solo en auditoría (sin cantidad devuelta)', [
                'prestable_id' => $prestableId,
                'almacen_id' => $almacenId,
                'daño_total_auditoría' => $cantidadDañadaTotal,
            ]);
            return true;
        }

        // Validar que tenemos para devolver en préstamo al proveedor
        if ($stock->cantidad_proveedor_acreedor < $cantidadDevuelta) {
            Log::warning('❌ Intento de devolución a proveedor inválida', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'en_prestamo' => $stock->cantidad_proveedor_acreedor,
                'intenta_devolver' => $cantidadDevuelta,
            ]);
            return false;
        }

        if ($stock->cantidad_disponible < $cantidadDevuelta) {
            Log::warning('❌ Stock disponible insuficiente para devolver al proveedor', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'disponible' => $stock->cantidad_disponible,
                'intenta_devolver' => $cantidadDevuelta,
            ]);
            return false;
        }

        DB::transaction(function () use ($stock, $cantidadDevuelta, $cantidadDañadaTotal) {
            $stock->update([
                // ✅ Restar la cantidad TOTAL devuelta
                'cantidad_disponible' => $stock->cantidad_disponible - $cantidadDevuelta,
                'cantidad_proveedor_acreedor' => $stock->cantidad_proveedor_acreedor - $cantidadDevuelta,
                // ✅ NUEVO: Registrar dañadas de proveedor
                'cantidad_proveedor_dañada' => $stock->cantidad_proveedor_dañada + $cantidadDañadaTotal,
                // Registrar devueltas (sin separar dañadas)
                'cantidad_proveedor_devuelto' => $stock->cantidad_proveedor_devuelto + $cantidadDevuelta,
            ]);

            Log::info('✅ Devolución a proveedor registrada en stock', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'cantidad_devuelta_total' => $cantidadDevuelta,
                'cantidad_dañada_total' => $cantidadDañadaTotal,  // ✅ Nombre correcto
            ]);
        });

        return true;
    }

    /**
     * Incrementar stock inicial (compra a proveedor)
     */
    public function incrementarStockInicial(int $prestableId, int $almacenId, int $cantidad): bool
    {
        $stock = $this->obtenerStock($prestableId, $almacenId);

        DB::transaction(function () use ($stock, $cantidad) {
            $stock->update([
                'cantidad_disponible' => $stock->cantidad_disponible + $cantidad,
            ]);

            Log::info('✅ Stock inicial incrementado', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'cantidad' => $cantidad,
            ]);
        });

        return true;
    }

    /**
     * Obtener resumen de stock
     */
    public function obtenerResumen(int $prestableId, int $almacenId): array
    {
        $stock = $this->obtenerStock($prestableId, $almacenId);
        return $stock->resumen;
    }
}

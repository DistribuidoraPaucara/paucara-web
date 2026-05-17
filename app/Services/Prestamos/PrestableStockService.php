<?php

namespace App\Services\Prestamos;

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
                'cantidad_prestamo_cliente_activo' => 0,
                'cantidad_prestamo_cliente_devuelto' => 0,
                'cantidad_prestamo_evento_activo' => 0,
                'cantidad_prestamo_evento_devuelto' => 0,
                'cantidad_prestamo_proveedor_activo' => 0,
                'cantidad_prestamo_proveedor_devuelto' => 0,
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
               $stock->cantidad_prestamo_cliente_activo +
               $stock->cantidad_prestamo_cliente_devuelto +
               $stock->cantidad_prestamo_evento_activo +
               $stock->cantidad_prestamo_evento_devuelto +
               $stock->cantidad_prestamo_proveedor_activo +
               $stock->cantidad_prestamo_proveedor_devuelto;
    }

    /**
     * Prestar canastillas a cliente
     *
     * Reduce: cantidad_disponible
     * Incrementa: cantidad_prestamo_cliente_activo
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
                'cantidad_prestamo_cliente_activo' => $stock->cantidad_prestamo_cliente_activo + $cantidad,
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
     * - $cantidadDevuelta: cantidad en buen estado
     * - $cantidadDañadaParcial: cantidad con daño reparable
     * - $cantidadDañadaTotal: cantidad inutilizable
     */
    public function devolverDelCliente(
        int $prestableId,
        int $almacenId,
        int $cantidadDevuelta,
        int $cantidadDañadaParcial = 0,
        int $cantidadDañadaTotal = 0
    ): bool {
        $stock = $this->obtenerStock($prestableId, $almacenId);
        $cantidadTotal = $cantidadDevuelta + $cantidadDañadaParcial + $cantidadDañadaTotal;

        // Validar que no devuelve más de lo que pidió prestado
        if ($stock->cantidad_prestamo_cliente_activo < $cantidadTotal) {
            Log::warning('❌ Intento de devolución inválida', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'en_prestamo' => $stock->cantidad_prestamo_cliente_activo,
                'intenta_devolver' => $cantidadTotal,
            ]);
            return false;
        }

        DB::transaction(function () use ($stock, $cantidadDevuelta, $cantidadDañadaParcial, $cantidadDañadaTotal) {
            // Lo devuelto en buen estado vuelve a disponible
            $nuevoDisponible = $stock->cantidad_disponible + $cantidadDevuelta;

            // Lo dañado parcial vuelve a disponible (se puede reparar)
            $nuevoDisponible += $cantidadDañadaParcial;

            // Lo dañado total se pierden (se reponen desde garantía)
            // No vuelven a disponible

            $stock->update([
                'cantidad_disponible' => $nuevoDisponible,
                'cantidad_prestamo_cliente_activo' => $stock->cantidad_prestamo_cliente_activo -
                                                     ($cantidadDevuelta + $cantidadDañadaParcial + $cantidadDañadaTotal),
                'cantidad_prestamo_cliente_devuelto' => $stock->cantidad_prestamo_cliente_devuelto +
                                                       ($cantidadDevuelta + $cantidadDañadaParcial),
            ]);

            Log::info('✅ Canastillas devueltas por cliente', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'devueltas_buen_estado' => $cantidadDevuelta,
                'devueltas_daño_parcial' => $cantidadDañadaParcial,
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
     * - cantidad_prestamo_proveedor_activo
     */
    public function recibirPrestamoProveedor(int $prestableId, int $almacenId, int $cantidad): bool
    {
        $stock = $this->obtenerStock($prestableId, $almacenId);

        DB::transaction(function () use ($stock, $cantidad) {
            $stock->update([
                'cantidad_disponible' => $stock->cantidad_disponible + $cantidad,
                'cantidad_prestamo_proveedor_activo' => $stock->cantidad_prestamo_proveedor_activo + $cantidad,
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
        * Incrementamos cantidad_prestamo_proveedor_devuelto solo para unidades
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
        if ($stock->cantidad_prestamo_proveedor_activo < $cantidadDevuelta) {
            Log::warning('❌ Intento de devolución a proveedor inválida', [
                'prestable_id' => $prestableId,
                'almacenes_prestables_id' => $almacenId,
                'en_prestamo' => $stock->cantidad_prestamo_proveedor_activo,
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
                'cantidad_prestamo_proveedor_activo' => $stock->cantidad_prestamo_proveedor_activo - $cantidadDevuelta,
                // Registrar devueltas (sin separar dañadas)
                'cantidad_prestamo_proveedor_devuelto' => $stock->cantidad_prestamo_proveedor_devuelto + $cantidadDevuelta,
            ]);

            Log::info('✅ Devolución a proveedor registrada en stock', [
                'prestable_id' => $stock->prestable_id,
                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                'cantidad_devuelta_total' => $cantidadDevuelta,
                'cantidad_dañada_información' => $cantidadDañadaTotal,
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
        $total = $this->obtenerCantidadTotal($prestableId, $almacenId);

        return [
            'cantidad_disponible' => $stock->cantidad_disponible,
            'cantidad_en_prestamo_cliente' => $stock->cantidad_en_prestamo_cliente,
            'cantidad_que_debo_devolver' => $stock->cantidad_que_debo_devolver,
            'cantidad_vendida' => $stock->cantidad_vendida,
            'cantidad_total' => $total,
        ];
    }
}

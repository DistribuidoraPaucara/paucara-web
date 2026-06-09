<?php

namespace App\Services\Stock;

use App\Models\StockProducto;
use App\Models\MovimientoInventario;
use InvalidArgumentException;

/**
 * Servicio de validación de reglas de stock
 *
 * Valida que los datos cumplan con:
 * 1. Nunca valores negativos en cantidad, cantidad_reservada, cantidad_disponible
 * 2. Consistencia: cantidad = cantidad_disponible + cantidad_reservada
 * 3. Movimientos nunca tienen 0 en cantidad_anterior o cantidad_posterior
 */
class StockValidationService
{
    /**
     * Validar que un stock_producto cumpla todas las reglas
     *
     * @param StockProducto|object $stock
     * @throws InvalidArgumentException
     */
    public function validarStock($stock): void
    {
        // Regla 1️⃣: Nunca valores negativos
        $this->validarNoNegativos($stock);

        // Regla 2️⃣: Suma consistente
        $this->validarConsistencia($stock);
    }

    /**
     * Validar que un movimiento sea válido antes de crearlo
     *
     * @param array $datos Datos del movimiento
     * @throws InvalidArgumentException
     */
    public function validarMovimiento(array $datos): void
    {
        $anterior = $datos['cantidad_anterior'] ?? null;
        $posterior = $datos['cantidad_posterior'] ?? null;
        $cantidad = $datos['cantidad'] ?? null;

        // Regla 3️⃣: Nunca 0 o null en anterior/posterior
        if ($anterior === 0 || $anterior === null) {
            throw new InvalidArgumentException(
                "❌ cantidad_anterior no puede ser 0 o null. Recibido: {$anterior}"
            );
        }

        if ($posterior === 0 || $posterior === null) {
            throw new InvalidArgumentException(
                "❌ cantidad_posterior no puede ser 0 o null. Recibido: {$posterior}"
            );
        }

        // cantidad SÍ puede ser 0 pero probablemente es un error
        if ($cantidad === 0) {
            throw new InvalidArgumentException(
                "⚠️ cantidad es 0 - no hay cambio real en el inventario. ¿Esto es intencional?"
            );
        }
    }

    /**
     * Validar que una transacción es posible antes de ejecutarla
     *
     * @param StockProducto $stock
     * @param int $cantidad Cantidad a mover (positivo o negativo)
     * @param string $tipo Tipo de movimiento
     * @throws InvalidArgumentException
     */
    public function validarOperacionPosible(StockProducto $stock, int $cantidad, string $tipo): void
    {
        match ($tipo) {
            MovimientoInventario::TIPO_RESERVA_PROFORMA => $this->validarProforma($stock, $cantidad),
            MovimientoInventario::TIPO_LIBERACION_RESERVA => $this->validarLiberacion($stock, $cantidad),
            MovimientoInventario::TIPO_SALIDA_VENTA => $this->validarVentaDirecta($stock, $cantidad),
            MovimientoInventario::TIPO_CONSUMO_RESERVA => $this->validarVentaConsumo($stock, $cantidad),
            default => throw new InvalidArgumentException("Tipo de movimiento desconocido: {$tipo}"),
        };
    }

    /**
     * Validar que no hay valores negativos
     */
    private function validarNoNegativos($stock): void
    {
        if ($stock->cantidad < 0) {
            throw new InvalidArgumentException(
                "❌ cantidad no puede ser negativa. Stock: {$stock->id}, Cantidad: {$stock->cantidad}"
            );
        }

        if ($stock->cantidad_reservada < 0) {
            throw new InvalidArgumentException(
                "❌ cantidad_reservada no puede ser negativa. Stock: {$stock->id}, Reservada: {$stock->cantidad_reservada}"
            );
        }

        if ($stock->cantidad_disponible < 0) {
            throw new InvalidArgumentException(
                "❌ cantidad_disponible no puede ser negativa. Stock: {$stock->id}, Disponible: {$stock->cantidad_disponible}"
            );
        }
    }

    /**
     * Validar que la suma es consistente
     */
    private function validarConsistencia($stock): void
    {
        $suma = $stock->cantidad_reservada + $stock->cantidad_disponible;

        if ($suma !== (int)$stock->cantidad) {
            throw new InvalidArgumentException(
                "❌ Stock inconsistente. " .
                "Stock ID: {$stock->id}, " .
                "Total: {$stock->cantidad}, " .
                "Reservado: {$stock->cantidad_reservada}, " .
                "Disponible: {$stock->cantidad_disponible}, " .
                "Suma (Res+Disp): {$suma}. " .
                "Se esperaba que Total = Reservado + Disponible"
            );
        }
    }

    /**
     * Validar que hay suficiente disponible para reservar (Proforma)
     */
    private function validarProforma(StockProducto $stock, int $cantidad): void
    {
        $cantidadAReservar = abs($cantidad);

        if ($stock->cantidad_disponible < $cantidadAReservar) {
            throw new InvalidArgumentException(
                "❌ No hay suficiente disponible para reservar. " .
                "Stock: {$stock->id}, " .
                "Disponible: {$stock->cantidad_disponible}, " .
                "Solicitado para reservar: {$cantidadAReservar}"
            );
        }
    }

    /**
     * Validar que hay suficiente reservado para liberar
     */
    private function validarLiberacion(StockProducto $stock, int $cantidad): void
    {
        $cantidadALiberar = abs($cantidad);

        if ($stock->cantidad_reservada < $cantidadALiberar) {
            throw new InvalidArgumentException(
                "❌ No hay suficiente reservado para liberar. " .
                "Stock: {$stock->id}, " .
                "Reservado: {$stock->cantidad_reservada}, " .
                "Solicitado para liberar: {$cantidadALiberar}"
            );
        }
    }

    /**
     * Validar que hay suficiente total para venta directa
     */
    private function validarVentaDirecta(StockProducto $stock, int $cantidad): void
    {
        $cantidadAVender = abs($cantidad);

        if ($stock->cantidad < $cantidadAVender) {
            throw new InvalidArgumentException(
                "❌ No hay suficiente stock total para venta directa. " .
                "Stock: {$stock->id}, " .
                "Total: {$stock->cantidad}, " .
                "Solicitado para vender: {$cantidadAVender}"
            );
        }
    }

    /**
     * Validar que hay suficiente reservado para consumo
     */
    private function validarVentaConsumo(StockProducto $stock, int $cantidad): void
    {
        $cantidadAConsumir = abs($cantidad);

        if ($stock->cantidad_reservada < $cantidadAConsumir) {
            throw new InvalidArgumentException(
                "❌ No hay suficiente reservado para consumo. " .
                "Stock: {$stock->id}, " .
                "Reservado: {$stock->cantidad_reservada}, " .
                "Solicitado para consumir: {$cantidadAConsumir}"
            );
        }
    }
}

<?php

namespace App\Models\Traits;

/**
 * Trait para validaciones y cálculos en documentos con detalles
 *
 * Propósito: Centralizar lógica común en documentos que tienen detalles
 * (ej: Venta → DetalleVenta, Proforma → DetalleProforma, etc.)
 *
 * Usado en modelos:
 * - Venta
 * - Compra
 * - Proforma
 * - AsientoContable
 * - TransferenciaInventario
 * - ConteoFisico
 *
 * Métodos disponibles:
 * - tieneDetalles() : boolean
 * - cantidadDetalles() : int
 * - calcularSubtotalDesdeDetalles() : float
 * - totalesCoincidenConDetalles() : boolean
 * - validarDetalles() : array
 */
trait HasDocumentoDetalles
{
    /**
     * Relación con detalles (debe ser definida en cada modelo)
     *
     * Ejemplo de implementación en modelo:
     * public function detalles() {
     *     return $this->hasMany(DetalleVenta::class);
     * }
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    abstract public function detalles();

    /**
     * Validar que el documento tenga al menos un detalle
     *
     * @return bool true si tiene detalles, false si está vacío
     *
     * Ejemplo:
     * if (!$venta->tieneDetalles()) {
     *     throw new \InvalidArgumentException('Venta sin productos');
     * }
     */
    public function tieneDetalles(): bool
    {
        return $this->detalles()->exists();
    }

    /**
     * Obtener cantidad total de detalles en el documento
     *
     * @return int Cantidad de detalles
     *
     * Ejemplo:
     * $cantidad = $proforma->cantidadDetalles();
     * // Resultado: 5
     */
    public function cantidadDetalles(): int
    {
        return $this->detalles()->count();
    }

    /**
     * Calcular el subtotal sumando los subtotales de todos los detalles
     *
     * Útil para auditoría y verificación de integridad de datos.
     * Si el total del documento no coincide con este cálculo, hay inconsistencia.
     *
     * @return float Subtotal calculado desde detalles
     *
     * Ejemplo:
     * $subtotalCalculado = $venta->calcularSubtotalDesdeDetalles();
     * // Resultado: 1500.50
     */
    public function calcularSubtotalDesdeDetalles(): float
    {
        return (float) ($this->detalles->sum('subtotal') ?? 0);
    }

    /**
     * Validar que los totales del documento coincidan con la suma de detalles
     *
     * Esto detecta si hay discrepancias entre lo que registra el documento
     * principal y la suma de sus detalles. Es una validación crítica para
     * la integridad de la base de datos.
     *
     * @param float $tolerancia Tolerancia para diferencias de redondeo (default: 0.01)
     *                          Permite diferencias pequeñas por cálculos decimales
     * @return bool true si coinciden, false si hay discrepancia
     *
     * Ejemplo:
     * if (!$proforma->totalesCoincidenConDetalles()) {
     *     throw new \Exception('Error: totales no coinciden');
     * }
     */
    public function totalesCoincidenConDetalles(float $tolerancia = 0.01): bool
    {
        $subtotalCalculado = $this->calcularSubtotalDesdeDetalles();
        $subtotalDocumento = $this->subtotal ?? 0;

        return abs($subtotalCalculado - $subtotalDocumento) < $tolerancia;
    }

    /**
     * Validación COMPLETA de integridad de detalles
     *
     * Ejecuta todas las validaciones disponibles y retorna un array con el resultado.
     * Útil para hacer validaciones sin lanzar excepciones inmediatamente.
     *
     * Valida:
     * 1. Que el documento tenga detalles
     * 2. Que los totales coincidan
     * 3. Que cada detalle tenga cantidad y precio válidos
     *
     * @return array
     *   [
     *       'valido' => bool,
     *       'errores' => [string, ...]
     *   ]
     *
     * Ejemplo:
     * $validacion = $venta->validarDetalles();
     * if (!$validacion['valido']) {
     *     foreach ($validacion['errores'] as $error) {
     *         Log::error($error);
     *     }
     *     return response()->json(['errores' => $validacion['errores']], 422);
     * }
     */
    public function validarDetalles(): array
    {
        $errores = [];

        // ✅ Validación 1: ¿Tiene detalles?
        if (!$this->tieneDetalles()) {
            $errores[] = 'El documento no tiene detalles (productos/líneas vacío)';
            // Retornar temprano si no hay detalles
            return ['valido' => false, 'errores' => $errores];
        }

        // ✅ Validación 2: ¿Coinciden los totales?
        if (!$this->totalesCoincidenConDetalles()) {
            $subtotalCalc = $this->calcularSubtotalDesdeDetalles();
            $subtotalDoc = $this->subtotal ?? 0;
            $diferencia = abs($subtotalCalc - $subtotalDoc);
            $errores[] = "Discrepancia en totales: Calculado={$subtotalCalc}, Documento={$subtotalDoc}, Diferencia={$diferencia}";
        }

        // ✅ Validación 3: ¿Cada detalle tiene datos válidos?
        foreach ($this->detalles as $index => $detalle) {
            $numeroDetalle = $index + 1;

            // Validar cantidad
            if (($detalle->cantidad ?? 0) <= 0) {
                $errores[] = "Detalle #{$numeroDetalle}: cantidad debe ser mayor a 0 (actual: {$detalle->cantidad})";
            }

            // Validar precio unitario no sea negativo
            if (($detalle->precio_unitario ?? 0) < 0) {
                $errores[] = "Detalle #{$numeroDetalle}: precio unitario no puede ser negativo";
            }

            // Validar subtotal no sea negativo
            if (($detalle->subtotal ?? 0) < 0) {
                $errores[] = "Detalle #{$numeroDetalle}: subtotal no puede ser negativo";
            }

            // Validar que subtotal = cantidad × precio_unitario (con tolerancia)
            $subtotalEsperado = ($detalle->cantidad ?? 0) * ($detalle->precio_unitario ?? 0);
            $subtotalReal = $detalle->subtotal ?? 0;
            if (abs($subtotalEsperado - $subtotalReal) > 0.01) {
                $errores[] = "Detalle #{$numeroDetalle}: subtotal inconsistente. Esperado={$subtotalEsperado}, Real={$subtotalReal}";
            }
        }

        return [
            'valido' => empty($errores),
            'errores' => $errores,
        ];
    }

    /**
     * Verificar que el documento puede procesarse (shorthand para validarDetalles)
     *
     * Lanza excepción si la validación falla. Útil en operaciones críticas.
     *
     * @return bool true si es válido
     * @throws \InvalidArgumentException Si la validación falla
     *
     * Ejemplo:
     * $proforma->verificarPuedeConvertirseAVenta();  // Lanza excepción si no es válido
     */
    public function verificarPuedeConvertirseAVenta(): bool
    {
        $validacion = $this->validarDetalles();

        if (!$validacion['valido']) {
            $mensaje = "Documento inválido - No puede procesarse:\n" . implode("\n", $validacion['errores']);
            throw new \InvalidArgumentException($mensaje);
        }

        return true;
    }

    /**
     * Obtener información resumida de los detalles para logging/auditoría
     *
     * @return array Array con estadísticas de detalles
     */
    public function obtenerResumenDetalles(): array
    {
        return [
            'cantidad_detalles' => $this->cantidadDetalles(),
            'subtotal_calculado' => $this->calcularSubtotalDesdeDetalles(),
            'subtotal_documento' => $this->subtotal ?? 0,
            'totales_coinciden' => $this->totalesCoincidenConDetalles(),
            'valido' => $this->validarDetalles()['valido'],
        ];
    }
}

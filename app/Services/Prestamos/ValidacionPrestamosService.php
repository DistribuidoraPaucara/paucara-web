<?php

namespace App\Services\Prestamos;

use App\Models\Prestable;
use App\Models\PrestableStock;
use App\Models\PrestamoCliente;
use App\Models\PrestableCondicion;

/**
 * ValidacionPrestamosService
 *
 * Valida operaciones de préstamos antes de ejecutarlas
 */
class ValidacionPrestamosService
{
    /**
     * Validar si se puede prestar cantidad a cliente
     */
    public function puedoPrestar(int $prestableId, int $almacenId, int $cantidad): array
    {
        $stock = PrestableStock::where('prestable_id', $prestableId)
            ->where('almacenes_prestables_id', $almacenId)
            ->first();

        if (!$stock) {
            return [
                'valido' => false,
                'mensaje' => 'Stock no encontrado',
            ];
        }

        if ($stock->cantidad_disponible < $cantidad) {
            return [
                'valido' => false,
                'mensaje' => "Stock insuficiente. Disponible: {$stock->cantidad_disponible}, solicitado: {$cantidad}",
            ];
        }

        return [
            'valido' => true,
            'mensaje' => 'OK',
            'stock' => $stock,
        ];
    }

    /**
     * Validar si se puede vender cantidad a cliente
     */
    public function puedoVender(int $prestableId, int $almacenId, int $cantidad): array
    {
        return $this->puedoPrestar($prestableId, $almacenId, $cantidad);
    }

    /**
     * Validar si se puede devolver cantidad (por detalle)
     */
    public function puedoDevolver(
        int $detalleId,
        int $cantidadDevuelta,
        int $cantidadDañadaParcial = 0,
        int $cantidadDañadaTotal = 0
    ): array {
        $detalle = \App\Models\PrestamoClienteDetalle::find($detalleId);

        if (!$detalle) {
            return [
                'valido' => false,
                'mensaje' => 'Detalle de préstamo no encontrado',
            ];
        }

        $cantidadTotal = $cantidadDevuelta + $cantidadDañadaParcial + $cantidadDañadaTotal;

        if ($cantidadTotal > $detalle->cantidad_prestada) {
            return [
                'valido' => false,
                'mensaje' => "Cantidad total devuelta ({$cantidadTotal}) excede cantidad prestada ({$detalle->cantidad_prestada})",
            ];
        }

        return [
            'valido' => true,
            'mensaje' => 'OK',
            'detalle' => $detalle,
        ];
    }

    /**
     * Validar si prestable existe y está activo
     */
    public function prestableValido(int $prestableId): array
    {
        $prestable = Prestable::find($prestableId);

        if (!$prestable) {
            return [
                'valido' => false,
                'mensaje' => 'Prestable no encontrado',
            ];
        }

        if (!$prestable->activo) {
            return [
                'valido' => false,
                'mensaje' => 'Prestable inactivo',
            ];
        }

        return [
            'valido' => true,
            'mensaje' => 'OK',
            'prestable' => $prestable,
        ];
    }

    /**
     * Validar condiciones (garantía, daños)
     */
    public function condicionesValidas(int $prestableId): array
    {
        $condicion = PrestableCondicion::where('prestable_id', $prestableId)
            ->where('activo', true)
            ->first();

        if (!$condicion) {
            return [
                'valido' => false,
                'mensaje' => 'Condiciones no configuradas para este prestable',
            ];
        }

        if ($condicion->monto_garantia <= 0) {
            return [
                'valido' => false,
                'mensaje' => 'Monto de garantía no configurado',
            ];
        }

        return [
            'valido' => true,
            'mensaje' => 'OK',
            'condicion' => $condicion,
        ];
    }

    /**
     * Obtener montos a cobrar por daño
     */
    public function obtenerMontosDaño(
        int $prestableId,
        int $cantidadDañadaParcial = 0,
        int $cantidadDañadaTotal = 0
    ): array {
        $condicion = PrestableCondicion::where('prestable_id', $prestableId)
            ->where('activo', true)
            ->first();

        if (!$condicion) {
            return [
                'monto_daño_total_total' => 0,
                'monto_total_daño' => 0,
            ];
        }

        // Sumar daño parcial y daño total en una sola cantidad para calcular daño total
        $cantidadDañadaCompleta = $cantidadDañadaParcial + $cantidadDañadaTotal;
        $montoDañoTotalTotal = $cantidadDañadaCompleta * $condicion->monto_daño_total;

        return [
            'monto_daño_total_total' => $montoDañoTotalTotal,
            'monto_total_daño' => $montoDañoTotalTotal,
        ];
    }

    /**
     * Validar datos para crear préstamo (con múltiples detalles)
     */
    public function datosCreacionPrestamo(array $datos): array
    {
        $errores = [];

        // Validar cliente
        if (!isset($datos['cliente_id'])) {
            $errores[] = 'cliente_id requerido';
        } else {
            $clienteId = is_string($datos['cliente_id']) ? intval($datos['cliente_id']) : $datos['cliente_id'];
            if (!is_int($clienteId) || $clienteId <= 0) {
                $errores[] = 'cliente_id debe ser un número entero válido';
            }
        }

        // Validar detalles (al menos uno)
        if (!isset($datos['detalles']) || !is_array($datos['detalles']) || count($datos['detalles']) === 0) {
            $errores[] = 'detalles requerido (al menos 1)';
        } else {
            foreach ($datos['detalles'] as $i => $detalle) {
                // Validar prestable de cada detalle
                if (!isset($detalle['prestable_id'])) {
                    $errores[] = "detalles[{$i}].prestable_id requerido";
                } else {
                    $prestableId = is_string($detalle['prestable_id']) ? intval($detalle['prestable_id']) : $detalle['prestable_id'];
                    $validacion = $this->prestableValido($prestableId);
                    if (!$validacion['valido']) {
                        $errores[] = "detalles[{$i}]: {$validacion['mensaje']}";
                    }
                }

                // Validar cantidad de cada detalle
                if (!isset($detalle['cantidad'])) {
                    $errores[] = "detalles[{$i}].cantidad requerida";
                } else {
                    $cantidad = is_string($detalle['cantidad']) ? intval($detalle['cantidad']) : $detalle['cantidad'];
                    if ($cantidad <= 0) {
                        $errores[] = "detalles[{$i}].cantidad debe ser > 0";
                    }
                }

                if (!isset($detalle['almacenes_ids']) || !is_array($detalle['almacenes_ids']) || count($detalle['almacenes_ids']) === 0) {
                    $errores[] = "detalles[{$i}].almacenes_ids requerido (al menos 1 almacén)";
                } else {
                    foreach ($detalle['almacenes_ids'] as $j => $almacenId) {
                        $id = is_string($almacenId) ? intval($almacenId) : $almacenId;
                        if (!is_int($id) || $id <= 0) {
                            $errores[] = "detalles[{$i}].almacenes_ids[{$j}] debe ser un id válido";
                        }
                    }
                }
            }
        }

        // Validar tipos
        if (!isset($datos['es_venta'])) {
            $errores[] = 'es_venta requerido';
        } else {
            // Aceptar boolean, string "true"/"false", o número 0/1
            $esVenta = $datos['es_venta'];
            if (is_string($esVenta)) {
                $esVenta = filter_var($esVenta, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($esVenta === null) {
                    $errores[] = 'es_venta debe ser boolean';
                }
            } elseif (!is_bool($esVenta) && !is_int($esVenta)) {
                $errores[] = 'es_venta debe ser boolean';
            }
        }

        // Validar fecha
        if (!isset($datos['fecha_prestamo'])) {
            $errores[] = 'fecha_prestamo requerida';
        }

        // Validar es_evento (opcional)
        if (isset($datos['es_evento'])) {
            $esEvento = $datos['es_evento'];
            if (is_string($esEvento)) {
                $esEvento = filter_var($esEvento, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                if ($esEvento === null) {
                    $errores[] = 'es_evento debe ser boolean';
                }
            } elseif (!is_bool($esEvento) && !is_int($esEvento)) {
                $errores[] = 'es_evento debe ser boolean';
            }
        }

        // Validar teléfonos (opcionales)
        if (isset($datos['telefono_cliente_1']) && !is_null($datos['telefono_cliente_1'])) {
            if (!is_string($datos['telefono_cliente_1'])) {
                $errores[] = 'telefono_cliente_1 debe ser texto';
            } elseif (mb_strlen(trim($datos['telefono_cliente_1'])) > 25) {
                $errores[] = 'telefono_cliente_1 no debe exceder 25 caracteres';
            }
        }

        if (isset($datos['telefono_cliente_2']) && !is_null($datos['telefono_cliente_2'])) {
            if (!is_string($datos['telefono_cliente_2'])) {
                $errores[] = 'telefono_cliente_2 debe ser texto';
            } elseif (mb_strlen(trim($datos['telefono_cliente_2'])) > 25) {
                $errores[] = 'telefono_cliente_2 no debe exceder 25 caracteres';
            }
        }

        return [
            'valido' => count($errores) === 0,
            'errores' => $errores,
        ];
    }

    /**
     * Validar datos para registrar devolución (por detalle)
     */
    public function datosDevolucion(array $datos): array
    {
        $errores = [];

        // Validar prestamo_cliente_id (agregado en la llamada del controlador)
        if (empty($datos['prestamo_cliente_id'])) {
            $errores[] = 'prestamo_cliente_id requerido';
        }

        // Validar fecha
        if (empty($datos['fecha_devolucion'])) {
            $errores[] = 'fecha_devolucion requerida';
        }

        // Validar detalles (array de devoluciones)
        if (!isset($datos['detalles']) || !is_array($datos['detalles']) || count($datos['detalles']) === 0) {
            $errores[] = 'detalles requerido (al menos 1 ítem)';
        } else {
            foreach ($datos['detalles'] as $i => $detalle) {
                // Validar detalle de préstamo
                if (empty($detalle['prestamo_cliente_detalle_id'])) {
                    $errores[] = "detalles[{$i}].prestamo_cliente_detalle_id requerido";
                } else {
                    if (!\App\Models\PrestamoClienteDetalle::find($detalle['prestamo_cliente_detalle_id'])) {
                        $errores[] = "detalles[{$i}].prestamo_cliente_detalle_id: Detalle no encontrado";
                    }
                }

                // Validar cantidad devuelta
                if (!isset($detalle['cantidad_devuelta']) || $detalle['cantidad_devuelta'] < 0) {
                    $errores[] = "detalles[{$i}].cantidad_devuelta requerida y debe ser >= 0";
                }

                // Validar cantidades de daño (default a 0)
                $parcial = $detalle['cantidad_dañada_parcial'] ?? 0;
                $total = $detalle['cantidad_dañada_total'] ?? 0;

                if ($parcial < 0 || $total < 0) {
                    $errores[] = "detalles[{$i}]: Cantidades de daño no pueden ser negativas";
                }

                // Validar que no devuelve más de lo permitido
                $detalleId = $detalle['prestamo_cliente_detalle_id'] ?? null;
                if ($detalleId) {
                    $detallePrestamoCliente = \App\Models\PrestamoClienteDetalle::find($detalleId);
                    if ($detallePrestamoCliente) {
                        $cantidadDevuelta = $detalle['cantidad_devuelta'] ?? 0;
                        $cantidadTotal = $cantidadDevuelta + $parcial + $total;

                        // Calcular cuánto ya ha sido devuelto
                        $cantidadYaDevuelta = $detallePrestamoCliente->devolucionDetalles()
                            ->sum(\Illuminate\Support\Facades\DB::raw('cantidad_devuelta + cantidad_dañada_parcial + cantidad_dañada_total'));

                        $cantidadRestante = $detallePrestamoCliente->cantidad_prestada - $cantidadYaDevuelta;

                        if ($cantidadTotal > $cantidadRestante) {
                            $errores[] = "detalles[{$i}]: Cantidad a devolver ({$cantidadTotal}) excede restante ({$cantidadRestante}). Ya devuelto: {$cantidadYaDevuelta}";
                        }
                    }
                }
            }
        }

        return [
            'valido' => count($errores) === 0,
            'errores' => $errores,
        ];
    }
}

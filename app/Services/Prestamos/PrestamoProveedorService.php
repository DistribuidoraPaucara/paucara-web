<?php

namespace App\Services\Prestamos;

use App\Models\AlmacenPrestable;
use App\Models\PrestamoProveedor;
use App\Models\PrestamoProveedorDetalle;
use App\Models\DevolucionProveedor;
use App\Models\DevolucionProveedorDetalle;
use App\Services\MovimientoPrestableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * PrestamoProveedorService
 *
 * Gestiona préstamos y compras de canastillas/embases de proveedores
 */
class PrestamoProveedorService
{
    private PrestableStockService $stockService;
    private MovimientoPrestableService $movimientoService;

    public function __construct(PrestableStockService $stockService, MovimientoPrestableService $movimientoService)
    {
        $this->stockService = $stockService;
        $this->movimientoService = $movimientoService;
    }

    /**
     * Obtener un almacén de proveedor activo para operar con stock de prestables.
     */
    private function obtenerAlmacenProveedorId(): int
    {
        $almacenId = AlmacenPrestable::proveedores()
            ->where('activo', true)
            ->orderBy('id')
            ->value('id');

        if (!$almacenId) {
            throw new \RuntimeException('No existe un almacén de proveedores activo para registrar el movimiento.');
        }

        return (int) $almacenId;
    }

    /**
     * Registrar préstamo/compra de proveedor
     *
     * @param array $datos
     * {
     *   'prestable_id': int,
     *   'proveedor_id': int,
     *   'cantidad': int,
     *   'es_compra': bool,
     *   'precio_unitario': ?float,
     *   'numero_documento': ?string,
     *   'fecha_prestamo': date,
     *   'fecha_esperada_devolucion': ?date,
     * }
     */
    public function crearPrestamo(array $datos): PrestamoProveedor|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // ✅ NUEVO: Crear registro encabezado de préstamo (sin prestable_id ni cantidad)
                $prestamo = PrestamoProveedor::create([
                    'proveedor_id' => $datos['proveedor_id'],
                    'compra_id' => $datos['compra_id'] ?? null,
                    'es_compra' => $datos['es_compra'],
                    'monto_garantia' => $datos['monto_garantia'] ?? 0,
                    'fecha_prestamo' => $datos['fecha_prestamo'],
                    'fecha_esperada_devolucion' => $datos['fecha_esperada_devolucion'] ?? null,
                    'observaciones' => $datos['observaciones'] ?? null,
                    'estado' => 'ACTIVO',
                ]);

                // ✅ NUEVO: Procesar detalles (múltiples prestables)
                // Usar el almacén seleccionado por el usuario
                $almacenId = $datos['almacen_prestable_id'];
                $detalles = $datos['detalles'] ?? [];

                foreach ($detalles as $detalle) {
                    // ✅ NUEVO: Crear detalle del préstamo
                    PrestamoProveedorDetalle::create([
                        'prestamo_proveedor_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_prestada' => $detalle['cantidad'],
                        'estado' => 'ACTIVO',
                    ]);

                    // Obtener stock ANTES de actualizar
                    $stock = $this->stockService->obtenerStock($detalle['prestable_id'], $almacenId);
                    $disponibleAntes = $stock->cantidad_disponible;
                    $prestamoClienteAntes = $stock->cantidad_prestamo_cliente_activo;
                    $prestamoProveedorAntes = $stock->cantidad_prestamo_proveedor_activo;
                    $vendidaAntes = 0;

                    // Actualizar stock según tipo de operación
                    if ($datos['es_compra']) {
                        // COMPRA: solo incrementa disponible (no es deuda)
                        $this->stockService->incrementarStockInicial(
                            $detalle['prestable_id'],
                            $almacenId,
                            $detalle['cantidad']
                        );
                    } else {
                        // PRÉSTAMO: incrementa disponible para operar y deuda activa con proveedor
                        $this->stockService->recibirPrestamoProveedor(
                            $detalle['prestable_id'],
                            $almacenId,
                            $detalle['cantidad']
                        );
                    }

                    // Obtener stock DESPUÉS de actualizar
                    $stock->refresh();

                    // Registrar movimiento de entrada de préstamo de proveedor
                    $this->movimientoService->registrarMovimiento([
                        'prestable_stock_id' => $stock->id,
                        'almacenes_prestables_id' => $almacenId,
                        'usuario_id' => Auth::id(),
                        'tipo' => 'ENTRADA',
                        'cantidad' => $detalle['cantidad'],
                        'disponible_anterior' => $disponibleAntes,
                        'prestamo_cliente_anterior' => $prestamoClienteAntes,
                        'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                        'vendida_anterior' => $vendidaAntes,
                        'disponible_posterior' => $stock->cantidad_disponible,
                        'prestamo_cliente_posterior' => $stock->cantidad_prestamo_cliente_activo,
                        'prestamo_proveedor_posterior' => $stock->cantidad_prestamo_proveedor_activo,
                        'vendida_posterior' => 0,
                        'categoria_afectada' => 'prestamo_proveedor',
                        'motivo' => $datos['es_compra'] ? 'Compra de prestable' : 'Préstamo de proveedor',
                        'numero_referencia' => $prestamo->id,
                        'referencia_tipo' => 'PRESTAMO_PROVEEDOR',
                        'referencia_id' => $prestamo->id,
                    ]);

                    Log::info('✅ Detalle de préstamo de proveedor registrado', [
                        'prestamo_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad' => $detalle['cantidad'],
                    ]);
                }

                Log::info('✅ Préstamo de proveedor registrado', [
                    'prestamo_id' => $prestamo->id,
                    'proveedor_id' => $datos['proveedor_id'],
                    'cantidad_detalles' => count($detalles),
                    'es_compra' => $datos['es_compra'],
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando préstamo de proveedor', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Registrar devolución al proveedor (parcial o total)
     *
     * @param array $datos
     * {
     *   'prestamo_proveedor_detalle_id': int,
     *   'cantidad_devuelta': int,
     *   'observaciones': ?string,
     *   'fecha_devolucion': date,
     * }
     */
    /**
     * Registrar devolución de proveedor con múltiples detalles
     * Estructura: devolucion_proveedor (cabecera) → devolucion_proveedor_detalle (detalles)
     */
    public function registrarDevolucion(array $datos): DevolucionProveedor|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // Validar que prestamo existe
                $prestamo = PrestamoProveedor::find($datos['prestamo_proveedor_id']);
                if (!$prestamo) {
                    throw new \Exception('Préstamo de proveedor no encontrado');
                }

                // Usar un almacén de proveedor activo real
                $almacenId = $this->obtenerAlmacenProveedorId();

                // Crear encabezado de devolución
                $devolucion = DevolucionProveedor::create([
                    'prestamo_proveedor_id' => $datos['prestamo_proveedor_id'],
                    'fecha_devolucion' => $datos['fecha_devolucion'],
                    'monto_cobrado_daño_total' => (float) ($datos['monto_cobrado_daño_total'] ?? 0),
                    'monto_garantia_devuelta_total' => 0, // Se calculará de los detalles
                    'observaciones' => $datos['observaciones'] ?? null,
                ]);

                $detalles = $datos['detalles'] ?? [];
                $montoGarantiaTotal = 0;

                // Procesar cada detalle de devolución
                foreach ($detalles as $detalleData) {
                    $detalle = PrestamoProveedorDetalle::find($detalleData['prestamo_proveedor_detalle_id']);

                    if (!$detalle) {
                        throw new \Exception('Detalle de préstamo no encontrado: ' . $detalleData['prestamo_proveedor_detalle_id']);
                    }

                    $cantidadDevuelta = $detalleData['cantidad_devuelta'] ?? 0;
                    $cantidadDañadaTotal = $detalleData['cantidad_dañada_total'] ?? 0;

                    // ✅ SIMPLIFICADO: cantidad_devuelta es el TOTAL, cantidad_dañada_total es información dentro de ese total
                    // Calcular cuánto ya ha sido devuelto previamente
                    $cantidadYaDevuelta = $detalle->devolucionDetalles()
                        ->sum('cantidad_devuelta');

                    $cantidadRestante = $detalle->cantidad_prestada - $cantidadYaDevuelta;

                    // Validar que no devuelve más de lo que queda
                    if ($cantidadDevuelta > $cantidadRestante) {
                        throw new \Exception("Cantidad a devolver ({$cantidadDevuelta}) excede cantidad restante ({$cantidadRestante})");
                    }

                    // Crear detalle de devolución
                    DevolucionProveedorDetalle::create([
                        'devolucion_proveedor_id' => $devolucion->id,
                        'prestamo_proveedor_detalle_id' => $detalle->id,
                        'fecha_devolucion' => $datos['fecha_devolucion'],
                        'cantidad_devuelta' => $cantidadDevuelta,
                        'cantidad_dañada_parcial' => 0,
                        'cantidad_dañada_total' => $cantidadDañadaTotal,
                        'monto_cobrado_daño' => 0,
                        'monto_garantia_devuelta' => 0,
                    ]);

                    // ✅ Registrar movimiento si hay cantidad devuelta
                    if ($cantidadDevuelta > 0) {
                        $stockAntes = $this->stockService->obtenerStock($detalle->prestable_id, $almacenId);
                        $disponibleAntes = $stockAntes->cantidad_disponible;
                        $prestamoClienteAntes = $stockAntes->cantidad_prestamo_cliente_activo;
                        $prestamoProveedorAntes = $stockAntes->cantidad_prestamo_proveedor_activo;
                        $vendidaAntes = 0;

                        // Procesar devolución en stock
                        $this->stockService->devolverAlProveedor(
                            $detalle->prestable_id,
                            $almacenId,
                            $cantidadDevuelta,
                            $cantidadDañadaTotal
                        );

                        $stockAntes->refresh();

                        // Registrar movimiento
                        $this->movimientoService->registrarMovimiento([
                            'prestable_stock_id' => $stockAntes->id,
                            'almacenes_prestables_id' => $almacenId,
                            'usuario_id' => Auth::id(),
                            'tipo' => 'SALIDA',
                            'cantidad' => -$cantidadDevuelta,
                            'cantidad_dañada_total' => $cantidadDañadaTotal,
                            'disponible_anterior' => $disponibleAntes,
                            'prestamo_cliente_anterior' => $prestamoClienteAntes,
                            'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                            'vendida_anterior' => $vendidaAntes,
                            'disponible_posterior' => $stockAntes->cantidad_disponible,
                            'prestamo_cliente_posterior' => $stockAntes->cantidad_prestamo_cliente_activo,
                            'prestamo_proveedor_posterior' => $stockAntes->cantidad_prestamo_proveedor_activo,
                            'vendida_posterior' => 0,
                            'categoria_afectada' => 'prestamo_proveedor',
                            'motivo' => 'Devolución a proveedor',
                            'numero_referencia' => $prestamo->id,
                            'referencia_tipo' => 'DEVOLUCION_PROVEEDOR',
                            'referencia_id' => $devolucion->id,
                            'observaciones' => trim(
                                'Devueltas: ' . $cantidadDevuelta .
                                ($cantidadDañadaTotal > 0 ? ' | Información daño: ' . $cantidadDañadaTotal : '') .
                                (!empty($datos['observaciones']) ? ' | ' . $datos['observaciones'] : '')
                            ),
                        ]);

                        Log::info('✅ Movimiento de devolución registrado', [
                            'prestamo_id' => $prestamo->id,
                            'prestable_id' => $detalle->prestable_id,
                            'cantidad_devuelta_total' => $cantidadDevuelta,
                            'cantidad_dañada_información' => $cantidadDañadaTotal,
                        ]);
                    }

                    // Calcular TOTAL DEVUELTO para actualizar estado
                    $totalDevueltoAhora = $detalle->devolucionDetalles()
                        ->sum('cantidad_devuelta');

                    // Actualizar estado del detalle
                    if ($totalDevueltoAhora >= $detalle->cantidad_prestada) {
                        $detalle->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                    } else {
                        $detalle->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                    }
                }

                // Actualizar monto_garantia_devuelta_total en la cabecera
                $devolucion->update(['monto_garantia_devuelta_total' => $montoGarantiaTotal]);

                // Actualizar estado del encabezado si todos los detalles están devueltos
                $todosDevueltos = $prestamo->detalles()
                    ->where('estado', '!=', 'COMPLETAMENTE_DEVUELTO')
                    ->count() === 0;

                if ($todosDevueltos) {
                    $prestamo->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                } else {
                    $prestamo->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                }

                Log::info('✅ Devolución a proveedor registrada', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_proveedor_id' => $datos['prestamo_proveedor_id'],
                    'cantidad_detalles' => count($detalles),
                ]);

                return $devolucion->load('detalles');
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución a proveedor', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Obtener préstamos activos de un proveedor
     */
    public function obtenerPrestamosActivos(int $proveedorId): array
    {
        return PrestamoProveedor::where('proveedor_id', $proveedorId)
            ->where('estado', 'ACTIVO')
            ->with(['detalles.prestable', 'detalles.devolucionDetalles'])
            ->get()
            ->toArray();
    }

    /**
     * Obtener deuda total a un proveedor
     */
    public function obtenerDeudaTotal(int $proveedorId): float
    {
        $prestamosActivos = PrestamoProveedor::where('proveedor_id', $proveedorId)
            ->whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->with(['detalles.devolucionDetalles'])
            ->get();

        $deudaTotal = 0;

        foreach ($prestamosActivos as $prestamo) {
            // ✅ NUEVO: Iterar detalles para calcular deuda
            foreach ($prestamo->detalles as $detalle) {
                // Cantidad aún pendiente de devolver en este detalle
                $totalDevueltoDetalle = $detalle->devolucionDetalles->sum('cantidad_devuelta');
                $pendiente = $detalle->cantidad_prestada - $totalDevueltoDetalle;

                // Si es compra, se cobra por cada canastilla
                if ($prestamo->es_compra && $detalle->precio_unitario) {
                    $deudaTotal += $pendiente * $detalle->precio_unitario;
                }
            }
        }

        return $deudaTotal;
    }

    /**
     * Obtener resumen de préstamo
     */
    public function obtenerResumen(int $prestamoId): array|false
    {
        $prestamo = PrestamoProveedor::with(['detalles.devolucionDetalles', 'detalles.prestable'])->find($prestamoId);

        if (!$prestamo) {
            return false;
        }

        // ✅ NUEVO: Calcular totales de todos los detalles
        $cantidadTotal = 0;
        $totalDevuelto = 0;
        $montoDeuda = 0;

        foreach ($prestamo->detalles as $detalle) {
            $cantidadTotal += $detalle->cantidad_prestada;
            $totalDevueltoDetalle = $detalle->devolucionDetalles->sum('cantidad_devuelta');
            $totalDevuelto += $totalDevueltoDetalle;
            $pendiente = $detalle->cantidad_prestada - $totalDevueltoDetalle;

            if ($prestamo->es_compra && $detalle->precio_unitario) {
                $montoDeuda += $pendiente * $detalle->precio_unitario;
            }
        }

        $pendiente = $cantidadTotal - $totalDevuelto;

        return [
            'prestamo' => $prestamo,
            'cantidad_original' => $cantidadTotal,
            'cantidad_devuelta' => $totalDevuelto,
            'cantidad_pendiente' => $pendiente,
            'devoluciones' => $prestamo->detalles->flatMap(fn($d) => $d->devoluciones),
            'estado' => $prestamo->estado,
            'monto_deuda' => $montoDeuda,
        ];
    }

    /**
     * Anular préstamo a proveedor
     * Devuelve automáticamente el stock al almacén
     */
    public function anularPrestamo(int $prestamoId, ?string $razonAnulacion = null): PrestamoProveedor|false
    {
        try {
            return DB::transaction(function () use ($prestamoId, $razonAnulacion) {
                $prestamo = PrestamoProveedor::with(['detalles', 'detalles.devolucionDetalles'])->find($prestamoId);

                if (!$prestamo) {
                    throw new \Exception('Préstamo a proveedor no encontrado');
                }

                // No permitir anular un préstamo que ya está cancelado
                if ($prestamo->estado === 'CANCELADO') {
                    throw new \Exception('El préstamo ya está cancelado');
                }

                // Devolver stock para cada detalle usando un almacén de proveedor activo real
                $almacenId = $this->obtenerAlmacenProveedorId();

                foreach ($prestamo->detalles as $detalle) {
                    // Si el detalle aún no está completamente devuelto, devolver lo que falta
                    if ($detalle->estado !== 'COMPLETAMENTE_DEVUELTO') {
                        // Calcular cantidad devuelta consultando la BD directamente
                        try {
                            $devolutions = DevolucionProveedorDetalle::where('prestamo_proveedor_detalle_id', $detalle->id)->get();
                            $totalDevuelto = 0;
                            foreach ($devolutions as $dev) {
                                $totalDevuelto += $dev->cantidad_devuelta + $dev->cantidad_dañada_parcial + $dev->cantidad_dañada_total;
                            }
                        } catch (\Exception $ex) {
                            Log::warning('⚠️ Error calculando devoluciones', ['error' => $ex->getMessage()]);
                            $totalDevuelto = 0;
                        }

                        $cantidadPendiente = $detalle->cantidad_prestada - $totalDevuelto;

                        if ($cantidadPendiente > 0) {
                            // Obtener stock ANTES de devolver
                            $stock = $this->stockService->obtenerStock($detalle->prestable_id, $almacenId);
                            $disponibleAntes = $stock->cantidad_disponible;
                            $prestamoClienteAntes = $stock->cantidad_prestamo_cliente_activo;
                            $prestamoProveedorAntes = $stock->cantidad_prestamo_proveedor_activo;
                            $vendidaAntes = 0;

                            // Devolver al proveedor (reduce cantidad_disponible y cantidad_prestamo_proveedor_activo)
                            $this->stockService->devolverAlProveedor(
                                $detalle->prestable_id,
                                $almacenId,
                                $cantidadPendiente,
                                0, // sin daño parcial
                                0  // sin daño total
                            );

                            // Obtener stock DESPUÉS de devolver
                            $stock->refresh();

                            // Registrar movimiento de devolución por anulación
                            $this->movimientoService->registrarMovimiento([
                                'prestable_stock_id' => $stock->id,
                                'almacenes_prestables_id' => $almacenId,
                                'usuario_id' => Auth::id(),
                                'tipo' => 'SALIDA',
                                'cantidad' => -$cantidadPendiente,
                                'disponible_anterior' => $disponibleAntes,
                                'prestamo_cliente_anterior' => $prestamoClienteAntes,
                                'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
                                'vendida_anterior' => $vendidaAntes,
                                'disponible_posterior' => $stock->cantidad_disponible,
                                'prestamo_cliente_posterior' => $stock->cantidad_prestamo_cliente_activo,
                                'prestamo_proveedor_posterior' => $stock->cantidad_prestamo_proveedor_activo,
                                'vendida_posterior' => 0,
                                'categoria_afectada' => 'prestamo_proveedor',
                                'motivo' => 'Devolución por anulación de préstamo',
                                'numero_referencia' => $prestamo->id,
                                'referencia_tipo' => 'PRESTAMO_PROVEEDOR_ANULADO',
                                'referencia_id' => $prestamo->id,
                                'observaciones' => $razonAnulacion,
                            ]);

                            // Actualizar estado del detalle a CANCELADO (se devolvió todo por anulación)
                            $detalle->update(['estado' => 'CANCELADO']);
                        }
                    }
                }

                // Actualizar estado del préstamo a CANCELADO
                $prestamo->update(['estado' => 'CANCELADO']);

                Log::info('✅ Préstamo a proveedor anulado correctamente', [
                    'prestamo_id' => $prestamo->id,
                    'razon_anulacion' => $razonAnulacion,
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando préstamo a proveedor', [
                'error' => $e->getMessage(),
                'prestamo_id' => $prestamoId,
            ]);
            return false;
        }
    }
}

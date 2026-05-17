<?php

namespace App\Services\Prestamos;

use App\Models\PrestamoEvento;
use App\Models\PrestamoEventoDetalle;
use App\Models\DevolucionEvento;
use App\Models\DevolucionEventoDetalle;
use App\Models\PrestableStock;
use App\Services\MovimientoPrestableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * PrestamoEventoService
 *
 * Gestiona préstamos y devoluciones de canastillas/embases a eventos
 * Similar a PrestamoClienteService pero con tablas separadas
 */
class PrestamoEventoService
{
    private PrestableStockService $stockService;
    private MovimientoPrestableService $movimientoService;

    public function __construct(PrestableStockService $stockService, MovimientoPrestableService $movimientoService)
    {
        $this->stockService = $stockService;
        $this->movimientoService = $movimientoService;
    }

    /**
     * Crear préstamo a evento con múltiples detalles
     *
     * @param array $datos
     * {
     *   'evento_id': ?int,
     *   'nombre_evento': string,
     *   'chofer_id': ?int,
     *   'monto_garantia': ?float,
     *   'fecha_prestamo': date,
     *   'fecha_esperada_devolucion': ?date,
     *   'almacen_id': int,
     *   'detalles': [
     *     {
     *       'prestable_id': int,
     *       'cantidad': int,
     *     },
     *     ...
     *   ]
     * }
     */
    public function crearPrestamo(array $datos): PrestamoEvento|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                $montoGarantia = (float) ($datos['monto_garantia'] ?? 0);
                $cantidadTotal = 0;

                // Crear registro encabezado de préstamo
                $prestamo = PrestamoEvento::create([
                    'evento_id' => $datos['evento_id'] ?? null,
                    'nombre_evento' => $datos['nombre_evento'],
                    'chofer_id' => $datos['chofer_id'] ?? null,
                    'cantidad' => 0, // Se actualiza después
                    'monto_garantia' => $montoGarantia,
                    'fecha_prestamo' => $datos['fecha_prestamo'],
                    'fecha_esperada_devolucion' => $datos['fecha_esperada_devolucion'] ?? null,
                    'estado' => 'ACTIVO',
                ]);

                // Crear detalles y actualizar stock
                $almacenId = $datos['almacen_id'] ?? 1; // Default a distribuidora
                $detalles = $datos['detalles'] ?? [];

                foreach ($detalles as $detalle) {
                    PrestamoEventoDetalle::create([
                        'prestamo_evento_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_prestada' => $detalle['cantidad'],
                        'monto_garantia' => 0, // Será calculado si es necesario
                        'estado' => 'ACTIVO',
                    ]);

                    $cantidadTotal += $detalle['cantidad'];

                    // Obtener stock antes de actualizar
                    $stock = PrestableStock::where('prestable_id', $detalle['prestable_id'])
                        ->where('almacenes_prestables_id', $almacenId)
                        ->first();

                    if ($stock) {
                        $eventoActivoAntes = $stock->cantidad_prestamo_evento_activo;
                        $disponibleAntes = $stock->cantidad_disponible;

                        // Actualizar stock: move from disponible to evento_activo
                        $stock->update([
                            'cantidad_disponible' => max(0, $stock->cantidad_disponible - $detalle['cantidad']),
                            'cantidad_prestamo_evento_activo' => $stock->cantidad_prestamo_evento_activo + $detalle['cantidad'],
                        ]);

                        // Registrar movimiento
                        $this->movimientoService->registrarMovimiento([
                            'prestable_id' => $detalle['prestable_id'],
                            'almacen_id' => $almacenId,
                            'tipo' => 'PRESTAMO_EVENTO',
                            'cantidad_antes' => $disponibleAntes,
                            'cantidad_despues' => $stock->cantidad_disponible,
                            'referencia_id' => $prestamo->id,
                            'observaciones' => "Préstamo a evento: {$datos['nombre_evento']}",
                        ]);

                        Log::info('✅ Préstamo a evento creado', [
                            'prestamo_evento_id' => $prestamo->id,
                            'prestable_id' => $detalle['prestable_id'],
                            'cantidad' => $detalle['cantidad'],
                            'evento' => $datos['nombre_evento'],
                        ]);
                    }
                }

                // Actualizar cantidad total en encabezado
                $prestamo->update(['cantidad' => $cantidadTotal]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error creando préstamo a evento', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);

            return false;
        }
    }

    /**
     * Registrar devolución de evento
     *
     * @param array $datos
     * {
     *   'prestamo_evento_id': int,
     *   'fecha_devolucion': date,
     *   'chofer_id': ?int,
     *   'monto_cobrado_daño_total': float,
     *   'monto_garantia_devuelta_total': float,
     *   'observaciones': ?string,
     *   'almacen_id': int,
     *   'detalles': [
     *     {
     *       'prestamo_evento_detalle_id': int,
     *       'cantidad_devuelta': int,
     *       'cantidad_dañada_parcial': int,
     *       'cantidad_dañada_total': int,
     *       'monto_cobrado_daño': float,
     *       'monto_garantia_devuelta': float,
     *     },
     *     ...
     *   ]
     * }
     */
    public function registrarDevolucion(array $datos): DevolucionEvento|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                $prestamo = PrestamoEvento::findOrFail($datos['prestamo_evento_id']);

                // Crear encabezado de devolución
                $devolucion = DevolucionEvento::create([
                    'prestamo_evento_id' => $prestamo->id,
                    'fecha_devolucion' => $datos['fecha_devolucion'],
                    'cantidad_total_devuelta' => 0, // Se calcula
                    'monto_cobrado_daño_total' => (float) ($datos['monto_cobrado_daño_total'] ?? 0),
                    'monto_garantia_devuelta_total' => (float) ($datos['monto_garantia_devuelta_total'] ?? 0),
                    'observaciones' => $datos['observaciones'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                ]);

                $almacenId = $datos['almacen_id'] ?? 1;
                $cantidadDevueltaTotal = 0;

                // Procesar detalles de devolución
                foreach ($datos['detalles'] ?? [] as $detalle) {
                    $prestamoDetalle = PrestamoEventoDetalle::findOrFail($detalle['prestamo_evento_detalle_id']);

                    DevolucionEventoDetalle::create([
                        'devolucion_evento_id' => $devolucion->id,
                        'prestamo_evento_detalle_id' => $prestamoDetalle->id,
                        'cantidad_devuelta' => $detalle['cantidad_devuelta'],
                        'cantidad_dañada_parcial' => $detalle['cantidad_dañada_parcial'] ?? 0,
                        'cantidad_dañada_total' => $detalle['cantidad_dañada_total'] ?? 0,
                        'monto_cobrado_daño' => (float) ($detalle['monto_cobrado_daño'] ?? 0),
                        'monto_garantia_devuelta' => (float) ($detalle['monto_garantia_devuelta'] ?? 0),
                    ]);

                    $cantidadDevueltaTotal += $detalle['cantidad_devuelta'];

                    // Actualizar stock: move from evento_activo to evento_devuelto + disponible
                    $stock = PrestableStock::where('prestable_id', $prestamoDetalle->prestable_id)
                        ->where('almacenes_prestables_id', $almacenId)
                        ->first();

                    if ($stock) {
                        $eventoActivoAntes = $stock->cantidad_prestamo_evento_activo;

                        $stock->update([
                            'cantidad_prestamo_evento_activo' => max(0, $stock->cantidad_prestamo_evento_activo - $detalle['cantidad_devuelta']),
                            'cantidad_prestamo_evento_devuelto' => $stock->cantidad_prestamo_evento_devuelto + $detalle['cantidad_devuelta'],
                            // Las dañadas no retornan a disponible
                            'cantidad_disponible' => $stock->cantidad_disponible + $detalle['cantidad_devuelta'],
                        ]);

                        // Registrar movimiento
                        $this->movimientoService->registrarMovimiento([
                            'prestable_id' => $prestamoDetalle->prestable_id,
                            'almacen_id' => $almacenId,
                            'tipo' => 'DEVOLUCION_EVENTO',
                            'cantidad_antes' => $eventoActivoAntes,
                            'cantidad_despues' => $stock->cantidad_prestamo_evento_activo,
                            'referencia_id' => $devolucion->id,
                            'observaciones' => "Devolución evento: {$detalle['cantidad_devuelta']} devuelto(s), {$detalle['cantidad_dañada_total']} dañado(s)",
                        ]);

                        Log::info('✅ Devolución de evento registrada', [
                            'devolucion_evento_id' => $devolucion->id,
                            'prestable_id' => $prestamoDetalle->prestable_id,
                            'cantidad_devuelta' => $detalle['cantidad_devuelta'],
                        ]);
                    }
                }

                // Actualizar cantidad total
                $devolucion->update(['cantidad_total_devuelta' => $cantidadDevueltaTotal]);

                // Actualizar estado del préstamo si es completamente devuelto
                $detallesPendientes = PrestamoEventoDetalle::where('prestamo_evento_id', $prestamo->id)
                    ->where('estado', 'ACTIVO')
                    ->count();

                if ($detallesPendientes === 0) {
                    $prestamo->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                } else {
                    $prestamo->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                }

                return $devolucion;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución de evento', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);

            return false;
        }
    }

    /**
     * Obtener resumen de un préstamo a evento
     */
    public function obtenerResumen(int $prestamoEventoId): array|null
    {
        $prestamo = PrestamoEvento::with('detalles.prestable', 'devoluciones.detalles')
            ->find($prestamoEventoId);

        if (!$prestamo) {
            return null;
        }

        $detalles = [];
        $totalPrestado = 0;
        $totalDevuelto = 0;
        $totalEnCampo = 0;

        foreach ($prestamo->detalles as $detalle) {
            $cantidadPrestada = $detalle->cantidad_prestada;
            $cantidadDevuelta = $detalle->devoluciones->sum('cantidad_devuelta');
            $cantidadEnCampo = $cantidadPrestada - $cantidadDevuelta;

            $totalPrestado += $cantidadPrestada;
            $totalDevuelto += $cantidadDevuelta;
            $totalEnCampo += $cantidadEnCampo;

            $detalles[] = [
                'prestable_id' => $detalle->prestable_id,
                'prestable_nombre' => $detalle->prestable->nombre,
                'cantidad_prestada' => $cantidadPrestada,
                'cantidad_devuelta' => $cantidadDevuelta,
                'cantidad_en_campo' => $cantidadEnCampo,
            ];
        }

        return [
            'prestamo_evento_id' => $prestamo->id,
            'nombre_evento' => $prestamo->nombre_evento,
            'fecha_prestamo' => $prestamo->fecha_prestamo,
            'fecha_esperada_devolucion' => $prestamo->fecha_esperada_devolucion,
            'estado' => $prestamo->estado,
            'cantidad_total_prestada' => $totalPrestado,
            'cantidad_total_devuelta' => $totalDevuelto,
            'cantidad_en_campo' => $totalEnCampo,
            'detalles' => $detalles,
        ];
    }
}

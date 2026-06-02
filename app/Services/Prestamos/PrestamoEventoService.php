<?php

namespace App\Services\Prestamos;

use App\Models\Cliente;
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
     *   'venta_id': ?int,
     *   'nombre_evento': string,
     *   'encargado_evento': ?string,
     *   'vehiculo_asignado': ?string,
     *   'direccion_evento': ?string,
     *   'telefono_uno': ?string,
     *   'telefono_dos': ?string,
     *   'chofer_id': ?int,
     *   'monto_garantia': ?float,
     *   'fecha_prestamo': date,
     *   'fecha_entrega': ?date,
     *   'fecha_esperada_devolucion': ?date,
     *   'detalles': [
     *     {
     *       'prestable_id': int,
     *       'cantidad': int,
     *       'almacenes_ids': [int, ...]
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

                // Cliente fijo para eventos: id=51
                $clienteEventosId = 51;

                // Crear registro encabezado de préstamo
                $prestamo = PrestamoEvento::create([
                    'evento_id' => $datos['evento_id'] ?? null,
                    'cliente_id' => $clienteEventosId,
                    'venta_id' => $datos['venta_id'] ?? null,
                    'nombre_evento' => $datos['nombre_evento'],
                    'encargado_evento' => $datos['encargado_evento'] ?? null,
                    'vehiculo_asignado' => $datos['vehiculo_asignado'] ?? null,
                    'direccion_evento' => $datos['direccion_evento'] ?? null,
                    'telefono_uno' => $datos['telefono_uno'] ?? null,
                    'telefono_dos' => $datos['telefono_dos'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                    'cantidad' => 0, // Se actualiza después
                    'monto_garantia' => $montoGarantia,
                    'fecha_prestamo' => $datos['fecha_prestamo'],
                    'fecha_entrega' => $datos['fecha_entrega'] ?? null,
                    'fecha_esperada_devolucion' => $datos['fecha_esperada_devolucion'] ?? null,
                    'estado' => 'ACTIVO',
                ]);

                Log::info('✅ Cliente EVENTOS asignado automáticamente', [
                    'prestamo_evento_id' => $prestamo->id,
                    'cliente_id' => $clienteEventosId,
                ]);


                // Crear detalles y actualizar stock
                $detalles = $datos['detalles'] ?? [];

                foreach ($detalles as $detalle) {
                    $almacenesIds = array_values(array_filter(array_map('intval', (array)($detalle['almacenes_ids'] ?? []))));

                    PrestamoEventoDetalle::create([
                        'prestamo_evento_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_prestada' => $detalle['cantidad'],
                        'almacenes_ids' => !empty($almacenesIds) ? $almacenesIds : null,
                        'monto_garantia' => 0,
                        'estado' => 'ACTIVO',
                    ]);

                    $cantidadTotal += $detalle['cantidad'];

                    // Consumir stock de los almacenes seleccionados
                    $almacenesIds = $detalle['almacenes_ids'] ?? [];
                    $cantidadRestante = $detalle['cantidad'];

                    foreach ($almacenesIds as $almacenId) {
                        if ($cantidadRestante <= 0) {
                            break;
                        }

                        $stock = PrestableStock::where('prestable_id', $detalle['prestable_id'])
                            ->where('almacenes_prestables_id', $almacenId)
                            ->first();

                        if (!$stock || (int) $stock->cantidad_disponible <= 0) {
                            continue;
                        }

                        $cantidadATomar = min($cantidadRestante, (int) $stock->cantidad_disponible);
                        $disponibleAntes = $stock->cantidad_disponible;

                        // Actualizar stock
                        $stock->update([
                            'cantidad_disponible' => $stock->cantidad_disponible - $cantidadATomar,
                            'cantidad_evento_deudor' => $stock->cantidad_evento_deudor + $cantidadATomar,
                        ]);

                        // Obtener stock actualizado
                        $stock->refresh();
                        $disponibleDespues = $stock->cantidad_disponible;
                        $eventoDeudorDespues = $stock->cantidad_evento_deudor;

                        // Registrar movimiento
                        $this->movimientoService->registrarMovimiento([
                            'prestable_stock_id' => $stock->id,
                            'almacenes_prestables_id' => $almacenId,
                            'tipo' => 'CONSUMO_RESERVA',
                            'cantidad' => -$cantidadATomar,
                            'disponible_anterior' => $disponibleAntes,
                            'disponible_posterior' => $disponibleDespues,
                            'categoria_afectada' => 'prestamo_evento',
                            'motivo' => 'Préstamo a evento',
                            'observaciones' => "Préstamo a evento: {$datos['nombre_evento']}",
                            'referencia_tipo' => 'PRESTAMO_EVENTO',
                            'referencia_id' => $prestamo->id,
                        ]);

                        $cantidadRestante -= $cantidadATomar;

                        Log::info('✅ Stock consumido para préstamo a evento', [
                            'prestamo_evento_id' => $prestamo->id,
                            'prestable_id' => $detalle['prestable_id'],
                            'almacen_id' => $almacenId,
                            'cantidad' => $cantidadATomar,
                        ]);
                    }

                    if ($cantidadRestante > 0) {
                        throw new \Exception("Stock insuficiente en almacenes seleccionados. Solicitado: {$detalle['cantidad']}, disponible: " . ($detalle['cantidad'] - $cantidadRestante));
                    }
                }

                // Actualizar cantidad total en encabezado
                $prestamo->update(['cantidad' => $cantidadTotal]);

                Log::info('✅ Préstamo a evento creado exitosamente', [
                    'prestamo_evento_id' => $prestamo->id,
                    'nombre_evento' => $datos['nombre_evento'],
                    'cantidad_total' => $cantidadTotal,
                ]);

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
                        $eventoActivoAntes = $stock->cantidad_evento_deudor;

                        $stock->update([
                            'cantidad_evento_deudor' => max(0, $stock->cantidad_evento_deudor - $detalle['cantidad_devuelta']),
                            'cantidad_evento_devuelto' => $stock->cantidad_evento_devuelto + $detalle['cantidad_devuelta'],
                            // Las dañadas no retornan a disponible
                            'cantidad_disponible' => $stock->cantidad_disponible + $detalle['cantidad_devuelta'],
                        ]);

                        // Registrar movimiento
                        $this->movimientoService->registrarMovimiento([
                            'prestable_id' => $prestamoDetalle->prestable_id,
                            'almacen_id' => $almacenId,
                            'tipo' => 'DEVOLUCION_EVENTO',
                            'cantidad_antes' => $eventoActivoAntes,
                            'cantidad_despues' => $stock->cantidad_evento_deudor,
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

    /**
     * Anular préstamo a evento
     *
     * Devuelve automáticamente todos los prestables al almacén de origen
     */
    public function anularPrestamo(int $prestamoEventoId, ?string $razonAnulacion = null): PrestamoEvento|false
    {
        try {
            return DB::transaction(function () use ($prestamoEventoId, $razonAnulacion) {
                $prestamo = PrestamoEvento::with('detalles')->find($prestamoEventoId);

                if (!$prestamo) {
                    throw new \Exception('Préstamo a evento no encontrado');
                }

                if ($prestamo->estado === 'CANCELADO') {
                    throw new \Exception('El préstamo ya está cancelado');
                }

                foreach ($prestamo->detalles as $detalle) {
                    // Buscar todos los stocks de este prestable
                    $stocks = PrestableStock::where('prestable_id', $detalle->prestable_id)->get();

                    foreach ($stocks as $stock) {
                        if ((int) $stock->cantidad_evento_deudor > 0) {
                            $cantidadADevolver = (int) $stock->cantidad_evento_deudor;
                            $disponibleAntes = (int) $stock->cantidad_disponible;

                            // Devolver al disponible
                            $stock->update([
                                'cantidad_evento_deudor' => 0,
                                'cantidad_disponible' => $stock->cantidad_disponible + $cantidadADevolver,
                            ]);

                            $stock->refresh();
                            $disponibleDespues = (int) $stock->cantidad_disponible;

                            // Registrar movimiento
                            $this->movimientoService->registrarMovimiento([
                                'prestable_stock_id' => $stock->id,
                                'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                                'tipo' => 'ANULACION_EVENTO',
                                'cantidad' => $cantidadADevolver,
                                'disponible_anterior' => $disponibleAntes,
                                'disponible_posterior' => $disponibleDespues,
                                'categoria_afectada' => 'anulacion_evento',
                                'motivo' => 'Anulación de préstamo a evento',
                                'observaciones' => $razonAnulacion ?? 'Sin descripción',
                                'referencia_tipo' => 'PRESTAMO_EVENTO',
                                'referencia_id' => $prestamo->id,
                            ]);
                        }
                    }

                    // Marcar detalle como cancelado
                    $detalle->update(['estado' => 'CANCELADO']);
                }

                // Actualizar estado del préstamo
                $prestamo->update(['estado' => 'CANCELADO']);

                Log::info('✅ Préstamo a evento anulado exitosamente', [
                    'prestamo_evento_id' => $prestamo->id,
                    'razon' => $razonAnulacion,
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando préstamo a evento', [
                'error' => $e->getMessage(),
                'prestamo_evento_id' => $prestamoEventoId,
            ]);

            return false;
        }
    }
}

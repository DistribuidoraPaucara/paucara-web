<?php

namespace App\Services\Prestamos;

use App\Models\PrestamoCliente;
use App\Models\PrestamoClienteDetalle;
use App\Models\DevolucionCliente;
use App\Models\DevolucionClienteDetalle;
use App\Models\PrestableCondicion;
use App\Models\PrestableStock;
use App\Models\AlmacenPrestable;
use App\Services\Prestamos\PrestableStockAdvancedService;
use App\Services\MovimientoPrestableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * PrestamoClienteService
 *
 * Gestiona préstamos y devoluciones de canastillas/embases a clientes
 */
class PrestamoClienteService
{
    private PrestableStockService $stockService;
    private PrestableStockAdvancedService $stockAdvancedService;
    private MovimientoPrestableService $movimientoService;

    public function __construct(
        PrestableStockService $stockService,
        PrestableStockAdvancedService $stockAdvancedService,
        MovimientoPrestableService $movimientoService
    )
    {
        $this->stockService = $stockService;
        $this->stockAdvancedService = $stockAdvancedService;
        $this->movimientoService = $movimientoService;
    }

    /**
     * Crear préstamo a cliente con múltiples detalles
     *
     * @param array $datos
     * {
     *   'cliente_id': int,
     *   'venta_id': ?int,
     *   'chofer_id': ?int,
     *   'tipo_prestamo': 'canastillas'|'embases'|'canastillas_embases',
     *   'es_venta': bool,
     *   'es_evento': ?bool,
     *   'monto_garantia': ?float,
     *   'fecha_prestamo': date,
     *   'fecha_esperada_devolucion': ?date,
     *   'observaciones': ?string,
     *   'detalles': [
     *     {
     *       'prestable_id': int,
     *       'cantidad': int,
     *       'precio_unitario': ?float,
     *       'precio_prestamo': ?float,
     *     },
     *     ...
     *   ]
     * }
     */
    public function crearPrestamo(array $datos): PrestamoCliente|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // Usar monto de garantía enviado por el usuario
                $montoGarantia = (float) ($datos['monto_garantia'] ?? 0);

                // Crear registro encabezado de préstamo
                $prestamo = PrestamoCliente::create([
                    'cliente_id' => $datos['cliente_id'],
                    'venta_id' => $datos['venta_id'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                    'telefono_cliente_1' => $datos['telefono_cliente_1'] ?? null,
                    'telefono_cliente_2' => $datos['telefono_cliente_2'] ?? null,
                    'tipo_prestamo' => $datos['tipo_prestamo'] ?? 'canastillas_embases',
                    'es_venta' => $datos['es_venta'],
                    'es_evento' => $datos['es_evento'] ?? false,
                    'monto_garantia' => $montoGarantia,
                    'fecha_prestamo' => $datos['fecha_prestamo'],
                    'fecha_esperada_devolucion' => $datos['fecha_esperada_devolucion'] ?? null,
                    'observaciones' => $datos['observaciones'] ?? null,
                    'estado' => 'ACTIVO',
                ]);

                $detalles = $datos['detalles'] ?? [];

                foreach ($detalles as $detalle) {
                    PrestamoClienteDetalle::create([
                        'prestamo_cliente_id' => $prestamo->id,
                        'prestable_id' => $detalle['prestable_id'],
                        'cantidad_prestada' => $detalle['cantidad'],
                        'precio_unitario' => $detalle['precio_unitario'] ?? null,
                        'precio_prestamo' => $detalle['precio_prestamo'] ?? null,
                        'estado' => 'ACTIVO',
                    ]);

                    $almacenesIds = array_values(array_filter(array_map('intval', (array)($detalle['almacenes_ids'] ?? []))));

                    if (count($almacenesIds) > 0) {
                        $resultadoConsumo = $this->consumirStockDesdeAlmacenesSeleccionados(
                            (int) $detalle['prestable_id'],
                            (int) $detalle['cantidad'],
                            $almacenesIds,
                            (bool) $datos['es_venta']
                        );
                    } elseif ($datos['es_venta']) {
                        $resultadoConsumo = $this->stockAdvancedService->consumirDisponibleInteligente(
                            (int) $detalle['prestable_id'],
                            (int) $detalle['cantidad']
                        );
                    } else {
                        $resultadoConsumo = $this->stockAdvancedService->prestarAlClienteInteligente(
                            (int) $detalle['prestable_id'],
                            (int) $detalle['cantidad']
                        );
                    }

                    if (!($resultadoConsumo['exito'] ?? false)) {
                        throw new \Exception($resultadoConsumo['mensaje'] ?? 'Error consumiendo stock');
                    }

                    foreach (($resultadoConsumo['detalles_por_almacen'] ?? []) as $detalleAlmacen) {
                        $stock = $this->stockService->obtenerStock(
                            (int) $detalle['prestable_id'],
                            (int) $detalleAlmacen['almacen_id']
                        );

                        $cantidadMovida = (int) $detalleAlmacen['cantidad'];
                        $disponiblePosterior = $stock->cantidad_disponible;
                        $prestamoClientePosterior = $stock->cantidad_prestamo_cliente_activo;
                        $prestamoProveedorPosterior = $stock->cantidad_prestamo_proveedor_activo;

                        $this->movimientoService->registrarMovimiento([
                            'prestable_stock_id' => $stock->id,
                            'almacenes_prestables_id' => $detalleAlmacen['almacen_id'],
                            'usuario_id' => auth()->id(),
                            'tipo' => $datos['es_venta'] ? 'SALIDA' : 'CONSUMO_RESERVA',
                            'cantidad' => -$cantidadMovida,
                            'disponible_anterior' => $disponiblePosterior + $cantidadMovida,
                            'prestamo_cliente_anterior' => $prestamoClientePosterior - ($datos['es_venta'] ? 0 : $cantidadMovida),
                            'prestamo_proveedor_anterior' => $prestamoProveedorPosterior,
                            'disponible_posterior' => $disponiblePosterior,
                            'prestamo_cliente_posterior' => $prestamoClientePosterior,
                            'prestamo_proveedor_posterior' => $prestamoProveedorPosterior,
                            'categoria_afectada' => $datos['es_venta'] ? 'vendida' : 'prestamo_cliente',
                            'motivo' => $datos['es_venta'] ? 'Venta a cliente' : 'Préstamo a cliente',
                            'numero_referencia' => $prestamo->id,
                            'referencia_tipo' => 'PRESTAMO_CLIENTE',
                            'referencia_id' => $prestamo->id,
                            'tipo_prestamo' => $datos['tipo_prestamo'] ?? 'canastillas_embases',
                        ]);
                    }
                }

                Log::info('✅ Préstamo creado', [
                    'prestamo_id' => $prestamo->id,
                    'cliente_id' => $datos['cliente_id'],
                    'tipo_prestamo' => $datos['tipo_prestamo'] ?? 'canastillas_embases',
                    'cantidad_detalles' => count($detalles),
                    'es_venta' => $datos['es_venta'],
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error creando préstamo', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Consumir stock SOLO desde los almacenes seleccionados por el usuario.
     */
    private function consumirStockDesdeAlmacenesSeleccionados(
        int $prestableId,
        int $cantidad,
        array $almacenesIds,
        bool $esVenta
    ): array {
        try {
            return DB::transaction(function () use ($prestableId, $cantidad, $almacenesIds, $esVenta) {
                $cantidadRestante = $cantidad;
                $detallesPorAlmacen = [];

                foreach ($almacenesIds as $almacenId) {
                    if ($cantidadRestante <= 0) {
                        break;
                    }

                    $stock = PrestableStock::where('prestable_id', $prestableId)
                        ->where('almacenes_prestables_id', $almacenId)
                        ->first();

                    if (!$stock || (int) $stock->cantidad_disponible <= 0) {
                        continue;
                    }

                    $cantidadATomar = min($cantidadRestante, (int) $stock->cantidad_disponible);

                    if ($esVenta) {
                        $stock->update([
                            'cantidad_disponible' => $stock->cantidad_disponible - $cantidadATomar,
                        ]);
                    } else {
                        $stock->update([
                            'cantidad_disponible' => $stock->cantidad_disponible - $cantidadATomar,
                            'cantidad_prestamo_cliente_activo' => $stock->cantidad_prestamo_cliente_activo + $cantidadATomar,
                        ]);
                    }

                    $almacen = AlmacenPrestable::find($almacenId);
                    $detallesPorAlmacen[] = [
                        'almacen_id' => $almacenId,
                        'almacen_nombre' => $almacen?->nombre ?? ('Almacén #' . $almacenId),
                        'cantidad' => $cantidadATomar,
                    ];

                    $cantidadRestante -= $cantidadATomar;
                }

                if ($cantidadRestante > 0) {
                    throw new \Exception("Stock insuficiente en almacenes seleccionados. Solicitado: {$cantidad}, disponible: " . ($cantidad - $cantidadRestante));
                }

                return [
                    'exito' => true,
                    'cantidad_consumida' => $cantidad,
                    'detalles_por_almacen' => $detallesPorAlmacen,
                    'advertencias' => [],
                    'mensaje' => 'Consumo completado desde almacenes seleccionados',
                ];
            });
        } catch (\Exception $e) {
            return [
                'exito' => false,
                'mensaje' => $e->getMessage(),
                'advertencias' => [],
            ];
        }
    }

    /**
     * Registrar devolución (parcial o total) con múltiples detalles
     *
     * @param array $datos
     * {
     *   'prestamo_cliente_id': int,
     *   'fecha_devolucion': date,
     *   'monto_cobrado_daño_total': ?float = 0,
     *   'observaciones': ?string,
     *   'chofer_id': ?int,
     *   'detalles': [
     *     {
     *       'prestamo_cliente_detalle_id': int,
     *       'cantidad_devuelta': int,
     *       'cantidad_dañada_parcial': ?int = 0,
     *       'cantidad_dañada_total': ?int = 0,
     *     },
     *     ...
     *   ]
     * }
     */
    public function registrarDevolucion(array $datos): DevolucionCliente|false
    {
        try {
            return DB::transaction(function () use ($datos) {
                // Validar que prestamo_cliente_id existe
                $prestamo = PrestamoCliente::find($datos['prestamo_cliente_id']);
                if (!$prestamo) {
                    throw new \Exception('Préstamo no encontrado');
                }

                // Crear encabezado de devolución
                $devolucion = DevolucionCliente::create([
                    'prestamo_cliente_id' => $datos['prestamo_cliente_id'],
                    'fecha_devolucion' => $datos['fecha_devolucion'],
                    'monto_cobrado_daño_total' => (float) ($datos['monto_cobrado_daño_total'] ?? 0),
                    'monto_garantia_devuelta_total' => 0, // Se calculará de los detalles
                    'observaciones' => $datos['observaciones'] ?? null,
                    'chofer_id' => $datos['chofer_id'] ?? null,
                ]);

                $montoGarantiaTotal = 0;
                $detalles = $datos['detalles'] ?? [];

                // Procesar cada detalle de devolución
                foreach ($detalles as $detalleData) {
                    $detalle = PrestamoClienteDetalle::find($detalleData['prestamo_cliente_detalle_id']);

                    if (!$detalle) {
                        throw new \Exception('Detalle de préstamo no encontrado: ' . $detalleData['prestamo_cliente_detalle_id']);
                    }

                    $cantidadDevuelta = $detalleData['cantidad_devuelta'] ?? 0;
                    $cantidadDañadaParcial = $detalleData['cantidad_dañada_parcial'] ?? 0;
                    $cantidadDañadaTotal = $detalleData['cantidad_dañada_total'] ?? 0;
                    $cantidadTotal = $cantidadDevuelta + $cantidadDañadaParcial + $cantidadDañadaTotal;
                    // Regla de negocio: lo dañado se registra para auditoría/cobro, pero NO mueve stock
                    $cantidadParaStock = $cantidadDevuelta;

                    // Calcular cuánto ya ha sido devuelto previamente
                    $cantidadYaDevuelta = $detalle->devolucionDetalles()
                        ->whereHas('devolucion', function ($q) {
                            // Solo contar devoluciones confirmadas (creadas antes de esta)
                            $q->where('created_at', '<', now());
                        })
                        ->sum(DB::raw('cantidad_devuelta + cantidad_dañada_parcial + cantidad_dañada_total'));

                    $cantidadRestante = $detalle->cantidad_prestada - $cantidadYaDevuelta;

                    // Validar que no devuelve más de lo que queda por devolver
                    if ($cantidadTotal > $cantidadRestante) {
                        throw new \Exception("Cantidad a devolver ({$cantidadTotal}) excede cantidad restante ({$cantidadRestante}) para detalle {$detalleData['prestamo_cliente_detalle_id']}. Ya devuelto: {$cantidadYaDevuelta}");
                    }

                    // Resolver almacén dinámicamente para evitar hardcode inválido (ej. id=3 inexistente)
                    $almacenId = $this->resolverAlmacenIdParaPrestable($detalle->prestable_id);

                    // Obtener condiciones para calcular garantía devuelta
                    $condicion = PrestableCondicion::where('prestable_id', $detalle->prestable_id)->first();
                    $montoGarantiaDevuelta = 0;

                    if ($condicion) {
                        // Garantía devuelta solo para lo que está en buen estado
                        if ($cantidadDevuelta > 0) {
                            $montoGarantiaDevuelta = $cantidadDevuelta * $condicion->monto_garantia;
                        }
                    }

                    $montoGarantiaTotal += $montoGarantiaDevuelta;

                    // Calcular TOTAL DEVUELTO HISTÓRICO ANTES de crear el nuevo registro
                    $totalDevueltoHistorico = $detalle->devolucionDetalles()
                        ->sum(DB::raw('cantidad_devuelta + cantidad_dañada_parcial + cantidad_dañada_total'));
                    $totalDevueltoAhora = $totalDevueltoHistorico + $cantidadTotal;

                    // Crear detalle de devolución
                    // Nota: El monto_cobrado_daño se registra a nivel de cabecera (monto_cobrado_daño_total)
                    $detalleDevolucion = DevolucionClienteDetalle::create([
                        'devolucion_cliente_id' => $devolucion->id,
                        'prestamo_cliente_detalle_id' => $detalleData['prestamo_cliente_detalle_id'],
                        'cantidad_devuelta' => $cantidadDevuelta,
                        'cantidad_dañada_parcial' => $cantidadDañadaParcial,
                        'cantidad_dañada_total' => $cantidadDañadaTotal,
                        'monto_cobrado_daño' => 0,
                        'monto_garantia_devuelta' => $montoGarantiaDevuelta,
                    ]);

                    // Obtener stock ANTES de devolver
                    $stock = $this->stockService->obtenerStock($detalle->prestable_id, $almacenId);
                    $disponibleAntes = $stock->cantidad_disponible;
                    $prestamoClienteActivoAntes = $stock->cantidad_prestamo_cliente_activo;
                    $prestamoProveedorActivoAntes = $stock->cantidad_prestamo_proveedor_activo;
                    $prestamoEventoActivoAntes = $stock->cantidad_prestamo_evento_activo;

                    // Actualizar stock
                    if ($cantidadParaStock > 0) {
                        $this->stockService->devolverDelCliente(
                            $detalle->prestable_id,
                            $almacenId,
                            $cantidadParaStock,
                            0,
                            0
                        );
                    }

                    // Obtener stock DESPUÉS de devolver
                    $stock->refresh();

                    // Registrar movimiento de devolución
                    if ($cantidadParaStock > 0) {
                        $this->movimientoService->registrarMovimiento([
                            'prestable_stock_id' => $stock->id,
                            'almacenes_prestables_id' => $almacenId,
                            'usuario_id' => auth()->id(),
                            'tipo' => 'ENTRADA',
                            'cantidad' => $cantidadParaStock,
                            'disponible_anterior' => $disponibleAntes,
                            'prestamo_cliente_anterior' => $prestamoClienteActivoAntes,
                            'prestamo_proveedor_anterior' => $prestamoProveedorActivoAntes,
                            'disponible_posterior' => $stock->cantidad_disponible,
                            'prestamo_cliente_posterior' => $stock->cantidad_prestamo_cliente_activo,
                            'prestamo_proveedor_posterior' => $stock->cantidad_prestamo_proveedor_activo,
                            'categoria_afectada' => 'prestamo_cliente',
                            'motivo' => 'Devolución de préstamo a cliente',
                            'numero_referencia' => $prestamo->id,
                            'referencia_tipo' => 'DEVOLUCIO_CLIENTE',
                            'referencia_id' => $devolucion->id,
                            'observaciones' => $datos['observaciones'] ?? null,
                        ]);
                    }

                    // Actualizar embases relacionados si existen
                    // ⚠️ Solo si el detalle actual es CANASTILLA, NO si es EMBASE (que ya se procesa por separado)
                    $prestable = \App\Models\Prestable::find($detalle->prestable_id);
                    if ($prestable && $prestable->tipo === 'CANASTILLA' && $prestable->embasesRelacionados()->count() > 0) {
                        foreach ($prestable->embasesRelacionados()->get() as $embase) {
                            // Buscar el detalle de EMBASE en el préstamo para registrar la devolución
                            $detalleEmbase = $prestamo->detalles()
                                ->whereHas('prestable', function ($q) use ($embase) {
                                    $q->where('id', $embase->id);
                                })
                                ->first();

                            // ⚠️ SKIP si el EMBASE ya está siendo procesado en los detalles del frontend
                            $embaseYaProcesado = in_array($detalleEmbase?->id, array_column($detalles, 'prestamo_cliente_detalle_id'));
                            if ($embaseYaProcesado) {
                                continue;
                            }

                            // Calcular cambio en embases: cantidad_devuelta × capacidad
                            $cambioEmbasesTotal = $cantidadDevuelta * ($prestable->capacidad ?? 1);

                            // Restar embases dañados
                            $embasesDanados = ($detalleData['embases_danados_parcial'] ?? 0) + ($detalleData['embases_danados_total'] ?? 0);
                            $embasesADevolver = $cambioEmbasesTotal - $embasesDanados;

                            // Calcular TOTAL DEVUELTO HISTÓRICO para embases ANTES de crear el nuevo registro
                            $totalEmbasesHistorico = 0;
                            if ($detalleEmbase) {
                                $totalEmbasesHistorico = $detalleEmbase->devolucionDetalles()
                                    ->sum(DB::raw('cantidad_devuelta + cantidad_dañada_parcial + cantidad_dañada_total'));
                            }
                            $totalEmbasesDevueltosAhora = $totalEmbasesHistorico + $embasesADevolver + $embasesDanados;

                            // Crear detalle de devolución para el EMBASE si existe
                            if ($detalleEmbase) {
                                DevolucionClienteDetalle::create([
                                    'devolucion_cliente_id' => $devolucion->id,
                                    'prestamo_cliente_detalle_id' => $detalleEmbase->id,
                                    'cantidad_devuelta' => $embasesADevolver,
                                    'cantidad_dañada_parcial' => $detalleData['embases_danados_parcial'] ?? 0,
                                    'cantidad_dañada_total' => $detalleData['embases_danados_total'] ?? 0,
                                    'monto_cobrado_daño' => 0,
                                    'monto_garantia_devuelta' => 0,
                                ]);
                            }

                            // Obtener stock del embase ANTES
                            $almacenIdEmbase = $this->resolverAlmacenIdParaPrestable($embase->id);
                            $stockEmbase = $this->stockService->obtenerStock($embase->id, $almacenIdEmbase);
                            $disponibleEmbaseAntes = $stockEmbase->cantidad_disponible;
                            $prestamoClienteEmbaseAntes = $stockEmbase->cantidad_prestamo_cliente_activo;
                            $prestamoProveedorEmbaseAntes = $stockEmbase->cantidad_prestamo_proveedor_activo;
                            $prestamoEventoEmbaseAntes = $stockEmbase->cantidad_prestamo_evento_activo;

                            // Actualizar stock del embase (devolver solo los no dañados)
                            if ($embasesADevolver > 0) {
                                $this->stockService->devolverDelCliente(
                                    $embase->id,
                                    $almacenIdEmbase,
                                    $embasesADevolver,
                                    0,
                                    0
                                );
                            }

                            // Obtener stock DESPUÉS
                            $stockEmbase->refresh();

                            // Registrar movimiento del embase (devueltos en buen estado)
                            if ($embasesADevolver > 0) {
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stockEmbase->id,
                                    'almacenes_prestables_id' => $almacenIdEmbase,
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'ENTRADA',
                                    'cantidad' => $embasesADevolver,
                                    'disponible_anterior' => $disponibleEmbaseAntes,
                                    'prestamo_cliente_anterior' => $prestamoClienteEmbaseAntes,
                                    'prestamo_proveedor_anterior' => $prestamoProveedorEmbaseAntes,
                                    'disponible_posterior' => $stockEmbase->cantidad_disponible,
                                    'prestamo_cliente_posterior' => $stockEmbase->cantidad_prestamo_cliente_activo,
                                    'prestamo_proveedor_posterior' => $stockEmbase->cantidad_prestamo_proveedor_activo,
                                    'categoria_afectada' => 'prestamo_cliente',
                                    'motivo' => 'Devolución de embase (asociado a canastilla)',
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'DEVOLUCIO_CLIENTE_EMBASE',
                                    'referencia_id' => $devolucion->id,
                                    'observaciones' => "Embase: {$embase->nombre}. Devueltos: {$embasesADevolver}/{$cambioEmbasesTotal}. Dañados: {$embasesDanados}",
                                ]);
                            }

                            // Registrar movimiento por embases dañados (pérdida)
                            if ($embasesDanados > 0) {
                                $this->movimientoService->registrarMovimiento([
                                    'prestable_stock_id' => $stockEmbase->id,
                                    'almacenes_prestables_id' => $almacenIdEmbase,
                                    'usuario_id' => auth()->id(),
                                    'tipo' => 'SALIDA',
                                    'cantidad' => -$embasesDanados,
                                    'disponible_anterior' => $disponibleEmbaseAntes,
                                    'prestamo_cliente_anterior' => $prestamoClienteEmbaseAntes,
                                    'prestamo_proveedor_anterior' => $prestamoProveedorEmbaseAntes,
                                    'disponible_posterior' => $stockEmbase->cantidad_disponible,
                                    'prestamo_cliente_posterior' => $stockEmbase->cantidad_prestamo_cliente_activo,
                                    'prestamo_proveedor_posterior' => $stockEmbase->cantidad_prestamo_proveedor_activo,
                                    'categoria_afectada' => 'prestamo_cliente',
                                    'motivo' => 'Pérdida de embases en devolución',
                                    'numero_referencia' => $prestamo->id,
                                    'referencia_tipo' => 'DEVOLUCIO_CLIENTE_EMBASE_DANADO',
                                    'referencia_id' => $devolucion->id,
                                    'observaciones' => "Embase: {$embase->nombre}. Dañados parciales: {$detalleData['embases_danados_parcial']}. Dañados totales: {$detalleData['embases_danados_total']}",
                                ]);
                            }

                            // Actualizar estado del detalle de EMBASE basado en el total calculado arriba
                            if ($detalleEmbase) {
                                // Total de embases que se supone fueron prestados (canastillas × capacidad)
                                $totalEmbasesPrestados = $detalleEmbase->cantidad_prestada;

                                if ($totalEmbasesDevueltosAhora >= $totalEmbasesPrestados) {
                                    $detalleEmbase->update(['estado' => 'COMPLETAMENTE_DEVUELTO']);
                                } else {
                                    $detalleEmbase->update(['estado' => 'PARCIALMENTE_DEVUELTO']);
                                }
                            }

                            Log::info('✅ Stock de embase actualizado en devolución', [
                                'embase_id' => $embase->id,
                                'embase_nombre' => $embase->nombre,
                                'embases_calculados' => $cambioEmbasesTotal,
                                'embases_danados' => $embasesDanados,
                                'embases_a_devolver' => $embasesADevolver,
                                'capacidad_canastilla' => $prestable->capacidad,
                                'cantidad_canastilla' => $cantidadDevuelta,
                            ]);
                        }
                    }

                    // Actualizar estado del detalle basado en el total calculado arriba
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

                Log::info('✅ Devolución registrada', [
                    'devolucion_id' => $devolucion->id,
                    'prestamo_cliente_id' => $datos['prestamo_cliente_id'],
                    'cantidad_detalles' => count($detalles),
                    'monto_cobrado_daño_total' => $datos['monto_cobrado_daño_total'] ?? 0,
                    'monto_garantia_devuelta_total' => $montoGarantiaTotal,
                ]);

                return $devolucion->load('detalles');
            });
        } catch (\Exception $e) {
            Log::error('❌ Error registrando devolución', [
                'error' => $e->getMessage(),
                'datos' => $datos,
            ]);
            return false;
        }
    }

    /**
     * Obtener préstamos activos de un cliente
     */
    public function obtenerPrestamosActivos(int $clienteId): array
    {
        return PrestamoCliente::where('cliente_id', $clienteId)
            ->where('estado', 'ACTIVO')
            ->with(['detalles.prestable', 'devoluciones'])
            ->get()
            ->toArray();
    }

    /**
     * Obtener devoluciones pendientes (sin registrar completamente)
     */
    public function obtenerPrestamosParaDevolver(int $choferId): array
    {
        return PrestamoCliente::where('chofer_id', $choferId)
            ->whereIn('estado', ['ACTIVO', 'PARCIALMENTE_DEVUELTO'])
            ->with(['cliente', 'detalles.prestable', 'devoluciones'])
            ->orderBy('fecha_esperada_devolucion')
            ->get()
            ->toArray();
    }

    /**
     * Obtener resumen de préstamo (por detalle)
     */
    public function obtenerResumenDetalle(int $detalleId): array|false
    {
        $detalle = PrestamoClienteDetalle::find($detalleId);

        if (!$detalle) {
            return false;
        }

        $cantidadDevuelta = $detalle->devoluciones()
            ->sum('cantidad_devuelta');

        $cantidadPendiente = $detalle->cantidad_prestada - $cantidadDevuelta;

        return [
            'detalle' => $detalle,
            'cantidad_original' => $detalle->cantidad_prestada,
            'cantidad_devuelta' => $cantidadDevuelta,
            'cantidad_pendiente' => $cantidadPendiente,
            'devoluciones' => $detalle->devoluciones,
            'estado' => $detalle->estado,
        ];
    }

    /**
     * Obtener resumen de préstamo (encabezado, con todos sus detalles)
     */
    public function obtenerResumenPrestamo(int $prestamoId): array|false
    {
        $prestamo = PrestamoCliente::with(['detalles.devoluciones'])->find($prestamoId);

        if (!$prestamo) {
            return false;
        }

        $cantidadTotalOriginal = 0;
        $cantidadTotalDevuelta = 0;
        $detallesResumen = [];

        foreach ($prestamo->detalles as $detalle) {
            $cantidadDevueltaDetalle = $detalle->devoluciones->sum('cantidad_devuelta');
            $cantidadTotalOriginal += $detalle->cantidad_prestada;
            $cantidadTotalDevuelta += $cantidadDevueltaDetalle;

            $detallesResumen[] = [
                'detalle' => $detalle,
                'cantidad_devuelta' => $cantidadDevueltaDetalle,
                'cantidad_pendiente' => $detalle->cantidad_prestada - $cantidadDevueltaDetalle,
                'devoluciones' => $detalle->devoluciones,
            ];
        }

        return [
            'prestamo' => $prestamo,
            'cantidad_total_original' => $cantidadTotalOriginal,
            'cantidad_total_devuelta' => $cantidadTotalDevuelta,
            'cantidad_total_pendiente' => $cantidadTotalOriginal - $cantidadTotalDevuelta,
            'detalles_resumen' => $detallesResumen,
            'estado' => $prestamo->estado,
        ];
    }

    /**
     * Anular préstamo - cancela y devuelve stock al almacén
     *
     * @param int $prestamoId
     * @param ?string $razonAnulacion
     */
    public function anularPrestamo(int $prestamoId, ?string $razonAnulacion = null): PrestamoCliente|false
    {
        try {
            return DB::transaction(function () use ($prestamoId, $razonAnulacion) {
                $prestamo = PrestamoCliente::with('detalles')->find($prestamoId);

                if (!$prestamo) {
                    throw new \Exception('Préstamo no encontrado');
                }

                if ($prestamo->estado === 'CANCELADO') {
                    throw new \Exception('El préstamo ya está cancelado');
                }

                foreach ($prestamo->detalles as $detalle) {
                    // Si el detalle aún no está completamente devuelto, devolver lo que falta
                    if ($detalle->estado !== 'COMPLETAMENTE_DEVUELTO') {
                        // Calcular cantidad pendiente de devolver
                        $cantidadDevuelta = $detalle->devoluciones()
                            ->sum('cantidad_devuelta');
                        $cantidadPendiente = $detalle->cantidad_prestada - $cantidadDevuelta;

                        if ($cantidadPendiente > 0) {
                            $almacenId = $this->resolverAlmacenIdParaPrestable($detalle->prestable_id);

                            // Obtener stock ANTES de devolver
                            $stock = $this->stockService->obtenerStock($detalle->prestable_id, $almacenId);
                            $disponibleAntes = $stock->cantidad_disponible;
                            $prestamoClienteActivoAntes = $stock->cantidad_prestamo_cliente_activo;
                            $prestamoProveedorActivoAntes = $stock->cantidad_prestamo_proveedor_activo;
                            $prestamoEventoActivoAntes = $stock->cantidad_prestamo_evento_activo;

                            // Devolver como cantidad en buen estado
                            $this->stockService->devolverDelCliente(
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
                                'usuario_id' => auth()->id(),
                                'tipo' => 'ENTRADA',
                                'cantidad' => $cantidadPendiente,
                                'disponible_anterior' => $disponibleAntes,
                                'prestamo_cliente_anterior' => $prestamoClienteActivoAntes,
                                'prestamo_proveedor_anterior' => $prestamoProveedorActivoAntes,
                                'disponible_posterior' => $stock->cantidad_disponible,
                                'prestamo_cliente_posterior' => $stock->cantidad_prestamo_cliente_activo,
                                'prestamo_proveedor_posterior' => $stock->cantidad_prestamo_proveedor_activo,
                                'categoria_afectada' => 'prestamo_cliente',
                                'motivo' => 'Devolución por anulación de préstamo',
                                'numero_referencia' => $prestamo->id,
                                'referencia_tipo' => 'PRESTAMO_CLIENTE_ANULADO',
                                'referencia_id' => $prestamo->id,
                                'observaciones' => $razonAnulacion,
                            ]);

                            // Actualizar embases relacionados si existen
                            $prestable = \App\Models\Prestable::find($detalle->prestable_id);
                            if ($prestable && $prestable->embasesRelacionados()->count() > 0) {
                                foreach ($prestable->embasesRelacionados()->get() as $embase) {
                                    // Calcular cambio en embases: cantidad_pendiente × capacidad
                                    $cambioEmbases = $cantidadPendiente * ($prestable->capacidad ?? 1);

                                    // Obtener stock del embase ANTES
                                    $almacenIdEmbase = $this->resolverAlmacenIdParaPrestable($embase->id);
                                    $stockEmbase = $this->stockService->obtenerStock($embase->id, $almacenIdEmbase);
                                    $disponibleEmbaseAntes = $stockEmbase->cantidad_disponible;
                                    $prestamoClienteEmbaseAntes = $stockEmbase->cantidad_prestamo_cliente_activo;
                                    $prestamoProveedorEmbaseAntes = $stockEmbase->cantidad_prestamo_proveedor_activo;
                                    $prestamoEventoEmbaseAntes = $stockEmbase->cantidad_prestamo_evento_activo;

                                    // Actualizar stock del embase (devolver)
                                    $this->stockService->devolverDelCliente(
                                        $embase->id,
                                        $almacenIdEmbase,
                                        $cambioEmbases,
                                        0,
                                        0
                                    );

                                    // Obtener stock DESPUÉS
                                    $stockEmbase->refresh();

                                    // Registrar movimiento del embase
                                    $this->movimientoService->registrarMovimiento([
                                        'prestable_stock_id' => $stockEmbase->id,
                                        'almacenes_prestables_id' => $almacenIdEmbase,
                                        'usuario_id' => auth()->id(),
                                        'tipo' => 'ENTRADA',
                                        'cantidad' => $cambioEmbases,
                                        'disponible_anterior' => $disponibleEmbaseAntes,
                                        'prestamo_cliente_anterior' => $prestamoClienteEmbaseAntes,
                                        'prestamo_proveedor_anterior' => $prestamoProveedorEmbaseAntes,
                                        'disponible_posterior' => $stockEmbase->cantidad_disponible,
                                        'prestamo_cliente_posterior' => $stockEmbase->cantidad_prestamo_cliente_activo,
                                        'prestamo_proveedor_posterior' => $stockEmbase->cantidad_prestamo_proveedor_activo,
                                        'categoria_afectada' => 'prestamo_cliente',
                                        'motivo' => 'Devolución de embase por anulación de préstamo',
                                        'numero_referencia' => $prestamo->id,
                                        'referencia_tipo' => 'PRESTAMO_CLIENTE_ANULADO_EMBASE',
                                        'referencia_id' => $prestamo->id,
                                        'observaciones' => "Embase: {$embase->nombre}. Multiplicador: {$prestable->capacidad}. Razón: {$razonAnulacion}",
                                    ]);

                                    Log::info('✅ Stock de embase actualizado en anulación', [
                                        'embase_id' => $embase->id,
                                        'embase_nombre' => $embase->nombre,
                                        'cambio_embases' => $cambioEmbases,
                                        'capacidad_canastilla' => $prestable->capacidad,
                                        'cantidad_canastilla' => $cantidadPendiente,
                                    ]);
                                }
                            }
                        }
                    }

                    // Cambiar estado del detalle a CANCELADO
                    $detalle->update(['estado' => 'CANCELADO']);
                }

                // Actualizar observaciones con razón de anulación si se proporciona
                if ($razonAnulacion) {
                    $observacionesActuales = $prestamo->observaciones ?? '';
                    $nuevasObservaciones = trim($observacionesActuales . " [ANULADO: $razonAnulacion]");
                    $prestamo->update([
                        'estado' => 'CANCELADO',
                        'observaciones' => $nuevasObservaciones,
                    ]);
                } else {
                    $prestamo->update(['estado' => 'CANCELADO']);
                }

                Log::info('✅ Préstamo anulado', [
                    'prestamo_id' => $prestamo->id,
                    'cliente_id' => $prestamo->cliente_id,
                    'cantidad_detalles' => count($prestamo->detalles),
                    'razon_anulacion' => $razonAnulacion,
                ]);

                return $prestamo;
            });
        } catch (\Exception $e) {
            Log::error('❌ Error anulando préstamo', [
                'error' => $e->getMessage(),
                'prestamo_id' => $prestamoId,
            ]);
            return false;
        }
    }

    /**
     * Resolver almacén válido para operar un prestable en devoluciones/anulaciones.
     * Prioridad:
     * 1) Almacén donde actualmente hay préstamo cliente activo.
     * 2) Cualquier almacén con stock registrado para el prestable.
     * 3) Primer almacén activo de distribuidora.
     */
    private function resolverAlmacenIdParaPrestable(int $prestableId): int
    {
        $stockConPrestamoActivo = PrestableStock::where('prestable_id', $prestableId)
            ->where('cantidad_prestamo_cliente_activo', '>', 0)
            ->orderByDesc('cantidad_prestamo_cliente_activo')
            ->first();

        if ($stockConPrestamoActivo) {
            return (int) $stockConPrestamoActivo->almacenes_prestables_id;
        }

        $stockExistente = PrestableStock::where('prestable_id', $prestableId)
            ->orderByDesc('cantidad_disponible')
            ->first();

        if ($stockExistente) {
            return (int) $stockExistente->almacenes_prestables_id;
        }

        $almacenActivo = AlmacenPrestable::where('activo', true)
            ->where('es_proveedor', false)
            ->orderBy('id')
            ->first();

        if (!$almacenActivo) {
            throw new \Exception('No hay almacenes prestables activos de distribuidora para registrar devoluciones.');
        }

        return (int) $almacenActivo->id;
    }
}

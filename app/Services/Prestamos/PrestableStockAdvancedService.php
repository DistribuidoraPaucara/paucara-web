<?php

namespace App\Services\Prestamos;

use App\Models\AlmacenPrestable;
use App\Models\PrestableStock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * PrestableStockAdvancedService
 *
 * Servicio avanzado para manejar:
 * 1. Préstamos a clientes desde CUALQUIER almacén (con mezcla automática)
 * 2. Devoluciones inteligentes a proveedores (primero del almacén deudor, luego otros)
 * 3. Advertencias detalladas de movimientos entre almacenes
 */
class PrestableStockAdvancedService
{
    private PrestableStockService $baseService;

    public function __construct(PrestableStockService $baseService)
    {
        $this->baseService = $baseService;
    }

    /**
     * Prestar a cliente desde múltiples almacenes de forma inteligente
     *
     * Prioridad:
     * 1. Almacén Distribuidora (ID=1)
     * 2. Proveedores General (ID=2)
     * 3. Proveedores específicos (ID=3, 4, etc.)
     *
     * @return array {
     *   'exito' => bool,
     *   'cantidad_prestada' => int,
     *   'detalles_por_almacen' => [
     *     ['almacen_id' => 1, 'almacen_nombre' => 'Distribuidora', 'cantidad' => 50],
     *     ['almacen_id' => 3, 'almacen_nombre' => 'Proveedor CBN', 'cantidad' => 25]
     *   ],
     *   'advertencias' => ['Se prestó desde almacén de proveedor CBN'],
     *   'mensaje' => 'Préstamo completado con mezcla de almacenes'
     * }
     */
    public function prestarAlClienteInteligente(int $prestableId, int $cantidad): array
    {
        try {
            return DB::transaction(function () use ($prestableId, $cantidad) {
                // Obtener todos los almacenes ordenados por prioridad
                // Prioridad: 1. Distribuidora (es_proveedor=false), 2. Proveedores (es_proveedor=true)
                $almacenes = AlmacenPrestable::query()
                    ->where('activo', true)
                    ->orderBy('es_proveedor') // false (0) antes que true (1)
                    ->get();

                $cantidadRestante = $cantidad;
                $detallesPorAlmacen = [];
                $advertencias = [];
                $almacenDistribuidoraUsada = false;
                $almacenesProveedorUsados = [];

                // Iterar por cada almacén intentando prestar
                foreach ($almacenes as $almacen) {
                    if ($cantidadRestante <= 0) break;

                    $stock = PrestableStock::where('prestable_id', $prestableId)
                        ->where('almacenes_prestables_id', $almacen->id)
                        ->first();

                    if (!$stock) continue;

                    // Calcular cuánto podemos tomar de este almacén
                    $cantidadATomarAhora = min($cantidadRestante, $stock->cantidad_disponible);

                    if ($cantidadATomarAhora > 0) {
                        // Registrar advertencia si es de proveedor
                        if ($almacen->es_proveedor) {
                            $advertencias[] = "⚠️ Se prestó $cantidadATomarAhora canastillas del almacén '{$almacen->nombre}'";
                            $almacenesProveedorUsados[] = $almacen->nombre;
                        } else {
                            $almacenDistribuidoraUsada = true;
                        }

                        // Actualizar stock
                        $stock->update([
                            'cantidad_disponible' => $stock->cantidad_disponible - $cantidadATomarAhora,
                            'cantidad_prestamo_cliente_activo' => $stock->cantidad_prestamo_cliente_activo + $cantidadATomarAhora,
                        ]);

                        $detallesPorAlmacen[] = [
                            'almacen_id' => $almacen->id,
                            'almacen_nombre' => $almacen->nombre,
                            'cantidad' => $cantidadATomarAhora,
                        ];

                        $cantidadRestante -= $cantidadATomarAhora;

                        Log::info('✅ Préstamo a cliente desde almacén', [
                            'prestable_id' => $prestableId,
                            'almacen_id' => $almacen->id,
                            'almacen_nombre' => $almacen->nombre,
                            'cantidad' => $cantidadATomarAhora,
                        ]);
                    }
                }

                // Verificar si se completó el préstamo
                if ($cantidadRestante > 0) {
                    throw new \Exception("Stock insuficiente. Solicitado: $cantidad, disponible: " . ($cantidad - $cantidadRestante));
                }

                return [
                    'exito' => true,
                    'cantidad_prestada' => $cantidad,
                    'detalles_por_almacen' => $detallesPorAlmacen,
                    'advertencias' => $advertencias,
                    'almacen_distribuidora_usada' => $almacenDistribuidoraUsada,
                    'almacenes_proveedor_usados' => $almacenesProveedorUsados,
                    'mensaje' => count($detallesPorAlmacen) === 1
                        ? "Préstamo completado desde almacén {$detallesPorAlmacen[0]['almacen_nombre']}"
                        : "Préstamo completado con mezcla de " . count($detallesPorAlmacen) . " almacenes",
                ];
            });
        } catch (\Exception $e) {
            Log::error('❌ Error en préstamo inteligente a cliente', [
                'prestable_id' => $prestableId,
                'cantidad' => $cantidad,
                'error' => $e->getMessage(),
            ]);

            return [
                'exito' => false,
                'mensaje' => $e->getMessage(),
                'advertencias' => [],
            ];
        }
    }

    /**
     * Consumir stock disponible desde cualquier almacén activo sin incrementar deuda de préstamo.
     *
     * Se usa para ventas o salidas directas donde solo se reduce cantidad_disponible.
     */
    public function consumirDisponibleInteligente(int $prestableId, int $cantidad): array
    {
        try {
            return DB::transaction(function () use ($prestableId, $cantidad) {
                $almacenes = AlmacenPrestable::query()
                    ->where('activo', true)
                    ->orderBy('es_proveedor')
                    ->get();

                $cantidadRestante = $cantidad;
                $detallesPorAlmacen = [];
                $advertencias = [];

                foreach ($almacenes as $almacen) {
                    if ($cantidadRestante <= 0) {
                        break;
                    }

                    $stock = PrestableStock::where('prestable_id', $prestableId)
                        ->where('almacenes_prestables_id', $almacen->id)
                        ->first();

                    if (!$stock || $stock->cantidad_disponible <= 0) {
                        continue;
                    }

                    $cantidadATomarAhora = min($cantidadRestante, $stock->cantidad_disponible);

                    $stock->update([
                        'cantidad_disponible' => $stock->cantidad_disponible - $cantidadATomarAhora,
                    ]);

                    $detallesPorAlmacen[] = [
                        'almacen_id' => $almacen->id,
                        'almacen_nombre' => $almacen->nombre,
                        'cantidad' => $cantidadATomarAhora,
                    ];

                    $cantidadRestante -= $cantidadATomarAhora;

                    Log::info('✅ Salida de stock desde almacén', [
                        'prestable_id' => $prestableId,
                        'almacen_id' => $almacen->id,
                        'almacen_nombre' => $almacen->nombre,
                        'cantidad' => $cantidadATomarAhora,
                    ]);
                }

                if ($cantidadRestante > 0) {
                    throw new \Exception("Stock insuficiente. Solicitado: $cantidad, disponible: " . ($cantidad - $cantidadRestante));
                }

                return [
                    'exito' => true,
                    'cantidad_consumida' => $cantidad,
                    'detalles_por_almacen' => $detallesPorAlmacen,
                    'advertencias' => $advertencias,
                    'mensaje' => count($detallesPorAlmacen) === 1
                        ? "Salida completada desde almacén {$detallesPorAlmacen[0]['almacen_nombre']}"
                        : "Salida completada con mezcla de " . count($detallesPorAlmacen) . " almacenes",
                ];
            });
        } catch (\Exception $e) {
            Log::error('❌ Error consumiendo stock inteligente', [
                'prestable_id' => $prestableId,
                'cantidad' => $cantidad,
                'error' => $e->getMessage(),
            ]);

            return [
                'exito' => false,
                'mensaje' => $e->getMessage(),
                'advertencias' => [],
            ];
        }
    }

    /**
     * Devolver canastillas al proveedor de forma inteligente
     *
     * Lógica:
     * 1. Si almacén deudor tiene suficiente: devuelve del almacén deudor
     * 2. Si falta stock del deudor: completa desde otros almacenes (Distribuidora primero)
     * 3. Retorna advertencias detalladas de movimiento
     *
     * @param int $prestableId
     * @param int $almacenProveedorId - El almacén deudor (ej: ID de Proveedor CBN)
     * @param int $cantidadADevolver - Cantidad que quiero devolver
     *
     * @return array {
     *   'exito' => bool,
     *   'cantidad_devuelta' => int,
     *   'detalles_movimiento' => [
     *     ['desde_almacen' => 'Proveedor CBN', 'cantidad' => 50, 'es_deuda' => true],
     *     ['desde_almacen' => 'Distribuidora', 'cantidad' => 20, 'es_deuda' => false]
     *   ],
     *   'advertencias' => [
     *     '⚠️ Solo había 50 en deuda de CBN, se completaron 20 del almacén Distribuidora'
     *   ],
     *   'mensaje' => '...'
     * }
     */
    public function devolverAlProveedorInteligente(int $prestableId, int $almacenProveedorId, int $cantidadADevolver): array
    {
        try {
            return DB::transaction(function () use ($prestableId, $almacenProveedorId, $cantidadADevolver) {
                // Obtener stock del almacén deudor
                $stockDeudor = PrestableStock::where('prestable_id', $prestableId)
                    ->where('almacenes_prestables_id', $almacenProveedorId)
                    ->firstOrFail();

                $almacenDeudor = AlmacenPrestable::findOrFail($almacenProveedorId);
                $detallesMovimiento = [];
                $advertencias = [];
                $cantidadRestante = $cantidadADevolver;

                // Paso 1: Devolver del almacén deudor
                if ($stockDeudor->cantidad_prestamo_proveedor_activo > 0) {
                    $cantidadDelDeudor = min($cantidadRestante, $stockDeudor->cantidad_prestamo_proveedor_activo);

                    $stockDeudor->update([
                        'cantidad_prestamo_proveedor_activo' => $stockDeudor->cantidad_prestamo_proveedor_activo - $cantidadDelDeudor,
                        'cantidad_prestamo_proveedor_devuelto' => $stockDeudor->cantidad_prestamo_proveedor_devuelto + $cantidadDelDeudor,
                    ]);

                    $detallesMovimiento[] = [
                        'desde_almacen_id' => $almacenProveedorId,
                        'desde_almacen_nombre' => $almacenDeudor->nombre,
                        'cantidad' => $cantidadDelDeudor,
                        'es_deuda' => true,
                        'descripcion' => "Devuelto del almacén deudor",
                    ];

                    $cantidadRestante -= $cantidadDelDeudor;
                }

                // Paso 2: Si falta, completar desde otros almacenes
                if ($cantidadRestante > 0) {
                    // Advertencia
                    $cantidadEnDeuda = $cantidadADevolver - $cantidadRestante;
                    $advertencias[] = "⚠️ Solo había {$cantidadEnDeuda} canastillas en deuda. Completando {$cantidadRestante} desde otros almacenes.";

                    // Obtener todos los almacenes excepto el deudor, ordenados por prioridad
                    $almacenesAlternos = AlmacenPrestable::query()
                        ->where('id', '!=', $almacenProveedorId)
                        ->where('activo', true)
                        ->orderBy('es_proveedor') // false (0) antes que true (1)
                        ->get();

                    foreach ($almacenesAlternos as $almacen) {
                        if ($cantidadRestante <= 0) break;

                        $stockAlterno = PrestableStock::where('prestable_id', $prestableId)
                            ->where('almacenes_prestables_id', $almacen->id)
                            ->first();

                        if (!$stockAlterno) continue;

                        $cantidadDelAlterno = min($cantidadRestante, $stockAlterno->cantidad_disponible);

                        if ($cantidadDelAlterno > 0) {
                            $stockAlterno->update([
                                'cantidad_disponible' => $stockAlterno->cantidad_disponible - $cantidadDelAlterno,
                                'cantidad_prestamo_proveedor_activo' => $stockAlterno->cantidad_prestamo_proveedor_activo + $cantidadDelAlterno,
                            ]);

                            $detallesMovimiento[] = [
                                'desde_almacen_id' => $almacen->id,
                                'desde_almacen_nombre' => $almacen->nombre,
                                'cantidad' => $cantidadDelAlterno,
                                'es_deuda' => false,
                                'descripcion' => "Completado desde {$almacen->nombre}",
                            ];

                            $advertencias[] = "ℹ️ Se tomaron $cantidadDelAlterno canastillas del almacén '{$almacen->nombre}'";
                            $cantidadRestante -= $cantidadDelAlterno;
                        }
                    }
                }

                // Verificar que se completó
                if ($cantidadRestante > 0) {
                    throw new \Exception("No hay suficiente stock para completar la devolución. Faltarían $cantidadRestante");
                }

                return [
                    'exito' => true,
                    'cantidad_devuelta' => $cantidadADevolver,
                    'almacen_proveedor_id' => $almacenProveedorId,
                    'almacen_proveedor_nombre' => $almacenDeudor->nombre,
                    'detalles_movimiento' => $detallesMovimiento,
                    'advertencias' => $advertencias,
                    'mensaje' => "Devolución de $cantidadADevolver canastillas completada a {$almacenDeudor->nombre}",
                ];
            });
        } catch (\Exception $e) {
            Log::error('❌ Error en devolución inteligente a proveedor', [
                'prestable_id' => $prestableId,
                'almacen_proveedor_id' => $almacenProveedorId,
                'cantidad_a_devolver' => $cantidadADevolver,
                'error' => $e->getMessage(),
            ]);

            return [
                'exito' => false,
                'mensaje' => $e->getMessage(),
                'advertencias' => [],
            ];
        }
    }

    /**
     * Obtener resumen de stock consolidado de un prestable
     * Muestra: por almacén + totales (clientes, eventos, proveedores)
     */
    public function obtenerResumenConsolidado(int $prestableId): array
    {
        $stocks = PrestableStock::where('prestable_id', $prestableId)
            ->with('almacenPrestable')
            ->get();

        $porAlmacen = [];
        $totales = [
            'cantidad_disponible' => 0,
            'cantidad_prestamo_cliente_activo' => 0,
            'cantidad_prestamo_cliente_devuelto' => 0,
            'cantidad_prestamo_evento_activo' => 0,
            'cantidad_prestamo_evento_devuelto' => 0,
            'cantidad_prestamo_proveedor_activo' => 0,
            'cantidad_prestamo_proveedor_devuelto' => 0,
            'cantidad_total' => 0,
        ];

        foreach ($stocks as $stock) {
            $total = $stock->getTotalGeneralAttribute();

            $porAlmacen[] = [
                'almacen_id' => $stock->almacenes_prestables_id,
                'almacen_nombre' => $stock->almacenPrestable->nombre ?? 'Desconocido',
                'cantidad_disponible' => $stock->cantidad_disponible,
                'prestamos_clientes' => [
                    'activo' => $stock->cantidad_prestamo_cliente_activo,
                    'devuelto' => $stock->cantidad_prestamo_cliente_devuelto,
                    'total_prestado' => $stock->getTotalPrestadoClientesAttribute(),
                ],
                'prestamos_eventos' => [
                    'activo' => $stock->cantidad_prestamo_evento_activo,
                    'devuelto' => $stock->cantidad_prestamo_evento_devuelto,
                    'total_prestado' => $stock->getTotalPrestadoEventosAttribute(),
                ],
                'prestamos_proveedores' => [
                    'activo' => $stock->cantidad_prestamo_proveedor_activo,
                    'devuelto' => $stock->cantidad_prestamo_proveedor_devuelto,
                    'total_prestado' => $stock->getTotalPrestadoProveedoresAttribute(),
                ],
                'cantidad_total' => $total,
            ];

            $totales['cantidad_disponible'] += $stock->cantidad_disponible;
            $totales['cantidad_prestamo_cliente_activo'] += $stock->cantidad_prestamo_cliente_activo;
            $totales['cantidad_prestamo_cliente_devuelto'] += $stock->cantidad_prestamo_cliente_devuelto;
            $totales['cantidad_prestamo_evento_activo'] += $stock->cantidad_prestamo_evento_activo;
            $totales['cantidad_prestamo_evento_devuelto'] += $stock->cantidad_prestamo_evento_devuelto;
            $totales['cantidad_prestamo_proveedor_activo'] += $stock->cantidad_prestamo_proveedor_activo;
            $totales['cantidad_prestamo_proveedor_devuelto'] += $stock->cantidad_prestamo_proveedor_devuelto;
            $totales['cantidad_total'] += $total;
        }

        return [
            'prestable_id' => $prestableId,
            'por_almacen' => $porAlmacen,
            'totales' => $totales,
            'cantidad_almacenes' => count($porAlmacen),
        ];
    }
}

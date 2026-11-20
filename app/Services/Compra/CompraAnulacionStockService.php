<?php

namespace App\Services\Compra;

use App\Exceptions\CompraNoAnulableException;
use App\Models\Compra;
use App\Models\MovimientoInventario;
use App\Models\StockProducto;
use App\Services\Stock\MovimientoInventarioService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Reversión de stock al anular una compra.
 *
 * Regla: se devuelve exactamente lo que la compra aportó a cada lote (fila de stock_productos),
 * y solo desde ese mismo lote. Si en ese lote ya no está disponible todo lo aportado
 * (vendido, reservado en proformas o dado de baja), la anulación se bloquea.
 *
 * El aporte por lote se calcula con todos los movimientos de la compra:
 * entradas, reversiones por edición (<numero>-REV), asignaciones y transferencias de lote.
 */
class CompraAnulacionStockService
{
    private const EPSILON = 0.0001;

    public function __construct(private MovimientoInventarioService $movimientoService)
    {
    }

    /**
     * Cantidad neta que la compra aportó a cada fila de stock: [stock_producto_id => cantidad > 0]
     */
    public function aportesPorLote(Compra $compra): array
    {
        $movimientos = MovimientoInventario::whereIn('numero_documento', [$compra->numero, $compra->numero . '-REV'])
            ->where(fn($q) => $q->where('anulado', false)->orWhereNull('anulado'))
            ->where(fn($q) => $q->whereNull('referencia_tipo')->orWhere('referencia_tipo', '!=', 'compra_anulacion'))
            ->get(['id', 'stock_producto_id', 'cantidad', 'observacion']);

        $aportes = [];
        foreach ($movimientos as $movimiento) {
            $signo = (float) $movimiento->cantidad < 0 ? -1 : 1;
            $observacion = json_decode((string) $movimiento->observacion, true);
            $lotes = is_array($observacion) ? ($observacion['detalles_lotes'] ?? null) : null;

            if (is_array($lotes) && count($lotes) > 0) {
                // Movimiento agrupado por producto: el detalle por lote está en la observación
                foreach ($lotes as $lote) {
                    $id = (int) ($lote['stock_producto_id'] ?? 0);
                    if ($id) {
                        $aportes[$id] = ($aportes[$id] ?? 0) + $signo * abs((float) ($lote['cantidad'] ?? 0));
                    }
                }
            } elseif ($movimiento->stock_producto_id) {
                $aportes[$movimiento->stock_producto_id] = ($aportes[$movimiento->stock_producto_id] ?? 0) + (float) $movimiento->cantidad;
            }
        }

        return array_filter($aportes, fn($cantidad) => $cantidad > self::EPSILON);
    }

    /**
     * Motivos por los que el stock de la compra no se puede revertir (vacío si se puede).
     *
     * @return string[]
     */
    public function motivosBloqueo(Compra $compra, ?array $aportes = null, bool $bloquear = false): array
    {
        $aportes ??= $this->aportesPorLote($compra);

        if (empty($aportes)) {
            return ['No se encontró el registro de entrada de stock de esta compra, por lo que no se puede saber qué devolver. Revisa el inventario manualmente.'];
        }

        $query = StockProducto::withTrashed()->with('producto:id,nombre')->whereIn('id', array_keys($aportes));
        if ($bloquear) {
            $query->lockForUpdate();
        }
        $stocks = $query->get()->keyBy('id');

        $motivos = [];
        $aportadoPorProducto = [];

        foreach ($aportes as $stockId => $aportado) {
            $stock = $stocks->get($stockId);
            if (!$stock) {
                $motivos[] = "El lote donde ingresó parte de la compra ya no existe (registro #{$stockId}).";
                continue;
            }

            $nombre = $stock->producto?->nombre ?? "Producto #{$stock->producto_id}";
            $lote = $stock->lote ? "lote {$stock->lote}" : 'sin lote';
            $aportadoPorProducto[$stock->producto_id] = ($aportadoPorProducto[$stock->producto_id] ?? 0) + $aportado;

            if ($stock->trashed()) {
                $motivos[] = "{$nombre} ({$lote}): el lote fue dado de baja.";
                continue;
            }

            $disponible = max(0, (float) $stock->cantidad_disponible);
            if ($disponible + self::EPSILON >= $aportado) {
                continue;
            }

            // Explicar qué pasó con lo que falta: primero lo reservado, el resto se vendió o retiró
            $faltante = $aportado - $disponible;
            $reservado = min($faltante, max(0, (float) $stock->cantidad_reservada));
            $consumido = $faltante - $reservado;

            $partes = [];
            if ($reservado > self::EPSILON) {
                $partes[] = $this->num($reservado) . ' reservadas en proformas';
            }
            if ($consumido > self::EPSILON) {
                $partes[] = $this->num($consumido) . ' ya vendidas o retiradas';
            }

            $motivos[] = "{$nombre} ({$lote}): ingresaron {$this->num($aportado)} y solo quedan {$this->num($disponible)} disponibles en el lote ("
                . implode(' y ', $partes) . ').';
        }

        // Control de consistencia: lo registrado en inventario debe coincidir con los detalles de la compra
        $compra->loadMissing('detalles.producto:id,nombre');
        foreach ($compra->detalles->groupBy('producto_id') as $productoId => $detalles) {
            $esperado = (float) $detalles->sum('cantidad');
            $registrado = $aportadoPorProducto[$productoId] ?? 0;
            if (abs($esperado - $registrado) > self::EPSILON) {
                $nombre = $detalles->first()->producto?->nombre ?? "Producto #{$productoId}";
                $motivos[] = "{$nombre}: la compra tiene {$this->num($esperado)} unidades pero el inventario registra {$this->num($registrado)} ingresadas por esta compra. Revisa el inventario manualmente.";
            }
        }

        return $motivos;
    }

    /**
     * Revierte el stock aportado por la compra, lote por lote.
     * Debe llamarse dentro de una transacción. Lanza CompraNoAnulableException si no se puede.
     */
    public function revertir(Compra $compra, string $motivo): void
    {
        $aportes = $this->aportesPorLote($compra);

        // Verificar con las filas bloqueadas para evitar que una venta concurrente cambie el stock
        $motivos = $this->motivosBloqueo($compra, $aportes, bloquear: true);
        if (!empty($motivos)) {
            throw new CompraNoAnulableException($compra->numero, $motivos);
        }

        $stocks = StockProducto::whereIn('id', array_keys($aportes))->get()->keyBy('id');

        foreach ($stocks->groupBy('producto_id') as $productoId => $stocksProducto) {
            $almacenId = $stocksProducto->first()->almacen_id;
            $totalesAntes = $this->totalesProducto($productoId, $almacenId);
            $detallesLotes = [];
            $total = 0;

            foreach ($stocksProducto as $stock) {
                $cantidad = $aportes[$stock->id];
                $antes = [(float) $stock->cantidad, (float) $stock->cantidad_disponible, (float) $stock->cantidad_reservada];

                $stock->decrement('cantidad', $cantidad);
                $stock->decrement('cantidad_disponible', $cantidad);
                $stock->refresh();

                $detallesLotes[] = [
                    'stock_producto_id'             => $stock->id,
                    'lote'                          => $stock->lote,
                    'cantidad'                      => -$cantidad,
                    'cantidad_total_anterior'       => $antes[0],
                    'cantidad_total_posterior'      => (float) $stock->cantidad,
                    'cantidad_disponible_anterior'  => $antes[1],
                    'cantidad_disponible_posterior' => (float) $stock->cantidad_disponible,
                    'cantidad_reservada_anterior'   => $antes[2],
                    'cantidad_reservada_posterior'  => (float) $stock->cantidad_reservada,
                ];
                $total += $cantidad;
            }

            $totalesDespues = $this->totalesProducto($productoId, $almacenId);

            $this->movimientoService->registrarMovimientoAgrupado(
                $productoId,
                $almacenId,
                MovimientoInventario::TIPO_SALIDA_AJUSTE,
                'compra_anulacion',
                -$total,
                $compra->numero,
                $detallesLotes,
                [
                    'referencia_id'       => $compra->id,
                    'totales_previos'     => [
                        'cantidad_total_anterior'      => $totalesAntes['cantidad'],
                        'cantidad_disponible_anterior' => $totalesAntes['disponible'],
                        'cantidad_reservada_anterior'  => $totalesAntes['reservada'],
                    ],
                    'totales_posteriores' => [
                        'cantidad_total_posterior'      => $totalesDespues['cantidad'],
                        'cantidad_disponible_posterior' => $totalesDespues['disponible'],
                        'cantidad_reservada_posterior'  => $totalesDespues['reservada'],
                    ],
                    'observacion_extra'   => [
                        'compra_numero' => $compra->numero,
                        'compra_id'     => $compra->id,
                        'motivo'        => "Reversión por anulación de compra: {$motivo}",
                    ],
                ]
            );
        }

        Log::info('✅ Stock revertido por anulación de compra (por lote)', [
            'compra_numero' => $compra->numero,
            'lotes'         => $aportes,
        ]);
    }

    private function totalesProducto(int $productoId, int $almacenId): array
    {
        $t = StockProducto::where('producto_id', $productoId)
            ->where('almacen_id', $almacenId)
            ->selectRaw('COALESCE(SUM(cantidad),0) c, COALESCE(SUM(cantidad_disponible),0) d, COALESCE(SUM(cantidad_reservada),0) r')
            ->first();

        return ['cantidad' => (float) $t->c, 'disponible' => (float) $t->d, 'reservada' => (float) $t->r];
    }

    private function num(float $n): string
    {
        return rtrim(rtrim(number_format($n, 4, ',', '.'), '0'), ',');
    }
}

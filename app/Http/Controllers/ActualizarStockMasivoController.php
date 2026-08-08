<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\StockProducto;
use App\Models\MovimientoInventario;
use App\Services\Stock\MovimientoStockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use League\Csv\Reader;
use League\Csv\Writer;
use SplFileObject;

/**
 * Controller: ActualizarStockMasivoController
 *
 * Responsabilidades:
 * ✅ Mostrar página de actualización masiva de stock
 * ✅ Descargar plantilla CSV con productos actuales
 * ✅ Procesar CSV y actualizar stock
 * ✅ Crear movimientos en movimientos_inventario
 */
class ActualizarStockMasivoController extends Controller
{
    protected $movimientoStockService;

    public function __construct(MovimientoStockService $movimientoStockService)
    {
        $this->movimientoStockService = $movimientoStockService;
    }

    /**
     * Mostrar página de actualización masiva
     */
    public function index()
    {
        return Inertia::render('inventario/ActualizarStockMasivo', [
            'message' => 'Cargue un CSV para actualizar el stock masivamente',
        ]);
    }

    /**
     * Descargar plantilla CSV con productos actuales
     *
     * Estructura: id|sku|nombre|cantidad_total|lote_fifo
     * - cantidad_total: suma de todos los lotes del producto
     * - lote_fifo: lote más antiguo (FIFO) para actualización
     */
    public function descargarPlantilla()
    {
        Log::info('📥 [ActualizarStockMasivo] Descargando plantilla CSV');

        try {
            $almacenId = auth()->user()->empresa->almacen_id ?? 1;

            // Obtener todos los productos con su stock en el almacén del usuario
            $productos = Producto::with(['stock' => function ($query) use ($almacenId) {
                $query->where('almacen_id', $almacenId)
                    ->orderBy('fecha_vencimiento', 'asc')
                    ->orderBy('fecha_actualizacion', 'asc');
            }])->get();

            // Crear CSV en memoria
            $csv = Writer::createFromString('');
            $csv->setDelimiter('|');

            // Escribir encabezados
            $csv->insertOne(['id', 'sku', 'nombre', 'cantidad_total', 'lote_fifo']);

            // Escribir datos de productos
            $productos->each(function ($producto) use ($csv) {
                // Sumar cantidad total de todos los lotes del producto
                $cantidadTotal = $producto->stock->sum('cantidad') ?? 0;

                // Obtener lote FIFO (primero de la lista ordenada)
                $loteFifo = $producto->stock->first()?->lote ?? null;

                $csv->insertOne([
                    $producto->id,
                    $producto->sku,
                    $producto->nombre,
                    $cantidadTotal,
                    $loteFifo ?? '', // Vacío si no hay lote
                ]);
            });

            // Descargar archivo
            return response($csv->toString())
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="plantilla-actualizar-stock-' . date('Y-m-d-His') . '.csv"');

        } catch (\Exception $e) {
            Log::error('❌ Error descargando plantilla CSV', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['error' => 'Error al descargar plantilla: ' . $e->getMessage()]);
        }
    }

    /**
     * Procesar CSV cargado y actualizar stock
     *
     * Lógica:
     * - Si lote está vacío y no hay stock: crear con lote=null
     * - Si lote está especificado: actualizar ese lote específicamente
     * - Registra movimiento con lote_id para trazabilidad
     */
    public function procesarCSV(Request $request)
    {
        Log::info('📥 [ActualizarStockMasivo] Procesando CSV cargado');

        $request->validate([
            'csv' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $file = $request->file('csv');
                $csv = Reader::createFromPath($file->getRealPath(), 'r');
                $csv->setDelimiter('|');
                $csv->setHeaderOffset(0); // Primera fila es encabezado

                $almacenId = auth()->user()->empresa->almacen_id ?? 1;
                $registrosActualizados = 0;
                $errores = [];
                $movimientos = [];

                // Procesar cada fila del CSV
                foreach ($csv as $index => $fila) {
                    try {
                        $productoId = (int) ($fila['id'] ?? 0);
                        $cantidadNueva = (int) ($fila['cantidad_total'] ?? 0);
                        $loteFifo = trim($fila['lote_fifo'] ?? '');

                        if (!$productoId) {
                            $errores[] = "Fila " . ($index + 2) . ": ID de producto inválido";
                            continue;
                        }

                        // Obtener producto
                        $producto = Producto::find($productoId);
                        if (!$producto) {
                            $errores[] = "Fila " . ($index + 2) . ": Producto ID $productoId no encontrado";
                            continue;
                        }

                        // Obtener stock actual (suma de todos los lotes)
                        $stockActual = StockProducto::where('producto_id', $productoId)
                            ->where('almacen_id', $almacenId)
                            ->sum('cantidad') ?? 0;

                        $diferencia = $cantidadNueva - $stockActual;

                        if ($diferencia !== 0 || $stockActual === 0) {
                            // Obtener o crear stock_producto
                            $stockProducto = $this->obtenerOCrearStockProducto(
                                $productoId,
                                $almacenId,
                                $loteFifo,
                                $cantidadNueva,
                                $stockActual
                            );

                            if (!$stockProducto) {
                                $errores[] = "Fila " . ($index + 2) . ": No se pudo obtener/crear stock para el producto";
                                continue;
                            }

                            // Actualizar cantidad en el lote específico
                            $stockProducto->update([
                                'cantidad' => $cantidadNueva,
                                'cantidad_disponible' => max(0, $cantidadNueva),
                                'fecha_actualizacion' => now(),
                            ]);

                            // Crear movimiento en movimientos_inventario
                            $movimiento = $this->crearMovimiento(
                                $productoId,
                                $stockProducto->id,
                                $diferencia,
                                $stockActual,
                                $cantidadNueva,
                                $producto,
                                $stockProducto->lote
                            );

                            if ($movimiento) {
                                $movimientos[] = $movimiento;
                            }
                        }

                        $registrosActualizados++;

                        Log::info('✅ [ActualizarStockMasivo] Producto actualizado', [
                            'producto_id' => $productoId,
                            'nombre' => $producto->nombre,
                            'lote' => $loteFifo ?: 'null',
                            'stock_anterior' => $stockActual,
                            'stock_nuevo' => $cantidadNueva,
                            'diferencia' => $diferencia,
                        ]);

                    } catch (\Exception $e) {
                        $errores[] = "Fila " . ($index + 2) . ": " . $e->getMessage();
                        Log::error('Error procesando fila', [
                            'fila' => $index + 2,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }

                Log::info('✅ [ActualizarStockMasivo] CSV procesado', [
                    'registros_actualizados' => $registrosActualizados,
                    'errores_count' => count($errores),
                    'movimientos_creados' => count($movimientos),
                ]);

                return response()->json([
                    'success' => true,
                    'mensaje' => "$registrosActualizados productos actualizados",
                    'registros_actualizados' => $registrosActualizados,
                    'errores' => $errores,
                    'movimientos_creados' => count($movimientos),
                ]);

            });

        } catch (\Exception $e) {
            Log::error('❌ Error procesando CSV', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al procesar CSV: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener o crear stock_producto
     *
     * Lógica:
     * - Si lote está vacío y no hay stock: crear con lote=null
     * - Si lote está especificado: buscar ese lote
     * - Si lote existe: retornar ese stock
     * - Si no existe: crear nuevo con ese lote
     */
    private function obtenerOCrearStockProducto(
        int $productoId,
        int $almacenId,
        string $loteFifo,
        int $cantidadNueva,
        int $stockActual
    ): ?StockProducto {
        $stocks = StockProducto::where('producto_id', $productoId)
            ->where('almacen_id', $almacenId)
            ->get();

        // Si lote está vacío y no hay stock: crear con lote=null
        if (empty($loteFifo) && $stocks->isEmpty()) {
            $stockProducto = StockProducto::create([
                'producto_id' => $productoId,
                'almacen_id' => $almacenId,
                'sector_id' => 1, // Primer sector
                'lote' => null,
                'cantidad' => $cantidadNueva,
                'cantidad_disponible' => $cantidadNueva,
                'cantidad_reservada' => 0,
                'fecha_vencimiento' => null,
                'fecha_actualizacion' => now(),
            ]);

            Log::info('📦 [ActualizarStockMasivo] Stock creado (lote=null)', [
                'producto_id' => $productoId,
                'cantidad' => $cantidadNueva,
            ]);

            return $stockProducto;
        }

        // Si lote está vacío pero hay stock: usar el lote FIFO (más antiguo)
        if (empty($loteFifo) && !$stocks->isEmpty()) {
            return $stocks->first();
        }

        // Si lote está especificado: buscar ese lote
        if (!empty($loteFifo)) {
            $stock = StockProducto::where('producto_id', $productoId)
                ->where('almacen_id', $almacenId)
                ->where('lote', $loteFifo)
                ->first();

            if ($stock) {
                return $stock;
            }

            // Si lote no existe: crear nuevo con ese lote
            $stockProducto = StockProducto::create([
                'producto_id' => $productoId,
                'almacen_id' => $almacenId,
                'sector_id' => 1, // Primer sector
                'lote' => $loteFifo,
                'cantidad' => $cantidadNueva,
                'cantidad_disponible' => $cantidadNueva,
                'cantidad_reservada' => 0,
                'fecha_vencimiento' => null,
                'fecha_actualizacion' => now(),
            ]);

            Log::info('📦 [ActualizarStockMasivo] Stock creado (lote especificado)', [
                'producto_id' => $productoId,
                'lote' => $loteFifo,
                'cantidad' => $cantidadNueva,
            ]);

            return $stockProducto;
        }

        return null;
    }

    /**
     * Crear movimiento en movimientos_inventario
     *
     * Tipo: AJUSTE_MASIVO con trazabilidad de lote
     */
    private function crearMovimiento(
        int $productoId,
        int $stockProductoId,
        int $diferencia,
        int $stockAnterior,
        int $stockNuevo,
        Producto $producto,
        ?string $lote = null
    )
    {
        return $this->movimientoStockService->registrarMovimientoYActualizar(
            stockProductoId: $stockProductoId,
            cantidad: $diferencia,
            tipo: MovimientoInventario::TIPO_AJUSTE_MASIVO,
            referencia_tipo: 'ajuste_masivo',
            referencia_id: $productoId,
            metadataAdicional: [
                'producto_id' => $productoId,
                'producto_nombre' => $producto->nombre,
                'lote' => $lote ?? 'null',
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $stockNuevo,
                'tipo_ajuste' => 'Carga masiva de stock',
                'fecha_carga' => now()->toDateTimeString(),
            ],
            numeroDocumento: 'AJUSTE-MASIVO-' . date('Ymd-His'),
        );
    }
}

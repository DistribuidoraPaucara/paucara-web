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
        return Inertia::render('Inventario/ActualizarStockMasivo', [
            'message' => 'Cargue un CSV para actualizar el stock masivamente',
        ]);
    }

    /**
     * Descargar plantilla CSV con productos actuales
     *
     * Estructura: id|sku|nombre|cantidad
     * La cantidad es stock_productos.cantidad actual
     */
    public function descargarPlantilla()
    {
        Log::info('📥 [ActualizarStockMasivo] Descargando plantilla CSV');

        try {
            // Obtener todos los productos con su stock
            $productos = Producto::with(['stockProductos'])
                ->get();

            // Crear CSV en memoria
            $csv = Writer::createFromString('');
            $csv->setDelimiter('|');

            // Escribir encabezados
            $csv->insertOne(['id', 'sku', 'nombre', 'cantidad']);

            // Escribir datos de productos
            $productos->each(function ($producto) use ($csv) {
                // Sumar cantidad total de todos los lotes del producto
                $cantidadTotal = $producto->stockProductos->sum('cantidad') ?? 0;

                $csv->insertOne([
                    $producto->id,
                    $producto->sku,
                    $producto->nombre,
                    $cantidadTotal,
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

                $registrosActualizados = 0;
                $errores = [];
                $movimientos = [];

                // Procesar cada fila del CSV
                foreach ($csv as $index => $fila) {
                    try {
                        $productoId = (int) ($fila['id'] ?? 0);
                        $cantidadNueva = (int) ($fila['cantidad'] ?? 0);

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

                        // Obtener almacén del usuario autenticado
                        $almacenId = auth()->user()->empresa->almacen_id ?? 1;

                        // Obtener stock actual (suma de todos los lotes)
                        $stockActual = StockProducto::where('producto_id', $productoId)
                            ->where('almacen_id', $almacenId)
                            ->sum('cantidad') ?? 0;

                        $diferencia = $cantidadNueva - $stockActual;

                        if ($diferencia !== 0) {
                            // Actualizar o crear stock_productos
                            $this->actualizarStock(
                                $productoId,
                                $almacenId,
                                $cantidadNueva,
                                $stockActual
                            );

                            // Crear movimiento en movimientos_inventario
                            $this->crearMovimiento(
                                $productoId,
                                $diferencia,
                                $stockActual,
                                $cantidadNueva,
                                $producto
                            );

                            $movimientos[] = $movimiento;
                        }

                        $registrosActualizados++;

                        Log::info('✅ [ActualizarStockMasivo] Producto actualizado', [
                            'producto_id' => $productoId,
                            'nombre' => $producto->nombre,
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
     * Actualizar stock_productos
     *
     * Lógica: Si no hay lotes, crear uno. Si hay, sumar/restar según diferencia.
     */
    private function actualizarStock(int $productoId, int $almacenId, int $cantidadNueva, int $stockActual)
    {
        $stocks = StockProducto::where('producto_id', $productoId)
            ->where('almacen_id', $almacenId)
            ->get();

        if ($stocks->isEmpty()) {
            // Crear nuevo stock
            StockProducto::create([
                'producto_id' => $productoId,
                'almacen_id' => $almacenId,
                'lote' => 'CARGA-' . date('Y-m-d'),
                'cantidad' => $cantidadNueva,
                'cantidad_disponible' => $cantidadNueva,
                'cantidad_reservada' => 0,
                'fecha_vencimiento' => null,
                'fecha_actualizacion' => now(),
            ]);

            Log::info('📦 [ActualizarStockMasivo] Stock creado', [
                'producto_id' => $productoId,
                'cantidad' => $cantidadNueva,
            ]);

        } else {
            // Actualizar primer lote (el más antiguo)
            $diferencia = $cantidadNueva - $stockActual;

            $stocks->first()->update([
                'cantidad' => $cantidadNueva,
                'cantidad_disponible' => max(0, $cantidadNueva),
                'fecha_actualizacion' => now(),
            ]);

            Log::info('📦 [ActualizarStockMasivo] Stock actualizado', [
                'producto_id' => $productoId,
                'cantidad_anterior' => $stockActual,
                'cantidad_nueva' => $cantidadNueva,
            ]);
        }
    }

    /**
     * Crear movimiento en movimientos_inventario
     *
     * Tipo: AJUSTE_MASIVO (nuevo tipo)
     */
    private function crearMovimiento(
        int $productoId,
        int $diferencia,
        int $stockAnterior,
        int $stockNuevo,
        Producto $producto
    )
    {
        // Obtener stock_producto para el movimiento
        $stockProducto = StockProducto::where('producto_id', $productoId)
            ->first();

        if (!$stockProducto) {
            Log::warning('⚠️ [ActualizarStockMasivo] No hay stock_producto para crear movimiento', [
                'producto_id' => $productoId,
            ]);
            return null;
        }

        return $this->movimientoStockService->registrarMovimientoYActualizar(
            stockProductoId: $stockProducto->id,
            cantidad: $diferencia,
            tipo: MovimientoInventario::TIPO_AJUSTE_MASIVO,
            referencia_tipo: 'ajuste_masivo',
            referencia_id: $productoId,
            metadataAdicional: [
                'producto_id' => $productoId,
                'producto_nombre' => $producto->nombre,
                'stock_anterior' => $stockAnterior,
                'stock_nuevo' => $stockNuevo,
                'tipo_ajuste' => 'Carga masiva de stock',
                'fecha_carga' => now()->toDateTimeString(),
            ],
            numeroDocumento: 'AJUSTE-MASIVO-' . date('Ymd-His'),
        );
    }
}

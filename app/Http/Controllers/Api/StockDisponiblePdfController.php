<?php
namespace App\Http\Controllers\Api;

use App\Models\StockProducto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Facades\Image;

/**
 * StockDisponiblePdfController - Generar PDF de stock disponible para preventistas
 *
 * RESPONSABILIDADES:
 * ✓ Consultar stock disponible agrupado por producto
 * ✓ Obtener precios de venta, descuento y especial para cada producto
 * ✓ Generar PDF con tabla formateada
 * ✓ Retornar como descarga binaria para app móvil
 */
class StockDisponiblePdfController
{
    /**
     * Generar y descargar PDF con listado de stock disponible
     *
     * GET /api/app/stock/pdf
     * GET /api/app/stock/pdf?incluir_stock=1
     *
     * Query parameters:
     * - incluir_stock: boolean (0|1) - Mostrar columna de stock en el PDF
     *
     * Requiere: auth:sanctum,web + platform
     *
     * Lógica:
     * - Consulta StockProducto::disponible() (cantidad_disponible > 0)
     * - Agrupa por producto_id, sumando cantidad_disponible
     * - Extrae precios VENTA, DESCUENTO, ESPECIAL de cada producto
     * - Ordena alfabéticamente por nombre de producto
     *
     * @return Response PDF como descarga binaria
     */
    public function generar(\Illuminate\Http\Request $request)
    {
        try {
            // ==========================================
            // 0️⃣ OBTENER PARÁMETROS
            // ==========================================
            $incluirStock = (bool) $request->query('incluir_stock', false);

            // ==========================================
            // 1️⃣ CONSULTA: Stock disponible agrupado
            // ==========================================
            $stocks = StockProducto::disponible()
                ->with([
                    'producto:id,nombre,sku',
                    'producto.precios' => fn($q) => $q->activos()->with('tipoPrecio:id,codigo'),
                ])
                ->selectRaw('producto_id, SUM(cantidad_disponible) as total_disponible')
                ->groupBy('producto_id')
                ->get();

            // ==========================================
            // 2️⃣ MAPEO: Extraer datos y precios
            // ==========================================
            $filas = $stocks->map(function ($s) {
                $p = $s->producto;
                return [
                    'nombre'           => $p->nombre,
                    'sku'              => $p->sku ?? '-',
                    'precio_venta'     => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento' => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'  => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'stock_disponible' => $s->total_disponible,
                ];
            })->sortBy('nombre')->values();

            // ==========================================
            // 3️⃣ PREPARAR DATOS para la vista
            // ==========================================
            $data = [
                'filas'             => $filas,
                'total_productos'   => count($filas),
                'fecha_generacion'  => now()->format('d/m/Y H:i'),
                'empresa'           => config('app.name', 'Distribuidora Paucara'),
                'incluir_stock'     => $incluirStock,
            ];

            // ==========================================
            // 4️⃣ GENERAR PDF
            // ==========================================
            $pdf = Pdf::loadView('pdf.stock-disponible-preventista', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            // ==========================================
            // 5️⃣ RETORNAR como stream binario
            // ==========================================
            return $pdf->stream('stock-disponible.pdf');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error generando PDF stock disponible', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando PDF',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Generar y descargar imagen PNG con listado de stock disponible
     *
     * GET /api/app/stock/imagen
     * GET /api/app/stock/imagen?incluir_stock=1
     *
     * Query parameters:
     * - incluir_stock: boolean (0|1) - Mostrar columna de stock en la imagen
     *
     * Requiere: auth:sanctum,web + platform
     *
     * Utiliza DomPDF para generar PDF y luego lo convierte a PNG con Imagick
     * Retorna la imagen como binario para que la app la guarde en Downloads
     *
     * @return Response PNG como descarga binaria
     */
    public function imagen(\Illuminate\Http\Request $request)
    {
        try {
            // ==========================================
            // 0️⃣ OBTENER PARÁMETROS
            // ==========================================
            $incluirStock = (bool) $request->query('incluir_stock', false);

            // ==========================================
            // 1️⃣ CONSULTA: Stock disponible agrupado
            // ==========================================
            $stocks = StockProducto::disponible()
                ->with([
                    'producto:id,nombre,sku',
                    'producto.precios' => fn($q) => $q->activos()->with('tipoPrecio:id,codigo'),
                ])
                ->selectRaw('producto_id, SUM(cantidad_disponible) as total_disponible')
                ->groupBy('producto_id')
                ->get();

            // ==========================================
            // 2️⃣ MAPEO: Extraer datos y precios
            // ==========================================
            $filas = $stocks->map(function ($s) {
                $p = $s->producto;
                return [
                    'nombre'           => $p->nombre,
                    'sku'              => $p->sku ?? '-',
                    'precio_venta'     => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento' => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'  => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'stock_disponible' => $s->total_disponible,
                ];
            })->sortBy('nombre')->values();

            // ==========================================
            // 3️⃣ PREPARAR DATOS para la vista
            // ==========================================
            $data = [
                'filas'             => $filas,
                'total_productos'   => count($filas),
                'fecha_generacion'  => now()->format('d/m/Y H:i'),
                'empresa'           => config('app.name', 'Distribuidora Paucara'),
                'incluir_stock'     => $incluirStock,
            ];

            // ==========================================
            // 4️⃣ GENERAR PDF con DomPDF
            // ==========================================
            $pdf = Pdf::loadView('pdf.stock-disponible-preventista', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            $pdfContent = $pdf->output();

            // ==========================================
            // 5️⃣ INTENTAR CONVERTIR A PNG (opcional)
            // ==========================================
            // Si wkhtmltoimage está disponible, convertir a PNG
            // Si no, simplemente retornar PDF
            $tempHtmlPath  = storage_path('app/temp/stock-' . uniqid() . '.html');
            $tempImagePath = storage_path('app/temp/stock-' . uniqid() . '.png');
            $pngContent    = null;

            try {
                // Crear carpeta temp si no existe
                if (! is_dir(dirname($tempHtmlPath))) {
                    mkdir(dirname($tempHtmlPath), 0755, true);
                }

                // Guardar HTML temporal
                $html = view('pdf.stock-disponible-preventista', $data)->render();
                file_put_contents($tempHtmlPath, $html);

                // Intentar usar wkhtmltoimage
                $command = sprintf(
                    'wkhtmltoimage --quiet %s %s 2>&1',
                    escapeshellarg($tempHtmlPath),
                    escapeshellarg($tempImagePath)
                );

                exec($command, $output, $returnCode);

                if ($returnCode === 0 && file_exists($tempImagePath)) {
                    $pngContent = file_get_contents($tempImagePath);
                    $fileSize   = filesize($tempImagePath);
                    Log::info('✅ Imagen PNG generada con wkhtmltoimage', [
                        'size_bytes' => $fileSize,
                    ]);

                    // Limpiar archivos temporales
                    @unlink($tempHtmlPath);
                    @unlink($tempImagePath);
                }
            } catch (\Exception $e) {
                Log::debug('ℹ️ wkhtmltoimage no disponible, usando PDF');
            }

            // ==========================================
            // 6️⃣ RETORNAR PNG si fue generado, sino PDF
            // ==========================================
            if ($pngContent) {
                // Se generó PNG exitosamente
                return response($pngContent)
                    ->header('Content-Type', 'image/png')
                    ->header('Content-Disposition', 'attachment; filename=stock-disponible.png');
            } else {
                // Fallback: Retornar PDF (compatible con Railway y todos los servidores)
                Log::info('📄 Retornando stock como PDF (fallback)');
                return response($pdfContent)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename=stock-disponible.pdf');
            }

        } catch (\Exception $e) {
            Log::error('Error generando imagen stock disponible', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando imagen',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}

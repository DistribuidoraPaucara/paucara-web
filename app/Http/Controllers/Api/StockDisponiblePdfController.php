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
            // 2️⃣ MAPEO: Extraer datos y precios con rangos
            // ==========================================
            $filas = $stocks->map(function ($s) {
                $p = $s->producto;

                // Obtener rangos para cada tipo de precio
                $rangosVenta = $this->obtenerRangosPorTipo($p, 'VENTA');
                $rangosDescuento = $this->obtenerRangosPorTipo($p, 'DESCUENTO');
                $rangosEspecial = $this->obtenerRangosPorTipo($p, 'ESPECIAL');

                return [
                    'nombre'           => $p->nombre,
                    'sku'              => $p->sku ?? '-',
                    'precio_venta'     => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento' => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'  => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'stock_disponible' => $s->total_disponible,
                    'rangos_venta'     => $rangosVenta,
                    'rangos_descuento' => $rangosDescuento,
                    'rangos_especial'  => $rangosEspecial,
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
            // 2️⃣ MAPEO: Extraer datos y precios con rangos
            // ==========================================
            $filas = $stocks->map(function ($s) {
                $p = $s->producto;

                // Obtener rangos para cada tipo de precio
                $rangosVenta = $this->obtenerRangosPorTipo($p, 'VENTA');
                $rangosDescuento = $this->obtenerRangosPorTipo($p, 'DESCUENTO');
                $rangosEspecial = $this->obtenerRangosPorTipo($p, 'ESPECIAL');

                return [
                    'nombre'           => $p->nombre,
                    'sku'              => $p->sku ?? '-',
                    'precio_venta'     => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento' => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'  => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'stock_disponible' => $s->total_disponible,
                    'rangos_venta'     => $rangosVenta,
                    'rangos_descuento' => $rangosDescuento,
                    'rangos_especial'  => $rangosEspecial,
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
                    $originalSize = filesize($tempImagePath);

                    // Optimizar imagen con ImageMagick si está disponible
                    try {
                        $this->optimizarImagen($tempImagePath);
                    } catch (\Exception $e) {
                        Log::debug('ℹ️ No se pudo optimizar imagen: ' . $e->getMessage());
                    }

                    $pngContent = file_get_contents($tempImagePath);
                    $finalSize  = filesize($tempImagePath);
                    Log::info('✅ Imagen PNG generada y optimizada', [
                        'original_bytes' => $originalSize,
                        'final_bytes'    => $finalSize,
                        'reduction'      => round(((1 - $finalSize / $originalSize) * 100), 2) . '%',
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
                    ->header('Content-Disposition', 'attachment; filename=stock-disponible.png')
                    ->header('Cache-Control', 'public, max-age=3600')
                    ->header('X-Image-Optimized', 'true');
            } else {
                // Fallback: Retornar PDF (compatible con Railway y todos los servidores)
                Log::info('📄 Retornando stock como PDF (fallback)');
                return response($pdfContent)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename=stock-disponible.pdf')
                    ->header('Cache-Control', 'public, max-age=3600');
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

    /**
     * Optimizar imagen PNG para reducir tamaño sin perder mucha calidad
     * Usa ImageMagick (disponible vía shell) o Imagick PHP
     */
    private function optimizarImagen(string $imagePath): void
    {
        // Método 1: Intentar usar ImageMagick via shell (convert)
        try {
            $command = sprintf(
                'convert %s -strip -quality 85 -interlace Plane %s',
                escapeshellarg($imagePath),
                escapeshellarg($imagePath)
            );
            exec($command, $output, $returnCode);

            if ($returnCode === 0) {
                Log::debug('✅ Imagen optimizada con ImageMagick convert');
                return;
            }
        } catch (\Exception $e) {
            Log::debug('ℹ️ ImageMagick convert no disponible');
        }

        // Método 2: Intentar usar PHP Imagick extension
        if (extension_loaded('imagick')) {
            try {
                $image = new \Imagick($imagePath);
                $image->setImageFormat('png');
                $image->setImageCompressionQuality(85);
                $image->stripImage();
                $image->writeImage($imagePath);
                $image->destroy();
                Log::debug('✅ Imagen optimizada con Imagick extension');
                return;
            } catch (\Exception $e) {
                Log::debug('ℹ️ Imagick extension error: ' . $e->getMessage());
            }
        }

        // Método 3: Intentar usar optipng para comprimir PNG
        try {
            $command = sprintf('optipng -o2 %s 2>&1', escapeshellarg($imagePath));
            exec($command, $output, $returnCode);

            if ($returnCode === 0) {
                Log::debug('✅ Imagen optimizada con optipng');
                return;
            }
        } catch (\Exception $e) {
            Log::debug('ℹ️ optipng no disponible');
        }

        Log::warning('⚠️ No se pudo optimizar imagen - usar sin optimizar');
    }

    /**
     * Obtener rangos de precios para un tipo específico
     * Retorna array con estructura: [
     *   ['cantidad_minima' => 1, 'cantidad_maxima' => 10, 'precio' => 100],
     *   ['cantidad_minima' => 11, 'cantidad_maxima' => 50, 'precio' => 95],
     *   ...
     * ]
     */
    private function obtenerRangosPorTipo(\App\Models\Producto $producto, string $tipoPrecio): array
    {
        try {
            $empresaId = auth()->user()->empresa_id ?? 1;

            // Obtener el tipo de precio
            $tipo = \App\Models\TipoPrecio::where('codigo', $tipoPrecio)->first();
            if (!$tipo) {
                return [];
            }

            // Obtener rangos activos y vigentes para este tipo de precio
            $rangos = \App\Models\PrecioRangoCantidadProducto::activos()
                ->vigentes()
                ->where('empresa_id', $empresaId)
                ->where('producto_id', $producto->id)
                ->where('tipo_precio_id', $tipo->id)
                ->orderBy('cantidad_minima', 'asc')
                ->get();

            if ($rangos->isEmpty()) {
                return [];
            }

            // Mapear rangos con sus precios
            return $rangos->map(function ($rango) use ($producto) {
                $precio = $producto->obtenerPrecio($rango->tipo_precio_id);
                return [
                    'cantidad_minima' => $rango->cantidad_minima,
                    'cantidad_maxima' => $rango->cantidad_maxima,
                    'rango_texto' => $rango->cantidad_maxima
                        ? "{$rango->cantidad_minima}-{$rango->cantidad_maxima}"
                        : "{$rango->cantidad_minima}+",
                    'precio' => $precio?->precio,
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::debug('Error obteniendo rangos de precios', [
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }
}

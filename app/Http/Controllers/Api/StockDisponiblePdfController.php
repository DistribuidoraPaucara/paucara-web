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
            // 4️⃣ GENERAR PDF (OPTIMIZADO)
            // ==========================================
            $pdf = Pdf::loadView('pdf.stock-disponible-preventista', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 5)
                ->setOption('margin-bottom', 5)
                ->setOption('margin-left', 5)
                ->setOption('margin-right', 5)
                ->setOption('dpi', 150)
                ->setOption('enable_remote', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isPhpEnabled', false);

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
            $quality = (int) $request->query('quality', 85);
            $quality = max(50, min(100, $quality)); // Limitar entre 50-100
            $usePythonService = (bool) $request->query('use_python', false); // Nuevo: usar servicio Python

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
            // 4️⃣ GENERAR PDF con DomPDF (OPTIMIZADO)
            // ==========================================
            $pdf = Pdf::loadView('pdf.stock-disponible-preventista', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 5)
                ->setOption('margin-bottom', 5)
                ->setOption('margin-left', 5)
                ->setOption('margin-right', 5)
                ->setOption('dpi', 150)  // Renderizar a 150 DPI (mejor que default 96)
                ->setOption('enable_remote', true)  // Permitir recursos remotos
                ->setOption('isHtml5ParserEnabled', true)  // Mejor parsing de HTML
                ->setOption('isPhpEnabled', false);  // Seguridad

            $pdfContent = $pdf->output();
            $pdfSize = strlen($pdfContent);
            $imageContent = null;

            // ==========================================
            // 5️⃣ CONVERTIR PDF A JPEG
            // ==========================================
            if ($usePythonService) {
                // Opción 1: Usar servicio Python remoto (Railway)
                $pdfImageService = new \App\Services\PdfImageService();
                $imageContent = $pdfImageService->convertir($pdfContent, [
                    'dpi' => 150,
                    'quality' => $quality,
                    'format' => 'jpeg',
                    'optimize' => true,
                ]);

                if ($imageContent) {
                    Log::info('✅ Imagen JPEG generada con servicio Python', [
                        'pdf_size' => $pdfSize,
                        'image_size' => strlen($imageContent),
                        'reduction' => round(((1 - strlen($imageContent) / $pdfSize) * 100), 2) . '%',
                    ]);
                } else {
                    Log::warning('⚠️ Servicio Python no disponible, usando ImageMagick');
                }
            }

            // Fallback: Si Python no disponible, simplemente retornar PDF
            // (ImageMagick en Windows requiere Ghostscript - no recomendado)
            if (!$imageContent) {
                Log::warning('⚠️ Servicio Python no disponible - retornando PDF', [
                    'razon' => 'ImageMagick requiere Ghostscript (no instalado en Windows)',
                    'recomendacion' => 'Desplegar servicio Python en Railway o servidor Linux',
                ]);
            }

            // ==========================================
            // 6️⃣ RETORNAR JPEG si fue generado, sino PDF
            // ==========================================
            if ($imageContent) {
                return response($imageContent)
                    ->header('Content-Type', 'image/jpeg')
                    ->header('Content-Disposition', 'attachment; filename=stock-disponible.jpg')
                    ->header('Cache-Control', 'public, max-age=3600')
                    ->header('X-Image-Optimized', 'true');
            } else {
                // Fallback: Retornar PDF si no se pudo generar imagen
                // (Nota: En local sin ImageMagick, siempre retorna PDF)
                // (En production con ImageMagick, retorna PNG)
                Log::warning('⚠️ No se pudo generar imagen PNG, retornando PDF como fallback', [
                    'environment' => app()->environment(),
                    'hint' => app()->environment('local') ? 'Instala ImageMagick para obtener PNG en local' : 'Verifica ImageMagick en production'
                ]);
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
     * Convertir PDF a JPEG usando ImageMagick con alta resolución
     * Retorna el contenido binario de la imagen o null si falla
     */
    private function convertirPdfAImagen(string $pdfPath, string $outputPath, int $quality = 90): ?string
    {
        try {
            $imagemagickCmd = $this->getImageMagickCommand();

            // Configuración mejorada con alta resolución (150 DPI)
            // -density 150: renderiza el PDF a 150 DPI (mejor que default 72)
            // -define pdf:use-cropbox=true: usa el crop box del PDF
            // -quality: compresión JPEG (dinámico, rango 50-100)
            // -strip: elimina metadatos innecesarios
            // -interlace Plane: entrelazado progresivo (mejor para web)
            // -append: une todas las páginas en una imagen larga
            $command = sprintf(
                '%s -density 150 -define pdf:use-cropbox=true %s -quality %d -strip -interlace Plane -append %s 2>&1',
                $imagemagickCmd,
                escapeshellarg($pdfPath),
                $quality,
                escapeshellarg($outputPath)
            );

            $output = [];
            $returnCode = 0;
            exec($command, $output, $returnCode);

            if ($returnCode === 0 && file_exists($outputPath)) {
                $imageContent = file_get_contents($outputPath);

                // Intentar optimizar más
                try {
                    $this->optimizarImagen($outputPath);
                    $imageContent = file_get_contents($outputPath);
                } catch (\Exception $e) {
                    Log::debug('ℹ️ No se pudo optimizar imagen: ' . $e->getMessage());
                }

                Log::info('✅ PDF convertido a JPEG con ImageMagick (150 DPI)', [
                    'density' => 150,
                    'quality' => $quality,
                    'size_kb' => round(strlen($imageContent) / 1024, 2)
                ]);

                return $imageContent;
            } else {
                Log::warning('⚠️ ImageMagick convert falló', [
                    'return_code' => $returnCode,
                    'output' => implode("\n", $output),
                    'command' => $command
                ]);
                return null;
            }
        } catch (\Exception $e) {
            Log::error('❌ Error en convertirPdfAImagen: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Detectar qué comando usar para ImageMagick
     * En Windows: busca magick.exe en rutas comunes
     * En Linux/Mac: usa 'convert'
     */
    private function getImageMagickCommand(): string
    {
        if (PHP_OS_FAMILY === 'Windows') {
            // Rutas típicas de instalación en Windows (actualizar según tu versión)
            $possiblePaths = [
                'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe',  // Tu instalación
                'C:\\Program Files\\ImageMagick-7.1.1-Q16\\magick.exe',
                'C:\\Program Files\\ImageMagick-7.1.0-Q16\\magick.exe',
                'C:\\Program Files\\ImageMagick-7.1.2-Q16\\magick.exe',
                'C:\\Program Files (x86)\\ImageMagick-7.1.1-Q16\\magick.exe',
                'C:\\Program Files (x86)\\ImageMagick-7.1.0-Q16\\magick.exe',
                'C:\\Program Files\\ImageMagick\\magick.exe',
            ];

            foreach ($possiblePaths as $path) {
                if (file_exists($path)) {
                    Log::debug('✅ ImageMagick encontrado en: ' . $path);
                    return '"' . $path . '"'; // Comillas para rutas con espacios
                }
            }

            // Si no se encuentra, intenta el comando directo (podría estar en PATH)
            Log::debug('⚠️ ImageMagick no encontrado en rutas típicas, intentando comando directo');
            return 'magick';
        }

        // En Linux/Mac, usar 'convert'
        return 'convert';
    }

    /**
     * Optimizar imagen PNG para reducir tamaño sin perder mucha calidad
     * Usa ImageMagick (disponible vía shell) o Imagick PHP
     */
    private function optimizarImagen(string $imagePath): void
    {
        // Método 1: Intentar usar ImageMagick via shell
        try {
            $imagemagickCmd = $this->getImageMagickCommand();
            $command = sprintf(
                '%s %s -strip -quality 85 -interlace Plane %s',
                $imagemagickCmd,
                escapeshellarg($imagePath),
                escapeshellarg($imagePath)
            );
            exec($command, $output, $returnCode);

            if ($returnCode === 0) {
                Log::debug('✅ Imagen optimizada con ImageMagick (' . $imagemagickCmd . ')');
                return;
            }
        } catch (\Exception $e) {
            Log::debug('ℹ️ ImageMagick no disponible');
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
     * ✅ TEST: Probar diferentes calidades de imagen
     * GET /api/app/stock/imagen/test?quality=95
     * Parámetros: quality (75-100, default 85)
     */
    public function test(\Illuminate\Http\Request $request)
    {
        $quality = (int) $request->query('quality', 85);
        $quality = max(75, min(100, $quality)); // Limitar entre 75-100

        try {
            // Datos mínimos
            $data = [
                'filas' => [
                    ['nombre' => 'Producto 1', 'sku' => 'P001', 'precio_venta' => 100, 'precio_descuento' => 90, 'precio_especial' => 80, 'stock_disponible' => 50, 'rangos_venta' => [], 'rangos_descuento' => [], 'rangos_especial' => []],
                    ['nombre' => 'Producto 2', 'sku' => 'P002', 'precio_venta' => 200, 'precio_descuento' => 180, 'precio_especial' => 160, 'stock_disponible' => 30, 'rangos_venta' => [], 'rangos_descuento' => [], 'rangos_especial' => []],
                    ['nombre' => 'Producto 3', 'sku' => 'P003', 'precio_venta' => 150, 'precio_descuento' => 135, 'precio_especial' => 120, 'stock_disponible' => 20, 'rangos_venta' => [], 'rangos_descuento' => [], 'rangos_especial' => []],
                ],
                'total_productos' => 3,
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'empresa' => config('app.name'),
                'incluir_stock' => false,
            ];

            // Generar PDF
            $pdf = Pdf::loadView('pdf.stock-disponible-preventista', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            $pdfContent = $pdf->output();
            $tempPdfPath = storage_path('app/temp/test-' . uniqid() . '.pdf');
            $tempImagePath = storage_path('app/temp/test-' . uniqid() . '.png');

            if (!is_dir(dirname($tempPdfPath))) {
                mkdir(dirname($tempPdfPath), 0755, true);
            }

            file_put_contents($tempPdfPath, $pdfContent);

            // Convertir con la calidad especificada
            $imagemagickCmd = $this->getImageMagickCommand();
            $command = sprintf(
                '%s %s -quality %d -define pdf:use-cropbox=true -alpha remove -append %s 2>&1',
                $imagemagickCmd,
                escapeshellarg($tempPdfPath),
                $quality,
                escapeshellarg($tempImagePath)
            );

            $output = [];
            $returnCode = 0;
            exec($command, $output, $returnCode);

            @unlink($tempPdfPath);

            if ($returnCode === 0 && file_exists($tempImagePath)) {
                $imageContent = file_get_contents($tempImagePath);
                $imageSize = filesize($tempImagePath);
                @unlink($tempImagePath);

                return response($imageContent)
                    ->header('Content-Type', 'image/png')
                    ->header('Content-Disposition', 'attachment; filename=test-quality-' . $quality . '.png')
                    ->header('X-Test-Quality', $quality)
                    ->header('X-Test-Size-KB', round($imageSize / 1024, 2))
                    ->header('Cache-Control', 'no-cache');
            } else {
                @unlink($tempImagePath);
                return response()->json([
                    'error' => 'Conversion failed',
                    'command' => $command,
                    'output' => implode("\n", $output),
                    'quality_tested' => $quality
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'quality_tested' => $quality
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Generar imagen con servicio Python de alta calidad
     *
     * GET /api/app/stock/imagen-python
     * GET /api/app/stock/imagen-python?incluir_stock=1
     *
     * Usa el servicio Python remoto para mejor calidad y compresión
     * Fallback automático a ImageMagick si el servicio no está disponible
     *
     * Query parameters:
     * - incluir_stock: boolean (0|1) - Mostrar columna de stock en la imagen
     *
     * @return Response JPEG desde servicio Python o fallback ImageMagick
     */
    public function imagenPython(\Illuminate\Http\Request $request)
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
            // 4️⃣ GENERAR PDF (OPTIMIZADO)
            // ==========================================
            $pdf = Pdf::loadView('pdf.stock-disponible-preventista', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 5)
                ->setOption('margin-bottom', 5)
                ->setOption('margin-left', 5)
                ->setOption('margin-right', 5)
                ->setOption('dpi', 150)
                ->setOption('enable_remote', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isPhpEnabled', false);

            $pdfContent = $pdf->output();

            // ==========================================
            // 5️⃣ CONVERTIR PDF A JPEG CON SERVICIO PYTHON
            // ==========================================
            $pdfImageService = new \App\Services\PdfImageService();
            $imageContent = $pdfImageService->convertir($pdfContent, [
                'dpi' => 250,  // Buena resolución
                'quality' => 85,  // Buena calidad
                'format' => 'webp',  // WebP comprime 25% mejor que JPEG
                'optimize' => true,
            ]);

            if ($imageContent) {
                Log::info('✅ Imagen JPEG generada con servicio Python', [
                    'pdf_size' => strlen($pdfContent),
                    'image_size' => strlen($imageContent),
                    'image_size_kb' => round(strlen($imageContent) / 1024, 2),
                ]);

                return response($imageContent)
                    ->header('Content-Type', 'image/jpeg')
                    ->header('Content-Disposition', 'attachment; filename=stock-disponible.jpg')
                    ->header('Cache-Control', 'public, max-age=3600')
                    ->header('X-Image-Service', 'python');
            } else {
                // Fallback: retornar PDF si no se pudo generar imagen
                Log::warning('⚠️ Servicio Python no disponible, retornando PDF como fallback');
                return response($pdfContent)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename=stock-disponible.pdf')
                    ->header('X-Image-Service', 'fallback-pdf');
            }

        } catch (\Exception $e) {
            Log::error('Error generando imagen Python stock disponible', [
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
     * ✅ CATÁLOGO: Generar PDF con grilla de productos
     * Reutiliza la lógica de generar() pero con vista de catálogo
     *
     * GET /api/app/stock/catalogo-pdf?con_stock=1
     * Query parameters: con_stock (default: true para mostrar solo con stock)
     */
    public function catalogoPdf(\Illuminate\Http\Request $request)
    {
        try {
            // Obtener datos con la misma lógica que generar()
            // Nota: SIEMPRE mostramos solo productos CON STOCK
            $mostrarStock = (bool) $request->query('mostrar_stock', false);

            $stocks = StockProducto::disponible()
                ->with([
                    'producto:id,nombre,sku',
                    'producto.imagenes' => fn($q) => $q->orderBy('orden', 'asc')->limit(1),
                    'producto.precios' => fn($q) => $q->activos()->with('tipoPrecio:id,codigo'),
                ])
                ->selectRaw('producto_id, SUM(cantidad_disponible) as total_disponible')
                ->groupBy('producto_id')
                ->get();

            // Mapear y agregar datos calculados
            $filas = $stocks->map(function ($s) {
                $p = $s->producto;

                return [
                    'nombre'           => $p->nombre,
                    'sku'              => $p->sku ?? '-',
                    'precio_venta'     => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento' => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'  => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'stock_disponible' => $s->total_disponible,
                    'rangos_venta'     => $this->obtenerRangosPorTipo($p, 'VENTA'),
                    'rangos_descuento' => $this->obtenerRangosPorTipo($p, 'DESCUENTO'),
                    'rangos_especial'  => $this->obtenerRangosPorTipo($p, 'ESPECIAL'),
                    'imagenes'         => $p->imagenes,
                    'producto'         => $p,
                ];
            })->sortBy('nombre')->values();

            Log::info('📊 CATÁLOGO PDF - Datos generados', [
                'total_productos' => count($filas),
                'mostrar_stock_badge' => $mostrarStock,
            ]);

            $data = [
                'filas' => $filas,
                'total_productos' => count($filas),
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'empresa' => config('app.name', 'Distribuidora Paucara'),
                'mostrar_stock' => $mostrarStock,
            ];

            $pdf = Pdf::loadView('pdf.stock-disponible-catalogo', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 8)
                ->setOption('margin-bottom', 8)
                ->setOption('margin-left', 8)
                ->setOption('margin-right', 8)
                ->setOption('dpi', 150)
                ->setOption('enable_remote', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isPhpEnabled', false);

            return $pdf->stream('catalogo-productos.pdf');

        } catch (\Exception $e) {
            Log::error('Error generando catálogo PDF', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando catálogo',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ CATÁLOGO: Generar imagen HD del catálogo con servicio Python
     * Reutiliza la lógica de imagenPython() pero con vista de catálogo
     *
     * GET /api/app/stock/catalogo-imagen-python?con_stock=1
     */
    public function catalogoImagenPython(\Illuminate\Http\Request $request)
    {
        try {
            // Nota: SIEMPRE mostramos solo productos CON STOCK
            $mostrarStock = (bool) $request->query('mostrar_stock', false);

            $stocks = StockProducto::disponible()
                ->with([
                    'producto:id,nombre,sku',
                    'producto.imagenes' => fn($q) => $q->orderBy('orden', 'asc')->limit(1),
                    'producto.precios' => fn($q) => $q->activos()->with('tipoPrecio:id,codigo'),
                ])
                ->selectRaw('producto_id, SUM(cantidad_disponible) as total_disponible')
                ->groupBy('producto_id')
                ->get();

            $filas = $stocks->map(function ($s) {
                $p = $s->producto;

                return [
                    'nombre'           => $p->nombre,
                    'sku'              => $p->sku ?? '-',
                    'precio_venta'     => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento' => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'  => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'stock_disponible' => $s->total_disponible,
                    'rangos_venta'     => $this->obtenerRangosPorTipo($p, 'VENTA'),
                    'rangos_descuento' => $this->obtenerRangosPorTipo($p, 'DESCUENTO'),
                    'rangos_especial'  => $this->obtenerRangosPorTipo($p, 'ESPECIAL'),
                    'imagenes'         => $p->imagenes,
                    'producto'         => $p,
                ];
            })->sortBy('nombre')->values();

            Log::info('🐍 CATÁLOGO IMAGEN - Datos generados', [
                'total_productos' => count($filas),
                'mostrar_stock_badge' => $mostrarStock,
            ]);

            $data = [
                'filas' => $filas,
                'total_productos' => count($filas),
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'empresa' => config('app.name', 'Distribuidora Paucara'),
                'mostrar_stock' => $mostrarStock,
            ];

            $pdf = Pdf::loadView('pdf.stock-disponible-catalogo', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 8)
                ->setOption('margin-bottom', 8)
                ->setOption('margin-left', 8)
                ->setOption('margin-right', 8)
                ->setOption('dpi', 150)
                ->setOption('enable_remote', true)
                ->setOption('isHtml5ParserEnabled', true)
                ->setOption('isPhpEnabled', false);

            $pdfContent = $pdf->output();

            $pdfImageService = new \App\Services\PdfImageService();
            $imageContent = $pdfImageService->convertir($pdfContent, [
                'dpi' => 250,
                'quality' => 85,
                'format' => 'webp',
                'optimize' => true,
            ]);

            if ($imageContent) {
                Log::info('✅ Catálogo imagen generada con Python', [
                    'total_productos' => count($filas),
                    'image_size_kb' => round(strlen($imageContent) / 1024, 2),
                ]);

                return response($imageContent)
                    ->header('Content-Type', 'image/webp')
                    ->header('Content-Disposition', 'attachment; filename=catalogo-productos.webp')
                    ->header('Cache-Control', 'public, max-age=3600')
                    ->header('X-Image-Service', 'python');
            } else {
                Log::warning('⚠️ Servicio Python no disponible para catálogo, retornando PDF');
                return response($pdfContent)
                    ->header('Content-Type', 'application/pdf')
                    ->header('Content-Disposition', 'attachment; filename=catalogo-productos.pdf')
                    ->header('X-Image-Service', 'fallback-pdf');
            }

        } catch (\Exception $e) {
            Log::error('Error generando catálogo imagen Python', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error generando catálogo imagen',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ DEBUG: Probar generación de imagen (retorna error detallado si falla)
     * GET /api/app/stock/imagen/debug
     * Solo Super Admin
     */
    public function debug()
    {
        try {
            // Datos mínimos para probar
            $data = [
                'filas' => [
                    [
                        'nombre' => 'Producto Test',
                        'sku' => 'TEST-001',
                        'precio_venta' => 100,
                        'precio_descuento' => 90,
                        'precio_especial' => 80,
                        'stock_disponible' => 50,
                        'rangos_venta' => [],
                        'rangos_descuento' => [],
                        'rangos_especial' => [],
                    ]
                ],
                'total_productos' => 1,
                'fecha_generacion' => now()->format('d/m/Y H:i'),
                'empresa' => config('app.name', 'Test'),
                'incluir_stock' => false,
            ];

            // Generar PDF
            $pdf = Pdf::loadView('pdf.stock-disponible-preventista', $data)
                ->setPaper('A4', 'portrait')
                ->setOption('margin-top', 10)
                ->setOption('margin-bottom', 10)
                ->setOption('margin-left', 10)
                ->setOption('margin-right', 10);

            $pdfContent = $pdf->output();
            $pdfSize = strlen($pdfContent);

            // Intentar convertir a imagen
            $tempPdfPath = storage_path('app/temp/test-' . uniqid() . '.pdf');
            $tempImagePath = storage_path('app/temp/test-' . uniqid() . '.png');

            if (!is_dir(dirname($tempPdfPath))) {
                mkdir(dirname($tempPdfPath), 0755, true);
            }

            file_put_contents($tempPdfPath, $pdfContent);

            $imageContent = $this->convertirPdfAImagen($tempPdfPath, $tempImagePath);

            @unlink($tempPdfPath);
            @unlink($tempImagePath);

            if ($imageContent) {
                return response()->json([
                    'success' => true,
                    'message' => '✅ Generación de imagen funcionando correctamente',
                    'pdf_size' => $pdfSize,
                    'image_size' => strlen($imageContent),
                    'image_size_kb' => round(strlen($imageContent) / 1024, 2),
                    'reduction' => round(((1 - strlen($imageContent) / $pdfSize) * 100), 2) . '%',
                    'system_info' => [
                        'environment' => app()->environment(),
                        'php_version' => phpversion(),
                        'extensions' => [
                            'imagick' => extension_loaded('imagick') ? 'YES' : 'NO',
                            'gd' => extension_loaded('gd') ? 'YES' : 'NO',
                        ],
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => '❌ No se pudo generar imagen - revisa logs',
                    'error' => 'convertirPdfAImagen retornó null',
                    'system_info' => [
                        'environment' => app()->environment(),
                        'php_version' => phpversion(),
                        'extensions' => [
                            'imagick' => extension_loaded('imagick') ? 'YES' : 'NO',
                            'gd' => extension_loaded('gd') ? 'YES' : 'NO',
                        ],
                    ]
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Error en debug',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'system_info' => [
                    'environment' => app()->environment(),
                    'php_version' => phpversion(),
                    'extensions' => [
                        'imagick' => extension_loaded('imagick') ? 'YES' : 'NO',
                        'gd' => extension_loaded('gd') ? 'YES' : 'NO',
                    ],
                ]
            ], 500);
        }
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

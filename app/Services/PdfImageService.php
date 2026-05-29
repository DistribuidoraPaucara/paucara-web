<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * PdfImageService - Convierte PDFs a imágenes usando:
 * 1. Servicio Python remoto (Railway)
 * 2. ImageMagick local (fallback)
 */
class PdfImageService
{
    private $pythonServiceUrl;
    private $usePythonService;

    public function __construct()
    {
        $this->pythonServiceUrl = config('services.pdf_image.url') ?? env('PDF_IMAGE_SERVICE_URL');
        $this->usePythonService = config('services.pdf_image.enabled') ?? env('PDF_IMAGE_SERVICE_ENABLED', false);

        Log::debug('🐍 PdfImageService inicializado', [
            'enabled' => $this->usePythonService,
            'url' => $this->pythonServiceUrl ? '✓ Configurado' : '✗ No configurado',
        ]);
    }

    /**
     * Convertir PDF a imagen usando el mejor método disponible
     *
     * @param string $pdfContent Contenido binario del PDF
     * @param array $options Opciones: dpi, quality, format
     * @return string|null Contenido binario de la imagen o null
     */
    public function convertir(string $pdfContent, array $options = []): ?string
    {
        // Intentar usar servicio Python primero
        if ($this->usePythonService && $this->pythonServiceUrl) {
            $resultado = $this->convertirConServicioPython($pdfContent, $options);
            if ($resultado) {
                return $resultado;
            }
            Log::warning('❌ Servicio Python no disponible, usando ImageMagick como fallback');
        }

        // Fallback: usar ImageMagick local
        return $this->convertirConImageMagick($pdfContent, $options);
    }

    /**
     * Convertir usando servicio Python remoto (Railway, etc)
     *
     * Parámetros soportados en $options:
     * - dpi: 72-300 (default 150)
     * - quality: 50-100 (default 85)
     * - format: jpeg|png|webp (default jpeg)
     * - optimize: true|false (default true)
     */
    public function convertirConServicioPython(string $pdfContent, array $options = []): ?string
    {
        try {
            $dpi = $options['dpi'] ?? 150;
            $quality = $options['quality'] ?? 85;
            $format = $options['format'] ?? 'jpeg';
            $optimize = $options['optimize'] ?? true;

            Log::info('🐍 Enviando PDF al servicio Python', [
                'url' => $this->pythonServiceUrl,
                'dpi' => $dpi,
                'quality' => $quality,
                'format' => $format,
            ]);

            // Opción 1: Enviar como base64 (más confiable)
            $response = Http::timeout(60)
                ->post(
                    $this->pythonServiceUrl . '/convert-base64',
                    [
                        'pdf_base64' => base64_encode($pdfContent),
                        'dpi' => $dpi,
                        'quality' => $quality,
                        'output_format' => $format,
                        'optimize' => $optimize,
                    ]
                );

            if ($response->successful()) {
                $data = $response->json();

                if ($data['success'] ?? false) {
                    Log::info('✅ Imagen generada por servicio Python', [
                        'size_kb' => $data['size_kb'],
                        'pages' => $data['pages'],
                        'format' => $data['format'],
                    ]);

                    return base64_decode($data['data']);
                }
            }

            Log::error('❌ Servicio Python retornó error', [
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error conectando al servicio Python: ' . $e->getMessage(), [
                'url' => $this->pythonServiceUrl,
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return null;
    }

    /**
     * Convertir usando ImageMagick local (fallback)
     *
     * Parámetros soportados en $options:
     * - quality: 50-100 (default 90)
     * - format: jpeg|png (default jpeg)
     */
    public function convertirConImageMagick(string $pdfContent, array $options = []): ?string
    {
        try {
            $quality = $options['quality'] ?? 90;
            $format = $options['format'] ?? 'jpeg';

            $tempPdfPath = storage_path('app/temp/pdf-' . uniqid() . '.pdf');
            $tempImagePath = storage_path('app/temp/img-' . uniqid() . '.' . $format);

            // Crear directorio si no existe
            if (!is_dir(dirname($tempPdfPath))) {
                mkdir(dirname($tempPdfPath), 0755, true);
            }

            // Guardar PDF temporal
            file_put_contents($tempPdfPath, $pdfContent);

            // Obtener comando ImageMagick
            $cmd = $this->getImageMagickCommand();

            // Comando mejorado con alta resolución
            $command = sprintf(
                '%s -density 150 -define pdf:use-cropbox=true %s -quality %d -strip -interlace Plane -append %s 2>&1',
                $cmd,
                escapeshellarg($tempPdfPath),
                $quality,
                escapeshellarg($tempImagePath)
            );

            Log::debug('📊 Ejecutando ImageMagick', [
                'density' => 150,
                'quality' => $quality,
                'format' => $format,
            ]);

            $output = [];
            $returnCode = 0;
            exec($command, $output, $returnCode);

            if ($returnCode === 0 && file_exists($tempImagePath)) {
                $imageContent = file_get_contents($tempImagePath);
                $sizeKb = round(strlen($imageContent) / 1024, 2);

                Log::info('✅ Imagen generada con ImageMagick', [
                    'size_kb' => $sizeKb,
                    'quality' => $quality,
                    'format' => $format,
                ]);

                @unlink($tempPdfPath);
                @unlink($tempImagePath);

                return $imageContent;
            }

            Log::error('❌ ImageMagick falló', [
                'return_code' => $returnCode,
                'output' => implode("\n", $output),
            ]);

            @unlink($tempPdfPath);
            @unlink($tempImagePath);

        } catch (\Exception $e) {
            Log::error('❌ Error en convertirConImageMagick: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Detectar comando ImageMagick según SO
     */
    private function getImageMagickCommand(): string
    {
        if (PHP_OS_FAMILY === 'Windows') {
            $possiblePaths = [
                'C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe',
                'C:\\Program Files\\ImageMagick-7.1.1-Q16\\magick.exe',
                'C:\\Program Files\\ImageMagick-7.1.0-Q16\\magick.exe',
                'C:\\Program Files\\ImageMagick\\magick.exe',
            ];

            foreach ($possiblePaths as $path) {
                if (file_exists($path)) {
                    return '"' . $path . '"';
                }
            }

            return 'magick';
        }

        return 'convert';
    }

    /**
     * Verificar si el servicio Python está disponible
     */
    public function isServiceAvailable(): bool
    {
        if (!$this->usePythonService || !$this->pythonServiceUrl) {
            return false;
        }

        try {
            $response = Http::timeout(5)->get($this->pythonServiceUrl . '/health');
            return $response->successful();
        } catch (\Exception $e) {
            Log::debug('Servicio Python no disponible: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtener información del servicio
     */
    public function getServiceInfo(): ?array
    {
        if (!$this->pythonServiceUrl) {
            return null;
        }

        try {
            $response = Http::timeout(5)->get($this->pythonServiceUrl . '/test');
            return $response->json();
        } catch (\Exception $e) {
            return null;
        }
    }
}

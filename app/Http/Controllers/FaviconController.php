<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class FaviconController extends Controller
{
    public function __invoke(): Response
    {
        try {
            $empresa = Empresa::principal();
            Log::info('FaviconController: Buscando empresa principal', ['empresa_id' => $empresa?->id]);

            if ($empresa && $empresa->fav_ico) {
                $faviconPath = $empresa->fav_ico;
                Log::info('FaviconController: Favicon encontrado en BD', ['original_path' => $faviconPath]);

                // Si es una URL relativa de storage, extraer la ruta
                if (strpos($faviconPath, '/storage/') === 0) {
                    $faviconPath = str_replace('/storage/', '', $faviconPath);
                    Log::info('FaviconController: Ruta limpiada', ['cleaned_path' => $faviconPath]);
                }

                // Verificar si el archivo existe en storage
                $exists = Storage::disk('public')->exists($faviconPath);
                Log::info('FaviconController: Verificando existencia del archivo', [
                    'path' => $faviconPath,
                    'exists' => $exists,
                    'storage_path' => Storage::disk('public')->path($faviconPath)
                ]);

                if ($exists) {
                    $content = Storage::disk('public')->get($faviconPath);
                    Log::info('FaviconController: Archivo obtenido correctamente', ['size' => strlen($content)]);

                    return response($content, 200)
                        ->header('Content-Type', $this->getMimeType($faviconPath))
                        ->header('Cache-Control', 'public, max-age=604800')
                        ->header('ETag', '"' . md5($empresa->id . $empresa->updated_at) . '"')
                        ->header('Access-Control-Allow-Origin', '*');
                } else {
                    Log::warning('FaviconController: Archivo no encontrado en storage', ['path' => $faviconPath]);
                }
            } else {
                Log::info('FaviconController: Empresa principal sin favicon');
            }
        } catch (\Exception $e) {
            Log::error('FaviconController Error: ' . $e->getMessage(), ['exception' => $e]);
        }

        // Fallback a favicon estático
        if (file_exists(public_path('favicon.ico'))) {
            Log::info('FaviconController: Usando favicon estático');
            return response(
                file_get_contents(public_path('favicon.ico')),
                200,
                [
                    'Content-Type' => 'image/x-icon',
                    'Cache-Control' => 'no-cache, no-store, must-revalidate',
                ]
            );
        }

        // Si no hay favicon, devolver un 404
        Log::warning('FaviconController: No hay favicon disponible');
        return response('', 404);
    }

    private function getMimeType(string $filePath): string
    {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        return match ($ext) {
            'ico' => 'image/x-icon',
            'png' => 'image/png',
            'svg' => 'image/svg+xml',
            default => 'image/png',
        };
    }
}

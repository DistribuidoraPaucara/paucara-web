<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LogsController extends Controller
{
    /**
     * Descargar archivo de logs completo
     * GET /api/admin/logs/download
     */
    public function download()
    {
        try {
            $logFile = storage_path('logs/laravel.log');

            if (!file_exists($logFile)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Archivo de logs no encontrado',
                ], 404);
            }

            $filename = 'laravel-' . now()->format('Y-m-d_H-i-s') . '.log';

            return response()->download($logFile, $filename, [
                'Content-Type' => 'text/plain',
            ]);

        } catch (\Exception $e) {
            Log::error('Error al descargar logs', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al descargar los logs: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ver últimas líneas de logs (JSON)
     * GET /api/admin/logs/view?lines=100
     */
    public function view()
    {
        try {
            $logFile = storage_path('logs/laravel.log');
            $lines = request()->input('lines', 500);

            if (!file_exists($logFile)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Archivo de logs no encontrado',
                ], 404);
            }

            $content = file_get_contents($logFile);
            $logLines = array_filter(explode("\n", $content));
            $logLines = array_slice($logLines, -$lines);

            return response()->json([
                'success' => true,
                'file_size' => number_format(filesize($logFile) / 1024, 2) . ' KB',
                'last_modified' => date('Y-m-d H:i:s', filemtime($logFile)),
                'total_lines' => count($logLines),
                'lines' => $logLines,
                'download_url' => route('api.logs.download'),
            ]);

        } catch (\Exception $e) {
            Log::error('Error al ver logs', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al leer los logs: ' . $e->getMessage(),
            ], 500);
        }
    }
}

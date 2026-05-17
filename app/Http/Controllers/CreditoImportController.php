<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportarCreditosHistoricosRequest;
use App\Services\CreditoImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CreditoImportController extends Controller
{
    private CreditoImportService $importService;

    public function __construct(CreditoImportService $importService)
    {
        $this->importService = $importService;
    }

    /**
     * Validar archivo CSV sin importar
     * POST /api/creditos/validar
     */
    public function validar(ImportarCreditosHistoricosRequest $request): JsonResponse
    {
        try {
            Log::info('📋 [CREDITO IMPORT] Validando archivo CSV', [
                'usuario' => auth()->user()->name,
                'archivo' => $request->file('archivo')->getClientOriginalName(),
            ]);

            $archivo = $request->file('archivo');
            $archivoPath = $archivo->store('imports/creditos', 'local');

            $resultado = $this->importService->validarArchivo(storage_path('app/' . $archivoPath));

            Log::info('✅ [CREDITO IMPORT] Validación completada', [
                'validas' => $resultado['validas'] ? count($resultado['validas']) : 0,
                'errores' => $resultado['errores'] ? count($resultado['errores']) : 0,
            ]);

            return response()->json([
                'success' => true,
                'data' => $resultado,
                'archivo_path' => $archivoPath, // Guardar para importar después
                'mensaje' => $resultado['puede_importar']
                    ? 'Archivo válido. Puedes proceder con la importación.'
                    : 'El archivo tiene errores que deben corregirse.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ [CREDITO IMPORT] Error en validación', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al validar: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Importar créditos validados
     * POST /api/creditos/importar
     */
    public function importar(ImportarCreditosHistoricosRequest $request): JsonResponse
    {
        try {
            Log::info('📥 [CREDITO IMPORT] Iniciando importación', [
                'usuario' => auth()->user()->name,
                'archivo' => $request->file('archivo')->getClientOriginalName(),
            ]);

            $archivo = $request->file('archivo');
            $archivoPath = $archivo->store('imports/creditos', 'local');
            $rutaCompleta = storage_path('app/' . $archivoPath);

            $resultado = $this->importService->importar($rutaCompleta);

            if ($resultado['exito']) {
                Log::info('🟢 [CREDITO IMPORT] Importación exitosa', [
                    'importados' => $resultado['total_importados'],
                    'rechazados' => $resultado['total_rechazados'],
                    'usuario' => auth()->user()->name,
                    'archivo_path' => $archivoPath,
                ]);

                return response()->json([
                    'success' => true,
                    'data' => $resultado,
                    'mensaje' => $resultado['mensaje'],
                ], 200);
            } else {
                Log::error('❌ [CREDITO IMPORT] Importación fallida', [
                    'error' => $resultado['error'],
                ]);

                return response()->json([
                    'success' => false,
                    'error' => $resultado['error'],
                ], 422);
            }

        } catch (\Exception $e) {
            Log::error('❌ [CREDITO IMPORT] Error en importación', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Error al importar: ' . $e->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\DispositivoTokenFcm;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DispositivoTokenFcmController extends Controller
{
    /**
     * Registrar o actualizar token FCM de un dispositivo
     * ✅ PÚBLICO: Accesible desde Flutter sin autenticación
     */
    public function registrar(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'dispositivo_id' => 'required|string|max:255',
                'token_fcm' => 'required|string|min:100',
                'platform' => 'nullable|string|in:android,ios,web',
                'device_name' => 'nullable|string|max:255',
                'app_version' => 'nullable|string|max:50',
            ]);

            $metadata = [
                'platform' => $validated['platform'] ?? null,
                'device_name' => $validated['device_name'] ?? null,
                'app_version' => $validated['app_version'] ?? null,
            ];

            $dispositivo = DispositivoTokenFcm::registrarOActualizar(
                dispositivoId: $validated['dispositivo_id'],
                tokenFcm: $validated['token_fcm'],
                userId: auth('sanctum')->id() ?? null,
                metadata: $metadata
            );

            Log::info('✅ Token FCM registrado/actualizado', [
                'dispositivo_id' => $validated['dispositivo_id'],
                'platform' => $validated['platform'],
                'user_id' => auth('sanctum')->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Token FCM registrado exitosamente',
                'data' => [
                    'id' => $dispositivo->id,
                    'dispositivo_id' => $dispositivo->dispositivo_id,
                    'platform' => $dispositivo->platform,
                    'activo' => $dispositivo->activo,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('⚠️ Validación fallida al registrar token FCM', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error al registrar token FCM', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al registrar token',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Desactivar token de un dispositivo (cuando el usuario se desloguea)
     * ✅ PÚBLICO: Sin autenticación requerida
     */
    public function desactivar(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'dispositivo_id' => 'required|string|max:255',
            ]);

            $dispositivo = DispositivoTokenFcm::where('dispositivo_id', $validated['dispositivo_id'])->first();

            if (!$dispositivo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dispositivo no encontrado',
                ], 404);
            }

            $dispositivo->update(['activo' => false]);

            Log::info('✅ Token FCM desactivado', [
                'dispositivo_id' => $validated['dispositivo_id'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Token desactivado exitosamente',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error al desactivar token FCM', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al desactivar token',
            ], 500);
        }
    }

    /**
     * Enviar notificación de prueba a un dispositivo específico
     * ✅ Requiere permisos de admin
     */
    public function enviarPrueba(Request $request): JsonResponse
    {
        try {
            $this->authorize('admin');

            $validated = $request->validate([
                'dispositivo_id' => 'required|string|max:255',
                'titulo' => 'nullable|string|max:255',
                'descripcion' => 'nullable|string|max:255',
            ]);

            $dispositivo = DispositivoTokenFcm::where('dispositivo_id', $validated['dispositivo_id'])
                ->where('activo', true)
                ->first();

            if (!$dispositivo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dispositivo no encontrado o inactivo',
                ], 404);
            }

            $firebaseService = app(\App\Services\Firebase\FirebaseNotificationService::class);
            $result = $firebaseService->enviarPrueba(
                token: $dispositivo->token_fcm,
                titulo: $validated['titulo'] ?? 'Notificación de Prueba',
                descripcion: $validated['descripcion'] ?? 'Esta es una notificación de prueba',
            );

            return response()->json([
                'success' => $result,
                'message' => $result ? 'Notificación de prueba enviada' : 'Error al enviar notificación',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error al enviar notificación de prueba', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al enviar notificación',
            ], 500);
        }
    }
}

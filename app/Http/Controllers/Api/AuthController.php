<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PreventistStatisticsService;
use App\Services\ProductosVendidosService;
use App\Services\ProformasStatisticsService;
use App\Services\VentasStatisticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login de usuario para API
     */
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string', // Puede ser email o usernick
            'password' => 'required',
        ]);

        // Buscar usuario por email o usernick
        $user = User::where(function ($query) use ($request) {
            $query->where('email', $request->login)
                ->orWhere('usernick', $request->login);
        })->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Verificar si el usuario está activo
        if (! $user->activo) {
            throw ValidationException::withMessages([
                'login' => ['Tu cuenta está desactivada. Contacta al administrador.'],
            ]);
        }

        // ✅ NUEVO: Verificar acceso a plataforma móvil
        if (! $user->can_access_mobile) {
            throw ValidationException::withMessages([
                'login' => ['No tienes acceso a la aplicación móvil. Contacta al administrador.'],
            ]);
        }

        // Revocar tokens anteriores (opcional)
        $user->tokens()->delete();

        // Crear nuevo token
        $token = $user->createToken('api-token')->plainTextToken;

        // Cargar el cliente asociado para obtener su ID
        $clienteId = null;
        if ($user->cliente) {
            $clienteId = $user->cliente->id;
        }

        // ✅ NUEVO: Obtener estadísticas del preventista si aplica
        $preventistStats = null;
        if ($user->empleado && $user->empleado->esPreventista()) {
            // Obtener estadísticas de clientes
            $preventistStats = PreventistStatisticsService::getStatsForLogin($user->empleado);

            // ✅ NUEVO: Agregar estadísticas de productos vendidos (mes actual: día 1 hasta hoy)
            $productosVendidos = ProductosVendidosService::obtenerProductosVendidos([
                'fecha_desde' => now()->startOfMonth(),  // Día 1 del mes actual
                'fecha_hasta' => now(),                  // Hoy
                'preventista_id' => $user->id,
            ]);

            if ($productosVendidos['success']) {
                // Agregar estadísticas de ventas
                $preventistStats['cantidad_productos_vendidos'] = $productosVendidos['totales']['cantidad_productos'];
                $preventistStats['sumatoria_productos_vendidos'] = $productosVendidos['totales']['total_venta_general'];
                $preventistStats['cantidad_total_items_vendidos'] = $productosVendidos['totales']['cantidad_total_vendida'];
                $preventistStats['precio_promedio_vendido'] = $productosVendidos['totales']['precio_promedio_general'];
            }

            // ✅ NUEVO: Agregar estadísticas de proformas (creadas hoy + entrega solicitada hoy)
            try {
                $proformasStats = ProformasStatisticsService::obtenerEstadisticasProformas($user->id);

                if ($proformasStats['success']) {
                    $preventistStats['proformas_creadas_hoy'] = $proformasStats['creadas_hoy'];
                    $preventistStats['proformas_entrega_solicitada_hoy'] = $proformasStats['entrega_solicitada_hoy'];
                } else {
                    \Log::warning('⚠️ Error obteniendo estadísticas de proformas', [
                        'user_id' => $user->id,
                        'error' => $proformasStats['error'] ?? 'Desconocido',
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('❌ Excepción obteniendo estadísticas de proformas', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }

            // ✅ NUEVO: Agregar estadísticas de ventas (APROBADA y ANULADO)
            try {
                $ventasStats = VentasStatisticsService::obtenerEstadisticasVentas($user->id);

                if ($ventasStats['success']) {
                    $preventistStats['ventas_aprobadas'] = $ventasStats['ventas_aprobadas'];
                    $preventistStats['ventas_anuladas'] = $ventasStats['ventas_anuladas'];
                    $preventistStats['total_ventas'] = $ventasStats['total_ventas'];
                } else {
                    \Log::warning('⚠️ Error obteniendo estadísticas de ventas', [
                        'user_id' => $user->id,
                        'error' => $ventasStats['error'] ?? 'Desconocido',
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('❌ Excepción obteniendo estadísticas de ventas', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $responseData = [
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'usernick' => $user->usernick,
                'email' => $user->email,
                'activo' => $user->activo,
                'cliente_id' => $clienteId,  // ⭐ IMPORTANTE: Incluir cliente_id
            ],
            'token' => $token,
            'roles' => $user->getRoleNames()->toArray(),
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            // ✅ NUEVO: Permisos de acceso a plataformas
            'platform_access' => [
                'can_access_web' => $user->can_access_web,
                'can_access_mobile' => $user->can_access_mobile,
            ],
            // ✅ NUEVO: TTL para caché en app móvil
            'cache_ttl' => 24 * 60 * 60, // 24 horas en segundos
            'permissions_updated_at' => now()->timestamp,
        ];

        // ✅ NUEVO: Incluir estadísticas del preventista en respuesta
        if ($preventistStats) {
            $responseData['preventista_stats'] = $preventistStats;
        }

        return response()->json($responseData);
    }

    /**
     * Registro de usuario para API
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'usernick' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'usernick' => $request->usernick,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'activo' => true,
        ]);

        // Asignar rol por defecto (cliente)
        $user->assignRole('cliente');

        // ✅ NUEVO: Los nuevos Clientes solo tienen acceso a móvil
        $user->update([
            'can_access_web' => false,
            'can_access_mobile' => true,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'usernick' => $user->usernick,
                'email' => $user->email,
                'activo' => $user->activo,
            ],
            'token' => $token,
            'roles' => $user->getRoleNames()->toArray(),
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            // ✅ NUEVO: Permisos de acceso a plataformas
            'platform_access' => [
                'can_access_web' => $user->can_access_web,
                'can_access_mobile' => $user->can_access_mobile,
            ],
            // ✅ NUEVO: TTL para caché en app móvil
            'cache_ttl' => 24 * 60 * 60,
            'permissions_updated_at' => now()->timestamp,
        ], 201);
    }

    /**
     * Logout de usuario para API
     */
    public function logout(Request $request)
    {
        // Revocar el token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

    /**
     * Obtener información del usuario actual
     */
    public function user(Request $request)
    {
        $user = $request->user();

        // Obtener el cliente_id si existe
        $clienteId = null;
        if ($user->cliente) {
            $clienteId = $user->cliente->id;
        }

        $responseData = [
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'usernick' => $user->usernick,
                'email' => $user->email,
                'activo' => $user->activo,
                'cliente_id' => $clienteId,
            ],
            'roles' => $user->getRoleNames()->toArray(),
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            'cache_ttl' => 24 * 60 * 60,
            'permissions_updated_at' => now()->timestamp,
        ];

        // ✅ NUEVO: Incluir estadísticas del preventista si aplica
        if ($user->empleado && $user->empleado->esPreventista()) {
            $preventistStats = PreventistStatisticsService::getStatsForLogin($user->empleado);

            // ✅ NUEVO: Agregar estadísticas de productos vendidos (mes actual: día 1 hasta hoy)
            $productosVendidos = ProductosVendidosService::obtenerProductosVendidos([
                'fecha_desde' => now()->startOfMonth(),
                'fecha_hasta' => now(),
                'preventista_id' => $user->id,
            ]);

            if ($productosVendidos['success']) {
                $preventistStats['cantidad_productos_vendidos'] = $productosVendidos['totales']['cantidad_productos'];
                $preventistStats['sumatoria_productos_vendidos'] = $productosVendidos['totales']['total_venta_general'];
                $preventistStats['cantidad_total_items_vendidos'] = $productosVendidos['totales']['cantidad_total_vendida'];
                $preventistStats['precio_promedio_vendido'] = $productosVendidos['totales']['precio_promedio_general'];
            }

            // ✅ NUEVO: Agregar estadísticas de proformas
            try {
                $proformasStats = ProformasStatisticsService::obtenerEstadisticasProformas($user->id);

                if ($proformasStats['success']) {
                    $preventistStats['proformas_creadas_hoy'] = $proformasStats['creadas_hoy'];
                    $preventistStats['proformas_entrega_solicitada_hoy'] = $proformasStats['entrega_solicitada_hoy'];
                } else {
                    \Log::warning('⚠️ Error obteniendo estadísticas de proformas en user()', [
                        'user_id' => $user->id,
                        'error' => $proformasStats['error'] ?? 'Desconocido',
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('❌ Excepción obteniendo estadísticas de proformas en user()', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }

            // ✅ NUEVO: Agregar estadísticas de ventas (APROBADA y ANULADO)
            try {
                $ventasStats = VentasStatisticsService::obtenerEstadisticasVentas($user->id);

                if ($ventasStats['success']) {
                    $preventistStats['ventas_aprobadas'] = $ventasStats['ventas_aprobadas'];
                    $preventistStats['ventas_anuladas'] = $ventasStats['ventas_anuladas'];
                    $preventistStats['total_ventas'] = $ventasStats['total_ventas'];
                } else {
                    \Log::warning('⚠️ Error obteniendo estadísticas de ventas en user()', [
                        'user_id' => $user->id,
                        'error' => $ventasStats['error'] ?? 'Desconocido',
                    ]);
                }
            } catch (\Exception $e) {
                \Log::error('❌ Excepción obteniendo estadísticas de ventas en user()', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }

            $responseData['preventista_stats'] = $preventistStats;
        }

        return response()->json($responseData);
    }

    /**
     * Refresh token (opcional)
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Revocar token actual
        $request->user()->currentAccessToken()->delete();

        // Crear nuevo token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            'cache_ttl' => 24 * 60 * 60,
        ]);
    }

    /**
     * ✅ NUEVO: Refrescar permisos sin logout
     * Útil para app móvil que quiere actualizar permisos sin volver a login
     * Valida permisos en tiempo real contra BD
     */
    public function refreshPermissions(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            'roles' => $user->getRoleNames()->toArray(),
            'cache_ttl' => 24 * 60 * 60, // 24 horas
            'permissions_updated_at' => now()->timestamp,
        ]);
    }

    /**
     * ✅ NUEVO: Obtener token Sanctum actual del usuario autenticado
     * Usado por el frontend para guardar en sessionStorage después del login web
     * Este endpoint requiere autenticación (session web o token)
     */
    public function getSanctumToken(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Usuario no autenticado',
            ], 401);
        }

        // Obtener el token actual desde la sesión (guardado por AuthenticatedSessionController)
        $sanctumToken = $request->session()->get('sanctum_token');

        if (!$sanctumToken) {
            // Si no está en sesión, intentar obtener del usuario (último token creado)
            $token = $user->currentAccessToken();
            if (!$token) {
                // Si no hay token actual, crear uno nuevo
                $sanctumToken = $user->createToken('web-session')->plainTextToken;
                // Guardar en sesión para que el middleware lo encuentre
                $request->session()->put('sanctum_token', $sanctumToken);
            } else {
                // No podemos recuperar el plainText de un token existente
                // Crear uno nuevo en su lugar
                $user->tokens()->where('name', '!=', 'web-session')->delete();
                $sanctumToken = $user->createToken('web-session')->plainTextToken;
                $request->session()->put('sanctum_token', $sanctumToken);
            }
        }

        \Illuminate\Support\Facades\Log::info('✅ [AuthController] Token Sanctum recuperado para frontend', [
            'user_id' => $user->id,
            'token_preview' => substr($sanctumToken, 0, 20) . '...',
        ]);

        return response()->json([
            'success' => true,
            'token' => $sanctumToken,
            'user_id' => $user->id,
        ]);
    }
}

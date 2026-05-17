<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\PreventistStatisticsService;
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
            $preventistStats = PreventistStatisticsService::getStatsForLogin($user->empleado);
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
            $responseData['preventista_stats'] = PreventistStatisticsService::getStatsForLogin($user->empleado);
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
}

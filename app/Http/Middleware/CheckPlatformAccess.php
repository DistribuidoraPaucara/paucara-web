<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPlatformAccess
{
    /**
     * Handle an incoming request.
     *
     * Valida que el usuario tenga acceso a la plataforma que está intentando utilizar:
     * - Plataforma Web: Acceso vía sesión (session auth)
     * - Plataforma Móvil: Acceso vía token Sanctum (token auth)
     *
     * Super-Admin siempre tiene acceso a ambas plataformas.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Si no hay usuario autenticado, dejar pasar (las rutas protegidas ya lo requieren)
        if (!$user) {
            return $next($request);
        }

        // Super-Admin siempre tiene acceso a ambas plataformas
        if ($user->hasRole('Super Admin')) {
            return $next($request);
        }

        // Detectar tipo de petición
        $isMobileRequest = $this->isMobileRequest($request);
        $isWebRequest = !$isMobileRequest;

        // Logs detallados
        \Log::info('🔐 [CheckPlatformAccess] Validando acceso', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'is_mobile_request' => $isMobileRequest,
            'is_web_request' => $isWebRequest,
            'can_access_web' => $user->can_access_web ?? false,
            'can_access_mobile' => $user->can_access_mobile ?? false,
            'bearer_token' => $request->bearerToken() ? 'present' : 'missing',
            'path' => $request->path(),
            'method' => $request->method(),
        ]);

        // Validar acceso a plataforma web
        if ($isWebRequest && !$user->can_access_web) {
            \Log::warning('❌ [CheckPlatformAccess] Acceso denegado a plataforma WEB', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'can_access_web' => $user->can_access_web ?? false,
                'path' => $request->path(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'No tiene acceso a la plataforma web (admin)',
                'platform' => 'web',
                'user_id' => $user->id,
                'can_access_web' => $user->can_access_web ?? false,
            ], 403);
        }

        // Validar acceso a plataforma móvil
        if ($isMobileRequest && !$user->can_access_mobile) {
            \Log::warning('❌ [CheckPlatformAccess] Acceso denegado a plataforma MÓVIL', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'can_access_mobile' => $user->can_access_mobile ?? false,
                'path' => $request->path(),
                'bearer_token' => $request->bearerToken() ? 'present' : 'missing',
            ]);

            return response()->json([
                'success' => false,
                'message' => 'No tiene acceso a la aplicación móvil',
                'platform' => 'mobile',
                'user_id' => $user->id,
                'can_access_mobile' => $user->can_access_mobile ?? false,
                'suggestion' => 'Contacta al administrador para habilitar acceso a la aplicación móvil',
            ], 403);
        }

        \Log::info('✅ [CheckPlatformAccess] Acceso permitido', [
            'user_id' => $user->id,
            'platform' => $isMobileRequest ? 'mobile' : 'web',
            'path' => $request->path(),
        ]);

        return $next($request);
    }

    /**
     * Detectar si la petición es desde la aplicación móvil o desde web
     *
     * @param Request $request
     * @return bool
     */
    private function isMobileRequest(Request $request): bool
    {
        // Método 1: Detección por Bearer Token (Sanctum)
        // Si hay un token Bearer, es una petición de móvil
        if ($request->bearerToken() !== null) {
            return true;
        }

        // Método 2: Detección por User-Agent
        // Flutter app typically includes 'Flutter' or specific mobile user agent
        $userAgent = $request->userAgent() ?? '';
        if (stripos($userAgent, 'flutter') !== false ||
            stripos($userAgent, 'mobile') !== false) {
            return true;
        }

        // Por defecto, considerar como petición web si tiene sesión
        return false;
    }
}

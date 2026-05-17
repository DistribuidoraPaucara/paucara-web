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

        // Validar acceso a plataforma web
        if ($isWebRequest && !$user->can_access_web) {
            return response()->json([
                'message' => 'No tiene acceso a la plataforma web (admin)',
                'platform' => 'web',
            ], 403);
        }

        // Validar acceso a plataforma móvil
        if ($isMobileRequest && !$user->can_access_mobile) {
            return response()->json([
                'message' => 'No tiene acceso a la aplicación móvil',
                'platform' => 'mobile',
            ], 403);
        }

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

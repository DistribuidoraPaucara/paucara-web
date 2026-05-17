<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiRequestMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Marcar automáticamente como API request si:
        $isApiRequest = $request->expectsJson()
                     || $request->is('api/*')
                     || $this->isFlutterRequest($request)
                     || $this->isMobileRequest($request);

        if ($isApiRequest) {
            // Agregar header para identificación fácil
            $request->headers->set('X-API-Request', 'true');

            // Configurar headers de respuesta para API
            $response = $next($request);

            if ($response instanceof \Illuminate\Http\JsonResponse) {
                $response->headers->set('Content-Type', 'application/json');
                $response->headers->set('X-API-Response', 'true');
            }

            return $response;
        }

        return $next($request);
    }

    private function isFlutterRequest(Request $request): bool
    {
        $userAgent = $request->header('User-Agent', '');

        return str_contains(strtolower($userAgent), 'flutter')
            || str_contains(strtolower($userAgent), 'dart')
            || $request->hasHeader('X-Flutter-Request')
            || $request->hasHeader('X-Mobile-App');
    }

    private function isMobileRequest(Request $request): bool
    {
        $userAgent = $request->header('User-Agent', '');

        $mobilePatterns = [
            'Android',
            'iPhone',
            'iPad',
            'Mobile',
            'BlackBerry',
            'Windows Phone'
        ];

        foreach ($mobilePatterns as $pattern) {
            if (str_contains($userAgent, $pattern)) {
                return true;
            }
        }

        return false;
    }
}
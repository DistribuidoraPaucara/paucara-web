<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * ExecutionTracer - Registra el flujo completo de ejecución de un request
 *
 * Muestra:
 * - Middlewares ejecutados
 * - Servicios inicializados
 * - Tiempo total de ejecución
 * - Ruta y método HTTP
 */
class ExecutionTracer
{
    private float $startTime;
    private array $trace = [];

    public function handle(Request $request, Closure $next): Response
    {
        $this->startTime = microtime(true);
        $requestId = uniqid('req_');

        $this->addTrace('🚀 INICIO', [
            'request_id' => $requestId,
            'método' => $request->method(),
            'ruta' => $request->path(),
            'ip' => $request->ip(),
        ]);

        // Agregar trace del usuario si está autenticado
        if (auth()->check()) {
            $this->addTrace('👤 Usuario', [
                'id' => auth()->id(),
                'email' => auth()->user()->email,
            ]);
        }

        // Ejecutar la request
        $response = $next($request);

        // Registrar tiempo total
        $duration = round((microtime(true) - $this->startTime) * 1000, 2);

        $this->addTrace('✅ FIN', [
            'duracion_ms' => $duration,
            'status_code' => $response->getStatusCode(),
        ]);

        // Log del flujo completo
        /* Log::info("📊 EXECUTION TRACE - {$request->method()} {$request->path()}", [
            'request_id' => $requestId,
            'duracion_total_ms' => $duration,
            'trace' => $this->trace,
        ]); */

        return $response;
    }

    private function addTrace(string $evento, array $datos = []): void
    {
        $tiempo = round((microtime(true) - $this->startTime) * 1000, 2);

        $this->trace[] = [
            'timestamp_ms' => $tiempo,
            'evento' => $evento,
            'datos' => $datos,
        ];
    }
}

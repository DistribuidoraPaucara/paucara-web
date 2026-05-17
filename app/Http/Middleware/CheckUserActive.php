<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckUserActive
{
    /**
     * Handle an incoming request.
     *
     * Verifica que el usuario autenticado esté activo.
     * Si el usuario, cliente o empleado está inactivo, cierra la sesión.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Solo verificar si el usuario está autenticado
        if (Auth::check()) {
            $user = Auth::user();

            // 1. Verificar si el User tiene el campo activo en false
            if (isset($user->activo) && !$user->activo) {
                Log::warning('❌ [CheckUserActive] Usuario inactivo', [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'is_api' => $request->is('api/*'),
                    'request_path' => $request->path(),
                ]);

                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                $mensaje = 'Tu cuenta de usuario ha sido desactivada. Contacta al administrador.';

                // Responder con JSON si es API, redirect si es web
                if ($request->is('api/*')) {
                    return response()->json([
                        'error' => $mensaje,
                        'status' => 'unauthorized'
                    ], 401);
                }

                return redirect()->route('login')->with('error', $mensaje);
            }

            // 2. Si es un cliente, verificar que el Cliente también esté activo
            if ($user->cliente) {
                if (!$user->cliente->activo) {
                    Log::warning('❌ [CheckUserActive] Cliente inactivo', [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'cliente_id' => $user->cliente->id,
                        'is_api' => $request->is('api/*'),
                        'request_path' => $request->path(),
                    ]);

                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();

                    $mensaje = 'Tu cuenta de cliente ha sido desactivada. Contacta al administrador.';

                    // Responder con JSON si es API, redirect si es web
                    if ($request->is('api/*')) {
                        return response()->json([
                            'error' => $mensaje,
                            'status' => 'unauthorized'
                        ], 401);
                    }

                    return redirect()->route('login')->with('error', $mensaje);
                }
            }

            // 3. Si es un empleado, verificar que pueda acceder al sistema
            if ($user->empleado) {
                if (!$user->empleado->puedeAccederSistema()) {
                    Log::warning('❌ [CheckUserActive] Empleado sin acceso', [
                        'user_id' => $user->id,
                        'user_name' => $user->name,
                        'empleado_id' => $user->empleado->id,
                        'esta_activo' => $user->empleado->estaActivo(),
                        'puede_acceder_sistema' => $user->empleado->puede_acceder_sistema,
                        'is_api' => $request->is('api/*'),
                        'request_path' => $request->path(),
                    ]);

                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();

                    $mensaje = 'Tu cuenta de empleado no tiene acceso al sistema.';

                    // Mensaje más específico según el problema
                    if (!$user->empleado->estaActivo()) {
                        $mensaje = 'Tu cuenta de empleado ha sido desactivada. Contacta al administrador.';
                    } elseif (!$user->empleado->puede_acceder_sistema) {
                        $mensaje = 'Ya no tienes permisos para acceder al sistema. Contacta al administrador.';
                    }

                    // Responder con JSON si es API, redirect si es web
                    if ($request->is('api/*')) {
                        return response()->json([
                            'error' => $mensaje,
                            'status' => 'unauthorized'
                        ], 401);
                    }

                    return redirect()->route('login')->with('error', $mensaje);
                }
            }
        }

        return $next($request);
    }
}

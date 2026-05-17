<?php

namespace App\Http\Middleware;

use App\Models\Caja;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanOpenCaja
{
    /**
     * Verifica que el usuario tenga una caja asignada y activa.
     * Útil para cualquier rol que maneje cajas (chofer, vendedor, gerente, etc.)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado',
            ], 401);
        }

        // Verificar que tenga caja asignada
        $caja = Caja::where('user_id', $user->id)->where('activa', true)->first();

        if (!$caja) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes una caja asignada. Contacta con administración.',
            ], 403);
        }

        // Pasar la caja al request para uso posterior
        $request->attributes->set('caja', $caja);

        return $next($request);
    }
}

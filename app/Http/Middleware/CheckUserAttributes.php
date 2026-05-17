<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Services\AbacService;

/**
 * ============================================
 * FASE 4: MIDDLEWARE ABAC
 * CheckUserAttributes - Validación ABAC
 * ============================================
 *
 * Valida que los atributos de un usuario estén vigentes
 * Almacena contexto ABAC en la request para uso posterior
 * Permite bypass para Super Admin
 */
class CheckUserAttributes
{
    protected AbacService $abacService;

    public function __construct(AbacService $abacService)
    {
        $this->abacService = $abacService;
    }

    /**
     * Handle an incoming request.
     *
     * Valida que los atributos del usuario no hayan expirado
     * y almacena el contexto ABAC en la request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Super Admin bypass - no necesita validar atributos
            if ($user->hasRole('Super Admin')) {
                $request->attributes->set('abac_context', [
                    'usuario_id' => $user->id,
                    'es_super_admin' => true,
                    'atributos' => [],
                    'timestamp' => now(),
                ]);
                return $next($request);
            }

            // Obtener y validar atributos del usuario
            $atributos = $user->getAttributos();
            $attributosValidos = true;
            $erroresAtributos = [];

            foreach ($user->attributes()->get() as $attribute) {
                $validacion = $this->abacService->validarAtributo($attribute);

                if (!$validacion['valido']) {
                    $attributosValidos = false;
                    $erroresAtributos[] = [
                        'tipo' => $attribute->attribute_type,
                        'valor' => $attribute->attribute_value,
                        'errores' => $validacion['errores'],
                    ];
                }

                // Advertencias (atributos por expirar)
                if (!empty($validacion['advertencias'])) {
                    \Log::warning("Atributo por expirar para usuario {$user->id}", [
                        'tipo' => $attribute->attribute_type,
                        'valor' => $attribute->attribute_value,
                        'advertencias' => $validacion['advertencias'],
                    ]);
                }
            }

            // Si hay atributos expirados, no permitir acceso
            if (!$attributosValidos) {
                \Log::warning("Acceso denegado por atributos expirados para usuario {$user->id}", [
                    'errores' => $erroresAtributos,
                ]);

                return response()->json([
                    'error' => 'Tu acceso ha expirado. Contacta al administrador para actualizar tus permisos.',
                    'detalles' => $erroresAtributos,
                ], 403);
            }

            // Almacenar contexto ABAC en la request para uso posterior
            $contextoAbac = $this->abacService->obtenerContextoUsuario($user);
            $request->attributes->set('abac_context', $contextoAbac);

            // Guardar en sesión para acceso en vistas (solo si no es API)
            // Las APIs con Sanctum no usan sesiones tradicionales
            if (!$request->is('api/*')) {
                try {
                    $request->session()->put('abac_context', $contextoAbac);
                } catch (\Exception $e) {
                    \Log::warning('No se pudo guardar contexto ABAC en sesión (es una API)', [
                        'usuario_id' => $user->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        return $next($request);
    }
}

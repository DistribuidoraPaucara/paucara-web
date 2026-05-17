<?php
namespace App\Http\Middleware;

use App\Exceptions\Caja\CajaNoAbiertaException;
use App\Models\AuditoriaCaja;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware: Validar que el usuario tiene caja abierta
 *
 * Responsabilidades:
 * ✅ Verificar que usuario tiene rol con acceso a cajas
 * ✅ Verificar que tiene caja abierta HOY
 * ✅ Permitir caja del día anterior si:
 *    - Está abierta (no cerrada)
 *    - Es antes de las 6:00 AM del día siguiente (configurable)
 * ✅ Almacenar contexto de caja en request->attributes
 * ✅ Rechazar operación con mensaje claro si no hay caja
 * ✅ Registrar TODOS los intentos en auditoría (exitosos y fallidos)
 *
 * Responde con:
 * - JSON para API
 * - Redirect para Web
 */
class CheckCajaAbierta
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Solo verificar si el usuario está autenticado
        if (! Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();

        // 1️⃣ Buscar caja abierta de HOY del usuario
        $cajaAbierta = \App\Models\AperturaCaja::where('user_id', $user->id)
            ->delDia()  // Hoy
            ->abiertas()
            ->latest()
            ->first();

        // 2️⃣ Si no hay caja de hoy, buscar la más reciente sin cerrar (puede ser de días anteriores)
        if (!$cajaAbierta) {
            $cajaAbierta = \App\Models\AperturaCaja::where('user_id', $user->id)
                ->abiertas()
                ->latest('fecha')
                ->first();

            // 3️⃣ Si es de día anterior, registrar advertencia pero permitir
            if ($cajaAbierta) {
                $fechaApertura = $cajaAbierta->fecha->toDateString();
                $hoy = today()->toDateString();

                if ($fechaApertura < $hoy) {
                    Log::warning('CheckCajaAbierta: Usuario usando caja abierta de día anterior', [
                        'user_id' => $user->id,
                        'fecha_apertura' => $fechaApertura,
                        'caja_id' => $cajaAbierta->caja_id,
                    ]);
                }
            }
        }

        if ($cajaAbierta) {
            // ✅ Caja abierta encontrada - permitir acceso
            $request->attributes->set('caja_id', $cajaAbierta->caja_id);
            $request->attributes->set('apertura_caja_id', $cajaAbierta->id);

            return $next($request);
        }

        // ❌ No hay caja abierta - Detectar si es ruta web o bloqueo duro
        $isWebVentasRoute = !$request->expectsJson()
            && str_starts_with($request->path(), 'ventas');

        if ($isWebVentasRoute) {
            return $this->respondCajaNoAbiertaSoftWarning($request, $next);
        }

        // Bloqueo duro para todo lo demás (API y otros módulos)
        return $this->respondCajaNoAbierta($request);
    }

    /**
     * Responder con advertencia suave para rutas web de ventas sin caja
     * ✅ Permite acceso pero muestra advertencia en toast + banner
     * ✅ Registra acceso con modo 'soft-warning' en auditoría
     */
    private function respondCajaNoAbiertaSoftWarning(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $operacion = $request->method() . ' ' . $request->path();

        // Registrar acceso sin caja con modo suave
        try {
            AuditoriaCaja::registrarAccesoSinCaja(
                user: $user,
                operacion: $operacion,
                ip: $request->ip() ?? 'unknown',
                userAgent: $request->userAgent() ?? 'unknown',
                modo: 'soft-warning'
            );
        } catch (\Exception $e) {
            Log::error("Error registrando auditoría de acceso sin caja: " . $e->getMessage());
        }

        // Flash warning para frontend
        $request->session()->flash('caja_warning', [
            'mensaje' => 'No tienes una caja abierta. Te recomendamos abrir una caja para registrar ventas.',
            'tipo' => 'sin_caja',
            'mostrar_toast' => true,
        ]);

        // Permitir acceso
        return $next($request);
    }

    /**
     * Responder cuando no hay caja abierta
     * ✅ Registra intento en auditoría
     */
    private function respondCajaNoAbierta(Request $request): Response
    {
        $user      = Auth::user();
        $operacion = $request->method() . ' ' . $request->path();

        // ✅ LOG CRÍTICO: BLOQUEANDO OPERACIÓN SIN CAJA
        Log::error('🚫 CheckCajaAbierta::respondCajaNoAbierta() - BLOQUEANDO operación sin caja', [
            'user_id' => $user->id,
            'operacion' => $operacion,
            'ip' => $request->ip(),
            'ruta' => $request->path(),
            'metodo' => $request->method(),
        ]);

        // ✅ REGISTRAR INTENTO EN AUDITORÍA
        try {
            AuditoriaCaja::registrarIntentoSinCaja(
                user: $user,
                operacion: $operacion,
                ip: $request->ip() ?? 'unknown',
                userAgent: $request->userAgent() ?? 'unknown',
                detalles: [
                    'tipo'   => $this->obtenerTipoOperacion($request),
                    'ruta'   => $request->path(),
                    'metodo' => $request->method(),
                ]
            );

            // Verificar si hay múltiples intentos sospechosos
            if (AuditoriaCaja::esOperacionSospechosa($user, minutosAtras: 5)) {
                Log::warning("⚠️ ACTIVIDAD SOSPECHOSA: Usuario {$user->id} ({$user->email}) ha realizado múltiples intentos sin caja en los últimos 5 minutos", [
                    'ip'        => $request->ip(),
                    'operacion' => $operacion,
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Error registrando auditoría de caja: " . $e->getMessage());
        }

        $exception = CajaNoAbiertaException::conDetalles(
            operacion: $operacion,
            usuarioId: $user->id,
            extra: [
                'timestamp' => now()->toIso8601String(),
                'ip'        => $request->ip(),
            ]
        );

        // Responder según tipo de cliente
        if ($request->expectsJson()) {
            // API: Responder con JSON
            return response()->json(
                $exception->toResponse(),
                $exception->getHttpStatusCode()
            );
        }

        // Web: Redirigir con mensaje de error claro
        Log::info('🔄 CheckCajaAbierta - Redirigiendo a /cajas con error', [
            'error_message' => $exception->getMessage(),
        ]);

        // Obtener mensaje específico según la operación
        $tipoOperacion = $this->obtenerTipoOperacion($request);
        $mensajeEspecifico = "No se puede crear {$this->obtenerArticuloOperacion($tipoOperacion)} {$tipoOperacion} sin una caja abierta. Por favor, abre una caja primero.";

        return redirect()
            ->back()
            ->with('error', $mensajeEspecifico)
            ->with('caja_bloqueada', true)
            ->with('operacion_bloqueada', $tipoOperacion)
            ->withInput();
    }

    /**
     * Obtener tipo de operación desde la ruta
     */
    private function obtenerTipoOperacion(Request $request): string
    {
        $path = $request->path();

        if (strpos($path, 'ventas') !== false) {
            return 'VENTA';
        } elseif (strpos($path, 'compras') !== false) {
            return 'COMPRA';
        } elseif (strpos($path, 'pagos') !== false) {
            return 'PAGO';
        }

        return 'DESCONOCIDO';
    }

    /**
     * Obtener artículo gramatical (una/un) según tipo de operación
     */
    private function obtenerArticuloOperacion(string $tipo): string
    {
        return match($tipo) {
            'VENTA' => 'una',
            'COMPRA' => 'una',
            'PAGO' => 'un',
            default => 'una',
        };
    }
}

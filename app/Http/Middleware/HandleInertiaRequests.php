<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\AperturaCaja;
use App\Models\ConfiguracionSitio;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Excluir rutas de logs de Inertia
        if ($request->path() === 'api/admin/logs/view' || $request->path() === 'api/admin/logs/download') {
            return [];
        }

        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // ✅ Obtener estado de caja del usuario para mostrar en NavHeader
        $cajaStatus = $this->getCajaStatus($request->user());
        $configuracionSitio = ConfiguracionSitio::actual();

        // ✅ Obtener token Sanctum de sesión (guardado en AuthenticatedSessionController)
        $sanctumToken = null;

        if ($request->user()) {
            // Obtener del header Authorization primero (para requests de API)
            $authHeader = $request->header('Authorization');
            if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
                $sanctumToken = substr($authHeader, 7);
            }

            // Si no está en header, buscar en sesión
            if (!$sanctumToken) {
                $sanctumToken = $request->session()->get('sanctum_token');
            }

            // Último recurso: obtener del modelo si existe un token activo
            if (!$sanctumToken) {
                $token = $request->user()->currentAccessToken();
                if ($token) {
                    // NOTA: currentAccessToken() devuelve el modelo del token, no el plainText
                    // Necesitaríamos regenerarlo o usar otra estrategia
                    // Por ahora simplemente lo dejamos nulo si no está en sesión
                }
            }

            if ($sanctumToken) {
                \Illuminate\Support\Facades\Log::info('✅ [HandleInertiaRequests] Token Sanctum encontrado', [
                    'token_preview' => substr($sanctumToken, 0, 20) . '...',
                    'user_id' => $request->user()?->id,
                    'session_id' => $request->session()->getId(),
                ]);
            } else {
                \Illuminate\Support\Facades\Log::warning('⚠️  [HandleInertiaRequests] ❌ Token Sanctum no encontrado en sesión', [
                    'user_id' => $request->user()?->id,
                    'session_id' => $request->session()->getId(),
                    'session_keys' => array_keys($request->session()->all()),
                ]);
            }
        }

        // ✅ CORREGIDO (2026-04-16): Cargar relación empresa del usuario
        $user = $request->user();
        if ($user) {
            $user->load('empresa');
        }

        \Illuminate\Support\Facades\Log::info('🔐 [HandleInertiaRequests] Auth props', [
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'is_authenticated' => $user !== null,
            'request_path' => $request->getPathInfo(),
        ]);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'site' => $configuracionSitio ? [
                'nombre' => $configuracionSitio->nombre,
                'imagen' => $configuracionSitio->imagen,
            ] : null,
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
                'roles' => $user ? $user->getRoleNames() : [],
                // Optimización: Solo cargar permisos cuando sea necesario
                'permissions' => $user ? $this->getEssentialPermissions($user) : [],
                // ✅ Compartir token SANCTUM para WebSocket
                'sanctumToken' => $sanctumToken,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            // ✅ Estado de caja disponible en todas las páginas
            'caja_status' => $cajaStatus,
        ];
    }

    /**
     * Obtener todos los permisos del usuario para compartir con el frontend
     */
    private function getEssentialPermissions($user): array
    {
        // Obtener todos los permisos del usuario directamente desde la BD
        // Esto es más escalable y no requiere mantenimiento manual
        return $user->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * ✅ Obtener estado de caja del usuario actual
     * Se proporciona en TODAS las páginas para que el NavHeader pueda mostrar si hay caja abierta
     * ✅ MEJORADO: Busca CUALQUIER caja abierta, sin importar la fecha (incluyendo días anteriores)
     */
    private function getCajaStatus($user): array
    {
        if (!$user) {
            return [
                'tiene_caja_abierta' => false,
                'caja_id' => null,
                'numero_caja' => null,
                'monto_actual' => null,
                'apertura_id' => null,
            ];
        }

        // ✅ NUEVO: Buscar la apertura abierta más reciente (sin cierre), sin filtro de fecha
        // Esto permite mostrar cajas abiertas de días anteriores
        $cajaAbierta = AperturaCaja::where('user_id', $user->id)
            ->whereDoesntHave('cierre')  // No tiene cierre asociado = está abierta
            ->with(['caja'])
            ->latest('fecha')  // La más reciente
            ->first();

        return [
            'tiene_caja_abierta' => $cajaAbierta !== null,
            'caja_id' => $cajaAbierta?->caja_id,
            'numero_caja' => $cajaAbierta?->caja?->nombre,
            'monto_actual' => $cajaAbierta?->monto_apertura,
            'apertura_id' => $cajaAbierta?->id,
        ];
    }
}

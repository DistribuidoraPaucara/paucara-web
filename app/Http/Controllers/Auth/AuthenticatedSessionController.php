<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // 🔍 DEBUG: Verificar qué usuario está autenticado
        $authenticatedUser = auth()->user();
        $sessionId = $request->session()->getId();
        \Illuminate\Support\Facades\Log::info('🔍 [AuthenticatedSessionController] Usuario autenticado:', [
            'user_id' => $authenticatedUser->id,
            'user_name' => $authenticatedUser->name,
            'user_email' => $authenticatedUser->email,
            'session_id' => $sessionId,
        ]);

        // ✅ Generar token SANCTUM para WebSocket
        $token = $authenticatedUser->createToken('api-token')->plainTextToken;

        // 🔍 DEBUG: Verificar el token creado
        $tokenParts = explode('|', $token);
        \Illuminate\Support\Facades\Log::info('🔍 [AuthenticatedSessionController] Token creado:', [
            'token_id' => $tokenParts[0] ?? 'unknown',
            'token_preview' => substr($token, 0, 20) . '...',
            'user_id' => $authenticatedUser->id,
            'session_id' => $sessionId,
        ]);

        // ✅ Guardar el token en sesión para pasarlo al dashboard via Inertia
        $request->session()->put('sanctum_token', $token);

        // 🔍 DEBUG: Verificar que se guardó en sesión ANTES de redirigir
        $sessionToken = $request->session()->get('sanctum_token');
        \Illuminate\Support\Facades\Log::info('🔍 [AuthenticatedSessionController] Token guardado en sesión:', [
            'session_token_preview' => substr($sessionToken, 0, 20) . '...',
            'matches_created_token' => $sessionToken === $token,
            'session_id' => $sessionId,
            'session_data' => array_keys($request->session()->all()),
        ]);

        // ✅ Verificar que todas las claves están en sesión antes de redirigir
        \Illuminate\Support\Facades\Log::info('🔍 [AuthenticatedSessionController] Estado de sesión completo:', [
            'session_has_sanctum_token' => $request->session()->has('sanctum_token'),
            'session_sanctum_token_is_null' => $request->session()->get('sanctum_token') === null,
            'session_id' => $sessionId,
        ]);

        // ✅ CAMBIO IMPORTANTE: Redirigir a dashboard-redirect en lugar de dashboard
        // El backend (DashboardService) decidirá a qué dashboard debe ir el usuario
        // basado en sus roles. El frontend NO tiene lógica de negocios.
        return redirect()->intended(route('dashboard-redirect', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // 🔍 DEBUG: Log antes de logout
        \Illuminate\Support\Facades\Log::info('🔍 [AuthenticatedSessionController] Logout iniciado:', [
            'user_id' => auth()->user()?->id,
            'session_id' => $request->session()->getId(),
        ]);

        Auth::guard('web')->logout();

        // ✅ Limpiar token Sanctum de la sesión
        $request->session()->forget('sanctum_token');

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // 🔍 DEBUG: Log después de logout
        \Illuminate\Support\Facades\Log::info('🔍 [AuthenticatedSessionController] Logout completado:', [
            'new_session_id' => $request->session()->getId(),
            'sanctum_token_exists' => $request->session()->has('sanctum_token'),
        ]);

        return redirect('/');
    }
}

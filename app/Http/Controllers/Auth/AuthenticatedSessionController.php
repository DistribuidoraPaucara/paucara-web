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

        // ✅ NUEVO: Guardar también el token ID en sesión (para referencia)
        $tokenParts = explode('|', $token);
        $request->session()->put('sanctum_token_id', $tokenParts[0] ?? null);

        // ✅ Hacer que la sesión persista inmediatamente
        $request->session()->save();

        \Illuminate\Support\Facades\Log::info('✅ [AuthenticatedSessionController] Token guardado en sesión y guardado:', [
            'token_preview' => substr($token, 0, 20) . '...',
            'session_id' => $sessionId,
            'has_sanctum_token' => $request->session()->has('sanctum_token'),
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

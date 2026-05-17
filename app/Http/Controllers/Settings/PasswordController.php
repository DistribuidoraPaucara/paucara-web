<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/password');
    }

    /**
     * Update the user's password.
     * ✅ MEJORADO (2026-03-17): Cierra la sesión y redirecciona al login después de actualizar
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        Log::info('🔐 Contraseña actualizada', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'timestamp' => now(),
        ]);

        // ✅ NUEVO (2026-03-17): Cerrar sesión después de cambiar contraseña
        Auth::logout();

        // ✅ Invalidar la sesión del usuario
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('🚪 Sesión cerrada tras cambio de contraseña', [
            'user_id' => $user->id,
        ]);

        // ✅ Redirigir al login con mensaje de éxito
        return redirect()->route('login')->with('status', 'Contraseña actualizada. Por favor, inicia sesión de nuevo.');
    }
}

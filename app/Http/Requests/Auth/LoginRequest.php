<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Accept either email or usernick in the same field
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $login = $this->string('email')->toString();
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'usernick';

        $credentials = [
            $field => $login,
            'password' => $this->string('password')->toString(),
        ];

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Verificar que el usuario esté activo
        $user = Auth::user();

        // 1. Verificar si el User tiene el campo activo en false
        if (isset($user->activo) && !$user->activo) {
            Auth::logout();
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => 'Tu cuenta de usuario está inactiva. Contacta al administrador.',
            ]);
        }

        // 2. Si es un cliente, verificar que el Cliente también esté activo
        if ($user->cliente) {
            if (!$user->cliente->activo) {
                Auth::logout();
                RateLimiter::hit($this->throttleKey());

                throw ValidationException::withMessages([
                    'email' => 'Tu cuenta de cliente está inactiva. Contacta al administrador.',
                ]);
            }
        }

        // 3. Si es un empleado, verificar que pueda acceder al sistema
        if ($user->empleado) {
            if (!$user->empleado->puedeAccederSistema()) {
                Auth::logout();
                RateLimiter::hit($this->throttleKey());

                $mensaje = 'Tu cuenta de empleado no tiene acceso al sistema.';

                // Mensaje más específico según el problema
                if (!$user->empleado->estaActivo()) {
                    $mensaje = 'Tu cuenta de empleado está inactiva. Contacta al administrador.';
                } elseif (!$user->empleado->puede_acceder_sistema) {
                    $mensaje = 'No tienes permisos para acceder al sistema. Contacta al administrador.';
                }

                throw ValidationException::withMessages([
                    'email' => $mensaje,
                ]);
            }
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return $this->string('email')
            ->lower()
            ->append('|'.$this->ip())
            ->transliterate()
            ->value();
    }
}

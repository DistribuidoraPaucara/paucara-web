<?php

use App\Http\Middleware\CanOpenCaja;
use App\Http\Middleware\CheckCajaAbierta;
use App\Http\Middleware\CheckPlatformAccess;
use App\Http\Middleware\CheckUserActive;
use App\Http\Middleware\CheckUserAttributes;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: [
            __DIR__.'/../routes/web.php',
            __DIR__.'/../routes/auth.php',  // ✅ Incluir rutas de autenticación
        ],
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ✅ Confiar en proxies (necesario para Railway y otros hosts con proxies)
        $middleware->trustProxies(at: '*');

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            CheckUserActive::class,
            CheckUserAttributes::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        $middleware->api(append: [
            CheckUserActive::class,
            CheckUserAttributes::class,
        ]);

        // ✅ Excluir rutas del middleware CSRF
        $middleware->validateCsrfTokens(except: [
            'test-csrf',
            'api/*',  // 🔐 Las APIs usan Sanctum, no CSRF
        ]);

        // Aliases for Spatie Permission middlewares
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
            'caja.abierta' => CheckCajaAbierta::class,
            'can.open.caja' => CanOpenCaja::class,
            'platform' => CheckPlatformAccess::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

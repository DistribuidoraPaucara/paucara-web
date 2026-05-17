<?php

namespace App\Providers;

use App\Models\Cliente;
use App\Models\Compra;
use App\Models\Entrega;
use App\Models\ModuloSidebar;
use App\Models\PrecioProducto;
use App\Models\Proforma;
use App\Models\Ruta;
use App\Models\RutaDetalle;
use App\Observers\ClienteObserver;
use App\Observers\CompraObserver;
use App\Observers\EntregaObserver;
use App\Observers\ModuloSidebarObserver;
use App\Observers\PrecioProductoObserver;
use App\Observers\ProformaObserver;
use App\Observers\RutaObserver;
use App\Observers\RutaDetalleObserver;
use App\Services\Notifications\EntregaNotificationService;
use App\Services\Notifications\DatabaseNotificationService;
use App\Services\WebSocket\EntregaWebSocketService;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // ✅ FASE 6: Registrar servicios de notificación de entrega para inyección de dependencias
        $this->app->singleton(EntregaNotificationService::class, function ($app) {
            return new EntregaNotificationService(
                $app->make(DatabaseNotificationService::class),
                $app->make(EntregaWebSocketService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        // ✅ Observers
        Cliente::observe(ClienteObserver::class);
        ModuloSidebar::observe(ModuloSidebarObserver::class);
        PrecioProducto::observe(PrecioProductoObserver::class);
        Compra::observe(CompraObserver::class);
        Proforma::observe(ProformaObserver::class);
        Ruta::observe(RutaObserver::class);
        RutaDetalle::observe(RutaDetalleObserver::class);
        \App\Models\CodigoBarra::observe(\App\Observers\CodigoBarraObserver::class);

        // ✅ NUEVO - FASE 5: Observer para sincronización WebSocket Entrega-Venta
        Entrega::observe(EntregaObserver::class);
    }
}

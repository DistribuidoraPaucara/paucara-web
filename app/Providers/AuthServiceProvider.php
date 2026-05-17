<?php

namespace App\Providers;

use App\Models\Cliente;
use App\Models\Compra;
use App\Models\Venta;
use App\Models\VisitaPreventistaCliente;
use App\Policies\ClientePolicy;
use App\Policies\CompraPolicy;
use App\Policies\VentaPolicy;
use App\Policies\VisitaPreventistaPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * ============================================
     * FASE 4: MAPEO DE MODELOS A POLÍTICAS ABAC
     * ============================================
     *
     * Mapeo de Models a Policies con control ABAC
     * (Attribute-Based Access Control)
     */
    protected $policies = [
        Cliente::class => ClientePolicy::class,
        Compra::class => CompraPolicy::class,
        Venta::class => VentaPolicy::class,
        VisitaPreventistaCliente::class => VisitaPreventistaPolicy::class,
        // Pedido::class => PedidoPolicy::class,    // Descomentar cuando exista modelo
        // Inventario::class => InventarioPolicy::class, // Descomentar cuando exista modelo
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Registrar todas las policies del mapeo
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }
    }
}

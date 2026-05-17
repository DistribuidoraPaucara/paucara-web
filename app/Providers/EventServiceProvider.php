<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Venta;
use App\Observers\UserObserver;
use App\Observers\VentaObserver;
use App\Events\DashboardMetricsUpdated;
use App\Events\EntregaAsignada;
use App\Events\EntregaCompletada;
use App\Events\EntregaConfirmada;
use App\Events\EntregaCreada;
use App\Events\EntregaEnCamino;
use App\Events\EntregaEstadoCambiado;
use App\Events\EntregaRechazada;
use App\Events\MarcarLlegadaConfirmada;
use App\Events\NovedadEntregaReportada;
use App\Events\ProformaActualizada;
use App\Events\ProformaAprobada;
use App\Events\ProformaCoordinacionActualizada;
use App\Events\ProformaConvertida;
use App\Events\ProformaCreada;
use App\Events\ProformaRechazada;
use App\Events\RutaPlanificada;
use App\Events\UbicacionActualizada;
use App\Events\VentaEstadoCambiado;
use App\Listeners\BroadcastDashboardMetrics;
use App\Listeners\SendVentaEstadoCambiadoNotification;
use App\Listeners\SincronizarWebSocketEstadoEntrega;
use App\Listeners\SincronizarWebSocketUbicacion;
use App\Listeners\Logistica\BroadcastEntregaAsignada;
use App\Listeners\Logistica\BroadcastEntregaConfirmada;
use App\Listeners\Logistica\BroadcastMarcarLlegada;
use App\Listeners\Logistica\BroadcastNovedadEntrega;
use App\Listeners\Logistica\BroadcastRutaPlanificada;
use App\Listeners\Logistica\BroadcastUbicacionActualizada;
use App\Listeners\SendProformaApprovedNotification;
use App\Listeners\SendProformaCoordinationNotification;
use App\Listeners\SendProformaConvertedNotification;
use App\Listeners\SendProformaCreatedNotification;
use App\Listeners\SendProformaRejectedNotification;
use App\Listeners\SendProformaUpdatedNotification;
use App\Listeners\SendEntregaAsignadaNotification;
use App\Listeners\Venta\BroadcastProformaCreada;
use App\Events\CreditoCreado;
use App\Events\CreditoPagoRegistrado;
use App\Events\CreditoVencido;
use App\Events\CreditoCritico;
use App\Events\VentaCreada;
use App\Listeners\CrearCuentaPorCobrarListener;
use App\Listeners\CreateCuentaPorCobrarFromVentaListener;
use App\Listeners\RegisterCajaMovementFromVentaListener;
use App\Listeners\SendCreditoCreadoNotification;
use App\Listeners\SendCreditoPagoRegistradoNotification;
use App\Listeners\SendCreditoVencidoNotification;
use App\Listeners\SendCreditoCriticoNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

/**
 * EventServiceProvider - REFACTORIZADO para SSOT + WebSocket
 *
 * ARQUITECTURA:
 * 1. Service emite Event (después de transacción exitosa)
 * 2. EventServiceProvider registra Listeners
 * 3. Listeners escuchan Events
 * 4. Listeners hacen broadcast (sin lógica de negocio)
 * 5. WebSocket client recibe broadcast
 *
 * IMPORTANTE:
 * ✓ Un Event puede tener múltiples Listeners
 * ✓ Un Listener puede hacer broadcast a múltiples canales
 * ✓ Listeners NO pueden fallar la transacción
 * ✓ Si un Listener falla, otros continúan
 */
class EventServiceProvider extends ServiceProvider
{
    /**
     * Los Event listeners para la aplicación
     *
     * @var array
     */
    protected $listen = [
        // ══════════════════════════════════════════════════════════
        // DASHBOARD EVENTS
        // ══════════════════════════════════════════════════════════

        DashboardMetricsUpdated::class => [
            BroadcastDashboardMetrics::class,
        ],

        // ══════════════════════════════════════════════════════════
        // PROFORMA EVENTS
        // ══════════════════════════════════════════════════════════

        ProformaCreada::class => [
            BroadcastProformaCreada::class,
            SendProformaCreatedNotification::class,
        ],

        // ✅ NUEVO: Notificar cuando se actualiza una proforma
        ProformaActualizada::class => [
            SendProformaUpdatedNotification::class,
        ],

        ProformaAprobada::class => [
            SendProformaApprovedNotification::class,
        ],

        ProformaRechazada::class => [
            SendProformaRejectedNotification::class,
        ],

        ProformaConvertida::class => [
            SendProformaConvertedNotification::class,
            CrearCuentaPorCobrarListener::class, // ✅ NUEVO: Crear cuenta por cobrar si es crédito
        ],

        ProformaCoordinacionActualizada::class => [
            SendProformaCoordinationNotification::class,
        ],

        // ══════════════════════════════════════════════════════════
        // CREDITO EVENTS
        // ══════════════════════════════════════════════════════════

        CreditoCreado::class => [
            SendCreditoCreadoNotification::class, // ✅ NUEVO: Notificar WebSocket cuando se crea crédito
        ],

        CreditoPagoRegistrado::class => [
            SendCreditoPagoRegistradoNotification::class, // ✅ NUEVO: Notificar WebSocket cuando se paga
        ],

        CreditoVencido::class => [
            SendCreditoVencidoNotification::class, // ✅ NUEVO: Notificar cuando crédito se vence
        ],

        CreditoCritico::class => [
            SendCreditoCriticoNotification::class, // ✅ NUEVO: Notificar cuando crédito crítico
        ],

        // ══════════════════════════════════════════════════════════
        // ENTREGA EVENTS
        // ══════════════════════════════════════════════════════════

        EntregaCreada::class => [
            // Broadcast cuando se crea una entrega
        ],

        EntregaAsignada::class => [
            BroadcastEntregaAsignada::class,
            SendEntregaAsignadaNotification::class, // ✅ Notifica a cliente y preventista cuando venta es asignada a entrega
        ],

        EntregaEnCamino::class => [
            // Broadcast cuando entrega está en camino
        ],

        // ✅ FASE 2: Evento centralizado de cambio de estado
        // Se dispara desde EntregaService::cambiarEstadoNormalizado()
        // Listeners:
        //   1. SincronizarWebSocketEstadoEntrega - Notifica al WebSocket
        EntregaEstadoCambiado::class => [
            SincronizarWebSocketEstadoEntrega::class,
        ],

        EntregaCompletada::class => [
            // Broadcast cuando entrega se completa
        ],

        EntregaConfirmada::class => [
            BroadcastEntregaConfirmada::class,
        ],

        EntregaRechazada::class => [
            // Broadcast cuando entrega es rechazada
        ],

        // ══════════════════════════════════════════════════════════
        // ENTREGA - DRIVER ACTIONS EVENTS
        // ══════════════════════════════════════════════════════════

        MarcarLlegadaConfirmada::class => [
            BroadcastMarcarLlegada::class,
        ],

        NovedadEntregaReportada::class => [
            BroadcastNovedadEntrega::class,
        ],

        // ══════════════════════════════════════════════════════════
        // VENTA EVENTS
        // ══════════════════════════════════════════════════════════

        VentaCreada::class => [
            RegisterCajaMovementFromVentaListener::class, // ✅ NUEVO: Registrar movimiento de caja si hay pago
            CreateCuentaPorCobrarFromVentaListener::class, // ✅ NUEVO: Crear cuenta por cobrar si política_pago='CREDITO'
        ],

        VentaEstadoCambiado::class => [
            SendVentaEstadoCambiadoNotification::class,
        ],

        // ══════════════════════════════════════════════════════════
        // UBICACIÓN/TRACKING EVENTS
        // ══════════════════════════════════════════════════════════

        UbicacionActualizada::class => [
            BroadcastUbicacionActualizada::class,
            // ✅ FASE 3: Notificar cambios de ubicación al WebSocket en tiempo real
            SincronizarWebSocketUbicacion::class,
        ],

        // ══════════════════════════════════════════════════════════
        // RUTA EVENTS
        // ══════════════════════════════════════════════════════════

        RutaPlanificada::class => [
            BroadcastRutaPlanificada::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // Registrar observadores de modelos
        User::observe(UserObserver::class);
        Venta::observe(VentaObserver::class);
    }

    /**
     * Determine if events and listeners should be cached.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}

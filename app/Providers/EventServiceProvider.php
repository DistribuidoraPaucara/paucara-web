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
use App\Events\EntregaListoParaEntrega;
use App\Events\EntregaRechazada;
use App\Events\EntregaSalidoAEntrega;
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
use App\Events\VentaConfirmadaEntregada;
use App\Events\VentaConfirmadaEntrega;
use App\Events\VentaEstadoCambiado;
use App\Listeners\BroadcastDashboardMetrics;
use App\Listeners\SendVentaConfirmadaEntregadaNotification;
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
use App\Listeners\SendEntregaListoParaEntregaNotification;
use App\Listeners\SendVentaConfirmadaEntregaNotification;
use App\Listeners\SendEntregaSalidoAEntregaNotification;
use App\Listeners\Venta\BroadcastProformaCreada;
use App\Events\NotificacionRecurrenteEmitida;
use App\Listeners\Notificaciones\BroadcastNotificacionRecurrente;
use App\Events\CreditoCreado;
use App\Events\CreditoPagoRegistrado;
use App\Events\CreditoVencido;
use App\Events\CreditoCritico;
use App\Events\VentaCreada;
use App\Listeners\CrearCuentaPorCobrarListener;
use App\Listeners\CreateCuentaPorCobrarFromVentaListener;
use App\Listeners\RegisterCajaMovementFromVentaListener;
use App\Listeners\SendCreditoCreadoNotification;
use App\Events\DetallePagoVentaCreated;
use App\Listeners\CreateCajaMovementFromDetallePagoVenta;
use App\Listeners\SendCreditoPagoRegistradoNotification;
use App\Listeners\SendCreditoVencidoNotification;
use App\Listeners\SendCreditoCriticoNotification;
use App\Events\PrestamoClienteCreado;
use App\Events\PrestamoEventoCreado;
use App\Events\PrestamoProveedorCreado;
use App\Events\DevolucionRegistrada;
use App\Events\DevolucionEventoRegistrada;
use App\Events\DevolucionProveedorRegistrada;
use App\Listeners\SendPrestamoClienteCreatedNotification;
use App\Listeners\SendPrestamoEventoCreatedNotification;
use App\Listeners\SendPrestamoProveedorCreatedNotification;
use App\Listeners\SendDevolucionRegisteredNotification;
use App\Listeners\SendDevolucionEventoRegisteredNotification;
use App\Listeners\SendDevolucionProveedorRegisteredNotification;
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
        // NOTIFICACIONES RECURRENTES EVENTS
        // ══════════════════════════════════════════════════════════

        NotificacionRecurrenteEmitida::class => [
            BroadcastNotificacionRecurrente::class,
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

        EntregaListoParaEntrega::class => [
            SendEntregaListoParaEntregaNotification::class, // ✅ Notifica al creador y clientes cuando entrega está lista
        ],

        EntregaSalidoAEntrega::class => [
            SendEntregaSalidoAEntregaNotification::class, // ✅ Notifica al cliente y preventista cuando entrega sale a entrega
        ],

        // ✅ NUEVO: Evento cuando se confirma una venta como entregada
        VentaConfirmadaEntrega::class => [
            SendVentaConfirmadaEntregaNotification::class, // Notifica al creador de entrega y al cliente
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

        // ✅ NUEVO: Evento cuando chofer confirma venta como entregada
        // Notifica a cliente, preventista, admins y cajeros
        VentaConfirmadaEntregada::class => [
            SendVentaConfirmadaEntregadaNotification::class,
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
            // ✅ DESHABILITADO (2026-07-24): Evitar duplicación de movimientos_caja
            // RegisterCajaMovementFromVentaListener::class, // Ahora usa CreateCajaMovementFromDetallePagoVenta
            CreateCuentaPorCobrarFromVentaListener::class, // ✅ NUEVO: Crear cuenta por cobrar si política_pago='CREDITO'
        ],

        // ✅ NUEVO (2026-07-24): Registrar movimiento de caja cuando se crea un DetallePagoVenta
        DetallePagoVentaCreated::class => [
            CreateCajaMovementFromDetallePagoVenta::class,
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

        // ══════════════════════════════════════════════════════════
        // PRÉSTAMO EVENTS
        // ══════════════════════════════════════════════════════════

        // ✅ NUEVO: Notificar cuando se crea un préstamo a cliente
        // Listeners notifican a: usuario creador, admins, cajeros, cliente
        PrestamoClienteCreado::class => [
            SendPrestamoClienteCreatedNotification::class,
        ],

        // ✅ NUEVO: Notificar cuando se crea un préstamo a evento
        // Listeners notifican a: usuario creador, admins, cajeros, cliente eventos
        PrestamoEventoCreado::class => [
            SendPrestamoEventoCreatedNotification::class,
        ],

        // ✅ NUEVO: Notificar cuando se crea un préstamo a proveedor
        // Listeners notifican a: usuario creador, admins, cajeros, proveedor
        PrestamoProveedorCreado::class => [
            SendPrestamoProveedorCreatedNotification::class,
        ],

        // ✅ NUEVO: Notificar cuando se registra una devolución de préstamo
        // Listeners notifican a: admins, cajeros, choferes
        DevolucionRegistrada::class => [
            SendDevolucionRegisteredNotification::class,
        ],

        // ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a evento
        // Listeners notifican a: admins, cajeros, choferes
        DevolucionEventoRegistrada::class => [
            SendDevolucionEventoRegisteredNotification::class,
        ],

        // ✅ NUEVO: Notificar cuando se registra una devolución de préstamo a proveedor
        // Listeners notifican a: admins, cajeros, choferes
        DevolucionProveedorRegistrada::class => [
            SendDevolucionProveedorRegisteredNotification::class,
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

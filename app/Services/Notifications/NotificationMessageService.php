<?php

namespace App\Services\Notifications;

/**
 * ✅ NUEVO: Servicio centralizado de mensajes de notificación
 *
 * RESPONSABILIDAD ÚNICA: Construir mensajes de notificación
 *
 * VENTAJAS:
 * ✓ Una única fuente de verdad para todos los mensajes
 * ✓ Fácil mantener consistencia en todo el proyecto
 * ✓ Cambiar un mensaje = cambiar en un solo lugar
 * ✓ Reutilizable en Laravel, Node.js y Flutter
 */
class NotificationMessageService
{
    // ═══════════════════════════════════════════════════════════
    // MENSAJES DE PROFORMA
    // ═══════════════════════════════════════════════════════════

    /**
     * Mensaje cuando proforma es aprobada
     */
    public static function proformaAprobada(
        string $proformaNumero,
        ?string $clienteNombre = null,
        ?string $aprobador = null
    ): string {
        $mensaje = "Proforma $proformaNumero aprobada";
        if ($aprobador) {
            $mensaje .= " por $aprobador";
        }
        if ($clienteNombre) {
            $mensaje .= " - $clienteNombre";
        }
        return $mensaje;
    }

    /**
     * Mensaje cuando proforma es rechazada
     */
    public static function proformaRechazada(
        string $proformaNumero,
        ?string $motivo = null
    ): string {
        $mensaje = "Proforma $proformaNumero rechazada";
        if ($motivo) {
            $mensaje .= ": $motivo";
        }
        return $mensaje;
    }

    /**
     * Mensaje cuando proforma se convierte a venta
     */
    public static function proformaConvertida(
        string $proformaNumero,
        ?int $ventaId = null,
        ?string $clienteNombre = null
    ): string {
        $mensaje = "Proforma $proformaNumero convertida a pedido";
        if ($ventaId) {
            $mensaje .= " - Folio: $ventaId";
        }
        if ($clienteNombre) {
            $mensaje .= " | $clienteNombre";
        }
        return $mensaje;
    }

    // ═══════════════════════════════════════════════════════════
    // MENSAJES DE VENTA / ESTADO
    // ═══════════════════════════════════════════════════════════

    /**
     * Mensaje cuando estado de venta cambia
     * Formato: "Folio:720 cambió a En Preparación | Entrega Folio:456 - Juan"
     */
    public static function ventaEstadoCambio(
        int $ventaId,
        string $nuevoEstado,
        ?int $entregaId = null,
        ?string $clienteNombre = null
    ): string {
        $mensaje = "Folio:$ventaId cambió a $nuevoEstado";

        if ($entregaId) {
            $mensaje .= " | Entrega Folio:$entregaId";
        }

        if ($clienteNombre) {
            $mensaje .= " - $clienteNombre";
        }

        return $mensaje;
    }

    /**
     * Mensaje cuando venta es asignada a entrega
     * Formato: "Folio: 720 asignado a Entrega Folio: 456"
     */
    public static function ventaAsignadaAEntrega(
        int $ventaId,
        int $entregaId,
        ?string $clienteNombre = null
    ): string {
        $mensaje = "Folio: $ventaId asignado a Entrega Folio: $entregaId";

        if ($clienteNombre) {
            $mensaje .= " - $clienteNombre";
        }

        return $mensaje;
    }

    /**
     * Mensaje cuando venta está en tránsito
     */
    public static function ventaEnTransito(
        int $ventaId,
        ?string $choferNombre = null
    ): string {
        $mensaje = "Folio: $ventaId está en tránsito";

        if ($choferNombre) {
            $mensaje .= " | Chofer: $choferNombre";
        }

        return $mensaje;
    }

    /**
     * Mensaje cuando venta fue entregada
     */
    public static function ventaEntregada(
        int $ventaId,
        ?string $clienteNombre = null
    ): string {
        $mensaje = "Folio: $ventaId ha sido entregada";

        if ($clienteNombre) {
            $mensaje .= " - $clienteNombre";
        }

        return $mensaje;
    }

    // ═══════════════════════════════════════════════════════════
    // MENSAJES DE ENTREGA
    // ═══════════════════════════════════════════════════════════

    /**
     * Mensaje cuando entrega consolidada es creada
     */
    public static function entregaCreada(
        string $numeroEntrega,
        ?string $choferNombre = null,
        ?string $vehiculoPlaca = null,
        ?int $ventasCount = null
    ): string {
        $mensaje = "Entrega $numeroEntrega creada";

        if ($choferNombre) {
            $mensaje .= " - Chofer: $choferNombre";
        }

        if ($vehiculoPlaca) {
            $mensaje .= " | Vehículo: $vehiculoPlaca";
        }

        if ($ventasCount) {
            $mensaje .= " ($ventasCount ventas)";
        }

        return $mensaje;
    }

    /**
     * Mensaje cuando se notifica que ventas fueron asignadas a entrega
     * Centraliza el formato de notificación de venta asignada a entrega
     */
    public static function ventasAsignadasAEntrega(
        int $entregaId,
        string $estadoLogistico,
        ?string $clienteNombre = null
    ): string {
        // Formato: "Estado Entrega Folio:456 | Preparacion en carga - Cliente"
        return "Entrega Folio:$entregaId | $estadoLogistico"
            . ($clienteNombre ? " - $clienteNombre" : "");
    }

    /**
     * Mensaje cuando reporte de carga es generado
     */
    public static function reporteCargoGenerado(
        string $numeroReporte,
        string $numeroEntrega,
        ?string $choferNombre = null
    ): string {
        $mensaje = "Reporte $numeroReporte generado para Entrega $numeroEntrega";

        if ($choferNombre) {
            $mensaje .= " | Chofer: $choferNombre";
        }

        return $mensaje;
    }

    // ═══════════════════════════════════════════════════════════
    // TÍTULOS DE NOTIFICACIÓN
    // ═══════════════════════════════════════════════════════════

    /**
     * Títulos para usar en notificaciones nativas
     */
    public static function titulo(string $tipo): string
    {
        return match ($tipo) {
            'proforma_aprobada' => '✅ Proforma Aprobada',
            'proforma_rechazada' => '❌ Proforma Rechazada',
            'proforma_convertida' => '✅ Pedido Confirmado',
            'proforma_actualizada' => '📝 Proforma Actualizada',
            'venta_estado_cambio' => '📊 Estado de Venta Cambió',
            'venta_asignada_entrega' => '📦 Venta Asignada a Entrega',
            'venta_en_transito' => '🚚 Venta En Tránsito',
            'venta_entregada' => '✅ Venta Entregada',
            'entrega_creada' => '🚚 Nueva Entrega Consolidada',
            'reporte_cargo_generado' => '📋 Reporte de Carga Generado',
            default => '📢 Notificación',
        };
    }

    /**
     * Canales de notificación por tipo
     */
    public static function canal(string $tipo): string
    {
        return match ($tipo) {
            'proforma_aprobada',
            'proforma_rechazada',
            'proforma_convertida',
            'proforma_actualizada' => 'proformas',

            'venta_estado_cambio' => 'cambio_estados',

            'venta_asignada_entrega',
            'entrega_creada',
            'reporte_cargo_generado' => 'entregas',

            'venta_en_transito',
            'venta_entregada' => 'cambio_estados',

            default => 'cambio_estados',
        };
    }
}

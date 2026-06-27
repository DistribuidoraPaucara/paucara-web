<?php

namespace App\Enums;

/**
 * ✅ Tipos de Confirmación en Entregas
 *
 * Define los tipos válidos para confirmaciones de entregas y novedades
 */
class EntregaConfirmacionTipo
{
    // ===== TIPO DE ENTREGA =====
    /** Entrega completada sin problemas */
    public const TIPO_ENTREGA_COMPLETA = 'COMPLETA';

    /** Entrega con novedades/problemas */
    public const TIPO_ENTREGA_CON_NOVEDAD = 'CON_NOVEDAD';

    // ===== TIPO DE NOVEDAD =====
    /** Novedad: Cliente cerrado */
    public const TIPO_NOVEDAD_CLIENTE_CERRADO = 'CLIENTE_CERRADO';

    /** Novedad: Devolución parcial */
    public const TIPO_NOVEDAD_DEVOLUCION_PARCIAL = 'DEVOLUCION_PARCIAL';

    /** Novedad: Rechazado */
    public const TIPO_NOVEDAD_RECHAZADO = 'RECHAZADO';

    /** ✅ NUEVO (2026-06-27): Novedad: Anulación de caja */
    public const TIPO_NOVEDAD_ANULACION_CAJA = 'ANULACION_CAJA';

    // ===== TIPO DE CONFIRMACIÓN =====
    /** Confirmación: Entrega completa */
    public const TIPO_CONFIRMACION_COMPLETA = 'COMPLETA';

    /** Confirmación: Rechazado */
    public const TIPO_CONFIRMACION_RECHAZADO = 'RECHAZADO';

    /** Confirmación: Cliente cerrado */
    public const TIPO_CONFIRMACION_CLIENTE_CERRADO = 'CLIENTE_CERRADO';

    /** Confirmación: Devolución parcial */
    public const TIPO_CONFIRMACION_DEVOLUCION_PARCIAL = 'DEVOLUCION_PARCIAL';

    /** Confirmación: No contactado */
    public const TIPO_CONFIRMACION_NO_CONTACTADO = 'NO_CONTACTADO';

    /** ✅ NUEVO (2026-06-27): Confirmación: Anulación de caja */
    public const TIPO_CONFIRMACION_ANULACION_CAJA = 'ANULACION_CAJA';

    // ===== HELPERS =====

    /**
     * Obtener todos los tipos de entrega válidos
     */
    public static function tiposEntregaValidos(): array
    {
        return [
            self::TIPO_ENTREGA_COMPLETA,
            self::TIPO_ENTREGA_CON_NOVEDAD,
        ];
    }

    /**
     * Obtener todos los tipos de novedad válidos
     */
    public static function tiposNovedadValidos(): array
    {
        return [
            self::TIPO_NOVEDAD_CLIENTE_CERRADO,
            self::TIPO_NOVEDAD_DEVOLUCION_PARCIAL,
            self::TIPO_NOVEDAD_RECHAZADO,
            self::TIPO_NOVEDAD_ANULACION_CAJA,  // ✅ NUEVO
        ];
    }

    /**
     * Obtener todos los tipos de confirmación válidos
     */
    public static function tiposConfirmacionValidos(): array
    {
        return [
            self::TIPO_CONFIRMACION_COMPLETA,
            self::TIPO_CONFIRMACION_RECHAZADO,
            self::TIPO_CONFIRMACION_CLIENTE_CERRADO,
            self::TIPO_CONFIRMACION_DEVOLUCION_PARCIAL,
            self::TIPO_CONFIRMACION_NO_CONTACTADO,
            self::TIPO_CONFIRMACION_ANULACION_CAJA,  // ✅ NUEVO
        ];
    }

    /**
     * ✅ NUEVO (2026-06-27): Obtener descripción legible del tipo de novedad
     */
    public static function describir(string $tipo): string
    {
        return match ($tipo) {
            self::TIPO_NOVEDAD_CLIENTE_CERRADO => '🏪 Cliente Cerrado',
            self::TIPO_NOVEDAD_DEVOLUCION_PARCIAL => '↩️ Devolución Parcial',
            self::TIPO_NOVEDAD_RECHAZADO => '🚫 Rechazado',
            self::TIPO_NOVEDAD_ANULACION_CAJA => '❌ Anulación de Caja',
            self::TIPO_CONFIRMACION_COMPLETA => '✅ Completa',
            self::TIPO_CONFIRMACION_ANULACION_CAJA => '❌ Anulación de Caja',
            default => 'Desconocido',
        };
    }
}

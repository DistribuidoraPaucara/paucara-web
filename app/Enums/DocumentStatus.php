<?php

namespace App\Enums;

/**
 * DocumentStatus - Estados de Documentos (Ventas, Proformas, etc.)
 *
 * Única fuente de verdad para los estados de documentos en el sistema.
 * Usado por: Venta, Proforma, Remisión, etc.
 *
 * TRANSICIONES VÁLIDAS:
 * PENDIENTE    → APROBADA, RECHAZADA, CANCELADA
 * APROBADA     → COMPLETA, RECHAZADA, CANCELADA
 * COMPLETA     → [ninguna]
 * RECHAZADA    → [ninguna]
 * CANCELADA    → [ninguna]
 */
enum DocumentStatus: string
{
    case PENDIENTE = 'pendiente';
    case APROBADA = 'aprobada';
    case RECHAZADA = 'rechazada';
    case CANCELADA = 'cancelada';
    case COMPLETA = 'completa';

    /**
     * Obtener etiqueta legible para el usuario
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDIENTE => 'Pendiente de Aprobación',
            self::APROBADA => 'Aprobada',
            self::RECHAZADA => 'Rechazada',
            self::CANCELADA => 'Cancelada',
            self::COMPLETA => 'Completa',
        };
    }

    /**
     * Obtener color para UI
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDIENTE => '#FFC107',  // Amarillo
            self::APROBADA => '#28A745',   // Verde
            self::RECHAZADA => '#DC3545',  // Rojo
            self::CANCELADA => '#6C757D',  // Gris
            self::COMPLETA => '#17A2B8',   // Cyan
        };
    }

    /**
     * Obtener ícono para UI
     */
    public function icon(): string
    {
        return match ($this) {
            self::PENDIENTE => 'clock',
            self::APROBADA => 'check-circle',
            self::RECHAZADA => 'times-circle',
            self::CANCELADA => 'ban',
            self::COMPLETA => 'check-double',
        };
    }

    /**
     * Verificar si es un estado final (no permite transiciones)
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::CANCELADA, self::RECHAZADA, self::COMPLETA]);
    }

    /**
     * Obtener transiciones válidas desde este estado
     */
    public function validTransitions(): array
    {
        return match ($this) {
            self::PENDIENTE => [self::APROBADA, self::RECHAZADA, self::CANCELADA],
            self::APROBADA => [self::COMPLETA, self::RECHAZADA, self::CANCELADA],
            self::RECHAZADA => [],
            self::CANCELADA => [],
            self::COMPLETA => [],
        };
    }

    /**
     * Verificar si es posible hacer una transición a otro estado
     */
    public function canTransitionTo(self $targetStatus): bool
    {
        return in_array($targetStatus, $this->validTransitions());
    }
}

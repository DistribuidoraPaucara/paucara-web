<?php

namespace App\Enums;

/**
 * EntregaStatus - Estados de Entregas/Envíos
 *
 * Única fuente de verdad para los estados de entregas en el sistema.
 * Usado por: Entrega, Envio, detalles de rutas, etc.
 *
 * FLUJO DE ESTADOS:
 * PENDIENTE → ASIGNADA → EN_RUTA → ENTREGADA
 *         ↘ (opcional: NO_ENTREGADA, REPROGRAMADA)
 */
enum EntregaStatus: string
{
    case PENDIENTE = 'pendiente';
    case ASIGNADA = 'asignada';
    case EN_RUTA = 'en_ruta';
    case ENTREGADA = 'entregada';
    case NO_ENTREGADA = 'no_entregada';
    case REPROGRAMADA = 'reprogramada';
    case CANCELADA = 'cancelada';

    /**
     * Obtener etiqueta legible para el usuario
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDIENTE => 'Pendiente',
            self::ASIGNADA => 'Asignada a Ruta',
            self::EN_RUTA => 'En Ruta',
            self::ENTREGADA => 'Entregada',
            self::NO_ENTREGADA => 'No Entregada',
            self::REPROGRAMADA => 'Reprogramada',
            self::CANCELADA => 'Cancelada',
        };
    }

    /**
     * Obtener color para UI
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDIENTE => '#FFC107',      // Amarillo
            self::ASIGNADA => '#0275D8',       // Azul
            self::EN_RUTA => '#5CB85C',        // Verde oscuro
            self::ENTREGADA => '#28A745',      // Verde
            self::NO_ENTREGADA => '#DC3545',   // Rojo
            self::REPROGRAMADA => '#FF9800',   // Naranja
            self::CANCELADA => '#6C757D',      // Gris
        };
    }

    /**
     * Obtener ícono para UI
     */
    public function icon(): string
    {
        return match ($this) {
            self::PENDIENTE => 'hourglass',
            self::ASIGNADA => 'assignment',
            self::EN_RUTA => 'directions_car',
            self::ENTREGADA => 'check_circle',
            self::NO_ENTREGADA => 'error',
            self::REPROGRAMADA => 'schedule',
            self::CANCELADA => 'cancel',
        };
    }

    /**
     * Verificar si es un estado final (no se puede cambiar después)
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::ENTREGADA, self::CANCELADA]);
    }

    /**
     * Verificar si la entrega fue completada exitosamente
     */
    public function isDelivered(): bool
    {
        return $this === self::ENTREGADA;
    }

    /**
     * Verificar si la entrega está en progreso
     */
    public function isInProgress(): bool
    {
        return in_array($this, [self::ASIGNADA, self::EN_RUTA]);
    }

    /**
     * Verificar si está pendiente de acción
     */
    public function isPending(): bool
    {
        return in_array($this, [self::PENDIENTE, self::ASIGNADA, self::REPROGRAMADA]);
    }

    /**
     * Obtener transiciones válidas desde este estado
     */
    public function validTransitions(): array
    {
        return match ($this) {
            self::PENDIENTE => [self::ASIGNADA, self::CANCELADA],
            self::ASIGNADA => [self::EN_RUTA, self::CANCELADA],
            self::EN_RUTA => [self::ENTREGADA, self::NO_ENTREGADA, self::REPROGRAMADA],
            self::ENTREGADA => [],
            self::NO_ENTREGADA => [self::REPROGRAMADA, self::CANCELADA],
            self::REPROGRAMADA => [self::ASIGNADA, self::CANCELADA],
            self::CANCELADA => [],
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

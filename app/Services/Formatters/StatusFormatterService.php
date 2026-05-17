<?php

namespace App\Services\Formatters;

use App\Enums\DocumentStatus;
use App\Enums\EntregaStatus;

/**
 * StatusFormatterService - ÚNICA FUENTE DE VERDAD para formateo de estados
 *
 * Consolida todos los métodos de formato dispersos en controladores, exports, y views.
 * Proporciona:
 * - Descripciones legibles
 * - Colores para UI
 * - Iconos
 * - Formateo de tiempo
 * - Descripciones de roles
 */
class StatusFormatterService
{
    // ══════════════════════════════════════════════════════════
    // DOCUMENT STATUS (Ventas, Proformas, etc.)
    // ══════════════════════════════════════════════════════════

    /**
     * Obtener descripción legible de estado de documento
     */
    public function getDocumentStatusDescription(string|DocumentStatus $estado): string
    {
        if ($estado instanceof DocumentStatus) {
            return $estado->label();
        }

        // Fallback si no es enum
        $estado = strtolower($estado);
        return match ($estado) {
            'pendiente' => 'Pendiente de Aprobación',
            'aprobada' => 'Aprobada',
            'rechazada' => 'Rechazada',
            'cancelada' => 'Cancelada',
            'completa' => 'Completa',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener color para estado de documento
     */
    public function getDocumentStatusColor(string|DocumentStatus $estado): string
    {
        if ($estado instanceof DocumentStatus) {
            return $estado->color();
        }

        $estado = strtolower($estado);
        return match ($estado) {
            'pendiente' => '#FFC107',
            'aprobada' => '#28A745',
            'rechazada' => '#DC3545',
            'cancelada' => '#6C757D',
            'completa' => '#17A2B8',
            default => '#6C757D',
        };
    }

    /**
     * Obtener ícono para estado de documento
     */
    public function getDocumentStatusIcon(string|DocumentStatus $estado): string
    {
        if ($estado instanceof DocumentStatus) {
            return $estado->icon();
        }

        $estado = strtolower($estado);
        return match ($estado) {
            'pendiente' => 'clock',
            'aprobada' => 'check-circle',
            'rechazada' => 'times-circle',
            'cancelada' => 'ban',
            'completa' => 'check-double',
            default => 'question-circle',
        };
    }

    // ══════════════════════════════════════════════════════════
    // ENTREGA STATUS (Entregas, Envíos, Rutas)
    // ══════════════════════════════════════════════════════════

    /**
     * Obtener descripción legible de estado de entrega
     */
    public function getEntregaStatusDescription(string|EntregaStatus $estado): string
    {
        if ($estado instanceof EntregaStatus) {
            return $estado->label();
        }

        $estado = strtolower($estado);
        return match ($estado) {
            'pendiente' => 'Pendiente',
            'asignada' => 'Asignada a Ruta',
            'en_ruta' => 'En Ruta',
            'entregada' => 'Entregada',
            'no_entregada' => 'No Entregada',
            'reprogramada' => 'Reprogramada',
            'cancelada' => 'Cancelada',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener color para estado de entrega
     */
    public function getEntregaStatusColor(string|EntregaStatus $estado): string
    {
        if ($estado instanceof EntregaStatus) {
            return $estado->color();
        }

        $estado = strtolower($estado);
        return match ($estado) {
            'pendiente' => '#FFC107',
            'asignada' => '#0275D8',
            'en_ruta' => '#5CB85C',
            'entregada' => '#28A745',
            'no_entregada' => '#DC3545',
            'reprogramada' => '#FF9800',
            'cancelada' => '#6C757D',
            default => '#6C757D',
        };
    }

    /**
     * Obtener ícono para estado de entrega
     */
    public function getEntregaStatusIcon(string|EntregaStatus $estado): string
    {
        if ($estado instanceof EntregaStatus) {
            return $estado->icon();
        }

        $estado = strtolower($estado);
        return match ($estado) {
            'pendiente' => 'hourglass',
            'asignada' => 'assignment',
            'en_ruta' => 'directions_car',
            'entregada' => 'check_circle',
            'no_entregada' => 'error',
            'reprogramada' => 'schedule',
            'cancelada' => 'cancel',
            default => 'help',
        };
    }

    // ══════════════════════════════════════════════════════════
    // FORMATEO DE TIEMPO
    // ══════════════════════════════════════════════════════════

    /**
     * Formatear minutos a formato legible (ej: 2h 30m)
     */
    public function formatTime(int $minutes): string
    {
        if ($minutes < 0) {
            return '0m';
        }

        if ($minutes == 0) {
            return '0m';
        }

        $hours = intdiv($minutes, 60);
        $mins = $minutes % 60;

        if ($hours === 0) {
            return "{$mins}m";
        }

        if ($mins === 0) {
            return "{$hours}h";
        }

        return "{$hours}h {$mins}m";
    }

    /**
     * Formatear segundos a formato legible
     */
    public function formatSeconds(int $seconds): string
    {
        $minutes = intdiv($seconds, 60);
        return $this->formatTime($minutes);
    }

    // ══════════════════════════════════════════════════════════
    // ROLES Y PERMISOS
    // ══════════════════════════════════════════════════════════

    /**
     * Obtener descripción legible de rol
     */
    public function getRoleDescription(string $role): string
    {
        $role = strtolower(trim($role));

        return match ($role) {
            'super_admin' => 'Administrador del Sistema',
            'admin' => 'Administrador',
            'manager' => 'Gerente',
            'empleado' => 'Empleado',
            'cliente' => 'Cliente',
            'vendedor' => 'Vendedor',
            'cajero' => 'Cajero',
            'chofer' => 'Chofer',
            'comprador' => 'Comprador',
            'preventista' => 'Preventista',
            'logistica' => 'Logística',
            'gestor_almacen' => 'Gestor de Almacén',
            'contabilidad' => 'Contabilidad',
            default => $role,
        };
    }

    /**
     * Obtener color para rol
     */
    public function getRoleColor(string $role): string
    {
        $role = strtolower(trim($role));

        return match ($role) {
            'super_admin' => '#DC3545',
            'admin' => '#FFC107',
            'manager' => '#007BFF',
            'empleado' => '#28A745',
            'cliente' => '#6C757D',
            'vendedor' => '#17A2B8',
            'cajero' => '#6F42C1',
            'chofer' => '#E83E8C',
            'comprador' => '#FD7E14',
            'preventista' => '#20C997',
            'logistica' => '#FF6B6B',
            'gestor_almacen' => '#4ECDC4',
            'contabilidad' => '#95E1D3',
            default => '#6C757D',
        };
    }

    // ══════════════════════════════════════════════════════════
    // FORMATEO DE CANTIDADES Y MONEDA
    // ══════════════════════════════════════════════════════════

    /**
     * Formatear cantidad con separadores de miles
     */
    public function formatQuantity(int|float $cantidad, int $decimales = 0): string
    {
        return number_format($cantidad, $decimales, ',', '.');
    }

    /**
     * Formatear moneda boliviana
     */
    public function formatCurrency(int|float $monto, bool $conSimbolo = true): string
    {
        $formateado = number_format($monto, 2, ',', '.');

        if ($conSimbolo) {
            return "Bs. {$formateado}";
        }

        return $formateado;
    }

    /**
     * Formatear porcentaje
     */
    public function formatPercentage(int|float $valor, int $decimales = 2): string
    {
        return number_format($valor, $decimales, ',', '.') . '%';
    }

    // ══════════════════════════════════════════════════════════
    // FORMATEO DE BOOLEANOS
    // ══════════════════════════════════════════════════════════

    /**
     * Formatear booleano a texto legible
     */
    public function formatBoolean(bool $valor, string $textoTrue = 'Sí', string $textoFalse = 'No'): string
    {
        return $valor ? $textoTrue : $textoFalse;
    }

    /**
     * Obtener ícono para booleano
     */
    public function getBooleanIcon(bool $valor): string
    {
        return $valor ? 'check-circle' : 'times-circle';
    }

    /**
     * Obtener color para booleano
     */
    public function getBooleanColor(bool $valor): string
    {
        return $valor ? '#28A745' : '#DC3545';
    }
}

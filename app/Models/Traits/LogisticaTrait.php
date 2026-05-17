<?php
namespace App\Models\Traits;

use App\Models\Entrega;
use App\Models\TransferenciaInventario;
use App\Models\Venta;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * Trait para empleados con rol de Logística
 */
trait LogisticaTrait
{
    /**
     * Verifica si el empleado pertenece al área de logística
     */
    public function esLogistica(): bool
    {
        return $this->user && $this->user->hasRole('Logística');
    }

    /**
     * Entregas gestionadas por este empleado de logística
     */
    public function entregasGestionadas(): HasMany
    {
        return $this->hasMany(Entrega::class, 'chofer_id');
    }

    /**
     * Transferencias de inventario supervisadas
     */
    public function transferenciasInventarioSupervisadas(): HasMany
    {
        return $this->hasMany(TransferenciaInventario::class, 'supervisado_por');
    }

    /**
     * Obtiene las entregas pendientes asignadas
     */
    public function entregasPendientes(): Collection
    {
        return $this->entregasGestionadas()
            ->whereIn('estado', ['ASIGNADA', 'EN_CAMINO'])
            ->with(['ventas.cliente', 'proforma', 'proforma.cliente'])
            ->get();
    }

    /**
     * Obtiene las ventas pendientes de asignación para entrega
     */
    public function ventasPendientesAsignacion(): Collection
    {
        if (! $this->esLogistica()) {
            return collect();
        }

        return Venta::whereDoesntHave('entregas')
            ->where('requiere_envio', true)
            ->with(['cliente'])
            ->get();
    }

    /**
     * Verifica si hay alguna alerta de retraso en entregas
     */
    public function tieneAlertasRetraso(): bool
    {
        return $this->entregasGestionadas()
            ->whereIn('estado', ['ASIGNADA', 'EN_CAMINO'])
            ->whereDate('fecha_entrega', '<', now())
            ->exists();
    }

    /**
     * Obtiene las entregas con alerta de retraso
     */
    public function entregasConRetraso(): Collection
    {
        return $this->entregasGestionadas()
            ->whereIn('estado', ['ASIGNADA', 'EN_CAMINO'])
            ->whereDate('fecha_entrega', '<', now())
            ->with(['ventas.cliente', 'proforma', 'proforma.cliente'])
            ->get();
    }
}

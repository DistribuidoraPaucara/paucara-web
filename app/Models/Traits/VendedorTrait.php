<?php
namespace App\Models\Traits;

use App\Models\Cliente;
use App\Models\Proforma;
use App\Models\Venta;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * Trait para empleados con rol de Vendedor
 */
trait VendedorTrait
{
    /**
     * Verifica si el empleado es un vendedor
     */
    public function esVendedor(): bool
    {
        return $this->user && $this->user->hasRole('Vendedor');
    }

    /**
     * Ventas realizadas por este vendedor
     */
    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class, 'vendedor_id');
    }

    /**
     * proformas creadas por este vendedor
     */
    public function proformas(): HasMany
    {
        return $this->hasMany(Proforma::class, 'vendedor_id');
    }

    /**
     * Clientes asociados a este vendedor
     */
    public function clientesAsignados(): HasMany
    {
        return $this->hasMany(Cliente::class, 'vendedor_id');
    }

    /**
     * Calcula el total de ventas en un período específico
     *
     * @param string $fechaInicio Formato Y-m-d
     * @param string $fechaFin Formato Y-m-d
     * @return float
     */
    public function totalVentasPeriodo(string $fechaInicio, string $fechaFin): float
    {
        return $this->ventas()
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->sum('total');
    }

    /**
     * Obtiene las ventas pendientes de entrega
     */
    public function ventasPendientes(): Collection
    {
        return $this->ventas()
            ->whereHas('estadoPedido', function ($query) {
                $query->whereIn('nombre', ['En Proceso', 'Confirmado', 'En Preparación']);
            })
            ->get();
    }

    /**
     * Calcula comisiones por ventas en un período
     *
     * @param string $fechaInicio Formato Y-m-d
     * @param string $fechaFin Formato Y-m-d
     * @param float $porcentajeComision Porcentaje de comisión (ejemplo: 0.05 para 5%)
     * @return float
     */
    public function calcularComisiones(string $fechaInicio, string $fechaFin, float $porcentajeComision = 0.05): float
    {
        $ventasPeriodo = $this->ventas()
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->where('estado', 'Completado')
            ->sum('total');

        return $ventasPeriodo * $porcentajeComision;
    }
}

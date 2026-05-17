<?php
namespace App\Models\Traits;

use App\Models\AperturaCaja;
use App\Models\Caja;
use App\Models\CierreCaja;
use App\Models\MovimientoCaja;
use App\Models\Pago;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Trait para empleados con rol de Cajero
 */
trait CajeroTrait
{
    /**
     * Verifica si el empleado es un cajero
     */
    public function esCajero(): bool
    {
        return $this->user && $this->user->hasRole('Cajero');
    }

    /**
     * Cajas asignadas a este cajero
     */
    public function cajasAsignadas(): BelongsToMany
    {
        return $this->belongsToMany(Caja::class, 'empleado_caja', 'empleado_id', 'caja_id')
            ->withTimestamps();
    }

    /**
     * Aperturas de caja realizadas por este cajero
     */
    public function aperturasCaja(): HasMany
    {
        return $this->hasMany(AperturaCaja::class, 'user_id', 'user_id');
    }

    /**
     * Cierres de caja realizados por este cajero
     */
    public function cierresCaja(): HasMany
    {
        return $this->hasMany(CierreCaja::class, 'user_id', 'user_id');
    }

    /**
     * Movimientos de caja registrados por este cajero
     */
    public function movimientosCaja(): HasMany
    {
        return $this->hasMany(MovimientoCaja::class, 'user_id', 'user_id');
    }

    /**
     * Pagos recibidos por este cajero
     */
    public function pagosRecibidos(): HasMany
    {
        return $this->hasMany(Pago::class, 'recibido_por');
    }

    /**
     * Verifica si el cajero tiene una caja actualmente abierta
     */
    public function tieneCajaAbierta(): bool
    {
        return $this->aperturasCaja()
            ->whereDoesntHave('cierre')
            ->exists();
    }

    /**
     * Obtiene la caja actualmente abierta por el cajero
     */
    public function cajaAbierta()
    {
        $apertura = $this->aperturasCaja()
            ->whereDoesntHave('cierre')
            ->latest()
            ->first();

        return $apertura ? $apertura->caja : null;
    }

    /**
     * ✅ NUEVA VALIDACIÓN: Verifica si tiene caja abierta O consolidada del día anterior
     *
     * Permite la conversión de proforma si:
     * 1. Hay una apertura sin cierre (caja abierta HOY), O
     * 2. Hay un cierre CONSOLIDADA del día anterior
     *
     * @return bool
     */
    public function tieneCajaAbiertaOConsolidadaDelDia(): bool
    {
        // ✅ Opción 1: Caja abierta hoy (apertura sin cierre)
        $cajaAbiertaHoy = $this->aperturasCaja()
            ->whereDoesntHave('cierre')
            ->exists();

        if ($cajaAbiertaHoy) {
            return true;
        }

        // ✅ Opción 2: Cierre consolidado del día anterior o hoy
        // Buscamos un CierreCaja con estado CONSOLIDADA de hoy o ayer
        $cierreConsolidado = $this->cierresCaja()
            ->whereHas('estadoCierre', function ($q) {
                $q->where('codigo', 'CONSOLIDADA');
            })
            ->whereDate('fecha', '>=', now()->subDay())
            ->whereDate('fecha', '<=', now())
            ->exists();

        return $cierreConsolidado;
    }

    /**
     * Obtiene detalles sobre el estado de la caja para mensajes de error
     *
     * @return array
     */
    public function obtenerEstadoCaja(): array
    {
        // Caja abierta
        $aperturaAbierta = $this->aperturasCaja()
            ->whereDoesntHave('cierre')
            ->latest()
            ->first();

        if ($aperturaAbierta) {
            return [
                'estado' => 'ABIERTA',
                'apertura_id' => $aperturaAbierta->id,
                'fecha' => $aperturaAbierta->fecha_apertura,
                'caja_id' => $aperturaAbierta->caja_id,
            ];
        }

        // Cierre consolidado del día anterior/hoy
        $cierreConsolidado = $this->cierresCaja()
            ->whereHas('estadoCierre', function ($q) {
                $q->where('codigo', 'CONSOLIDADA');
            })
            ->whereDate('fecha', '>=', now()->subDay())
            ->whereDate('fecha', '<=', now())
            ->latest('fecha')
            ->first();

        if ($cierreConsolidado) {
            return [
                'estado' => 'CONSOLIDADA_ANTERIOR',
                'cierre_id' => $cierreConsolidado->id,
                'fecha' => $cierreConsolidado->fecha,
                'caja_id' => $cierreConsolidado->caja_id,
            ];
        }

        // Sin caja disponible
        return [
            'estado' => 'SIN_CAJA',
            'ultimo_cierre' => $this->cierresCaja()->latest('fecha')->first()?->fecha,
        ];
    }

    /**
     * Calcula el total de efectivo que debe tener en caja
     */
    public function calcularTotalCajaActual(): float
    {
        $apertura = $this->aperturasCaja()
            ->whereDoesntHave('cierreCaja')
            ->latest()
            ->first();

        if (! $apertura) {
            return 0;
        }

        $ingresos = $this->movimientosCaja()
            ->where('apertura_caja_id', $apertura->id)
            ->where('tipo', 'ingreso')
            ->sum('monto');

        $egresos = $this->movimientosCaja()
            ->where('apertura_caja_id', $apertura->id)
            ->where('tipo', 'egreso')
            ->sum('monto');

        return $apertura->monto_inicial + $ingresos - $egresos;
    }

    /**
     * Verifica si puede operar una caja específica
     */
    public function puedeOperarCaja(int $cajaId): bool
    {
        return $this->esCajero() &&
        $this->cajasAsignadas()->where('caja_id', $cajaId)->exists();
    }
}

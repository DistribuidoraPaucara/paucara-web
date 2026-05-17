<?php

namespace App\Services\Venta;

use App\Models\AsientoContable;
use App\Models\DetalleAsientoContable;
use App\Models\Venta;
use App\Services\Traits\LogsOperations;
use App\Services\Traits\ManagesTransactions;
use Illuminate\Support\Facades\Auth;

/**
 * ContabilidadService - Registros contables de operaciones
 *
 * Responsable de crear asientos contables para:
 * - Ventas
 * - Devoluciones
 * - Ajustes
 *
 * NOTA: No recibe transacción porque el caller ya está en una
 */
class ContabilidadService
{
    use ManagesTransactions, LogsOperations;

    /**
     * Crear asiento contable para una venta
     *
     * DEBE ser llamado DENTRO de una transacción
     *
     * Asiento típico de venta:
     * DEBE: Cuentas por Cobrar
     * HABER: Ingresos por Venta
     */
    public function crearAsientoVenta(Venta $venta): AsientoContable
    {
        \Log::info('🔄 [ContabilidadService::crearAsientoVenta] Iniciando creación de asiento', [
            'venta_id' => $venta->id,
            'venta_total' => $venta->total,
            'timestamp' => now()->toIso8601String(),
        ]);

        // Obtener cuentas contables
        \Log::debug('🔄 [ContabilidadService::crearAsientoVenta] Buscando CuentaContable con código 1205 (Cuentas por Cobrar)');

        try {
            $cuentaPorCobrar = \App\Models\CuentaContable::where('codigo', '1205')->firstOrFail();
            \Log::info('✅ [ContabilidadService::crearAsientoVenta] CuentaContable 1205 encontrada', [
                'cuenta_id' => $cuentaPorCobrar->id,
                'codigo' => $cuentaPorCobrar->codigo,
                'nombre' => $cuentaPorCobrar->nombre ?? 'N/A',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('❌ [ContabilidadService::crearAsientoVenta] CuentaContable 1205 NO ENCONTRADA', [
                'codigo_buscado' => '1205',
                'error' => $e->getMessage(),
                'cuentas_disponibles' => \App\Models\CuentaContable::pluck('codigo')->toArray(),
            ]);
            throw $e;
        }

        \Log::debug('🔄 [ContabilidadService::crearAsientoVenta] Buscando CuentaContable con código 4105 (Ingresos por Venta)');

        try {
            $ingresoVenta = \App\Models\CuentaContable::where('codigo', '4105')->firstOrFail();
            \Log::info('✅ [ContabilidadService::crearAsientoVenta] CuentaContable 4105 encontrada', [
                'cuenta_id' => $ingresoVenta->id,
                'codigo' => $ingresoVenta->codigo,
                'nombre' => $ingresoVenta->nombre ?? 'N/A',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('❌ [ContabilidadService::crearAsientoVenta] CuentaContable 4105 NO ENCONTRADA', [
                'codigo_buscado' => '4105',
                'error' => $e->getMessage(),
                'cuentas_disponibles' => \App\Models\CuentaContable::pluck('codigo')->toArray(),
            ]);
            throw $e;
        }

        // Crear asiento
        \Log::debug('📝 [ContabilidadService::crearAsientoVenta] Creando registro de AsientoContable');

        $asiento = AsientoContable::create([
            'numero' => $this->generarNumeroAsiento(),
            'fecha' => now(),
            'descripcion' => "Venta #{$venta->id}",
            'venta_id' => $venta->id,
            'usuario_id' => Auth::id(),
        ]);

        \Log::info('✅ [ContabilidadService::crearAsientoVenta] AsientoContable creado', [
            'asiento_id' => $asiento->id,
            'asiento_numero' => $asiento->numero,
        ]);

        // Detalle DEBE: Cuentas por Cobrar
        \Log::debug('📝 [ContabilidadService::crearAsientoVenta] Creando detalle DEBE', [
            'cuenta_id' => $cuentaPorCobrar->id,
            'monto' => $venta->total,
        ]);

        DetalleAsientoContable::create([
            'asiento_contable_id' => $asiento->id,
            'cuenta_contable_id' => $cuentaPorCobrar->id,
            'tipo' => 'DEBE',
            'monto' => $venta->total,
        ]);

        \Log::debug('✅ [ContabilidadService::crearAsientoVenta] Detalle DEBE creado');

        // Detalle HABER: Ingresos por Venta
        \Log::debug('📝 [ContabilidadService::crearAsientoVenta] Creando detalle HABER', [
            'cuenta_id' => $ingresoVenta->id,
            'monto' => $venta->total,
        ]);

        DetalleAsientoContable::create([
            'asiento_contable_id' => $asiento->id,
            'cuenta_contable_id' => $ingresoVenta->id,
            'tipo' => 'HABER',
            'monto' => $venta->total,
        ]);

        \Log::debug('✅ [ContabilidadService::crearAsientoVenta] Detalle HABER creado');

        $this->logSuccess('Asiento contable creado para venta', [
            'asiento_id' => $asiento->id,
            'venta_id' => $venta->id,
        ]);

        \Log::info('✅ [ContabilidadService::crearAsientoVenta] Asiento contable completado exitosamente', [
            'asiento_id' => $asiento->id,
            'venta_id' => $venta->id,
            'timestamp' => now()->toIso8601String(),
        ]);

        return $asiento;
    }

    /**
     * Generar número secuencial de asiento
     */
    private function generarNumeroAsiento(): string
    {
        $ultimo = AsientoContable::max('numero');
        $numero = (int) ($ultimo ?? 0) + 1;

        return str_pad($numero, 6, '0', STR_PAD_LEFT);
    }
}

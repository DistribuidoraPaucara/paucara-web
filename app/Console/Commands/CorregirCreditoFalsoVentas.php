<?php

namespace App\Console\Commands;

use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Models\Venta;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Corrige ventas registradas como CRÉDITO por error (politica_pago=CREDITO con un
 * tipo de pago que no es crédito). Esas ventas no generaron CxC pero sí un
 * movimiento de caja CREDITO que distorsiona el cierre.
 *
 * Por cada venta afectada (sin CxC):
 *  - politica_pago CREDITO → ANTICIPADO_100 (o CONTRA_ENTREGA si requiere envío)
 *  - movimiento CREDITO: se elimina si ya existe un movimiento VENTA (duplicado);
 *    si no existe, se convierte en VENTA.
 *
 * Uso:
 *   php artisan ventas:corregir-credito-falso --venta-ids=6334 --dry-run
 *   php artisan ventas:corregir-credito-falso --venta-ids=6334
 *   php artisan ventas:corregir-credito-falso            (busca todas las afectadas)
 */
class CorregirCreditoFalsoVentas extends Command
{
    protected $signature = 'ventas:corregir-credito-falso
                            {--venta-ids= : IDs de venta separados por coma}
                            {--dry-run : Solo muestra lo que haría, sin modificar}
                            {--force : No pedir confirmación}';

    protected $description = 'Corrige ventas marcadas como CRÉDITO por error (sin CxC) y su movimiento de caja CREDITO';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $opCredito = TipoOperacionCaja::where('codigo', 'CREDITO')->first();
        $opVenta = TipoOperacionCaja::where('codigo', 'VENTA')->first();

        if (! $opCredito || ! $opVenta) {
            $this->error('No existen los tipos de operación CREDITO y/o VENTA en tipo_operacion_caja.');
            return self::FAILURE;
        }

        $ventas = $this->buscarVentas($opCredito->id);

        if ($ventas->isEmpty()) {
            $this->info('✅ No se encontraron ventas afectadas.');
            return self::SUCCESS;
        }

        // ── Plan ─────────────────────────────────────────────
        $plan = [];
        $filas = [];

        foreach ($ventas as $venta) {
            $tipoPago = $venta->tipoPago;
            $esTipoCredito = $tipoPago && ($tipoPago->es_credito || strtoupper((string) $tipoPago->codigo) === 'CREDITO');

            if ($esTipoCredito) {
                $this->line("⏭️  Venta {$venta->id}: el tipo de pago SÍ es crédito, se omite.");
                continue;
            }
            if ($venta->cuentaPorCobrar()->exists()) {
                $this->line("⏭️  Venta {$venta->id}: tiene cuenta por cobrar, se omite (revisar manualmente).");
                continue;
            }

            $movsCredito = MovimientoCaja::where('venta_id', $venta->id)
                ->where('tipo_operacion_id', $opCredito->id)->get();
            $tieneVenta = MovimientoCaja::where('venta_id', $venta->id)
                ->where('tipo_operacion_id', $opVenta->id)->exists();

            $nuevaPolitica = $venta->politica_pago === 'CREDITO'
                ? ($venta->requiere_envio ? 'CONTRA_ENTREGA' : 'ANTICIPADO_100')
                : null;

            if (! $nuevaPolitica && $movsCredito->isEmpty()) {
                $this->line("⏭️  Venta {$venta->id}: nada que corregir.");
                continue;
            }

            $accionMov = $movsCredito->isEmpty()
                ? '-'
                : ($tieneVenta
                    ? 'ELIMINAR ' . $movsCredito->pluck('id')->implode(',') . ' (duplicado)'
                    : 'CONVERTIR ' . $movsCredito->pluck('id')->implode(',') . ' a VENTA');

            $plan[] = compact('venta', 'movsCredito', 'tieneVenta', 'nuevaPolitica');
            $filas[] = [
                $venta->id,
                $venta->numero,
                $tipoPago?->codigo ?? '-',
                $venta->politica_pago . ($nuevaPolitica ? " → {$nuevaPolitica}" : ''),
                $venta->total,
                $accionMov,
            ];
        }

        if (empty($plan)) {
            $this->info('✅ No hay correcciones pendientes.');
            return self::SUCCESS;
        }

        $this->table(['Venta', 'Número', 'Tipo pago', 'Política', 'Total', 'Movimiento CREDITO'], $filas);

        if ($dryRun) {
            $this->warn('🔍 Dry-run: no se modificó nada.');
            return self::SUCCESS;
        }

        if (! $this->option('force') && ! $this->confirm('¿Aplicar estas correcciones?')) {
            $this->warn('Cancelado.');
            return self::SUCCESS;
        }

        // ── Aplicar ──────────────────────────────────────────
        $aperturasAfectadas = [];

        foreach ($plan as $p) {
            /** @var Venta $venta */
            $venta = $p['venta'];

            DB::transaction(function () use ($p, $venta, $opVenta, &$aperturasAfectadas) {
                if ($p['nuevaPolitica']) {
                    $venta->update(['politica_pago' => $p['nuevaPolitica']]);
                }

                foreach ($p['movsCredito'] as $mov) {
                    // Respaldo en log antes de modificar
                    Log::warning('🛠️ [ventas:corregir-credito-falso] Movimiento CREDITO corregido', [
                        'accion' => $p['tieneVenta'] ? 'eliminado' : 'convertido_a_VENTA',
                        'movimiento' => $mov->toArray(),
                    ]);

                    if ($mov->apertura_caja_id) {
                        $aperturasAfectadas[$mov->apertura_caja_id] = true;
                    }

                    if ($p['tieneVenta']) {
                        $mov->delete();
                    } else {
                        $mov->update([
                            'tipo_operacion_id' => $opVenta->id,
                            'observaciones' => trim(($mov->observaciones ?? '') . ' | Corregido: era CREDITO por error'),
                        ]);
                    }
                }
            });

            $this->info("✅ Venta {$venta->id} corregida.");
        }

        // Avisar si alguna apertura ya tiene cierre registrado
        foreach (array_keys($aperturasAfectadas) as $aperturaId) {
            $apertura = AperturaCaja::with('cierre')->find($aperturaId);
            if ($apertura?->cierre) {
                $this->warn("⚠️  La apertura {$aperturaId} ya tiene cierre (id {$apertura->cierre->id}); sus totales guardados deben recalcularse.");
            }
        }

        return self::SUCCESS;
    }

    /**
     * Ventas candidatas: las indicadas por --venta-ids, o todas las que tengan
     * politica_pago=CREDITO o movimiento CREDITO con un tipo de pago no-crédito.
     */
    private function buscarVentas(int $opCreditoId)
    {
        $query = Venta::with('tipoPago');

        if ($ids = $this->option('venta-ids')) {
            return $query->whereIn('id', array_map('intval', explode(',', $ids)))->get();
        }

        return $query
            ->where(function ($q) use ($opCreditoId) {
                $q->where('politica_pago', 'CREDITO')
                  ->orWhereIn('id', MovimientoCaja::where('tipo_operacion_id', $opCreditoId)->select('venta_id'));
            })
            ->whereHas('tipoPago', function ($q) {
                $q->where(function ($q2) {
                    $q2->where('es_credito', false)->orWhereNull('es_credito');
                })->whereRaw('UPPER(codigo) <> ?', ['CREDITO']);
            })
            ->get();
    }
}

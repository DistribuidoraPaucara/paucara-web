<?php

namespace App\Observers;

use App\Models\Entrega;
use App\Models\EstadoDocumento;
use App\Models\Venta;
use Illuminate\Support\Facades\Log;

/**
 * Mantiene el peso de la entrega cuando una venta deja de contar, o vuelve a contar.
 */
class VentaPesoEntregaObserver
{
    public function updated(Venta $venta): void
    {
        if (! $venta->entrega_id || ! $venta->wasChanged('estado_documento_id')) {
            return;
        }

        try {
            $idsSinEfecto = EstadoDocumento::whereIn('codigo', EstadoDocumento::CODIGOS_SIN_EFECTO)
                ->pluck('id')
                ->all();

            $anteriorSinEfecto = in_array($venta->getOriginal('estado_documento_id'), $idsSinEfecto);
            $nuevoSinEfecto = in_array($venta->estado_documento_id, $idsSinEfecto);

            if ($anteriorSinEfecto === $nuevoSinEfecto) {
                return;
            }

            $entrega = Entrega::find($venta->entrega_id);

            if ($entrega && ! $entrega->recalcularPeso()) {
                Log::warning('Peso de entrega sin recalcular: hay ventas vigentes sin peso', [
                    'entrega_id' => $venta->entrega_id,
                    'venta_id'   => $venta->id,
                ]);
            }
        } catch (\Exception $e) {
            // Un fallo aquí no debe impedir la anulación de la venta.
            Log::error('Error recalculando el peso de la entrega', [
                'entrega_id' => $venta->entrega_id,
                'venta_id'   => $venta->id,
                'error'      => $e->getMessage(),
            ]);
        }
    }
}

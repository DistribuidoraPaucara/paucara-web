<?php

namespace App\Observers;

use App\Models\CodigoBarra;
use App\Models\HistorialCodigoBarra;
use Illuminate\Support\Facades\Auth;

class CodigoBarraObserver
{
    /**
     * Handle the CodigoBarra "created" event.
     *
     * Registrar en historial cuando se crea un código de barra
     */
    public function created(CodigoBarra $codigoBarra): void
    {
        HistorialCodigoBarra::create([
            'codigo_barra_id' => $codigoBarra->id,
            'producto_id' => $codigoBarra->producto_id,
            'tipo_evento' => 'CREADO',
            'codigo_nuevo' => $codigoBarra->codigo,
            'es_principal_nuevo' => $codigoBarra->es_principal,
            'activo_nuevo' => $codigoBarra->activo,
            'valores_nuevos' => $codigoBarra->toArray(),
            'razon' => 'Creación de código de barra',
            'usuario_id' => Auth::id(),
            'usuario_nombre' => Auth::user()?->name ?? 'sistema',
        ]);
    }

    /**
     * Handle the CodigoBarra "updating" event.
     *
     * Registrar cambios en el historial
     */
    public function updating(CodigoBarra $codigoBarra): void
    {
        $cambios = [];
        $codigoAnterior = $codigoBarra->getOriginal('codigo');
        $codigoNuevo = $codigoBarra->codigo;
        $esPrincipalAnterior = $codigoBarra->getOriginal('es_principal');
        $esPrincipalNuevo = $codigoBarra->es_principal;
        $activoAnterior = $codigoBarra->getOriginal('activo');
        $activoNuevo = $codigoBarra->activo;

        // Detectar tipo de evento según los cambios
        $tipoEvento = 'ACTUALIZADO';

        if ($codigoBarra->isDirty('es_principal')) {
            if ($esPrincipalNuevo && !$esPrincipalAnterior) {
                $tipoEvento = 'MARCADO_PRINCIPAL';
            } elseif (!$esPrincipalNuevo && $esPrincipalAnterior) {
                $tipoEvento = 'DESMARCADO_PRINCIPAL';
            }
        }

        if ($codigoBarra->isDirty('activo')) {
            if (!$activoNuevo && $activoAnterior) {
                $tipoEvento = 'INACTIVADO';
            } elseif ($activoNuevo && !$activoAnterior) {
                $tipoEvento = 'REACTIVADO';
            }
        }

        // Solo registrar si hay cambios relevantes
        if ($codigoBarra->isDirty('codigo') ||
            $codigoBarra->isDirty('tipo') ||
            $codigoBarra->isDirty('es_principal') ||
            $codigoBarra->isDirty('activo')) {

            HistorialCodigoBarra::create([
                'codigo_barra_id' => $codigoBarra->id,
                'producto_id' => $codigoBarra->producto_id,
                'tipo_evento' => $tipoEvento,
                'codigo_anterior' => $codigoAnterior,
                'codigo_nuevo' => $codigoNuevo,
                'es_principal_anterior' => $esPrincipalAnterior,
                'es_principal_nuevo' => $esPrincipalNuevo,
                'activo_anterior' => $activoAnterior,
                'activo_nuevo' => $activoNuevo,
                'valores_anteriores' => [
                    'codigo' => $codigoAnterior,
                    'tipo' => $codigoBarra->getOriginal('tipo'),
                    'es_principal' => $esPrincipalAnterior,
                    'activo' => $activoAnterior,
                ],
                'valores_nuevos' => [
                    'codigo' => $codigoNuevo,
                    'tipo' => $codigoBarra->tipo,
                    'es_principal' => $esPrincipalNuevo,
                    'activo' => $activoNuevo,
                ],
                'razon' => $this->obtenerRazonCambio($codigoBarra),
                'usuario_id' => Auth::id(),
                'usuario_nombre' => Auth::user()?->name ?? 'sistema',
            ]);
        }
    }

    /**
     * Handle the CodigoBarra "deleted" event.
     *
     * Nota: Usamos soft deletes o inactivación, así que este evento
     * generalmente no se dispara. El "deleted" es capturado por updating/inactivar.
     */
    public function deleted(CodigoBarra $codigoBarra): void
    {
        // No necesitamos implementar esto si usamos inactivación en lugar de borrado físico
    }

    /**
     * Handle the CodigoBarra "restored" event.
     */
    public function restored(CodigoBarra $codigoBarra): void
    {
        // Implementar si usamos soft deletes
    }

    /**
     * Obtener la razón del cambio
     */
    private function obtenerRazonCambio(CodigoBarra $codigoBarra): string
    {
        $cambios = [];

        if ($codigoBarra->isDirty('codigo')) {
            $cambios[] = 'código';
        }
        if ($codigoBarra->isDirty('tipo')) {
            $cambios[] = 'tipo';
        }
        if ($codigoBarra->isDirty('es_principal')) {
            $cambios[] = 'estado principal';
        }
        if ($codigoBarra->isDirty('activo')) {
            $cambios[] = 'estado activo';
        }

        return count($cambios) > 0
            ? 'Cambio en: ' . implode(', ', $cambios)
            : 'Actualización de código de barra';
    }
}

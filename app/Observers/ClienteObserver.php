<?php

namespace App\Observers;

use App\Models\Cliente;
use App\Models\ClienteAudit;
use Illuminate\Support\Facades\Auth;

class ClienteObserver
{
    /**
     * ✅ Handle the Cliente "created" event.
     */
    public function created(Cliente $cliente): void
    {
        $this->registrarAuditoria($cliente, 'created', $cliente->toArray(), null);
    }

    /**
     * ✅ Handle the Cliente "updated" event.
     */
    public function updated(Cliente $cliente): void
    {
        $cambios = $cliente->getChanges();

        // Ignorar cambios de auditoría y timestamps
        unset(
            $cambios['updated_at'],
            $cambios['fecha_actualizacion'],
            $cambios['usuario_actualizacion_id']
        );

        // Solo registrar si hay cambios reales
        if (!empty($cambios)) {
            $this->registrarAuditoria($cliente, 'updated', $cambios, null);
        }
    }

    /**
     * ✅ Handle the Cliente "deleting" event (soft delete).
     */
    public function deleting(Cliente $cliente): void
    {
        $this->registrarAuditoria($cliente, 'eliminado', ['id' => $cliente->id], 'Cliente eliminado del sistema');
    }

    /**
     * ✅ Método auxiliar: Registrar auditoría
     */
    private function registrarAuditoria(
        Cliente $cliente,
        string $accion,
        array $cambios,
        ?string $motivo
    ): void {
        try {
            // ✅ Obtener datos del usuario actual
            $usuario = Auth::user();
            $preventista = null;
            $usuarioId = null;

            if ($usuario) {
                // Si es un Preventista (Empleado)
                if ($usuario->hasRole('Preventista') && $usuario->empleado) {
                    $preventista = $usuario->empleado->id;
                } else {
                    // Si es Admin o Super-Admin
                    $usuarioId = $usuario->id;
                }
            }

            // ✅ Crear registro de auditoría
            ClienteAudit::create([
                'cliente_id' => $cliente->id,
                'preventista_id' => $preventista,
                'usuario_id' => $usuarioId,
                'accion' => $accion,
                'cambios' => $cambios,
                'motivo' => $motivo,
                'ip_address' => request()?->ip() ?? '127.0.0.1',
            ]);
        } catch (\Exception $e) {
            // Registrar error pero no detener la operación
            \Log::error("Error registrando auditoría de cliente: {$e->getMessage()}");
        }
    }
}

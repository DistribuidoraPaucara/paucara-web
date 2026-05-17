<?php

namespace App\Observers;

use App\Models\ModuloSidebar;
use App\Models\ModuloAudit;
use Illuminate\Support\Facades\Auth;

class ModuloSidebarObserver
{
    /**
     * Handle the ModuloSidebar "created" event.
     */
    public function created(ModuloSidebar $moduloSidebar): void
    {
        ModuloAudit::create([
            'modulo_id' => $moduloSidebar->id,
            'usuario_id' => Auth::id() ?? 1, // 1 = Sistema (si no hay usuario autenticado)
            'accion' => 'creado',
            'datos_anteriores' => null,
            'datos_nuevos' => $moduloSidebar->toArray(),
        ]);
    }

    /**
     * Handle the ModuloSidebar "updated" event.
     */
    public function updated(ModuloSidebar $moduloSidebar): void
    {
        // Solo registrar si hubo cambios reales
        if (!$moduloSidebar->wasChanged()) {
            return;
        }

        // Obtener los datos anteriores (antes de los cambios)
        $datosAnteriores = [];
        foreach ($moduloSidebar->getChanges() as $campo => $valorNuevo) {
            $datosAnteriores[$campo] = $moduloSidebar->getOriginal($campo);
        }

        ModuloAudit::create([
            'modulo_id' => $moduloSidebar->id,
            'usuario_id' => Auth::id() ?? 1,
            'accion' => 'actualizado',
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos' => $moduloSidebar->getChanges(),
        ]);
    }

    /**
     * Handle the ModuloSidebar "deleting" event.
     * Usar "deleting" en lugar de "deleted" para que el módulo aún exista en la BD
     * cuando registramos la auditoría (evita problemas con foreign keys)
     */
    public function deleting(ModuloSidebar $moduloSidebar): void
    {
        ModuloAudit::create([
            'modulo_id' => $moduloSidebar->id,
            'usuario_id' => Auth::id() ?? 1,
            'accion' => 'eliminado',
            'datos_anteriores' => $moduloSidebar->toArray(),
            'datos_nuevos' => null,
        ]);
    }

    /**
     * Handle the ModuloSidebar "deleted" event.
     * Este método se ejecuta después de la eliminación
     */
    public function deleted(ModuloSidebar $moduloSidebar): void
    {
        // Ya fue registrado en "deleting"
    }

    /**
     * Handle the ModuloSidebar "restored" event.
     */
    public function restored(ModuloSidebar $moduloSidebar): void
    {
        // Si el modelo tiene soft deletes, registrar la restauración como una actualización
        ModuloAudit::create([
            'modulo_id' => $moduloSidebar->id,
            'usuario_id' => Auth::id() ?? 1,
            'accion' => 'actualizado',
            'datos_anteriores' => ['deleted_at' => $moduloSidebar->getOriginal('deleted_at')],
            'datos_nuevos' => ['deleted_at' => null],
        ]);
    }

    /**
     * Handle the ModuloSidebar "force deleted" event.
     */
    public function forceDeleted(ModuloSidebar $moduloSidebar): void
    {
        // Registrar eliminación forzada (si el modelo usa soft deletes)
        ModuloAudit::create([
            'modulo_id' => $moduloSidebar->id,
            'usuario_id' => Auth::id() ?? 1,
            'accion' => 'eliminado',
            'datos_anteriores' => $moduloSidebar->toArray(),
            'datos_nuevos' => null,
        ]);
    }
}

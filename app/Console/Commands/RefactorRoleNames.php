<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RefactorRoleNames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:refactor-role-names
        {--force : Ejecutar sin confirmación}
        {--preview : Solo mostrar cambios sin ejecutar}
        {--rollback : Revertir cambios previos}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refactorizar nombres de roles para seguir patrón "Gestor de X". Implementa cambios en roles, usuarios y permisos.';

    /**
     * Mapeo de cambios: nombreAntiguo => nombreNuevo
     */
    private array $roleChanges = [
        'Inventario' => 'Gestor de Inventario',
        'Logística' => 'Gestor de Logística',
    ];

    /**
     * Para revertir cambios
     */
    private array $rollbackChanges = [
        'Gestor de Inventario' => 'Inventario',
        'Gestor de Logística' => 'Logística',
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('╔════════════════════════════════════════════════╗');
        $this->info('║   REFACTORIZAR NOMBRES DE ROLES               ║');
        $this->info('║   Patrón: "Gestor de X" para gestores        ║');
        $this->info('╚════════════════════════════════════════════════╝');

        // Opción rollback
        if ($this->option('rollback')) {
            return $this->performRollback();
        }

        // Cambios normales
        $changesToApply = $this->roleChanges;

        // Mostrar preview
        $this->showPreview($changesToApply);

        // Opción preview
        if ($this->option('preview')) {
            $this->info('\n✅ Modo preview: cambios NO se aplicaron');
            return 0;
        }

        // Pedir confirmación
        if (!$this->option('force')) {
            if (!$this->confirm('\n¿Ejecutar estos cambios? (esto NO se puede deshacer fácilmente)', false)) {
                $this->warn('❌ Operación cancelada');
                return 1;
            }
        }

        // Ejecutar cambios
        return $this->applyChanges($changesToApply);
    }

    /**
     * Mostrar preview de cambios
     */
    private function showPreview(array $changes): void
    {
        $this->info('\n📋 CAMBIOS A REALIZAR:\n');

        $headers = ['Rol Anterior', 'Rol Nuevo', 'Usuarios Afectados', 'Estado'];
        $rows = [];

        foreach ($changes as $oldName => $newName) {
            $role = Role::where('name', $oldName)->first();

            if (!$role) {
                $rows[] = [$oldName, $newName, 0, '❌ No existe'];
                continue;
            }

            // Contar usuarios con este rol
            $usersCount = DB::table('model_has_roles')
                ->where('role_id', $role->id)
                ->count();

            // Contar permisos asociados
            $permissionsCount = DB::table('role_has_permissions')
                ->where('role_id', $role->id)
                ->count();

            $status = $usersCount > 0 ? "✅ Activo ($usersCount usuarios)" : '⚠️ Sin usuarios';
            $rows[] = [$oldName, $newName, "$usersCount usuarios, $permissionsCount permisos", $status];
        }

        $this->table($headers, $rows);
    }

    /**
     * Aplicar cambios de forma transaccional
     */
    private function applyChanges(array $changes): int
    {
        try {
            DB::beginTransaction();

            $this->info('\n🔄 Ejecutando cambios...\n');

            $changedCount = 0;
            $usersAffected = 0;

            foreach ($changes as $oldName => $newName) {
                $role = Role::where('name', $oldName)->first();

                if (!$role) {
                    $this->warn("  ⚠️  Rol '$oldName' no encontrado, omitiendo...");
                    continue;
                }

                // Verificar que el nuevo nombre no exista
                if (Role::where('name', $newName)->exists()) {
                    $this->error("  ❌ Rol '$newName' ya existe!");
                    DB::rollBack();
                    return 1;
                }

                // Contar usuarios afectados
                $usersWithRole = DB::table('model_has_roles')
                    ->where('role_id', $role->id)
                    ->count();

                // Cambiar nombre del rol
                $role->update(['name' => $newName]);
                $changedCount++;
                $usersAffected += $usersWithRole;

                $this->line("  ✓ Rol '$oldName' → '$newName' (Afecta: $usersWithRole usuarios)");
            }

            // Limpiar caché de Spatie
            app()['cache.store']->forget('spatie.permission.cache');

            DB::commit();

            $this->info("\n✅ CAMBIOS APLICADOS EXITOSAMENTE\n");
            $this->info("Estadísticas:");
            $this->line("  • Roles renombrados: $changedCount");
            $this->line("  • Usuarios afectados: $usersAffected");
            $this->line("  • Caché de permisos: Limpiado ✓");

            return 0;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("\n❌ ERROR AL APLICAR CAMBIOS:");
            $this->error($e->getMessage());
            return 1;
        }
    }

    /**
     * Revertir cambios previos
     */
    private function performRollback(): int
    {
        $this->warn('\n⚠️  MODO ROLLBACK - Esto revertirá los cambios previos\n');

        // Mostrar preview
        $this->showPreview($this->rollbackChanges);

        if (!$this->confirm('\n¿Revertir estos cambios?', false)) {
            $this->warn('❌ Rollback cancelado');
            return 1;
        }

        return $this->applyChanges($this->rollbackChanges);
    }
}

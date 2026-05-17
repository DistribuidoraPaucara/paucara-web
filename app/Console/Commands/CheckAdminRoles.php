<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class CheckAdminRoles extends Command
{
    protected $signature = 'admin:check-roles {email=admin@admin.com}';
    protected $description = 'Verifica los roles asignados a un usuario (por defecto admin@admin.com)';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("❌ Usuario con email '{$email}' no encontrado");
            return 1;
        }

        $this->info("\n╔════════════════════════════════════════════════════╗");
        $this->info("║  INFORMACIÓN DE ROLES DEL USUARIO                 ║");
        $this->info("╚════════════════════════════════════════════════════╝\n");

        $this->line("👤 <fg=blue>Usuario:</> " . $user->name);
        $this->line("📧 <fg=blue>Email:</> " . $user->email);
        $this->line("🆔 <fg=blue>ID:</> " . $user->id);

        // Mostrar roles actuales
        $roles = $user->roles()->pluck('name')->toArray();

        if (empty($roles)) {
            $this->line("\n⚠️  <fg=yellow>Sin roles asignados</>\n");
            return 0;
        }

        $this->line("\n📋 <fg=cyan>Roles Asignados:</>\n");
        foreach ($roles as $index => $role) {
            $this->line("  " . ($index + 1) . ". " . $role);
        }

        // Mostrar métodos disponibles del RoleCheckerTrait
        $this->line("\n🔍 <fg=cyan>Métodos de Verificación Disponibles:</>\n");

        $checks = [
            'isAnyAdminRole()' => $user->isAnyAdminRole(),
            'isSuperAdmin()' => $user->isSuperAdmin(),
            'isAdmin()' => $user->isAdmin(),
            'isManager()' => $user->isManager(),
            'hasAdminAccess()' => $user->hasAdminAccess(),
        ];

        foreach ($checks as $method => $result) {
            $status = $result ? '<fg=green>✓</>' : '<fg=red>✗</>';
            $this->line("  $status " . str_pad($method, 25) . ($result ? 'Verdadero' : 'Falso'));
        }

        // Mostrar información de roles
        $this->line("\n📊 <fg=cyan>Información de Roles:</>\n");
        $this->line("  Roles Label:  " . $user->getRolesLabel());
        $this->line("  All Roles:    " . implode(', ', $user->getAllRoles()));
        $this->line("  Primary Role: " . ($user->getPrimaryRole() ?? 'Ninguno'));

        // Mostrar permisos totales
        $permissions = $user->getAllPermissions();
        $this->line("\n🔐 <fg=cyan>Permisos Totales:</> {$permissions->count()} permisos");

        if ($permissions->count() > 0) {
            $this->line("\n   Primeros 10 permisos:");
            foreach ($permissions->take(10) as $perm) {
                $this->line("   • " . $perm->name);
            }
            if ($permissions->count() > 10) {
                $this->line("   ... y " . ($permissions->count() - 10) . " más");
            }
        }

        $this->info("\n✅ Verificación completada\n");

        return 0;
    }
}

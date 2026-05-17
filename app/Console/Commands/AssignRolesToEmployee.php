<?php

namespace App\Console\Commands;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;

class AssignRolesToEmployee extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:assign-roles-to-employee
        {--user-id= : ID del usuario/empleado}
        {--roles= : Roles a asignar (separados por coma)}
        {--remove= : Roles a remover (separados por coma)}
        {--list : Mostrar empleados disponibles}
        {--show-roles : Mostrar todos los roles disponibles}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asignar o remover roles a empleados de forma interactiva';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Mostrar roles disponibles si se solicita
        if ($this->option('show-roles')) {
            return $this->showAvailableRoles();
        }

        // Mostrar empleados disponibles si se solicita
        if ($this->option('list')) {
            return $this->listEmployees();
        }

        // Obtener el usuario
        $userId = $this->option('user-id');
        if (!$userId) {
            $userId = $this->askForUserId();
        }

        $user = User::find($userId);
        if (!$user) {
            $this->error("❌ Usuario con ID {$userId} no encontrado");
            return 1;
        }

        $empleado = Empleado::where('user_id', $user->id)->first();
        $empleadoInfo = $empleado ? " (Empleado: {$empleado->nombre})" : '';

        $this->info("📋 Usuario: {$user->name} ({$user->email}){$empleadoInfo}");
        $this->info("Roles actuales: " . ($user->getRoleNames()->isEmpty() ? 'Ninguno' : $user->getRoleNames()->implode(', ')));

        // Obtener roles a asignar
        $rolesToAssign = $this->option('roles');
        if (!$rolesToAssign) {
            $rolesToAssign = $this->askForRoles();
        } else {
            $rolesToAssign = array_map('trim', explode(',', $rolesToAssign));
        }

        // Obtener roles a remover
        $rolesToRemove = $this->option('remove');
        if ($rolesToRemove) {
            $rolesToRemove = array_map('trim', explode(',', $rolesToRemove));
        } else {
            $rolesToRemove = [];
        }

        // Validar roles
        $this->validateRoles(array_merge($rolesToAssign, $rolesToRemove));

        // Procesar asignaciones
        if (!empty($rolesToRemove)) {
            $this->info("\n🗑️  Removiendo roles...");
            foreach ($rolesToRemove as $role) {
                $user->removeRole($role);
                $this->line("  ✓ Rol '{$role}' removido");
            }
        }

        if (!empty($rolesToAssign)) {
            $this->info("\n✨ Asignando roles...");
            $user->syncRoles($rolesToAssign);
            foreach ($rolesToAssign as $role) {
                $this->line("  ✓ Rol '{$role}' asignado");
            }
        }

        $this->info("\n✅ Proceso completado!");
        $this->info("Roles finales: " . $user->fresh()->getRoleNames()->implode(', '));

        return 0;
    }

    /**
     * Mostrar todos los roles disponibles
     */
    private function showAvailableRoles()
    {
        $roles = Role::orderBy('name')->get();

        if ($roles->isEmpty()) {
            $this->info('No hay roles definidos en el sistema.');
            return;
        }

        $this->info("\n📌 ROLES DISPONIBLES EN EL SISTEMA:\n");

        $headers = ['ID', 'Nombre', 'Descripción Recomendada'];
        $rows = [];

        $roleDescriptions = [
            'Super Admin' => 'Acceso total al sistema (gestión de admins)',
            'Admin' => 'Casi todos los permisos excepto admin.system',
            'Manager' => 'Gestión operativa completa',
            'Gerente' => 'Reportes y supervisión',
            'Vendedor' => 'Gestión de ventas y proformas',
            'Compras' => 'Gestión completa de compras',
            'Comprador' => 'Crear/editar compras',
            'Gestor de Inventario' => 'Dashboard y ajustes de inventario (REFACTORIZADO)',
            'Gestor de Almacén' => 'Gestión de transferencias y almacén',
            'Gestor de Logística' => 'Gestión de envíos (REFACTORIZADO)',
            'Chofer' => 'Ver envíos y entregas',
            'Cajero' => 'Abrir/cerrar cajas y ventas',
            'Contabilidad' => 'Asientos y reportes contables',
            'Reportes' => 'Acceso a todos los reportes',
            'Gestor de Clientes' => 'Empleados que crean/editan clientes',
            'Empleado' => 'Acceso mínimo (ver su perfil)',
            'Cliente' => 'Usuario final (ver su perfil)',
            // Nombres antiguos (para transición)
            'Inventario' => '[OBSOLETO] → Usar "Gestor de Inventario"',
            'Logística' => '[OBSOLETO] → Usar "Gestor de Logística"',
        ];

        foreach ($roles as $role) {
            $description = $roleDescriptions[$role->name] ?? 'Sin descripción';
            $rows[] = [$role->id, $role->name, $description];
        }

        $this->table($headers, $rows);

        $this->info("\n💡 CASOS DE USO COMUNES:\n");
        $this->line("Vendedor + Cliente:     php artisan app:assign-roles-to-employee --user-id=5 --roles=\"Vendedor,Cliente\"");
        $this->line("Chofer + Gestor:        php artisan app:assign-roles-to-employee --user-id=8 --roles=\"Chofer,Gestor de Clientes\"");
        $this->line("Solo Cliente:           php artisan app:assign-roles-to-employee --user-id=10 --roles=\"Cliente\"");
        $this->line("Admin completo:         php artisan app:assign-roles-to-employee --user-id=2 --roles=\"Admin\"");
    }

    /**
     * Listar empleados disponibles
     */
    private function listEmployees()
    {
        $empleados = Empleado::with('user')
            ->orderBy('nombre')
            ->get();

        if ($empleados->isEmpty()) {
            $this->info('No hay empleados registrados.');
            return;
        }

        $this->info("\n👥 EMPLEADOS DISPONIBLES:\n");

        $headers = ['ID', 'Nombre', 'Email', 'Cargo', 'Roles Actuales'];
        $rows = [];

        foreach ($empleados as $empleado) {
            $roles = $empleado->user?->getRoleNames() ?? [];
            $rolesStr = $roles->isEmpty() ? 'Ninguno' : $roles->implode(', ');
            $rows[] = [
                $empleado->user_id,
                $empleado->nombre,
                $empleado->user?->email ?? '-',
                $empleado->cargo ?? '-',
                $rolesStr,
            ];
        }

        $this->table($headers, $rows);
    }

    /**
     * Preguntar al usuario por el ID del usuario
     */
    private function askForUserId(): int
    {
        $this->listEmployees();

        return (int) $this->ask('\n¿Cuál es el ID del usuario/empleado?');
    }

    /**
     * Preguntar al usuario por los roles a asignar
     */
    private function askForRoles(): array
    {
        $this->showAvailableRoles();

        $rolesInput = $this->ask('\n¿Qué roles deseas asignar? (separados por coma)');

        return array_map('trim', explode(',', $rolesInput));
    }

    /**
     * Validar que los roles existan
     */
    private function validateRoles(array $roles): void
    {
        $existingRoles = Role::pluck('name')->toArray();
        $invalidRoles = array_diff($roles, $existingRoles);

        if (!empty($invalidRoles)) {
            $this->error('❌ Roles no válidos: ' . implode(', ', $invalidRoles));
            $this->error('Ejecuta con --show-roles para ver los roles disponibles');
            exit(1);
        }
    }
}

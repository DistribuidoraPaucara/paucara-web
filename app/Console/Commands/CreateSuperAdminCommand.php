<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class CreateSuperAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create-super-admin
                            {--email= : Email del Super Admin}
                            {--name= : Nombre del Super Admin}
                            {--usernick= : Username del Super Admin}
                            {--password= : Contraseña del Super Admin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crea un nuevo usuario Super Admin (solo puede ser ejecutado por Super Admins existentes)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('===========================================');
        $this->info('   CREACIÓN DE SUPER ADMINISTRADOR');
        $this->info('===========================================');
        $this->newLine();

        // Verificar que el rol Super Admin exista
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        if (!$superAdminRole) {
            $this->error('El rol "Super Admin" no existe en el sistema.');
            $this->error('Por favor, ejecuta primero: php artisan db:seed --class=RolesAndPermissionsSeeder');
            return 1;
        }

        // Obtener datos del usuario
        $email = $this->option('email') ?: $this->ask('Email del Super Admin');
        $name = $this->option('name') ?: $this->ask('Nombre completo');
        $usernick = $this->option('usernick') ?: $this->ask('Username (usernick)');
        $password = $this->option('password') ?: $this->secret('Contraseña');
        $passwordConfirm = $this->secret('Confirmar contraseña');

        // Validar que las contraseñas coincidan
        if ($password !== $passwordConfirm) {
            $this->error('Las contraseñas no coinciden.');
            return 1;
        }

        // Validar datos
        $validator = Validator::make([
            'email' => $email,
            'name' => $name,
            'usernick' => $usernick,
            'password' => $password,
        ], [
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|max:255',
            'usernick' => 'required|string|max:255|unique:users,usernick',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            $this->error('Errores de validación:');
            foreach ($validator->errors()->all() as $error) {
                $this->error('  - ' . $error);
            }
            return 1;
        }

        // Confirmar creación
        $this->newLine();
        $this->warn('Estás a punto de crear un Super Admin con acceso total al sistema.');
        $this->table(
            ['Campo', 'Valor'],
            [
                ['Email', $email],
                ['Nombre', $name],
                ['Username', $usernick],
            ]
        );

        if (!$this->confirm('¿Deseas continuar?', true)) {
            $this->info('Operación cancelada.');
            return 0;
        }

        try {
            // Crear usuario
            $user = User::create([
                'name' => $name,
                'usernick' => $usernick,
                'email' => $email,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
                'activo' => true,
            ]);

            // Asignar rol Super Admin
            $user->assignRole('Super Admin');

            $this->newLine();
            $this->info('✓ Super Admin creado exitosamente!');
            $this->newLine();
            $this->table(
                ['ID', 'Nombre', 'Email', 'Username', 'Rol'],
                [
                    [$user->id, $user->name, $user->email, $user->usernick, 'Super Admin']
                ]
            );
            $this->newLine();
            $this->warn('IMPORTANTE: Guarda estas credenciales en un lugar seguro.');

            return 0;
        } catch (\Exception $e) {
            $this->error('Error al crear el Super Admin: ' . $e->getMessage());
            return 1;
        }
    }
}

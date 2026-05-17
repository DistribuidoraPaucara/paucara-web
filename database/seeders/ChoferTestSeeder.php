<?php
namespace Database\Seeders;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class ChoferTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('👨‍✈️ Creando choferes de prueba...');

        // Asegurar que el rol Chofer existe
        $choferRole = Role::firstOrCreate(['name' => 'Chofer']);

        // Array de choferes para crear
        $choferes = [
            [
                'user' => [
                    'email' => 'chofer1@paucara.test',
                    'name' => 'Juan Carlos Pérez',
                    'usernick' => 'chofer1',
                ],
                'empleado' => [
                    'codigo_empleado' => 'CHO001',
                    'ci' => '8888888',
                    'telefono' => '70888888',
                    'direccion' => 'Av. Logística 100, Cochabamba',
                ],
            ],
            [
                'user' => [
                    'email' => 'chofer2@paucara.test',
                    'name' => 'María González',
                    'usernick' => 'chofer2',
                ],
                'empleado' => [
                    'codigo_empleado' => 'CHO002',
                    'ci' => '7777777',
                    'telefono' => '71777777',
                    'direccion' => 'Calle Los Pinos 234, Cochabamba',
                ],
            ],
            [
                'user' => [
                    'email' => 'chofer3@paucara.test',
                    'name' => 'Pedro Ramírez',
                    'usernick' => 'chofer3',
                ],
                'empleado' => [
                    'codigo_empleado' => 'CHO003',
                    'ci' => '6666666',
                    'telefono' => '72666666',
                    'direccion' => 'Av. América 567, Cochabamba',
                ],
            ],
            [
                'user' => [
                    'email' => 'chofer4@paucara.test',
                    'name' => 'Luis Fernández',
                    'usernick' => 'chofer4',
                ],
                'empleado' => [
                    'codigo_empleado' => 'CHO004',
                    'ci' => '5555555',
                    'telefono' => '73555555',
                    'direccion' => 'Zona Norte, Cochabamba',
                ],
            ],
            [
                'user' => [
                    'email' => 'chofer5@paucara.test',
                    'name' => 'Roberto Sánchez',
                    'usernick' => 'chofer5',
                ],
                'empleado' => [
                    'codigo_empleado' => 'CHO005',
                    'ci' => '4444444',
                    'telefono' => '74444444',
                    'direccion' => 'Zona Sur, Cochabamba',
                ],
            ],
        ];

        foreach ($choferes as $choferData) {
            // Crear usuario
            $user = User::firstOrCreate(
                ['email' => $choferData['user']['email']],
                [
                    'name' => $choferData['user']['name'],
                    'usernick' => $choferData['user']['usernick'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            // Asignar rol Chofer
            if (!$user->hasRole('Chofer')) {
                $user->assignRole('Chofer');
            }

            // Crear empleado asociado
            $empleado = Empleado::firstOrCreate(
                ['codigo_empleado' => $choferData['empleado']['codigo_empleado']],
                [
                    'user_id' => $user->id,
                    'ci' => $choferData['empleado']['ci'],
                    'fecha_ingreso' => now()->subMonths(rand(6, 24))->format('Y-m-d'),
                    'estado' => 'activo',
                    'puede_acceder_sistema' => true,
                    'telefono' => $choferData['empleado']['telefono'],
                    'direccion' => $choferData['empleado']['direccion'],
                ]
            );

            $estado = $user->wasRecentlyCreated ? '✅ Creado' : '⚠️  Ya existe';
            $this->command->info("  {$estado}: {$choferData['user']['name']} ({$choferData['user']['email']})");
        }

        $totalChoferes = User::role('Chofer')->count();

        $this->command->info('');
        $this->command->info("📊 Resumen de choferes:");
        $this->command->info("  Total choferes: {$totalChoferes}");
        $this->command->info('');
        $this->command->info('🔑 Credenciales de acceso:');
        $this->command->info('  Email: chofer[1-5]@paucara.test');
        $this->command->info('  Contraseña: password');
        $this->command->info('');
        $this->command->info('✓ Permisos disponibles:');
        $this->command->info('  - Ver envíos (envios.index, envios.show)');
        $this->command->info('  - Acceder al dashboard de logística');
        $this->command->info('  - Ver seguimiento de envíos');
        $this->command->info('  - Actualizar estado de entregas');
    }
}

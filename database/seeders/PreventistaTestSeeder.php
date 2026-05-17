<?php
namespace Database\Seeders;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class PreventistaTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Creando preventistas de prueba...');

        // Asegurar que el rol Preventista existe
        $preventistaRole = Role::firstOrCreate(['name' => 'preventista']);

        // Array de preventistas para crear
        $preventistas = [
            [
                'user'     => [
                    'email'    => 'preventista@paucara.test',
                    'name'     => 'Carlos Mendoza García',
                    'usernick' => 'preventista',
                ],
                'empleado' => [
                    'codigo_empleado' => 'PRE001',
                    'ci'              => '1234567',
                    'telefono'        => '70123456',
                    'direccion'       => 'Av. Ventas 100, Cochabamba',
                ],
            ],
            /* [
                'user'     => [
                    'email'    => 'preventista2@paucara.test',
                    'name'     => 'Ana García López',
                    'usernick' => 'preventista2',
                ],
                'empleado' => [
                    'codigo_empleado' => 'PRE002',
                    'ci'              => '2345678',
                    'telefono'        => '71234567',
                    'direccion'       => 'Calle Ventas 234, Cochabamba',
                ],
            ],
            [
                'user'     => [
                    'email'    => 'preventista3@paucara.test',
                    'name'     => 'Roberto Soliz Flores',
                    'usernick' => 'preventista3',
                ],
                'empleado' => [
                    'codigo_empleado' => 'PRE003',
                    'ci'              => '3456789',
                    'telefono'        => '72345678',
                    'direccion'       => 'Av. Comercio 567, Cochabamba',
                ],
            ],
            [
                'user'     => [
                    'email'    => 'preventista4@paucara.test',
                    'name'     => 'Paola Rodríguez Martínez',
                    'usernick' => 'preventista4',
                ],
                'empleado' => [
                    'codigo_empleado' => 'PRE004',
                    'ci'              => '4567890',
                    'telefono'        => '73456789',
                    'direccion'       => 'Zona Noroeste, Cochabamba',
                ],
            ], */
        ];

        foreach ($preventistas as $preventistaData) {
            // Crear usuario
            $user = User::firstOrCreate(
                ['email' => $preventistaData['user']['email']],
                [
                    'name'              => $preventistaData['user']['name'],
                    'usernick'          => $preventistaData['user']['usernick'],
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'empresa_id'        => 1,
                ]
            );

            // Asignar rol Preventista
            if (! $user->hasRole('preventista')) {
                $user->assignRole('preventista');
            }

            // Crear empleado asociado
            $empleado = Empleado::firstOrCreate(
                ['codigo_empleado' => $preventistaData['empleado']['codigo_empleado']],
                [
                    'user_id'               => $user->id,
                    'ci'                    => $preventistaData['empleado']['ci'],
                    'fecha_ingreso'         => now()->subMonths(rand(6, 24))->format('Y-m-d'),
                    'estado'                => 'activo',
                    'puede_acceder_sistema' => true,
                    'telefono'              => $preventistaData['empleado']['telefono'],
                    'direccion'             => $preventistaData['empleado']['direccion'],
                ]
            );

            $estado = $user->wasRecentlyCreated ? '✅ Creado' : '⚠️  Ya existe';
            $this->command->info("  {$estado}: {$preventistaData['user']['name']} ({$preventistaData['user']['email']})");
        }

        $totalPreventistas = User::role('preventista')->count();

        $this->command->info('');
        $this->command->info('📊 Resumen de preventistas:');
        $this->command->info("  Total preventistas: {$totalPreventistas}");
        $this->command->info('');
        $this->command->info('🔑 Credenciales de acceso:');
        $this->command->info('  Email: preventista[1-4]@paucara.test');
        $this->command->info('  Contraseña: password');
        $this->command->info('');
        $this->command->info('✓ Permisos disponibles:');
        $this->command->info('  - Gestionar Clientes (direcciones, ventanas de entrega, fotos)');
        $this->command->info('  - Crear y gestionar Ventas y Proformas');
        $this->command->info('  - Acceder a Cajas (cobros)');
        $this->command->info('  - Ver Envíos y Logística');
        $this->command->info('  - Consultar Inventario y Reportes');
        $this->command->info('  - Gestionar Categorías de productos');
        $this->command->info('  - Ver Empleados');
        $this->command->info('');
    }
}

<?php

namespace Database\Seeders;

use App\Models\Caja;
use App\Models\Empleado;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CajeroTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('👨‍💼 Creando cajeros de prueba...');

        // Asegurar que el rol Cajero existe
        $cajeroRole = Role::firstOrCreate(['name' => 'Cajero']);

        // Array de cajeros para crear
        $cajeros = [
            [
                'user' => [
                    'email' => 'cajero@principal.com',
                    'name' => 'Cajero Principal',
                    'usernick' => 'cajero1',
                    'empresa_id' => 1,
                ],
                'empleado' => [
                    'codigo_empleado' => 'CAJ001',
                    'ci' => '9999999',
                    'telefono' => '70999999',
                    'direccion' => 'Av. Cajas 500, Cochabamba',
                ],
            ],
            /* [
                'user' => [
                    'email' => 'cajero2@paucara.test',
                    'name' => 'Sandra López',
                    'usernick' => 'cajero2',
                ],
                'empleado' => [
                    'codigo_empleado' => 'CAJ002',
                    'ci' => '8888888',
                    'telefono' => '71888888',
                    'direccion' => 'Calle Comercio 888, Cochabamba',
                ],
            ], */
        ];

        foreach ($cajeros as $cajeroData) {
            // Crear o actualizar usuario
            $user = User::updateOrCreate(
                ['email' => $cajeroData['user']['email']],
                [
                    'name' => $cajeroData['user']['name'],
                    'usernick' => $cajeroData['user']['usernick'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'can_access_web' => true,
                ]
            );

            // Asignar rol Cajero
            if (!$user->hasRole('Cajero')) {
                $user->assignRole('Cajero');
            }

            // Buscar empleado por CI o código y actualizar/crear
            $empleado = Empleado::where('ci', $cajeroData['empleado']['ci'])
                ->orWhere('codigo_empleado', $cajeroData['empleado']['codigo_empleado'])
                ->first();

            if ($empleado) {
                // Actualizar empleado existente
                $empleado->update([
                    'user_id' => $user->id,
                    'codigo_empleado' => $cajeroData['empleado']['codigo_empleado'],
                    'ci' => $cajeroData['empleado']['ci'],
                    'estado' => 'activo',
                    'puede_acceder_sistema' => true,
                    'telefono' => $cajeroData['empleado']['telefono'],
                    'direccion' => $cajeroData['empleado']['direccion'],
                ]);
            } else {
                // Crear nuevo empleado
                $empleado = Empleado::create([
                    'user_id' => $user->id,
                    'codigo_empleado' => $cajeroData['empleado']['codigo_empleado'],
                    'ci' => $cajeroData['empleado']['ci'],
                    'fecha_ingreso' => now()->subMonths(rand(6, 24))->format('Y-m-d'),
                    'estado' => 'activo',
                    'puede_acceder_sistema' => true,
                    'telefono' => $cajeroData['empleado']['telefono'],
                    'direccion' => $cajeroData['empleado']['direccion'],
                ]);
            }

            // Crear caja asociada al cajero
            $caja = Caja::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nombre' => 'Caja de ' . $cajeroData['user']['name'],
                    'ubicacion' => 'Mostrador',
                    'monto_inicial_dia' => 5000.00,
                    'activa' => true,
                ]
            );

            $estadoEmpleado = $empleado->wasRecentlyCreated ? '✅ Creado' : '🔄 Actualizado';
            $estadoCaja = $caja->wasRecentlyCreated ? '📦 Nueva caja' : '📦 Caja existente';
            $this->command->info("  {$estadoEmpleado}: {$cajeroData['user']['name']} ({$cajeroData['user']['email']})");
            $this->command->info("    {$estadoCaja}: {$caja->nombre}");
        }

        $totalCajeros = User::role('Cajero')->count();

        $this->command->info('');
        $this->command->info('📊 Resumen de cajeros:');
        $this->command->info("  Total cajeros: {$totalCajeros}");
        $this->command->info('');
        $this->command->info('🔑 Credenciales de acceso:');
        $this->command->info('  Email: cajero@principal.com');
        $this->command->info('  Contraseña: password');
        $this->command->info('');
        $this->command->info('✓ Permisos disponibles:');
        $this->command->info('  - Ver dashboard de vendedor/cajero');
        $this->command->info('  - Gestionar cajas');
        $this->command->info('  - Registrar ventas');
        $this->command->info('');
        $this->command->info('💼 Información:');
        $this->command->info('  - Empleado: Cajero Principal');
        $this->command->info('  - Código: CAJ001');
        $this->command->info('  - Caja: Caja de Cajero Principal');
    }
}

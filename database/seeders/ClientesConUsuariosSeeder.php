<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class ClientesConUsuariosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Crea clientes de prueba con sus usuarios para Flutter
     */
    public function run(): void
    {
        // Asegurar que el rol 'Cliente' existe
        $clienteRole = Role::firstOrCreate(['name' => 'Cliente']);

        $clientesData = [
            [
                'cliente' => [
                    'nombre' => 'Juan Pérez Martínez',
                    'razon_social' => 'Juan Pérez Martínez',
                    'nit' => '12345678',
                    'telefono' => '987654321',
                    'email' => 'juan.perez@paucara.test',
                    'activo' => true,
                    'fecha_registro' => now(),
                    'limite_credito' => 5000.00,
                ],
                'usuario' => [
                    'name' => 'Juan Pérez',
                    'usernick' => 'juan.perez',
                    'email' => 'juan.perez@paucara.test',
                    'password' => 'password123',
                ],
            ],
            [
                'cliente' => [
                    'nombre' => 'María González López',
                    'razon_social' => 'María González López',
                    'nit' => '87654321',
                    'telefono' => '987123456',
                    'email' => 'maria.gonzalez@paucara.test',
                    'activo' => true,
                    'fecha_registro' => now(),
                    'limite_credito' => 7500.00,
                ],
                'usuario' => [
                    'name' => 'María González',
                    'usernick' => 'maria.gonzalez',
                    'email' => 'maria.gonzalez@paucara.test',
                    'password' => 'password123',
                ],
            ],
            [
                'cliente' => [
                    'nombre' => 'Carlos Ruiz Vega',
                    'razon_social' => 'Carlos Ruiz Vega',
                    'nit' => '11223344',
                    'telefono' => '987987987',
                    'email' => 'carlos.ruiz@paucara.test',
                    'activo' => true,
                    'fecha_registro' => now(),
                    'limite_credito' => 4000.00,
                ],
                'usuario' => [
                    'name' => 'Carlos Ruiz',
                    'usernick' => 'carlos.ruiz',
                    'email' => 'carlos.ruiz@paucara.test',
                    'password' => 'password123',
                ],
            ],
        ];

        foreach ($clientesData as $data) {
            // Crear o actualizar usuario
            $user = User::firstOrCreate(
                ['email' => $data['usuario']['email']],
                [
                    'name' => $data['usuario']['name'],
                    'usernick' => $data['usuario']['usernick'],
                    'password' => Hash::make($data['usuario']['password']),
                ]
            );

            // Asignar rol Cliente
            if (!$user->hasRole($clienteRole->name)) {
                $user->assignRole($clienteRole);
            }

            // Crear o actualizar cliente
            $cliente = Cliente::firstOrCreate(
                ['nit' => $data['cliente']['nit']],
                array_merge($data['cliente'], ['user_id' => $user->id])
            );

            // Asegurar que el cliente esté vinculado al usuario
            if (!$cliente->user_id) {
                $cliente->update(['user_id' => $user->id]);
            }
        }

        $this->command->info('Clientes de prueba con usuarios creados exitosamente:');
        $this->command->info('');
        $this->command->info('════════════════════════════════════════════════════════');
        $this->command->info('USUARIOS CLIENTE PARA PRUEBAS EN FLUTTER');
        $this->command->info('════════════════════════════════════════════════════════');
        $this->command->info('');
        $this->command->info('1. Juan Pérez Martínez');
        $this->command->info('   Email: juan.perez@paucara.test');
        $this->command->info('   Password: password123');
        $this->command->info('   NIT: 12345678');
        $this->command->info('   Límite de Crédito: $5,000.00');
        $this->command->info('');
        $this->command->info('2. María González López');
        $this->command->info('   Email: maria.gonzalez@paucara.test');
        $this->command->info('   Password: password123');
        $this->command->info('   NIT: 87654321');
        $this->command->info('   Límite de Crédito: $7,500.00');
        $this->command->info('');
        $this->command->info('3. Carlos Ruiz Vega');
        $this->command->info('   Email: carlos.ruiz@paucara.test');
        $this->command->info('   Password: password123');
        $this->command->info('   NIT: 11223344');
        $this->command->info('   Límite de Crédito: $4,000.00');
        $this->command->info('');
        $this->command->info('════════════════════════════════════════════════════════');
        $this->command->info('');
    }
}

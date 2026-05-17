<?php

namespace Database\Seeders;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SupervisoresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear rol de supervisor
        $supervisorRole = Role::firstOrCreate(['name' => 'Supervisor']);
        $supervisorRole->syncPermissions([
            'empleados.index',
            'empleados.show',
            'ventas.index',
            'ventas.show',
            'compras.index',
            'compras.show',
            'inventario.dashboard',
            'clientes.manage',
            'productos.manage',
            'reportes.precios.index',
            'reportes.inventario.stock-actual',
        ]);

        // Crear supervisores
        $supervisores = [
            [
                'codigo_empleado' => 'SUP001',
                'ci' => '1111111',
                'cargo' => 'Supervisor de Ventas',
                'departamento' => 'Ventas',
                'fecha_ingreso' => '2022-01-01',
                'tipo_contrato' => 'indefinido',
                'estado' => 'activo',
                'salario_base' => 6000.00,
                'bonos' => 1000.00,
                'puede_acceder_sistema' => true,
                'fecha_nacimiento' => '1978-04-12',
                'telefono' => '70678901',
                'direccion' => 'Av. Supervisor 111, Santa Cruz',
                'contacto_emergencia_nombre' => 'Elena Vargas',
                'contacto_emergencia_telefono' => '71678901',
            ],
            [
                'codigo_empleado' => 'SUP002',
                'ci' => '2222222',
                'cargo' => 'Supervisor de Inventario',
                'departamento' => 'Inventario',
                'fecha_ingreso' => '2022-02-15',
                'tipo_contrato' => 'indefinido',
                'estado' => 'activo',
                'salario_base' => 5800.00,
                'bonos' => 900.00,
                'puede_acceder_sistema' => true,
                'fecha_nacimiento' => '1980-08-25',
                'telefono' => '70789012',
                'direccion' => 'Calle Supervisor 222, Santa Cruz',
                'contacto_emergencia_nombre' => 'Mario Torres',
                'contacto_emergencia_telefono' => '71789012',
            ],
        ];

        // Nombres correspondientes a cada supervisor
        $nombresSupervisores = [
            'SUP001' => 'Luis Vargas',
            'SUP002' => 'Gabriela Torres',
        ];

        foreach ($supervisores as $supervisorData) {
            $codigo = $supervisorData['codigo_empleado'];
            $nombre = $nombresSupervisores[$codigo];

            // Crear usuario para el supervisor
            $userData = [
                'name' => $nombre,
                'usernick' => strtolower(str_replace(' ', '.', $nombre)),
                'email' => strtolower(str_replace(' ', '.', $nombre)).'@paucara.test',
                'password' => 'password',
            ];

            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'usernick' => $userData['usernick'],
                    'password' => Hash::make($userData['password']),
                ]
            );

            // Asignar rol de supervisor
            if (! $user->hasRole($supervisorRole->name)) {
                $user->assignRole($supervisorRole);
            }

            // Crear empleado supervisor
            $supervisor = Empleado::firstOrCreate(
                ['codigo_empleado' => $supervisorData['codigo_empleado']],
                array_merge($supervisorData, ['user_id' => $user->id])
            );

            // Asegurar que esté vinculado
            if (! $supervisor->user_id) {
                $supervisor->update(['user_id' => $user->id]);
            }
        }

        $this->command->info('Supervisores creados exitosamente:');
        $this->command->info('- Luis Vargas (Supervisor de Ventas): luis.vargas@paucara.test');
        $this->command->info('- Gabriela Torres (Supervisor de Inventario): gabriela.torres@paucara.test');
        $this->command->info('');
        $this->command->info('Contraseña para todos: password');
    }
}

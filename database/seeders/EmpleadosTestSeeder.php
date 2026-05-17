<?php

namespace Database\Seeders;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class EmpleadosTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear roles específicos para empleados con permisos de clientes y productos
        $clienteManagerRole = Role::firstOrCreate(['name' => 'Gestor de Clientes']);
        $productoManagerRole = Role::firstOrCreate(['name' => 'Gestor de Productos']);
        $clienteProductoManagerRole = Role::firstOrCreate(['name' => 'Gestor de Clientes y Productos']);

        // Asignar permisos a los roles
        $clienteManagerRole->syncPermissions([
            'clientes.manage',
            'empleados.show', // Para ver su propio perfil
        ]);

        $productoManagerRole->syncPermissions([
            'productos.manage',
            'inventario.dashboard',
            'inventario.stock-bajo',
            'inventario.proximos-vencer',
            'inventario.vencidos',
            'inventario.movimientos',
            'reportes.inventario.stock-actual',
            'reportes.inventario.vencimientos',
            'reportes.inventario.movimientos',
            'empleados.show', // Para ver su propio perfil
        ]);

        $clienteProductoManagerRole->syncPermissions([
            'clientes.manage',
            'productos.manage',
            'inventario.dashboard',
            'inventario.stock-bajo',
            'inventario.proximos-vencer',
            'inventario.vencidos',
            'inventario.movimientos',
            'reportes.inventario.stock-actual',
            'reportes.inventario.vencimientos',
            'reportes.inventario.movimientos',
            'empleados.show', // Para ver su propio perfil
        ]);

        // Crear empleados con usuarios asociados

        // 1. Empleado que solo gestiona clientes
        $this->crearEmpleadoConUsuario([
            'codigo_empleado' => 'CLI001',
            'ci' => '9876543',
            'cargo' => 'Gestora de Clientes',
            'departamento' => 'Ventas',
            'fecha_ingreso' => '2024-01-15',
            'tipo_contrato' => 'indefinido',
            'estado' => 'activo',
            'salario_base' => 4500.00,
            'bonos' => 500.00,
            'puede_acceder_sistema' => true,
            'fecha_nacimiento' => '1990-05-20',
            'telefono' => '70123456',
            'direccion' => 'Av. Principal 123, Santa Cruz',
            'contacto_emergencia_nombre' => 'Juan González',
            'contacto_emergencia_telefono' => '71234567',
        ], [
            'name' => 'María González',
            'usernick' => 'maria.gonzalez',
            'email' => 'maria.gonzalez@paucara.test',
            'password' => 'password',
        ], $clienteManagerRole);

        // 2. Empleado que solo gestiona productos
        $this->crearEmpleadoConUsuario([
            'codigo_empleado' => 'PROD001',
            'ci' => '8765432',
            'cargo' => 'Gestor de Productos',
            'departamento' => 'Inventario',
            'fecha_ingreso' => '2024-02-01',
            'tipo_contrato' => 'indefinido',
            'estado' => 'activo',
            'salario_base' => 4800.00,
            'bonos' => 600.00,
            'puede_acceder_sistema' => true,
            'fecha_nacimiento' => '1988-08-15',
            'telefono' => '70234567',
            'direccion' => 'Calle Secundaria 456, Santa Cruz',
            'contacto_emergencia_nombre' => 'Ana Rodríguez',
            'contacto_emergencia_telefono' => '72345678',
        ], [
            'name' => 'Carlos Rodríguez',
            'usernick' => 'carlos.rodriguez',
            'email' => 'carlos.rodriguez@paucara.test',
            'password' => 'password',
        ], $productoManagerRole);

        // 3. Empleado que gestiona tanto clientes como productos
        $this->crearEmpleadoConUsuario([
            'codigo_empleado' => 'CLIPROD001',
            'ci' => '7654321',
            'cargo' => 'Gestora de Clientes y Productos',
            'departamento' => 'Administración',
            'fecha_ingreso' => '2024-03-10',
            'tipo_contrato' => 'indefinido',
            'estado' => 'activo',
            'salario_base' => 5200.00,
            'bonos' => 700.00,
            'puede_acceder_sistema' => true,
            'fecha_nacimiento' => '1985-12-03',
            'telefono' => '70345678',
            'direccion' => 'Plaza Central 789, Santa Cruz',
            'contacto_emergencia_nombre' => 'Pedro López',
            'contacto_emergencia_telefono' => '73456789',
        ], [
            'name' => 'Ana López',
            'usernick' => 'ana.lopez',
            'email' => 'ana.lopez@paucara.test',
            'password' => 'password',
        ], $clienteProductoManagerRole);

        // 4. Empleado adicional para gestión de clientes
        $this->crearEmpleadoConUsuario([
            'codigo_empleado' => 'CLI002',
            'ci' => '6543210',
            'cargo' => 'Asistente de Ventas',
            'departamento' => 'Ventas',
            'fecha_ingreso' => '2024-04-05',
            'tipo_contrato' => 'temporal',
            'estado' => 'activo',
            'salario_base' => 3800.00,
            'bonos' => 300.00,
            'puede_acceder_sistema' => true,
            'fecha_nacimiento' => '1992-03-12',
            'telefono' => '70456789',
            'direccion' => 'Av. Comercio 321, Santa Cruz',
            'contacto_emergencia_nombre' => 'Laura Sánchez',
            'contacto_emergencia_telefono' => '74567890',
        ], [
            'name' => 'Roberto Sánchez',
            'usernick' => 'roberto.sanchez',
            'email' => 'roberto.sanchez@paucara.test',
            'password' => 'password',
        ], $clienteManagerRole);

        // 5. Empleado adicional para gestión de productos
        $this->crearEmpleadoConUsuario([
            'codigo_empleado' => 'PROD002',
            'ci' => '5432109',
            'cargo' => 'Auxiliar de Inventario',
            'departamento' => 'Inventario',
            'fecha_ingreso' => '2024-05-20',
            'tipo_contrato' => 'indefinido',
            'estado' => 'activo',
            'salario_base' => 4200.00,
            'bonos' => 400.00,
            'puede_acceder_sistema' => true,
            'fecha_nacimiento' => '1991-07-25',
            'telefono' => '70567890',
            'direccion' => 'Calle Industrial 654, Santa Cruz',
            'contacto_emergencia_nombre' => 'Miguel Morales',
            'contacto_emergencia_telefono' => '75678901',
        ], [
            'name' => 'Patricia Morales',
            'usernick' => 'patricia.morales',
            'email' => 'patricia.morales@paucara.test',
            'password' => 'password',
        ], $productoManagerRole);

        $this->command->info('Empleados de prueba creados exitosamente:');
        $this->command->info('- María González (Gestora de Clientes): maria.gonzalez@paucara.test');
        $this->command->info('- Carlos Rodríguez (Gestor de Productos): carlos.rodriguez@paucara.test');
        $this->command->info('- Ana López (Gestora de Clientes y Productos): ana.lopez@paucara.test');
        $this->command->info('- Roberto Sánchez (Asistente de Ventas): roberto.sanchez@paucara.test');
        $this->command->info('- Patricia Morales (Auxiliar de Inventario): patricia.morales@paucara.test');
        $this->command->info('');
        $this->command->info('Contraseña para todos: password');
    }

    /**
     * Crear empleado con usuario asociado
     */
    private function crearEmpleadoConUsuario(array $empleadoData, array $userData, Role $role): void
    {
        // Crear o actualizar usuario
        $user = User::firstOrCreate(
            ['email' => $userData['email']],
            [
                'name' => $userData['name'],
                'usernick' => $userData['usernick'],
                'password' => Hash::make($userData['password']),
            ]
        );

        // Asignar rol al usuario
        if (! $user->hasRole($role->name)) {
            $user->assignRole($role);
        }

        // Crear empleado asociado al usuario
        $empleado = Empleado::firstOrCreate(
            ['codigo_empleado' => $empleadoData['codigo_empleado']],
            array_merge($empleadoData, ['user_id' => $user->id])
        );

        // Asegurar que el empleado esté vinculado al usuario
        if (! $empleado->user_id) {
            $empleado->update(['user_id' => $user->id]);
        }
    }
}

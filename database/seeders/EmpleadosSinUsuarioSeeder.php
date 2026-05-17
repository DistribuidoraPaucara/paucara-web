<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;

class EmpleadosSinUsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear empleados sin usuarios del sistema (empleados tradicionales)

        $empleadosSinUsuario = [
            [
                'codigo_empleado' => 'EMP001',
                'ci' => '1234567',
                'telefono' => '70000001',
                'direccion' => 'Av. Siempre Viva 123, Santa Cruz',
                'fecha_nacimiento' => '1980-01-15',
                'cargo' => 'Chofer',
                'departamento' => 'Logística',
                'fecha_ingreso' => '2023-01-01',
                'tipo_contrato' => 'indefinido',
                'salario_base' => 3500.00,
                'bonos' => 200.00,
                'estado' => 'activo',
                'puede_acceder_sistema' => false,
                'contacto_emergencia_nombre' => 'María García',
                'contacto_emergencia_telefono' => '71000001',
            ],
            [
                'codigo_empleado' => 'EMP002',
                'ci' => '2345678',
                'telefono' => '70000002',
                'direccion' => 'Calle Ficticia 456, Santa Cruz',
                'fecha_nacimiento' => '1985-03-22',
                'cargo' => 'Auxiliar de Almacén',
                'departamento' => 'Inventario',
                'fecha_ingreso' => '2023-02-15',
                'tipo_contrato' => 'temporal',
                'salario_base' => 2800.00,
                'bonos' => 150.00,
                'estado' => 'activo',
                'puede_acceder_sistema' => false,
                'contacto_emergencia_nombre' => 'José Martínez',
                'contacto_emergencia_telefono' => '71000002',
            ],
            [
                'codigo_empleado' => 'EMP003',
                'ci' => '3456789',
                'telefono' => '70000003',
                'direccion' => 'Plaza Imaginaria 789, Santa Cruz',
                'fecha_nacimiento' => '1990-07-10',
                'cargo' => 'Cajera',
                'departamento' => 'Ventas',
                'fecha_ingreso' => '2023-03-01',
                'tipo_contrato' => 'indefinido',
                'salario_base' => 3200.00,
                'bonos' => 250.00,
                'estado' => 'activo',
                'puede_acceder_sistema' => false,
                'contacto_emergencia_nombre' => 'Carmen López',
                'contacto_emergencia_telefono' => '71000003',
            ],
            [
                'codigo_empleado' => 'EMP004',
                'ci' => '4567890',
                'telefono' => '70000004',
                'direccion' => 'Av. de los Sueños 321, Santa Cruz',
                'fecha_nacimiento' => '1975-11-30',
                'cargo' => 'Limpieza',
                'departamento' => 'Administración',
                'fecha_ingreso' => '2023-04-10',
                'tipo_contrato' => 'temporal',
                'salario_base' => 2500.00,
                'bonos' => 100.00,
                'estado' => 'activo',
                'puede_acceder_sistema' => false,
                'contacto_emergencia_nombre' => 'Antonio Ruiz',
                'contacto_emergencia_telefono' => '71000004',
            ],
            [
                'codigo_empleado' => 'EMP005',
                'ci' => '5678901',
                'telefono' => '70000005',
                'direccion' => 'Calle Realidad 654, Santa Cruz',
                'fecha_nacimiento' => '1982-09-18',
                'cargo' => 'Seguridad',
                'departamento' => 'Administración',
                'fecha_ingreso' => '2023-05-20',
                'tipo_contrato' => 'indefinido',
                'salario_base' => 3000.00,
                'bonos' => 180.00,
                'estado' => 'activo',
                'puede_acceder_sistema' => false,
                'contacto_emergencia_nombre' => 'Rosa Fernández',
                'contacto_emergencia_telefono' => '71000005',
            ],
        ];

        foreach ($empleadosSinUsuario as $empleadoData) {
            Empleado::firstOrCreate(
                ['codigo_empleado' => $empleadoData['codigo_empleado']],
                $empleadoData
            );
        }

        $this->command->info('Empleados sin usuario del sistema creados exitosamente:');
        $this->command->info('- EMP001: Chofer (Sin acceso al sistema)');
        $this->command->info('- EMP002: Auxiliar de Almacén (Sin acceso al sistema)');
        $this->command->info('- EMP003: Cajera (Sin acceso al sistema)');
        $this->command->info('- EMP004: Limpieza (Sin acceso al sistema)');
        $this->command->info('- EMP005: Seguridad (Sin acceso al sistema)');
        $this->command->info('');
        $this->command->info('Estos empleados no tienen usuarios asociados y no pueden acceder al sistema.');
    }
}

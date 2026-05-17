<?php

namespace Database\Seeders;

use App\Models\Empleado;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class EmpleadoPreventistaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Crea un empleado con rol Preventista asociado al usuario existente "Preventista"
     */
    public function run(): void
    {
        // Obtener o crear el usuario Preventista
        $usuario = User::where('email', 'preventista@paucara.com')->first();

        if (!$usuario) {
            $usuario = User::create([
                'name' => 'Preventista',
                'email' => 'preventista@paucara.com',
                'usernick' => 'preventista',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'activo' => true,
            ]);
        }

        // Asignar rol Preventista si no lo tiene
        $preventistaRole = Role::where('name', 'Preventista')->first();
        if ($preventistaRole && !$usuario->hasRole('Preventista')) {
            $usuario->assignRole('Preventista');
        }

        // Crear empleado asociado al usuario Preventista
        $empleado = Empleado::firstOrCreate(
            ['codigo_empleado' => 'PREV001'],
            [
                'user_id' => $usuario->id,
                'ci' => '1234567',
                'fecha_ingreso' => now()->toDateString(),
                'estado' => 'activo',
                'puede_acceder_sistema' => true,
                'telefono' => '70123456',
                'direccion' => 'Av. Principal 100, Santa Cruz',
                'observaciones' => 'Empleado Preventista - Gestor de cartera de clientes, ventas, proformas y cajas',
                'datos_rol' => json_encode([
                    'cargo' => 'Preventista',
                    'departamento' => 'Comercial',
                    'tipo_contrato' => 'indefinido',
                    'salario_base' => 5500.00,
                    'bonos' => 800.00,
                    'contacto_emergencia_nombre' => 'Familiar Preventista',
                    'contacto_emergencia_telefono' => '71234567',
                ]),
            ]
        );

        // Asegurar que el empleado esté vinculado al usuario
        if (!$empleado->user_id) {
            $empleado->update(['user_id' => $usuario->id]);
        }

        $this->command->info('');
        $this->command->info('✅ Empleado Preventista creado exitosamente');
        $this->command->info('═════════════════════════════════════════');
        $this->command->info("📋 Código de Empleado: {$empleado->codigo_empleado}");
        $this->command->info("👤 Nombre: {$usuario->name}");
        $this->command->info("📧 Email: {$usuario->email}");
        $this->command->info("👔 Cargo: Preventista");
        $this->command->info("🔑 Rol del Sistema: Preventista");
        $this->command->info("📱 Teléfono: {$empleado->telefono}");
        $this->command->info("📍 Dirección: {$empleado->direccion}");
        $this->command->info('═════════════════════════════════════════');
        $this->command->info('');
        $this->command->info('🔐 Credenciales para login:');
        $this->command->info('   Email: preventista@test.com');
        $this->command->info('   Contraseña: password');
        $this->command->info('');
        $this->command->info('✨ Capacidades del Preventista:');
        $this->command->info('   ✓ CRUD de clientes');
        $this->command->info('   ✓ CRUD de ventas');
        $this->command->info('   ✓ CRUD de proformas + Aprobar/Convertir');
        $this->command->info('   ✓ Gestión de cajas (Abrir/Cerrar)');
        $this->command->info('   ✓ Ver inventario y logística');
        $this->command->info('   ✗ Compras');
        $this->command->info('   ✗ Administración');
    }
}

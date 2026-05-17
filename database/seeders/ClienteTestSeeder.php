<?php
namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class ClienteTestSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = [
            /* [
                'nombre' => 'Juan Pérez Martínez',
                'razon_social' => 'Juan Pérez Martínez',
                'nit' => '12345678',
                'telefono' => '987654321',
                'email' => 'juan.perez@email.com',
                'activo' => true,
                'fecha_registro' => now(),
                'limite_credito' => 1000.00,
            ],
            [
                'nombre' => 'María González López',
                'razon_social' => 'María González López',
                'nit' => '87654321',
                'telefono' => '987123456',
                'email' => 'maria.gonzalez@email.com',
                'activo' => true,
                'fecha_registro' => now(),
                'limite_credito' => 1500.00,
            ],
            [
                'nombre' => 'Carlos Ruiz Vega',
                'razon_social' => 'Carlos Ruiz Vega',
                'nit' => '11223344',
                'telefono' => '987987987',
                'email' => 'carlos.ruiz@email.com',
                'activo' => true,
                'fecha_registro' => now(),
                'limite_credito' => 800.00,
            ],
            [
                'nombre' => 'Ana Torres Silva',
                'razon_social' => 'Ana Torres Silva',
                'nit' => '44332211',
                'telefono' => '987456123',
                'email' => 'ana.torres@email.com',
                'activo' => true,
                'fecha_registro' => now(),
                'limite_credito' => 1200.00,
            ], */
        ];

        foreach ($clientes as $clienteData) {
            Cliente::firstOrCreate(
                ['nit' => $clienteData['nit']],
                $clienteData
            );
        }

        $this->command->info('Clientes de prueba creados exitosamente.');
    }
}

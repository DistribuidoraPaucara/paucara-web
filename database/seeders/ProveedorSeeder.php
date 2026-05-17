<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProveedorSeeder extends Seeder
{
    public function run(): void
    {
        $proveedores = [
            [
                'nombre' => 'Distribuidora ABC',
                'razon_social' => 'Distribuidora ABC S.A.',
                'nit' => '123456789',
                'telefono' => '+591 2 1234567',
                'email' => 'contacto@distribuidoraabc.com',
                'direccion' => 'Av. Principal 123, La Paz',
                'contacto' => 'Juan Pérez',
                'activo' => true,
                'fecha_registro' => now(),
            ],
            [
                'nombre' => 'Alimentos del Valle',
                'razon_social' => 'Alimentos del Valle Ltda.',
                'nit' => '987654321',
                'telefono' => '+591 2 7654321',
                'email' => 'ventas@alimentosvalle.com',
                'direccion' => 'Calle Comercio 456, Santa Cruz',
                'contacto' => 'María García',
                'activo' => true,
                'fecha_registro' => now(),
            ],
            [
                'nombre' => 'Bebidas Premium',
                'razon_social' => 'Bebidas Premium S.R.L.',
                'nit' => '456789123',
                'telefono' => '+591 3 4567890',
                'email' => 'info@bebidaspremium.com',
                'direccion' => 'Zona Industrial 789, Cochabamba',
                'contacto' => 'Carlos Rodríguez',
                'activo' => true,
                'fecha_registro' => now(),
            ],
            [
                'nombre' => 'Productos de Limpieza SRL',
                'razon_social' => 'Productos de Limpieza SRL',
                'nit' => '789123456',
                'telefono' => '+591 4 7891234',
                'email' => 'admin@limpiezasrl.com',
                'direccion' => 'Av. Industrial 321, Sucre',
                'contacto' => 'Ana López',
                'activo' => true,
                'fecha_registro' => now(),
            ],
            [
                'nombre' => 'Lácteos del Sur',
                'razon_social' => 'Lácteos del Sur S.A.',
                'nit' => '321654987',
                'telefono' => '+591 2 3216549',
                'email' => 'compras@lacteossur.com',
                'direccion' => 'Ruta 4 km 15, Tarija',
                'contacto' => 'Roberto Sánchez',
                'activo' => true,
                'fecha_registro' => now(),
            ],
        ];

        DB::table('proveedores')->insert($proveedores);
    }
}

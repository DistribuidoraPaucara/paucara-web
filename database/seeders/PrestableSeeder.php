<?php

namespace Database\Seeders;

use App\Models\Prestable;
use App\Models\PrestablePrice;
use App\Models\PrestableCondicion;
use Illuminate\Database\Seeder;

class PrestableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // CANASTILLA PEQUEÑA
        $prestable1 = Prestable::create([
            'nombre' => 'Canastilla Pequeña',
            'codigo' => 'CANAS-001',
            'tipo' => 'CANASTILLA',
            'capacidad' => 24,
            'descripcion' => 'Canastilla pequeña para bebidas de 330ml',
            'activo' => true,
        ]);

        // Precios para canastilla pequeña
        PrestablePrice::create([
            'prestable_id' => $prestable1->id,
            'tipo_precio' => 'VENTA',
            'valor' => 150.00,
            'activo' => true,
        ]);

        PrestablePrice::create([
            'prestable_id' => $prestable1->id,
            'tipo_precio' => 'PRESTAMO',
            'valor' => 20.00,
            'activo' => true,
        ]);

        // Condiciones para canastilla pequeña
        PrestableCondicion::create([
            'prestable_id' => $prestable1->id,
            'monto_garantia' => 100.00,
            'monto_daño_total' => 150.00,
            'activo' => true,
        ]);

        // CANASTILLA MEDIANA
        $prestable2 = Prestable::create([
            'nombre' => 'Canastilla Mediana',
            'codigo' => 'CANAS-002',
            'tipo' => 'CANASTILLA',
            'capacidad' => 48,
            'descripcion' => 'Canastilla mediana para bebidas de 330ml',
            'activo' => true,
        ]);

        // Precios para canastilla mediana
        PrestablePrice::create([
            'prestable_id' => $prestable2->id,
            'tipo_precio' => 'VENTA',
            'valor' => 250.00,
            'activo' => true,
        ]);

        PrestablePrice::create([
            'prestable_id' => $prestable2->id,
            'tipo_precio' => 'PRESTAMO',
            'valor' => 30.00,
            'activo' => true,
        ]);

        // Condiciones para canastilla mediana
        PrestableCondicion::create([
            'prestable_id' => $prestable2->id,
            'monto_garantia' => 150.00,
            'monto_daño_total' => 250.00,
            'activo' => true,
        ]);

        // CANASTILLA GRANDE
        $prestable3 = Prestable::create([
            'nombre' => 'Canastilla Grande',
            'codigo' => 'CANAS-003',
            'tipo' => 'CANASTILLA',
            'capacidad' => 72,
            'descripcion' => 'Canastilla grande para bebidas de 330ml',
            'activo' => true,
        ]);

        // Precios para canastilla grande
        PrestablePrice::create([
            'prestable_id' => $prestable3->id,
            'tipo_precio' => 'VENTA',
            'valor' => 350.00,
            'activo' => true,
        ]);

        PrestablePrice::create([
            'prestable_id' => $prestable3->id,
            'tipo_precio' => 'PRESTAMO',
            'valor' => 40.00,
            'activo' => true,
        ]);

        // Condiciones para canastilla grande
        PrestableCondicion::create([
            'prestable_id' => $prestable3->id,
            'monto_garantia' => 200.00,
            'monto_daño_total' => 350.00,
            'activo' => true,
        ]);

        // EMBASES PLÁSTICO 500ML
        $prestable4 = Prestable::create([
            'nombre' => 'Embases Plástico 500ml',
            'codigo' => 'EMBA-001',
            'tipo' => 'EMBASES',
            'capacidad' => 100,
            'descripcion' => 'Embases de plástico para bebidas de 500ml',
            'activo' => true,
        ]);

        // Precios para embases 500ml
        PrestablePrice::create([
            'prestable_id' => $prestable4->id,
            'tipo_precio' => 'VENTA',
            'valor' => 180.00,
            'activo' => true,
        ]);

        PrestablePrice::create([
            'prestable_id' => $prestable4->id,
            'tipo_precio' => 'PRESTAMO',
            'valor' => 15.00,
            'activo' => true,
        ]);

        // Condiciones para embases 500ml
        PrestableCondicion::create([
            'prestable_id' => $prestable4->id,
            'monto_garantia' => 80.00,
            'monto_daño_total' => 180.00,
            'activo' => true,
        ]);

        // EMBASES VIDRIO 1L
        $prestable5 = Prestable::create([
            'nombre' => 'Embases Vidrio 1L',
            'codigo' => 'EMBA-002',
            'tipo' => 'EMBASES',
            'capacidad' => 60,
            'descripcion' => 'Embases de vidrio para bebidas de 1 litro',
            'activo' => true,
        ]);

        // Precios para embases vidrio
        PrestablePrice::create([
            'prestable_id' => $prestable5->id,
            'tipo_precio' => 'VENTA',
            'valor' => 320.00,
            'activo' => true,
        ]);

        PrestablePrice::create([
            'prestable_id' => $prestable5->id,
            'tipo_precio' => 'PRESTAMO',
            'valor' => 25.00,
            'activo' => true,
        ]);

        // Condiciones para embases vidrio
        PrestableCondicion::create([
            'prestable_id' => $prestable5->id,
            'monto_garantia' => 200.00,
            'monto_daño_total' => 320.00,
            'activo' => true,
        ]);
    }
}

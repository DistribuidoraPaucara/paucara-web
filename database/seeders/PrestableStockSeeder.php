<?php

namespace Database\Seeders;

use App\Models\Prestable;
use App\Models\PrestableStock;
use Illuminate\Database\Seeder;

class PrestableStockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todos los prestables creados
        $prestables = Prestable::all();

        // Por cada prestable, crear stock para almacén 1 (default)
        foreach ($prestables as $prestable) {
            PrestableStock::create([
                'prestable_id' => $prestable->id,
                'almacenes_prestables_id' => 1, // Almacén default
                'cantidad_disponible' => $this->cantidadInicial($prestable->codigo),
                'cantidad_prestamo_cliente_activo' => 0,
                'cantidad_prestamo_cliente_devuelto' => 0,
                'cantidad_prestamo_evento_activo' => 0,
                'cantidad_prestamo_evento_devuelto' => 0,
                'cantidad_prestamo_proveedor_activo' => 0,
                'cantidad_prestamo_proveedor_devuelto' => 0,
            ]);

            // Crear también para almacén 2 si existe
            PrestableStock::create([
                'prestable_id' => $prestable->id,
                'almacenes_prestables_id' => 2,
                'cantidad_disponible' => intval($this->cantidadInicial($prestable->codigo) / 2),
                'cantidad_prestamo_cliente_activo' => 0,
                'cantidad_prestamo_cliente_devuelto' => 0,
                'cantidad_prestamo_evento_activo' => 0,
                'cantidad_prestamo_evento_devuelto' => 0,
                'cantidad_prestamo_proveedor_activo' => 0,
                'cantidad_prestamo_proveedor_devuelto' => 0,
            ]);
        }
    }

    /**
     * Retorna cantidad inicial según tipo de prestable
     */
    private function cantidadInicial(string $codigo): int
    {
        return match ($codigo) {
            'CANAS-001' => 150, // Canastilla pequeña
            'CANAS-002' => 120, // Canastilla mediana
            'CANAS-003' => 80,  // Canastilla grande
            'EMBA-001' => 200,  // Embases plástico
            'EMBA-002' => 100,  // Embases vidrio
            default => 50,
        };
    }
}

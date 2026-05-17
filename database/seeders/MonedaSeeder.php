<?php
namespace Database\Seeders;

use App\Models\Moneda;
use Illuminate\Database\Seeder;

class MonedaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $monedas = [
            [
                'codigo'         => 'BOB',
                'nombre'         => 'Boliviano',
                'simbolo'        => 'Bs',
                'decimales'      => 2,
                'tasa_cambio'    => 1.00,
                'es_moneda_base' => true,
                'activo'         => true,
            ],
            [
                'codigo' => 'RS',
                'nombre' => 'Real',
                'simbolo' => 'Rs',
                'decimales' => 2,
                'tasa_cambio' => 1.70,
                'es_moneda_base' => false,
                'activo' => true,
            ],
            [
                'codigo' => 'USD',
                'nombre' => 'Dólar Estadounidense',
                'simbolo' => '$',
                'decimales' => 2,
                'tasa_cambio' => 6.97,
                'es_moneda_base' => false,
                'activo' => true,
            ],
            
        ];

        foreach ($monedas as $moneda) {
            Moneda::firstOrCreate(
                ['codigo' => $moneda['codigo']],
                $moneda
            );
        }
    }
}

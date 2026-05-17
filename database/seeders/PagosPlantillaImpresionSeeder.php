<?php

namespace Database\Seeders;

use App\Models\Empresa;
use App\Models\PlantillaImpresion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PagosPlantillaImpresionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $empresa = Empresa::principal();

        if (!$empresa) {
            $this->command->error('❌ No existe empresa principal configurada.');
            return;
        }

        // Definir plantillas para pagos
        $plantillas = [
            [
                'codigo' => 'PAGO_TICKET_80',
                'formato' => 'TICKET_80',
                'nombre' => 'Pago Ticket 80mm',
                'vista_blade' => 'impresion.pagos.ticket-80',
                'descripcion' => 'Formato de ticket de 80mm para impresoras térmicas'
            ],
            [
                'codigo' => 'PAGO_TICKET_58',
                'formato' => 'TICKET_58',
                'nombre' => 'Pago Ticket 58mm',
                'vista_blade' => 'impresion.pagos.ticket-58',
                'descripcion' => 'Formato de ticket de 58mm para impresoras térmicas'
            ],
            [
                'codigo' => 'PAGO_A4',
                'formato' => 'A4',
                'nombre' => 'Pago Hoja Completa A4',
                'vista_blade' => 'impresion.pagos.hoja-completa',
                'descripcion' => 'Formato de hoja completa A4'
            ],
        ];

        foreach ($plantillas as $datos) {
            // Verificar si plantilla ya existe
            $existe = PlantillaImpresion::where('empresa_id', $empresa->id)
                ->where('codigo', $datos['codigo'])
                ->exists();

            if ($existe) {
                $this->command->line("⏭️  Plantilla {$datos['codigo']} ya existe, saltando...");
                continue;
            }

            PlantillaImpresion::create([
                'empresa_id' => $empresa->id,
                'codigo' => $datos['codigo'],
                'tipo_documento' => 'pago',
                'formato' => $datos['formato'],
                'nombre' => $datos['nombre'],
                'vista_blade' => $datos['vista_blade'],
                'activo' => true,
                'es_default' => true,
                'orden' => match($datos['formato']) {
                    'A4' => 3,
                    'TICKET_80' => 1,
                    'TICKET_58' => 2,
                },
            ]);

            $this->command->info("✅ Creada plantilla: {$datos['codigo']}");
        }

        $this->command->newLine();
        $this->command->info('✅ Seeder PagosPlantillaImpresion completado exitosamente.');
    }
}

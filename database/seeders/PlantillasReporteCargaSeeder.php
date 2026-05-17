<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PlantillaImpresion;
use App\Models\Empresa;

/**
 * Seeder para crear plantillas de impresión para reportes de carga
 *
 * Registra las tres plantillas de impresión:
 * - A4: Formato completo para impresoras normales
 * - TICKET_80: Formato para impresoras térmicas de 80mm
 * - TICKET_58: Formato para impresoras térmicas de 58mm (default y más usado)
 */
class PlantillasReporteCargaSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener la empresa principal
        $empresa = Empresa::principal();

        if (!$empresa) {
            $this->command->error('❌ No hay empresa registrada en el sistema');
            return;
        }

        $plantillas = [
            [
                'empresa_id' => $empresa->id,
                'codigo' => 'reporte_carga_a4',
                'tipo_documento' => 'reporte_carga',
                'formato' => 'A4',
                'nombre' => 'Reporte de Carga A4',
                'vista_blade' => 'pdf.reporte-carga',
                'es_default' => false,
                'activo' => true,
            ],
            [
                'empresa_id' => $empresa->id,
                'codigo' => 'reporte_carga_ticket_80',
                'tipo_documento' => 'reporte_carga',
                'formato' => 'TICKET_80',
                'nombre' => 'Reporte de Carga Ticket 80mm',
                'vista_blade' => 'pdf.reporte-carga-ticket-80',
                'es_default' => false,
                'activo' => true,
            ],
            [
                'empresa_id' => $empresa->id,
                'codigo' => 'reporte_carga_ticket_58',
                'tipo_documento' => 'reporte_carga',
                'formato' => 'TICKET_58',
                'nombre' => 'Reporte de Carga Ticket 58mm',
                'vista_blade' => 'pdf.reporte-carga-ticket-58',
                'es_default' => true, // DEFAULT según preferencia del usuario
                'activo' => true,
            ],
        ];

        foreach ($plantillas as $data) {
            PlantillaImpresion::updateOrCreate(
                [
                    'empresa_id' => $empresa->id,
                    'tipo_documento' => $data['tipo_documento'],
                    'formato' => $data['formato'],
                ],
                $data
            );
        }

        $this->command->info('✅ Plantillas de reporte de carga creadas exitosamente');
        $this->command->info('   - A4: Formato completo');
        $this->command->info('   - TICKET_80: Impresora térmica 80mm');
        $this->command->info('   - TICKET_58: Impresora térmica 58mm (default)');
    }
}

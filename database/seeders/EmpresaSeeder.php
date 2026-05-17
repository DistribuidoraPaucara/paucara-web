<?php

namespace Database\Seeders;

use App\Models\Empresa;
use App\Models\PlantillaImpresion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🏢 Configurando empresas y plantillas de impresión...');
        $this->command->info('');

        // PASO 1: Crear/actualizar empresa principal
        $empresa = $this->crearOActualizarEmpresa();

        // PASO 2: Crear/actualizar plantillas de impresión
        $this->crearOActualizarPlantillas($empresa);

        $this->command->info('');
        $this->command->info('=================================================');
        $this->command->info('✅ Seeder completado exitosamente');
        $this->command->info('=================================================');
    }

    /**
     * Crear o actualizar empresa principal
     * Usa updateOrCreate para evitar errores de duplicidad
     */
    private function crearOActualizarEmpresa(): Empresa
    {
        $this->command->info('📋 Procesando empresa...');

        $empresaConfig = $this->getEmpresaConfiguration();

        $empresa = Empresa::updateOrCreate(
            ['nit' => $empresaConfig['nit']],
            [
                'nombre_comercial' => $empresaConfig['nombre_comercial'],
                'razon_social' => $empresaConfig['razon_social'],
                'telefono' => $empresaConfig['telefono'],
                'email' => $empresaConfig['email'],
                'sitio_web' => $empresaConfig['sitio_web'],
                'direccion' => $empresaConfig['direccion'],
                'ciudad' => $empresaConfig['ciudad'],
                'pais' => $empresaConfig['pais'],
                'mensaje_footer' => $empresaConfig['mensaje_footer'],
                'mensaje_legal' => $empresaConfig['mensaje_legal'],
                'activo' => $empresaConfig['activo'],
                'es_principal' => $empresaConfig['es_principal'],
                'configuracion_impresion' => $empresaConfig['configuracion_impresion'],
            ]
        );

        $this->command->info('  ✓ Empresa: ' . $empresa->nombre_comercial . ' (NIT: ' . $empresa->nit . ')');

        return $empresa;
    }

    /**
     * Crear o actualizar plantillas de impresión
     */
    private function crearOActualizarPlantillas(Empresa $empresa): void
    {
        $this->command->info('🎨 Procesando plantillas de impresión...');

        $todasPlantillas = $this->getPlantillasConfiguration();

        foreach ($todasPlantillas as $plantilla) {
            PlantillaImpresion::updateOrCreate(
                [
                    'codigo' => $plantilla['codigo'],
                    'empresa_id' => $empresa->id,
                ],
                [
                    'nombre' => $plantilla['nombre'],
                    'tipo_documento' => $plantilla['tipo_documento'],
                    'formato' => $plantilla['formato'],
                    'vista_blade' => $plantilla['vista_blade'],
                    'es_default' => $plantilla['es_default'],
                    'orden' => $plantilla['orden'],
                    'activo' => true,
                ]
            );

            $this->command->info('  ✓ Plantilla: ' . $plantilla['nombre']);
        }

        $this->command->info('');
        $this->command->info('📊 Resumen:');
        $this->command->info('  - ' . count($todasPlantillas) . ' Plantillas de impresión procesadas');
    }

    /**
     * Configuración centralizada de empresa
     */
    /* private function getEmpresaConfiguration(): array
    {
        return [
            'nombre_comercial' => 'Farmacia Orellana',
            'razon_social' => 'Farmacia Orellana',
            'nit' => '123456789',
            'telefono' => '+591 2 1234567',
            'email' => 'info@farmaciaorellana.com',
            'sitio_web' => 'www.farmaciaorellana.com',
            'direccion' => 'Av. Principal #123',
            'ciudad' => 'La Paz',
            'pais' => 'Bolivia',
            'mensaje_footer' => 'Gracias por su preferencia',
            'mensaje_legal' => 'Este documento es una representación impresa de un documento electrónico.',
            'activo' => true,
            'es_principal' => true,
            'configuracion_impresion' => [
                'formatos_soportados' => ['A4', 'TICKET_58', 'TICKET_80'],
                'formato_default' => 'A4',
                'margen_ticket' => '2mm',
                'margen_hoja' => '10mm',
                'mostrar_logo_ticket' => true,
                'mostrar_logo_hoja' => true,
                'fuente_ticket' => 'Courier New',
                'fuente_hoja' => 'Arial',
                'tamaño_fuente_ticket' => '8px',
                'tamaño_fuente_hoja' => '10px',
            ],
        ];
    } */

    private function getEmpresaConfiguration(): array
    {
        return [
            'nombre_comercial' => 'Distribuidora Paucara',
            'razon_social' => 'Distribuidora Paucara S.R.L.',
            'nit' => '123456789',
            'telefono' => '+591 2 1234567',
            'email' => 'info@distribuidorapaucara.com',
            'sitio_web' => 'www.distribuidorapaucara.com',
            'direccion' => 'Av. Principal #123',
            'ciudad' => 'La Paz',
            'pais' => 'Bolivia',
            'mensaje_footer' => 'Gracias por su preferencia',
            'mensaje_legal' => 'Este documento es una representación impresa de un documento electrónico.',
            'activo' => true,
            'es_principal' => true,
            'configuracion_impresion' => [
                'formatos_soportados' => ['A4', 'TICKET_58', 'TICKET_80'],
                'formato_default' => 'A4',
                'margen_ticket' => '2mm',
                'margen_hoja' => '10mm',
                'mostrar_logo_ticket' => true,
                'mostrar_logo_hoja' => true,
                'fuente_ticket' => 'Courier New',
                'fuente_hoja' => 'Arial',
                'tamaño_fuente_ticket' => '8px',
                'tamaño_fuente_hoja' => '10px',
            ],
        ];
    }

    /**
     * Configuración centralizada de plantillas de impresión
     */
    private function getPlantillasConfiguration(): array
    {
        return [
            // Plantillas de VENTAS
            [
                'codigo' => 'VENTA_A4',
                'nombre' => 'Factura Hoja Completa A4',
                'tipo_documento' => 'venta',
                'formato' => 'A4',
                'vista_blade' => 'impresion.ventas.hoja-completa',
                'es_default' => true,
                'orden' => 1,
            ],
            [
                'codigo' => 'VENTA_TICKET_80',
                'nombre' => 'Ticket de Venta 80mm',
                'tipo_documento' => 'venta',
                'formato' => 'TICKET_80',
                'vista_blade' => 'impresion.ventas.ticket-80',
                'es_default' => false,
                'orden' => 2,
            ],
            [
                'codigo' => 'VENTA_TICKET_58',
                'nombre' => 'Ticket de Venta 58mm',
                'tipo_documento' => 'venta',
                'formato' => 'TICKET_58',
                'vista_blade' => 'impresion.ventas.ticket-58',
                'es_default' => false,
                'orden' => 3,
            ],

            // Plantillas de PROFORMAS
            [
                'codigo' => 'PROFORMA_A4',
                'nombre' => 'Proforma Hoja Completa A4',
                'tipo_documento' => 'proforma',
                'formato' => 'A4',
                'vista_blade' => 'impresion.proformas.hoja-completa',
                'es_default' => true,
                'orden' => 1,
            ],
            [
                'codigo' => 'PROFORMA_TICKET_80',
                'nombre' => 'Proforma Ticket 80mm',
                'tipo_documento' => 'proforma',
                'formato' => 'TICKET_80',
                'vista_blade' => 'impresion.proformas.ticket-80',
                'es_default' => false,
                'orden' => 2,
            ],

            // Plantillas de ENVÍOS
            [
                'codigo' => 'ENVIO_A4',
                'nombre' => 'Guía de Remisión A4',
                'tipo_documento' => 'envio',
                'formato' => 'A4',
                'vista_blade' => 'impresion.envios.guia-remision-a4',
                'es_default' => true,
                'orden' => 1,
            ],
            [
                'codigo' => 'ENVIO_TICKET_80',
                'nombre' => 'Guía de Remisión Ticket 80mm',
                'tipo_documento' => 'envio',
                'formato' => 'TICKET_80',
                'vista_blade' => 'impresion.envios.guia-remision-ticket',
                'es_default' => false,
                'orden' => 2,
            ],

            // Plantillas de REPORTES
            [
                'codigo' => 'REPORTE_INVENTARIO_A4',
                'nombre' => 'Reporte de Inventario A4',
                'tipo_documento' => 'reporte_inventario',
                'formato' => 'A4',
                'vista_blade' => 'impresion.reportes.inventario-a4',
                'es_default' => true,
                'orden' => 1,
            ],
            [
                'codigo' => 'REPORTE_VENTAS_A4',
                'nombre' => 'Reporte de Ventas A4',
                'tipo_documento' => 'reporte_ventas',
                'formato' => 'A4',
                'vista_blade' => 'impresion.reportes.ventas-a4',
                'es_default' => true,
                'orden' => 1,
            ],
        ];
    }
}

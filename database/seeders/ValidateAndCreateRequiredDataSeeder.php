<?php

namespace Database\Seeders;

use App\Models\EstadoMerma;
use App\Models\TipoAjusteInventario;
use App\Models\TipoMerma;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

/**
 * Seeder de Validación de Datos Críticos
 *
 * Este seeder verifica que todos los datos críticos del sistema existan en la BD.
 * Si alguno falta, lo crea automáticamente.
 *
 * Datos que valida:
 * - Tipos de Ajuste de Inventario (INVENTARIO_INICIAL, AJUSTE_FISICO, etc)
 * - Estados de Merma (REGISTRADA, APROBADA, RECHAZADA)
 * - Tipos de Merma (ROTURA, VENCIMIENTO, HURTO, etc)
 *
 * Uso:
 * php artisan db:seed --class=ValidateAndCreateRequiredDataSeeder
 */
class ValidateAndCreateRequiredDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🔍 Validando datos críticos del sistema...');

        $this->validateTiposAjusteInventario();
        $this->validateEstadosMerma();
        $this->validateTiposMerma();

        $this->command->info('✅ Validación completada');
    }

    /**
     * Validar y crear Tipos de Ajuste de Inventario
     */
    private function validateTiposAjusteInventario(): void
    {
        $this->command->line('');
        $this->command->info('📦 Validando Tipos de Ajuste de Inventario...');

        $tiposNecesarios = [
            [
                'clave'       => 'INVENTARIO_INICIAL',
                'label'       => 'Inventario Inicial',
                'nombre'      => 'Inventario Inicial',
                'descripcion' => 'Carga inicial de inventario al implementar el sistema',
                'es_entrada'  => true,
            ],
            [
                'clave'       => 'AJUSTE_FISICO',
                'label'       => 'Ajuste Físico',
                'nombre'      => 'Ajuste Físico',
                'descripcion' => 'Ajuste por diferencia entre conteo físico y sistema',
                'es_entrada'  => null, // Puede ser entrada o salida
            ],
            [
                'clave'       => 'DONACION',
                'label'       => 'Donación',
                'nombre'      => 'Donación',
                'descripcion' => 'Salida por donación de productos',
                'es_entrada'  => false,
            ],
            [
                'clave'       => 'CORRECCION',
                'label'       => 'Corrección',
                'nombre'      => 'Corrección',
                'descripcion' => 'Corrección de errores en inventario',
                'es_entrada'  => null,
            ],
        ];

        foreach ($tiposNecesarios as $tipo) {
            $existe = TipoAjusteInventario::where('clave', $tipo['clave'])->exists();

            if ($existe) {
                $this->command->line("  ✅ {$tipo['clave']}: Existe");
            } else {
                TipoAjusteInventario::create($tipo);
                $this->command->line("  ➕ {$tipo['clave']}: Creado");
                Log::info("TipoAjusteInventario creado: {$tipo['clave']}");
            }
        }
    }

    /**
     * Validar y crear Estados de Merma
     */
    private function validateEstadosMerma(): void
    {
        $this->command->line('');
        $this->command->info('🗑️  Validando Estados de Merma...');

        $estadosNecesarios = [
            [
                'clave' => 'REGISTRADA',
                'label' => 'Registrada',
                'color' => '#FFB800',
                'bg_color' => '#FFF3CD',
                'text_color' => '#856404',
            ],
            [
                'clave' => 'APROBADA',
                'label' => 'Aprobada',
                'color' => '#28A745',
                'bg_color' => '#D4EDDA',
                'text_color' => '#155724',
            ],
            [
                'clave' => 'RECHAZADA',
                'label' => 'Rechazada',
                'color' => '#DC3545',
                'bg_color' => '#F8D7DA',
                'text_color' => '#721C24',
            ],
        ];

        foreach ($estadosNecesarios as $estado) {
            $existe = EstadoMerma::where('clave', $estado['clave'])->exists();

            if ($existe) {
                $this->command->line("  ✅ {$estado['clave']}: Existe");
            } else {
                EstadoMerma::create($estado);
                $this->command->line("  ➕ {$estado['clave']}: Creado");
                Log::info("EstadoMerma creado: {$estado['clave']}");
            }
        }
    }

    /**
     * Validar y crear Tipos de Merma
     */
    private function validateTiposMerma(): void
    {
        $this->command->line('');
        $this->command->info('🏷️  Validando Tipos de Merma...');

        $tiposNecesarios = [
            [
                'clave' => 'ROTURA',
                'label' => 'Rotura',
                'descripcion' => 'Producto dañado o roto',
            ],
            [
                'clave' => 'VENCIMIENTO',
                'label' => 'Vencimiento',
                'descripcion' => 'Producto vencido',
            ],
            [
                'clave' => 'HURTO',
                'label' => 'Hurto',
                'descripcion' => 'Producto extraviado o hurtado',
            ],
            [
                'clave' => 'DEVOLUCION',
                'label' => 'Devolución',
                'descripcion' => 'Devolución de cliente',
            ],
            [
                'clave' => 'OBSOLETO',
                'label' => 'Obsoleto',
                'descripcion' => 'Producto obsoleto o descontinuado',
            ],
            [
                'clave' => 'OTRO',
                'label' => 'Otro',
                'descripcion' => 'Otro tipo de merma',
            ],
        ];

        foreach ($tiposNecesarios as $tipo) {
            $existe = TipoMerma::where('clave', $tipo['clave'])->exists();

            if ($existe) {
                $this->command->line("  ✅ {$tipo['clave']}: Existe");
            } else {
                TipoMerma::create($tipo);
                $this->command->line("  ➕ {$tipo['clave']}: Creado");
                Log::info("TipoMerma creado: {$tipo['clave']}");
            }
        }
    }
}

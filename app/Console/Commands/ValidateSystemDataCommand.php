<?php

namespace App\Console\Commands;

use App\Models\EstadoMerma;
use App\Models\TipoAjusteInventario;
use App\Models\TipoMerma;
use Illuminate\Console\Command;

class ValidateSystemDataCommand extends Command
{
    protected $signature = 'validate:system-data {--fix : Crear datos faltantes automáticamente}';

    protected $description = 'Valida que todos los datos críticos del sistema existan en la BD';

    public function handle(): int
    {
        $this->info('🔍 Validando datos críticos del sistema...');
        $this->line('');

        $totalValidaciones = 0;
        $datosCreados = 0;

        // Validar Tipos de Ajuste
        [$validaciones, $creados] = $this->validateTiposAjuste();
        $totalValidaciones += $validaciones;
        $datosCreados += $creados;

        // Validar Estados de Merma
        [$validaciones, $creados] = $this->validateEstadosMerma();
        $totalValidaciones += $validaciones;
        $datosCreados += $creados;

        // Validar Tipos de Merma
        [$validaciones, $creados] = $this->validateTiposMerma();
        $totalValidaciones += $validaciones;
        $datosCreados += $creados;

        $this->line('');
        $this->info("✅ Validación completada");
        $this->info("  - Validaciones: $totalValidaciones");
        $this->info("  - Datos creados: $datosCreados");

        return 0;
    }

    private function validateTiposAjuste(): array
    {
        $this->info('📦 Tipos de Ajuste de Inventario:');

        $tiposNecesarios = [
            ['clave' => 'INVENTARIO_INICIAL', 'label' => 'Inventario Inicial', 'es_entrada' => true],
            ['clave' => 'AJUSTE_FISICO', 'label' => 'Ajuste Físico', 'es_entrada' => null],
            ['clave' => 'DONACION', 'label' => 'Donación', 'es_entrada' => false],
            ['clave' => 'CORRECCION', 'label' => 'Corrección', 'es_entrada' => null],
        ];

        $validaciones = 0;
        $creados = 0;

        foreach ($tiposNecesarios as $tipo) {
            $existe = TipoAjusteInventario::where('clave', $tipo['clave'])->exists();
            $validaciones++;

            if ($existe) {
                $this->line("  ✅ {$tipo['clave']}");
            } else {
                $this->line("  ❌ {$tipo['clave']} - FALTANTE");
                if ($this->option('fix')) {
                    TipoAjusteInventario::create([
                        'clave' => $tipo['clave'],
                        'label' => $tipo['label'],
                        'nombre' => $tipo['label'],
                        'descripcion' => "Tipo de ajuste: {$tipo['label']}",
                        'es_entrada' => $tipo['es_entrada'],
                    ]);
                    $this->line("    ➕ Creado automáticamente");
                    $creados++;
                }
            }
        }

        return [$validaciones, $creados];
    }

    private function validateEstadosMerma(): array
    {
        $this->line('');
        $this->info('🗑️  Estados de Merma:');

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

        $validaciones = 0;
        $creados = 0;

        foreach ($estadosNecesarios as $estado) {
            $existe = EstadoMerma::where('clave', $estado['clave'])->exists();
            $validaciones++;

            if ($existe) {
                $this->line("  ✅ {$estado['clave']}");
            } else {
                $this->line("  ❌ {$estado['clave']} - FALTANTE");
                if ($this->option('fix')) {
                    EstadoMerma::create($estado);
                    $this->line("    ➕ Creado automáticamente");
                    $creados++;
                }
            }
        }

        return [$validaciones, $creados];
    }

    private function validateTiposMerma(): array
    {
        $this->line('');
        $this->info('🏷️  Tipos de Merma:');

        $tiposNecesarios = [
            ['clave' => 'ROTURA', 'label' => 'Rotura', 'descripcion' => 'Producto dañado o roto'],
            ['clave' => 'VENCIMIENTO', 'label' => 'Vencimiento', 'descripcion' => 'Producto vencido'],
            ['clave' => 'HURTO', 'label' => 'Hurto', 'descripcion' => 'Producto extraviado o hurtado'],
            ['clave' => 'DEVOLUCION', 'label' => 'Devolución', 'descripcion' => 'Devolución de cliente'],
            ['clave' => 'OBSOLETO', 'label' => 'Obsoleto', 'descripcion' => 'Producto obsoleto o descontinuado'],
            ['clave' => 'OTRO', 'label' => 'Otro', 'descripcion' => 'Otro tipo de merma'],
        ];

        $validaciones = 0;
        $creados = 0;

        foreach ($tiposNecesarios as $tipo) {
            $existe = TipoMerma::where('clave', $tipo['clave'])->exists();
            $validaciones++;

            if ($existe) {
                $this->line("  ✅ {$tipo['clave']}");
            } else {
                $this->line("  ❌ {$tipo['clave']} - FALTANTE");
                if ($this->option('fix')) {
                    TipoMerma::create($tipo);
                    $this->line("    ➕ Creado automáticamente");
                    $creados++;
                }
            }
        }

        return [$validaciones, $creados];
    }
}

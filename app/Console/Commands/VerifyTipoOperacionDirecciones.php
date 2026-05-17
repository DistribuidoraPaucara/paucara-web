<?php

namespace App\Console\Commands;

use App\Models\TipoOperacionCaja;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

class VerifyTipoOperacionDirecciones extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'verify:tipo-operacion-direcciones';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Verifica el estado de las direcciones en tipo_operacion_caja';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('📋 Verificando estado de tipo_operacion_caja...');
        $this->newLine();

        // Obtener todos los tipos
        $tipos = TipoOperacionCaja::all();

        if ($tipos->isEmpty()) {
            $this->error('❌ No hay tipos de operación registrados!');
            return self::FAILURE;
        }

        // Contar por dirección
        $conDireccion = $tipos->filter(fn($t) => !is_null($t->direccion))->count();
        $sinDireccion = $tipos->filter(fn($t) => is_null($t->direccion))->count();

        // Mostrar resumen
        $this->line("Total de tipos: <fg=cyan>{$tipos->count()}</>");
        $this->line("Con dirección: <fg=green>✅ {$conDireccion}</>");
        $this->line("Sin dirección: <fg=red>❌ {$sinDireccion}</>");
        $this->newLine();

        // Mostrar tabla por dirección
        $porDireccion = $tipos->groupBy('direccion');

        foreach (['ENTRADA', 'SALIDA', 'AJUSTE', 'ESPECIAL'] as $dir) {
            if ($porDireccion->has($dir)) {
                $items = $porDireccion[$dir];
                $emoji = match ($dir) {
                    'ENTRADA' => '📥',
                    'SALIDA' => '📤',
                    'AJUSTE' => '🔧',
                    'ESPECIAL' => '🔐',
                    default => '❓'
                };

                $this->line("<fg=cyan>{$emoji} {$dir}</>");
                foreach ($items as $tipo) {
                    $this->line("   • {$tipo->codigo} - {$tipo->nombre}");
                }
                $this->newLine();
            }
        }

        // Mostrar sin dirección si hay
        if ($sinDireccion > 0) {
            $this->line('<fg=red>❌ SIN DIRECCIÓN</fg=red>');
            $tipos->filter(fn($t) => is_null($t->direccion))
                ->each(fn($t) => $this->line("   • {$t->codigo} - {$t->nombre}"));
            $this->newLine();

            $this->warn('⚠️  Hay tipos sin dirección asignada!');
            $this->line('Ejecuta: <fg=cyan>php artisan seed:tipo-operacion-direcciones</fg=cyan>');
            return self::FAILURE;
        }

        $this->info('✅ Todas las direcciones están correctamente asignadas!');
        $this->line('CierreCajaService puede funcionar sin problemas.');
        return self::SUCCESS;
    }
}

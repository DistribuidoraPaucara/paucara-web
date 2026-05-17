<?php

namespace App\Console\Commands;

use App\Models\Empresa;
use Illuminate\Console\Command;

class ActivarProductosFraccionados extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'empresas:activar-productos-fraccionados
                            {--empresa-id= : ID específico de empresa (opcional)}
                            {--all : Activar para todas las empresas}';

    /**
     * The name and description of the console command.
     *
     * @var string
     */
    protected $description = 'Activa la opción de productos fraccionados en una o varias empresas';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $empresaId = $this->option('empresa-id');
        $activarTodas = $this->option('all');

        $this->info('🚀 Activando productos fraccionados...');
        $this->newLine();

        // Obtener empresas
        if ($empresaId) {
            $empresas = Empresa::where('id', $empresaId)->get();

            if ($empresas->isEmpty()) {
                $this->error("❌ Empresa con ID {$empresaId} no encontrada");
                return 1;
            }
        } elseif ($activarTodas) {
            $empresas = Empresa::where('activo', true)->get();
        } else {
            // Mostrar listado y pedir selección
            $empresas = Empresa::where('activo', true)->get();

            if ($empresas->isEmpty()) {
                $this->warn('⚠️  No hay empresas activas');
                return 1;
            }

            $this->line('📦 Empresas disponibles:');
            foreach ($empresas as $index => $empresa) {
                $estado = $empresa->permite_productos_fraccionados ? '✅ ACTIVADA' : '❌ INACTIVA';
                $this->line("  {$index}. [{$empresa->id}] {$empresa->nombre} - {$estado}");
            }
            $this->newLine();
        }

        // Actualizar empresas
        $actualizadas = 0;
        $yaActivas = 0;

        foreach ($empresas as $empresa) {
            if (!$empresa->permite_productos_fraccionados) {
                $empresa->update(['permite_productos_fraccionados' => true]);
                $this->line("✅ {$empresa->nombre} (ID: {$empresa->id}) - Activada");
                $actualizadas++;
            } else {
                $this->line("ℹ️  {$empresa->nombre} (ID: {$empresa->id}) - Ya estaba activada");
                $yaActivas++;
            }
        }

        $this->newLine();
        $this->info('✅ Proceso completado!');
        $this->line("  • Activadas: {$actualizadas}");
        $this->line("  • Ya activas: {$yaActivas}");
        $this->newLine();

        if ($actualizadas > 0) {
            $this->info('🎉 Los usuarios de estas empresas ya pueden crear productos fraccionados!');
        }

        return 0;
    }
}

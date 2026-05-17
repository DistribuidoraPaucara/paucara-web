<?php

namespace Database\Seeders;

use App\Models\Empresa;
use Illuminate\Database\Seeder;

class ActivarProductosFraccionadosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚀 Activando productos fraccionados...');
        $this->command->newLine();

        // Obtener todas las empresas activas
        $empresas = Empresa::where('activo', true)->get();

        if ($empresas->isEmpty()) {
            $this->command->warn('⚠️  No hay empresas activas');
            return;
        }

        $this->command->line("📦 Empresas encontradas: {$empresas->count()}");

        foreach ($empresas as $empresa) {
            if (!$empresa->permite_productos_fraccionados) {
                $empresa->update(['permite_productos_fraccionados' => true]);
                $this->command->line("  ✅ {$empresa->nombre} - Activada");
            } else {
                $this->command->line("  ℹ️  {$empresa->nombre} - Ya estaba activada");
            }
        }

        $this->command->newLine();
        $this->command->info('✅ Productos fraccionados activados para todas las empresas!');
    }
}

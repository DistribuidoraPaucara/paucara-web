<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class VerifyEstadosLogistica extends Command
{
    protected $signature = 'verify:estados-logistica';
    protected $description = 'Verify that all required estados_logistica exist';

    public function handle()
    {
        $this->info("\n╔════════════════════════════════════════════════════════════════════╗");
        $this->info("║          VERIFICACIÓN DE ESTADOS LOGÍSTICOS                     ║");
        $this->info("╚════════════════════════════════════════════════════════════════════╝\n");

        // Verificar categorías
        $categorias = DB::table('estados_logistica')
            ->distinct('categoria')
            ->pluck('categoria')
            ->toArray();

        $this->info("📋 Categorías encontradas:");
        foreach ($categorias as $cat) {
            $this->line("   ✓ $cat");
        }
        $this->line("");

        // Verificar estados de entrega
        $this->info("🔍 Estados ENTREGA_LOGISTICA:");
        $estadosEntrega = DB::table('estados_logistica')
            ->where('categoria', 'entrega')
            ->orderBy('orden')
            ->get(['id', 'codigo', 'nombre']);

        if ($estadosEntrega->isEmpty()) {
            $this->error("❌ NO hay estados en entrega!");
            $this->warn("   Debes ejecutar: php artisan migrate");
            return 1;
        }

        foreach ($estadosEntrega as $estado) {
            $this->line("   [ID: {$estado->id}] {$estado->codigo} → {$estado->nombre}");
        }
        $this->line("");

        // Verificar estado PROGRAMADO específicamente
        $this->info("🔍 Buscando PROGRAMADO en entrega...");
        $programado = DB::table('estados_logistica')
            ->where('codigo', 'PROGRAMADO')
            ->where('categoria', 'entrega')
            ->first();

        if ($programado) {
            $this->info("✅ Estado PROGRAMADO encontrado:");
            $this->line("   ID: {$programado->id}");
            $this->line("   Código: {$programado->codigo}");
            $this->line("   Nombre: {$programado->nombre}");
        } else {
            $this->error("❌ Estado PROGRAMADO NO encontrado en entrega");
            $this->error("   Debes ejecutar: php artisan migrate");
            return 1;
        }

        $this->line("");

        // Verificar estados de venta_logistica
        $this->info("🔍 Estados VENTA_LOGISTICA:");
        $estadosVenta = DB::table('estados_logistica')
            ->where('categoria', 'venta_logistica')
            ->orderBy('orden')
            ->get(['id', 'codigo', 'nombre']);

        if ($estadosVenta->isEmpty()) {
            $this->error("❌ NO hay estados en venta_logistica!");
        } else {
            foreach ($estadosVenta as $estado) {
                $this->line("   [ID: {$estado->id}] {$estado->codigo} → {$estado->nombre}");
            }
        }

        $this->line("");
        $this->info("✅ Verificación completada\n");

        return 0;
    }
}

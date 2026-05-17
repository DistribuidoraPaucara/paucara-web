<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MovimientoInventario;

class VerMovimientos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ver:movimientos {--tipo=CONSUMO_RESERVA} {--numero=VEN20260212-0207} {--limit=30}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ver movimientos de inventario con filtros';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tipo = $this->option('tipo');
        $numero = $this->option('numero');
        $limit = $this->option('limit');

        $this->info("🔍 Buscando movimientos...\n");

        $query = MovimientoInventario::query();

        if ($tipo) {
            if ($tipo === 'CONSUMO_RESERVA' || $tipo === 'RESERVA_PROFORMA') {
                $query->where('tipo', $tipo);
            } else {
                $query->where('tipo', 'LIKE', $tipo . '%');
            }
            $this->info("✅ Filtro tipo: {$tipo}");
        }

        if ($numero) {
            $query->where('numero_documento', 'LIKE', "%{$numero}%");
            $this->info("✅ Filtro número: {$numero}");
        }

        $movimientos = $query
            ->with('stockProducto.producto')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $this->info("Total encontrado: " . $movimientos->count() . "\n");

        if ($movimientos->isEmpty()) {
            $this->warn("❌ No se encontraron movimientos");
            return Command::FAILURE;
        }

        $headers = [
            'ID',
            'Número Documento',
            'Tipo',
            'Stock ID',
            'Producto',
            'Cantidad',
            'Anterior',
            'Posterior',
            'Fecha',
        ];

        $rows = [];
        foreach ($movimientos as $mov) {
            $rows[] = [
                $mov->id,
                $mov->numero_documento ?? '(NULL)',
                $mov->tipo,
                $mov->stock_producto_id,
                $mov->stockProducto?->producto?->nombre ?? 'N/A',
                $mov->cantidad,
                $mov->cantidad_anterior,
                $mov->cantidad_posterior,
                $mov->created_at->format('Y-m-d H:i:s'),
            ];
        }

        $this->table($headers, $rows);

        // Mostrar JSON completo del primero
        if ($movimientos->isNotEmpty()) {
            $this->info("\n📋 Detalles del primer movimiento:");
            $primer = $movimientos->first();
            $this->line("ID: {$primer->id}");
            $this->line("Número Documento: " . ($primer->numero_documento ?? '(NULL)'));
            $this->line("Tipo: {$primer->tipo}");
            $this->line("Observación: " . (substr($primer->observacion, 0, 100) ?? 'N/A'));
            $this->line("Referencia: {$primer->referencia_tipo} ID {$primer->referencia_id}");
        }

        return Command::SUCCESS;
    }
}

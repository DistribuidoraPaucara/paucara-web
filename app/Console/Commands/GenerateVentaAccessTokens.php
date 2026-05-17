<?php

namespace App\Console\Commands;

use App\Models\Venta;
use App\Models\VentaAccessToken;
use Illuminate\Console\Command;

class GenerateVentaAccessTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-venta-access-tokens';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate access tokens for ventas that dont have one';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Generating access tokens for ventas without token...');

        // Obtener ventas sin token
        $ventasSinToken = Venta::whereDoesntHave('accessToken')->get();

        $count = $ventasSinToken->count();

        if ($count === 0) {
            $this->info('✅ All ventas already have access tokens!');
            return 0;
        }

        $this->info("Found {$count} ventas without tokens. Generating...");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($ventasSinToken as $venta) {
            VentaAccessToken::create([
                'venta_id' => $venta->id,
                'token' => VentaAccessToken::generateToken(),
                'is_active' => true,
            ]);

            $bar->advance();
        }

        $bar->finish();

        $this->newLine();
        $this->info("✅ Successfully generated {$count} access tokens!");

        return 0;
    }
}

<?php

namespace App\Console\Commands;

use App\Models\Proforma;
use App\Models\ReservaProforma;
use App\Models\User;
use Illuminate\Console\Command;

class TestReservaProforma extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-reserva-proforma {proforma_id? : ID de la proforma a probar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test reservarStock() method with authenticated user context';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get first user or create test context
        $user = User::first();
        if (!$user) {
            $this->error('❌ No users found in database');
            return 1;
        }

        $this->info("✅ Using user: {$user->name} (ID: {$user->id})");

        // Authenticate user for this command
        auth()->login($user);

        // Get proforma ID from argument or use the most recent
        $proformaId = $this->argument('proforma_id') ?? Proforma::latest()->first()?->id;

        if (!$proformaId) {
            $this->error('❌ No proformas found. Please provide a proforma_id or create one first.');
            return 1;
        }

        $proforma = Proforma::find($proformaId);
        if (!$proforma) {
            $this->error("❌ Proforma with ID {$proformaId} not found");
            return 1;
        }

        $this->info("\n📋 Testing Proforma #{$proforma->id}");
        $this->info("   Estado: {$proforma->estado}");
        $this->info("   Detalles: {$proforma->detalles->count()}");

        // Check current reservas
        $existingReservas = ReservaProforma::where('proforma_id', $proforma->id)->count();
        $this->info("   Reservas actuales: {$existingReservas}");

        // Call reservarStock()
        $this->line("\n🔄 Llamando a reservarStock()...");
        $resultado = $proforma->reservarStock();

        if ($resultado) {
            $this->info("✅ reservarStock() retornó TRUE");

            // Check reservas after
            $newReservas = ReservaProforma::where('proforma_id', $proforma->id)->count();
            $this->info("   Reservas después: {$newReservas}");

            // Show reserva details
            $reservas = ReservaProforma::where('proforma_id', $proforma->id)
                ->with(['stockProducto.producto'])
                ->get();

            $this->table(
                ['ID', 'Producto', 'Cantidad', 'Estado', 'Expira'],
                $reservas->map(fn($r) => [
                    $r->id,
                    $r->stockProducto->producto->nombre ?? 'N/A',
                    $r->cantidad_reservada,
                    $r->estado,
                    $r->fecha_expiracion->format('Y-m-d H:i'),
                ])
            );

            return 0;
        } else {
            $this->error("❌ reservarStock() retornó FALSE");

            // Check logs for errors
            $this->line("\n📊 Checking for errors in logs...");
            $this->info("Run: tail -100 storage/logs/laravel.log | grep -i error");

            return 1;
        }
    }
}

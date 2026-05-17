<?php

namespace App\Jobs;

use App\Models\ReservaStock;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class LiberarReservasVencidasJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        //
    }

    public function handle(): void
    {
        try {
            $reservasLiberadas = ReservaStock::liberarReservasVencidas();

            if ($reservasLiberadas > 0) {
                Log::info("Job LiberarReservasVencidasJob: Se liberaron {$reservasLiberadas} reservas vencidas");
            }

        } catch (\Exception $e) {
            Log::error("Error en LiberarReservasVencidasJob: " . $e->getMessage());
            throw $e;
        }
    }
}
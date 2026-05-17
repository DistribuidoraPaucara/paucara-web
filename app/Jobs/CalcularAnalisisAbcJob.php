<?php

namespace App\Jobs;

use App\Models\AnalisisAbc;
use App\Models\Almacen;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CalcularAnalisisAbcJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $almacenId;
    public $ano;
    public $mes;

    public function __construct($almacenId = null, $ano = null, $mes = null)
    {
        $this->almacenId = $almacenId;
        $this->ano = $ano ?? date('Y');
        $this->mes = $mes;
    }

    public function handle(): void
    {
        try {
            if ($this->almacenId) {
                // Calcular para un almacén específico
                $this->calcularParaAlmacen($this->almacenId);
            } else {
                // Calcular para todos los almacenes
                $almacenes = Almacen::all();
                foreach ($almacenes as $almacen) {
                    $this->calcularParaAlmacen($almacen->id);
                }
            }

            Log::info("Job CalcularAnalisisAbcJob completado para periodo: {$this->ano}" . ($this->mes ? "/{$this->mes}" : ""));

        } catch (\Exception $e) {
            Log::error("Error en CalcularAnalisisAbcJob: " . $e->getMessage());
            throw $e;
        }
    }

    private function calcularParaAlmacen($almacenId): void
    {
        $almacen = Almacen::find($almacenId);
        if (!$almacen) {
            Log::warning("Almacén ID {$almacenId} no encontrado en CalcularAnalisisAbcJob");
            return;
        }

        try {
            $resultado = AnalisisAbc::calcularAnalisisABC($almacenId, $this->ano, $this->mes);

            if ($resultado) {
                $resumen = AnalisisAbc::obtenerResumen($almacenId, $this->ano);
                Log::info("Análisis ABC calculado para almacén '{$almacen->nombre}': {$resumen['total_productos']} productos analizados");
            } else {
                Log::warning("No se encontraron datos de ventas para almacén '{$almacen->nombre}' en periodo {$this->ano}" . ($this->mes ? "/{$this->mes}" : ""));
            }

        } catch (\Exception $e) {
            Log::error("Error calculando análisis ABC para almacén '{$almacen->nombre}': " . $e->getMessage());
            // No re-lanzar la excepción para que continúe con otros almacenes
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("CalcularAnalisisAbcJob falló: " . $exception->getMessage());
    }
}
<?php

namespace App\Console\Commands;

use App\Models\ConteoFisico;
use App\Models\Almacen;
use Illuminate\Console\Command;

class GenerarConteosCiclicosCommand extends Command
{
    protected $signature = 'inventario:generar-conteos-ciclicos
                            {--almacen= : ID del almacén específico}
                            {--frecuencia=30 : Frecuencia en días para los conteos}
                            {--forzar : Generar conteos aunque ya existan programados}';

    protected $description = 'Genera conteos cíclicos automáticos para almacenes';

    public function handle()
    {
        $almacenId = $this->option('almacen');
        $frecuencia = (int) $this->option('frecuencia');
        $forzar = $this->option('forzar');

        $this->info('🔄 Iniciando generación de conteos cíclicos...');

        if ($almacenId) {
            $almacenes = Almacen::where('id', $almacenId)->get();
            if ($almacenes->isEmpty()) {
                $this->error("❌ No se encontró el almacén con ID: {$almacenId}");
                return self::FAILURE;
            }
        } else {
            $almacenes = Almacen::all();
        }

        if ($almacenes->isEmpty()) {
            $this->error('❌ No se encontraron almacenes para procesar');
            return self::FAILURE;
        }

        $totalConteosGenerados = 0;

        foreach ($almacenes as $almacen) {
            $this->info("📦 Procesando almacén: {$almacen->nombre}");

            // Verificar si ya hay conteos programados para las próximas 4 semanas
            $conteosPendientes = ConteoFisico::where('almacen_id', $almacen->id)
                                            ->where('tipo_conteo', ConteoFisico::TIPO_CICLICO)
                                            ->whereIn('estado', [ConteoFisico::ESTADO_PLANIFICADO, ConteoFisico::ESTADO_EN_PROGRESO])
                                            ->whereBetween('fecha_programada', [now(), now()->addWeeks(4)])
                                            ->count();

            if ($conteosPendientes > 0 && !$forzar) {
                $this->warn("⚠️  El almacén '{$almacen->nombre}' ya tiene {$conteosPendientes} conteos cíclicos programados");
                $this->warn("   Usa --forzar para generar conteos adicionales");
                continue;
            }

            try {
                $conteosProgramados = ConteoFisico::programarConteosCiclicos($almacen->id, $frecuencia);

                if ($conteosProgramados && count($conteosProgramados) > 0) {
                    $cantidad = count($conteosProgramados);
                    $this->info("✅ Generados {$cantidad} conteos cíclicos para '{$almacen->nombre}'");

                    // Mostrar detalles de los conteos generados
                    $this->table(
                        ['Código', 'Fecha Programada', 'Descripción'],
                        collect($conteosProgramados)->map(function($conteo) {
                            return [
                                $conteo->codigo_conteo,
                                $conteo->fecha_programada->format('Y-m-d'),
                                $conteo->descripcion,
                            ];
                        })->toArray()
                    );

                    $totalConteosGenerados += $cantidad;
                } else {
                    $this->warn("⚠️  No se pudieron generar conteos para '{$almacen->nombre}' (posiblemente sin productos)");
                }

            } catch (\Exception $e) {
                $this->error("❌ Error procesando almacén '{$almacen->nombre}': " . $e->getMessage());
            }
        }

        if ($totalConteosGenerados > 0) {
            $this->info("🎉 Proceso completado: {$totalConteosGenerados} conteos cíclicos generados en total");

            // Mostrar resumen de próximos conteos
            $this->mostrarResumenProximosConteos();

            return self::SUCCESS;
        } else {
            $this->warn('⚠️  No se generaron nuevos conteos cíclicos');
            return self::SUCCESS;
        }
    }

    private function mostrarResumenProximosConteos(): void
    {
        $this->info("\n📅 Resumen de conteos programados para las próximas 2 semanas:");

        $proximosConteos = ConteoFisico::with(['almacen'])
                                     ->whereIn('estado', [ConteoFisico::ESTADO_PLANIFICADO, ConteoFisico::ESTADO_EN_PROGRESO])
                                     ->whereBetween('fecha_programada', [now(), now()->addWeeks(2)])
                                     ->orderBy('fecha_programada')
                                     ->get();

        if ($proximosConteos->isNotEmpty()) {
            $this->table(
                ['Fecha', 'Código', 'Almacén', 'Tipo', 'Estado'],
                $proximosConteos->map(function($conteo) {
                    return [
                        $conteo->fecha_programada->format('Y-m-d'),
                        $conteo->codigo_conteo,
                        $conteo->almacen->nombre,
                        ucfirst($conteo->tipo_conteo),
                        ucfirst(str_replace('_', ' ', $conteo->estado)),
                    ];
                })->toArray()
            );
        } else {
            $this->info('   No hay conteos programados para las próximas 2 semanas');
        }
    }
}
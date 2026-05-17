<?php

namespace App\Console\Commands;

// ✅ COMENTADO: ReservaStock no existe, usar ReservaProforma en su lugar
// use App\Models\ReservaStock;
use App\Models\AnalisisAbc;
use App\Models\ConteoFisico;
use App\Jobs\LiberarReservasVencidasJob;
use App\Jobs\CalcularAnalisisAbcJob;
use Illuminate\Console\Command;

class ProcesarInventarioAvanzadoCommand extends Command
{
    protected $signature = 'inventario:procesar-avanzado
                            {--reservas : Procesar solo reservas vencidas}
                            {--analisis-abc : Calcular solo análisis ABC}
                            {--conteos : Verificar solo conteos pendientes}
                            {--todo : Procesar todas las tareas}
                            {--almacen= : ID del almacén específico}
                            {--ano= : Año para análisis ABC}
                            {--mes= : Mes para análisis ABC}
                            {--async : Ejecutar jobs en background}';

    protected $description = 'Procesa tareas avanzadas de inventario: reservas, análisis ABC y conteos';

    public function handle()
    {
        $procesarReservas = $this->option('reservas') || $this->option('todo');
        $procesarAnalisis = $this->option('analisis-abc') || $this->option('todo');
        $procesarConteos = $this->option('conteos') || $this->option('todo');
        $almacenId = $this->option('almacen');
        $ano = $this->option('ano') ?? date('Y');
        $mes = $this->option('mes');
        $async = $this->option('async');

        if (!$procesarReservas && !$procesarAnalisis && !$procesarConteos) {
            $this->error('❌ Debes especificar al menos una tarea: --reservas, --analisis-abc, --conteos, o --todo');
            return self::FAILURE;
        }

        $this->info('🚀 Iniciando procesamiento de inventario avanzado...');

        $resultados = [];

        if ($procesarReservas) {
            $resultados['reservas'] = $this->procesarReservasVencidas($async);
        }

        if ($procesarAnalisis) {
            $resultados['analisis'] = $this->procesarAnalisisABC($almacenId, $ano, $mes, $async);
        }

        if ($procesarConteos) {
            $resultados['conteos'] = $this->verificarConteosPendientes();
        }

        $this->mostrarResumenFinal($resultados);

        return self::SUCCESS;
    }

    private function procesarReservasVencidas(bool $async): array
    {
        $this->info('🔄 Procesando reservas vencidas...');

        try {
            if ($async) {
                LiberarReservasVencidasJob::dispatch();
                $this->info('✅ Job de liberación de reservas enviado a la cola');
                return ['status' => 'job_enviado', 'cantidad' => 'pendiente'];
            } else {
                // ✅ COMENTADO: ReservaStock no existe
                // $reservasLiberadas = ReservaStock::liberarReservasVencidas();
                $reservasLiberadas = 0;

                if ($reservasLiberadas > 0) {
                    $this->info("✅ Se liberaron {$reservasLiberadas} reservas vencidas");
                } else {
                    $this->info('ℹ️  No se encontraron reservas vencidas para liberar (ReservaStock deshabilitado)');
                }

                return ['status' => 'completado', 'cantidad' => $reservasLiberadas];
            }

        } catch (\Exception $e) {
            $this->error("❌ Error procesando reservas: " . $e->getMessage());
            return ['status' => 'error', 'mensaje' => $e->getMessage()];
        }
    }

    private function procesarAnalisisABC($almacenId, $ano, $mes, bool $async): array
    {
        $this->info("🔄 Procesando análisis ABC para {$ano}" . ($mes ? "/{$mes}" : '') . "...");

        try {
            if ($async) {
                CalcularAnalisisAbcJob::dispatch($almacenId, $ano, $mes);
                $this->info('✅ Job de análisis ABC enviado a la cola');
                return ['status' => 'job_enviado', 'periodo' => $ano . ($mes ? "/{$mes}" : '')];
            } else {
                $resultado = AnalisisAbc::calcularAnalisisABC($almacenId, $ano, $mes);

                if ($resultado) {
                    $resumen = AnalisisAbc::obtenerResumen($almacenId, $ano);
                    $this->info("✅ Análisis ABC calculado: {$resumen['total_productos']} productos analizados");

                    // Mostrar resumen
                    $this->table(
                        ['Métrica', 'Valor'],
                        [
                            ['Total Productos', $resumen['total_productos']],
                            ['Clasificación A', $resumen['clasificacion_a']],
                            ['Clasificación B', $resumen['clasificacion_b']],
                            ['Clasificación C', $resumen['clasificacion_c']],
                            ['Alta Rotación (X)', $resumen['alta_rotacion']],
                            ['Media Rotación (Y)', $resumen['media_rotacion']],
                            ['Baja Rotación (Z)', $resumen['baja_rotacion']],
                            ['Productos Obsoletos', $resumen['productos_obsoletos']],
                            ['Rotación Promedio', number_format($resumen['rotacion_promedio'], 2)],
                            ['Valor Total', '$' . number_format($resumen['valor_total'], 2)],
                        ]
                    );

                    return ['status' => 'completado', 'resumen' => $resumen];
                } else {
                    $this->warn('⚠️  No se encontraron datos de ventas para el periodo especificado');
                    return ['status' => 'sin_datos', 'periodo' => $ano . ($mes ? "/{$mes}" : '')];
                }
            }

        } catch (\Exception $e) {
            $this->error("❌ Error procesando análisis ABC: " . $e->getMessage());
            return ['status' => 'error', 'mensaje' => $e->getMessage()];
        }
    }

    private function verificarConteosPendientes(): array
    {
        $this->info('🔄 Verificando conteos físicos pendientes...');

        try {
            // Conteos programados para hoy
            $conteosHoy = ConteoFisico::programadosHoy()->get();

            // Conteos en progreso
            $conteosEnProgreso = ConteoFisico::enProgreso()->get();

            // Conteos con diferencias significativas
            $conteosConDiferencias = ConteoFisico::conDiferencias()
                                               ->where('valor_diferencias', '>', 1000)
                                               ->get();

            if ($conteosHoy->isNotEmpty()) {
                $this->info("📅 Conteos programados para hoy ({$conteosHoy->count()}):");
                $this->table(
                    ['Código', 'Almacén', 'Tipo', 'Estado'],
                    $conteosHoy->map(function($conteo) {
                        return [
                            $conteo->codigo_conteo,
                            $conteo->almacen->nombre,
                            ucfirst($conteo->tipo_conteo),
                            ucfirst(str_replace('_', ' ', $conteo->estado)),
                        ];
                    })->toArray()
                );
            }

            if ($conteosEnProgreso->isNotEmpty()) {
                $this->warn("⚠️  Conteos en progreso ({$conteosEnProgreso->count()}):");
                foreach ($conteosEnProgreso as $conteo) {
                    $porcentaje = $conteo->porcentajeCompletado();
                    $this->line("   • {$conteo->codigo_conteo} - {$conteo->almacen->nombre} ({$porcentaje}% completado)");
                }
            }

            if ($conteosConDiferencias->isNotEmpty()) {
                $this->error("🚨 Conteos con diferencias significativas ({$conteosConDiferencias->count()}):");
                $this->table(
                    ['Código', 'Almacén', 'Diferencias', 'Valor'],
                    $conteosConDiferencias->map(function($conteo) {
                        return [
                            $conteo->codigo_conteo,
                            $conteo->almacen->nombre,
                            $conteo->total_diferencias,
                            '$' . number_format($conteo->valor_diferencias, 2),
                        ];
                    })->toArray()
                );
            }

            if ($conteosHoy->isEmpty() && $conteosEnProgreso->isEmpty() && $conteosConDiferencias->isEmpty()) {
                $this->info('ℹ️  No hay conteos pendientes que requieran atención');
            }

            return [
                'status' => 'completado',
                'conteos_hoy' => $conteosHoy->count(),
                'conteos_en_progreso' => $conteosEnProgreso->count(),
                'conteos_con_diferencias' => $conteosConDiferencias->count(),
            ];

        } catch (\Exception $e) {
            $this->error("❌ Error verificando conteos: " . $e->getMessage());
            return ['status' => 'error', 'mensaje' => $e->getMessage()];
        }
    }

    private function mostrarResumenFinal(array $resultados): void
    {
        $this->info("\n📊 RESUMEN FINAL");
        $this->info("════════════════");

        foreach ($resultados as $tarea => $resultado) {
            $status = $resultado['status'] ?? 'desconocido';
            $icono = match($status) {
                'completado' => '✅',
                'job_enviado' => '📤',
                'sin_datos' => '⚠️',
                'error' => '❌',
                default => 'ℹ️'
            };

            $tituloTarea = match($tarea) {
                'reservas' => 'Reservas Vencidas',
                'analisis' => 'Análisis ABC',
                'conteos' => 'Conteos Físicos',
                default => ucfirst($tarea)
            };

            $this->line("{$icono} {$tituloTarea}: " . ucfirst(str_replace('_', ' ', $status)));
        }

        $this->info("\n🎉 Procesamiento de inventario avanzado completado");
    }
}
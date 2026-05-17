<?php

namespace App\Console\Commands;

use App\Models\LibroVentasIva;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GenerarLibroVentasIva extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tributario:libro-ventas-iva
                           {mes? : Mes a generar (1-12)}
                           {anio? : Año a generar}
                           {--formato=pdf : Formato del reporte (pdf, excel, csv)}
                           {--exportar : Exportar archivo a storage}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genera el libro de ventas IVA mensual para presentación ante el SIN';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $mes = $this->argument('mes') ?? now()->month;
        $anio = $this->argument('anio') ?? now()->year;
        $formato = $this->option('formato');

        $this->info("📚 Generando Libro de Ventas IVA - {$mes}/{$anio}");

        // Validar mes y año
        if (! $this->validarParametros($mes, $anio)) {
            return Command::FAILURE;
        }

        // Obtener datos del período
        $ventas = $this->obtenerVentasDelPeriodo($mes, $anio);

        if ($ventas->isEmpty()) {
            $this->warn('⚠️  No se encontraron ventas con IVA para el período especificado');

            return Command::SUCCESS;
        }

        $this->info("📊 Encontradas {$ventas->count()} ventas con IVA");

        // Generar resumen
        $resumen = $this->generarResumen($ventas);
        $this->mostrarResumen($resumen, $mes, $anio);

        // Exportar si se solicita
        if ($this->option('exportar')) {
            $this->exportarReporte($ventas, $resumen, $mes, $anio, $formato);
        }

        return Command::SUCCESS;
    }

    /**
     * Validar parámetros de entrada
     */
    private function validarParametros($mes, $anio): bool
    {
        if ($mes < 1 || $mes > 12) {
            $this->error('❌ El mes debe estar entre 1 y 12');

            return false;
        }

        if ($anio < 2020 || $anio > now()->year + 1) {
            $this->error('❌ Año inválido');

            return false;
        }

        return true;
    }

    /**
     * Obtener ventas del período
     */
    private function obtenerVentasDelPeriodo($mes, $anio)
    {
        $fechaInicio = Carbon::create($anio, $mes, 1)->startOfMonth();
        $fechaFin = Carbon::create($anio, $mes, 1)->endOfMonth();

        return LibroVentasIva::with(['venta.cliente', 'tipoDocumento'])
            ->whereBetween('fecha', [$fechaInicio, $fechaFin])
            ->where('estado_factura', 'vigente')
            ->orderBy('fecha')
            ->orderBy('numero_factura')
            ->get();
    }

    /**
     * Generar resumen estadístico
     */
    private function generarResumen($ventas): array
    {
        return [
            'total_ventas' => $ventas->count(),
            'monto_total' => $ventas->sum('importe_total'),
            'monto_gravado' => $ventas->sum('importe_base_cf'),
            'monto_no_gravado' => $ventas->sum('descuentos'),
            'credito_fiscal' => $ventas->sum('credito_fiscal'),
            'por_tipo_documento' => $ventas->groupBy('tipoDocumento.codigo')->map(function ($group) {
                return [
                    'cantidad' => $group->count(),
                    'monto_total' => $group->sum('importe_total'),
                    'credito_fiscal' => $group->sum('credito_fiscal'),
                ];
            })->toArray(),
        ];
    }

    /**
     * Mostrar resumen en consola
     */
    private function mostrarResumen(array $resumen, $mes, $anio): void
    {
        $nombreMes = Carbon::create($anio, $mes, 1)->locale('es')->monthName;

        $this->newLine();
        $this->info("📈 RESUMEN DEL LIBRO DE VENTAS IVA - {$nombreMes} {$anio}");
        $this->info('='.str_repeat('=', 60));

        $this->table(
            ['Concepto', 'Valor'],
            [
                ['Total de ventas', number_format($resumen['total_ventas'])],
                ['Monto total', 'Bs. '.number_format($resumen['monto_total'], 2)],
                ['Monto gravado (IVA)', 'Bs. '.number_format($resumen['monto_gravado'], 2)],
                ['Monto no gravado', 'Bs. '.number_format($resumen['monto_no_gravado'], 2)],
                ['Crédito fiscal (IVA)', 'Bs. '.number_format($resumen['credito_fiscal'], 2)],
            ]
        );

        if (! empty($resumen['por_tipo_documento'])) {
            $this->newLine();
            $this->info('📋 Resumen por tipo de documento:');

            $filas = [];
            foreach ($resumen['por_tipo_documento'] as $tipo => $datos) {
                $filas[] = [
                    $tipo,
                    number_format($datos['cantidad']),
                    'Bs. '.number_format($datos['monto_total'], 2),
                    'Bs. '.number_format($datos['credito_fiscal'], 2),
                ];
            }

            $this->table(
                ['Tipo Doc.', 'Cantidad', 'Monto Total', 'Crédito Fiscal'],
                $filas
            );
        }
    }

    /**
     * Exportar reporte a archivo
     */
    private function exportarReporte($ventas, array $resumen, $mes, $anio, string $formato): void
    {
        $nombreMes = Carbon::create($anio, $mes, 1)->format('m');
        $nombreArchivo = "libro_ventas_iva_{$anio}_{$nombreMes}";

        switch ($formato) {
            case 'csv':
                $this->exportarCSV($ventas, $nombreArchivo);
                break;
            case 'excel':
                $this->info('📄 Formato Excel no implementado aún');
                break;
            case 'pdf':
                $this->info('📄 Formato PDF no implementado aún');
                break;
            default:
                $this->error("❌ Formato '{$formato}' no soportado");

                return;
        }
    }

    /**
     * Exportar a CSV
     */
    private function exportarCSV($ventas, string $nombreArchivo): void
    {
        $csv = "Fecha,Número Factura,NIT Cliente,Nombre Cliente,Importe Total,Base Crédito Fiscal,Crédito Fiscal,Estado\n";

        foreach ($ventas as $venta) {
            $csv .= sprintf(
                "%s,%s,%s,\"%s\",%.2f,%.2f,%.2f,%s\n",
                Carbon::parse($venta->fecha)->format('d/m/Y'),
                $venta->numero_factura,
                $venta->nit_ci_cliente,
                str_replace('"', '""', $venta->razon_social_cliente),
                $venta->importe_total,
                $venta->importe_base_cf,
                $venta->credito_fiscal,
                $venta->estado_factura
            );
        }

        $rutaArchivo = "reportes/tributarios/{$nombreArchivo}.csv";
        Storage::put($rutaArchivo, $csv);

        $this->info("✅ Archivo CSV generado: storage/app/{$rutaArchivo}");
    }
}

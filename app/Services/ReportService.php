<?php

namespace App\Services;

use App\Exports\EntregasRechazadasExport;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Facades\Excel;
use PDF;

/**
 * Servicio Centralizado de Reportes
 *
 * Este servicio proporciona una interfaz consistente para generar
 * reportes en diferentes formatos (PDF y Excel) para distintos módulos.
 *
 * Uso:
 * $reportService = app(ReportService::class);
 * return $reportService->exportarEnviosPdf($envios, $filtros);
 */
class ReportService
{
    /**
     * DEPRECADO: Sistema de Envíos ha sido eliminado
     * Usar entregas en su lugar (a través de EntregasRechazadasExport u otro método de Entregas)
     *
     * Exportar envíos a PDF (DEPRECATED)
     * @deprecated El sistema de Envíos ha sido consolidado en Entregas
     */
    public function exportarEnviosPdf(Collection $envios, array $filtros = [])
    {
        throw new \Exception('Este método ha sido deprecado. El sistema de Envíos ha sido consolidado en Entregas. Por favor, use los métodos de reportes de Entregas en su lugar.');
    }

    /**
     * DEPRECADO: Sistema de Envíos ha sido eliminado
     * Usar entregas en su lugar (a través de EntregasRechazadasExport u otro método de Entregas)
     *
     * Exportar envíos a Excel (DEPRECATED)
     * @deprecated El sistema de Envíos ha sido consolidado en Entregas
     */
    public function exportarEnviosExcel(Collection $envios)
    {
        throw new \Exception('Este método ha sido deprecado. El sistema de Envíos ha sido consolidado en Entregas. Por favor, use los métodos de reportes de Entregas en su lugar.');
    }

    /**
     * Exportar entregas rechazadas a Excel
     */
    public function exportarEntregasRechazadasExcel(Collection $envios): \Illuminate\Http\Response
    {
        return Excel::download(
            new EntregasRechazadasExport($envios),
            'entregas_rechazadas_' . now()->format('Y-m-d_His') . '.xlsx'
        );
    }

    /**
     * DEPRECADO: Sistema de Envíos ha sido eliminado
     *
     * Obtener envíos rechazados con filtros opcionales (DEPRECATED)
     * @deprecated El sistema de Envíos ha sido consolidado en Entregas
     */
    public function obtenerEnviosRechazados(array $filtros = []): Collection
    {
        throw new \Exception('Este método ha sido deprecado. El sistema de Envíos ha sido consolidado en Entregas.');
    }

    /**
     * DEPRECADO: Sistema de Envíos ha sido eliminado
     *
     * Obtener estadísticas de entregas rechazadas (DEPRECATED)
     * @deprecated El sistema de Envíos ha sido consolidado en Entregas
     */
    public function estadisticasEntregasRechazadas(): array
    {
        throw new \Exception('Este método ha sido deprecado. El sistema de Envíos ha sido consolidado en Entregas.');
    }

    /**
     * DEPRECADO: Sistema de Envíos ha sido eliminado
     *
     * Obtener envíos agrupados por estado (DEPRECATED)
     * @deprecated El sistema de Envíos ha sido consolidado en Entregas
     */
    public function enviosPorEstado(): array
    {
        throw new \Exception('Este método ha sido deprecado. El sistema de Envíos ha sido consolidado en Entregas.');
    }

    /**
     * DEPRECADO: Sistema de Envíos ha sido eliminado
     *
     * Top de choferes con más entregas rechazadas (DEPRECATED)
     * @deprecated El sistema de Envíos ha sido consolidado en Entregas
     */
    public function topChoforesRechazos(int $limite = 5): Collection
    {
        throw new \Exception('Este método ha sido deprecado. El sistema de Envíos ha sido consolidado en Entregas.');
    }

    /**
     * DEPRECADO: Sistema de Envíos ha sido eliminado
     *
     * Generar reporte completo de entregas (DEPRECATED)
     * @deprecated El sistema de Envíos ha sido consolidado en Entregas
     */
    public function generarReporteCompleto(array $filtros = []): array
    {
        throw new \Exception('Este método ha sido deprecado. El sistema de Envíos ha sido consolidado en Entregas.');
    }
}

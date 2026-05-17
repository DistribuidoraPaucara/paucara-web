<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * Mostrar el dashboard principal dinámico
     * Renderiza solo los widgets permitidos según roles/permisos del usuario
     * Con compatibilidad backward para el dashboard anterior
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $periodo = $request->get('periodo', 'mes_actual');

        // Obtener estructura de widgets para el usuario actual
        $modulosPermitidos = $this->dashboardService->getModulosPermitidos($user);
        $widgetsAMostrar = $this->dashboardService->getWidgetsAMostrar($user);

        // Si no hay módulos permitidos, retornar datos generales (fallback)
        if (empty($modulosPermitidos)) {
            $modulosPermitidos = ['general'];
        }

        // Obtener solo los datos necesarios para los módulos permitidos
        $datosModulos = $this->dashboardService->getDataForAllowedModules($modulosPermitidos, $periodo);

        // Para compatibilidad con el dashboard anterior
        $datosGenerales = $datosModulos['general'] ?? [];

        // Siempre obtener métricas completas para compatibilidad backward
        // Esto asegura que el dashboard antiguo siempre tenga datos
        $allMetrics = $this->dashboardService->getMainMetrics($periodo);

        // Preparar todos los datos con fallback
        $metricas = isset($datosGenerales['metricas_principales'])
            ? array_merge($allMetrics, $datosGenerales['metricas_principales'])
            : $allMetrics;

        $graficoVentas = $datosGenerales['grafico_ventas'] ?? $this->dashboardService->getGraficoVentas($periodo);
        $productosMasVendidos = $datosGenerales['productos_mas_vendidos'] ?? $this->dashboardService->getProductosMasVendidos(10, $periodo);
        $alertasStock = $datosGenerales['alertas_stock'] ?? $this->dashboardService->getAlertasStock();
        $ventasPorCanal = $datosGenerales['ventas_por_canal'] ?? $this->dashboardService->getVentasPorCanal($periodo);

        return Inertia::render('dashboard', [
            // Datos por módulo (nuevo sistema)
            'datosModulos' => $datosModulos,
            'modulosPermitidos' => $modulosPermitidos,
            'widgetsAMostrar' => $widgetsAMostrar,

            // Datos compatibilidad backward (antiguo sistema - dashboard.tsx actual)
            // Garantizados para nunca ser null
            'metricas' => $metricas,
            'graficoVentas' => $graficoVentas,
            'productosMasVendidos' => $productosMasVendidos,
            'alertasStock' => $alertasStock,
            'ventasPorCanal' => $ventasPorCanal,
            'periodo' => $periodo,
        ]);
    }

    /**
     * Obtener métricas del dashboard via API
     */
    public function metricas(Request $request)
    {
        $periodo = $request->get('periodo', 'mes_actual');

        return response()->json([
            'success' => true,
            'data' => $this->dashboardService->getMainMetrics($periodo),
        ]);
    }

    /**
     * Obtener datos para gráficos via API
     */
    public function graficos(Request $request)
    {
        $tipo = $request->get('tipo', 'ventas');
        $dias = $request->get('dias', 30);

        $data = match ($tipo) {
            'ventas' => $this->dashboardService->getGraficoVentas((string)$dias),
            default => []
        };

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Obtener productos más vendidos via API
     */
    public function productosMasVendidos(Request $request)
    {
        $limite = $request->get('limite', 10);
        $periodo = $request->get('periodo', 'mes_actual');

        return response()->json([
            'success' => true,
            'data' => $this->dashboardService->getProductosMasVendidos($limite, $periodo),
        ]);
    }

    /**
     * Obtener alertas de stock via API
     */
    public function alertasStock()
    {
        return response()->json([
            'success' => true,
            'data' => $this->dashboardService->getAlertasStock(),
        ]);
    }

    /**
     * Obtener ventas por canal via API
     */
    public function ventasPorCanal(Request $request)
    {
        $periodo = $request->get('periodo', 'mes_actual');

        return response()->json([
            'success' => true,
            'data' => $this->dashboardService->getVentasPorCanal($periodo),
        ]);
    }
}

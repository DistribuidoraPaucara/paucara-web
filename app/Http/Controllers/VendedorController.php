<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador de Dashboard para Vendedor/Cajero
 * Muestra solo datos relevantes para vendedor/caja
 */
class VendedorController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * Dashboard específico para Vendedor/Cajero
     * Filtra los datos por la CAJA ABIERTA actual del cajero
     */
    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $empleado = $user->empleado;
        $periodo = $request->get('periodo', 'mes_actual');

        // Verificar que el usuario tiene un empleado asociado y es cajero
        if (!$empleado) {
            abort(403, 'No hay un empleado asociado a tu cuenta. Por favor contacta al administrador.');
        }

        // Verificar que tiene rol de Cajero (aceptar tanto 'Cajero' como 'cajero')
        $tieneRolCajero = $user->hasRole('Cajero') || $user->hasRole('cajero');
        if (!$tieneRolCajero && !$empleado->esCajero()) {
            abort(403, 'No tienes el rol de Cajero. Tu rol actual: ' . ($user->getRoleNames()->first() ?? 'ninguno'));
        }

        // Obtener la caja abierta del cajero
        $cajaAbierta = $empleado->cajaAbierta();

        // Si no hay caja abierta, mostrar mensaje
        if (!$cajaAbierta) {
            return Inertia::render('vendedor/dashboard', [
                'sin_caja_abierta' => true,
                'mensaje' => 'Debes abrir una caja para ver el dashboard',
                'metricas' => [
                    'ventas' => [],
                    'caja' => [],
                    'clientes' => [],
                    'proformas' => [],
                ],
                'graficoVentas' => ['labels' => [], 'datasets' => []],
                'productosMasVendidos' => [],
                'alertasStock' => ['stock_bajo' => 0, 'stock_critico' => 0, 'productos_afectados' => []],
                'periodo' => $periodo,
                'titulo' => 'Dashboard Vendedor',
                'descripcion' => 'Resumen de ventas y caja',
            ]);
        }

        // Obtener métricas SOLO de la caja abierta del cajero
        $metricas = $this->dashboardService->getMainMetrics($periodo, $cajaAbierta->id);
        $graficoVentas = $this->dashboardService->getGraficoVentas($periodo, 30, $cajaAbierta->id);
        $productosMasVendidos = $this->dashboardService->getProductosMasVendidos(10, $cajaAbierta->id);
        $alertasStock = $this->dashboardService->getAlertasStock(); // Alertas globales (útil para todos)

        // Filtrar datos específicos para vendedor
        $metricasVendedor = [
            'ventas' => $metricas['ventas'] ?? [],
            'caja' => $metricas['caja'] ?? [],
            'clientes' => $metricas['clientes'] ?? [], // Clientes globales
            'proformas' => $metricas['proformas'] ?? [],
        ];

        return Inertia::render('vendedor/dashboard', [
            'sin_caja_abierta' => false,
            'metricas' => $metricasVendedor,
            'graficoVentas' => $graficoVentas,
            'productosMasVendidos' => $productosMasVendidos,
            'alertasStock' => $alertasStock,
            'periodo' => $periodo,
            'titulo' => 'Dashboard Vendedor',
            'descripcion' => 'Resumen de ventas y caja - Turno actual',
        ]);
    }
}

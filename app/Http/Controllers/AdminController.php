<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use App\Models\CuentaPorCobrar;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Controlador de Dashboard para Admin
 * Muestra resumen completo del sistema
 */
class AdminController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function dashboard(Request $request)
    {
        $user = Auth::user();
        $periodo = $request->get('periodo', 'ultimos_30_dias');

        // Obtener todas las métricas para el admin
        $metricas = $this->dashboardService->getMainMetrics($periodo);
        $graficoVentas = $this->dashboardService->getGraficoVentas($periodo);
        $productosMasVendidos = $this->dashboardService->getProductosMasVendidos(10);
        $alertasStock = $this->dashboardService->getAlertasStock();
        $ventasPorCanal = $this->dashboardService->getVentasPorCanal($periodo);

        // 🚨 Obtener cuentas por cobrar vencidas
        $empresaId = $user->empresa_id;
        $userIds = User::where('empresa_id', $empresaId)->pluck('id');

        $cuentasVencidas = CuentaPorCobrar::with(['cliente:id,nombre'])
            ->vencidas()
            ->pendientes()
            ->where('estado', '!=', 'PAGADO')
            ->where(function($q) use ($userIds) {
                $q->whereIn('usuario_id', $userIds)
                  ->orWhereNull('usuario_id');
            })
            ->orderByDesc('dias_vencido')
            ->limit(10)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'cliente_nombre' => $c->cliente?->nombre ?? 'Sin cliente',
                'saldo_pendiente' => (float) $c->saldo_pendiente,
                'dias_vencido' => $c->dias_vencido ?? 0,
                'fecha_vencimiento' => $c->fecha_vencimiento?->format('Y-m-d'),
                'referencia_documento' => $c->referencia_documento,
                'estado' => $c->estado,
            ]);

        $totalCuentasVencidas = $cuentasVencidas->count();
        $totalMontoVencido = $cuentasVencidas->sum('saldo_pendiente');

        return Inertia::render('admin/dashboard', [
            'metricas' => $metricas,
            'graficoVentas' => $graficoVentas,
            'productosMasVendidos' => $productosMasVendidos,
            'alertasStock' => $alertasStock,
            'ventasPorCanal' => $ventasPorCanal,
            'cuentasVencidas' => $cuentasVencidas,
            'totalCuentasVencidas' => $totalCuentasVencidas,
            'totalMontoVencido' => $totalMontoVencido,
            'periodo' => $periodo,
            'titulo' => 'Dashboard Administrativo',
            'descripcion' => 'Resumen completo del sistema',
        ]);
    }
}

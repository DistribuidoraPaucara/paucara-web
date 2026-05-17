<?php
namespace App\Http\Controllers;

use App\Models\CuentaPorPagar;
use App\Models\Pago;
use App\Models\TipoPago;
use App\Services\ImpresionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PagoController extends Controller
{
    public function __construct(
        private ImpresionService $impresionService,
    ) {}
    public function index(Request $request)
    {
        $query = Pago::with(['cuentaPorPagar.compra.proveedor', 'tipoPago', 'usuario'])
            ->whereNotNull('cuenta_por_pagar_id') // Solo pagos de compras
            ->when($request->tipo_pago_id, function ($q) use ($request) {
                $q->where('tipo_pago_id', $request->tipo_pago_id);
            })
            ->when($request->cuenta_por_pagar_id, function ($q) use ($request) {
                $q->where('cuenta_por_pagar_id', $request->cuenta_por_pagar_id);
            })
            ->when($request->fecha_desde && $request->fecha_hasta, function ($q) use ($request) {
                $q->whereBetween('fecha_pago', [$request->fecha_desde, $request->fecha_hasta]);
            })
            ->when($request->q, function ($q) use ($request) {
                $q->where(function ($subQ) use ($request) {
                    $subQ->where('numero_recibo', 'LIKE', "%{$request->q}%")
                        ->orWhere('numero_transferencia', 'LIKE', "%{$request->q}%")
                        ->orWhere('numero_cheque', 'LIKE', "%{$request->q}%")
                        ->orWhere('observaciones', 'LIKE', "%{$request->q}%")
                        ->orWhereHas('cuentaPorPagar.compra.proveedor', function ($provQ) use ($request) {
                            $provQ->where('nombre', 'LIKE', "%{$request->q}%");
                        });
                });
            });

        // Sorting
        $sortField = $request->get('sort', 'fecha_pago');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $pagos = $query->paginate(15)->withQueryString();

        // Estadísticas
        $estadisticas = [
            'total_pagos_mes'    => Pago::whereNotNull('cuenta_por_pagar_id')
                ->whereMonth('fecha_pago', now()->month)
                ->whereYear('fecha_pago', now()->year)
                ->sum('monto'),
            'cantidad_pagos_mes' => Pago::whereNotNull('cuenta_por_pagar_id')
                ->whereMonth('fecha_pago', now()->month)
                ->whereYear('fecha_pago', now()->year)
                ->count(),
            'promedio_pago_mes'  => 0,
        ];

        if ($estadisticas['cantidad_pagos_mes'] > 0) {
            $estadisticas['promedio_pago_mes'] = $estadisticas['total_pagos_mes'] / $estadisticas['cantidad_pagos_mes'];
        }

        return Inertia::render('compras/pagos/index', [
            'pagos' => [
                'pagos'            => [
                    'data'         => $pagos->items(),
                    'current_page' => $pagos->currentPage(),
                    'last_page'    => $pagos->lastPage(),
                    'per_page'     => $pagos->perPage(),
                    'total'        => $pagos->total(),
                    'links'        => $pagos->linkCollection()->toArray(),
                ],
                'filtros'          => $request->only(['tipo_pago_id', 'fecha_desde', 'fecha_hasta', 'q', 'cuenta_por_pagar_id']),
                'datosParaFiltros' => [
                    'cuentas_por_pagar' => CuentaPorPagar::with(['compra.proveedor'])
                        ->where('estado', '!=', 'PAGADO')
                        ->where('saldo_pendiente', '>', 0)
                        ->get(),
                    'tipos_pago'        => TipoPago::all(),
                ],
                'estadisticas'     => $estadisticas,
            ],
        ]);
    }

    public function create()
    {
        $cuentasPorPagar = CuentaPorPagar::with(['compra.proveedor'])
            ->where('estado', '!=', 'PAGADO')
            ->where('saldo_pendiente', '>', 0)
            ->get();

        $tiposPago = TipoPago::all();

        return Inertia::render('compras/pagos/create', [
            'cuentasPorPagar' => $cuentasPorPagar,
            'tiposPago'       => $tiposPago,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cuenta_por_pagar_id'  => 'required|exists:cuentas_por_pagar,id',
            'tipo_pago_id'         => 'required|exists:tipos_pago,id',
            'monto'                => 'required|numeric|min:0.01',
            'fecha_pago'           => 'required|date',
            'numero_recibo'        => 'nullable|string',
            'numero_transferencia' => 'nullable|string',
            'numero_cheque'        => 'nullable|string',
            'observaciones'        => 'nullable|string',
        ]);

        // Validar que el monto no exceda el saldo pendiente
        $cuentaPorPagar = CuentaPorPagar::findOrFail($request->cuenta_por_pagar_id);

        if ($request->monto > $cuentaPorPagar->saldo_pendiente) {
            return back()->withErrors([
                'monto' => 'El monto no puede ser mayor al saldo pendiente (' . $cuentaPorPagar->saldo_pendiente . ')',
            ]);
        }

        // Crear el pago
        $pago = Pago::create([
            'numero_pago'          => Pago::generarNumeroPago(),
            'cuenta_por_pagar_id'  => $request->cuenta_por_pagar_id,
            'tipo_pago_id'         => $request->tipo_pago_id,
            'monto'                => $request->monto,
            'fecha'                => now(),
            'fecha_pago'           => $request->fecha_pago,
            'numero_recibo'        => $request->numero_recibo,
            'numero_transferencia' => $request->numero_transferencia,
            'numero_cheque'        => $request->numero_cheque,
            'observaciones'        => $request->observaciones,
            'usuario_id'           => Auth::id(),
        ]);

        // Actualizar el saldo pendiente de la cuenta por pagar
        $nuevoSaldo = $cuentaPorPagar->saldo_pendiente - $request->monto;
        $cuentaPorPagar->update([
            'saldo_pendiente' => $nuevoSaldo,
            'estado'          => $nuevoSaldo == 0 ? 'PAGADO' : 'PARCIAL',
        ]);

        // ✅ NUEVA POLÍTICA: NO SE REGISTRA MOVIMIENTO DE CAJA PARA CUENTAS POR PAGAR
        // Los pagos de compras a crédito NO generan movimientos de caja
        // El dinero se movió cuando se registró la compra a crédito (CuentaPorPagar creada)
        Log::info("✅ Pago de CuentaPorPagar registrado (sin movimiento de caja)", [
            'pago_id' => $pago->id,
            'cuenta_por_pagar_id' => $cuentaPorPagar->id,
            'compra_numero' => $cuentaPorPagar->compra->numero,
            'monto' => $request->monto,
            'nuevo_saldo' => $nuevoSaldo,
        ]);

        return redirect()->route('compras.pagos.index')
            ->with('success', 'Pago registrado correctamente.');
    }

    public function show(Pago $pago)
    {
        $pago->load(['cuentaPorPagar.compra.proveedor', 'tipoPago', 'usuario']);

        return Inertia::render('compras/pagos/show', [
            'pago' => $pago,
        ]);
    }

    public function destroy(Pago $pago)
    {
        // Restaurar el saldo pendiente
        $cuentaPorPagar = $pago->cuentaPorPagar;
        if ($cuentaPorPagar) {
            $nuevoSaldo = $cuentaPorPagar->saldo_pendiente + $pago->monto;
            $cuentaPorPagar->update([
                'saldo_pendiente' => $nuevoSaldo,
                'estado'          => $nuevoSaldo >= $cuentaPorPagar->monto_original ? 'PENDIENTE' : 'PARCIAL',
            ]);
        }

        $pago->delete();

        return back()->with('success', 'Pago eliminado correctamente.');
    }

    public function export(Request $request)
    {
        $query = Pago::with(['cuentaPorPagar.compra.proveedor', 'tipoPago', 'usuario'])
            ->whereNotNull('cuenta_por_pagar_id')
            ->when($request->tipo_pago_id, function ($q) use ($request) {
                $q->where('tipo_pago_id', $request->tipo_pago_id);
            })
            ->when($request->fecha_desde && $request->fecha_hasta, function ($q) use ($request) {
                $q->whereBetween('fecha_pago', [$request->fecha_desde, $request->fecha_hasta]);
            });

        $pagos = $query->get();

        // Aquí implementarías la exportación a Excel
        // Por ahora retornamos los datos como JSON para testing
        return response()->json($pagos);
    }

    /**
     * Imprime un pago en los formatos especificados (TICKET_80, TICKET_58, A4)
     *
     * @param Pago $pago
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function imprimir(Pago $pago, Request $request)
    {
        Log::info('🖨️ [PagoController::imprimir] Método llamado', [
            'pago_id' => $pago->id,
            'user_id' => auth()->id(),
            'formato' => $request->input('formato'),
        ]);

        $formato = $request->input('formato', 'TICKET_80'); // TICKET_80, TICKET_58, A4
        $accion  = $request->input('accion', 'stream');    // download | stream

        Log::info('📋 [PagoController::imprimir] Datos de pago para descargar/stream', [
            'pago_id'              => $pago->id,
            'numero_pago'          => $pago->numero_pago,
            'monto'                => $pago->monto,
            'fecha_pago'           => $pago->fecha_pago,
            'formato'              => $formato,
            'accion'               => $accion,
        ]);

        try {
            $pdf = $this->impresionService->imprimirPago($pago, $formato);

            $nombreArchivo = "pago_{$pago->numero_pago}_{$formato}.pdf";

            return $accion === 'stream'
                ? $pdf->stream($nombreArchivo)
                : $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ [PagoController::imprimir] Error al generar PDF', [
                'pago_id' => $pago->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }
}

<?php
namespace App\Http\Controllers;

use App\Models\CuentaPorPagar;
use App\Models\Pago;
use App\Models\Proveedor;
use App\Models\TipoPago;
use App\Services\ImpresionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CuentaPorPagarController extends Controller
{
    public function __construct(private ImpresionService $impresionService) {}
    public function index(Request $request)
    {
        $query = CuentaPorPagar::with(['compra.proveedor', 'pagos.tipoPago'])
            ->when($request->estado, function ($q) use ($request) {
                $q->where('estado', $request->estado);
            })
            ->when($request->proveedor_id, function ($q) use ($request) {
                $q->whereHas('compra', function ($subQ) use ($request) {
                    $subQ->where('proveedor_id', $request->proveedor_id);
                });
            })
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('compra', function ($subQ) use ($request) {
                    $subQ->where('numero_factura', 'LIKE', "%{$request->search}%")
                        ->orWhereHas('proveedor', function ($provQ) use ($request) {
                            $provQ->where('nombre', 'LIKE', "%{$request->search}%");
                        });
                });
            })
            ->when($request->fecha_desde && $request->fecha_hasta, function ($q) use ($request) {
                $q->whereBetween('fecha_vencimiento', [$request->fecha_desde, $request->fecha_hasta]);
            });

        // Sorting
        $sortField = $request->get('sort', 'fecha_vencimiento');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortField, $sortOrder);

        $cuentas = $query->paginate(15)->withQueryString();

        // Estadísticas
        $estadisticas = [
            'monto_total_pendiente' => CuentaPorPagar::where('estado', '!=', 'PAGADO')->sum('saldo_pendiente'),
            'cuentas_vencidas'      => CuentaPorPagar::where('estado', '!=', 'PAGADO')
                ->where('fecha_vencimiento', '<', now())->count(),
            'monto_total_vencido'   => CuentaPorPagar::where('estado', '!=', 'PAGADO')
                ->where('fecha_vencimiento', '<', now())->sum('saldo_pendiente'),
            'total_mes'             => CuentaPorPagar::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)->sum('monto_original'),
            'promedio_dias_pago'    => 0, // Calcular promedio de días de pago si es necesario
        ];

        return Inertia::render('compras/cuentas-por-pagar/index', [
            'cuentasPorPagar' => [
                'cuentas_por_pagar' => [
                    'data'         => $cuentas->items(),
                    'current_page' => $cuentas->currentPage(),
                    'last_page'    => $cuentas->lastPage(),
                    'per_page'     => $cuentas->perPage(),
                    'total'        => $cuentas->total(),
                    'links'        => $cuentas->linkCollection()->toArray(),
                ],
                'filtros'           => $request->only(['estado', 'proveedor_id', 'search', 'fecha_desde', 'fecha_hasta']),
                'estadisticas'      => $estadisticas,
                'datosParaFiltros'  => [
                    'proveedores' => Proveedor::select('id', 'nombre')->get(),
                    'tipos_pago'  => TipoPago::select('id', 'nombre', 'codigo')->where('codigo', '!=', 'CREDITO')->get(),
                ],
            ],
        ]);
    }

    public function show(CuentaPorPagar $cuenta)
    {
        $cuenta->load(['compra.proveedor', 'compra.detalles.producto', 'pagos.tipoPago']);

        return Inertia::render('compras/cuentas-por-pagar/show', [
            'cuenta' => $cuenta,
        ]);
    }

    public function actualizarEstado(Request $request, CuentaPorPagar $cuenta)
    {
        $request->validate([
            'estado' => 'required|in:PENDIENTE,PARCIAL,PAGADO,VENCIDO',
        ]);

        $cuenta->update([
            'estado' => $request->estado,
        ]);

        return back()->with('success', 'Estado actualizado correctamente.');
    }

    public function registrarPago(Request $request, CuentaPorPagar $cuentaPorPagar): JsonResponse
    {
        try {
            Log::info('📝 [PAGO CUENTAS POR PAGAR] Iniciando registro de pago', [
                'cuenta_id'  => $cuentaPorPagar->id,
                'usuario_id' => Auth::id(),
            ]);

            // Validar datos
            $validated = $request->validate([
                'monto'                => 'required|numeric|min:0.01',
                'tipo_pago_id'         => [
                    'required',
                    'integer',
                    function ($attribute, $value, $fail) {
                        $tipoPago = TipoPago::find($value);
                        if (! $tipoPago) {
                            $fail('El tipo de pago seleccionado no existe.');
                        }
                    },
                ],
                'fecha_pago'           => 'required|date',
                'numero_recibo'        => 'nullable|string',
                'numero_transferencia' => 'nullable|string',
                'numero_cheque'        => 'nullable|string',
                'observaciones'        => 'nullable|string',
            ]);

            // Ejecutar en transacción
            $pago = DB::transaction(function () use ($validated, $cuentaPorPagar) {
                // Crear registro de pago
                $pago = Pago::create([
                    'numero_pago'          => Pago::generarNumeroPago(),
                    'cuenta_por_pagar_id'  => $cuentaPorPagar->id,
                    'monto'                => $validated['monto'],
                    'tipo_pago_id'         => $validated['tipo_pago_id'],
                    'fecha'                => now(),
                    'fecha_pago'           => $validated['fecha_pago'],
                    'numero_recibo'        => $validated['numero_recibo'],
                    'numero_transferencia' => $validated['numero_transferencia'],
                    'numero_cheque'        => $validated['numero_cheque'],
                    'observaciones'        => $validated['observaciones'],
                    'usuario_id'           => Auth::id(),
                    'estado'               => 'REGISTRADO',
                ]);

                // Actualizar saldo pendiente
                $nuevoSaldo = $cuentaPorPagar->saldo_pendiente - $validated['monto'];
                $cuentaPorPagar->update([
                    'saldo_pendiente' => max(0, $nuevoSaldo),
                    'estado'          => $nuevoSaldo <= 0 ? 'PAGADO' : 'PARCIAL',
                ]);

                Log::info('✅ [PAGO CUENTAS POR PAGAR] Pago registrado exitosamente', [
                    'pago_id'     => $pago->id,
                    'cuenta_id'   => $cuentaPorPagar->id,
                    'monto'       => $validated['monto'],
                    'nuevo_saldo' => $nuevoSaldo,
                ]);

                return $pago;
            });

            return response()->json([
                'success' => true,
                'message' => 'Pago registrado exitosamente',
                'data'    => [
                    'pago'   => $pago,
                    'cuenta' => $cuentaPorPagar->fresh(),
                ],
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ [PAGO CUENTAS POR PAGAR] Error registrando pago', [
                'cuenta_id'  => $cuentaPorPagar->id,
                'error'      => $e->getMessage(),
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Error al registrar el pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function export(Request $request)
    {
        $query = CuentaPorPagar::with(['compra.proveedor'])
            ->when($request->estado, function ($q) use ($request) {
                $q->where('estado', $request->estado);
            })
            ->when($request->proveedor_id, function ($q) use ($request) {
                $q->whereHas('compra', function ($subQ) use ($request) {
                    $subQ->where('proveedor_id', $request->proveedor_id);
                });
            });

        $cuentas = $query->get();

        // Aquí implementarías la exportación a Excel
        // Por ahora retornamos los datos como JSON para testing
        return response()->json($cuentas);
    }

    public function anularPago(Request $request, CuentaPorPagar $cuentaPorPagar, Pago $pago): JsonResponse
    {
        try {
            Log::info('🗑️ [ANULAR PAGO CUENTAS POR PAGAR] Iniciando anulación', [
                'pago_id' => $pago->id,
                'cuenta_id' => $cuentaPorPagar->id,
                'usuario_id' => Auth::id(),
            ]);

            // Verificar permisos
            if (!auth()->user()->hasRole(['admin', 'Admin'])) {
                return response()->json(['message' => 'No tienes permiso'], 403);
            }

            // Validar que el pago pertenece a la cuenta
            if ($pago->cuenta_por_pagar_id !== $cuentaPorPagar->id) {
                return response()->json(['message' => 'El pago no pertenece a esta cuenta'], 422);
            }

            $motivo = $request->input('motivo', 'Sin motivo especificado');

            // Ejecutar en transacción
            DB::transaction(function () use ($pago, $cuentaPorPagar, $motivo) {
                // Revertir movimiento de caja
                if ($pago->movimientoCaja) {
                    $movOriginal = $pago->movimientoCaja;
                    $tipoAnulacion = \App\Models\TipoOperacionCaja::where('codigo', 'ANULACION')->firstOrFail();

                    \App\Models\MovimientoCaja::create([
                        'caja_id' => $movOriginal->caja_id,
                        'tipo_operacion_id' => $tipoAnulacion->id,
                        'numero_documento' => $cuentaPorPagar->compra?->numero ?? "CuentaPorPagar#{$cuentaPorPagar->id}",
                        'observaciones' => "REVERSIÓN por anulación de pago #{$pago->id}",
                        'monto' => abs($movOriginal->monto) * -1, // NEGATIVO (inverso del egreso)
                        'fecha' => now(),
                        'user_id' => Auth::id(),
                    ]);
                }

                // Actualizar saldo de la cuenta (restaurar lo que se restó)
                $nuevoSaldo = $cuentaPorPagar->saldo_pendiente + $pago->monto;
                $cuentaPorPagar->update([
                    'saldo_pendiente' => $nuevoSaldo,
                    'estado' => $nuevoSaldo >= $cuentaPorPagar->monto_original ? 'PENDIENTE' : 'PARCIAL',
                ]);

                // Marcar pago como anulado
                $pago->update([
                    'estado' => 'ANULADO',
                ]);

                Log::info('✅ [ANULAR PAGO CUENTAS POR PAGAR] Pago anulado exitosamente', [
                    'pago_id' => $pago->id,
                    'cuenta_id' => $cuentaPorPagar->id,
                    'monto' => $pago->monto,
                    'nuevo_saldo' => $nuevoSaldo,
                    'motivo' => $motivo,
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Pago anulado exitosamente',
                'data' => [
                    'pago' => $pago->fresh(),
                    'cuenta' => $cuentaPorPagar->fresh(),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ [ANULAR PAGO CUENTAS POR PAGAR] Error anulando pago', [
                'pago_id' => $pago->id,
                'cuenta_id' => $cuentaPorPagar->id,
                'error' => $e->getMessage(),
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Error al anular el pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function imprimirTicket80(Request $request, CuentaPorPagar $cuentaPorPagar)
    {
        // Determinar formato y acción
        $formato = $request->get('formato', 'TICKET_80');
        $accion = $request->get('accion', 'stream');

        Log::info('🖨️ [IMPRESIÓN CUENTAS POR PAGAR] Iniciando impresión', [
            'cuenta_id'  => $cuentaPorPagar->id,
            'usuario_id' => Auth::id(),
            'formato'    => $formato,
            'accion'     => $accion,
            'url_completa' => $request->fullUrl(),
        ]);

        try {
            // Validar formato
            if (!in_array($formato, ['A4', 'TICKET_80', 'TICKET_58'])) {
                $formato = 'TICKET_80';
            }

            Log::info('📝 [IMPRESIÓN CUENTAS POR PAGAR] Llamando ImpresionService', [
                'cuenta_id' => $cuentaPorPagar->id,
                'formato' => $formato,
            ]);

            // Generar PDF usando ImpresionService
            $pdf = $this->impresionService->imprimirCuentaPorPagar($cuentaPorPagar, $formato);

            Log::info('✅ [IMPRESIÓN CUENTAS POR PAGAR] PDF generado exitosamente', [
                'cuenta_id' => $cuentaPorPagar->id,
                'formato' => $formato,
                'accion' => $accion,
            ]);

            $nombreArchivo = "cuenta_por_pagar_{$cuentaPorPagar->id}_{$formato}.pdf";

            return $accion === 'stream'
                ? $pdf->stream($nombreArchivo)
                : $pdf->download($nombreArchivo);

        } catch (\Exception $e) {
            Log::error('❌ [IMPRESIÓN CUENTAS POR PAGAR] ERROR CRÍTICO', [
                'cuenta_id'      => $cuentaPorPagar->id,
                'formato'        => $formato,
                'accion'         => $accion,
                'usuario_id'     => Auth::id(),
                'error_message'  => $e->getMessage(),
                'error_file'     => $e->getFile(),
                'error_line'     => $e->getLine(),
                'error_trace'    => $e->getTraceAsString(),
            ]);

            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }
}

<?php
namespace App\Http\Controllers;

use App\Models\AperturaCaja;
use App\Models\Cliente;
use App\Models\CuentaPorCobrar;
use App\Models\MovimientoCaja;
use App\Models\Pago;
use App\Models\TipoOperacionCaja;
use App\Models\TipoPago;
use App\Services\ImpresionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CuentaPorCobrarController extends Controller
{
    public function __construct(
        private ImpresionService $impresionService,
    ) {}

    public function index(Request $request)
    {
        // ✅ CORREGIDO: Cargar cliente directamente + cliente de venta + usuario creador para mostrar ambos tipos
        $query = CuentaPorCobrar::with(['cliente', 'venta.cliente', 'pagos.tipoPago', 'usuario'])
            ->when($request->estado, function ($q) use ($request) {
                // ✅ CORREGIDO (2026-03-30): Filtro case-insensitive para estado
                $q->whereRaw('LOWER(estado) = ?', [strtolower($request->estado)]);
            })
            ->when($request->cliente_id, function ($q) use ($request) {
                $q->where('cliente_id', $request->cliente_id);
            })
            ->when($request->q, function ($q) use ($request) {
                $searchTerm = "%{$request->q}%";
                // Si es un número, también buscar por ID exacto
                $isNumeric = is_numeric($request->q);

                $q->where(function ($subQ) use ($searchTerm, $isNumeric, $request) {
                    $subQ
                        // 1️⃣ PRIORIDAD 1: Buscar por ID de la cuenta (exacto, sin LIKE)
                        ->when($isNumeric, function ($sq) use ($request) {
                            $sq->orWhere('id', (int)$request->q);
                        })
                        // 2️⃣ PRIORIDAD 2: Buscar por ID de venta (si es numérico)
                        ->when($isNumeric, function ($sq) use ($request) {
                            $sq->orWhere('venta_id', (int)$request->q);
                        })
                        // 3️⃣ PRIORIDAD 3: Buscar por referencia_documento
                        ->orWhere('referencia_documento', 'LIKE', $searchTerm)
                        // 4️⃣ PRIORIDAD 4: Buscar por usuario creador
                        ->orWhereHas('usuario', function ($userQ) use ($searchTerm) {
                            $userQ->where('name', 'LIKE', $searchTerm)
                                ->orWhere('email', 'LIKE', $searchTerm);
                        })
                        // 5️⃣ PRIORIDAD 5: Buscar por datos del cliente (nombre, código)
                        ->orWhereHas('cliente', function ($clienteQ) use ($searchTerm) {
                            $clienteQ->where('nombre', 'LIKE', $searchTerm)
                                ->orWhere('codigo_cliente', 'LIKE', $searchTerm);
                        });
                });
            })
            ->when($request->fecha_vencimiento_desde && $request->fecha_vencimiento_hasta, function ($q) use ($request) {
                $q->whereBetween('fecha_vencimiento', [$request->fecha_vencimiento_desde, $request->fecha_vencimiento_hasta]);
            })
            ->when($request->solo_vencidas, function ($q) {
                $q->whereDate('fecha_vencimiento', '<', today())
                    ->where('estado', '!=', 'PAGADO')
                    ->where('saldo_pendiente', '>', 0);  // ✅ NUEVO: Excluir cuentas completamente pagadas
            });

        // Sorting - ✅ ACTUALIZADO: Ordenar por ID descendente por defecto
        $sortField = $request->get('sort', 'id');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        // ✅ ACTUALIZADO: Permitir cambiar per_page vía parámetro (50 por defecto)
        $perPage = min((int)$request->get('per_page', 25), 500); // Máximo 500 para evitar sobrecarga
        $cuentas = $query->paginate($perPage)->withQueryString();

        // ✅ NUEVO: Recalcular dias_vencido dinámicamente para cada cuenta
        $cuentas->getCollection()->transform(function ($cuenta) {
            $cuenta->dias_vencido = $cuenta->calcularDiasVencido();
            return $cuenta;
        });

        // Estadísticas
        $estadisticas = [
            'monto_total_pendiente' => CuentaPorCobrar::where('estado', '!=', 'PAGADO')
                ->where('saldo_pendiente', '>', 0)->sum('saldo_pendiente'),  // ✅ Excluir pagadas
            'cuentas_vencidas'      => CuentaPorCobrar::where('estado', '!=', 'PAGADO')
                ->where('saldo_pendiente', '>', 0)  // ✅ Excluir pagadas
                ->whereDate('fecha_vencimiento', '<', today())->count(),
            'monto_total_vencido'   => CuentaPorCobrar::where('estado', '!=', 'PAGADO')
                ->where('saldo_pendiente', '>', 0)  // ✅ Excluir pagadas
                ->whereDate('fecha_vencimiento', '<', today())->sum('saldo_pendiente'),
            'total_mes'             => CuentaPorCobrar::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)->sum('monto_original'),
            'promedio_dias_pago'    => 0,
        ];

        return Inertia::render('ventas/cuentas-por-cobrar/index', [
            'cuentasPorCobrar' => [
                'cuentas_por_cobrar' => [
                    'data'         => $cuentas->items(),
                    'current_page' => $cuentas->currentPage(),
                    'last_page'    => $cuentas->lastPage(),
                    'per_page'     => $cuentas->perPage(),
                    'total'        => $cuentas->total(),
                    'links'        => $cuentas->linkCollection()->toArray(),
                ],
                'filtros'            => $request->only(['estado', 'cliente_id', 'q', 'fecha_vencimiento_desde', 'fecha_vencimiento_hasta', 'solo_vencidas']),
                'estadisticas'       => $estadisticas,
                'datosParaFiltros'   => [
                    'clientes' => Cliente::select('id', 'nombre', 'codigo_cliente')->get(),
                ],
                'tipos_pago'         => TipoPago::select('id', 'nombre', 'codigo')->where('codigo', '!=', 'CREDITO')->get(),
            ],
        ]);
    }

    public function show(CuentaPorCobrar $cuentaPorCobrar)
    {
        $cuentaPorCobrar->load(['venta.cliente', 'venta.detalles.producto', 'pagos.tipoPago', 'pagos.usuario']);

        // ✅ NUEVO: Recalcular dias_vencido dinámicamente
        $cuentaPorCobrar->dias_vencido = $cuentaPorCobrar->calcularDiasVencido();

        return Inertia::render('ventas/cuentas-por-cobrar/show', [
            'cuenta' => $cuentaPorCobrar,
        ]);
    }

    /**
     * ✅ NUEVO (2026-06-27): Imprimir cuenta por cobrar con formato genérico
     * Soporta múltiples formatos: A4, TICKET_80, TICKET_58
     */
    public function imprimir(CuentaPorCobrar $cuentaPorCobrar, Request $request)
    {
        $formato = $request->input('formato', 'TICKET_80');      // A4, TICKET_80, TICKET_58
        $accion  = $request->input('accion', 'stream');          // download | stream
        // ✅ NUEVO (2026-07-24): Recibir parámetros de desglose de pagos si existen
        $efectivo = floatval($request->input('efectivo', 0));
        $transferencia = floatval($request->input('transferencia', 0));

        Log::info('🖨️ [CuentaPorCobrarController::imprimir] INICIANDO', [
            'cuenta_id'         => $cuentaPorCobrar->id,
            'cliente_id'        => $cuentaPorCobrar->cliente_id,
            'saldo_pendiente'   => $cuentaPorCobrar->saldo_pendiente,
            'formato'           => $formato,
            'accion'            => $accion,
            'efectivo'          => $efectivo,
            'transferencia'     => $transferencia,
            'user_id'           => auth()->id(),
        ]);

        try {
            Log::info('📝 [CuentaPorCobrarController::imprimir] Llamando ImpresionService', [
                'cuenta_id' => $cuentaPorCobrar->id,
                'formato' => $formato,
                'efectivo' => $efectivo,
                'transferencia' => $transferencia,
            ]);

            // ✅ NUEVO (2026-07-24): Pasar opciones con desglose de pagos al servicio
            $opciones = [];
            if ($efectivo > 0 || $transferencia > 0) {
                $opciones['mostrar_desglose_reciente'] = true;
                $opciones['efectivo'] = $efectivo;
                $opciones['transferencia'] = $transferencia;
            }

            $pdf = $this->impresionService->imprimirCuentaPorCobrar($cuentaPorCobrar, $formato, $opciones);

            Log::info('✅ [CuentaPorCobrarController::imprimir] PDF generado exitosamente', [
                'cuenta_id' => $cuentaPorCobrar->id,
                'formato' => $formato,
            ]);

            $nombreArchivo = "cuenta_por_cobrar_{$cuentaPorCobrar->id}_{$formato}.pdf";

            return $accion === 'stream'
                ? $pdf->stream($nombreArchivo)
                : $pdf->download($nombreArchivo);
        } catch (\Exception $e) {
            Log::error('❌ [CuentaPorCobrarController::imprimir] ERROR CRÍTICO', [
                'cuenta_id'      => $cuentaPorCobrar->id,
                'formato'        => $formato,
                'accion'         => $accion,
                'user_id'        => auth()->id(),
                'error_message'  => $e->getMessage(),
                'file'           => $e->getFile(),
                'line'           => $e->getLine(),
            ]);

            return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
        }
    }

    /**
     * ✅ DEPRECADO: Imprimir cuenta por cobrar - método legado
     * Usar imprimir() en su lugar
     */
    public function imprimirTicket80(CuentaPorCobrar $cuentaPorCobrar, Request $request)
    {
        return $this->imprimir($cuentaPorCobrar, $request);
    }

    public function checkCajaAbierta(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if (! $user) {
                return response()->json([
                    'tiene_caja_abierta' => false,
                    'mensaje'            => 'Usuario no autenticado',
                ], 200);
            }

            // Buscar caja abierta del usuario
            $apertura = AperturaCaja::where('user_id', $user->id)
                ->whereDoesntHave('cierre')
                ->with('caja', 'usuario')
                ->latest('fecha')
                ->first();

            if ($apertura) {
                $es_de_hoy  = $apertura->fecha->isToday();
                $dias_atras = $es_de_hoy ? 0 : now()->diffInDays($apertura->fecha);

                return response()->json([
                    'tiene_caja_abierta' => true,
                    'es_de_hoy'          => $es_de_hoy,
                    'dias_atras'         => $dias_atras,
                    'caja_nombre'        => $apertura->caja?->nombre,
                    'usuario_caja'       => $apertura->usuario?->name,
                    'mensaje'            => 'Caja abierta correctamente',
                ], 200);
            }

            return response()->json([
                'tiene_caja_abierta' => false,
                'mensaje'            => 'No hay caja abierta. Abre una caja antes de registrar pagos.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error verificando caja abierta', [
                'error'   => $e->getMessage(),
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'tiene_caja_abierta' => false,
                'mensaje'            => 'Error verificando estado de caja',
            ], 500);
        }
    }

    public function registrarPago(Request $request, CuentaPorCobrar $cuentaPorCobrar): JsonResponse
    {
        try {
            Log::info('📝 [PAGO CUENTAS POR COBRAR] Iniciando registro de pago', [
                'cuenta_id'  => $cuentaPorCobrar->id,
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

            // Verificar caja abierta
            $apertura = AperturaCaja::where('user_id', Auth::id())
                ->whereDoesntHave('cierre')
                ->latest('fecha')
                ->first();

            if (! $apertura) {
                return response()->json([
                    'message' => 'No hay caja abierta. Abre una caja antes de registrar pagos.',
                ], 422);
            }

            // Ejecutar en transacción
            $pago = DB::transaction(function () use ($validated, $cuentaPorCobrar, $apertura) {
                // ✅ NUEVO (2026-06-27): Calcular nuevo saldo para incluir en observaciones
                $nuevoSaldoPendiente = $cuentaPorCobrar->saldo_pendiente - $validated['monto'];

                // ✅ NUEVO (2026-06-27): Mejorar observaciones con monto, venta y saldo
                $numeroVenta = $cuentaPorCobrar->venta?->numero ?? 'N/A';
                $observacionesFormateadas = $validated['observaciones'] ?? '';
                if (!empty($observacionesFormateadas)) {
                    $observacionesFormateadas .= " | ";
                }
                $observacionesFormateadas .= "Monto: {$validated['monto']} | Venta: {$numeroVenta} | Saldo anterior: {$cuentaPorCobrar->saldo_pendiente} | Saldo nuevo: " . max(0, $nuevoSaldoPendiente);

                // Crear registro de pago
                $pago = Pago::create([
                    'numero_pago'          => Pago::generarNumeroPago(),
                    'cuenta_por_cobrar_id' => $cuentaPorCobrar->id,
                    'caja_id'              => $apertura->caja_id, // ✅ NUEVO (2026-02-11): Guardar caja_id del pago
                    'monto'                => $validated['monto'],
                    'tipo_pago_id'         => $validated['tipo_pago_id'],
                    'fecha'                => now(),
                    'fecha_pago'           => $validated['fecha_pago'],
                    'numero_recibo'        => $validated['numero_recibo'],
                    'numero_transferencia' => $validated['numero_transferencia'],
                    'numero_cheque'        => $validated['numero_cheque'],
                    'observaciones'        => $observacionesFormateadas, // ✅ MEJORADO (2026-06-27): Incluir monto, venta y saldo
                    'usuario_id'           => Auth::id(),
                    'estado'               => 'REGISTRADO',
                ]);

                // Registrar movimiento de caja (INGRESO)
                $tipoOperacion = TipoOperacionCaja::where('codigo', 'PAGO')->firstOrFail();
                $tipoPago      = TipoPago::find($validated['tipo_pago_id']);

                // ✅ NUEVO (2026-06-27): Extraer numero_venta para usar en observaciones (evitar nullsafe en string)
                $numeroVentaMov = $cuentaPorCobrar->venta?->numero ?? 'N/A';

                MovimientoCaja::create([
                    'apertura_caja_id'  => $apertura->id, // ✅ NUEVO (2026-06-27): Guardar apertura_caja_id para filtrado en reportes
                    'caja_id'           => $apertura->caja_id,
                    'tipo_operacion_id' => $tipoOperacion->id,
                    'numero_documento'  => $pago->numero_pago, // ✅ MEJORADO (2026-06-27): Usar numero_pago en lugar de numero_venta
                    'observaciones' => "Pago de CxC | Venta: {$numeroVentaMov} | Monto: {$validated['monto']}", // ✅ MEJORADO (2026-06-27): Agregar referencias
                    'monto'        => $validated['monto'], // POSITIVO para ingresos
                    'fecha'        => now(),  // ✅ CORREGIDO (2026-02-11): Usar NOW() para que se registre en el momento actual, no en la fecha_pago
                    'user_id'      => Auth::id(),
                    'tipo_pago_id' => $validated['tipo_pago_id'],
                    'pago_id'      => $pago->id, // ✅ Registrar el ID del pago
                ]);

                // Actualizar saldo pendiente y monto pagado
                $nuevoSaldo = $cuentaPorCobrar->saldo_pendiente - $validated['monto'];
                $nuevoMontoPagado = ($cuentaPorCobrar->monto_pagado ?? 0) + $validated['monto'];
                $cuentaPorCobrar->update([
                    'monto_pagado'    => $nuevoMontoPagado,
                    'saldo_pendiente' => max(0, $nuevoSaldo),
                    'estado'          => $nuevoSaldo <= 0 ? 'PAGADO' : 'PARCIAL',
                ]);

                Log::info('✅ [PAGO CUENTAS POR COBRAR] Pago registrado exitosamente', [
                    'pago_id'     => $pago->id,
                    'cuenta_id'   => $cuentaPorCobrar->id,
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
                    'cuenta' => $cuentaPorCobrar->fresh(),
                ],
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ [PAGO CUENTAS POR COBRAR] Error registrando pago', [
                'cuenta_id'  => $cuentaPorCobrar->id,
                'error'      => $e->getMessage(),
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Error al registrar el pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ✅ NUEVO (2026-07-23): Registrar múltiples pagos en una sola transacción
    public function registrarPagos(Request $request, CuentaPorCobrar $cuentaPorCobrar): JsonResponse
    {
        try {
            Log::info('📝 [PAGOS MÚLTIPLES CUENTAS POR COBRAR] Iniciando registro', [
                'cuenta_id'  => $cuentaPorCobrar->id,
                'usuario_id' => Auth::id(),
                'cantidad_pagos' => count($request->input('pagos', [])),
            ]);

            // Validar datos
            $validated = $request->validate([
                'pagos'                              => 'required|array|min:1',
                'pagos.*.tipo_pago_id'               => 'required|integer',
                'pagos.*.monto'                      => 'required|numeric|min:0.01',
                'pagos.*.fecha_pago'                 => 'required|date',
                'pagos.*.numero_recibo'              => 'nullable|string',
                'pagos.*.numero_transferencia'       => 'nullable|string',
                'pagos.*.numero_cheque'              => 'nullable|string',
                'pagos.*.observaciones'              => 'nullable|string',
            ]);

            // Verificar caja abierta
            $apertura = AperturaCaja::where('user_id', Auth::id())
                ->whereDoesntHave('cierre')
                ->latest('fecha')
                ->first();

            if (! $apertura) {
                return response()->json([
                    'message' => 'No hay caja abierta. Abre una caja antes de registrar pagos.',
                ], 422);
            }

            // Calcular monto total
            $montoTotal = array_reduce($validated['pagos'], function ($carry, $pago) {
                return $carry + $pago['monto'];
            }, 0);

            // Ejecutar en transacción
            $pagosRegistrados = DB::transaction(function () use ($validated, $cuentaPorCobrar, $apertura, $montoTotal) {
                $pagosCreados = [];

                foreach ($validated['pagos'] as $datoPago) {
                    // Calcular nuevo saldo
                    $nuevoSaldoPendiente = $cuentaPorCobrar->saldo_pendiente - $datoPago['monto'];

                    // Mejorar observaciones
                    $numeroVenta = $cuentaPorCobrar->venta?->numero ?? 'N/A';
                    $observacionesFormateadas = $datoPago['observaciones'] ?? '';
                    if (!empty($observacionesFormateadas)) {
                        $observacionesFormateadas .= " | ";
                    }
                    $observacionesFormateadas .= "Monto: {$datoPago['monto']} | Venta: {$numeroVenta} | Saldo anterior: {$cuentaPorCobrar->saldo_pendiente} | Saldo nuevo: " . max(0, $nuevoSaldoPendiente);

                    // Crear registro de pago
                    $pago = Pago::create([
                        'numero_pago'          => Pago::generarNumeroPago(),
                        'cuenta_por_cobrar_id' => $cuentaPorCobrar->id,
                        'caja_id'              => $apertura->caja_id,
                        'monto'                => $datoPago['monto'],
                        'tipo_pago_id'         => $datoPago['tipo_pago_id'],
                        'fecha'                => now(),
                        'fecha_pago'           => $datoPago['fecha_pago'],
                        'numero_recibo'        => $datoPago['numero_recibo'],
                        'numero_transferencia' => $datoPago['numero_transferencia'],
                        'numero_cheque'        => $datoPago['numero_cheque'],
                        'observaciones'        => $observacionesFormateadas,
                        'usuario_id'           => Auth::id(),
                        'estado'               => 'REGISTRADO',
                    ]);

                    // Registrar movimiento de caja (INGRESO)
                    $tipoOperacion = TipoOperacionCaja::where('codigo', 'PAGO')->firstOrFail();
                    $tipoPago = TipoPago::find($datoPago['tipo_pago_id']);
                    $numeroVentaMov = $cuentaPorCobrar->venta?->numero ?? 'N/A';

                    MovimientoCaja::create([
                        'apertura_caja_id'  => $apertura->id,
                        'caja_id'           => $apertura->caja_id,
                        'tipo_operacion_id' => $tipoOperacion->id,
                        'numero_documento'  => $pago->numero_pago,
                        'observaciones'     => "Pago de CxC ({$tipoPago?->nombre}) | Venta: {$numeroVentaMov} | Monto: {$datoPago['monto']}",
                        'monto'             => $datoPago['monto'],
                        'fecha'             => now(),
                        'user_id'           => Auth::id(),
                        'tipo_pago_id'      => $datoPago['tipo_pago_id'],
                        'pago_id'           => $pago->id,
                    ]);

                    $pagosCreados[] = $pago;
                }

                // Actualizar saldo pendiente y monto pagado de la cuenta (una sola vez)
                $nuevoSaldo = $cuentaPorCobrar->saldo_pendiente - $montoTotal;
                $nuevoMontoPagado = ($cuentaPorCobrar->monto_pagado ?? 0) + $montoTotal;
                $cuentaPorCobrar->update([
                    'monto_pagado'    => $nuevoMontoPagado,
                    'saldo_pendiente' => max(0, $nuevoSaldo),
                    'estado'          => $nuevoSaldo <= 0 ? 'PAGADO' : 'PARCIAL',
                ]);

                Log::info('✅ [PAGOS MÚLTIPLES CUENTAS POR COBRAR] Pagos registrados exitosamente', [
                    'cantidad_pagos' => count($pagosCreados),
                    'monto_total'    => $montoTotal,
                    'cuenta_id'      => $cuentaPorCobrar->id,
                    'nuevo_saldo'    => $nuevoSaldo,
                ]);

                return $pagosCreados;
            });

            return response()->json([
                'success' => true,
                'message' => 'Pagos registrados exitosamente',
                'data'    => [
                    'pagos'  => $pagosRegistrados,
                    'cuenta' => $cuentaPorCobrar->fresh(),
                ],
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ [PAGOS MÚLTIPLES CUENTAS POR COBRAR] Error registrando pagos', [
                'cuenta_id'  => $cuentaPorCobrar->id,
                'error'      => $e->getMessage(),
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Error al registrar los pagos: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function anularPago(Request $request, CuentaPorCobrar $cuentaPorCobrar, Pago $pago): JsonResponse
    {
        try {
            Log::info('🗑️ [ANULAR PAGO CUENTAS POR COBRAR] Iniciando anulación', [
                'pago_id' => $pago->id,
                'cuenta_id' => $cuentaPorCobrar->id,
                'usuario_id' => Auth::id(),
            ]);

            // Verificar permisos
            if (!auth()->user()->hasRole(['admin', 'Admin'])) {
                return response()->json(['message' => 'No tienes permiso'], 403);
            }

            // Validar que el pago pertenece a la cuenta
            if ($pago->cuenta_por_cobrar_id !== $cuentaPorCobrar->id) {
                return response()->json(['message' => 'El pago no pertenece a esta cuenta'], 422);
            }

            $motivo = $request->input('motivo', 'Sin motivo especificado');

            // Ejecutar en transacción
            DB::transaction(function () use ($pago, $cuentaPorCobrar, $motivo) {
                // Revertir movimiento de caja
                if ($pago->movimientoCaja) {
                    $movOriginal = $pago->movimientoCaja;
                    $tipoAnulacion = TipoOperacionCaja::where('codigo', 'ANULACION')->firstOrFail();

                    MovimientoCaja::create([
                        'apertura_caja_id' => $movOriginal->apertura_caja_id, // ✅ NUEVO (2026-06-27): Usar apertura del movimiento original
                        'caja_id' => $movOriginal->caja_id,
                        'tipo_operacion_id' => $tipoAnulacion->id,
                        'numero_documento' => $cuentaPorCobrar->venta?->numero ?? "CuentaPorCobrar#{$cuentaPorCobrar->id}",
                        'observaciones' => "REVERSIÓN por anulación de pago #{$pago->id}",
                        'monto' => abs($movOriginal->monto) * -1, // NEGATIVO (inverso del ingreso)
                        'fecha' => now(),
                        'user_id' => Auth::id(),
                    ]);
                }

                // Actualizar saldo de la cuenta (restaurar lo que se restó) y monto pagado
                $nuevoSaldo = $cuentaPorCobrar->saldo_pendiente + $pago->monto;
                $nuevoMontoPagado = max(0, ($cuentaPorCobrar->monto_pagado ?? 0) - $pago->monto);
                $cuentaPorCobrar->update([
                    'monto_pagado'    => $nuevoMontoPagado,
                    'saldo_pendiente' => $nuevoSaldo,
                    'estado' => $nuevoSaldo >= $cuentaPorCobrar->monto_original ? 'PENDIENTE' : 'PARCIAL',
                ]);

                // Marcar pago como anulado
                $pago->update([
                    'estado' => 'ANULADO',
                ]);

                Log::info('✅ [ANULAR PAGO CUENTAS POR COBRAR] Pago anulado exitosamente', [
                    'pago_id' => $pago->id,
                    'cuenta_id' => $cuentaPorCobrar->id,
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
                    'cuenta' => $cuentaPorCobrar->fresh(),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ [ANULAR PAGO CUENTAS POR COBRAR] Error anulando pago', [
                'pago_id' => $pago->id,
                'cuenta_id' => $cuentaPorCobrar->id,
                'error' => $e->getMessage(),
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Error al anular el pago: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Anular una cuenta por cobrar completa
     * Reversa: Pagos, Movimientos de Caja
     */
    public function anularCuenta(Request $request, CuentaPorCobrar $cuentaPorCobrar): JsonResponse
    {
        try {
            Log::info('🗑️ [ANULAR CUENTA POR COBRAR] Iniciando anulación', [
                'cuenta_id' => $cuentaPorCobrar->id,
                'usuario_id' => Auth::id(),
            ]);

            // Verificar permisos
            if (!auth()->user()->hasRole(['admin', 'Admin'])) {
                return response()->json(['message' => 'No tienes permiso para anular cuentas'], 403);
            }

            // Validar que no está ya anulada
            if ($cuentaPorCobrar->estado === 'ANULADO') {
                return response()->json(['message' => 'Esta cuenta ya está anulada'], 422);
            }

            $motivo = $request->input('motivo', 'Sin motivo especificado');

            // Cargar relaciones necesarias
            $cuentaPorCobrar->load(['pagos', 'venta']);

            // Ejecutar en transacción
            DB::transaction(function () use ($cuentaPorCobrar, $motivo) {
                $montoAnulado = $cuentaPorCobrar->saldo_pendiente;
                $cajaRevertida = false;
                $pagosAnulados = 0;

                // PASO 1: Anular todos los pagos asociados (para revertir movimientos de caja)
                foreach ($cuentaPorCobrar->pagos as $pago) {
                    if ($pago->estado !== 'ANULADO') {
                        // PASO 2: Revertir movimiento de caja de PAGOS
                        if ($pago->movimientoCaja) {
                            try {
                                $movOriginal = $pago->movimientoCaja;
                                $tipoAnulacion = TipoOperacionCaja::where('codigo', 'ANULACION')->firstOrFail();

                                MovimientoCaja::create([
                                    'apertura_caja_id' => $movOriginal->apertura_caja_id, // ✅ NUEVO (2026-06-27): Usar apertura del movimiento original
                                    'caja_id' => $movOriginal->caja_id,
                                    'tipo_operacion_id' => $tipoAnulacion->id,
                                    'numero_documento' => $cuentaPorCobrar->venta?->numero ?? "CuentaPorCobrar#{$cuentaPorCobrar->id}",
                                    'observaciones' => "REVERSIÓN por anulación de pago #{$pago->id} - Cuenta #{$cuentaPorCobrar->id}",
                                    'monto' => abs($movOriginal->monto) * -1,
                                    'fecha' => now(),
                                    'user_id' => Auth::id(),
                                ]);

                                $cajaRevertida = true;
                                Log::info('✅ Movimiento de caja de pago revertido', [
                                    'pago_id' => $pago->id,
                                    'cuenta_id' => $cuentaPorCobrar->id,
                                    'monto' => $movOriginal->monto,
                                ]);
                            } catch (\Exception $e) {
                                Log::warning('⚠️ No se pudo revertir movimiento de caja del pago', [
                                    'pago_id' => $pago->id,
                                    'error' => $e->getMessage(),
                                ]);
                            }
                        }

                        // Marcar pago como anulado
                        $pago->update(['estado' => 'ANULADO']);
                        $pagosAnulados++;
                    }
                }

                // PASO 2.5: Revertir movimiento de caja de la VENTA (si existe)
                if ($cuentaPorCobrar->venta && $cuentaPorCobrar->venta->movimientoCaja) {
                    try {
                        $movVenta = $cuentaPorCobrar->venta->movimientoCaja;
                        $tipoAnulacion = TipoOperacionCaja::where('codigo', 'ANULACION')->firstOrFail();

                        MovimientoCaja::create([
                            'apertura_caja_id' => $movVenta->apertura_caja_id, // ✅ NUEVO (2026-06-27): Usar apertura del movimiento original
                            'caja_id' => $movVenta->caja_id,
                            'tipo_operacion_id' => $tipoAnulacion->id,
                            'numero_documento' => $cuentaPorCobrar->venta->numero,
                            'observaciones' => "REVERSIÓN de movimiento de venta por anulación de CxC #{$cuentaPorCobrar->id}",
                            'monto' => abs($movVenta->monto) * -1,
                            'fecha' => now(),
                            'user_id' => Auth::id(),
                        ]);

                        $cajaRevertida = true;
                        Log::info('✅ Movimiento de caja de venta revertido', [
                            'venta_id' => $cuentaPorCobrar->venta->id,
                            'cuenta_id' => $cuentaPorCobrar->id,
                            'monto' => $movVenta->monto,
                        ]);
                    } catch (\Exception $e) {
                        Log::warning('⚠️ No se pudo revertir movimiento de caja de venta', [
                            'venta_id' => $cuentaPorCobrar->venta->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }

                // PASO 3: Actualizar estado de la cuenta a ANULADO
                $observacionesFinales = ($cuentaPorCobrar->observaciones ? $cuentaPorCobrar->observaciones . "\n" : "") .
                    "[ANULADO] Motivo: {$motivo}\n" .
                    "Usuario: " . auth()->user()->name . "\n" .
                    "Fecha: " . now()->format('Y-m-d H:i:s') . "\n" .
                    "Pagos anulados: {$pagosAnulados}\n" .
                    "Movimientos de caja revertidos: " . ($cajaRevertida ? 'Sí' : 'No');

                $cuentaPorCobrar->update([
                    'estado' => 'ANULADO',
                    'saldo_pendiente' => 0,
                    'observaciones' => $observacionesFinales,
                ]);

                Log::info('✅ [ANULAR CUENTA POR COBRAR] Cuenta anulada exitosamente', [
                    'cuenta_id' => $cuentaPorCobrar->id,
                    'venta_id' => $cuentaPorCobrar->venta_id,
                    'monto_anulado' => $montoAnulado,
                    'pagos_anulados' => $pagosAnulados,
                    'movimientos_caja_revertidos' => $cajaRevertida,
                    'motivo' => $motivo,
                    'usuario_id' => Auth::id(),
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Cuenta por cobrar anulada exitosamente. Se han revertido movimientos de caja y pagos asociados.',
                'data' => [
                    'cuenta' => $cuentaPorCobrar->fresh(),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ [ANULAR CUENTA POR COBRAR] Error anulando cuenta', [
                'cuenta_id' => $cuentaPorCobrar->id,
                'error' => $e->getMessage(),
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Error al anular la cuenta: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ NUEVO: Actualizar fecha de vencimiento de una cuenta por cobrar
     */
    public function actualizarFechaVencimiento(Request $request, CuentaPorCobrar $cuentaPorCobrar)
    {
        try {
            // Validar la nueva fecha
            $validated = $request->validate([
                'fecha_vencimiento' => 'required|date|after_or_equal:today',
            ], [
                'fecha_vencimiento.required' => 'La fecha de vencimiento es requerida',
                'fecha_vencimiento.date' => 'Debe ser una fecha válida',
                'fecha_vencimiento.after_or_equal' => 'La fecha debe ser hoy o una fecha futura',
            ]);

            $fechaAntigua = $cuentaPorCobrar->fecha_vencimiento;

            // Actualizar la fecha de vencimiento
            $cuentaPorCobrar->update([
                'fecha_vencimiento' => $validated['fecha_vencimiento'],
            ]);

            // Recalcular días vencido (asegurar que sea integer)
            $cuentaPorCobrar->dias_vencido = (int) now()->diffInDays($cuentaPorCobrar->fecha_vencimiento, false);
            $cuentaPorCobrar->save();

            Log::info('✅ Fecha de vencimiento actualizada', [
                'cuenta_id' => $cuentaPorCobrar->id,
                'fecha_antigua' => $fechaAntigua,
                'fecha_nueva' => $validated['fecha_vencimiento'],
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Fecha de vencimiento actualizada exitosamente',
                'data' => [
                    'id' => $cuentaPorCobrar->id,
                    'fecha_vencimiento' => $cuentaPorCobrar->fecha_vencimiento->format('Y-m-d'),
                    'dias_vencido' => $cuentaPorCobrar->dias_vencido,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Error actualizando fecha de vencimiento', [
                'cuenta_id' => $cuentaPorCobrar->id,
                'error' => $e->getMessage(),
                'usuario_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la fecha: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ NUEVO 2026-06-23: Endpoint API para listar cuentas por cobrar (para app Flutter)
     *
     * GET /api/cuentas-por-cobrar
     * Parámetros:
     * - per_page: cantidad de registros (default: 20)
     * - page: página (default: 1)
     * - estado: filtrar por estado (PENDIENTE, PARCIAL, PAGADO)
     * - cliente_id: filtrar por cliente
     * - q: búsqueda libre
     * - fecha_desde: fecha vencimiento desde
     * - fecha_hasta: fecha vencimiento hasta
     * - solo_vencidas: boolean (mostrar solo vencidas)
     * - sort_by: campo para ordenar (default: id)
     * - sort_order: asc|desc (default: desc)
     */
    public function indexApi(Request $request): JsonResponse
    {
        try {
            $query = CuentaPorCobrar::with(['cliente', 'venta', 'pagos', 'usuario'])
                ->when($request->filled('estado'), function ($q) use ($request) {
                    $q->whereRaw('LOWER(estado) = ?', [strtolower($request->estado)]);
                })
                ->when($request->filled('cliente_id'), function ($q) use ($request) {
                    $q->where('cliente_id', $request->cliente_id);
                })
                ->when($request->filled('q'), function ($q) use ($request) {
                    $searchTerm = "%{$request->q}%";
                    $isNumeric = is_numeric($request->q);

                    $q->where(function ($subQ) use ($searchTerm, $isNumeric, $request) {
                        // Búsqueda por ID de cuenta
                        if ($isNumeric) {
                            $subQ->orWhere('id', (int)$request->q);
                        }
                        // Búsqueda por referencia
                        $subQ->orWhere('referencia_documento', 'LIKE', $searchTerm);
                        // Búsqueda por cliente
                        $subQ->orWhereHas('cliente', function ($clienteQ) use ($searchTerm) {
                            $clienteQ->where('nombre', 'LIKE', $searchTerm);
                        });
                    });
                })
                ->when($request->filled('fecha_desde') && $request->filled('fecha_hasta'), function ($q) use ($request) {
                    $q->whereBetween('fecha_vencimiento', [$request->fecha_desde, $request->fecha_hasta]);
                })
                ->when($request->filled('solo_vencidas') && $request->boolean('solo_vencidas'), function ($q) {
                    $q->whereDate('fecha_vencimiento', '<', today())
                        ->where('estado', '!=', 'PAGADO')
                        ->where('saldo_pendiente', '>', 0);  // ✅ NUEVO: Excluir cuentas completamente pagadas
                });

            // Ordenamiento
            $sortBy = $request->input('sort_by', 'id');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginación
            $perPage = $request->input('per_page', 20);
            $cuentas = $query->paginate($perPage);

            // ✅ NUEVO: Recalcular dias_vencido dinámicamente para cada cuenta
            $cuentas->getCollection()->transform(function ($cuenta) {
                $cuenta->dias_vencido = $cuenta->calcularDiasVencido();
                return $cuenta;
            });

            // Estadísticas
            $estadisticas = [
                'total' => CuentaPorCobrar::count(),
                'pendientes' => CuentaPorCobrar::where('estado', '!=', 'PAGADO')
                    ->where('saldo_pendiente', '>', 0)->count(),  // ✅ Excluir pagadas
                'monto_total_pendiente' => CuentaPorCobrar::where('estado', '!=', 'PAGADO')
                    ->where('saldo_pendiente', '>', 0)  // ✅ Excluir pagadas
                    ->sum(DB::raw('CAST(saldo_pendiente AS DECIMAL(10, 2))')),
                'cuentas_vencidas' => CuentaPorCobrar::where('estado', '!=', 'PAGADO')
                    ->where('saldo_pendiente', '>', 0)  // ✅ Excluir pagadas
                    ->whereDate('fecha_vencimiento', '<', today())
                    ->count(),
                'monto_total_vencido' => CuentaPorCobrar::where('estado', '!=', 'PAGADO')
                    ->where('saldo_pendiente', '>', 0)  // ✅ Excluir pagadas
                    ->whereDate('fecha_vencimiento', '<', today())
                    ->sum(DB::raw('CAST(saldo_pendiente AS DECIMAL(10, 2))')),
            ];

            // Transformar datos para la app
            $data = $cuentas->map(function ($cuenta) {
                return [
                    'id' => $cuenta->id,
                    'venta_id' => $cuenta->venta_id,
                    'cliente_id' => $cuenta->cliente_id,
                    'monto_original' => (float) $cuenta->monto_original,
                    'monto_pagado' => (float) $cuenta->monto_pagado,
                    'saldo_pendiente' => (float) $cuenta->saldo_pendiente,
                    'fecha_vencimiento' => $cuenta->fecha_vencimiento?->format('Y-m-d'),
                    'dias_vencido' => $cuenta->dias_vencido,
                    'estado' => $cuenta->estado,
                    'referencia_documento' => $cuenta->referencia_documento,
                    'observaciones' => $cuenta->observaciones,
                    'cliente' => $cuenta->cliente ? [
                        'id' => $cuenta->cliente->id,
                        'nombre' => $cuenta->cliente->nombre,
                        'nit' => $cuenta->cliente->nit,
                        'telefono' => $cuenta->cliente->telefono,
                        'email' => $cuenta->cliente->email,
                    ] : null,
                    'venta' => $cuenta->venta ? [
                        'id' => $cuenta->venta->id,
                        'numero' => $cuenta->venta->numero,
                        'fecha' => $cuenta->venta->fecha?->format('Y-m-d'),
                    ] : null,
                    'pagos_count' => $cuenta->pagos->count(),
                ];
            })->toArray();

            return response()->json([
                'success' => true,
                'message' => 'Cuentas por cobrar obtenidas exitosamente',
                'data' => $data,
                'pagination' => [
                    'current_page' => $cuentas->currentPage(),
                    'per_page' => $cuentas->perPage(),
                    'total' => $cuentas->total(),
                    'last_page' => $cuentas->lastPage(),
                    'has_more_pages' => $cuentas->hasMorePages(),
                ],
                'estadisticas' => $estadisticas,
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error obteniendo cuentas por cobrar para API', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener cuentas por cobrar: ' . $e->getMessage(),
            ], 500);
        }
    }
}

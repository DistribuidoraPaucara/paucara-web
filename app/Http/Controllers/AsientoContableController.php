<?php

namespace App\Http\Controllers;

use App\Models\AsientoContable;
use App\Models\CuentaContable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsientoContableController extends Controller
{
    /**
     * Lista de asientos contables
     */
    public function index(Request $request)
    {
        $query = AsientoContable::with(['usuario', 'detalles'])
            ->orderBy('fecha', 'desc')
            ->orderBy('numero', 'desc');

        // Filtros
        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->fecha_hasta);
        }

        if ($request->filled('tipo_documento')) {
            $query->where('tipo_documento', $request->tipo_documento);
        }

        if ($request->filled('numero')) {
            $query->where('numero', 'LIKE', "%{$request->numero}%");
        }

        $asientos = $query->paginate(15)->withQueryString();

        return Inertia::render('Contabilidad/AsientosContables/Index', [
            'asientos' => $asientos,
            'filtros' => $request->only(['fecha_desde', 'fecha_hasta', 'tipo_documento', 'numero']),
            'tipos_documento' => ['VENTA', 'COMPRA', 'AJUSTE'],
        ]);
    }

    /**
     * Mostrar asiento contable específico
     */
    public function show(AsientoContable $asientoContable)
    {
        $asientoContable->load(['usuario', 'detalles' => function ($query) {
            $query->orderBy('orden');
        }, 'asientable']);

        return Inertia::render('Contabilidad/AsientosContables/Show', [
            'asiento' => $asientoContable,
        ]);
    }

    /**
     * API: Lista de asientos contables
     */
    public function indexApi(Request $request)
    {
        $query = AsientoContable::with(['usuario'])
            ->orderBy('fecha', 'desc')
            ->orderBy('numero', 'desc');

        // Filtros
        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->fecha_hasta);
        }

        if ($request->filled('tipo_documento')) {
            $query->where('tipo_documento', $request->tipo_documento);
        }

        $asientos = $query->paginate($request->get('per_page', 15));

        return response()->json($asientos);
    }

    /**
     * API: Obtener asiento específico con detalles
     */
    public function showApi(AsientoContable $asientoContable)
    {
        $asientoContable->load(['usuario', 'detalles' => function ($query) {
            $query->orderBy('orden');
        }, 'asientable']);

        return response()->json($asientoContable);
    }

    /**
     * Reporte: Libro Mayor por cuenta
     */
    public function libroMayor(Request $request)
    {
        // Si no hay parámetros, mostrar formulario con cuentas disponibles
        if (! $request->filled('cuenta_codigo')) {
            $cuentas_disponibles = CuentaContable::where('activa', true)
                ->orderBy('codigo')
                ->get(['codigo', 'nombre', 'tipo', 'naturaleza']);

            return Inertia::render('Contabilidad/Reportes/LibroMayor', [
                'cuentas_disponibles' => $cuentas_disponibles,
            ]);
        }

        $request->validate([
            'cuenta_codigo' => 'required|exists:cuenta_contables,codigo',
            'fecha_desde' => 'required|date',
            'fecha_hasta' => 'required|date|after_or_equal:fecha_desde',
        ]);

        $cuenta = CuentaContable::where('codigo', $request->cuenta_codigo)->first();

        $movimientos = AsientoContable::join('detalle_asiento_contables', 'asiento_contables.id', '=', 'detalle_asiento_contables.asiento_contable_id')
            ->where('detalle_asiento_contables.codigo_cuenta', $request->cuenta_codigo)
            ->whereBetween('asiento_contables.fecha', [$request->fecha_desde, $request->fecha_hasta])
            ->select([
                'asiento_contables.fecha',
                'asiento_contables.numero',
                'asiento_contables.concepto',
                'detalle_asiento_contables.debe',
                'detalle_asiento_contables.haber',
                'detalle_asiento_contables.descripcion',
            ])
            ->orderBy('asiento_contables.fecha')
            ->orderBy('asiento_contables.numero')
            ->get();

        // Calcular saldos
        $saldo = 0;
        $movimientos = $movimientos->map(function ($movimiento) use (&$saldo, $cuenta) {
            if ($cuenta->naturaleza === 'deudora') {
                $saldo += $movimiento->debe - $movimiento->haber;
            } else {
                $saldo += $movimiento->haber - $movimiento->debe;
            }
            $movimiento->saldo = $saldo;

            return $movimiento;
        });

        $cuentas_disponibles = CuentaContable::where('activa', true)
            ->orderBy('codigo')
            ->get(['codigo', 'nombre', 'tipo', 'naturaleza']);

        return Inertia::render('Contabilidad/Reportes/LibroMayor', [
            'cuenta' => $cuenta,
            'movimientos' => $movimientos,
            'fecha_desde' => $request->fecha_desde,
            'fecha_hasta' => $request->fecha_hasta,
            'saldo_final' => $saldo,
            'cuentas_disponibles' => $cuentas_disponibles,
        ]);
    }

    /**
     * Reporte: Balance de Comprobación
     */
    public function balanceComprobacion(Request $request)
    {
        // Si no hay parámetros, mostrar formulario
        if (! $request->filled('fecha_desde') || ! $request->filled('fecha_hasta')) {
            return Inertia::render('Contabilidad/Reportes/BalanceComprobacion');
        }

        $request->validate([
            'fecha_desde' => 'required|date',
            'fecha_hasta' => 'required|date|after_or_equal:fecha_desde',
        ]);

        $cuentas = CuentaContable::select([
            'codigo',
            'nombre',
            'tipo',
            'naturaleza',
        ])
            ->where('activa', true)
            ->orderBy('codigo')
            ->get()
            ->map(function ($cuenta) use ($request) {
                // Obtener movimientos de la cuenta
                $movimientos = AsientoContable::join('detalle_asiento_contables', 'asiento_contables.id', '=', 'detalle_asiento_contables.asiento_contable_id')
                    ->where('detalle_asiento_contables.codigo_cuenta', $cuenta->codigo)
                    ->whereBetween('asiento_contables.fecha', [$request->fecha_desde, $request->fecha_hasta])
                    ->selectRaw('SUM(detalle_asiento_contables.debe) as total_debe, SUM(detalle_asiento_contables.haber) as total_haber')
                    ->first();

                $totalDebe = $movimientos->total_debe ?? 0;
                $totalHaber = $movimientos->total_haber ?? 0;

                // Calcular saldo según naturaleza de la cuenta
                if ($cuenta->naturaleza === 'deudora') {
                    $saldo = $totalDebe - $totalHaber;
                } else {
                    $saldo = $totalHaber - $totalDebe;
                }

                return [
                    'codigo' => $cuenta->codigo,
                    'nombre' => $cuenta->nombre,
                    'tipo' => $cuenta->tipo,
                    'naturaleza' => $cuenta->naturaleza,
                    'debe' => $totalDebe,
                    'haber' => $totalHaber,
                    'saldo' => $saldo,
                ];
            })
            ->filter(function ($cuenta) {
                // Solo mostrar cuentas con movimiento
                return $cuenta['debe'] > 0 || $cuenta['haber'] > 0;
            });

        $totales = [
            'debe' => $cuentas->sum('debe'),
            'haber' => $cuentas->sum('haber'),
        ];

        return Inertia::render('Contabilidad/Reportes/BalanceComprobacion', [
            'cuentas' => $cuentas->values(),
            'totales' => $totales,
            'fecha_desde' => $request->fecha_desde,
            'fecha_hasta' => $request->fecha_hasta,
        ]);
    }
}

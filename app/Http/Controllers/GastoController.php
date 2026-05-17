<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGastoRequest;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GastoController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:cajas.gastos.index')->only('index');
        $this->middleware('permission:cajas.gastos.create')->only(['create', 'store']);
    }

    public function index(Request $request)
    {
        $query = MovimientoCaja::with(['tipoOperacion', 'usuario', 'caja'])
            ->whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
            ->when($request->fecha_desde, fn($q) => $q->whereDate('fecha', '>=', $request->fecha_desde))
            ->when($request->fecha_hasta, fn($q) => $q->whereDate('fecha', '<=', $request->fecha_hasta))
            ->when($request->q, function ($q) use ($request) {
                $q->where('descripcion', 'LIKE', "%{$request->q}%")
                  ->orWhere('numero_documento', 'LIKE', "%{$request->q}%");
            });

        $gastosPaginados = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();

        // Mapear gastos al formato esperado
        $gastos = $gastosPaginados->getCollection()->map(function ($gasto) {
            preg_match('/\[([^\]]+)\]/', $gasto->descripcion, $matches);
            $categoria = $matches[1] ?? 'VARIOS';

            return [
                'id' => $gasto->id,
                'user_id' => $gasto->user_id,
                'usuario' => $gasto->usuario->name,
                'monto' => abs($gasto->monto),
                'descripcion' => str_replace("[{$categoria}] ", '', $gasto->descripcion),
                'categoria' => $categoria,
                'numero_comprobante' => $gasto->numero_documento,
                'proveedor' => $gasto->observaciones,
                'observaciones' => '',
                'fecha' => $gasto->fecha,
                'created_at' => $gasto->created_at,
            ];
        });

        $estadisticas = [
            'total_gastos' => $gastosPaginados->total(),
            'monto_total' => abs(MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
                ->sum('monto')),
            'promedio_gasto' => $gastosPaginados->total() > 0 ? abs(MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))->sum('monto')) / $gastosPaginados->total() : 0,
            'categoria_mayor_gasto' => 'N/A',
            'gastos_por_categoria' => [],
        ];

        return Inertia::render('Cajas/Gastos', [
            'gastos' => [
                'data' => $gastos->toArray(),
                'links' => $gastosPaginados->links(),
                'total' => $gastosPaginados->total(),
            ],
            'filtros' => $request->only(['fecha_desde', 'fecha_hasta', 'q']),
            'estadisticas' => $estadisticas,
            'usuarios' => [],
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $cajaAbierta = $user->empleado?->cajaAbierta();

        if (!$cajaAbierta) {
            return redirect()->route('cajas.gastos.index')
                ->with('error', 'Debe abrir una caja antes de registrar gastos');
        }

        return Inertia::render('Cajas/Gastos', [
            'caja_abierta' => $cajaAbierta,
            'categorias' => [
                'TRANSPORTE' => 'Transporte',
                'LIMPIEZA' => 'Limpieza',
                'MANTENIMIENTO' => 'Mantenimiento',
                'SERVICIOS' => 'Servicios',
                'VARIOS' => 'Varios',
            ],
        ]);
    }

    public function store(StoreGastoRequest $request)
    {
        try {
            $user = Auth::user();
            $cajaAbierta = $user->empleado->cajaAbierta();

            if (!$cajaAbierta) {
                return back()->withErrors(['caja' => 'No tiene caja abierta']);
            }

            $tipoOperacion = TipoOperacionCaja::where('codigo', 'GASTO')->firstOrFail();

            $movimiento = MovimientoCaja::create([
                'caja_id' => $cajaAbierta->id,
                'tipo_operacion_id' => $tipoOperacion->id,
                'numero_documento' => $request->numero_comprobante,
                'descripcion' => "[{$request->categoria}] {$request->descripcion}",
                'monto' => -abs($request->monto),
                'fecha' => now(),
                'user_id' => Auth::id(),
                'observaciones' => $request->observaciones,
            ]);

            Log::info("✅ Gasto registrado", [
                'movimiento_id' => $movimiento->id,
                'monto' => $request->monto,
            ]);

            return back()
                ->with('success', 'Gasto registrado correctamente');

        } catch (\Exception $e) {
            Log::error("❌ Error registrando gasto: " . $e->getMessage());
            return back()->withErrors(['error' => 'Error al registrar gasto'])->withInput();
        }
    }

    /**
     * ADMIN: Gestión de gastos de todos los usuarios
     */
    public function adminIndex(Request $request)
    {
        $query = MovimientoCaja::with(['tipoOperacion', 'usuario', 'caja'])
            ->whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
            ->when($request->usuario_id, fn($q) => $q->where('user_id', $request->usuario_id))
            ->when($request->categoria, function ($q) use ($request) {
                $q->where('descripcion', 'LIKE', "%[{$request->categoria}]%");
            })
            ->when($request->fecha_inicio, fn($q) => $q->whereDate('fecha', '>=', $request->fecha_inicio))
            ->when($request->fecha_fin, fn($q) => $q->whereDate('fecha', '<=', $request->fecha_fin))
            ->when($request->busqueda, function ($q) use ($request) {
                $q->where('descripcion', 'LIKE', "%{$request->busqueda}%")
                  ->orWhere('numero_documento', 'LIKE', "%{$request->busqueda}%");
            });

        $gastos = $query->orderBy('fecha', 'desc')->paginate(25);

        // Mapear gastos al formato esperado
        $gastos->getCollection()->transform(function ($gasto) {
            // Extraer categoría de la descripción
            preg_match('/\[([^\]]+)\]/', $gasto->descripcion, $matches);
            $categoria = $matches[1] ?? 'VARIOS';

            return [
                'id' => $gasto->id,
                'user_id' => $gasto->user_id,
                'usuario' => $gasto->usuario->name,
                'monto' => abs($gasto->monto),
                'descripcion' => str_replace("[{$categoria}] ", '', $gasto->descripcion),
                'categoria' => $categoria,
                'numero_comprobante' => $gasto->numero_documento,
                'proveedor' => $gasto->observaciones,
                'observaciones' => '',
                'fecha' => $gasto->fecha,
                'created_at' => $gasto->created_at,
            ];
        });

        // Estadísticas
        $totalGastos = MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
            ->count();

        $montoTotal = abs(MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
            ->sum('monto'));

        $gastosPorCategoria = MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
            ->get()
            ->map(function ($gasto) {
                preg_match('/\[([^\]]+)\]/', $gasto->descripcion, $matches);
                return $matches[1] ?? 'VARIOS';
            })
            ->groupBy(fn($cat) => $cat)
            ->map(function ($grupo, $categoria) {
                return [
                    'categoria' => $categoria,
                    'cantidad' => $grupo->count(),
                    'total' => 0, // Será calculado después
                ];
            });

        $estadisticas = [
            'total_gastos' => $totalGastos,
            'monto_total' => $montoTotal,
            'promedio_gasto' => $totalGastos > 0 ? $montoTotal / $totalGastos : 0,
            'categoria_mayor_gasto' => $gastosPorCategoria->sortByDesc('total')->keys()->first() ?? 'N/A',
            'gastos_por_categoria' => array_values($gastosPorCategoria->toArray()),
        ];

        // Usuarios para filtro
        $usuarios = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Cajas/Gastos', [
            'gastos' => $gastos,
            'estadisticas' => $estadisticas,
            'usuarios' => $usuarios,
            'filtros' => $request->only(['usuario_id', 'categoria', 'fecha_inicio', 'fecha_fin', 'busqueda']),
        ]);
    }

    /**
     * ADMIN: Aprobar un gasto
     */
    public function aprobar($id)
    {
        try {
            $movimiento = MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
                ->findOrFail($id);

            // Marcar como aprobado (guardar en observaciones o crear una tabla de aprobaciones)
            $movimiento->update([
                'observaciones' => ($movimiento->observaciones ?? '') . ' | APROBADO por ' . Auth::user()->name . ' en ' . now()->format('Y-m-d H:i:s'),
            ]);

            Log::info("✅ Gasto aprobado", [
                'movimiento_id' => $id,
                'usuario_admin' => Auth::user()->name,
            ]);

            return back()->with('success', 'Gasto aprobado correctamente');
        } catch (\Exception $e) {
            Log::error("❌ Error aprobando gasto: " . $e->getMessage());
            return back()->withErrors(['error' => 'Error al aprobar gasto']);
        }
    }

    /**
     * ADMIN: Rechazar un gasto
     */
    public function rechazar(Request $request, $id)
    {
        $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        try {
            $movimiento = MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
                ->findOrFail($id);

            DB::beginTransaction();

            // Marcar como rechazado
            $movimiento->update([
                'observaciones' => "RECHAZADO: {$request->motivo} | Por: " . Auth::user()->name . " | " . now()->format('Y-m-d H:i:s'),
            ]);

            // Revertir el movimiento (eliminar el egreso)
            $movimiento->delete();

            DB::commit();

            Log::info("❌ Gasto rechazado y revertido", [
                'movimiento_id' => $id,
                'motivo' => $request->motivo,
                'usuario_admin' => Auth::user()->name,
            ]);

            return back()->with('success', 'Gasto rechazado y revertido correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("❌ Error rechazando gasto: " . $e->getMessage());
            return back()->withErrors(['error' => 'Error al rechazar gasto']);
        }
    }

    /**
     * ADMIN: Eliminar un gasto
     */
    public function destroy($id)
    {
        try {
            $movimiento = MovimientoCaja::whereHas('tipoOperacion', fn($q) => $q->where('codigo', 'GASTO'))
                ->findOrFail($id);

            DB::beginTransaction();
            $movimiento->delete();
            DB::commit();

            Log::info("🗑️ Gasto eliminado", [
                'movimiento_id' => $id,
                'usuario_admin' => Auth::user()->name,
            ]);

            return back()->with('success', 'Gasto eliminado correctamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("❌ Error eliminando gasto: " . $e->getMessage());
            return back()->withErrors(['error' => 'Error al eliminar gasto']);
        }
    }
}

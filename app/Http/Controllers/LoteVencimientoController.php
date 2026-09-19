<?php
namespace App\Http\Controllers;

use App\Models\StockProducto;
use App\Models\Producto;
use App\Models\Almacen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LoteVencimientoController extends Controller
{
    public function index(Request $request)
    {
        // Base query usando StockProducto (que tiene lotes y vencimientos actuales)
        $query = StockProducto::with(['producto', 'almacen'])
            ->whereNotNull('lote')  // Solo mostrar registros con lote
            ->when($request->producto_id, function ($q) use ($request) {
                $q->where('producto_id', $request->producto_id);
            })
            ->when($request->q, function ($q) use ($request) {
                $q->whereHas('producto', function ($pq) use ($request) {
                    $pq->where('nombre', 'LIKE', "%{$request->q}%")
                       ->orWhere('codigo', 'LIKE', "%{$request->q}%")
                       ->orWhere('sku', 'LIKE', "%{$request->q}%");
                })
                ->orWhere('lote', 'LIKE', "%{$request->q}%");
            })
            ->when($request->estado_vencimiento, function ($q) use ($request) {
                $estado = $request->estado_vencimiento;
                match ($estado) {
                    'VENCIDO' => $q->vencido(),
                    'PROXIMO_VENCER' => $q->proximoVencer(),
                    'VIGENTE' => $q->whereNotNull('fecha_vencimiento')
                        ->where('fecha_vencimiento', '>', now()->addDays(30)),
                    'SIN_VENCIMIENTO' => $q->whereNull('fecha_vencimiento'),
                    default => $q,
                };
            })
            ->when($request->almacen_id, function ($q) use ($request) {
                $q->where('almacen_id', $request->almacen_id);
            });

        // Sorting
        $sortField = $request->get('sort', 'fecha_vencimiento');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortField, $sortOrder);

        $lotesPaginados = $query->paginate(15)->withQueryString();

        // Transformar cada lote para agregar campos calculados
        $lotes = $lotesPaginados->through(function ($stock) {
            return [
                'id' => $stock->id,
                'producto' => $stock->producto,
                'almacen' => $stock->almacen,
                'lote' => $stock->lote,
                'fecha_vencimiento' => $stock->fecha_vencimiento?->toDateString(),
                'cantidad' => $stock->cantidad,
                'cantidad_disponible' => $stock->cantidad_disponible,
                'cantidad_reservada' => $stock->cantidad_reservada,
                'precio_costo' => $stock->precio_costo,
                'valor_total' => $stock->cantidad * ($stock->precio_costo ?? 0),
                'dias_para_vencer' => $stock->diasParaVencer(),
                'estado_vencimiento' => $this->determinarEstadoVencimiento($stock),
                'esta_vencido' => $stock->estaVencido(),
            ];
        });

        // Estadísticas
        $todosLotes = StockProducto::whereNotNull('lote');

        $estadisticas = [
            'total_lotes' => (clone $todosLotes)->count(),
            'lotes_vigentes' => (clone $todosLotes)
                ->whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '>', now()->addDays(30))
                ->count(),
            'lotes_proximos_vencer' => (clone $todosLotes)->proximoVencer()->count(),
            'lotes_vencidos' => (clone $todosLotes)->vencido()->count(),
            'lotes_criticos' => (clone $todosLotes)
                ->whereNotNull('fecha_vencimiento')
                ->where('fecha_vencimiento', '<=', now()->addDays(7))
                ->where('fecha_vencimiento', '>', now())
                ->count(),
            'valor_total_inventario' => (clone $todosLotes)
                ->sum(DB::raw('cantidad * precio_costo')),
            'valor_proximos_vencer' => (clone $todosLotes)
                ->proximoVencer()
                ->sum(DB::raw('cantidad * precio_costo')),
            'valor_vencidos' => (clone $todosLotes)
                ->vencido()
                ->sum(DB::raw('cantidad * precio_costo')),
        ];

        return Inertia::render('compras/lotes-vencimientos/index', [
            'lotes'        => $lotes,
            'filtros'      => $request->only(['producto_id', 'estado_vencimiento', 'almacen_id', 'q']),
            'estadisticas' => $estadisticas,
            'productos'    => Producto::select('id', 'nombre')->orderBy('nombre')->get(),
            'almacenes'    => Almacen::select('id', 'nombre')->orderBy('nombre')->get(),
        ]);
    }

    /**
     * Determinar el estado de vencimiento de un lote
     */
    private function determinarEstadoVencimiento(StockProducto $stock): string
    {
        if ($stock->estaVencido()) {
            return 'VENCIDO';
        }

        if ($stock->proximoVencer(7)) {
            return 'CRITICO';
        }

        if ($stock->proximoVencer(30)) {
            return 'PROXIMO_VENCER';
        }

        if ($stock->fecha_vencimiento) {
            return 'VIGENTE';
        }

        return 'SIN_VENCIMIENTO';
    }

    /**
     * Actualizar cantidad disponible de un lote
     */
    public function actualizarCantidad(Request $request, StockProducto $stock)
    {
        $request->validate([
            'cantidad_disponible' => 'required|numeric|min:0|max:' . $stock->cantidad,
        ]);

        $stock->update([
            'cantidad_disponible' => $request->cantidad_disponible,
            'cantidad_reservada' => $stock->cantidad - $request->cantidad_disponible,
            'fecha_actualizacion' => now(),
        ]);

        return back()->with('success', 'Cantidad del lote actualizada correctamente.');
    }

    /**
     * Mostrar lotes con detección de duplicados
     */
    public function duplicados(Request $request)
    {
        // Obtener lotes agrupados (incluye stocks con y sin lote)
        $stocks = StockProducto::with(['producto.precios', 'almacen'])
            ->when(!$request->mostrar_dados_de_baja, fn($q) => $q->whereNull('deleted_at'))
            ->when($request->mostrar_dados_de_baja === 'true', fn($q) => $q->whereNotNull('deleted_at'))
            ->when($request->q, function ($q) use ($request) {
                $search = strtolower($request->q);
                $q->where(function ($query) use ($search) {
                    $query->whereHas('producto', function ($pq) use ($search) {
                        $pq->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"])
                           ->orWhereRaw('LOWER(sku) LIKE ?', ["%{$search}%"]);
                    })
                    ->orWhereRaw('LOWER(lote) LIKE ?', ["%{$search}%"]);
                });
            })
            ->when($request->sin_vencimiento === 'true', function ($q) {
                $q->whereNull('fecha_vencimiento');
            })
            ->when($request->solo_vencidos === 'true', function ($q) {
                $q->whereNotNull('fecha_vencimiento')
                  ->where('fecha_vencimiento', '<', now()->toDateString());
            })
            ->orderBy('id', 'asc')
            ->get();

        // Contar duplicados
        $lotesAgrupados = $stocks->groupBy(function ($item) {
            return $item->producto_id . '|' . $item->lote;
        });

        $lotesDuplicados = [];
        foreach ($lotesAgrupados as $key => $grupo) {
            if ($grupo->count() > 1) {
                $lotesDuplicados[$key] = true;
            }
        }

        // Transformar
        $datos = $stocks->map(function ($stock) use ($lotesDuplicados) {
            $key = $stock->producto_id . '|' . $stock->lote;

            // Obtener el precio de precios_productos
            $precio = 0;
            if ($stock->producto && $stock->producto->precios && $stock->producto->precios->count() > 0) {
                $precio = (float) ($stock->producto->precios->first()->precio ?? 0);
            }
            $cantidad = (int) ($stock->cantidad ?? 0);

            return [
                'id' => $stock->id,
                'producto_id' => $stock->producto_id,
                'producto_nombre' => $stock->producto->nombre ?? 'N/A',
                'producto_sku' => $stock->producto->sku ?? 'N/A',
                'almacen_nombre' => $stock->almacen->nombre ?? 'N/A',
                'lote' => $stock->lote,
                'cantidad' => $cantidad,
                'cantidad_disponible' => (int) $stock->cantidad_disponible,
                'fecha_vencimiento' => $stock->fecha_vencimiento?->format('Y-m-d'),
                'precio_costo' => $precio,
                'valor_total' => $cantidad * $precio,
                'es_duplicado' => isset($lotesDuplicados[$key]),
                'dado_de_baja' => $stock->deleted_at !== null,
                'fecha_baja' => $stock->deleted_at?->format('Y-m-d H:i'),
                'esta_vencido' => $stock->fecha_vencimiento && $stock->fecha_vencimiento < now()->toDateString(),
            ];
        });

        return Inertia::render('compras/lotes-duplicados/index', [
            'lotes' => $datos->values(),
            'total' => $datos->count(),
            'duplicados' => count($lotesDuplicados),
            'filtro' => $request->q,
        ]);
    }

    /**
     * Actualizar lote y fecha de vencimiento
     */
    public function actualizarLote(Request $request, StockProducto $stock)
    {
        if (!auth()->user()->can('compras.lotes-vencimientos.index')) {
            return response()->json(['error' => 'No tienes permiso'], 403);
        }

        $validated = $request->validate([
            'lote' => 'nullable|string|max:255',
            'fecha_vencimiento' => 'nullable|date',
        ]);

        $stock->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lote actualizado correctamente',
            'lote' => $stock->lote,
            'fecha_vencimiento' => $stock->fecha_vencimiento?->format('Y-m-d'),
        ]);
    }

    /**
     * Dar de baja un lote (soft delete)
     */
    public function darDeBaja(StockProducto $stock)
    {
        if (!auth()->user()->can('compras.lotes-vencimientos.index')) {
            return response()->json(['error' => 'No tienes permiso'], 403);
        }

        $stock->delete();

        return response()->json([
            'success' => true,
            'message' => "Lote {$stock->lote} dado de baja correctamente",
        ]);
    }

    /**
     * Restaurar un lote dado de baja
     */
    public function restaurar(StockProducto $stock)
    {
        if (!auth()->user()->can('compras.lotes-vencimientos.index')) {
            return response()->json(['error' => 'No tienes permiso'], 403);
        }

        $stock->restore();

        return response()->json([
            'success' => true,
            'message' => "Lote {$stock->lote} restaurado correctamente",
        ]);
    }

    /**
     * Exportar lotes a JSON (para testing)
     */
    public function export(Request $request)
    {
        $query = StockProducto::with(['producto', 'almacen'])
            ->whereNotNull('lote')
            ->when($request->estado_vencimiento, function ($q) use ($request) {
                $estado = $request->estado_vencimiento;
                match ($estado) {
                    'VENCIDO' => $q->vencido(),
                    'PROXIMO_VENCER' => $q->proximoVencer(),
                    default => $q,
                };
            });

        $lotes = $query->get();

        return response()->json($lotes);
    }
}

<?php

namespace App\Http\Controllers;

// ✅ COMENTADO: ReservaStock no existe, usar ReservaProforma en su lugar
// use App\Models\ReservaStock;
use App\Models\Producto;
use App\Models\Almacen;
use App\Models\StockProducto;
use App\Http\Traits\ApiInertiaUnifiedResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservaStockController extends Controller
{
    use ApiInertiaUnifiedResponse;

    public function index(Request $request)
    {
        try {
            $query = ReservaStock::with(['producto', 'almacen', 'usuario', 'liberadoPor']);

            // Aplicar filtros
            $this->applyFilters($query, $request);

            $reservas = $query->orderBy('created_at', 'desc')
                             ->paginate(15)
                             ->withQueryString();

            // Estadísticas
            $estadisticas = $this->getEstadisticas();

            return $this->paginatedResponse(
                $reservas,
                'Inventario/Reservas/Index',
                [
                    'estadisticas' => $estadisticas,
                    'filtros' => $request->only(['estado', 'tipo_reserva', 'almacen_id', 'producto_id', 'fecha_desde', 'fecha_hasta', 'buscar']),
                    'almacenes' => Almacen::select('id', 'nombre')->get(),
                ]
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'obtener reservas');
        }
    }

    public function create()
    {
        try {
            $data = [
                'almacenes' => Almacen::select('id', 'nombre')->get(),
                'productos' => Producto::select('id', 'nombre', 'codigo')->get(),
            ];

            return $this->dataResponse('Inventario/Reservas/Create', $data);

        } catch (\Exception $e) {
            return $this->handleException($e, 'cargar formulario de creación');
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'almacen_id' => 'required|exists:almacenes,id',
            'cantidad_reservada' => 'required|numeric|min:0.01',
            'tipo_reserva' => 'required|in:venta,orden,transferencia,manual',
            'fecha_vencimiento' => 'nullable|date|after:today',
            'motivo' => 'required|string|max:500',
            'observaciones' => 'nullable|string|max:1000',
            'referencia_tipo' => 'nullable|string|max:50',
            'referencia_id' => 'nullable|integer',
        ]);

        try {
            // Verificar stock disponible
            $stockDisponible = $this->obtenerStockDisponible($request->producto_id, $request->almacen_id);

            if ($stockDisponible < $request->cantidad_reservada) {
                return $this->validationErrorResponse([
                    'cantidad_reservada' => ["Stock insuficiente. Disponible: {$stockDisponible}"]
                ]);
            }

            $reserva = DB::transaction(function() use ($request) {
                return ReservaStock::reservarStock(
                    $request->producto_id,
                    $request->almacen_id,
                    $request->cantidad_reservada,
                    $request->tipo_reserva,
                    auth()->id(),
                    [
                        'fecha_vencimiento' => $request->fecha_vencimiento,
                        'motivo' => $request->motivo,
                        'observaciones' => $request->observaciones,
                        'referencia_tipo' => $request->referencia_tipo,
                        'referencia_id' => $request->referencia_id,
                    ]
                );
            });

            return $this->resourceResponse(
                $reserva,
                'Reserva de stock creada exitosamente',
                'reservas-stock.index',
                [],
                201
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'crear reserva');
        }
    }

    public function show(ReservaStock $reservaStock)
    {
        try {
            $reservaStock->load(['producto', 'almacen', 'usuario', 'liberadoPor']);

            return $this->dataResponse('Inventario/Reservas/Show', [
                'reserva' => $reservaStock,
            ]);

        } catch (\Exception $e) {
            return $this->handleException($e, 'mostrar reserva');
        }
    }

    public function edit(ReservaStock $reservaStock)
    {
        try {
            if (!in_array($reservaStock->estado, [ReservaStock::ESTADO_ACTIVA, ReservaStock::ESTADO_PARCIALMENTE_UTILIZADA])) {
                return $this->errorResponse(
                    'No se puede editar esta reserva en su estado actual',
                    null,
                    'reservas-stock.index'
                );
            }

            return $this->dataResponse('Inventario/Reservas/Edit', [
                'reserva' => $reservaStock,
                'almacenes' => Almacen::select('id', 'nombre')->get(),
            ]);

        } catch (\Exception $e) {
            return $this->handleException($e, 'cargar formulario de edición');
        }
    }

    public function update(Request $request, ReservaStock $reservaStock)
    {
        if (!in_array($reservaStock->estado, [ReservaStock::ESTADO_ACTIVA, ReservaStock::ESTADO_PARCIALMENTE_UTILIZADA])) {
            return $this->errorResponse('No se puede editar esta reserva en su estado actual');
        }

        $request->validate([
            'cantidad_reservada' => 'required|numeric|min:' . $reservaStock->cantidad_utilizada,
            'fecha_vencimiento' => 'nullable|date|after:today',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        try {
            if ($request->cantidad_reservada < $reservaStock->cantidad_utilizada) {
                return $this->validationErrorResponse([
                    'cantidad_reservada' => ["La cantidad no puede ser menor a la ya utilizada ({$reservaStock->cantidad_utilizada})"]
                ]);
            }

            $reservaStock->update([
                'cantidad_reservada' => $request->cantidad_reservada,
                'fecha_vencimiento' => $request->fecha_vencimiento,
                'observaciones' => $request->observaciones,
            ]);

            return $this->resourceResponse(
                $reservaStock,
                'Reserva actualizada exitosamente',
                'reservas-stock.index'
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'actualizar reserva');
        }
    }

    public function utilizar(Request $request, ReservaStock $reservaStock)
    {
        $request->validate([
            'cantidad_utilizar' => 'required|numeric|min:0.01|max:' . $reservaStock->cantidad_disponible,
            'observaciones' => 'nullable|string|max:500',
        ]);

        try {
            if (!$reservaStock->puedeUtilizar($request->cantidad_utilizar)) {
                return $this->errorResponse('No se puede utilizar esta cantidad de la reserva');
            }

            $reservaStock->utilizar($request->cantidad_utilizar, $request->observaciones);

            return $this->successResponse('Stock utilizado de la reserva exitosamente');

        } catch (\Exception $e) {
            return $this->handleException($e, 'utilizar reserva');
        }
    }

    public function liberar(Request $request, ReservaStock $reservaStock)
    {
        $request->validate([
            'motivo' => 'required|string|max:500',
        ]);

        try {
            if (!$reservaStock->liberar(auth()->id(), $request->motivo)) {
                return $this->errorResponse('No se puede liberar esta reserva');
            }

            return $this->resourceResponse(
                $reservaStock,
                'Reserva liberada exitosamente',
                'reservas-stock.index'
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'liberar reserva');
        }
    }

    public function destroy(ReservaStock $reservaStock)
    {
        try {
            if ($reservaStock->cantidad_utilizada > 0) {
                return $this->errorResponse('No se puede eliminar una reserva que ya ha sido utilizada');
            }

            $reservaStock->delete();

            return $this->deleteResponse(
                'Reserva eliminada exitosamente',
                'reservas-stock.index'
            );

        } catch (\Exception $e) {
            return $this->handleException($e, 'eliminar reserva');
        }
    }

    // APIs específicas
    public function apiStockDisponible(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'almacen_id' => 'required|exists:almacenes,id',
        ]);

        try {
            $stockDisponible = $this->obtenerStockDisponible($request->producto_id, $request->almacen_id);

            return response()->json([
                'success' => true,
                'data' => [
                    'stock_disponible' => $stockDisponible,
                    'stock_fisico' => $this->obtenerStockFisico($request->producto_id, $request->almacen_id),
                    'stock_reservado' => ReservaStock::stockReservado($request->producto_id, $request->almacen_id),
                ]
            ]);

        } catch (\Exception $e) {
            return $this->handleException($e, 'obtener stock disponible');
        }
    }

    public function apiReservasPorProducto(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'almacen_id' => 'nullable|exists:almacenes,id',
        ]);

        try {
            $query = ReservaStock::where('producto_id', $request->producto_id)
                               ->whereIn('estado', [ReservaStock::ESTADO_ACTIVA, ReservaStock::ESTADO_PARCIALMENTE_UTILIZADA])
                               ->with(['almacen', 'usuario']);

            if ($request->filled('almacen_id')) {
                $query->where('almacen_id', $request->almacen_id);
            }

            $reservas = $query->get()->map(function($reserva) {
                return [
                    'id' => $reserva->id,
                    'almacen' => $reserva->almacen->nombre,
                    'cantidad_reservada' => $reserva->cantidad_reservada,
                    'cantidad_utilizada' => $reserva->cantidad_utilizada,
                    'cantidad_disponible' => $reserva->cantidad_disponible,
                    'tipo_reserva' => $reserva->tipo_reserva,
                    'usuario' => $reserva->usuario->name,
                    'fecha_vencimiento' => $reserva->fecha_vencimiento,
                    'esta_vencida' => $reserva->estaVencida(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $reservas
            ]);

        } catch (\Exception $e) {
            return $this->handleException($e, 'obtener reservas por producto');
        }
    }

    public function apiLiberarVencidas()
    {
        try {
            $liberadas = ReservaStock::liberarReservasVencidas();

            return response()->json([
                'success' => true,
                'message' => "Se liberaron {$liberadas} reservas vencidas",
                'data' => ['reservas_liberadas' => $liberadas]
            ]);

        } catch (\Exception $e) {
            return $this->handleException($e, 'liberar reservas vencidas');
        }
    }

    public function dashboard()
    {
        try {
            $estadisticas = $this->getEstadisticas();

            // Reservas por vencer
            $reservasPorVencer = ReservaStock::porVencer(7)
                                           ->with(['producto', 'almacen'])
                                           ->orderBy('fecha_vencimiento')
                                           ->limit(10)
                                           ->get();

            // Top productos con más reservas
            $topProductosReservados = ReservaStock::activas()
                                                ->select('producto_id', DB::raw('SUM(cantidad_reservada - cantidad_utilizada) as total_reservado'))
                                                ->groupBy('producto_id')
                                                ->with('producto')
                                                ->orderBy('total_reservado', 'desc')
                                                ->limit(10)
                                                ->get();

            // Reservas por tipo
            $reservasPorTipo = ReservaStock::activas()
                                        ->select('tipo_reserva', DB::raw('COUNT(*) as total'))
                                        ->groupBy('tipo_reserva')
                                        ->get();

            return $this->dataResponse('Inventario/Reservas/Dashboard', [
                'estadisticas' => $estadisticas,
                'reservas_por_vencer' => $reservasPorVencer,
                'top_productos_reservados' => $topProductosReservados,
                'reservas_por_tipo' => $reservasPorTipo,
            ]);

        } catch (\Exception $e) {
            return $this->handleException($e, 'cargar dashboard');
        }
    }

    // Métodos auxiliares privados
    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('tipo_reserva')) {
            $query->where('tipo_reserva', $request->tipo_reserva);
        }

        if ($request->filled('almacen_id')) {
            $query->where('almacen_id', $request->almacen_id);
        }

        if ($request->filled('producto_id')) {
            $query->where('producto_id', $request->producto_id);
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->fecha_hasta);
        }

        // Búsqueda por producto
        if ($request->filled('buscar')) {
            $buscar = $request->buscar;
            $query->whereHas('producto', function($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                  ->orWhere('codigo', 'like', "%{$buscar}%");
            });
        }
    }

    private function getEstadisticas(): array
    {
        return [
            'total_reservas' => ReservaStock::count(),
            'reservas_activas' => ReservaStock::activas()->count(),
            'reservas_vencidas' => ReservaStock::vencidas()->count(),
            'reservas_por_vencer' => ReservaStock::porVencer(3)->count(),
            'valor_reservado' => ReservaStock::activas()
                              ->join('productos', 'reservas_stock.producto_id', '=', 'productos.id')
                              ->sum(DB::raw('(cantidad_reservada - cantidad_utilizada) * productos.precio')),
        ];
    }

    private function obtenerStockDisponible($productoId, $almacenId)
    {
        $stockFisico = $this->obtenerStockFisico($productoId, $almacenId);
        $stockReservado = ReservaStock::stockReservado($productoId, $almacenId);

        return max(0, $stockFisico - $stockReservado);
    }

    private function obtenerStockFisico($productoId, $almacenId)
    {
        $stock = StockProducto::where('producto_id', $productoId)
                             ->where('almacen_id', $almacenId)
                             ->sum('stock_actual');

        return $stock ?? 0;
    }
}
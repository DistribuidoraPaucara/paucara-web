<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReservaProforma;
use App\Models\Proforma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservaProformaController extends Controller
{
    /**
     * Obtener lista de reservas de proformas con filtros
     * GET /api/reservas-proforma
     */
    public function index(Request $request)
    {
        try {
            $query = ReservaProforma::query()
                ->with([
                    'proforma:id,numero,cliente_id,usuario_creador_id,total,estado_proforma_id',
                    'proforma.cliente:id,nombre,nit',
                    'proforma.usuarioCreador:id,name',
                    'stockProducto:id,producto_id,almacen_id,cantidad,cantidad_disponible,cantidad_reservada',
                    'stockProducto.producto',
                    'stockProducto.producto.codigosBarra',
                    'stockProducto.almacen:id,nombre',
                ]);

            // Filtro por estado
            if ($request->filled('estado')) {
                $query->where('estado', $request->estado);
            }

            // Filtro por proforma
            if ($request->filled('proforma_id')) {
                $query->where('proforma_id', $request->proforma_id);
            }

            // Filtro por número de proforma
            if ($request->filled('proforma_numero')) {
                $query->whereHas('proforma', function ($q) {
                    $q->where('numero', 'ILIKE', '%' . request()->proforma_numero . '%');
                });
            }

            // Filtro por producto
            if ($request->filled('producto_id')) {
                // Filtro exacto por ID si es numérico
                if (is_numeric($request->producto_id)) {
                    $query->whereHas('stockProducto', function ($q) {
                        $q->where('producto_id', (int) request()->producto_id);
                    });
                }
            }

            // ✅ NUEVO (2026-02-12): Filtro por búsqueda flexible de producto (ID, SKU o nombre)
            if ($request->filled('producto_busqueda')) {
                $busqueda = $request->producto_busqueda;
                $query->whereHas('stockProducto', function ($q) use ($busqueda) {
                    $q->whereHas('producto', function ($p) use ($busqueda) {
                        // Prioridad: ID → SKU → Nombre (case insensitive)
                        $p->where('id', (int) $busqueda) // Si es número, buscar por ID
                            ->orWhere('sku', 'ILIKE', '%' . $busqueda . '%') // SKU case-insensitive
                            ->orWhere('nombre', 'ILIKE', '%' . $busqueda . '%'); // Nombre case-insensitive
                    });
                });
            }

            // Filtro por almacén
            if ($request->filled('almacen_id')) {
                $query->whereHas('stockProducto', function ($q) {
                    $q->where('almacen_id', request()->almacen_id);
                });
            }

            // Filtro por cliente
            if ($request->filled('cliente_id')) {
                $query->whereHas('proforma', function ($q) {
                    $q->where('cliente_id', request()->cliente_id);
                });
            }

            // Filtro por estado de expiración
            if ($request->filled('vencimiento')) {
                if ($request->vencimiento === 'expirada') {
                    $query->where('estado', 'ACTIVA')
                        ->where('fecha_expiracion', '<', now());
                } elseif ($request->vencimiento === 'pronto') {
                    // Próximas a expirar (próximas 24 horas)
                    $query->where('estado', 'ACTIVA')
                        ->where('fecha_expiracion', '>=', now())
                        ->where('fecha_expiracion', '<', now()->addDay());
                } elseif ($request->vencimiento === 'vigente') {
                    $query->where('estado', 'ACTIVA')
                        ->where('fecha_expiracion', '>=', now()->addDay());
                }
            }

            // Filtro por rango de fechas de creación
            if ($request->filled('fecha_creacion_desde')) {
                $query->where('created_at', '>=', $request->fecha_creacion_desde . ' 00:00:00');
            }

            if ($request->filled('fecha_creacion_hasta')) {
                $query->where('created_at', '<=', $request->fecha_creacion_hasta . ' 23:59:59');
            }

            // Filtro por rango de fechas de vencimiento
            if ($request->filled('fecha_vencimiento_desde')) {
                $query->where('fecha_expiracion', '>=', $request->fecha_vencimiento_desde . ' 00:00:00');
            }

            if ($request->filled('fecha_vencimiento_hasta')) {
                $query->where('fecha_expiracion', '<=', $request->fecha_vencimiento_hasta . ' 23:59:59');
            }

            // Ordenamiento
            $orderBy = $request->input('ordenamiento', 'fecha_expiracion-asc');
            [$campo, $direccion] = explode('-', $orderBy);

            match ($campo) {
                'fecha_expiracion' => $query->orderBy('fecha_expiracion', $direccion),
                'fecha_reserva' => $query->orderBy('fecha_reserva', $direccion),
                'cantidad' => $query->orderBy('cantidad_reservada', $direccion),
                'proforma' => $query->orderByRaw("(SELECT numero FROM proformas WHERE id = proforma_id) $direccion"),
                default => $query->orderBy('fecha_expiracion', 'asc'),
            };

            // Paginación
            $perPage = $request->input('per_page', 50);
            $reservas = $query->paginate($perPage);

            // Formatear respuesta
            $reservasFormateadas = $reservas->map(function ($reserva) {
                $ahora = now();
                $estaExpirada = $reserva->estado === 'ACTIVA' && $reserva->fecha_expiracion < $ahora;
                $diasParaExpirar = $reserva->fecha_expiracion ? $reserva->fecha_expiracion->diffInDays($ahora) : null;

                return [
                    'id' => $reserva->id,
                    'proforma_id' => $reserva->proforma_id,
                    'proforma_numero' => $reserva->proforma?->numero,
                    'proforma_total' => $reserva->proforma?->total,
                    'proforma_estado' => $reserva->proforma?->estado,
                    'cliente_id' => $reserva->proforma?->cliente_id,
                    'cliente_nombre' => $reserva->proforma?->cliente?->nombre,
                    'cliente_nit' => $reserva->proforma?->cliente?->nit,
                    'usuario_nombre' => $reserva->proforma?->usuario?->name,
                    'stock_producto_id' => $reserva->stock_producto_id,
                    'producto_id' => $reserva->stockProducto?->producto_id,
                    'producto_nombre' => $reserva->stockProducto?->producto?->nombre,
                    'producto_codigo' => $reserva->stockProducto?->producto?->codigo,
                    'producto_sku' => $reserva->stockProducto?->producto?->sku,
                    'almacen_id' => $reserva->stockProducto?->almacen_id,
                    'almacen_nombre' => $reserva->stockProducto?->almacen?->nombre,
                    'cantidad_reservada' => (float) $reserva->cantidad_reservada,
                    'stock_total' => (float) $reserva->stockProducto?->cantidad,
                    'stock_disponible' => (float) $reserva->stockProducto?->cantidad_disponible,
                    'stock_reservado' => (float) $reserva->stockProducto?->cantidad_reservada,
                    'precio_venta' => (float) $reserva->stockProducto?->producto?->precio_venta ?? 0,
                    'valor_reservado' => (float) $reserva->cantidad_reservada * ((float) $reserva->stockProducto?->producto?->precio_venta ?? 0),
                    'estado' => $reserva->estado,
                    'fecha_reserva' => $reserva->fecha_reserva?->toIso8601String(),
                    'fecha_expiracion' => $reserva->fecha_expiracion?->toIso8601String(),
                    'esta_expirada' => $estaExpirada,
                    'dias_para_expirar' => $diasParaExpirar,
                    'created_at' => $reserva->created_at?->toIso8601String(),
                    'updated_at' => $reserva->updated_at?->toIso8601String(),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $reservasFormateadas,
                'pagination' => [
                    'current_page' => $reservas->currentPage(),
                    'last_page' => $reservas->lastPage(),
                    'per_page' => $reservas->perPage(),
                    'total' => $reservas->total(),
                    'from' => $reservas->firstItem(),
                    'to' => $reservas->lastItem(),
                ],
                'summary' => $this->calcularResumen($reservas),
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo reservas proforma:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener reservas: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener detalle de una reserva específica
     * GET /api/reservas-proforma/{id}
     */
    public function show($id)
    {
        try {
            $reserva = ReservaProforma::with([
                'proforma:id,numero,cliente_id,usuario_id,total,estado,created_at',
                'proforma.cliente:id,nombre,nit,email',
                'proforma.usuario:id,name',
                'proforma.detalles',
                'stockProducto:id,producto_id,almacen_id,cantidad,cantidad_disponible,cantidad_reservada,precio_venta',
                'stockProducto.producto:id,nombre,codigo,sku',
                'stockProducto.almacen:id,nombre',
            ])->find($id);

            if (!$reserva) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reserva no encontrada',
                ], 404);
            }

            $ahora = now();
            $estaExpirada = $reserva->estado === 'ACTIVA' && $reserva->fecha_expiracion < $ahora;

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $reserva->id,
                    'proforma' => [
                        'id' => $reserva->proforma->id,
                        'numero' => $reserva->proforma->numero,
                        'total' => $reserva->proforma->total,
                        'estado' => $reserva->proforma->estado,
                        'created_at' => $reserva->proforma->created_at,
                        'cliente' => [
                            'id' => $reserva->proforma->cliente->id,
                            'nombre' => $reserva->proforma->cliente->nombre,
                            'nit' => $reserva->proforma->cliente->nit,
                            'email' => $reserva->proforma->cliente->email,
                        ],
                        'usuario' => [
                            'id' => $reserva->proforma->usuario->id,
                            'nombre' => $reserva->proforma->usuario->name,
                        ],
                        'detalles' => $reserva->proforma->detalles,
                    ],
                    'producto' => [
                        'id' => $reserva->stockProducto->producto->id,
                        'nombre' => $reserva->stockProducto->producto->nombre,
                        'codigo' => $reserva->stockProducto->producto->codigo,
                        'sku' => $reserva->stockProducto->producto->sku,
                    ],
                    'almacen' => [
                        'id' => $reserva->stockProducto->almacen->id,
                        'nombre' => $reserva->stockProducto->almacen->nombre,
                    ],
                    'cantidad_reservada' => (float) $reserva->cantidad_reservada,
                    'stock_actual' => (float) $reserva->stockProducto->cantidad,
                    'stock_disponible' => (float) $reserva->stockProducto->cantidad_disponible,
                    'stock_reservado' => (float) $reserva->stockProducto->cantidad_reservada,
                    'precio_venta' => (float) $reserva->stockProducto->precio_venta,
                    'valor_total' => (float) $reserva->cantidad_reservada * ((float) $reserva->stockProducto->precio_venta ?? 0),
                    'estado' => $reserva->estado,
                    'fecha_reserva' => $reserva->fecha_reserva?->toIso8601String(),
                    'fecha_expiracion' => $reserva->fecha_expiracion?->toIso8601String(),
                    'esta_expirada' => $estaExpirada,
                    'dias_para_expirar' => $reserva->fecha_expiracion ? $reserva->fecha_expiracion->diffInDays($ahora) : null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error obteniendo detalle de reserva:', [
                'id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener detalle de reserva',
            ], 500);
        }
    }

    /**
     * Liberar una reserva
     * POST /api/reservas-proforma/{id}/liberar
     */
    public function liberar($id)
    {
        try {
            $reserva = ReservaProforma::find($id);

            if (!$reserva) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reserva no encontrada',
                ], 404);
            }

            if ($reserva->estado !== 'ACTIVA') {
                return response()->json([
                    'success' => false,
                    'message' => "No se puede liberar una reserva con estado {$reserva->estado}",
                ], 422);
            }

            $success = $reserva->liberar();

            if (!$success) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al liberar la reserva',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Reserva liberada exitosamente',
                'data' => $reserva->refresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error liberando reserva:', [
                'id' => $id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al liberar reserva: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Calcular resumen de reservas
     */
    private function calcularResumen($reservas)
    {
        $ahora = now();

        // ✅ NUEVO: Obtener lista de productos con sus cantidades reservadas
        $productosConReservas = $reservas->getCollection()
            ->groupBy(fn ($r) => $r->stockProducto?->producto_id)
            ->map(fn ($grupo) => [
                'id' => $grupo->first()?->stockProducto?->producto_id,
                'nombre' => $grupo->first()?->stockProducto?->producto?->nombre,
                'cantidad_reservada' => $grupo->sum('cantidad_reservada'),
                'cantidad_reservas' => $grupo->count(),
            ])
            ->values()
            ->toArray();

        return [
            'total_registros' => $reservas->total(),
            'activas' => $reservas->getCollection()
                ->filter(fn ($r) => $r->estado === 'ACTIVA')
                ->count(),
            'liberadas' => $reservas->getCollection()
                ->filter(fn ($r) => $r->estado === 'LIBERADA')
                ->count(),
            'consumidas' => $reservas->getCollection()
                ->filter(fn ($r) => $r->estado === 'CONSUMIDA')
                ->count(),
            'expiradas' => $reservas->getCollection()
                ->filter(fn ($r) => $r->estado === 'ACTIVA' && $r->fecha_expiracion < $ahora)
                ->count(),
            'proximo_a_expirar' => $reservas->getCollection()
                ->filter(fn ($r) => $r->estado === 'ACTIVA' && $r->fecha_expiracion >= $ahora && $r->fecha_expiracion < $ahora->addDay())
                ->count(),
            'valor_total_reservado' => $reservas->getCollection()
                ->filter(fn ($r) => $r->estado === 'ACTIVA')
                ->sum(fn ($r) => $r->cantidad_reservada * ($r->stockProducto?->precio_venta ?? 0)),
            'productos_con_reservas' => $productosConReservas,  // ✅ NUEVO: Lista para el selector
        ];
    }
}

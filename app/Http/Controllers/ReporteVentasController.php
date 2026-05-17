<?php

namespace App\Http\Controllers;

use App\Models\Proforma;
use App\Models\Venta;
use App\Models\User;
use App\Models\EstadoDocumento;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\DB;

class ReporteVentasController extends Controller
{
    /**
     * Mostrar reporte de productos vendidos
     * GET /ventas/reporte-productos-vendidos
     */
    public function productosVendidos(Request $request): InertiaResponse
    {
        try {
            $user = auth()->user();

            // ✅ NUEVO (2026-03-03): Validar fechas - default mes actual (día 1 al hoy)
            $fechaDesde = $request->filled('fecha_desde') ? $request->date('fecha_desde') : now()->startOfMonth();  // Primer día del mes actual
            $fechaHasta = $request->filled('fecha_hasta') ? $request->date('fecha_hasta') : now();  // Hoy

            // Obtener el ID del estado APROBADO
            // ✅ CORREGIDO: La tabla EstadoDocumento solo tiene columna 'codigo', no 'categoria'
            $estadoAprobadoId = EstadoDocumento::where('codigo', 'APROBADO')
                ->value('id');

            // ✅ NUEVO (2026-04-28): Query 1 - Productos vendidos DIRECTAMENTE
            $productosDirectos = DB::table('proformas')
                ->join('ventas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('productos', 'detalle_proformas.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(detalle_proformas.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_proformas.subtotal AS DECIMAL(15,2))) as total_venta'),
                    'proformas.usuario_creador_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Filtro por usuario creador
            if ($request->filled('usuario_creador_id')) {
                $productosDirectos->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $productosDirectos->where('proformas.usuario_creador_id', $user->id);
            }

            // Filtro por cliente
            if ($request->filled('cliente_id')) {
                $productosDirectos->where('proformas.cliente_id', $request->cliente_id);
            }

            $productosDirectos = $productosDirectos->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'proformas.usuario_creador_id')
                ->get();

            // ✅ NUEVO (2026-04-28): Query 2 - Productos dentro de COMBOS vendidos
            // Cuando se vende un combo, los productos dentro del combo también se venden
            // cantidad_producto = cantidad_combo * cantidad_en_combo_items
            $productosEnCombos = DB::table('proformas')
                ->join('ventas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('combo_items', 'detalle_proformas.producto_id', '=', 'combo_items.combo_id')
                ->join('productos', 'combo_items.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    // Multiplicar cantidad del combo por cantidad del item en el combo
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    // Precio promedio del item en el combo
                    DB::raw('AVG(CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    // Total = cantidad_combo * cantidad_item * precio_item
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2)) * CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as total_venta'),
                    'proformas.usuario_creador_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Aplicar los mismos filtros a los combos
            if ($request->filled('usuario_creador_id')) {
                $productosEnCombos->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $productosEnCombos->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $productosEnCombos->where('proformas.cliente_id', $request->cliente_id);
            }

            $productosEnCombos = $productosEnCombos->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'proformas.usuario_creador_id')
                ->get();

            // ✅ NUEVO (2026-04-28): Combinar resultados y agregar por producto
            $productosCombinados = collect();

            // Agregar productos directos
            foreach ($productosDirectos as $item) {
                $productosCombinados->push([
                    'id' => $item->id,
                    'nombre' => $item->producto_nombre,
                    'codigo' => $item->producto_codigo,
                    'cantidad_total' => (float) $item->cantidad_total,
                    'precio_promedio' => (float) $item->precio_promedio,
                    'total_venta' => (float) $item->total_venta,
                    'usuario_creador_id' => $item->usuario_creador_id,
                ]);
            }

            // Agregar productos de combos
            foreach ($productosEnCombos as $item) {
                $existe = $productosCombinados->firstWhere('id', $item->id);
                if ($existe) {
                    // Si el producto ya existe (también fue vendido directo), sumar cantidades
                    $existe['cantidad_total'] += (float) $item->cantidad_total;
                    $existe['total_venta'] += (float) $item->total_venta;
                    // Recalcular precio promedio ponderado
                    $cantidadTotal = $existe['cantidad_total'];
                    $existe['precio_promedio'] = $cantidadTotal > 0 ? $existe['total_venta'] / $cantidadTotal : 0;
                } else {
                    // Si no existe, agregarlo
                    $productosCombinados->push([
                        'id' => $item->id,
                        'nombre' => $item->producto_nombre,
                        'codigo' => $item->producto_codigo,
                        'cantidad_total' => (float) $item->cantidad_total,
                        'precio_promedio' => (float) $item->precio_promedio,
                        'total_venta' => (float) $item->total_venta,
                        'usuario_creador_id' => $item->usuario_creador_id,
                    ]);
                }
            }

            $productos = $productosCombinados->sortBy('nombre')->values();

            // ✅ NUEVO (2026-04-28): Agregar datos de movimientos de inventario (anterior y posterior)
            $productos = $productos->map(function ($producto) use ($fechaDesde, $fechaHasta) {
                // Movimiento ANTERIOR: primer movimiento EN el período (captura estado inicial del período)
                $movimientoAnterior = DB::table('movimientos_inventario')
                    ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                    ->where('stock_productos.producto_id', $producto['id'])
                    ->whereDate('movimientos_inventario.created_at', '>=', $fechaDesde)
                    ->whereDate('movimientos_inventario.created_at', '<=', $fechaHasta)
                    ->orderBy('movimientos_inventario.created_at', 'asc')
                    ->select('cantidad_total_anterior', 'cantidad_disponible_anterior', 'cantidad_reservada_anterior')
                    ->first();

                // Movimiento POSTERIOR: último movimiento EN el período (captura estado final del período)
                $movimientoPosterior = DB::table('movimientos_inventario')
                    ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                    ->where('stock_productos.producto_id', $producto['id'])
                    ->whereDate('movimientos_inventario.created_at', '>=', $fechaDesde)
                    ->whereDate('movimientos_inventario.created_at', '<=', $fechaHasta)
                    ->orderBy('movimientos_inventario.created_at', 'desc')
                    ->select('cantidad_total_posterior', 'cantidad_disponible_posterior', 'cantidad_reservada_posterior')
                    ->first();

                // Si no hay movimientos en el período, traer el último movimiento antes del período
                if (!$movimientoAnterior) {
                    $movimientoAnterior = DB::table('movimientos_inventario')
                        ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                        ->where('stock_productos.producto_id', $producto['id'])
                        ->whereDate('movimientos_inventario.created_at', '<', $fechaDesde)
                        ->orderBy('movimientos_inventario.created_at', 'desc')
                        ->select('cantidad_total_posterior as cantidad_total_anterior', 'cantidad_disponible_posterior as cantidad_disponible_anterior', 'cantidad_reservada_posterior as cantidad_reservada_anterior')
                        ->first();
                }

                return [
                    ...$producto,
                    // Datos ANTERIORES
                    'total_anterior' => (float) ($movimientoAnterior?->cantidad_total_anterior ?? 0),
                    'disponible_anterior' => (float) ($movimientoAnterior?->cantidad_disponible_anterior ?? 0),
                    'reservado_anterior' => (float) ($movimientoAnterior?->cantidad_reservada_anterior ?? 0),
                    // Datos POSTERIORES
                    'total_posterior' => (float) ($movimientoPosterior?->cantidad_total_posterior ?? 0),
                    'disponible_posterior' => (float) ($movimientoPosterior?->cantidad_disponible_posterior ?? 0),
                    'reservado_posterior' => (float) ($movimientoPosterior?->cantidad_reservada_posterior ?? 0),
                ];
            });

            // Calcular totales
            $totales = [
                'cantidad_productos' => $productos->count(),
                'cantidad_total_vendida' => $productos->sum('cantidad_total'),
                'total_venta_general' => $productos->sum('total_venta'),
                'precio_promedio_general' => $productos->count() > 0
                    ? $productos->sum('total_venta') / $productos->sum('cantidad_total')
                    : 0,
            ];

            // Obtener usuarios para el filtro
            $usuarios = User::whereHas('roles', function ($query) {
                $query->where('name', 'preventista');
            })->select('id', 'name', 'email')->get();

            // Obtener clientes para el filtro
            $clientes = \App\Models\Cliente::activos()->select('id', 'nombre', 'email')->get();

            // Obtener las ventas aprobadas que se usaron en el reporte
            $ventasQuery = DB::table('ventas')
                ->join('proformas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('clientes', 'proformas.cliente_id', '=', 'clientes.id')
                ->join('users', 'proformas.usuario_creador_id', '=', 'users.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->leftJoin('entregas', 'ventas.entrega_id', '=', 'entregas.id')
                ->leftJoin('estados_logistica', 'entregas.estado_entrega_id', '=', 'estados_logistica.id')
                ->leftJoin('entregas_venta_confirmaciones', 'ventas.id', '=', 'entregas_venta_confirmaciones.venta_id')
                ->select(
                    'ventas.id as venta_id',
                    'ventas.numero as numero_venta',
                    'proformas.id as proforma_id',
                    'proformas.numero as numero_proforma',
                    'proformas.created_at as fecha_proforma',
                    'clientes.nombre as cliente_nombre',
                    'users.name as usuario_nombre',
                    'ventas.total',
                    'ventas.created_at as fecha_venta',
                    'estados_documento.codigo as estado_codigo',
                    'estados_logistica.codigo as estado_entrega',
                    'entregas_venta_confirmaciones.motivo_rechazo as motivo_entrega',
                    'entregas_venta_confirmaciones.tienda_abierta',
                    'entregas_venta_confirmaciones.cliente_presente',
                    'entregas_venta_confirmaciones.observaciones_logistica',
                    'entregas_venta_confirmaciones.tipo_entrega',
                    'entregas_venta_confirmaciones.tipo_novedad',
                    'entregas_venta_confirmaciones.tuvo_problema',
                    'entregas_venta_confirmaciones.estado_pago',
                    'entregas_venta_confirmaciones.total_dinero_recibido',
                    'entregas_venta_confirmaciones.monto_pendiente',
                    'entregas_venta_confirmaciones.confirmado_en'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Aplicar los mismos filtros a las ventas
            if ($request->filled('usuario_creador_id')) {
                $ventasQuery->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $ventasQuery->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $ventasQuery->where('proformas.cliente_id', $request->cliente_id);
            }

            $ventas = $ventasQuery->orderByDesc('ventas.id')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->venta_id,
                        'numero' => $item->numero_venta,
                        'proforma_id' => $item->proforma_id,
                        'proforma_numero' => $item->numero_proforma,
                        'proforma_fecha' => $item->fecha_proforma,
                        'cliente' => $item->cliente_nombre,
                        'usuario' => $item->usuario_nombre,
                        'total' => (float) $item->total,
                        'fecha' => $item->fecha_venta,
                        'estado' => $item->estado_codigo,
                        'estado_entrega' => $item->estado_entrega,
                        'motivo_entrega' => $item->motivo_entrega,
                        'tienda_abierta' => $item->tienda_abierta,
                        'cliente_presente' => $item->cliente_presente,
                        'observaciones_logistica' => $item->observaciones_logistica,
                        'tipo_entrega' => $item->tipo_entrega,
                        'tipo_novedad' => $item->tipo_novedad,
                        'tuvo_problema' => $item->tuvo_problema,
                        'estado_pago' => $item->estado_pago,
                        'total_dinero_recibido' => (float) ($item->total_dinero_recibido ?? 0),
                        'monto_pendiente' => (float) ($item->monto_pendiente ?? 0),
                        'confirmado_en' => $item->confirmado_en,
                    ];
                });

            $filtros = [
                'fecha_desde' => $request->input('fecha_desde'),
                'fecha_hasta' => $request->input('fecha_hasta'),
                'usuario_creador_id' => $request->input('usuario_creador_id'),
                'cliente_id' => $request->input('cliente_id'),
            ];

            return Inertia::render('ventas/reporte-productos-vendidos', [
                'productos' => $productos,
                'totales' => $totales,
                'ventas' => $ventas,
                'filtros' => $filtros,
                'usuarios' => $usuarios,
                'clientes' => $clientes,
                'fecha_desde' => $fechaDesde->format('Y-m-d'),
                'fecha_hasta' => $fechaHasta->format('Y-m-d'),
                'es_preventista' => $user->hasRole('Preventista'),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error en ReporteVentasController::productosVendidos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return Inertia::render('ventas/reporte-productos-vendidos', [
                'productos' => [],
                'totales' => [
                    'cantidad_productos' => 0,
                    'cantidad_total_vendida' => 0,
                    'total_venta_general' => 0,
                ],
                'ventas' => [],
                'filtros' => [],
                'usuarios' => [],
                'clientes' => [],
                'error' => 'Error al generar reporte: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Ranking de clientes por ventas aprobadas/anuladas y productos
     * GET /reportes/ventas/ranking-clientes
     */
    public function rankingClientes(Request $request): InertiaResponse
    {
        try {
            $user = auth()->user();
            $limite = $request->integer('limite', 20);
            $categoriaClienteId = $request->integer('categoria_cliente_id', null);

            // ✅ NUEVO (2026-03-03): Validar fechas - default mes actual (día 1 al hoy)
            $fechaDesde = $request->filled('fecha_desde')
                ? $request->date('fecha_desde')
                : now()->startOfMonth();  // Primer día del mes actual
            $fechaHasta = $request->filled('fecha_hasta')
                ? $request->date('fecha_hasta')
                : now();  // Hoy

            // Estados
            $estadoAprobadoId = EstadoDocumento::where('codigo', 'APROBADO')->value('id');
            $estadoAnuladoId = EstadoDocumento::where('codigo', 'ANULADO')->value('id');

            // Obtener categorías de clientes para el selector
            $categoriasClientes = \App\Models\CategoriaCliente::orderBy('nombre')->get();

            // Query 1: TOP ventas aprobadas por cliente
            $topAprobadas = DB::table('ventas')
                ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
                ->select(
                    'clientes.id',
                    'clientes.nombre',
                    'clientes.codigo_cliente',
                    DB::raw('COUNT(ventas.id) as total_ventas'),
                    DB::raw('SUM(CAST(ventas.total AS DECIMAL(15,2))) as monto_total')
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->where('clientes.codigo_cliente', '!=', 'GENERAL')
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta);

            // Filtrar por categoría de cliente si se especifica
            if ($categoriaClienteId) {
                $topAprobadas->join('categoria_cliente', 'clientes.id', '=', 'categoria_cliente.cliente_id')
                    ->where('categoria_cliente.categoria_cliente_id', $categoriaClienteId);
            }

            $topAprobadas = $topAprobadas
                ->groupBy('clientes.id', 'clientes.nombre', 'clientes.codigo_cliente')
                ->orderByDesc('total_ventas')
                ->limit($limite)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->nombre,
                        'codigo_cliente' => $item->codigo_cliente,
                        'total_ventas' => (int) $item->total_ventas,
                        'monto_total' => (float) $item->monto_total,
                    ];
                });

            // Query 2: TOP ventas anuladas por cliente
            $topAnuladas = DB::table('ventas')
                ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
                ->select(
                    'clientes.id',
                    'clientes.nombre',
                    'clientes.codigo_cliente',
                    DB::raw('COUNT(ventas.id) as total_ventas'),
                    DB::raw('SUM(CAST(ventas.total AS DECIMAL(15,2))) as monto_total')
                )
                ->where('ventas.estado_documento_id', $estadoAnuladoId)
                ->where('clientes.codigo_cliente', '!=', 'GENERAL')
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta);

            // Filtrar por categoría de cliente si se especifica
            if ($categoriaClienteId) {
                $topAnuladas->join('categoria_cliente', 'clientes.id', '=', 'categoria_cliente.cliente_id')
                    ->where('categoria_cliente.categoria_cliente_id', $categoriaClienteId);
            }

            $topAnuladas = $topAnuladas
                ->groupBy('clientes.id', 'clientes.nombre', 'clientes.codigo_cliente')
                ->orderByDesc('total_ventas')
                ->limit($limite)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->nombre,
                        'codigo_cliente' => $item->codigo_cliente,
                        'total_ventas' => (int) $item->total_ventas,
                        'monto_total' => (float) $item->monto_total,
                    ];
                });

            // Query 3: TOP productos comprados por cliente
            $topProductos = DB::table('clientes')
                ->join('ventas', 'clientes.id', '=', 'ventas.cliente_id')
                ->join('proformas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->select(
                    'clientes.id',
                    'clientes.nombre',
                    'clientes.codigo_cliente',
                    DB::raw('COUNT(DISTINCT ventas.id) as total_ventas'),
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2))) as total_productos'),
                    DB::raw('SUM(CAST(detalle_proformas.subtotal AS DECIMAL(15,2))) as monto_total')
                )
                ->where('estados_documento.codigo', 'APROBADO')
                ->where('clientes.codigo_cliente', '!=', 'GENERAL')
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Filtrar por categoría de cliente si se especifica
            if ($categoriaClienteId) {
                $topProductos->join('categoria_cliente', 'clientes.id', '=', 'categoria_cliente.cliente_id')
                    ->where('categoria_cliente.categoria_cliente_id', $categoriaClienteId);
            }

            $topProductos = $topProductos
                ->groupBy('clientes.id', 'clientes.nombre', 'clientes.codigo_cliente')
                ->orderByDesc('total_productos')
                ->limit($limite)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->nombre,
                        'codigo_cliente' => $item->codigo_cliente,
                        'total_ventas' => (int) $item->total_ventas,
                        'total_productos' => (float) $item->total_productos,
                        'monto_total' => (float) $item->monto_total,
                    ];
                });

            // Query 4: MENOS productos comprados por cliente
            $menosProductos = DB::table('clientes')
                ->join('ventas', 'clientes.id', '=', 'ventas.cliente_id')
                ->join('proformas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->select(
                    'clientes.id',
                    'clientes.nombre',
                    'clientes.codigo_cliente',
                    DB::raw('COUNT(DISTINCT ventas.id) as total_ventas'),
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2))) as total_productos'),
                    DB::raw('SUM(CAST(detalle_proformas.subtotal AS DECIMAL(15,2))) as monto_total')
                )
                ->where('estados_documento.codigo', 'APROBADO')
                ->where('clientes.codigo_cliente', '!=', 'GENERAL')
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Filtrar por categoría de cliente si se especifica
            if ($categoriaClienteId) {
                $menosProductos->join('categoria_cliente', 'clientes.id', '=', 'categoria_cliente.cliente_id')
                    ->where('categoria_cliente.categoria_cliente_id', $categoriaClienteId);
            }

            $menosProductos = $menosProductos
                ->groupBy('clientes.id', 'clientes.nombre', 'clientes.codigo_cliente')
                ->orderBy('total_productos')
                ->limit($limite)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->nombre,
                        'codigo_cliente' => $item->codigo_cliente,
                        'total_ventas' => (int) $item->total_ventas,
                        'total_productos' => (float) $item->total_productos,
                        'monto_total' => (float) $item->monto_total,
                    ];
                });

            $filtros = [
                'fecha_desde' => $request->input('fecha_desde'),
                'fecha_hasta' => $request->input('fecha_hasta'),
                'limite' => $limite,
                'categoria_cliente_id' => $categoriaClienteId,
            ];

            return Inertia::render('reportes/ventas/ranking-clientes', [
                'topAprobadas' => $topAprobadas,
                'topAnuladas' => $topAnuladas,
                'topProductos' => $topProductos,
                'menosProductos' => $menosProductos,
                'filtros' => $filtros,
                'fecha_desde' => $fechaDesde->format('Y-m-d'),
                'fecha_hasta' => $fechaHasta->format('Y-m-d'),
                'categoriasClientes' => $categoriasClientes,
            ]);

        } catch (\Exception $e) {
            \Log::error('Error en ReporteVentasController::rankingClientes', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Obtener categorías incluso en caso de error
            $categoriasClientes = \App\Models\CategoriaCliente::orderBy('nombre')->get();

            return Inertia::render('reportes/ventas/ranking-clientes', [
                'topAprobadas' => [],
                'topAnuladas' => [],
                'topProductos' => [],
                'menosProductos' => [],
                'filtros' => [],
                'categoriasClientes' => $categoriasClientes,
                'fecha_desde' => now()->startOfMonth()->format('Y-m-d'),
                'fecha_hasta' => now()->format('Y-m-d'),
                'error' => 'Error al generar reporte: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Entregas por chofer
     * GET /reportes/ventas/entregas-por-chofer
     */
    public function entregasPorChofer(Request $request): InertiaResponse
    {
        try {
            // ✅ NUEVO (2026-03-03): Validar fechas - default mes actual (día 1 al hoy)
            $fechaDesde = $request->filled('fecha_desde')
                ? $request->date('fecha_desde')
                : now()->startOfMonth();  // Primer día del mes actual
            $fechaHasta = $request->filled('fecha_hasta')
                ? $request->date('fecha_hasta')
                : now();  // Hoy

            // Query principal: Resumen por chofer
            $choferes = DB::table('users')
                ->leftJoin('entregas', 'entregas.chofer_id', '=', 'users.id')
                ->leftJoin('entregas_venta_confirmaciones', 'entregas_venta_confirmaciones.entrega_id', '=', 'entregas.id')
                ->select(
                    'users.id as chofer_id',
                    'users.name as chofer_nombre',
                    DB::raw('COUNT(DISTINCT entregas_venta_confirmaciones.id) as total_confirmaciones'),
                    DB::raw("COUNT(DISTINCT CASE WHEN entregas_venta_confirmaciones.tipo_confirmacion = 'COMPLETA' THEN entregas_venta_confirmaciones.id END) as completas"),
                    DB::raw("COUNT(DISTINCT CASE WHEN entregas_venta_confirmaciones.tipo_confirmacion = 'CON_NOVEDAD' THEN entregas_venta_confirmaciones.id END) as con_novedad"),
                    DB::raw("COUNT(DISTINCT CASE WHEN entregas_venta_confirmaciones.tuvo_problema = true THEN entregas_venta_confirmaciones.id END) as con_problemas"),
                    DB::raw('SUM(CAST(COALESCE(entregas_venta_confirmaciones.total_dinero_recibido, 0) AS DECIMAL(15,2))) as dinero_recibido')
                )
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '>=', $fechaDesde)
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '<=', $fechaHasta)
                ->whereNotNull('users.id');

            // Filtrar por chofer específico si se proporciona
            if ($request->filled('chofer_id')) {
                $choferes->where('users.id', $request->integer('chofer_id'));
            }

            $choferes = $choferes->groupBy('users.id', 'users.name')
                ->orderByDesc('total_confirmaciones')
                ->get()
                ->map(function ($item) {
                    return [
                        'chofer_id' => $item->chofer_id,
                        'chofer_nombre' => $item->chofer_nombre,
                        'total_confirmaciones' => (int) $item->total_confirmaciones,
                        'completas' => (int) $item->completas,
                        'con_novedad' => (int) $item->con_novedad,
                        'con_problemas' => (int) $item->con_problemas,
                        'dinero_recibido' => (float) ($item->dinero_recibido ?? 0),
                    ];
                });

            // Calcular totales
            $totales = [
                'total_confirmaciones' => $choferes->sum('total_confirmaciones'),
                'total_completas' => $choferes->sum('completas'),
                'total_novedad' => $choferes->sum('con_novedad'),
                'total_dinero' => $choferes->sum('dinero_recibido'),
            ];

            // Obtener lista de choferes para el select
            $choferesList = User::whereHas('roles', function ($query) {
                $query->whereIn('name', ['Chofer', 'chofer', 'driver']);
            })->select('id', 'name')->orderBy('name')->get();

            $filtros = [
                'fecha_desde' => $request->input('fecha_desde'),
                'fecha_hasta' => $request->input('fecha_hasta'),
                'chofer_id' => $request->input('chofer_id'),
            ];

            return Inertia::render('reportes/ventas/entregas-por-chofer', [
                'choferes' => $choferes,
                'totales' => $totales,
                'filtros' => $filtros,
                'choferesList' => $choferesList,
                'fecha_desde' => $fechaDesde->format('Y-m-d'),
                'fecha_hasta' => $fechaHasta->format('Y-m-d'),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error en ReporteVentasController::entregasPorChofer', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return Inertia::render('reportes/ventas/entregas-por-chofer', [
                'choferes' => [],
                'totales' => [
                    'total_confirmaciones' => 0,
                    'total_completas' => 0,
                    'total_novedad' => 0,
                    'total_dinero' => 0,
                ],
                'filtros' => [],
                'choferesList' => [],
                'error' => 'Error al generar reporte: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Entregas por cliente (completas, rechazadas, tienda cerrada)
     * GET /reportes/ventas/entregas-por-cliente
     */
    public function entregarsPorCliente(Request $request): InertiaResponse
    {
        try {
            $limite = $request->integer('limite', 20);

            // ✅ NUEVO (2026-03-03): Validar fechas - default mes actual (día 1 al hoy)
            $fechaDesde = $request->filled('fecha_desde')
                ? $request->date('fecha_desde')
                : now()->startOfMonth();  // Primer día del mes actual
            $fechaHasta = $request->filled('fecha_hasta')
                ? $request->date('fecha_hasta')
                : now();  // Hoy

            // Query 1: Clientes con más entregas COMPLETAS
            $completasQuery = DB::table('entregas_venta_confirmaciones')
                ->join('ventas', 'entregas_venta_confirmaciones.venta_id', '=', 'ventas.id')
                ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
                ->select(
                    'clientes.id',
                    'clientes.nombre',
                    'clientes.codigo_cliente',
                    DB::raw('COUNT(DISTINCT entregas_venta_confirmaciones.id) as total_entregas'),
                    DB::raw('SUM(CAST(COALESCE(entregas_venta_confirmaciones.total_dinero_recibido, 0) AS DECIMAL(15,2))) as dinero_recibido')
                )
                ->where('entregas_venta_confirmaciones.tipo_confirmacion', 'COMPLETA')
                ->where('clientes.codigo_cliente', '!=', 'GENERAL')
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '>=', $fechaDesde)
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '<=', $fechaHasta)
                ->whereNotNull('entregas_venta_confirmaciones.confirmado_en')
                ->groupBy('clientes.id', 'clientes.nombre', 'clientes.codigo_cliente')
                ->orderByDesc('total_entregas')
                ->limit($limite)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->nombre,
                        'codigo_cliente' => $item->codigo_cliente,
                        'total_entregas' => (int) $item->total_entregas,
                        'dinero_recibido' => (float) $item->dinero_recibido,
                    ];
                });

            // Query 2: Clientes con más entregas RECHAZADAS
            $rechazadasQuery = DB::table('entregas_venta_confirmaciones')
                ->join('ventas', 'entregas_venta_confirmaciones.venta_id', '=', 'ventas.id')
                ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
                ->select(
                    'clientes.id',
                    'clientes.nombre',
                    'clientes.codigo_cliente',
                    DB::raw('COUNT(DISTINCT entregas_venta_confirmaciones.id) as total_entregas'),
                    DB::raw('SUM(CAST(COALESCE(ventas.total, 0) AS DECIMAL(15,2))) as monto_rechazado')
                )
                ->where('clientes.codigo_cliente', '!=', 'GENERAL')
                ->whereNotNull('entregas_venta_confirmaciones.motivo_rechazo')
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '>=', $fechaDesde)
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '<=', $fechaHasta)
                ->whereNotNull('entregas_venta_confirmaciones.confirmado_en')
                ->groupBy('clientes.id', 'clientes.nombre', 'clientes.codigo_cliente')
                ->orderByDesc('total_entregas')
                ->limit($limite)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->nombre,
                        'codigo_cliente' => $item->codigo_cliente,
                        'total_entregas' => (int) $item->total_entregas,
                        'monto_rechazado' => (float) $item->monto_rechazado,
                    ];
                });

            // Query 3: Clientes donde TIENDA ESTABA CERRADA
            $tiendaCerradaQuery = DB::table('entregas_venta_confirmaciones')
                ->join('ventas', 'entregas_venta_confirmaciones.venta_id', '=', 'ventas.id')
                ->join('clientes', 'ventas.cliente_id', '=', 'clientes.id')
                ->select(
                    'clientes.id',
                    'clientes.nombre',
                    'clientes.codigo_cliente',
                    DB::raw('COUNT(DISTINCT entregas_venta_confirmaciones.id) as total_entregas'),
                    DB::raw('SUM(CAST(COALESCE(ventas.total, 0) AS DECIMAL(15,2))) as monto_intento')
                )
                ->where('clientes.codigo_cliente', '!=', 'GENERAL')
                ->where('entregas_venta_confirmaciones.tienda_abierta', false)
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '>=', $fechaDesde)
                ->whereDate('entregas_venta_confirmaciones.confirmado_en', '<=', $fechaHasta)
                ->whereNotNull('entregas_venta_confirmaciones.confirmado_en')
                ->groupBy('clientes.id', 'clientes.nombre', 'clientes.codigo_cliente')
                ->orderByDesc('total_entregas')
                ->limit($limite)
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nombre' => $item->nombre,
                        'codigo_cliente' => $item->codigo_cliente,
                        'total_entregas' => (int) $item->total_entregas,
                        'monto_intento' => (float) $item->monto_intento,
                    ];
                });

            $filtros = [
                'fecha_desde' => $request->input('fecha_desde'),
                'fecha_hasta' => $request->input('fecha_hasta'),
                'limite' => $limite,
            ];

            return Inertia::render('reportes/ventas/entregas-por-cliente', [
                'completadas' => $completasQuery,
                'rechazadas' => $rechazadasQuery,
                'tiendaCerrada' => $tiendaCerradaQuery,
                'filtros' => $filtros,
                'fecha_desde' => $fechaDesde->format('Y-m-d'),
                'fecha_hasta' => $fechaHasta->format('Y-m-d'),
            ]);

        } catch (\Exception $e) {
            \Log::error('Error en ReporteVentasController::entregarsPorCliente', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return Inertia::render('reportes/ventas/entregas-por-cliente', [
                'completadas' => [],
                'rechazadas' => [],
                'tiendaCerrada' => [],
                'filtros' => [],
                'error' => 'Error al generar reporte: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Imprimir reporte DIRECTO a impresora (sin diálogos)
     * POST /ventas/reporte-productos-vendidos/imprimir-directo
     */
    public function imprimirDirecto(Request $request)
    {
        try {
            $user = auth()->user();
            $nombreImpresora = $request->input('impresora', 'default');

            // Validar fechas
            $fechaDesde = $request->filled('fecha_desde') ? $request->date('fecha_desde') : now()->subMonth();
            $fechaHasta = $request->filled('fecha_hasta') ? $request->date('fecha_hasta') : now();

            // Obtener el ID del estado APROBADO
            $estadoAprobadoId = EstadoDocumento::where('codigo', 'APROBADO')->value('id');

            // ✅ ACTUALIZADO (2026-04-28): Considerar productos directos y dentro de combos
            // Query 1: Productos directos
            $productosDirectos = DB::table('proformas')
                ->join('ventas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('productos', 'detalle_proformas.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(detalle_proformas.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_proformas.subtotal AS DECIMAL(15,2))) as total_venta'),
                    'proformas.usuario_creador_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            if ($request->filled('usuario_creador_id')) {
                $productosDirectos->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $productosDirectos->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $productosDirectos->where('proformas.cliente_id', $request->cliente_id);
            }

            $productosDirectos = $productosDirectos->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'proformas.usuario_creador_id')
                ->get();

            // Query 2: Productos dentro de combos
            $productosEnCombos = DB::table('proformas')
                ->join('ventas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('combo_items', 'detalle_proformas.producto_id', '=', 'combo_items.combo_id')
                ->join('productos', 'combo_items.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2)) * CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as total_venta'),
                    'proformas.usuario_creador_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            if ($request->filled('usuario_creador_id')) {
                $productosEnCombos->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $productosEnCombos->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $productosEnCombos->where('proformas.cliente_id', $request->cliente_id);
            }

            $productosEnCombos = $productosEnCombos->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'proformas.usuario_creador_id')
                ->get();

            // Combinar resultados
            $productosCombinados = collect();

            foreach ($productosDirectos as $item) {
                $productosCombinados->push([
                    'id' => $item->id,
                    'nombre' => $item->producto_nombre,
                    'codigo' => $item->producto_codigo,
                    'cantidad_total' => (float) $item->cantidad_total,
                    'precio_promedio' => (float) $item->precio_promedio,
                    'total_venta' => (float) $item->total_venta,
                    'usuario_creador_id' => $item->usuario_creador_id,
                ]);
            }

            foreach ($productosEnCombos as $item) {
                $existe = $productosCombinados->firstWhere('id', $item->id);
                if ($existe) {
                    $existe['cantidad_total'] += (float) $item->cantidad_total;
                    $existe['total_venta'] += (float) $item->total_venta;
                    $cantidadTotal = $existe['cantidad_total'];
                    $existe['precio_promedio'] = $cantidadTotal > 0 ? $existe['total_venta'] / $cantidadTotal : 0;
                } else {
                    $productosCombinados->push([
                        'id' => $item->id,
                        'nombre' => $item->producto_nombre,
                        'codigo' => $item->producto_codigo,
                        'cantidad_total' => (float) $item->cantidad_total,
                        'precio_promedio' => (float) $item->precio_promedio,
                        'total_venta' => (float) $item->total_venta,
                        'usuario_creador_id' => $item->usuario_creador_id,
                    ]);
                }
            }

            $productos = $productosCombinados->sortBy('nombre')->values();

            // ✅ NUEVO (2026-04-28): Agregar datos de movimientos de inventario (anterior y posterior)
            $productos = $productos->map(function ($producto) use ($fechaDesde, $fechaHasta) {
                // Movimiento ANTERIOR: primer movimiento EN el período (captura estado inicial del período)
                $movimientoAnterior = DB::table('movimientos_inventario')
                    ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                    ->where('stock_productos.producto_id', $producto['id'])
                    ->whereDate('movimientos_inventario.created_at', '>=', $fechaDesde)
                    ->whereDate('movimientos_inventario.created_at', '<=', $fechaHasta)
                    ->orderBy('movimientos_inventario.created_at', 'asc')
                    ->select('cantidad_total_anterior', 'cantidad_disponible_anterior', 'cantidad_reservada_anterior')
                    ->first();

                // Movimiento POSTERIOR: último movimiento EN el período (captura estado final del período)
                $movimientoPosterior = DB::table('movimientos_inventario')
                    ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                    ->where('stock_productos.producto_id', $producto['id'])
                    ->whereDate('movimientos_inventario.created_at', '>=', $fechaDesde)
                    ->whereDate('movimientos_inventario.created_at', '<=', $fechaHasta)
                    ->orderBy('movimientos_inventario.created_at', 'desc')
                    ->select('cantidad_total_posterior', 'cantidad_disponible_posterior', 'cantidad_reservada_posterior')
                    ->first();

                // Si no hay movimientos en el período, traer el último movimiento antes del período
                if (!$movimientoAnterior) {
                    $movimientoAnterior = DB::table('movimientos_inventario')
                        ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                        ->where('stock_productos.producto_id', $producto['id'])
                        ->whereDate('movimientos_inventario.created_at', '<', $fechaDesde)
                        ->orderBy('movimientos_inventario.created_at', 'desc')
                        ->select('cantidad_total_posterior as cantidad_total_anterior', 'cantidad_disponible_posterior as cantidad_disponible_anterior', 'cantidad_reservada_posterior as cantidad_reservada_anterior')
                        ->first();
                }

                return [
                    ...$producto,
                    // Datos ANTERIORES
                    'total_anterior' => (float) ($movimientoAnterior?->cantidad_total_anterior ?? 0),
                    'disponible_anterior' => (float) ($movimientoAnterior?->cantidad_disponible_anterior ?? 0),
                    'reservado_anterior' => (float) ($movimientoAnterior?->cantidad_reservada_anterior ?? 0),
                    // Datos POSTERIORES
                    'total_posterior' => (float) ($movimientoPosterior?->cantidad_total_posterior ?? 0),
                    'disponible_posterior' => (float) ($movimientoPosterior?->cantidad_disponible_posterior ?? 0),
                    'reservado_posterior' => (float) ($movimientoPosterior?->cantidad_reservada_posterior ?? 0),
                ];
            });

            // Obtener información del usuario si está filtrado
            $usuarioNombre = null;
            if ($request->filled('usuario_creador_id')) {
                $usuarioNombre = User::find($request->usuario_creador_id)?->name;
            }

            // Renderizar vista HTML
            $html = view('reportes.reporte-productos-vendidos-print', [
                'productos' => $productos,
                'totales' => [
                    'cantidad_productos' => $productos->count(),
                    'cantidad_total_vendida' => $productos->sum('cantidad_total'),
                    'total_venta_general' => $productos->sum('total_venta'),
                    'precio_promedio_general' => $productos->count() > 0
                        ? $productos->sum('total_venta') / $productos->sum('cantidad_total')
                        : 0,
                ],
                'ventas' => [],
                'fechaDesde' => $fechaDesde->format('d/m/Y'),
                'fechaHasta' => $fechaHasta->format('d/m/Y'),
                'usuarioNombre' => $usuarioNombre,
                'formato' => 'A4',
            ])->render();

            // Generar PDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)
                ->setPaper('A4', 'portrait');

            // Guardar PDF temporalmente
            $rutaPDF = storage_path('app/temp/reporte-' . time() . '.pdf');
            @mkdir(dirname($rutaPDF), 0755, true);
            $pdf->save($rutaPDF);

            // Enviar a impresora según el SO
            $comando = '';
            if (PHP_OS_FAMILY === 'Linux') {
                // Linux: usar comando 'lp'
                $comando = "lp -d '{$nombreImpresora}' '{$rutaPDF}' 2>&1";
            } elseif (PHP_OS_FAMILY === 'Windows') {
                // Windows: usar comando 'print'
                $comando = "print /D:\\\\localhost\\{$nombreImpresora} \"{$rutaPDF}\" 2>&1";
            }

            if ($comando) {
                $output = shell_exec($comando);

                // Limpiar archivo temporal después de un delay
                sleep(2);
                @unlink($rutaPDF);

                \Log::info('Reporte enviado a impresora', [
                    'impresora' => $nombreImpresora,
                    'usuario' => $user->name,
                    'output' => $output,
                ]);

                return response()->json([
                    'success' => true,
                    'mensaje' => "✅ Reporte enviado a la impresora '{$nombreImpresora}'",
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'Sistema operativo no soportado',
                ], 400);
            }

        } catch (\Exception $e) {
            \Log::error('Error en ReporteVentasController::imprimirDirecto', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'error' => 'Error al imprimir: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener lista de impresoras disponibles
     * GET /api/impresoras
     */
    public function obtenerImpresoras(Request $request)
    {
        try {
            $impresoras = [];

            if (PHP_OS_FAMILY === 'Linux') {
                // Linux: obtener impresoras con lpstat
                $output = shell_exec('lpstat -p -d 2>/dev/null');
                if ($output) {
                    $lineas = explode("\n", $output);
                    foreach ($lineas as $linea) {
                        if (strpos($linea, 'printer') !== false) {
                            preg_match('/printer\s+(\S+)/', $linea, $matches);
                            if (!empty($matches[1])) {
                                $impresoras[] = $matches[1];
                            }
                        }
                    }
                }
            } elseif (PHP_OS_FAMILY === 'Windows') {
                // Windows: obtener impresoras con wmic
                $output = shell_exec('wmic printerjob list brief 2>nul || echo ""');
                if ($output) {
                    $lineas = explode("\n", $output);
                    foreach ($lineas as $linea) {
                        $linea = trim($linea);
                        if (!empty($linea) && strpos($linea, 'Name') === false) {
                            $impresoras[] = $linea;
                        }
                    }
                }
                // Fallback: crear lista estándar
                if (empty($impresoras)) {
                    $impresoras = ['default', 'Microsoft Print to PDF', 'Fax'];
                }
            }

            return response()->json([
                'success' => true,
                'impresoras' => array_unique(array_filter($impresoras)),
                'so' => PHP_OS_FAMILY,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'impresoras' => ['default'],
            ]);
        }
    }

    /**
     * Imprimir reporte de productos vendidos
     * GET /ventas/reporte-productos-vendidos/imprimir
     */
    public function imprimirReporte(Request $request)
    {
        try {
            $user = auth()->user();
            $formato = $request->input('formato', 'A4');
            $accion = $request->input('accion', 'stream');

            // Validar fechas
            $fechaDesde = $request->filled('fecha_desde') ? $request->date('fecha_desde') : now()->subMonth();
            $fechaHasta = $request->filled('fecha_hasta') ? $request->date('fecha_hasta') : now();

            // Obtener el ID del estado APROBADO
            $estadoAprobadoId = EstadoDocumento::where('codigo', 'APROBADO')->value('id');

            // ✅ ACTUALIZADO (2026-04-28): Considerar productos directos y dentro de combos
            // Query 1: Productos directos
            $productosDirectos = DB::table('proformas')
                ->join('ventas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('productos', 'detalle_proformas.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(detalle_proformas.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_proformas.subtotal AS DECIMAL(15,2))) as total_venta'),
                    'proformas.usuario_creador_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            if ($request->filled('usuario_creador_id')) {
                $productosDirectos->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $productosDirectos->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $productosDirectos->where('proformas.cliente_id', $request->cliente_id);
            }

            $productosDirectos = $productosDirectos->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'proformas.usuario_creador_id')
                ->get();

            // Query 2: Productos dentro de combos
            $productosEnCombos = DB::table('proformas')
                ->join('ventas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('detalle_proformas', 'proformas.id', '=', 'detalle_proformas.proforma_id')
                ->join('combo_items', 'detalle_proformas.producto_id', '=', 'combo_items.combo_id')
                ->join('productos', 'combo_items.producto_id', '=', 'productos.id')
                ->select(
                    'productos.id',
                    'productos.nombre as producto_nombre',
                    'productos.sku as producto_codigo',
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2))) as cantidad_total'),
                    DB::raw('AVG(CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as precio_promedio'),
                    DB::raw('SUM(CAST(detalle_proformas.cantidad AS DECIMAL(15,2)) * CAST(combo_items.cantidad AS DECIMAL(15,2)) * CAST(combo_items.precio_unitario AS DECIMAL(15,2))) as total_venta'),
                    'proformas.usuario_creador_id'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            if ($request->filled('usuario_creador_id')) {
                $productosEnCombos->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $productosEnCombos->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $productosEnCombos->where('proformas.cliente_id', $request->cliente_id);
            }

            $productosEnCombos = $productosEnCombos->groupBy('productos.id', 'productos.nombre', 'productos.sku', 'proformas.usuario_creador_id')
                ->get();

            // Combinar resultados
            $productosCombinados = collect();

            foreach ($productosDirectos as $item) {
                $productosCombinados->push([
                    'id' => $item->id,
                    'nombre' => $item->producto_nombre,
                    'codigo' => $item->producto_codigo,
                    'cantidad_total' => (float) $item->cantidad_total,
                    'precio_promedio' => (float) $item->precio_promedio,
                    'total_venta' => (float) $item->total_venta,
                    'usuario_creador_id' => $item->usuario_creador_id,
                ]);
            }

            foreach ($productosEnCombos as $item) {
                $existe = $productosCombinados->firstWhere('id', $item->id);
                if ($existe) {
                    $existe['cantidad_total'] += (float) $item->cantidad_total;
                    $existe['total_venta'] += (float) $item->total_venta;
                    $cantidadTotal = $existe['cantidad_total'];
                    $existe['precio_promedio'] = $cantidadTotal > 0 ? $existe['total_venta'] / $cantidadTotal : 0;
                } else {
                    $productosCombinados->push([
                        'id' => $item->id,
                        'nombre' => $item->producto_nombre,
                        'codigo' => $item->producto_codigo,
                        'cantidad_total' => (float) $item->cantidad_total,
                        'precio_promedio' => (float) $item->precio_promedio,
                        'total_venta' => (float) $item->total_venta,
                        'usuario_creador_id' => $item->usuario_creador_id,
                    ]);
                }
            }

            $productos = $productosCombinados->sortBy('nombre')->values();

            // ✅ NUEVO (2026-04-28): Agregar datos de movimientos de inventario (anterior y posterior)
            $productos = $productos->map(function ($producto) use ($fechaDesde, $fechaHasta) {
                // Movimiento ANTERIOR: primer movimiento EN el período (captura estado inicial del período)
                $movimientoAnterior = DB::table('movimientos_inventario')
                    ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                    ->where('stock_productos.producto_id', $producto['id'])
                    ->whereDate('movimientos_inventario.created_at', '>=', $fechaDesde)
                    ->whereDate('movimientos_inventario.created_at', '<=', $fechaHasta)
                    ->orderBy('movimientos_inventario.created_at', 'asc')
                    ->select('cantidad_total_anterior', 'cantidad_disponible_anterior', 'cantidad_reservada_anterior')
                    ->first();

                // Movimiento POSTERIOR: último movimiento EN el período (captura estado final del período)
                $movimientoPosterior = DB::table('movimientos_inventario')
                    ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                    ->where('stock_productos.producto_id', $producto['id'])
                    ->whereDate('movimientos_inventario.created_at', '>=', $fechaDesde)
                    ->whereDate('movimientos_inventario.created_at', '<=', $fechaHasta)
                    ->orderBy('movimientos_inventario.created_at', 'desc')
                    ->select('cantidad_total_posterior', 'cantidad_disponible_posterior', 'cantidad_reservada_posterior')
                    ->first();

                // Si no hay movimientos en el período, traer el último movimiento antes del período
                if (!$movimientoAnterior) {
                    $movimientoAnterior = DB::table('movimientos_inventario')
                        ->join('stock_productos', 'movimientos_inventario.stock_producto_id', '=', 'stock_productos.id')
                        ->where('stock_productos.producto_id', $producto['id'])
                        ->whereDate('movimientos_inventario.created_at', '<', $fechaDesde)
                        ->orderBy('movimientos_inventario.created_at', 'desc')
                        ->select('cantidad_total_posterior as cantidad_total_anterior', 'cantidad_disponible_posterior as cantidad_disponible_anterior', 'cantidad_reservada_posterior as cantidad_reservada_anterior')
                        ->first();
                }

                return [
                    ...$producto,
                    // Datos ANTERIORES
                    'total_anterior' => (float) ($movimientoAnterior?->cantidad_total_anterior ?? 0),
                    'disponible_anterior' => (float) ($movimientoAnterior?->cantidad_disponible_anterior ?? 0),
                    'reservado_anterior' => (float) ($movimientoAnterior?->cantidad_reservada_anterior ?? 0),
                    // Datos POSTERIORES
                    'total_posterior' => (float) ($movimientoPosterior?->cantidad_total_posterior ?? 0),
                    'disponible_posterior' => (float) ($movimientoPosterior?->cantidad_disponible_posterior ?? 0),
                    'reservado_posterior' => (float) ($movimientoPosterior?->cantidad_reservada_posterior ?? 0),
                ];
            });

            // Calcular totales
            $totales = [
                'cantidad_productos' => $productos->count(),
                'cantidad_total_vendida' => $productos->sum('cantidad_total'),
                'total_venta_general' => $productos->sum('total_venta'),
                'precio_promedio_general' => $productos->count() > 0
                    ? $productos->sum('total_venta') / $productos->sum('cantidad_total')
                    : 0,
            ];

            // Obtener las ventas aprobadas que se usaron en el reporte
            $ventasQuery = DB::table('ventas')
                ->join('proformas', 'ventas.proforma_id', '=', 'proformas.id')
                ->join('clientes', 'proformas.cliente_id', '=', 'clientes.id')
                ->join('users', 'proformas.usuario_creador_id', '=', 'users.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->leftJoin('entregas', 'ventas.entrega_id', '=', 'entregas.id')
                ->leftJoin('estados_logistica', 'entregas.estado_entrega_id', '=', 'estados_logistica.id')
                ->leftJoin('entregas_venta_confirmaciones', 'ventas.id', '=', 'entregas_venta_confirmaciones.venta_id')
                ->select(
                    'ventas.id as venta_id',
                    'ventas.numero as numero_venta',
                    'proformas.id as proforma_id',
                    'proformas.numero as numero_proforma',
                    'proformas.created_at as fecha_proforma',
                    'clientes.nombre as cliente_nombre',
                    'users.name as usuario_nombre',
                    'ventas.total',
                    'ventas.created_at as fecha_venta',
                    'estados_documento.codigo as estado_codigo',
                    'estados_logistica.codigo as estado_entrega',
                    'entregas_venta_confirmaciones.motivo_rechazo as motivo_entrega',
                    'entregas_venta_confirmaciones.tienda_abierta',
                    'entregas_venta_confirmaciones.cliente_presente',
                    'entregas_venta_confirmaciones.observaciones_logistica',
                    'entregas_venta_confirmaciones.tipo_entrega',
                    'entregas_venta_confirmaciones.tipo_novedad',
                    'entregas_venta_confirmaciones.tuvo_problema',
                    'entregas_venta_confirmaciones.estado_pago',
                    'entregas_venta_confirmaciones.total_dinero_recibido',
                    'entregas_venta_confirmaciones.monto_pendiente',
                    'entregas_venta_confirmaciones.confirmado_en'
                )
                ->where('ventas.estado_documento_id', $estadoAprobadoId)
                ->whereDate('ventas.created_at', '>=', $fechaDesde)
                ->whereDate('ventas.created_at', '<=', $fechaHasta)
                ->whereNotNull('ventas.proforma_id');

            // Aplicar los mismos filtros a las ventas
            if ($request->filled('usuario_creador_id')) {
                $ventasQuery->where('proformas.usuario_creador_id', $request->usuario_creador_id);
            } elseif ($user->hasRole('Preventista')) {
                $ventasQuery->where('proformas.usuario_creador_id', $user->id);
            }

            if ($request->filled('cliente_id')) {
                $ventasQuery->where('proformas.cliente_id', $request->cliente_id);
            }

            $ventas = $ventasQuery->orderByDesc('ventas.id')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->venta_id,
                        'numero' => $item->numero_venta,
                        'proforma_numero' => $item->numero_proforma,
                        'proforma_fecha' => $item->fecha_proforma,
                        'cliente' => $item->cliente_nombre,
                        'usuario' => $item->usuario_nombre,
                        'total' => (float) $item->total,
                        'fecha' => $item->fecha_venta,
                        'estado' => $item->estado_codigo,
                        'estado_entrega' => $item->estado_entrega,
                        'motivo_entrega' => $item->motivo_entrega,
                        'tienda_abierta' => $item->tienda_abierta,
                        'cliente_presente' => $item->cliente_presente,
                        'observaciones_logistica' => $item->observaciones_logistica,
                        'tipo_entrega' => $item->tipo_entrega,
                        'tipo_novedad' => $item->tipo_novedad,
                        'tuvo_problema' => $item->tuvo_problema,
                        'estado_pago' => $item->estado_pago,
                        'total_dinero_recibido' => (float) ($item->total_dinero_recibido ?? 0),
                        'monto_pendiente' => (float) ($item->monto_pendiente ?? 0),
                        'confirmado_en' => $item->confirmado_en,
                    ];
                })
                ->sortBy('id')
                ->values();

            // Obtener información del usuario si está filtrado
            $usuarioNombre = null;
            if ($request->filled('usuario_creador_id')) {
                $usuarioNombre = User::find($request->usuario_creador_id)?->name;
            }

            // Renderizar vista HTML
            $html = view('reportes.reporte-productos-vendidos-print', [
                'productos' => $productos,
                'ventas' => $ventas,
                'totales' => $totales,
                'fechaDesde' => $fechaDesde->format('d/m/Y'),
                'fechaHasta' => $fechaHasta->format('d/m/Y'),
                'usuarioNombre' => $usuarioNombre,
                'formato' => $formato,
            ])->render();

            // Generar PDF
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html)
                ->setPaper($formato === 'TICKET_80' ? array(0, 0, 226, 999999) : 'A4', 'portrait');

            // Retornar según la acción
            if ($accion === 'download') {
                return $pdf->download('reporte-productos-vendidos-' . now()->format('Y-m-d-H-i-s') . '.pdf');
            } else {
                return $pdf->stream();
            }

        } catch (\Exception $e) {
            \Log::error('Error en ReporteVentasController::imprimirReporte', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Error al generar reporte: ' . $e->getMessage()], 500);
        }
    }
}

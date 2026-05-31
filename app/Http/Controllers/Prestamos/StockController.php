<?php

namespace App\Http\Controllers\Prestamos;

use App\Http\Controllers\Controller;
use App\Models\AlmacenPrestable;
use App\Models\PrestableStock;
use Inertia\Inertia;

class StockController extends Controller
{
    /**
     * GET /prestamos/stock
     * Página de stock y distribución
     */
    public function stock()
    {
        // Obtener items de stock de TODOS los almacenes (canastillas y embases)
        $items = PrestableStock::with(['prestable', 'almacenPrestable'])
            ->get()
            ->map(function ($stock) {
                $cantidadClienteTotal = ($stock->cantidad_cliente_deudor ?? 0) + ($stock->cantidad_cliente_devuelto ?? 0);
                $cantidadEventoTotal = ($stock->cantidad_evento_deudor ?? 0) + ($stock->cantidad_evento_devuelto ?? 0);
                $cantidadProveedorTotal = ($stock->cantidad_proveedor_acreedor ?? 0) + ($stock->cantidad_proveedor_devuelto ?? 0);

                return [
                    'id' => $stock->id,
                    'prestable_id' => $stock->prestable_id,
                    'prestable_nombre' => $stock->prestable->nombre,
                    'prestable_codigo' => $stock->prestable->codigo,
                    'prestable_tipo' => $stock->prestable->tipo,
                    'almacen_nombre' => $stock->almacenPrestable->nombre,
                    'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                    'cantidad_disponible' => $stock->cantidad_disponible ?? 0,
                    'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor ?? 0,
                    'cantidad_cliente_devuelto' => $stock->cantidad_cliente_devuelto ?? 0,
                    'cantidad_cliente_total' => $cantidadClienteTotal,
                    'cantidad_evento_deudor' => $stock->cantidad_evento_deudor ?? 0,
                    'cantidad_evento_devuelto' => $stock->cantidad_evento_devuelto ?? 0,
                    'cantidad_evento_total' => $cantidadEventoTotal,
                    'cantidad_proveedor_acreedor' => $stock->cantidad_proveedor_acreedor ?? 0,
                    'cantidad_proveedor_devuelto' => $stock->cantidad_proveedor_devuelto ?? 0,
                    'cantidad_proveedor_total' => $cantidadProveedorTotal,
                    'cantidad_total' => ($stock->cantidad_disponible ?? 0) +
                        $cantidadClienteTotal +
                        $cantidadEventoTotal +
                        $cantidadProveedorTotal,
                ];
            });

        // Calcular resumen
        $resumen = [
            'total_disponible' => $items->sum('cantidad_disponible'),
            'total_cliente_deudor' => $items->sum('cantidad_cliente_deudor'),
            'total_cliente_devuelto' => $items->sum('cantidad_cliente_devuelto'),
            'total_cliente' => $items->sum('cantidad_cliente_total'),
            'total_evento_deudor' => $items->sum('cantidad_evento_deudor'),
            'total_evento_devuelto' => $items->sum('cantidad_evento_devuelto'),
            'total_evento' => $items->sum('cantidad_evento_total'),
            'total_proveedor_acreedor' => $items->sum('cantidad_proveedor_acreedor'),
            'total_proveedor_devuelto' => $items->sum('cantidad_proveedor_devuelto'),
            'total_proveedor' => $items->sum('cantidad_proveedor_total'),
            'total_general' => $items->sum('cantidad_total'),
        ];

        // Obtener lista de almacenes para filtros
        $almacenes = AlmacenPrestable::select('id', 'nombre')
            ->orderBy('nombre')
            ->get()
            ->toArray();

        return Inertia::render('prestamos/stock', [
            'items' => $items->values(),
            'resumen' => $resumen,
            'almacenes' => $almacenes,
        ]);
    }

    /**
     * GET /prestamos/stock/clientes
     * Stock de almacenes para clientes (distribuidora)
     */
    public function stockClientes()
    {
        // Obtener almacenes de clientes (es_proveedor = false)
        $almacenesClientes = AlmacenPrestable::where('es_proveedor', false)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        $almacenIds = $almacenesClientes->pluck('id')->toArray();

        // Obtener items de stock de almacenes de clientes
        $items = PrestableStock::whereIn('almacenes_prestables_id', $almacenIds)
            ->with(['prestable', 'almacenPrestable'])
            ->get()
            ->map(function ($stock) {
                $cantidadClienteTotal = ($stock->cantidad_cliente_deudor ?? 0) + ($stock->cantidad_cliente_devuelto ?? 0);
                $cantidadEventoTotal = ($stock->cantidad_evento_deudor ?? 0) + ($stock->cantidad_evento_devuelto ?? 0);

                return [
                    'id' => $stock->id,
                    'prestable_id' => $stock->prestable_id,
                    'prestable_nombre' => $stock->prestable->nombre,
                    'prestable_codigo' => $stock->prestable->codigo,
                    'prestable_tipo' => $stock->prestable->tipo,
                    'almacen_nombre' => $stock->almacenPrestable->nombre,
                    'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                    'cantidad_disponible' => $stock->cantidad_disponible ?? 0,
                    'cantidad_cliente_deudor' => $stock->cantidad_cliente_deudor ?? 0,
                    'cantidad_cliente_devuelto' => $stock->cantidad_cliente_devuelto ?? 0,
                    'cantidad_cliente_total' => $cantidadClienteTotal,
                    'cantidad_evento_deudor' => $stock->cantidad_evento_deudor ?? 0,
                    'cantidad_evento_devuelto' => $stock->cantidad_evento_devuelto ?? 0,
                    'cantidad_evento_total' => $cantidadEventoTotal,
                    'cantidad_total' => ($stock->cantidad_disponible ?? 0) +
                        $cantidadClienteTotal +
                        $cantidadEventoTotal,
                ];
            });

        // Calcular resumen (solo clientes, sin proveedor)
        $resumen = [
            'total_disponible' => $items->sum('cantidad_disponible'),
            'total_cliente_deudor' => $items->sum('cantidad_cliente_deudor'),
            'total_cliente_devuelto' => $items->sum('cantidad_cliente_devuelto'),
            'total_cliente' => $items->sum('cantidad_prestamo_cliente_total'),
            'total_evento_deudor' => $items->sum('cantidad_evento_deudor'),
            'total_evento_devuelto' => $items->sum('cantidad_evento_devuelto'),
            'total_evento' => $items->sum('cantidad_prestamo_evento_total'),
            'total_general' => $items->sum('cantidad_total'),
        ];

        return Inertia::render('prestamos/stock-clientes', [
            'items' => $items->values(),
            'resumen' => $resumen,
            'almacenes' => $almacenesClientes->toArray(),
        ]);
    }

    /**
     * GET /prestamos/stock/proveedores
     * Stock de almacenes de proveedores
     */
    public function stockProveedores()
    {
        // Obtener almacenes de proveedores (es_proveedor = true)
        $almacenesProveedores = AlmacenPrestable::where('es_proveedor', true)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        $almacenIds = $almacenesProveedores->pluck('id')->toArray();

        // Obtener items de stock de almacenes de proveedores
        $items = PrestableStock::whereIn('almacenes_prestables_id', $almacenIds)
            ->with(['prestable', 'almacenPrestable'])
            ->get()
            ->map(function ($stock) {
                $cantidadProveedorTotal = ($stock->cantidad_proveedor_acreedor ?? 0) + ($stock->cantidad_proveedor_devuelto ?? 0);

                return [
                    'id' => $stock->id,
                    'prestable_id' => $stock->prestable_id,
                    'prestable_nombre' => $stock->prestable->nombre,
                    'prestable_codigo' => $stock->prestable->codigo,
                    'prestable_tipo' => $stock->prestable->tipo,
                    'almacen_nombre' => $stock->almacenPrestable->nombre,
                    'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                    'cantidad_disponible' => $stock->cantidad_disponible ?? 0,
                    'cantidad_proveedor_acreedor' => $stock->cantidad_proveedor_acreedor ?? 0,
                    'cantidad_proveedor_devuelto' => $stock->cantidad_proveedor_devuelto ?? 0,
                    'cantidad_proveedor_total' => $cantidadProveedorTotal,
                    'cantidad_total' => ($stock->cantidad_disponible ?? 0) + $cantidadProveedorTotal,
                ];
            });

        // Calcular resumen (solo proveedores, sin clientes/eventos)
        $resumen = [
            'total_disponible' => $items->sum('cantidad_disponible'),
            'total_proveedor_acreedor' => $items->sum('cantidad_proveedor_acreedor'),
            'total_proveedor_devuelto' => $items->sum('cantidad_proveedor_devuelto'),
            'total_proveedor' => $items->sum('cantidad_prestamo_proveedor_total'),
            'total_general' => $items->sum('cantidad_total'),
        ];

        return Inertia::render('prestamos/stock-proveedores', [
            'items' => $items->values(),
            'resumen' => $resumen,
            'almacenes' => $almacenesProveedores->toArray(),
        ]);
    }

    /**
     * GET /prestamos/stock/{tipo}/ajuste
     * Página dedicada para ajustar stock
     */
    public function ajuste($tipo, $prestable_id, $almacen_id)
    {
        // Validar tipo
        if (!in_array($tipo, ['clientes', 'proveedores'])) {
            abort(404);
        }

        // Obtener el item de stock
        $stock = PrestableStock::where('prestable_id', $prestable_id)
            ->where('almacenes_prestables_id', $almacen_id)
            ->with(['prestable', 'almacenPrestable'])
            ->firstOrFail();

        // Construir el item según el tipo
        $item = [
            'id' => $stock->id,
            'prestable_id' => $stock->prestable_id,
            'prestable_nombre' => $stock->prestable->nombre,
            'prestable_codigo' => $stock->prestable->codigo,
            'almacen_nombre' => $stock->almacenPrestable->nombre,
            'cantidad_disponible' => $stock->cantidad_disponible ?? 0,
        ];

        if ($tipo === 'clientes') {
            $item['cantidad_cliente_deudor'] = $stock->cantidad_cliente_deudor ?? 0;
            $item['cantidad_cliente_devuelto'] = $stock->cantidad_cliente_devuelto ?? 0;
            $item['cantidad_evento_deudor'] = $stock->cantidad_evento_deudor ?? 0;
            $item['cantidad_evento_devuelto'] = $stock->cantidad_evento_devuelto ?? 0;
        } else {
            $item['cantidad_proveedor_acreedor'] = $stock->cantidad_proveedor_acreedor ?? 0;
            $item['cantidad_proveedor_devuelto'] = $stock->cantidad_proveedor_devuelto ?? 0;
        }

        return Inertia::render('prestamos/stock/ajuste', [
            'prestable_id' => $prestable_id,
            'almacen_id' => $almacen_id,
            'tipo' => $tipo,
            'item' => $item,
        ]);
    }
}

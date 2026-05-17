<?php

namespace App\Http\Controllers;

use App\Models\StockProducto;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * PublicStockController - Página pública de precios y stock disponible
 *
 * Permite a clientes ver catálogo de precios sin autenticación
 */
class PublicStockController extends Controller
{
    /**
     * Mostrar página pública de precios
     *
     * GET /public/precios
     *
     * @return \Illuminate\View\View
     */
    public function precios()
    {
        try {
            // Obtener stock disponible agrupado por producto
            $stocks = StockProducto::disponible()
                ->with([
                    'producto:id,nombre,sku,descripcion',
                    'producto.precios' => fn($q) => $q->activos()->with('tipoPrecio:id,codigo'),
                    'producto.rangosPrecios' => fn($q) => $q->activos()->vigentes()->with('tipoPrecio:id,codigo'),
                ])
                ->selectRaw('producto_id, SUM(cantidad_disponible) as total_disponible')
                ->groupBy('producto_id')
                ->get();

            // Mapear datos para la vista
            $productos = $stocks->map(function ($s) {
                $p = $s->producto;

                // Obtener TODOS los rangos de precios (cualquier tipo: VENTA, DESCUENTO, ESPECIAL, etc)
                $rangosDB = $p->rangosPrecios()
                    ->with('tipoPrecio:id,codigo,nombre')
                    ->orderBy('cantidad_minima', 'asc')
                    ->get();

                // Agrupar rangos por tipo de precio (VENTA, DESCUENTO, ESPECIAL)
                $rangosPorTipo = [];
                foreach ($rangosDB as $rango) {
                    $tipoCodigo = $rango->tipoPrecio->codigo ?? 'DESCONOCIDO';

                    if (!isset($rangosPorTipo[$tipoCodigo])) {
                        $rangosPorTipo[$tipoCodigo] = [];
                    }

                    // Obtener el precio asociado a este tipo de precio
                    $precio = $p->precios()
                        ->where('tipo_precio_id', $rango->tipo_precio_id)
                        ->where('activo', true)
                        ->first()?->precio;

                    $rangosPorTipo[$tipoCodigo][] = [
                        'rango_texto'      => $this->_formatearRango($rango->cantidad_minima, $rango->cantidad_maxima),
                        'precio'           => (float) $precio ?? 0,
                    ];
                }

                return [
                    'id'                 => $p->id,
                    'nombre'             => $p->nombre,
                    'sku'                => $p->sku ?? '-',
                    'descripcion'        => $p->descripcion,
                    'precio_venta'       => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento'   => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'    => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'rangos_venta'       => $rangosPorTipo['VENTA'] ?? null,
                    'rangos_descuento'   => $rangosPorTipo['DESCUENTO'] ?? null,
                    'rangos_especial'    => $rangosPorTipo['ESPECIAL'] ?? null,
                    'stock_disponible'   => (int) $s->total_disponible,
                ];
            })->sortBy('nombre')->values();

            return view('public.precios', [
                'productos'       => $productos,
                'total_productos' => count($productos),
                'fecha_actualizacion' => now()->format('d/m/Y H:i'),
                'empresa'         => config('app.name', 'Distribuidora Paucara'),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error mostrando página pública de precios', [
                'error' => $e->getMessage(),
            ]);

            return view('public.precios-error', [
                'message' => 'Error cargando catálogo de precios',
            ]);
        }
    }

    /**
     * Mostrar página pública de precios CON STOCK visible
     *
     * GET /public/precios-stock
     *
     * @return \Illuminate\View\View
     */
    public function preciosConStock()
    {
        try {
            // Obtener stock disponible agrupado por producto
            $stocks = StockProducto::disponible()
                ->with([
                    'producto:id,nombre,sku,descripcion',
                    'producto.precios' => fn($q) => $q->activos()->with('tipoPrecio:id,codigo'),
                    'producto.rangosPrecios' => fn($q) => $q->activos()->vigentes()->with('tipoPrecio:id,codigo'),
                ])
                ->selectRaw('producto_id, SUM(cantidad_disponible) as total_disponible')
                ->groupBy('producto_id')
                ->get();

            // Mapear datos para la vista
            $productos = $stocks->map(function ($s) {
                $p = $s->producto;

                // Obtener TODOS los rangos de precios (cualquier tipo: VENTA, DESCUENTO, ESPECIAL, etc)
                $rangosDB = $p->rangosPrecios()
                    ->with('tipoPrecio:id,codigo,nombre')
                    ->orderBy('cantidad_minima', 'asc')
                    ->get();

                // Agrupar rangos por tipo de precio (VENTA, DESCUENTO, ESPECIAL)
                $rangosPorTipo = [];
                foreach ($rangosDB as $rango) {
                    $tipoCodigo = $rango->tipoPrecio->codigo ?? 'DESCONOCIDO';

                    if (!isset($rangosPorTipo[$tipoCodigo])) {
                        $rangosPorTipo[$tipoCodigo] = [];
                    }

                    // Obtener el precio asociado a este tipo de precio
                    $precio = $p->precios()
                        ->where('tipo_precio_id', $rango->tipo_precio_id)
                        ->where('activo', true)
                        ->first()?->precio;

                    $rangosPorTipo[$tipoCodigo][] = [
                        'rango_texto'      => $this->_formatearRango($rango->cantidad_minima, $rango->cantidad_maxima),
                        'precio'           => (float) $precio ?? 0,
                    ];
                }

                return [
                    'id'                 => $p->id,
                    'nombre'             => $p->nombre,
                    'sku'                => $p->sku ?? '-',
                    'descripcion'        => $p->descripcion,
                    'precio_venta'       => $p->obtenerPrecio('VENTA')?->precio ?? $p->obtenerPrecio('VENTA_NORMAL')?->precio,
                    'precio_descuento'   => $p->obtenerPrecio('DESCUENTO')?->precio,
                    'precio_especial'    => $p->obtenerPrecio('ESPECIAL')?->precio,
                    'rangos_venta'       => $rangosPorTipo['VENTA'] ?? null,
                    'rangos_descuento'   => $rangosPorTipo['DESCUENTO'] ?? null,
                    'rangos_especial'    => $rangosPorTipo['ESPECIAL'] ?? null,
                    'stock_disponible'   => (int) $s->total_disponible,
                ];
            })->sortBy('nombre')->values();

            return view('public.precios', [
                'productos'       => $productos,
                'total_productos' => count($productos),
                'fecha_actualizacion' => now()->format('d/m/Y H:i'),
                'empresa'         => config('app.name', 'Distribuidora Paucara'),
                'mostrar_stock'   => true,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error mostrando página pública de precios con stock', [
                'error' => $e->getMessage(),
            ]);

            return view('public.precios-error', [
                'message' => 'Error cargando catálogo de precios',
            ]);
        }
    }

    /**
     * Formatear rango de cantidad para mostrar
     */
    private function _formatearRango($min, $max)
    {
        if ($max === null) {
            return "{$min}+ unidades";
        }
        return "{$min} - {$max} unidades";
    }
}

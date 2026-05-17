<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdicionalesProducto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdicionalesProductoController extends Controller
{
    /**
     * Obtener adicionales de un producto
     */
    public function obtenerPorProducto(Producto $producto): JsonResponse
    {
        $adicionales = $producto->adicionales()
            ->activos()
            ->ordenados()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $adicionales,
        ]);
    }

    /**
     * Crear un nuevo adicional
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio_adicional' => 'required|numeric|min:0',
            'orden' => 'integer|min:0',
        ]);

        // Verificar que el producto es de comida
        $producto = Producto::findOrFail($validated['producto_id']);
        if (!$producto->es_producto_comida) {
            return response()->json([
                'success' => false,
                'message' => 'Este producto no es de comida/helado',
            ], 422);
        }

        $adicional = AdicionalesProducto::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Adicional creado correctamente',
            'data' => $adicional,
        ], 201);
    }

    /**
     * Actualizar un adicional
     */
    public function update(Request $request, AdicionalesProducto $adicional): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'descripcion' => 'nullable|string',
            'precio_adicional' => 'numeric|min:0',
            'orden' => 'integer|min:0',
            'activo' => 'boolean',
        ]);

        $adicional->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Adicional actualizado correctamente',
            'data' => $adicional,
        ]);
    }

    /**
     * Eliminar un adicional
     */
    public function destroy(AdicionalesProducto $adicional): JsonResponse
    {
        $adicional->delete();

        return response()->json([
            'success' => true,
            'message' => 'Adicional eliminado correctamente',
        ]);
    }

    /**
     * Obtener productos de comida con precios correctos
     */
    public function productosComida(): JsonResponse
    {
        $productos = Producto::where('es_producto_comida', true)
            ->where('activo', true)
            ->with([
                'adicionales' => function($q) {
                    $q->activos()->ordenados();
                },
                'precios' => function($q) {
                    // Cargar precios activos con su tipo de precio
                    $q->where('activo', true)
                        ->with('tipoPrecio');
                },
                'imagenes' => function($q) {
                    // Cargar imagen principal (es_principal = true) o la primera si no existe
                    $q->orderBy('es_principal', 'desc')->orderBy('orden');
                }
            ])
            ->get(['id', 'nombre', 'descripcion', 'precio_venta', 'es_producto_comida']); // ✨ Incluir precio_venta como fallback

        // Mapear productos para incluir el precio de VENTA correcto
        $productosFormatted = $productos->map(function($producto) {
            // Buscar el precio de tipo VENTA (el que NO es precio base)
            $precioVenta = $producto->precios
                ->filter(function($p) {
                    return $p->tipoPrecio && !$p->tipoPrecio->es_precio_base; // Es precio de venta (no base/costo)
                })
                ->first();

            // Usar campo 'precio' de precios_producto, o fallback al precio_venta del modelo
            $montoVenta = 0;
            if ($precioVenta && $precioVenta->precio !== null) {
                $montoVenta = (float) $precioVenta->precio; // ✅ Campo correcto: 'precio' no 'monto'
            } else {
                // ⚠️ FALLBACK: Si no hay precio en precios_producto, usar precio_venta del modelo
                $montoVenta = (float) ($producto->precio_venta ?? 0);
            }

            // Obtener imagen principal o primera disponible
            $imagenPrincipal = $producto->imagenes->isNotEmpty() ? $producto->imagenes[0]->url : null;

            return [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'precio_venta' => $montoVenta,
                'es_producto_comida' => $producto->es_producto_comida,
                'imagen_url' => $imagenPrincipal,
                'adicionales' => $producto->adicionales,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $productosFormatted,
        ]);
    }
}

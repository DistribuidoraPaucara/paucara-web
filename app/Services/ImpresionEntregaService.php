<?php

namespace App\Services;

use App\Models\Entrega;
use Illuminate\Support\Collection;

class ImpresionEntregaService
{
    /**
     * Obtener lista genérica de productos de una entrega
     * Consolida todos los productos de todas las ventas asignadas
     * Reutilizable para diferentes frontends
     */
    public function obtenerProductosGenerico(Entrega $entrega): Collection
    {
        $productos = collect();

        // Recorrer todas las ventas asignadas a la entrega
        foreach ($entrega->ventas as $venta) {
            foreach ($venta->detalles as $detalle) {
                // ✅ NUEVO (2026-04-23): Obtener componentes del combo si es combo
                $esCombo = $detalle->producto->es_combo === true || $detalle->producto->es_combo === 1;
                $componentes = [];

                if ($esCombo && $detalle->producto->comboItems && $detalle->producto->comboItems->count() > 0) {
                    foreach ($detalle->producto->comboItems as $comboItem) {
                        $cantidadComponente = $detalle->cantidad * $comboItem->cantidad;
                        $componentes[] = [
                            'producto_nombre' => $comboItem->producto->nombre,
                            'cantidad' => $cantidadComponente,
                            'unidad' => $comboItem->producto->unidad?->nombre ?? 'UND',
                        ];
                    }
                }

                // ✅ MEJORADO (2026-04-24): Si es un combo, agregar también los productos individuales
                // para que se agrupen correctamente con sus contrapartes no-combo
                if ($esCombo && !empty($componentes)) {
                    // Agregar el combo como referencia
                    $productos->push([
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'cliente_id' => $venta->cliente_id,
                        'cliente_nombre' => $venta->cliente?->nombre ?? 'Sin cliente',
                        'producto_id' => $detalle->producto_id,
                        'producto_nombre' => $detalle->producto?->nombre ?? 'Producto desconocido',
                        'codigo_producto' => $detalle->producto?->codigo ?? '',
                        'cantidad' => $detalle->cantidad,
                        'precio_unitario' => $detalle->precio_unitario,
                        'subtotal' => $detalle->subtotal,
                        'unidad_medida' => $detalle->producto?->unidad?->nombre ?? 'UND',
                        'es_combo' => $esCombo,
                        'componentes' => $componentes,
                        'es_de_combo' => false, // Indicar que este es el combo en sí
                    ]);

                    // ✅ NUEVO: Agregar también los productos individuales del combo
                    // Esto permite que se agrupen con sus contrapartes no-combo
                    foreach ($detalle->producto->comboItems as $comboItem) {
                        $cantidadProductoCombo = $detalle->cantidad * $comboItem->cantidad;

                        $productos->push([
                            'venta_id' => $venta->id,
                            'venta_numero' => $venta->numero,
                            'cliente_id' => $venta->cliente_id,
                            'cliente_nombre' => $venta->cliente?->nombre ?? 'Sin cliente',
                            'producto_id' => $comboItem->producto_id,  // ← Usar el ID del producto individual
                            'producto_nombre' => $comboItem->producto?->nombre ?? 'Producto desconocido',
                            'codigo_producto' => $comboItem->producto?->codigo ?? '',
                            'cantidad' => $cantidadProductoCombo,
                            'precio_unitario' => 0,  // No mostrar precio unitario para items de combo
                            'subtotal' => 0,  // No mostrar subtotal para items de combo (ya se cuenta en el combo)
                            'unidad_medida' => $comboItem->producto?->unidad?->nombre ?? 'UND',
                            'es_combo' => false,  // Este es un producto individual
                            'componentes' => [],
                            'es_de_combo' => true,  // ← Indicar que proviene del combo
                            'combo_padre_id' => $detalle->producto_id,  // ← Referencia al combo padre
                            'combo_padre_nombre' => $detalle->producto?->nombre,
                        ]);
                    }
                } else {
                    // Producto normal (no es combo)
                    $productos->push([
                        'venta_id' => $venta->id,
                        'venta_numero' => $venta->numero,
                        'cliente_id' => $venta->cliente_id,
                        'cliente_nombre' => $venta->cliente?->nombre ?? 'Sin cliente',  // ✅ FIX: Null-safe operator
                        'producto_id' => $detalle->producto_id,
                        'producto_nombre' => $detalle->producto?->nombre ?? 'Producto desconocido',  // ✅ FIX: Null-safe operator
                        'codigo_producto' => $detalle->producto?->codigo ?? '',  // ✅ FIX: Null-safe operator
                        'cantidad' => $detalle->cantidad,
                        'precio_unitario' => $detalle->precio_unitario,
                        'subtotal' => $detalle->subtotal,
                        'unidad_medida' => $detalle->producto?->unidad?->nombre ?? 'UND',  // ✅ CORREGIDO: unidad (no unidadMedida)
                        'es_combo' => $esCombo,  // ✅ NUEVO: Indicar si es combo
                        'componentes' => $componentes,  // ✅ NUEVO: Lista de componentes del combo
                        'es_de_combo' => false,  // ← Indicar que NO proviene de un combo
                    ]);
                }
            }
        }

        return $productos;
    }

    /**
     * Obtener productos agrupados por producto (consolida cantidades del mismo producto)
     * Útil para listas resumidas
     */
    public function obtenerProductosAgrupados(Entrega $entrega): Collection
    {
        $productosGenerico = $this->obtenerProductosGenerico($entrega);

        // ✅ MEJORADO (2026-04-24): Filtrar para NO incluir combos como línea separada
        // Si un combo fue expandido a sus componentes, no mostrar el combo en sí
        // Solo mostrar los productos individuales que se agruparon correctamente
        $productosParaAgrupar = $productosGenerico->filter(function ($item) {
            // Excluir los combos que ya fueron expandidos (es_combo = true y es_de_combo = false)
            // Mantener solo los productos individuales (es_de_combo = true) o productos normales (es_combo = false y es_de_combo = false)
            return !($item['es_combo'] === true && ($item['es_de_combo'] ?? false) === false);
        });

        // Agrupar por producto_id
        return $productosParaAgrupar->groupBy('producto_id')->map(function ($items, $productoId) {
            $primerItem = $items->first();

            // ✅ NUEVO (2026-04-23): Preservar información de combo y componentes del primer item
            // Ya que todos los items del mismo producto_id tendrán los mismos componentes
            return [
                'producto_id' => $productoId,
                'producto_nombre' => $primerItem['producto_nombre'],
                'codigo_producto' => $primerItem['codigo_producto'],
                'unidad_medida' => $primerItem['unidad_medida'],
                'cantidad_total' => $items->sum('cantidad'),
                'precio_unitario' => $primerItem['precio_unitario'],
                'subtotal_total' => $items->sum('subtotal'),  // Suma solo de productos normales
                'cantidad_ventas' => $items->count(), // Cuántos items de este producto hay en la entrega
                'ventas' => $items->pluck('venta_numero')->unique()->join(', '),
                'es_combo' => $primerItem['es_combo'],  // ✅ NUEVO: Indicar si es combo
                'componentes' => $primerItem['componentes'],  // ✅ NUEVO: Componentes del combo
                'proviene_de_combo' => collect($items)->some(fn($i) => ($i['es_de_combo'] ?? false) === true),  // ✅ Indicar si alguna cantidad vino del combo
            ];
        })->values();
    }

    /**
     * Obtener productos agrupados por cliente
     * Útil para saber qué le corresponde a cada cliente
     */
    public function obtenerProductosPorCliente(Entrega $entrega): Collection
    {
        $productosGenerico = $this->obtenerProductosGenerico($entrega);

        return $productosGenerico->groupBy('cliente_id')->map(function ($items, $clienteId) {
            $primerItem = $items->first();

            return [
                'cliente_id' => $clienteId,
                'cliente_nombre' => $primerItem['cliente_nombre'],
                'productos' => $items->map(function ($item) {
                    return [
                        'producto_nombre' => $item['producto_nombre'],
                        'codigo_producto' => $item['codigo_producto'],
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio_unitario'],
                        'subtotal' => $item['subtotal'],
                        'venta_numero' => $item['venta_numero'],
                    ];
                })->values(),
                'cantidad_total_productos' => $items->sum('cantidad'),
                'subtotal_total' => $items->sum('subtotal'),
            ];
        })->values();
    }

    /**
     * Obtener estadísticas de la entrega
     */
    public function obtenerEstadisticas(Entrega $entrega): array
    {
        $productosGenerico = $this->obtenerProductosGenerico($entrega);

        return [
            'total_productos' => $productosGenerico->count(),
            'total_items_unicos' => $productosGenerico->groupBy('producto_id')->count(),
            'total_cantidad' => $productosGenerico->sum('cantidad'),
            'total_subtotal' => $productosGenerico->sum('subtotal'),
            'total_clientes' => $entrega->ventas->pluck('cliente_id')->unique()->count(),
            'total_ventas' => $entrega->ventas->count(),
        ];
    }
}

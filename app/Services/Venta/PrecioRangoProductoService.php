<?php
namespace App\Services\Venta;

use App\Models\Precio;
use App\Models\PrecioRangoCantidadProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use Illuminate\Support\Facades\Log;

class PrecioRangoProductoService
{
    /**
     * Calcular precio unitario de un producto considerando rango de cantidad
     */
    public function calcularPrecioUnitario(
        Producto $producto,
        int $cantidad,
        ?int $empresaId = null
    ): ?float {
        $empresaId = $empresaId ?? auth()->user()?->empresa_id ?? 1;

        return $producto->obtenerPrecioConRango($cantidad, $empresaId);
    }

    /**
     * Calcular información completa de precio: unitario, subtotal, rango, ahorro
     */
    public function calcularPrecioCompleto(
        Producto $producto,
        int $cantidad,
        ?int $empresaId = null
    ): array {
        return $producto->obtenerPrecioConDetallesRango($cantidad, $empresaId);
    }

    /**
     * Calcular todos los items del carrito con sus precios por rango
     *
     * RESPUESTA MEJORADA (FASE 2 - OPCIÓN 1):
     * ✅ Respeta tipo_precio_id del request si viene
     * ✅ Si hay rango aplicado, usa el tipo_precio_id del rango
     * ✅ Si no hay rango y no viene tipo_precio_id, devuelve null
     * ✅ Calcula ahorro total disponible del carrito
     * ✅ Mantiene compatibilidad con rango_aplicado
     */
    public function calcularCarrito(
        array $items,
        ?int $empresaId = null
    ): array {
        $empresaId             = $empresaId ?? auth()->user()?->empresa_id ?? 1;
        $detalles              = [];
        $totalGeneral          = 0;
        $ahorroTotalDisponible = 0;

        foreach ($items as $item) {
            // Buscar producto ACTIVO (con scope)
            $producto = Producto::activos()->find($item['producto_id']);

            if (! $producto) {
                // El producto no existe o está inactivo
                Log::warning("Producto {$item['producto_id']} no encontrado o inactivo en calcularCarrito");
                continue;
            }

            $cantidad = (int) $item['cantidad'];
            $tipoPrecioIdDelRequest = $item['tipo_precio_id'] ?? null; // ✅ NUEVO: Obtener tipo_precio_id del request

            // ✅ NUEVO: Log detallado del cálculo
            Log::info('💰 [calcularCarrito] Procesando producto', [
                'producto_id' => $producto->id,
                'producto_nombre' => $producto->nombre,
                'cantidad' => $cantidad,
            ]);

            // ✅ VALIDAR LÍMITE DE VENTA
            if ($producto->limite_venta && $cantidad > $producto->limite_venta) {
                Log::warning(
                    "Cantidad excede límite de venta",
                    [
                        'producto_id'         => $producto->id,
                        'cantidad_solicitada' => $cantidad,
                        'limite_venta'        => $producto->limite_venta,
                    ]
                );
                throw new \InvalidArgumentException(
                    "El producto '{$producto->nombre}' tiene un límite máximo de venta de {$producto->limite_venta} unidades. "
                    . "Cantidad solicitada: {$cantidad}."
                );
            }

            $precioInfo = $this->calcularPrecioCompleto($producto, $cantidad, $empresaId);

            // 🔑 OPCIÓN 2: SOLO respetar tipo_precio_id cuando hay rango aplicado
            // Si NO hay rango → devolver null para forzar frontend a usar tipo_recomendado
            // Esto garantiza que cantidad↓ por debajo de rango mínimo → revierte a precio default
            if ($precioInfo['rango_aplicado']) {
                $tipoPrecioId     = $precioInfo['rango_aplicado']['tipo_precio_id'];
                $tipoPrecioNombre = $precioInfo['rango_aplicado']['tipo_precio_nombre'];
                Log::info('✅ [calcularCarrito] Rango aplicado', [
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'rango' => $precioInfo['rango_aplicado'],
                    'tipo_precio_id' => $tipoPrecioId,
                    'tipo_precio_nombre' => $tipoPrecioNombre,
                    'precio_unitario' => $precioInfo['precio_unitario'],
                ]);
            } else {
                // ✅ FIX (2026-02-17): Sin rango → SIEMPRE devolver null
                // No respetamos tipo_precio_id del request si no hay rango que lo justifique
                // Frontend usará tipo_precio_id_recomendado (cliente-appropriate default)
                $tipoPrecioId     = null;
                $tipoPrecioNombre = null;

                Log::info('⚠️ [calcularCarrito] Sin rango aplicado - devolviendo null (revertir a tipo_recomendado)', [
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'tipo_precio_id_del_request' => $tipoPrecioIdDelRequest,
                    'precio_unitario' => $precioInfo['precio_unitario'],
                ]);
            }

            $detalle = [
                // ✅ DATOS PRINCIPALES
                'producto_id'        => $producto->id,
                'producto_nombre'    => $producto->nombre,
                'producto_sku'       => $producto->sku,
                'cantidad'           => $cantidad,

                // 🔑 NUEVO: Tipo de precio en nivel superior (fácil acceso)
                'tipo_precio_id'     => $tipoPrecioId,
                'tipo_precio_nombre' => $tipoPrecioNombre,

                // PRECIOS
                'precio_unitario'    => $precioInfo['precio_unitario'],
                'subtotal'           => $precioInfo['subtotal'],

                // INFORMACIÓN DE RANGOS
                'rango_aplicado'     => $precioInfo['rango_aplicado'],
                'proximo_rango'      => $precioInfo['proximo_rango'],
                'ahorro_proximo'     => $precioInfo['ahorro_proximo'],
            ];

            $detalles[] = $detalle;

            // Acumular totales
            $totalGeneral += $precioInfo['subtotal'];
            if ($precioInfo['ahorro_proximo']) {
                $ahorroTotalDisponible += $precioInfo['ahorro_proximo'];
            }
        }

        // ✅ NUEVO: Log final del carrito calculado
        Log::info('📊 [calcularCarrito] Carrito calculado correctamente', [
            'cantidad_items' => count($detalles),
            'subtotal' => $totalGeneral,
            'ahorro_disponible' => $ahorroTotalDisponible,
            'detalles' => $detalles,
        ]);

        return [
            'detalles'                => $detalles,
            'subtotal'                => $totalGeneral,
            'total'                   => $totalGeneral, // Alias para compatibilidad
            'cantidad_items'          => count($detalles),

            // 🔑 NUEVO: Ahorro disponible del carrito completo
            'ahorro_disponible'       => $ahorroTotalDisponible,
            'tiene_ahorro_disponible' => $ahorroTotalDisponible > 0,
        ];
    }

    /**
     * Obtener todos los rangos configurados para un producto
     */
    public function obtenerRangosProducto(
        Producto $producto,
        ?int $empresaId = null
    ): \Illuminate\Database\Eloquent\Collection {
        $empresaId = $empresaId ?? auth()->user()?->empresa_id ?? 1;

        return $producto->obtenerRangosActivos($empresaId);
    }

    /**
     * Crear un nuevo rango de precio para un producto
     */
    public function crearRango(
        Producto $producto,
        int $cantidadMinima,
        ?int $cantidadMaxima,
        TipoPrecio $tipoPrecio,
        ?int $empresaId = null,
        ? \DateTime $fechaVigenciaInicio = null,
        ? \DateTime $fechaVigenciaFin = null
    ) : PrecioRangoCantidadProducto {
        $empresaId = $empresaId ?? auth()->user()?->empresa_id ?? 1;

        // Validar que no exista solapamiento
        if (! PrecioRangoCantidadProducto::validarNoSolapamiento(
            $empresaId,
            $producto->id,
            $cantidadMinima,
            $cantidadMaxima
        )) {
            throw new \InvalidArgumentException(
                "El rango [{$cantidadMinima}-{$cantidadMaxima}] se superpone con rangos existentes"
            );
        }

        // Validar que exista precio para el tipo especificado
        $precioProducto = $producto->obtenerPrecio($tipoPrecio->id);
        if (! $precioProducto) {
            throw new \InvalidArgumentException(
                "El producto no tiene precio configurado para el tipo: {$tipoPrecio->nombre}"
            );
        }

        return PrecioRangoCantidadProducto::create([
            'empresa_id'            => $empresaId,
            'producto_id'           => $producto->id,
            'tipo_precio_id'        => $tipoPrecio->id,
            'cantidad_minima'       => $cantidadMinima,
            'cantidad_maxima'       => $cantidadMaxima,
            'fecha_vigencia_inicio' => $fechaVigenciaInicio,
            'fecha_vigencia_fin'    => $fechaVigenciaFin,
            'activo'                => true,
        ]);
    }

    /**
     * Actualizar un rango de precio existente
     */
    public function actualizarRango(
        PrecioRangoCantidadProducto $rango,
        array $datos = []
    ) : PrecioRangoCantidadProducto {
        $cantidadMinima = $datos['cantidad_minima'] ?? $rango->cantidad_minima;
        $cantidadMaxima = $datos['cantidad_maxima'] ?? $rango->cantidad_maxima;

        // Validar que no exista solapamiento (excluyendo el rango actual)
        if (! PrecioRangoCantidadProducto::validarNoSolapamiento(
            $rango->empresa_id,
            $rango->producto_id,
            $cantidadMinima,
            $cantidadMaxima,
            $rango->id
        )) {
            throw new \InvalidArgumentException(
                "El rango [{$cantidadMinima}-{$cantidadMaxima}] se superpone con rangos existentes"
            );
        }

        $rango->update($datos);

        return $rango->fresh();
    }

    /**
     * Desactivar un rango de precio
     */
    public function desactivarRango(PrecioRangoCantidadProducto $rango): bool
    {
        return $rango->update(['activo' => false]);
    }

    /**
     * Eliminar un rango de precio (eliminación real)
     */
    public function eliminarRango(PrecioRangoCantidadProducto $rango): bool
    {
        return $rango->delete();
    }

    /**
     * Validar que los rangos de un producto no tengan solapamientos
     */
    public function validarIntegridad(
        Producto $producto,
        ?int $empresaId = null
    ): array {
        $empresaId = $empresaId ?? auth()->user()?->empresa_id ?? 1;
        $rangos    = $producto->rangosPrecios()
            ->where('empresa_id', $empresaId)
            ->activos()
            ->orderBy('cantidad_minima', 'asc')
            ->get();

        $problemas = [];

        foreach ($rangos as $i => $rango) {
            // Validar que cantidad_minima sea mayor a 0
            if ($rango->cantidad_minima <= 0) {
                $problemas[] = "Rango #{$rango->id}: cantidad_minima debe ser > 0";
            }

            // Validar que cantidad_maxima (si existe) sea >= cantidad_minima
            if ($rango->cantidad_maxima && $rango->cantidad_maxima < $rango->cantidad_minima) {
                $problemas[] = "Rango #{$rango->id}: cantidad_maxima ({$rango->cantidad_maxima}) < cantidad_minima ({$rango->cantidad_minima})";
            }

            // Validar continuidad entre rangos consecutivos
            if ($i < count($rangos) - 1) {
                $rangoSiguiente = $rangos[$i + 1];

                if ($rango->cantidad_maxima) {
                    $esperadoMin = $rango->cantidad_maxima + 1;
                    if ($rangoSiguiente->cantidad_minima !== $esperadoMin) {
                        $problemas[] = "Rango #{$rango->id} a #{$rangoSiguiente->id}: gap entre {$rango->cantidad_maxima} y {$rangoSiguiente->cantidad_minima}";
                    }
                }
            }
        }

        return [
            'es_valido'       => empty($problemas),
            'problemas'       => $problemas,
            'cantidad_rangos' => count($rangos),
        ];
    }

    /**
     * Obtener resumen de rangos para visualización
     */
    public function obtenerResumenRangos(
        Producto $producto,
        ?int $empresaId = null
    ): array {
        $empresaId = $empresaId ?? auth()->user()?->empresa_id ?? 1;
        $rangos    = $this->obtenerRangosProducto($producto, $empresaId);

        return $rangos->map(function ($rango) {
            $precio = $rango->producto->obtenerPrecio($rango->tipo_precio_id);

            return [
                'id'              => $rango->id,
                'cantidad_minima' => $rango->cantidad_minima,
                'cantidad_maxima' => $rango->cantidad_maxima,
                'rango_texto'     => $rango->cantidad_maxima
                    ? "{$rango->cantidad_minima}-{$rango->cantidad_maxima}"
                    : "{$rango->cantidad_minima}+",
                'tipo_precio'     => [
                    'id'     => $rango->tipoPrecio->id,
                    'nombre' => $rango->tipoPrecio->nombre,
                    'codigo' => $rango->tipoPrecio->codigo,
                ],
                'precio_unitario' => $precio?->precio,
                'activo'          => $rango->activo,
                'vigente'         => now()->between(
                    $rango->fecha_vigencia_inicio ?? now()->subYear(),
                    $rango->fecha_vigencia_fin ?? now()->addYear()
                ),
            ];
        })->toArray();
    }
}

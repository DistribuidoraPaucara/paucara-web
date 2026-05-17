<?php
namespace App\Http\Controllers;

use App\Models\DetalleCompra;
use App\Models\EstadoDocumento;
use App\Models\HistorialPrecio;
use App\Models\PrecioProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PrecioController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:precios.index')->only('index');
        $this->middleware('permission:precios.update')->only('update');
    }

    /**
     * Página principal de gestión de precios - Vista web
     * GET /precios
     */
    public function index(Request $request)
    {
        // Filtros validados
        $filtros = $request->validate([
            'q'              => ['nullable', 'string', 'max:255'],
            'tipo_precio_id' => ['nullable', 'exists:tipos_precio,id'],
            'ordenar_por'    => ['nullable', 'string', 'in:producto,tipo_precio,cambio_reciente,precio'],
            'per_page'       => ['nullable', 'integer', 'min:10', 'max:100'],
        ]);

        // Obtener datos usando el método compartido
        $productos = $this->obtenerProductosConPrecios($filtros);

        // Transformar datos para asegurar que las relaciones se serialicen correctamente
        $productosTransformados = $productos->map(function ($producto) {
            return $this->transformarProducto($producto);
        })->toArray();

        return Inertia::render('precios/index', [
            'productos'    => [
                'data'  => $productosTransformados,
                'links' => $productos->links()->render(),
            ],
            'filtros'      => $filtros,
            'tipos_precio' => TipoPrecio::where('activo', true)
                ->orderBy('orden')
                ->get(['id', 'codigo', 'nombre', 'color', 'es_ganancia']),
        ]);
    }

    /**
     * API: Listar precios con filtros - Retorna JSON
     * GET /api/precios
     */
    public function listadoApi(Request $request)
    {
        $filtros = $request->validate([
            'q'              => ['nullable', 'string', 'max:255'],
            'tipo_precio_id' => ['nullable', 'exists:tipos_precio,id'],
            'ordenar_por'    => ['nullable', 'string', 'in:producto,tipo_precio,cambio_reciente,precio'],
            'per_page'       => ['nullable', 'integer', 'min:10', 'max:100'],
            'page'           => ['nullable', 'integer', 'min:1'],
        ]);

        $productos = $this->obtenerProductosConPrecios($filtros);

        $productosTransformados = $productos->map(function ($producto) {
            return $this->transformarProducto($producto);
        });

        return response()->json([
            'data'         => $productosTransformados,
            'links'        => $productos->links(),
            'current_page' => $productos->currentPage(),
            'per_page'     => $productos->perPage(),
            'total'        => $productos->total(),
            'last_page'    => $productos->lastPage(),
        ]);
    }

    /**
     * Método compartido para obtener productos con precios según filtros
     */
    private function obtenerProductosConPrecios($filtros)
    {
        $query = Producto::with([
            'precios' => function ($q) {
                $q->where('activo', true)
                    ->with('tipoPrecio')
                    ->with(['historialPrecios' => function ($q2) {
                        $q2->latest('fecha_cambio')->limit(3);
                    }]);
            },
            'categoria:id,nombre',
        ])
            ->where('activo', true);

        // Búsqueda por nombre o SKU
        if (! empty($filtros['q'])) {
            $termino = $filtros['q'];
            $query->where(function ($q) use ($termino) {
                $q->where('nombre', 'ilike', "%{$termino}%")
                    ->orWhere('sku', 'ilike', "%{$termino}%");
            });
        }

        // Filtrar por tipo de precio
        if (! empty($filtros['tipo_precio_id'])) {
            $query->whereHas('precios', function ($q) use ($filtros) {
                $q->where('tipo_precio_id', $filtros['tipo_precio_id']);
            });
        }

        // Ordenamiento
        $ordenar_por = $filtros['ordenar_por'] ?? 'producto';
        switch ($ordenar_por) {
            case 'cambio_reciente':
                $query->orderBy('updated_at', 'desc');
                break;
            case 'precio':
                // Se ordena en memoria después
                break;
            default:
                $query->orderBy('nombre', 'asc');
        }

        $perPage = $filtros['per_page'] ?? 20;
        return $query->paginate($perPage);
    }

    /**
     * Detectar si el precio de costo fue actualizado recientemente
     */
    private function detectarCostoCambiadoReciente($producto, int $dias = 7): bool
    {
        $precioCosto = $producto->precios
            ->firstWhere('tipoPrecio.codigo', 'COSTO');

        if (! $precioCosto) {
            return false;
        }

        return $precioCosto->fueActualizadoRecientemente($dias);
    }

    /**
     * Detectar si el producto tiene diferencia de costo en compras
     * Compara el precio_unitario de compras con el precio COSTO actual
     */
    private function detectarDiferenciaCostoEnCompra($producto): bool
    {
        // Obtener el precio de costo actual
        $precioCosto = $producto->precios
            ->firstWhere('tipoPrecio.codigo', 'COSTO');

        if (! $precioCosto) {
            return false;
        }

        $costroActual = (float) $precioCosto->precio;

        // Obtener IDs de estados que NO son finales (excluir ANULADO y CANCELADO)
        $estadosValidos = EstadoDocumento::whereIn('codigo', ['BORRADOR', 'PENDIENTE', 'APROBADO', 'FACTURADO'])
            ->pluck('id')
            ->toArray();

        // Buscar detalles de compra de este producto
        $diferencias = DetalleCompra::where('producto_id', $producto->id)
            ->with(['compra' => function ($q) use ($estadosValidos) {
                // Solo compras en estados válidos (no anuladas ni canceladas)
                $q->whereIn('estado_documento_id', $estadosValidos);
            }])
            ->get()
            ->filter(function ($detalle) {
                // Solo contar si la compra existe
                return $detalle->compra !== null;
            })
            ->some(function ($detalle) use ($costroActual) {
                $precioCompra = (float) $detalle->precio_unitario;
                // Retorna true si hay diferencia (mayor a 0.01 para evitar redondeos)
                return abs($costroActual - $precioCompra) > 0.01;
            });

        return $diferencias;
    }

    /**
     * Método compartido para transformar un producto para la API
     */
    private function transformarProducto($producto)
    {
        $costoCambiadoReciente        = $this->detectarCostoCambiadoReciente($producto);
        $tieneDiferenciaCostoEnCompra = $this->detectarDiferenciaCostoEnCompra($producto);

        return [
            'id'                               => $producto->id,
            'nombre'                           => $producto->nombre,
            'sku'                              => $producto->sku,
            'categoria'                        => $producto->categoria ? [
                'id'     => $producto->categoria->id,
                'nombre' => $producto->categoria->nombre,
            ] : null,
            'costo_cambio_reciente'            => $costoCambiadoReciente,
            'tiene_diferencia_costo_en_compra' => $tieneDiferenciaCostoEnCompra,
            'precios'                          => $producto->precios->map(function ($precio) use ($costoCambiadoReciente) {
                $actualizadoReciente = $precio->fueActualizadoRecientemente();
                $esCosto             = $precio->tipoPrecio && $precio->tipoPrecio->codigo === 'COSTO';

                return [
                    'id'                        => $precio->id,
                    'tipo_precio_id'            => $precio->tipo_precio_id,
                    'precio_actual'             => (float) $precio->precio,
                    'margen_ganancia'           => (float) $precio->margen_ganancia,
                    'porcentaje_ganancia'       => (float) $precio->porcentaje_ganancia,
                    'motivo_cambio'             => $precio->motivo_cambio,
                    'updated_at'                => $precio->updated_at,
                    'actualizado_recientemente' => $actualizadoReciente,
                    'requiere_revision'         => $costoCambiadoReciente && ! $esCosto && ! $actualizadoReciente,
                    'tipo'                      => $precio->tipoPrecio ? [
                        'id'          => $precio->tipoPrecio->id,
                        'codigo'      => $precio->tipoPrecio->codigo,
                        'nombre'      => $precio->tipoPrecio->nombre,
                        'color'       => $precio->tipoPrecio->color,
                        'es_ganancia' => $precio->tipoPrecio->es_ganancia,
                    ] : null,
                    'historial'                 => $precio->historialPrecios->map(function ($h) {
                        return [
                            'id'                => $h->id,
                            'valor_anterior'    => (float) $h->valor_anterior,
                            'valor_nuevo'       => (float) $h->valor_nuevo,
                            'porcentaje_cambio' => (float) $h->porcentaje_cambio,
                            'motivo'            => $h->motivo,
                            'usuario'           => $h->usuario,
                            'fecha_cambio'      => $h->fecha_cambio,
                        ];
                    })->toArray(),
                ];
            })->toArray(),
        ];
    }

    /**
     * API: Obtener precios de un producto con historial completo
     * GET /api/precios/producto/{id}
     */
    public function mostrarProducto(Producto $producto)
    {
        $producto->load([
            'precios' => function ($q) {
                $q->where('activo', true)
                    ->with('tipoPrecio')
                    ->with(['historialPrecios' => function ($q2) {
                        $q2->latest('fecha_cambio')->limit(15);
                    }]);
            },
        ]);

        return response()->json([
            'producto' => $producto,
            'precios'  => $producto->precios->map(function ($precio) {
                return [
                    'id'                  => $precio->id,
                    'tipo_precio_id'      => $precio->tipo_precio_id,
                    'tipo'                => $precio->tipoPrecio,
                    'precio_actual'       => (float) $precio->precio,
                    'margen_ganancia'     => (float) $precio->margen_ganancia,
                    'porcentaje_ganancia' => (float) $precio->porcentaje_ganancia,
                    'motivo_cambio'       => $precio->motivo_cambio,
                    'updated_at'          => $precio->updated_at,
                    'historial'           => $precio->historialPrecios,
                ];
            }),
        ]);
    }

    /**
     * API: Actualizar precio de venta manualmente
     * PUT /api/precios/{precio_id}
     */
    public function update(Request $request, PrecioProducto $precio)
    {
        $validated = $request->validate([
            'precio_nuevo' => ['required', 'numeric', 'min:0'],
            'motivo'       => ['required', 'string', 'max:500'],
        ]);

        try {
            // Actualizar precio (registra automáticamente en historial)
            $precio->actualizarPrecio(
                (float) $validated['precio_nuevo'],
                $validated['motivo'],
                Auth::user()->name
            );

            return response()->json([
                'success' => true,
                'message' => 'Precio actualizado correctamente',
                'precio'  => $precio->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar precio: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * API: Obtener historial completo de un precio
     * GET /api/precios/{precio_id}/historial
     */
    public function historial(PrecioProducto $precio)
    {
        $historial = $precio->historialPrecios()
            ->with('tipoPrecio')
            ->latest('fecha_cambio')
            ->paginate(50);

        return response()->json([
            'precio_actual' => (float) $precio->precio,
            'tipo_precio'   => $precio->tipoPrecio,
            'producto'      => $precio->producto,
            'historial'     => $historial,
        ]);
    }

    /**
     * API: Obtener todos los cambios de precios recientes
     * GET /api/precios/resumen/cambios-recientes
     */
    public function cambiosRecientes(Request $request)
    {
        $dias = $request->query('dias', 7);

        $cambios = HistorialPrecio::with([
            'precioProducto' => function ($q) {
                $q->with('producto');
            },
            'tipoPrecio',
        ])
            ->whereNotNull('tipo_precio_id')
            ->where('fecha_cambio', '>=', now()->subDays($dias))
            ->latest('fecha_cambio')
            ->paginate(50);

        return response()->json([
            'dias'    => $dias,
            'total'   => $cambios->total(),
            'cambios' => $cambios,
        ]);
    }

    /**
     * API: Resumen de precios que necesitan revisión
     * GET /api/precios/resumen
     */
    public function resumen()
    {
        // Últimos cambios de costo en 7 días
        $ultimosCambios = HistorialPrecio::with([
            'precioProducto' => function ($q) {
                $q->with('producto');
            },
            'tipoPrecio',
        ])
            ->whereNotNull('tipo_precio_id')
            ->where('fecha_cambio', '>=', now()->subDays(7))
            ->latest('fecha_cambio')
            ->limit(50)
            ->get();

        $productosAlerta = Producto::with([
            'precios' => function ($q) {
                $q->where('activo', true);
            },
        ])
            ->where('activo', true)
            ->get()
            ->filter(function ($producto) {
                // Mostrar productos que tengan margen bajo
                return $producto->precios->some(function ($precio) {
                    return $precio->porcentaje_ganancia < 10; // Margen menor a 10%
                });
            })
            ->take(20);

        return response()->json([
            'total_cambios_7dias' => $ultimosCambios->count(),
            'cambios_recientes'   => $ultimosCambios,
            'productos_alerta'    => $productosAlerta,
        ]);
    }

    /**
     * API: Obtener compras donde el precio de costo es diferente
     * GET /api/precios/{producto_id}/compras-diferencia-costo
     */
    public function obtenerComprasConDiferenciaCosto($productoId)
    {
        \Log::info('📥 obtenerComprasConDiferenciaCosto iniciado', ['producto_id' => $productoId]);

        $producto = Producto::with('precios')->findOrFail($productoId);

        // Obtener precio de costo actual
        $precioCosto = $producto->precios
            ->firstWhere('tipoPrecio.codigo', 'COSTO');

        if (! $precioCosto) {
            \Log::info('⚠️ No se encontró precio COSTO para el producto');
            return response()->json([
                'producto'            => [
                    'id'     => $producto->id,
                    'nombre' => $producto->nombre,
                    'sku'    => $producto->sku,
                ],
                'precio_costo_actual' => null,
                'compras'             => [],
                'message'             => 'No se encontró precio de costo registrado',
            ]);
        }

        $costroActual = (float) $precioCosto->precio;
        \Log::info('💰 PRECIO COSTO ACTUAL REGISTRADO EN BD', [
            'precio_id' => $precioCosto->id,
            'precio' => $costroActual,
            'margen_ganancia' => $precioCosto->margen_ganancia,
            'porcentaje_ganancia' => $precioCosto->porcentaje_ganancia,
            'updated_at' => $precioCosto->updated_at,
        ]);

        // Obtener estados válidos (APROBADO y FACTURADO)
        $estadosValidos = EstadoDocumento::whereIn('codigo', ['APROBADO', 'FACTURADO'])
            ->pluck('id')
            ->toArray();

        \Log::info('🔍 Buscando VERDADERAMENTE ÚLTIMA compra APROBADA/FACTURADA');

        // Buscar la ÚLTIMA compra APROBADA/FACTURADA de este producto
        // Ordenar por fecha DESC y luego por ID DESC para obtener la más reciente
        $ultimaCompraAprobada = DetalleCompra::where('producto_id', $productoId)
            ->with(['compra' => function ($q) use ($estadosValidos) {
                $q->whereIn('estado_documento_id', $estadosValidos)
                    ->with(['proveedor:id,nombre', 'estadoDocumento:id,codigo,nombre,color']);
            }])
            ->get()
            ->filter(function ($detalle) {
                return $detalle->compra !== null;
            })
            ->sortByDesc(function ($detalle) {
                // Ordenar por fecha DESC primero, luego por ID DESC
                return [$detalle->compra->fecha, $detalle->compra->id];
            })
            ->first();

        \Log::info('📋 Todas las compras aprobadas encontradas', [
            'total' => DetalleCompra::where('producto_id', $productoId)
                ->with('compra')
                ->get()
                ->filter(fn ($d) => $d->compra && in_array($d->compra->estado_documento_id, $estadosValidos))
                ->count(),
            'compras' => DetalleCompra::where('producto_id', $productoId)
                ->with('compra')
                ->get()
                ->filter(fn ($d) => $d->compra && in_array($d->compra->estado_documento_id, $estadosValidos))
                ->map(fn ($d) => [
                    'compra_id' => $d->compra->id,
                    'numero' => $d->compra->numero,
                    'fecha' => $d->compra->fecha,
                    'precio' => $d->precio_unitario,
                ])
                ->sortByDesc('fecha')
                ->values(),
        ]);

        if (! $ultimaCompraAprobada) {
            \Log::info('⚠️ No hay compras aprobadas/facturadas registradas');
            return response()->json([
                'producto'            => [
                    'id'     => $producto->id,
                    'nombre' => $producto->nombre,
                    'sku'    => $producto->sku,
                ],
                'precio_costo_actual' => (float) $costroActual,
                'compras'             => [],
                'message'             => 'No hay compras aprobadas registradas',
            ]);
        }

        $precioUltimaCompra = (float) $ultimaCompraAprobada->precio_unitario;
        $fechaUltimaCompra = $ultimaCompraAprobada->compra->fecha;

        \Log::info('✅ Última compra aprobada encontrada', [
            'compra_id'       => $ultimaCompraAprobada->compra->id,
            'fecha'           => $fechaUltimaCompra,
            'precio_compra'   => $precioUltimaCompra,
            'precio_registrado' => $costroActual,
        ]);

        // Verificar si la última compra tiene el mismo precio que el registrado
        $hayDiferencia = abs($costroActual - $precioUltimaCompra) > 0.01;

        if (! $hayDiferencia) {
            \Log::info('✅ No hay diferencia entre última compra y precio registrado');
            return response()->json([
                'producto'            => [
                    'id'     => $producto->id,
                    'nombre' => $producto->nombre,
                    'sku'    => $producto->sku,
                ],
                'precio_costo_actual'          => (float) $costroActual,
                'precio_ultima_compra'         => $precioUltimaCompra,
                'fecha_ultima_compra'          => $fechaUltimaCompra,
                'total_compras_con_diferencia' => 0,
                'compras'                      => [],
                'message'                      => 'El precio de la última compra aprobada coincide con el precio registrado. No hay cambios que realizar.',
            ]);
        }

        \Log::info('⚠️ Detectada diferencia, mostrando solo la última compra aprobada');

        // Mostrar solo la última compra APROBADA/FACTURADA
        $precioCompra         = (float) $ultimaCompraAprobada->precio_unitario;
        $diferencia           = $precioCompra - $costroActual;
        $porcentajeDiferencia = ($costroActual > 0)
            ? (($diferencia / $costroActual) * 100)
            : 0;

        $comprasConDiferencia = collect([
            [
                'compra_numero'          => $ultimaCompraAprobada->compra->numero,
                'compra_id'              => $ultimaCompraAprobada->compra->id,
                'fecha'                  => $ultimaCompraAprobada->compra->fecha,
                'proveedor'              => $ultimaCompraAprobada->compra->proveedor?->nombre,
                'estado'                 => [
                    'codigo' => $ultimaCompraAprobada->compra->estadoDocumento?->codigo,
                    'nombre' => $ultimaCompraAprobada->compra->estadoDocumento?->nombre,
                    'color'  => $ultimaCompraAprobada->compra->estadoDocumento?->color,
                ],
                'precio_unitario_actual' => $costroActual,
                'precio_unitario_compra' => $precioCompra,
                'diferencia'             => $diferencia,
                'porcentaje_diferencia'  => round($porcentajeDiferencia, 2),
                'cantidad'               => (float) $ultimaCompraAprobada->cantidad,
                'subtotal_compra'        => (float) $ultimaCompraAprobada->subtotal,
                'es_aumento'             => $diferencia > 0,
            ],
        ]);

        \Log::info('📊 Mostrando última compra aprobada', [
            'compra_id' => $ultimaCompraAprobada->compra->id,
            'precio_compra' => $precioCompra,
            'diferencia' => $diferencia,
        ]);

        return response()->json([
            'producto'                     => [
                'id'     => $producto->id,
                'nombre' => $producto->nombre,
                'sku'    => $producto->sku,
            ],
            'precio_costo_actual'          => (float) $costroActual,
            'precio_ultima_compra'         => $precioUltimaCompra,
            'fecha_ultima_compra'          => $fechaUltimaCompra,
            'total_compras_con_diferencia' => $comprasConDiferencia->count(),
            'compras'                      => $comprasConDiferencia,
        ]);
    }

    /**
     * API: Actualizar múltiples precios en lote
     * POST /api/precios/actualizar-lote
     */
    public function actualizarLote(Request $request)
    {
        \Log::info('📥 PrecioController::actualizarLote - Petición recibida:', $request->all());

        $validated = $request->validate([
            'precios'                       => ['required', 'array'],
            'precios.*.precio_id'           => ['required', 'exists:precios_producto,id'],
            'precios.*.precio_nuevo'        => ['required', 'numeric', 'min:0'],
            'precios.*.porcentaje_ganancia' => ['nullable', 'numeric', 'min:-100'],
            'precios.*.motivo'              => ['required', 'string', 'max:500'],
        ]);

        \Log::info('✅ PrecioController::actualizarLote - Validación exitosa', ['cantidad' => count($validated['precios'])]);

        try {
            $actualizados = [];
            $errores      = [];

            foreach ($validated['precios'] as $item) {
                try {
                    $precio     = PrecioProducto::findOrFail($item['precio_id']);
                    $tipoPrecio = $precio->tipoPrecio;

                    Log::info('🔄 Actualizando precio', [
                        'precio_id'         => $precio->id,
                        'tipo_precio'       => $tipoPrecio->codigo ?? 'N/A',
                        'precio_actual'     => $precio->precio,
                        'precio_nuevo'      => $item['precio_nuevo'],
                        'porcentaje_actual' => $precio->porcentaje_ganancia,
                        'porcentaje_nuevo'  => $item['porcentaje_ganancia'] ?? 'no enviado',
                    ]);

                    // Actualizar el precio principal
                    $precio->actualizarPrecio(
                        (float) $item['precio_nuevo'],
                        $item['motivo'],
                        Auth::user()->name
                    );

                    Log::info('💾 Precio actualizado con actualizarPrecio()');

                    // Si es el precio COSTO, actualizarlo especialmente
                    if ($tipoPrecio && $tipoPrecio->codigo === 'COSTO') {
                        Log::info('🎯 Detectado precio COSTO');

                        // Actualizar precio_compra del producto
                        $precio->producto->update([
                            'precio_compra' => (float) $item['precio_nuevo'],
                        ]);

                        // El costo debe tener 0% de ganancia
                        $precio->update([
                            'porcentaje_ganancia' => 0,
                            'margen_ganancia'     => 0,
                        ]);

                        Log::info('✅ Precio COSTO del producto actualizado', [
                            'producto_id'         => $precio->producto->id,
                            'nuevo_precio_compra' => (float) $item['precio_nuevo'],
                            'porcentaje_ganancia' => 0,
                            'margen_ganancia'     => 0,
                        ]);
                    } else {
                        // Para otros precios, obtener el precio de costo
                        $precioCostoObj = $precio->producto->obtenerPrecio('COSTO');
                        $precioCosto    = $precioCostoObj?->precio ?? 0;

                        Log::info('📊 Información de costo para cálculo', [
                            'precio_costo'       => $precioCosto,
                            'tipo_precio_codigo' => $tipoPrecio->codigo ?? 'N/A',
                        ]);

                        // Si se proporciona porcentaje de ganancia, actualizar también
                        if (isset($item['porcentaje_ganancia'])) {
                            $nuevoMargenGanancia = ($precioCosto > 0)
                                ? ($item['precio_nuevo'] - $precioCosto)
                                : 0;

                            Log::info('📈 Calculando margen de ganancia', [
                                'precio_nuevo'        => $item['precio_nuevo'],
                                'precio_costo'        => $precioCosto,
                                'margen_ganancia'     => $nuevoMargenGanancia,
                                'porcentaje_ganancia' => $item['porcentaje_ganancia'],
                            ]);

                            $precio->update([
                                'porcentaje_ganancia' => (float) $item['porcentaje_ganancia'],
                                'margen_ganancia'     => $nuevoMargenGanancia,
                            ]);

                            Log::info('✅ Campos porcentaje_ganancia y margen_ganancia actualizados', [
                                'precio_id'           => $precio->id,
                                'porcentaje_ganancia' => (float) $item['porcentaje_ganancia'],
                                'margen_ganancia'     => $nuevoMargenGanancia,
                            ]);
                        }
                    }

                    $actualizados[] = $precio->id;
                    Log::info('✅ Precio actualizado exitosamente', ['precio_id' => $precio->id]);
                } catch (\Exception $e) {
                    Log::error('❌ Error al actualizar precio', [
                        'precio_id' => $item['precio_id'],
                        'error'     => $e->getMessage(),
                        'trace'     => $e->getTraceAsString(),
                    ]);
                    $errores[] = [
                        'precio_id' => $item['precio_id'],
                        'error'     => $e->getMessage(),
                    ];
                }
            }

            \Log::info('📤 Finalizando actualizarLote', [
                'actualizados' => count($actualizados),
                'errores'      => count($errores),
            ]);

            return response()->json([
                'success'      => empty($errores),
                'message'      => count($actualizados) . ' precios actualizados',
                'actualizados' => $actualizados,
                'errores'      => $errores,
            ]);
        } catch (\Exception $e) {
            \Log::error('❌ Error general en actualizarLote', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar precios: ' . $e->getMessage(),
            ], 422);
        }
    }
}

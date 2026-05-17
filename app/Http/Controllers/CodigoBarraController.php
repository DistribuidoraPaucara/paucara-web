<?php

namespace App\Http\Controllers;

use App\DTOs\CodigoBarraDTO;
use App\Enums\TipoCodigoBarraEnum;
use App\Http\Requests\StoreCodigoBarraRequest;
use App\Http\Requests\UpdateCodigoBarraRequest;
use App\Models\CodigoBarra;
use App\Models\Producto;
use App\Services\CodigoBarraService;
use App\Services\CodigosBarraCacheService;
use App\Services\CodigosBarraImagenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Response;
use Inertia\ResponseFactory;

class CodigoBarraController extends Controller
{
    public function __construct(private CodigoBarraService $service)
    {
        $this->middleware('permission:productos.manage');
    }

    /**
     * Listar códigos de barra de un producto
     */
    public function index(): Response
    {
        $productoId = request()->query('producto_id');

        if (!$productoId) {
            abort(400, 'El parámetro producto_id es requerido');
        }

        $producto = Producto::findOrFail($productoId);
        $codigos = $this->service->obtenerCodigosProducto($producto->id);
        $codigosDTO = $codigos->map(fn (CodigoBarra $c) => $this->service->toDTO($c))->toArray();

        return inertia('CodigosBarra/Index', [
            'producto' => $producto->only('id', 'nombre', 'sku'),
            'codigos' => $codigosDTO,
            'tipos' => TipoCodigoBarraEnum::getOptions(),
            'total_codigos' => count($codigosDTO),
            'codigo_principal' => $codigosDTO[0] ?? null,
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create(): Response
    {
        $productoId = request()->query('producto_id');

        if (!$productoId) {
            abort(400, 'El parámetro producto_id es requerido');
        }

        $producto = Producto::findOrFail($productoId);
        $codigos = $this->service->obtenerCodigosProducto($producto->id);
        $codigosDTO = $codigos->map(fn (CodigoBarra $c) => $this->service->toDTO($c))->toArray();

        return inertia('CodigosBarra/Create', [
            'producto' => $producto->only('id', 'nombre', 'sku'),
            'tipos' => TipoCodigoBarraEnum::paraSelects(),
            'codigosExistentes' => $codigosDTO,
        ]);
    }

    /**
     * Guardar nuevo código de barra
     */
    public function store(StoreCodigoBarraRequest $request): RedirectResponse|JsonResponse
    {
        try {
            $data = $request->getCodigoData();

            $codigoBarra = $this->service->crear(
                productoId: $data['producto_id'],
                codigo: $data['codigo'],
                tipo: TipoCodigoBarraEnum::from($data['tipo']),
                esPrincipal: $data['es_principal'],
            );

            $mensaje = "Código de barra '{$codigoBarra->codigo}' creado exitosamente";

            // Retornar según tipo de request
            if ($request->wantsJson()) {
                return response()->json([
                    'mensaje' => $mensaje,
                    'codigo' => $this->service->toDTO($codigoBarra)->toApi(),
                ], 201);
            }

            return redirect()
                ->route('codigos-barra.index', $data['producto_id'])
                ->with('success', $mensaje);

        } catch (\InvalidArgumentException $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 422);
            }

            return redirect()
                ->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(CodigoBarra $codigoBarra): Response
    {
        return inertia('CodigosBarra/Edit', [
            'codigo' => $this->service->toDTO($codigoBarra)->toWeb(),
            'producto' => $codigoBarra->producto->only('id', 'nombre', 'sku'),
            'tipos' => TipoCodigoBarraEnum::paraSelects(),
        ]);
    }

    /**
     * Actualizar código de barra
     */
    public function update(UpdateCodigoBarraRequest $request, CodigoBarra $codigoBarra): RedirectResponse|JsonResponse
    {
        try {
            $data = $request->validated();

            if (isset($data['es_principal']) && $data['es_principal']) {
                $this->service->marcarPrincipal($codigoBarra->id);
                $mensaje = "Código {$codigoBarra->codigo} marcado como principal";
            } else {
                $codigoBarra->update($data);
                $mensaje = "Código {$codigoBarra->codigo} actualizado exitosamente";
            }

            if ($request->wantsJson()) {
                return response()->json([
                    'mensaje' => $mensaje,
                    'codigo' => $this->service->toDTO($codigoBarra->refresh())->toApi(),
                ]);
            }

            return redirect()
                ->route('codigos-barra.index', $codigoBarra->producto_id)
                ->with('success', $mensaje);

        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 422);
            }

            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Eliminar código de barra (marcar como inactivo)
     */
    public function destroy(CodigoBarra $codigoBarra): RedirectResponse|JsonResponse
    {
        try {
            $productoId = $codigoBarra->producto_id;
            $codigo = $codigoBarra->codigo;

            $this->service->inactivar($codigoBarra->id);

            $mensaje = "Código {$codigo} marcado como inactivo";

            if (request()->wantsJson()) {
                return response()->json(['mensaje' => $mensaje]);
            }

            return redirect()
                ->route('codigos-barra.index', $productoId)
                ->with('success', $mensaje);

        } catch (\Exception $e) {
            if (request()->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 422);
            }

            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * API: Buscar producto por código de barra (para POS/Logística)
     */
    public function buscarPorCodigo(string $codigo): JsonResponse
    {
        try {
            $producto = $this->service->buscarPorCodigo($codigo);

            if (!$producto) {
                return response()->json(
                    ['error' => 'Producto no encontrado'],
                    404
                );
            }

            return response()->json([
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'sku' => $producto->sku,
                'codigo_principal' => $this->service->obtenerCodigoPrincipal($producto->id)?->codigo,
                'segundo_codigo' => $this->service->obtenerSegundoCodigo($producto->id)?->codigo,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * API: Validar código de barra
     */
    public function validar(string $codigo): JsonResponse
    {
        try {
            $tipo = TipoCodigoBarraEnum::EAN;

            if (request()->has('tipo')) {
                $tipo = TipoCodigoBarraEnum::tryFrom(request()->input('tipo')) ?? TipoCodigoBarraEnum::EAN;
            }

            $validacion = $this->service->validar($codigo, $tipo);

            return response()->json($validacion);

        } catch (\Exception $e) {
            return response()->json(
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * API: Generar código EAN-13 automático
     */
    public function generar(): JsonResponse
    {
        try {
            $codigo = $this->service->generarEAN13();

            return response()->json([
                'codigo' => $codigo,
                'tipo' => 'EAN',
                'valido' => true,
            ]);

        } catch (\Exception $e) {
            return response()->json(
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * API: Marcar código como principal (vía JSON)
     */
    public function marcarPrincipal(CodigoBarra $codigoBarra): JsonResponse
    {
        try {
            $this->authorize('update', $codigoBarra);

            $codigoBarra = $this->service->marcarPrincipal($codigoBarra->id);

            return response()->json([
                'mensaje' => "Código {$codigoBarra->codigo} marcado como principal",
                'codigo' => $this->service->toDTO($codigoBarra)->toApi(),
            ]);

        } catch (\Exception $e) {
            return response()->json(
                ['error' => $e->getMessage()],
                422
            );
        }
    }

    /**
     * API: Obtener códigos de un producto
     */
    public function codigosProducto(Producto $producto): JsonResponse
    {
        try {
            $codigos = $this->service->obtenerCodigosDTO($producto->id);

            return response()->json([
                'producto_id' => $producto->id,
                'nombre_producto' => $producto->nombre,
                'codigos' => $codigos,
                'total' => count($codigos),
            ]);

        } catch (\Exception $e) {
            return response()->json(
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * API: Obtener imagen de código de barras (PNG)
     */
    public function obtenerImagen(string $codigo, string $tipo = 'EAN'): HttpResponse
    {
        try {
            $servicioImagen = new CodigosBarraImagenService();
            $imagenBase64 = $servicioImagen->generarPNG($codigo, $tipo);

            return response($imagenBase64)
                ->header('Content-Type', 'image/png')
                ->header('Cache-Control', 'public, max-age=3600')
                ->header('Expires', now()->addHour()->toRfc7231String());

        } catch (\Exception $e) {
            return response("Error: {$e->getMessage()}", 400);
        }
    }

    /**
     * API: Obtener imagen de código en SVG
     */
    public function obtenerImagenSVG(string $codigo, string $tipo = 'EAN'): HttpResponse
    {
        try {
            $servicioImagen = new CodigosBarraImagenService();
            $svgImagen = $servicioImagen->generarSVG($codigo, $tipo);

            return response($svgImagen)
                ->header('Content-Type', 'image/svg+xml')
                ->header('Cache-Control', 'public, max-age=3600')
                ->header('Expires', now()->addHour()->toRfc7231String());

        } catch (\Exception $e) {
            return response("Error: {$e->getMessage()}", 400);
        }
    }

    /**
     * API: Buscar producto usando caché (optimizado para POS)
     */
    public function buscarProductoPorCodigoRapido(string $codigo): JsonResponse
    {
        try {
            $servicioCache = new CodigosBarraCacheService();
            $producto = $servicioCache->obtenerProductoPorCodigo($codigo);

            if (!$producto) {
                return response()->json(
                    ['error' => 'Producto no encontrado'],
                    404
                );
            }

            return response()->json([
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'sku' => $producto->sku,
                'precio_base' => $producto->precio_base,
                'stock_disponible' => $producto->stock_disponible_calc ?? 0,
                'codigo_principal' => $this->service->obtenerCodigoPrincipal($producto->id)?->codigo,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * API: Precalentar caché (se ejecuta tras importaciones o cambios masivos)
     */
    public function precalentarCache(): JsonResponse
    {
        $this->authorize('update', CodigoBarra::class);

        try {
            $servicioCache = new CodigosBarraCacheService();
            $cantidad = $servicioCache->precalentarCache(limit: 5000);

            return response()->json([
                'mensaje' => "Caché precalentado con $cantidad códigos",
                'cantidad' => $cantidad,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * API: Obtener estadísticas del caché
     */
    public function estadisticasCache(): JsonResponse
    {
        try {
            $servicioCache = new CodigosBarraCacheService();
            $stats = $servicioCache->obtenerEstadisticas();

            return response()->json($stats);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

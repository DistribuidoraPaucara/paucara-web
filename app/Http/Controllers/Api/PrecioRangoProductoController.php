<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportarPrecioRangoCSVRequest;
use App\Http\Requests\StorePrecioRangoRequest;
use App\Http\Requests\UpdatePrecioRangoRequest;
use App\Models\PrecioRangoCantidadProducto;
use App\Models\Producto;
use App\Models\TipoPrecio;
use App\Services\CSV\ImportarPrecioRangoCSVService;
use App\Services\Venta\PrecioRangoProductoService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PrecioRangoProductoController extends Controller
{
    protected PrecioRangoProductoService $service;

    public function __construct(PrecioRangoProductoService $service)
    {
        $this->service = $service;
        $this->middleware('auth:sanctum,web');
    }

    /**
     * Obtener todos los rangos para un producto
     * GET /api/productos/{producto}/rangos-precio
     */
    public function index(Producto $producto)
    {
        $empresaId = auth()->user()->empresa_id;

        $rangos = $this->service->obtenerResumenRangos($producto, $empresaId);

        return response()->json([
            'success'    => true,
            'data'       => $rangos,
            'integridad' => $this->service->validarIntegridad($producto, $empresaId),
        ]);
    }

    /**
     * Crear un nuevo rango de precio
     * POST /api/productos/{producto}/rangos-precio
     */
    public function store(StorePrecioRangoRequest $request, Producto $producto)
    {
        try {
            $empresaId  = auth()->user()->empresa_id;
            $tipoPrecio = TipoPrecio::findOrFail($request->tipo_precio_id);

            $rango = $this->service->crearRango(
                $producto,
                $request->cantidad_minima,
                $request->cantidad_maxima,
                $tipoPrecio,
                $empresaId,
                $request->fecha_vigencia_inicio ? now()->parse($request->fecha_vigencia_inicio) : null,
                $request->fecha_vigencia_fin ? now()->parse($request->fecha_vigencia_fin) : null
            );

            return response()->json([
                'success' => true,
                'message' => 'Rango de precio creado exitosamente',
                'data'    => $rango->load('tipoPrecio'),
            ], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Obtener detalles de un rango específico
     * GET /api/productos/{producto}/rangos-precio/{rango}
     */
    public function show(Producto $producto, PrecioRangoCantidadProducto $rango)
    {
        $empresaId = auth()->user()->empresa_id ?? 1;

        // Validar que el rango pertenezca al producto y empresa del usuario
        if ($rango->producto_id !== $producto->id) {
            return response()->json([
                'success' => false,
                'message' => 'El rango no pertenece a este producto.',
            ], Response::HTTP_FORBIDDEN);
        }

        if ($rango->empresa_id !== $empresaId) {
            return response()->json([
                'success' => false,
                'message' => 'No estás autorizado para ver este rango.',
            ], Response::HTTP_FORBIDDEN);
        }

        return response()->json([
            'success' => true,
            'data'    => $rango->load('tipoPrecio', 'producto'),
        ]);
    }

    /**
     * Actualizar un rango de precio
     * PUT /api/productos/{producto}/rangos-precio/{rango}
     */
    public function update(UpdatePrecioRangoRequest $request, Producto $producto, PrecioRangoCantidadProducto $rango)
    {
        $empresaId = auth()->user()->empresa_id ?? 1;

        // Validar que el rango pertenezca al producto y empresa del usuario
        if ($rango->producto_id !== $producto->id) {
            return response()->json([
                'success' => false,
                'message' => 'El rango no pertenece a este producto. El rango pertenece al producto #' . $rango->producto_id,
            ], Response::HTTP_FORBIDDEN);
        }

        if ($rango->empresa_id !== $empresaId) {
            return response()->json([
                'success' => false,
                'message' => 'No estás autorizado. El rango pertenece a otra empresa.',
            ], Response::HTTP_FORBIDDEN);
        }

        try {
            $datos = $request->validated();

            if ($request->has('tipo_precio_id')) {
                TipoPrecio::findOrFail($request->tipo_precio_id);
            }

            $rango = $this->service->actualizarRango($rango, $datos);

            return response()->json([
                'success' => true,
                'message' => 'Rango de precio actualizado exitosamente',
                'data'    => $rango->load('tipoPrecio'),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Desactivar un rango de precio (soft delete lógico)
     * DELETE /api/productos/{producto}/rangos-precio/{rango}
     */
    public function destroy(Producto $producto, PrecioRangoCantidadProducto $rango)
    {
        $empresaId = auth()->user()->empresa_id ?? 1;

        // Validar que el rango pertenezca al producto y empresa del usuario
        if ($rango->producto_id !== $producto->id) {
            return response()->json([
                'success' => false,
                'message' => 'El rango no pertenece a este producto.',
            ], Response::HTTP_FORBIDDEN);
        }

        if ($rango->empresa_id !== $empresaId) {
            return response()->json([
                'success' => false,
                'message' => 'No estás autorizado para eliminar este rango.',
            ], Response::HTTP_FORBIDDEN);
        }

        $this->service->desactivarRango($rango);

        return response()->json([
            'success' => true,
            'message' => 'Rango de precio desactivado exitosamente',
        ]);
    }

    /**
     * Calcular precio considerando rango
     * POST /api/productos/{producto}/calcular-precio
     *
     * Body:
     * {
     *   "cantidad": 15
     * }
     */
    public function calcularPrecio(Request $request, Producto $producto)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        $empresaId = auth()->user()->empresa_id;
        $detalles  = $this->service->calcularPrecioCompleto(
            $producto,
            $request->cantidad,
            $empresaId
        );

        return response()->json([
            'success' => true,
            'data'    => $detalles,
        ]);
    }

    /**
     * Calcular carrito completo con precios por rango
     * POST /api/carrito/calcular
     *
     * Body:
     * {
     *   "items": [
     *     { "producto_id": 1, "cantidad": 15, "tipo_precio_id": 7 },
     *     { "producto_id": 2, "cantidad": 5, "tipo_precio_id": 7 }
     *   ]
     * }
     *
     * ✅ NUEVO: tipo_precio_id es opcional. Si viene, se respeta. Si no y hay rango, usa el del rango.
     */
    public function calcularCarrito(Request $request)
    {
        $request->validate([
            'items'                     => 'required|array|min:1',
            'items.*.producto_id'       => [
                'required',
                'integer',
                'exists:productos,id,activo,1', // ← Validar que esté activo
            ],
            'items.*.cantidad'          => 'required|numeric|min:0.01', // ← Permite decimales (0.01 en adelante)
            'items.*.tipo_precio_id'    => 'nullable|integer|exists:tipos_precio,id', // ✅ NUEVO: opcional
        ]);

        try {
            $empresaId = auth()->user()->empresa_id;
            $resultado = $this->service->calcularCarrito(
                $request->items,
                $empresaId
            );

            return response()->json([
                'success' => true,
                'data'    => $resultado,
            ]);
        } catch (\InvalidArgumentException $e) {
            // Error de validación como límite de venta excedido
            return response()->json([
                'success'    => false,
                'error'      => $e->getMessage(),
                'error_code' => 'VALIDATION_ERROR',
            ], 422);
        }
    }

    /**
     * Validar integridad de rangos para un producto
     * GET /api/productos/{producto}/rangos-precio/validar
     */
    public function validarIntegridad(Producto $producto)
    {
        $empresaId = auth()->user()->empresa_id;
        $resultado = $this->service->validarIntegridad($producto, $empresaId);

        return response()->json([
            'success' => $resultado['es_valido'],
            'data'    => $resultado,
        ]);
    }

    /**
     * Copiar rangos de un producto a otro
     * POST /api/productos/{productoOrigen}/rangos-precio/copiar/{productoDestino}
     */
    public function copiarRangos(Producto $productoOrigen, Producto $productoDestino)
    {
        $empresaId = auth()->user()->empresa_id;

        // Validar que ambos productos pertenezcan a la empresa
        if ($productoOrigen->empresa_id !== $empresaId || $productoDestino->empresa_id !== $empresaId) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], Response::HTTP_FORBIDDEN);
        }

        try {
            $rangosOrigen = $productoOrigen->rangosPrecios()
                ->where('empresa_id', $empresaId)
                ->activos()
                ->get();

            $copiados = 0;

            foreach ($rangosOrigen as $rangoOrigen) {
                // Validar que el producto destino tenga precio para el tipo
                $precioDestino = $productoDestino->obtenerPrecio($rangoOrigen->tipo_precio_id);
                if (! $precioDestino) {
                    continue;
                }

                // Crear nuevo rango
                $this->service->crearRango(
                    $productoDestino,
                    $rangoOrigen->cantidad_minima,
                    $rangoOrigen->cantidad_maxima,
                    $rangoOrigen->tipoPrecio,
                    $empresaId,
                    $rangoOrigen->fecha_vigencia_inicio,
                    $rangoOrigen->fecha_vigencia_fin
                );

                $copiados++;
            }

            return response()->json([
                'success' => true,
                'message' => "Se copiaron {$copiados} rangos exitosamente",
                'datos' => [
                    'rangos_copiados'    => $copiados,
                    'rangos_disponibles' => count($rangosOrigen),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    /**
     * Previsualizar archivo CSV sin importar
     * POST /api/productos/rangos-precio/previsualizar-csv
     *
     * Body (multipart/form-data):
     * - archivo: file (CSV)
     * - producto_id: opcional (limitar a un producto)
     */
    public function previsualizarCSV(Request $request)
    {
        $request->validate([
            'archivo'     => 'required|file|mimes:csv,txt',
            'producto_id' => 'nullable|integer|exists:productos,id',
        ]);

        $empresaId  = auth()->user()->empresa_id ?? 1;
        $csvService = new ImportarPrecioRangoCSVService();

        $preview = $csvService->previsualizarArchivo(
            $request->file('archivo'),
            $empresaId,
            $request->input('producto_id')
        );

        // Limpiar datos para asegurar que sean UTF-8 válidos
        $preview = $this->limpiarDatosUTF8($preview);

        return response()->json([
            'success' => true,
            'data'    => $preview,
        ]);
    }

    /**
     * Limpiar datos para asegurar que sean UTF-8 válidos
     */
    private function limpiarDatosUTF8($data)
    {
        if (is_array($data)) {
            $resultado = [];
            foreach ($data as $key => $value) {
                if (is_array($value)) {
                    $resultado[$key] = $this->limpiarDatosUTF8($value);
                } elseif (is_string($value)) {
                    // Validar y convertir a UTF-8 si es necesario
                    if (! mb_check_encoding($value, 'UTF-8')) {
                        $value = mb_convert_encoding($value, 'UTF-8', 'auto');
                    }
                    $resultado[$key] = $value;
                } else {
                    $resultado[$key] = $value;
                }
            }
            return $resultado;
        }
        return $data;
    }

    /**
     * Importar rangos desde archivo CSV
     * POST /api/productos/rangos-precio/importar-csv
     *
     * Body (multipart/form-data):
     * - archivo: file (CSV)
     * - producto_id: opcional (limitar a un producto)
     * - sobreescribir: boolean (eliminar rangos anteriores)
     */
    public function importarCSV(ImportarPrecioRangoCSVRequest $request)
    {
        $empresaId  = auth()->user()->empresa_id ?? 1;
        $csvService = new ImportarPrecioRangoCSVService();

        // Obtener correcciones si existen
        $correcciones = null;
        if ($request->has('correcciones')) {
            $correcciones = json_decode($request->input('correcciones'), true);
        }

        // Obtener filas eliminadas si existen
        $filasEliminadas = null;
        if ($request->has('filas_eliminadas')) {
            $filasEliminadas = json_decode($request->input('filas_eliminadas'), true);
        }

        $resultado = $csvService->procesarArchivo(
            $request->file('archivo'),
            $empresaId,
            $request->input('producto_id'),
            $request->boolean('sobreescribir', false),
            $correcciones,
            $filasEliminadas
        );

        $success    = $resultado['errores'] === 0;
        $statusCode = $success ? Response::HTTP_OK : Response::HTTP_UNPROCESSABLE_ENTITY;

        return response()->json([
            'success' => $success,
            'message' => $success
                ? "Se importaron {$resultado['exitosos']} rango(s) correctamente"
                : "Se importaron {$resultado['exitosos']} rango(s) con {$resultado['errores']} error(es)",
            'data' => $resultado,
        ], $statusCode);
    }

    /**
     * Descargar plantilla CSV
     * GET /api/precio-rangos/plantilla-csv
     */
    public function descargarPlantillaCSV()
    {
        $empresaId = auth()->user()->empresa_id ?? 1;
        $csv       = ImportarPrecioRangoCSVService::generarPlantillaCSV($empresaId);

        return response($csv, Response::HTTP_OK, [
            'Content-Type'        => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="plantilla_rangos_precios.csv"',
            'Content-Length'      => strlen($csv),
        ]);
    }
}

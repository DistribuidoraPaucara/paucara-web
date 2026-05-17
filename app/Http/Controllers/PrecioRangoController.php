<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\PrecioRangoCantidadProducto;
use App\Models\TipoPrecio;
use App\Services\Venta\PrecioRangoProductoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrecioRangoController extends Controller
{
    protected PrecioRangoProductoService $service;

    public function __construct(PrecioRangoProductoService $service)
    {
        $this->service = $service;
        $this->middleware('auth');
    }

    /**
     * Mostrar listado de rangos de precios
     * GET /precio-rango
     */
    public function index(Request $request): Response
    {
        $empresaId = auth()->user()->empresa_id ?? 1;
        $productoId = $request->query('producto_id');

        // Obtener todos los productos activos
        $productos = Producto::where('activo', true)
            ->select('id', 'nombre', 'sku')
            ->orderBy('nombre')
            ->get();

        $rangos = [];
        $integridad = [
            'es_valido' => true,
            'problemas' => [],
            'cantidad_rangos' => 0,
        ];

        if ($productoId) {
            $producto = Producto::findOrFail($productoId);

            // Obtener resumen de rangos
            $resumenRangos = $this->service->obtenerResumenRangos($producto, $empresaId);
            $rangos = $resumenRangos;

            // Validar integridad
            $integridad = $this->service->validarIntegridad($producto, $empresaId);
        }

        return Inertia::render('precio-rango/index', [
            'productos' => $productos,
            'productoSeleccionadoId' => $productoId ? (int) $productoId : null,
            'rangos' => $rangos,
            'integridad' => $integridad,
        ]);
    }

    /**
     * Mostrar formulario de creación
     * GET /precio-rango/create
     */
    public function create(Request $request): Response
    {
        $productoId = $request->query('producto_id');

        // Obtener productos activos
        $productos = Producto::where('activo', true)
            ->select('id', 'nombre', 'sku')
            ->orderBy('nombre')
            ->get();

        // Obtener tipos de precio activos
        $tiposPrecio = TipoPrecio::where('activo', true)
            ->select('id', 'nombre', 'codigo')
            ->orderBy('orden', 'asc')
            ->get();

        return Inertia::render('precio-rango/form', [
            'productos' => $productos,
            'tiposPrecio' => $tiposPrecio,
            'productoId' => $productoId ? (int) $productoId : null,
        ]);
    }

    /**
     * Mostrar formulario de edición
     * GET /precio-rango/{rango}/edit
     */
    public function edit(PrecioRangoCantidadProducto $rango, Request $request): Response
    {
        $empresaId = auth()->user()->empresa_id ?? 1;
        $productoId = $request->query('producto_id');

        // Validar que el rango pertenezca a la empresa del usuario
        if ($rango->empresa_id !== $empresaId) {
            abort(403, 'No estás autorizado para editar este rango. Pertenece a otra empresa.');
        }

        // Obtener productos activos
        $productos = Producto::where('activo', true)
            ->select('id', 'nombre', 'sku')
            ->orderBy('nombre')
            ->get();

        // Obtener tipos de precio activos
        $tiposPrecio = TipoPrecio::where('activo', true)
            ->select('id', 'nombre', 'codigo')
            ->orderBy('orden', 'asc')
            ->get();

        // Cargar relaciones
        $rango->load('producto:id,nombre,sku', 'tipoPrecio:id,nombre,codigo');

        return Inertia::render('precio-rango/form', [
            'rango' => $rango,
            'productos' => $productos,
            'tiposPrecio' => $tiposPrecio,
            'productoId' => $rango->producto_id,
        ]);
    }

    /**
     * Mostrar formulario de creación rápida para un producto específico
     * GET /productos/{producto}/precio-rango/create
     */
    public function createParaProducto(Producto $producto): Response
    {
        // Obtener tipos de precio activos
        $tiposPrecio = TipoPrecio::where('activo', true)
            ->select('id', 'nombre', 'codigo')
            ->orderBy('orden', 'asc')
            ->get();

        return Inertia::render('precio-rango/form', [
            'productos' => collect([$producto->only('id', 'nombre', 'sku')]),
            'tiposPrecio' => $tiposPrecio,
            'productoId' => $producto->id,
        ]);
    }

    /**
     * Mostrar formulario de importación CSV
     * GET /precio-rango/import-csv
     */
    public function importCsv(): Response
    {
        // Obtener productos activos
        $productos = Producto::where('activo', true)
            ->select('id', 'nombre', 'sku')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('precio-rango/import-csv', [
            'productos' => $productos,
        ]);
    }
}

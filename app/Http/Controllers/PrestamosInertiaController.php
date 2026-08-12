<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Prestable;
use App\Models\PrestableStock;
use App\Models\Proveedor;
use App\Models\StockProducto;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrestamosInertiaController extends Controller
{
    /**
     * Dashboard principal de préstamos
     */
    public function index(): Response
    {
        return Inertia::render('prestamos/index');
    }

    /**
     * Gestión de prestables (canastillas/embases)
     */
    public function prestables(): Response
    {
        return Inertia::render('prestamos/prestables/index');
    }

    /**
     * Gestión de stock de prestables
     */
    public function stock(): Response
    {
        return Inertia::render('prestamos/stock/index');
    }

    /**
     * Listado de préstamos a clientes
     */
    public function clientesIndex(): Response
    {
        return Inertia::render('prestamos/clientes/index');
    }

    /**
     * Formulario para crear nuevo préstamo a cliente
     */
    public function clientesCrear(): Response
    {
        $clientes = Cliente::where('activo', true)
            ->select('id', 'razon_social', 'nombre', 'telefono')
            ->orderBy('razon_social')
            ->get();

        $choferes = User::role('chofer')
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn($user) => ['id' => $user->id, 'nombre' => $user->name]);

        $almacenes = \App\Models\AlmacenPrestable::where('activo', true)
            ->select('id', 'nombre', 'es_proveedor')
            ->orderBy('nombre')
            ->get();

        $vehiculos = \App\Models\Vehiculo::where('activo', true)
            ->select('id', 'placa', 'marca', 'modelo')
            ->orderBy('placa')
            ->get();

        $ventas = \App\Models\Venta::select('id', 'numero', 'cliente_id')
            ->with(['cliente:id,nombre,razon_social'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        // ✅ MODIFICADO: Traer prestables con cantidad basada en PRODUCTOS relacionados, no en stock de prestables
        $prestables = Prestable::where('activo', true)
            ->with([
                'productos:id,nombre,sku',
                'productos.stock:id,producto_id,cantidad_disponible,almacen_id',
                'stocks' => function ($query) {
                    $query->select('id', 'prestable_id', 'almacenes_prestables_id', 'cantidad_disponible', 'created_at');
                }
            ])
            ->select('id', 'tipo', 'nombre', 'codigo', 'capacidad', 'prestable_relacionado_id', 'producto_id', 'proveedor_id', 'activo')
            ->orderBy('nombre')
            ->get()
            ->map(function ($prestable) {
                // 🔢 NUEVO: Calcular cantidad disponible basada en PRODUCTOS relacionados
                $cantidadDisponibleProducto = 0;

                if ($prestable->productos && count($prestable->productos) > 0) {
                    // Sumar cantidad_disponible de TODOS los stocks de TODOS los productos relacionados
                    foreach ($prestable->productos as $producto) {
                        if ($producto->stock) {
                            foreach ($producto->stock as $stock) {
                                $cantidadDisponibleProducto += $stock->cantidad_disponible;
                            }
                        }
                    }
                }

                $prestable->cantidad_disponible_producto = $cantidadDisponibleProducto;

                \Log::info('📦 Prestable cargado con cantidad de producto', [
                    'prestable_id' => $prestable->id,
                    'prestable_nombre' => $prestable->nombre,
                    'productos_relacionados' => $prestable->productos->count(),
                    'cantidad_disponible_producto' => $cantidadDisponibleProducto,
                ]);

                return $prestable;
            });

        // ✅ Nuevo: Traer localidades para selección de ubicación
        $localidades = \App\Models\Localidad::select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('prestamos/clientes/crear', [
            'clientes' => $clientes,
            'choferes' => $choferes,
            'almacenes' => $almacenes,
            'vehiculos' => $vehiculos,
            'ventas' => $ventas,
            'prestables' => $prestables, // ✅ Nuevo: prestables con stocks
            'localidades' => $localidades, // ✅ Nuevo: localidades para ubicación
        ]);
    }

    /**
     * Procesar creación de préstamo a cliente
     * Nota: El procesamiento real se hace vía API /api/prestamos-cliente
     */
    public function clientesStore(Request $request)
    {
        // Redirigir al index después de crear via API
        return redirect()->route('prestamos.clientes.index');
    }

    /**
     * Listado de préstamos a proveedores
     */
    public function proveedoresIndex(): Response
    {
        return Inertia::render('prestamos/proveedores/index');
    }

    /**
     * Formulario para crear nuevo préstamo a proveedor
     */
    /**
     * Formulario para PRÉSTAMOS A PROVEEDOR
     */
    public function proveedoresPrestamosCrear(): Response
    {
        $proveedores = Proveedor::where('activo', true)
            ->select('id', 'razon_social', 'nombre')
            ->orderBy('razon_social')
            ->get();

        $compras = \App\Models\Compra::select('id', 'numero', 'proveedor_id')
            ->with(['proveedor:id,nombre,razon_social'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        // Cargar todos los prestables activos (canastillas y embases), aunque no tengan stock.
        // El stock se suma solo desde almacenes marcados como proveedor.
        $almacenesProveedor = \App\Models\AlmacenPrestable::query()
            ->where('es_proveedor', true)
            ->select('id', 'nombre', 'es_proveedor')
            ->orderBy('nombre')
            ->get();

        $stocksPorPrestable = PrestableStock::with([
                'almacenPrestable:id,nombre,es_proveedor',
            ])
            ->whereIn('almacenes_prestables_id', $almacenesProveedor->pluck('id'))
            ->get()
            ->groupBy('prestable_id');

        $prestables = Prestable::query()
            ->select('id', 'nombre', 'codigo', 'tipo', 'capacidad', 'proveedor_id', 'prestable_relacionado_id', 'activo')
            ->where('activo', true)
            ->whereIn('tipo', ['CANASTILLA', 'EMBASES'])
            ->orderBy('nombre')
            ->get()
            ->map(function ($prestable) use ($stocksPorPrestable, $almacenesProveedor) {
                $stocks = $stocksPorPrestable->get($prestable->id, collect());
                $cantidadTotal = (int) $stocks->sum('cantidad_disponible');

                $stocksFormateados = $stocks->map(function ($stock) {
                    return [
                        'id' => $stock->id,
                        'cantidad_disponible' => $stock->cantidad_disponible,
                        'almacenes_prestables_id' => $stock->almacenes_prestables_id,
                        'almacen_prestable' => [
                            'id' => $stock->almacenPrestable?->id,
                            'nombre' => $stock->almacenPrestable?->nombre,
                            'es_proveedor' => $stock->almacenPrestable?->es_proveedor,
                        ],
                    ];
                })->values();

                $almacenes = $almacenesProveedor->map(function ($almacen) {
                    return [
                        'id' => $almacen->id,
                        'nombre' => $almacen->nombre,
                    ];
                })->values();

                return [
                    'id' => $prestable->id,
                    'nombre' => $prestable->nombre,
                    'codigo' => $prestable->codigo,
                    'tipo' => $prestable->tipo,
                    'capacidad' => $prestable->capacidad,
                    'proveedor_id' => $prestable->proveedor_id,
                    'prestable_relacionado_id' => $prestable->prestable_relacionado_id,
                    'activo' => (bool) $prestable->activo,
                    'cantidad_disponible' => $cantidadTotal,
                    'stocks' => $stocksFormateados,
                    'almacenes_proveedor' => $almacenes,
                ];
            })
            ->values();

        $choferes = User::role('chofer')
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn($user) => ['id' => $user->id, 'nombre' => $user->name]);

        $vehiculos = \App\Models\Vehiculo::where('activo', true)
            ->select('id', 'placa', 'marca', 'modelo')
            ->orderBy('placa')
            ->get()
            ->map(fn($v) => ['id' => $v->id, 'placa' => $v->placa, 'marca' => $v->marca, 'modelo' => $v->modelo]);

        return Inertia::render('prestamos/proveedores/crear', [
            'proveedores' => $proveedores,
            'compras' => $compras,
            'almacenes_proveedor' => $almacenesProveedor->map(fn($a) => [
                'id' => $a->id,
                'nombre' => $a->nombre,
                'es_proveedor' => $a->es_proveedor,
            ])->values(),
            'choferes' => $choferes,
            'vehiculos' => $vehiculos,
            'prestables_proveedor' => $prestables,
        ]);
    }

    /**
     * Formulario para COMPRA DE PRESTABLES
     */
    public function proveedoresComprasCrear(): Response
    {
        $proveedores = Proveedor::where('activo', true)
            ->select('id', 'razon_social', 'nombre')
            ->orderBy('razon_social')
            ->get();

        $compras = \App\Models\Compra::select('id', 'numero', 'proveedor_id')
            ->with(['proveedor:id,nombre,razon_social'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        return Inertia::render('prestamos/proveedores/compras', [
            'proveedores' => $proveedores,
            'compras' => $compras,
        ]);
    }

    /**
     * Procesar creación de préstamo a proveedor (LEGACY - mantener para compatibilidad)
     */
    public function proveedoresCrear(): Response
    {
        return $this->proveedoresPrestamosCrear();
    }

    /**
     * Procesar creación de préstamo a proveedor
     * Nota: El procesamiento real se hace vía API /api/prestamos-proveedor
     */
    public function proveedoresStore(Request $request)
    {
        // Redirigir al index después de crear via API
        return redirect()->route('prestamos.proveedores.index');
    }

    /**
     * Listado de préstamos a eventos
     */
    public function eventosIndex(): Response
    {
        $choferes = User::role('chofer')
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn($user) => ['id' => $user->id, 'name' => $user->name]);

        $vehiculos = \App\Models\Vehiculo::where('activo', true)
            ->select('id', 'placa', 'marca', 'modelo', 'anho')
            ->orderBy('placa')
            ->get();

        return Inertia::render('prestamos/eventos/index', [
            'choferes' => $choferes,
            'vehiculos' => $vehiculos,
        ]);
    }

    /**
     * Formulario para crear nuevo préstamo a evento
     */
    public function eventosCrear(): Response
    {
        $choferes = User::role('chofer')
            ->select('id', 'name')
            ->orderBy('name')
            ->get()
            ->map(fn($user) => ['id' => $user->id, 'nombre' => $user->name]);

        $almacenes = \App\Models\AlmacenPrestable::where('activo', true)
            ->select('id', 'nombre', 'es_proveedor')
            ->orderBy('nombre')
            ->get();

        $ventas = \App\Models\Venta::select('id', 'numero', 'cliente_id')
            ->with(['cliente:id,nombre,razon_social'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        $vehiculos = \App\Models\Vehiculo::where('activo', true)
            ->select('id', 'placa', 'marca', 'modelo', 'anho')
            ->orderBy('placa')
            ->get();

        // ✅ NUEVO: Traer prestables con stocks actualizados
        $prestables = \App\Models\Prestable::where('activo', true)
            ->with([
                'stocks' => function ($query) {
                    $query->select('id', 'prestable_id', 'almacenes_prestables_id', 'cantidad_disponible', 'created_at');
                }
            ])
            ->select('id', 'tipo', 'nombre', 'codigo', 'capacidad', 'prestable_relacionado_id', 'producto_id', 'proveedor_id', 'activo')
            ->orderBy('nombre')
            ->get();

        // ✅ Nuevo: Traer localidades para selección de ubicación
        $localidades = \App\Models\Localidad::select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('prestamos/eventos/crear', [
            'choferes' => $choferes,
            'almacenes' => $almacenes,
            'ventas' => $ventas,
            'vehiculos' => $vehiculos,
            'prestables' => $prestables, // ✅ Nuevo: prestables con stocks
            'localidades' => $localidades, // ✅ Nuevo: localidades para ubicación
        ]);
    }

    /**
     * Procesar creación de préstamo a evento
     * Nota: El procesamiento real se hace vía API /api/prestamos-evento
     */
    public function eventosStore(Request $request)
    {
        // Redirigir al index después de crear via API
        return redirect()->route('prestamos.eventos.index');
    }

    /**
     * Mostrar detalles de un préstamo a evento
     */
    public function eventosShow(\App\Models\PrestamoEvento $prestamo): Response
    {
        $prestamo->load([
            'almacen',
            'chofer',
            'creador', // Usuario que creó el préstamo
            'detalles' => fn($q) => $q
                ->with('prestable.condiciones')
                ->with('almacenes.almacen'),
            'devoluciones' => fn($q) => $q
                ->with([
                    'detalles' => fn($q2) => $q2
                        ->with('prestamoEventoDetalle.prestable') // ✅ Prestable del detalle original
                        ->with('devolucionesAlmacenes.almacen') // Almacén de devolución
                        ->with('devolucionesAlmacenes.detalleDevolucionEvento.prestamoEventoDetalle.prestable'), // ✅ Prestable a través de relación
                    'creador', // Usuario que creó la devolución
                    'anulador', // Usuario que anuló la devolución
                ]),
            // ✅ NUEVO (2026-07-03): Cargar ubicaciones con relaciones
            'ubicacion' => fn($q) => $q
                ->with(['direccionCliente.localidad', 'localidad']),
            'ubicaciones' => fn($q) => $q
                ->with(['direccionCliente.localidad', 'localidad']),
        ]);

        return Inertia::render('prestamos/eventos/show', [
            'prestamo' => $prestamo,
        ]);
    }

    /**
     * Reportes de préstamos
     */
    public function reportes(): Response
    {
        return Inertia::render('prestamos/reportes/index');
    }
}

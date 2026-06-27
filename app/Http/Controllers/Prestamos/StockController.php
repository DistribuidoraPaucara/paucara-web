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

        // Obtener TODOS los prestables activos
        $prestables = \App\Models\Prestable::where('activo', true)
            ->select('id', 'nombre', 'codigo', 'tipo', 'prestable_relacionado_id', 'embase_asociado_id')
            ->orderBy('tipo')
            ->orderBy('nombre')
            ->get();

        // Obtener items de stock existentes
        $stockExistente = PrestableStock::whereIn('almacenes_prestables_id', $almacenIds)
            ->with(['prestable', 'almacenPrestable'])
            ->get()
            ->keyBy(fn($stock) => "{$stock->prestable_id}_{$stock->almacenes_prestables_id}");

        // DEBUG: Verificar datos
        \Log::info('📊 stockClientes DEBUG', [
            'almacenes_clientes' => $almacenesClientes->pluck('nombre')->toArray(),
            'prestables_activos' => $prestables->pluck('nombre')->toArray(),
            'stock_existente_count' => $stockExistente->count(),
            'esperados' => count($almacenesClientes) . ' almacenes × ' . count($prestables) . ' prestables = ' . (count($almacenesClientes) * count($prestables)) . ' items'
        ]);

        // Generar todas las combinaciones de prestables + almacenes
        $items = [];
        foreach ($prestables as $prestable) {
            foreach ($almacenesClientes as $almacen) {
                $key = "{$prestable->id}_{$almacen->id}";
                $stock = $stockExistente->get($key);

                $cantidadClienteDeudor = $stock?->cantidad_cliente_deudor ?? 0;
                $cantidadClienteDañada = $stock?->cantidad_cliente_dañada ?? 0;
                $cantidadClienteTotal = $cantidadClienteDeudor + $cantidadClienteDañada;

                $cantidadEventoDeudor = $stock?->cantidad_evento_deudor ?? 0;
                $cantidadEventoDañada = $stock?->cantidad_evento_dañada ?? 0;
                $cantidadEventoTotal = $cantidadEventoDeudor + $cantidadEventoDañada;

                $items[] = [
                    'id' => $stock?->id ?? null,
                    'prestable_id' => $prestable->id,
                    'prestable_nombre' => $prestable->nombre,
                    'prestable_codigo' => $prestable->codigo,
                    'prestable_tipo' => $prestable->tipo,
                    'prestable_relacionado_id' => $prestable->prestable_relacionado_id,
                    'embase_asociado_id' => $prestable->embase_asociado_id,
                    'almacen_nombre' => $almacen->nombre,
                    'almacenes_prestables_id' => $almacen->id,
                    'cantidad_disponible' => $stock?->cantidad_disponible ?? 0,
                    'cantidad_cliente_deudor' => $cantidadClienteDeudor,
                    'cantidad_cliente_devuelto' => $stock?->cantidad_cliente_devuelto ?? 0,
                    'cantidad_cliente_dañada' => $cantidadClienteDañada,
                    'cantidad_cliente_total' => $cantidadClienteTotal,
                    'cantidad_evento_deudor' => $cantidadEventoDeudor,
                    'cantidad_evento_devuelto' => $stock?->cantidad_evento_devuelto ?? 0,
                    'cantidad_evento_dañada' => $cantidadEventoDañada,
                    'cantidad_evento_total' => $cantidadEventoTotal,
                    'cantidad_total' => ($stock?->cantidad_disponible ?? 0) + $cantidadClienteTotal,
                ];
            }
        }

        \Log::info('✅ Items generados: ' . count($items) . ' items totales');

        // Calcular resumen separado por tipo de prestable
        $itemsCollection = collect($items);
        $canastillas = $itemsCollection->where('prestable_tipo', 'CANASTILLA');
        $embases = $itemsCollection->where('prestable_tipo', 'EMBASES');

        // Resumen para clientes
        $resumenClientes = [
            'total' => [
                'disponible' => $itemsCollection->sum('cantidad_disponible'),
                'deudor' => $itemsCollection->sum('cantidad_cliente_deudor'),
                'dañada' => $itemsCollection->sum('cantidad_cliente_dañada'),
                'total' => $itemsCollection->sum('cantidad_cliente_total'),
            ],
            'canastillas' => [
                'disponible' => $canastillas->sum('cantidad_disponible'),
                'deudor' => $canastillas->sum('cantidad_cliente_deudor'),
                'dañada' => $canastillas->sum('cantidad_cliente_dañada'),
                'total' => $canastillas->sum('cantidad_cliente_total'),
            ],
            'embases' => [
                'disponible' => $embases->sum('cantidad_disponible'),
                'deudor' => $embases->sum('cantidad_cliente_deudor'),
                'dañada' => $embases->sum('cantidad_cliente_dañada'),
                'total' => $embases->sum('cantidad_cliente_total'),
            ],
        ];

        // Resumen para eventos
        $resumenEventos = [
            'total' => [
                'disponible' => $itemsCollection->sum('cantidad_disponible'),
                'deudor' => $itemsCollection->sum('cantidad_evento_deudor'),
                'dañada' => $itemsCollection->sum('cantidad_evento_dañada'),
                'total' => $itemsCollection->sum('cantidad_evento_total'),
            ],
            'canastillas' => [
                'disponible' => $canastillas->sum('cantidad_disponible'),
                'deudor' => $canastillas->sum('cantidad_evento_deudor'),
                'dañada' => $canastillas->sum('cantidad_evento_dañada'),
                'total' => $canastillas->sum('cantidad_evento_total'),
            ],
            'embases' => [
                'disponible' => $embases->sum('cantidad_disponible'),
                'deudor' => $embases->sum('cantidad_evento_deudor'),
                'dañada' => $embases->sum('cantidad_evento_dañada'),
                'total' => $embases->sum('cantidad_evento_total'),
            ],
        ];

        $resumen = [
            'clientes' => $resumenClientes,
            'eventos' => $resumenEventos,
        ];

        return Inertia::render('prestamos/stock-clientes', [
            'items' => $items,
            'resumen' => $resumen,
            'almacenes' => $almacenesClientes->toArray(),
        ]);
    }

    /**
     * GET /prestamos/stock/eventos
     * Stock de almacenes para eventos
     */
    public function stockEventos()
    {
        // Obtener almacenes de clientes (es_proveedor = false) para eventos
        $almacenesClientes = AlmacenPrestable::where('es_proveedor', false)
            ->select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        $almacenIds = $almacenesClientes->pluck('id')->toArray();

        // Obtener TODOS los prestables activos (ordenar por tipo y nombre para agrupar canastillas y embases)
        $prestables = \App\Models\Prestable::where('activo', true)
            ->select('id', 'nombre', 'codigo', 'tipo', 'prestable_relacionado_id', 'embase_asociado_id')
            ->orderBy('tipo')
            ->orderBy('nombre')
            ->get();

        // Obtener items de stock existentes
        $stockExistente = PrestableStock::whereIn('almacenes_prestables_id', $almacenIds)
            ->with(['prestable', 'almacenPrestable'])
            ->get()
            ->keyBy(fn($stock) => "{$stock->prestable_id}_{$stock->almacenes_prestables_id}");

        // Generar todas las combinaciones de prestables + almacenes
        $items = [];
        foreach ($prestables as $prestable) {
            foreach ($almacenesClientes as $almacen) {
                $key = "{$prestable->id}_{$almacen->id}";
                $stock = $stockExistente->get($key);

                $cantidadClienteDeudor = $stock?->cantidad_cliente_deudor ?? 0;
                $cantidadClienteDañada = $stock?->cantidad_cliente_dañada ?? 0;
                $cantidadClienteTotal = $cantidadClienteDeudor + $cantidadClienteDañada;

                $cantidadEventoDeudor = $stock?->cantidad_evento_deudor ?? 0;
                $cantidadEventoDañada = $stock?->cantidad_evento_dañada ?? 0;
                $cantidadEventoTotal = $cantidadEventoDeudor + $cantidadEventoDañada;

                $items[] = [
                    'id' => $stock?->id ?? null,
                    'prestable_id' => $prestable->id,
                    'prestable_nombre' => $prestable->nombre,
                    'prestable_codigo' => $prestable->codigo,
                    'prestable_tipo' => $prestable->tipo,
                    'prestable_relacionado_id' => $prestable->prestable_relacionado_id,
                    'embase_asociado_id' => $prestable->embase_asociado_id,
                    'almacen_nombre' => $almacen->nombre,
                    'almacenes_prestables_id' => $almacen->id,
                    'cantidad_disponible' => $stock?->cantidad_disponible ?? 0,
                    'cantidad_cliente_deudor' => $cantidadClienteDeudor,
                    'cantidad_cliente_devuelto' => $stock?->cantidad_cliente_devuelto ?? 0,
                    'cantidad_cliente_dañada' => $cantidadClienteDañada,
                    'cantidad_cliente_total' => $cantidadClienteTotal,
                    'cantidad_evento_deudor' => $cantidadEventoDeudor,
                    'cantidad_evento_devuelto' => $stock?->cantidad_evento_devuelto ?? 0,
                    'cantidad_evento_dañada' => $cantidadEventoDañada,
                    'cantidad_evento_total' => $cantidadEventoTotal,
                    'cantidad_total' => ($stock?->cantidad_disponible ?? 0) + $cantidadEventoTotal,
                ];
            }
        }

        // Calcular resumen separado por tipo de prestable
        $itemsCollection = collect($items);
        $canastillas = $itemsCollection->where('prestable_tipo', 'CANASTILLA');
        $embases = $itemsCollection->where('prestable_tipo', 'EMBASES');

        // Resumen para clientes
        $resumenClientes = [
            'total' => [
                'disponible' => $itemsCollection->sum('cantidad_disponible'),
                'deudor' => $itemsCollection->sum('cantidad_cliente_deudor'),
                'dañada' => $itemsCollection->sum('cantidad_cliente_dañada'),
                'total' => $itemsCollection->sum('cantidad_cliente_total'),
            ],
            'canastillas' => [
                'disponible' => $canastillas->sum('cantidad_disponible'),
                'deudor' => $canastillas->sum('cantidad_cliente_deudor'),
                'dañada' => $canastillas->sum('cantidad_cliente_dañada'),
                'total' => $canastillas->sum('cantidad_cliente_total'),
            ],
            'embases' => [
                'disponible' => $embases->sum('cantidad_disponible'),
                'deudor' => $embases->sum('cantidad_cliente_deudor'),
                'dañada' => $embases->sum('cantidad_cliente_dañada'),
                'total' => $embases->sum('cantidad_cliente_total'),
            ],
        ];

        // Resumen para eventos
        $resumenEventos = [
            'total' => [
                'disponible' => $itemsCollection->sum('cantidad_disponible'),
                'deudor' => $itemsCollection->sum('cantidad_evento_deudor'),
                'dañada' => $itemsCollection->sum('cantidad_evento_dañada'),
                'total' => $itemsCollection->sum('cantidad_evento_total'),
            ],
            'canastillas' => [
                'disponible' => $canastillas->sum('cantidad_disponible'),
                'deudor' => $canastillas->sum('cantidad_evento_deudor'),
                'dañada' => $canastillas->sum('cantidad_evento_dañada'),
                'total' => $canastillas->sum('cantidad_evento_total'),
            ],
            'embases' => [
                'disponible' => $embases->sum('cantidad_disponible'),
                'deudor' => $embases->sum('cantidad_evento_deudor'),
                'dañada' => $embases->sum('cantidad_evento_dañada'),
                'total' => $embases->sum('cantidad_evento_total'),
            ],
        ];

        $resumen = [
            'clientes' => $resumenClientes,
            'eventos' => $resumenEventos,
        ];

        return Inertia::render('prestamos/stock-eventos', [
            'items' => $items,
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

        // Obtener TODOS los prestables activos (ordenar por tipo y nombre para agrupar canastillas y embases)
        $prestables = \App\Models\Prestable::where('activo', true)
            ->select('id', 'nombre', 'codigo', 'tipo', 'prestable_relacionado_id', 'embase_asociado_id')
            ->orderBy('tipo')
            ->orderBy('nombre')
            ->get();

        // Obtener items de stock existentes
        $stockExistente = PrestableStock::whereIn('almacenes_prestables_id', $almacenIds)
            ->with(['prestable', 'almacenPrestable'])
            ->get()
            ->keyBy(fn($stock) => "{$stock->prestable_id}_{$stock->almacenes_prestables_id}");

        // Generar todas las combinaciones de prestables + almacenes
        $items = [];
        foreach ($prestables as $prestable) {
            foreach ($almacenesProveedores as $almacen) {
                $key = "{$prestable->id}_{$almacen->id}";
                $stock = $stockExistente->get($key);

                $cantidadClienteDeudor = $stock?->cantidad_cliente_deudor ?? 0;
                $cantidadClienteDañada = $stock?->cantidad_cliente_dañada ?? 0;
                $cantidadClienteTotal = $cantidadClienteDeudor + $cantidadClienteDañada;

                $cantidadProveedorAcreedor = $stock?->cantidad_proveedor_acreedor ?? 0;
                $cantidadProveedorDañada = $stock?->cantidad_proveedor_dañada ?? 0;
                $cantidadProveedorTotal = $cantidadProveedorAcreedor + $cantidadProveedorDañada;

                $items[] = [
                    'id' => $stock?->id ?? null,
                    'prestable_id' => $prestable->id,
                    'prestable_nombre' => $prestable->nombre,
                    'prestable_codigo' => $prestable->codigo,
                    'prestable_tipo' => $prestable->tipo,
                    'prestable_relacionado_id' => $prestable->prestable_relacionado_id,
                    'embase_asociado_id' => $prestable->embase_asociado_id,
                    'almacen_nombre' => $almacen->nombre,
                    'almacenes_prestables_id' => $almacen->id,
                    'cantidad_disponible' => $stock?->cantidad_disponible ?? 0,
                    'cantidad_cliente_deudor' => $cantidadClienteDeudor,
                    'cantidad_cliente_devuelto' => $stock?->cantidad_cliente_devuelto ?? 0,
                    'cantidad_cliente_dañada' => $cantidadClienteDañada,
                    'cantidad_cliente_total' => $cantidadClienteTotal,
                    'cantidad_proveedor_acreedor' => $cantidadProveedorAcreedor,
                    'cantidad_proveedor_devuelto' => $stock?->cantidad_proveedor_devuelto ?? 0,
                    'cantidad_proveedor_dañada' => $cantidadProveedorDañada,
                    'cantidad_proveedor_total' => $cantidadProveedorTotal,
                    'cantidad_evento_deudor' => $stock?->cantidad_evento_deudor ?? 0,
                    'cantidad_evento_devuelto' => $stock?->cantidad_evento_devuelto ?? 0,
                    'cantidad_evento_dañada' => $stock?->cantidad_evento_dañada ?? 0,
                    'cantidad_total' => ($stock?->cantidad_disponible ?? 0) + $cantidadClienteTotal + $cantidadProveedorTotal,
                ];
            }
        }

        // Calcular resumen separado por tipo de prestable (clientes + proveedores)
        $itemsCollection = collect($items);
        $canastillas = $itemsCollection->where('prestable_tipo', 'CANASTILLA');
        $embases = $itemsCollection->where('prestable_tipo', 'EMBASES');

        // Resumen para clientes
        $resumenClientes = [
            'total' => [
                'disponible' => $itemsCollection->sum('cantidad_disponible'),
                'deudor' => $itemsCollection->sum('cantidad_cliente_deudor'),
                'dañada' => $itemsCollection->sum('cantidad_cliente_dañada'),
                'total' => $itemsCollection->sum('cantidad_cliente_total'),
            ],
            'canastillas' => [
                'disponible' => $canastillas->sum('cantidad_disponible'),
                'deudor' => $canastillas->sum('cantidad_cliente_deudor'),
                'dañada' => $canastillas->sum('cantidad_cliente_dañada'),
                'total' => $canastillas->sum('cantidad_cliente_total'),
            ],
            'embases' => [
                'disponible' => $embases->sum('cantidad_disponible'),
                'deudor' => $embases->sum('cantidad_cliente_deudor'),
                'dañada' => $embases->sum('cantidad_cliente_dañada'),
                'total' => $embases->sum('cantidad_cliente_total'),
            ],
        ];

        // Resumen para proveedores
        $resumenProveedores = [
            'total' => [
                'disponible' => $itemsCollection->sum('cantidad_disponible'),
                'deudor' => $itemsCollection->sum('cantidad_proveedor_acreedor'),
                'dañada' => $itemsCollection->sum('cantidad_proveedor_dañada'),
                'total' => $itemsCollection->sum('cantidad_proveedor_total'),
            ],
            'canastillas' => [
                'disponible' => $canastillas->sum('cantidad_disponible'),
                'deudor' => $canastillas->sum('cantidad_proveedor_acreedor'),
                'dañada' => $canastillas->sum('cantidad_proveedor_dañada'),
                'total' => $canastillas->sum('cantidad_proveedor_total'),
            ],
            'embases' => [
                'disponible' => $embases->sum('cantidad_disponible'),
                'deudor' => $embases->sum('cantidad_proveedor_acreedor'),
                'dañada' => $embases->sum('cantidad_proveedor_dañada'),
                'total' => $embases->sum('cantidad_proveedor_total'),
            ],
        ];

        // Resumen para eventos
        $totalEventoDeudor = $itemsCollection->sum('cantidad_evento_deudor');
        $totalEventoDañada = $itemsCollection->sum('cantidad_evento_dañada');

        $canastillasEventoDeudor = $canastillas->sum('cantidad_evento_deudor');
        $canastillasEventoDañada = $canastillas->sum('cantidad_evento_dañada');

        $embasesEventoDeudor = $embases->sum('cantidad_evento_deudor');
        $embasesEventoDañada = $embases->sum('cantidad_evento_dañada');

        $resumenEventos = [
            'total' => [
                'disponible' => $itemsCollection->sum('cantidad_disponible'),
                'deudor' => $totalEventoDeudor,
                'dañada' => $totalEventoDañada,
                'total' => $totalEventoDeudor + $totalEventoDañada,
            ],
            'canastillas' => [
                'disponible' => $canastillas->sum('cantidad_disponible'),
                'deudor' => $canastillasEventoDeudor,
                'dañada' => $canastillasEventoDañada,
                'total' => $canastillasEventoDeudor + $canastillasEventoDañada,
            ],
            'embases' => [
                'disponible' => $embases->sum('cantidad_disponible'),
                'deudor' => $embasesEventoDeudor,
                'dañada' => $embasesEventoDañada,
                'total' => $embasesEventoDeudor + $embasesEventoDañada,
            ],
        ];

        $resumen = [
            'clientes' => $resumenClientes,
            'proveedores' => $resumenProveedores,
            'eventos' => $resumenEventos,
        ];

        return Inertia::render('prestamos/stock-proveedores', [
            'items' => $items,
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
        if (!in_array($tipo, ['clientes', 'eventos', 'proveedores'])) {
            abort(404);
        }

        // Obtener o crear el item de stock
        $stock = PrestableStock::firstOrCreate(
            [
                'prestable_id' => $prestable_id,
                'almacenes_prestables_id' => $almacen_id,
            ],
            [
                'cantidad_disponible' => 0,
                'cantidad_cliente_deudor' => 0,
                'cantidad_cliente_devuelto' => 0,
                'cantidad_cliente_dañada' => 0,
                'cantidad_evento_deudor' => 0,
                'cantidad_evento_devuelto' => 0,
                'cantidad_evento_dañada' => 0,
                'cantidad_proveedor_acreedor' => 0,
                'cantidad_proveedor_devuelto' => 0,
                'cantidad_proveedor_dañada' => 0,
            ]
        );

        $stock->load(['prestable', 'almacenPrestable']);

        // Construir el item según el tipo
        $item = [
            'id' => $stock->id,
            'prestable_id' => $stock->prestable_id,
            'prestable_nombre' => $stock->prestable->nombre,
            'prestable_codigo' => $stock->prestable->codigo,
            'prestable_tipo' => $stock->prestable->tipo,
            'prestable_capacidad' => $stock->prestable->capacidad ?? null,
            'almacen_nombre' => $stock->almacenPrestable->nombre,
            'almacen_tipo' => $stock->almacenPrestable->es_proveedor ? 'Proveedor' : 'Distribuidora',
            'cantidad_disponible' => $stock->cantidad_disponible ?? 0,
        ];

        if ($tipo === 'clientes') {
            $item['cantidad_cliente_deudor'] = $stock->cantidad_cliente_deudor ?? 0;
            $item['cantidad_cliente_devuelto'] = $stock->cantidad_cliente_devuelto ?? 0;
            $item['cantidad_cliente_dañada'] = $stock->cantidad_cliente_dañada ?? 0;
        } elseif ($tipo === 'eventos') {
            $item['cantidad_evento_deudor'] = $stock->cantidad_evento_deudor ?? 0;
            $item['cantidad_evento_devuelto'] = $stock->cantidad_evento_devuelto ?? 0;
            $item['cantidad_evento_dañada'] = $stock->cantidad_evento_dañada ?? 0;
        } else {
            $item['cantidad_proveedor_acreedor'] = $stock->cantidad_proveedor_acreedor ?? 0;
            $item['cantidad_proveedor_devuelto'] = $stock->cantidad_proveedor_devuelto ?? 0;
            $item['cantidad_proveedor_dañada'] = $stock->cantidad_proveedor_dañada ?? 0;
        }

        // Si es CANASTILLA, buscar EMBASE que la tiene como relacionada
        $embaseRelacionado = null;
        if ($stock->prestable->tipo === 'CANASTILLA') {
            \Log::info('🔍 Buscando embase para canastilla', [
                'canastilla_id' => $stock->prestable_id,
                'canastilla_nombre' => $stock->prestable->nombre,
                'almacen_id' => $almacen_id,
            ]);

            // 1️⃣ PRIMERO: Buscar en PrestableStock
            $embaseStock = PrestableStock::whereHas('prestable', function ($q) use ($stock) {
                $q->where('prestable_relacionado_id', $stock->prestable_id)
                  ->where('tipo', 'EMBASES');
            })
                ->where('almacenes_prestables_id', $almacen_id)
                ->with('prestable')
                ->first();

            if ($embaseStock) {
                \Log::info('✅ Embase encontrado en PrestableStock', [
                    'embase_id' => $embaseStock->prestable_id,
                    'embase_nombre' => $embaseStock->prestable->nombre,
                ]);

                $embaseRelacionado = [
                    'id' => $embaseStock->id,
                    'prestable_id' => $embaseStock->prestable_id,
                    'prestable_nombre' => $embaseStock->prestable->nombre,
                    'prestable_codigo' => $embaseStock->prestable->codigo,
                    'cantidad_disponible' => $embaseStock->cantidad_disponible ?? 0,
                ];

                // Agregar solo los campos del tipo correspondiente
                if ($tipo === 'clientes') {
                    $embaseRelacionado['cantidad_cliente_deudor'] = $embaseStock->cantidad_cliente_deudor ?? 0;
                    $embaseRelacionado['cantidad_cliente_devuelto'] = $embaseStock->cantidad_cliente_devuelto ?? 0;
                    $embaseRelacionado['cantidad_cliente_dañada'] = $embaseStock->cantidad_cliente_dañada ?? 0;
                } elseif ($tipo === 'eventos') {
                    $embaseRelacionado['cantidad_evento_deudor'] = $embaseStock->cantidad_evento_deudor ?? 0;
                    $embaseRelacionado['cantidad_evento_devuelto'] = $embaseStock->cantidad_evento_devuelto ?? 0;
                    $embaseRelacionado['cantidad_evento_dañada'] = $embaseStock->cantidad_evento_dañada ?? 0;
                } else {
                    $embaseRelacionado['cantidad_proveedor_acreedor'] = $embaseStock->cantidad_proveedor_acreedor ?? 0;
                    $embaseRelacionado['cantidad_proveedor_devuelto'] = $embaseStock->cantidad_proveedor_devuelto ?? 0;
                    $embaseRelacionado['cantidad_proveedor_dañada'] = $embaseStock->cantidad_proveedor_dañada ?? 0;
                }
            } else {
                \Log::warning('⚠️ Embase NO encontrado en PrestableStock, buscando en Prestable...', [
                    'canastilla_id' => $stock->prestable_id,
                    'almacen_id' => $almacen_id,
                ]);

                // 2️⃣ FALLBACK: Buscar el embase en tabla Prestable
                $embasePrestable = \App\Models\Prestable::where('prestable_relacionado_id', $stock->prestable_id)
                    ->where('tipo', 'EMBASES')
                    ->first();

                if ($embasePrestable) {
                    \Log::info('✅ Embase encontrado en Prestable, creando registro en PrestableStock', [
                        'embase_id' => $embasePrestable->id,
                        'embase_nombre' => $embasePrestable->nombre,
                    ]);

                    // 3️⃣ CREAR: Registro en PrestableStock con stock = 0
                    $embaseStock = PrestableStock::firstOrCreate(
                        [
                            'prestable_id' => $embasePrestable->id,
                            'almacenes_prestables_id' => $almacen_id,
                        ],
                        [
                            'cantidad_disponible' => 0,
                            'cantidad_cliente_deudor' => 0,
                            'cantidad_cliente_devuelto' => 0,
                            'cantidad_evento_deudor' => 0,
                            'cantidad_evento_devuelto' => 0,
                            'cantidad_proveedor_acreedor' => 0,
                            'cantidad_proveedor_devuelto' => 0,
                            'cantidad_cliente_dañada' => 0,
                            'cantidad_evento_dañada' => 0,
                            'cantidad_proveedor_dañada' => 0,
                        ]
                    );

                    $embaseRelacionado = [
                        'id' => $embaseStock->id,
                        'prestable_id' => $embasePrestable->id,
                        'prestable_nombre' => $embasePrestable->nombre,
                        'prestable_codigo' => $embasePrestable->codigo,
                        'cantidad_disponible' => 0,
                    ];

                    // Agregar solo los campos del tipo correspondiente
                    if ($tipo === 'clientes') {
                        $embaseRelacionado['cantidad_cliente_deudor'] = 0;
                        $embaseRelacionado['cantidad_cliente_devuelto'] = 0;
                        $embaseRelacionado['cantidad_cliente_dañada'] = 0;
                    } elseif ($tipo === 'eventos') {
                        $embaseRelacionado['cantidad_evento_deudor'] = 0;
                        $embaseRelacionado['cantidad_evento_devuelto'] = 0;
                        $embaseRelacionado['cantidad_evento_dañada'] = 0;
                    } else {
                        $embaseRelacionado['cantidad_proveedor_acreedor'] = 0;
                        $embaseRelacionado['cantidad_proveedor_devuelto'] = 0;
                        $embaseRelacionado['cantidad_proveedor_dañada'] = 0;
                    }

                    \Log::info('✅ Registro creado en PrestableStock', [
                        'embase_nombre' => $embasePrestable->nombre,
                        'almacen_id' => $almacen_id,
                    ]);
                } else {
                    \Log::error('❌ Embase NO encontrado en Prestable tampoco', [
                        'canastilla_id' => $stock->prestable_id,
                    ]);
                }
            }
        }

        // Opciones de motivos predefinidos
        $motivosOptions = [
            'Ajuste por conteo físico',
            'Ajuste administrativo',
            'Ajuste inicial',
            'Discrepancia de inventario',
            'Daño o deterioro',
            'Pérdida',
            'Devolución incompleta',
            'Otro',
        ];

        return Inertia::render('prestamos/stock/ajuste', [
            'prestable_id' => $prestable_id,
            'almacen_id' => $almacen_id,
            'tipo' => $tipo,
            'item' => $item,
            'embaseRelacionado' => $embaseRelacionado,
            'motivosOptions' => $motivosOptions,
        ]);
    }
}

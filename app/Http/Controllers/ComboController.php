<?php

namespace App\Http\Controllers;

use App\Models\ComboItem;
use App\Models\ComboGrupo;
use App\Models\ComboGrupoItem;
use App\Models\Producto;
use App\Models\PrecioProducto;
use App\Models\TipoPrecio;
use App\Services\ComboStockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ComboController extends Controller
{
    public function index(): Response
    {
        $combos = Producto::where('es_combo', true)
            ->when(auth()->user()?->empresa_id, fn($q, $id) => $q->where('empresa_id', $id))
            ->with('comboItems.producto:id,nombre,sku')
            ->orderByDesc('id')
            ->paginate(15)
            ->through(function (Producto $combo) {
                return [
                    'id'             => $combo->id,
                    'nombre'         => $combo->nombre,
                    'sku'            => $combo->sku,
                    'precio_venta'   => (float) $combo->precio_venta,
                    'subtotal_costo' => round($combo->comboItems->sum(
                        fn($item) => (float) $item->precio_unitario * (float) $item->cantidad
                    ), 2),
                    'cantidad_items' => $combo->comboItems->count(),
                    'activo'         => $combo->activo,
                ];
            });

        return Inertia::render('combos/index', ['combos' => $combos]);
    }

    public function create(): Response
    {
        return Inertia::render('combos/form', $this->formProps());
    }

    public function store(Request $request): RedirectResponse
    {
        $this->validarRequest($request);

        $combo = null;

        try {
            DB::transaction(function () use ($request, &$combo) {
                $this->validarItems($request->items, $request->grupo_opcional ?? null);

                $combo = Producto::create([
                    'sku'            => $request->sku,
                    'nombre'         => $request->nombre,
                    'descripcion'    => $request->descripcion,
                    'precio_venta'   => $request->precio_venta,
                    'es_combo'       => true,
                    'activo'         => true,
                    'empresa_id'     => auth()->user()?->empresa_id,
                    'fecha_creacion' => now(),
                ]);

                $this->crearItems($combo->id, $request->items);

                // Crear grupo opcional si existe
                if (!empty($request->grupo_opcional)) {
                    $this->crearGrupo($combo->id, $request->grupo_opcional);
                }

                // Crear precios para el combo (venta y costo con el mismo valor)
                $this->crearPreciosProducto($combo->id, $request->precio_venta);

                Log::info('✅ [ComboController::store] Combo creado', [
                    'combo_id'       => $combo->id,
                    'sku'            => $combo->sku,
                    'cantidad_items' => count($request->items),
                ]);
            });

            return redirect()->route('combos.index')
                ->with('success', "Combo \"{$combo->nombre}\" creado exitosamente.");
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return back()
                ->withErrors(['sku' => 'El SKU ya existe. Por favor, usa un SKU único.'])
                ->withInput();
        } catch (\Exception $e) {
            Log::error('❌ [ComboController::store] Error al crear combo', [
                'error' => $e->getMessage(),
                'sku'   => $request->sku,
            ]);

            return back()
                ->withErrors(['general' => 'Ocurrió un error al crear el combo. Por favor, intenta nuevamente.'])
                ->withInput();
        }
    }

    public function show(Producto $combo): Response
    {
        abort_unless($combo->es_combo, 404);
        $combo->load(
            'comboItems.producto:id,nombre,sku',
            'comboItems.tipoPrecio:id,nombre',
            'comboGrupos.items.producto:id,nombre,sku'
        );

        return Inertia::render('combos/show', ['combo' => $this->serializarCombo($combo)]);
    }

    public function edit(Producto $combo): Response
    {
        abort_unless($combo->es_combo, 404);
        $combo->load(
            'comboItems.producto:id,nombre,sku',
            'comboItems.tipoPrecio:id,nombre',
            'comboGrupos.items.producto:id,nombre,sku'
        );

        return Inertia::render('combos/form', array_merge(
            $this->formProps(),
            ['combo' => $this->serializarCombo($combo)]
        ));
    }

    public function update(Request $request, Producto $combo): RedirectResponse
    {
        abort_unless($combo->es_combo, 404);
        $this->validarRequest($request, $combo->id);

        DB::transaction(function () use ($request, $combo) {
            $this->validarItems($request->items, $request->grupo_opcional ?? null, comboId: $combo->id);

            $combo->update([
                'sku'            => $request->sku,
                'nombre'         => $request->nombre,
                'descripcion'    => $request->descripcion,
                'precio_venta'   => $request->precio_venta,
            ]);

            // Delete-and-recreate atómico (mismo patrón que codigos_barra en ProductoController)
            $combo->comboItems()->delete();
            $combo->comboGrupos()->delete(); // Eliminar grupos opcionales
            $this->crearItems($combo->id, $request->items);

            // Crear grupo opcional si existe
            if (!empty($request->grupo_opcional)) {
                $this->crearGrupo($combo->id, $request->grupo_opcional);
            }

            // Actualizar precios del combo (eliminar antiguos y crear nuevos)
            $combo->precios()->delete();
            $this->crearPreciosProducto($combo->id, $request->precio_venta);

            Log::info('✅ [ComboController::update] Combo actualizado', [
                'combo_id'       => $combo->id,
                'sku'            => $combo->sku,
                'cantidad_items' => count($request->items),
            ]);
        });

        return redirect()->route('combos.index')
            ->with('success', "Combo \"{$combo->nombre}\" actualizado exitosamente.");
    }

    public function destroy(Producto $combo): RedirectResponse
    {
        abort_unless($combo->es_combo, 404);

        // Verificar si el combo está siendo usado en detalle_proformas
        $tieneReferencias = DB::table('detalle_proformas')
            ->where('producto_id', $combo->id)
            ->exists();

        if ($tieneReferencias) {
            return back()
                ->withErrors(['delete' => 'No se puede eliminar este combo porque ya ha sido utilizado en una proforma o documento. Debes eliminar primero las referencias existentes.']);
        }

        try {
            $combo->delete(); // cascade borra combo_items
            Log::info('✅ [ComboController::destroy] Combo eliminado', [
                'combo_id' => $combo->id,
                'nombre' => $combo->nombre,
            ]);
            return redirect()->route('combos.index')
                ->with('success', 'Combo eliminado exitosamente.');
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('❌ [ComboController::destroy] Error al eliminar combo', [
                'combo_id' => $combo->id,
                'error' => $e->getMessage(),
            ]);
            return back()
                ->withErrors(['delete' => 'Ocurrió un error al eliminar el combo. Por favor, intenta nuevamente.']);
        }
    }

    // ── Privados ────────────────────────────────────────────────

    private function validarRequest(Request $request, ?int $comboId = null): void
    {
        // Normalizar el SKU a mayúsculas
        $skuNormalizado = strtoupper(trim($request->sku ?? ''));

        // Validación personalizada (closure) para verificar SKU duplicado (case-insensitive)
        $validarSkuUnico = function ($attribute, $value, $fail) use ($comboId, $skuNormalizado) {
            $existe = Producto::whereRaw('UPPER(sku) = ?', [$skuNormalizado])
                ->when($comboId, fn($q) => $q->where('id', '!=', $comboId))
                ->exists();

            if ($existe) {
                $fail('El SKU ya existe. Por favor, usa un SKU único.');
            }
        };

        $request->validate([
            'sku'                             => ['required', 'string', 'min:2', 'max:255', $validarSkuUnico],
            'nombre'                          => ['required', 'string', 'min:2', 'max:255'],
            'descripcion'                     => ['nullable', 'string', 'max:1000'],
            'precio_venta'                    => ['required', 'numeric', 'min:0'],
            'items'                           => ['required', 'array', 'min:1'],
            'items.*.producto_id'             => ['required', 'integer', 'exists:productos,id'],
            'items.*.cantidad'                => ['required', 'numeric', 'min:0'],
            'items.*.precio_unitario'         => ['required', 'numeric', 'min:0'],
            'items.*.tipo_precio_id'          => ['nullable', 'integer', 'exists:tipos_precio,id'],
            'items.*.es_obligatorio'          => ['required', 'boolean'],
            'items.*.grupo_opcional'          => ['nullable', 'string', 'min:2', 'max:50'],
            'grupo_opcional'                  => ['nullable', 'array'],
            'grupo_opcional.productos'        => ['nullable', 'array'],
            'grupo_opcional.cantidad_a_llevar' => ['nullable', 'integer', 'min:1'],
            'grupo_opcional.precio_grupo'     => ['nullable', 'numeric', 'min:0'],
        ], [
            'sku.required' => 'El SKU es requerido.',
            'nombre.required' => 'El nombre es requerido.',
            'items.required' => 'Debes agregar al menos un producto al combo.',
            'items.min' => 'Debes agregar al menos un producto al combo.',
        ]);
    }

    private function validarItems(array $items, ?array $grupoOpcional = null, ?int $comboId = null): void
    {
        $productosIds = array_column($items, 'producto_id');

        if (count($productosIds) !== count(array_unique($productosIds))) {
            abort(422, 'No se puede agregar el mismo producto dos veces al combo.');
        }

        if ($comboId && in_array($comboId, $productosIds)) {
            abort(422, 'Un combo no puede contener a sí mismo.');
        }

        $otrosCombos = Producto::whereIn('id', $productosIds)->where('es_combo', true)->pluck('nombre');
        if ($otrosCombos->isNotEmpty()) {
            abort(422, 'Los siguientes son combos y no pueden ser componentes: ' . $otrosCombos->implode(', '));
        }

        $inactivos = Producto::whereIn('id', $productosIds)->where('activo', false)->pluck('nombre');
        if ($inactivos->isNotEmpty()) {
            abort(422, 'Productos inactivos: ' . $inactivos->implode(', '));
        }

        // ✅ Validar que haya al menos 1 producto obligatorio
        $obligatorios = array_filter($items, fn($item) => $item['es_obligatorio'] ?? true);
        if (empty($obligatorios)) {
            abort(422, 'El combo debe tener al menos 1 producto obligatorio.');
        }

        // ✅ Validar cantidad: todos los productos deben tener cantidad > 0 como referencia
        foreach ($items as $index => $item) {
            $cantidad = $item['cantidad'] ?? 0;

            if ($cantidad <= 0) {
                abort(422, "Producto en posición " . ($index + 1) . " debe tener cantidad mayor a 0.");
            }
        }

        // ✅ Si existe grupo opcional, validar su estructura
        if ($grupoOpcional) {
            $productosGrupo = $grupoOpcional['productos'] ?? [];
            $cantidadALlevar = $grupoOpcional['cantidad_a_llevar'] ?? 2;
            $precioGrupo = $grupoOpcional['precio_grupo'] ?? 0;

            if (empty($productosGrupo)) {
                abort(422, 'El grupo opcional debe tener al menos 1 producto.');
            }

            if ($cantidadALlevar < 1) {
                abort(422, 'La cantidad a llevar del grupo debe ser al menos 1.');
            }

            if ($precioGrupo < 0) {
                abort(422, 'El precio del grupo debe ser mayor o igual a 0.');
            }

            Log::info('✅ [ComboController::validarItems] Grupo opcional validado', [
                'productos_en_grupo' => count($productosGrupo),
                'cantidad_a_llevar' => $cantidadALlevar,
                'precio_grupo' => $precioGrupo,
            ]);
        }

        Log::info('✅ [ComboController::validarItems] Items validados correctamente', [
            'total_items' => count($items),
            'obligatorios' => count($obligatorios),
        ]);
    }

    private function crearItems(int $comboId, array $items): void
    {
        foreach ($items as $item) {
            ComboItem::create([
                'combo_id'        => $comboId,
                'producto_id'     => $item['producto_id'],
                'cantidad'        => $item['cantidad'],
                'precio_unitario' => $item['precio_unitario'],
                'tipo_precio_id'  => $item['tipo_precio_id'] ?? null,
                'es_obligatorio'  => $item['es_obligatorio'] ?? true,
                'grupo_opcional'  => $item['grupo_opcional'] ?? null,
            ]);
        }
    }

    private function crearGrupo(int $comboId, array $grupoOpcional): void
    {
        $nombreGrupo = $grupoOpcional['nombre_grupo'] ?? '';
        $productosIds = $grupoOpcional['productos'] ?? [];
        $cantidadALlevar = $grupoOpcional['cantidad_a_llevar'] ?? 2;
        $precioGrupo = $grupoOpcional['precio_grupo'] ?? 0;

        if (empty($nombreGrupo) || empty($productosIds)) {
            return;
        }

        // Crear el grupo
        $grupo = ComboGrupo::create([
            'combo_id'           => $comboId,
            'nombre_grupo'       => $nombreGrupo,
            'cantidad_a_llevar'  => $cantidadALlevar,
            'precio_grupo'       => $precioGrupo,
        ]);

        // Agregar productos al grupo
        foreach ($productosIds as $productoId) {
            ComboGrupoItem::create([
                'grupo_id'    => $grupo->id,
                'producto_id' => $productoId,
            ]);
        }

        Log::info('✅ [ComboController::crearGrupo] Grupo opcional creado', [
            'grupo_id'          => $grupo->id,
            'nombre_grupo'      => $nombreGrupo,
            'productos'         => count($productosIds),
            'cantidad_a_llevar' => $cantidadALlevar,
            'precio_grupo'      => $precioGrupo,
        ]);
    }

    private function crearPreciosProducto(int $comboId, float $precioVenta): void
    {
        // Obtener los tipos de precio para "venta" y "costo"
        $tipoVenta = TipoPrecio::activos()->where('es_ganancia', true)->first();
        $tipoCosto = TipoPrecio::activos()->where('es_ganancia', false)->first();

        // Si existe tipo venta, crear precio para venta
        if ($tipoVenta) {
            PrecioProducto::create([
                'producto_id'    => $comboId,
                'tipo_precio_id' => $tipoVenta->id,
                'precio'         => $precioVenta,
                'activo'         => true,
            ]);
        }

        // Si existe tipo costo, crear precio para costo (mismo valor)
        if ($tipoCosto) {
            PrecioProducto::create([
                'producto_id'    => $comboId,
                'tipo_precio_id' => $tipoCosto->id,
                'precio'         => $precioVenta,
                'activo'         => true,
            ]);
        }
    }

    private function formProps(): array
    {
        return [
            'tipos_precio' => TipoPrecio::activos()->ordenados()->get(['id', 'nombre', 'codigo'])->toArray(),
        ];
    }

    private function serializarCombo(Producto $combo, ?int $almacenId = null): array
    {
        // ✅ CORREGIDO: Si no se proporciona almacen_id, usar el almacén principal
        if (!$almacenId) {
            $almacenId = auth()->user()?->empresa?->almacen_id_principal ?? config('inventario.almacen_principal_id', 1);
        }

        return [
            'id'           => $combo->id,
            'sku'          => $combo->sku,
            'nombre'       => $combo->nombre,
            'descripcion'  => $combo->descripcion,
            'precio_venta' => (float) $combo->precio_venta,
            'activo'       => $combo->activo,
            'items'        => $combo->comboItems->map(function(ComboItem $item) use ($almacenId) {
                // ✅ CORREGIDO: Obtener stock del almacén específico, no suma de todos
                $stockAlmacen = $item->producto?->stock()
                    ->where('almacen_id', $almacenId)
                    ->first();

                $stockDisponible = $stockAlmacen?->cantidad_disponible ?? 0;
                $stockTotal = $stockAlmacen?->cantidad ?? 0;

                return [
                    'producto_id'        => $item->producto_id,
                    'producto_nombre'    => $item->producto?->nombre,
                    'producto_sku'       => $item->producto?->sku,
                    'cantidad'           => (float) $item->cantidad,
                    'precio_unitario'    => (float) $item->precio_unitario,
                    'tipo_precio_id'     => $item->tipo_precio_id,
                    'tipo_precio_nombre' => $item->tipoPrecio?->nombre,
                    'es_obligatorio'     => (bool) $item->es_obligatorio,
                    'grupo_opcional'     => $item->grupo_opcional,
                    'stock_disponible'   => (int) $stockDisponible,
                    'stock_total'        => (int) $stockTotal,
                ];
            })->values()->toArray(),
            'grupo_opcional' => $combo->comboGrupos->isNotEmpty() ? [
                'nombre_grupo'       => $combo->comboGrupos->first()->nombre_grupo,
                'cantidad_a_llevar'  => $combo->comboGrupos->first()->cantidad_a_llevar,
                'precio_grupo'       => (float) $combo->comboGrupos->first()->precio_grupo,
                'productos'          => $combo->comboGrupos->first()->items->pluck('producto_id')->toArray(),
                'productos_detalle'  => $combo->comboGrupos->first()->items->map(fn(ComboGrupoItem $item) => [
                    'producto_id'   => $item->producto_id,
                    'producto_nombre' => $item->producto?->nombre,
                    'producto_sku'  => $item->producto?->sku,
                ])->toArray(),
            ] : null,
        ];
    }

    /**
     * Obtener la capacidad de combos disponibles según el stock
     * GET /combos/{combo}/capacidad
     */
    public function capacidad(Producto $combo, Request $request): JsonResponse
    {
        abort_unless($combo->es_combo, 404);

        $almacenId = $request->integer('almacen_id');

        $capacidad = ComboStockService::calcularCapacidadCombos(
            $combo->id,
            $almacenId ?: null
        );

        return response()->json([
            'success' => true,
            'combo_id' => $combo->id,
            'combo_nombre' => $combo->nombre,
            'capacidad' => $capacidad,
            'almacen_id' => $almacenId ?: null,
        ]);
    }

    /**
     * Obtener la capacidad de combos con detalles de cada producto obligatorio
     * GET /combos/{combo}/capacidad-detalles
     */
    public function capacidadDetalles(Producto $combo, Request $request): JsonResponse
    {
        abort_unless($combo->es_combo, 404);

        $almacenId = $request->integer('almacen_id');

        $resultado = ComboStockService::calcularCapacidadConDetalles(
            $combo->id,
            $almacenId ?: null
        );

        return response()->json([
            'success' => true,
            'combo_id' => $combo->id,
            'combo_nombre' => $combo->nombre,
            'capacidad_total' => $resultado['capacidad_total'],
            'detalles' => $resultado['detalles'],
            'almacen_id' => $almacenId ?: null,
        ]);
    }

    /**
     * Obtener todos los combos que contienen un producto específico
     * GET /api/productos/{producto}/combos
     */
    public function combosDelProducto(Producto $producto, Request $request): JsonResponse
    {
        $almacenId = $request->integer('almacen_id');

        // Obtener todos los combos que contienen este producto
        $combos = ComboItem::where('producto_id', $producto->id)
            ->with('combo')
            ->get()
            ->pluck('combo')
            ->unique('id')
            ->values();

        $resultado = $combos->map(function ($combo) use ($almacenId) {
            // Calcular capacidad para cada combo
            $capacidadInfo = ComboStockService::calcularCapacidadConDetalles(
                $combo->id,
                $almacenId ?: null
            );

            // Encontrar si este producto es el cuello de botella
            $esCuelloBotella = collect($capacidadInfo['detalles'])
                ->where('producto_id', $producto->id)
                ->where('es_cuello_botella', true)
                ->isNotEmpty();

            // Encontrar en qué posición está este producto en los detalles
            $productoEnCombo = collect($capacidadInfo['detalles'])
                ->firstWhere('producto_id', $producto->id);

            return [
                'combo_id' => $combo->id,
                'combo_nombre' => $combo->nombre,
                'combo_sku' => $combo->sku,
                'precio_venta' => $combo->precio_venta,
                'capacidad_total' => $capacidadInfo['capacidad_total'],
                'es_obligatorio' => $productoEnCombo['es_obligatorio'] ?? true,
                'cantidad_requerida' => $productoEnCombo['cantidad_requerida'] ?? 0,
                'combos_posibles_por_este_producto' => $productoEnCombo['combos_posibles'] ?? 0,
                'es_cuello_botella' => $esCuelloBotella,
                'detalles' => $capacidadInfo['detalles'],
            ];
        });

        return response()->json([
            'success' => true,
            'producto_id' => $producto->id,
            'producto_nombre' => $producto->nombre,
            'total_combos' => $resultado->count(),
            'combos' => $resultado,
            'almacen_id' => $almacenId ?: null,
        ]);
    }
}

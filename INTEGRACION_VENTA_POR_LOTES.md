# 📋 Integración de `venta_por_lotes` en VentaDistribucionService

## 🎯 Objetivo
Registrar **QUÉ LOTE específico** fue consumido en **CADA VENTA** para:
- ✅ Precisión de stock (sin valores negativos)
- ✅ Reversiones exactas (devolver a lote correcto)
- ✅ Trazabilidad completa (auditoría de FIFO)

---

## 📍 PUNTO 1: Consumo de Stock (consumirStock)

**UBICACIÓN**: `app/Services/Venta/VentaDistribucionService.php::consumirStock()` línea ~319

### Código ACTUAL:
```php
foreach ($stocks as $stock) {
    if ($cantidadRestante <= 0) break;
    
    $cantidadTomar = (float) min($cantidadRestante, $stock->cantidad_disponible);
    
    // ← AQUÍ: Se consume del lote
    $movimientoRegistrado = $movimientoStockService->registrarMovimientoYActualizar(
        stockProductoId: $stock->id,
        cantidad: -(int)$cantidadTomar,
        ...
    );
    
    $cantidadRestante = (float) ($cantidadRestante - $cantidadTomar);
}
```

### ✅ CAMBIO NECESARIO:

Después de registrar el movimiento, REGISTRAR en `venta_por_lotes`:

```php
foreach ($stocks as $stock) {
    if ($cantidadRestante <= 0) break;
    
    $cantidadTomar = (float) min($cantidadRestante, $stock->cantidad_disponible);
    
    // ✅ Registrar movimiento (como antes)
    $movimientoRegistrado = $movimientoStockService->registrarMovimientoYActualizar(...);
    $movimientos[] = $movimientoRegistrado;
    
    // ✅ NUEVO: Registrar en venta_por_lotes (trazabilidad)
    \App\Models\VentaPorLote::create([
        'venta_id'              => $ventaId,
        'detalle_venta_id'      => $item['detalle_venta_id'] ?? null,  // ← Viene del item del request
        'producto_id'           => $productoId,
        'stock_producto_id'     => $stock->id,
        'cantidad_consumida'    => $cantidadTomar,
        'combo_padre_id'        => $item['combo_padre_id'] ?? null,    // ← Si vino de combo
        'fecha_vencimiento'     => $stock->fecha_vencimiento,
    ]);
    
    Log::debug('📦 [VentaDistribucionService] Registrado en venta_por_lotes', [
        'venta_id'          => $ventaId,
        'producto_id'       => $productoId,
        'stock_id'          => $stock->id,
        'cantidad_consumida'=> $cantidadTomar,
        'combo_padre_id'    => $item['combo_padre_id'] ?? null,
    ]);
    
    $cantidadRestante -= $cantidadTomar;
}
```

---

## 🔄 CONTEXTO: Cómo llega `detalle_venta_id` y `combo_padre_id`

El servicio recibe `$detalles` del DTO. Necesitas asegurar que cada item tenga:

```php
// En CrearVentaDTO o donde se construyen los detalles:
$detallesParaStock = [
    [
        'producto_id'       => 10,  // Componente (nunca combo)
        'cantidad'          => 2,
        'detalle_venta_id'  => 456, // ← ID del DetalleVenta que lo originó
        'combo_padre_id'    => null, // ← Si vino de combo, ID del combo. Si es venta directa: null
    ],
    [
        'producto_id'       => 11,
        'cantidad'          => 4,
        'detalle_venta_id'  => 456,
        'combo_padre_id'    => 50,  // ← Vino del combo ID 50
    ],
];
```

### ¿De dónde viene esto?

**En VentaService::crear()**, cuando se expanden los combos:

```php
// VentaService::crear() línea ~83
$detallesParaStock = $this->stockService->expandirCombos($dto->detalles);

// ← expandirCombos DEBE retornar detalles con:
//   - detalle_venta_id: ID del DetalleVenta original
//   - combo_padre_id: ID del combo (si es componente de combo)
```

---

## 🔙 PUNTO 2: Devolución de Stock (devolverStock)

**UBICACIÓN**: `app/Services/Venta/VentaDistribucionService.php::devolverStock()` línea ~398

### Código ACTUAL:
```php
// Busca movimientos y devuelve stock agrupado
$movimientos = MovimientoInventario::where('numero_documento', $numeroVenta)
    ->whereIn('tipo', [MovimientoInventario::TIPO_SALIDA_VENTA, ...])
    ->get();

// Procesa cada movimiento y devuelve
foreach ($productosMovimientos as $mov) {
    $movimiento->stockProducto->increment('cantidad_disponible', ...);
}
```

### ✅ CAMBIO NECESARIO:

Usar `venta_por_lotes` para devolver **exactamente a cada lote**:

```php
public function devolverStock(string $numeroVenta): array
{
    Log::info('🔄 [VentaDistribucionService::devolverStock] Iniciando devolución', [
        'numero_venta' => $numeroVenta,
    ]);

    try {
        return DB::transaction(function () use ($numeroVenta) {
            $venta = Venta::where('numero', $numeroVenta)->first();
            $ventaId = $venta?->id ?? 0;

            // ✅ NUEVO: Buscar registros en venta_por_lotes (más preciso)
            $ventaPorLotes = \App\Models\VentaPorLote::where('venta_id', $ventaId)
                ->with('stockProducto')
                ->lockForUpdate()
                ->get();

            if ($ventaPorLotes->isEmpty()) {
                Log::warning('⚠️ No hay registros en venta_por_lotes para devolver', [
                    'venta_id' => $ventaId,
                    'numero_venta' => $numeroVenta,
                ]);

                return [
                    'success' => true,
                    'cantidad_devuelta' => 0,
                    'movimientos' => 0,
                    'error' => null,
                ];
            }

            $totalDevuelto = 0;
            $movimientosCreados = 0;

            // ✅ Agrupar por lote (stock_producto_id) para crear 1 registro de entrada por lote
            $por_lote = $ventaPorLotes->groupBy('stock_producto_id');

            foreach ($por_lote as $stockId => $lotesDelLote) {
                // Sumar cantidad total a devolver de este lote
                $cantidadTotalLote = $lotesDelLote->sum('cantidad_consumida');

                // Obtener el stock_producto (refresco para obtener cantidad_disponible actual)
                $stock = StockProducto::lockForUpdate()->find($stockId);
                if (!$stock) {
                    Log::error('❌ Stock no encontrado para devolución', ['stock_id' => $stockId]);
                    continue;
                }

                // ✅ DEVOLVER exactamente a este lote
                $stock->increment('cantidad_disponible', $cantidadTotalLote);

                // ✅ Registrar movimiento de entrada (ENTRADA_AJUSTE)
                $movimientoService = new \App\Services\Stock\MovimientoStockService(
                    app(\App\Services\Stock\StockValidationService::class)
                );

                try {
                    $movimientoRegistrado = $movimientoService->registrarMovimientoYActualizar(
                        stockProductoId: $stock->id,
                        cantidad: (int)$cantidadTotalLote,
                        tipo: MovimientoInventario::TIPO_ENTRADA_AJUSTE,
                        referencia_tipo: 'venta_anulada',
                        referencia_id: $ventaId,
                        metadataAdicional: [
                            'numero_venta' => $numeroVenta,
                            'lote' => $stock->lote,
                            'razon' => 'Devolución por anulación de venta',
                            'cantidad_devuelta' => $cantidadTotalLote,
                        ],
                        numeroDocumento: $numeroVenta
                    );

                    Log::info('✅ Stock devuelto a lote', [
                        'stock_id' => $stock->id,
                        'cantidad_devuelta' => $cantidadTotalLote,
                        'venta_id' => $ventaId,
                        'numero_venta' => $numeroVenta,
                    ]);

                    $totalDevuelto += $cantidadTotalLote;
                    $movimientosCreados++;

                } catch (\Exception $e) {
                    Log::error('❌ Error devoliendo lote', [
                        'stock_id' => $stockId,
                        'error' => $e->getMessage(),
                    ]);
                    throw $e;
                }
            }

            // ✅ Opcionalmente: Eliminar registros de venta_por_lotes (ya se revertió el stock)
            // VentaPorLote::where('venta_id', $ventaId)->delete();
            // O dejarlos para auditoría (se recomienda dejar para trazabilidad histórica)

            return [
                'success' => true,
                'cantidad_devuelta' => $totalDevuelto,
                'movimientos' => $movimientosCreados,
                'error' => null,
            ];
        });

    } catch (\Exception $e) {
        Log::error('❌ Error en devolución de stock', [
            'numero_venta' => $numeroVenta,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return [
            'success' => false,
            'cantidad_devuelta' => 0,
            'movimientos' => 0,
            'error' => $e->getMessage(),
        ];
    }
}
```

---

## 📊 EJEMPLO: Venta con Combo

### Datos iniciales
```
Venta 123 - Cliente ABC
├─ DetalleVenta 456: Combo "Pack Básico" (ID 50) × 2
   ├─ Componente: Producto A (ID 10) × 1 = 2 unidades totales
   └─ Componente: Producto B (ID 11) × 2 = 4 unidades totales
├─ DetalleVenta 457: Producto C (ID 12) directo × 5

Stock disponible:
├─ Producto A: [Lote 1: 3 unidades, Lote 2: 2 unidades] → Total 5
├─ Producto B: [Lote 1: 6 unidades] → Total 6
└─ Producto C: [Lote 1: 10 unidades] → Total 10
```

### Después del consumo (FIFO)

**venta_por_lotes registrada:**
```
| venta_id | detalle_venta_id | producto_id | stock_id | cantidad_consumida | combo_padre_id | fecha_vencimiento |
|----------|------------------|-------------|----------|-------------------|----------------|-------------------|
| 123      | 456              | 10 (A)      | 1        | 2                 | 50             | 2026-08-15        |
| 123      | 456              | 11 (B)      | 1        | 4                 | 50             | 2026-09-01        |
| 123      | 457              | 12 (C)      | 1        | 5                 | NULL           | 2026-10-01        |
```

**Stock resultante:**
```
Producto A, Lote 1: 3 - 2 = 1 unidad
Producto A, Lote 2: 2 - 0 = 2 unidades (no consumido FIFO)
Producto B, Lote 1: 6 - 4 = 2 unidades
Producto C, Lote 1: 10 - 5 = 5 unidades
```

### Al anular la venta

```
Devolución (reversión):
├─ Producto A, Lote 1 += 2 → 3 unidades (restaurado)
├─ Producto B, Lote 1 += 4 → 6 unidades (restaurado)
└─ Producto C, Lote 1 += 5 → 10 unidades (restaurado)

venta_por_lotes: se CONSERVA (para auditoría histórica)
```

---

## 🔧 CAMBIOS EN OTROS ARCHIVOS

### 1. **DTOs** - `CrearVentaDTO::fromRequest()`

El DTO debe capturar `detalle_venta_id` al crear detalles:

```php
// En CrearVentaDTO o VentaService::crear()
foreach ($requestDetalles as $item) {
    $detalleVenta = DetalleVenta::create([
        'venta_id'              => $venta->id,
        'producto_id'           => $item['producto_id'],
        'cantidad'              => $item['cantidad'],
        ...
    ]);
    
    // ← Guardar el ID para pasar a consumirStock
    $item['detalle_venta_id'] = $detalleVenta->id;
    $item['combo_padre_id'] = null; // O el ID del combo si viene de uno
}
```

### 2. **expandirCombos** - Incluir metadatos

Modificar `StockService::expandirCombos()` para incluir:

```php
public function expandirCombos(array $detalles): array
{
    $expandidos = [];
    
    foreach ($detalles as $detalle) {
        $producto = Producto::find($detalle['producto_id']);
        
        if ($producto->es_combo) {
            // Expandir combo
            foreach ($producto->comboItems as $item) {
                $expandidos[] = [
                    'producto_id'       => $item->producto_id,
                    'cantidad'          => $item->cantidad * $detalle['cantidad'],
                    'detalle_venta_id'  => $detalle['detalle_venta_id'],  // ← Heredar del combo
                    'combo_padre_id'    => $producto->id,                  // ← Referencia al combo
                ];
            }
        } else {
            // No es combo, pasar tal cual
            $expandidos[] = array_merge($detalle, [
                'combo_padre_id' => null,  // ← No viene de combo
            ]);
        }
    }
    
    return $expandidos;
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [ ] Ejecutar `php artisan migrate` (migración creada)
- [ ] Crear modelo `VentaPorLote.php` (ya creado)
- [ ] Modificar `VentaDistribucionService::consumirStock()` para registrar en venta_por_lotes
- [ ] Modificar `VentaDistribucionService::devolverStock()` para devolver por lote específico
- [ ] Actualizar `StockService::expandirCombos()` para incluir `detalle_venta_id` y `combo_padre_id`
- [ ] Asegurar que `CrearVentaDTO` capture `detalle_venta_id` al crear detalles
- [ ] Pruebas: Crear venta con combo y validar venta_por_lotes
- [ ] Pruebas: Anular venta y validar que se devuelve a lotes correctos
- [ ] Pruebas: Validar que NO hay stock negativo

---

## 🎯 BENEFICIOS

✅ **Trazabilidad**: Saber exactamente qué lote se usó en qué venta
✅ **Precisión**: No más stock negativo (cada consumo es registrado)
✅ **Reversiones**: Al anular, devolver exactamente al lote que consumió
✅ **Auditoría**: Historial completo de movimientos por lote
✅ **Combos**: Manejo correcto de productos dentro de combos

# Sistema de Impresión de Entregas

## Descripción General

El sistema de impresión de entregas utiliza un **servicio reutilizable** (`ImpresionEntregaService`) que permite generar listas genéricas de productos de una entrega de forma flexible, sin depender de las vistas Blade.

## Estructura de Impresión

### Formato A4 (hoja-completa.blade.php)
```
1. INFORMACIÓN DE LA ENTREGA
   - Número de entrega
   - Fecha, estado, chofer, vehículo
   - Peso total, observaciones

2. LISTA GENÉRICA DE PRODUCTOS
   - Consolidación de todos los productos de todas las ventas
   - Columnas: Producto, Cliente, Cantidad, Precio Unit., Subtotal
   - Totales de cantidad y monto

3. COMPROBANTES DE VENTAS
   - Detalle completo de cada venta (para entregar al cliente)
   - Información de pago
```

### Formato Ticket 80mm y 58mm
```
1. INFORMACIÓN DE LA ENTREGA
2. LISTA GENÉRICA (resumida)
3. DETALLE POR VENTA (validación)
4. RESUMEN PARA CHOFER
```

---

## Servicio Reutilizable: ImpresionEntregaService

### Ubicación
`app/Services/ImpresionEntregaService.php`

### Métodos Disponibles

#### 1. `obtenerProductosGenerico(Entrega $entrega): Collection`
Retorna **todos los productos** de todas las ventas asignadas a una entrega.

**Retorna:**
```php
[
    'venta_id' => 1,
    'venta_numero' => 'V-001',
    'cliente_id' => 5,
    'cliente_nombre' => 'Nombre Cliente',
    'producto_id' => 10,
    'producto_nombre' => 'Nombre Producto',
    'codigo_producto' => 'PRD-001',
    'cantidad' => 5.5,
    'precio_unitario' => 100.00,
    'subtotal' => 550.00,
    'unidad_medida' => 'UND'
]
```

**Uso en Views:**
```blade
@php
    $impresionService = app(\App\Services\ImpresionEntregaService::class);
    $productosGenerico = $impresionService->obtenerProductosGenerico($entrega);
@endphp

@foreach($productosGenerico as $producto)
    <tr>
        <td>{{ $producto['producto_nombre'] }}</td>
        <td>{{ $producto['cantidad'] }} {{ $producto['unidad_medida'] }}</td>
        <td>{{ number_format($producto['subtotal'], 2) }}</td>
    </tr>
@endforeach
```

**Uso en Controllers/Services:**
```php
$impresionService = app(\App\Services\ImpresionEntregaService::class);
$productos = $impresionService->obtenerProductosGenerico($entrega);

// Retornar como JSON para API
return response()->json($productos);
```

---

#### 2. `obtenerProductosAgrupados(Entrega $entrega): Collection`
Retorna productos **agrupados por producto** (consolidando cantidades del mismo producto).

**Retorna:**
```php
[
    'producto_id' => 10,
    'producto_nombre' => 'Producto A',
    'codigo_producto' => 'PRD-001',
    'unidad_medida' => 'UND',
    'cantidad_total' => 15.5,      // Suma de cantidades
    'precio_unitario' => 100.00,
    'subtotal_total' => 1550.00,   // Suma de subtotales
    'cantidad_ventas' => 3,         // Cuántos items de este producto
    'ventas' => 'V-001, V-002'      // Números de ventas
]
```

**Caso de uso:**
- Listas resumidas para inventario
- Control de productos consolidados
- Reportes de stocks

---

#### 3. `obtenerProductosPorCliente(Entrega $entrega): Collection`
Retorna productos **agrupados por cliente**.

**Retorna:**
```php
[
    'cliente_id' => 5,
    'cliente_nombre' => 'Cliente A',
    'productos' => [
        [
            'producto_nombre' => 'Producto 1',
            'cantidad' => 5,
            'subtotal' => 500,
            'venta_numero' => 'V-001'
        ]
    ],
    'cantidad_total_productos' => 5,
    'subtotal_total' => 500
]
```

**Caso de uso:**
- Saber qué le corresponde a cada cliente
- Validación de envío
- Reportes por cliente

---

#### 4. `obtenerEstadisticas(Entrega $entrega): array`
Retorna estadísticas agregadas de la entrega.

**Retorna:**
```php
[
    'total_productos' => 25,        // Cantidad de items en la lista genérica
    'total_items_unicos' => 8,      // Cantidad de productos diferentes
    'total_cantidad' => 150.5,      // Suma total de cantidades
    'total_subtotal' => 15050.00,   // Suma total de montos
    'total_clientes' => 3,          // Cantidad de clientes
    'total_ventas' => 4             // Cantidad de ventas
]
```

**Uso en Views:**
```blade
@php
    $stats = $impresionService->obtenerEstadisticas($entrega);
@endphp

<p>Total Productos: {{ $stats['total_productos'] }}</p>
<p>Total Monto: {{ number_format($stats['total_subtotal'], 2) }}</p>
```

---

## Ejemplos de Uso

### Ejemplo 1: API Endpoint para obtener productos genéricos

```php
// app/Http/Controllers/EntregaController.php
public function obtenerProductosGenerico(Entrega $entrega)
{
    $impresionService = app(\App\Services\ImpresionEntregaService::class);
    $productos = $impresionService->obtenerProductosGenerico($entrega);

    return response()->json([
        'entrega_id' => $entrega->id,
        'numero_entrega' => $entrega->numero_entrega,
        'productos' => $productos,
        'estadisticas' => $impresionService->obtenerEstadisticas($entrega)
    ]);
}
```

### Ejemplo 2: Frontend React obteniendo productos genéricos

```typescript
// frontend/hooks/useProductosEntrega.ts
const fetchProductosGenerico = async (entregaId: string) => {
    const response = await fetch(`/api/entregas/${entregaId}/productos-generico`);
    const data = await response.json();

    // Usar en tabla
    return data.productos.map(p => ({
        id: p.producto_id,
        nombre: p.producto_nombre,
        cantidad: p.cantidad,
        subtotal: p.subtotal
    }));
};
```

### Ejemplo 3: Usar en Service para generación de reportes

```php
// app/Services/ReporteEntregaService.php
public function generarReporteMensual()
{
    $entregas = Entrega::whereBetween('fecha_asignacion', [$inicio, $fin])->get();
    $impresionService = app(\App\Services\ImpresionEntregaService::class);

    foreach ($entregas as $entrega) {
        $datos = [
            'entrega' => $entrega,
            'productos' => $impresionService->obtenerProductosAgrupados($entrega),
            'porCliente' => $impresionService->obtenerProductosPorCliente($entrega),
            'stats' => $impresionService->obtenerEstadisticas($entrega)
        ];

        // Usar datos para generar reporte
    }
}
```

---

## Vistas Disponibles

### Partials Reutilizables

1. **_informacion-entrega.blade.php**
   - Información general de la entrega
   - Incluida automáticamente en hoja-completa.blade.php

2. **_lista-generica.blade.php**
   - Tabla con lista genérica de productos
   - Totales consolidados

3. **_comprobantes-ventas.blade.php**
   - Detalle completo de cada venta
   - Para entregar al cliente con la carga

### Templates Completos

1. **hoja-completa.blade.php** (A4)
   - Uso: Impresión completa para administración y cliente

2. **ticket-80.blade.php** (80mm)
   - Uso: Ticket para chofer/logística

3. **ticket-58.blade.php** (58mm)
   - Uso: Ticket compacto para pequeñas impresoras

---

## Cómo Extender el Sistema

### Agregar un nuevo método en ImpresionEntregaService

```php
public function obtenerProductosPorCategoria(Entrega $entrega): Collection
{
    $productosGenerico = $this->obtenerProductosGenerico($entrega);

    return $productosGenerico->groupBy('categoria_id')->map(function ($items) {
        return [
            'categoria' => $items->first()['categoria_nombre'],
            'productos' => $items,
            'total_cantidad' => $items->sum('cantidad'),
            'total_subtotal' => $items->sum('subtotal')
        ];
    })->values();
}
```

### Crear un nuevo partial en views/impresion/entregas/partials/

Crear `_lista-por-categoria.blade.php` y usarlo en las vistas:

```blade
@php
    $productosPorCategoria = $impresionService->obtenerProductosPorCategoria($entrega);
@endphp
@include('impresion.entregas.partials._lista-por-categoria')
```

---

## Notas Importantes

✅ El servicio **no depende de vistas Blade** - es reutilizable en Controllers, Services y APIs
✅ Los métodos retornan **Collections** - fáciles de manipular y filtrar
✅ Los datos están **listos para JSON** - sin necesidad de transformación
✅ Optimizado para **múltiples frontends** - web, mobile, reportes
✅ Las vistas Blade **usan el servicio** - no duplican lógica

---

## Troubleshooting

### ¿Cómo obtengo los productos para un frontend?
```php
$impresionService = app(\App\Services\ImpresionEntregaService::class);
$productos = $impresionService->obtenerProductosGenerico($entrega)->toArray();
return response()->json($productos);
```

### ¿Cómo creo una vista personalizada?
1. Usa `obtenerProductosGenerico()` o `obtenerProductosAgrupados()`
2. Crea un partial en `views/impresion/entregas/partials/`
3. Inclúyelo en la vista principal con `@include()`

### ¿Cómo exporto a Excel o CSV?
```php
$impresionService = app(\App\Services\ImpresionEntregaService::class);
$productos = $impresionService->obtenerProductosAgrupados($entrega);

// Usar con maatwebsite/excel o similar
$export = new EntregaExport($productos);
return Excel::download($export, 'entrega.xlsx');
```

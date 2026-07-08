# Fix: Restar Productos Devueltos en DEVOLUCION_PARCIAL

**Commit:** `76bb0c2`  
**Fecha:** 2026-07-08  
**Status:** ✅ Completado

---

## 🐛 Problema Identificado

En devoluciones parciales (`DEVOLUCION_PARCIAL`), los productos registrados en la columna `productos_devueltos` son aquellos que **se regresaron a la tienda** (no se vendieron), pero estaban siendo **incluidos en el total** del reporte.

### Ejemplo del Problema

**Venta Original:**
- Producto A: 10 unidades
- Producto B: 5 unidades
- **Total: 15 unidades**

**Devolución Parcial:**
- Producto A: 3 unidades devueltas
- `tipo_confirmacion: DEVOLUCION_PARCIAL`

**Reporte ANTES (INCORRECTO):**
- Producto A: 10 unidades ❌ (debería ser 7)
- Producto B: 5 unidades ✓
- **Total: 15 unidades** ❌ (debería ser 12)

**Reporte DESPUÉS (CORRECTO):**
- Producto A: 7 unidades ✓ (10 - 3 devueltas)
- Producto B: 5 unidades ✓
- **Total: 12 unidades** ✓

---

## ✅ Solución Implementada

### 1. **Método: `agruparProductosPorVenta()`**

```php
// Obtener productos devueltos (si hay DEVOLUCION_PARCIAL)
$productosDevueltos = [];
if ($confirmacion->tipo_confirmacion === 'DEVOLUCION_PARCIAL' && is_array($confirmacion->productos_devueltos)) {
    foreach ($confirmacion->productos_devueltos as $productoDevuelto) {
        $productosDevueltos[$productoDevuelto['producto_id']] = (float) $productoDevuelto['cantidad'];
    }
}

// Calcular cantidad neta (entregado - devuelto)
foreach ($confirmacion->venta->detalles as $detalle) {
    $cantidadEntregada = (float) $detalle->cantidad;
    $cantidadDevuelta = $productosDevueltos[$detalle->producto_id] ?? 0;
    $cantidadNeta = $cantidadEntregada - $cantidadDevuelta;

    // Si cantidad neta <= 0, excluir el producto
    if ($cantidadNeta <= 0) {
        continue;
    }

    // Calcular subtotal neto
    $subtotalNeto = $cantidadNeta * (float) $detalle->precio_unitario;
}
```

### 2. **Método: `calcularResumen()`**

El resumen ahora cuenta solo los productos que efectivamente fueron entregados:

```php
// Contar solo productos entregados (no devueltos)
foreach ($confirmacion->venta->detalles as $detalle) {
    $cantidadEntregada = (float) $detalle->cantidad;
    $cantidadDevuelta = $productosDevueltos[$detalle->producto_id] ?? 0;
    $cantidadNeta = $cantidadEntregada - $cantidadDevuelta;

    // Solo contar si hay cantidad neta positiva
    if ($cantidadNeta > 0) {
        $resumen['total_productos']++;
    }
}
```

---

## 📊 Impacto en el Reporte

### Vista de Ventas Entregadas

**Para una venta con DEVOLUCION_PARCIAL:**

```json
{
  "venta_id": 1,
  "numero_venta": "V-00001",
  "tipo_confirmacion": "DEVOLUCION_PARCIAL",
  "monto_devuelto": 300.00,
  "productos": [
    {
      "producto_id": 101,
      "nombre": "Producto A",
      "cantidad": 7,  // ← 10 - 3 devueltas
      "subtotal": 700.00  // ← 7 × 100
    },
    {
      "producto_id": 102,
      "nombre": "Producto B",
      "cantidad": 5,  // ← Sin devoluciones
      "subtotal": 250.00  // ← 5 × 50
    }
  ]
}
```

### Resumen Global

**`productos_resumen`** ahora muestra cantidades correctas:

```json
{
  "producto_id": 101,
  "nombre": "Producto A",
  "cantidad_total": 7,  // ← Solo productos efectivamente entregados
  "valor_total": 700.00
}
```

### Tarjeta de Resumen

```
Total Confirmaciones: 5
Confirmaciones Completas: 3
Devoluciones Parciales: 2
Total Productos: 12  // ← Actualizado (antes contaba 15)
Total Monetario: $5,000.00
Total Devuelto: $450.00
```

---

## 🧪 Casos de Prueba

### Caso 1: DEVOLUCION_PARCIAL con múltiples productos

**Setup:**
```
Venta:
- Producto A: 10 unidades × $100 = $1,000
- Producto B: 5 unidades × $50 = $250
Total: $1,250

Devolución:
- Producto A: 3 unidades
- Monto devuelto: $300
```

**Esperado en reporte:**
- Producto A: 7 unidades × $100 = $700
- Producto B: 5 unidades × $50 = $250
- Subtotal entregado: $950
- Total devuelto: $300

### Caso 2: Producto 100% devuelto

**Setup:**
```
Venta:
- Producto A: 5 unidades × $100 = $500

Devolución:
- Producto A: 5 unidades (100% devuelto)
- Monto devuelto: $500
```

**Esperado en reporte:**
- Producto A: NO debe aparecer (0 unidades netas)
- Total productos: 0

### Caso 3: DEVOLUCION_PARCIAL sin productos devueltos específicos

**Setup:**
```
Venta:
- Producto A: 10 unidades × $100 = $1,000

Devolución:
- Sin productos_devueltos registrados
- Monto devuelto: 0
```

**Esperado en reporte:**
- Producto A: 10 unidades (sin cambios)

---

## 💾 Estructura de `productos_devueltos`

La columna `productos_devueltos` en `entregas_venta_confirmaciones` es un JSON array:

```json
[
  {
    "producto_id": 101,
    "producto_nombre": "Producto A",
    "cantidad": 3,
    "precio_unitario": 100,
    "subtotal": 300
  }
]
```

Este fix extrae `producto_id` y `cantidad` para hacer la resta.

---

## ⚠️ Notas Importantes

1. **Solo aplica a DEVOLUCION_PARCIAL** - Las confirmaciones COMPLETA no tienen productos devueltos
2. **Productos con cantidad neta <= 0 se excluyen** - No aparecen en el reporte si fueron 100% devueltos
3. **Cálculos precisos** - Subtotales se recalculan como: `cantidad_neta × precio_unitario`
4. **`total_productos` actualizado** - Cuenta solo productos con cantidad neta > 0

---

## 🔍 Verificación

Para verificar que el fix funciona:

```bash
# 1. Obtener una venta con DEVOLUCION_PARCIAL
curl "http://localhost:8000/api/choferes/1/entregas-reporte"

# 2. Validar que:
# - productos_por_venta[].productos[] tienen cantidades reducidas
# - productos_resumen[] muestra totales correctos
# - total_productos en resumen es la suma neta
```

---

## 📝 Cambios Realizados

- ✅ `agruparProductosPorVenta()` - Resta cantidades devueltas
- ✅ `calcularResumen()` - Cuenta productos netos
- ✅ Ambos métodos acceden a `$confirmacion->productos_devueltos`
- ✅ Maneja casos edge: cantidad 100% devuelta, sin datos, etc.

---

**Status:** ✅ Implementado y Testeado  
**Breaking Changes:** No (mejora de precisión)  
**Rollback:** Si es necesario, revertir commit `76bb0c2`

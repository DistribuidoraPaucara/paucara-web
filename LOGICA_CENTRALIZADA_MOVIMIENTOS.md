# 🎯 Lógica Centralizada: Captura de Totales

## Problema Resuelto

Antes, cada servicio capturaba los totales de forma inconsistente:
- VentaDistribucionService capturaba diferente a ProformaService
- Los valores de `cantidad_total_anterior/posterior` eran del lote, no del total
- No había un único lugar donde cambiar la lógica

## Solución: Método Centralizado

### 📍 Ubicación
**Archivo:** `app/Services/Stock/MovimientoStockService.php`

### ✨ Nuevo Método

```php
/**
 * ✅ NUEVO (2026-06-28): Capturar TOTALES de todos los lotes (centralizado)
 *
 * Calcula la suma de cantidad, disponible y reservada de TODOS los lotes
 * del producto en el almacén.
 */
public function capturarTotalesDelProducto(int $productoId, int $almacenId): array
{
    $totales = StockProducto::where('producto_id', $productoId)
        ->where('almacen_id', $almacenId)
        ->selectRaw('
            SUM(cantidad) as cantidad_total,
            SUM(cantidad_disponible) as disponible_total,
            SUM(cantidad_reservada) as reservada_total
        ')
        ->first();

    return [
        'cantidad_total' => (float) ($totales->cantidad_total ?? 0),
        'disponible_total' => (float) ($totales->disponible_total ?? 0),
        'reservada_total' => (float) ($totales->reservada_total ?? 0),
    ];
}
```

---

## 🔄 Flujo Centralizado

```
CUALQUIER ENDPOINT (Venta, Proforma, Ajuste, etc.)
    ↓
VentaDistribucionService / ReservaDistribucionService
    ↓
MovimientoStockService::registrarMovimientoYActualizar()
    ↓
    1️⃣ Capturar TOTALES ANTES
    $totalesAntes = $this->capturarTotalesDelProducto($producto_id, $almacen_id);
    
    2️⃣ Actualizar stock_productos (del lote específico)
    $stock->update([...]);
    
    3️⃣ Capturar TOTALES DESPUÉS
    $totalesDespues = $this->capturarTotalesDelProducto($producto_id, $almacen_id);
    
    4️⃣ Registrar MovimientoInventario con TODOS los valores
    MovimientoInventario::create([
        // Lote específico
        'cantidad_anterior' => $loteAntes,
        'cantidad_posterior' => $loteDespues,
        'cantidad_disponible_anterior' => $loteDispAntes,
        'cantidad_disponible_posterior' => $loteDispDespues,
        'cantidad_reservada_anterior' => $loteResAntes,
        'cantidad_reservada_posterior' => $loteResDespues,
        
        // TOTALES (suma de todos los lotes)
        'cantidad_total_anterior' => $totalesAntes['cantidad_total'],
        'cantidad_total_posterior' => $totalesDespues['cantidad_total'],
        'disponible_total_anterior' => $totalesAntes['disponible_total'],
        'disponible_total_posterior' => $totalesDespues['disponible_total'],
        'reservada_total_anterior' => $totalesAntes['reservada_total'],
        'reservada_total_posterior' => $totalesDespues['reservada_total'],
    ]);
```

---

## ✅ Ventajas

| Antes | Después |
|-------|---------|
| ❌ Captura inconsistente | ✅ Una sola lógica centralizada |
| ❌ Lógica duplicada | ✅ Método único reutilizable |
| ❌ Difícil de mantener | ✅ Cambios en un solo lugar |
| ❌ Valores incorrectos | ✅ Totales calculados correctamente |

---

## 📊 Ejemplo de Movimiento Correcto

**Producto:** Laptop XYZ  
**Lotes en Almacén:**
- Lote A: 100 (cantidad), 100 (disponible), 0 (reservada)
- Lote B: 80 (cantidad), 80 (disponible), 0 (reservada)
- **TOTAL: 180 (cantidad), 180 (disponible), 0 (reservada)**

**Operación:** Consumo de 50 del Lote A

**Movimiento Registrado:**
```
{
  // ✅ LOTE ESPECÍFICO (A)
  "cantidad_anterior": 100,
  "cantidad_posterior": 50,
  "cantidad_disponible_anterior": 100,
  "cantidad_disponible_posterior": 50,
  "cantidad_reservada_anterior": 0,
  "cantidad_reservada_posterior": 0,
  
  // ✅ TOTALES (A + B)
  "cantidad_total_anterior": 180,
  "cantidad_total_posterior": 130,
  "disponible_total_anterior": 180,
  "disponible_total_posterior": 130,
  "reservada_total_anterior": 0,
  "reservada_total_posterior": 0
}
```

---

## 🚀 Cómo se Usa

Todos estos servicios ahora **automáticamente** capturan totales correctos:

1. **VentaDistribucionService** → `consumirStock()`
2. **ReservaDistribucionService** → `distribuirReserva()`
3. **ProformaService** → `reservarStock()`
4. **Ajustes de inventario** → Crear ajuste
5. **Devoluciones** → Registrar devolución
6. Cualquier otro endpoint que use `MovimientoStockService`

No hay cambios necesarios en estos servicios, **se reutiliza automáticamente**.

---

## 🔐 Garantías

✅ **Atomicidad:** TOTALES se capturan antes y después dentro de la misma transacción  
✅ **Consistencia:** Usa `.selectRaw()` para sumar directamente en BD  
✅ **Auditabilidad:** Cada movimiento registra los 6 pares de valores  
✅ **Escalabilidad:** Funciona sin cambios en nuevos endpoints  


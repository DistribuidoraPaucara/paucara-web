# 📊 Implementación Completa de Validación de Stock

## 🎯 Objetivo
Garantizar integridad de datos en stock_productos y movimientos_inventario, previniendo:
- ✅ Valores negativos
- ✅ Inconsistencias en relación: `total = disponible + reservadas`
- ✅ Race conditions
- ✅ Registros inconsistentes antes/después en movimientos

---

## 📝 Cambios Implementados

### 1️⃣ Constraints en Base de Datos
**Archivo:** `database/migrations/2026_06_09_111856_add_stock_validation_constraints.php`

#### En tabla `stock_productos`:
```sql
✅ cantidad >= 0
✅ cantidad_reservada >= 0
✅ cantidad_disponible >= 0
✅ cantidad = (cantidad_disponible + cantidad_reservada)
```

#### En tabla `movimientos_inventario`:
```sql
✅ cantidad_anterior IS NOT NULL AND cantidad_anterior <> 0
✅ cantidad_posterior IS NOT NULL AND cantidad_posterior <> 0
✅ cantidad_total_anterior = (cantidad_disponible_anterior + cantidad_reservada_anterior)
✅ cantidad_total_posterior = (cantidad_disponible_posterior + cantidad_reservada_posterior)
```

### 2️⃣ Refactorización de ReservaDistribucionService
**Archivo:** `app/Services/Reservas/ReservaDistribucionService.php`

#### Método: `distribuirReserva()` (línea ~113)
**Cambios:**
- ✅ **Locking pessimista**: `StockProducto::lockForUpdate()` previene race conditions
- ✅ **Validación pre-actualización**: Verifica que `cantidad_disponible >= cantidad_a_reservar`
- ✅ **Cálculo correcto de estado**: 
  - `nuevaDisponible = anterior - cantidad_a_reservar`
  - `nuevaReservada = anterior + cantidad_a_reservar`
  - `nuevoTotal = anterior` (NO cambia)
- ✅ **Validación post-actualización**: Usa `StockValidationService` para verificar:
  - Sin negativos
  - Suma correcta: `total = disponible + reservadas`
- ✅ **Actualización atómica**: `update()` con todos los valores correctos
- ✅ **Logs detallados**: Registra valores antes/después

**Antes (INSEGURO):**
```php
$stock_producto->decrement('cantidad_disponible', $cantidad_a_reservar);
$stock_producto->increment('cantidad_reservada', $cantidad_a_reservar);
// ⚠️ Sin lock, sin validación, sin garantías
```

**Después (SEGURO):**
```php
$stock_producto = StockProducto::lockForUpdate()->find($stock_producto->id);

$validador->validarStock((object) [
    'id' => $stock_producto->id,
    'cantidad' => $nuevoTotal,
    'cantidad_reservada' => $nuevaReservada,
    'cantidad_disponible' => $nuevaDisponible,
]);

$stock_producto->update([
    'cantidad_disponible' => $nuevaDisponible,
    'cantidad_reservada' => $nuevaReservada,
]);
```

#### Método: `liberarReservasPorProducto()` (línea ~336)
**Cambios idénticos al anterior:**
- ✅ Locking pessimista
- ✅ Validación pre-actualización
- ✅ Cálculo correcto de nuevo estado
- ✅ Validación post-actualización
- ✅ Actualización atómica

---

## 🛡️ Capas de Protección

### Capa 1: Validación de Negocio (StockValidationService)
**Ubicación:** `app/Services/Stock/StockValidationService.php`

```php
public function validarStock($stock): void
{
    // ✅ Regla 1: Nunca valores negativos
    $this->validarNoNegativos($stock);
    
    // ✅ Regla 2: Suma consistente
    $this->validarConsistencia($stock);
}
```

### Capa 2: Locking Pessimista
**Ubicación:** ReservaDistribucionService

```php
$stock = StockProducto::lockForUpdate()->find($id);
// Obtiene un lock exclusivo en la fila
// Otras transacciones esperan hasta que esta termine
```

### Capa 3: Constraints en BD
**Ubicación:** migrations/2026_06_09_111856_add_stock_validation_constraints.php

```sql
CHECK (cantidad >= 0)
CHECK (cantidad = (cantidad_disponible + cantidad_reservada))
-- Si se intenta algo ilegal, la BD lo rechaza
```

---

## 📊 Flujo de Reserva (ANTES vs DESPUÉS)

### ANTES (❌ INSEGURO)
```
1. Obtener stock (SIN LOCK)
2. Restar disponible (sin validación)
3. Sumar reservada (sin validación)
4. Guardar (esperar)

⚠️ Problema: Entre paso 1 y 3, otro proceso puede actualizar
⚠️ Resultado: Stock inconsistente, valores negativos posibles
```

### DESPUÉS (✅ SEGURO)
```
1. Obtener stock CON LOCK
   → Nadie más puede tocar esta fila
   
2. Validar que hay suficiente disponible
   → Si falla, rechazar ANTES de cambiar
   
3. Calcular nuevo estado
   → total = anterior (NO cambia)
   → disponible = anterior - cantidad
   → reservada = anterior + cantidad
   
4. Validar nuevo estado
   → Sin negativos ✓
   → total = disponible + reservada ✓
   
5. Actualizar
   → Una sola operación SQL
   
6. Registrar movimiento
   → Auditoría completa antes/después

7. Liberar LOCK
   → Otros procesos pueden continuar
```

---

## 🧪 Ejemplo de Validación en Acción

### Escenario: Crear 2 reservas simultáneamente

**Stock inicial:**
```
cantidad: 100
cantidad_disponible: 100
cantidad_reservada: 0
```

**Proceso A (Reservar 60):**
```
1. LOCK stock id=1
2. Validar: disponible(100) >= 60 ✓
3. Calcular: disp=40, res=60
4. Validar: 100 = 40+60 ✓
5. UPDATE stock SET disponible=40, reservada=60
6. UNLOCK

Stock ahora: total=100, disp=40, res=60
```

**Proceso B (Reservar 50) - SIMULTÁNEO:**
```
1. LOCK stock id=1 (ESPERA a que Proceso A termine)
2. [Espera...]
3. [Espera...]
4. [Proceso A termina y libera LOCK]
5. LOCK obtenido, stock ahora: disp=40, res=60
6. Validar: disponible(40) >= 50 ❌ FALLA
7. Rechazar y lanzar error (sin actualizar nada)
```

**Resultado:** ✅ Integridad garantizada, no hay overselling

---

## ✅ Validaciones Implementadas

| Punto | Validación | Ubicación |
|---|---|---|
| Pre-reserva | `disponible >= cantidad` | ReservaDistribucionService |
| Pre-liberación | `reservada >= cantidad` | ReservaDistribucionService |
| Post-actualización | Sin negativos | StockValidationService |
| Post-actualización | `total = disp + res` | StockValidationService |
| Movimiento | `anterior != 0 && posterior != 0` | StockValidationService |
| Base de datos | CHECK constraints | migrations |
| Concurrencia | lockForUpdate() | ReservaDistribucionService |

---

## 🚀 Ejecución

### 1. Ejecutar migración
```bash
php artisan migrate
```

### 2. Verificar constraints
```sql
-- Listar constraints en stock_productos
SHOW CREATE TABLE stock_productos;

-- Listar constraints en movimientos_inventario
SHOW CREATE TABLE movimientos_inventario;
```

### 3. Probar funcionamiento
```php
// Test: Intentar crear stock con valores negativos
StockProducto::create([
    'cantidad' => 100,
    'cantidad_disponible' => 150,  // ❌ Suma > total
    'cantidad_reservada' => 0,
]);
// Excepción: CHECK constraint violated
```

---

## 📈 Beneficios

| Beneficio | Impacto |
|---|---|
| **Sin race conditions** | Ningún overselling posible |
| **Sin datos inconsistentes** | total siempre = disponible + reservadas |
| **Auditoría completa** | Cada cambio registrado antes/después |
| **Fallos detectados** | En la actualización, no después |
| **Performance** | Lock solo durante transacción |

---

## ⚠️ Notas Importantes

1. **lockForUpdate()** solo funciona dentro de transacciones
   ```php
   DB::transaction(function () {
       $stock = StockProducto::lockForUpdate()->find($id);
       // Lock aquí
   }); // Lock liberado aquí
   ```

2. **Constraints en BD** son el último nivel de defensa
   - Si la aplicación falla, la BD previene corrupción
   - Si alguien intenta SQL directo, es rechazado

3. **Performance**: El lock es mínimo
   - Solo durante la transacción
   - Generalmente milisegundos
   - Mejor que inconsistencia de datos

4. **Reversibilidad**: La migración tiene `down()`
   - Pero NO se recomienda remover constraints
   - Solo si realmente necesitas rollback

---

## 🔍 Monitoreo

### Ver bloqueos activos (MySQL)
```sql
SHOW PROCESSLIST WHERE State LIKE '%lock%';
```

### Ver transacciones largas (MySQL)
```sql
SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCKS;
```

### Logs en aplicación
```php
Log::info('✅ Stock actualizado para reserva', [
    'stock_id' => $stock->id,
    'disponible_antes' => 100,
    'disponible_ahora' => 40,
    'reservada_antes' => 0,
    'reservada_ahora' => 60,
]);
```

---

## 📋 Checklist de Implementación

- ✅ Migración creada y ejecutada
- ✅ ReservaDistribucionService.distribuirReserva() refactorizado
- ✅ ReservaDistribucionService.liberarReservasPorProducto() refactorizado
- ✅ StockValidationService usado en ambos métodos
- ✅ Constraints en BD implementados
- ✅ Logs agregados para auditoría
- ✅ Documentación completada

---

## 🎓 Referencias

**Métodos clave:**
- `StockProducto::lockForUpdate()` - Pesimistic locking
- `StockValidationService::validarStock()` - Validación de reglas
- `ReservaDistribucionService::distribuirReserva()` - Crear reservas
- `ReservaDistribucionService::liberarReservasPorProducto()` - Liberar reservas

**Archivos modificados:**
1. `database/migrations/2026_06_09_111856_add_stock_validation_constraints.php`
2. `app/Services/Reservas/ReservaDistribucionService.php`

---

**Última actualización:** 2026-06-09
**Implementado por:** Claude Code

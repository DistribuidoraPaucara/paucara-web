# 📊 Estructura Completa: movimientos_inventario

## Concepto

Cada registro en `movimientos_inventario` es un **historial átomo** que registra cómo un cambio en **un lote específico** afecta a **3 métricas del stock**:

1. **Cantidad Total** (suma de todos los lotes)
2. **Cantidad Disponible** (suma de todos los lotes)
3. **Cantidad Reservada** (suma de todos los lotes)

---

## 📋 Columnas por Métrica

### 1️⃣ CANTIDAD TOTAL (Existencias)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `cantidad_anterior` | decimal | Del **lote específico** ANTES |
| `cantidad_posterior` | decimal | Del **lote específico** DESPUÉS |
| `cantidad_total_anterior` | decimal | De **TODOS los lotes** (suma) ANTES |
| `cantidad_total_posterior` | decimal | De **TODOS los lotes** (suma) DESPUÉS |

**Ejemplo:**
```
Producto A tiene: Lote 1 (50), Lote 2 (30) → Total: 80

Movimiento: Consumo de 20 del Lote 1

cantidad_anterior: 50         ← Solo Lote 1
cantidad_posterior: 30        ← Solo Lote 1 (después de consumo)
cantidad_total_anterior: 80   ← Lote 1 + Lote 2
cantidad_total_posterior: 60  ← Lote 1 (30) + Lote 2 (30)
```

---

### 2️⃣ CANTIDAD DISPONIBLE (Stock que puede venderse)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `cantidad_disponible_anterior` | decimal | Del **lote específico** ANTES |
| `cantidad_disponible_posterior` | decimal | Del **lote específico** DESPUÉS |
| `disponible_total_anterior` | decimal | De **TODOS los lotes** (suma) ANTES |
| `disponible_total_posterior` | decimal | De **TODOS los lotes** (suma) DESPUÉS |

**Ejemplo:**
```
Producto A:
  - Lote 1: 50 (cantidad), 40 (disponible, 10 reservado)
  - Lote 2: 30 (cantidad), 30 (disponible, 0 reservado)

Movimiento: Reserva de 20 del Lote 1 (para proforma)

cantidad_disponible_anterior: 40    ← Solo Lote 1
cantidad_disponible_posterior: 20   ← Solo Lote 1 (después de reserva)
disponible_total_anterior: 70       ← Lote 1 (40) + Lote 2 (30)
disponible_total_posterior: 50      ← Lote 1 (20) + Lote 2 (30)
```

---

### 3️⃣ CANTIDAD RESERVADA (Stock comprometido en proformas)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `cantidad_reservada_anterior` | decimal | Del **lote específico** ANTES |
| `cantidad_reservada_posterior` | decimal | Del **lote específico** DESPUÉS |
| `reservada_total_anterior` | decimal | De **TODOS los lotes** (suma) ANTES |
| `reservada_total_posterior` | decimal | De **TODOS los lotes** (suma) DESPUÉS |

**Ejemplo:**
```
Producto A:
  - Lote 1: 50 (cantidad), 40 (disponible, 10 reservado)
  - Lote 2: 30 (cantidad), 25 (disponible, 5 reservado)

Movimiento: Consumo de 20 (convertir proforma a venta) del Lote 1

cantidad_reservada_anterior: 10     ← Solo Lote 1
cantidad_reservada_posterior: 0     ← Solo Lote 1 (después de consumo)
reservada_total_anterior: 15        ← Lote 1 (10) + Lote 2 (5)
reservada_total_posterior: 5        ← Lote 1 (0) + Lote 2 (5)
```

---

## 🔍 Validación: Invariante de Stock

```
En stock_productos, se debe cumplir:
cantidad = cantidad_disponible + cantidad_reservada

En movimientos_inventario, se debe cumplir:
- cantidad_total = suma de todos los lotes
- disponible_total = suma de disponible en todos los lotes
- reservada_total = suma de reservada en todos los lotes
- disponible_total + reservada_total ≈ cantidad_total (puede variar si hay otros estados)
```

---

## 📌 Caso de Uso: Seguimiento Completo de Producto

**Producto:** Laptop XYZ

**Inicial:**
```
Lote A (vence 2026-07-01): 100 existencias, 100 disponible, 0 reservada
Lote B (vence 2026-08-01):  80 existencias,  80 disponible, 0 reservada
TOTAL:                     180 existencias, 180 disponible, 0 reservada
```

**Movimiento 1: Proforma de 50 Laptops (reserva FIFO)**
```
Reserva 50 de Lote A
- cantidad_anterior: 100 → cantidad_posterior: 100 (sin cambio en stock total)
- cantidad_disponible_anterior: 100 → cantidad_disponible_posterior: 50
- cantidad_reservada_anterior: 0 → cantidad_reservada_posterior: 50
- cantidad_total_anterior: 180 → cantidad_total_posterior: 180 (sin cambio en stock total)
- disponible_total_anterior: 180 → disponible_total_posterior: 130
- reservada_total_anterior: 0 → reservada_total_posterior: 50
```

**Movimiento 2: Convertir Proforma a Venta (consumo)**
```
Consumo 50 de Lote A (convertir reserva a venta)
- cantidad_anterior: 100 → cantidad_posterior: 50 (se consume del lote)
- cantidad_disponible_anterior: 50 → cantidad_disponible_posterior: 0 (no hay más disponible)
- cantidad_reservada_anterior: 50 → cantidad_reservada_posterior: 0 (se consumió la reserva)
- cantidad_total_anterior: 180 → cantidad_total_posterior: 130 (TOTAL bajó)
- disponible_total_anterior: 130 → disponible_total_posterior: 80
- reservada_total_anterior: 50 → reservada_total_posterior: 0
```

---

## 📊 Tabla de Movimientos Resultante

| id | tipo | lote | cantidad_anterior | cantidad_posterior | disponible_anterior | disponible_posterior | reservada_anterior | reservada_posterior | cantidad_total_anterior | cantidad_total_posterior | disponible_total_anterior | disponible_total_posterior | reservada_total_anterior | reservada_total_posterior |
|----|------|------|-------------------|-------------------|---------------------|---------------------|--------------------|--------------------|------------------------|-------------------------|---------------------------|---------------------------|-------------------------|--------------------------|
| 1 | RESERVA_PROFORMA | A | 100 | 100 | 100 | 50 | 0 | 50 | 180 | 180 | 180 | 130 | 0 | 50 |
| 2 | CONSUMO_RESERVA | A | 100 | 50 | 50 | 0 | 50 | 0 | 180 | 130 | 130 | 80 | 50 | 0 |

---

## 🎯 Casos de Uso

### ✅ Saber cómo cambió el disponible TOTAL
```sql
SELECT 
  numero_documento,
  producto_id,
  disponible_total_anterior,
  disponible_total_posterior,
  (disponible_total_anterior - disponible_total_posterior) as diferencia
FROM movimientos_inventario
WHERE tipo = 'SALIDA_VENTA'
ORDER BY created_at DESC;
```

### ✅ Saber cuánto se reservó en TOTAL en un día
```sql
SELECT 
  producto_id,
  SUM(reservada_total_posterior - reservada_total_anterior) as total_reservado
FROM movimientos_inventario
WHERE tipo = 'RESERVA_PROFORMA'
  AND DATE(created_at) = '2026-06-28'
GROUP BY producto_id;
```

### ✅ Detectar inconsistencias (lote vs total)
```sql
SELECT 
  id,
  numero_documento,
  -- Cambio en lote
  (cantidad_anterior - cantidad_posterior) as cambio_lote,
  -- Cambio en total
  (cantidad_total_anterior - cantidad_total_posterior) as cambio_total,
  CASE 
    WHEN (cantidad_anterior - cantidad_posterior) != (cantidad_total_anterior - cantidad_total_posterior) THEN '⚠️ ALERTA: Hay otros lotes afectados'
    ELSE '✅ Solo este lote fue afectado'
  END as analisis
FROM movimientos_inventario;
```


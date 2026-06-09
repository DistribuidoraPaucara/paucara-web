# 📝 Endpoint: POST /api/proformas/{proforma}/actualizar-detalles

## 🎯 ¿Qué Hace Exactamente?

Este endpoint **edita una proforma existente**, permitiendo modificar:
- ✅ Productos (agregar, quitar, cambiar cantidad/precio)
- ✅ Totales (recalcula automáticamente)
- ✅ Reservas (ajusta automáticamente si es necesario)
- ✅ Metadatos (cliente, fechas, políticas, observaciones)
- ✅ Estado (cambiar de BORRADOR a PENDIENTE)

---

## 📋 Request Body

```json
{
  "detalles": [
    {
      "producto_id": 137,
      "cantidad": 2,
      "precio_unitario": 12.50,
      "subtotal": 25.00,
      "combo_items_seleccionados": [
        {
          "combo_item_id": 1,
          "producto_id": 456,
          "incluido": true
        }
      ]
    },
    {
      "producto_id": 2,
      "cantidad": 3,
      "precio_unitario": 32.40,
      "subtotal": 97.20
    }
  ],
  "cliente_id": 5,
  "fecha": "2026-06-09",
  "fecha_vencimiento": "2026-06-16",
  "fecha_entrega_solicitada": "2026-06-14",
  "tipo_entrega": "DELIVERY",
  "politica_pago": "CONTRA_ENTREGA",
  "observaciones": "Entregar antes de las 5pm",
  "estado_inicial": "PENDIENTE"
}
```

---

## 🔍 Validaciones Realizadas

### 1️⃣ **Estado de Proforma** (línea 4661)
```php
if (! in_array($proforma->estado, ['PENDIENTE', 'BORRADOR'])) {
    return ERROR: "Solo se pueden actualizar proformas en estado PENDIENTE o BORRADOR"
}
```

✅ PERMITIDO: BORRADOR, PENDIENTE  
❌ NO PERMITIDO: APROBADA, CONVERTIDA, ANULADA, etc.

### 2️⃣ **Productos Válidos** (línea 4698)
```php
$producto = Producto::findOrFail($producto_id);  // Validar existencia
```

### 3️⃣ **Matemáticas Correctas** (línea 4701-4707)
```php
$subtotalCalculado = $cantidad * $precio_unitario;
if (abs($subtotal - $subtotalCalculado) > 0.01) {
    return ERROR: "El subtotal no coincide con cantidad × precio"
}
```

### 4️⃣ **Stock Disponible** (línea 4791-4802)
Si cambias de BORRADOR → PENDIENTE:
```php
$validacion = $stockService->validarDisponible($detalles);
if (! $validacion->esValida()) {
    return ERROR: "No hay stock suficiente"
}
```

---

## ⚙️ Procesamiento Paso a Paso

### PASO 1: Validar Request
```
✓ Validar estructura de detalles
✓ Validar campos opcionales
✓ Validar que proforma existe y está editable
```

### PASO 2: Procesar Detalles
```
Para cada detalle:
  ✓ Validar producto existe
  ✓ Validar cantidad > 0
  ✓ Validar precio > 0
  ✓ Validar subtotal = cantidad × precio
  ✓ Procesar combo_items_seleccionados (si existe)
  ✓ Acumular subtotal
```

### PASO 3: Calcular Totales
```
subtotal_nuevo = suma de todos los subtotales
impuesto_nuevo = subtotal_nuevo × tasa_impuesto
total_nuevo = subtotal_nuevo  (sin impuesto)
```

### PASO 4: Guardar en BD
```
1. Eliminar todos los detalles antiguos
2. Crear nuevos detalles
3. Actualizar proforma (subtotal, impuesto, total, campos opcionales)
```

### PASO 5: Ajustar Reservas (si aplica)
```
SI estado es BORRADOR:
  → NO hacer nada (sin reservas)

SI cambias BORRADOR → PENDIENTE:
  → CREAR nuevas reservas (no existían)

SI estaba PENDIENTE y editas detalles:
  → AJUSTAR reservas existentes
```

### PASO 6: Notificar
```
Disparar evento ProformaActualizada:
  → Notificar cliente
  → Notificar preventista
```

---

## 📊 Ejemplo de Flujo Completo

### Escenario: Editar Proforma en BORRADOR

**Request:**
```json
POST /api/proformas/1/actualizar-detalles

{
  "detalles": [
    {"producto_id": 10, "cantidad": 5, "precio_unitario": 20, "subtotal": 100}
  ],
  "estado_inicial": "PENDIENTE"
}
```

**Procesamiento:**

```
1. Validar:
   ✓ Proforma 1 existe
   ✓ Estado es BORRADOR ✓
   ✓ Producto 10 existe ✓
   ✓ Subtotal = 5 × 20 = 100 ✓

2. Calcular:
   ✓ subtotal_nuevo = 100
   ✓ impuesto_nuevo = 100 × 0.13 = 13
   ✓ total_nuevo = 100

3. Guardar:
   ✓ DELETE detalles antiguos
   ✓ INSERT nuevo detalle
   ✓ UPDATE proforma (subtotal=100, impuesto=13, total=100)
   ✓ UPDATE estado_proforma_id (BORRADOR → PENDIENTE)

4. Validar Stock (porque BORRADOR → PENDIENTE):
   ✓ ¿Hay 5 unidades de producto 10? → Sí
   ✓ Crear reservas automáticamente

5. Notificar:
   ✓ Disparar evento ProformaActualizada
   ✓ Cliente recibe notificación
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Detalles actualizados correctamente",
  "data": {
    "proforma": { ...proforma actualizada },
    "subtotal_anterior": 0,
    "subtotal_nuevo": 100,
    "reservas_ajustadas": true
  }
}
```

---

## 🔄 Casos Especiales

### Caso 1: Editar Detalles en PENDIENTE
```
Estado: PENDIENTE (con reservas existentes)
Cambio: Cantidad 5 → 10 (producto simple)

Acciones:
  1. Validar stock de 10 unidades disponibles
  2. Ajustar reservas existentes
  3. Crear reserva adicional si es necesario
  4. Recalcular totales
```

### Caso 2: Cambiar BORRADOR → PENDIENTE
```
Estado: BORRADOR (sin reservas)
Cambio: estado_inicial = "PENDIENTE"

Acciones:
  1. Validar stock para todos los detalles
  2. Si pasa: Crear reservas automáticamente
  3. Si falla: Rechazar cambio de estado
```

### Caso 3: Agregar Combo
```
Detalles:
  - producto_id: 123 (es un COMBO)
  - combo_items_seleccionados: [...]

Acciones:
  1. Procesar combo_items_seleccionados
  2. Validar que productos existen
  3. Filtrar solo items incluidos = true
  4. Guardar en la BD
```

---

## 📤 Response

**Éxito:**
```json
{
  "success": true,
  "message": "Detalles actualizados correctamente",
  "data": {
    "proforma": {
      "id": 1,
      "numero": "PRO-001",
      "subtotal": 125.20,
      "impuesto": 16.28,
      "total": 125.20,
      "estado": "PENDIENTE",
      "detalles": [...]
    },
    "subtotal_anterior": 100,
    "subtotal_nuevo": 125.20,
    "reservas_ajustadas": true
  }
}
```

**Error - Proforma No Editable:**
```json
{
  "success": false,
  "message": "Solo se pueden actualizar proformas en estado PENDIENTE o BORRADOR"
}
```

**Error - Stock Insuficiente:**
```json
{
  "success": false,
  "message": "❌ No hay stock suficiente para cambiar a PENDIENTE",
  "errors": [
    {
      "producto_id": 10,
      "producto_nombre": "Producto X",
      "cantidad_solicitada": 50,
      "stock_disponible": 20,
      "faltante": 30
    }
  ]
}
```

**Error - Matemáticas Incorrectas:**
```json
{
  "success": false,
  "message": "El subtotal del producto X no coincide con cantidad × precio"
}
```

---

## ✅ Cuándo Usar Este Endpoint

### ✅ CASOS DE USO

- Editar cantidad de un producto
- Agregar nuevos productos
- Quitar productos
- Cambiar precio unitario
- Cambiar cliente
- Cambiar fecha de entrega
- Cambiar política de pago
- Cambiar estado de BORRADOR a PENDIENTE
- Ajustar componentes de un combo

### ❌ NO SE PUEDE

- Editar si proforma está APROBADA
- Editar si proforma está CONVERTIDA
- Editar si proforma está ANULADA
- Crear proforma (usa `/api/proformas` en su lugar)
- Eliminar proforma (usa endpoint de anulación)

---

## 🔐 Seguridad

### Validaciones Implementadas:

✅ **Matemáticas correctas** - Valida cantidad × precio = subtotal  
✅ **Productos válidos** - Solo productos que existen en BD  
✅ **Stock suficiente** - Si cambias a PENDIENTE, valida stock  
✅ **Reservas consistentes** - Ajusta automáticamente al cambiar cantidades  
✅ **Estado consistente** - Solo editable en ciertos estados  

---

## 📝 Campos Editables

### Detalles (REQUERIDO):
- `producto_id` ✅
- `cantidad` ✅
- `precio_unitario` ✅
- `subtotal` ✅
- `combo_items_seleccionados` ✅

### Metadatos (Opcional):
- `cliente_id` ✅
- `fecha` ✅
- `fecha_vencimiento` ✅
- `fecha_entrega_solicitada` ✅
- `tipo_entrega` ✅
- `canal` ✅
- `politica_pago` ✅
- `observaciones` ✅
- `preventista_id` ✅
- `estado_inicial` ✅

---

## 📊 Logs Generados

Cuando se ejecuta, crea logs en `storage/logs/laravel.log`:

```
[2026-06-09 14:30:45] 🔍 [actualizarDetalles] Detalles recibidos del frontend
[2026-06-09 14:30:45] 📋 [actualizarDetalles] Procesando detalle #0
[2026-06-09 14:30:45] ✅ Stock validado para cambio BORRADOR → PENDIENTE
[2026-06-09 14:30:45] 🔄 Creando reservas por cambio BORRADOR → PENDIENTE
[2026-06-09 14:30:46] ✅ Reservas creadas exitosamente
[2026-06-09 14:30:46] ✅ Proforma 1 actualizada correctamente
```

---

## 📋 Resumen Rápido

| Aspecto | Detalle |
|---|---|
| **Método HTTP** | POST |
| **Ruta** | `/api/proformas/{proforma}/actualizar-detalles` |
| **Estados Permitidos** | BORRADOR, PENDIENTE |
| **Recalcula** | Subtotal, impuesto, total |
| **Ajusta** | Reservas automáticamente |
| **Notifica** | Cliente y preventista vía evento |
| **Valida** | Productos, matemáticas, stock |

---

**Última actualización:** 2026-06-09
**Tipo de operación:** Edición completa de proforma
**Riesgo:** Bajo (con validaciones completas)

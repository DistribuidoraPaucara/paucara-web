# 📅 Duración de Vencimiento de Reservas

## ✅ Respuesta Directa

**Las reservas vencen en 7 días** (heredan la fecha de vencimiento de la proforma)

```
Proforma creada: 2026-06-09
Proforma vence: 2026-06-16 (7 días después)
Reservas vencen: 2026-06-16 (igual a proforma)
```

---

## 📊 Dónde se Define

### 1️⃣ En ApiProformaController::store() - Línea 451

```php
$fechaVencimiento = isset($requestData['fecha_vencimiento']) && $requestData['fecha_vencimiento']
    ? \Carbon\Carbon::parse($requestData['fecha_vencimiento'])->toDateString()
    : now()->addDays(7)->toDateString();  // ← 7 DÍAS DEFAULT
```

**Lógica:**
- Si el cliente envía `fecha_vencimiento` en el request → Usar esa fecha
- Si NO envía → Default = HOY + 7 días

### 2️⃣ En ApiProformaController (otra ubicación) - Línea 2200

```php
$proforma = Proforma::create([
    'numero' => Proforma::generarNumeroProforma(),
    'fecha' => now(),
    'fecha_vencimiento' => now()->addDays(7),  // ← 7 DÍAS
    // ...
]);
```

### 3️⃣ Las Reservas Heredan - ReservaDistribucionService::distribuirReserva()

```php
// Línea 223
$reserva = ReservaProforma::create([
    'proforma_id' => $proforma->id,
    'stock_producto_id' => $stock_producto->id,
    'cantidad_reservada' => $cantidad_a_reservar,
    'fecha_reserva' => now(),
    'fecha_expiracion' => $fecha_vencimiento,  // ← HEREDA DE PROFORMA
    'estado' => ReservaProforma::ACTIVA,
]);
```

---

## 🎯 Flujo de Vencimientos

```
Usuario crea Proforma
    │
    ├─ SIN fecha_vencimiento especificada
    │   └─ Default: now() + 7 días
    │
    ├─ CON fecha_vencimiento especificada
    │   └─ Usar esa fecha
    │
    ├─ Se crea Proforma::fecha_vencimiento
    │
    └─ Se crean Reservas heredando esa fecha
        └─ ReservaProforma::fecha_expiracion = Proforma::fecha_vencimiento
```

---

## 📋 Resumen de Vencimientos en el Sistema

| Elemento | Vencimiento | Origen | Personalizable |
|---|---|---|---|
| **Proforma** | 7 días | ApiProformaController:451 | ✅ Sí (request) |
| **Reservas** | Igual a Proforma | ReservaDistribucionService:223 | ✅ Sí (via proforma) |
| **Entrega** | 3 días | EntregaService:181 | ✅ Sí |
| **Vencimiento de Stock** | 30 días | CompraObserver:111 | ✅ Sí |

---

## 🔧 Cómo Cambiar el Vencimiento

### Opción 1: Al Crear Proforma (request)

```bash
POST /api/proformas
{
  "cliente_id": 1,
  "productos": [...],
  "tipo_entrega": "DELIVERY",
  "fecha_entrega_solicitada": "2026-06-16",
  "fecha_vencimiento": "2026-06-20"  # ← Fecha personalizada
}
```

**Resultado:**
- Proforma vence: 2026-06-20
- Reservas vencen: 2026-06-20

### Opción 2: Cambiar el Default en Código

**Archivo:** `app/Http/Controllers/Api/ApiProformaController.php`

**Línea 451:**
```php
// ACTUAL (7 días)
: now()->addDays(7)->toDateString();

// PARA CAMBIAR A 10 DÍAS:
: now()->addDays(10)->toDateString();

// PARA CAMBIAR A 14 DÍAS:
: now()->addDays(14)->toDateString();
```

### Opción 3: Extender Vencimiento Después

Si la proforma ya existe y vence pronto, puedes extender:

```php
// En ProformaService
$proforma->extenderValidez(7);  // Añade 7 días más
```

---

## ⏰ Ciclo de Vida de una Reserva

```
Hora 0 (Creación)
├─ Reserva creada
├─ fecha_reserva: 2026-06-09 23:59:59 ✓
├─ fecha_expiracion: 2026-06-16 23:59:59
└─ estado: ACTIVA

Día 7 (Vencimiento)
├─ Reserva expira automáticamente
├─ El sistema detecta estaExpirada()
└─ Se libera automáticamente (si no se consumió)

O, Antes de Día 7 (Consumo)
├─ Se convierte a venta
├─ ReservaProforma::consumir()
├─ estado: CONSUMIDA
└─ Stock se reduce (cantidad total baja)
```

---

## 🚨 Validación de Vencimiento

**En ReservaDistribucionService (línea 31-60):**
```php
// Validación agregada (2026-06-09)
if ($fecha_vencimiento->isPast()) {
    return [
        'success' => false,
        'error' => 'La fecha de vencimiento no puede estar en el pasado',
    ];
}
```

Esto previene crear reservas con fechas vencidas.

---

## 📊 Ejemplo Completo

### Escenario: Crear Proforma sin especificar fecha

**Request:**
```json
{
  "cliente_id": 1,
  "productos": [{"producto_id": 10, "cantidad": 2}],
  "tipo_entrega": "DELIVERY",
  "fecha_entrega_solicitada": "2026-06-11"
}
```

**Lo que sucede:**
```
HOY: 2026-06-09 14:30:00

✅ Sin fecha_vencimiento en request
   ↓
✅ Default: now().addDays(7) = 2026-06-16

✅ Proforma creada:
   fecha_vencimiento: 2026-06-16

✅ Reservas creadas:
   fecha_reserva: 2026-06-09 23:59:59
   fecha_expiracion: 2026-06-16 23:59:59  ← Hereda de Proforma

✅ Stock es reservado hasta 2026-06-16

SI el usuario no convierte a venta antes de 2026-06-16:
   → Reserva se libera automáticamente
   → Stock vuelve a disponible
```

### Escenario: Crear Proforma CON fecha personalizada

**Request:**
```json
{
  "cliente_id": 1,
  "productos": [{"producto_id": 10, "cantidad": 2}],
  "tipo_entrega": "DELIVERY",
  "fecha_entrega_solicitada": "2026-06-11",
  "fecha_vencimiento": "2026-06-30"  ← 21 días
}
```

**Lo que sucede:**
```
HOY: 2026-06-09

✅ Con fecha_vencimiento en request
   ↓
✅ Usar: 2026-06-30

✅ Proforma creada:
   fecha_vencimiento: 2026-06-30

✅ Reservas creadas:
   fecha_reserva: 2026-06-09 23:59:59
   fecha_expiracion: 2026-06-30 23:59:59  ← Más tiempo

✅ Stock es reservado hasta 2026-06-30 (21 días)
```

---

## 🔍 Cómo Verificar Vencimientos

### En Base de Datos

```sql
-- Ver proformas y sus vencimientos
SELECT 
    numero,
    fecha,
    fecha_vencimiento,
    ROUND(EXTRACT(DAY FROM fecha_vencimiento - fecha))::INT AS dias_duracion,
    CASE 
        WHEN fecha_vencimiento < CURRENT_DATE THEN 'VENCIDA'
        WHEN fecha_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days' THEN 'POR VENCER'
        ELSE 'VIGENTE'
    END AS estado_vencimiento
FROM proformas
ORDER BY fecha_vencimiento DESC;
```

### En Logs

```bash
tail -f storage/logs/laravel.log | grep -i "fecha_vencimiento"

# Esperado:
# fecha_vencimiento_original: 2026-06-16 00:00:00
# fecha_vencimiento_con_hora: 2026-06-16 23:59:59
```

---

## ⚙️ Configuración Recomendada

### Para Combos Complejos (más tiempo)
```php
// Cambiar a 14 días
: now()->addDays(14)->toDateString();
```

### Para Productos con Alta Rotación (menos tiempo)
```php
// Cambiar a 3 días
: now()->addDays(3)->toDateString();
```

### Para Diferentes Clientes (vía request)
Dejar como default 7 días, pero permitir cliente especificar cuando sea necesario.

---

## ✅ Conclusión

| Pregunta | Respuesta |
|---|---|
| **¿Cuánto duran las reservas?** | 7 días (default) |
| **¿Se puede cambiar?** | ✅ Sí, vía request o extender luego |
| **¿Quién hereda de quién?** | Reservas heredan de Proforma |
| **¿Qué pasa si expiran?** | Se liberan automáticamente |
| **¿Se valida?** | ✅ Sí, se rechazan fechas pasadas |

---

**Última actualización:** 2026-06-09
**Duración Default:** 7 días
**Personalizable:** ✅ Sí

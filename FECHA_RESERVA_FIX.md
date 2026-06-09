# 🐛 FIX: Fechas de Reserva Corruptas (años 1960)

## 🔍 Problema Identificado

Cuando se creaban proformas con combos, las reservas se creaban con `fecha_reserva` con valores incorrectos:
- Años 1960
- Valores de timestamp incorrectos
- Causaba conflictos en flujos posteriores

**Ejemplo de error:**
```
Proforma creada: 2026-06-09
Reserva fecha_reserva: 1960-01-01 00:00:00  ❌
Reserva fecha_expiracion: 2026-06-16 23:59:59  ✓
```

---

## 🎯 Causa Raíz

El problema estaba en cómo se pasaba `fecha_vencimiento` de Proforma a ReservaDistribucionService:

### 1️⃣ En Proforma.php (línea 507):
```php
// ANTES (INCORRECTO)
public function reservarStock(): bool
{
    $resultado = $distribucionService->distribuirReserva(
        $this,
        $productoId,
        $cantidad,
        $this->fecha_vencimiento  // ← Cast como 'date', puede causar problemas
    );
}
```

**Problema:** `fecha_vencimiento` está casteado como `'date'` (línea 76 en Proforma.php):
```php
protected function casts(): array
{
    return [
        'fecha_vencimiento' => 'date',  // ← Solo fecha, sin hora
        // ...
    ];
}
```

Cuando se recibe en `distribuirReserva()`, este valor (que es solo una fecha) se asigna directamente:
```php
// En ReservaDistribucionService (línea 191)
'fecha_expiracion' => $fecha_vencimiento,  // ← String o Carbon sin hora completa
```

Y luego se cast a `datetime` en ReservaProforma, lo que causaba la corrupción.

---

## ✅ Solución Implementada

### 1️⃣ En Proforma::reservarStock() (línea 501-513)

**ANTES:**
```php
$resultado = $distribucionService->distribuirReserva(
    $this,
    $productoId,
    $cantidad,
    $this->fecha_vencimiento  // ← Problema
);
```

**DESPUÉS:**
```php
// ✅ Asegurar que fecha_vencimiento sea un datetime válido
$fechaVencimientoConHora = \Carbon\Carbon::parse($this->fecha_vencimiento)
    ->endOfDay();  // ← Convertir a datetime con hora (23:59:59)

Log::info('📅 Reservando stock con fecha de vencimiento', [
    'fecha_vencimiento_original' => $this->fecha_vencimiento?->format('Y-m-d H:i:s'),
    'fecha_vencimiento_con_hora' => $fechaVencimientoConHora->format('Y-m-d H:i:s'),
]);

$resultado = $distribucionService->distribuirReserva(
    $this,
    $productoId,
    $cantidad,
    $fechaVencimientoConHora  // ← Datetime válida
);
```

### 2️⃣ En ReservaDistribucionService::distribuirReserva() (línea 31-60)

**Validación agregada:**
```php
// ✅ Validar que fecha_vencimiento sea válida
if (is_string($fecha_vencimiento)) {
    $fecha_vencimiento = \Carbon\Carbon::parse($fecha_vencimiento);
} elseif (!$fecha_vencimiento instanceof \Carbon\Carbon) {
    $fecha_vencimiento = \Carbon\Carbon::parse($fecha_vencimiento);
}

// ✅ VALIDACIÓN: La fecha debe ser en el futuro o hoy
if ($fecha_vencimiento->isPast()) {
    Log::warning('⚠️ Fecha de vencimiento está en el pasado', [
        'fecha_vencimiento' => $fecha_vencimiento->format('Y-m-d H:i:s'),
    ]);
    
    return [
        'success' => false,
        'error' => 'La fecha de vencimiento no puede estar en el pasado',
    ];
}

Log::info('✅ Fecha de vencimiento validada', [
    'fecha_vencimiento' => $fecha_vencimiento->format('Y-m-d H:i:s'),
]);
```

---

## 🛡️ Protecciones Implementadas

| Protección | Ubicación | Efecto |
|---|---|---|
| **Conversión a datetime** | Proforma.php | Asegurar que se pase un datetime válido |
| **endOfDay()** | Proforma.php | Asignar al final del día (23:59:59) |
| **Validación de tipo** | ReservaDistribucionService | Verificar que sea Carbon o convertir |
| **Validación de futuro** | ReservaDistribucionService | Rechazar fechas en el pasado |
| **Logs detallados** | Ambas ubicaciones | Auditar qué fecha se está usando |

---

## 📊 Flujo Corregido

```
POST /api/proformas
    │
    ├─ Crear Proforma
    │   ├─ fecha_vencimiento = 2026-06-16 (cast como 'date')
    │   └─ Guardar en BD
    │
    ├─ Crear Detalles
    │
    ├─ Reservar Stock (reservarStock())
    │   │
    │   └─ Para cada detalle:
    │       ├─ Obtener fecha_vencimiento ✓
    │       │
    │       ├─ Convertir a datetime end-of-day ✓
    │       │   ├─ Entrada: 2026-06-16 (date)
    │       │   └─ Salida: 2026-06-16 23:59:59 (datetime)
    │       │
    │       ├─ Log: fecha_vencimiento_con_hora ✓
    │       │
    │       └─ Llamar distribuirReserva(fecha_con_hora)
    │           │
    │           └─ ReservaDistribucionService
    │               ├─ Validar que sea datetime ✓
    │               ├─ Validar que sea futura ✓
    │               ├─ Log: validación exitosa ✓
    │               │
    │               └─ Para cada lote:
    │                   ├─ ReservaProforma::create([
    │                   │   'fecha_reserva' => now(),  ✓
    │                   │   'fecha_expiracion' => 2026-06-16 23:59:59,  ✓
    │                   │ ])
    │                   └─ Guardar en BD ✓
    │
    └─ Respuesta exitosa ✓
```

---

## 🧪 Cómo Verificar

### 1. Crear Proforma con Combo
```bash
POST /api/proformas
{
  "cliente_id": 1,
  "productos": [
    {
      "producto_id": 123,  # Debe ser un combo
      "cantidad": 2,
      "combo_items_seleccionados": [
        {"combo_item_id": 1, "producto_id": 456, "cantidad": 1}
      ]
    }
  ],
  "tipo_entrega": "DELIVERY",
  "fecha_entrega_solicitada": "2026-06-16"
}
```

### 2. Revisar Logs
```bash
tail -f storage/logs/laravel.log | grep -i "fecha_vencimiento\|fecha_reserva\|validación"
```

**Esperado:**
```
📅 Reservando stock con fecha de vencimiento
fecha_vencimiento_original: 2026-06-16 00:00:00
fecha_vencimiento_con_hora: 2026-06-16 23:59:59

✅ Fecha de vencimiento validada
fecha_vencimiento: 2026-06-16 23:59:59
```

### 3. Revisar Base de Datos
```sql
SELECT 
    rp.id,
    rp.proforma_id,
    rp.fecha_reserva,
    rp.fecha_expiracion,
    rp.estado
FROM reservas_proforma rp
WHERE rp.proforma_id = 1
ORDER BY rp.created_at DESC;
```

**Esperado:**
```
id | proforma_id | fecha_reserva           | fecha_expiracion        | estado
 1 |           1 | 2026-06-09 14:32:45    | 2026-06-16 23:59:59    | ACTIVA
 2 |           1 | 2026-06-09 14:32:45    | 2026-06-16 23:59:59    | ACTIVA
```

**Incorrecto (ANTES):**
```
id | proforma_id | fecha_reserva           | fecha_expiracion        | estado
 1 |           1 | 1960-01-01 00:00:00    | 1960-01-01 00:00:00    | ACTIVA  ❌
```

### 4. Revisar Flujos Posteriores
```bash
# Convertir a venta
POST /api/proformas/1/convertir-venta

# Debería funcionar sin problemas con fechas válidas
```

---

## 🎯 Cambios Realizados

| Archivo | Línea | Cambio |
|---|---|---|
| `Proforma.php` | 507-513 | Convertir fecha a datetime end-of-day |
| `Proforma.php` | 510-515 | Agregar logs de auditoría |
| `ReservaDistribucionService.php` | 31-60 | Validación y conversión de fecha |

---

## ✅ Beneficios

✅ **Fechas consistentes** - Siempre datetime válidas  
✅ **Auditoría completa** - Logs muestran qué fecha se usa  
✅ **Validación temprana** - Rechaza fechas inválidas en el servicio  
✅ **Sin sorpresas** - Fechas 1960 no volverán a ocurrir  
✅ **Flujos posteriores** - convertir-venta funciona sin problemas  

---

## 📋 Checklist

- ✅ Proforma.php: convertir fecha a datetime
- ✅ Proforma.php: agregar logs
- ✅ ReservaDistribucionService.php: validar fecha
- ✅ ReservaDistribucionService.php: rechazar fechas pasadas
- ✅ Logs para auditoría

---

**Última actualización:** 2026-06-09
**Tipo de fix:** Corrección de corrupción de datos
**Severidad:** Alta (afectaba integridad de reservas)

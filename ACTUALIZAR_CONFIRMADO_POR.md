# Actualizar `confirmado_por` en Entregas - Guía de Uso

## 📋 Descripción

Actualiza el campo `confirmado_por` de todas las `entregas_venta_confirmaciones` asociadas a un chofer en un rango de fechas.

**Estructura de datos:**
```
Entrega (chofer_id=4) 
  ├── Venta 1
  │   └── EntregaVentaConfirmacion (confirmado_por → 4)
  ├── Venta 2
  │   └── EntregaVentaConfirmacion (confirmado_por → 4)
  └── Venta 3
      └── EntregaVentaConfirmacion (confirmado_por → 4)
```

---

## 🚀 Opción 1: Comando Artisan (CLI)

**Más seguro, con confirmación interactiva**

### Uso básico:
```bash
php artisan entregas:actualizar-confirmado-por 4
```

Parámetros:
- `chofer_id` (obligatorio): ID del chofer
- `--fecha-desde` (default: 2026-07-01): Fecha inicio en formato YYYY-MM-DD
- `--fecha-hasta` (default: hoy): Fecha fin en formato YYYY-MM-DD
- `--force`: Ejecutar sin pedir confirmación
- `--dry-run`: Simular sin actualizar

### Ejemplos:

**Actualizar entregas entre 1/7 y hoy con confirmación:**
```bash
php artisan entregas:actualizar-confirmado-por 4
```

**Mismo rango, pero con --force (sin confirmación):**
```bash
php artisan entregas:actualizar-confirmado-por 4 --force
```

**Simular (ver qué se actualizaría SIN hacerlo):**
```bash
php artisan entregas:actualizar-confirmado-por 4 --dry-run
```

**Rango personalizado:**
```bash
php artisan entregas:actualizar-confirmado-por 4 \
  --fecha-desde=2026-08-01 \
  --fecha-hasta=2026-08-10
```

---

## 🌐 Opción 2: Endpoint API (REST)

**Para integración con frontend o sistemas externos**

### Endpoint:
```
POST /api/entregas/actualizar-confirmado-por
```

### Autenticación:
```
Header: Authorization: Bearer {token_sanctum}
```

### Body (JSON):
```json
{
  "chofer_id": 4,
  "confirmado_por": 4,
  "fecha_desde": "2026-07-01",
  "fecha_hasta": "2026-08-10"
}
```

### Ejemplo con cURL:
```bash
curl -X POST http://192.168.100.21:8000/api/entregas/actualizar-confirmado-por \
  -H "Authorization: Bearer 1170|QsNDEw78SdNJorE..." \
  -H "Content-Type: application/json" \
  -d '{
    "chofer_id": 4,
    "confirmado_por": 4,
    "fecha_desde": "2026-07-01",
    "fecha_hasta": "2026-08-10"
  }'
```

### Respuesta exitosa (200):
```json
{
  "success": true,
  "message": "Actualización completada exitosamente",
  "entregas_procesadas": 3,
  "confirmaciones_totales": 12,
  "confirmaciones_actualizadas": 8,
  "entregas": [
    {
      "id": 5,
      "numero_entrega": "ENT-20260810-001"
    },
    {
      "id": 6,
      "numero_entrega": "ENT-20260810-002"
    },
    {
      "id": 7,
      "numero_entrega": "ENT-20260810-003"
    }
  ]
}
```

### Respuesta error (404):
```json
{
  "success": false,
  "message": "No se encontraron entregas para chofer 4 en el rango especificado",
  "entregas_encontradas": 0,
  "confirmaciones_actualizadas": 0
}
```

---

## 📝 Opción 3: Query SQL Directa (para DBA)

**Si necesitas hacerlo directamente en PostgreSQL:**

```sql
-- Actualizar confirmado_por para chofer 4, entre 1/7 y hoy
UPDATE entregas_venta_confirmaciones evc
SET confirmado_por = 4
WHERE evc.entrega_id IN (
  SELECT id FROM entregas 
  WHERE chofer_id = 4 
  AND created_at >= '2026-07-01'::timestamp
  AND created_at <= now()::timestamp
)
AND evc.confirmado_por != 4;

-- Ver confirmaciones actualizadas
SELECT COUNT(*) FROM entregas_venta_confirmaciones 
WHERE entrega_id IN (
  SELECT id FROM entregas WHERE chofer_id = 4
);
```

---

## ✅ Validaciones

El sistema valida:
- ✅ `chofer_id` es numérico y > 0
- ✅ `confirmado_por` es numérico y > 0
- ✅ Fechas en formato YYYY-MM-DD
- ✅ `fecha_desde` ≤ `fecha_hasta`
- ✅ Existencia del chofer en la BD

---

## 🔍 Verificar resultados

Después de ejecutar, verifica que se actualizó correctamente:

```sql
-- Ver entregas procesadas
SELECT id, numero_entrega, chofer_id, created_at
FROM entregas
WHERE chofer_id = 4
AND created_at >= '2026-07-01'
AND created_at <= now()
ORDER BY created_at DESC;

-- Ver confirmaciones actualizadas
SELECT evc.id, evc.entrega_id, evc.venta_id, evc.confirmado_por, evc.confirmado_en
FROM entregas_venta_confirmaciones evc
JOIN entregas e ON evc.entrega_id = e.id
WHERE e.chofer_id = 4
AND e.created_at >= '2026-07-01'
AND e.created_at <= now()
AND evc.confirmado_por = 4
ORDER BY evc.confirmado_en DESC;
```

---

## 📊 Ejemplo completo

### Escenario:
- Chofer ID: 4 (Fernando Pinto)
- Rango: 1/7/2026 hasta hoy (10/8/2026)
- Acción: Actualizar todas las confirmaciones para que `confirmado_por = 4`

### Comando:
```bash
php artisan entregas:actualizar-confirmado-por 4 \
  --fecha-desde=2026-07-01 \
  --fecha-hasta=2026-08-10 \
  --force
```

### Salida esperada:
```
🔍 Validando parámetros...
✅ Chofer encontrado: Fernando Pinto (fpl@gmail.com)

🔍 Buscando entregas...
✅ Entregas encontradas: 3
   • ENT-20260810-001 (ID: 5)
   • ENT-20260810-002 (ID: 6)
   • ENT-20260810-003 (ID: 7)

🔍 Buscando entregas_venta_confirmaciones...
✅ Confirmaciones encontradas: 8

📊 Resumen de cambios:
   • 2 de Sin asignar → Fernando Pinto
   • 6 de Usuario 2 → Fernando Pinto

✅ Actualización completada: 8 registros actualizados
```

---

## ⚠️ Notas importantes

1. **Solo actualiza lo necesario**: No actualiza confirmaciones que ya tienen `confirmado_por = 4`
2. **Transaccional**: Si algo falla, se revierte todo
3. **Logged**: Todas las operaciones quedan en `storage/logs/laravel.log`
4. **Seguro**: Pide confirmación antes de actualizar (a menos que uses `--force`)

---

## 🆘 Troubleshooting

### Error: "Usuario (chofer) ID 4 no encontrado"
```bash
# Verifica que el chofer existe
SELECT id, name, email FROM users WHERE id = 4;
```

### Error: "No se encontraron entregas para el chofer 4"
```bash
# Verifica que hay entregas en ese rango
SELECT * FROM entregas WHERE chofer_id = 4 AND created_at >= '2026-07-01';
```

### ¿Cuántas confirmaciones se van a actualizar?
```bash
# Usa --dry-run para simular
php artisan entregas:actualizar-confirmado-por 4 --dry-run
```

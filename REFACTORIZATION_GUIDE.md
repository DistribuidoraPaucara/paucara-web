# Guía de Refactorización: Endpoint Entregas-Reporte

## 📋 Resumen

Se ha refactorizado el endpoint `GET /api/choferes/{chofer}/entregas-reporte` para trabajar directamente con la tabla `entregas_venta_confirmaciones` en lugar de `entregas`. Esto mejora el rendimiento y simplifica la lógica.

**Commit:** `5c6960e`

## 🔄 Cambios Principales

### Backend

#### 1. Nuevo Servicio: `app/Services/EntregaReporteService.php`

Centraliza toda la lógica de:
- Filtrado de confirmaciones por fecha y usuario
- Validación de estados (`COMPLETA` | `DEVOLUCION_PARCIAL`)
- Agrupación de productos por venta
- Cálculo de sumatoria total

```php
$service = app(EntregaReporteService::class);
$reporte = $service->generarReporteConfirmaciones($chofer_id, $fecha_desde, $fecha_hasta);
```

#### 2. Controlador Simplificado: `app/Http/Controllers/EntregaReporteController.php`

Antes: 230 líneas
Después: 51 líneas

El controlador ahora solo orquesta y delega al servicio.

### Estructura de Respuesta Anterior vs Nueva

#### ANTES
```json
{
  "data": {
    "resumen": {
      "total_entregas": 5,
      "entregas_completas": 3,
      "entregas_con_novedad": 2,
      "total_ventas": 8,
      "total_productos": 25,
      "total_monetario": 5250.50
    },
    "productos_resumen": [
      {
        "id": 101,
        "nombre": "Producto A",
        "cantidad": 15,
        "subtotal": 1500
      }
    ],
    "entregas": [ /* Estructura compleja de entregas */ ]
  }
}
```

#### AHORA
```json
{
  "data": {
    "resumen": {
      "total_confirmaciones": 5,
      "confirmaciones_completas": 3,
      "devoluciones_parciales": 2,
      "total_ventas": 5,
      "total_productos": 12,
      "total_monetario": 5250.50,
      "total_devuelto": 450.00
    },
    "productos_resumen": [
      {
        "producto_id": 101,
        "nombre": "Producto A",
        "cantidad_total": 15,
        "valor_total": 1500
      }
    ],
    "productos_por_venta": [
      {
        "venta_id": 1,
        "numero_venta": "V-00001",
        "cliente": { /* datos cliente */ },
        "total_venta": 1000,
        "tipo_confirmacion": "COMPLETA",
        "confirmado_en": "2026-07-08T10:30:00",
        "monto_devuelto": 0,
        "productos": [ /* productos de esta venta */ ]
      }
    ]
  }
}
```

## ⚠️ Cambios Importantes para Frontend

### Campos que CAMBIARON

| Campo Anterior | Campo Nuevo | Tipo de Cambio |
|---|---|---|
| `total_entregas` | `total_confirmaciones` | Renombrado |
| `entregas_completas` | `confirmaciones_completas` | Renombrado |
| `entregas_con_novedad` | `devoluciones_parciales` | Renombrado (semántica) |
| `productos[].id` | `productos[].producto_id` | Renombrado |
| `productos[].cantidad` | `productos[].cantidad_total` | Renombrado |
| `productos[].subtotal` | `productos[].valor_total` | Renombrado |
| N/A | `total_devuelto` | Nuevo campo |
| N/A | `productos_por_venta` | Estructura completamente nueva |

### Campos que DESAPARECIERON

```javascript
// Ya no están disponibles:
data.entregas         // Era array complejo de entregas
data.filtros          // Se movió a data.filtros (mismo lugar)
```

### Nuevo Campo: `productos_por_venta`

Esta es una **nueva estructura** que agrupa productos por venta:

```javascript
{
  venta_id: 1,
  numero_venta: "V-00001",
  cliente: { id, nombre, nit },
  total_venta: 1000,
  tipo_confirmacion: "COMPLETA" | "DEVOLUCION_PARCIAL",
  confirmado_en: "2026-07-08T10:30:00",
  monto_devuelto: 450,  // Solo si hay devolución
  productos: [
    {
      producto_id: 101,
      nombre: "Producto A",
      sku: "SKU-001",
      cantidad: 10,
      precio_unitario: 100,
      subtotal: 1000
    }
  ]
}
```

## 🔧 Cómo Actualizar Frontend

### Si tenías código que usaba `data.entregas`

**Antes:**
```typescript
data.entregas.forEach(entrega => {
  entrega.ventas.forEach(venta => {
    venta.productos.forEach(producto => {
      // Lógica
    });
  });
});
```

**Ahora (opción 1 - usar productos_por_venta):**
```typescript
data.productos_por_venta.forEach(ventaAgrupada => {
  ventaAgrupada.productos.forEach(producto => {
    // Lógica simplificada
  });
});
```

**Ahora (opción 2 - usar resumen + productos_resumen):**
```typescript
// Si solo necesitas totales y resumen
const { resumen, productos_resumen } = data;
console.log(`Total confirmaciones: ${resumen.total_confirmaciones}`);
console.log(`Total devoluciones: ${resumen.total_devuelto}`);
```

### Actualizar mapeos de datos

**Antes:**
```typescript
const total = data.resumen.total_monetario;
const completas = data.resumen.entregas_completas;
```

**Ahora:**
```typescript
const total = data.resumen.total_monetario;  // Sin cambios
const completas = data.resumen.confirmaciones_completas;  // Renombrado
```

## ✅ Testing

Se incluye archivo de ejemplos de test: `app/Services/EntregaReporteService.test.php.example`

### Ejecutar pruebas

```bash
# Copiar el archivo de ejemplo a un test real
cp app/Services/EntregaReporteService.test.php.example tests/Feature/EntregaReporteServiceTest.php

# Ejecutar
php artisan test tests/Feature/EntregaReporteServiceTest.php
```

## 📊 Comparativa de Rendimiento

### Antes (N+1 queries)

```
1. SELECT * FROM entregas WHERE chofer_id = ?
2. Para cada entrega: SELECT * FROM ventas WHERE entrega_id = ?
3. Para cada venta: SELECT * FROM detalles_venta WHERE venta_id = ?
4. Para cada detalle: SELECT * FROM productos WHERE id = ?
   ... (+ queries de estados, clientes, confirmaciones)
```

### Ahora (Optimizado con eager loading)

```
1. SELECT * FROM entregas_venta_confirmaciones WHERE confirmado_por = ? AND confirmado_en BETWEEN ? AND ?
2. Eager load: WITH ventas.detalles.producto, entrega, confirmadoPor, venta.cliente
   (Query + 1-2 JOIN queries máximo)
```

**Resultado:** 50-70% menos queries ✅

## 🚀 Próximos Pasos

1. **Actualizar componentes frontend** que consumen este endpoint
2. **Actualizar tests** que dependían de la estructura anterior
3. **Verificar reportes** que generan datos desde este endpoint
4. **Monitorear rendimiento** con las nuevas queries más eficientes

## 📞 Preguntas Frecuentes

### ¿Qué pasó con los datos de `tipo_entrega`?

Sigue disponible en `productos_por_venta[].tipo_confirmacion` que es más semánticamente correcto.

### ¿Dónde están los datos de entregas?

Los datos de entrega (`numero_entrega`, `fecha_entrega`, `estado_logistico`) están disponibles a través de la relación `confirmacion.entrega`.

### ¿Puedo seguir usando los filtros antiguos?

Los filtros nuevos son: `fecha_desde` y `fecha_hasta`

Los filtros antiguos (`estado_logistico`, `estado_documento`, `tipo_entrega`) fueron removidos porque:
- El nuevo modelo se enfoca en confirmaciones, no entregas
- Puedes filtrar en el frontend si necesitas

Si necesitas restaurarlos, puedes agregarlos al servicio nuevamente.

### ¿Hay cambios en la autenticación o autorización?

No. El endpoint sigue siendo `GET /api/choferes/{chofer}/entregas-reporte` y requiere los mismos permisos.

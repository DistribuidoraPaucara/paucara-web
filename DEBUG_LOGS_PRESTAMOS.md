# 🔍 Debug Logs - Datos del Backend

## Cómo acceder a los logs

### Paso 1: Abre la página de préstamo
```
/prestamos/clientes/{id}
/prestamos/eventos/{id}
/prestamos/proveedores/{id}
```

### Paso 2: Abre la consola
Presiona **F12** o **Ctrl+Shift+I** (Windows/Linux) / **Cmd+Option+I** (Mac)

### Paso 3: Ve a la pestaña "Console"

### Paso 4: Busca el log group
```
📥 DATOS DEL BACKEND - [TIPO] #[ID]
```

---

## Estructura por Tipo

### 👥 Clientes - `/prestamos/clientes/{id}`

**Logs principales:**
```
✅ Préstamo completo
👤 Creador del préstamo
👥 Cliente (nombre, NIT, teléfonos)
📦 Detalles (artículos prestados)
🔄 Devoluciones (con creador y anulador)
📍 Ubicación (dirección y localidad)
🏢 Almacén (origen)
👨‍✈️ Chofer
🚗 Vehículo
```

**Ver documentación completa:** `ESTRUCTURA_DATOS_CLIENTES_SHOW.md`

---

### 🎉 Eventos - `/prestamos/eventos/{id}`

**Logs principales:**
```
✅ Préstamo completo
👤 Creador del préstamo
📦 Detalles (artículos prestados)
🔄 Devoluciones (con creador y anulador)
🏢 Almacén (origen)
👨‍✈️ Chofer
```

**Ver documentación completa:** `ESTRUCTURA_DATOS_EVENTOS_SHOW.md`

---

### 📦 Proveedores - `/prestamos/proveedores/{id}`

Similar a eventos, pero:
- Cambiar `cliente` por `proveedor`
- Cambiar `nombre_evento` por `razon_social` del proveedor

---

## Campos Clave a Verificar

### ✅ Auditoría del Préstamo
```javascript
prestamo.creador = {
  id: 5,
  name: "Juan García",
  email: "juan@example.com"
}
```

### ✅ Auditoría de Devoluciones
```javascript
devoluciones[0].creador = { /* usuario que creó */ }
devoluciones[0].anulador = { /* usuario que anuló */ }
devoluciones[0].fecha_anulacion = "2026-07-05T..."
devoluciones[0].razon_anulacion = "Motivo de la anulación"
```

### ✅ Detalles con Distribución por Almacén
```javascript
// Préstamo
detalles[0].almacenes = [
  { almacenes_prestables_id: 1, cantidad: 60, almacen: {...} },
  { almacenes_prestables_id: 2, cantidad: 40, almacen: {...} }
]

// Devolución
devoluciones[0].detalles[0].devolucion_cliente_detalle_almacenes = [
  { almacenes_prestables_id: 1, cantidad_devuelta: 30, ... },
  { almacenes_prestables_id: 2, cantidad_devuelta: 10, ... }
]
```

---

## Cálculos Realizados en Frontend

### 1. Resumen de Préstamo (KPIs)
```javascript
{
  total: sum(detalles.cantidad_prestada),
  devuelto: sum(devoluciones.detalles.cantidad_devuelta + cantidad_dañada_total),
  faltante: total - devuelto,
  tasa: (devuelto / total) * 100 + '%'
}
```

### 2. Estado de Detalle
```
COMPLETAMENTE_DEVUELTO: totalDevuelto >= cantidadPrestada
PARCIALMENTE_DEVUELTO: totalDevuelto > 0 && totalDevuelto < cantidadPrestada
PENDIENTE: totalDevuelto === 0
```

### 3. Estado de Devolución
```
ACTIVA: estado === 'ACTIVA' → muestra botón "Anular"
ANULADA: estado === 'ANULADA' → muestra datos de anulación
```

---

## Funcionalidades Verificadas

### Modal Anular Devolución
```javascript
// Valida:
- razon_anulacion tiene mín. 10 caracteres
- Genera movimientos inversos por almacén
- Actualiza stock
- Registra: anulada_por, fecha_anulacion, razon_anulacion
```

### Endpoints Disponibles
```
POST /api/prestamos-cliente/{id}/devoluciones/{devId}/anular
POST /api/prestamos-evento/{id}/devoluciones/{devId}/anular
POST /api/prestamos-proveedor/{id}/devoluciones/{devId}/anular
```

---

## Troubleshooting Común

| Problema | Verificación |
|----------|--------------|
| Logs no aparecen | Abre consola ANTES de cargar la página |
| `creador` es null | Verificar `created_by` en tabla `prestamo_*` |
| `devoluciones` vacío | Verificar si hay devoluciones registradas |
| `devolucion_detalles` vacío | Devoluciones sin detalles |
| Fechas en formato incorrecto | Frontend usa `.toLocaleString('es-ES')` |
| Almacenes vacíos | Distribuir artículos entre almacenes |
| Botón "Anular" no aparece | Estado de devolución debe ser 'ACTIVA' |

---

## Ejemplo de Lectura de Logs

```javascript
console.group('📥 DATOS DEL BACKEND - CLIENTE #1');

// 1. Ver si llegó el creador
console.log('Creador:', data.creador?.name); // "Juan García" ✅

// 2. Ver devoluciones activas
const activas = data.devoluciones.filter(d => d.estado === 'ACTIVA');
console.log('Devoluciones activas:', activas.length); // 1 ✅

// 3. Ver distribución por almacén
const almacenes = data.detalles[0].almacenes;
console.log('Almacenes:', almacenes.map(a => a.almacen.nombre)); 
// ["Almacén Central", "Almacén Secundario"] ✅

// 4. Ver devoluciones del almacén
const devPorAlmacen = data.devoluciones[0].detalles[0].devolucion_cliente_detalle_almacenes;
console.log('Devoluciones por almacén:', devPorAlmacen.length); // 2 ✅

console.groupEnd();
```

---

## Archivos de Documentación
- `ESTRUCTURA_DATOS_CLIENTES_SHOW.md` - JSON completo para clientes
- `ESTRUCTURA_DATOS_EVENTOS_SHOW.md` - JSON completo para eventos
- `DEBUG_LOGS_PRESTAMOS.md` - Este archivo

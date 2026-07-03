# Estructura de Datos - Evento Show

## Endpoint
```
GET /api/prestamos-evento/{id}
```

## Respuesta Esperada

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre_evento": "Fiesta de Bodas",
    "estado": "ACTIVO",
    "fecha_prestamo": "2026-07-03",
    "fecha_esperada_devolucion": "2026-07-05",
    "monto_garantia": "1000.00",
    "vehiculo_asignado": "Camioneta NKL-123",
    "observaciones": "Evento importante",
    "created_by": 5,
    
    // 👤 Auditoría del Préstamo
    "creador": {
      "id": 5,
      "name": "Juan García",
      "email": "juan@example.com"
    },
    
    // 🏢 Ubicación
    "almacen": {
      "id": 1,
      "nombre": "Almacén Central",
      "es_proveedor": false
    },
    
    // 👨‍✈️ Chofer
    "chofer": {
      "id": 10,
      "name": "Carlos López",
      "email": "carlos@example.com"
    },
    
    // 📦 Detalles de Artículos Prestados
    "detalles": [
      {
        "id": 1,
        "cantidad_prestada": 50,
        "estado": "PARCIALMENTE_DEVUELTO",
        
        // Artículo
        "prestable": {
          "id": 1,
          "nombre": "Silla de Plástico",
          "tipo": "mueble",
          "condiciones": [
            {
              "monto_garantia": "20.00",
              "monto_daño_total": "50.00"
            }
          ]
        },
        
        // Distribución por Almacén
        "almacenes": [
          {
            "almacenes_prestables_id": 1,
            "cantidad": 30,
            "almacen": {
              "id": 1,
              "nombre": "Almacén Central"
            }
          },
          {
            "almacenes_prestables_id": 2,
            "cantidad": 20,
            "almacen": {
              "id": 2,
              "nombre": "Almacén Secundario"
            }
          }
        ]
      }
    ],
    
    // 🔄 Devoluciones
    "devoluciones": [
      {
        "id": 1,
        "fecha_devolucion": "2026-07-04",
        "estado": "ACTIVA",
        "monto_cobrado_daño_total": "0.00",
        "created_at": "2026-07-04T10:00:00Z",
        
        // 👤 Auditoría de Devolución
        "creador": {
          "id": 5,
          "name": "Juan García"
        },
        "anulador": null,
        "fecha_anulacion": null,
        "razon_anulacion": null,
        
        // 📋 Detalles de la Devolución
        "detalles": [
          {
            "id": 1,
            "cantidad_devuelta": 25,
            "cantidad_dañada_total": 5,
            
            // Artículo (por referencia)
            "prestamoEventoDetalle": {
              "id": 1,
              "prestable": {
                "id": 1,
                "nombre": "Silla de Plástico"
              }
            },
            
            // 📦 Distribución por Almacén
            "devolucionesAlmacenes": [
              {
                "id": 1,
                "cantidad_devuelta": 15,
                "cantidad_dañada_total": 3,
                "almacenes_prestables_id": 1,
                "almacen": {
                  "id": 1,
                  "nombre": "Almacén Central"
                }
              },
              {
                "id": 2,
                "cantidad_devuelta": 10,
                "cantidad_dañada_total": 2,
                "almacenes_prestables_id": 2,
                "almacen": {
                  "id": 2,
                  "nombre": "Almacén Secundario"
                }
              }
            ]
          }
        ]
      }
    ]
  },
  "resumen": {
    "total_prestado": 50,
    "total_devuelto": 30,
    "total_faltante": 20,
    "tasa_devolucion": 60
  }
}
```

## Cálculos que realiza el Frontend

### 1. Resumen de Préstamo
```javascript
const total = prestamo.detalles.reduce((sum, d) => sum + d.cantidad_prestada, 0)
const devuelto = prestamo.detalles.reduce((sum, d) => {
  return sum + (d.devolucion_detalles?.reduce((s, dev) => 
    s + (dev.cantidad_devuelta + dev.cantidad_dañada_total), 0) || 0)
}, 0)
const faltante = total - devuelto
const tasa = (devuelto / total) * 100
```

### 2. Estados de Detalles
```javascript
if (totalDevuelto >= cantidadPrestada) {
  estado = 'COMPLETAMENTE_DEVUELTO'
} else if (totalDevuelto > 0) {
  estado = 'PARCIALMENTE_DEVUELTO'
} else {
  estado = 'PENDIENTE'
}
```

### 3. Devoluciones Activas
```javascript
const devolucionesActivas = devoluciones.filter(d => d.estado === 'ACTIVA')
```

## Verificación en Consola

Abre la consola del navegador (F12) y busca el grupo:
```
📥 DATOS DEL BACKEND - EVENTO #[id]
```

Verifica que tengas:
- ✅ `creador` con usuario que creó el préstamo
- ✅ `almacen` con información del almacén
- ✅ `chofer` con datos del chofer
- ✅ `detalles` con prestables y almacenes
- ✅ `devoluciones` con:
  - `creador` - Quién creó la devolución
  - `anulador` - Quién anuló (si aplica)
  - `detalles` con `devolucionesAlmacenes` por distribución

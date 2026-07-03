# Estructura de Datos - Cliente Show

## Endpoint
```
GET /api/prestamos-cliente/{id}
```

## Respuesta Esperada

```json
{
  "success": true,
  "data": {
    "id": 1,
    "estado": "ACTIVO",
    "fecha_prestamo": "2026-07-03",
    "fecha_esperada_devolucion": "2026-07-05",
    "monto_garantia": "5000.00",
    "observaciones": "Préstamo de materiales",
    "created_by": 5,
    
    // 👤 Auditoría del Préstamo
    "creador": {
      "id": 5,
      "name": "Juan García",
      "email": "juan@example.com"
    },
    
    // 👥 Cliente
    "cliente": {
      "id": 10,
      "nombre": "Tienda El Gallo",
      "razon_social": "Tienda El Gallo SRL",
      "nit": "1234567890",
      "telefono_cliente_1": "76123456",
      "telefono_cliente_2": "78987654"
    },
    
    // 🏢 Ubicación de Entrega
    "ubicacion": {
      "id": 1,
      "direccion": "Calle Principal 123, Apto 4",
      "localidad": {
        "id": 1,
        "nombre": "La Paz"
      },
      "es_ubicacion_manual": false
    },
    
    // 🏢 Almacén de Origen
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
    
    // 🚗 Vehículo
    "vehiculo": {
      "id": 5,
      "placa": "NKL-123",
      "modelo": "Toyota Hilux"
    },
    
    // 📦 Detalles de Artículos Prestados
    "detalles": [
      {
        "id": 1,
        "cantidad_prestada": 100,
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
        
        // Distribución por Almacén (Préstamo)
        "almacenes": [
          {
            "almacenes_prestables_id": 1,
            "cantidad": 60,
            "almacen": {
              "id": 1,
              "nombre": "Almacén Central"
            }
          },
          {
            "almacenes_prestables_id": 2,
            "cantidad": 40,
            "almacen": {
              "id": 2,
              "nombre": "Almacén Secundario"
            }
          }
        ],
        
        // Devoluciones anteriores de este detalle
        "devolucion_detalles": [
          {
            "cantidad_devuelta": 30,
            "cantidad_dañada_total": 5
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
        "monto_cobrado_daño_total": "50.00",
        "monto_excedido_garantia": "0.00",
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
            "cantidad_devuelta": 30,
            "cantidad_dañada_total": 5,
            
            // Artículo (por referencia)
            "detalle_prestamo_cliente": {
              "id": 1,
              "prestable": {
                "id": 1,
                "nombre": "Silla de Plástico"
              }
            },
            
            // 📦 Distribución por Almacén (Devolución)
            "devolucion_cliente_detalle_almacenes": [
              {
                "id": 1,
                "cantidad_devuelta": 18,
                "cantidad_dañada_total": 3,
                "almacenes_prestables_id": 1,
                "almacen": {
                  "id": 1,
                  "nombre": "Almacén Central"
                }
              },
              {
                "id": 2,
                "cantidad_devuelta": 12,
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
    "total_prestado": 100,
    "total_devuelto": 35,
    "total_faltante": 65,
    "tasa_devolucion": 35
  }
}
```

## Logs en Consola

Cuando cargas la página, verás:
```
📥 DATOS DEL BACKEND - CLIENTE #[id]
```

Con secciones expandibles para:
- ✅ Préstamo completo
- ✅ Creador del préstamo
- ✅ Cliente (nombre, NIT, teléfonos)
- ✅ Detalles (artículos prestados)
- ✅ Devoluciones (con creador y anulador)
- ✅ Ubicación (dirección y localidad)
- ✅ Almacén (origen)
- ✅ Chofer
- ✅ Vehículo

## Relaciones Cargadas desde Backend

```php
$prestamo->load([
    'detalles.prestable',
    'detalles.prestable.condiciones',
    'detalles.prestable.precios',
    'detalles.almacenes',
    'detalles.devolucionDetalles.devolucionesAlmacenes.almacen',
    'cliente',
    'almacen',
    'chofer',
    'vehiculo',
    'venta',
    'ubicacion',
    'creador',
    'devoluciones' => function ($query) {
        $query->with([
            'detalles.detallePrestamoCliente.prestable',
            'detalles.devolucionesAlmacenes.almacen',
            'creador',
            'anulador',
        ]);
    }
]);
```

## Cálculos del Frontend

### Total Prestado
```javascript
sum(detalles[].cantidad_prestada)
```

### Total Devuelto
```javascript
sum(devoluciones[].detalles[].cantidad_devuelta + cantidad_dañada_total)
```

### Tasa de Devolución
```javascript
(total_devuelto / total_prestado) * 100
```

## Troubleshooting

Si algún campo está vacío en consola:

| Campo | Solución |
|-------|----------|
| `creador` falta | Verificar que PrestamoCliente tenga `created_by` |
| `devoluciones.creador` falta | Verificar que DevolucionCliente tenga `created_by` |
| `devoluciones.anulador` falta | Verificar que DevolucionCliente tenga `anulada_por` |
| `ubicacion` es null | Cliente podría no tener ubicación de entrega |
| `devolucion_cliente_detalle_almacenes` vacío | Devoluciones sin distribución por almacén |

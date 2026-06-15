# 📋 Refactorización: entregas_venta_confirmaciones

## Cambios Realizados (2026-06-13)

### ✅ Nuevo sistema de `tipo_confirmacion`

El campo `tipo_confirmacion` ahora contiene el estado específico de la confirmación, en lugar de solo "COMPLETA" o "CON_NOVEDAD".

**Valores permitidos:**

| Valor | Descripción | Método Helper |
|-------|-------------|--------------|
| `COMPLETA` | ✅ Entrega completa y exitosa | `esCompleta()` |
| `RECHAZADO` | ⚠️ Con Novedad → Rechazado | `fueRechazada()` |
| `CLIENTE_CERRADO` | ⚠️ Con Novedad → Cliente Cerrado | `esClienteCerrado()` |
| `DEVOLUCION_PARCIAL` | ⚠️ Con Novedad → Devolución Parcial | `esDevolucionParcial()` |
| `NO_CONTACTADO` | ⚠️ Con Novedad → No Contactado | `esNoContactado()` |

---

## Cómo Usar

### Guardar una confirmación

```php
$confirmacion = EntregaVentaConfirmacion::create([
    'entrega_id'         => 1,
    'venta_id'           => 5,
    'tipo_entrega'       => 'COMPLETA',      // o 'CON_NOVEDAD'
    'tipo_confirmacion'  => 'COMPLETA',      // Valor específico
    'estado_pago'        => 'PAGADO',
    'total_dinero_recibido' => 1500.00,
    'confirmado_por'     => auth()->id(),
    'confirmado_en'      => now(),
]);
```

### Consultar el estado

```php
$confirmacion = EntregaVentaConfirmacion::find(1);

// Usando métodos helper
if ($confirmacion->esCompleta()) {
    echo "✅ Entrega completada";
}

if ($confirmacion->esDevolucionParcial()) {
    echo "⚠️ Devolución parcial - Productos devueltos: ";
    foreach ($confirmacion->productos_devueltos as $producto) {
        echo "{$producto['producto_nombre']} (x{$producto['cantidad']})";
    }
}

// Obtener descripción legible
echo $confirmacion->obtenerDescripcionConfirmacion();
// Output: "✅ Completa" o "⚠️ Con Novedad → Rechazado"
```

### Filtrar por tipo de confirmación

```php
// Entrega completadas
$completadas = EntregaVentaConfirmacion::where('tipo_confirmacion', 'COMPLETA')->get();

// Con devoluciones parciales
$conDevoluciones = EntregaVentaConfirmacion::where('tipo_confirmacion', 'DEVOLUCION_PARCIAL')
    ->with('venta')
    ->get();

// Rechazadas
$rechazadas = EntregaVentaConfirmacion::where('tipo_confirmacion', 'RECHAZADO')->get();
```

---

## Migración de Datos (si tienes datos anteriores)

Si necesitas migrar datos que usan `tipo_novedad`:

```php
// Artisan command para migrar datos
php artisan migrate:refresh  // O crear migración específica
```

---

## ⚠️ DEPRECADO

Los siguientes campos ya no son necesarios:

- ~~`tipo_novedad`~~ → Usar `tipo_confirmacion` en su lugar
- ~~`obtenerDescripcionRechazo()`~~ → Usar `obtenerDescripcionConfirmacion()` en su lugar

Estos se mantienen por compatibilidad temporal, pero se recomienda actualizar el código.

---

## Archivos a Actualizar

Los siguientes archivos aún usan `tipo_novedad` y deben ser actualizados:

- ✅ `app/Models/EntregaVentaConfirmacion.php` - DONE
- ⏳ `app/Http/Controllers/Api/EntregaController.php`
- ⏳ `app/DTOs/Venta/VentaResponseDTO.php`
- ⏳ `app/Http/Controllers/ReporteVentasController.php`
- ⏳ `app/Http/Controllers/EntregaPdfController.php`
- ⏳ `app/Http/Controllers/Api/VentaLogisticaController.php`
- ⏳ `app/Services/WebSocket/EntregaWebSocketService.php`
- ⏳ `app/Services/EntregaReportesService.php`


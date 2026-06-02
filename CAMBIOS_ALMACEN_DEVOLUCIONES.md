# Cambios realizados: Sistema de Devoluciones con Almacén de Cabecera

## Resumen
Se actualizó el sistema de devoluciones (registrarDevolucion) para usar el almacén asignado en la cabecera del PrestamoCliente en lugar de resolver dinámicamente desde los detalles.

## Cambios en PrestamoClienteService

### 1. Método `registrarDevolucion()` (línea ~298-311)
**Antes:**
```php
// Usar almacenes guardados en el detalle, o resolver dinámicamente
$almacenesIds = $detalle->almacenes_ids ?? [];
if (is_string($almacenesIds)) {
    $almacenesIds = json_decode($almacenesIds, true) ?? [];
}
$almacenId = !empty($almacenesIds) ? $almacenesIds[0] : $this->resolverAlmacenIdParaPrestable($detalle->prestable_id);
```

**Después:**
```php
// Usar el almacén de la cabecera del préstamo
$almacenId = $prestamo->almacenes_prestables_id;
if (!$almacenId) {
    throw new \Exception('El préstamo no tiene un almacén asignado (almacenes_prestables_id)');
}
```

### 2. Embases relacionados en `registrarDevolucion()` (línea ~434)
**Antes:**
```php
$almacenIdEmbase = $this->resolverAlmacenIdParaPrestable($embase->id);
```

**Después:**
```php
// Usar el mismo almacén de la cabecera
$almacenIdEmbase = $almacenId;
```

### 3. Método `anularPrestamo()` (línea ~682)
**Antes:**
```php
$almacenId = $this->resolverAlmacenIdParaPrestable($detalle->prestable_id);
```

**Después:**
```php
// Usar el almacén de la cabecera del préstamo
$almacenId = $prestamo->almacenes_prestables_id;
if (!$almacenId) {
    throw new \Exception('El préstamo no tiene un almacén asignado para anular');
}
```

### 4. Embases en `anularPrestamo()` (línea ~736)
**Antes:**
```php
$almacenIdEmbase = $this->resolverAlmacenIdParaPrestable($embase->id);
```

**Después:**
```php
// Usar el mismo almacén de la cabecera
$almacenIdEmbase = $almacenId;
```

## Flujo de actualización de modelos

Cuando se registra una devolución (POST /api/prestamos-cliente/{prestamo}/devolver):

1. **DevolucionCliente** - Se crea con datos de cabecera:
   - prestamo_cliente_id
   - fecha_devolucion
   - monto_cobrado_daño_total
   - monto_garantia_devuelta_total (se calcula de los detalles)
   - observaciones
   - chofer_id

2. **DevolucionClienteDetalle** - Se crea para cada item devuelto:
   - devolucion_cliente_id
   - prestamo_cliente_detalle_id
   - cantidad_devuelta
   - cantidad_dañada_parcial
   - cantidad_dañada_total
   - monto_cobrado_daño
   - monto_garantia_devuelta

3. **PrestableStock** - Se actualiza con:
   - cantidad_disponible (aumenta)
   - cantidad_cliente_deudor (disminuye)
   - Usando el almacén de la cabecera

4. **MovimientoPrestable** - Se registra para cada movimiento:
   - Para items devueltos en buen estado: ENTRADA
   - Para items dañados: SALIDA
   - Con categoria_afectada: 'prestamo_cliente'
   - Con referencia_tipo: 'DEVOLUCIO_CLIENTE'

5. **PrestamoClienteDetalle** - Se actualiza el estado:
   - COMPLETAMENTE_DEVUELTO si se devolvió todo
   - PARCIALMENTE_DEVUELTO si queda algo pendiente

6. **PrestamoCliente** - Se actualiza el estado:
   - COMPLETAMENTE_DEVUELTO si todos los detalles están devueltos
   - PARCIALMENTE_DEVUELTO si queda algo pendiente

## Validaciones

- El prestamo debe tener `almacenes_prestables_id` asignado
- Los detalles a devolver deben existir
- No se puede devolver más de lo prestado (considerando devoluciones previas)
- Las cantidades de daño deben ser >= 0

# Resumen de Cambios en Backend - Compras de Prestables

## Cambios Realizados

### 1. Base de Datos
- ✅ Migración: `2026_05_31_135923_add_almacenes_prestables_id_to_compras_prestables.php`
  - Agregó campo `almacenes_prestables_id` a `compras_prestables`
  - Relación FK a `almacenes_prestables` (nullable, cascade)
  - Ejecutada exitosamente

### 2. Modelos
- ✅ `CompraPrestable.php`
  - Agregó `almacenes_prestables_id` a `$fillable`
  - Agregó relación `almacenPrestable()` que retorna BelongsTo

### 3. Controllers
- ✅ `CompraPrestableController.php`
  - Agregó validación de `almacenes_prestables_id` en request
  - Pasa `almacenes_prestables_id` al servicio al crear compra
  
- ✅ `Api/AlmacenPrestableController.php` (NUEVO)
  - Método `indexApi()`: Listar almacenes de prestables con búsqueda y paginación
    - Parámetros: `q` (búsqueda), `es_proveedor` (filtro), `per_page`
    - Retorna: array de almacenes paginados
  
  - Método `prestablesPorAlmacen()`: Listar prestables disponibles en un almacén específico
    - Parámetros: `{almacen}` (ID), `q` (búsqueda), `per_page`
    - Retorna: prestables con stock_disponible enriquecido

### 4. Rutas (routes/api.php)
- ✅ GET `/api/almacenes-prestables/index-json`
  - Listar almacenes de prestables
  
- ✅ GET `/api/almacenes-prestables/{almacen}/prestables`
  - Listar prestables por almacén con stock disponible

## Flujo Actual (Antes)
```
Proveedor → Prestables (globales) → Agregar a Compra
```

## Flujo Esperado (Después)
```
Proveedor → Almacén Prestables → Prestables (filtrados por almacén) → Agregar a Compra
```

## Próximos Pasos (Frontend)

### crear.tsx
- [ ] Agregar estado: `busquedaAlmacen`, `almacenSeleccionado`
- [ ] Función: `buscarAlmacenes()`
- [ ] Agregar componente `DynamicSearchSelect` para almacenes (entre proveedor y compra)
- [ ] Modificar `buscarPrestables()` para filtrar por `almacenSeleccionado`
- [ ] Pasar `almacenes_prestables_id` al POST `/api/compras-prestables`
- [ ] Hacer obligatorio seleccionar almacén antes de agregar prestables

## Notas Técnicas

### ¿Por qué almacenes_prestables_id en compras_prestables?
- Una compra de prestables es generalmente para UN almacén específico
- Todos los detalles de esa compra van al mismo almacén
- Mejora la integridad de datos y simplifica la lógica

### Consideraciones de Stock
- El endpoint `prestablesPorAlmacen` solo retorna prestables que tienen stock > 0 en ese almacén
- Enriquece la respuesta con `stock_disponible` para mostrar al usuario

## Testing

Para probar los nuevos endpoints:

```bash
# Listar almacenes de prestables
curl "http://localhost/api/almacenes-prestables/index-json"

# Buscar almacenes
curl "http://localhost/api/almacenes-prestables/index-json?q=almacen&per_page=10"

# Listar prestables de un almacén específico
curl "http://localhost/api/almacenes-prestables/1/prestables"

# Buscar prestables en un almacén
curl "http://localhost/api/almacenes-prestables/1/prestables?q=canasta"
```

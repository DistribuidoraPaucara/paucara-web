# Análisis de Arquitectura: Compras de Prestables

## Estructura Actual de Base de Datos

### Tablas Relacionadas
1. **compras_prestables** - Compra principal
   - `id`: ID único
   - `numero_compra`: Número único de la compra
   - `proveedor_id`: Referencia al proveedor
   - `usuario_id`: Usuario que creó la compra
   - `compra_id`: Referencia a compra general (NUEVO - para asignar a compra existente)
   - `estado`: BORRADOR, CONFIRMADA, CANCELADA
   - Montos: `subtotal`, `iva`, `total`

2. **compra_prestable_detalles** - Detalles de cada compra
   - `compra_prestable_id`: FK a compras_prestables
   - `prestable_id`: FK a prestables
   - `almacenes_prestables_id`: FK a almacenes_prestables (IMPORTANTE)
   - `cantidad`: Cantidad del prestable
   - `precio_unitario`: Precio de compra

3. **almacenes_prestables** - Almacenes específicos para prestables
   - `id`: ID único
   - `nombre`: Nombre del almacén
   - `es_proveedor`: Boolean para marcar si es un proveedor

4. **prestable_stock** - Stock de prestables por almacén
   - `prestable_id`: FK a prestables
   - `almacenes_prestables_id`: FK a almacenes_prestables
   - Múltiples campos de cantidad: `cantidad_disponible`, `cantidad_cliente_deudor`, etc.

## Flujo Actual vs Ideal

### Flujo Actual (INCOMPLETO)
1. ✅ Seleccionar proveedor (opcional, ahora automático si selecciona compra)
2. ❌ NO selecciona almacén de prestables
3. ⚠️ Busca prestables globalmente (sin filtrar por almacén)
4. ⚠️ Cada detalle va a un `almacenes_prestables_id` pero no hay selección clara

### Flujo Ideal (PROPUESTO)
1. ✅ Seleccionar proveedor (opcional, auto-cargar si selecciona compra)
2. **✨ NUEVO: Seleccionar almacén de prestables**
3. **✨ NUEVO: Buscar/filtrar prestables por almacén seleccionado**
4. ✅ Agregar detalles con almacén ya seleccionado
5. ✅ Mostrar stock disponible del prestable en ese almacén

## Cambios Necesarios

### Backend (CompraController, CompraPrestableController)
- [ ] Agregar endpoint para listar almacenes_prestables
- [ ] Agregar endpoint para buscar prestables por almacén
- [ ] Validar que almacenes_prestables_id existe cuando crea detalles
- [ ] Retornar información de almacén en respuestas

### Frontend (crear.tsx)
- [ ] Agregar selector de almacén de prestables (usando DynamicSearchSelect)
- [ ] Filtrar prestables por almacén seleccionado
- [ ] Mostrar stock disponible en sugerencias de prestables
- [ ] Hacer obligatorio seleccionar almacén antes de agregar prestables
- [ ] Auto-cargar almacén si viene de una compra específica

### Componentes
- [ ] Reutilizar DynamicSearchSelect para almacenes también

## Consideraciones

### ¿Por qué múltiples almacenes por prestable?
- Un prestable puede estar en varios almacenes (sucursales, centros de distribución)
- Cada almacén tiene su propio stock independiente
- Las compras deben especificar a qué almacén van los prestables

### ¿Un prestable puede estar en múltiples almacenes en una sola compra?
- Sí, técnicamente sí, pero probablemente no es el caso de uso común
- Normalmente una compra es para un almacén específico
- Podríamos validar que todos los detalles vayan al mismo almacén

## Pasos Recomendados

1. **Fase 1**: Analizar tablas y relaciones existentes
   - Verificar estructura de almacenes_prestables
   - Revisar cómo se relaciona con prestables

2. **Fase 2**: Crear endpoints backend
   - GET /api/almacenes-prestables (listar)
   - GET /api/prestables-por-almacen (buscar por almacén)

3. **Fase 3**: Modificar frontend
   - Agregar selector de almacén
   - Filtrar prestables
   - Validaciones

4. **Fase 4**: Pruebas
   - Flujo completo de creación de compra
   - Validación de almacenes

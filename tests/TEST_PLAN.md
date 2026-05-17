# Plan de Pruebas - Módulo de Cajas

## Resumen Ejecutivo

Plan de validación completo para las 4 funcionalidades implementadas en el módulo de cajas. Incluye pruebas unitarias, de integración, y casos de prueba manual.

---

## 1. Botones de Acción (Aprobar/Rechazar Gastos)

### Backend Tests (Feature)
✅ **Tests Automatizados**: `tests/Feature/GastoControllerTest.php`

- `test_admin_puede_listar_gastos()` - Verifica acceso a listado
- `test_aprobar_gasto_registra_aprobacion()` - Aprobación registra admin y fecha
- `test_rechazar_gasto_elimina_movimiento()` - Rechazo elimina el movimiento
- `test_rechazar_gasto_sin_motivo_falla()` - Validación de motivo requerido
- `test_eliminar_gasto()` - Eliminación completa del registro
- `test_listar_gastos_filtra_por_usuario()` - Filtro de usuario funciona
- `test_listar_gastos_filtra_por_categoria()` - Filtro de categoría funciona
- `test_listar_gastos_filtra_por_fecha()` - Filtro de fechas funciona
- `test_sin_permiso_no_puede_acceder()` - Control de permisos
- `test_extrae_categoria_de_descripcion()` - Regex de categoría correcta
- `test_admin_puede_exportar_csv()` - Export CSV disponible

### Frontend Manual Tests
#### Scenario 1: Aprobar un gasto
```
1. Navegar a /cajas/gastos/admin
2. Click en botón CheckCircle (Aprobar)
3. Confirmar en el modal
4. Verificar: Toast de éxito, gasto actualizado con timestamp de aprobación
5. Recargar página, verificar persistencia
```

#### Scenario 2: Rechazar un gasto
```
1. Navegar a /cajas/gastos/admin
2. Click en botón AlertTriangle (Rechazar)
3. Ingr esar motivo de rechazo
4. Click Rechazar
5. Verificar: Toast de éxito, gasto desaparece de la lista
6. Confirmar en base de datos que fue eliminado
```

#### Scenario 3: Eliminar un gasto
```
1. Navegar a /cajas/gastos/admin
2. Click en botón Trash2 (Eliminar)
3. Confirmar eliminación
4. Verificar: Gasto desaparece, registro eliminado en BD
```

#### Scenario 4: Validaciones
```
1. Click Rechazar sin ingresar motivo → Botón Rechazar debe estar disabled
2. Hacer 2-3 acciones seguidas → Verificar loading states funcionan
3. Error en servidor → Verificar manejo de errores (toast)
```

---

## 2. Gráficos (Charts)

### Frontend Components
✅ **Dashboard.tsx** - 3 gráficos implementados:
- Pie chart: Estado de Cajas (Abiertas/Cerradas)
- Bar chart: Ingresos vs Egresos
- Card: Resumen del Día (métricas)

✅ **Reportes.tsx** - 2 gráficos implementados:
- Pie chart: Distribución de Discrepancias
- Bar chart: Comparativa Positivas vs Negativas

### Manual Tests

#### Test 1: Dashboard - Carga de gráficos
```
1. Navegar a /cajas (Dashboard)
2. Esperar carga de página
3. Verificar:
   - Pie chart de cajas se renderiza
   - Bar chart de ingresos/egresos se muestra
   - Colores correctos (verde/rojo)
   - Leyendas visibles
   - Responsive en móvil
```

#### Test 2: Reportes - Visualización de datos
```
1. Navegar a /cajas/reportes
2. Seleccionar rango de fechas con datos
3. Verificar:
   - Pie chart actualiza con datos correctos
   - Bar chart muestra comparativa
   - Números coinciden con tabla debajo
   - Hover tooltips funcionan
```

#### Test 3: Datos dinámicos
```
1. Dashboard cargado
2. En otra ventana, registrar nuevo gasto
3. Recargar Dashboard
4. Verificar: Gráficos se actualizan con nuevos datos
```

#### Test 4: Responsividad
```
1. Abrir en desktop (1920px)
   - Gráficos lado a lado
2. Reducir a tablet (768px)
   - Gráficos se reorganizan en 2 columnas
3. Reducir a móvil (375px)
   - Gráficos stack en columna única
```

---

## 3. API Endpoints Real-time

### Backend Tests (Feature)
✅ **Tests Automatizados**: `tests/Feature/AdminCajaApiTest.php`

- `test_obtener_estado_general_cajas()` - Endpoint GET /api/admin/cajas/estado-general
- `test_obtener_alertas_cajas()` - Endpoint GET /api/admin/cajas/alertas
- `test_obtener_estadisticas_cajas()` - Endpoint GET /api/admin/cajas/estadisticas
- `test_obtener_detalle_caja()` - Endpoint GET /api/admin/cajas/{id}/detalle
- `test_obtener_resumen_gastos()` - Endpoint GET /api/admin/gastos/resumen
- `test_sin_autenticacion_falla()` - Seguridad: Requiere auth
- `test_sin_permiso_falla()` - Seguridad: Requiere permisos
- `test_caja_inexistente_retorna_404()` - Validación: 404 para IDs inválidos
- `test_api_retorna_timestamp_iso8601()` - Formato: Timestamps ISO 8601
- `test_estadisticas_con_cajas_cerradas()` - Lógica: Cajas cerradas contabilizadas

### API Manual Tests

#### Test 1: Estado General
```
GET /api/admin/cajas/estado-general
Headers: Accept: application/json, Authorization: Bearer {token}

Esperado:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Caja 1",
      "usuario": "Juan Pérez",
      "estado": "abierta",
      "monto_actual": 1500.00,
      "hora_apertura": "2026-01-19T08:30:00Z"
    }
  ],
  "timestamp": "2026-01-19T10:45:00Z"
}
```

#### Test 2: Alertas
```
GET /api/admin/cajas/alertas
Headers: Authorization: Bearer {token}

Verificar:
- Alertas de cajas abiertas > 8 horas
- Alertas de discrepancias detectadas
- Severidad correcta (bajo/medio/alto/crítico)
```

#### Test 3: Estadísticas
```
GET /api/admin/cajas/estadisticas
Headers: Authorization: Bearer {token}

Verificar:
- total_ingresos es sum(monto > 0)
- total_egresos es abs(sum(monto < 0))
- neto_dia = ingresos - egresos
- movimientos_por_tipo desglosados
```

#### Test 4: Detalle Caja
```
GET /api/admin/cajas/{caja_id}/detalle
Headers: Authorization: Bearer {token}

Verificar:
- Movimientos ordenados desc por fecha
- Monto esperado calculado correctamente
- Estado correcto (abierta/cerrada)
- Si cerrada: incluye monto_real y diferencia
```

#### Test 5: Resumen Gastos
```
GET /api/admin/gastos/resumen
Headers: Authorization: Bearer {token}

Verificar:
- total_gastos = COUNT(gastos)
- monto_total = SUM(ABS(monto))
- promedio = monto_total / total_gastos
- por_categoria desglosado con totales
```

#### Test 6: Seguridad
```
1. Sin token: GET /api/admin/cajas/estado-general
   → Respuesta: 401 Unauthorized

2. Con usuario sin permisos: GET /api/admin/cajas/estado-general
   → Respuesta: 403 Forbidden

3. Con caja_id inválido: GET /api/admin/cajas/9999/detalle
   → Respuesta: 404 Not Found
```

---

## 4. Tests

### Ejecutar Tests

```bash
# Todos los tests del módulo de cajas
php artisan test tests/Feature/GastoControllerTest.php
php artisan test tests/Feature/AdminCajaApiTest.php

# Test específico
php artisan test tests/Feature/GastoControllerTest.php --filter test_aprobar_gasto_registra_aprobacion

# Con output detallado
php artisan test tests/Feature/ --verbose

# Con cobertura de código
php artisan test --coverage
```

### Casos de Prueba de Integridad

#### Test: Transacciones ACID
```
1. Crear gasto
2. Iniciar rechazo en una transacción
3. Interrumpir a mitad (simular error)
4. Verificar:
   - Base de datos vuelve al estado anterior
   - No quedan registros inconsistentes
```

#### Test: Concurrencia
```
1. Dos admins abren la misma página de gastos
2. Admin 1 aprueba un gasto
3. Admin 2 intenta aprobar el mismo gasto
4. Verificar:
   - Segundo intento falla gracefully
   - Mensajes de error claros
```

#### Test: Performance
```
1. Con 1000 gastos registrados
2. Cargar /cajas/gastos/admin
3. Tiempo de carga < 2 segundos
4. Paginación funciona correctamente
```

---

## 5. Casos de Aceptación

### UC-1: Admin aprueba gasto de chofer

**Precondiciones**: Chofer registró gasto, Admin tiene permiso `cajas.gastos`

```gherkin
Given Admin está en la página de gestión de gastos
When Admin clickea el botón de Aprobar en un gasto
And Admin confirma la acción en el modal
Then El gasto se marca como aprobado
And El nombre del admin y fecha se registran en observaciones
And Se muestra notificación de éxito
```

### UC-2: Admin rechaza gasto incompleto

**Precondiciones**: Gasto sin comprobante, Admin tiene permiso

```gherkin
Given Admin está revisando gastos
When Admin clickea el botón Rechazar
And Ingresa motivo "Comprobante faltante"
And Confirma el rechazo
Then El gasto se elimina del registro
And El motivo se registra en auditoría
And La lista se actualiza automáticamente
```

### UC-3: Admin ve alertas en tiempo real

**Precondiciones**: API endpoints están implementados

```gherkin
Given Admin está en el Dashboard
When Se consulta el endpoint /api/admin/cajas/alertas
Then Se retornan alertas de:
  - Cajas abiertas > 8 horas
  - Discrepancias detectadas hoy
  - Total de alertas activas
```

---

## 6. Defectos Conocidos / Limitaciones

### Actual
- Auditoría de aprobación usa campo `observaciones` (temporal)
  - **Solución futura**: Crear tabla `GastoAprobacion` con logs completos

- Rechazo elimina movimiento (sin soft delete)
  - **Solución futura**: Usar soft deletes para auditoría

- Categoría extraída con regex
  - **Solución futura**: Campo `categoria` separado en `MovimientoCaja`

---

## 7. Checklist de Validación

- [ ] Todos los tests pasan: `php artisan test`
- [ ] Botones de acción funcionan en UI
- [ ] Gráficos se renderizan correctamente
- [ ] API endpoints retornan JSON válido
- [ ] Control de permisos funciona
- [ ] Filtros funcionan correctamente
- [ ] Export CSV disponible
- [ ] Responsive en móvil
- [ ] Toast notifications aparecen
- [ ] Datos se persisten en BD
- [ ] Performance aceptable (< 2s carga)

---

## 8. Ejecución

### Fase 1: Tests Unitarios (30 min)
```bash
php artisan test tests/Feature/GastoControllerTest.php
php artisan test tests/Feature/AdminCajaApiTest.php
```

### Fase 2: Pruebas Manuales (45 min)
Ejecutar todos los "Manual Tests" listados arriba

### Fase 3: Aceptación (30 min)
Validar todos los "Casos de Aceptación"

### Fase 4: Performance (15 min)
Verificar tiempos de carga y responsividad

**Tiempo Total Estimado**: ~2 horas

---

## Notas
- Datos de prueba se crean con factories Laravel
- Tests usan base de datos en memoria (SQLite)
- Fixtures se limpian automáticamente después de cada test
- Para debugging, usar `dd()` en tests

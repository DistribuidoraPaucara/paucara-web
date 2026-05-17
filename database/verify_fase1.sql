-- VERIFICACIÓN DE FASE 1: REFACTORIZACIÓN DE BASE DE DATOS
-- Ejecutar estas queries para validar que todo está correcto

-- ============================================
-- 1. VERIFICAR TABLA entrega_venta (NUEVA)
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'entrega_venta'
ORDER BY ordinal_position;

-- Verificar índices
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'entrega_venta';

-- Verificar FKs
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'entrega_venta';

-- ============================================
-- 2. VERIFICAR NUEVOS CAMPOS EN entregas
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'entregas'
AND column_name IN ('zona_id', 'numero_entrega');

-- ============================================
-- 3. VERIFICAR QUE venta_id FUE ELIMINADO DE entregas
-- ============================================
SELECT COUNT(*) as debe_ser_cero
FROM information_schema.columns
WHERE table_name = 'entregas'
AND column_name = 'venta_id';

-- ============================================
-- 4. VERIFICAR reporte_cargas.entrega_id (sin FK)
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'reporte_cargas'
AND column_name = 'entrega_id';

-- Verificar que NO tiene FK (constraint_type debería ser NULL)
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'reporte_cargas'
AND column_name = 'entrega_id';

-- ============================================
-- 5. VERIFICAR reporte_carga_entregas (pivot correcto)
-- ============================================
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'reporte_carga_entregas'
ORDER BY ordinal_position;

-- Verificar que tiene FK correctas
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'reporte_carga_entregas';

-- ============================================
-- 6. CONTAR REGISTROS EN CADA TABLA (Data Integrity Check)
-- ============================================
SELECT
    'entregas' as tabla,
    COUNT(*) as registros
FROM entregas
UNION ALL
SELECT
    'entrega_venta' as tabla,
    COUNT(*) as registros
FROM entrega_venta
UNION ALL
SELECT
    'reporte_cargas' as tabla,
    COUNT(*) as registros
FROM reporte_cargas
UNION ALL
SELECT
    'reporte_carga_entregas' as tabla,
    COUNT(*) as registros
FROM reporte_carga_entregas;

-- ============================================
-- 7. VERIFICAR INTEGRIDAD: Entregas vinculadas a ventas
-- ============================================
SELECT
    e.id,
    e.numero_entrega,
    COUNT(ev.venta_id) as ventas_asignadas,
    e.vehiculo_id,
    e.chofer_id
FROM entregas e
LEFT JOIN entrega_venta ev ON e.id = ev.entrega_id
WHERE ev.venta_id IS NOT NULL
GROUP BY e.id, e.numero_entrega, e.vehiculo_id, e.chofer_id
ORDER BY e.id DESC
LIMIT 10;

-- ============================================
-- 8. VERIFICAR INTEGRIDAD: Reportes vinculados a entregas
-- ============================================
SELECT
    rc.id,
    rc.numero_reporte,
    COUNT(rce.entrega_id) as entregas_en_reporte,
    rc.entrega_id as entrega_id_legacy
FROM reporte_cargas rc
LEFT JOIN reporte_carga_entregas rce ON rc.id = rce.reporte_carga_id
GROUP BY rc.id, rc.numero_reporte, rc.entrega_id
ORDER BY rc.id DESC
LIMIT 10;

-- ============================================
-- 9. REPORTE DE ESTADO POST-MIGRACION
-- ============================================
SELECT
    'Estructura actualizada correctamente' as status,
    'FASE 1 COMPLETADA' as resultado
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'entrega_venta')
AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entregas' AND column_name = 'venta_id')
AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entregas' AND column_name = 'zona_id')
AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'entregas' AND column_name = 'numero_entrega');

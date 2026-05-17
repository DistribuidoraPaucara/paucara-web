-- ============================================
-- SCRIPT: Regularizar Pagos y Cuentas por Cobrar
-- ============================================
-- Este script vincula todos los pagos con sus cuentas por cobrar
-- basándose en la relación venta_id

-- 1. ANÁLISIS PREVIO
-- Mostrar cuántos pagos necesitan regularización
SELECT
    COUNT(*) as total_pagos,
    SUM(CASE WHEN cuenta_por_cobrar_id IS NULL THEN 1 ELSE 0 END) as pagos_sin_asociar,
    SUM(CASE WHEN cuenta_por_cobrar_id IS NOT NULL THEN 1 ELSE 0 END) as pagos_asociados
FROM pagos;

-- 2. MOSTRAR PAGOS SIN ASOCIAR CON SUS CUENTAS POSIBLES
SELECT
    p.id as pago_id,
    p.venta_id,
    p.monto,
    p.fecha_pago,
    cpc.id as cuenta_id,
    cpc.monto_original,
    cpc.saldo_pendiente
FROM pagos p
LEFT JOIN cuentas_por_cobrar cpc ON p.venta_id = cpc.venta_id
WHERE p.cuenta_por_cobrar_id IS NULL
ORDER BY p.id;

-- 3. ACTUALIZAR PAGOS CON CUENTA_POR_COBRAR_ID
-- Esta es la actualización real que vincula los pagos
UPDATE pagos p
SET cuenta_por_cobrar_id = (
    SELECT id
    FROM cuentas_por_cobrar cpc
    WHERE cpc.venta_id = p.venta_id
    LIMIT 1
)
WHERE p.cuenta_por_cobrar_id IS NULL
  AND p.venta_id IN (
    SELECT venta_id
    FROM cuentas_por_cobrar
  );

-- 4. VERIFICACIÓN POST-ACTUALIZACIÓN
SELECT
    'Pagos actualizados' as resultado,
    COUNT(*) as cantidad
FROM pagos
WHERE cuenta_por_cobrar_id IS NOT NULL;

-- 5. MOSTRAR PAGOS CON SUS CUENTAS ASOCIADAS
SELECT
    p.id as pago_id,
    p.venta_id,
    v.numero as numero_venta,
    p.monto as pago_monto,
    p.fecha_pago,
    cpc.id as cuenta_id,
    cpc.monto_original,
    cpc.saldo_pendiente,
    cpc.cliente_id
FROM pagos p
JOIN cuentas_por_cobrar cpc ON p.cuenta_por_cobrar_id = cpc.id
JOIN ventas v ON p.venta_id = v.id
ORDER BY cpc.cliente_id, p.fecha_pago DESC;

-- 6. IDENTIFICAR PAGOS HUÉRFANOS (SIN CUENTA POR COBRAR)
SELECT
    p.id as pago_id,
    p.venta_id,
    v.numero as numero_venta,
    p.monto,
    p.fecha_pago,
    'SIN CUENTA POR COBRAR' as estado
FROM pagos p
LEFT JOIN cuentas_por_cobrar cpc ON p.venta_id = cpc.venta_id
LEFT JOIN ventas v ON p.venta_id = v.id
WHERE cpc.id IS NULL;

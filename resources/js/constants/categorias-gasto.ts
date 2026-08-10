/**
 * Categorías de Gastos, Pagos de Sueldo y Anticipos
 * Compartidas entre RegistrarGastoModal y Egresos/Create
 */

export const CATEGORIAS_GASTO = {
    'INSUMOS': 'Insumos',
    'TRANSPORTE': 'Transporte',
    'LIMPIEZA': 'Limpieza',
    'MANTENIMIENTO': 'Mantenimiento',
    'SERVICIOS': 'Servicios',
    'ALIMENTACION_DESAYUNO': '🍳 Desayuno',
    'ALIMENTACION_ALMUERZO': '🍽️ Almuerzo',
    'ALIMENTACION_CENA': '🥘 Cena',
    'ALIMENTACION_REFRIGERIO': '☕ Refrigerio',
    'ALIMENTACION_OTROS': '🍴 Otros Alimentos',
    'VARIOS': 'Varios',
};

export const CATEGORIAS_PAGO_SUELDO = {
    'QUINCENA': 'Quincena',
    'HORAS_EXTRA': 'Horas Extra',
    'SABADO_DOMINGO': 'Pago Sábado/Domingo',
    'SUELDO': 'Sueldo',
    'BONO': 'Bono',
    'COMISIÓN': 'Comisión',
    'LIQUIDACIÓN': 'Liquidación',
};

export const CATEGORIAS_ANTICIPO = {
    'ADELANTO': 'Adelanto de Sueldo',
    'PRÉSTAMO': 'Préstamo a Empleado',
    'OTROS': 'Otros Anticipos',
};

/**
 * Todas las categorías unidas en un solo objeto
 */
export const TODAS_LAS_CATEGORIAS = {
    ...CATEGORIAS_GASTO,
    ...CATEGORIAS_PAGO_SUELDO,
    ...CATEGORIAS_ANTICIPO,
};

/**
 * Array de todas las keys de categorías para validación
 */
export const CATEGORIAS_KEYS = Object.keys(TODAS_LAS_CATEGORIAS);

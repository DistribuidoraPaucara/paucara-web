/**
 * Utilidades para gestión de precios y cálculos monetarios
 * Centraliza lógica compartida para mantener consistencia
 */

/**
 * Redondea un número a 2 decimales (standard para moneda)
 * @param valor - Número a redondear
 * @returns Número redondeado a 2 decimales
 */
export const redondearDos = (valor: number): number => {
    return Math.round(valor * 100) / 100;
};

/**
 * Redondea a N decimales
 * @param valor - Número a redondear
 * @param decimales - Cantidad de decimales
 * @returns Número redondeado
 */
export const redondearDecimales = (valor: number, decimales: number = 2): number => {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
};

/**
 * Valida si un valor de precio es válido
 * @param valor - Valor a validar
 * @returns true si es válido, false en caso contrario
 */
export const esPrecioValido = (valor: number | null | undefined): boolean => {
    return valor !== null &&
        valor !== undefined &&
        typeof valor === 'number' &&
        !isNaN(valor) &&
        valor >= 0;
};

/**
 * Calcula el porcentaje de ganancia entre costo y precio
 * @param costo - Precio de costo
 * @param precio - Precio de venta
 * @returns Porcentaje de ganancia (puede ser negativo si hay pérdida)
 */
export const calcularPorcentajeGanancia = (costo: number, precio: number): number => {
    if (costo <= 0) return 0;
    return redondearDos(((precio - costo) / costo) * 100);
};

/**
 * Calcula el margen absoluto (diferencia costo-precio)
 * @param costo - Precio de costo
 * @param precio - Precio de venta
 * @returns Margen en valor absoluto
 */
export const calcularMargenAbsoluto = (costo: number, precio: number): number => {
    return redondearDos(precio - costo);
};

/**
 * Calcula el precio final dado el costo y % de ganancia
 * @param costo - Precio de costo
 * @param porcentajeGanancia - Porcentaje de ganancia deseado
 * @returns Precio final
 */
export const calcularPrecioDesdeGanancia = (
    costo: number,
    porcentajeGanancia: number
): number => {
    if (costo <= 0) return 0;
    return redondearDos(costo + (costo * (porcentajeGanancia / 100)));
};

/**
 * Detecta si hay una diferencia significativa entre dos precios
 * @param precioCosto - Precio de costo
 * @param precioCompra - Precio de compra ingresado
 * @param tolerancia - Tolerancia en valor absoluto (default 0.01)
 * @returns true si hay diferencia, false en caso contrario
 */
export const tienePreferenciaDiferencia = (
    precioCosto: number | null | undefined,
    precioCompra: number | null | undefined,
    tolerancia: number = 0.01
): boolean => {
    if (!esPrecioValido(precioCosto) || !esPrecioValido(precioCompra)) {
        return false;
    }

    const diferencia = Math.abs((precioCompra as number) - (precioCosto as number));
    return diferencia > tolerancia;
};

/**
 * Calcula la diferencia entre dos precios y el porcentaje
 * @param precioCosto - Precio base
 * @param precioNuevo - Precio nuevo
 * @returns Objeto con diferencia absoluta y porcentaje
 */
export const calcularDiferencia = (precioCosto: number, precioNuevo: number): {
    diferencia: number;
    porcentaje: number;
    esAumento: boolean;
} => {
    const diferencia = redondearDos(precioNuevo - precioCosto);
    const porcentaje = precioCosto > 0 ? redondearDos((diferencia / precioCosto) * 100) : 0;
    const esAumento = diferencia > 0;

    return {
        diferencia,
        porcentaje,
        esAumento
    };
};

/**
 * Valida un rango de precios
 * @param minimo - Precio mínimo permitido
 * @param maximo - Precio máximo permitido
 * @param valor - Valor a validar
 * @returns true si está dentro del rango
 */
export const estaDentroDeRango = (
    minimo: number,
    maximo: number,
    valor: number
): boolean => {
    return valor >= minimo && valor <= maximo;
};

/**
 * Convierte un precio respetando escala de decimales
 * Útil para conversiones entre unidades
 * @param precio - Precio original
 * @param factor - Factor de conversión
 * @param decimales - Decimales a usar (default 2)
 * @returns Precio convertido
 */
export const convertirPrecio = (
    precio: number,
    factor: number,
    decimales: number = 2
): number => {
    const precioConvertido = precio / factor;
    return redondearDecimales(precioConvertido, decimales);
};

/**
 * Determina el color para mostrar una diferencia de precio
 * @param es_aumento - Si es aumento o disminución
 * @param tipo - Tipo de tema ('light' o 'dark')
 * @returns Clase Tailwind del color
 */
export const getColorDiferencia = (
    es_aumento: boolean,
    tipo: 'light' | 'dark' = 'light'
): string => {
    if (es_aumento) {
        return tipo === 'light'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-amber-950/10 border-amber-800/50';
    }
    return tipo === 'light'
        ? 'bg-green-50 border-green-200'
        : 'bg-green-950/10 border-green-800/50';
};

/**
 * Calcula subtotal de un detalle
 * @param cantidad - Cantidad
 * @param precio_unitario - Precio unitario
 * @param descuento - Descuento (en porcentaje)
 * @returns Subtotal
 */
export const calcularSubtotal = (
    cantidad: number,
    precio_unitario: number,
    descuento: number = 0
): number => {
    const subtotalSinDescuento = redondearDos(cantidad * precio_unitario);
    const montoDescuento = redondearDos(subtotalSinDescuento * (descuento / 100));
    return redondearDos(subtotalSinDescuento - montoDescuento);
};

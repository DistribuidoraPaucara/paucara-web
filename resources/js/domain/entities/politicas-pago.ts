/**
 * Domain: Políticas de Pago
 *
 * Define las políticas de pago disponibles en el sistema
 * Sincronizado con App\Models\Proforma y App\Models\Venta
 */

export type CodigoPoliticaPago = 'CONTRA_ENTREGA' | 'ANTICIPADO_100' | 'MEDIO_MEDIO' | 'CREDITO';

export interface PoliticaPago {
    codigo: CodigoPoliticaPago;
    nombre: string;
    descripcion: string;
    porcentaje_minimo: number; // Porcentaje mínimo a pagar (0-100)
    requiere_cliente_solvente: boolean; // Si requiere validaciones especiales
    permitida: boolean; // Si está disponible en el sistema
}

/**
 * Catálogo de todas las políticas de pago disponibles
 */
export const POLITICAS_PAGO_CATALOG: Record<CodigoPoliticaPago, PoliticaPago> = {
    CONTRA_ENTREGA: {
        codigo: 'CONTRA_ENTREGA',
        nombre: 'Contra Entrega',
        descripcion: 'Pago al momento de recibir la mercadería',
        porcentaje_minimo: 0,
        requiere_cliente_solvente: false,
        permitida: true,
    },
    MEDIO_MEDIO: {
        codigo: 'MEDIO_MEDIO',
        nombre: '50% Anticipo + 50% Contra Entrega',
        descripcion: 'Mitad ahora, mitad al recibir la mercadería',
        porcentaje_minimo: 50,
        requiere_cliente_solvente: false,
        permitida: true,
    },
    ANTICIPADO_100: {
        codigo: 'ANTICIPADO_100',
        nombre: '100% Anticipado',
        descripcion: 'Pago completo por adelantado',
        porcentaje_minimo: 100,
        requiere_cliente_solvente: false,
        permitida: true,
    },
    CREDITO: {
        codigo: 'CREDITO',
        nombre: 'Crédito',
        descripcion: 'Pago a través de cuenta corriente (requiere aprobación)',
        porcentaje_minimo: 0,
        requiere_cliente_solvente: true,
        permitida: true,
    },
};

/**
 * Obtener una política por su código
 */
export function getPoliticaPago(codigo: string): PoliticaPago | undefined {
    return POLITICAS_PAGO_CATALOG[codigo as CodigoPoliticaPago];
}

/**
 * Obtener todas las políticas permitidas
 */
export function getPoliticasPermitidas(): PoliticaPago[] {
    return Object.values(POLITICAS_PAGO_CATALOG).filter(p => p.permitida);
}

/**
 * Calcular monto mínimo a pagar según política
 */
export function calcularMontoMinimo(politica: CodigoPoliticaPago, total: number): number {
    const policy = getPoliticaPago(politica);
    if (!policy) return 0;
    return Math.round((total * policy.porcentaje_minimo) / 100 * 100) / 100;
}

/**
 * Validar si un monto cumple con la política
 */
export function validarMontoSegunPolitica(
    politica: CodigoPoliticaPago,
    monto: number,
    total: number
): { valido: boolean; mensaje?: string } {
    const policy = getPoliticaPago(politica);
    if (!policy) {
        return { valido: false, mensaje: 'Política de pago no reconocida' };
    }

    const minimo = calcularMontoMinimo(politica, total);

    if (monto < minimo) {
        return {
            valido: false,
            mensaje: `Se requiere mínimo ${policy.porcentaje_minimo}% del total: Bs. ${minimo.toFixed(2)}`,
        };
    }

    if (monto > total) {
        return {
            valido: false,
            mensaje: 'El monto no puede exceder el total de la proforma',
        };
    }

    return { valido: true };
}

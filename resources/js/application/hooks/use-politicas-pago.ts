/**
 * Application Hook: usePoliticasPago
 *
 * Proporciona acceso a las políticas de pago disponibles
 * y validaciones según el estado del cliente
 *
 * Carga las políticas dinámicamente desde el API
 */

import { useMemo, useState, useEffect } from 'react';
import {
    getPoliticaPago,
    calcularMontoMinimo,
    validarMontoSegunPolitica,
    type PoliticaPago,
    type CodigoPoliticaPago,
} from '@/domain/entities/politicas-pago';
import type { Cliente } from '@/domain/entities/clientes';

interface UsePoliticasPagoOptions {
    cliente?: Cliente;
}

export function usePoliticasPago(options: UsePoliticasPagoOptions = {}) {
    const { cliente } = options;
    const [politicas, setPoliticas] = useState<PoliticaPago[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ NUEVO: Cargar políticas desde el API
    useEffect(() => {
        fetch('/api/politicas-pago')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setPoliticas(data.data);
                }
            })
            .catch(error => {
                console.error('Error al cargar políticas de pago:', error);
                // Fallback: usar políticas locales si el API falla
                setPoliticas(getPoliticasPermitidas());
            })
            .finally(() => setLoading(false));
    }, []);

    /**
     * Filtrar políticas disponibles para este cliente
     */
    const politicasDisponibles = useMemo(() => {
        return politicas.filter(politica => {
            // Si la política es CREDITO, validar que el cliente tenga permisos
            if (politica.codigo === 'CREDITO') {
                if (!cliente) return false;
                return cliente.puede_tener_credito && (cliente.limite_credito ?? 0) > 0;
            }
            return true;
        });
    }, [politicas, cliente]);

    /**
     * Validar si una política está disponible para este cliente
     */
    const puedeUsarPolitica = (codigo: CodigoPoliticaPago): boolean => {
        return politicasDisponibles.some(p => p.codigo === codigo);
    };

    /**
     * Obtener detalles de una política
     */
    const obtenerPolitica = (codigo: string): PoliticaPago | undefined => {
        return getPoliticaPago(codigo);
    };

    /**
     * Calcular monto mínimo a pagar
     */
    const calcularMinimo = (codigo: CodigoPoliticaPago, total: number): number => {
        return calcularMontoMinimo(codigo, total);
    };

    /**
     * Validar un monto contra la política
     */
    const validarMonto = (
        codigo: CodigoPoliticaPago,
        monto: number,
        total: number
    ): { valido: boolean; mensaje?: string } => {
        return validarMontoSegunPolitica(codigo, monto, total);
    };

    /**
     * Obtener mensaje de alerta si el cliente no puede usar CREDITO
     */
    const getMensajeCreditoNoDisponible = (): string | null => {
        if (!cliente) return null;

        if (!cliente.puede_tener_credito) {
            return `El cliente "${cliente.nombre}" no tiene permiso para solicitar crédito`;
        }

        if (!cliente.limite_credito || cliente.limite_credito <= 0) {
            return `El cliente "${cliente.nombre}" no tiene límite de crédito configurado`;
        }

        return null;
    };

    return {
        // Estados
        loading,

        // Datos
        politicas,
        politicasDisponibles,

        // Funciones
        puedeUsarPolitica,
        obtenerPolitica,
        calcularMinimo,
        validarMonto,
        getMensajeCreditoNoDisponible,
    };
}

/**
 * Obtener políticas permitidas como fallback
 * Se usa cuando el API no está disponible
 */
function getPoliticasPermitidas(): PoliticaPago[] {
    return [
        {
            codigo: 'CONTRA_ENTREGA',
            nombre: 'Contra Entrega',
            descripcion: 'Pago al momento de recibir la mercadería',
            porcentaje_minimo: 0,
            requiere_cliente_solvente: false,
            permitida: true,
        },
        {
            codigo: 'MEDIO_MEDIO',
            nombre: '50% Anticipo + 50% Contra Entrega',
            descripcion: 'Mitad ahora, mitad al recibir la mercadería',
            porcentaje_minimo: 50,
            requiere_cliente_solvente: false,
            permitida: true,
        },
        {
            codigo: 'ANTICIPADO_100',
            nombre: '100% Anticipado',
            descripcion: 'Pago completo por adelantado',
            porcentaje_minimo: 100,
            requiere_cliente_solvente: false,
            permitida: true,
        },
        {
            codigo: 'CREDITO',
            nombre: 'Crédito',
            descripcion: 'Pago a través de cuenta corriente (requiere aprobación)',
            porcentaje_minimo: 0,
            requiere_cliente_solvente: true,
            permitida: true,
        },
    ];
}

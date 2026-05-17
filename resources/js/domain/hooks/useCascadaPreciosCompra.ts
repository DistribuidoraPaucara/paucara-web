/**
 * Hook: useCascadaPreciosCompra
 *
 * Gestiona la lógica de cascada de precios cuando cambia el costo en una compra.
 * Responsabilidades:
 * - Calcular precios propuestos en cascada
 * - Mantener márgenes de ganancia relativos
 * - Validar cambios
 *
 * Uso:
 * const { precios, preciosActuales, error, calcularCascada, validarCambios } =
 *   useCascadaPreciosCompra(productoId, precioCostoNuevo);
 */

import { useState, useCallback } from 'react';
import type { PrecioProductoDTO } from '@/domain/entities/precios';
import { redondearDos } from '@/lib/precios.utils';

export interface PrecioPropuesto {
    id: number;
    tipo_precio_id: number;
    tipo_nombre: string;
    tipo_codigo: string;
    tipo_color: string;
    tipo_es_ganancia: boolean;
    precio_actual: number;
    precio_propuesto: number;
    porcentaje_ganancia_actual: number;
    porcentaje_ganancia_propuesto: number;
    margen_ganancia_absoluto?: number; // Margen en valor absoluto
}

export interface ErrorCascada {
    tipo: 'validacion' | 'calculo' | 'desconocido';
    mensaje: string;
}

export function useCascadaPreciosCompra(
    precios: PrecioProductoDTO[] | null | undefined,
    precioCostoActual: number | null,
    precioCostoNuevo: number | null
) {
    const [preciosPropuestos, setPreciosPropuestos] = useState<PrecioPropuesto[]>([]);
    const [error, setError] = useState<ErrorCascada | null>(null);

    /**
     * Calcula la cascada de precios cuando cambia el costo
     */
    const calcularCascada = useCallback((): PrecioPropuesto[] => {
        setError(null);

        // Validaciones previas
        if (!precios || precios.length === 0) {
            setError({
                tipo: 'validacion',
                mensaje: 'No hay precios disponibles para calcular la cascada'
            });
            return [];
        }

        if (precioCostoNuevo === null || precioCostoNuevo === undefined) {
            setError({
                tipo: 'validacion',
                mensaje: 'El nuevo costo no puede estar vacío'
            });
            return [];
        }

        try {
            const nuevosPrecios: PrecioPropuesto[] = precios.map((precio) => {
                // ===== COSTO =====
                if (precio.tipo.codigo === 'COSTO') {
                    return {
                        id: precio.id,
                        tipo_precio_id: precio.tipo_precio_id,
                        tipo_nombre: precio.tipo.nombre,
                        tipo_codigo: precio.tipo.codigo,
                        tipo_color: precio.tipo.color,
                        tipo_es_ganancia: precio.tipo.es_ganancia,
                        precio_actual: precio.precio_actual,
                        precio_propuesto: redondearDos(precioCostoNuevo),
                        porcentaje_ganancia_actual: 0,
                        porcentaje_ganancia_propuesto: 0,
                        margen_ganancia_absoluto: 0
                    };
                }

                // ===== OTROS TIPOS DE PRECIO =====
                // Estrategia: Mantener el margen de ganancia absoluto (diferencia costo-precio)
                // Así si costo sube $1, el precio sube $1 también (mantiene el % de ganancia relativo)

                const margenAbsoluto = precio.precio_actual - (precioCostoActual || 0);
                const nuevoPrecio = precioCostoNuevo + margenAbsoluto;
                const nuevoPorcentajeGanancia = precioCostoNuevo > 0
                    ? redondearDos(((nuevoPrecio - precioCostoNuevo) / precioCostoNuevo) * 100)
                    : 0;

                return {
                    id: precio.id,
                    tipo_precio_id: precio.tipo_precio_id,
                    tipo_nombre: precio.tipo.nombre,
                    tipo_codigo: precio.tipo.codigo,
                    tipo_color: precio.tipo.color,
                    tipo_es_ganancia: precio.tipo.es_ganancia,
                    precio_actual: precio.precio_actual,
                    precio_propuesto: Math.max(0, redondearDos(nuevoPrecio)),
                    porcentaje_ganancia_actual: precio.porcentaje_ganancia,
                    porcentaje_ganancia_propuesto: nuevoPorcentajeGanancia,
                    margen_ganancia_absoluto: redondearDos(margenAbsoluto)
                };
            });

            setPreciosPropuestos(nuevosPrecios);
            return nuevosPrecios;
        } catch (err) {
            const mensaje = err instanceof Error ? err.message : 'Error desconocido al calcular cascada';
            setError({
                tipo: 'calculo',
                mensaje
            });
            return [];
        }
    }, [precios, precioCostoActual, precioCostoNuevo]);

    /**
     * Actualiza el precio propuesto de un tipo de precio específico
     */
    const actualizarPrecioPropuesto = useCallback((
        indexPrecio: number,
        nuevoValor: number
    ): void => {
        if (indexPrecio < 0 || indexPrecio >= preciosPropuestos.length) {
            setError({
                tipo: 'validacion',
                mensaje: 'Índice de precio inválido'
            });
            return;
        }

        const nuevos = [...preciosPropuestos];
        nuevos[indexPrecio].precio_propuesto = redondearDos(nuevoValor);

        // Recalcular porcentaje de ganancia
        if (precioCostoNuevo && precioCostoNuevo > 0) {
            nuevos[indexPrecio].porcentaje_ganancia_propuesto = redondearDos(
                ((nuevoValor - precioCostoNuevo) / precioCostoNuevo) * 100
            );
        }

        setPreciosPropuestos(nuevos);
    }, [preciosPropuestos, precioCostoNuevo]);

    /**
     * Actualiza el porcentaje de ganancia de un tipo de precio
     */
    const actualizarGananciaPropuesta = useCallback((
        indexPrecio: number,
        nuevoValorPorcentaje: number
    ): void => {
        if (indexPrecio < 0 || indexPrecio >= preciosPropuestos.length) {
            setError({
                tipo: 'validacion',
                mensaje: 'Índice de precio inválido'
            });
            return;
        }

        if (!precioCostoNuevo || precioCostoNuevo <= 0) {
            setError({
                tipo: 'validacion',
                mensaje: 'El costo debe ser mayor a 0 para calcular ganancia'
            });
            return;
        }

        const nuevos = [...preciosPropuestos];
        nuevos[indexPrecio].porcentaje_ganancia_propuesto = redondearDos(nuevoValorPorcentaje);
        nuevos[indexPrecio].precio_propuesto = redondearDos(
            precioCostoNuevo + (precioCostoNuevo * (nuevoValorPorcentaje / 100))
        );

        setPreciosPropuestos(nuevos);
    }, [preciosPropuestos, precioCostoNuevo]);

    /**
     * Valida que los cambios sean consistentes y significativos
     */
    const validarCambios = useCallback((tolerancia: number = 0.01): {
        esValido: boolean;
        mensaje: string;
        preciosCambiados: Array<{
            id: number;
            precio_propuesto: number;
            porcentaje_ganancia_propuesto: number;
        }>;
    } => {
        // Validar que haya cambios significativos
        const preciosCambiados = preciosPropuestos.filter(p =>
            Math.abs(p.precio_propuesto - p.precio_actual) > tolerancia ||
            Math.abs(p.porcentaje_ganancia_propuesto - p.porcentaje_ganancia_actual) > tolerancia
        );

        if (preciosCambiados.length === 0) {
            return {
                esValido: false,
                mensaje: 'No hay cambios significativos en los precios',
                preciosCambiados: []
            };
        }

        // Validar que todos los precios sean positivos
        const preciosNegativosoNulos = preciosCambiados.filter(p => p.precio_propuesto < 0);
        if (preciosNegativosoNulos.length > 0) {
            return {
                esValido: false,
                mensaje: `Los precios no pueden ser negativos (${preciosNegativosoNulos.length} errores encontrados)`,
                preciosCambiados: []
            };
        }

        // Validar costo nunca sea 0
        const costoCambiado = preciosCambiados.find(p => p.id === preciosPropuestos.find(x => x.tipo_codigo === 'COSTO')?.id);
        if (costoCambiado && costoCambiado.precio_propuesto <= 0) {
            return {
                esValido: false,
                mensaje: 'El costo debe ser mayor a 0',
                preciosCambiados: []
            };
        }

        return {
            esValido: true,
            mensaje: `${preciosCambiados.length} precio(s) será(n) actualizado(s)`,
            preciosCambiados: preciosCambiados.map(p => ({
                id: p.id,
                precio_propuesto: p.precio_propuesto,
                porcentaje_ganancia_propuesto: p.porcentaje_ganancia_propuesto
            }))
        };
    }, [preciosPropuestos]);

    /**
     * ✅ NUEVO: Inicializa precios propuestos con los valores actuales (SIN calcular cascada)
     * El usuario podrá editar manualmente cuáles actualizar
     */
    const inicializarConPreciosActuales = useCallback((): void => {
        setError(null);

        if (!precios || precios.length === 0) {
            return;
        }

        try {
            const preciosIniciales: PrecioPropuesto[] = precios.map((precio) => ({
                id: precio.id,
                tipo_precio_id: precio.tipo_precio_id,
                tipo_nombre: precio.tipo.nombre,
                tipo_codigo: precio.tipo.codigo,
                tipo_color: precio.tipo.color,
                tipo_es_ganancia: precio.tipo.es_ganancia,
                precio_actual: precio.precio_actual,
                precio_propuesto: precio.precio_actual, // ✅ Usa el precio actual como propuesto
                porcentaje_ganancia_actual: precio.porcentaje_ganancia,
                porcentaje_ganancia_propuesto: precio.porcentaje_ganancia, // ✅ Usa la ganancia actual
            }));

            setPreciosPropuestos(preciosIniciales);
        } catch (err) {
            const mensaje = err instanceof Error ? err.message : 'Error desconocido al inicializar precios';
            setError({
                tipo: 'calculo',
                mensaje
            });
        }
    }, [precios]);

    /**
     * Restaura los precios originales
     */
    const restaurarPreciosOriginales = useCallback((): void => {
        setPreciosPropuestos([]);
        setError(null);
    }, []);

    return {
        preciosPropuestos,
        error,
        calcularCascada,
        inicializarConPreciosActuales, // ✅ Nueva función
        actualizarPrecioPropuesto,
        actualizarGananciaPropuesta,
        validarCambios,
        restaurarPreciosOriginales,
        limpiar: restaurarPreciosOriginales // Alias
    };
}

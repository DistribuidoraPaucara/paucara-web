/**
 * EJEMPLO DE INTEGRACIÓN: useCascadaPreciosCompra y ModalComprasDiferenciaCostoComponent
 *
 * Este archivo muestra cómo integrar el modal de cascada de precios en ProductosTable
 */

import React, { useState, useCallback } from 'react';
import { ModalComprasDiferenciaCostoComponent } from '@/presentation/components/precios/modal-compras-diferencia-costo';
import { tienePreferenciaDiferencia, validarDatosParaModal } from '@/domain/types/cascada-precios.types';
import { NotificationService } from '@/infrastructure/services/notification.service';

/**
 * PASO 1: En ProductosTable, agregar estado para el modal
 */
export function ProductosTableExample() {
    // Estado para controlar el modal de cascada
    const [modalCascadaState, setModalCascadaState] = useState<{
        isOpen: boolean;
        productoId: number | null;
        precioActual: number | null;
        precioCostoNuevo: number | null;
        detalleIndex: number | null;
        productoData?: any; // Datos completos del producto
    }>({
        isOpen: false,
        productoId: null,
        precioActual: null,
        precioCostoNuevo: null,
        detalleIndex: null,
    });

    // PASO 2: En el render de cada fila, detectar diferencia y mostrar icono
    /**
     * Esto iría en el mapeo de detalles de ProductosTable
     *
     * Pseudocódigo:
     * ```
     * {tipo === 'compra' && (
     *   <td>
     *     {detalles.map((detalle, index) => {
     *       const precioCosto = detalle.precio_costo || 0;
     *       const hayDiferencia = tienePreferenciaDiferencia(precioCosto, detalle.precio_unitario);
     *
     *       return (
     *         <tr key={index}>
     *           // ... otras celdas ...
     *           {hayDiferencia && (
     *             <td>
     *               <IconButton
     *                 icon={AlertCircle}
     *                 size="sm"
     *                 variant="ghost"
     *                 className="text-amber-600"
     *                 onClick={() => abrirModalCascada(index, detalle)}
     *                 title="Actualizar cascada de precios"
     *               />
     *             </td>
     *           )}
     *         </tr>
     *       );
     *     })}
     *   </td>
     * )}
     * ```
     */

    /**
     * PASO 3: Handler para abrir el modal
     */
    const abrirModalCascada = useCallback(async (
        indexDetalle: number,
        detalle: any
    ) => {
        try {
            // Cargar datos completos del producto (si no está disponible)
            const respuesta = await fetch(`/api/productos/${detalle.producto_id}/precios`);
            if (!respuesta.ok) throw new Error('Error al cargar precios del producto');
            const productoData = await respuesta.json();

            // Validar datos
            const validacion = validarDatosParaModal({
                isOpen: true,
                onClose: () => {},
                producto: productoData,
                precioActual: detalle.precio_costo,
                precioCostoNuevo: detalle.precio_unitario,
                onActualizarPrecios: () => Promise.resolve(),
            });

            if (!validacion.esValido) {
                NotificationService.error(validacion.errores.join(', '));
                return;
            }

            // Abrir modal
            setModalCascadaState({
                isOpen: true,
                productoId: detalle.producto_id,
                precioActual: detalle.precio_costo,
                precioCostoNuevo: detalle.precio_unitario,
                detalleIndex: indexDetalle,
                productoData
            });
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : 'Error desconocido';
            NotificationService.error(`No se pudo abrir el modal: ${mensaje}`);
        }
    }, []);

    /**
     * PASO 4: Handler para guardar precios desde el modal
     */
    const handleGuardarPreciosModal = useCallback(async (
        preciosCambiados: Array<{
            precio_id: number;
            precio_nuevo: number;
            porcentaje_ganancia: number;
            motivo: string;
        }>
    ) => {
        try {
            const respuesta = await fetch('/api/precios/actualizar-cascada', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    producto_id: modalCascadaState.productoId,
                    precios: preciosCambiados
                })
            });

            if (!respuesta.ok) {
                const error = await respuesta.json();
                throw new Error(error.mensaje || 'Error al guardar precios');
            }

            return respuesta.json();
        } catch (error) {
            throw error; // El modal manejará el error
        }
    }, [modalCascadaState.productoId]);

    /**
     * PASO 5: Handler cuando se cierran precios exitosamente
     */
    const handlePreciosActualizados = useCallback(() => {
        // Opcionales:
        // - Refrescar la vista del documento
        // - Actualizar estado local de detalles
        // - Cambiar precio en la fila
    }, []);

    /**
     * PASO 6: Cerrar modal
     */
    const cerrarModalCascada = useCallback(() => {
        setModalCascadaState(prev => ({ ...prev, isOpen: false }));
    }, []);

    /**
     * PASO 7: Renderizar el modal
     */
    return (
        <>
            {/* ... rest of ProductosTable ... */}

            <ModalComprasDiferenciaCostoComponent
                isOpen={modalCascadaState.isOpen}
                onClose={cerrarModalCascada}
                producto={modalCascadaState.productoData || null}
                precioActual={modalCascadaState.precioActual}
                precioCostoNuevo={modalCascadaState.precioCostoNuevo}
                onActualizarPrecios={handleGuardarPreciosModal}
                onSuccess={handlePreciosActualizados}
            />
        </>
    );
}

/**
 * TIPS DE IMPLEMENTACIÓN
 *
 * 1. CARGA LAZY:
 *    Solo carga los precios cuando el usuario abre el modal
 *    (no en cada renderizado de ProductosTable)
 *
 * 2. VALIDACIÓN:
 *    El modal valida internamente, pero ProductosTable también debe validar
 *    antes de pasar datos para fallar rápido
 *
 * 3. ERROR HANDLING:
 *    - Modal: NotificationService.error() automáticamente
 *    - ProductosTable: validación previa + try/catch en abrirModalCascada
 *
 * 4. ESTADO:
 *    ProductosTable mantiene el estado del modal, no el modal.
 *    El modal es "presentational" y solo notifica cambios.
 *
 * 5. ACTUALIZACION POST-GUARDADO:
 *    Si necesitas actualizar ProductosTable después de guardar:
     *    - onSuccess callback dispara handlePreciosActualizados()
     *    - Allí puedes refrescar detalles si es necesario
     *    - O dejar que el usuario manualmente continúe (más simple)
 *
 * 6. ENDPOINT BACKEND:
 *    POST /api/precios/actualizar-cascada
 *    Body:
 *    {
 *      producto_id: number,
 *      precios: Array<{
 *        precio_id: number,
 *        precio_nuevo: number,
 *        porcentaje_ganancia: number,
 *        motivo: string
 *      }>
 *    }
 */

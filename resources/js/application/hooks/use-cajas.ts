/**
 * Hook: useCajas
 *
 * Responsabilidades:
 * ✅ Gestionar estado de modal de apertura de caja
 * ✅ Gestionar estado de modal de cierre de caja
 * ✅ Funciones helper para manejo de cajas
 * ✅ Encapsular lógica de componente Index
 */

import { useState } from 'react';
import type { CajasIndexProps } from '@/domain/entities/cajas';

export function useCajas(props: CajasIndexProps) {
    const { cajas, cajaAbiertaHoy } = props;

    // Estado de modales
    const [showAperturaModal, setShowAperturaModal] = useState(false);
    const [showCierreModal, setShowCierreModal] = useState(false);

    /**
     * Abrir modal de apertura de caja
     */
    const handleAbrirModal = () => {
        setShowAperturaModal(true);
    };

    /**
     * Cerrar modal de apertura
     */
    const handleCerrarModalApertura = () => {
        setShowAperturaModal(false);
    };

    /**
     * Abrir modal de cierre de caja
     */
    const handleAbrirCierreModal = () => {
        setShowCierreModal(true);
    };

    /**
     * Cerrar modal de cierre
     */
    const handleCerrarModalCierre = () => {
        setShowCierreModal(false);
    };

    /**
     * Verificar si hay caja abierta
     */
    const tieneCapaAbierta = cajaAbiertaHoy !== null && !cajaAbiertaHoy.cierre;

    /**
     * Verificar si caja está cerrada
     */
    const estaCerrada = cajaAbiertaHoy !== null && cajaAbiertaHoy.cierre;

    return {
        // Estado de modales
        showAperturaModal,
        showCierreModal,
        setShowAperturaModal,
        setShowCierreModal,

        // Handlers
        handleAbrirModal,
        handleCerrarModalApertura,
        handleAbrirCierreModal,
        handleCerrarModalCierre,

        // Utility
        tieneCapaAbierta,
        estaCerrada,
        cajas,
        cajaAbiertaHoy
    };
}

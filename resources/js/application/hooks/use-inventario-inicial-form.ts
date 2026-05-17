/**
 * Hook: Manejo de Formulario de Inventario Inicial
 *
 * Responsabilidades:
 * - Gestionar lista de items
 * - Agregar, eliminar, actualizar items
 * - Cargar items importados
 * - Exponer métodos de manipulación a la presentación
 */

import { useCallback, useMemo } from 'react';
import type { InventarioItem, CargarInventarioInicialPayload } from '@/domain/entities/inventario-inicial';

interface UseInventarioInicialFormOptions {
    items: InventarioItem[];
    onItemsChange: (items: InventarioItem[]) => void;
}

interface UseInventarioInicialFormReturn {
    items: InventarioItem[];
    itemsCount: number;
    agregarItem: () => void;
    eliminarItem: (index: number) => void;
    actualizarItem: (index: number, field: keyof InventarioItem, value: any) => void;
    cargarItemsImportados: (items: InventarioItem[]) => void;
    limpiarItems: () => void;
    obtenerPayload: () => CargarInventarioInicialPayload;
}

export function useInventarioInicialForm({
    items,
    onItemsChange,
}: UseInventarioInicialFormOptions): UseInventarioInicialFormReturn {
    // ✅ Crear item vacío
    const crearItemVacio = useCallback((): InventarioItem => ({
        producto_id: '',
        almacen_id: '',
        cantidad: '',
        lote: '',
        fecha_vencimiento: '',
        observaciones: ''
    }), []);

    // ✅ Agregar nuevo item
    const agregarItem = useCallback(() => {
        onItemsChange([...items, crearItemVacio()]);
    }, [items, onItemsChange, crearItemVacio]);

    // ✅ Eliminar item por índice
    const eliminarItem = useCallback((index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onItemsChange(newItems);
    }, [items, onItemsChange]);

    // ✅ Actualizar campo de un item
    const actualizarItem = useCallback((index: number, field: keyof InventarioItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onItemsChange(newItems);
    }, [items, onItemsChange]);

    // ✅ Cargar items importados (agregar a los existentes)
    const cargarItemsImportados = useCallback((nuevosItems: InventarioItem[]) => {
        onItemsChange([...items, ...nuevosItems]);
    }, [items, onItemsChange]);

    // ✅ Limpiar todos los items
    const limpiarItems = useCallback(() => {
        onItemsChange([]);
    }, [onItemsChange]);

    // ✅ Obtener payload para enviar al servidor
    const obtenerPayload = useCallback((): CargarInventarioInicialPayload => {
        return { items };
    }, [items]);

    // ✅ Contar items (memoizado para evitar recálculos)
    const itemsCount = useMemo(() => items.length, [items.length]);

    return {
        items,
        itemsCount,
        agregarItem,
        eliminarItem,
        actualizarItem,
        cargarItemsImportados,
        limpiarItems,
        obtenerPayload,
    };
}

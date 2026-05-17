import { useEffect, useCallback, useRef } from 'react';

/**
 * ✅ NUEVO: Hook para persistir formularios en localStorage
 *
 * Características:
 * - Guarda automáticamente los datos del formulario en localStorage mientras escribes
 * - Restaura los datos al cargar la página
 * - Limpia los datos cuando se envía el formulario exitosamente
 * - Debounce de 500ms para evitar guardar en exceso
 *
 * @param storageKey - Clave única para localStorage (ej: 'venta-create-form')
 * @param formData - Objeto con los datos del formulario
 * @param shouldSave - Condición para determinar si guardar (default: true)
 * @returns Objeto con funciones para manejar la persistencia
 */
export function useLocalStorageForm<T extends Record<string, any>>(
    storageKey: string,
    formData: T,
    shouldSave: boolean = true
) {
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSavedDataRef = useRef<T | null>(null);

    // ✅ Guardar datos en localStorage con debounce
    const saveToStorage = useCallback(() => {
        if (!shouldSave) return;

        // No guardar si los datos no han cambiado
        if (JSON.stringify(lastSavedDataRef.current) === JSON.stringify(formData)) {
            return;
        }

        try {
            localStorage.setItem(storageKey, JSON.stringify(formData));
            lastSavedDataRef.current = formData;
            console.log(`✅ Datos guardados en localStorage: ${storageKey}`);
        } catch (error) {
            console.error(`❌ Error guardando en localStorage:`, error);
        }
    }, [formData, storageKey, shouldSave]);

    // ✅ Guardar con debounce cuando los datos cambien
    useEffect(() => {
        if (!shouldSave) return;

        // Limpiar timeout anterior
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Establecer nuevo timeout
        debounceTimeoutRef.current = setTimeout(() => {
            saveToStorage();
        }, 500); // Esperar 500ms después del último cambio

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [formData, saveToStorage, shouldSave]);

    // ✅ Restaurar datos del localStorage
    const restoreFromStorage = useCallback((): T | null => {
        try {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData) as T;
                lastSavedDataRef.current = parsedData;
                console.log(`✅ Datos restaurados desde localStorage: ${storageKey}`);
                return parsedData;
            }
        } catch (error) {
            console.error(`❌ Error restaurando desde localStorage:`, error);
        }
        return null;
    }, [storageKey]);

    // ✅ Limpiar datos del localStorage (después de enviar exitosamente)
    const clearStorage = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            lastSavedDataRef.current = null;
            console.log(`✅ Datos limpios del localStorage: ${storageKey}`);
        } catch (error) {
            console.error(`❌ Error limpiando localStorage:`, error);
        }
    }, [storageKey]);

    // ✅ Verificar si hay datos guardados
    const hasStoredData = useCallback((): boolean => {
        try {
            return localStorage.getItem(storageKey) !== null;
        } catch (error) {
            return false;
        }
    }, [storageKey]);

    return {
        restoreFromStorage,
        clearStorage,
        hasStoredData,
        saveToStorage
    };
}

import { useState, useEffect } from 'react';
import { useLocalStorageForm } from './useLocalStorageForm';

/**
 * ✅ NUEVO: Hook integrado para formularios con localStorage
 *
 * Combina la lógica de formulario + persistencia en localStorage
 * Ideal para formularios complejos como crear ventas
 *
 * @param storageKey - Clave para localStorage
 * @param initialState - Estado inicial del formulario
 * @returns Estado del formulario + funciones de persistencia
 */
export function useFormWithLocalStorage<T extends Record<string, any>>(
    storageKey: string,
    initialState: T
) {
    const [formData, setFormData] = useState<T>(initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    const { restoreFromStorage, clearStorage, hasStoredData } = useLocalStorageForm(
        storageKey,
        formData
    );

    // ✅ Al montar el componente, restaurar datos si existen
    useEffect(() => {
        const savedData = restoreFromStorage();
        if (savedData) {
            setFormData(savedData);
            console.log('📋 Formulario restaurado desde localStorage');
        }
        setIsLoaded(true);
    }, [storageKey]); // Solo en mount

    // ✅ Actualizar un campo específico
    const updateField = <K extends keyof T>(field: K, value: T[K]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // ✅ Actualizar múltiples campos
    const updateFields = (updates: Partial<T>) => {
        setFormData(prev => ({
            ...prev,
            ...updates
        }));
    };

    // ✅ Resetear al estado inicial y limpiar localStorage
    const resetForm = () => {
        setFormData(initialState);
        clearStorage();
    };

    // ✅ Limpiar solo el localStorage (mantiene los datos en el form)
    const clearFormStorage = () => {
        clearStorage();
    };

    return {
        formData,
        setFormData,
        updateField,
        updateFields,
        resetForm,
        clearFormStorage,
        hasStoredData: hasStoredData(),
        isLoaded // Indica si se completó la carga inicial
    };
}

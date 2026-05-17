/**
 * Application Layer Hook: useSimpleEntregaForm
 *
 * Encapsula la lógica de negocio para formulario simple de entregas (1 venta)
 * Validación, transformación de datos, y conversión a SelectOptions
 *
 * ARQUITECTURA:
 * - Presentación: SimpleEntregaForm.tsx (solo renderiza)
 * - Application: Este hook (lógica de negocio)
 * - Domain: Tipos puros (Entrega, VentaConDetalles, etc.)
 */

import { useState, useMemo } from 'react';
import type { SelectOption } from '@/presentation/components/ui/search-select';
import type {
    VentaConDetalles,
    VehiculoCompleto,
    ChoferEntrega,
    EntregaFormData,
} from '@/domain/entities/entregas';
import type { Id } from '@/domain/entities/shared';

// ==================== FUNCIONES DE UTILIDAD ====================

/**
 * Verificar si una fecha es día hábil (no domingo)
 * @param date - Fecha a verificar
 * @returns true si es día hábil (lunes a sábado)
 */
const isBusinessDay = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    // 0 = domingo, 1-6 = lunes a sábado
    return dayOfWeek !== 0;
};

/**
 * Calcular el próximo día hábil a partir de una fecha
 * Si la fecha es día hábil, retorna la misma fecha
 * Si es domingo, retorna el lunes siguiente
 * @param date - Fecha de inicio
 * @returns Próximo día hábil
 */
const getNextBusinessDay = (date: Date = new Date()): Date => {
    const result = new Date(date);

    // Si es domingo (0), avanzar al lunes
    while (!isBusinessDay(result)) {
        result.setDate(result.getDate() + 1);
    }

    return result;
};

/**
 * Convertir fecha a formato datetime-local (YYYY-MM-DDTHH:mm)
 * @param date - Fecha a convertir
 * @param hour - Hora (por defecto 09:00)
 * @returns String en formato YYYY-MM-DDTHH:mm
 */
const formatToDatetimeLocal = (date: Date, hour = '09:00'): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${hour}`;
};

interface UseSimpleEntregaFormReturn {
    // Estado del formulario
    formData: EntregaFormData;
    errors: Record<string, string>;

    // Opciones para SearchSelect
    vehiculosOptions: SelectOption[];
    choferesOptions: SelectOption[];

    // Estados seleccionados
    selectedVehiculo: VehiculoCompleto | undefined;
    pesoEstimado: number;
    capacidadInsuficiente: boolean;
    vehiculoTieneChofer: boolean;  // Indica si el vehículo seleccionado tiene chofer

    // Validación
    isFormValid: boolean;
    validate: () => boolean;

    // Handlers
    handleFieldChange: (field: keyof EntregaFormData, value: any) => void;
    handleVehiculoSelect: (value: Id | '') => void;
    handleChoferSelect: (value: Id | '') => void;
    setErrors: (errors: Record<string, string>) => void;
}

/**
 * Hook para gestionar formulario simple de entregas
 * Centraliza validación y transformación de datos
 */
export const useSimpleEntregaForm = (
    venta: VentaConDetalles,
    vehiculos: VehiculoCompleto[],
    choferes: ChoferEntrega[]
): UseSimpleEntregaFormReturn => {
    // ==================== ESTADO ====================
    // Prellenar con datos de la venta si están disponibles
    const [formData, setFormData] = useState<EntregaFormData>(() => {
        // Lógica de pre-llenado de fecha:
        // Prioridad 1: fecha_entrega_comprometida (con hora comprometida o 09:00)
        // Prioridad 2: próximo día hábil a las 09:00
        let fechaProgramada = '';

        if (venta.fecha_entrega_comprometida) {
            const date = new Date(venta.fecha_entrega_comprometida);
            const hora = venta.hora_entrega_comprometida || '09:00';
            fechaProgramada = formatToDatetimeLocal(date, hora);
        } else {
            // Usar próximo día hábil
            const nextBusinessDay = getNextBusinessDay(new Date());
            fechaProgramada = formatToDatetimeLocal(nextBusinessDay, '09:00');
        }

        return {
            venta_id: venta.id,
            vehiculo_id: undefined,
            chofer_id: undefined,
            fecha_programada: fechaProgramada,
            // Prellenar dirección de entrega (prioridad: FK direccionCliente, fallback: campo legacy)
            direccion_entrega: venta.direccionCliente?.direccion || venta.direccion_entrega || '',
            observaciones: '',
        };
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // ==================== VALORES DERIVADOS ====================

    const selectedVehiculo = vehiculos.find((v) => v.id === formData.vehiculo_id);
    const pesoEstimado = venta.peso_estimado ?? 0;
    const capacidadInsuficiente =
        selectedVehiculo && pesoEstimado > (selectedVehiculo.capacidad_kg ?? 0);

    // Convertir a opciones para SearchSelect (con info de chofer)
    const vehiculosOptions: SelectOption[] = useMemo(() => {
        return vehiculos.map((vehiculo) => ({
            value: vehiculo.id,
            label: `${vehiculo.placa}`,
            description: `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.capacidad_kg ?? 0}kg${
                vehiculo.chofer ? ` 👤 ${vehiculo.chofer.nombre || vehiculo.chofer.name}` : ' ❌ Sin chofer'
            }`,
        }));
    }, [vehiculos]);

    const choferesOptions: SelectOption[] = useMemo(() => {
        return choferes.map((chofer) => ({
            value: chofer.id,
            label: `${chofer.nombre || chofer.name}`,
            description: chofer.email || '',
        }));
    }, [choferes]);

    // ==================== VALIDACIÓN ====================

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validar vehículo
        if (!formData.vehiculo_id) {
            newErrors.vehiculo_id = 'Selecciona un vehículo';
        } else if (capacidadInsuficiente) {
            newErrors.vehiculo_id = `Capacidad insuficiente (${pesoEstimado.toFixed(1)}kg > ${selectedVehiculo?.capacidad_kg}kg)`;
        }

        // Validar chofer
        if (!formData.chofer_id) {
            newErrors.chofer_id = 'Selecciona un chofer';
        }

        // Validar fecha
        if (!formData.fecha_programada) {
            newErrors.fecha_programada = 'Selecciona una fecha y hora';
        } else {
            const fechaProgramada = new Date(formData.fecha_programada);
            const ahora = new Date();

            // Validar que la fecha sea futura
            if (fechaProgramada <= ahora) {
                newErrors.fecha_programada = 'La fecha debe ser futura';
            }
            // Validar que sea día hábil (no domingo)
            else if (!isBusinessDay(fechaProgramada)) {
                newErrors.fecha_programada = 'La entrega no puede ser programada para domingo';
            }
        }

        // Validar dirección si es requerida
        if (!formData.direccion_entrega?.trim()) {
            newErrors.direccion_entrega = 'La dirección es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ==================== HANDLERS ====================

    const handleFieldChange = (field: keyof EntregaFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Limpiar error del campo cuando el usuario edita
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleVehiculoSelect = (value: Id | '') => {
        handleFieldChange('vehiculo_id', value || undefined);

        // Si el vehículo tiene chofer asociado, asignarlo automáticamente
        if (value) {
            const vehiculo = vehiculos.find((v) => v.id === value);
            if (vehiculo?.chofer_id) {
                handleFieldChange('chofer_id', vehiculo.chofer_id);
            } else {
                // Si no tiene chofer, limpiar el campo
                handleFieldChange('chofer_id', undefined);
            }
        }
    };

    const handleChoferSelect = (value: Id | '') => {
        handleFieldChange('chofer_id', value || undefined);
    };

    // ==================== VALIDACIÓN DE FORMULARIO ====================

    // Verificar si el vehículo seleccionado tiene chofer asociado
    const vehiculoTieneChofer = useMemo(() => {
        return !!selectedVehiculo?.chofer_id;
    }, [selectedVehiculo?.chofer_id]);

    const isFormValid = useMemo(() => {
        return (
            !!formData.vehiculo_id &&
            !!formData.chofer_id &&
            !!formData.fecha_programada &&
            !!formData.direccion_entrega?.trim() &&
            !capacidadInsuficiente
        );
    }, [formData, capacidadInsuficiente]);

    return {
        // Estado
        formData,
        errors,

        // Opciones
        vehiculosOptions,
        choferesOptions,

        // Valores seleccionados
        selectedVehiculo,
        pesoEstimado,
        capacidadInsuficiente,
        vehiculoTieneChofer,

        // Validación
        isFormValid,
        validate,

        // Handlers
        handleFieldChange,
        handleVehiculoSelect,
        handleChoferSelect,
        setErrors,
    };
};

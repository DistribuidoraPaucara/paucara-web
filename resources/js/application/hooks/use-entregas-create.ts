/**
 * Application Layer Hook: useEntregasCreate
 *
 * Maneja la lógica de negocio para crear entregas
 * Incluye validación, manejo de historial, y navegación
 *
 * MIGRATED FROM: use-envios-create.ts
 */

import { router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { Id } from '@/domain/entities/shared';
import type { SelectOption } from '@/presentation/components/ui/search-select';
import type { VentaConDetalles, VehiculoCompleto, ChoferEntrega } from '@/domain/entities/entregas';
import { validarFechaProgramada, ChoferHistorialService } from '@/lib/entregas.utils';

interface EntregasCreateFormData {
    venta_id: string;
    vehiculo_id: string;
    chofer_id: string;
    fecha_programada: string;
    direccion_entrega: string;
    peso_kg: string;
    observaciones: string;
}

interface UseEntregasCreateReturn {
    form: ReturnType<typeof useForm<EntregasCreateFormData>>;
    fechaError: string;
    setFechaError: (error: string) => void;
    historialChoferes: SelectOption[];
    selectedVenta: VentaConDetalles | undefined;
    selectedVehiculo: VehiculoCompleto | undefined;
    selectedChofer: ChoferEntrega | undefined;
    ventasOptions: SelectOption[];
    vehiculosOptions: SelectOption[];
    chofersConHistorial: SelectOption[];
    isFormValid: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    handleVolver: () => void;
}

/**
 * Hook para crear entregas
 * Encapsula validación, transformación de datos y lógica de negocio
 */
export const useEntregasCreate = (
    ventas: VentaConDetalles[],
    vehiculos: VehiculoCompleto[],
    choferes: ChoferEntrega[],
    ventaPreseleccionada?: Id
): UseEntregasCreateReturn => {
    // DEBUG: Mostrar datos recibidos
    console.log('=== DEBUG useEntregasCreate ===');
    console.log('Ventas recibidas:', ventas.length, ventas);
    console.log('Vehiculos recibidos:', vehiculos.length, vehiculos);
    console.log('Choferes recibidos:', choferes.length, choferes);

    // Estado del formulario
    const form = useForm<EntregasCreateFormData>({
        venta_id: ventaPreseleccionada ? ventaPreseleccionada.toString() : '',
        vehiculo_id: '',
        chofer_id: '',
        fecha_programada: '',
        direccion_entrega: '',
        peso_kg: '',
        observaciones: '',
    });

    // Estados locales
    const [fechaError, setFechaError] = useState('');
    const [historialChoferes, setHistorialChoferes] = useState<SelectOption[]>([]);

    // Cargar historial de choferes al montar
    const cargarHistorial = () => {
        const chofersIds = ChoferHistorialService.obtenerHistorial();
        const opciones = chofersIds
            .map(id => choferes.find(c => c.id === id))
            .filter((c): c is ChoferEntrega => !!c)
            .map(chofer => ({
                value: chofer.id,
                label: `${chofer.name || chofer.nombre || 'Sin nombre'} (recientemente usado)`,
                description: chofer.email || '',
            }));
        setHistorialChoferes(opciones);
    };

    const { data, setData, post, processing, errors } = form;

    // Encontrar entidades seleccionadas
    const selectedVenta = ventas.find(v => v.id.toString() === data.venta_id);
    const selectedVehiculo = vehiculos.find(v => v.id.toString() === data.vehiculo_id);
    const selectedChofer = choferes.find(c => c.id.toString() === data.chofer_id);

    // Convertir datos a opciones para SearchSelect
    const ventasOptions: SelectOption[] = ventas.map(venta => ({
        value: venta.id,
        label: `${venta.numero_venta} - ${venta.cliente.nombre}`,
        description: `Bs. ${venta.subtotal}`,
    }));

    const vehiculosOptions: SelectOption[] = vehiculos.map(vehiculo => ({
        value: vehiculo.id,
        label: `${vehiculo.placa}`,
        description: `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.capacidad_carga || vehiculo.capacidad_kg || 0}kg`,
    }));

    const chofersOptions: SelectOption[] = choferes.map(chofer => ({
        value: chofer.id,
        label: chofer.name || chofer.nombre || 'Sin nombre',
        description: chofer.email || '',
    }));

    console.log('Opciones generadas:');
    console.log('- ventasOptions:', ventasOptions.length);
    console.log('- vehiculosOptions:', vehiculosOptions.length);
    console.log('- chofersOptions:', chofersOptions.length, chofersOptions);

    // Combinar opciones de choferes con historial
    const chofersConHistorial: SelectOption[] = [
        ...historialChoferes,
        ...chofersOptions.filter(
            c => !historialChoferes.some(h => h.value === c.value)
        ),
    ];

    console.log('Choferes con historial:', chofersConHistorial.length, chofersConHistorial);

    // Validar si todos los campos requeridos están completos
    const isFormValid = data.venta_id && data.vehiculo_id && data.chofer_id &&
                        data.fecha_programada && data.direccion_entrega && data.peso_kg;

    /**
     * Manejador de envío del formulario
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar fecha
        const validacion = validarFechaProgramada(data.fecha_programada);
        if (!validacion.valida) {
            setFechaError(validacion.mensaje);
            return;
        }

        setFechaError('');

        // Guardar chofer en historial
        if (data.chofer_id) {
            const choferIdNum = parseInt(data.chofer_id);
            ChoferHistorialService.guardarChofer(choferIdNum);
        }

        // Enviar formulario (nuevo endpoint)
        post('/logistica/entregas');
    };

    /**
     * Volver a la página anterior
     */
    const handleVolver = () => {
        window.history.back();
    };

    // Cargar historial cuando el componente monta
    useEffect(() => {
        if (choferes.length > 0) {
            cargarHistorial();
        }
    }, [choferes.length]); // Solo ejecutar cuando cambie la cantidad de choferes

    return {
        form,
        fechaError,
        setFechaError,
        historialChoferes,
        selectedVenta,
        selectedVehiculo,
        selectedChofer,
        ventasOptions,
        vehiculosOptions,
        chofersConHistorial,
        isFormValid,
        handleSubmit,
        handleVolver,
    };
};

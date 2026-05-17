// Infrastructure: Empleados Service
// Este servicio proporciona URLs y validación para el módulo de empleados
// Las operaciones CRUD se manejan directamente con Inertia.js, no con llamadas API
import { GenericService } from './generic.service';
import type { Empleado, EmpleadoFormData } from '@/domain/entities/empleados';
import type { Filters, Id } from '@/domain/entities/shared';

function buildQuery(params?: { query?: Filters }) {
    const qs = new URLSearchParams();
    const q = params?.query ?? {};
    Object.entries(q).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            qs.append(key, String(value));
        }
    });
    const str = qs.toString();
    return str ? `?${str}` : '';
}

/**
 * Servicio de Empleados
 *
 * Proporciona URLs para navegación y validación de datos.
 * NO implementa métodos HTTP directos porque usamos Inertia.js para navegación.
 *
 * Flujo de operaciones:
 * - CREATE: form → useGenericForm → Inertia.post(service.storeUrl())
 * - UPDATE: form → useGenericForm → Inertia.put(service.updateUrl(id))
 * - DELETE: table → service.destroy(id) → Inertia.delete() [heredado de GenericService]
 * - LIST: filters → service.search(filters) → Inertia.get() [heredado de GenericService]
 */
export class EmpleadosService extends GenericService<Empleado, EmpleadoFormData> {
    constructor() {
        super('empleados');
    }

    showUrl(id: Id): string {
        return `/empleados/${id}`;
    }

    indexUrl(params?: { query?: Filters }) {
        return `/empleados${buildQuery(params)}`;
    }

    createUrl() {
        return '/empleados/create';
    }

    editUrl(id: Id) {
        return `/empleados/${id}/edit`;
    }

    storeUrl() {
        return '/empleados';
    }

    updateUrl(id: Id) {
        return `/empleados/${id}`;
    }

    destroyUrl(id: Id) {
        return `/empleados/${id}`;
    }

    // Validación específica para empleados
    validateData(data: EmpleadoFormData): string[] {
        const errors = super.validateData(data);

        // Validar CI
        if (!data.ci || String(data.ci).trim().length === 0) {
            errors.push('La cédula de identidad es requerida');
        }

        if (data.ci && String(data.ci).length < 6) {
            errors.push('La cédula debe tener al menos 6 caracteres');
        }

        // Validar cargo
        /* if (!data.cargo || String(data.cargo).trim().length === 0) {
            errors.push('El cargo es requerido');
        }

        // Validar departamento
        if (!data.departamento || String(data.departamento).trim().length === 0) {
            errors.push('El departamento es requerido');
        } */

        // Validar email si se proporciona
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('El formato del email no es válido');
        }

        // Validar salario
        const salario = typeof data.salario_base === 'string' ? parseFloat(data.salario_base) : data.salario_base;
        if (salario && salario < 0) {
            errors.push('El salario base no puede ser negativo');
        }

        return errors;
    }
}

// Instancia singleton
export const empleadosService = new EmpleadosService();
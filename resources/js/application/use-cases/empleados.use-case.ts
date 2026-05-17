// Application: Empleados Use Cases
import { empleadosService } from '@/infrastructure/services/empleados.service';
import type { Empleado, EmpleadoFormData } from '@/domain/entities/empleados';
import type { Filters, Id } from '@/domain/entities/shared';

export class EmpleadosUseCase {
    constructor(private service = empleadosService) { }

    /**
     * Navegación y búsqueda
     */
    search(filters: Filters): void {
        return this.service.search(filters);
    }

    destroy(id: Id): Promise<void> {
        return this.service.destroy(id);
    }

    /**
     * Validar datos antes de envío
     */
    validateEmpleadoData(data: EmpleadoFormData): string[] {
        const errors = this.service.validateData(data);

        // Validaciones específicas del negocio
        const additionalErrors = this.validateBusinessRules(data);

        return [...errors, ...additionalErrors];
    }

    /**
     * Validaciones de reglas de negocio específicas
     */
    private validateBusinessRules(data: EmpleadoFormData): string[] {
        const errors: string[] = [];

        // Validar CI único (simulado - en producción sería una consulta async)
        if (data.ci && this.isDuplicateCI(data.ci, data.id)) {
            errors.push('Ya existe un empleado con esta cédula de identidad');
        }

        // Validar edad mínima si tiene fecha de nacimiento
        if (data.fecha_nacimiento) {
            const edad = this.calcularEdad(data.fecha_nacimiento);
            if (edad < 18) {
                errors.push('El empleado debe ser mayor de edad (18 años)');
            }
        }

        // Validar supervisión (no puede supervisarse a sí mismo)
        if (data.supervisor_id === data.id) {
            errors.push('Un empleado no puede ser su propio supervisor');
        }

        return errors;
    }

    /**
     * Simular validación de CI duplicado
     */
    private isDuplicateCI(ci: string, excludeId?: Id): boolean {
        // En producción, esto sería una consulta a la base de datos
        // Por ahora simulamos que no hay duplicados
        console.log(`Validating CI: ${ci}, excluding ID: ${excludeId}`);
        return false;
    }

    /**
     * Calcular edad a partir de fecha de nacimiento
     */
    private calcularEdad(fechaNacimiento: string): number {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();

        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    }

    /**
     * Procesar filtros para empleados
     */
    processFilters(filters: Record<string, unknown>): Filters {
        const processed: Filters = {};

        // Limpiar filtros vacíos
        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value !== 'all' && value !== '' && value != null) {
                processed[key] = value as string | number | boolean;
            }
        });

        return processed;
    }

    /**
     * Generar código de empleado
     */
    generateCodigoEmpleado(): string {
        const now = new Date();
        const year = now.getFullYear();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `EMP-${year}-${randomNum}`;
    }

    /**
     * Generar usernick basado en el nombre
     */
    generateUsernick(nombre: string): string {
        if (!nombre || !nombre.trim()) {
            return 'usuario_' + Date.now();
        }

        // Convertir a minúsculas y quitar espacios
        let usernick = nombre.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
            .replace(/[^a-z0-9]/g, '') // Quitar caracteres especiales
            .substring(0, 15); // Limitar longitud

        // Si queda muy corto, agregar números
        if (usernick.length < 3) {
            usernick += Math.floor(Math.random() * 1000);
        }

        return usernick;
    }

    /**
     * Calcular antigüedad de un empleado
     */
    calcularAntiguedad(fechaIngreso: string): {
        años: number;
        meses: number;
        texto: string;
    } {
        const fecha = new Date(fechaIngreso);
        const hoy = new Date();

        let años = hoy.getFullYear() - fecha.getFullYear();
        let meses = hoy.getMonth() - fecha.getMonth();

        if (meses < 0) {
            años--;
            meses += 12;
        }

        let texto: string;
        if (años > 0) {
            texto = `${años} año${años > 1 ? 's' : ''}`;
            if (meses > 0) {
                texto += ` y ${meses} mes${meses > 1 ? 'es' : ''}`;
            }
        } else if (meses > 0) {
            texto = `${meses} mes${meses > 1 ? 'es' : ''}`;
        } else {
            texto = 'Menos de 1 mes';
        }

        return { años, meses, texto };
    }

    /**
     * Calcular salario total (base + bonos)
     */
    calcularSalarioTotal(empleado: Empleado): number {
        return empleado.salario_base + empleado.bonos;
    }

    /**
     * Determinar si un empleado puede ser supervisor
     */
    puedeSerSupervisor(empleado: Empleado): boolean {
        // Reglas de negocio para determinar si puede supervisar
        const antiguedad = this.calcularAntiguedad(empleado.fecha_ingreso);
        const esActivo = empleado.estado === 'activo';
        const tieneAcceso = empleado.puede_acceder_sistema;

        return antiguedad.años >= 1 && esActivo && tieneAcceso;
    }
}

// Instancia singleton
export const empleadosUseCase = new EmpleadosUseCase();
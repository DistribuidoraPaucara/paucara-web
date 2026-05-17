// Presentation Layer: Empleados Create/Edit Page
// Refactored to use 3-layer architecture
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { empleadosConfig } from '@/config/modules/empleados.config';
import { empleadosService } from '@/infrastructure/services/empleados.service';
// Removed unused import
import type { Empleado, EmpleadoFormData } from '@/domain/entities/empleados';

interface EmpleadosFormProps {
    empleado?: Empleado | null;
    extraData?: {
        supervisores?: Array<{ id: number; nombre: string; cargo?: string; }>;
        roles?: Array<{ value: string; label: string; description?: string; }>;
        cargoRoleMapping?: Record<string, string>;
        camposRol?: Record<string, any>;
        rolFuncional?: string;
        datosRolGuardados?: Record<string, any>;
        departamentos?: string[];
    };
}

const initialEmpleadoData: EmpleadoFormData = {
    nombre: '',
    ci: '',
    codigo_empleado: '',
    fecha_ingreso: new Date().toISOString().split('T')[0], // Fecha actual
    telefono: '',
    email: '',
    direccion: '',
    estado: 'activo',
    observaciones: '',
    puede_acceder_sistema: false,
    usernick: '',
    roles: [],
    password: '',
    password_confirmation: '',
};

export default function EmpleadosForm({ empleado, extraData }: EmpleadosFormProps) {
    const isEditing = !!empleado;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/' },
            { title: 'Empleados', href: empleadosService.indexUrl() },
            { title: isEditing ? 'Editar Empleado' : 'Nuevo Empleado', href: '#' }
        ]}>
            <GenericFormContainer<Empleado, EmpleadoFormData>
                entity={empleado}
                config={empleadosConfig}
                service={empleadosService}
                initialData={initialEmpleadoData}
                extraData={extraData}
                loadOptions={async (fieldKey: string) => {
                    // Cargar opciones dinámicamente para campos específicos
                    if (fieldKey === 'supervisor_id') {
                        return extraData?.supervisores?.map(supervisor => ({
                            value: supervisor.id,
                            label: supervisor.nombre
                        })) || [];
                    }

                    if (fieldKey === 'roles') {
                        // Los roles ya vienen en el formato correcto desde el backend
                        return extraData?.roles || [];
                    }

                    return [];
                }}
            />
        </AppLayout>
    );
}
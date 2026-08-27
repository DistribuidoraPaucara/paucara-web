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
        roles?: Array<{ id: number; name: string }>;
        permissions?: Record<string, string[]>;
        rolesAsignados?: Array<{ id: number; name: string; permissions: string[] }>;
        rolesDisponibles?: Array<{ id: number; name: string; permissions: string[] }>;
        rolesDisponiblesDetallados?: Array<{ id: number; name: string; permissions: string[] }>;
        permisosAsignados?: string[];
        permisosAsignadosMap?: Record<string, string>;
        permisosHeredados?: string[];
        permisosHeredadosMap?: Record<string, string>;
        permisosDisponibles?: Record<string, string[]>;
        cargoRoleMapping?: Record<string, string>;
        camposRol?: Record<string, any>;
        rolFuncional?: string;
        datosRolGuardados?: Record<string, any>;
        departamentos?: string[];
        userRoles?: number[];
        userPermissions?: number[];
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

    // Debug: Ver qué roles y permisos llegan desde el backend
    if (typeof window !== 'undefined') {
        console.log('=== 🔐 ROLES Y PERMISOS DEL BACKEND ===');
        console.log('rolesAsignados:', (extraData as any)?.rolesAsignados);
        console.log('rolesDisponibles:', (extraData as any)?.rolesDisponibles);
        console.log('permisosAsignados:', (extraData as any)?.permisosAsignados);
        console.log('permisosHeredados:', (extraData as any)?.permisosHeredados);
        console.log('permisosDisponibles:', (extraData as any)?.permisosDisponibles);
        console.log('=====================================');
    }

    // Preparar datos iniciales con usernick y roles del usuario asociado
    let initialData = { ...initialEmpleadoData };

    if (isEditing && empleado) {
        // Mapear usernick desde entity.user.usernick
        if (empleado.user?.usernick) {
            initialData.usernick = empleado.user.usernick;
        }

        // Mapear roles desde entity.user.roles (array de role objects con name)
        if (empleado.user?.roles && Array.isArray(empleado.user.roles)) {
            initialData.roles = empleado.user.roles
                .map((role: any) => typeof role === 'string' ? role : role.name)
                .filter(Boolean);
        }

        // Inicializar permisos solo con los permisos directos asignados (no heredados)
        // Los permisos heredados se calculan dinámicamente a partir de los roles
        const permisosDirectos = (extraData as any)?.permisosAsignados || [];
        if (permisosDirectos.length > 0) {
            initialData.permissions = permisosDirectos;
        }

        // ✅ NUEVO: Cargar campos de control de acceso
        initialData.activo = (empleado as any)?.activo ?? true;
        initialData.can_access_web = (empleado as any)?.can_access_web ?? true;
        initialData.can_access_mobile = (empleado as any)?.can_access_mobile ?? false;
    }

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
                initialData={initialData}
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
                        // Usa rolesDisponibles que está disponible tanto en create como en edit
                        const roles = (extraData as any)?.rolesDisponibles || [];
                        return roles.map((role: any) => ({
                            value: typeof role === 'string' ? role : role.name,
                            label: typeof role === 'string' ? role : role.name
                        }));
                    }

                    return [];
                }}
            />
        </AppLayout>
    );
}

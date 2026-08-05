// Presentation Layer: Empleados Edit Page
import type { Empleado } from '@/domain/entities/empleados';
import EmpleadosForm from './form';

interface EmpleadosEditProps {
  empleado: Empleado;
  supervisores?: Array<{ id: number; nombre: string; cargo?: string; }>;
  roles?: Array<{ id: number; name: string } | { value: string; label: string; description?: string; }>;
  permissions?: Record<string, any>;
  rolesAsignados?: Array<{ id: number; name: string; permissions: string[] }>;
  rolesDisponibles?: Array<{ id: number; name: string; permissions: string[] }>;
  permisosAsignados?: string[];
  permisosHeredados?: string[];
  permisosDisponibles?: Record<string, string[]>;
  userRoles?: number[];
  userPermissions?: number[];
  rolFuncional?: string;
  camposRol?: Record<string, any>;
  datosRolGuardados?: Record<string, any>;
}

export default function EmpleadosEdit({
  empleado,
  supervisores,
  roles,
  permissions,
  rolesAsignados,
  rolesDisponibles,
  permisosAsignados,
  permisosHeredados,
  permisosDisponibles,
  userRoles,
  userPermissions,
  rolFuncional,
  camposRol,
  datosRolGuardados
}: EmpleadosEditProps) {
  return (
    <EmpleadosForm
      empleado={empleado}
      extraData={{
        supervisores,
        roles,
        permissions,
        rolesAsignados,
        rolesDisponibles,
        permisosAsignados,
        permisosHeredados,
        permisosDisponibles,
        userRoles,
        userPermissions,
        rolFuncional,
        camposRol,
        datosRolGuardados
      }}
    />
  );
}
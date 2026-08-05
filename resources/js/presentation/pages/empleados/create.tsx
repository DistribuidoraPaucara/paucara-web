// Presentation Layer: Empleados Create Page
import EmpleadosForm from './form';

interface EmpleadosCreateProps {
  supervisores?: Array<{ id: number; nombre: string; cargo?: string; }>;
  roles?: Array<{ id: number; name: string } | { value: string; label: string; description?: string; }>;
  permissions?: Record<string, any>;
  rolesAsignados?: Array<{ id: number; name: string; permissions: string[] }>;
  rolesDisponibles?: Array<{ id: number; name: string; permissions: string[] }>;
  permisosAsignados?: string[];
  permisosHeredados?: string[];
  permisosDisponibles?: Record<string, string[]>;
  cargoRoleMapping?: Record<string, string>;
  camposRol?: Record<string, any>;
}

export default function EmpleadosCreate({
  supervisores,
  roles,
  permissions,
  rolesAsignados,
  rolesDisponibles,
  permisosAsignados,
  permisosHeredados,
  permisosDisponibles,
  cargoRoleMapping,
  camposRol
}: EmpleadosCreateProps) {
  return (
    <EmpleadosForm
      extraData={{
        supervisores,
        roles,
        permissions,
        rolesAsignados,
        rolesDisponibles,
        permisosAsignados,
        permisosHeredados,
        permisosDisponibles,
        cargoRoleMapping,
        camposRol
      }}
    />
  );
}
// Presentation Layer: Empleados Create Page
import EmpleadosForm from './form';

interface EmpleadosCreateProps {
  supervisores?: Array<{ id: number; nombre: string; cargo?: string; }>;
  roles?: Array<{ value: string; label: string; description?: string; }>;
  cargoRoleMapping?: Record<string, string>;
  camposRol?: Record<string, any>;
}

export default function EmpleadosCreate({
  supervisores,
  roles,
  cargoRoleMapping,
  camposRol
}: EmpleadosCreateProps) {
  return (
    <EmpleadosForm
      extraData={{
        supervisores,
        roles,
        cargoRoleMapping,
        camposRol
      }}
    />
  );
}
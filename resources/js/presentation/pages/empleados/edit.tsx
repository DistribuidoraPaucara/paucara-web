// Presentation Layer: Empleados Edit Page
import type { Empleado } from '@/domain/entities/empleados';
import EmpleadosForm from './form';

interface EmpleadosEditProps {
  empleado: Empleado;
  supervisores?: Array<{ id: number; nombre: string; cargo?: string; }>;
  roles?: Array<{ value: string; label: string; description?: string; }>;
  rolFuncional?: string;
  camposRol?: Record<string, any>;
  datosRolGuardados?: Record<string, any>;
}

export default function EmpleadosEdit({
  empleado,
  supervisores,
  roles,
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
        rolFuncional,
        camposRol,
        datosRolGuardados
      }}
    />
  );
}
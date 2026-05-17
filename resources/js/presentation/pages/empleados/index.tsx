// Presentation Layer: Empleados Index Page
// Refactored to use 3-layer architecture
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { empleadosConfig } from '@/config/modules/empleados.config';
import { empleadosService } from '@/infrastructure/services/empleados.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Empleado, EmpleadoFormData } from '@/domain/entities/empleados';

interface EmpleadosIndexProps {
    empleados: Pagination<Empleado>;
    filters: {
        q?: string;
        departamento?: string;
        estado?: string;
        puede_acceder_sistema?: string;
        acceso_sistema?: string; // Backward compatibility
        order_by?: string | null;
        order_dir?: string | null;
    };
}

export default function EmpleadosIndex({ empleados, filters }: EmpleadosIndexProps) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/' },
            { title: 'Empleados', href: empleadosService.indexUrl() }
        ]}>
            <GenericContainer<Empleado, EmpleadoFormData>
                entities={empleados}
                filters={filters}
                config={empleadosConfig}
                service={empleadosService}
            />
        </AppLayout>
    );
}
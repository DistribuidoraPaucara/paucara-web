// Pages: Localidades form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { localidadesConfig } from '@/config/modules/localidades.config';
import localidadesService from '@/infrastructure/services/localidades.service';
import type { Localidad, LocalidadFormData } from '@/domain/entities/localidades';

interface LocalidadesFormProps {
    localidad?: Localidad | null;
}

const initialLocalidadData: LocalidadFormData = {
    nombre: '',
    codigo: '',
    activo: true,
};

export default function LocalidadesForm({ localidad }: LocalidadesFormProps) {
    const isEditing = !!localidad;

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: localidadesService.indexUrl() },
            { title: 'Localidades', href: localidadesService.indexUrl() },
            { title: isEditing ? 'Editar' : 'Nueva', href: '#' }
        ]}>
            <GenericFormContainer<Localidad, LocalidadFormData>
                entity={localidad}
                config={localidadesConfig}
                service={localidadesService}
                initialData={initialLocalidadData}
            />
        </AppLayout>
    );
}

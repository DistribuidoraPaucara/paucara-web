// Pages: Sectores form page using generic components
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { sectoresConfig } from '@/config/modules/sectores.config';
import type { Sector, SectorFormData } from '@/domain/entities/sectores';
import AppLayout from '@/layouts/app-layout';
import sectoresService from '@/infrastructure/services/sectores.service';

interface Almacen {
    id: number;
    value: number;
    label: string;
    nombre: string;
}

interface SectoresFormProps {
    sector?: Sector | null;
    almacenes?: Almacen[] | null;
}

const initialSectorData: SectorFormData = {
    almacen_id: undefined,
    nombre: '',
    descripcion: '',
};

export default function SectoresForm({ sector, almacenes }: SectoresFormProps) {
    const isEditing = !!sector;

    // Logs para debuggear
    console.log('===== SECTORES FORM DEBUG =====');
    console.log('sector prop recibida:', sector);
    console.log('almacenes prop recibida:', almacenes);
    console.log('isEditing:', isEditing);
    console.log('sector completo:', JSON.stringify(sector, null, 2));

    // Preparar datos iniciales con valores de edición si existen
    const initialData: SectorFormData = sector ? {
        almacen_id: sector.almacen_id,
        nombre: sector.nombre || '',
        descripcion: sector.descripcion || '',
    } : initialSectorData;

    console.log('initialData preparada:', initialData);
    console.log('================================');

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: sectoresService.indexUrl() },
                { title: 'Sectores', href: sectoresService.indexUrl() },
                { title: isEditing ? 'Editar' : 'Nuevo', href: '#' },
            ]}
        >
            <GenericFormContainer<Sector, SectorFormData>
                entity={sector}
                config={sectoresConfig}
                service={sectoresService}
                initialData={initialData}
                extraData={{ almacenes: almacenes || [] }}
            />
        </AppLayout>
    );
}

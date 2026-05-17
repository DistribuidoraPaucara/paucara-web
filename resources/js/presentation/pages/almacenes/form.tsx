// Pages: Almacenes form page using generic components
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { almacenesConfig } from '@/config/modules/almacenes.config';
import type { Almacen, AlmacenFormData } from '@/domain/entities/almacenes';
import AppLayout from '@/layouts/app-layout';
import almacenesService from '@/infrastructure/services/almacenes.service';

interface AlmacenesFormProps {
    almacen?: Almacen | null;
}

const initialAlmacenData: AlmacenFormData = {
    nombre: '',
    direccion: '',
    ubicacion_fisica: '',
    requiere_transporte_externo: false,
    responsable: '',
    telefono: '',
    activo: true,
};

export default function AlmacenesForm({ almacen }: AlmacenesFormProps) {
    const isEditing = !!almacen;

    // Logs para debuggear
    console.log('===== ALMACENES FORM DEBUG =====');
    console.log('almacen prop recibida:', almacen);
    console.log('isEditing:', isEditing);
    console.log('almacen completo:', JSON.stringify(almacen, null, 2));

    // Preparar datos iniciales con valores de edición si existen
    const initialData: AlmacenFormData = almacen ? {
        nombre: almacen.nombre || '',
        direccion: almacen.direccion || '',
        ubicacion_fisica: almacen.ubicacion_fisica || '',
        requiere_transporte_externo: almacen.requiere_transporte_externo || false,
        responsable: almacen.responsable || '',
        telefono: almacen.telefono || '',
        activo: almacen.activo !== undefined ? almacen.activo : true,
    } : initialAlmacenData;

    console.log('initialData preparada:', initialData);
    console.log('================================');

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: almacenesService.indexUrl() },
                { title: 'Almacenes', href: almacenesService.indexUrl() },
                { title: isEditing ? 'Editar' : 'Nuevo', href: '#' },
            ]}
        >
            <GenericFormContainer<Almacen, AlmacenFormData>
                entity={almacen}
                config={almacenesConfig}
                service={almacenesService}
                initialData={initialData}
            />
        </AppLayout>
    );
}

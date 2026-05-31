// Pages: Almacenes Prestables form page using generic components
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { almacenesPrestablesConfig } from '@/config/modules/almacenes-prestables.config';
import type { AlmacenPrestable, AlmacenPrestableFormData } from '@/config/modules/almacenes-prestables.config';
import AppLayout from '@/layouts/app-layout';
import almacenesPrestablesService from '@/infrastructure/services/almacenes-prestables.service';

interface AlmacenesPrestablesFormProps {
    almacen_prestable?: AlmacenPrestable | null;
}

const initialAlmacenPrestableData: AlmacenPrestableFormData = {
    nombre: '',
    direccion: '',
    ubicacion_fisica: '',
    requiere_transporte_externo: false,
    responsable: '',
    telefono: '',
    es_proveedor: false,
    activo: true,
};

export default function AlmacenesPrestablesForm({ almacen_prestable }: AlmacenesPrestablesFormProps) {
    const isEditing = !!almacen_prestable;

    // Preparar datos iniciales con valores de edición si existen
    const initialData: AlmacenPrestableFormData = almacen_prestable ? {
        nombre: almacen_prestable.nombre || '',
        direccion: almacen_prestable.direccion || '',
        ubicacion_fisica: almacen_prestable.ubicacion_fisica || '',
        requiere_transporte_externo: almacen_prestable.requiere_transporte_externo || false,
        responsable: almacen_prestable.responsable || '',
        telefono: almacen_prestable.telefono || '',
        es_proveedor: almacen_prestable.es_proveedor || false,
        activo: almacen_prestable.activo !== undefined ? almacen_prestable.activo : true,
    } : initialAlmacenPrestableData;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: almacenesPrestablesService.indexUrl() },
                { title: 'Almacenes Prestables', href: almacenesPrestablesService.indexUrl() },
                { title: isEditing ? 'Editar' : 'Nuevo', href: '#' },
            ]}
        >
            <GenericFormContainer<AlmacenPrestable, AlmacenPrestableFormData>
                entity={almacen_prestable}
                config={almacenesPrestablesConfig}
                service={almacenesPrestablesService}
                initialData={initialData}
            />
        </AppLayout>
    );
}

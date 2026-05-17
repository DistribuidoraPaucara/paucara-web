// Pages: Unidades form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { unidadesConfig } from '@/config/modules/unidades.config';
import unidadesService from '@/infrastructure/services/unidades.service';
import type { UnidadMedida, UnidadMedidaFormData } from '@/domain/entities/unidades';

interface UnidadesFormProps {
  unidad?: UnidadMedida | null;
}

const initialUnidadData: UnidadMedidaFormData = {
  codigo: '',
  nombre: '',
  abreviatura: '',
  activo: true,
};

export default function UnidadesForm({ unidad }: UnidadesFormProps) {
  const isEditing = !!unidad;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: unidadesService.indexUrl() },
      { title: 'Unidades de Medida', href: unidadesService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nueva', href: '#' }
    ]}>
      <GenericFormContainer<UnidadMedida, UnidadMedidaFormData>
        entity={unidad}
        config={unidadesConfig}
        service={unidadesService}
        initialData={initialUnidadData}
      />
    </AppLayout>
  );
}

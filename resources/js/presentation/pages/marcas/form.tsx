// Pages: Marcas form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { marcasConfig } from '@/config/modules/marcas.config';
import marcasService from '@/infrastructure/services/marcas.service';
import type { Marca, MarcaFormData } from '@/domain/entities/marcas';

interface MarcasFormProps {
  marca?: Marca | null;
}

const initialMarcaData: MarcaFormData = {
  nombre: '',
  descripcion: '',
  activo: true,
};

export default function MarcasForm({ marca }: MarcasFormProps) {
  const isEditing = !!marca;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: marcasService.indexUrl() },
      { title: 'Marcas', href: marcasService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nueva', href: '#' }
    ]}>
      <GenericFormContainer<Marca, MarcaFormData>
        entity={marca}
        config={marcasConfig}
        service={marcasService}
        initialData={initialMarcaData}
      />
    </AppLayout>
  );
}

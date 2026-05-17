// Pages: Categorias form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { categoriasConfig } from '@/config/modules/categorias.config';
import categoriasService from '@/infrastructure/services/categorias.service';
import type { Categoria, CategoriaFormData } from '@/domain/entities/categorias';

interface CategoriaFormPageProps {
  categoria?: Categoria | null;
}

const initialCategoriaData: CategoriaFormData = {
  nombre: '',
  descripcion: '',
  activo: true,
};

export default function CategoriaForm({ categoria }: CategoriaFormPageProps) {
  const isEditing = !!categoria;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: categoriasService.indexUrl() },
      { title: 'Categorías', href: categoriasService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nueva', href: '#' }
    ]}>
      <GenericFormContainer<Categoria, CategoriaFormData>
        entity={categoria}
        config={categoriasConfig}
        service={categoriasService}
        initialData={initialCategoriaData}
      />
    </AppLayout>
  );
}

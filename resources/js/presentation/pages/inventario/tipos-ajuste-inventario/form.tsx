// Pages: Tipos de Ajuste de Inventario form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { tipoAjusteInventarioConfig } from '@/config/modules/tipoAjusteInventario.config';
import tipoAjusteInventarioService from '@/infrastructure/services/tipoAjusteInventario.service';
import type { TipoAjusteInventario, TipoAjusteInventarioFormData } from '@/domain/entities/tipos-ajuste-inventario';

interface TiposAjusteInventarioFormProps {
  tipoAjusteInventario?: TipoAjusteInventario | null;
}

const initialTipoAjusteData: TipoAjusteInventarioFormData = {
  clave: '',
  label: '',
  descripcion: '',
  activo: true,
};

export default function TiposAjusteInventarioForm({ tipoAjusteInventario }: TiposAjusteInventarioFormProps) {
  const isEditing = !!tipoAjusteInventario;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: tipoAjusteInventarioService.indexUrl() },
      { title: 'Inventario', href: '/inventario' },
      { title: 'Tipos de Ajuste', href: tipoAjusteInventarioService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nuevo', href: '#' }
    ]}>
      <GenericFormContainer<TipoAjusteInventario, TipoAjusteInventarioFormData>
        entity={tipoAjusteInventario}
        config={tipoAjusteInventarioConfig}
        service={tipoAjusteInventarioService}
        initialData={initialTipoAjusteData}
      />
    </AppLayout>
  );
}

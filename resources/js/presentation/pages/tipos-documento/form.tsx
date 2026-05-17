// Pages: Tipos de Documento form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { tiposDocumentoConfig } from '@/config/modules/tipos-documento.config';
import tiposDocumentoService from '@/infrastructure/services/tipos-documento.service';
import type { TipoDocumento, TipoDocumentoFormData } from '@/domain/entities/tipos-documento';

interface TiposDocumentoFormProps {
  tipoDocumento?: TipoDocumento | null;
}

const initialTipoDocumentoData: TipoDocumentoFormData = {
  codigo: '',
  nombre: '',
  descripcion: '',
  genera_inventario: false,
  requiere_autorizacion: false,
  formato_numeracion: '',
  siguiente_numero: 1,
  activo: true,
};

export default function TiposDocumentoForm({ tipoDocumento }: TiposDocumentoFormProps) {
  const isEditing = !!tipoDocumento;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: tiposDocumentoService.indexUrl() },
      { title: 'Tipos de Documento', href: tiposDocumentoService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nuevo', href: '#' }
    ]}>
      <GenericFormContainer<TipoDocumento, TipoDocumentoFormData>
        entity={tipoDocumento}
        config={tiposDocumentoConfig}
        service={tiposDocumentoService}
        initialData={initialTipoDocumentoData}
      />
    </AppLayout>
  );
}
